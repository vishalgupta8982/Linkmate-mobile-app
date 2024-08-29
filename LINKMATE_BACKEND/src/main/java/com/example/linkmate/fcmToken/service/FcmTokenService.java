package com.example.linkmate.fcmToken.service;

import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.linkmate.fcmToken.model.FcmToken;
import com.example.linkmate.fcmToken.repository.FcmTokenRepository;
import com.example.linkmate.user.repository.UserRepository;
import com.example.linkmate.user.utils.JwtUtil;

@Service
public class FcmTokenService {
    

    @Autowired
    private FcmTokenRepository fcmTokenRepository;


    @Autowired
    private JwtUtil jwtUtil;


    public String saveFcmToken(String token, String fcmToken) {
        ObjectId userId=jwtUtil.getUserIdFromToken(token);
        Optional<FcmToken> existingToken = fcmTokenRepository.findByUserId(userId);
        FcmToken fcm;
        if (existingToken.isPresent()) {
            fcm = existingToken.get();
            fcm.setFcmToken(fcmToken);
        } else {
            fcm = new FcmToken();
            fcm.setUserId(userId);
            fcm.setFcmToken(token);
        }
        fcmTokenRepository.save(fcm);
        return "Fcm token saved successfully";
    }

}
