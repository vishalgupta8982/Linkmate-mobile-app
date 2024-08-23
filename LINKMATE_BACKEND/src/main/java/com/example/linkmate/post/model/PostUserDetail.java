package com.example.linkmate.post.model;

import org.bson.types.ObjectId;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

import lombok.Data;

@Data
public class PostUserDetail {
    @JsonSerialize(using = ToStringSerializer.class)
    private ObjectId userId;
    private String profilePicture;
    private String firstName;
    private String lastName;
    private String headline;
    private String username;
}
