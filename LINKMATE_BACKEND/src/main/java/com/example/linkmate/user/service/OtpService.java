package com.example.linkmate.user.service;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.example.linkmate.user.model.User;

 
@Service
public class OtpService {
    
    @Autowired
    private JavaMailSender mailSender;

    private final Map<String,String> otpStore=new ConcurrentHashMap<>();
    private final int otpLength=4;

    public String generateOtp(String email,User user){
        String otp=generateRandomOtp();
        otpStore.put(email, otp);
        sendOtpEmail(email, otp);
        return otp;
    }
    private String generateRandomOtp(){
        Random random = new Random();
        StringBuilder otp = new StringBuilder();
        for (int i = 0; i < otpLength; i++) {
            otp.append(random.nextInt(10));
        }
        return otp.toString();
    }

     private void sendOtpEmail(String email, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Your OTP Code");
        message.setText("Your OTP code is: " + otp);
        mailSender.send(message);
    }

    public boolean verifyOtp(String email,String otp,User user){
        String storedOtp = otpStore.get(email);
        return otp != null && otp.equals(storedOtp);
    }


     


}
