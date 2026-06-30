-- ════════════════════════════════════════════════════════════════════════
-- 011b_auction_bids_model.sql
--
-- Extension de auction_bids :
--   • bid_model  — profil acquéreur (club_deal / corporate / fund / equity_stake)
--   • equity_percentage — prise de participation (Equity Stake uniquement)
--   • equity_consideration — nature de la contrepartie (Equity Stake uniquement)
--
-- ⚠️  Appliquer après 011_auction_bids_sequesters_kyc.sql
-- ════════════════════════════════════════════════════════════════════════

ALTER TABLE auction_bids
  ADD COLUMN IF NOT EXISTS bid_model TEXT NOT NULL DEFAULT 'corporate'
    CHECK (bid_model IN ('club_deal', 'corporate', 'fund', 'equity_stake'));

ALTER TABLE auction_bids
  ADD COLUMN IF NOT EXISTS equity_percentage NUMERIC;

ALTER TABLE auction_bids
  ADD COLUMN IF NOT EXISTS equity_consideration TEXT
    CHECK (equity_consideration IN (
      'advisory_fees', 'carried_interest', 'cash_partial', 'warrant', 'revenue_share'
    ) OR equity_consideration IS NULL);

COMMENT ON COLUMN auction_bids.bid_model IS
  'Profil acquéreur : club_deal (HNWI + co-investisseurs), corporate (entité légale),
   fund (PE/VC/FO/Search Fund), equity_stake (prise de participation sans cession)';

COMMENT ON COLUMN auction_bids.equity_percentage IS
  'Uniquement pour equity_stake : pourcentage du capital visé';

COMMENT ON COLUMN auction_bids.equity_consideration IS
  'Uniquement pour equity_stake : nature de la contrepartie';

-- ════════════════════════════════════════════════════════════════════════
-- FIN — attendre validation Yohann avant db push
-- ════════════════════════════════════════════════════════════════════════
