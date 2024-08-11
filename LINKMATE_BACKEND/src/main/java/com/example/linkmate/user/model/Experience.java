package com.example.linkmate.user.model;
import java.util.*;
import org.springframework.data.annotation.Id;

import lombok.Data;

@Data
public class Experience {
    @Id
    private String experienceId;
    private String company;
    private String position;
    private String startDate;
    private String endDate;
    private String description;

}