package com.furandfeathers.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.furandfeathers.dto.furly.*;
import com.furandfeathers.entity.FurlyConversation;
import com.furandfeathers.entity.FurlyMessage;
import com.furandfeathers.entity.Pet;
import com.furandfeathers.entity.User;
import com.furandfeathers.enums.FurlyIntent;
import com.furandfeathers.enums.FurlyMessageSender;
import com.furandfeathers.repository.FurlyConversationRepository;
import com.furandfeathers.repository.FurlyMessageRepository;
import com.furandfeathers.repository.PetRepository;
import com.furandfeathers.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.security.Principal;
import java.util.*;

@Service
public class FurlyService {

    private static final String MATCH_TAG = "MATCHES: [";

    private static final List<PetMatchQuestion> PET_MATCH_QUESTIONS = List.of(
            new PetMatchQuestion(
                    "home_environment",
                    "What best describes your home environment?",
                    List.of("Apartment", "House with yard", "Shared space")),
            new PetMatchQuestion(
                    "activity_level",
                    "How active would you like your future pet to be?",
                    List.of("High energy", "Moderate", "Laid back")),
            new PetMatchQuestion(
                    "household",
                    "Who will share the home with this pet (kids, other pets, seniors)?",
                    List.of("Kids in home", "Other pets", "Just adults")),
            new PetMatchQuestion(
                    "experience",
                    "How experienced are you with pet care and training?",
                    List.of("First-time", "Some experience", "Very experienced")),
            new PetMatchQuestion(
                    "traits",
                    "Any must-have traits or dealbreakers?",
                    List.of("Hypoallergenic", "Small size", "Super social")));

    private static final List<String> GENERAL_QA_SUGGESTIONS = List.of(
            "Any daily care tips?",
            "What foods should I avoid?",
            "How do I keep them active?");

    private final GeminiService geminiService;
    private final FurlyConversationRepository conversationRepository;
    private final FurlyMessageRepository messageRepository;
    private final PetRepository petRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public FurlyService(GeminiService geminiService,
            FurlyConversationRepository conversationRepository,
            FurlyMessageRepository messageRepository,
            PetRepository petRepository,
            UserRepository userRepository) {
        this.geminiService = geminiService;
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.petRepository = petRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public FurlySessionResponse startSession(FurlySessionRequest request, Principal principal) {
        FurlyIntent intent = request.getIntent() == null ? FurlyIntent.PET_MATCH : request.getIntent();

        FurlyConversation conversation = new FurlyConversation();
        conversation.setIntent(intent);
        conversation.setStepIndex(0);
        conversation.setCompleted(false);

        User currentUser = resolveUser(principal);
        if (currentUser != null) {
            conversation.setUser(currentUser);
        } else {
            conversation.setGuestSessionId(generateGuestSessionId(request.getGuestSessionId()));
        }

        conversation = conversationRepository.save(conversation);

        List<String> quickReplies = openingQuickReplies(conversation);
        String openingMessage = openingMessage(conversation);

        persistMessage(conversation, FurlyMessageSender.FURLY, openingMessage);

        return new FurlySessionResponse(
                conversation.getId(),
                conversation.getGuestSessionId(),
                openingMessage,
                quickReplies,
                intent);
    }

    @Transactional
    public FurlyMessageResponse handleMessage(FurlyMessageRequest request, Principal principal) {
        FurlyConversation conversation = conversationRepository.findById(request.getConversationId())
                .orElseThrow(() -> new IllegalArgumentException("Conversation not found"));

        validateConversationAccess(conversation, principal, request.getGuestSessionId());

        if (!StringUtils.hasText(request.getMessage())) {
            throw new IllegalArgumentException("Message is required");
        }

        persistMessage(conversation, FurlyMessageSender.USER, request.getMessage());

        if (conversation.getIntent() == FurlyIntent.PET_MATCH) {
            return handlePetMatch(conversation, request.getMessage());
        }

        return handleGeneralChat(conversation, request.getMessage());
    }

    private FurlyMessageResponse handleGeneralChat(FurlyConversation conversation, String latestMessage) {
        String prompt = buildPrompt(conversation);
        String responseText = geminiService.generateContent(buildSystemInstruction(conversation), prompt);
        persistMessage(conversation, FurlyMessageSender.FURLY, responseText);

        List<String> quickReplies = GENERAL_QA_SUGGESTIONS;
        List<FurlyRecommendation> recs = extractRecommendations(conversation, responseText);
        return new FurlyMessageResponse(conversation.getId(), responseText, quickReplies, recs, false);
    }

    private FurlyMessageResponse handlePetMatch(FurlyConversation conversation, String latestMessage) {
        Map<String, Object> context = readContext(conversation);
        Map<String, String> answers = getAnswerMap(context);

        int currentStep = conversation.getStepIndex();
        if (currentStep < PET_MATCH_QUESTIONS.size()) {
            PetMatchQuestion currentQuestion = PET_MATCH_QUESTIONS.get(currentStep);
            answers.put(currentQuestion.key(), latestMessage.trim());
            currentStep++;
            conversation.setStepIndex(currentStep);
        }

        if (currentStep < PET_MATCH_QUESTIONS.size()) {
            PetMatchQuestion nextQuestion = PET_MATCH_QUESTIONS.get(currentStep);
            saveContext(conversation, context);
            conversationRepository.save(conversation);
            persistMessage(conversation, FurlyMessageSender.FURLY, nextQuestion.prompt());
            return new FurlyMessageResponse(
                    conversation.getId(),
                    nextQuestion.prompt(),
                    nextQuestion.quickReplies(),
                    Collections.emptyList(),
                    false);
        }

        String summary = summarizeAnswers(answers);
        String petContext = buildAvailablePetsContext();
        String prompt = String.format(
                "User preferences:%n%s%n%nAVAILABLE PETS:%n%s%n%nRecommend matches and end with MATCHES: [ID1, ID2].",
                summary,
                petContext);

        String responseText = geminiService.generateContent(buildSystemInstruction(conversation), prompt);
        persistMessage(conversation, FurlyMessageSender.FURLY, responseText);

        List<FurlyRecommendation> recs = extractRecommendations(conversation, responseText);
        // conversation.setCompleted(true); // Keep conversation open
        saveContext(conversation, context);
        conversationRepository.save(conversation);

        List<String> quickReplies = List.of("Show me more pets", "Start a new search", "Can I adopt this?");
        return new FurlyMessageResponse(conversation.getId(), responseText, quickReplies, recs, false);
    }

    private void validateConversationAccess(FurlyConversation conversation, Principal principal,
            String guestSessionId) {
        if (conversation.getUser() != null) {
            if (principal == null || !conversation.getUser().getEmail().equals(principal.getName())) {
                throw new IllegalArgumentException("Conversation does not belong to the current user");
            }
        } else {
            String sessionId = Objects.requireNonNullElse(guestSessionId, "");
            if (!sessionId.equals(conversation.getGuestSessionId())) {
                throw new IllegalArgumentException("Conversation does not belong to this guest session");
            }
        }
    }

    private User resolveUser(Principal principal) {
        if (principal == null) {
            return null;
        }
        return userRepository.findByEmail(principal.getName()).orElse(null);
    }

    private String generateGuestSessionId(String existing) {
        return StringUtils.hasText(existing) ? existing : UUID.randomUUID().toString();
    }

    private void persistMessage(FurlyConversation conversation, FurlyMessageSender sender, String text) {
        FurlyMessage message = new FurlyMessage();
        message.setConversation(conversation);
        message.setSender(sender);
        message.setContent(text);
        messageRepository.save(message);
    }

    private Map<String, Object> readContext(FurlyConversation conversation) {
        if (!StringUtils.hasText(conversation.getContextJson())) {
            return new HashMap<>();
        }
        try {
            return objectMapper.readValue(conversation.getContextJson(), Map.class);
        } catch (JsonProcessingException e) {
            return new HashMap<>();
        }
    }

    private void saveContext(FurlyConversation conversation, Map<String, Object> context) {
        try {
            conversation.setContextJson(objectMapper.writeValueAsString(context));
        } catch (JsonProcessingException e) {
            conversation.setContextJson("{}");
        }
    }

    @SuppressWarnings("unchecked")
    private Map<String, String> getAnswerMap(Map<String, Object> context) {
        Object answersObj = context.get("answers");
        if (answersObj instanceof Map<?, ?> map) {
            Map<String, String> answers = new HashMap<>();
            map.forEach((k, v) -> answers.put(String.valueOf(k), v == null ? "" : v.toString()));
            context.put("answers", answers);
            return answers;
        }
        Map<String, String> answers = new HashMap<>();
        context.put("answers", answers);
        return answers;
    }

    private String summarizeAnswers(Map<String, String> answers) {
        StringBuilder builder = new StringBuilder();
        for (PetMatchQuestion question : PET_MATCH_QUESTIONS) {
            String value = answers.get(question.key());
            if (StringUtils.hasText(value)) {
                builder.append("- ")
                        .append(question.prompt())
                        .append(" -> ")
                        .append(value)
                        .append('\n');
            }
        }
        return builder.length() == 0 ? "No answers provided" : builder.toString();
    }

    private String buildAvailablePetsContext() {
        return petRepository.findAllWithOwners().stream()
                .filter(p -> p.getStatus() != null && "Available".equalsIgnoreCase(p.getStatus()))
                .map(p -> String.format(
                        "ID:%d, Name:%s, Species:%s, Breed:%s, Age:%s, Temperament:%s, Url:/pets/%d",
                        p.getId(),
                        p.getName(),
                        p.getSpecies(),
                        p.getBreed(),
                        p.getAge(),
                        Optional.ofNullable(p.getDescription()).orElse(""),
                        p.getId()))
                .reduce((a, b) -> a + "\n" + b)
                .orElse("No pets available");
    }

    private String buildSystemInstruction(FurlyConversation conversation) {
        if (conversation.getIntent() == FurlyIntent.PET_MATCH) {
            return "You are Furly, an adoption concierge. Use the gathered answers and available pet list to suggest one to three specific pets. Keep under 150 words, explain why each is a good fit, and end with MATCHES: [ID1, ID2]. Include live URLs in the form /pets/{id}.";
        }
        if (conversation.getIntent() == FurlyIntent.GENERAL_QA) {
            return "You are Furly, a certified pet coach helping with general pet care or questions. Offer tips, cite relevant factors, and propose follow-up questions.";
        }
        return "You are Furly.";
    }

    private String buildPrompt(FurlyConversation conversation) {
        List<FurlyMessage> lastMessages = messageRepository
                .findTop20ByConversationIdOrderByCreatedAtDesc(conversation.getId());
        Collections.reverse(lastMessages);
        StringBuilder builder = new StringBuilder();
        for (FurlyMessage msg : lastMessages) {
            builder.append(msg.getSender() == FurlyMessageSender.USER ? "User" : "Furly")
                    .append(": ")
                    .append(msg.getContent())
                    .append("\n");
        }
        builder.append("Furly:");
        return builder.toString();
    }

    private List<String> openingQuickReplies(FurlyConversation conversation) {
        if (conversation.getIntent() == FurlyIntent.PET_MATCH) {
            return PET_MATCH_QUESTIONS.get(0).quickReplies();
        }
        return GENERAL_QA_SUGGESTIONS;
    }

    private String openingMessage(FurlyConversation conversation) {
        if (conversation.getIntent() == FurlyIntent.PET_MATCH) {
            return PET_MATCH_QUESTIONS.get(0).prompt();
        }
        if (conversation.getIntent() == FurlyIntent.GENERAL_QA) {
            return "Happy to help with any pet questions. What would you like to chat about?";
        }
        return "Hi!";
    }

    private List<FurlyRecommendation> extractRecommendations(FurlyConversation conversation, String responseText) {
        List<FurlyRecommendation> recs = new ArrayList<>();
        if (!responseText.contains(MATCH_TAG)) {
            return recs;
        }
        try {
            int start = responseText.lastIndexOf(MATCH_TAG) + MATCH_TAG.length();
            int end = responseText.indexOf(']', start);
            if (end <= start) {
                return recs;
            }
            String idsPart = responseText.substring(start, end);
            String[] ids = idsPart.split(",");
            for (String idStr : ids) {
                Long petId = Long.parseLong(idStr.trim());
                Optional<Pet> petOpt = petRepository.findById(petId);
                petOpt.ifPresent(pet -> recs.add(mapPet(pet)));
            }
        } catch (Exception ignored) {
        }
        return recs;
    }

    private FurlyRecommendation mapPet(Pet pet) {
        String url = "/pets/" + pet.getId();
        return new FurlyRecommendation(
                pet.getId(),
                pet.getName(),
                pet.getBreed(),
                pet.getAge(),
                pet.getImageUrl(),
                url,
                pet.getDescription());
    }

    private record PetMatchQuestion(String key, String prompt, List<String> quickReplies) {
    }
}
