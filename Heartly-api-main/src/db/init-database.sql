-- Heartly Database Initialization Script
-- This script creates the necessary database and tables for the Heartly application

-- Create database
CREATE DATABASE IF NOT EXISTS heartlydb;
USE heartlydb;

-- Users table (will be managed by TypeORM, but here for reference)
CREATE TABLE IF NOT EXISTS user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    walletAddress VARCHAR(42) UNIQUE NOT NULL,
    name VARCHAR(255),
    email VARCHAR(255),
    isExpert BOOLEAN DEFAULT FALSE,
    expertise TEXT,
    voiceRatePerMinute DECIMAL(10, 2),
    videoRatePerMinute DECIMAL(10, 2),
    cid TEXT,
    balance DECIMAL(18, 6) DEFAULT 0,
    isActive BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Languages table
CREATE TABLE IF NOT EXISTS language (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) NOT NULL UNIQUE,
    isActive BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Expertise table
CREATE TABLE IF NOT EXISTS expertise (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    isActive BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Languages mapping
CREATE TABLE IF NOT EXISTS user_languages (
    userId INT,
    languageId INT,
    PRIMARY KEY (userId, languageId),
    FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (languageId) REFERENCES language(id) ON DELETE CASCADE
);

-- User Expertise mapping
CREATE TABLE IF NOT EXISTS user_expertise (
    userId INT,
    expertiseId INT,
    PRIMARY KEY (userId, expertiseId),
    FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (expertiseId) REFERENCES expertise(id) ON DELETE CASCADE
);

-- Insert default languages
INSERT IGNORE INTO language (name, code) VALUES
('English', 'en'),
('Spanish', 'es'),
('French', 'fr'),
('German', 'de'),
('Italian', 'it'),
('Portuguese', 'pt'),
('Russian', 'ru'),
('Chinese', 'zh'),
('Japanese', 'ja'),
('Korean', 'ko'),
('Arabic', 'ar'),
('Hindi', 'hi');

-- Insert default expertise categories
INSERT IGNORE INTO expertise (name, description, category) VALUES
('Anxiety Counseling', 'Support for anxiety disorders and panic attacks', 'Mental Health'),
('Depression Support', 'Guidance for depression and mood disorders', 'Mental Health'),
('Stress Management', 'Techniques for managing stress and burnout', 'Wellness'),
('Relationship Counseling', 'Support for relationship and communication issues', 'Relationships'),
('Career Guidance', 'Professional development and career counseling', 'Career'),
('Family Therapy', 'Family dynamics and conflict resolution', 'Family'),
('Addiction Recovery', 'Support for substance abuse and addiction', 'Recovery'),
('Trauma Counseling', 'Support for trauma and PTSD recovery', 'Mental Health'),
('Mindfulness Training', 'Meditation and mindfulness practices', 'Wellness'),
('Grief Counseling', 'Support for loss and bereavement', 'Mental Health'),
('Teen Counseling', 'Specialized support for teenagers', 'Youth'),
('Couples Therapy', 'Relationship counseling for couples', 'Relationships');

-- Create indexes for better performance
CREATE INDEX idx_user_wallet ON user(walletAddress);
CREATE INDEX idx_user_expert ON user(isExpert);
CREATE INDEX idx_user_active ON user(isActive);
CREATE INDEX idx_language_active ON language(isActive);
CREATE INDEX idx_expertise_active ON expertise(isActive);
CREATE INDEX idx_expertise_category ON expertise(category);

-- Create a user for the application (optional, for development)
-- You may want to create a specific user for the application
-- GRANT ALL PRIVILEGES ON heartlydb.* TO 'heartly_user'@'localhost' IDENTIFIED BY 'secure_password';
-- FLUSH PRIVILEGES;