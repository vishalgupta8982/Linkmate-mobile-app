package com.example.linkmate.user.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import com.fasterxml.jackson.annotation.JsonView;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
 
@Data
@NoArgsConstructor
@Document(collection = "users")
public class User {

    @Id
    @JsonView(Views.Public.class)
  @JsonSerialize(using= ToStringSerializer.class)
    private ObjectId userId;

    @JsonView(Views.Public.class)
    @Indexed(unique = true)
    private String username;
    
    @JsonView(Views.Credential.class)
    private String email;

    @JsonView(Views.Credential.class)
    private String password;

    @JsonView(Views.Public.class)
    private String firstName;

    @JsonView(Views.Public.class)
    private String lastName;

    @JsonView(Views.Search.class)
    private String profilePicture;

    @JsonView(Views.Search.class)
    private String headline;

    @JsonView(Views.Internal.class)
    private String location;

    @JsonView(Views.Internal.class)
    private String about;

    @JsonView(Views.Internal.class)
    @JsonSerialize(contentUsing = ToStringSerializer.class)
    private List<ObjectId> connections = new ArrayList<>();
     

    @JsonView(Views.Credential.class)
    @JsonSerialize(contentUsing = ToStringSerializer.class)
     private List<ObjectId> connectionsRequest = new ArrayList<>();

    @JsonView(Views.Credential.class)
    @JsonSerialize(contentUsing = ToStringSerializer.class)
     private List<ObjectId> sendConnectionsRequest = new ArrayList<>();

     @JsonView(Views.Internal.class)
    private List<Experience> experiences = new ArrayList<>();

    @JsonView(Views.Internal.class)
    private List<Education> educations = new ArrayList<>();

    @JsonView(Views.Internal.class)
    private List<Project> projects = new ArrayList<>();

    @JsonView(Views.Internal.class)
    private List<String> skills = new ArrayList<>();

    @JsonView(Views.Internal.class)
    private Date createdAt;

    @JsonView(Views.Credential.class)
    private String token;
      
}
