package com.example.linkmate.user.dto;

import org.bson.types.ObjectId;

import lombok.Data;

@Data
public class UserUpdateDto {
    private String username;
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private String headline;
    private String location;
    private String profilePicture;
}
