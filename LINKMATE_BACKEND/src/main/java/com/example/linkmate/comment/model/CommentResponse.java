package com.example.linkmate.comment.model;

 

import com.example.linkmate.post.model.PostUserDetail;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CommentResponse {

    private Comment comment;
    private PostUserDetail commentUserDetail;

}
