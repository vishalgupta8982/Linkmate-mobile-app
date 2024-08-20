package com.example.linkmate.config;

import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.springframework.stereotype.Component;

import com.example.linkmate.connection.model.ConnectionRequestDetail;
import com.example.linkmate.connection.service.ConnectionService;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Component
public class MyWebSocketHandler extends TextWebSocketHandler {

    private final ConnectionService connectionService;
    private final Map<String, WebSocketSession> sessions = new HashMap<>();

    public MyWebSocketHandler(ConnectionService connectionService) {
        this.connectionService = connectionService;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String token = extractToken(session);
        if (token != null) {
            sessions.put(token, session);
            System.out.println("WebSocket session established for token: " + token);
        }
        super.afterConnectionEstablished(session);
    }

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws IOException {
        String payload = message.getPayload();
        System.out.println("Received message: " + payload);
        // Process the message if needed
        TextMessage response = new TextMessage("Message received");
        session.sendMessage(response);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        String token = extractToken(session);
        if (token != null) {
            sessions.remove(token);
            System.out.println("WebSocket session closed for token: " + token);
        }
        super.afterConnectionClosed(session, status);
    }

    public void sendConnectionRequestUpdate(String token, ConnectionRequestDetail detail) {
        WebSocketSession session = sessions.get(token);
        if (session != null && session.isOpen()) {
            try {
                Map<String, Object> payload = new HashMap<>();
                payload.put("type", "RECEIVE_CONNECTION_REQUEST");
                payload.put("data", new ConnectionRequestDetail[] { detail }); // Wrapping in array

                // Serialize the payload to JSON
                ObjectMapper objectMapper = new ObjectMapper();
                String message = objectMapper.writeValueAsString(payload);

                // Send the message through the WebSocket session
                session.sendMessage(new TextMessage(message));
                System.out.println("Sent message to token: " + token);
            } catch (IOException e) {
                e.printStackTrace();
            }
        } else {
            System.out.println("No open session found for token: " + token);
        }
    }

    private String extractToken(WebSocketSession session) {
        String query = session.getUri().getQuery();
        if (query != null && query.startsWith("token=")) {
            return query.split("=")[1];
        }
        return null;
    }
}