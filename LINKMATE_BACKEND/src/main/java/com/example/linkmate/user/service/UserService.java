package com.example.linkmate.user.service;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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
        Optional<User> foundUserOptional = userRepository.findByUsername(user.getUsername());
        if (foundUserOptional.isPresent()) {
            User foundUser = foundUserOptional.get();
            if (passwordEncoder.matches(user.getPassword(), foundUser.getPassword())) {
                String token = jwtUtil.generateToken(foundUser.getUsername());
                foundUser.setToken(token);
                return foundUser;
            }
        }
        throw new RuntimeException("Invalid username or password");
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

    public User updateUserDetails(ObjectId userId,UserUpdateDto userUpdateDto){
      User existingUser = getUserById(userId);
      if(existingUser == null){
    throw new RuntimeException("Invalid username or password");
      }
        existingUser.setHeadline(userUpdateDto.getHeadline());
        return userRepository.save(existingUser);
    }


}
