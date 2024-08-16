package com.example.linkmate.user.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import com.example.linkmate.user.model.User;

@Repository
public class UserRepositoryImpl implements UserRepositoryCustom {

    @Autowired
    private MongoTemplate mongoTemplate;

    @Override
    public List<User> searchUsers(String query, int limit) {
        Query searchQuery = new Query();
        searchQuery.addCriteria(
                new Criteria().orOperator(
                        Criteria.where("username").regex(query, "i"),
                        Criteria.where("firstName").regex(query, "i"),
                        Criteria.where("lastName").regex(query, "i"),
                        Criteria.where("headline").regex(query, "i"),
                        Criteria.where("location").regex(query, "i"),
                        Criteria.where("skills").regex(query, "i")));
                        searchQuery.fields().include("firstName").include("lastName").include("headline").include("profilePicture"); 
        searchQuery.limit(limit);
        searchQuery.with(Sort.by(Sort.Order.asc("username")));
        return mongoTemplate.find(searchQuery, User.class);
    }
}
