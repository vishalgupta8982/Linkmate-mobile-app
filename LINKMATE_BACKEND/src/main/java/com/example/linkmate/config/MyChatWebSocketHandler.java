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
        System.out.println("Received message: " + payload);

        try {
            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, Object> messageData = objectMapper.readValue(payload, Map.class);
            Chat chat = new Chat();
            chat.setSenderId(new ObjectId((String) messageData.get("senderId")));
            chat.setReceiverId(new ObjectId((String) messageData.get("receiverId")));
            chat.setMessageContent((String) messageData.get("messageContent"));
            String messageTypeString = (String) messageData.get("messageType");
            MessageType messageType = MessageType.valueOf(messageTypeString.toUpperCase());
            chat.setMessageType(messageType);
            chat.setCreatedAt(LocalDateTime.now());
            chat.setRead(false);
            String replyToMessageId = (String) messageData.get("replyToMessageId");
            if (replyToMessageId != null) {
                chat.setReplyToMessageId(new ObjectId(replyToMessageId));
            }
            String status = (String) messageData.get("status");
            if (status != null) {
                chat.setStatus(status);
            }
            chatService.saveChatMessage(chat);
            Optional<User> user = userRepository.findById(chat.getReceiverId());
            if (user.isPresent()) {
                String token = user.get().getToken();
                WebSocketSession recipientSession = sessions.get(token);

                if (recipientSession != null && recipientSession.isOpen()) {
                    recipientSession.sendMessage(new TextMessage(payload));
                } else {
                    System.out.println("Recipient session not found or not open.");
                }
            } else {
                System.out.println("User not found for ID: " + chat.getReceiverId());
            }
            String confirmationResponse = "Message sent successfully with ID: " + chat.getMessageId().toString();
            session.sendMessage(new TextMessage(confirmationResponse));
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
