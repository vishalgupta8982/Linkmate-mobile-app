package com.example.linkmate.connection.controller;

import java.util.List;

import org.apache.http.HttpHeaders;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.linkmate.connection.model.Connection;
import com.example.linkmate.connection.service.ConnectionService;
import com.example.linkmate.user.model.User;
import com.example.linkmate.user.model.Views;
import com.fasterxml.jackson.annotation.JsonView;

@RestController
@RequestMapping("/users/connections/")
public class ConnectionController {
    
    @Autowired
    private ConnectionService connectionService;

    @PostMapping("/{connectedUserId}")
    public Connection sendConnectionRequest(@RequestHeader(HttpHeaders.AUTHORIZATION) String token,@PathVariable ObjectId connectedUserId) {
        return connectionService.sendConnectionRequest(token, connectedUserId);
    }

    @PostMapping("{connectedUserId}/accept")
    public Connection acceptConnectionRequest(@RequestHeader(HttpHeaders.AUTHORIZATION) String token,@PathVariable ObjectId connectedUserId){
        return connectionService.acceptConnectionRequest(token, connectedUserId);
    }

    @PostMapping("/{connectedUserId}/decline")
    public void declineConnectionRequest(@RequestHeader(HttpHeaders.AUTHORIZATION) String token, @PathVariable ObjectId connectedUserId) {
        connectionService.declineConnectionRequest(token, connectedUserId);
    }
@JsonView(Views.Search.class)
    @GetMapping("/my-connections")
    public List<User> getConnections(@RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
        return connectionService.getConnections(token);
    }

    @JsonView(Views.Search.class)
    @GetMapping("/received")
    public List<User> getReceivedConnectionRequests(@RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
        return connectionService.getReceivedConnectionRequests(token);
    }
}
