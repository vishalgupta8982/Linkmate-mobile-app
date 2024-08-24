package com.example.linkmate.comment.model;

import org.bson.types.ObjectId;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.IndexDirection;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import com.example.linkmate.post.model.PostUserDetail;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

import lombok.Data;

import java.time.LocalDateTime;

@Data
@Document(collection = "comments")
public class Comment {

    @Id
    @JsonSerialize(using = ToStringSerializer.class)
    private ObjectId id;

     private PostUserDetail userDetail;
    private String content;

    @Indexed
    @JsonSerialize(using = ToStringSerializer.class)
    private ObjectId postId;

    @Indexed(direction = IndexDirection.DESCENDING)
    private LocalDateTime createdAt;

}