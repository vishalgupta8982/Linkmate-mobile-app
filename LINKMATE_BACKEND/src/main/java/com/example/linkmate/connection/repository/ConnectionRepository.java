package com.example.linkmate.connection.repository;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.example.linkmate.connection.model.Connection;
import com.example.linkmate.connection.model.ConnectionStatus;

public interface ConnectionRepository extends MongoRepository<Connection,ObjectId> {
    @Query("{ '$or': [ { 'userId': ?0, 'status': ?1 }, { 'connectedUserId': ?0, 'status': ?1 } ] }")
    List<Connection> findByUserIdOrConnectedUserIdAndStatus(ObjectId userId, ConnectionStatus status);
    List<Connection> findByConnectedUserIdAndStatus(ObjectId connectedUserId, ConnectionStatus status);
    Connection findByUserIdAndConnectedUserId(ObjectId userId, ObjectId connectedUserId);
}
