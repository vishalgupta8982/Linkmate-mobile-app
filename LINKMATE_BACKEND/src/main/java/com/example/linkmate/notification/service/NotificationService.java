package com.example.linkmate.notification.service;

import java.io.IOException;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.example.linkmate.fcmToken.repository.FcmTokenRepository;
import com.example.linkmate.fcmToken.service.FcmTokenService;
import com.example.linkmate.user.model.User;
import com.example.linkmate.user.repository.UserRepository;

@Service
public class NotificationService {

    @Autowired
    private FcmTokenService fcmTokenService;

    @Autowired
    private FcmTokenRepository fcmTokenRepository;

    @Autowired
    private UserRepository userRepository;

    @Async
    public void sendNotification(ObjectId notificationReciverId, ObjectId notificationSenderId,String body) {
        try {
            Optional<User> sender = userRepository.findById(notificationSenderId);
            if (sender.isPresent()) {
                fcmTokenRepository.findByUserId(notificationReciverId).ifPresent(fcmToken -> {
                    try {
                        fcmTokenService.sendNotification(
                                fcmToken.getFcmToken(),
                                sender.get().getFirstName()+" "+ sender.get().getLastName(),
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
