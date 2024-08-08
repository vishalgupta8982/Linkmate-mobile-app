package com.example.linkmate.user.model;
import java.util.Date;
import lombok.*;

@Data
public class Education {
    private String institution;
    private String degree;
    private Date startDate;
    private Date endDate;
    private String description;

}