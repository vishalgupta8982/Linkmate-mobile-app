package com.example.linkmate.chat.model;

import lombok.Data;

import org.bson.types.ObjectId;
import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

 
import java.util.Date;


@Data
public class AllInteractionDto {
     @JsonSerialize(using = ToStringSerializer.class)
    private ObjectId userId;
    private String username;
    private String firstName;
    private String lastName;
    private String profilePicture;
    private String headline;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private Date createdAt=new Date();
    private long numberOfUnreadMessage;
    private Chat lastMessage;
}
