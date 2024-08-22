package com.example.linkmate.post.service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.linkmate.post.model.Post;
import com.example.linkmate.post.repository.PostRepository;
import com.example.linkmate.user.model.User;
import com.example.linkmate.user.repository.UserRepository;
import com.example.linkmate.user.service.CloudinaryService;
import com.example.linkmate.user.utils.JwtUtil;

@Service
public class PostsService {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

    @Autowired
    private UserRepository userRepository;

    public Post createPost(String content, String fileType, MultipartFile file, String token) {
        ObjectId userId = jwtUtil.getUserIdFromToken(token);
        Post post = new Post();
        post.setContent(content);
        post.setUserId(userId);
        post.setCreatedAt(LocalDateTime.now());
        post.setFileType(fileType);
        if (file != null && !file.isEmpty()) {
            try {
                String fileUrl = cloudinaryService.uploadFile(file);
                post.setFileUrl(fileUrl);
            } catch (IOException e) {
                throw new RuntimeException("Invalid file");
            }
        }
        Post savedPost = postRepository.save(post);
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        user.getPosts().add(savedPost.getPostId());
        userRepository.save(user);
        return savedPost;
    }

    public Optional<Post> findPost(ObjectId id) {
        return postRepository.findById(id);
    }

    public List<Post> findPostByUserId(String token) {
        ObjectId userId = jwtUtil.getUserIdFromToken(token);
        return postRepository.findByUserId(userId);
    }

    public boolean deletePost(String token, ObjectId postId) {
        ObjectId userId = jwtUtil.getUserIdFromToken(token);
        Post post = postRepository.findByUserIdAndPostId(userId, postId);
        if (post != null) {
            postRepository.delete(post);
            return true;
        }
        return false;
    }
    
    public String likePost(String token, ObjectId postId) {
        ObjectId userId = jwtUtil.getUserIdFromToken(token);
        Optional<Post> optionalPost = findPost(postId);

        if (!optionalPost.isPresent()) {
            return "Post not found";  
        }

        Post post = optionalPost.get();
        List<ObjectId> likedBy = post.getLikedBy();

        if (likedBy.contains(userId)) {
            likedBy.remove(userId);
        } else {
            likedBy.add(userId);
        }

        post.setLikedBy(likedBy);
        postRepository.save(post);

        return "Post updated successfully"; 
    }
}
