package com.example.linkmate.notification.controller;
import java.util.*;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.apache.http.HttpHeaders;
import com.example.linkmate.notification.model.Notification;
import com.example.linkmate.notification.model.NotificationType;
import com.example.linkmate.notification.service.NotificationService;

@RestController
@RequestMapping("/api/notification")
public class NotificationController {
    

    @Autowired
    private NotificationService notificationService;

    @GetMapping
    public List<Notification> getNotifications(@RequestParam ObjectId userId) {
        return notificationService.getAllNotifications(userId);
    }

    @PutMapping("/read")
    public void markNotificationAsRead(@RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
        notificationService.markAllNotificationsAsRead(token);
    }
    @DeleteMapping("/{id}")
    public void deleteNotification(@PathVariable ObjectId id) {
        notificationService.deleteNotification(id);
    }
    @GetMapping("/count/unread")
    public long countUnreadNotifications(@RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
        return notificationService.countUnreadNotifications(token);
    }
}
