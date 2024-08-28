package com.example.linkmate.comment.service;

import java.time.LocalDateTime;

import org.bson.types.ObjectId;
import org.checkerframework.checker.units.qual.s;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.example.linkmate.comment.model.Comment;
import com.example.linkmate.comment.model.CommentResponse;
import com.example.linkmate.comment.repository.CommentRepository;
import com.example.linkmate.post.model.Post;
import com.example.linkmate.post.model.PostUserDetail;
import com.example.linkmate.post.repository.PostRepository;
import com.example.linkmate.user.model.User;
import com.example.linkmate.user.repository.UserRepository;
import com.example.linkmate.user.utils.JwtUtil;

import java.util.*;
import java.util.stream.Collectors;
@Service
public class CommentService {
    

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    public CommentResponse addComment(String token,Comment comment){
        ObjectId userId=jwtUtil.getUserIdFromToken(token);
         User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        comment.setCreatedAt(LocalDateTime.now());
        comment.setUserId(userId);
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
        PostUserDetail commentUserDetail = new PostUserDetail();
        commentUserDetail.setUserId(userId);
        commentUserDetail.setProfilePicture(user.getProfilePicture());
        commentUserDetail.setFirstName(user.getFirstName());
        commentUserDetail.setLastName(user.getLastName());
        commentUserDetail.setHeadline(user.getHeadline());
        commentUserDetail.setUsername(user.getUsername());
        return new CommentResponse(savedComment, commentUserDetail);
    }

   public List<CommentResponse> getComment(ObjectId postId) {
    List<Comment> comments = commentRepository.findByPostId(postId, Sort.by(Sort.Direction.DESC, "createdAt"));
    Set<ObjectId> userIds = comments.stream()
        .map(Comment::getUserId)
        .collect(Collectors.toSet());
    List<User> users = userRepository.findAllById(userIds);
    Map<ObjectId, PostUserDetail> userDetailMap = users.stream()
        .collect(Collectors.toMap(
            User::getUserId,
            user -> {
                PostUserDetail userDetail = new PostUserDetail();
                userDetail.setUserId(user.getUserId());
                userDetail.setProfilePicture(user.getProfilePicture());
                userDetail.setFirstName(user.getFirstName());
                userDetail.setLastName(user.getLastName());
                userDetail.setHeadline(user.getHeadline());
                userDetail.setUsername(user.getUsername());
                return userDetail;
            }
        ));
    return comments.stream()
        .map(comment -> new CommentResponse(
            comment,
            userDetailMap.get(comment.getUserId())
        ))
        .collect(Collectors.toList());
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
    post.getComments().remove(commentId);
    postRepository.save(post);
    return"Comment deleted successfully";
    }
}
