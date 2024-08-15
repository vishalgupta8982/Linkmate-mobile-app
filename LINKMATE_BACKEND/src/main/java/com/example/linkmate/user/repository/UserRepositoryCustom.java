package com.example.linkmate.user.repository;
import java.util.*;

import com.example.linkmate.user.model.User;
public interface UserRepositoryCustom {
    List<User> searchUsers(String query, int limit);
}