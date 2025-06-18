-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table
CREATE POLICY "Users can view their own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Create policies for organizations table
CREATE POLICY "Anyone can view verified organizations"
    ON organizations FOR SELECT
    USING (is_verified = true);

CREATE POLICY "Organization members can view their organization"
    ON organizations FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.organization_id = organizations.id
        )
    );

CREATE POLICY "Organization admins can update their organization"
    ON organizations FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.organization_id = organizations.id
            AND profiles.role = 'admin'
        )
    );

-- Create policies for timeline entries
CREATE POLICY "Users can view their own timeline entries"
    ON timeline_entries FOR SELECT
    USING (profile_id = auth.uid());

CREATE POLICY "Users can view verified timeline entries of others"
    ON timeline_entries FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = timeline_entries.profile_id
            AND profiles.is_verified = true
        )
    );

CREATE POLICY "Users can manage their own timeline entries"
    ON timeline_entries FOR ALL
    USING (profile_id = auth.uid());

-- Create policies for verifications
CREATE POLICY "Users can view their own verifications"
    ON verifications FOR SELECT
    USING (profile_id = auth.uid());

CREATE POLICY "Users can view verifications they verified"
    ON verifications FOR SELECT
    USING (verified_by = auth.uid());

CREATE POLICY "Users can create verifications for themselves"
    ON verifications FOR INSERT
    WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Verifiers can update verifications they're assigned to"
    ON verifications FOR UPDATE
    USING (
        verified_by = auth.uid()
        AND status = 'in_progress'
    );

-- Create policies for jobs
CREATE POLICY "Anyone can view published jobs"
    ON jobs FOR SELECT
    USING (status = 'published');

CREATE POLICY "Only verified organizations can create jobs"
    ON jobs FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM organizations
            WHERE organizations.id = organization_id
            AND organizations.is_verified = true
        )
    );

CREATE POLICY "Organization members can manage their jobs"
    ON jobs FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.organization_id = jobs.organization_id
        )
    );

-- Create policies for applications
CREATE POLICY "Users can view their own applications"
    ON applications FOR SELECT
    USING (profile_id = auth.uid());

CREATE POLICY "Users can create applications"
    ON applications FOR INSERT
    WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Organization members can view applications for their jobs"
    ON applications FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM jobs
            JOIN profiles ON profiles.organization_id = jobs.organization_id
            WHERE jobs.id = applications.job_id
            AND profiles.id = auth.uid()
        )
    );

CREATE POLICY "Organization members can update applications for their jobs"
    ON applications FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM jobs
            JOIN profiles ON profiles.organization_id = jobs.organization_id
            WHERE jobs.id = applications.job_id
            AND profiles.id = auth.uid()
        )
    );

-- Create policies for surveys
CREATE POLICY "Anyone can view published surveys"
    ON surveys FOR SELECT
    USING (status = 'published');

CREATE POLICY "Organization members can view their surveys"
    ON surveys FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.organization_id = surveys.organization_id
        )
    );

CREATE POLICY "Organization members can manage their surveys"
    ON surveys FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.organization_id = surveys.organization_id
        )
    );

-- Create policies for survey responses
CREATE POLICY "Users can view their own survey responses"
    ON survey_responses FOR SELECT
    USING (profile_id = auth.uid());

CREATE POLICY "Users can create survey responses"
    ON survey_responses FOR INSERT
    WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Organization members can view responses to their surveys"
    ON survey_responses FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM surveys
            JOIN profiles ON profiles.organization_id = surveys.organization_id
            WHERE surveys.id = survey_responses.survey_id
            AND profiles.id = auth.uid()
        )
    );

-- Create function to check if user is verified
CREATE OR REPLACE FUNCTION is_verified_user(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles
        WHERE id = user_id
        AND is_verified = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if user is organization admin
CREATE OR REPLACE FUNCTION is_organization_admin(user_id UUID, org_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles
        WHERE id = user_id
        AND organization_id = org_id
        AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add role column to profiles table if not exists
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'role'
    ) THEN
        ALTER TABLE profiles ADD COLUMN role TEXT DEFAULT 'user';
    END IF;
END $$;

-- Add organization_id column to profiles table if not exists
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'organization_id'
    ) THEN
        ALTER TABLE profiles ADD COLUMN organization_id UUID REFERENCES organizations(id);
    END IF;
END $$; 