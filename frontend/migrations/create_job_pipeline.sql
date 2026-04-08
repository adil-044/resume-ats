-- Job Pipeline table
CREATE TABLE job_pipeline (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  company TEXT NOT NULL,
  job_title TEXT NOT NULL,
  job_url TEXT,
  notes TEXT,
  status TEXT DEFAULT 'saved',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE job_pipeline ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can see their own job pipeline"
ON job_pipeline FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own job pipeline"
ON job_pipeline FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own job pipeline"
ON job_pipeline FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own job pipeline"
ON job_pipeline FOR DELETE USING (auth.uid() = user_id);
