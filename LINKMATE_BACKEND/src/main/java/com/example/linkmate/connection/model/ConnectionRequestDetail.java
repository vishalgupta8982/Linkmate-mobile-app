package com.example.linkmate.connection.model;

import org.bson.types.ObjectId;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Class to represent details of a connection request.
 */
@Data
@NoArgsConstructor
public class ConnectionRequestDetail {

    @JsonSerialize(using = ToStringSerializer.class)
    private ObjectId userId;  

    private String username;
    private String firstName;
    private String lastName;
    private String profilePicture;
    private String headline;

    
}
