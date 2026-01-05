-- Migration to add expired_date column if it doesn't exist
-- Run this in your Supabase SQL Editor

-- First, check if the table exists and what columns it has
-- If the table doesn't exist, create it:
CREATE TABLE IF NOT EXISTS public.meeting_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visitor_name TEXT NOT NULL,
    meeting_date DATE NOT NULL,
    expired_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- If the table exists but the expired_date column is missing, add it:
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema='public' 
        AND table_name='meeting_requests' 
        AND column_name='expired_date'
    ) THEN
        ALTER TABLE public.meeting_requests 
        ADD COLUMN expired_date DATE NOT NULL DEFAULT CURRENT_DATE;
    END IF;
END $$;

-- Enable Row Level Security (RLS)
ALTER TABLE public.meeting_requests ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for authenticated users
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON public.meeting_requests;
CREATE POLICY "Enable all operations for authenticated users" 
ON public.meeting_requests 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Grant permissions
GRANT ALL ON public.meeting_requests TO authenticated;
GRANT ALL ON public.meeting_requests TO service_role;
