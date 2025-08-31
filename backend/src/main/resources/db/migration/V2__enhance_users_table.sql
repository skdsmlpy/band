-- V2: Enhance users table with student profiles and enhanced user management
-- Add enhanced user profile fields
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_number VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(500);
ALTER TABLE users ADD COLUMN IF NOT EXISTS theme_preference VARCHAR(20) DEFAULT 'light';
ALTER TABLE users ADD COLUMN IF NOT EXISTS notification_preferences TEXT DEFAULT '{}';
ALTER TABLE users ADD COLUMN IF NOT EXISTS timezone VARCHAR(50) DEFAULT 'UTC';
ALTER TABLE users ADD COLUMN IF NOT EXISTS language VARCHAR(10) DEFAULT 'en';

-- Add student-specific profile fields
ALTER TABLE users ADD COLUMN IF NOT EXISTS grade_level INTEGER;
ALTER TABLE users ADD COLUMN IF NOT EXISTS band_section VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS primary_instrument VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS parent_contact VARCHAR(500);
ALTER TABLE users ADD COLUMN IF NOT EXISTS academic_standing VARCHAR(50) DEFAULT 'good_standing';
ALTER TABLE users ADD COLUMN IF NOT EXISTS enrollment_date TIMESTAMP;

-- Add audit and activity fields
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT now();
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_band_section ON users(band_section);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(active);
CREATE INDEX IF NOT EXISTS idx_users_email_active ON users(email, active);

-- Update existing users with default values for new fields
UPDATE users SET 
    updated_at = created_at,
    active = true,
    theme_preference = 'light',
    notification_preferences = '{}',
    timezone = 'UTC',
    language = 'en'
WHERE updated_at IS NULL;

-- Add constraints
ALTER TABLE users ADD CONSTRAINT chk_theme_preference 
    CHECK (theme_preference IN ('light', 'dark', 'auto'));

ALTER TABLE users ADD CONSTRAINT chk_band_section 
    CHECK (band_section IS NULL OR band_section IN ('brass', 'woodwind', 'percussion', 'string'));

ALTER TABLE users ADD CONSTRAINT chk_academic_standing 
    CHECK (academic_standing IN ('excellent', 'good_standing', 'probation', 'suspended'));