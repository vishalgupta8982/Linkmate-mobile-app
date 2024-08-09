package com.example.linkmate.user.utils;

import java.beans.JavaBean;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.linkmate.user.repository.UserRepository;
import com.example.linkmate.user.service.UserService;
@Service
public class GenerateUniqueUserName {

    @Autowired
    private UserService userService;

     public String generateUniqueUsername(String firstName, String lastName) {
        String baseUsername = firstName.toLowerCase() + "" + lastName.toLowerCase();
        String username = baseUsername;
        int counter = 1;

        while (userService.findByUserName(username).isPresent()) {
            username = baseUsername + counter;
            counter++;
        }

        return username;
    }
}
