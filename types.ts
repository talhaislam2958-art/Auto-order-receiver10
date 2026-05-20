// =============================================
// CORE ENUMS (matching DB enums)
// =============================================
export type UserRole = 'user' | 'owner' | 'admin';

// user_status enum in DB: active | inactive | suspended | banned_temp | banned_perm
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'banned_temp' | 'banned_perm';

export type OrderStatus =
  | 'available'
  | 'locked'
  | 'pending_upload'
  | 'pending_review'
  | 'reupload_required'
  | 'approved'
  | 'rejected'
  | 'cancelled'
  | 'pay_timeout'
  | 'invalid'
  | 'frozen';

export type WithdrawalStatus = 'pending' | 'completed' | 'rejected';
export type WithdrawalMethod = 'binance_uid' | 'bsc_wallet';

export type TicketStatus = 'open' | 'pending' | 'resolved' | 'closed';
export type TicketCategory =
  | 'order_issue'
  | 'withdrawal_issue'
  | 'login_issue'
  | 'payment_issue'
  | 'wallet_issue'
  | 'invalid_order_issue'
  | 'frozen_order_issue'
  | 'other';

export type TransactionType = 'credit' | 'debit';

export type TxLabel =
  | 'Order Completed'
  | 'Withdrawal Applied'
  | 'Withdrawal Completed'
  | 'Dispute Deduction'
  | 'Dispute Credit Restore'
  | 'Transaction';

// Legacy enum (kept for backward compat with old orders)
export type PaymentMethod = 'stc_pay' | 'urpay' | 'al_rajhi' | 'barq';

// =============================================
// PAYMENT METHOD RECORD (custom payment_methods table)
// =============================================
export interface PaymentMethodRecord {
  id: string;       // text key e.g. 'stc_pay', 'snb_bank', 'custom_xyz'
  label: string;
  is_default: boolean;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

// Per-method account details stored in advertisements.account_details jsonb
export interface PaymentAccountDetails {
  holder_name: string;
  account_number: string;
  iban: string;
  instructions: string;
}

// Snapshot stored in orders.account_snapshot jsonb
export interface AccountSnapshot {
  holder_name: string;
  account_number: string;
  iban: string;
  instructions: string;
  method_label: string;
  method_key: string;
}

// =============================================
// DB ENTITY TYPES
// =============================================
export type UserCategory = 'A' | 'B';

export interface Profile {
  id: string;
  uid: string | null;                 // auto-generated unique UID e.g. UID100001
  email: string | null;
  full_name: string | null;
  phone: string | null;
  telegram_username: string | null;   // for owner contact
  whatsapp_number: string | null;     // for owner contact
  role: UserRole;
  user_status: UserStatus;
  category_type: UserCategory | null; // A | B | null (unassigned)
  max_active_orders: number | null;       // null = unlimited
  min_sar_amount: number | null;          // null = no minimum
  max_sar_amount: number | null;          // null = no maximum
  allowed_payment_methods: string[];      // ['ALL'] = all, or ['stc_pay','barq',...] = restricted
  ban_until: string | null;           // timestamp for temp bans
  usdt_balance: number;               // current USDT wallet balance
  sar_balance: number;                // current SAR equivalent balance
  is_approved: boolean;               // pending approval flag
  total_completed_orders: number;
  total_cancel_orders: number;
  total_timeout_orders: number;
  total_invalid_orders: number;
  created_at: string;
  updated_at: string;
}

export interface Advertisement {
  id: string;
  owner_id: string;
  sar_amount: number;
  usdt_amount: number;
  sar_price: number;
  available_quantity: number;
  // Legacy enum array (kept for old records)
  payment_methods: PaymentMethod[];
  payment_details: Record<string, string>;
  payment_instructions: string | null;
  // New flexible text-key array + structured account details
  payment_method_keys: string[];
  account_details: Record<string, PaymentAccountDetails>;
  is_active: boolean;
  locked_by: string | null;
  locked_at: string | null;
  timer_minutes: number;
  // Visibility targeting
  visibility_type: 'all' | 'specific' | null;
  visible_to_users: string[] | null;
  is_permanently_closed: boolean;
  is_invalid: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContactSettings {
  id: string;
  whatsapp: string;
  telegram: string;
  support_email: string;
  support_message: string;
  updated_at: string;
}

export interface AdminAccount {
  id: string;
  uid: string | null;
  full_name: string | null;
  email: string;
  mobile_number: string | null;
  role: string;
  is_approved: boolean;
  is_active: boolean;
  created_by: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface OwnerSettings {
  id: string;
  owner_uid: string;
  owner_name: string | null;
  owner_email: string | null;
  mobile_number: string | null;  // legacy column
  owner_mobile: string | null;   // canonical column per requirement
  whatsapp: string | null;
  telegram: string | null;
  support_email: string | null;
  updated_at: string;
}

export interface Order {
  id: string;
  /** Nullable: set to NULL when a pay_timeout order is reposted back to the marketplace */
  user_id: string | null;
  advertisement_id: string;
  order_number: string;
  sar_amount: number;
  usdt_amount: number;
  sar_price: number;
  // Legacy enum field (kept for backward compat)
  payment_method: PaymentMethod;
  // New flexible key + snapshot
  selected_method_key: string | null;
  account_snapshot: AccountSnapshot | null;
  status: OrderStatus;
  payment_receipt_url: string | null;
  sms_screenshot_url: string | null;
  expires_at: string;
  reviewed_at: string | null;
  review_note: string | null;
  freeze_reason: string | null;
  frozen_at: string | null;
  pre_freeze_status: OrderStatus | null;
  invalid_reason: string | null;
  timer_minutes: number;
  // Wallet credit/deduct tracking
  credited_usdt: number | null;
  credited_sar: number | null;
  deducted_usdt: number | null;
  deducted_sar: number | null;
  deduction_reason: string | null;
  deducted_at: string | null;
  dispute_status: string;
  // Timestamp audit trail
  approved_at: string | null;
  rejected_at: string | null;
  cancelled_at: string | null;
  // Timeout audit (preserved even after repost)
  timed_out_by_user_id: string | null;
  timed_out_at: string | null;
  // Repost audit
  reposted_at: string | null;
  // Cancel / invalid history — permanently preserved, even after repost
  cancelled_by_user_id: string | null;
  invalid_by_user_id:   string | null;
  // Category pricing snapshot
  applied_usdt_price:   number | null;  // price used at order lock time
  applied_category:     UserCategory | null; // user's category at lock time
  created_at: string;
  updated_at: string;
  // Joined
  profiles?: Profile;
  advertisements?: Advertisement;
}

/** Immutable ledger entry — one row per terminal event per order-receive cycle. */
export interface OrderHistory {
  id: string;
  order_id: string;
  order_number: string;
  advertisement_id: string | null;
  user_id: string;
  /** 'cancelled' | 'pay_timeout' | 'invalid' | 'approved' | 'rejected' */
  event_type: 'cancelled' | 'pay_timeout' | 'invalid' | 'approved' | 'rejected';
  sar_amount: number;
  usdt_amount: number;
  /** Timestamp when the event occurred */
  event_at: string;
  notes: string | null;
  created_at: string;
  // Joined relations
  profiles?: Profile;
}

export const HISTORY_EVENT_LABELS: Record<OrderHistory['event_type'], string> = {
  approved:    'Completed',
  cancelled:   'Cancelled',
  pay_timeout: 'Pay Timeout',
  invalid:     'Invalid',
  rejected:    'Rejected',
};

export const HISTORY_EVENT_COLORS: Record<OrderHistory['event_type'], string> = {
  approved:    'bg-success/10 text-success border-success/30',
  cancelled:   'bg-muted text-muted-foreground border-border',
  pay_timeout: 'bg-destructive/10 text-destructive border-destructive/30',
  invalid:     'bg-orange-500/10 text-orange-400 border-orange-400/30',
  rejected:    'bg-destructive/10 text-destructive border-destructive/30',
};

export interface WalletTransaction {
  id: string;
  user_id: string;
  order_id: string | null;
  withdrawal_id: string | null;
  amount: number;
  sar_amount: number;
  transaction_type: TransactionType;
  tx_label: TxLabel;
  description: string | null;
  deduction_reason: string | null;
  dispute_status: string;             // 'none' | 'pending' | 'resolved'
  reference_number: string | null;    // order number reference
  created_at: string;
  // Joined
  orders?: Order;
  withdrawals?: Withdrawal;
}

export interface Withdrawal {
  id: string;
  user_id: string;
  amount: number;
  method: WithdrawalMethod;
  address: string;
  status: WithdrawalStatus;
  processed_at: string | null;
  completed_at: string | null;
  proof_url: string | null;
  note: string | null;
  created_at: string;
  updated_at: string;
  uid_label?: string | null;
  // Joined
  profiles?: Profile;
}

export interface SupportTicket {
  id: string;
  user_id: string;
  category: TicketCategory;
  subject: string;
  status: TicketStatus;
  created_at: string;
  updated_at: string;
  // Joined
  profiles?: Profile;
  support_messages?: SupportMessage[];
}

export interface SupportMessage {
  id: string;
  ticket_id: string;
  sender_id: string;
  message: string;
  screenshot_url: string | null;
  is_owner_reply: boolean;
  created_at: string;
  // Joined
  profiles?: Profile;
}

// =============================================
// FORM TYPES
// =============================================
export interface RegisterForm {
  full_name: string;
  email: string;
  password: string;
  confirm_password: string;
  phone: string;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface CreateAdForm {
  usdt_amount: string;
  sar_price: string;
  available_quantity: string;
  payment_methods: PaymentMethod[];
  payment_details: Record<string, string>;
  payment_instructions: string;
}

export interface WithdrawalForm {
  amount: string;
  method: WithdrawalMethod;
  address: string;
}

export interface SupportTicketForm {
  category: TicketCategory;
  subject: string;
  message: string;
  screenshot?: File | null;
}

// =============================================
// DISPLAY HELPERS
// =============================================
export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  stc_pay: 'STC Pay',
  urpay: 'urpay',
  al_rajhi: 'Al Rajhi Bank',
  barq: 'Barq',
};

export const PAYMENT_METHOD_COLORS: Record<PaymentMethod, string> = {
  stc_pay:  'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700',
  urpay:    'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700',
  al_rajhi: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700',
  barq:     'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700',
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  available: 'Available',
  locked: 'Locked',
  pending_upload: 'Awaiting Payment Proof',
  pending_review: 'Pending Review',
  reupload_required: 'Re-upload Required',
  approved: 'Approved',
  rejected: 'Rejected',
  cancelled: 'Cancelled',
  pay_timeout: 'Pay Timeout',
  invalid: 'Invalid',
  frozen: 'Frozen',
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  available: 'bg-success/15 text-success border border-success/30',
  locked: 'bg-primary/15 text-primary border border-primary/30',
  pending_upload: 'bg-warning/15 text-warning border border-warning/30',
  pending_review: 'bg-blue-500/15 text-blue-400 border border-blue-400/30',
  reupload_required: 'bg-orange-500/15 text-orange-400 border border-orange-400/30',
  approved: 'bg-success/15 text-success border border-success/30',
  rejected: 'bg-destructive/15 text-destructive border border-destructive/30',
  cancelled: 'bg-muted text-muted-foreground border border-border',
  pay_timeout: 'bg-destructive/15 text-destructive border border-destructive/30',
  invalid: 'bg-orange-500/15 text-orange-400 border border-orange-400/30',
  frozen: 'bg-blue-500/15 text-blue-400 border border-blue-400/30',
};

export const WITHDRAWAL_STATUS_LABELS: Record<WithdrawalStatus, string> = {
  pending: 'Pending',
  completed: 'Completed',
  rejected: 'Rejected',
};

export const TICKET_STATUS_LABELS: Record<TicketStatus, string> = {
  open: 'Open',
  pending: 'Pending',
  resolved: 'Resolved',
  closed: 'Closed',
};

export const TICKET_CATEGORY_LABELS: Record<TicketCategory, string> = {
  order_issue: 'Order Issue',
  withdrawal_issue: 'Withdrawal Issue',
  login_issue: 'Login Issue',
  payment_issue: 'Payment Issue',
  wallet_issue: 'Wallet Issue',
  invalid_order_issue: 'Invalid Order Issue',
  frozen_order_issue: 'Frozen Order Issue',
  other: 'Other',
};

export const WITHDRAWAL_METHOD_LABELS: Record<WithdrawalMethod, string> = {
  binance_uid: 'Binance UID',
  bsc_wallet: 'BSC Wallet Address',
};

export const USER_STATUS_LABELS: Record<UserStatus, string> = {
  active: 'Active',
  inactive: 'Inactive',
  suspended: 'Suspended',
  banned_temp: 'Temporarily Banned',
  banned_perm: 'Permanently Banned',
};

export const USER_STATUS_COLORS: Record<UserStatus, string> = {
  active: 'bg-success/15 text-success border border-success/30',
  inactive: 'bg-muted text-muted-foreground border border-border',
  suspended: 'bg-warning/15 text-warning border border-warning/30',
  banned_temp: 'bg-orange-500/15 text-orange-400 border border-orange-400/30',
  banned_perm: 'bg-destructive/15 text-destructive border border-destructive/30',
};

// Helper: check if a user is banned (temp or perm)
export function isUserBanned(profile: Profile): boolean {
  if (profile.user_status === 'banned_perm') return true;
  if (profile.user_status === 'banned_temp') {
    if (!profile.ban_until) return true; // no expiry = still banned
    return new Date(profile.ban_until) > new Date();
  }
  // Inactive or suspended users are also blocked from marketplace
  if (profile.user_status === 'inactive' || profile.user_status === 'suspended') return true;
  return false;
}

// Helper: check if user is pending approval (not yet activated)
export function isUserPendingApproval(profile: Profile): boolean {
  return !profile.is_approved && profile.role !== 'owner';
}

// Helper: check if user can access marketplace
export function canUserAccessMarketplace(profile: Profile): boolean {
  if (profile.role === 'owner') return true;
  if (!profile.is_approved) return false;
  if (isUserBanned(profile)) return false;
  return true;
}

/**
 * Returns the IMMUTABLE historical status for this order from this user's perspective.
 *
 * The `orders` table uses a single row for both the marketplace lifecycle AND the user
 * history. When an owner reposts an order, its `status` changes back to `available`,
 * but the audit columns (cancelled_by_user_id, invalid_by_user_id, timed_out_by_user_id)
 * are NEVER cleared — they permanently record who caused each terminal event.
 *
 * This helper resolves what the user should SEE for this order:
 *   - If the user cancelled it   → always show 'cancelled'  (even after repost)
 *   - If the user marked invalid → always show 'invalid'    (even after repost)
 *   - If the user caused timeout → always show 'pay_timeout' (even after repost)
 *   - Otherwise                  → current order.status (live marketplace state)
 *
 * ACTION-GUARDS (canCancel, canUpload, etc.) MUST still use `order.status` directly
 * — this helper is for DISPLAY ONLY.
 */
export function getEffectiveStatusForUser(order: Order, userId: string): OrderStatus {
  if (order.cancelled_by_user_id === userId) return 'cancelled';
  if (order.invalid_by_user_id   === userId) return 'invalid';
  if (order.timed_out_by_user_id === userId) return 'pay_timeout';
  return order.status;
}
