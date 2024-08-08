package com.example.linkmate.user.dto;

import org.bson.types.ObjectId;

import lombok.Data;

@Data
public class UserUpdateDto {
    private ObjectId userId;
    private String headline;
}
