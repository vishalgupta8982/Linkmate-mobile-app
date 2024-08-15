package com.example.linkmate.user.model;

import java.util.ArrayList;

import org.springframework.data.annotation.Id;

import lombok.Data;
@Data
public class Project {
    @Id
    private String projectId;
    private String name;
    private String skills;
    private String startDate;
    private String endDate;
    private String description;
    private String link;
}
