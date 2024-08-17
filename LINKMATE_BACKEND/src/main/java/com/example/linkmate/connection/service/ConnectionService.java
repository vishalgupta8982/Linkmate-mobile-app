package com.example.linkmate.connection.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.linkmate.connection.model.Connection;
import com.example.linkmate.connection.model.ConnectionStatus;
import com.example.linkmate.connection.repository.ConnectionRepository;
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

    // api for send connnection request
    public Connection sendConnectionRequest(String token, ObjectId connectedUserId) {
        ObjectId userId = jwtUtil.getUserIdFromToken(token);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Request Sender user not found"));
        User connectedUser = userRepository.findById(connectedUserId)
                .orElseThrow(() -> new RuntimeException("Request Receiver user not found"));
        Connection existingConnection = connectionRepository.findByUserIdAndConnectedUserId(userId, connectedUserId);
        if (existingConnection != null) {
            throw new RuntimeException("Connection request already sent");
        }

        Connection connection = new Connection();
        connection.setUserId(userId);
        connection.setConnectedUserId(connectedUserId);
        connection.setStatus(ConnectionStatus.PENDING);
        connectedUser.getConnectionsRequest().add(userId);  
        userRepository.save(connectedUser);  
        return connectionRepository.save(connection);
    }
    
    // api for accept connnection request
    public Connection acceptConnectionRequest(String token, ObjectId connectedUserId) {
        // Extract userId from the token
        ObjectId userId = jwtUtil.getUserIdFromToken(token);
  User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        User connectedUser = userRepository.findById(connectedUserId).orElseThrow(() -> new RuntimeException("Connected user not found"));

        Connection connection = connectionRepository.findByUserIdAndConnectedUserId(connectedUserId, userId);

        if (connection.getStatus() != ConnectionStatus.PENDING) {
            throw new RuntimeException("Connection request is not pending");
        }

        connection.setStatus(ConnectionStatus.ACCEPTED);
        connectionRepository.save(connection);

        user.getConnections().add(connectedUserId);
        user.getConnectionsRequest().remove(connectedUserId);
        connectedUser.getConnections().add(userId);
        userRepository.save(user);
        userRepository.save(connectedUser);
        
        return connection;
    }
    public String declineConnectionRequest(String token,ObjectId connectedUserId){
        ObjectId userId = jwtUtil.getUserIdFromToken(token);
         User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        User connectedUser = userRepository.findById(connectedUserId).orElseThrow(() -> new RuntimeException("Connected user not found"));

         Connection connection = connectionRepository.findByUserIdAndConnectedUserId(connectedUserId, userId);
          if (connection.getStatus() != ConnectionStatus.PENDING) {
            throw new RuntimeException("Connection request is not pending");
        }
          connection.setStatus(ConnectionStatus.REJECTED);
        connectionRepository.save(connection);

        user.getConnectionsRequest().remove(connectedUserId);
        userRepository.save(user);
        return "Request decline successfully";

}

public List<User> getConnections(String token) {
    ObjectId userId = jwtUtil.getUserIdFromToken(token);
    List<Connection> connections = connectionRepository.findByUserIdOrConnectedUserIdAndStatus(userId, userId,
            ConnectionStatus.ACCEPTED);
    return connections.stream()
            .map(connection -> {
                ObjectId otherUserId = connection.getUserId().equals(userId) ? connection.getConnectedUserId()
                        : connection.getUserId();
                return userService.getUserById(otherUserId);
            })
            .flatMap(Optional::stream)
            .collect(Collectors.toList());
}


    public List<User> getReceivedConnectionRequests(String token) {
        ObjectId userId = jwtUtil.getUserIdFromToken(token);
        List<Connection> connections = connectionRepository.findByConnectedUserId(userId);
        return connections.stream()
                .map(connection -> userService.getUserById(connection.getUserId()))
                .flatMap(Optional::stream)
                .collect(Collectors.toList());
    }
}
