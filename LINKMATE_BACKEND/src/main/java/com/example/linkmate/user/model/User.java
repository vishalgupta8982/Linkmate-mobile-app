package com.example.linkmate.user.model;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

import java.util.*;

@Data
@NoArgsConstructor
@Document(collection = "users")
public class User {
    @Id
    @Indexed(unique = true)
    private ObjectId userId;
    @Indexed(unique = true)
    private String username;
    private String email;
    @NonNull
    private String password;
    private String firstName;
    private String lastName;
    private String profilePicture;
    private String headline;
    private String location;
    private List<String> connections;
    private String about;
    private List<Experience> experiences;
    private List<Education> educations;
    private List<String> skills;
    private Date createdAt;
    private Date updatedAt;
    private String token;
}
