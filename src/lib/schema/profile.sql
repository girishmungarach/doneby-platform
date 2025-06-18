-- Enable UUID extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types if they don't exist
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('user', 'admin');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'timeline_entry_type') THEN
        CREATE TYPE timeline_entry_type AS ENUM ('work', 'education', 'project', 'achievement');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'verification_status') THEN
        CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'rejected');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'skill_level') THEN
        CREATE TYPE skill_level AS ENUM ('beginner', 'intermediate', 'advanced', 'expert');
    END IF;
END $$;

-- Create profiles table if not exists with its initial essential columns.
-- New columns for existing tables are added via ALTER TABLE statements below.
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add new columns to profiles table if they don't exist.
-- This is crucial for existing 'profiles' tables that might be missing these fields.
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'username') THEN
        ALTER TABLE profiles ADD COLUMN username TEXT UNIQUE;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'headline') THEN
        ALTER TABLE profiles ADD COLUMN headline TEXT;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'bio') THEN
        ALTER TABLE profiles ADD COLUMN bio TEXT;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'location') THEN
        ALTER TABLE profiles ADD COLUMN location TEXT;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'avatar_url') THEN
        ALTER TABLE profiles ADD COLUMN avatar_url TEXT;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'cover_image_url') THEN
        ALTER TABLE profiles ADD COLUMN cover_image_url TEXT;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'phone') THEN
        ALTER TABLE profiles ADD COLUMN phone TEXT;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'linkedin') THEN
        ALTER TABLE profiles ADD COLUMN linkedin TEXT;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'website') THEN
        ALTER TABLE profiles ADD COLUMN website TEXT;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'role') THEN
        ALTER TABLE profiles ADD COLUMN role user_role DEFAULT 'user';
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'is_profile_completed') THEN
        ALTER TABLE profiles ADD COLUMN is_profile_completed BOOLEAN DEFAULT false;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'is_public') THEN
        ALTER TABLE profiles ADD COLUMN is_public BOOLEAN DEFAULT false;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'verification_score') THEN
        ALTER TABLE profiles ADD COLUMN verification_score INTEGER DEFAULT 0;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'trust_metrics') THEN
        ALTER TABLE profiles ADD COLUMN trust_metrics JSONB DEFAULT '{}';
    END IF;
END $$;

-- Create skills table if not exists
CREATE TABLE IF NOT EXISTS skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    category TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create profile_skills table if not exists
CREATE TABLE IF NOT EXISTS profile_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
    level skill_level DEFAULT 'intermediate',
    endorsement_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(profile_id, skill_id)
);

-- Create timeline_entries table if not exists
CREATE TABLE IF NOT EXISTS timeline_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    type timeline_entry_type NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE,
    is_current BOOLEAN DEFAULT false,
    location TEXT,
    organization TEXT,
    url TEXT,
    metadata JSONB DEFAULT '{}',
    verification_status verification_status DEFAULT 'pending',
    verification_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure verification_status column exists for idempotency in case of partial previous migrations
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'timeline_entries' AND column_name = 'verification_status') THEN
        ALTER TABLE timeline_entries ADD COLUMN verification_status verification_status DEFAULT 'pending';
    END IF;
END $$;

-- Ensure verification_count column exists for idempotency
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'timeline_entries' AND column_name = 'verification_count') THEN
        ALTER TABLE timeline_entries ADD COLUMN verification_count INTEGER DEFAULT 0;
    END IF;
END $$;

-- Create timeline_skills table if not exists
CREATE TABLE IF NOT EXISTS timeline_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    timeline_entry_id UUID REFERENCES timeline_entries(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(timeline_entry_id, skill_id)
);

-- Create verifications table if not exists
CREATE TABLE IF NOT EXISTS verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    timeline_entry_id UUID REFERENCES timeline_entries(id) ON DELETE CASCADE,
    verifier_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    status verification_status DEFAULT 'pending',
    comment TEXT,
    evidence_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(timeline_entry_id, verifier_id)
);

-- Create connections table if not exists
CREATE TABLE IF NOT EXISTS connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    connected_profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(profile_id, connected_profile_id)
);

-- Create achievements table if not exists
CREATE TABLE IF NOT EXISTS achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    issuer TEXT,
    credential_url TEXT,
    verification_status verification_status DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create metrics table if not exists
CREATE TABLE IF NOT EXISTS metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    value NUMERIC NOT NULL,
    unit TEXT,
    date DATE NOT NULL,
    source TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(profile_id, name, date)
);

-- Create files table if not exists
CREATE TABLE IF NOT EXISTS files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    timeline_entry_id UUID REFERENCES timeline_entries(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE, -- To enforce RLS based on owner
    file_url TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_type TEXT,
    file_size INTEGER, -- in bytes
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes if they don't exist
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_profiles_username') THEN
        CREATE INDEX idx_profiles_username ON profiles(username);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_profiles_verification_score') THEN
        CREATE INDEX idx_profiles_verification_score ON profiles(verification_score);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_timeline_entries_profile_id') THEN
        CREATE INDEX idx_timeline_entries_profile_id ON timeline_entries(profile_id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_timeline_entries_type') THEN
        CREATE INDEX idx_timeline_entries_type ON timeline_entries(type);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_timeline_entries_verification_status') THEN
        CREATE INDEX idx_timeline_entries_verification_status ON timeline_entries(verification_status);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_verifications_timeline_entry_id') THEN
        CREATE INDEX idx_verifications_timeline_entry_id ON verifications(timeline_entry_id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_verifications_verifier_id') THEN
        CREATE INDEX idx_verifications_verifier_id ON verifications(verifier_id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_profile_skills_profile_id') THEN
        CREATE INDEX idx_profile_skills_profile_id ON profile_skills(profile_id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_profile_skills_skill_id') THEN
        CREATE INDEX idx_profile_skills_skill_id ON profile_skills(skill_id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_connections_profile_id') THEN
        CREATE INDEX idx_connections_profile_id ON connections(profile_id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_connections_connected_profile_id') THEN
        CREATE INDEX idx_connections_connected_profile_id ON connections(connected_profile_id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_achievements_profile_id') THEN
        CREATE INDEX idx_achievements_profile_id ON achievements(profile_id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_metrics_profile_id') THEN
        CREATE INDEX idx_metrics_profile_id ON metrics(profile_id);
    END IF;
END $$;

-- Enable RLS if not already enabled
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'profiles' AND rowsecurity = true) THEN
        ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'skills' AND rowsecurity = true) THEN
        ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'profile_skills' AND rowsecurity = true) THEN
        ALTER TABLE profile_skills ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'timeline_entries' AND rowsecurity = true) THEN
        ALTER TABLE timeline_entries ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'timeline_skills' AND rowsecurity = true) THEN
        ALTER TABLE timeline_skills ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'verifications' AND rowsecurity = true) THEN
        ALTER TABLE verifications ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'connections' AND rowsecurity = true) THEN
        ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'achievements' AND rowsecurity = true) THEN
        ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'metrics' AND rowsecurity = true) THEN
        ALTER TABLE metrics ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'files' AND rowsecurity = true) THEN
        ALTER TABLE files ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Create policies if they don't exist
-- Profiles policies
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' 
        AND policyname = 'Public profiles are viewable by everyone'
    ) THEN
        CREATE POLICY "Public profiles are viewable by everyone"
            ON profiles FOR SELECT
            USING (is_public = true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' 
        AND policyname = 'Users can view their own profile'
    ) THEN
        CREATE POLICY "Users can view their own profile"
            ON profiles FOR SELECT
            USING (auth.uid() = id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' 
        AND policyname = 'Users can update their own profile'
    ) THEN
        CREATE POLICY "Users can update their own profile"
            ON profiles FOR UPDATE
            USING (auth.uid() = id);
    END IF;
END $$;

-- Skills policies
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'skills' 
        AND policyname = 'Skills are viewable by everyone'
    ) THEN
        CREATE POLICY "Skills are viewable by everyone"
            ON skills FOR SELECT
            USING (true);
    END IF;
END $$;

-- Profile skills policies
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profile_skills' 
        AND policyname = 'Profile skills are viewable by everyone'
    ) THEN
        CREATE POLICY "Profile skills are viewable by everyone"
            ON profile_skills FOR SELECT
            USING (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profile_skills' 
        AND policyname = 'Users can manage their own profile skills'
    ) THEN
        CREATE POLICY "Users can manage their own profile skills"
            ON profile_skills FOR ALL
            USING (auth.uid() = profile_id);
    END IF;
END $$;

-- Timeline entries policies
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'timeline_entries' 
        AND policyname = 'Timeline entries are viewable by everyone'
    ) THEN
        CREATE POLICY "Timeline entries are viewable by everyone"
            ON timeline_entries FOR SELECT
            USING (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'timeline_entries' 
        AND policyname = 'Users can manage their own timeline entries'
    ) THEN
        CREATE POLICY "Users can manage their own timeline entries"
            ON timeline_entries FOR ALL
            USING (auth.uid() = profile_id);
    END IF;
END $$;

-- Verifications policies
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'verifications' 
        AND policyname = 'Verifications are viewable by everyone'
    ) THEN
        CREATE POLICY "Verifications are viewable by everyone"
            ON verifications FOR SELECT
            USING (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'verifications' 
        AND policyname = 'Users can create verifications'
    ) THEN
        CREATE POLICY "Users can create verifications"
            ON verifications FOR INSERT
            WITH CHECK (auth.uid() = verifier_id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'verifications' 
        AND policyname = 'Users can update their own verifications'
    ) THEN
        CREATE POLICY "Users can update their own verifications"
            ON verifications FOR UPDATE
            USING (auth.uid() = verifier_id);
    END IF;
END $$;

-- Connections policies
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'connections' 
        AND policyname = 'Users can view their own connections'
    ) THEN
        CREATE POLICY "Users can view their own connections"
            ON connections FOR SELECT
            USING (auth.uid() = profile_id OR auth.uid() = connected_profile_id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'connections' 
        AND policyname = 'Users can manage their own connections'
    ) THEN
        CREATE POLICY "Users can manage their own connections"
            ON connections FOR ALL
            USING (auth.uid() = profile_id);
    END IF;
END $$;

-- Achievements policies
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'achievements' 
        AND policyname = 'Achievements are viewable by everyone'
    ) THEN
        CREATE POLICY "Achievements are viewable by everyone"
            ON achievements FOR SELECT
            USING (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'achievements' 
        AND policyname = 'Users can manage their own achievements'
    ) THEN
        CREATE POLICY "Users can manage their own achievements"
            ON achievements FOR ALL
            USING (auth.uid() = profile_id);
    END IF;
END $$;

-- Metrics policies
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'metrics' 
        AND policyname = 'Metrics are viewable by everyone'
    ) THEN
        CREATE POLICY "Metrics are viewable by everyone"
            ON metrics FOR SELECT
            USING (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'metrics' 
        AND policyname = 'Users can manage their own metrics'
    ) THEN
        CREATE POLICY "Users can manage their own metrics"
            ON metrics FOR ALL
            USING (auth.uid() = profile_id);
    END IF;
END $$;

-- Files policies
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'files' 
        AND policyname = 'Users can view their own files'
    ) THEN
        CREATE POLICY "Users can view their own files"
            ON files FOR SELECT
            USING (auth.uid() = profile_id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'files' 
        AND policyname = 'Users can upload their own files'
    ) THEN
        CREATE POLICY "Users can upload their own files"
            ON files FOR INSERT
            WITH CHECK (auth.uid() = profile_id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'files' 
        AND policyname = 'Users can delete their own files'
    ) THEN
        CREATE POLICY "Users can delete their own files"
            ON files FOR DELETE
            USING (auth.uid() = profile_id);
    END IF;
END $$;

-- Create increment function if it doesn't exist
CREATE OR REPLACE FUNCTION increment()
RETURNS integer
LANGUAGE sql
AS $$
    SELECT COALESCE(verification_count, 0) + 1
    FROM timeline_entries
    WHERE id = NEW.id;
$$; 