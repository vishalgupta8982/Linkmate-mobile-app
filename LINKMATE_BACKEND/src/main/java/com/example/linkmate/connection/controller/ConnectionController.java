// package com.example.linkmate.connection.controller;

// import java.util.List;

// import org.apache.http.HttpHeaders;
// import org.bson.types.ObjectId;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.messaging.simp.SimpMessagingTemplate;
// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.PathVariable;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.RequestHeader;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RestController;

// import com.example.linkmate.connection.model.Connection;
// import com.example.linkmate.connection.service.ConnectionService;
// import com.example.linkmate.user.model.User;
// import com.example.linkmate.user.model.Views;
// import com.fasterxml.jackson.annotation.JsonView;

// @RestController
// @RequestMapping("/users/connections/")
// public class ConnectionController {
    
//     @Autowired
//     private ConnectionService connectionService;

//     @Autowired
//     private SimpMessagingTemplate messagingTemplate;

//     @PostMapping("/{connectedUserId}")
//     public Connection sendConnectionRequest(@RequestHeader(HttpHeaders.AUTHORIZATION) String token,@PathVariable ObjectId connectedUserId) {
//         return connectionService.sendConnectionRequest(token, connectedUserId);
//     }

//     @PostMapping("{connectedUserId}/accept")
//     public Connection acceptConnectionRequest(@RequestHeader(HttpHeaders.AUTHORIZATION) String token,@PathVariable ObjectId connectedUserId){
//         return connectionService.acceptConnectionRequest(token, connectedUserId);
//     }

//     @PostMapping("/{connectedUserId}/decline")
//     public void declineConnectionRequest(@RequestHeader(HttpHeaders.AUTHORIZATION) String token, @PathVariable ObjectId connectedUserId) {
//         connectionService.declineConnectionRequest(token, connectedUserId);
//     }
// @JsonView(Views.Search.class)
//     @GetMapping("/my-connections")
//     public List<User> getConnections(@RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
//         return connectionService.getConnections(token);
//     }

//     @JsonView(Views.Search.class)
//     @GetMapping("/received")
//     public List<User> getReceivedConnectionRequests(@RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
//         return connectionService.getReceivedConnectionRequests(token);
//     }
// }

package com.example.linkmate.connection.controller;

import java.util.List;

import org.apache.http.HttpHeaders;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
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

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    // @PostMapping("/{connectedUserId}")
    // public Connection
    // sendConnectionRequest(@RequestHeader(HttpHeaders.AUTHORIZATION) String
    // token,@PathVariable ObjectId connectedUserId) {
    // return connectionService.sendConnectionRequest(token, connectedUserId);
    // }

    @PostMapping("/{connectedUserId}")
    public Connection sendConnectionRequest(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String token,
            @PathVariable ObjectId connectedUserId) {
        Connection connection = connectionService.sendConnectionRequest(token, connectedUserId);

        // Notify the receiver of the connection request via WebSocket
        messagingTemplate.convertAndSendToUser(
                connectedUserId.toString(),
                "/queue/connection-request",
                connection);

        return connection;
    }

    @PostMapping("/{connectedUserId}/accept")
    public Connection acceptConnectionRequest(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String token,
            @PathVariable ObjectId connectedUserId) {
        Connection connection = connectionService.acceptConnectionRequest(token, connectedUserId);

        messagingTemplate.convertAndSendToUser(
                connection.getConnectedUserId().toString(),  
                "/queue/connection-response", // The WebSocket destination
                connection // The payload, which is the accepted connection
        );

        return connection;
    }

    @PostMapping("/{connectedUserId}/decline")
    public void declineConnectionRequest(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String token,
            @PathVariable ObjectId connectedUserId) {
        connectionService.declineConnectionRequest(token, connectedUserId);

        // Optionally, notify the sender that their connection request was declined
        messagingTemplate.convertAndSendToUser(
                connectedUserId.toString(),
                "/queue/connection-response",
                "Your connection request was declined");
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
