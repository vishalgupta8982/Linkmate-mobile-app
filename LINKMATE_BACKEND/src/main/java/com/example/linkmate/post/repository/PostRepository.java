package com.example.linkmate.post.repository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.*;
import com.example.linkmate.post.model.Post;

public interface PostRepository extends MongoRepository<Post, ObjectId> {
    List<Post> findByUserId(ObjectId userId);
    Post findByUserIdAndPostId(ObjectId userId, ObjectId postId);
}
