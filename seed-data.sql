-- Seed data for demo purposes
-- Run this in Supabase SQL Editor to populate sample data

-- Insert sample meeting requests for demo
INSERT INTO public.meeting_requests (visitor_name, meeting_date, expired_date) VALUES
('Sarah Johnson', '2026-01-10', '2026-01-15'),
('Michael Chen', '2026-01-12', '2026-01-17'),
('Emily Rodriguez', '2026-01-08', '2026-01-13'),
('David Kim', '2026-01-20', '2026-01-25'),
('Jessica Williams', '2026-01-18', '2026-01-23'),
('Robert Brown', '2026-01-22', '2026-01-27'),
('Amanda Garcia', '2026-01-15', '2026-01-20'),
('James Martinez', '2026-01-25', '2026-01-30'),
('Lisa Anderson', '2026-01-28', '2026-02-02'),
('Thomas Wilson', '2026-02-01', '2026-02-06');

-- Add some expired entries for demo
INSERT INTO public.meeting_requests (visitor_name, meeting_date, expired_date) VALUES
('John Doe', '2025-12-15', '2025-12-20'),
('Jane Smith', '2025-12-18', '2025-12-23'),
('Chris Taylor', '2025-12-22', '2025-12-27');

-- Verify the data
SELECT 
  id,
  visitor_name,
  meeting_date,
  expired_date,
  CASE 
    WHEN expired_date < CURRENT_DATE THEN 'Expired'
    ELSE 'Active'
  END as status,
  created_at
FROM public.meeting_requests
ORDER BY created_at DESC;
