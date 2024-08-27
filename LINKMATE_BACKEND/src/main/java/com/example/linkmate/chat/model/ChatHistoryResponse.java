package com.example.linkmate.chat.model;

import org.springframework.data.domain.Page;

import com.example.linkmate.post.model.PostUserDetail;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ChatHistoryResponse {
    
    private Page<Chat> chatHistory;
    private PostUserDetail chatRecieverUserDetail;

}
