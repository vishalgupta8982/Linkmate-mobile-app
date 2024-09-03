package com.example.linkmate.notification.service;

import java.io.IOException;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import java.util.*;
import com.example.linkmate.fcmToken.repository.FcmTokenRepository;
import com.example.linkmate.fcmToken.service.FcmTokenService;
import com.example.linkmate.notification.model.Notification;
import com.example.linkmate.notification.model.NotificationType;
import com.example.linkmate.notification.repository.NotificationRepository;
import com.example.linkmate.user.model.User;
import com.example.linkmate.user.repository.UserRepository;
import com.example.linkmate.user.utils.JwtUtil;

@Service
public class NotificationService {

    @Autowired
    private FcmTokenService fcmTokenService;

    @Autowired
    private FcmTokenRepository fcmTokenRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private JwtUtil jwtUtil;

    public Notification createNotification(ObjectId userId,
            String userProfilePicture, String username, String post, NotificationType notificationType) {
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setUserProfilePicture(userProfilePicture != null ? userProfilePicture : null);
        notification.setUserName(username != null ? username : null);
        notification.setPost(post != null ? post : null);
        notification.setNotificationType(notificationType);
        return notificationRepository.save(notification);
    }

    public void markAllNotificationsAsRead(String token) {
        ObjectId userId = jwtUtil.getUserIdFromToken(token);
        List<Notification> notifications = notificationRepository.findByUserId(userId);
        notifications.forEach(notif -> {
            notif.setRead(true);
            notificationRepository.save(notif);
        });
    }

    public List<Notification> getAllNotifications(String token) {
        ObjectId userId = jwtUtil.getUserIdFromToken(token);
        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
        return notificationRepository.findByUserIdSortedByCreatedAt(userId, sort);
    }

    public void deleteNotification(ObjectId id) {
        notificationRepository.deleteById(id);
    }

    public void deleteNotificationByType(ObjectId userId, NotificationType notificationType, String userName) {
        String notificationTypeString = notificationType.name();
        List<Notification> notifications = notificationRepository.findByUserIdAndNotificationTypeAndUserName(userId,
                notificationTypeString, userName);
        if (!notifications.isEmpty()) {
            notificationRepository.deleteAll(notifications);
        }
    }

    public long countUnreadNotifications(String token) {
        ObjectId userId = jwtUtil.getUserIdFromToken(token);
        return notificationRepository.countByUserIdAndRead(userId, false);
    }

    @Async
    public void sendNotification(ObjectId notificationReciverId, ObjectId notificationSenderId, String body) {
        try {
            Optional<User> sender = userRepository.findById(notificationSenderId);
            if (sender.isPresent()) {
                fcmTokenRepository.findByUserId(notificationReciverId).ifPresent(fcmToken -> {
                    try {
                        fcmTokenService.sendNotification(
                                fcmToken.getFcmToken(),
                                sender.get().getFirstName() + " " + sender.get().getLastName(),
                                body,
                                sender.get().getProfilePicture());
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                });
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
