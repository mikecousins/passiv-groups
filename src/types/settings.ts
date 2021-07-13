import { Currency } from './currency';

type ContextualMessage = {
  name: string;
};

export type Settings = {
  email: string;
  name: string;
  receive_cash_notifications: boolean;
  receive_drift_notifications: boolean;
  receive_new_symbol_notifications: boolean;
  receive_reminders: boolean;
  user_trial_activated: boolean;
  activated_trial_date: number | null;
  drift_threshold: string;
  trade_with_limit_orders: boolean;
  price_limit_threshold: string;
  preferred_currency: string;
  demo: boolean;
  api_enabled: boolean;
  referral_code: string;
  referral_value: number;
  cash_email_threshold: string;
  apply_cash_email_threshold_to_summary_email: boolean;
  referral_currency: Currency;
  sms_2fa_enabled: boolean;
  phone_number: string | null;
  otp_2fa_enabled: boolean;
  show_contribution_chart: boolean;
  show_total_value_chart: boolean;
  show_total_holdings: boolean;
  show_contributions1Y: boolean;
  show_2columns_dashboard: boolean;
  contextual_messages: ContextualMessage[];
  affiliate_bonus_amount: number;
  take_passiv_tour: boolean;
  model_portfolios_enabled: boolean;
  new_reporting_enabled: boolean;
  e_transfer_email: string | null;
  affiliate_charity: string | null;
  is_affiliate: boolean;
  login_emails_enabled: boolean;
  onboarding_status: number;
};
