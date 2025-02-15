CREATE DATABASE IF NOT EXISTS `notes_database` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `notes_database`;

-- Users Table
CREATE TABLE IF NOT EXISTS `Users` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(100) NOT NULL UNIQUE,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `password` CHAR(60) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- Notes Table
CREATE TABLE IF NOT EXISTS `Notes` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `content` TEXT NOT NULL,
    `owner_id` INT UNSIGNED NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`owner_id`) REFERENCES `Users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Permissions Table
CREATE TABLE IF NOT EXISTS `Permissions` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `note_id` INT UNSIGNED NOT NULL,
    `user_id` INT UNSIGNED NOT NULL,
    `permission_type` ENUM('READ', 'WRITE') NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY (`note_id`, `user_id`, `permission_type`),
    FOREIGN KEY (`note_id`) REFERENCES `Notes`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`user_id`) REFERENCES `Users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Tags Table
CREATE TABLE IF NOT EXISTS `Tags` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL UNIQUE,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- NoteTags Table (Many-to-Many Relationship)
CREATE TABLE IF NOT EXISTS `NoteTags` (
    `note_id` INT UNSIGNED NOT NULL,
    `tag_id` INT UNSIGNED NOT NULL,
    PRIMARY KEY (`note_id`, `tag_id`),
    FOREIGN KEY (`note_id`) REFERENCES `Notes`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`tag_id`) REFERENCES `Tags`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- SharedLinks Table
CREATE TABLE IF NOT EXISTS `SharedLinks` (
    `id` CHAR(36) NOT NULL,
    `note_id` INT UNSIGNED NOT NULL,
    `is_public` BOOLEAN NOT NULL DEFAULT FALSE,
    `expiration_date` TIMESTAMP NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`note_id`) REFERENCES `Notes`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Folders Table
CREATE TABLE IF NOT EXISTS `Folders` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `owner_id` INT UNSIGNED NOT NULL,
    `parent_folder_id` INT UNSIGNED DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`owner_id`) REFERENCES `Users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`parent_folder_id`) REFERENCES `Folders`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Insert test data for Users
INSERT INTO `Users` (`username`, `email`, `password`) VALUES
('john', 'john@gmail.com', '$2a$10$Q4ZT0cdJAbv5AxKZ/IZi6ufrVW/zSHR6XIDMrNtHgjw9OJ7MMVoaO'), -- Placeholder hashed password
('jane', 'jane@gmail.com', '$2a$10$7H18I1CKB.q2tVnTVOqxpejflxEWjpAAOOiOP6cMQfFIkR9R61Fn.'),
('alice', 'alice@gmail.com', '$2a$10$TUst/DRuLp5p7F9ddx1CsOMruWSu8PJrvSrMwy7r13VeLkpRBP9fG'),
('bob', 'bob@gmail.com', '$2a$10$gzKHXjh4Cp6o2WEnLdpDH.3M1zrTFvH0x0oXsiOznd9RMH9xZSUoS'),
('baba', 'baba@g.c', '$2a$10$eehCbAgzOATp50mdJOPYPejz2M/nIo6xpgofWvZcQ821CHF0LEXdK');

-- Insert test data for Notes
INSERT INTO `Notes` (`title`, `content`, `owner_id`) VALUES
-- User 2
('First Note', 'This is the first note.', 1),
('Second Note', 'This is another note by John.', 1),
('John\'s Work Note', 'A note about work tasks.', 1),
('John\'s Meeting Notes', 'Meeting notes from today\'s discussion.', 1),
('John\'s Shopping List', 'Milk, Eggs, Bread, Butter.', 1),

-- User 2
('Jane\'s Note', 'A note by Jane.', 2),
('Jane\'s Study Plan', 'Study schedule for the upcoming exam.', 2),
('Jane\'s Grocery List', 'Tomatoes, Cheese, Pasta.', 2),
('Jane\'s Workout Plan', 'Monday: Cardio, Tuesday: Strength training.', 2),
('Jane\'s Favorite Quotes', '“Success is not final, failure is not fatal.”', 2),

-- User 3
('Alice\'s Private Note', 'This is Alice\'s private note.', 3),
('Alice\'s Project Plan', 'Plan for the new web application.', 3),
('Alice\'s Travel Itinerary', 'Trip to Paris next month.', 3),
('Alice\'s Books to Read', 'The Alchemist, 1984, Brave New World.', 3),
('Alice\'s Budget Plan', 'Monthly expenses and savings.', 3),

-- User 4
('Bob\'s Daily Journal', 'Wrote about today\'s experiences.', 4),
('Bob\'s Coding Notes', 'How to optimize SQL queries.', 4),
('Bob\'s Weekend Plans', 'Go hiking and watch a movie.', 4),
('Bob\'s To-Do List', 'Laundry, Car maintenance, Pay bills.', 4),
('Bob\'s Favorite Recipes', 'Homemade pizza and pasta.', 4),

-- User 5
('Charlie\'s Music List', 'Favorite rock and jazz albums.', 5),
('Charlie\'s Work Tasks', 'Finish the report by Friday.', 5),
('Charlie\'s Creative Ideas', 'Ideas for a new mobile app.', 5),
('Charlie\'s Dream Destinations', 'Japan, New Zealand, Norway.', 5),
('Charlie\'s Daily Affirmations', '“I am strong. I am capable.”', 5);

-- Insert test data for Permissions
INSERT INTO `Permissions` (`note_id`, `user_id`, `permission_type`) VALUES
(1, 2, 'READ'), -- Jane has READ access to John\'s first note
(2, 2, 'WRITE'), -- Jane has WRITE access to John\'s second note
(3, 1, 'READ'), -- John has READ access to Jane\'s note
(4, 4, 'READ'); -- Bob has READ access to Alice\'s private note

-- Insert test data for Tags
INSERT INTO `Tags` (`name`) VALUES
('Work'),
('Personal'),
('Urgent'),
('Ideas');

-- Insert test data for NoteTags
INSERT INTO `NoteTags` (`note_id`, `tag_id`) VALUES
(1, 1), -- First Note tagged as Work
(1, 3), -- First Note also tagged as Urgent
(2, 2), -- Second Note tagged as Personal
(3, 4); -- Jane\'s Note tagged as Ideas

-- Insert test data for SharedLinks
INSERT INTO `SharedLinks` (`id`, `note_id`, `is_public`, `expiration_date`) VALUES
(UUID(), 1, TRUE, '2025-02-28 23:59:59'), -- Public link for John\'s first note
(UUID(), 3, FALSE, NULL); -- Private link for Jane\'s note (no expiration)

-- Insert test data for Folders
INSERT INTO `Folders` (`name`, `owner_id`, `parent_folder_id`) VALUES
('Work Notes', 1, NULL), -- John\'s main folder
('Personal Notes', 1, NULL), -- John\'s personal folder
('Jane\'s Folder', 2, NULL), -- Jane\'s main folder
('Subfolder A', 1, 1); -- Subfolder inside John\'s Work Notes
