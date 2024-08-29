package com.example.linkmate.chat.model;

import java.time.LocalDateTime;
import java.util.Date;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;

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

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private Date createdAt=new Date();

    private boolean isRead;

    private MessageType messageType;

    private String status;

    @JsonSerialize(using = ToStringSerializer.class)
    private ObjectId replyToMessageId;
}
