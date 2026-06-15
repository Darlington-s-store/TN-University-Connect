-- Enable pgcrypto for UUID generation if needed
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop tables if they exist (for easy resetting/migrating)
DROP TABLE IF EXISTS otps CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS contact_messages CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS announcements CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS settings CASCADE;


-- 1. Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255), -- Nullable for Google Auth users
  role VARCHAR(20) NOT NULL DEFAULT 'member', -- 'admin' or 'member'
  avatar TEXT,
  university VARCHAR(255),
  school_type VARCHAR(100),
  uni_type VARCHAR(50),
  faculty VARCHAR(255),
  department VARCHAR(255),
  program VARCHAR(255),
  level VARCHAR(50),
  status VARCHAR(50),
  church VARCHAR(255),
  niche VARCHAR(255),
  phone VARCHAR(50),
  bio TEXT,
  nationality VARCHAR(100) DEFAULT 'Ghanaian',
  gender VARCHAR(50),
  profile_complete BOOLEAN DEFAULT FALSE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Announcements Table
CREATE TABLE announcements (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  date VARCHAR(50) NOT NULL,
  excerpt TEXT NOT NULL,
  body TEXT NOT NULL,
  image TEXT,
  is_sponsored BOOLEAN DEFAULT FALSE,
  sponsor_name VARCHAR(255),
  sponsor_url TEXT,
  sponsor_logo TEXT,
  published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Blog Posts Table
CREATE TABLE blog_posts (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  author VARCHAR(100) NOT NULL,
  date VARCHAR(50) NOT NULL,
  excerpt TEXT NOT NULL,
  body TEXT NOT NULL,
  image TEXT,
  is_sponsored BOOLEAN DEFAULT FALSE,
  sponsor_name VARCHAR(255),
  sponsor_url TEXT,
  sponsor_logo TEXT,
  featured BOOLEAN DEFAULT FALSE,
  published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Contact Messages Table
CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  date VARCHAR(50) NOT NULL,
  resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Students Table
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  gender VARCHAR(50) NOT NULL,
  dob VARCHAR(50) NOT NULL,
  university VARCHAR(255) NOT NULL,
  school_type VARCHAR(100),
  uni_type VARCHAR(50),
  faculty VARCHAR(255),
  department VARCHAR(255) NOT NULL,
  program VARCHAR(255) NOT NULL,
  level VARCHAR(50) NOT NULL,
  index_number VARCHAR(100) NOT NULL,
  address TEXT NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  nationality VARCHAR(100),
  status VARCHAR(50),
  church VARCHAR(255),
  niche VARCHAR(255)
);

-- 6. OTPs Table (One-Time Passwords / Verification Codes)
CREATE TABLE otps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier VARCHAR(255) NOT NULL, -- Email address or phone number
  code VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add index to otps for fast expiration check and cleanup
CREATE INDEX idx_otps_identifier_code ON otps(identifier, code);

-- 7. Settings Table
CREATE TABLE settings (
  key VARCHAR(50) PRIMARY KEY,
  value TEXT NOT NULL
);
