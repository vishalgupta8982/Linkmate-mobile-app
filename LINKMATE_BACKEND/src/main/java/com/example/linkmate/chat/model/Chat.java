package com.example.linkmate.chat.model;

import java.time.LocalDateTime;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

import lombok.Data;

@Data
@Document(collection = "chat_messages")
public class Chat {
    @Id
    @JsonSerialize(using = ToStringSerializer.class)
    private ObjectId messageId;

    @JsonSerialize(using = ToStringSerializer.class)
    private ObjectId senderId;

    @JsonSerialize(using = ToStringSerializer.class)
    private ObjectId receiverId;
    private String messageContent;
    private LocalDateTime createdAt;
    private boolean isRead;
    private MessageType messageType;
    private String status;
    @JsonSerialize(using = ToStringSerializer.class)
    private ObjectId replyToMessageId;
}
