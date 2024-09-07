package com.example.linkmate.chat.services;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.example.linkmate.chat.model.Chat;
import com.example.linkmate.chat.model.AllInteractionDto;
import com.example.linkmate.chat.repository.ChatRepository;
import com.example.linkmate.notification.service.NotificationService;
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

    @Autowired
    private NotificationService notificationService;

    public Chat saveChatMessage(Chat chatMessage) {
        chatMessage.setStatus("sent");
        Chat chat = chatRepository.save(chatMessage);
        notificationService.sendNotification(chat.getReceiverId(), chat.getSenderId(), chat.getMessageContent(),"CHAT");
        return chat;

    }

    public Page<Chat> getChatHistory(String token, ObjectId connectionUserId, int page, int size) {
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
        return chatHistory;
    }

    public String deleteMessageForEveryone(ObjectId messageId) {
        if (chatRepository.existsById(messageId)) {
            chatRepository.deleteById(messageId);
            return "Message deleted";
        } else {
            return "message not found";
        }
    }

    public String messageRead(ObjectId userId, ObjectId connectionUserId) {
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
                Pageable pageable = PageRequest.of(0, 1, Sort.by(Sort.Direction.DESC, "createdAt"));
                List<Chat> chats = chatRepository.findLatestMessageBetween(myUserId, connectionId, pageable);
                Chat lastChat = chats.isEmpty() ? null : chats.get(0);
                Optional<User> connectionOpt = userRepository.findById(connectionId);

                if (lastChat != null && connectionOpt.isPresent()) {
                    User connection = connectionOpt.get();
                    AllInteractionDto dto = new AllInteractionDto();
                    dto.setUserId(connection.getUserId());
                    dto.setUsername(connection.getUsername());
                    dto.setFirstName(connection.getFirstName());
                    dto.setLastName(connection.getLastName());
                    dto.setProfilePicture(connection.getProfilePicture());
                    dto.setHeadline(connection.getHeadline());
                    dto.setLastMessage(lastChat);
                    long unreadMessageCount = getUnreadMessageCount(myUserId, connectionId);
                    dto.setNumberOfUnreadMessage(unreadMessageCount);
                    allInteractions.add(dto);
                }
            }
        }
        return allInteractions;
       
    }

}
