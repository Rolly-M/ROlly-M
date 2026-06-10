-- ============================================
-- CouplesBudget Database Schema
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- HOUSEHOLDS
-- ============================================
CREATE TABLE IF NOT EXISTS households (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL DEFAULT 'Our Household',
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invite_token TEXT UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PROFILES
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  currency TEXT DEFAULT 'USD',
  household_id UUID REFERENCES households(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_household_id UUID;
BEGIN
  -- Create a household for the new user
  INSERT INTO households (owner_id, name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', 'My') || '''s Household')
  RETURNING id INTO new_household_id;

  -- Create profile
  INSERT INTO profiles (id, email, full_name, avatar_url, currency, household_id)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE(NEW.raw_user_meta_data->>'currency', 'USD'),
    new_household_id
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- HOUSEHOLD INVITES
-- ============================================
CREATE TABLE IF NOT EXISTS household_invites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  invitee_email TEXT NOT NULL,
  inviter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- EXPENSE CATEGORIES
-- ============================================
CREATE TABLE IF NOT EXISTS expense_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT '📌',
  color TEXT NOT NULL DEFAULT '#6366f1',
  is_default BOOLEAN DEFAULT FALSE,
  household_id UUID REFERENCES households(id) ON DELETE CASCADE
);

-- Default categories
INSERT INTO expense_categories (name, icon, color, is_default) VALUES
  ('Housing', '🏠', '#ec4899', true),
  ('Food & Dining', '🍽️', '#f59e0b', true),
  ('Transportation', '🚗', '#6366f1', true),
  ('Healthcare', '💊', '#14b8a6', true),
  ('Entertainment', '🎬', '#8b5cf6', true),
  ('Shopping', '🛍️', '#f97316', true),
  ('Utilities', '⚡', '#3b82f6', true),
  ('Education', '📚', '#06b6d4', true),
  ('Travel', '✈️', '#84cc16', true),
  ('Personal Care', '💅', '#f43f5e', true),
  ('Insurance', '🛡️', '#10b981', true),
  ('Savings', '💰', '#a855f7', true),
  ('Gifts & Donations', '🎁', '#fb923c', true),
  ('Other', '📌', '#64748b', true)
ON CONFLICT DO NOTHING;

-- ============================================
-- INCOME SOURCES
-- ============================================
CREATE TABLE IF NOT EXISTS income_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('salary', 'freelance', 'rental', 'dividends', 'business', 'side_hustle', 'investment', 'benefits', 'pension', 'other')),
  amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  frequency TEXT NOT NULL DEFAULT 'monthly' CHECK (frequency IN ('monthly', 'weekly', 'biweekly', 'annually')),
  currency TEXT NOT NULL DEFAULT 'USD',
  is_active BOOLEAN DEFAULT TRUE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- EXPENSES
-- ============================================
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES expense_categories(id),
  amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  description TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- BUDGETS
-- ============================================
CREATE TABLE IF NOT EXISTS budgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES expense_categories(id) ON DELETE CASCADE,
  amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
  year INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (household_id, category_id, month, year)
);

-- ============================================
-- INVESTMENT GOALS
-- ============================================
CREATE TABLE IF NOT EXISTS investment_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  target_amount NUMERIC(14, 2) NOT NULL DEFAULT 0,
  current_amount NUMERIC(14, 2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  deadline DATE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- GOAL CONTRIBUTIONS
-- ============================================
CREATE TABLE IF NOT EXISTS goal_contributions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  goal_id UUID NOT NULL REFERENCES investment_goals(id) ON DELETE CASCADE,
  household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  contributed_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_expenses_household_date ON expenses(household_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_household_category ON expenses(household_id, category_id);
CREATE INDEX IF NOT EXISTS idx_income_sources_household ON income_sources(household_id);
CREATE INDEX IF NOT EXISTS idx_budgets_household_month_year ON budgets(household_id, month, year);
CREATE INDEX IF NOT EXISTS idx_goals_household ON investment_goals(household_id);
CREATE INDEX IF NOT EXISTS idx_contributions_goal ON goal_contributions(goal_id);
CREATE INDEX IF NOT EXISTS idx_profiles_household ON profiles(household_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE households ENABLE ROW LEVEL SECURITY;
ALTER TABLE household_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE income_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE investment_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE goal_contributions ENABLE ROW LEVEL SECURITY;

-- Helper function to get user's household_id
CREATE OR REPLACE FUNCTION get_user_household_id(user_id UUID)
RETURNS UUID AS $$
  SELECT household_id FROM profiles WHERE id = user_id;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- PROFILES RLS
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (id = auth.uid() OR household_id = get_user_household_id(auth.uid()));

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (id = auth.uid());

-- HOUSEHOLDS RLS
CREATE POLICY "Household members can view household" ON households
  FOR SELECT USING (id = get_user_household_id(auth.uid()));

CREATE POLICY "Household owner can update" ON households
  FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "Anyone can create a household" ON households
  FOR INSERT WITH CHECK (owner_id = auth.uid());

-- HOUSEHOLD INVITES RLS
CREATE POLICY "Members can view invites" ON household_invites
  FOR SELECT USING (household_id = get_user_household_id(auth.uid()));

CREATE POLICY "Members can create invites" ON household_invites
  FOR INSERT WITH CHECK (household_id = get_user_household_id(auth.uid()) AND inviter_id = auth.uid());

CREATE POLICY "Invitee can update status" ON household_invites
  FOR UPDATE USING (inviter_id = auth.uid() OR household_id = get_user_household_id(auth.uid()));

-- INCOME SOURCES RLS
CREATE POLICY "Household members can view income" ON income_sources
  FOR SELECT USING (household_id = get_user_household_id(auth.uid()));

CREATE POLICY "Members can add income" ON income_sources
  FOR INSERT WITH CHECK (household_id = get_user_household_id(auth.uid()) AND created_by = auth.uid());

CREATE POLICY "Owner can update income" ON income_sources
  FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "Owner can delete income" ON income_sources
  FOR DELETE USING (created_by = auth.uid());

-- EXPENSE CATEGORIES RLS
CREATE POLICY "Anyone can view default categories" ON expense_categories
  FOR SELECT USING (is_default = true OR household_id = get_user_household_id(auth.uid()));

CREATE POLICY "Members can add custom categories" ON expense_categories
  FOR INSERT WITH CHECK (household_id = get_user_household_id(auth.uid()));

-- EXPENSES RLS
CREATE POLICY "Household members can view expenses" ON expenses
  FOR SELECT USING (household_id = get_user_household_id(auth.uid()));

CREATE POLICY "Members can add expenses" ON expenses
  FOR INSERT WITH CHECK (household_id = get_user_household_id(auth.uid()) AND created_by = auth.uid());

CREATE POLICY "Owner can delete expenses" ON expenses
  FOR DELETE USING (created_by = auth.uid());

-- BUDGETS RLS
CREATE POLICY "Household members can view budgets" ON budgets
  FOR SELECT USING (household_id = get_user_household_id(auth.uid()));

CREATE POLICY "Members can manage budgets" ON budgets
  FOR ALL USING (household_id = get_user_household_id(auth.uid()));

-- INVESTMENT GOALS RLS
CREATE POLICY "Household members can view goals" ON investment_goals
  FOR SELECT USING (household_id = get_user_household_id(auth.uid()));

CREATE POLICY "Members can add goals" ON investment_goals
  FOR INSERT WITH CHECK (household_id = get_user_household_id(auth.uid()) AND created_by = auth.uid());

CREATE POLICY "Members can update goals" ON investment_goals
  FOR UPDATE USING (household_id = get_user_household_id(auth.uid()));

CREATE POLICY "Owner can delete goals" ON investment_goals
  FOR DELETE USING (created_by = auth.uid());

-- GOAL CONTRIBUTIONS RLS
CREATE POLICY "Household members can view contributions" ON goal_contributions
  FOR SELECT USING (household_id = get_user_household_id(auth.uid()));

CREATE POLICY "Members can add contributions" ON goal_contributions
  FOR INSERT WITH CHECK (household_id = get_user_household_id(auth.uid()) AND contributed_by = auth.uid());

CREATE POLICY "Owner can delete contributions" ON goal_contributions
  FOR DELETE USING (contributed_by = auth.uid());
