package com.example.linkmate.user.repository;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.example.linkmate.user.model.User;
import java.util.*;
public interface UserRepository extends MongoRepository<User, ObjectId> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
  @Query(value = "{ '_id': ?0 }", fields = "{ 'connections': 1 }")
List<ObjectId> findConnectionIdsByUserId(ObjectId userId);

}
