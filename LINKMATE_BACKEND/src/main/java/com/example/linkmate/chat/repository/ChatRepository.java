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

    @Query(value = "{ $or: [ { senderId: ?0, receiverId: ?1 }, { senderId: ?1, receiverId: ?0 } ] }", sort = "{ 'createdAt': -1 }")
    List<Chat> findLatestMessageBetween(ObjectId senderId, ObjectId receiverId, Pageable pageable);

    long countByReceiverIdAndSenderIdAndIsRead(ObjectId userId,ObjectId connectedId,boolean isRead);

    @Query("{ $or: [ { 'senderId': ?0 }, { 'receiverId': ?0 } ] }")
    List<Chat> findBySenderIdOrReceiverId(ObjectId userId);
    
    long countByReceiverIdAndIsRead(ObjectId receiverId, boolean isRead);

}  
