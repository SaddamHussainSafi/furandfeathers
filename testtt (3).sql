-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Nov 04, 2025 at 08:39 PM
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
  `id` bigint(20) NOT NULL,
  `content` varchar(1000) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `pet_id` bigint(20) DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`id`, `content`, `created_at`, `pet_id`, `user_id`) VALUES
(1, 'i like thsi pet too much.', '2025-10-28 23:18:37.000000', 3, 1),
(2, 'Loved it', '2025-10-28 23:18:44.000000', 3, 1),
(3, 'awesome\n', '2025-11-04 14:51:12.000000', 12, 2);

-- --------------------------------------------------------

--
-- Table structure for table `likes`
--

CREATE TABLE `likes` (
  `id` bigint(20) NOT NULL,
  `pet_user` varchar(255) DEFAULT NULL,
  `pet_id` bigint(20) DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `likes`
--

INSERT INTO `likes` (`id`, `pet_user`, `pet_id`, `user_id`) VALUES
(4, '12_2', 12, 2);

-- --------------------------------------------------------

--
-- Table structure for table `pets`
--

CREATE TABLE `pets` (
  `id` bigint(20) NOT NULL,
  `age` varchar(255) DEFAULT NULL,
  `breed` varchar(255) DEFAULT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `species` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `owner_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pets`
--

INSERT INTO `pets` (`id`, `age`, `breed`, `description`, `gender`, `image_path`, `image_url`, `location`, `name`, `species`, `status`, `owner_id`) VALUES
(3, '2 years', 'Persian', 'A beautiful and friendly Persian cat with soft, fluffy fur and bright green eyes. She loves to cuddle and play with toys.', 'Female', 'uploads/a401da4a-a629-4f41-b900-8be629adc966_cat_15.jpg', 'http://localhost:8080/uploads/a401da4a-a629-4f41-b900-8be629adc966_cat_15.jpg', 'New York', 'Bella', 'Cat', 'Available', 1),
(4, '1 year', 'Persian', 'Playful and affectionate young Persian cat with a gentle personality. Loves laps and treats.', 'Female', 'uploads/7c1fe8a4-b2c6-48ab-9f73-85328d8b50dd_bella.png', 'http://localhost:8080/uploads/7c1fe8a4-b2c6-48ab-9f73-85328d8b50dd_bella.png', 'Los Angeles', 'Bella Jr.', 'Cat', 'Available', 1),
(5, '3 years', 'Mixed', 'Energetic mixed breed cat who loves to play and cuddle. Very social and gets along well with other pets.', 'Male', 'uploads/b06d18d8-3088-4b1b-89ff-8ff175ee32de_cat_13.jpg', 'http://localhost:8080/uploads/b06d18d8-3088-4b1b-89ff-8ff175ee32de_cat_13.jpg', 'Chicago', 'Whiskers', 'Cat', 'Available', 1),
(6, '4 years', 'Siamese', 'Elegant Siamese cat with striking blue eyes and a vocal personality. Loves attention and interactive play.', 'Female', 'uploads/218fbbf0-d4db-4e95-98e0-b99d10cdefb9_cat_13.jpg', 'http://localhost:8080/uploads/218fbbf0-d4db-4e95-98e0-b99d10cdefb9_cat_13.jpg', 'Boston', 'Mittens', 'Cat', 'Available', 1),
(7, '2 years', 'Maine Coon', 'Large and fluffy Maine Coon cat with a friendly demeanor. Enjoys outdoor adventures and family time.', 'Male', 'uploads/cat_2.jpg', 'http://localhost:8080/uploads/cat_2.jpg', 'Seattle', 'Shadow', 'Cat', 'Available', 1),
(8, '1 year', 'Ragdoll', 'Sweet and docile Ragdoll cat who loves to be held. Perfect for first-time cat owners.', 'Female', 'uploads/cat_3.jpg', 'http://localhost:8080/uploads/cat_3.jpg', 'Austin', 'Luna', 'Cat', 'Available', 1),
(9, '3 years', 'Bengal', 'Active Bengal cat with beautiful spotted coat. Loves to climb and explore. Needs an active home.', 'Male', 'uploads/cat_4.jpg', 'http://localhost:8080/uploads/cat_4.jpg', 'Denver', 'Tiger', 'Cat', 'Available', 1),
(10, '2 years', 'Egyptian Mau', 'Graceful Egyptian Mau with spotted fur and green eyes. Independent yet affectionate.', 'Female', 'uploads/cat_5.jpg', 'http://localhost:8080/uploads/cat_5.jpg', 'Miami', 'Cleo', 'Cat', 'Available', 1),
(11, '3 years', 'Labrador Retriever', 'Friendly Labrador Retriever who loves walks and playing fetch. Great with kids and other dogs.', 'Male', 'uploads/dog_1.jpg', 'http://localhost:8080/uploads/dog_1.jpg', 'San Francisco', 'Buddy', 'Dog', 'Available', 1),
(12, '4 years', 'Golden Retriever', 'Gentle Golden Retriever with a golden coat. Loyal companion who enjoys family activities.', 'Male', 'uploads/dog_2.jpg', 'http://localhost:8080/uploads/dog_2.jpg', 'Phoenix', 'Max', 'Dog', 'Available', 1),
(13, '2 years', 'Beagle', 'Curious Beagle with a keen sense of smell. Energetic and loves outdoor adventures.', 'Female', 'uploads/dog_3.jpg', 'http://localhost:8080/uploads/dog_3.jpg', 'Dallas', 'Bella Dog', 'Dog', 'Available', 1),
(14, '5 years', 'Bulldog', 'Calm and loving Bulldog. Prefers relaxed environments and short walks.', 'Male', 'uploads/dog_4.jpg', 'http://localhost:8080/uploads/dog_4.jpg', 'Atlanta', 'Charlie', 'Dog', 'Available', 1),
(15, '1 year', 'Poodle', 'Intelligent Poodle puppy who is eager to learn. Hypoallergenic and great for families.', 'Female', 'uploads/dog_5.jpg', 'http://localhost:8080/uploads/dog_5.jpg', 'Portland', 'Lucy', 'Dog', 'Available', 1),
(16, '2 years', 'Persian', 'A beautiful and friendly Persian cat with soft, fluffy fur and bright green eyes. She loves to cuddle and play with toys.', 'Female', 'uploads/4739663d-aef6-49f9-9ac2-6fd7222e8015_bella.png', 'http://localhost:8080/uploads/4739663d-aef6-49f9-9ac2-6fd7222e8015_bella.png', 'New York', 'Bella', 'Cat', 'Available', 1),
(17, '1 year', 'Persian', 'Playful and affectionate young Persian cat with a gentle personality. Loves laps and treats.', 'Female', 'uploads/4739663d-aef6-49f9-9ac2-6fd7222e8015_bella.png', 'http://localhost:8080/uploads/4739663d-aef6-49f9-9ac2-6fd7222e8015_bella.png', 'Los Angeles', 'Bella Jr.', 'Cat', 'Available', 1),
(18, '3 years', 'Mixed', 'Energetic mixed breed cat who loves to play and cuddle. Very social and gets along well with other pets.', 'Male', 'uploads/4739663d-aef6-49f9-9ac2-6fd7222e8015_bella.png', 'http://localhost:8080/uploads/4739663d-aef6-49f9-9ac2-6fd7222e8015_bella.png', 'Chicago', 'Whiskers', 'Cat', 'Available', 1),
(19, '4 years', 'Siamese', 'Elegant Siamese cat with striking blue eyes and a vocal personality. Loves attention and interactive play.', 'Female', 'uploads/4739663d-aef6-49f9-9ac2-6fd7222e8015_bella.png', 'http://localhost:8080/uploads/4739663d-aef6-49f9-9ac2-6fd7222e8015_bella.png', 'Boston', 'Mittens', 'Cat', 'Available', 1),
(20, '2 years', 'Maine Coon', 'Large and fluffy Maine Coon cat with a friendly demeanor. Enjoys outdoor adventures and family time.', 'Male', 'uploads/cb43114c-75d5-4f1b-a87f-e43a9f4df370_cat_10.jpg', 'http://localhost:8080/uploads/cb43114c-75d5-4f1b-a87f-e43a9f4df370_cat_10.jpg', 'Seattle', 'Shadow', 'Cat', 'Available', 1),
(21, '1 year', 'Ragdoll', 'Sweet and docile Ragdoll cat who loves to be held. Perfect for first-time cat owners.', 'Female', 'uploads/4739663d-aef6-49f9-9ac2-6fd7222e8015_bella.png', 'http://localhost:8080/uploads/4739663d-aef6-49f9-9ac2-6fd7222e8015_bella.png', 'Austin', 'Luna', 'Cat', 'Available', 1),
(22, '3 years', 'Bengal', 'Active Bengal cat with beautiful spotted coat. Loves to climb and explore. Needs an active home.', 'Male', 'uploads/4739663d-aef6-49f9-9ac2-6fd7222e8015_bella.png', 'http://localhost:8080/uploads/4739663d-aef6-49f9-9ac2-6fd7222e8015_bella.png', 'Denver', 'Tiger', 'Cat', 'Available', 1),
(23, '2 years', 'Egyptian Mau', 'Graceful Egyptian Mau with spotted fur and green eyes. Independent yet affectionate.', 'Female', 'uploads/4739663d-aef6-49f9-9ac2-6fd7222e8015_bella.png', 'http://localhost:8080/uploads/4739663d-aef6-49f9-9ac2-6fd7222e8015_bella.png', 'Miami', 'Cleo', 'Cat', 'Available', 1),
(24, '3 years', 'Labrador Retriever', 'Friendly Labrador Retriever who loves walks and playing fetch. Great with kids and other dogs.', 'Male', 'uploads/e9c3a8f7-b56b-4c02-9775-f628f269ff9d_dog_10.jpg', 'http://localhost:8080/uploads/e9c3a8f7-b56b-4c02-9775-f628f269ff9d_dog_10.jpg', 'San Francisco', 'Buddy', 'Dog', 'Pending', 1),
(25, '4 years', 'Golden Retriever', 'Gentle Golden Retriever with a golden coat. Loyal companion who enjoys family activities.', 'Male', 'uploads/eb26ce6a-b77e-4394-b18f-b811e444d930_dog_4.jpg', 'http://localhost:8080/uploads/eb26ce6a-b77e-4394-b18f-b811e444d930_dog_4.jpg', 'Phoenix', 'Max', 'Dog', 'Available', 1),
(26, '2 years', 'Beagle', 'Curious Beagle with a keen sense of smell. Energetic and loves outdoor adventures.', 'Female', 'uploads/4739663d-aef6-49f9-9ac2-6fd7222e8015_bella.png', 'http://localhost:8080/uploads/4739663d-aef6-49f9-9ac2-6fd7222e8015_bella.png', 'Dallas', 'Bella Dog', 'Dog', 'Available', 1),
(27, '5 years', 'Bulldog', 'Calm and loving Bulldog. Prefers relaxed environments and short walks.', 'Male', 'uploads/87445d96-8ca0-4f01-b073-6adb63a63ec6_cat_10.jpg', 'http://localhost:8080/uploads/87445d96-8ca0-4f01-b073-6adb63a63ec6_cat_10.jpg', 'Atlanta', 'Charlie', 'Dog', 'Available', 1),
(28, '1 year', 'Poodle', 'Intelligent Poodle puppy who is eager to learn. Hypoallergenic and great for families.', 'Female', 'uploads/cc58b0cd-7b15-499a-b6ec-487c68b140f2_cat_11.jpg', 'http://localhost:8080/uploads/cc58b0cd-7b15-499a-b6ec-487c68b140f2_cat_11.jpg', 'Portland', 'Lucy', 'Dog', 'Available', 1),
(29, 'tyuio', 'r', 'fghj', 'fg', 'uploads/492292db-c5b6-419e-83e3-307789b9e991_7c1fe8a4-b2c6-48ab-9f73-85328d8b50dd_bella.png', 'http://localhost:8080/uploads/492292db-c5b6-419e-83e3-307789b9e991_7c1fe8a4-b2c6-48ab-9f73-85328d8b50dd_bella.png', 'fghj', 'rtyui', 'rtyu', 'Available', 2);

-- --------------------------------------------------------

--
-- Table structure for table `pet_detections`
--

CREATE TABLE `pet_detections` (
  `id` bigint(20) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `analysis` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pet_detections`
--

INSERT INTO `pet_detections` (`id`, `image_url`, `analysis`, `created_at`) VALUES
(1, 'upload not stored yet', 'As an expert veterinarian AI, here is a detailed description of the pet in the photo:\n\n*   **Species:** Feline (Domestic Cat, *Felis catus*).\n\n*   **Probable Breed:** This individual strongly exhibits the classic characteristics of a **British Shorthair**. Key indicators include the dense, plush \"blue\" (a dilute grey) coat, the distinctive rounded head with full cheeks, and particularly the large, round, intensely copper-gold eyes. The robust, cobby (sturdy and compact) body type also aligns with the breed standard.\n\n*   **Approximate Age:** The cat appears to be a healthy, fully mature adult. There are no signs of kitten features (disproportionately large head/paws, wispy fur) or senior features (greying, visible joint stiffness, dull coat). I would estimate the age to be between **2 and 6 years old (young to middle-aged adult)**.\n\n*   **Color:** The primary coat color is a solid **\"blue,\"** which in cat genetics refers to a dilute black, appearing as a slate grey. The fur has a soft, almost velvety appearance, characteristic of the British Shorthair\'s plush double coat. The eyes are a striking **intense copper-gold to amber** color, contrasting beautifully with the blue fur.\n\n*   **Fur Length/Type:** This cat has a **short to medium-short, very dense, plush double coat**. It stands slightly away from the body, giving the cat a solid, rounded appearance. It\'s not a longhair, nor is it a sleek, tight shorthair like a Siamese or Russian Blue.\n\n*   **Size:** Based on the typical British Shorthair build, this cat appears to be of **medium to large size** for a domestic feline, with a robust and cobby (sturdy, well-muscled) frame. It looks to be a healthy weight.\n\n*   **Gender (if guessable):** While definitive gender determination is difficult from a single photo without a clear view of the entire body or specific secondary sexual characteristics, the very broad, round head and robust build *might* lean slightly towards a **male**. Intact males of this breed often develop more prominent jowls and a broader head. However, well-built females can also possess a similar head shape, so this is speculative.\n\n*   **Emotional State:** The cat\'s emotional state appears to be one of **alertness and focus**. The eyes are wide and directly fixed on something (likely the photographer), the ears are pricked forward and slightly rotated, indicating engagement with its environment. The whiskers are spread and forward. There are no signs of aggression (flattened ears, narrowed pupils, hissing) or fear (crouching, dilated pupils). It appears calm but attentive, perhaps **curious or watchful**.\n\n*   **Distinctive Features:**\n    *   **Intense Copper-Gold Eyes:** These are exceptionally striking and a hallmark of the British Shorthair breed.\n    *   **Rounded Features:** The distinctly round head, full cheeks, and overall cobby body shape contribute to the breed\'s \"teddy bear\" look.\n    *   **Plush Blue Coat:** The dense, velvety blue fur is another defining characteristic.\n    *   No unusual markings, scars, or physical anomalies are visible in this photograph. The background of soft, blurred lights adds to the visual appeal but is not a feature of the pet itself.', '2025-10-29 03:29:55'),
(2, 'upload not stored yet', 'As an expert veterinarian, here is a detailed description of the pet in the provided photo:\n\n**Species:** Canine (Dog)\n\n**Probable Breed:** The dog exhibits classic characteristics of an **Australian Shepherd**. This is strongly indicated by its tricolor coat pattern, medium build, expressive eyes, and facial markings.\n\n**Approximate Age:** The dog appears to be a **young to middle-aged adult**, likely between 1 and 5 years old. Its coat is full and vibrant, its musculature is well-developed, and there are no visible signs of juvenile features (e.g., puppy fat, disproportionate limbs) or advanced aging (e.g., graying muzzle, cloudy eyes, decreased muscle tone).\n\n**Color:** The dog has a striking **tricolor coat: black, white, and tan/copper (often referred to as \'tri-black\' or \'black tri\')**.\n*   **Black:** The primary body color, covering the back, sides, and parts of the head and ears.\n*   **White:** A prominent white blaze runs up the center of the muzzle and forehead. There is also a substantial white \"collar\" or bib on the chest, extending down the front legs to the paws. The front paws are fully white, and the hind paws appear to have white markings as well.\n*   **Tan/Copper:** Rich tan or copper points are clearly visible above the eyes (eyebrows), on the cheeks/muzzle sides, under the ears, on the shoulders, and on the legs, complementing the black and white.\n\n**Fur Length/Type:** The fur is **medium to long**, appearing thick and somewhat wavy or feathered, especially around the chest, belly, and legs (known as \"furnishings\"). It suggests a double coat, typical of herding breeds, providing good insulation. The coat looks healthy and well-maintained.\n\n**Size:** Based on typical Australian Shepherd characteristics and its overall appearance, this dog is a **medium-sized breed**. It appears sturdy and well-proportioned.\n\n**Gender (if guessable):** It is **difficult to definitively determine gender** from this single photograph, as no obvious secondary sexual characteristics are clearly visible.\n\n**Emotional State:** The dog\'s emotional state appears to be **joyful, alert, and engaged**. Its bright, open eyes are focused forward, its mouth is relaxed and open in a \"smile\" with the tongue slightly out, indicating happiness and possibly panting from exertion or excitement. The ears are perked, suggesting alertness and interest in its surroundings or an interaction. The overall posture is confident and relaxed.\n\n**Distinctive Features:**\n*   **Vivid Tricolor Markings:** The crisp lines between the black, white, and copper are particularly striking.\n*   **Expressive Eyes:** The dog possesses intelligent, amber-brown eyes that convey attentiveness and warmth.\n*   **Healthy Coat:** The fur is exceptionally shiny and well-groomed, indicating good health and care.\n*   **Natural Tail:** Unlike some Australian Shepherds that are traditionally docked, this dog appears to have a full, natural tail, though only a portion is visible.\n*   **Black Nose:** A solid black nose completes the facial features.', '2025-10-29 03:31:23'),
(3, 'upload not stored yet', 'Alright, let\'s take a closer look at this adorable patient.\n\n**Detailed Pet Description:**\n\n*   **Species:** *Felis catus* (Domestic Cat)\n*   **Probable Breed:** Likely a Domestic Longhair (DLH) or a DLH mix. While its prominent ear tufts, fluffy coat, and slightly wild appearance might suggest some influence from breeds like a Maine Coon or Norwegian Forest Cat, it\'s too young for a definitive breed identification beyond a general longhair type.\n*   **Approximate Age:** This kitten appears to be approximately **8-12 weeks old**. Its small size, bright, still-developing eye color (often blue/green in young kittens before changing to their adult color), and visible small, sharp milk teeth (though not all are perfectly clear, the ones visible are kitten-sized) are consistent with this age range.\n*   **Color:** Predominantly **solid black**. However, upon closer inspection, especially around the ruff and legs, there\'s a subtle brownish or reddish undertone visible in certain lighting conditions. This is common in some black cats and can sometimes indicate a very faint \"ghost tabby\" pattern or sun bleaching.\n*   **Fur Length/Type:** **Long, soft, and quite voluminous/fluffy.** It appears to have a thick undercoat, contributing to its shaggy and abundant appearance. There are noticeable tufts of fur around the ears and a developing ruff (mane-like fur) around the neck.\n*   **Size:** Very small, consistent with a kitten of its estimated age. It likely weighs between **1.5 to 3 pounds**. It appears to be of a healthy weight for its size.\n*   **Gender:** Cannot be determined from this photograph, as external genitalia are not visible.\n*   **Emotional State:** **Alert, curious, and playful.** The wide-open mouth with visible teeth and tongue suggests it is in the midst of a vocalization – likely a playful meow, chirp, or even a tiny \'growl\' during a moment of excitement or interaction. Its wide, bright eyes indicate strong engagement with its surroundings (or the photographer), and its ears are forward and attentive. The overall posture in the soft pet bed appears comfortable and relaxed, indicating a secure and content environment. There are no signs of fear, aggression, or distress.\n*   **Distinctive Features:**\n    *   **Striking Eyes:** Bright, blue-green eyes that are particularly captivating against its dark fur.\n    *   **Ear Tufts:** Prominent tufts of fur extending from the tips of its ears, a charming feature common in long-haired breeds and DLH cats.\n    *   **Fluffy Ruff:** A noticeable and already quite fluffy \"mane\" or ruff developing around its neck and chest.\n    *   **Vocal Expression:** The dynamic and engaging expression of its open mouth mid-vocalization.\n    *   **Overall Fluffiness:** Its abundant and somewhat unkempt fluffy coat gives it a very endearing, slightly mischievous, and \"wild\" kitten appearance.', '2025-10-29 13:09:15'),
(4, 'upload not stored yet', 'Based on the provided image, here is a detailed description of the pet:\n\n**Species:** *Felis catus* (Domestic Cat)\n\n**Probable Breed:** Given the coat pattern and apparent fur length, this cat is most likely a **Domestic Shorthair (DSH) or Domestic Medium Hair (DMH)**. There are no distinct morphological features (like ear shape, facial structure, or extreme body type) that suggest a specific purebred lineage. The slightly denser fur around the ears and neck could lean towards DMH.\n\n**Approximate Age:** This appears to be a **mature adult cat**. The eyes are clear and bright, the musculature around the face seems well-developed, and there are no signs of kittenish features (e.g., disproportionately large eyes, very small size) or advanced senior age (e.g., significant greying, dental issues visible as sunken cheeks, very thin appearance). I would estimate the age to be approximately **3-7 years old**.\n\n**Color:** The cat exhibits a **bicolor black and white \"Tuxedo\" pattern**.\n*   The primary body color appears black.\n*   The face has a prominent white blaze starting between the eyes and extending down the muzzle, surrounding the nose and mouth, and covering the entire chin and throat.\n*   The chest and likely the belly are also white.\n*   The whiskers are entirely white.\n\n**Fur Length/Type:** The fur appears to be **medium-short and dense**. It is not a sleek, very short coat, nor is it long and flowing. There are noticeable white tufts of fur inside the ears and extending slightly beyond the ear edges, which is more common in DMH or denser-coated DSH cats. The texture appears soft and well-maintained.\n\n**Size:** Based on the head and neck size, this appears to be a **medium-sized domestic cat** with a robust, healthy body condition. It does not look underweight or overweight from this perspective.\n\n**Gender:** **Cannot definitively determine gender** from this headshot alone.\n\n**Emotional State:** The cat\'s emotional state appears to be **alert, observant, and calm**.\n*   The eyes are wide open, pupils are moderately dilated (suggesting either normal light conditions or a mild level of alertness/interest).\n*   The gaze is direct and focused.\n*   The ears are pricked forward and slightly rotated, indicating keen attention to something in its environment.\n*   The mouth is closed, and there are no signs of tension or aggression in the facial muscles (e.g., flattened ears, hissing, squinting, excessive whisker retraction). It projects a sense of confidence and composure.\n\n**Distinctive Features:**\n*   **Facial Markings:** The most striking feature is the **unique black marking on the white muzzle**, creating a distinct \"mustache\" or \"goatee\" appearance below the nose and extending across the upper lip area. This gives the cat a very individual and memorable look.\n*   **Whiskers:** Very long, prominent, and entirely white whiskers, especially the mystacial (muzzle) whiskers and the superciliary (eyebrow) whiskers, which stand out against the black fur.\n*   **Ear Tufting:** Noticeable white inner ear tufts of fur.\n*   **Eye Color:** Piercing **golden-yellow eyes** that contrast sharply with the black fur, giving it an intense gaze.', '2025-10-29 13:13:11'),
(5, 'upload not stored yet', 'As an expert veterinarian AI, I must inform you that the individual depicted in the provided photo is a human, not an animal or pet.\n\nTherefore, I am unable to provide a description of a \"pet\" using categories like species, probable breed, fur length/type, or size relevant to an animal. The image shows a human male.', '2025-10-29 13:14:25'),
(6, 'upload not stored yet', 'As an expert veterinarian AI, here is a detailed description of the pet in the photo:\n\n**Species:** *Felis catus* (Domestic Cat)\n\n**Probable Breed:** This individual strongly exhibits characteristics of a **British Shorthair**. Key indicators include:\n*   **Body Type:** Appears stocky, muscular, and compact (often described as \"cobby\").\n*   **Head:** Very round head, full cheeks, and well-developed jowls.\n*   **Ears:** Small, widely set, and rounded at the tips.\n*   **Eyes:** Large, round, and intensely colored.\n*   **Coat:** Dense, plush, and short, standing away from the body, giving it a soft, almost teddy bear-like appearance.\n*   **Color:** Classic \"British Blue\" (solid blue-gray).\n\n**Approximate Age:** Based on the full jowls, robust body condition, and mature facial features, this cat appears to be a prime **adult**, likely between **2 and 6 years old**. It is past the kitten stage and shows no signs of senior age (such as thinning fur, cloudy eyes, or a gaunt appearance).\n\n**Color:** The fur is a uniform, solid **blue-gray** throughout, without any tabby markings, white patches, or other color variations. This is a highly characteristic color for the British Shorthair breed.\n\n**Fur Length/Type:** The fur is **short to medium length**, very dense, and plush. It has a thick, soft texture, often described as a \"double coat\" that stands away from the body, contributing to the breed\'s signature \"plush toy\" look.\n\n**Size:** This cat appears to be a **medium-large** size for a domestic cat, consistent with the British Shorthair breed standard, which describes them as powerful and well-built animals. It looks healthy and well-conditioned, not appearing overweight or underweight.\n\n**Gender (if guessable):** While definitive gender identification is impossible from a single photo without anatomical cues, the very full, rounded jowls and broad head are often more pronounced in adult **males**, especially intact males, although neutered males and some females can also have quite round faces. It slightly suggests a male, but this is a soft guess.\n\n**Emotional State:** The cat appears **alert, observant, and focused**. Its ears are pricked forward and slightly rotated, indicating attention. The eyes are wide and directly engaged, possibly with the photographer or something in its environment. The pupils are moderately dilated, which can indicate interest, curiosity, or a low level of arousal/excitement. The overall posture is calm and collected, suggesting confidence rather than fear or aggression. It seems to be in a state of quiet contemplation or gentle observation.\n\n**Distinctive Features:**\n*   **Striking Copper/Gold Eyes:** The most prominent feature is the intense, round, copper or gold-colored eyes, which provide a vivid contrast against the blue fur.\n*   **\"Plush Toy\" Appearance:** The combination of the dense blue fur, round head, and stocky build gives it a very endearing, almost toy-like quality.\n*   **Well-developed Jowls:** The full, rounded cheeks are a hallmark of the breed and are very noticeable in this individual.', '2025-10-31 14:22:05'),
(7, 'upload not stored yet', 'As an expert veterinarian AI, here is a detailed description of the pet in the photo:\n\n**Species:** *Felis catus* (Domestic Cat)\n\n**Probable Breed:** Given the physical characteristics, this cat is most likely a **Domestic Medium Hair (DMH)** or a Domestic Shorthair (DSH) with slightly longer fur. There are no definitive features to suggest a specific purebred lineage; it exhibits typical mixed-breed cat traits. The slight fluffiness around the neck and prominent ear furnishings lean towards DMH.\n\n**Approximate Age:** This cat appears to be a mature **adult**, likely in the range of **3-7 years old**. Its features are well-developed, musculature seems adequate (though mostly obscured), and there are no visible signs of extreme youth (kitten-like features) or advanced age (such as significant graying, cloudy eyes, or pronounced loss of muscle mass). The eyes are clear and bright.\n\n**Color:** The cat exhibits a classic **black and white bicolor** coat pattern, often referred to as a \"tuxedo\" cat.\n*   The dominant color is black, covering the top of the head, ears, most of the back, and flanks.\n*   White fur is present on the muzzle, a distinctive blaze running down the bridge of the nose and between the eyes, the chin, the entire chest, and likely the belly and paws (though not visible in this close-up).\n*   The whiskers are notably long and pure white.\n*   The inner ear furnishings (tufts) are also white.\n*   The eyes are a striking, bright **yellow-gold** color.\n\n**Fur Length/Type:** The fur appears to be **medium length**, dense, and healthy, with a soft, slightly plush appearance, particularly around the chest and neck. It is not short like a typical DSH, nor long and flowing like a Maine Coon or Persian.\n\n**Size:** Based on the visible portion of the cat, it appears to be of **average size** for a domestic cat, exhibiting a healthy and **well-conditioned** physique. There are no indications of obesity or emaciation.\n\n**Gender:** Gender **cannot be definitively determined** from this photo, as no direct anatomical indicators (such as prominent jowls sometimes seen in intact males, or mammary development) are visible in this head and chest shot.\n\n**Emotional State:** The cat\'s emotional state appears to be **alert, attentive, and calm**.\n*   Its eyes are wide open, pupils are well-dilated for the lighting conditions, and it is looking directly forward, suggesting focus.\n*   The ears are pricked forward and slightly rotated, indicating engagement with its surroundings.\n*   The whiskers are fanned out, not flattened against the face, which is a sign of relaxation or curiosity rather than fear or aggression.\n*   The mouth is closed, and there are no signs of tension in the facial muscles.\n*   Overall, the expression is one of engaged observation, possibly a mild curiosity or dignified seriousness.\n\n**Distinctive Features:**\n*   **Facial Markings:** The most striking feature is the unique white blaze down the nose and the white muzzle, sharply outlined by black fur. There are distinct, small, irregular black patches on the white fur around the lower lip/chin area, giving it a charming \"goatee\" or \"stubble\" like appearance.\n*   **Eye Color:** The bright yellow-gold eyes provide a strong contrast against the black and white fur, adding to its striking appearance.\n*   **Ear Furnishings:** The prominent white tufts of hair protruding from inside the ears are quite noticeable.\n*   **Whiskers:** Long, numerous, and pure white whiskers stand out against the dark fur.', '2025-10-31 15:12:41'),
(8, 'upload not stored yet', 'As an expert veterinarian AI, here is a detailed description of the pet in the photo:\n\n**Species:** Feline (Domestic Cat, *Felis catus*)\n\n**Probable Breed:** British Shorthair. This is strongly indicated by several characteristic features:\n*   **Body:** A robust, cobby (stocky) build with a broad chest and a dense, substantial feel.\n*   **Head:** A notably large, round head with full, prominent cheeks and a short, broad nose. The well-developed jowls are a hallmark.\n*   **Eyes:** Large, round, and wide-set eyes, which are a striking copper/gold color, typical for blue British Shorthairs.\n*   **Ears:** Small to medium-sized, wide-set, and rounded at the tips, fitting the breed standard.\n*   **Coat:** A short, very dense, plush coat that stands away from the body.\n\n**Approximate Age:** This appears to be a young to middle-aged adult cat, likely between 2 and 6 years old. The full jowls and well-developed musculature suggest maturity beyond kittenhood, but there are no signs of aging such as grey hairs, eye cloudiness, or a less robust appearance.\n\n**Color:** Solid blue (which is a uniform grey color in cat genetics). The coat is consistently this shade across the visible body, with no discernible patterns or lighter/darker areas.\n\n**Fur Length/Type:** Short-haired. The fur is notably dense and plush, creating a soft, almost velvety texture that stands away from the body. This is characteristic of a British Shorthair\'s \"crisp\" double coat.\n\n**Size:** Medium to large. Given its robust build, it appears to be a substantial cat, consistent with the typical size range for a British Shorthair.\n\n**Gender (if guessable):** Likely male. The pronounced, full jowls are often more prominent in intact or formerly intact male British Shorthairs, contributing to their characteristically round facial appearance. However, definitive gender identification from a still image is impossible.\n\n**Emotional State:** The cat appears alert and focused, exhibiting a calm yet intense curiosity. Its large, round eyes are fixed directly forward, suggesting it is fully engaged with its surroundings or the photographer. The ears are erect and slightly forward, indicating attention rather than fear or aggression. Its posture is stable and composed.\n\n**Distinctive Features:**\n*   **Striking Copper Eyes:** The vibrant, round copper/gold eyes create a beautiful and intense contrast against the solid blue fur, making them a highly distinctive and captivating feature.\n*   **Pronounced Jowls and Round Head:** The exceptionally round face with very full jowls contributes significantly to the breed\'s distinctive \"teddy bear\" appearance.\n*   **Plush Blue Coat:** The uniform solid blue color combined with the dense, plush fur texture is a classic and highly recognizable feature of the British Shorthair breed.\n*   **Robust Build:** The cat\'s overall stocky, powerful, and substantial physique is very characteristic.', '2025-11-02 19:20:35'),
(9, 'upload not stored yet', 'As an expert veterinarian AI, I can provide a detailed assessment of the feline in this image:\n\n*   **Species:** *Felis catus* (Domestic Cat)\n\n*   **Probable Breed:** This cat strongly exhibits the classic characteristics of a **British Shorthair**, specifically a **British Blue**. Key indicators include the solid blue-gray coat, dense and plush fur, broad and rounded head, full cheeks, stocky and cobby body build, and large, round, expressive eyes.\n\n*   **Approximate Age:** Based on its well-developed musculature, clear bright eyes, full facial features, and lack of any signs of kittenhood (gangliness) or advanced age (such as dull fur, cloudy eyes, or significant weight loss/gain typically seen in senior cats), I would estimate this cat to be an **adult, likely between 2 and 6 years old**. It appears to be in its prime.\n\n*   **Color:** The fur is a uniform, solid **blue-gray** color, without any tabby markings, white patches, or other color variations. The eye color is a striking **deep amber or brilliant gold/orange**.\n\n*   **Fur Length/Type:** The fur is **short to medium-short** in length, very **dense and plush**, giving it a luxurious, almost velvet-like appearance. It appears to stand slightly away from the body, which is characteristic of the British Shorthair\'s crisp, double coat.\n\n*   **Size:** The cat appears to be **medium-large** in size, with a robust and cobby build. British Shorthairs are known for their substantial and muscular frames.\n\n*   **Gender (if guessable):** Given the broad, rounded head and full cheeks (sometimes referred to as \"jowls\" in intact males), and the overall robust body confirmation, this cat *leans towards being male*. However, a well-developed female British Shorthair can also possess a substantial build, so it\'s not definitively determinable from this single frontal image.\n\n*   **Emotional State:** The cat appears **alert, focused, and intensely curious**. Its ears are forward and slightly tilted towards the viewer, indicating engagement. The eyes are wide and directly fixed, suggesting active observation. There are no signs of aggression (flattened ears, hissing) or fear (crouching, dilated pupils). The overall posture is calm and composed, but with a palpable sense of attentiveness, perhaps observing something in its immediate environment.\n\n*   **Distinctive Features:**\n    *   The most striking feature is the dramatic contrast between its **brilliant amber/gold eyes** and its solid blue-gray coat.\n    *   The characteristic **round \"teddy bear\" head** and **full cheeks**, typical of the British Shorthair breed.\n    *   The **dense, plush, and seemingly high-quality short coat**.\n    *   The small, widely set ears that conform to the rounded head shape.\n    *   The slightly \"squashed\" or \"pansy\" face appearance, common in the breed.', '2025-11-04 16:20:33');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `picture` varchar(255) DEFAULT NULL,
  `provider` varchar(255) DEFAULT NULL,
  `role` enum('ADMIN','ADOPTER','SHELTER') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `name`, `password`, `picture`, `provider`, `role`) VALUES
(1, 'husseinsaddam894@gmail.com', 'Saddam Hussain', NULL, 'https://lh3.googleusercontent.com/a/ACg8ocJ5TEg1Moc6sKHnsawJON06da-u9EpSD-Maihs6byy0V6qt9YABvw=s96-c', 'google', 'ADOPTER'),
(2, 'hussainsaddam.np@gmail.com', 'Saddam Hussain Safi (‫سدام حسین‬‎)', NULL, 'https://lh3.googleusercontent.com/a/ACg8ocKrKvbL-FXaqq4lbEU16VyEQWbf-ikcpO3ech8-kooLvSh7tyScww=s96-c', 'google', 'ADOPTER');

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
-- Indexes for table `chat_sessions`
--
ALTER TABLE `chat_sessions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKlyu6qetbg4jx1524yuone1rrs` (`pet_id`),
  ADD KEY `FK8omq0tc18jd43bu5tjh6jvraq` (`user_id`);

--
-- Indexes for table `likes`
--
ALTER TABLE `likes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK8yooxn91yhu2a5eivw6mxp4i1` (`pet_user`),
  ADD KEY `FKgrjbvm9fg0mpijiyhclxgg0v9` (`pet_id`),
  ADD KEY `FKnvx9seeqqyy71bij291pwiwrg` (`user_id`);

--
-- Indexes for table `pets`
--
ALTER TABLE `pets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKoygstexeo9ivoylgrdrv2tc39` (`owner_id`);

--
-- Indexes for table `pet_detections`
--
ALTER TABLE `pet_detections`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_preferences`
--
ALTER TABLE `user_preferences`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `chat_sessions`
--
ALTER TABLE `chat_sessions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `likes`
--
ALTER TABLE `likes`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `pets`
--
ALTER TABLE `pets`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `pet_detections`
--
ALTER TABLE `pet_detections`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `user_preferences`
--
ALTER TABLE `user_preferences`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

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
-- Constraints for table `pets`
--
ALTER TABLE `pets`
  ADD CONSTRAINT `FKoygstexeo9ivoylgrdrv2tc39` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
