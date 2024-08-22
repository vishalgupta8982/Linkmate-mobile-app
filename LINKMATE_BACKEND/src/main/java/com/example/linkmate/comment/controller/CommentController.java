package com.example.linkmate.comment.controller;

import org.apache.http.HttpHeaders;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.linkmate.comment.model.Comment;
import com.example.linkmate.comment.service.CommentService;

@RestController
@RequestMapping("/api/posts/comment")
public class CommentController {
    

    @Autowired
    private CommentService commentService;

    @PostMapping
    public ResponseEntity<Comment> addComment(@RequestHeader(HttpHeaders.AUTHORIZATION) String token,@RequestBody Comment comment){
        Comment addedComment = commentService.addComment(token,comment);
        return ResponseEntity.ok(addedComment);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteComment(@RequestHeader(HttpHeaders.AUTHORIZATION) String token,@RequestParam ObjectId postId,@RequestParam ObjectId  commentId){
    return new ResponseEntity<>(commentService.deleteComment(token, commentId, postId),HttpStatus.OK);
}

}