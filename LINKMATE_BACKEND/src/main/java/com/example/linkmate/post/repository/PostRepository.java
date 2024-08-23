package com.example.linkmate.post.repository;

import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.*;
import com.example.linkmate.post.model.Post;

public interface PostRepository extends MongoRepository<Post, ObjectId> {
   Page<Post> findByUserDetail_UserId(ObjectId userId, Pageable pageable);

  Post findByUserDetail_UserIdAndPostId(ObjectId userId, ObjectId postId);

  Page<Post> findByUserDetail_UserIdIn(List<ObjectId> userIds, Pageable pageable);

  Page<Post> findAllByUserDetail_UserIdNotIn(List<ObjectId> userIds, Pageable pageable);
}
