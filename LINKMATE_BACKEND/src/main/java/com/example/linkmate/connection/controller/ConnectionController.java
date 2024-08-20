package com.example.linkmate.connection.controller;

import java.util.List;
import java.util.concurrent.ExecutionException;

import org.apache.http.HttpHeaders;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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
    public Connection sendConnectionRequest(@RequestHeader(HttpHeaders.AUTHORIZATION) String token,
            @PathVariable ObjectId connectedUserId) {
        return connectionService.sendConnectionRequest(token, connectedUserId);
    }

    @PostMapping("{connectedUserId}/accept")
    public Connection acceptConnectionRequest(@RequestHeader(HttpHeaders.AUTHORIZATION) String token,
            @PathVariable ObjectId connectedUserId) {
        return connectionService.acceptConnectionRequest(token, connectedUserId);
    }

    @PostMapping("/{connectedUserId}/decline")
    public String declineConnectionRequest(@RequestHeader(HttpHeaders.AUTHORIZATION) String token,
            @PathVariable ObjectId connectedUserId) {
        return connectionService.declineConnectionRequest(token, connectedUserId);
    }

    @PostMapping("/{revokerUserId}/cancel")
    public String cancelConnectionRequest(@RequestHeader(HttpHeaders.AUTHORIZATION) String token,
            @PathVariable ObjectId revokerUserId) {
        return connectionService.cancelConnectionRequest(token, revokerUserId);
    }

    @PostMapping("/{connectedUserId}/remove")
    public String removeConnection(@RequestHeader(HttpHeaders.AUTHORIZATION) String token,
            @PathVariable ObjectId connectedUserId) {
        return connectionService.removeConnection(token, connectedUserId);
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
