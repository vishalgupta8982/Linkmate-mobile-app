package com.example.linkmate.user.controller;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpHeaders;

import com.example.linkmate.core.Exception.NotFoundException;
import com.example.linkmate.core.Exception.UserNotFoundException;
import com.example.linkmate.core.Exception.UsernameAlreadyExistsException;
import com.example.linkmate.user.dto.UserUpdateDto;
import com.example.linkmate.user.model.Education;
import com.example.linkmate.user.model.Experience;
import com.example.linkmate.user.model.Project;
import com.example.linkmate.user.model.User;
import com.example.linkmate.user.model.Views;
import com.example.linkmate.user.service.CloudinaryService;
import com.example.linkmate.user.service.OtpService;
import com.example.linkmate.user.service.UserService;
import com.example.linkmate.user.utils.GenerateUniqueUserName;
import com.example.linkmate.user.utils.JwtUtil;
import com.fasterxml.jackson.annotation.JsonView;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private OtpService otpService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private GenerateUniqueUserName generateUniqueUserName;

    @Autowired
    private CloudinaryService cloudinaryService;

    // api for register user
    @JsonView(Views.Credential.class)
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody User user) {
        Optional<User> existingUser = userService.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email already exist");
        }
        String otp = otpService.generateOtp(user.getEmail(), user);
        return ResponseEntity.ok("OTP sent to email");
    }

    // api for verify otp
    @JsonView(Views.Credential.class)
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtpAndRegister(@RequestBody User user, @RequestParam String otp) {
        boolean isOtpValid = otpService.verifyOtp(user.getEmail(), otp, user);

        if (!isOtpValid) {
            return ResponseEntity.status(400).body("Invalid OTP");
        }
        String username = generateUniqueUserName.generateUniqueUsername(user.getFirstName(), user.getLastName());
        user.setUsername(username);
        user.setCreatedAt(new Date());
        User registeredUser = userService.registerUser(user);
        return ResponseEntity.ok(registeredUser);
    }

    // api for login
    @JsonView(Views.Credential.class)
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User user) {
        return ResponseEntity.ok(userService.authenticateUser(user));
    }

    // api for get user detail
    @JsonView(Views.Internal.class)
    @GetMapping("/user-details")
    public ResponseEntity<User> getCurrentUser(@RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
        try {
            String jwtToken = token.replace("Bearer ", "");
            String username = jwtUtil.getUserNameFromToken(jwtToken);
            Optional<User> userOptional = userService.findByUserName(username);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                user.setPassword(null);
                return ResponseEntity.ok(user);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    @JsonView(Views.Internal.class)
    @GetMapping("/search-user-details")
    public ResponseEntity<User> getSearchUserDetail(@RequestParam String username) {
        try {
            Optional<User> userOptional = userService.findByUserName(username);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                user.setPassword(null);
                return ResponseEntity.ok(user);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    // api for update user detail
    @PutMapping("/update")
    public ResponseEntity<?> updateUser(@RequestHeader(HttpHeaders.AUTHORIZATION) String token,
            @RequestBody UserUpdateDto userUpdateDto) {
        try {
            String jwtToken = token.replace("Bearer ", "");
            String currentUsername = jwtUtil.getUserNameFromToken(jwtToken);
            Object updatedUser = userService.updateUserDetails(currentUsername, userUpdateDto);
            return ResponseEntity.ok(updatedUser);
        } catch (UsernameAlreadyExistsException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username already exists");
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e);
        }
    }

    // api for update profile
    @JsonView(Views.Internal.class)
    @PutMapping("/update/profile")
    public ResponseEntity<?> updateProfilePicture(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String token,
            @RequestPart(value = "profilePicture", required = true) MultipartFile profilePicture) {
        try {
            String jwtToken = token.replace("Bearer ", "");
            String currentUsername = jwtUtil.getUserNameFromToken(jwtToken);
            if (currentUsername == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
            }
            String profilePictureUrl = cloudinaryService.uploadFile(profilePicture);
            if (profilePictureUrl == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to upload profile picture");
            }
            Object updatedUser = userService.updateProfilePicture(currentUsername, profilePictureUrl);
            if (updatedUser == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }

            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e);
        }
    }

    // api for update education
    @JsonView(Views.Internal.class)
    @PutMapping("/update/education")
    public ResponseEntity<?> updateEducation(@RequestHeader(HttpHeaders.AUTHORIZATION) String token,
            @RequestBody List<Education> educations) {
        try {
            String jwtToken = token.replace("Bearer ", "");
            String username = jwtUtil.getUserNameFromToken(jwtToken);

            if (username == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
            }

            String updatedUser = userService.updateUserEducation(username, educations);
            return ResponseEntity.ok(updatedUser);
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e);
        }
    }

    // api for update experience
    @JsonView(Views.Internal.class)
    @PutMapping("/update/experience")
    public ResponseEntity<?> updateExperience(@RequestHeader(HttpHeaders.AUTHORIZATION) String token,
            @Valid @RequestBody List<@Valid Experience> experiences) {
        try {
            String jwtToken = token.replace("Bearer ", "");
            String username = jwtUtil.getUserNameFromToken(jwtToken);

            if (username == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
            }

            String updatedUser = userService.updateUserExperience(username, experiences);
            return ResponseEntity.ok(updatedUser);
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e);
        }
    }

    // // api for update projects array
    @JsonView(Views.Internal.class)
    @PutMapping("/update/project")
    public ResponseEntity<?> updateProject(@RequestHeader(HttpHeaders.AUTHORIZATION) String token,
            @Valid @RequestBody List<@Valid Project> projects) {
        try {
            String jwtToken = token.replace("Bearer ", "");
            String username = jwtUtil.getUserNameFromToken(jwtToken);

            if (username == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
            }

            String updatedUser = userService.updateUserProjects(username, projects);
            return ResponseEntity.ok(updatedUser);
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e);
        }
    }

    // api for update skills
    @JsonView(Views.Internal.class)
    @PutMapping("/update/skills")
    public ResponseEntity<?> updateUserSkills(@RequestHeader(HttpHeaders.AUTHORIZATION) String token,
            @RequestBody List<String> skills) {
        try {
            String jwtToken = token.replace("Bearer ", "");
            String currentUsername = jwtUtil.getUserNameFromToken(jwtToken);

            String updatedUser = userService.updateUserSkills(currentUsername, skills);

            return ResponseEntity.ok(updatedUser);
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred");
        }
    }

    // api for delete education
    @JsonView(Views.Internal.class)
    @DeleteMapping("/delete/education")
    public ResponseEntity<?> deleteEducation(@RequestHeader(HttpHeaders.AUTHORIZATION) String token,
            @RequestParam String educationId) {
        try {
            String jwtToken = token.replace("Bearer ", "");
            String currentUsername = jwtUtil.getUserNameFromToken(jwtToken);

            User user = userService.deleteEducationById(currentUsername, educationId);
            return ResponseEntity.ok(user);
        } catch (UserNotFoundException | NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred");
        }
    }

    // api for delete experience
    @JsonView(Views.Internal.class)
    @DeleteMapping("/delete/experience")
    public ResponseEntity<?> deleteExperience(@RequestHeader(HttpHeaders.AUTHORIZATION) String token,
            @RequestParam String experienceId) {
        try {
            String jwtToken = token.replace("Bearer ", "");
            String currentUsername = jwtUtil.getUserNameFromToken(jwtToken);

            User user = userService.deleteExperienceById(currentUsername, experienceId);
            return ResponseEntity.ok(user);
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred");
        }
    }

    // api for delete project
    @JsonView(Views.Internal.class)
    @DeleteMapping("/delete/project")
    public ResponseEntity<?> deleteProject(@RequestHeader(HttpHeaders.AUTHORIZATION) String token,
            @RequestParam String projectId) {
        try {
            String jwtToken = token.replace("Bearer ", "");
            String currentUsername = jwtUtil.getUserNameFromToken(jwtToken);

            User user = userService.deleteProjectById(currentUsername, projectId);
            return ResponseEntity.ok(user);
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred");
        }
    }

    // api for delete skill
    @JsonView(Views.Internal.class)
    @DeleteMapping("/delete/skill")
    public ResponseEntity<?> deleteSkill(@RequestHeader(HttpHeaders.AUTHORIZATION) String token,
            @RequestParam String skill) {
        try {
            String jwtToken = token.replace("Bearer ", "");
            String currentUsername = jwtUtil.getUserNameFromToken(jwtToken);

            User user = userService.deleteSkillByName(currentUsername, skill);
            return ResponseEntity.ok(user);
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred");
        }
    }

    // search user
    @JsonView(Views.Search.class)
    @GetMapping("/search")
    public List<User> searchUsers(@RequestParam String query) {
        if (query == null || query.trim().isEmpty()) {
            return new ArrayList<>();
        }
        return userService.searchUsers(query);
    }

}
