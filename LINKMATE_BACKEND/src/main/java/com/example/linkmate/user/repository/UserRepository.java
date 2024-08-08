package com.example.linkmate.user.repository;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.example.linkmate.user.model.User;

public interface UserRepository extends MongoRepository<User, ObjectId> {
    User findByUsername(String username);

}
