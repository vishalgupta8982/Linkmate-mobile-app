package com.example.linkmate.comment.repository;

import org.bson.types.ObjectId;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.linkmate.comment.model.Comment;

import java.util.List;

public interface CommentRepository extends MongoRepository<Comment, ObjectId> {
    List<Comment> findByPostId(ObjectId postId, Sort sort);
}
