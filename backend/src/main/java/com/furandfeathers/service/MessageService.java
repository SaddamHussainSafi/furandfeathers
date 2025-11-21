package com.furandfeathers.service;

import com.furandfeathers.entity.Message;
import com.furandfeathers.entity.User;
import com.furandfeathers.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    // Send a message from sender to receiver
    public Message sendMessage(User sender, User receiver, String content) {
        Message message = Message.builder()
                .sender(sender)
                .receiver(receiver)
                .content(content)
                .timestamp(LocalDateTime.now())
                .read(false)
                .build();

        return messageRepository.save(message);
    }

    // Get conversation between two users
    public List<Message> getConversation(User user1, User user2) {
        return messageRepository.findConversation(user1, user2);
    }

    // Get all conversation partners for a user
    public List<User> getConversationPartners(User user) {
        return messageRepository.findConversationPartners(user);
    }

    // Get unread messages for a user
    public List<Message> getUnreadMessages(User user) {
        return messageRepository.findByReceiverAndRead(user, false);
    }

    // Get unread messages in a specific conversation
    public List<Message> getUnreadMessagesInConversation(User currentUser, User otherUser) {
        List<Message> conversation = messageRepository.findConversation(currentUser, otherUser);
        return conversation.stream()
                .filter(m -> m.getReceiver().equals(currentUser) && !m.isRead())
                .toList();
    }

    // Mark messages as read
    public void markAsRead(List<Message> messages) {
        for (Message message : messages) {
            message.setRead(true);
        }
        messageRepository.saveAll(messages);
    }
}