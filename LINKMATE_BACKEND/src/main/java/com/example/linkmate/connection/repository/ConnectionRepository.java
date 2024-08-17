package com.example.linkmate.connection.repository;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.linkmate.connection.model.Connection;
import com.example.linkmate.connection.model.ConnectionStatus;

public interface ConnectionRepository extends MongoRepository<Connection,ObjectId> {
    List<Connection> findByUserIdOrConnectedUserIdAndStatus(ObjectId userId, ObjectId connectedUserId, ConnectionStatus status);
    List<Connection> findByConnectedUserId(ObjectId connectedUserId);
    Connection findByUserIdAndConnectedUserId(ObjectId userId, ObjectId connectedUserId);
}
