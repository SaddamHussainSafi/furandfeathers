-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Nov 21, 2025 at 03:23 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `testtt`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin_actions`
--

CREATE TABLE `admin_actions` (
  `id` bigint(20) NOT NULL,
  `action_type` enum('ADOPTION_APPROVED','ADOPTION_COMPLETED','ADOPTION_REJECTED','OTHER','PERMISSION_CHANGED','PET_APPROVED','PET_DELETED','PET_REJECTED','ROLE_CHANGED','SHELTER_APPROVED','SHELTER_REJECTED','SHELTER_SUSPENDED','SYSTEM_SETTING_CHANGED','USER_ACTIVATED','USER_CREATED','USER_DELETED','USER_SUSPENDED','USER_UPDATED') NOT NULL,
  `details` text DEFAULT NULL,
  `ip_address` varchar(50) DEFAULT NULL,
  `reason` text DEFAULT NULL,
  `target_adoption_id` bigint(20) DEFAULT NULL,
  `target_pet_id` bigint(20) DEFAULT NULL,
  `timestamp` datetime(6) NOT NULL,
  `user_agent` varchar(500) DEFAULT NULL,
  `performed_by` bigint(20) NOT NULL,
  `target_user_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin_actions`
--

INSERT INTO `admin_actions` (`id`, `action_type`, `details`, `ip_address`, `reason`, `target_adoption_id`, `target_pet_id`, `timestamp`, `user_agent`, `performed_by`, `target_user_id`) VALUES
(1, 'USER_ACTIVATED', NULL, NULL, 'Activated by admin', NULL, NULL, '2025-11-14 17:26:06.000000', NULL, 1, 1),
(3, 'USER_ACTIVATED', NULL, NULL, 'Activated by admin', NULL, NULL, '2025-11-15 03:16:27.000000', NULL, 1, 3),
(4, 'USER_ACTIVATED', NULL, NULL, 'Activated by admin', NULL, NULL, '2025-11-15 03:16:39.000000', NULL, 1, 2),
(5, 'USER_ACTIVATED', NULL, NULL, 'Activated by admin', NULL, NULL, '2025-11-15 03:16:46.000000', NULL, 1, 10),
(6, 'ROLE_CHANGED', '{\"oldValue\":\"ADMIN/ACTIVE\",\"newValue\":\"ADMIN/ACTIVE\"}', NULL, 'Role changed from ADMIN to ADMIN, Status changed from ACTIVE to ACTIVE', NULL, NULL, '2025-11-15 03:32:36.000000', NULL, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `adopter_info`
--

CREATE TABLE `adopter_info` (
  `id` bigint(20) NOT NULL,
  `adoption_reason` text DEFAULT NULL,
  `allergic_to_pets` bit(1) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `daily_hours_home` int(11) DEFAULT NULL,
  `has_other_pets` bit(1) DEFAULT NULL,
  `has_yard` bit(1) DEFAULT NULL,
  `household_size` int(11) DEFAULT NULL,
  `housing_type` varchar(255) DEFAULT NULL,
  `occupation` varchar(255) DEFAULT NULL,
  `pet_experience_years` int(11) DEFAULT NULL,
  `preferred_species` text DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `adoption_requests`
--

CREATE TABLE `adoption_requests` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `pet_id` bigint(20) NOT NULL,
  `message` text DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `contact_info` varchar(255) DEFAULT NULL,
  `preferred_date` datetime DEFAULT NULL,
  `status` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `admin_notes` text DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `rejection_reason` text DEFAULT NULL,
  `reviewed_at` datetime(6) DEFAULT NULL,
  `reviewed_by` bigint(20) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `address_line` text DEFAULT NULL,
  `adoption_timeline` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `contact_email` varchar(255) DEFAULT NULL,
  `contact_phone` varchar(255) DEFAULT NULL,
  `daily_schedule` text DEFAULT NULL,
  `experience_level` varchar(255) DEFAULT NULL,
  `has_other_pets` bit(1) DEFAULT NULL,
  `household_size` int(11) DEFAULT NULL,
  `housing_type` varchar(255) DEFAULT NULL,
  `lifestyle_notes` text DEFAULT NULL,
  `other_pets_details` text DEFAULT NULL,
  `postal_code` varchar(255) DEFAULT NULL,
  `preferred_visit_window` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `adoption_requests`
--

INSERT INTO `adoption_requests` (`id`, `user_id`, `pet_id`, `message`, `address`, `contact_info`, `preferred_date`, `status`, `created_at`, `admin_notes`, `notes`, `rejection_reason`, `reviewed_at`, `reviewed_by`, `updated_at`, `address_line`, `adoption_timeline`, `city`, `contact_email`, `contact_phone`, `daily_schedule`, `experience_level`, `has_other_pets`, `household_size`, `housing_type`, `lifestyle_notes`, `other_pets_details`, `postal_code`, `preferred_visit_window`, `state`) VALUES
(1, 1, 4, 'test', NULL, NULL, NULL, 'REJECTED', '2025-11-14 14:11:30', NULL, NULL, NULL, '2025-11-14 17:25:14.000000', 2, '2025-11-14 17:25:14.000000', 'Dundas', 'Within 2 weeks', 'Los Angeles', 'husseinsaddam894@gmail.com', '6475233282', '5 hours working', 'First-time adopter', b'0', 1, 'Apartment', 'nothing', '', 'm1b5b3', 'Tomorrow', 'Ontario');

-- --------------------------------------------------------

--
-- Table structure for table `chat_rooms`
--

CREATE TABLE `chat_rooms` (
  `adopter_id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `id` bigint(20) NOT NULL,
  `last_message_at` datetime(6) DEFAULT NULL,
  `pet_id` bigint(20) NOT NULL,
  `shelter_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `chat_sessions`
--

CREATE TABLE `chat_sessions` (
  `id` bigint(20) NOT NULL,
  `conversation_json` text DEFAULT NULL,
  `preferences_json` text DEFAULT NULL,
  `session_token` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chat_sessions`
--

INSERT INTO `chat_sessions` (`id`, `conversation_json`, `preferences_json`, `session_token`, `updated_at`, `user_id`) VALUES
(1, '[{\"text\":\"hi\",\"role\":\"user\"},{\"text\":\"Hi there! I\'m Furly 🐾, your pet matching assistant. I see you\'re interested in pets. Based on your apartment living situation, I\'d recommend smaller, calmer pets like cats. We have several lovely cats available including Bella the Persian and Whiskers the mixed breed. What kind of pet are you looking for?\",\"role\":\"furly\"},{\"text\":\"hello\",\"role\":\"user\"},{\"text\":\"Hi there! I\'m Furly 🐾, your pet matching assistant. I see you\'re interested in pets. Based on your apartment living situation, I\'d recommend smaller, calmer pets like cats. We have several lovely cats available including Bella the Persian and Whiskers the mixed breed. What kind of pet are you looking for?\",\"role\":\"furly\"},{\"text\":\"calm\",\"role\":\"user\"},{\"text\":\"Hi there! I\'m Furly 🐾, your pet matching assistant. I see you\'re interested in pets. Based on your apartment living situation, I\'d recommend smaller, calmer pets like cats. We have several lovely cats available including Bella the Persian and Whiskers the mixed breed. What kind of pet are you looking for?\",\"role\":\"furly\"},{\"text\":\"hello\",\"role\":\"user\"},{\"text\":\"Hi there! I\'m Furly 🐾, your pet matching assistant. I see you\'re interested in pets. Based on your apartment living situation, I\'d recommend smaller, calmer pets like cats. We have several lovely cats available including Bella the Persian and Whiskers the mixed breed. What kind of pet are you looking for?\",\"role\":\"furly\"},{\"text\":\"calm\",\"role\":\"user\"},{\"text\":\"Hi there! I\'m Furly 🐾, your pet matching assistant. I see you\'re interested in pets. Based on your apartment living situation, I\'d recommend smaller, calmer pets like cats. We have several lovely cats available including Bella the Persian and Whiskers the mixed breed. What kind of pet are you looking for?\",\"role\":\"furly\"},{\"text\":\"new\",\"role\":\"user\"},{\"text\":\"Hi there! I\'m Furly 🐾, your pet matching assistant. I see you\'re interested in pets. Based on your apartment living situation, I\'d recommend smaller, calmer pets like cats. We have several lovely cats available including Bella the Persian and Whiskers the mixed breed. What kind of pet are you looking for?\",\"role\":\"furly\"},{\"text\":\"healthy\",\"role\":\"user\"},{\"text\":\"Hi there! I\'m Furly 🐾, your pet matching assistant. I see you\'re interested in pets. Based on your apartment living situation, I\'d recommend smaller, calmer pets like cats. We have several lovely cats available including Bella the Persian and Whiskers the mixed breed. What kind of pet are you looking for?\",\"role\":\"furly\"}]', NULL, 'db4e590e-6958-4b25-a1f2-2bec94414c3c', '2025-10-29 19:23:07.000000', NULL),
(2, '[{\"text\":\"Hi Furly! I live in an apartment.\",\"role\":\"user\"},{\"text\":\"Hi there! I\'m Furly 🐾, your pet matching assistant. I see you\'re interested in pets. Based on your apartment living situation, I\'d recommend smaller, calmer pets like cats. We have several lovely cats available including Bella the Persian and Whiskers the mixed breed. What kind of pet are you looking for?\",\"role\":\"furly\"}]', NULL, '8856e1d5-2a7c-4b6e-98bd-8f59a22abb74', '2025-10-29 19:17:29.000000', NULL),
(3, '[{\"text\":\"Hello Furly\",\"role\":\"user\"},{\"text\":\"Hi there! I\'m Furly 🐾, your pet matching assistant. I see you\'re interested in pets. Based on your apartment living situation, I\'d recommend smaller, calmer pets like cats. We have several lovely cats available including Bella the Persian and Whiskers the mixed breed. What kind of pet are you looking for?\",\"role\":\"furly\"}]', NULL, 'test-session', '2025-10-29 19:26:25.000000', NULL),
(4, '[{\"text\":\"Hi Furly! I live in an apartment.\",\"role\":\"user\"},{\"text\":\"Hi there! I\'m Furly 🐾, your pet matching assistant. I see you\'re interested in pets. Based on your apartment living situation, I\'d recommend smaller, calmer pets like cats. We have several lovely cats available including Bella the Persian and Whiskers the mixed breed. What kind of pet are you looking for?\",\"role\":\"furly\"},{\"text\":\"I prefer cats, and I work from home most days.\",\"role\":\"user\"},{\"text\":\"Hi there! I\'m Furly 🐾, your pet matching assistant. I see you\'re interested in pets. Based on your apartment living situation, I\'d recommend smaller, calmer pets like cats. We have several lovely cats available including Bella the Persian and Whiskers the mixed breed. What kind of pet are you looking for?\",\"role\":\"furly\"},{\"role\":\"user\",\"text\":\"hi\"},{\"role\":\"furly\",\"text\":\"Sorry, something went wrong while thinking about your perfect match 🐾.\"}]', NULL, 'test-session-123', '2025-10-29 23:19:38.000000', NULL),
(5, '[{\"text\":\"Furly: Hello there! I\'m Furly 🐾, your pet matching assistant. Let\'s find your perfect companion!\\n\\nWhat type of home do you have: apartment, house with yard, or house without yard?\",\"role\":\"furly\"},{\"text\":\"apartment\",\"role\":\"user\"},{\"text\":\"Furly: Got it, an apartment!\\n\\nWhat\'s your activity level: very active, moderate, or relaxed?\",\"role\":\"furly\"},{\"text\":\"very active\",\"role\":\"user\"},{\"text\":\"Furly: Very active, got it!\\n\\nWho lives with you: live alone, roommates, family with kids, or couple?\",\"role\":\"furly\"},{\"text\":\"roommates\",\"role\":\"user\"},{\"text\":\"Furly: Roommates, got it!\\n\\nHow many hours daily are you away from home: 0-4 hours, 4-8 hours, or 8+ hours?\",\"role\":\"furly\"},{\"text\":\"8+\",\"role\":\"user\"},{\"text\":\"Furly: Furly: 8+ hours away daily, got it.\\n\\nWhat\'s your previous pet experience: none, some, or experienced?\",\"role\":\"furly\"},{\"text\":\"none\",\"role\":\"user\"},{\"text\":\"Sorry, something went wrong while thinking about your perfect match 🐾.\",\"role\":\"furly\"}]', NULL, '88b2e323-945b-4c12-81fd-a9655e09838e', '2025-10-31 14:23:08.000000', NULL),
(6, '[{\"text\":\"hi\",\"role\":\"user\"},{\"text\":\"Hello there! I\'m Furly 🐾, your pet matching assistant here at Fur & Feathers. I\'m so excited to help you find your perfect furry (or feathery!) friend!\\n\\nTo get started, could you tell me a little bit about where you live? Do you have an apartment with a cozy balcony, a house with a big yard, or something else? 🏡\",\"role\":\"furly\"}]', NULL, '112285fb-2792-4c7a-96df-c0a8e83d65cf', '2025-10-29 20:28:36.000000', NULL),
(7, '[{\"text\":\"hi\",\"role\":\"user\"},{\"text\":\"Hey there! I\'m Furly, your guide to finding the perfect furry (or feathery!) friend. I\'m so excited to help you on your adoption journey! 🐾\\n\\nTo get started, could you tell me a little about where you live? Are you in a cozy apartment, a house with a yard, or something else?\",\"role\":\"furly\"},{\"text\":\"I live in a small apartment\",\"role\":\"user\"},{\"text\":\"Thanks for sharing! A small apartment can be super cozy for the right companion. 🏡\\n\\nHow active are you day-to-day? Are you often out and about, or do you prefer a more relaxed pace at home?\",\"role\":\"furly\"},{\"text\":\"I prefer a relaxed pace at home\",\"role\":\"user\"},{\"text\":\"Got it! A relaxed pace at home sounds lovely. That helps me get a better picture of your ideal companion. 🛋️\\n\\nDo you have any kids or other pets living with you? Knowing that helps me find a friend who\'ll fit right into your household!\",\"role\":\"furly\"}]', NULL, 'fdd66fe1-4611-4dd7-b5c7-0fd9f5b7946f', '2025-10-29 20:29:14.000000', NULL),
(8, '[{\"text\":\"hi\",\"role\":\"user\"},{\"text\":\"Hi there! I\'m Furly 🐾, your pet matching assistant here at Fur & Feathers! I\'m so excited to help you find your new best friend!\\n\\nTo get us started on this fun journey, could you tell me a little bit about where you live? Do you have an apartment, a house with a yard, or something else?\",\"role\":\"furly\"}]', NULL, '5e0c3bdf-9c0b-4d7d-aada-5c7648ecd68c', '2025-10-29 20:55:42.000000', NULL),
(9, '[{\"role\":\"user\",\"text\":\"hi\"},{\"role\":\"furly\",\"text\":\"Hi there! I\'m Furly 🐾, your pet matching assistant. Let\'s find your perfect companion!\\n\\nFirst question: What type of home do you have: apartment, house with yard, or house without yard?\"}]', NULL, 'b2c826cf-c77e-47ba-b40b-acd1cd08c7b4', '2025-10-29 23:05:06.000000', NULL),
(10, '[{\"role\":\"user\",\"text\":\"house with yard\"},{\"role\":\"furly\",\"text\":\"A house with a yard sounds lovely! What\'s your activity level: very active, moderate, or relaxed?\"},{\"role\":\"user\",\"text\":\"relaxed\"},{\"role\":\"furly\",\"text\":\"Relaxed, got it! Who lives with you: live alone, roommates, family with kids, or couple?\"},{\"role\":\"user\",\"text\":\"roommates\"},{\"role\":\"furly\",\"text\":\"Okay, roommates! How many hours daily are you away from home: 0-4 hours, 4-8 hours, or 8+ hours?\"}]', NULL, '52a14a36-2899-43a5-b56c-3f2a74855fdd', '2025-10-29 23:17:37.000000', NULL),
(11, '[{\"role\":\"user\",\"text\":\"relaxed\"},{\"role\":\"furly\",\"text\":\"🐾 Hi there! I\'m Furly, your pet matching assistant! Let\'s find your perfect furry friend.\\n\\nTo start, what type of home do you have: apartment, house with yard, or house without yard?\"}]', NULL, '68a54b32-51ae-465a-bc47-66b4f958244b', '2025-10-29 23:10:32.000000', NULL),
(12, '[{\"role\":\"furly\",\"text\":\"Furly had trouble thinking right now 🐾.\"},{\"role\":\"user\",\"text\":\"hello\"},{\"role\":\"furly\",\"text\":\"Furly had trouble thinking right now 🐾.\"},{\"role\":\"user\",\"text\":\"hi\"},{\"role\":\"furly\",\"text\":\"Furly had trouble thinking right now 🐾.\"},{\"role\":\"user\",\"text\":\"hi\"},{\"role\":\"furly\",\"text\":\"Furly had trouble thinking right now 🐾.\"},{\"text\":\"rtyu\",\"role\":\"user\"},{\"text\":\"Furly had trouble thinking right now 🐾.\",\"role\":\"furly\"},{\"text\":\"hello\",\"role\":\"user\"},{\"text\":\"Furly had trouble thinking right now 🐾.\",\"role\":\"furly\"}]', NULL, '40280c7a-fea8-435a-abe0-4ec8f7812fd1', '2025-11-02 19:21:39.000000', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `created_at` datetime(6) DEFAULT NULL,
  `id` bigint(20) NOT NULL,
  `pet_id` bigint(20) DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `content` varchar(1000) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `dashboard_stats`
--

CREATE TABLE `dashboard_stats` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `expires_at` datetime(6) NOT NULL,
  `stats_data` text NOT NULL,
  `stats_key` varchar(255) NOT NULL,
  `updated_at` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `likes`
--

CREATE TABLE `likes` (
  `id` bigint(20) NOT NULL,
  `pet_id` bigint(20) DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `pet_user` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `is_read` bit(1) DEFAULT NULL,
  `id` bigint(20) NOT NULL,
  `sender_id` bigint(20) NOT NULL,
  `timestamp` datetime(6) NOT NULL,
  `content` text NOT NULL,
  `receiver_id` bigint(20) NOT NULL,
  `read` bit(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`is_read`, `id`, `sender_id`, `timestamp`, `content`, `receiver_id`, `read`) VALUES
(NULL, 1, 19, '2025-11-09 22:13:18.000000', 'hi', 8, b'0'),
(NULL, 2, 19, '2025-11-09 22:13:34.000000', 'Hello', 3, b'1'),
(NULL, 3, 19, '2025-11-09 22:13:47.000000', 'How are you', 3, b'1'),
(NULL, 4, 3, '2025-11-09 22:14:41.000000', 'hello', 19, b'1'),
(NULL, 5, 3, '2025-11-09 22:25:21.000000', 'hi', 18, b'0'),
(NULL, 6, 19, '2025-11-09 22:26:15.000000', 'hello', 3, b'0'),
(NULL, 7, 19, '2025-11-09 23:07:07.000000', 'hi', 1, b'1'),
(NULL, 8, 19, '2025-11-09 23:07:12.000000', 'hi', 2, b'0'),
(NULL, 9, 19, '2025-11-09 23:07:25.000000', 'test', 18, b'0'),
(NULL, 10, 1, '2025-11-14 14:13:21.000000', 'hello', 2, b'1'),
(NULL, 11, 1, '2025-11-14 15:33:36.000000', 'test', 2, b'1'),
(NULL, 12, 1, '2025-11-14 15:52:56.000000', 'test', 3, b'0'),
(NULL, 13, 1, '2025-11-14 15:53:00.000000', 'hi', 3, b'0'),
(NULL, 14, 1, '2025-11-15 04:35:18.000000', 'hi', 19, b'0'),
(NULL, 15, 1, '2025-11-15 05:46:01.000000', 'hi', 2, b'1'),
(NULL, 16, 1, '2025-11-15 05:58:49.000000', 'This is a simple text message.', 2, b'1'),
(NULL, 17, 2, '2025-11-15 06:00:07.000000', 'Hello', 1, b'1'),
(NULL, 18, 2, '2025-11-15 06:00:16.000000', 'how are you doing', 1, b'1'),
(NULL, 19, 2, '2025-11-15 06:00:23.000000', 'Nice to see you', 1, b'1');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `is_read` bit(1) NOT NULL,
  `message` text NOT NULL,
  `read_at` datetime(6) DEFAULT NULL,
  `related_entity_id` bigint(20) DEFAULT NULL,
  `related_entity_type` enum('ADOPTION','MESSAGE','OTHER','PET','USER') DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `type` enum('ACCOUNT_ACTIVATED','ACCOUNT_SUSPENDED','APPLICATION_APPROVED','APPLICATION_RECEIVED','APPLICATION_REJECTED','NEW_COMMENT','NEW_LIKE','NEW_MESSAGE','OTHER','PET_APPROVED','PET_REJECTED','SHELTER_APPROVED','SHELTER_REJECTED','SHELTER_SUSPENDED','SYSTEM_MESSAGE') NOT NULL,
  `recipient_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pets`
--

CREATE TABLE `pets` (
  `age` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `id` bigint(20) NOT NULL,
  `owner_id` bigint(20) DEFAULT NULL,
  `shelter_id` bigint(20) DEFAULT NULL,
  `breed` varchar(255) NOT NULL,
  `color` varchar(255) DEFAULT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `medical_info` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `species` varchar(255) DEFAULT NULL,
  `vaccination_status` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `adopted_at` datetime(6) DEFAULT NULL,
  `likes_count` int(11) DEFAULT NULL,
  `listing_status` enum('ADOPTED','APPROVED','DRAFT','PENDING_REVIEW','REJECTED') DEFAULT NULL,
  `published_at` datetime(6) DEFAULT NULL,
  `rejection_reason` text DEFAULT NULL,
  `reviewed_at` datetime(6) DEFAULT NULL,
  `reviewed_by` bigint(20) DEFAULT NULL,
  `saves_count` int(11) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `views` int(11) DEFAULT NULL,
  `visibility` enum('PRIVATE','PUBLIC') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pets`
--

INSERT INTO `pets` (`age`, `created_at`, `id`, `owner_id`, `shelter_id`, `breed`, `color`, `description`, `gender`, `image_path`, `image_url`, `location`, `medical_info`, `name`, `species`, `vaccination_status`, `status`, `adopted_at`, `likes_count`, `listing_status`, `published_at`, `rejection_reason`, `reviewed_at`, `reviewed_by`, `saves_count`, `updated_at`, `views`, `visibility`) VALUES
('2', NULL, 3, 1, NULL, 'Persian', NULL, 'A beautiful and friendly Persian cat with soft, fluffy fur and bright green eyes. She loves to cuddle and play with toys.', 'Female', 'uploads/a401da4a-a629-4f41-b900-8be629adc966_cat_15.jpg', 'http://localhost:8080/uploads/a401da4a-a629-4f41-b900-8be629adc966_cat_15.jpg', 'New York', NULL, 'Bella', 'Cat', NULL, 'available', NULL, NULL, 'APPROVED', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'PUBLIC'),
('1', NULL, 4, 1, NULL, 'Persian', NULL, 'Playful and affectionate young Persian cat with a gentle personality. Loves laps and treats.', 'Female', 'uploads/7c1fe8a4-b2c6-48ab-9f73-85328d8b50dd_bella.png', 'http://localhost:8080/uploads/7c1fe8a4-b2c6-48ab-9f73-85328d8b50dd_bella.png', 'Los Angeles', NULL, 'Bella Jr.', 'Cat', NULL, 'available', NULL, NULL, 'APPROVED', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('3', NULL, 5, 1, NULL, 'Mixed', NULL, 'Energetic mixed breed cat who loves to play and cuddle. Very social and gets along well with other pets.', 'Male', 'uploads/b06d18d8-3088-4b1b-89ff-8ff175ee32de_cat_13.jpg', 'http://localhost:8080/uploads/b06d18d8-3088-4b1b-89ff-8ff175ee32de_cat_13.jpg', 'Chicago', NULL, 'Whiskers', 'Cat', NULL, 'available', NULL, NULL, 'APPROVED', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('4', NULL, 6, 1, NULL, 'Siamese', NULL, 'Elegant Siamese cat with striking blue eyes and a vocal personality. Loves attention and interactive play.', 'Female', 'uploads/218fbbf0-d4db-4e95-98e0-b99d10cdefb9_cat_13.jpg', 'http://localhost:8080/uploads/218fbbf0-d4db-4e95-98e0-b99d10cdefb9_cat_13.jpg', 'Boston', NULL, 'Mittens', 'Cat', NULL, 'available', NULL, NULL, 'APPROVED', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('2', NULL, 7, 1, NULL, 'Maine Coon', NULL, 'Large and fluffy Maine Coon cat with a friendly demeanor. Enjoys outdoor adventures and family time.', 'Male', 'uploads/cat_2.jpg', 'http://localhost:8080/uploads/cat_2.jpg', 'Seattle', NULL, 'Shadow', 'Cat', NULL, 'AVAILABLE', NULL, NULL, 'APPROVED', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('1', NULL, 8, 1, NULL, 'Ragdoll', NULL, 'Sweet and docile Ragdoll cat who loves to be held. Perfect for first-time cat owners.', 'Female', 'uploads/cat_3.jpg', 'http://localhost:8080/uploads/cat_3.jpg', 'Austin', NULL, 'Luna', 'Cat', NULL, 'AVAILABLE', NULL, NULL, 'APPROVED', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('3', NULL, 9, 1, NULL, 'Bengal', NULL, 'Active Bengal cat with beautiful spotted coat. Loves to climb and explore. Needs an active home.', 'Male', 'uploads/cat_4.jpg', 'http://localhost:8080/uploads/cat_4.jpg', 'Denver', NULL, 'Tiger', 'Cat', NULL, 'AVAILABLE', NULL, NULL, 'APPROVED', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('2', NULL, 10, 1, NULL, 'Egyptian Mau', NULL, 'Graceful Egyptian Mau with spotted fur and green eyes. Independent yet affectionate.', 'Female', 'uploads/cat_5.jpg', 'http://localhost:8080/uploads/cat_5.jpg', 'Miami', NULL, 'Cleo', 'Cat', NULL, 'AVAILABLE', NULL, NULL, 'APPROVED', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('3', NULL, 11, 1, NULL, 'Labrador Retriever', NULL, 'Friendly Labrador Retriever who loves walks and playing fetch. Great with kids and other dogs.', 'Male', 'uploads/dog_1.jpg', 'http://localhost:8080/uploads/dog_1.jpg', 'San Francisco', NULL, 'Buddy', 'Dog', NULL, 'AVAILABLE', NULL, NULL, 'APPROVED', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('4', NULL, 12, 1, NULL, 'Golden Retriever', NULL, 'Gentle Golden Retriever with a golden coat. Loyal companion who enjoys family activities.', 'Male', 'uploads/dog_2.jpg', 'http://localhost:8080/uploads/dog_2.jpg', 'Phoenix', NULL, 'Max', 'Dog', NULL, 'AVAILABLE', NULL, NULL, 'APPROVED', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('2', NULL, 13, 1, NULL, 'Beagle', NULL, 'Curious Beagle with a keen sense of smell. Energetic and loves outdoor adventures.', 'Female', 'uploads/dog_3.jpg', 'http://localhost:8080/uploads/dog_3.jpg', 'Dallas', NULL, 'Bella Dog', 'Dog', NULL, 'AVAILABLE', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('5', NULL, 14, 1, NULL, 'Bulldog', NULL, 'Calm and loving Bulldog. Prefers relaxed environments and short walks.', 'Male', 'uploads/dog_4.jpg', 'http://localhost:8080/uploads/dog_4.jpg', 'Atlanta', NULL, 'Charlie', 'Dog', NULL, 'AVAILABLE', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('1', NULL, 15, 1, NULL, 'Poodle', NULL, 'Intelligent Poodle puppy who is eager to learn. Hypoallergenic and great for families.', 'Female', 'uploads/dog_5.jpg', 'http://localhost:8080/uploads/dog_5.jpg', 'Portland', NULL, 'Lucy', 'Dog', NULL, 'AVAILABLE', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('2', NULL, 16, 1, NULL, 'Persian', NULL, 'A beautiful and friendly Persian cat with soft, fluffy fur and bright green eyes. She loves to cuddle and play with toys.', 'Female', 'uploads/4739663d-aef6-49f9-9ac2-6fd7222e8015_bella.png', 'http://localhost:8080/uploads/4739663d-aef6-49f9-9ac2-6fd7222e8015_bella.png', 'New York', NULL, 'Bella', 'Cat', NULL, 'AVAILABLE', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('1', NULL, 17, 1, NULL, 'Persian', NULL, 'Playful and affectionate young Persian cat with a gentle personality. Loves laps and treats.', 'Female', 'uploads/4739663d-aef6-49f9-9ac2-6fd7222e8015_bella.png', 'http://localhost:8080/uploads/4739663d-aef6-49f9-9ac2-6fd7222e8015_bella.png', 'Los Angeles', NULL, 'Bella Jr.', 'Cat', NULL, 'AVAILABLE', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'PUBLIC'),
('3', NULL, 18, 1, NULL, 'Mixed', NULL, 'Energetic mixed breed cat who loves to play and cuddle. Very social and gets along well with other pets.', 'Male', 'uploads/4739663d-aef6-49f9-9ac2-6fd7222e8015_bella.png', 'http://localhost:8080/uploads/4739663d-aef6-49f9-9ac2-6fd7222e8015_bella.png', 'Chicago', NULL, 'Whiskers', 'Cat', NULL, 'AVAILABLE', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('4', NULL, 19, 1, NULL, 'Siamese', NULL, 'Elegant Siamese cat with striking blue eyes and a vocal personality. Loves attention and interactive play.', 'Female', 'uploads/4739663d-aef6-49f9-9ac2-6fd7222e8015_bella.png', 'http://localhost:8080/uploads/4739663d-aef6-49f9-9ac2-6fd7222e8015_bella.png', 'Boston', NULL, 'Mittens', 'Cat', NULL, 'AVAILABLE', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('2', NULL, 20, 1, NULL, 'Maine Coon', NULL, 'Large and fluffy Maine Coon cat with a friendly demeanor. Enjoys outdoor adventures and family time.', 'Male', 'uploads/cb43114c-75d5-4f1b-a87f-e43a9f4df370_cat_10.jpg', 'http://localhost:8080/uploads/cb43114c-75d5-4f1b-a87f-e43a9f4df370_cat_10.jpg', 'Seattle', NULL, 'Shadow', 'Cat', NULL, 'AVAILABLE', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('1', NULL, 21, 1, NULL, 'Ragdoll', NULL, 'Sweet and docile Ragdoll cat who loves to be held. Perfect for first-time cat owners.', 'Female', 'uploads/4739663d-aef6-49f9-9ac2-6fd7222e8015_bella.png', 'http://localhost:8080/uploads/4739663d-aef6-49f9-9ac2-6fd7222e8015_bella.png', 'Austin', NULL, 'Luna', 'Cat', NULL, 'AVAILABLE', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('3', NULL, 22, 1, NULL, 'Bengal', NULL, 'Active Bengal cat with beautiful spotted coat. Loves to climb and explore. Needs an active home.', 'Male', 'uploads/4739663d-aef6-49f9-9ac2-6fd7222e8015_bella.png', 'http://localhost:8080/uploads/4739663d-aef6-49f9-9ac2-6fd7222e8015_bella.png', 'Denver', NULL, 'Tiger', 'Cat', NULL, 'AVAILABLE', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('2', NULL, 23, 1, NULL, 'Egyptian Mau', NULL, 'Graceful Egyptian Mau with spotted fur and green eyes. Independent yet affectionate.', 'Female', 'uploads/4739663d-aef6-49f9-9ac2-6fd7222e8015_bella.png', 'http://localhost:8080/uploads/4739663d-aef6-49f9-9ac2-6fd7222e8015_bella.png', 'Miami', NULL, 'Cleo', 'Cat', NULL, 'AVAILABLE', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('3', NULL, 24, 1, NULL, 'Labrador Retriever', NULL, 'Friendly Labrador Retriever who loves walks and playing fetch. Great with kids and other dogs.', 'Male', 'uploads/e9c3a8f7-b56b-4c02-9775-f628f269ff9d_dog_10.jpg', 'http://localhost:8080/uploads/e9c3a8f7-b56b-4c02-9775-f628f269ff9d_dog_10.jpg', 'San Francisco', NULL, 'Buddy', 'Dog', NULL, 'PENDING', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('4', NULL, 25, 1, NULL, 'Golden Retriever', NULL, 'Gentle Golden Retriever with a golden coat. Loyal companion who enjoys family activities.', 'Male', 'uploads/eb26ce6a-b77e-4394-b18f-b811e444d930_dog_4.jpg', 'http://localhost:8080/uploads/eb26ce6a-b77e-4394-b18f-b811e444d930_dog_4.jpg', 'Phoenix', NULL, 'Max', 'Dog', NULL, 'AVAILABLE', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('2', NULL, 26, 1, NULL, 'Beagle', NULL, 'Curious Beagle with a keen sense of smell. Energetic and loves outdoor adventures.', 'Female', 'uploads/4739663d-aef6-49f9-9ac2-6fd7222e8015_bella.png', 'http://localhost:8080/uploads/4739663d-aef6-49f9-9ac2-6fd7222e8015_bella.png', 'Dallas', NULL, 'Bella Dog', 'Dog', NULL, 'AVAILABLE', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('5', NULL, 27, 1, NULL, 'Bulldog', NULL, 'Calm and loving Bulldog. Prefers relaxed environments and short walks.', 'Male', 'uploads/87445d96-8ca0-4f01-b073-6adb63a63ec6_cat_10.jpg', 'http://localhost:8080/uploads/87445d96-8ca0-4f01-b073-6adb63a63ec6_cat_10.jpg', 'Atlanta', NULL, 'Charlie', 'Dog', NULL, 'AVAILABLE', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('1', NULL, 28, 1, NULL, 'Poodle', NULL, 'Intelligent Poodle puppy who is eager to learn. Hypoallergenic and great for families.', 'Female', 'uploads/cc58b0cd-7b15-499a-b6ec-487c68b140f2_cat_11.jpg', 'http://localhost:8080/uploads/cc58b0cd-7b15-499a-b6ec-487c68b140f2_cat_11.jpg', 'Portland', NULL, 'Lucy', 'Dog', NULL, 'AVAILABLE', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('5', '2025-11-09 16:16:57.000000', 30, 18, NULL, 'test', NULL, 'test', 'Female', 'uploads/3f0b42c9-6f36-43ea-929e-a71e1dca3735_photo-1590273466070-40c466b4432d.jpg', 'http://localhost:8080/uploads/3f0b42c9-6f36-43ea-929e-a71e1dca3735_photo-1590273466070-40c466b4432d.jpg', 'Toronto', NULL, 'test', 'Dog', NULL, 'Available', NULL, 0, 'APPROVED', NULL, NULL, NULL, NULL, 0, '2025-11-09 16:16:57.000000', 0, 'PUBLIC');

-- --------------------------------------------------------

--
-- Table structure for table `pet_detections`
--

CREATE TABLE `pet_detections` (
  `id` bigint(20) NOT NULL,
  `analysis` text DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pet_detections`
--

INSERT INTO `pet_detections` (`id`, `analysis`, `image_url`) VALUES
(1, 'As an expert veterinarian AI, I have thoroughly examined the provided image and its various crops.\n\nUpon careful inspection, I must conclude that there is no pet present in this photograph. The image depicts a beautiful, sun-dappled forest floor covered in lush green moss, with numerous tall trees forming a dense canopy. While this looks like an ideal environment for wildlife, no animal that could be considered a \"pet\" is visible within the frame.\n\nTherefore, I am unable to provide a description of a pet\'s species, probable breed, age, color, fur type, size, gender, or emotional state, as none is pictured.', 'upload not stored yet'),
(2, 'As an expert veterinarian, here is a detailed description of the pet in the photo:\n\n**Species:** *Felis catus* (Domestic Cat)\n\n**Probable Breed:** This individual strongly exhibits characteristics consistent with a **British Shorthair**. Key indicators include the robust, cobby body type, broad head, full jowls, round eyes, short and dense plush coat, and the characteristic \'blue\' (grey) coloration.\n\n**Approximate Age:** Based on the fully developed facial structure, prominent jowls, and overall mature body condition without signs of extreme youth or senescence, I would estimate this cat to be a **young to middle-aged adult**, likely between **2 to 6 years old**.\n\n**Color:** The cat is a uniform **solid blue** (a specific shade of grey in cat fancy terminology). There are no visible markings (such as tabby stripes or spots) or patches of other colors.\n\n**Fur Length/Type:** The fur is **short-haired** but appears incredibly **dense and plush**, giving it a luxurious, almost velvet-like texture that stands slightly away from the body. This is characteristic of the British Shorthair\'s double coat, designed for insulation.\n\n**Size:** This cat appears to be of **medium to large size** with a sturdy, muscular, and \"cobby\" (compact and stocky) build, typical for the breed.\n\n**Gender (if guessable):** Given the very prominent, full jowls and broad face, this cat is **highly likely to be a male (tom)**. Intact males of the British Shorthair breed develop these distinctive jowls. While some females can have round faces, they rarely exhibit this degree of facial breadth and jowl development.\n\n**Emotional State:** The cat appears **alert, attentive, and focused**. Its eyes are wide open, pupils round and engaged, directed straight forward. The ears are pricked and slightly angled forward, indicating interest in something in its immediate environment. The mouth is closed, and there are no signs of fear, aggression (like flattened ears or constricted pupils), or extreme relaxation. It seems to be in a state of calm observation or mild curiosity.\n\n**Distinctive Features:**\n*   **Striking Copper/Gold Eyes:** The most prominent feature is the large, round, intensely colored eyes, which are a beautiful contrast to the blue fur. The color appears to be a deep copper or bright gold.\n*   **\"Teddy Bear\" Appearance:** The combination of the round head, full cheeks, short dense fur, and cobby body gives this cat a very endearing, almost \"teddy bear\"-like quality.\n*   **Pronounced Jowls:** As mentioned, the well-developed jowls are a strong breed and gender indicator.\n*   **Whiskers:** Long, prominent white whiskers that fan out from the muzzle.', 'upload not stored yet'),
(3, 'As an expert veterinarian, I\'d describe the pet in this photo as follows:\n\n**Species:** Feline (*Felis catus*)\n\n**Probable Breed:** Domestic Shorthair (DSH). This cat displays no specific breed characteristics of recognized purebreds, suggesting it is a common mixed-breed cat.\n\n**Approximate Age:** This appears to be a juvenile cat, likely a kitten transitioning into a young adult. I would estimate its age to be between **4 to 8 months old**. This is based on its relatively large eyes and head proportion to its body, slender build, and overall youthful appearance.\n\n**Color:** This cat is a **brown tabby and white bi-color**.\n*   **Tabby markings:** Primarily a warm brown base with darker brown to almost black stripes and swirls, particularly noticeable on the forehead (classic \"M\" tabby mark), ears, cheeks, back, and flanks. The pattern appears to be a mix of classic (blotched) tabby on the body and mackerel (striped) tabby on the legs and head.\n*   **White markings:** Extensive and distinct, covering the muzzle, chin, chest (forming a prominent bib), belly, and all four paws (\"socks\"). There\'s a clear white blaze extending upwards between the eyes.\n\n**Fur Length/Type:** The coat is **short, smooth, and lies flat** against the body, characteristic of a Domestic Shorthair. It appears well-groomed and healthy.\n\n**Size:** Consistent with its likely age, it is of a **small to medium build**, still growing but not underweight.\n\n**Gender:** **Cannot be determined** from this frontal photograph alone.\n\n**Emotional State:** The cat appears **calm, curious, and alert**.\n*   Its eyes are wide open, pupils moderately dilated, and gazing directly forward, indicating attention and interest without signs of fear or aggression.\n*   The ears are pricked and forward-facing, further suggesting attentiveness to its surroundings.\n*   Its body posture is relaxed, lying in a typical sphinx-like position with front paws tucked. There are no signs of tension or stress in its facial expression or body.\n\n**Distinctive Features:**\n*   **Striking Eyes:** The cat possesses large, round, and very expressive eyes, appearing a beautiful shade of **green or hazel**.\n*   **White Facial Markings:** The clean, well-defined white muzzle and blaze create a distinctive pattern against its tabby fur.\n*   **Pink Nose:** A prominent, perfectly pink nose contrasts nicely with the white facial markings.\n*   **Clean Bi-color Pattern:** The high contrast between the rich brown tabby and the pure white markings is quite attractive.\n\nOverall, the cat appears to be a healthy, well-socialized, and engaging individual.', 'upload not stored yet');

-- --------------------------------------------------------

--
-- Table structure for table `saved_pets`
--

CREATE TABLE `saved_pets` (
  `id` bigint(20) NOT NULL,
  `saved_at` datetime(6) NOT NULL,
  `pet_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `shelter_info`
--

CREATE TABLE `shelter_info` (
  `id` bigint(20) NOT NULL,
  `approval_status` enum('APPROVED','PENDING','REJECTED') NOT NULL,
  `approved_at` datetime(6) DEFAULT NULL,
  `capacity` int(11) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `documents` text DEFAULT NULL,
  `established_year` int(11) DEFAULT NULL,
  `facility_type` enum('BREEDER','OWNER','RESCUE','SHELTER') NOT NULL,
  `organization_name` varchar(255) NOT NULL,
  `registration_number` varchar(255) DEFAULT NULL,
  `rejection_reason` text DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `approved_by` bigint(20) DEFAULT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `system_settings`
--

CREATE TABLE `system_settings` (
  `id` bigint(20) NOT NULL,
  `category` varchar(255) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `data_type` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `setting_key` varchar(255) NOT NULL,
  `setting_value` text DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `created_at` datetime(6) DEFAULT NULL,
  `id` bigint(20) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `contact` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `picture` varchar(255) DEFAULT NULL,
  `provider` varchar(255) DEFAULT NULL,
  `role` enum('ADMIN','ADOPTER','SHELTER') NOT NULL,
  `bio` text DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `created_by` bigint(20) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `email_notifications` bit(1) DEFAULT NULL,
  `is_system_protected` bit(1) DEFAULT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `profile_visibility` enum('PRIVATE','PUBLIC') DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `status` enum('ACTIVE','PENDING','REJECTED','SUSPENDED') DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `zip_code` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`created_at`, `id`, `address`, `contact`, `email`, `name`, `password`, `picture`, `provider`, `role`, `bio`, `city`, `country`, `created_by`, `date_of_birth`, `email_notifications`, `is_system_protected`, `last_login`, `phone`, `profile_visibility`, `state`, `status`, `updated_at`, `zip_code`) VALUES
('2025-11-04 22:24:00.000000', 1, NULL, NULL, 'husseinsaddam894@gmail.com', 'Saddam Hussain', 'GOOGLE_OAUTH_USER', 'https://lh3.googleusercontent.com/a/ACg8ocJ5TEg1Moc6sKHnsawJON06da-u9EpSD-Maihs6byy0V6qt9YABvw=s96-c', 'google', 'ADMIN', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ACTIVE', '2025-11-15 03:32:36.000000', NULL),
('2025-11-04 22:24:16.000000', 2, NULL, NULL, 'hussainsaddam.np@gmail.com', 'Saddam Hussain Safi (‫سدام حسین‬‎)', 'GOOGLE_OAUTH_USER', 'https://lh3.googleusercontent.com/a/ACg8ocKrKvbL-FXaqq4lbEU16VyEQWbf-ikcpO3ech8-kooLvSh7tyScww=s96-c', 'google', 'ADMIN', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ACTIVE', '2025-11-15 03:16:39.000000', NULL),
('2025-11-07 02:24:26.000000', 3, NULL, NULL, 'saddam@gmail.com', 'saddam', '$2a$10$ywaRiP0KhDz02UFJQjIdGe.lFbKMWmjLNt9RsHxE52QscKKxyjcLC', NULL, 'local', 'ADOPTER', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ACTIVE', '2025-11-15 03:16:27.000000', NULL),
('2025-11-07 10:22:29.000000', 6, NULL, NULL, 'john.admin@furandfeathers.com', 'John Admin', '$2a$10$XPmh.6W8xJvVQYMZwK9bqOUYm5KLdF8vGQXGj8hJqHQqJ9.hKzC0m', NULL, 'local', 'ADMIN', 'Moderator for user and pet approvals', 'Los Angeles', 'USA', 1, '1992-05-15', b'1', b'0', NULL, '+1-800-234-5678', 'PUBLIC', 'CA', 'ACTIVE', '2025-11-07 10:22:29.000000', '90001'),
('2025-11-07 10:22:29.000000', 7, NULL, NULL, 'sarah.admin@furandfeathers.com', 'Sarah Admin', '$2a$10$XPmh.6W8xJvVQYMZwK9bqOUYm5KLdF8vGQXGj8hJqHQqJ9.hKzC0m', NULL, 'local', 'ADMIN', 'Platform moderator and support specialist', 'Chicago', 'USA', 1, '1995-08-22', b'1', b'0', NULL, '+1-800-345-6789', 'PUBLIC', 'IL', 'ACTIVE', '2025-11-07 10:22:29.000000', '60601'),
('2025-11-07 10:22:29.000000', 8, NULL, NULL, 'happy.paws@shelter.com', 'Happy Paws Shelter', '$2a$10$XPmh.6W8xJvVQYMZwK9bqOUYm5KLdF8vGQXGj8hJqHQqJ9.hKzC0m', NULL, 'local', 'SHELTER', 'We provide loving homes for abandoned and rescue dogs and cats', 'Austin', 'USA', NULL, '2010-03-20', b'1', b'0', NULL, '+1-800-456-7890', 'PUBLIC', 'TX', 'ACTIVE', '2025-11-07 10:22:29.000000', '78701'),
('2025-11-07 10:22:29.000000', 9, NULL, NULL, 'rescue.angels@shelter.com', 'Rescue Angels', '$2a$10$XPmh.6W8xJvVQYMZwK9bqOUYm5KLdF8vGQXGj8hJqHQqJ9.hKzC0m', NULL, 'local', 'SHELTER', 'Dedicated to rescuing and rehoming animals in need', 'Denver', 'USA', NULL, '2012-07-15', b'1', b'0', NULL, '+1-800-567-8901', 'PUBLIC', 'CO', 'ACTIVE', '2025-11-07 10:22:29.000000', '80202'),
('2025-11-07 10:22:29.000000', 10, NULL, NULL, 'furry.friends@shelter.com', 'Furry Friends Shelter', '$2a$10$XPmh.6W8xJvVQYMZwK9bqOUYm5KLdF8vGQXGj8hJqHQqJ9.hKzC0m', NULL, 'local', 'SHELTER', 'Cat and small animal rescue organization', 'Portland', 'USA', NULL, '2015-11-10', b'1', b'0', NULL, '+1-800-678-9012', 'PUBLIC', 'OR', 'ACTIVE', '2025-11-15 03:16:46.000000', '97201'),
('2025-11-07 10:22:29.000000', 11, NULL, NULL, 'bayarea.rescue@shelter.com', 'Bay Area Dog Rescue', '$2a$10$XPmh.6W8xJvVQYMZwK9bqOUYm5KLdF8vGQXGj8hJqHQqJ9.hKzC0m', NULL, 'local', 'SHELTER', 'Specialized in large breed dog rescue and rehabilitation', 'San Francisco', 'USA', NULL, '2011-04-05', b'1', b'0', NULL, '+1-800-789-0123', 'PUBLIC', 'CA', 'ACTIVE', '2025-11-07 10:22:29.000000', '94102'),
('2025-11-07 10:23:07.000000', 12, NULL, NULL, 'emily.chen@example.com', 'Emily Chen', '$2a$10$XPmh.6W8xJvVQYMZwK9bqOUYm5KLdF8vGQXGj8hJqHQqJ9.hKzC0m', NULL, 'local', 'ADOPTER', 'Dog lover looking for a furry companion', 'Boston', 'USA', NULL, '1998-12-03', b'1', b'0', NULL, '+1-800-111-2222', 'PUBLIC', 'MA', 'ACTIVE', '2025-11-07 10:23:07.000000', '02101'),
('2025-11-07 10:23:07.000000', 13, NULL, NULL, 'michael.torres@example.com', 'Michael Torres', '$2a$10$XPmh.6W8xJvVQYMZwK9bqOUYm5KLdF8vGQXGj8hJqHQqJ9.hKzC0m', NULL, 'local', 'ADOPTER', 'Cat enthusiast and artist', 'Seattle', 'USA', NULL, '1997-06-18', b'1', b'0', NULL, '+1-800-222-3333', 'PUBLIC', 'WA', 'ACTIVE', '2025-11-07 10:23:07.000000', '98101'),
('2025-11-07 10:23:07.000000', 14, NULL, NULL, 'jessica.williams@example.com', 'Jessica Williams', '$2a$10$XPmh.6W8xJvVQYMZwK9bqOUYm5KLdF8vGQXGj8hJqHQqJ9.hKzC0m', NULL, 'local', 'ADOPTER', 'Family of four looking to adopt a family dog', 'Miami', 'USA', NULL, '1995-09-22', b'1', b'0', NULL, '+1-800-333-4444', 'PUBLIC', 'FL', 'ACTIVE', '2025-11-07 10:23:07.000000', '33101'),
('2025-11-07 10:23:07.000000', 15, NULL, NULL, 'david.park@example.com', 'David Park', '$2a$10$XPmh.6W8xJvVQYMZwK9bqOUYm5KLdF8vGQXGj8hJqHQqJ9.hKzC0m', NULL, 'local', 'ADOPTER', 'Software engineer with flexible work from home schedule', 'San Diego', 'USA', NULL, '1993-02-14', b'1', b'0', NULL, '+1-800-444-5555', 'PUBLIC', 'CA', 'ACTIVE', '2025-11-07 10:23:07.000000', '92101'),
('2025-11-07 10:23:07.000000', 16, NULL, NULL, 'lisa.anderson@example.com', 'Lisa Anderson', '$2a$10$XPmh.6W8xJvVQYMZwK9bqOUYm5KLdF8vGQXGj8hJqHQqJ9.hKzC0m', NULL, 'local', 'ADOPTER', 'Retired teacher looking for animal companionship', 'Phoenix', 'USA', NULL, '1960-07-30', b'1', b'0', NULL, '+1-800-555-6666', 'PUBLIC', 'AZ', 'ACTIVE', '2025-11-07 10:23:07.000000', '85001'),
('2025-11-09 07:08:57.000000', 17, NULL, NULL, 'admin@gmail.com', 'Admin', '$2a$10$yMvX0iefcfhVazjhEq4c/etqjXjB5e7I9rFgmutkz.BB07mMGO7zu', NULL, 'local', 'ADMIN', NULL, NULL, NULL, NULL, NULL, b'1', b'1', NULL, NULL, 'PUBLIC', NULL, 'ACTIVE', '2025-11-09 07:08:57.000000', NULL),
('2025-11-09 16:16:05.000000', 18, NULL, NULL, 'test@gmail.com', 'test', '$2a$10$MEDllrHLIP.1QAp5JTm5MO83q7lSq1VZ4nla.do4kJ27.f5higiGq', NULL, 'local', 'SHELTER', NULL, NULL, NULL, NULL, NULL, b'1', b'0', NULL, NULL, 'PUBLIC', NULL, 'ACTIVE', '2025-11-09 16:16:05.000000', NULL),
('2025-11-09 21:23:45.000000', 19, NULL, NULL, 'test1@gmail.com', 'test', '$2a$10$oZILssiEtyNPTEqooHwhJuEgqIZx4B8wGuBe2c8aYaHigeLOaNwge', NULL, 'local', 'ADOPTER', NULL, NULL, NULL, NULL, NULL, b'1', b'0', NULL, NULL, 'PUBLIC', NULL, 'ACTIVE', '2025-11-09 21:23:45.000000', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_preferences`
--

CREATE TABLE `user_preferences` (
  `id` bigint(20) NOT NULL,
  `activity_level` varchar(255) DEFAULT NULL,
  `has_kids` varchar(255) DEFAULT NULL,
  `has_pets` varchar(255) DEFAULT NULL,
  `home_type` varchar(255) DEFAULT NULL,
  `personality_tag` varchar(255) DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin_actions`
--
ALTER TABLE `admin_actions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK3o7n4nf339mm7a8p685n37k91` (`performed_by`),
  ADD KEY `FK6bx2q3jcgi8mv496nhaj4vl6a` (`target_user_id`);

--
-- Indexes for table `adopter_info`
--
ALTER TABLE `adopter_info`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK402c1ao6gavtyllo78s40dnfe` (`user_id`);

--
-- Indexes for table `adoption_requests`
--
ALTER TABLE `adoption_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `pet_id` (`pet_id`);

--
-- Indexes for table `chat_rooms`
--
ALTER TABLE `chat_rooms`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK23mrfn92ye8lkbepewjiekfp7` (`adopter_id`),
  ADD KEY `FKhm6ua3pd90lb6jvwf751e8306` (`pet_id`),
  ADD KEY `FK83bpykqypyrlckeh74kjtvacr` (`shelter_id`);

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKlyu6qetbg4jx1524yuone1rrs` (`pet_id`),
  ADD KEY `FK8omq0tc18jd43bu5tjh6jvraq` (`user_id`);

--
-- Indexes for table `dashboard_stats`
--
ALTER TABLE `dashboard_stats`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKe31x7hjg9ju2x4hjcuctet0db` (`stats_key`);

--
-- Indexes for table `likes`
--
ALTER TABLE `likes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK8yooxn91yhu2a5eivw6mxp4i1` (`pet_user`),
  ADD KEY `FKgrjbvm9fg0mpijiyhclxgg0v9` (`pet_id`),
  ADD KEY `FKnvx9seeqqyy71bij291pwiwrg` (`user_id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK4ui4nnwntodh6wjvck53dbk9m` (`sender_id`),
  ADD KEY `FKt05r0b6n0iis8u7dfna4xdh73` (`receiver_id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKqqnsjxlwleyjbxlmm213jaj3f` (`recipient_id`);

--
-- Indexes for table `pets`
--
ALTER TABLE `pets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKoygstexeo9ivoylgrdrv2tc39` (`owner_id`),
  ADD KEY `FKc09sn5cs8xg5l4m9q5mtk490a` (`shelter_id`);

--
-- Indexes for table `pet_detections`
--
ALTER TABLE `pet_detections`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `saved_pets`
--
ALTER TABLE `saved_pets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKkyo0je935j1ye1koym7dd7615` (`pet_id`),
  ADD KEY `FKlvbjk4eaf0xws8cefm9j59swi` (`user_id`);

--
-- Indexes for table `shelter_info`
--
ALTER TABLE `shelter_info`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK9ury8yb557pkw765w65s71eof` (`user_id`),
  ADD KEY `FK5bmqgotyma4utggv5s5dqb07` (`approved_by`);

--
-- Indexes for table `system_settings`
--
ALTER TABLE `system_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKnm18l4pyovtvd8y3b3x0l2y64` (`setting_key`),
  ADD KEY `FKda4dsfh0rkqhmq0bo7plxiqm3` (`updated_by`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`);

--
-- Indexes for table `user_preferences`
--
ALTER TABLE `user_preferences`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin_actions`
--
ALTER TABLE `admin_actions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `adopter_info`
--
ALTER TABLE `adopter_info`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `adoption_requests`
--
ALTER TABLE `adoption_requests`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `chat_rooms`
--
ALTER TABLE `chat_rooms`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `dashboard_stats`
--
ALTER TABLE `dashboard_stats`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `likes`
--
ALTER TABLE `likes`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pets`
--
ALTER TABLE `pets`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `pet_detections`
--
ALTER TABLE `pet_detections`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `saved_pets`
--
ALTER TABLE `saved_pets`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `shelter_info`
--
ALTER TABLE `shelter_info`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `system_settings`
--
ALTER TABLE `system_settings`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `user_preferences`
--
ALTER TABLE `user_preferences`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admin_actions`
--
ALTER TABLE `admin_actions`
  ADD CONSTRAINT `FK3o7n4nf339mm7a8p685n37k91` FOREIGN KEY (`performed_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `FK6bx2q3jcgi8mv496nhaj4vl6a` FOREIGN KEY (`target_user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `adopter_info`
--
ALTER TABLE `adopter_info`
  ADD CONSTRAINT `FKptljbs251fqj84xsvh5hinw7x` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `adoption_requests`
--
ALTER TABLE `adoption_requests`
  ADD CONSTRAINT `adoption_requests_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `adoption_requests_ibfk_2` FOREIGN KEY (`pet_id`) REFERENCES `pets` (`id`);

--
-- Constraints for table `chat_rooms`
--
ALTER TABLE `chat_rooms`
  ADD CONSTRAINT `FK23mrfn92ye8lkbepewjiekfp7` FOREIGN KEY (`adopter_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `FK83bpykqypyrlckeh74kjtvacr` FOREIGN KEY (`shelter_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `FKhm6ua3pd90lb6jvwf751e8306` FOREIGN KEY (`pet_id`) REFERENCES `pets` (`id`);

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `FK8omq0tc18jd43bu5tjh6jvraq` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `FKlyu6qetbg4jx1524yuone1rrs` FOREIGN KEY (`pet_id`) REFERENCES `pets` (`id`);

--
-- Constraints for table `likes`
--
ALTER TABLE `likes`
  ADD CONSTRAINT `FKgrjbvm9fg0mpijiyhclxgg0v9` FOREIGN KEY (`pet_id`) REFERENCES `pets` (`id`),
  ADD CONSTRAINT `FKnvx9seeqqyy71bij291pwiwrg` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `FK4ui4nnwntodh6wjvck53dbk9m` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `FKt05r0b6n0iis8u7dfna4xdh73` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `FKqqnsjxlwleyjbxlmm213jaj3f` FOREIGN KEY (`recipient_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `pets`
--
ALTER TABLE `pets`
  ADD CONSTRAINT `FKc09sn5cs8xg5l4m9q5mtk490a` FOREIGN KEY (`shelter_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `FKoygstexeo9ivoylgrdrv2tc39` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `saved_pets`
--
ALTER TABLE `saved_pets`
  ADD CONSTRAINT `FKkyo0je935j1ye1koym7dd7615` FOREIGN KEY (`pet_id`) REFERENCES `pets` (`id`),
  ADD CONSTRAINT `FKlvbjk4eaf0xws8cefm9j59swi` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `shelter_info`
--
ALTER TABLE `shelter_info`
  ADD CONSTRAINT `FK5bmqgotyma4utggv5s5dqb07` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `FKcdljqhlx1bm45ioc7q9modr9k` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `system_settings`
--
ALTER TABLE `system_settings`
  ADD CONSTRAINT `FKda4dsfh0rkqhmq0bo7plxiqm3` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
