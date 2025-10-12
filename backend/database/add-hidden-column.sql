-- ============================================
-- MIGRATION: Add hidden column to properties and requirements
-- Ejecutar en Supabase SQL Editor
-- ============================================

-- Add hidden column to properties table
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS hidden BOOLEAN DEFAULT false;

-- Add hidden column to requirements table
ALTER TABLE requirements 
ADD COLUMN IF NOT EXISTS hidden BOOLEAN DEFAULT false;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_properties_hidden ON properties(hidden);
CREATE INDEX IF NOT EXISTS idx_requirements_hidden ON requirements(hidden);

-- ============================================
-- VERIFICATION
-- ============================================

-- Check if columns were added
SELECT 
  column_name, 
  data_type, 
  column_default
FROM information_schema.columns
WHERE table_name IN ('properties', 'requirements')
  AND column_name = 'hidden';

