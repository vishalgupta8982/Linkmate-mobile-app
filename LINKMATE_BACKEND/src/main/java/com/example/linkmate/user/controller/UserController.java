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
import com.example.linkmate.user.dto.UserUpdateDto;
import com.example.linkmate.user.model.User;
import com.example.linkmate.user.service.OtpService;
import com.example.linkmate.user.service.UserService;
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

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody User user) {
        Optional<User> existingUser = userService.findByEmail(user.getEmail());
    if (existingUser.isPresent()) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email already in use");
    }
        String otp = otpService.generateOtp(user.getEmail(),user);
        return ResponseEntity.ok("OTP sent to email");
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtpAndRegister(@RequestBody User user,@RequestParam String otp ) {
        boolean isOtpValid = otpService.verifyOtp(user.getEmail(), otp,user);

        if (!isOtpValid) {
            return ResponseEntity.status(400).body("Invalid OTP");
        }

        
        user.setUsername(user.getUsername());
        user.setEmail(user.getEmail());
        user.setPassword(user.getPassword());
        user.setFirstName(user.getFirstName());
        user.setLastName(user.getLastName());
        User registeredUser = userService.registerUser(user);
        return ResponseEntity.ok(registeredUser);
    }
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User user){
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
    public ResponseEntity<User> updateUser(@RequestHeader(HttpHeaders.AUTHORIZATION) String token,
            @RequestBody UserUpdateDto userUpdateDto) {
        try {
            String jwtToken = token.replace("Bearer ", "");
            String username = jwtUtil.getUserNameFromToken(jwtToken);
            Optional<User> userOptional = userService.findByUserName(username);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                User updatedUser = userService.updateUserDetails(user.getUserId(), userUpdateDto);
                return ResponseEntity.ok(updatedUser);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }
}
