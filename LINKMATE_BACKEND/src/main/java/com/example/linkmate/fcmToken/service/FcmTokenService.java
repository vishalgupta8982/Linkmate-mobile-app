package com.example.linkmate.fcmToken.service;

import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.linkmate.fcmToken.model.FcmToken;
import com.example.linkmate.fcmToken.repository.FcmTokenRepository;
import com.example.linkmate.user.repository.UserRepository;
import com.example.linkmate.user.utils.JwtUtil;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;

@Service
public class FcmTokenService {

    @Autowired
    private FcmTokenRepository fcmTokenRepository;

    @Autowired
    private JwtUtil jwtUtil;

    public String saveFcmToken(String token, String fcmToken) {
        ObjectId userId = jwtUtil.getUserIdFromToken(token);
        Optional<FcmToken> existingToken = fcmTokenRepository.findByUserId(userId);
        FcmToken fcm;
        if (existingToken.isPresent()) {
            fcm = existingToken.get();
            fcm.setFcmToken(fcmToken);
        } else {
            fcm = new FcmToken();
            fcm.setUserId(userId);
            fcm.setFcmToken(fcmToken);
        }
        fcmTokenRepository.save(fcm);
        return "Fcm token saved successfully";
    }

    public String deleteFcmToken(String token) {
        ObjectId userId = jwtUtil.getUserIdFromToken(token);
        Optional<FcmToken> existingToken = fcmTokenRepository.findByUserId(userId);
        if (existingToken.isPresent()) {
            fcmTokenRepository.delete(existingToken.get());
            return "Fcm token deleted successfully";
        } else {
            return "Fcm token not found";
        }
    }

    public void sendNotification(String token, String title, String body, String imageUrl) {
        try {
            Notification notification = Notification.builder()
                    .setTitle(title)
                    .setBody(body)
                    .setImage(imageUrl)
                    .build();
            Message message = Message.builder()
                    .setToken(token)
                    .setNotification(notification)
                    .build();
            // Message message = Message.builder()
            // .setToken(token)
            // .setNotification(notification)
            // .putData("largeIcon", largeIconUrl)
            // .putData("action1_title", action1Title)
            // .putData("action1_id", action1Id)
            // .putData("action2_title", action2Title)
            // .putData("action2_id", action2Id)
            // .build();

            String response = FirebaseMessaging.getInstance().send(message);
            System.out.println("Successfully sent message: " + response);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
