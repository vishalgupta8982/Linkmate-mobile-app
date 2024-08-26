package com.example.linkmate.chat.repository;
import java.util.*;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.example.linkmate.chat.model.Chat;

public interface ChatRepository extends MongoRepository<Chat,ObjectId> {
    @Query(value = "{ $or: [ { 'senderId': ?0, 'receiverId': ?1 }, { 'senderId': ?1, 'receiverId': ?0 } ] }")
    Page<Chat> findChatHistory(ObjectId myUserId, ObjectId connectionUserId, Pageable pageable);

    @Query("{ $or: [ { 'senderId': ?0, 'receiverId': ?1, 'isRead': false }, { 'senderId': ?1, 'receiverId': ?0, 'isRead': false } ] }")
    List<Chat> findUnreadMessagesBetweenUsers(ObjectId myUserId, ObjectId connectionUserId);

    Optional<Chat> findFirstBySenderIdAndReceiverIdOrderByCreatedAtDesc(ObjectId senderId, ObjectId receiverId);

    Optional<Chat> findFirstByReceiverIdAndSenderIdOrderByCreatedAtDesc(ObjectId receiverId, ObjectId senderId);
    
}  
