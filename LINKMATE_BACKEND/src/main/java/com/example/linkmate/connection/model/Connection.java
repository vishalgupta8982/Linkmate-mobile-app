package com.example.linkmate.connection.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "connections")
@NoArgsConstructor
@Data
public class Connection {

    @Id
    @JsonSerialize(using= ToStringSerializer.class)
    private ObjectId id;

    @JsonSerialize(using = ToStringSerializer.class)
    private ObjectId userId;

    @JsonSerialize(using = ToStringSerializer.class)
    private ObjectId connectedUserId;

    private ConnectionStatus status;

    
}
