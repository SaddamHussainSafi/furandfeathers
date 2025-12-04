package com.furandfeathers.controller;

import com.furandfeathers.entity.Message;
import com.furandfeathers.entity.User;
import com.furandfeathers.repository.UserRepository;
import com.furandfeathers.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = {"https://ff.saddamhussain.com.np", "http://ff.saddamhussain.com.np"})
public class MessageController {

    @Autowired
    private MessageService messageService;

    @Autowired
    private UserRepository userRepository;

    // Send a message
    @PostMapping
    public ResponseEntity<?> sendMessage(@RequestBody Map<String, Object> request, Principal principal) {
        try {
            String receiverEmail = (String) request.get("receiverEmail");
            String content = (String) request.get("content");

            if (receiverEmail == null || content == null || content.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Receiver email and content are required"));
            }

            User sender = userRepository.findByEmail(principal.getName())
                    .orElseThrow(() -> new RuntimeException("Sender not found"));

            User receiver = userRepository.findByEmail(receiverEmail)
                    .orElseThrow(() -> new RuntimeException("Receiver not found"));

            Message message = messageService.sendMessage(sender, receiver, content);
            return ResponseEntity.ok(message);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Get conversation with a specific user
    @GetMapping("/conversation/{email}")
    public ResponseEntity<?> getConversation(@PathVariable String email, Principal principal) {
        try {
            User currentUser = userRepository.findByEmail(principal.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            User otherUser = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Other user not found"));

            List<Message> messages = messageService.getConversation(currentUser, otherUser);
            return ResponseEntity.ok(messages);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Get all conversation partners
    @GetMapping("/conversations")
    public ResponseEntity<?> getConversations(Principal principal) {
        try {
            User user = userRepository.findByEmail(principal.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            List<User> partners = messageService.getConversationPartners(user);
            return ResponseEntity.ok(partners);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Get unread messages count
    @GetMapping("/unread")
    public ResponseEntity<?> getUnreadCount(Principal principal) {
        try {
            User user = userRepository.findByEmail(principal.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            List<Message> unreadMessages = messageService.getUnreadMessages(user);
            return ResponseEntity.ok(Map.of("count", unreadMessages.size()));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Mark messages as read for a conversation
    @PostMapping("/mark-read/{email}")
    public ResponseEntity<?> markMessagesAsRead(@PathVariable String email, Principal principal) {
        try {
            User currentUser = userRepository.findByEmail(principal.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            User otherUser = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Other user not found"));

            List<Message> unreadMessages = messageService.getUnreadMessagesInConversation(currentUser, otherUser);
            messageService.markAsRead(unreadMessages);

            return ResponseEntity.ok(Map.of("message", "Messages marked as read"));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Get all users available for messaging (shelters and adopters)
    @GetMapping("/users")
    public ResponseEntity<?> getAvailableUsers(Principal principal) {
        try {
            User currentUser = userRepository.findByEmail(principal.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Get all users except current user
            List<User> users = userRepository.findAll().stream()
                    .filter(u -> !u.getEmail().equals(currentUser.getEmail()))
                    .toList();

            return ResponseEntity.ok(users);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}