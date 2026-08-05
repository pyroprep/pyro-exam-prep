-- Migration: B2B multi-seat licensing tables
-- Description: Enables company accounts, seat invites, and guarantee claims.

-- ── Company Accounts ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.company_accounts (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name          TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    contact_name  TEXT NOT NULL DEFAULT '',
    seats_purchased INTEGER NOT NULL DEFAULT 0,
    seats_used    INTEGER NOT NULL DEFAULT 0,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Seat Invites ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.seat_invites (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_account_id  UUID REFERENCES public.company_accounts(id) ON DELETE CASCADE,
    token               TEXT NOT NULL UNIQUE,
    email               TEXT,
    remaining_seats     INTEGER NOT NULL DEFAULT 0,
    expires_at          TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by          UUID REFERENCES auth.users(id)
);

CREATE INDEX IF NOT EXISTS idx_seat_invites_token
    ON public.seat_invites (token);

-- ── Company Members ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.company_members (
    company_account_id UUID REFERENCES public.company_accounts(id) ON DELETE CASCADE,
    user_id            UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role               TEXT NOT NULL DEFAULT 'member',
    joined_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (company_account_id, user_id)
);

-- ── Guarantee Claims ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.guarantee_claims (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    exam_date   TEXT NOT NULL,
    exam_score  INTEGER NOT NULL,
    details     TEXT,
    status      TEXT NOT NULL DEFAULT 'pending',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    reviewed_at TIMESTAMPTZ,
    reviewed_by UUID REFERENCES auth.users(id)
);

CREATE INDEX IF NOT EXISTS idx_guarantee_claims_user_id
    ON public.guarantee_claims (user_id);

-- ── Promo Redemptions ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.promo_redemptions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    promo_code      TEXT NOT NULL,
    discount_percent INTEGER NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_promo_redemptions_user_id
    ON public.promo_redemptions (user_id);

-- ── Row Level Security ───────────────────────────────────────────────────────
ALTER TABLE public.company_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seat_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guarantee_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_redemptions ENABLE ROW LEVEL SECURITY;

-- Service role bypasses RLS; restrict client access.
-- Adjust policies to match your auth requirements.

-- Company accounts: only accessible to members
CREATE POLICY "Company accounts visible to members"
    ON public.company_accounts
    FOR SELECT
    USING (
      id IN (
        SELECT company_account_id FROM public.company_members WHERE user_id = auth.uid()
      )
    );

-- Seat invites: readable by service role only (handled server-side)
CREATE POLICY "Seat invites not publicly readable"
    ON public.seat_invites
    FOR SELECT
    USING (false);

-- Company members: visible to member or service role
CREATE POLICY "Members visible to company members"
    ON public.company_members
    FOR SELECT
    USING (
      company_account_id IN (
        SELECT company_account_id FROM public.company_members WHERE user_id = auth.uid()
      )
    );

-- Guarantee claims: users can view their own claims
CREATE POLICY "Users can view own guarantee claims"
    ON public.guarantee_claims
    FOR SELECT
    USING (user_id = auth.uid());

-- Promo redemptions: users can view their own redemptions
CREATE POLICY "Users can view own promo redemptions"
    ON public.promo_redemptions
    FOR SELECT
    USING (user_id = auth.uid());