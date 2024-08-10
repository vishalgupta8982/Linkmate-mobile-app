package com.example.linkmate.user.controller;

import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpHeaders;

import com.example.linkmate.core.Exception.UserNotFoundException;
import com.example.linkmate.core.Exception.UsernameAlreadyExistsException;
import com.example.linkmate.user.dto.UserUpdateDto;
import com.example.linkmate.user.model.User;
import com.example.linkmate.user.service.OtpService;
import com.example.linkmate.user.service.UserService;
import com.example.linkmate.user.utils.GenerateUniqueUserName;
import com.example.linkmate.user.utils.JwtUtil;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private OtpService otpService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private GenerateUniqueUserName generateUniqueUserName;

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody User user) {
        Optional<User> existingUser = userService.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email already exist");
        }
        String otp = otpService.generateOtp(user.getEmail(), user);
        return ResponseEntity.ok("OTP sent to email");
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtpAndRegister(@RequestBody User user, @RequestParam String otp) {
        boolean isOtpValid = otpService.verifyOtp(user.getEmail(), otp, user);

        if (!isOtpValid) {
            return ResponseEntity.status(400).body("Invalid OTP");
        }
        String username = generateUniqueUserName.generateUniqueUsername(user.getFirstName(), user.getLastName());
        user.setUsername(username);
        User registeredUser = userService.registerUser(user);
        return ResponseEntity.ok(registeredUser);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User user) {
        return ResponseEntity.ok(userService.authenticateUser(user));
    }

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

    @PutMapping("/update")
    public ResponseEntity<?> updateUser(@RequestHeader(HttpHeaders.AUTHORIZATION) String token,
            @RequestBody UserUpdateDto userUpdateDto) {
        try {
            // Extract the JWT token and username from it
            String jwtToken = token.replace("Bearer ", "");
            String currentUsername = jwtUtil.getUserNameFromToken(jwtToken);

            // Update user details
            User updatedUser = userService.updateUserDetails(currentUsername, userUpdateDto);
            if (!currentUsername.equals(updatedUser.getUsername())) {
                String newToken = jwtUtil.generateToken(updatedUser.getUsername());
                updatedUser.setToken(newToken);
            }

            return ResponseEntity.ok(updatedUser);
        } catch (UsernameAlreadyExistsException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username already exists");
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred");
        }
    }

}
