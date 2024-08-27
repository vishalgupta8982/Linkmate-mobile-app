package com.example.linkmate.post.service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.linkmate.post.model.Post;
import com.example.linkmate.post.model.PostResponse;
import com.example.linkmate.post.model.PostUserDetail;
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

    public PostResponse createPost(String content, String fileType, MultipartFile file, String token) {
        ObjectId userId = jwtUtil.getUserIdFromToken(token);
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Post savedPost = new Post();
        savedPost.setContent(content);
        savedPost.setCreatedAt(LocalDateTime.now());
        savedPost.setFileType(fileType);
        savedPost.setUserId(userId);
        if (file != null && !file.isEmpty()) {
            try {
                String fileUrl = cloudinaryService.uploadFile(file);
                savedPost.setFileUrl(fileUrl);
            } catch (IOException e) {
                throw new RuntimeException("Invalid file");
            }
        }
        Post post = postRepository.save(savedPost);
        PostUserDetail postUserDetail = new PostUserDetail();
        postUserDetail.setUserId(userId);
        postUserDetail.setProfilePicture(user.getProfilePicture());
        postUserDetail.setFirstName(user.getFirstName());
        postUserDetail.setLastName(user.getLastName());
        postUserDetail.setHeadline(user.getHeadline());
        postUserDetail.setUsername(user.getUsername());
        user.getPosts().add(post.getPostId());
        userRepository.save(user);
        return new PostResponse(post, postUserDetail);
    }

    public Optional<Post> findPost(ObjectId id) {
        return postRepository.findById(id);
    }

    public Page<Post> findPostByUserId(String token, int page, int size) {
        ObjectId userId = jwtUtil.getUserIdFromToken(token);

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return postRepository.findByUserId(userId, pageable);
    }

    public boolean deletePost(String token, ObjectId postId) {
        ObjectId userId = jwtUtil.getUserIdFromToken(token);
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Post post = postRepository.findByUserIdAndPostId(userId, postId);
        if (post != null) {
            postRepository.delete(post);
            user.getPosts().remove(postId);
            userRepository.save(user);
            return true;
        }
        return false;
    }
    
    public List<PostUserDetail> getLikedPostUserDetail(String token, ObjectId postId) {
        ObjectId userId = jwtUtil.getUserIdFromToken(token);

        Optional<Post> postOptional = postRepository.findById(postId);
        if (!postOptional.isPresent()) {
            throw new RuntimeException("Post not found");
        }

        List<ObjectId> likedByUserIds = postOptional.get().getLikedBy();

        List<User> users = userRepository.findAllById(likedByUserIds);
        List<PostUserDetail> postUserDetails = users.stream().map(user -> {
            PostUserDetail detail = new PostUserDetail();
            detail.setUserId(user.getUserId());
            detail.setUsername(user.getUsername());
            detail.setProfilePicture(user.getProfilePicture());
            detail.setFirstName(user.getFirstName());
            detail.setLastName(user.getLastName());
            detail.setHeadline(user.getHeadline());
            return detail;
        }).collect(Collectors.toList());
        return postUserDetails;
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

    public Page<PostResponse> getFeed(String token, int page, int size) {
        if (page < 0 || size <= 0) {
            throw new IllegalArgumentException("Page number must be non-negative and size must be positive.");
        }
        ObjectId userId = jwtUtil.getUserIdFromToken(token);
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        List<ObjectId> connections = user.getConnections();
        connections.add(userId);

        Page<Post> postsPage = postRepository.findByUserIdIn(connections, pageable);

        // Transform Post to PostResponse with user details
        List<PostResponse> postResponses = postsPage.stream().map(post -> {
            User postUser = userRepository.findById(post.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            PostUserDetail postUserDetail = new PostUserDetail();
            postUserDetail.setUserId(post.getUserId());
            postUserDetail.setProfilePicture(postUser.getProfilePicture());
            postUserDetail.setFirstName(postUser.getFirstName());
            postUserDetail.setLastName(postUser.getLastName());
            postUserDetail.setHeadline(postUser.getHeadline());
            postUserDetail.setUsername(postUser.getUsername());

            return new PostResponse(post, postUserDetail);
        }).collect(Collectors.toList());

        return new PageImpl<>(postResponses, pageable, postsPage.getTotalElements());
    }

}
