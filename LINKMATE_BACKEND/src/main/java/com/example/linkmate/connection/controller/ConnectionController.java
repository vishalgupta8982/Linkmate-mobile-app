package com.example.linkmate.connection.controller;

import java.util.List;
import java.util.concurrent.ExecutionException;

import org.apache.http.HttpHeaders;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
@RequestMapping("/api/connections/")
public class ConnectionController {

    @Autowired
    private ConnectionService connectionService;

    @PostMapping("/{connectedUserId}")
    public ResponseEntity<Connection> sendConnectionRequest(@RequestHeader(HttpHeaders.AUTHORIZATION) String token,
            @PathVariable ObjectId connectedUserId) {
        Connection connection= connectionService.sendConnectionRequest(token, connectedUserId);
        return new ResponseEntity<>(connection,HttpStatus.OK);
    }

    @PostMapping("{connectedUserId}/accept")
    public ResponseEntity<Connection> acceptConnectionRequest(@RequestHeader(HttpHeaders.AUTHORIZATION) String token,
            @PathVariable ObjectId connectedUserId) {
        Connection connection = connectionService.acceptConnectionRequest(token, connectedUserId);
        return new ResponseEntity<>(connection, HttpStatus.OK);
    }

    @PostMapping("/{connectedUserId}/decline")
    public ResponseEntity<String> declineConnectionRequest(@RequestHeader(HttpHeaders.AUTHORIZATION) String token,
            @PathVariable ObjectId connectedUserId) {
        String response = connectionService.declineConnectionRequest(token, connectedUserId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/{connectedUserId}/cancel")
    public ResponseEntity<String> cancelConnectionRequest(@RequestHeader(HttpHeaders.AUTHORIZATION) String token,
            @PathVariable ObjectId connectedUserId) {
        String response= connectionService.cancelConnectionRequest(token, connectedUserId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/{connectedUserId}/remove")
    public ResponseEntity<String> removeConnection(@RequestHeader(HttpHeaders.AUTHORIZATION) String token,
            @PathVariable ObjectId connectedUserId) {
         String response = connectionService.removeConnection(token, connectedUserId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @JsonView(Views.Search.class)
    @GetMapping("/my-connections")
    public ResponseEntity<List<User>> getConnections(@RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
        return new ResponseEntity<>(connectionService.getConnections(token),HttpStatus.OK);
    }

    @JsonView(Views.Search.class)
    @GetMapping("/received")
    public ResponseEntity<List<User>> getReceivedConnectionRequests(@RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
         return new ResponseEntity<>(connectionService.getReceivedConnectionRequests(token),HttpStatus.OK);
    }
}
