package com.example.linkmate.user.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import org.springframework.data.annotation.Transient;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
 
@Data
@NoArgsConstructor
@Document(collection = "users")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class User {

    @Id
    private ObjectId userId;

    @Indexed(unique = true)
    private String username;

    private String email;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;
    private String firstName;
    private String lastName;
    private String profilePicture;
    private String headline;
    private String location;
    private String about;
     private List<String> connections = new ArrayList<>();
    private List<Experience> experiences = new ArrayList<>();
    private List<Education> educations = new ArrayList<>();
    private List<Project> projects = new ArrayList<>();
    private List<String> skills = new ArrayList<>();
    private Date createdAt;
    private Date updatedAt;
    private String token;
      
}
