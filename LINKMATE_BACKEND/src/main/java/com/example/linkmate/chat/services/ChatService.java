package com.example.linkmate.chat.services;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.example.linkmate.chat.model.Chat;
import com.example.linkmate.chat.model.ChatHistoryResponse;
import com.example.linkmate.chat.model.AllInteractionDto;
import com.example.linkmate.chat.repository.ChatRepository;
import com.example.linkmate.post.model.PostUserDetail;
import com.example.linkmate.user.model.User;
import com.example.linkmate.user.repository.UserRepository;
import com.example.linkmate.user.utils.JwtUtil;
import java.util.*;

@Service
public class ChatService {

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    public Chat saveChatMessage(Chat chatMessage) {
        Chat chat = chatRepository.save(chatMessage);
        System.out.println("chatService" + chat);
        return chat;

    }

    public ChatHistoryResponse getChatHistory(String token, ObjectId connectionUserId, int page, int size) {
        ObjectId myUserId = jwtUtil.getUserIdFromToken(token);
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Chat> chatHistory = chatRepository.findChatHistory(myUserId, connectionUserId, pageable);
        User user = userRepository.findById(connectionUserId)
                .orElseThrow(() -> new RuntimeException("connection User not found"));
        PostUserDetail postUserDetail = new PostUserDetail();
        postUserDetail.setFirstName(user.getFirstName());
        postUserDetail.setLastName(user.getLastName());
        postUserDetail.setHeadline(user.getHeadline());
        postUserDetail.setProfilePicture(user.getProfilePicture());
        postUserDetail.setUsername(user.getUsername());
        postUserDetail.setUserId(user.getUserId());
        return new ChatHistoryResponse(chatHistory, postUserDetail);
    }

    public String deleteMessageForEveryone(String token, ObjectId messageId) {
        if (chatRepository.existsById(messageId)) {
            chatRepository.deleteById(messageId);
            return "Message deleted";
        } else {
            return "message not found";
        }
    }

    public String messageRead(String token, ObjectId connectionUserId) {
        ObjectId userId = jwtUtil.getUserIdFromToken(token);
        List<Chat> unreadChats = chatRepository.findUnreadMessagesBetweenUsers(userId, connectionUserId);
        if (unreadChats == null || unreadChats.isEmpty()) {
            return "No unread messages found.";
        }
        for (Chat chat : unreadChats) {
            chat.setRead(true);
        }
        chatRepository.saveAll(unreadChats);
        return "Messages marked as read.";
    }

    public long getUnreadMessageCount(ObjectId userId, ObjectId connectionId) {
        return chatRepository.countByReceiverIdAndSenderIdAndIsRead(userId, connectionId, false);
    }

    public List<AllInteractionDto> getAllInteractions(String token) {
        ObjectId myUserId = jwtUtil.getUserIdFromToken(token);
        Optional<User> userOpt = userRepository.findById(myUserId);
        List<AllInteractionDto> allInteractions = new ArrayList<>();

        if (userOpt.isPresent()) {
            List<ObjectId> connectionIds = userOpt.get().getConnections();

            for (ObjectId connectionId : connectionIds) {
                Optional<Chat> lastChatOpt = chatRepository
                        .findFirstBySenderIdAndReceiverIdOrderByCreatedAtDesc(myUserId, connectionId);

                if (!lastChatOpt.isPresent()) {
                    lastChatOpt = chatRepository.findFirstByReceiverIdAndSenderIdOrderByCreatedAtDesc(myUserId,
                            connectionId);
                }

                Optional<User> connectionOpt = userRepository.findById(connectionId);

                if (lastChatOpt.isPresent() && connectionOpt.isPresent()) {
                    Chat lastChat = lastChatOpt.get();
                    User connection = connectionOpt.get();

                    AllInteractionDto dto = new AllInteractionDto();
                    dto.setUserId(connection.getUserId());
                    dto.setUsername(connection.getUsername());
                    dto.setFirstName(connection.getFirstName());
                    dto.setLastName(connection.getLastName());
                    dto.setProfilePicture(connection.getProfilePicture());
                    dto.setLastMessage(lastChat.getMessageContent());
                    long unreadMessageCount = getUnreadMessageCount(myUserId, connectionId);
                    dto.setNumberOfUnreadMessage(unreadMessageCount);
                    allInteractions.add(dto);
                }
            }
        }

        return allInteractions;
    }

}
