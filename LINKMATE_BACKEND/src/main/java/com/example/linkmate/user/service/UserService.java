package com.example.linkmate.user.service;

import java.lang.StackWalker.Option;
import java.rmi.NotBoundException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.*;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.data.web.SpringDataWebProperties.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.cloudinary.Cloudinary;
import com.example.linkmate.core.Exception.NotFoundException;
import com.example.linkmate.core.Exception.UserNotFoundException;
import com.example.linkmate.core.Exception.UsernameAlreadyExistsException;
import com.example.linkmate.user.dto.UserUpdateDto;
import com.example.linkmate.user.model.Education;
import com.example.linkmate.user.model.Experience;
import com.example.linkmate.user.model.Project;
import com.example.linkmate.user.model.User;
import com.example.linkmate.user.repository.UserRepository;
import com.example.linkmate.user.repository.UserRepositoryImpl;
import com.example.linkmate.user.utils.JwtUtil;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserRepositoryImpl userRepositoryImpl;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private Cloudinary cloudinary;

    // service for register user
    public User registerUser(User user) {
        user.setUsername(user.getUsername());
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setFirstName(user.getFirstName());
        user.setLastName(user.getLastName());
        user.setEmail(user.getEmail());
        User savedUser = userRepository.save(user);
        String token = jwtUtil.generateToken(savedUser.getUsername(),savedUser.getUserId().toString());
        savedUser.setToken(token);
        userRepository.save(savedUser);
        return savedUser;
    }

    // service for authenticate user by otp
    public User authenticateUser(User user) {
        Optional<User> foundUserOptional = userRepository.findByEmail(user.getEmail());
        if (foundUserOptional.isPresent()) {
            User foundUser = foundUserOptional.get();
            if (passwordEncoder.matches(user.getPassword(), foundUser.getPassword())) {
                String token = jwtUtil.generateToken(foundUser.getUsername(),foundUser.getUserId().toString());
                foundUser.setToken(token);
                userRepository.save(foundUser);
                return foundUser;
            }
        }
        throw new RuntimeException("Invalid email or password");
    }

    // service for find user by email
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // service for find user by username
    public Optional<User> findByUserName(String username) {
        return userRepository.findByUsername(username);
    }
    // service for find user by id

    public Optional<User> getUserById(ObjectId userId) {
        return userRepository.findById(userId);
    }

    // service for update user detail
    public Object updateUserDetails(String username, UserUpdateDto userUpdateDto) {
        User existingUser = findByUserName(username)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        final boolean[] isUsernameUpdated = { false };
        Optional.ofNullable(userUpdateDto.getUsername()).ifPresent(newUsername -> {
            if (findByUserName(newUsername).isPresent()) {
                throw new UsernameAlreadyExistsException("Username '" + newUsername + "already exists.");
            }
            existingUser.setUsername(newUsername);
            isUsernameUpdated[0] = true;  
        });
        Optional.ofNullable(userUpdateDto.getEmail()).ifPresent(existingUser::setEmail);
        Optional.ofNullable(userUpdateDto.getPassword())
                .ifPresent(password -> existingUser.setPassword(passwordEncoder.encode(password)));
        Optional.ofNullable(userUpdateDto.getFirstName()).ifPresent(existingUser::setFirstName);
        Optional.ofNullable(userUpdateDto.getLastName()).ifPresent(existingUser::setLastName);
        Optional.ofNullable(userUpdateDto.getHeadline()).ifPresent(existingUser::setHeadline);
        Optional.ofNullable(userUpdateDto.getLocation()).ifPresent(existingUser::setLocation);
        Optional.ofNullable(userUpdateDto.getAbout()).ifPresent(existingUser::setAbout);
        userRepository.save(existingUser);
        if (isUsernameUpdated[0]) {
            String token = jwtUtil.generateToken(existingUser.getUsername(),existingUser.getUserId().toString());  
            return Map.of("token", token);  
        } else {
            return "User updated successfully"; 
        }
    }

    // service for update profile pic
    public User updateProfilePicture(String username, String profilePictureUrl) {
        Optional<User> optionalUser = userRepository.findByUsername(username);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setProfilePicture(profilePictureUrl);
            return userRepository.save(user);
        }
        return null;
    }

    // service for update education
    public User updateUserEducation(String username, List<Education> educations) {
        User existingUser = findByUserName(username)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        List<Education> existingEducations = existingUser.getEducations();
        for (Education education : educations) {
            if (education.getEducationId() == null) {
                // New education entry: generate a new ID and add it
                education.setEducationId(new ObjectId().toString());
                existingEducations.add(0, education);
            } else {
                // Existing education entry: find and update it
                Optional<Education> existingEducationOpt = existingEducations.stream()
                        .filter(e -> e.getEducationId().equals(education.getEducationId()))
                        .findFirst();

                if (existingEducationOpt.isPresent()) {
                    Education existingEducation = existingEducationOpt.get();
                    existingEducation.setInstitution(education.getInstitution());
                    existingEducation.setDegree(education.getDegree());
                    existingEducation.setDescription(education.getDescription());
                    existingEducation.setStartDate(education.getStartDate());
                    existingEducation.setEndDate(education.getEndDate());
                }
            }
        }

        existingUser.setEducations(existingEducations);
        return userRepository.save(existingUser);
    }

    // service for update experience
    public User updateUserExperience(String username, List<Experience> experiences) {
        User existingUser = findByUserName(username)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        List<Experience> existingExperiences = existingUser.getExperiences();

        for (Experience experience : experiences) {
            if (experience.getExperienceId() == null) {
                // New experience entry: generate a new ID and add it
                experience.setExperienceId(new ObjectId().toString());
                existingExperiences.add(0, experience);
            } else {
                // Existing experience entry: find and update it
                Optional<Experience> existingExperienceOpt = existingExperiences.stream()
                        .filter(e -> e.getExperienceId().equals(experience.getExperienceId()))
                        .findFirst();

                if (existingExperienceOpt.isPresent()) {
                    Experience existingExperience = existingExperienceOpt.get();
                    existingExperience.setCompany(experience.getCompany());
                    existingExperience.setPosition(experience.getPosition());
                    existingExperience.setDescription(experience.getDescription());
                    existingExperience.setStartDate(experience.getStartDate());
                    existingExperience.setEndDate(experience.getEndDate());
                } else {
                    throw new RuntimeException(
                            "Experience with ID " + experience.getExperienceId() + " not found.");
                }
            }
        }

        existingUser.setExperiences(existingExperiences);
        return userRepository.save(existingUser);
    }

    // service for update experience
    public User updateUserProjects(String username, List<Project> projects) {
        User existingUser = findByUserName(username)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        List<Project> existingProjects = existingUser.getProjects();

        for (Project project : projects) {
            if (project.getProjectId() == null) {
                // New experience entry: generate a new ID and add it
                project.setProjectId(new ObjectId().toString());
                existingProjects.add(0, project);
            } else {
                // Existing experience entry: find and update it
                Optional<Project> existingProjectOpt = existingProjects.stream()
                        .filter(e -> e.getProjectId().equals(project.getProjectId()))
                        .findFirst();

                if (existingProjectOpt.isPresent()) {
                    Project existingProject = existingProjectOpt.get();
                    existingProject.setName(project.getName());
                    existingProject.setSkills(project.getSkills());
                    existingProject.setDescription(project.getDescription());
                    existingProject.setStartDate(project.getStartDate());
                    existingProject.setEndDate(project.getEndDate());
                    existingProject.setLink(project.getLink());
                } else {
                    throw new RuntimeException(
                            "Project with ID " + project.getProjectId() + " not found.");
                }
            }
        }

        existingUser.setProjects(existingProjects);
        return userRepository.save(existingUser);
    }

    // service for update skills
    public User updateUserSkills(String username, List<String> newSkills) {
        User existingUser = findByUserName(username)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        List<String> currentSkills = existingUser.getSkills();
        if (currentSkills == null) {
            currentSkills = new ArrayList<>();
        }
        Set<String> skillsSet = new HashSet<>(currentSkills);
        skillsSet.addAll(newSkills);

        existingUser.setSkills(new ArrayList<>(skillsSet));
        return userRepository.save(existingUser);
    }

    // service for delete education
    public User deleteEducationById(String username, String educationId) {
        User existingUser = findByUserName(username)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        List<Education> educations = existingUser.getEducations();
        if (educations != null) {

            boolean educationRemoved = educations
                    .removeIf(education -> education.getEducationId().equals(educationId));

            if (!educationRemoved) {
                throw new NotFoundException("Education with ID " + educationId + " not found.");
            }
            existingUser.setEducations(educations);
            userRepository.save(existingUser);
            return existingUser;
        } else {
            throw new NotFoundException("Education with ID " + educationId + " not found.");
        }
    }

    // service for delete experience
    public User deleteExperienceById(String username, String experienceId) {
        User existingUser = findByUserName(username)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        List<Experience> experiences = existingUser.getExperiences();
        if (experiences != null) {
            boolean experienceRemoved = experiences
                    .removeIf(experience -> experience.getExperienceId().equals(experienceId));

            if (!experienceRemoved) {
                throw new NotFoundException("Experience with ID " + experienceId + " not found.");
            }

            existingUser.setExperiences(experiences);
            userRepository.save(existingUser);
            return existingUser;
        } else {
            throw new NotFoundException("Experience list is empty or not initialized.");
        }
    }
    // service for delete project
    public User deleteProjectById(String username, String projectId) {
        User existingUser = findByUserName(username)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        List<Project> projects = existingUser.getProjects();
        if (projects != null) {
            boolean projectRemoved = projects
                    .removeIf(experience -> experience.getProjectId().equals(projectId));

            if (!projectRemoved) {
                throw new NotFoundException("Experience with ID " + projectId + " not found.");
            }

            existingUser.setProjects(projects);
            userRepository.save(existingUser);
            return existingUser;
        } else {
            throw new NotFoundException("Project list is empty or not initialized.");
        }
    }

    // service for delete skills
    public User deleteSkillByName(String username, String skillName) {
        User existingUser = findByUserName(username)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        List<String> skills = existingUser.getSkills();
        if (skills != null) {
            if (skills.remove(skillName)) {
                existingUser.setSkills(skills);
                userRepository.save(existingUser);
                return existingUser;
            } else {
                throw new RuntimeException("Skill '" + skillName + "' not found.");
            }
        } else {
            throw new RuntimeException("Skill list is empty or not initialized.");
        }
    }
    
    public List<User> searchUsers(String query) {
        return userRepositoryImpl.searchUsers(query, 20);
    }

}
