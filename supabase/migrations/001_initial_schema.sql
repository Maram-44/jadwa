-- ====================================================================
-- Jadwa (جدوى) Supabase Initial Schema Migration
-- Migration File: supabase/migrations/001_initial_schema.sql
-- Description: Complete schema for Jadwa including Auth integration,
--              Profiles, Business Periods, Opportunities, Products Catalog,
--              Inventory Ledger, Operating Expenses, Data Hub Files,
--              Indexes, Row Level Security (RLS), and Triggers.
-- ====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------------------------
-- 1. PROFILES TABLE (linked to auth.users)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT NOT NULL DEFAULT '',
    business_name TEXT NOT NULL DEFAULT 'منشأتي',
    business_type TEXT NOT NULL DEFAULT 'مقهى ومطعم',
    role TEXT NOT NULL DEFAULT 'مالكة المنشأة',
    avatar_initial TEXT NOT NULL DEFAULT 'ش',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- --------------------------------------------------------------------
-- 2. BUSINESS PERIODS TABLE (monthly executive totals & charts)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.business_periods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    period_key TEXT NOT NULL, -- e.g. '2026-09', '2026-08'
    month_code TEXT NOT NULL, -- e.g. 'sep', 'aug'
    name TEXT NOT NULL,       -- e.g. 'سبتمبر', 'أغسطس'
    year INT NOT NULL DEFAULT 2026,
    revenue NUMERIC(12, 2) NOT NULL DEFAULT 0,
    cost NUMERIC(12, 2) NOT NULL DEFAULT 0,
    profit NUMERIC(12, 2) NOT NULL DEFAULT 0,
    potential_saving NUMERIC(12, 2) NOT NULL DEFAULT 0,
    weekly_sales JSONB NOT NULL DEFAULT '[]'::jsonb,
    weekly_costs JSONB NOT NULL DEFAULT '[]'::jsonb,
    changes JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, period_key)
);

-- --------------------------------------------------------------------
-- 3. OPPORTUNITIES TABLE (top savings opportunities and workflows)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.opportunities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    period_key TEXT NOT NULL,
    opportunity_index INT NOT NULL DEFAULT 0,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL DEFAULT 'spark',
    accent_color TEXT NOT NULL DEFAULT '#0d9977',
    tint_color TEXT NOT NULL DEFAULT '#ebf9f3',
    potential_saving NUMERIC(12, 2) NOT NULL DEFAULT 0,
    evidence TEXT NOT NULL,
    steps JSONB NOT NULL DEFAULT '[]'::jsonb,
    calculation TEXT NOT NULL,
    source TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'active', 'awaiting', 'completed', 'dismissed')),
    dismiss_reason TEXT,
    measurement JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, period_key, opportunity_index)
);

-- --------------------------------------------------------------------
-- 4. PRODUCTS CATALOG TABLE (menu items and recipes)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    group_name TEXT NOT NULL DEFAULT 'وجبات',
    parts JSONB,
    stock_refs JSONB DEFAULT '[]'::jsonb,
    opportunity_refs JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, code)
);

-- --------------------------------------------------------------------
-- 5. PRODUCT PERIOD METRICS TABLE (monthly sales, costs, margins)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.product_period_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    period_key TEXT NOT NULL,
    qty INT NOT NULL DEFAULT 0,
    sales NUMERIC(12, 2) NOT NULL DEFAULT 0,
    cost NUMERIC(12, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, product_id, period_key)
);

-- --------------------------------------------------------------------
-- 6. INVENTORY ITEMS TABLE (materials, ingredients, packaging)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.inventory_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    unit TEXT NOT NULL DEFAULT 'كجم',
    lead_time_days INT NOT NULL DEFAULT 3,
    target_stock_days INT NOT NULL DEFAULT 10,
    opportunity_refs JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, code)
);

-- --------------------------------------------------------------------
-- 7. INVENTORY PERIOD METRICS TABLE (stock movement, waste, coverage)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.inventory_period_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES public.inventory_items(id) ON DELETE CASCADE,
    period_key TEXT NOT NULL,
    unit_cost NUMERIC(12, 2) NOT NULL DEFAULT 0,
    previous_cost NUMERIC(12, 2) NOT NULL DEFAULT 0,
    opening NUMERIC(12, 2) NOT NULL DEFAULT 0,
    incoming NUMERIC(12, 2) NOT NULL DEFAULT 0,
    used NUMERIC(12, 2) NOT NULL DEFAULT 0,
    waste NUMERIC(12, 2) NOT NULL DEFAULT 0,
    adjustment NUMERIC(12, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, item_id, period_key)
);

-- --------------------------------------------------------------------
-- 8. OPERATING EXPENSES TABLE (rent, payroll, utilities, software, etc)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    period_key TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('rent', 'payroll', 'utilities', 'software', 'marketing', 'unclassified')),
    name TEXT NOT NULL,
    vendor TEXT NOT NULL,
    amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    day_of_month INT NOT NULL DEFAULT 1 CHECK (day_of_month BETWEEN 1 AND 31),
    expense_date DATE NOT NULL,
    recurring BOOLEAN NOT NULL DEFAULT true,
    renew_day INT,
    opportunity_ref INT,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- --------------------------------------------------------------------
-- 9. DATA HUB FILES TABLE (prepared and validated datasets)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.data_hub_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL CHECK (file_type IN ('sales', 'costs', 'inventory', 'expenses')),
    file_size INT NOT NULL DEFAULT 0,
    period_key TEXT NOT NULL,
    origin TEXT NOT NULL DEFAULT 'upload' CHECK (origin IN ('upload', 'demo')),
    headers JSONB NOT NULL DEFAULT '[]'::jsonb,
    mapping JSONB NOT NULL DEFAULT '{}'::jsonb,
    valid_count INT NOT NULL DEFAULT 0,
    invalid_count INT NOT NULL DEFAULT 0,
    issues JSONB NOT NULL DEFAULT '[]'::jsonb,
    valid_rows JSONB NOT NULL DEFAULT '[]'::jsonb,
    invalid_rows JSONB NOT NULL DEFAULT '[]'::jsonb,
    prepared_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- --------------------------------------------------------------------
-- INDEXES FOR QUERY OPTIMIZATION
-- --------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_periods_user ON public.business_periods(user_id, period_key);
CREATE INDEX IF NOT EXISTS idx_opportunities_user ON public.opportunities(user_id, period_key);
CREATE INDEX IF NOT EXISTS idx_products_user ON public.products(user_id);
CREATE INDEX IF NOT EXISTS idx_prod_metrics_period ON public.product_period_metrics(user_id, period_key);
CREATE INDEX IF NOT EXISTS idx_inventory_user ON public.inventory_items(user_id);
CREATE INDEX IF NOT EXISTS idx_inv_metrics_period ON public.inventory_period_metrics(user_id, period_key);
CREATE INDEX IF NOT EXISTS idx_expenses_user ON public.expenses(user_id, period_key);
CREATE INDEX IF NOT EXISTS idx_data_hub_user ON public.data_hub_files(user_id, period_key);

-- --------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- --------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_period_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_period_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_hub_files ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Business Periods Policies
CREATE POLICY "Users can view own periods" ON public.business_periods FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own periods" ON public.business_periods FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own periods" ON public.business_periods FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own periods" ON public.business_periods FOR DELETE USING (auth.uid() = user_id);

-- Opportunities Policies
CREATE POLICY "Users can view own opportunities" ON public.opportunities FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own opportunities" ON public.opportunities FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own opportunities" ON public.opportunities FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own opportunities" ON public.opportunities FOR DELETE USING (auth.uid() = user_id);

-- Products Policies
CREATE POLICY "Users can view own products" ON public.products FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own products" ON public.products FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own products" ON public.products FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own products" ON public.products FOR DELETE USING (auth.uid() = user_id);

-- Product Period Metrics Policies
CREATE POLICY "Users can view own product metrics" ON public.product_period_metrics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own product metrics" ON public.product_period_metrics FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own product metrics" ON public.product_period_metrics FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own product metrics" ON public.product_period_metrics FOR DELETE USING (auth.uid() = user_id);

-- Inventory Items Policies
CREATE POLICY "Users can view own inventory items" ON public.inventory_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own inventory items" ON public.inventory_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own inventory items" ON public.inventory_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own inventory items" ON public.inventory_items FOR DELETE USING (auth.uid() = user_id);

-- Inventory Period Metrics Policies
CREATE POLICY "Users can view own inventory metrics" ON public.inventory_period_metrics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own inventory metrics" ON public.inventory_period_metrics FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own inventory metrics" ON public.inventory_period_metrics FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own inventory metrics" ON public.inventory_period_metrics FOR DELETE USING (auth.uid() = user_id);

-- Expenses Policies
CREATE POLICY "Users can view own expenses" ON public.expenses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own expenses" ON public.expenses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own expenses" ON public.expenses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own expenses" ON public.expenses FOR DELETE USING (auth.uid() = user_id);

-- Data Hub Files Policies
CREATE POLICY "Users can view own data files" ON public.data_hub_files FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own data files" ON public.data_hub_files FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own data files" ON public.data_hub_files FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own data files" ON public.data_hub_files FOR DELETE USING (auth.uid() = user_id);

-- --------------------------------------------------------------------
-- AUTOMATIC PROFILE CREATION TRIGGER ON SIGNUP
-- --------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, business_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', 'الشيماء'),
    COALESCE(new.raw_user_meta_data->>'business_name', 'منشأتي'),
    'مالكة المنشأة'
  )
  ON CONFLICT (id) DO UPDATE
  SET full_name = EXCLUDED.full_name,
      business_name = EXCLUDED.business_name;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
