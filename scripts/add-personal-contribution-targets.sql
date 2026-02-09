-- =====================================================
-- PERSONAL CONTRIBUTION TARGETS
-- =====================================================
-- Personal targets for each individual linked to company goals
-- All daily Power Moves are linked to these personal targets
-- which then impact company Victory Targets

CREATE TABLE personal_contribution_targets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  victory_target_id UUID NOT NULL REFERENCES victory_targets(id) ON DELETE CASCADE,
  name VARCHAR(500) NOT NULL,
  description TEXT,
  target_value INTEGER NOT NULL, -- Individual's target contribution
  current_value INTEGER NOT NULL DEFAULT 0, -- Current progress
  unit VARCHAR(100) NOT NULL, -- 'conversations', 'clients', etc.
  quarter quarter_type NOT NULL, -- Q1, Q2, Q3, Q4
  year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM NOW()),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, victory_target_id, quarter, year)
);

-- Link personal contribution targets to power moves
CREATE TABLE personal_target_power_move_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  personal_target_id UUID NOT NULL REFERENCES personal_contribution_targets(id) ON DELETE CASCADE,
  power_move_id UUID NOT NULL REFERENCES power_moves(id) ON DELETE CASCADE,
  contribution_weight DECIMAL(3,2) DEFAULT 1.00, -- How much this PM contributes to personal target
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(personal_target_id, power_move_id)
);

-- Enable Row Level Security
ALTER TABLE personal_contribution_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_target_power_move_links ENABLE ROW LEVEL SECURITY;

-- RLS Policies for personal_contribution_targets
CREATE POLICY "Users can view their own targets" ON personal_contribution_targets
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all targets" ON personal_contribution_targets
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('super_admin', 'dept_admin')
    )
  );

CREATE POLICY "Admins can insert targets" ON personal_contribution_targets
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('super_admin', 'dept_admin')
    )
  );

CREATE POLICY "Admins can update targets" ON personal_contribution_targets
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('super_admin', 'dept_admin')
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('super_admin', 'dept_admin')
    )
  );

-- RLS Policies for personal_target_power_move_links
CREATE POLICY "Users can view links for their targets" ON personal_target_power_move_links
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM personal_contribution_targets 
      WHERE id = personal_target_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all links" ON personal_target_power_move_links
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('super_admin', 'dept_admin')
    )
  );
