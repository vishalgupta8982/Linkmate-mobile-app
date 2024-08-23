package com.example.linkmate.post.service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;

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

    public Post createPost(String content, String fileType, MultipartFile file, String token) {
        ObjectId userId = jwtUtil.getUserIdFromToken(token);
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Post post = new Post();
        post.setContent(content);
        post.setCreatedAt(LocalDateTime.now());
        post.setFileType(fileType);
        PostUserDetail userDetail=new PostUserDetail();
        userDetail.setUserId(userId);
        userDetail.setProfilePicture(user.getProfilePicture());
        userDetail.setFirstName(user.getFirstName());
        userDetail.setLastName(user.getLastName());
        userDetail.setHeadline(user.getHeadline());
        userDetail.setUsername(user.getUsername());
        post.setUserDetail(userDetail);
        if (file != null && !file.isEmpty()) {
            try {
                String fileUrl = cloudinaryService.uploadFile(file);
                post.setFileUrl(fileUrl);
            } catch (IOException e) {
                throw new RuntimeException("Invalid file");
            }
        }
        Post savedPost = postRepository.save(post);
        user.getPosts().add(savedPost.getPostId());
        userRepository.save(user);
        return savedPost;
    }

    public Optional<Post> findPost(ObjectId id) {
        return postRepository.findById(id);
    }

    public Page<Post> findPostByUserId(String token, int page, int size) {
        ObjectId userId = jwtUtil.getUserIdFromToken(token);
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return postRepository.findByUserDetail_UserId(userId, pageable);
    }

    public boolean deletePost(String token, ObjectId postId) {
        ObjectId userId = jwtUtil.getUserIdFromToken(token);
        Post post = postRepository.findByUserDetail_UserIdAndPostId(userId, postId);
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

    public Page<Post> getFeed(String token, int page, int size) {
        if (page < 0 || size <= 0) {
            throw new IllegalArgumentException("Page number must be non-negative and size must be positive.");
        }
        ObjectId userId = jwtUtil.getUserIdFromToken(token);
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        List<ObjectId> connections = user.getConnections();
        connections.add(userId);
        Page<Post> postsPage = postRepository.findByUserDetail_UserIdIn(connections, pageable);

        return postsPage;
    }
}
