package com.example.linkmate.config;

import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.example.linkmate.chat.model.Chat;
import com.example.linkmate.chat.model.MessageType;
import com.example.linkmate.chat.services.ChatService;
import com.example.linkmate.user.model.User;
import com.example.linkmate.user.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Component
public class MyChatWebSocketHandler extends TextWebSocketHandler {

    @Autowired
    private ChatService chatService;

    @Autowired
    private UserRepository userRepository;

    private final Map<String, WebSocketSession> sessions = new HashMap<>();

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
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.registerModule(new JavaTimeModule()); // Register JavaTimeModule for LocalDateTime

            // Deserialize the message payload into a Map
            Map<String, Object> messageData = objectMapper.readValue(payload, Map.class);

            // Create a new Chat object and set its properties
            Chat chat = new Chat();
            chat.setSenderId(new ObjectId((String) messageData.get("senderId")));
            chat.setReceiverId(new ObjectId((String) messageData.get("receiverId")));
            chat.setMessageContent((String) messageData.get("messageContent"));
            chat.setMessageType(MessageType.valueOf(((String) messageData.get("messageType")).toUpperCase()));

            chat.setRead(false);

            // Set optional fields
            String replyToMessageId = (String) messageData.get("replyToMessageId");
            if (replyToMessageId != null) {
                chat.setReplyToMessageId(new ObjectId(replyToMessageId));
            }
            chat.setStatus((String) messageData.get("status"));

            // Save the Chat message and serialize it to JSON
            Chat savedChat = chatService.saveChatMessage(chat);
            String responsePayload = objectMapper.writeValueAsString(savedChat);

            // Send the response to the appropriate WebSocket session
            Optional<User> user = userRepository.findById(chat.getReceiverId());
            if (user.isPresent()) {
                String token = user.get().getToken();
                WebSocketSession recipientSession = sessions.get(token);
                if (recipientSession != null && recipientSession.isOpen()) {
                    recipientSession.sendMessage(new TextMessage(responsePayload));
                } else {
                    System.out.println("Recipient session not found or not open.");
                }
                session.sendMessage(new TextMessage(responsePayload));
            } else {
                System.out.println("User not found for ID: " + chat.getReceiverId());
            }

        } catch (Exception e) {
            e.printStackTrace();
            session.sendMessage(new TextMessage("Error processing message: " + e.getMessage()));
        }
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

    private String extractToken(WebSocketSession session) {
        String query = session.getUri().getQuery();
        if (query != null && query.startsWith("token=")) {
            return query.split("=")[1];
        }
        return null;
    }
}
