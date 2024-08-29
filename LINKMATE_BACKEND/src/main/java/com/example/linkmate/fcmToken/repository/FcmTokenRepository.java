package com.example.linkmate.fcmToken.repository;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.linkmate.fcmToken.model.FcmToken;

import java.util.Optional;

public interface FcmTokenRepository extends MongoRepository<FcmToken, String> {
    Optional<FcmToken> findByUserId(ObjectId userId);
}
