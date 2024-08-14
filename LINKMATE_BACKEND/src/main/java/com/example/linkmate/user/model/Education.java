package com.example.linkmate.user.model;


import org.springframework.data.annotation.Id;

import lombok.*;

@Data
public class Education {
    @Id
    private String educationId;
    private String institution;
    private String degree;
    private String startDate;
    private String endDate;
    private String description;
    private String field;

}