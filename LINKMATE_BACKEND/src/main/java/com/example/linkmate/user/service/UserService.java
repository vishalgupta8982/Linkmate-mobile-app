package com.example.linkmate.user.service;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.linkmate.core.Exception.UserNotFoundException;
import com.example.linkmate.core.Exception.UsernameAlreadyExistsException;
import com.example.linkmate.user.dto.UserUpdateDto;
import com.example.linkmate.user.model.User;
import com.example.linkmate.user.repository.UserRepository;
import com.example.linkmate.user.utils.JwtUtil;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    

   
    public User registerUser(User user){
        user.setUsername(user.getUsername());
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setFirstName(user.getFirstName());
        user.setLastName(user.getLastName());
        user.setEmail(user.getEmail());
        User savedUser = userRepository.save(user);
        String token = jwtUtil.generateToken(savedUser.getUsername());
        savedUser.setToken(token);
        return savedUser;
    }

    public User authenticateUser(User user) {
        Optional<User> foundUserOptional = userRepository.findByEmail(user.getEmail());
        if (foundUserOptional.isPresent()) {
            User foundUser = foundUserOptional.get();
            if (passwordEncoder.matches(user.getPassword(), foundUser.getPassword())) {
                String token = jwtUtil.generateToken(foundUser.getUsername());
                foundUser.setToken(token);
                return foundUser;
            }
        }
        throw new RuntimeException("Invalid email or password");
    }

    public Optional<User> findByEmail(String email) {
    return userRepository.findByEmail(email);
}

public Optional<User> findByUserName(String username) {
    return userRepository.findByUsername(username);
}

public User getUserById(ObjectId userId) {
        return userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
    }

   public User updateUserDetails(String username, UserUpdateDto userUpdateDto) {
    // Retrieve the existing user
    User existingUser = findByUserName(username)
                          .orElseThrow(() -> new UsernameNotFoundException("User not found"));

    if (userUpdateDto.getUsername() != null) {
        if (findByUserName(userUpdateDto.getUsername()).isPresent()) {
            throw new UsernameAlreadyExistsException("Username '" + userUpdateDto.getUsername() + "' already exists.");
        }
        existingUser.setUsername(userUpdateDto.getUsername());
    }

    if (userUpdateDto.getEmail() != null) {
        existingUser.setEmail(userUpdateDto.getEmail());
    }

    if (userUpdateDto.getPassword() != null) {
        existingUser.setPassword(passwordEncoder.encode(userUpdateDto.getPassword()));
    }

    if (userUpdateDto.getFirstName() != null) {
        existingUser.setFirstName(userUpdateDto.getFirstName());
    }

    if (userUpdateDto.getLastName() != null) {
        existingUser.setLastName(userUpdateDto.getLastName());
    }

    if (userUpdateDto.getHeadline() != null) {
        existingUser.setHeadline(userUpdateDto.getHeadline());
    }

    if (userUpdateDto.getLocation() != null) {
        existingUser.setLocation(userUpdateDto.getLocation());
    }

    if (userUpdateDto.getProfilePicture() != null) {
        existingUser.setProfilePicture(userUpdateDto.getProfilePicture());
    }
    return userRepository.save(existingUser);
}



}
