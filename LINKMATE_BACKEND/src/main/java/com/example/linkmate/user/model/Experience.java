package com.example.linkmate.user.model;
import java.util.*;
import lombok.Data;

@Data
public class Experience {
    private String company;
    private String position;
    private Date startDate;
    private Date endDate;
    private String description;

}