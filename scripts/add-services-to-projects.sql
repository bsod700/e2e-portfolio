-- Migration: Add services field to projects_content table
-- This adds a services column to store an array of service tags for each project

-- Add the services column as a text array
ALTER TABLE projects_content 
ADD COLUMN IF NOT EXISTS services text[];

-- Add a comment describing the column
COMMENT ON COLUMN projects_content.services IS 'Array of service tags associated with the project (e.g., UI/UX, Development, AI Integration)';

-- Update existing records with default services based on project_id (optional)
-- You can customize these based on your actual projects

-- Tierro project
UPDATE projects_content 
SET services = ARRAY['UI/UX', 'Branding', 'Admin Management', 'Music Player', 'Development']
WHERE project_id = 'tierro' AND services IS NULL;

-- Prompt Management project
UPDATE projects_content 
SET services = ARRAY['UI/UX', 'Development', 'Extension Development', 'Prompt Engineering', 'AI Integration']
WHERE project_id = 'prompt-management' AND services IS NULL;

-- LanderX project
UPDATE projects_content 
SET services = ARRAY['UI/UX', 'Development', 'AI Integration', 'Landing Page', 'Marketing']
WHERE project_id = 'landerx' AND services IS NULL;

-- Brush Along project
UPDATE projects_content 
SET services = ARRAY['UI/UX', 'Illustration', 'Game Design', 'Children Motivation']
WHERE project_id = 'brush-along' AND services IS NULL;

