-- Cover Letters table
CREATE TABLE cover_letters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  job_title TEXT,
  content TEXT,
  resume_text TEXT,
  job_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE cover_letters ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can see their own cover letters"
ON cover_letters FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cover letters"
ON cover_letters FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cover letters"
ON cover_letters FOR UPDATE USING (auth.uid() = user_id);
