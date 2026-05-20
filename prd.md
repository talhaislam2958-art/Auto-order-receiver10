# Requirements Document

## 1. Application Overview

**Application Name**: Saudi USDT P2P Trading Platform

**Description**: A secure peer-to-peer USDT trading platform designed for Saudi Arabian users, featuring a single Owner/Admin control system. The platform enables users to purchase USDT using SAR through various local payment methods, with Owner-managed advertisements and order verification processes. Features advanced order locking system, automatic USDT calculation, secure payment screenshot handling, customizable Owner contact settings, custom order timers, user permission management, order visibility controls, unique order number tracking, invalid order handling, pay timeout management with manual repost workflow, order freeze system with dispute resolution, permanent deletion for inactive orders with safe cleanup, customizable payment methods, user ban system, per-user order limits, per-user SAR amount controls, advanced user wallet system with USDT and SAR balance tracking, order balance deduction system, frozen dispute resolution, Saudi local time display, daily user statistics, new user activation approval, withdrawal proof upload, comprehensive Owner user balance and statistics panels, mobile-responsive bottom navigation bar, and back button navigation system. Backend powered by Supabase with RLS policies, AuthContext managing owner/user roles.

## 2. Users and Usage Scenarios

**Target Users**:
- Regular Users: Individuals seeking to purchase USDT using SAR
- Owner/Admin: Single platform administrator managing all operations

**Core Usage Scenarios**:
- Users browse available USDT orders based on their SAR limits, receive orders with instant locking, upload payment proofs, and receive USDT to in-app wallet with automatic SAR equivalent calculation
- Owner creates orders with automatic USDT calculation, custom timers, and full payment account details; manages custom payment methods; reviews payment proofs privately including completed orders; approves/rejects orders with automatic wallet credit; manages withdrawals with proof upload and automatic balance deduction; handles invalid orders; manually reposts timed-out orders from Pay Timeout section; freezes orders; resolves disputes or approves frozen orders; permanently deletes inactive orders with safe cleanup; bans/unbans users; sets per-user order limits and SAR amount controls; deducts balances when payment issues occur; resolves frozen disputes; approves new user registrations; monitors all user balances and statistics
- Users track order status across Ongoing/Pending/Completed/Frozen/Pay Timeout tabs with Saudi local time display via mobile bottom navigation bar
- Users view wallet balance showing USDT and SAR equivalent, transaction history, deduction records via mobile bottom navigation bar
- Users request USDT withdrawals to external wallets and view withdrawal proofs
- Users contact Owner/Admin through WhatsApp, Telegram, or support form using Owner-configured contact details
- Owner manages user permissions, sets order limits, controls order visibility per user, manages payment methods, views user wallet history, order history, withdrawal history, frozen orders, deduction history, daily statistics per user, all user balances, and user statistics
- New users remain pending approval until Owner/Admin manually activates their accounts
- Users navigate using back button on all pages and mobile bottom navigation bar

## 3. Page Structure and Functional Description

### 3.1 Page Structure

```
Application Root
├── Public Pages
│   ├── User Registration
│   └── User Login
├── Hidden Owner Routes
│   ├── /owner-register
│   └── /owner-login
├── User Pages (after login and approval)
│   ├── Mobile Bottom Navigation Bar
│   │   ├── Market Tab
│   │   ├── My Orders Tab
│   │   └── Wallet Tab
│   ├── Market Page (Available Orders)
│   ├── My Orders Page (/orders)
│   │   ├── Ongoing Orders Section
│   │   ├── Pending Orders Section
│   │   ├── Completed Orders Section
│   │   ├── Frozen Orders Section
│   │   └── Pay Timeout Section
│   ├── Wallet Page
│   │   ├── Balance Display
│   │   ├── Transaction History
│   │   ├── Deduction History
│   │   ├── Withdraw Option
│   │   └── Support Option
│   ├── Withdrawal Request Page
│   ├── Customer Support
│   └── Support History Page
└── Owner/Admin Dashboard (owner only)
    ├── Order Creation (with live USDT calculation, custom timer, and full payment account details)
    ├── Active Orders (Ads)
    ├── Received By Users
    ├── Pending Orders Review (with secure screenshot viewer)
    ├── Completed Orders (with secure screenshot viewer)
    ├── Cancelled Orders
    ├── Invalid Orders Management (with secure screenshot viewer)
    ├── Pay Timeout Orders Management (with Repost, Permanently Close, Delete actions)
    ├── Frozen Orders Management (with secure screenshot viewer, Resolve Dispute and Approve actions only)
    ├── Rejected Orders (with secure screenshot viewer)
    ├── All Orders (with secure screenshot viewer)
    ├── All User Balances
    ├── User Statistics
    ├── User Management (ban/unban, order limits, SAR limits, wallet history, order history, withdrawal history, frozen orders, deduction history, daily statistics, approve/reject new users)
    ├── Withdrawal Management (with withdrawal proof upload and automatic balance deduction)
    ├── Support Tickets Management
    ├── Support Settings (WhatsApp, Telegram, Email)
    ├── Payment Method Settings (add/edit/remove payment methods)
    └── Marketplace Controls
```

### 3.2 Public Pages

#### User Registration
- Collect: Full Name, Email, Password, Confirm Password, Phone Number
- Assign role = user automatically
- Set user status = Pending Approval
- Redirect to User Login after successful registration
- Display message: Your account is pending approval. You will be notified once approved.

#### User Login
- Input: Email, Password
- If user status = Pending Approval: show message \"Your account is pending approval. Please wait for admin activation.\"
- If user status = Active: redirect to Market Page after successful login
- If user status = Temporarily Banned or Permanently Banned: show message \"Your account has been suspended. Please contact support.\"

#### Owner Registration (/owner-register)
- Hidden route, not visible to normal users
- Collect: Full Name, Email, Password, Confirm Password, Phone Number
- Automatically assign role = owner
- Grant full admin permissions
- Redirect to Owner Login after registration

#### Owner Login (/owner-login)
- Hidden route, not visible to normal users
- Input: Email, Password
- Maintain session until logout
- Redirect to Owner/Admin Dashboard after successful login

### 3.3 User Pages

#### Mobile Bottom Navigation Bar
- Fixed at bottom of screen
- Mobile responsive design
- Supports dark mode and light mode
- Contains three tabs:
  + Market: navigates to Market Page (Available Orders)
  + My Orders: navigates to My Orders Page
  + Wallet: navigates to Wallet Page (includes Balance, Transaction History, Withdraw, Support)
- Active tab highlighted
- Always visible on user pages

#### Market Page (Available Orders)
- Accessible via bottom navigation bar Market tab
- Only accessible if user status = Active
- Display all available orders posted by Owner/Admin based on user visibility permissions and SAR amount limits
- Filter orders: show only orders with status = available
- Filter orders based on Owner-configured visibility rules and per-user SAR amount range
- Banned users (Temporarily Banned or Permanently Banned) cannot view available orders
- Pending Approval users cannot view available orders
- Real-time updates when Owner posts new orders or when locked orders become available again
- Each order card shows:
  + Order Number (ORD-XXXX)
  + SAR amount user will pay
  + USDT amount user will receive
  + USDT price per unit
  + Payment methods with colored badges
  + Receive Order button
- When user clicks Receive Order:
  + Check if user status = Active
  + Check if user is banned (Temporarily Banned or Permanently Banned)
  + Check if user has reached maximum active order limit
  + If checks pass: instantly lock order to that user only, change status to active/locked
  + Hide order from all other users immediately
  + Remove order from marketplace and Owner Dashboard → Active Orders (Ads)
  + Move order to Owner Dashboard → Received By Users
  + Redirect to My Orders Page → Ongoing Orders Section
- Include Contact Support section with WhatsApp button, Telegram button, and support form using Owner-configured contact details
- Include Back Button to return to previous page

#### My Orders Page (/orders)
- Accessible via bottom navigation bar My Orders tab
- Display five sections: Ongoing Orders, Pending Orders, Completed Orders, Frozen Orders, Pay Timeout
- Include Back Button to return to previous page

**Section 1 — Ongoing Orders**:
- Display orders with status = pending_upload (locked to current user, waiting for payment/screenshot upload)
- Show custom countdown timer set by Owner for each order
- Display clearly:
  + Order Number (ORD-XXXX)
  + You Pay: SAR amount
  + You Receive: USDT amount
  + Payment methods
  + Payment instructions from Owner
  + Full payment account details:
    * Account Holder Name
    * Account Number
    * IBAN Number
    * Payment Method
    * Additional payment instructions
- Provide upload fields:
  + Upload Payment Receipt Screenshot
  + Upload SMS Details Screenshot
- Provide action buttons:
  + Submit button to upload proof
  + Cancel Order button
  + Mark as Invalid button (if payment account details are wrong)
- After upload: Show upload successful message, hide screenshots from user view, change status to pending_review, move order to Pending Orders Section, move order to Owner Dashboard → Pending Orders, remove Cancel Order option completely
- If custom timer expires without upload: auto-cancel order, set status to pay_timeout, move to Pay Timeout Section, move to Owner Dashboard → Pay Timeout Orders Management (NOT Active Orders)
- If user clicks Cancel Order (before upload): set status to cancelled, unlock order, change status back to available, make order visible in marketplace and Owner Dashboard → Active Orders (Ads) again, remove from Owner Dashboard → Received By Users
- If user clicks Mark as Invalid: set status to invalid, move to Completed Orders Section with Invalid label, hide order from marketplace
- Include Contact Support section

**Section 2 — Pending Orders**:
- Display orders with status = pending_review or reupload_required
- Show:
  + Order Number (ORD-XXXX)
  + USDT amount user will receive
  + SAR amount paid
  + Payment method
  + Submission timestamp (Saudi local time)
  + Review status badge (Pending Review / Re-upload Required)
  + Upload successful confirmation message
- User cannot view uploaded screenshots
- Cancel Order option removed after upload
- If status is reupload_required: show re-upload form with Owner's note, allow user to upload screenshots again
- Include Contact Support section

**Section 3 — Completed Orders**:
- Display orders with status = approved/completed, rejected, cancelled, invalid
- Show:
  + Order Number (ORD-XXXX)
  + Status label (Approved / Rejected / Cancelled / Invalid)
  + SAR Amount Paid
  + USDT Received (if approved)
  + Date & Time (Saudi local time)
  + Current Status
  + Payment method
  + Wallet credited confirmation (if approved)
  + Rejection reason (if rejected)
  + Cancellation reason (if cancelled)
  + Invalid reason (if invalid)

**Section 4 — Frozen Orders**:
- Display orders with status = frozen
- Show:
  + Order Number (ORD-XXXX)
  + Order details (SAR amount, USDT amount, payment method)
  + Freeze reason
  + Frozen date (Saudi local time)
  + Deduction details (if balance deducted):
    * Deducted USDT amount
    * Deducted SAR amount
    * Deduction reason
    * Deduction date & time (Saudi local time)
    * Dispute status
  + Support contact option
- Frozen orders cannot be completed, cancelled, or edited by user
- User can only contact support regarding frozen orders

**Section 5 — Pay Timeout**:
- Display orders with status = pay_timeout
- Show:
  + Order Number (ORD-XXXX)
  + Order details (SAR amount, USDT amount, payment method)
  + Timeout date (Saudi local time)
  + Timeout reason
- Orders remain here until Owner manually reposts them from Owner Dashboard → Pay Timeout Orders Management

#### Wallet Page
- Accessible via bottom navigation bar Wallet tab
- Display current USDT Balance
- Display SAR Equivalent Balance (USDT × current USDT price)
- Show transaction history from wallet_transactions table:
  + Completed deposits with credited USDT amount and credited SAR amount
  + Withdrawals with deducted USDT amount and deducted SAR amount
  + Order credits with order number, USDT received, SAR paid, date & time (Saudi local time)
  + Deduction records with order number, deducted USDT amount, deducted SAR amount, deduction reason, date & time (Saudi local time), dispute status
- List completed orders with order numbers
- Include Withdraw option (navigates to Withdrawal Request Page)
- Include Support option (navigates to Customer Support)
- Include Back Button to return to previous page

#### Withdrawal Request Page
- Banned users (Temporarily Banned or Permanently Banned) cannot create withdrawal requests
- Pending Approval users cannot create withdrawal requests
- Input withdrawal amount
- Select withdrawal method: Binance UID or BSC Wallet Address
- Enter corresponding UID or wallet address
- Validate: withdrawal amount cannot exceed wallet balance
- Submit withdrawal request to Owner/Admin
- After submission: request status becomes Pending
- View withdrawal history:
  + Withdrawal amount
  + Withdrawal method
  + Withdrawal status (Pending / Approved / Completed / Rejected)
  + Withdrawal proof screenshot (if uploaded by Owner)
  + Withdrawal completion time (Saudi local time)
- Include Contact Support section
- Include Back Button to return to previous page

#### Customer Support
- Select issue type: Order Issue, Payment Issue, Withdrawal Issue, Login Issue, Invalid Order Issue, Frozen Order Issue, Other
- Write message
- Upload screenshots (optional)
- Reference order number if applicable
- Submit support ticket
- View ticket status: Open, Pending, Resolved, Closed
- View ticket replies from Owner/Admin
- Continue conversation
- Re-open ticket if issue not resolved
- Display Owner-configured contact methods:
  + WhatsApp support button (using Owner-configured WhatsApp number)
  + Telegram support link (using Owner-configured Telegram username/link)
  + Email support (using Owner-configured support email)
- Include Back Button to return to previous page

#### Support History Page
- Display all previous support tickets with order numbers
- Show ticket status and conversation history
- Include Back Button to return to previous page

### 3.4 Owner/Admin Dashboard

#### Order Creation (with live USDT calculation, custom timer, and full payment account details)
- Create new orders with:
  + USDT Price in SAR (per USDT)
  + Order Amount in SAR (total SAR user will pay)
  + Custom Timer: 5, 10, 15, 20, 30, 60 minutes or custom value
  + Payment methods: select from available payment methods (Owner can select multiple methods per order)
  + Full payment account details for each selected payment method:
    * Account Holder Name
    * Account Number
    * IBAN Number
    * Payment Method (selected from available methods)
    * Additional payment instructions
  + Visibility Settings: visible to all users OR visible only to selected users
  + Per-user SAR amount limits
  + One-time-use mode toggle
- System automatically calculates Total USDT user will receive using formula: Total USDT = SAR Amount ÷ USDT Price
- Show live automatic calculation while Owner types
- Display calculated USDT amount to Owner before publishing order
- Auto-generate unique order number (ORD-1001, ORD-1002, etc.)
- Owner can post unlimited orders simultaneously
- After posting: order appears in User Dashboard → Market Page (Available Orders) AND Owner Dashboard → Active Orders (Ads)
- Include Back Button to return to previous page

#### Active Orders (Ads)
- View all orders with status = available
- Display order details with order numbers
- Monitor which orders are visible in marketplace
- Real-time updates when orders are locked by users
- When user receives order: instantly remove from Active Orders (Ads), move to Received By Users
- Edit existing orders
- Soft delete orders: set is_active=false
- Permanently delete orders:
  + Check order status before deletion
  + If order status = active/locked, pending_upload, pending_review, reupload_required, or frozen: prevent deletion, show warning \"This order cannot be deleted because it is currently in use.\"
  + If order status = available, approved/completed, rejected, cancelled, invalid, or pay_timeout: allow permanent deletion
  + Before deleting order: automatically delete or detach related wallet transactions, linked references, logs, metadata using cascade delete or safe cleanup workflow
  + Completed/Frozen orders with financial records: archive safely before deletion
  + Permanent deletion removes order and related inactive records from database safely without foreign key constraint errors
- Pause, Resume, Close order manually
- Activate/Deactivate orders (toggle visibility)
- Include Back Button to return to previous page

#### Received By Users
- View all orders with status = active/locked or pending_upload
- Display: order number, user name, SAR amount, USDT amount, timer countdown, payment method
- Monitor order progress in real-time
- Orders automatically move here when any user receives order from marketplace
- Orders automatically move to Pending Orders when user uploads screenshots
- Include Back Button to return to previous page

#### Pending Orders Review (with secure screenshot viewer)
- View all orders with status = pending_review
- Display order details:
  + Order Number (ORD-XXXX)
  + User name and email
  + SAR amount paid
  + USDT amount to be credited
  + Payment method
  + Payment account details used
  + Secure screenshot viewer for payment receipt (only Owner can access)
  + Secure screenshot viewer for SMS confirmation (only Owner can access)
- Screenshots are stored securely in Supabase Storage public bucket, hidden from user view
- Actions:
  + Approve Order: Change status to approved/completed, credit calculated USDT amount to user wallet via wallet_transactions, save credited SAR amount permanently, unlock order, mark as permanently closed if one-time-use mode enabled, move to Completed Orders
  + Reject Order: Change status to rejected, save rejection reason, unlock order, change status back to available, make order visible again in marketplace and Active Orders (Ads), move to Rejected Orders
  + Request Re-upload: Set status to reupload_required with Owner note, allow user to upload screenshots again
  + Freeze Order: Set status to frozen, provide freeze reason, move to Frozen Orders Management
- Include Back Button to return to previous page

#### Completed Orders (with secure screenshot viewer)
- View all orders with status = approved/completed
- Display transaction details:
  + Order Number (ORD-XXXX)
  + User name
  + SAR Amount Paid
  + USDT Received
  + Date & Time (Saudi local time)
  + Current Status
  + Payment method
- Provide secure screenshot viewer: Owner/Admin can open and view payment receipt screenshot and SMS details screenshot even after order is completed
- Filter by date, user, payment method
- Actions:
  + Mark as Suspected / Disputed / Fraudulent: deduct credited USDT and SAR equivalent from user wallet, save deduction details permanently, move order to Frozen Orders section
- Include Back Button to return to previous page

#### Cancelled Orders
- View all orders with status = cancelled (user-cancelled or owner-rejected)
- Display cancellation reasons and timestamps (Saudi local time)
- Include Back Button to return to previous page

#### Invalid Orders Management (with secure screenshot viewer)
- View all orders with status = invalid
- Display:
  + Order Number (ORD-XXXX)
  + User name
  + Order details
  + Invalid reason
  + Invalid date (Saudi local time)
  + Secure screenshot viewer for payment receipt and SMS details (only Owner can access)
- Actions:
  + Edit payment account details
  + Reactivate order: after fixing payment details, change status to available, make order visible in marketplace and Active Orders (Ads) again for any user to receive
- Include Back Button to return to previous page

#### Pay Timeout Orders Management
- View all orders with status = pay_timeout
- Display:
  + Order Number (ORD-XXXX)
  + User name
  + Order details
  + Timeout date (Saudi local time)
- Actions:
  + Repost Order: change status to available, make order visible in marketplace (Market Page → Available Orders) and Active Orders (Ads) again for any user to receive
  + Permanently Close Order: mark order as permanently closed, never return to marketplace
  + Delete Order: permanently delete order from database with safe cleanup workflow (automatically delete or detach related wallet transactions, linked references, logs, metadata)
- Expired orders remain hidden in Pay Timeout section until Owner/Admin manually reposts them
- Expired orders do NOT automatically return to Active Orders or marketplace
- Include Back Button to return to previous page

#### Frozen Orders Management (with secure screenshot viewer, Resolve Dispute and Approve actions only)
- View all orders with status = frozen
- Display:
  + Order Number (ORD-XXXX)
  + User name
  + Order details
  + Freeze reason
  + Frozen date (Saudi local time)
  + Deduction details (if balance deducted):
    * Deducted USDT amount
    * Deducted SAR amount
    * Deduction reason
    * Deduction date & time (Saudi local time)
    * Dispute status
  + Secure screenshot viewer for payment receipt and SMS details (only Owner can access)
- Actions (Unfreeze button removed):
  + Resolve Dispute: add resolution note, re-credit USDT and SAR equivalent to user wallet, restore balance, move order back to Completed Orders
  + Approve: change status to approved/completed, credit USDT to user wallet, move to Completed Orders
- Include Back Button to return to previous page

#### Rejected Orders (with secure screenshot viewer)
- View all orders with status = rejected
- Display:
  + Order Number (ORD-XXXX)
  + User name
  + Order details
  + Rejection reason
  + Rejection date (Saudi local time)
  + Secure screenshot viewer for payment receipt and SMS details (only Owner can access)
- Filter by date, user, payment method
- Include Back Button to return to previous page

#### All Orders (with secure screenshot viewer)
- View all orders regardless of status
- Display order number, user name, status, SAR amount, USDT amount, payment method, timestamps (Saudi local time)
- Provide secure screenshot viewer for orders with status = approved/completed, rejected, invalid, frozen
- Only Owner/Admin can access screenshots
- Filter by status, date, user, payment method
- Include Back Button to return to previous page

#### All User Balances
- View all registered users from profiles table
- Display per user:
  + User ID
  + Username
  + USDT Balance
  + SAR Equivalent Balance
  + Active Orders count
  + Pending Orders count
  + Completed Orders count
  + Frozen Orders count
  + Withdrawal History summary
- Click on any user to open detailed profile with wallet history, order history, withdrawal history, frozen orders, deduction history
- Include Back Button to return to previous page

#### User Statistics
- View all registered users from profiles table
- Display per user:
  + User ID
  + Username
  + Daily Received Orders
  + Daily Completed Orders
  + Daily Withdrawals
  + Daily Frozen Orders
  + Daily Cancelled Orders
  + Total Transactions
  + Activity Status (Active / Pending Approval / Temporarily Banned / Permanently Banned)
- Filter by date range, activity status
- Export statistics data
- Include Back Button to return to previous page

#### User Management (ban/unban, order limits, SAR limits, wallet history, order history, withdrawal history, frozen orders, deduction history, daily statistics, approve/reject new users)
- View all registered users from profiles table
- Display per user:
  + User ID
  + Username
  + USDT Balance
  + SAR Equivalent Balance
  + Daily Received Orders
  + Daily Completed Orders
  + Total Withdrawals
  + Active Orders
  + User status: Pending Approval, Active, Temporarily Banned, Permanently Banned
- Actions per user:
  + Approve New User: change status from Pending Approval to Active, enable marketplace access
  + Reject New User: delete user account or keep as Pending Approval
  + Temporarily Ban: user cannot view available orders, cannot receive orders, cannot create withdrawal requests
  + Permanently Ban: user cannot view available orders, cannot receive orders, cannot create withdrawal requests
  + Reactivate: restore user to Active status, allow full access
  + Set Maximum Active Orders: 1, 2, 3, or custom number (per-user setting)
  + Set SAR Amount Limits: minimum SAR and maximum SAR (per-user setting)
  + Open User Profile: view wallet history, order history, withdrawal history, frozen orders, deduction history
- Banned users cannot access marketplace or create withdrawal requests
- Pending Approval users cannot access marketplace or create withdrawal requests
- System enforces per-user order limits and SAR amount controls
- Include Back Button to return to previous page

#### Withdrawal Management (with withdrawal proof upload and automatic balance deduction)
- View all withdrawal requests from withdrawals table
- Display: user information, withdrawal amount, Binance UID or BSC address, request status, request time (Saudi local time)
- Actions:
  + Approve: Mark as Approved
  + Reject: Keep user balance unchanged, save rejection reason
  + Complete: Mark as Completed, automatically deduct USDT and SAR equivalent from user wallet via wallet_transactions after manually sending USDT externally, upload withdrawal proof screenshot (Binance transfer screenshot, BSC transaction screenshot, Transfer confirmation image), save withdrawal completion time (Saudi local time)
- Withdrawal proof upload:
  + Upload screenshot after completing withdrawal
  + User can view withdrawal proof in Withdrawal Request Page
- Automatic balance deduction:
  + When Owner marks withdrawal as Completed, system automatically deducts USDT and SAR equivalent from user wallet
  + Save withdrawal history permanently
- Include Back Button to return to previous page

#### Support Tickets Management
- View all support tickets from support_tickets table with order numbers
- Reply to users via support_messages table
- Change ticket status: Open, Pending, Resolved, Closed
- Close tickets
- Receive notifications for new tickets and replies
- Include Back Button to return to previous page

#### Support Settings (WhatsApp, Telegram, Email)
- Edit Owner contact information:
  + WhatsApp number
  + Telegram username/link
  + Support email
- Changes update instantly in user support/contact sections across all pages
- Contact details appear in:
  + Market Page Contact Support section
  + My Orders Page Contact Support section
  + Wallet Page Contact Support section
  + Withdrawal Page Contact Support section
  + Customer Support page
- Include Back Button to return to previous page

#### Payment Method Settings (add/edit/remove payment methods)
- View all available payment methods
- Default payment methods: STC Pay, Barq, urpay, Al Rajhi Bank, SNB Bank, Riyad Bank, BSF Bank, SAB Bank, ANB Bank, Alinma Bank
- Actions:
  + Add custom payment method: enter payment method name
  + Edit payment method: update payment method name
  + Remove payment method: delete payment method from list
- When creating orders, Owner selects which payment methods are available for that specific order
- Include Back Button to return to previous page

#### Marketplace Controls
- Global settings:
  + Default maximum active orders per user
  + Default order timer
  + Default visibility rules
- Apply settings to new orders or update existing orders
- Include Back Button to return to previous page

## 4. Business Rules and Logic

### 4.1 Role-Based Access Control
- Only one Owner/Admin exists in the system
- Owner routes (/owner-register, /owner-login, /owner/*) are hidden from normal users
- Normal users cannot access Owner/Admin Dashboard
- If users attempt to access admin routes manually, redirect to User Login
- Owner session remains active until logout
- All Supabase queries respect RLS policies
- RLS policies allow authenticated users to upload screenshots to public bucket for their own orders only
- Prevent cross-user screenshot access through RLS
- Only Owner/Admin can access secure screenshot viewer in all order sections
- Only Owner/Admin can deduct balances, freeze orders, approve users, upload withdrawal proofs, mark orders as suspected/disputed/fraudulent, restore balances, resolve disputes
- Users can only view their own data

### 4.2 Unique Order Number System
- Every order automatically generates unique order number (ORD-1001, ORD-1002, ORD-1003, etc.)
- Order numbers are sequential and auto-incremented
- Display order number in:
  + Marketplace (Market Page → Available Orders)
  + User Dashboard: My Orders Page (Ongoing Orders, Pending Orders, Completed Orders, Frozen Orders, Pay Timeout)
  + Owner Dashboard: All order sections, Support tickets
- Both Owner and User can track orders using order number

### 4.3 Advanced Order Visibility and Locking System
- When Owner posts order: order status = available, order appears in User Dashboard → Market Page (Available Orders) AND Owner Dashboard → Active Orders (Ads) based on visibility rules and per-user SAR amount limits
- When any user clicks Receive Order:
  + Check user status (must be Active)
  + Check user ban status (Temporarily Banned or Permanently Banned)
  + Check if user has reached maximum active order limit (per-user setting)
  + Check if user account is active and not suspended
  + If checks pass: instantly lock order to that user only (atomic locking), change status to active/locked
  + Hide order from all other users immediately
  + Remove order from marketplace and Owner Dashboard → Active Orders (Ads)
  + Move order to Owner Dashboard → Received By Users
  + Prevent multiple users from receiving the same order
- One order can only be received by one user at one time
- Order unlocking conditions:
  + User cancels order before upload: status changes to cancelled, then back to available, order returns to marketplace and Active Orders (Ads), removed from Received By Users
  + Owner rejects order: status changes to rejected, then back to available, order returns to marketplace and Active Orders (Ads)
  + User marks order as invalid: status changes to invalid (not unlocked, hidden from marketplace)
- When order is unlocked (cancelled or rejected): change status back to available, make order visible again in marketplace and Active Orders (Ads) for other users
- Completed orders in one-time-use mode are permanently closed and never return to marketplace
- Frozen orders remain locked and cannot be unlocked until Owner resolves dispute or approves

### 4.4 Order Status System (Complete List)
- **available**: visible to all users in marketplace and Active Orders (Ads), can be received
- **active/locked**: locked to one user, hidden from marketplace and Active Orders (Ads), visible in Received By Users, waiting for user action
- **pending_upload**: user received order, needs to upload payment screenshots
- **pending_review**: screenshots uploaded, waiting for Owner review, visible in Pending Orders (user and owner)
- **reupload_required**: Owner requests new screenshots from user
- **approved/completed**: Owner approved, USDT credited to user wallet
- **rejected**: Owner rejected order
- **cancelled**: user cancelled order before upload, order returns to marketplace and Active Orders (Ads) with status = available
- **pay_timeout**: timer expired without upload, hidden from marketplace, moved to Owner Dashboard → Pay Timeout Orders Management, remains hidden until Owner manually reposts
- **invalid**: user marked as invalid due to incorrect payment account details, hidden from marketplace
- **frozen**: Owner froze order due to dispute, order processing stopped temporarily

### 4.5 Order Creation and USDT Calculation
- Owner enters: USDT Price in SAR, Order Amount in SAR, Custom Timer, Payment Methods (select from available methods), Full Payment Account Details (Account Holder Name, Account Number, IBAN Number, Additional payment instructions), Visibility Settings
- System automatically calculates Total USDT = SAR Amount ÷ USDT Price
- Show live automatic calculation while Owner types
- Display calculated USDT amount to Owner before publishing order
- Auto-generate unique order number (ORD-1001, ORD-1002, etc.)
- Set initial status = available
- After posting: order appears in User Dashboard → Market Page (Available Orders) AND Owner Dashboard → Active Orders (Ads)

### 4.6 Order Processing Flow
1. Owner posts order with USDT price, SAR amount, custom timer, full payment account details, and visibility settings; system calculates USDT amount, generates order number, sets status = available, order appears in Market Page (Available Orders) and Active Orders (Ads)
2. User clicks Receive Order
3. System checks user status (must be Active), user ban status, active order limit, and account status
4. If checks pass: system instantly locks order to that user, changes status to active/locked, hides order from other users, removes from marketplace and Active Orders (Ads), moves to Received By Users
5. Order appears in user's My Orders Page → Ongoing Orders Section with custom countdown timer and order number, status = pending_upload
6. User views: Order Number, You Pay (SAR amount), You Receive (USDT amount), Payment methods, Full payment account details
7. User can:
   - Upload payment receipt and SMS screenshots
   - Cancel order (before upload)
   - Mark order as invalid (if payment account details are wrong)
8. If user uploads screenshots:
   - System saves screenshots securely in Supabase Storage public bucket with RLS policies, hides screenshots from user view
   - User sees upload successful message
   - Order status changes to pending_review
   - Order moves to Pending Orders Section (user side) and Owner Dashboard → Pending Orders
   - Cancel Order option removed completely
9. If user cancels order before upload:
   - Order status changes to cancelled
   - Order unlocked, status changes back to available
   - Order returns to marketplace and Active Orders (Ads), visible in Market Page (Available Orders)
   - Order removed from Received By Users
10. If user marks order as invalid:
    - Order status changes to invalid
    - Order moves to Completed Orders Section with Invalid label
    - Order hidden from marketplace
    - Order moves to Owner Dashboard → Invalid Orders section
    - Order NOT visible until Owner fixes payment details and reactivates
11. If user does not upload within custom timer:
    - Order automatically cancelled
    - Status changes to pay_timeout
    - Order moves to My Orders Page → Pay Timeout Section (user side)
    - Order moves to Owner Dashboard → Pay Timeout Orders Management
    - Order hidden from marketplace and Active Orders (Ads)
    - Order remains hidden until Owner manually reposts from Pay Timeout Orders Management
12. Owner reviews payment proofs in secure screenshot viewer in Pending Orders Review section
13. Owner approves, rejects, requests re-upload, or freezes:
    - Approve: status changes to approved/completed, calculated USDT amount credited to user wallet via wallet_transactions, save credited SAR amount permanently, order moves to Completed Orders Section, order unlocked or permanently closed if one-time-use mode enabled
    - Reject: status changes to rejected, order moves to Rejected Orders section with rejection reason, order unlocked, status changes back to available, order visible again in marketplace and Active Orders (Ads)
    - Request Re-upload: status changes to reupload_required, user can upload screenshots again from Pending Orders Section
    - Freeze: status changes to frozen, order moves to Frozen Orders Section (user side) and Frozen Orders Management (owner side)
14. For invalid orders:
    - Owner edits payment account details in Invalid Orders Management
    - Owner reactivates order, status changes to available
    - Order becomes visible in marketplace and Active Orders (Ads) again for any user to receive
15. For pay timeout orders:
    - Owner manually reposts order in Pay Timeout Orders Management
    - Status changes to available
    - Order becomes visible in marketplace (Market Page → Available Orders) and Active Orders (Ads) again for any user to receive
    - OR Owner permanently closes order or deletes order
16. For frozen orders:
    - Owner can resolve dispute or approve in Frozen Orders Management (Unfreeze button removed)
    - Resolve Dispute: re-credit USDT and SAR equivalent to user wallet, restore balance, move order back to Completed Orders
    - Approve: status changes to approved/completed, credit USDT to user wallet, move to Completed Orders

### 4.7 Payment Proof Review System
- User uploads payment receipt screenshot and SMS details screenshot
- After upload:
  + Save screenshots securely in Supabase Storage public bucket with RLS policies
  + Hide screenshots from public access
  + Hide screenshots from user order history
  + Hide screenshots from normal dashboard lists
  + Remove Cancel Order option completely
- Only Owner/Admin can privately access screenshots during payment review in secure screenshot viewer
- Owner/Admin can view screenshots in:
  + Pending Orders Review section
  + Completed Orders section (even after order is completed)
  + Frozen Orders Management section
  + Invalid Orders Management section
  + Rejected Orders section
  + All Orders section (for approved, rejected, invalid, frozen orders)
- User can only see:
  + Upload successful message
  + Order status (Pending Review / Approved / Re-upload Required / Rejected / Frozen)
- User cannot view screenshots again after submission
- RLS policies prevent cross-user screenshot access

### 4.8 User Payment System
- After receiving order, user must see:
  + Full payment account details:
    * Account Holder Name
    * Account Number
    * IBAN Number
    * Payment Method
    * Additional payment instructions
  + Upload Payment Receipt Screenshot field
  + Upload SMS Details Screenshot field
  + Cancel Order button (before upload)
  + Mark as Invalid button
  + Countdown timer
- If payment account details are incorrect:
  + User clicks Mark as Invalid
  + Order status changes to invalid
  + Order moves to Completed Orders Section with Invalid label
  + Order hidden from marketplace
  + Order moves to Owner Dashboard → Invalid Orders section
- Owner/Admin can:
  + Correct payment account details in Invalid Orders Management
  + Reactivate order, status changes to available
  + Make order visible again in marketplace and Active Orders (Ads)

### 4.9 Order Cancel System
- User can cancel order anytime before upload (while status = pending_upload)
- After upload: Cancel Order option removed completely
- After cancel before upload:
  + Order status changes to cancelled
  + Order unlocked
  + Status changes back to available
  + Order returns to marketplace and Active Orders (Ads)
  + Order removed from Received By Users
  + Other users can receive it

### 4.10 Pay Timeout System (Updated Workflow)
- If user does not upload payment receipt screenshot and SMS details screenshot within order timer duration:
  + Automatically cancel order
  + Set status = pay_timeout
- Timed-out orders must appear in:
  + User Dashboard → My Orders Page → Pay Timeout Section
  + Owner Dashboard → Pay Timeout Orders Management
- Timeout orders must NOT automatically return to marketplace or Active Orders (Ads)
- Timeout orders remain hidden until Owner/Admin manually reposts them
- Owner/Admin actions in Pay Timeout Orders Management:
  + Repost Order: change status to available, make order visible in marketplace (Market Page → Available Orders) and Active Orders (Ads) again for any user to receive
  + Permanently Close Order: mark order as permanently closed, never return to marketplace
  + Delete Order: permanently delete order from database with safe cleanup workflow (automatically delete or detach related wallet transactions, linked references, logs, metadata)

### 4.11 Frozen Order / Dispute System (Updated)
- Owner/Admin can freeze order manually if dispute happens (from any status)
- Owner/Admin can mark completed order as Suspected / Disputed / Fraudulent
- On dispute: automatically deduct credited USDT and SAR equivalent from user wallet, save deduction details permanently, move order to Frozen Orders section
- Frozen order must:
  + Status changes to frozen
  + Move to My Orders Page → Frozen Orders Section (user side)
  + Move to Frozen Orders Management (owner side)
  + Stop all processing temporarily
- Frozen orders must show:
  + Freeze reason
  + Order number
  + Uploaded screenshots (in secure screenshot viewer, Owner only)
  + User details
  + Deduction details (if balance deducted):
    * Deducted USDT amount
    * Deducted SAR amount
    * Deduction reason
    * Deduction date & time (Saudi local time)
    * Dispute status
- After dispute resolved:
  + Owner/Admin can resolve dispute: re-credit USDT and SAR equivalent to user wallet, restore balance, move order back to Completed Orders
  + Owner/Admin can approve: status changes to approved/completed, credit USDT to user wallet, move to Completed Orders
- Unfreeze button removed from Frozen Orders Management
- Only Resolve Dispute and Approve actions available

### 4.12 Custom Order Timer System
- Owner sets custom timer per advertisement: 5, 10, 15, 20, 30, 60 minutes or custom value
- Countdown starts when user receives order (status = pending_upload)
- Display timer in My Orders Page → Ongoing Orders Section
- Auto-cancel and set status to pay_timeout on timer expiry
- If timer expires: order moves to My Orders Page → Pay Timeout Section (user side) and Pay Timeout Orders Management (owner side), remains hidden until Owner manually reposts

### 4.13 User Ban System
- Owner can set user status: Pending Approval, Active, Temporarily Banned, Permanently Banned
- Banned users (Temporarily Banned or Permanently Banned) cannot:
  + View available orders in marketplace
  + Receive orders
  + Create withdrawal requests
- Pending Approval users cannot:
  + View available orders in marketplace
  + Receive orders
  + Create withdrawal requests
- Owner can reactivate banned users: restore to Active status, allow full access
- System enforces ban status checks before allowing order locking or withdrawal creation

### 4.14 User Order Limit System
- Owner can set maximum active orders per user (per-user setting): 1, 2, 3, or custom number
- System enforces limit: prevent users from receiving orders beyond their limit
- Example: User A = 1 active order, User B = 3 active orders, User C = 5 active orders
- When user attempts to receive order:
  + Check current active orders count
  + If count >= maximum limit: prevent order locking, show limit reached message

### 4.15 User SAR Amount Control System
- Owner sets custom SAR order limits per user: minimum SAR and maximum SAR (per-user setting)
- Marketplace automatically filters orders based on user's allowed SAR range
- Users only see orders matching their allowed SAR range
- Example: User A sees 100-500 SAR orders; User B sees 500-5000 SAR orders
- System enforces SAR amount controls when displaying available orders

### 4.16 Custom User Order Visibility System
- Per-advertisement visibility: visible to all users OR visible only to selected users
- Owner sets maximum SAR amount visible per user
- Marketplace dynamically filters based on owner rules and per-user SAR amount limits
- Users only see orders within their SAR amount limit
- Users only see orders they have permission to view

### 4.17 Advertisement Delete System (Updated with Safe Cleanup)
- Owner/Admin can permanently delete posted orders/ads from Active Orders (Ads) section
- Before permanent deletion:
  + Check order status
  + If order status = active/locked, pending_upload, pending_review, reupload_required, or frozen: prevent deletion, show warning \"This order cannot be deleted because it is currently in use.\"
  + If order status = available, approved/completed, rejected, cancelled, invalid, or pay_timeout: allow permanent deletion
- Permanent delete must:
  + Automatically delete or detach related wallet transactions, linked references, logs, metadata using cascade delete or safe cleanup workflow
  + Completed/Frozen orders with financial records: archive safely before deletion
  + Remove advertisement safely from database without foreign key constraint errors (fix wallet_transactions_order_id_fkey error)
  + Order never appears again in any section
- Soft delete (set is_active=false) remains available for all orders
- Inactive orders disappear from marketplace
- Owner can reactivate soft-deleted orders

### 4.18 Marketplace Visibility Rules
- Market Page (Available Orders) shows only orders with status = available
- Filter orders based on per-user SAR amount limits
- Banned users cannot view available orders
- Pending Approval users cannot view available orders
- Once a user receives an order: lock it immediately, change status to active/locked, remove from marketplace and Active Orders (Ads), move to Received By Users
- Only one user can hold one order at a time
- If user cancels before upload: status changes to cancelled, then back to available, unlock and return to marketplace and Active Orders (Ads), remove from Received By Users
- If owner rejects: status changes to rejected, then back to available, unlock and return to marketplace and Active Orders (Ads)
- If user marks as invalid: status changes to invalid, order hidden from marketplace until Owner fixes and reactivates
- If timer expires (pay_timeout): status changes to pay_timeout, order hidden from marketplace and Active Orders (Ads), moved to Pay Timeout Orders Management, remains hidden until Owner manually reposts
- If order is frozen: status changes to frozen, order hidden from marketplace until Owner resolves dispute or approves
- Completed orders in one-time-use mode are permanently closed, never return to marketplace

### 4.19 Owner Order Settings
- Owner can Pause, Resume, Close order manually
- Paused orders are hidden from marketplace
- Resumed orders return to marketplace
- Closed orders are permanently removed from marketplace
- One-time-use mode: completed orders never return to marketplace

### 4.20 Advanced User Wallet System
- User wallet displays:
  + USDT Balance
  + SAR Equivalent Balance (USDT × current USDT price)
- When Owner approves order:
  + Automatically credit USDT amount to user wallet via wallet_transactions (credit entry)
  + Save credited USDT amount permanently
  + Save credited SAR amount permanently
  + Update wallet balance immediately
- Wallet Page shows:
  + Current USDT balance
  + SAR equivalent (USDT × current USDT price)
  + Transaction history: completed deposits, withdrawals, order credits, deduction records
- Completed Orders section shows:
  + Order Number
  + SAR Amount Paid
  + USDT Received
  + Date & Time (Saudi local time)
  + Current Status

### 4.21 Order Balance Deduction System
- If Owner/Admin approved an order and credited balance, but later payment problem occurs (bank refund, fake screenshot, payment reversal, fraud dispute):
  + Owner/Admin can mark order as Suspected / Disputed / Fraudulent in Completed Orders section
  + On dispute: automatically deduct the credited USDT and SAR equivalent from user wallet
  + Deduction system must:
    * Remove credited USDT from wallet via wallet_transactions (debit entry)
    * Remove SAR equivalent balance
    * Save deduction details permanently:
      - Order Number
      - Deducted USDT amount
      - Deducted SAR amount
      - Deduction reason
      - Date & Time (Saudi local time)
      - Dispute status
  + After deduction: automatically move order into Frozen Orders section
- Deduction details must appear in:
  + User Wallet Page → Deduction History
  + User My Orders Page → Frozen Orders Section
  + Owner Frozen Orders Management section
  + Owner All User Balances → User Profile → Deduction History
- Both Owner/Admin and User can view deduction details

### 4.22 Frozen Dispute Resolution System (Updated)
- After deduction, order automatically moves to Frozen Orders section
- Frozen Orders appear in:
  + User Dashboard → My Orders Page → Frozen Orders Section
  + Owner Dashboard → Frozen Orders Management
- Owner/Admin can (Unfreeze button removed):
  + Resolve dispute: re-credit USDT and SAR equivalent to user wallet, restore balance, move order back to Completed Orders
  + Approve: change status to approved/completed, credit USDT to user wallet, move to Completed Orders
- After dispute solved:
  + Restore USDT balance via wallet_transactions (credit entry)
  + Restore SAR equivalent balance
  + Move order back to Completed Orders
  + Update dispute status to Resolved

### 4.23 Saudi Local Time System
- All platform times must use Saudi Arabia Local Time (Asia/Riyadh timezone)
- Apply to:
  + Order receive time
  + Payment upload time
  + Approval time
  + Cancellation time
  + Withdrawal request time
  + Withdrawal completion time
  + Support tickets
  + Frozen order events
  + Deduction date & time
  + All timestamps across platform
- Display format: DD/MM/YYYY HH:MM AM/PM Saudi local timezone
- Example: 16/05/2026 01:12 AM

### 4.24 Daily User Statistics System
- User Dashboard displays:
  + Daily Received Orders: count of orders received today
  + Daily Completed Orders: count of orders completed today
  + Daily Cancelled Orders: count of orders cancelled today
  + Daily Frozen Orders: count of orders frozen today
- Owner Dashboard → User Statistics displays per user:
  + Daily Received Orders
  + Daily Completed Orders
  + Daily Withdrawals
  + Daily Frozen Orders
  + Daily Invalid Orders
  + Daily Cancelled Orders
  + Total Transactions
  + Activity Status
- Daily statistics reset at midnight Saudi local time

### 4.25 New User Activation System
- New registered users automatically assigned status = Pending Approval
- Pending Approval users cannot:
  + View available orders in marketplace
  + Receive orders
  + Submit withdrawal requests
- Owner/Admin must manually approve or reject new users in User Management section
- After approval:
  + User status changes to Active
  + Marketplace access enabled
  + User can receive orders and submit withdrawals
- Owner/Admin can disable/reactivate users anytime:
  + Disable: change status to Temporarily Banned or Permanently Banned
  + Reactivate: change status to Active

### 4.26 Withdrawal Processing with Automatic Balance Deduction
1. User submits withdrawal request with amount and Binance UID or BSC Wallet Address
2. Banned users cannot create withdrawal requests
3. Pending Approval users cannot create withdrawal requests
4. Validate: withdrawal amount cannot exceed wallet balance
5. Request appears in Owner Withdrawal Management with Pending status
6. Owner can Approve, Reject, or Complete withdrawal
7. If Owner marks as Completed:
   - Owner manually sends USDT externally
   - System automatically deducts USDT and SAR equivalent from user wallet via wallet_transactions (debit entry)
   - Owner uploads withdrawal proof screenshot (Binance transfer screenshot, BSC transaction screenshot, Transfer confirmation image)
   - Save withdrawal completion time (Saudi local time)
   - Save withdrawal history permanently
8. If rejected, user balance remains unchanged
9. User can view withdrawal history:
   - Withdrawal amount
   - Withdrawal method
   - Withdrawal status
   - Withdrawal proof screenshot (if uploaded by Owner)
   - Withdrawal completion time (Saudi local time)

### 4.27 Owner User Balance Management System
- Owner Dashboard → All User Balances displays per user:
  + User ID
  + Username
  + USDT Balance
  + SAR Equivalent Balance
  + Active Orders count
  + Pending Orders count
  + Completed Orders count
  + Frozen Orders count
  + Withdrawal History summary
- Owner/Admin can open any user profile and view:
  + Wallet history: all wallet transactions (credits, debits, deductions)
  + Order history: all orders (ongoing, pending, completed, frozen, cancelled, invalid, pay timeout)
  + Withdrawal history: all withdrawal requests (pending, approved, completed, rejected)
  + Frozen orders: all frozen orders with deduction details
  + Deduction history: all balance deductions with order numbers, amounts, reasons, dates

### 4.28 Owner User Statistics Management System
- Owner Dashboard → User Statistics displays per user:
  + User ID
  + Username
  + Daily Received Orders
  + Daily Completed Orders
  + Daily Withdrawals
  + Daily Frozen Orders
  + Daily Cancelled Orders
  + Total Transactions
  + Activity Status (Active / Pending Approval / Temporarily Banned / Permanently Banned)
- Filter by date range, activity status
- Export statistics data

### 4.29 Support Ticket System
- Only authenticated users can create support tickets
- Tickets are categorized by issue type: Order Issue, Payment Issue, Withdrawal Issue, Login Issue, Invalid Order Issue, Frozen Order Issue, Other
- Users can reference order numbers in tickets
- Owner can reply via support_messages table, change status, and close tickets
- Users receive notifications for ticket replies and status changes
- Users can re-open tickets if issue not resolved

### 4.30 Owner Contact Management System
- Owner can edit contact information in Support Settings: WhatsApp number, Telegram username/link, Support email
- Changes update instantly in user support/contact sections
- Contact Support section appears on: Market Page, My Orders Page, Wallet Page, Withdrawal Page, Customer Support
- Users can contact Owner through: WhatsApp button, Telegram button, Support form
- Contact buttons automatically use latest details updated by Owner

### 4.31 Payment Method Management System
- Owner can add, edit, remove payment methods in Payment Method Settings
- Default payment methods: STC Pay, Barq, urpay, Al Rajhi Bank, SNB Bank, Riyad Bank, BSF Bank, SAB Bank, ANB Bank, Alinma Bank
- Owner can add custom payment methods manually
- When creating orders, Owner selects which payment methods are available for that specific order
- Owner provides full payment account details for each selected payment method:
  + Account Holder Name
  + Account Number
  + IBAN Number
  + Payment Method
  + Additional payment instructions

### 4.32 Screenshot Upload System
- User uploads payment receipt screenshot and SMS details screenshot to Supabase Storage public bucket
- RLS policies allow authenticated users to upload screenshots for their own orders only
- Screenshots are stored securely, hidden from public access and user view
- Only Owner/Admin can access screenshots through secure screenshot viewer
- Screenshot upload must work without RLS errors
- Use public bucket or service-role for uploads to avoid permission issues

### 4.33 Mobile Bottom Navigation Bar System
- Fixed at bottom of screen on mobile devices
- Responsive design adapts to screen size
- Supports dark mode and light mode themes
- Contains three tabs: Market, My Orders, Wallet
- Active tab highlighted with visual indicator
- Always visible on user pages for easy navigation
- Replaces top-right three-line menu navigation on mobile

### 4.34 Back Button Navigation System
- Back button added to all pages in User Dashboard and Owner Dashboard
- Returns user to previous page in navigation history
- Works on both mobile and desktop devices
- Applies to: Market Page, My Orders Page, Wallet Page, Withdrawal Request Page, Customer Support, Support History Page, Order Creation, Active Orders, Received By Users, Pending Orders Review, Completed Orders, Cancelled Orders, Invalid Orders Management, Pay Timeout Orders Management, Frozen Orders Management, Rejected Orders, All Orders, All User Balances, User Statistics, User Management, Withdrawal Management, Support Tickets Management, Support Settings, Payment Method Settings, Marketplace Controls

### 4.35 Database Requirements
- Add order_status enum with values: available, active/locked, pending_upload, pending_review, reupload_required, approved/completed, rejected, cancelled, pay_timeout, invalid, frozen
- Add freeze_reason column (text) to orders table
- Add frozen_at column (timestamp) to orders table
- Add order_number column (text, unique) to orders table
- Add user_status enum with values: Pending Approval, Active, Temporarily Banned, Permanently Banned
- Add max_active_orders column (integer) to profiles table
- Add min_sar_amount column (decimal) to profiles table
- Add max_sar_amount column (decimal) to profiles table
- Add payment_account_details column (jsonb) to orders table
- Add whatsapp_number column (text) to owner_settings table
- Add telegram_link column (text) to owner_settings table
- Add support_email column (text) to owner_settings table
- Add credited_usdt_amount column (decimal) to wallet_transactions table
- Add credited_sar_amount column (decimal) to wallet_transactions table
- Add deducted_usdt_amount column (decimal) to wallet_transactions table
- Add deducted_sar_amount column (decimal) to wallet_transactions table
- Add deduction_reason column (text) to wallet_transactions table
- Add dispute_status column (text) to wallet_transactions table
- Add withdrawal_proof_url column (text) to withdrawals table
- Add withdrawal_completion_time column (timestamp) to withdrawals table
- Update RLS policies to handle frozen orders:
  + Users can view their own frozen orders
  + Users cannot edit or cancel frozen orders
  + Only Owner can freeze orders, resolve disputes, or approve frozen orders
- Update RLS policies for screenshot access:
  + Only Owner/Admin can access screenshots in all order sections
  + Users cannot access screenshots after upload
  + Prevent cross-user screenshot access
- Update RLS policies for user ban system:
  + Banned users cannot view available orders
  + Banned users cannot receive orders
  + Banned users cannot create withdrawal requests
- Update RLS policies for new user activation:
  + Pending Approval users cannot view available orders
  + Pending Approval users cannot receive orders
  + Pending Approval users cannot create withdrawal requests
- Update RLS policies for balance deduction:
  + Only Owner/Admin can deduct balances
  + Users can view their own deduction history
- Update RLS policies for withdrawal proof:
  + Only Owner/Admin can upload withdrawal proofs
  + Users can view their own withdrawal proofs
- Implement cascade delete or safe cleanup workflow for order deletion:
  + Before deleting order: automatically delete or detach related wallet_transactions, linked references, logs, metadata
  + Fix foreign key constraint error: wallet_transactions_order_id_fkey
  + Archive Completed/Frozen orders with financial records safely before deletion

## 5. Exceptions and Boundary Conditions

| Scenario | Handling |
|----------|----------|
| User attempts to access Owner routes | Redirect to User Login |
| Multiple users try to receive same order simultaneously | Only first user locks order (atomic locking), other users see order disappear from marketplace and Active Orders (Ads) |
| Order countdown timer expires (custom timer) | Automatically cancel order, set status to pay_timeout, move to My Orders Page → Pay Timeout Section and Owner Dashboard → Pay Timeout Orders Management, remain hidden until Owner manually reposts |
| User uploads incorrect payment proof | Owner sets status to reupload_required with Owner note, user can upload again from Pending Orders Section |
| Withdrawal request exceeds user wallet balance | Reject withdrawal request, show error message |
| User tries to create support ticket without login | Redirect to User Login |
| Owner approves order but wallet update fails | Retry wallet update, notify Owner if persistent failure |
| User submits withdrawal with invalid Binance UID or BSC address | Owner rejects withdrawal, notify user |
| Owner deletes order while user has active order | Prevent deletion if status = active/locked, pending_upload, pending_review, reupload_required, or frozen; show warning |
| User attempts to receive order that is already locked | Order not visible to user, prevent order locking |
| Owner changes contact details | Update instantly across all user pages |
| User tries to view uploaded screenshots | Screenshots remain hidden, user only sees upload successful message |
| Non-owner user attempts to access secure screenshot viewer | Deny access, redirect to User Login |
| Owner attempts to delete advertisement linked to active orders | Show warning \"This order cannot be deleted because it is currently in use.\", prevent deletion |
| Owner attempts to permanently delete inactive order | Allow deletion with safe cleanup workflow: automatically delete or detach related wallet_transactions, linked references, logs, metadata; archive Completed/Frozen orders with financial records before deletion |
| Foreign key constraint error during order deletion | Implement cascade delete or safe cleanup workflow to fix wallet_transactions_order_id_fkey error |
| User attempts to receive order beyond active order limit | Prevent order locking, show limit reached message |
| Banned user attempts to receive order | Prevent order locking, show account banned message |
| Banned user attempts to view available orders | Hide available orders, show account banned message |
| Banned user attempts to create withdrawal request | Prevent withdrawal creation, show account banned message |
| User attempts to view order outside their SAR amount limit | Order not visible to user |
| User attempts to view order without permission | Order not visible to user |
| RLS policy violation during screenshot upload | Deny upload, show error message |
| Cross-user screenshot access attempt | Deny access through RLS policies |
| Owner attempts to approve order with one-time-use mode | Mark order as permanently closed after approval |
| User attempts to receive permanently closed order | Order not visible in marketplace |
| User marks order as invalid | Order status = invalid, moves to Completed Orders Section with Invalid label, hidden from marketplace, moves to Owner Invalid Orders section |
| Owner attempts to permanently delete active order | Prevent deletion if status = active/locked, pending_upload, pending_review, reupload_required, or frozen; show warning |
| Owner permanently deletes inactive order | Remove order from database permanently with safe cleanup, never appears again |
| User cancels order before upload | Order status = cancelled, then back to available, unlocked and visible in marketplace and Active Orders (Ads), removed from Received By Users |
| User attempts to cancel order after upload | Cancel Order option removed, action prevented |
| Timer expires without payment upload | Order status = pay_timeout, moves to My Orders Page → Pay Timeout Section and Owner Dashboard → Pay Timeout Orders Management, hidden from marketplace and Active Orders (Ads), remains hidden until Owner manually reposts |
| Owner reposts timed-out order | Status changes to available, order visible in marketplace (Market Page → Available Orders) and Active Orders (Ads) again |
| Owner permanently closes timed-out order | Order marked as permanently closed, never returns to marketplace |
| Owner deletes timed-out order | Permanently delete order from database with safe cleanup workflow |
| Owner reactivates invalid order | Status changes to available, order visible in marketplace and Active Orders (Ads) again |
| Owner freezes order | Order status = frozen, moves to My Orders Page → Frozen Orders Section (user side) and Frozen Orders Management (owner side) |
| Owner marks completed order as Suspected/Disputed/Fraudulent | Automatically deduct USDT and SAR from user wallet, save deduction details, move order to Frozen Orders |
| User attempts to cancel or edit frozen order | Prevent action, show message \"This order is frozen. Please contact support.\" |
| Owner attempts to unfreeze order | Unfreeze button removed from Frozen Orders Management, action not available |
| Owner resolves frozen dispute | Re-credit USDT and SAR to user wallet, restore balance, move order back to Completed Orders |
| Owner approves frozen order | Status changes to approved/completed, credit USDT to user wallet, move to Completed Orders |
| User attempts to withdraw amount exceeding balance | Show error message, prevent withdrawal submission |
| Owner marks withdrawal as Completed | Automatically deduct USDT and SAR from user wallet, upload withdrawal proof, save completion time |
| Owner attempts to view screenshots in Completed Orders | Allow access through secure screenshot viewer |
| Owner attempts to view screenshots in Rejected Orders | Allow access through secure screenshot viewer |
| Owner attempts to view screenshots in Invalid Orders | Allow access through secure screenshot viewer |
| Owner attempts to view screenshots in All Orders section | Allow access for approved, rejected, invalid, frozen orders through secure screenshot viewer |
| Owner adds custom payment method | Payment method added to available methods list |
| Owner removes payment method | Payment method removed from available methods list |
| Owner edits payment method | Payment method name updated |
| Owner creates order with custom payment method | Order uses custom payment method |
| Screenshot upload fails due to RLS error | Use public bucket or service-role for uploads to avoid permission issues |
| Owner temporarily bans user | User cannot view available orders, receive orders, or create withdrawal requests |
| Owner permanently bans user | User cannot view available orders, receive orders, or create withdrawal requests |
| Owner reactivates banned user | User restored to Active status, full access allowed |
| Owner sets per-user order limit | System enforces limit when user attempts to receive order |
| Owner sets per-user SAR amount limits | Marketplace filters orders based on user's allowed SAR range |
| New user registers | User status = Pending Approval, cannot access marketplace or submit withdrawals |
| Pending Approval user attempts to receive order | Prevent order locking, show message \"Your account is pending approval.\" |
| Pending Approval user attempts to view available orders | Hide available orders, show message \"Your account is pending approval.\" |
| Pending Approval user attempts to create withdrawal request | Prevent withdrawal creation, show message \"Your account is pending approval.\" |
| Owner approves new user | User status changes to Active, marketplace access enabled |
| Owner rejects new user | User account deleted or remains Pending Approval |
| Owner deducts balance from user wallet | Remove credited USDT and SAR equivalent, save deduction details, move order to Frozen Orders |
| User views deduction details | Display order number, deducted amounts, deduction reason, date & time, dispute status |
| Owner resolves frozen dispute | Re-credit USDT and SAR equivalent to user wallet, restore balance, move order back to Completed Orders |
| Owner uploads withdrawal proof | Save withdrawal proof URL, user can view proof in Withdrawal Request Page |
| User views withdrawal proof | Display withdrawal proof screenshot and completion time |
| Daily statistics reset | Reset all daily counters at midnight Saudi local time |
| Timezone conversion error | Use Asia/Riyadh timezone for all timestamps |
| Owner approves order | Automatically credit USDT and SAR equivalent to user wallet, save amounts permanently |
| Wallet balance update fails | Retry update, notify Owner if persistent failure |
| User views Completed Orders | Display order number, SAR amount paid, USDT received, date & time (Saudi local time), current status |
| Owner views user profile in All User Balances | Display wallet history, order history, withdrawal history, frozen orders, deduction history |
| Owner views User Statistics | Display daily received/completed/withdrawals/frozen/cancelled orders, total transactions, activity status per user |
| User receives order | Order instantly removed from marketplace and Active Orders (Ads), moved to Received By Users |
| Order posted by Owner | Order appears in Market Page (Available Orders) and Active Orders (Ads) simultaneously |
| User navigates using mobile bottom navigation bar | Switch between Market, My Orders, Wallet tabs seamlessly |
| User clicks back button | Return to previous page in navigation history |
| Owner clicks back button in dashboard | Return to previous page in navigation history |

## 6. Acceptance Criteria

1. New user registers with email and password, user status automatically set to Pending Approval, user cannot access marketplace or submit withdrawals
2. Owner logs in via /owner-login, navigates to User Management, views new user with status Pending Approval, clicks Approve, user status changes to Active
3. User logs in, navigates to Market Page via mobile bottom navigation bar Market tab, views available orders based on SAR amount limits
4. Owner creates order with USDT Price = 3.75 SAR, Order Amount = 1000 SAR, Custom Timer = 20 minutes, selects payment method \"STC Pay\", enters full payment account details, system automatically calculates and displays 266.67 USDT and generates Order Number ORD-1001, order appears in Market Page (Available Orders) and Active Orders (Ads)
5. User receives order, system locks order, changes status to active/locked, order disappears from marketplace and Active Orders (Ads), order appears in Received By Users, order appears in user's My Orders Page → Ongoing Orders Section with 20-minute countdown and Order Number ORD-1001
6. User uploads payment receipt and SMS screenshots, order moves to My Orders Page → Pending Orders Section with status Pending Review, Cancel Order option removed, order moves to Owner Dashboard → Pending Orders
7. Owner reviews order in secure screenshot viewer in Pending Orders section, approves order, system automatically credits 266.67 USDT to user wallet, saves credited SAR amount 1000 SAR permanently, order moves to Completed Orders Section
8. User views Wallet Page via mobile bottom navigation bar Wallet tab, sees USDT Balance 266.67, SAR Equivalent Balance 1000 SAR, transaction history shows order credit with order number ORD-1001
9. User views My Orders Page → Completed Orders Section, sees Order Number ORD-1001, SAR Amount Paid 1000 SAR, USDT Received 266.67, Date & Time (Saudi local time), Current Status Approved
10. Owner discovers payment issue (bank refund), navigates to Completed Orders, opens Order Number ORD-1001, marks as Disputed, system automatically deducts 266.67 USDT and 1000 SAR from user wallet, saves deduction details, moves order to Frozen Orders
11. User views My Orders Page → Frozen Orders Section, sees Order Number ORD-1001, deduction details showing deducted USDT 266.67, deducted SAR 1000, deduction reason \"Bank refund\", date & time (Saudi local time), dispute status Pending
12. User views Wallet Page, sees deduction record in transaction history with order number ORD-1001, deducted amounts, deduction reason, date & time
13. Owner navigates to Frozen Orders Management, opens Order Number ORD-1001, clicks Resolve Dispute (Unfreeze button not present), system re-credits 266.67 USDT and 1000 SAR to user wallet, restores balance, moves order back to Completed Orders, updates dispute status to Resolved
14. User views Wallet Page, sees restored USDT Balance 266.67, SAR Equivalent Balance 1000 SAR, transaction history shows re-credit entry
15. User submits withdrawal request for 100 USDT with Binance UID, request appears in Owner Withdrawal Management with Pending status
16. Owner marks withdrawal as Completed, system automatically deducts 100 USDT and SAR equivalent from user wallet, Owner uploads withdrawal proof screenshot (Binance transfer screenshot), saves withdrawal completion time (Saudi local time)
17. User views Withdrawal Request Page, sees withdrawal proof screenshot, withdrawal completion time (Saudi local time), withdrawal status Completed
18. Owner navigates to All User Balances, opens user profile, views wallet history showing all credits, debits, deductions; order history showing all orders; withdrawal history showing all withdrawals; frozen orders; deduction history
19. Owner navigates to User Statistics, views per user: Daily Received Orders 1, Daily Completed Orders 1, Daily Withdrawals 1, Daily Frozen Orders 0, Daily Cancelled Orders 0, Total Transactions 2, Activity Status Active
20. All timestamps across platform display in Saudi Arabia Local Time (Asia/Riyadh) with format DD/MM/YYYY HH:MM AM/PM
21. Owner temporarily bans user, user cannot view available orders, cannot receive orders, cannot create withdrawal requests
22. Owner reactivates user, user restored to Active status, full access allowed
23. Owner sets User A: max active orders = 2, User A receives 2 orders, attempts to receive 3rd order, system prevents order locking, shows limit reached message
24. Owner sets User B: SAR limits = 500-2000 SAR, User B views Market Page (Available Orders), only sees orders within 500-2000 SAR range
25. User receives order, order instantly removed from Market Page (Available Orders) and Active Orders (Ads), moved to Received By Users
26. User cancels order before upload, order returns to Market Page (Available Orders) and Active Orders (Ads), removed from Received By Users
27. User uploads screenshots, Cancel Order option removed completely
28. Order timer expires without upload, order status changes to pay_timeout, order moves to My Orders Page → Pay Timeout Section and Owner Dashboard → Pay Timeout Orders Management, order hidden from marketplace and Active Orders (Ads)
29. Owner navigates to Pay Timeout Orders Management, clicks Repost Order, order status changes to available, order visible in Market Page (Available Orders) and Active Orders (Ads) again
30. Owner navigates to Pay Timeout Orders Management, clicks Permanently Close Order, order marked as permanently closed, never returns to marketplace
31. Owner navigates to Pay Timeout Orders Management, clicks Delete Order, order permanently deleted from database with safe cleanup workflow (related wallet_transactions, linked references, logs, metadata automatically deleted or detached)
32. Owner attempts to permanently delete active order (status = pending_review), system prevents deletion, shows warning \"This order cannot be deleted because it is currently in use.\"
33. Owner permanently deletes inactive order (status = cancelled), system executes safe cleanup workflow, order and related records removed from database without foreign key constraint errors
34. User navigates using mobile bottom navigation bar, switches between Market, My Orders, Wallet tabs seamlessly
35. User clicks back button on Wallet Page, returns to previous page (My Orders Page)
36. Owner clicks back button on User Management page, returns to previous page (Owner Dashboard)

## 7. Out of Scope for Current Release

- Multiple Owner/Admin accounts
- Automated payment verification
- Real-time chat between users and Owner
- User-to-user P2P trading
- Cryptocurrency price charts or market data
- Multi-language support beyond English and Arabic
- Mobile native applications (iOS/Android)
- Integration with external payment gateways for automated processing
- Advanced analytics and reporting dashboards
- User referral or reward programs
- KYC (Know Your Customer) verification system
- Two-factor authentication (2FA)
- Email or SMS notifications for order status changes
- Transaction fee calculation and management
- Bulk order processing for Owner
- User rating or feedback system for Owner
- Automated order matching algorithms
- API for third-party integrations
- Automated dispute resolution system
- Multi-currency support beyond SAR and USDT
- File size limits for screenshot uploads
- Multi-device compatibility optimization
- Browser compatibility testing
- Performance optimization for large order volumes
- Social sharing features
- Automated timezone conversion for non-Saudi users
- Historical exchange rate tracking
- Automated daily statistics export
- Bulk user approval/rejection
- Automated withdrawal proof generation
- Multi-step dispute resolution workflow
- User activity logs and audit trails
- Automated balance reconciliation
- Scheduled order posting
- Automated user tier management
- Real-time order notifications
- Advanced fraud detection algorithms
- Automated screenshot verification
- Multi-signature wallet support
- Escrow service integration
- Automated refund processing
- Desktop navigation menu redesign
- Progressive Web App (PWA) features
- Offline mode support
- Push notifications
- Biometric authentication