package com.example.linkmate.chat.controllers;

import org.apache.http.HttpHeaders;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.*;
import com.example.linkmate.chat.model.Chat;
import com.example.linkmate.chat.model.AllInteractionDto;
import com.example.linkmate.chat.services.ChatService;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @GetMapping("/history")
    public ResponseEntity<Page<Chat>> getChatHistory(@RequestHeader(HttpHeaders.AUTHORIZATION) String token,
            @RequestParam ObjectId connectionUserId, @RequestParam int page,
            @RequestParam int size) {
        Page<Chat> chatHistory = chatService.getChatHistory(token, connectionUserId, page, size);
        return new ResponseEntity<>(chatHistory, HttpStatus.OK);
    }
    @DeleteMapping("/delete/{messageId}")
    public ResponseEntity<String> deleteMessageForEveryone(@RequestHeader(HttpHeaders.AUTHORIZATION) String token,@PathVariable ObjectId messageId){
        return new ResponseEntity<>(chatService.deleteMessageForEveryone(token, messageId),HttpStatus.OK);
    }

    @PutMapping("/mark-read/{connnectionUserId}")
    public ResponseEntity<String> readMessage(@RequestHeader(HttpHeaders.AUTHORIZATION) String token,@PathVariable ObjectId connnectionUserId){
        return new ResponseEntity<>(chatService.messageRead(token, connnectionUserId),HttpStatus.OK);
    }

    @GetMapping("/all-interactions")
    public List<AllInteractionDto> getAllInteractions(@RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
        return chatService.getAllInteractions(token);
    }

}
