package com.example.linkmate.chat.model;

import lombok.Data;

import org.bson.types.ObjectId;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

import java.time.LocalDateTime;


@Data
public class AllInteractionDto {
     @JsonSerialize(using = ToStringSerializer.class)
    private ObjectId userId;
    private String username;
    private String firstName;
    private String lastName;
    private String profilePicture;
    private String lastMessage;
    private LocalDateTime lastMessageDate;
}
