package com.example.linkmate.comment.service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.checkerframework.checker.units.qual.s;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.example.linkmate.comment.model.Comment;
import com.example.linkmate.comment.repository.CommentRepository;
import com.example.linkmate.post.model.Post;
import com.example.linkmate.post.repository.PostRepository;
import com.example.linkmate.user.utils.JwtUtil;

@Service
public class CommentService {
    

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PostRepository postRepository;

    public Comment addComment(String token,Comment comment){
        ObjectId userId=jwtUtil.getUserIdFromToken(token);
        comment.setUserId(userId);
        comment.setCreatedAt(LocalDateTime.now());
        Comment savedComment = commentRepository.save(comment);
        ObjectId commentId = savedComment.getId();
        Optional<Post> postOptional=postRepository.findById(savedComment.getPostId());
        if(postOptional.isPresent()){
            Post post=postOptional.get();
            post.getComments().add(commentId);
            postRepository.save(post);
        }
        else {
            throw new RuntimeException("Post not found");
        }
        return savedComment;
    }

    public String deleteComment(String token,ObjectId commentId,ObjectId postId){
        ObjectId userId = jwtUtil.getUserIdFromToken(token);
    Optional<Comment> optionalComment = commentRepository.findById(commentId);
    Optional<Post> optionalPost = postRepository.findById(postId);
    if (!optionalPost.isPresent()) {
        return"Post not found";
    }
    Post post = optionalPost.get();
    if (!optionalComment.isPresent()) {
        return "Comment not found";
    }

    Comment comment = optionalComment.get();
    if (!comment.getUserId().equals(userId) && !post.getUserId().equals(userId)) {
        return "Not authorized to delete this comment";
    }
    commentRepository.deleteById(commentId);

    return"Comment deleted successfully";
    }
}
