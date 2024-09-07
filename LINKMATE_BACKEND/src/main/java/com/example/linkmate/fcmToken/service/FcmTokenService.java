package com.example.linkmate.fcmToken.service;

import java.io.IOException;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.example.linkmate.fcmToken.model.FcmToken;
import com.example.linkmate.fcmToken.repository.FcmTokenRepository;
import com.example.linkmate.firebase.service.FirebaseAuthService;
import com.example.linkmate.user.utils.JwtUtil;

@Service
public class FcmTokenService {

    @Autowired
    private FcmTokenRepository fcmTokenRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private FirebaseAuthService firebaseAuthService;

    private static final String FIREBASE_URL = "https://fcm.googleapis.com/v1/projects/linkmate-87eab/messages:send";

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

    public void sendNotification(String token, String title, String body, String imageUrl,String type) throws IOException {
        String accessToken = firebaseAuthService.getAccessToken();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);
        headers.set("Content-Type", "application/json");
        String payload = "{"
                + "\"message\": {"
                + "\"token\": \"" + token + "\","
                + "\"data\": {"
                + "\"title\": \"" + title + "\","
                + "\"body\": \"" + body + "\","
                + "\"type\": \"" + type + "\","
                + "\"image\": \"" + imageUrl + "\","
                + "\"key1\": \"value1\","
                + "\"key2\": \"value2\""
                + "}"
                + "}"
                + "}";
        HttpEntity<String> requestEntity = new HttpEntity<>(payload, headers);

        // Send HTTP POST request
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.exchange(FIREBASE_URL, HttpMethod.POST, requestEntity,
                String.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            System.out.println("Successfully sent message: " + response.getBody());
        } else {
            System.err.println("Failed to send message: " + response.getStatusCode());
        }
    }
}