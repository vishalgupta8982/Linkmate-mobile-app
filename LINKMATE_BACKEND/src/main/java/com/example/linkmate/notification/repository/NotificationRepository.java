package com.example.linkmate.notification.repository;

import org.bson.types.ObjectId;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.*;
import com.example.linkmate.notification.model.Notification;
import com.example.linkmate.notification.model.NotificationType;

public interface NotificationRepository extends MongoRepository<Notification,ObjectId>{
    List<Notification> findByUserIdAndRead(ObjectId userId, boolean read);
    long countByUserIdAndRead(ObjectId userId, boolean read);
    List<Notification> findByUserId(ObjectId userId);
    
    @Query("{ 'userId': ?0 }")
    List<Notification> findByUserIdSortedByCreatedAt(ObjectId userId, Sort sort);
    
    @Query("{ 'userId': ?0, 'notificationType': ?1, 'userName': ?2 }")
    List<Notification> findByUserIdAndNotificationTypeAndUserName(ObjectId userId, String notificationType,
            String userName);

}
