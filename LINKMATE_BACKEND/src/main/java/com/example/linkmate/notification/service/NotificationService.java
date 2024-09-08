package com.example.linkmate.notification.service;

import java.io.IOException;
import java.time.LocalDateTime;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import java.util.*;

import com.example.linkmate.chat.repository.ChatRepository;
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

    @Autowired
    private ChatRepository chatRepository;

    public Notification createNotification(ObjectId userId,
            String userProfilePicture, String username, String post, NotificationType notificationType) {
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setUserProfilePicture(userProfilePicture != null ? userProfilePicture : null);
        notification.setUserName(username != null ? username : null);
        notification.setPost(post != null ? post : null);
        notification.setNotificationType(notificationType);
        notification.setCreatedAt(LocalDateTime.now());
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

    public String deleteNotification(ObjectId id) {
        notificationRepository.deleteById(id);
        return "deleted successfully";
    }

    public void deleteNotificationByType(ObjectId userId, NotificationType notificationType, String userName) {
        String notificationTypeString = notificationType.name();
        List<Notification> notifications = notificationRepository.findByUserIdAndNotificationTypeAndUserName(userId,
                notificationTypeString, userName);
        if (!notifications.isEmpty()) {
            notificationRepository.deleteAll(notifications);
        }
    }

    public Map<String,Long> countUnreadNotifications(String token) {
        ObjectId userId = jwtUtil.getUserIdFromToken(token);
        Map<String,Long> count=new HashMap();
        count.put("unreadMessage",chatRepository.countByReceiverIdAndIsRead(userId, false));
         count.put("unreadNotification",notificationRepository.countByUserIdAndRead(userId, false));
         return count;
    }

    @Async
    public void sendNotification(ObjectId notificationReciverId, ObjectId notificationSenderId, String body,String type) {
        try {
            Optional<User> sender = userRepository.findById(notificationSenderId);
            if (sender.isPresent()) {
                fcmTokenRepository.findByUserId(notificationReciverId).ifPresent(fcmToken -> {
                    try {
                        fcmTokenService.sendNotification(
                                fcmToken.getFcmToken(),
                                sender.get().getFirstName() + " " + sender.get().getLastName(),
                                body,
                                sender.get().getProfilePicture(),type);
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
