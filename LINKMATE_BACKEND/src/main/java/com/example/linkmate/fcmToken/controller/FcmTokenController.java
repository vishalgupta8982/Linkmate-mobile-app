package com.example.linkmate.fcmToken.controller;

import org.apache.http.HttpHeaders;
 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.linkmate.fcmToken.service.FcmTokenService;

@RestController
@RequestMapping("/api/fcmToken")
public class FcmTokenController {

    @Autowired
    private FcmTokenService fcmTokenService;

    @PostMapping("/save")
    public ResponseEntity<String> storeFcmToken(@RequestHeader(HttpHeaders.AUTHORIZATION) String token, @RequestParam String fcmToken) {
        return new ResponseEntity<>(fcmTokenService.saveFcmToken(token, fcmToken),HttpStatus.OK);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteToken(@RequestHeader(HttpHeaders.AUTHORIZATION) String token){
        return new ResponseEntity<>(fcmTokenService.deleteFcmToken(token), HttpStatus.OK);
    }
}
