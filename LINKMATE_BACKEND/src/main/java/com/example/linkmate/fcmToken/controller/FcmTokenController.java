package com.example.linkmate.fcmToken.controller;

import org.apache.http.HttpHeaders;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.linkmate.fcmToken.service.FcmTokenService;

@RestController
@RequestMapping("/api")
public class FcmTokenController {

    @Autowired
    private FcmTokenService fcmTokenService;

    @PostMapping("/save-fcmToken")
    public String storeFcmToken(@RequestHeader(HttpHeaders.AUTHORIZATION) String token, @RequestParam String fcmToken) {
        fcmTokenService.saveFcmToken(token, fcmToken);
        return "FCM Token stored successfully!";
    }
}
