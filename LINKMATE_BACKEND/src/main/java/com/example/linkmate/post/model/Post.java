package com.example.linkmate.post.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.bson.types.ObjectId;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.IndexDirection;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import com.example.linkmate.comment.model.Comment;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

import lombok.Data;
@Document(collection = "posts")
@Data
public class Post {
    @Id
    @JsonSerialize(using= ToStringSerializer.class)
    private ObjectId postId;

    @Indexed
    @JsonSerialize(using = ToStringSerializer.class)
    private ObjectId userId;

    private String content;
    private String fileUrl;
    private String fileType;

    @Indexed(direction = IndexDirection.DESCENDING)   
    private LocalDateTime createdAt;
    @JsonSerialize(contentUsing = ToStringSerializer.class)
    private List<ObjectId> comments=new ArrayList<>();
    @JsonSerialize(contentUsing = ToStringSerializer.class)
    private List<ObjectId> likedBy= new ArrayList<>();
}
