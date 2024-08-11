package com.example.linkmate.user.dto;

import java.util.ArrayList;
import java.util.List;


import com.example.linkmate.user.model.Education;
import com.example.linkmate.user.model.Experience;

import lombok.Data;

@Data
public class UserUpdateDto {
    private String username;
    private String email;
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
    private List<String> skills = new ArrayList<>();
}
