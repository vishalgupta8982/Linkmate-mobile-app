package com.example.linkmate.connection.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import com.example.linkmate.config.MyConnectionRequestWebSocketHandler;
import com.example.linkmate.connection.model.Connection;
import com.example.linkmate.connection.model.ConnectionRequestDetail;
import com.example.linkmate.connection.model.ConnectionStatus;
import com.example.linkmate.connection.repository.ConnectionRepository;
import com.example.linkmate.notification.model.NotificationType;
import com.example.linkmate.notification.service.NotificationService;
import com.example.linkmate.user.model.User;
import com.example.linkmate.user.repository.UserRepository;
import com.example.linkmate.user.service.UserService;
import com.example.linkmate.user.utils.JwtUtil;

@Service
public class ConnectionService {

        @Autowired
        private ConnectionRepository connectionRepository;

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private UserService userService;

        @Autowired
        private JwtUtil jwtUtil;

        @Autowired
        private NotificationService notificationService;

        @Autowired
        @Lazy
        private MyConnectionRequestWebSocketHandler myConnectionRequestWebSocketHandler;

        // api for send connnection request
        public Connection sendConnectionRequest(String token, ObjectId connectedUserId) {
                ObjectId userId = jwtUtil.getUserIdFromToken(token);
                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new RuntimeException("Request Sender user not found"));
                User connectedUser = userRepository.findById(connectedUserId)
                                .orElseThrow(() -> new RuntimeException("Request Receiver user not found"));
                Connection existingConnection = connectionRepository.findByUserIdAndConnectedUserIdAndStatus(userId,
                                connectedUserId,
                                ConnectionStatus.ACCEPTED);
                Connection pendingConnection = connectionRepository.findByUserIdAndConnectedUserIdAndStatus(userId,
                                connectedUserId,
                                ConnectionStatus.PENDING);
                if (existingConnection != null) {
                        throw new RuntimeException("Connected already");
                }
                if (pendingConnection != null) {
                        throw new RuntimeException("Connected request already sent");
                }

                Connection connection = new Connection();
                connection.setUserId(userId);
                connection.setConnectedUserId(connectedUserId);
                connection.setStatus(ConnectionStatus.PENDING);
                connectedUser.getConnectionsRequest().add(userId);
                user.getSendConnectionsRequest().add(connectedUserId);
                userRepository.save(user);
                userRepository.save(connectedUser);
                ConnectionRequestDetail detail = new ConnectionRequestDetail();
                detail.setFirstName(user.getFirstName());
                detail.setLastName(user.getLastName());
                detail.setHeadline(user.getHeadline());
                detail.setUsername(user.getUsername());
                detail.setUserId(userId);
                detail.setProfilePicture(user.getProfilePicture());
                myConnectionRequestWebSocketHandler.sendConnectionRequestUpdate(
                                connectedUser.getToken(),
                                detail);
                notificationService.sendNotification(connectedUserId, userId, "Sent you a connection request");
                return connectionRepository.save(connection);
        }

        public Connection acceptConnectionRequest(String token, ObjectId connectedUserId) {
                ObjectId userId = jwtUtil.getUserIdFromToken(token);
                User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
                User connectedUser = userRepository.findById(connectedUserId)
                                .orElseThrow(() -> new RuntimeException("Connected user not found"));

                Connection connection = connectionRepository.findByUserIdAndConnectedUserIdAndStatus(connectedUserId,
                                userId,
                                ConnectionStatus.PENDING);

                if (connection.getStatus() != ConnectionStatus.PENDING) {
                        throw new RuntimeException("Connection request is not pending");
                }
                connection.setStatus(ConnectionStatus.ACCEPTED);
                connectionRepository.save(connection);
                user.getConnections().add(connectedUserId);
                user.getConnectionsRequest().remove(connectedUserId);
                connectedUser.getSendConnectionsRequest().remove(userId);
                connectedUser.getConnections().add(userId);
                userRepository.save(user);
                userRepository.save(connectedUser);
                notificationService.createNotification(connectedUserId,user.getProfilePicture(),user.getUsername(),null,NotificationType.CONNECTED);
                notificationService.sendNotification(connectedUserId, userId, "Accepted your invite");
                return connection;
        }

        public String declineConnectionRequest(String token, ObjectId connectedUserId) {
                ObjectId userId = jwtUtil.getUserIdFromToken(token);
                User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
                User connectedUser = userRepository.findById(connectedUserId)
                                .orElseThrow(() -> new RuntimeException("Connected user not found"));

                Connection connection = connectionRepository.findByUserIdAndConnectedUserIdAndStatus(connectedUserId,
                                userId,
                                ConnectionStatus.PENDING);
                if (connection.getStatus() != ConnectionStatus.PENDING) {
                        throw new RuntimeException("Connection request is not pending");
                }
                connection.setStatus(ConnectionStatus.REJECTED);
                connectionRepository.save(connection);
                user.getConnectionsRequest().remove(connectedUserId);
                connectedUser.getSendConnectionsRequest().remove(userId);
                userRepository.save(connectedUser);
                userRepository.save(user);
                return "Request decline successfully";
        }

        public String cancelConnectionRequest(String token, ObjectId connectedUserId) {
                ObjectId userId = jwtUtil.getUserIdFromToken(token);
                User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
                User connectedUser = userRepository.findById(
                                connectedUserId)
                                .orElseThrow(() -> new RuntimeException("revoker user not found"));

                Connection connection = connectionRepository.findByUserIdAndConnectedUserIdAndStatus(userId,
                                connectedUserId,
                                ConnectionStatus.PENDING);
                if (connection.getStatus() != ConnectionStatus.PENDING) {
                        throw new RuntimeException("Connection request is not pending");
                }
                connectionRepository.delete(connection);
                connectedUser.getConnectionsRequest().remove(userId);
                user.getSendConnectionsRequest().remove(connectedUserId);
                userRepository.save(connectedUser);
                userRepository.save(user);

                return "Connection request cancel sucessfully";
        }

        public String removeConnection(String token, ObjectId connectedUserId) {
                ObjectId userId = jwtUtil.getUserIdFromToken(token);
                User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
                User connectedUser = userRepository.findById(connectedUserId)
                                .orElseThrow(() -> new RuntimeException("Connected user not found"));

                Connection connection = connectionRepository.findByUserIdAndConnectedUserIdAndStatus(connectedUserId,
                                userId,
                                ConnectionStatus.ACCEPTED);
                if (connection.getStatus() != ConnectionStatus.ACCEPTED) {
                        throw new RuntimeException("You are not connected");
                }
                connectionRepository.delete(connection);

                user.getConnections().remove(connectedUserId);
                connectedUser.getConnections().remove(userId);
                userRepository.save(user);
                userRepository.save(connectedUser);
                notificationService.deleteNotificationByType(userId,NotificationType.CONNECTED,connectedUser.getUsername() );
                notificationService.deleteNotificationByType(
                                connectedUserId,NotificationType.CONNECTED, user.getUsername() );
                return "Connection removed successfully";
        }

        public List<User> getConnections(ObjectId userId) {
                List<Connection> connections = connectionRepository.findByUserIdOrConnectedUserIdAndStatus(userId,
                                ConnectionStatus.ACCEPTED);
                return connections.stream()
                                .map(connection -> {
                                        ObjectId otherUserId = connection.getUserId().equals(userId)
                                                        ? connection.getConnectedUserId()
                                                        : connection.getUserId();
                                        return userService.getUserById(otherUserId);
                                })
                                .flatMap(Optional::stream)
                                .collect(Collectors.toList());
        }

        public List<User> getReceivedConnectionRequests(String token) {
                ObjectId userId = jwtUtil.getUserIdFromToken(token);
                List<Connection> connections = connectionRepository.findByConnectedUserIdAndStatus(userId,
                                ConnectionStatus.PENDING);
                return connections.stream()
                                .map(connection -> userService.getUserById(connection.getUserId()))
                                .flatMap(Optional::stream)
                                .collect(Collectors.toList());
        }
}