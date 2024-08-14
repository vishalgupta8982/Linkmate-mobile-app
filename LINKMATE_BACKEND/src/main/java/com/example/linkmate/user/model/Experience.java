package com.example.linkmate.user.model;
import java.util.*;
import org.springframework.data.annotation.Id;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NonNull;

@Data
public class Experience {
    @Id
    private String experienceId;
    @NotNull(message = "Company name cannot be null")
    private String company;

    @NotNull(message = "Position cannot be null")
    private String position;

    @NotNull(message = "Start date cannot be null")
    private String startDate;

    @NotNull(message = "End date cannot be null")
    private String endDate;

    @NotNull(message = "Description cannot be null")
    private String description;

    @NotNull(message = "Employment type cannot be null")
    private EmploymentPreference employmentType;

    @NotNull(message = "Location type cannot be null")
    private WorkPreference locationType;

}

