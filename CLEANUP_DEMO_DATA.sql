-- ================================================
-- CLEANUP DEMO/TEST DATA FROM DATABASE
-- ================================================
-- Run this in Supabase SQL Editor to clean up old test data

-- 1. Show all properties (to see what will be deleted)
SELECT 
  id, 
  title, 
  location, 
  created_at,
  email as user_email
FROM properties p
LEFT JOIN users u ON p.user_id = u.id
ORDER BY created_at DESC;

-- 2. Delete specific demo properties (uncomment to run)
-- DELETE FROM properties 
-- WHERE title LIKE '%Demo%' 
--    OR title LIKE '%Test%'
--    OR title LIKE '%Prueba%';

-- 3. Delete all properties created before a specific date (uncomment and adjust date)
-- DELETE FROM properties 
-- WHERE created_at < '2025-10-15 00:00:00';

-- 4. Delete properties from test/demo users (uncomment to run)
-- DELETE FROM properties 
-- WHERE user_id IN (
--   SELECT id FROM users 
--   WHERE email LIKE '%test%' 
--      OR email LIKE '%demo%'
--      OR email LIKE '%verify%'
-- );

-- 5. Show all requirements (to see what will be deleted)
SELECT 
  id,
  title,
  location,
  created_at,
  email as user_email
FROM requirements r
LEFT JOIN users u ON r.user_id = u.id  
ORDER BY created_at DESC;

-- 6. Delete demo requirements (uncomment to run)
-- DELETE FROM requirements
-- WHERE title LIKE '%Demo%'
--    OR title LIKE '%Test%' 
--    OR title LIKE '%Prueba%';

-- 7. Keep only your real data - Delete everything EXCEPT your user's properties
-- First, find YOUR user ID:
SELECT id, email, name FROM users WHERE email = 'YOUR_EMAIL@gmail.com';

-- Then delete all properties EXCEPT yours (replace YOUR_USER_ID):
-- DELETE FROM properties WHERE user_id != 'YOUR_USER_ID';
-- DELETE FROM requirements WHERE user_id != 'YOUR_USER_ID';

-- ================================================
-- OPTION: NUCLEAR RESET - Delete ALL content
-- ================================================
-- Use this if you want to start completely fresh
-- (Users will remain, only content is deleted)

-- Uncomment to delete EVERYTHING:
-- DELETE FROM properties;
-- DELETE FROM requirements;

-- ================================================
-- VERIFY CLEANUP
-- ================================================

-- Check remaining properties
SELECT COUNT(*) as total_properties FROM properties;

-- Check remaining requirements  
SELECT COUNT(*) as total_requirements FROM requirements;

-- Show what's left
SELECT 
  'Property' as type,
  p.id,
  p.title,
  u.email as owner_email,
  p.created_at
FROM properties p
LEFT JOIN users u ON p.user_id = u.id
UNION ALL
SELECT 
  'Requirement' as type,
  r.id,
  r.title,
  u.email as owner_email,
  r.created_at
FROM requirements r
LEFT JOIN users u ON r.user_id = u.id
ORDER BY created_at DESC;

