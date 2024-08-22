package com.example.linkmate.post.controller;

import java.util.List;
import java.util.Optional;

import org.apache.http.HttpHeaders;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.linkmate.post.model.Post;
import com.example.linkmate.post.service.PostsService;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostsService postsService;

    @PostMapping
    public ResponseEntity<Post> createPost(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String token,
            @RequestPart(value = "file", required = false) MultipartFile file,
            @RequestParam(required = false) String content, @RequestParam String fileType) {
        Post createdPost = postsService.createPost(content, fileType, file, token);
        return new ResponseEntity<>(createdPost, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Post> getPostById(@PathVariable ObjectId id) {
        Optional<Post> post = postsService.findPost(id);
        return post.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/userPosts")
    public ResponseEntity<List<Post>> getPostsByUserId(@RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
        List<Post> posts = postsService.findPostByUserId(token);
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{postId}")
    public ResponseEntity<String> deletePost(@RequestHeader(HttpHeaders.AUTHORIZATION) String token,
            @PathVariable ObjectId postId) {
        boolean isDeleted = postsService.deletePost(token, postId);
        if (isDeleted) {
            return new ResponseEntity<>("Post deleted successfully", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Post not found or not authorized to delete", HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/like/{postId}")
    public ResponseEntity<String> likePost(@RequestHeader(HttpHeaders.AUTHORIZATION) String token,@PathVariable ObjectId postId){
        return new ResponseEntity<>(postsService.likePost(token, postId),HttpStatus.OK);
    }
}
