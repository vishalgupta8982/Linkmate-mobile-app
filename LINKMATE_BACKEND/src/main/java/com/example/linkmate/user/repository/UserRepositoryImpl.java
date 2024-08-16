package com.example.linkmate.user.repository;

import java.util.ArrayList;
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
    String[] terms = query.split("\\s+or\\s+");
    List<Criteria> criteriaList = new ArrayList<>();
    for (String term : terms) {
        String trimmedTerm = term.trim();
        if (!trimmedTerm.isEmpty()) {
            Criteria termCriteria = new Criteria().orOperator(
                    Criteria.where("username").regex(trimmedTerm, "i"),
                    Criteria.where("firstName").regex(trimmedTerm, "i"),
                    Criteria.where("lastName").regex(trimmedTerm, "i"),
                    Criteria.where("headline").regex(trimmedTerm, "i"),
                    Criteria.where("location").regex(trimmedTerm, "i"),
                    Criteria.where("skills").regex(trimmedTerm, "i")
            );
            criteriaList.add(termCriteria);
        }
    }
    Criteria combinedCriteria = new Criteria().orOperator(criteriaList.toArray(new Criteria[0]));
    Query searchQuery = new Query(combinedCriteria);
    searchQuery.fields().include("firstName").include("lastName").include("headline").include("profilePicture").include("username");
    searchQuery.limit(limit);
    searchQuery.with(Sort.by(Sort.Order.asc("username")));
    
    return mongoTemplate.find(searchQuery, User.class);
}
}
