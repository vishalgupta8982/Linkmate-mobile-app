 package com.example.linkmate.post.model;

import org.springframework.data.domain.Page;

import com.example.linkmate.post.model.PostUserDetail;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PostResponse {

    private Post post;
    private PostUserDetail postUserDetail;

}
