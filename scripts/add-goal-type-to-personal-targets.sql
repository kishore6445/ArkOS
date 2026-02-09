-- Add goal_type column to personal_contribution_targets
-- Allows tracking of Quantitative, Qualitative, and Learning goals

ALTER TABLE personal_contribution_targets 
ADD COLUMN goal_type VARCHAR(50) DEFAULT 'quantitative' CHECK (goal_type IN ('quantitative', 'qualitative', 'learning'));

-- Create index for faster filtering
CREATE INDEX idx_personal_contribution_targets_goal_type 
ON personal_contribution_targets(goal_type);

-- Update comment
COMMENT ON COLUMN personal_contribution_targets.goal_type IS 
  'Type of goal: quantitative (numeric targets), qualitative (observable behaviors), learning (skill development)';
