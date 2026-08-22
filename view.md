# 📋 VIEW — CHECKLIST PEMBUATAN SISTEM JASTIP ERP RETAIL & TITIP-BELI

**Sumber:** `review.md` v2.1 (15 Agustus 2026)
**Format:** Centang `- [x]` jika item sudah selesai dikerjakan.

---

## A. FONDASI & INFRASTRUKTUR (Semua Role)

### A.1 Setup Awal (Fase 0)
- [ ] Install Laravel 11 (`composer create-project laravel/laravel jastip`)
- [ ] Setup MySQL 8 + Redis + konfigurasi `.env`
- [ ] Install package: `spatie/laravel-permission`
- [ ] Install package: `laravel/sanctum`
- [ ] Install package: `maatwebsite/excel`
- [ ] Install package: `barryvdh/laravel-dompdf`
- [ ] Auth scaffold (Breeze/Jetstream Blade)
- [ ] Configure TailwindCSS
- [ ] Setup queue worker (Supervisor) untuk notifikasi & cron

### A.2 Autentikasi & RBAC
- [ ] Seeder roles: superadmin, hub_owner, staff_cs, customer
- [ ] Seeder admin user (superadmin)
- [ ] Middleware role per route (`role:superadmin`, `role:hub`, dll)
- [ ] Policy permission: IDOR protection (order, wallet, subscription, delivery)
- [ ] Rate limiting login (`throttle:5,1`)
- [ ] Account lock (5x gagal login → 15 menit)
- [ ] Email verification (`MustVerifyEmail`)
- [ ] Verify OTP phone (`phone_verified_at`)

### A.3 Layout & Tema (Blade Reusable)
- [ ] `layouts/app.blade` (base + guest)
- [ ] `layouts/admin.blade` (superadmin)
- [ ] `layouts/hub.blade` (hub owner)
- [ ] `layouts/customer.blade` (customer)
- [ ] Komponen: `table-generic`
- [ ] Komponen: `pagination-filter`
- [ ] Komponen: `search-filter-bar`
- [ ] Komponen: `modal-form`
- [ ] Komponen: `modal-confirm`
- [ ] Komponen: `card-stat`
- [ ] Komponen: `card-product`
- [ ] Komponen: `card-reward`
- [ ] Komponen: `timeline`
- [ ] Komponen: `tabs-component`
- [ ] Komponen: `chat`
- [ ] Komponen: `form toggle`
- [ ] Standar filter tanggal Mulai–Akhir (`input type="date"` → `whereBetween`)

### A.4 Migrasi Database (Fase 1 — 130 file migration)
- [ ] Migrasi auth: users, password_reset_tokens, personal_access_tokens
- [ ] Migrasi roles & permissions (spatie)
- [ ] Migrasi 0001–0121 (106 tabel inti, urutan Fase 1 review.md)
- [ ] Migrasi 0122–0130 (tabel baru V2.1: product_reviews, wishlists, referrals, pos_sessions, pos_transactions, user_devices, complaint_slas, complaint_escalations, tax_configs)
- [ ] Migrasi 0131–0137 (fix field tambahan: products WMS, hub_product ROP, orders is_backorder, payments subscription_cycle_id, point_transactions complaint_id, deliveries packing, purchase_orders ppn/freight/eta/tolerance/payment_terms)
- [ ] `php artisan migrate:fresh` 100% OK tanpa error FK
- [ ] `php artisan migrate:status` tampil 130 file OK

### A.5 Seeder
- [ ] Seeder COA (30+ akun dari Section 9.3)
- [ ] Seeder Membership Tier (Silver, Gold, Platinum, Diamond)
- [ ] Seeder Kategori produk awal
- [ ] Seeder Hub contoh
- [ ] Seeder Produk + varian contoh
- [ ] Seeder Payment Methods (Poin, Tunai, QRIS, E-Wallet, VA, Transfer)
- [ ] Seeder Reward contoh
- [ ] Seeder Promo contoh
- [ ] Seeder Subscription Plan contoh
- [ ] Seeder Supplier contoh
- [ ] Seeder Fee Config (60/40)

### A.6 Service Layer (15+ Service)
- [ ] `PaymentGatewayService` (Midtrans/Xendit: create-token, charge, webhook)
- [ ] `PointBalanceService` (balance, add, deduct, pending, expired)
- [ ] `FeeCalculationService` (split 60/40)
- [ ] `NotificationService` (FCM + Email + WA)
- [ ] `AccountingService` (jurnal otomatis, `createJournal()` reusable)
- [ ] `OrderService` (`placeOrder()` — DB transaction + `lockForUpdate()`)
- [ ] `CartService`
- [ ] `StockMovementService` (in/out/adjustment/transfer + stock_before/after)
- [ ] `DeliveryService` (create from order/packing + assign kurir)
- [ ] `SubscriptionService` (auto-renewal cron)
- [ ] `ComplaintService`
- [ ] `ReplenishmentService` (ROP + forecasting)
- [ ] `PurchaseOrderService` (PR → PO + PDF)
- [ ] `PutawayService`
- [ ] `PickingService`
- [ ] `PackingService`
- [ ] `ReceivingService`
- [ ] `TierService` (auto-upgrade tier)
- [ ] `RewardService` (klaim reward)
- [ ] `ReturnService` (retur delivery)
- [ ] `ReconService` (rekonsiliasi payment)
- [ ] `ReportService` (laporan keuangan)
- [ ] `TaxService` (PPN)
- [ ] `PosService` (kasir hub)
- [ ] `RouteOptimizerService` (rute kurir optimal — DeliveryRoute)
- [ ] `VendorScoreService` (skor vendor — SupplierPerformance)
- [ ] `ComplaintSlaService` (SLA komplain — ComplaintSla)
- [ ] `EscalationService` (eskalasi komplain — ComplaintEscalation)
- [ ] `PointExpiryService` (kadaluarsa poin — PointExpiryRule)

### A.7 Cron Job (Scheduler)
- [ ] `points:expire` — kadaluarsa poin + jurnal
- [ ] `points:check-expiry` — notifikasi poin hampir kadaluarsa (7 hari)
- [ ] `subscription:renew` — auto-order subscription
- [ ] `replenishment:check` — cek ROP → buat suggestions
- [ ] `fee:report` — kirim laporan fee bulanan ke hub
- [ ] `sales:weekly-report` — ringkasan penjualan mingguan ke hub
- [ ] `complaint:escalate` — eskalasi otomatis komplain lampaui SLA
- [ ] Backup database harian (mysqldump)

### A.8 Keamanan (Section 10)
- [ ] Password bcrypt/Argon2
- [ ] Session database/Redis
- [ ] CSRF `@csrf` semua form
- [ ] `$fillable` / `$guarded` (mass assignment protection)
- [ ] Validasi mime + size file upload
- [ ] Enkripsi NIK/KTP (`Crypt::encryptString()`)
- [ ] API keys di `.env`
- [ ] Audit trail: Order create/update/delete/cancel
- [ ] Audit trail: Payment create/confirm/fail
- [ ] Audit trail: PointTransaction create
- [ ] Audit trail: StockMovement create
- [ ] Audit trail: UserRole assign/revoke
- [ ] Audit trail: FeeCalculation approve/pay
- [ ] Locking `lockForUpdate()` pada stock & wallet
- [ ] Unique constraint cegah duplikasi transaksi

### A.9 Testing & Deploy (Fase 12)
- [ ] PEST Feature test: login
- [ ] PEST Feature test: top-up poin
- [ ] PEST Feature test: order checkout (race condition)
- [ ] PEST Feature test: komplain
- [ ] PEST Feature test: subscription auto-renewal
- [ ] Export Excel (semua tabel utama + laporan)
- [ ] Export PDF (PO, invoicing, laporan)
- [ ] Deploy staging OK
- [ ] Rollback OK

### A.10 REST API (Sanctum) untuk Mobile App (Section 2.2)
> **Sumber:** review.md Section 2.2 — Arsitektur Target: "REST API (Sanctum) untuk Mobile App — Auth, Catalog, Orders, Delivery Tracking".

- [ ] Struktur folder: `app/Http/Controllers/Api/` (Auth, Catalog, Orders, Delivery Tracking)
- [ ] Struktur folder: `app/Repositories/` (lapisan repository)
- [ ] Struktur folder: `routes/api.php` + `routes/admin.php` (route terpisah admin)
- [ ] API Auth: register, login, logout, refresh token (Sanctum)
- [ ] API Auth: verifikasi email & OTP phone
- [ ] API Catalog: list produk + filter + search + sort + pagination
- [ ] API Catalog: detail produk + varian + review + wishlist
- [ ] API Orders: buat order, riwayat order, detail order
- [ ] API Orders: cancel order (restore point + stock)
- [ ] API Delivery Tracking: lacak paket (timeline 7 status)
- [ ] API Resources/Transformers untuk semua endpoint
- [ ] Rate limiting API (`throttle`) + middleware auth:sanctum

---

## B. GUEST (3 Halaman)

- [ ] `guest/landing.html` — Beranda publik, promo, produk unggulan
- [ ] `guest/login.html` — Form autentikasi
- [ ] `guest/register.html` — Pendaftaran akun baru

---

## C. CUSTOMER

### C.1 Modul Dashboard
- [ ] `customer/dashboard.html` — Ringkasan poin, pesanan, subscription
- [ ] Card: saldo poin, total pesanan, subscription aktif

### C.2 Modul E-commerce
- [ ] `customer/catalog.html` — Grid produk + search + filter kategori, harga min/max, rating, urutkan
- [ ] `customer/product-detail.html` — Detail produk + qty + add to cart
- [ ] Review produk (`customer/products/reviews`) — Tabel `product_reviews`
- [ ] Wishlist (`customer/wishlists`) — Tabel `wishlists`
- [ ] `customer/cart.html` — Keranjang (add/update/remove item + qty)
- [ ] `customer/checkout.html` — Alamat → ringkasan → pilih metode bayar (poin/tunai/qris/ewallet/va/transfer)
- [ ] `customer/orders.html` — Riwayat pesanan + status + pagination
- [ ] `customer/orders/tracking` — Lacak paket (timeline 7 status, Section 8 mockup)

### C.3 Modul Point & Wallet
- [ ] `customer/points-topup.html` — Saldo + form top-up + riwayat (filter tanggal)
- [ ] Top-up flow: nominal → payment → webhook → wallet balance += amount
- [ ] `customer/point-savings.html` — Tabungan poin (goal umroh, berqurban, travelling)
- [ ] Riwayat transaksi poin (filter tanggal + type)

### C.4 Modul Reward & Membership
- [ ] `customer/rewards.html` — Klaim reward (deduct points → riwayat `reward_redemptions`)
- [ ] `customer/profile-tier.html` — Profil + tier membership + progress + benefits

### C.5 Modul Payment & Subscription
- [ ] `customer/subscriptions.html` — List langganan + pilih paket
- [ ] `customer/subscriptions/pause` — Jeda langganan (tabel `subscription_pauses`)
- [ ] `customer/subscriptions/upgrade` — Upgrade/downgrade paket (tabel `subscription_upgrades`)
- [ ] Riwayat siklus tagihan

### C.6 Modul Komplain
- [ ] `customer/complaints.html` — Serahan komplain + chat + timeline
- [ ] `customer/complaints/create.html` — Form komplain baru
- [ ] `customer/complaints/show.html` — Detail + chat + timeline

### C.7 Modul Email & Notifikasi
- [ ] `customer/email-preferences.html` — Pengaturan email (order_updates, payment, delivery, subscription, promo)
- [ ] Notifikasi in-app (`/notifications`)

### C.8 Modul Referral (V2.1)
- [ ] `customer/referrals.html` — Program referral + copy link (tabel `referrals`)

---

## D. HUB

### D.1 Modul Dashboard Hub
- [ ] `hub/dashboard.html` — Statistik hub, aktivitas
- [ ] Card: stok, order masuk, pengiriman, pendapatan

### D.2 Modul Warehouse & Stok
- [ ] `hub/warehousing.html` — Stok produk hub + CRUD
- [ ] `hub/stock-order.html` — Order stok dari pusat
- [ ] Field `reorder_point` (ROP) di `hub_product`
- [ ] Alert stok menipis (≤ ROP)

### D.3 Modul WMS (Penyederhanaan Hub)
- [ ] `hub/warehouse-locations.html` — Lokasi rak di gudang hub
- [ ] `hub/stock-opname.html` — Stock opname hub
- [ ] `hub/picking.html` — Picking list untuk order
- [ ] `hub/packing.html` — Verifikasi packing sebelum kirim

### D.4 Modul Delivery & Kurir
- [ ] `hub/deliveries.html` — List delivery + assign kurir
- [ ] `hub/couriers.html` — CRUD kurir + status
- [ ] `hub/delivery-zones.html` — Zona pengiriman per hub
- [ ] `hub/delivery-routes.html` — Rute kurir optimal
- [ ] `hub/delivery-attempts.html` — Riwayat percobaan pengiriman
- [ ] `hub/delivery-proofs.html` — Bukti foto/ttd penerimaan
- [ ] `hub/delivery-schedules.html` — Jadwal pengiriman
- [ ] `hub/delivery-returns.html` — Retur/pengembalian barang

### D.5 Modul Customers & Fee (Hub)
- [ ] `hub/customers.html` — List customer + peta lokasi
- [ ] `hub/hub-coverage-map.html` — Peta jangkauan hub
- [ ] `hub/fee-report.html` — Laporan fee hub 15%
- [ ] `hub/hub-customer.html` — Belanja & poin (hub sebagai customer)
- [ ] `hub/orders.html` — Riwayat pesanan hub sebagai customer

### D.6 Modul POS (V2.1)
- [ ] `hub/pos.html` — Point of Sale: grid produk + cart + total

---

## E. SUPERADMIN

### E.1 Modul Dashboard (7 Dashboard)
- [ ] `superadmin/dashboard.html` — Utama: Total Penjualan, Order, Customer Aktif, Komplain
- [ ] `superadmin/dashboard-sales.html` — Sales: Order Hari Ini, Avg Transaksi, Top 5 Produk
- [ ] `superadmin/dashboard-warehouse.html` — Warehouse Internal & External
- [ ] `superadmin/dashboard-rabs.html` — RAB: Budget vs Actual
- [ ] `superadmin/dashboard-points-balance.html` — Poin Beredar, Aktif, Expired
- [ ] `superadmin/dashboard-fee.html` — Fee Hub, Fee Pusat
- [ ] `superadmin/dashboard-accounting.html` — Accounting: Total Aset, Laba Bersih

### E.2 Modul Master Data
- [ ] `superadmin/categories.html` — CRUD kategori
- [ ] `superadmin/products.html` — CRUD produk + varian
- [ ] `superadmin/hubs.html` — CRUD hub
- [ ] `superadmin/customers.html` — CRUD customer + alamat
- [ ] `superadmin/membership-tiers.html` — CRUD tier + `auto_upgrade`
- [ ] `superadmin/rewards.html` — CRUD reward
- [ ] `superadmin/promos.html` — CRUD promo/event
- [ ] `superadmin/suppliers.html` — CRUD supplier
- [ ] `superadmin/payment-methods.html` — CRUD metode pembayaran
- [ ] `superadmin/users.html` — Manajemen user & role

### E.3 Modul Point & Wallet
- [ ] `superadmin/point-transactions.html` — Semua transaksi poin
- [ ] `superadmin/point-expiry-rules.html` — CRUD aturan kadaluarsa poin

### E.4 Modul Payment
- [ ] `superadmin/payments.html` — List payment + detail
- [ ] `superadmin/payment-refunds.html` — Riwayat refund
- [ ] `superadmin/payment-reconciliation.html` — Rekonsiliasi bank/gateway
- [ ] `superadmin/accounting.html` — Jurnal + COA

### E.5 Modul Subscription
- [ ] `superadmin/subscription-plans.html` — CRUD paket langganan
- [ ] `superadmin/subscription-management.html` — Kelola semua langganan
- [ ] `superadmin/billing-attempts.html` — Riwayat percobaan tagihan

### E.6 Modul WMS (Warehouse Management System)
- [ ] `superadmin/warehouses.html` — CRUD gudang
- [ ] `superadmin/warehouse-locations.html` — CRUD lokasi/bin
- [ ] `superadmin/stock-bins.html` — Stok per bin
- [ ] `superadmin/stock-movements.html` — Mutasi stok
- [ ] `superadmin/putaway.html` — Penempatan barang ke bin
- [ ] `superadmin/receiving.html` — Penerimaan barang + QC
- [ ] `superadmin/picking.html` — Generate picking list
- [ ] `superadmin/packing.html` — Verifikasi packing
- [ ] `superadmin/stock-opname.html` — Stock opname
- [ ] `superadmin/replenishment.html` — Alert replenishment
- [ ] `superadmin/barcode-labels.html` — Cetak label barcode

### E.7 Modul Procurement (Order Stok Enterprise)
- [ ] `superadmin/purchase-requests.html` — PR (purchase request)
- [ ] `superadmin/purchase-request-approval.html` — Approval bertingkat
- [ ] `superadmin/purchase-orders.html` — PO (purchase order) + PDF + Email
- [ ] `superadmin/po-eta-dashboard.html` — ETA Dashboard
- [ ] `superadmin/supplier-performance.html` — Vendor scoring
- [ ] `superadmin/replenishment-suggestions.html` — Auto-forecasting
- [ ] `superadmin/backorders.html` — Manajemen backorder

### E.8 Modul Keuangan
- [ ] `superadmin/accounts.html` — COA (tree table)
- [ ] `superadmin/journal-entries.html` — Jurnal + Line
- [ ] `superadmin/fee-configs.html` — Konfigurasi fee (60/40)
- [ ] `superadmin/fee.html` — Laporan fee per hub
- [ ] `superadmin/fee-payouts.html` — Pembayaran fee ke hub
- [ ] `superadmin/rabs.html` — CRUD RAB
- [ ] `superadmin/rab-actuals.html` — Realisasi RAB otomatis
- [ ] `superadmin/accounting-reports.html` — Laporan: Neraca, Laba Rugi, Arus Kas

### E.9 Modul Loyalty & Membership
- [ ] `superadmin/tier-history.html` — Riwayat naik/turun tier
- [ ] Auto-upgrade tier berdasarkan total_spend/lifetime_earned
- [ ] `superadmin/reward-redemptions.html` — Riwayat klaim reward
- [ ] `superadmin/sales-targets.html` — Target vs realisasi penjualan
- [ ] `superadmin/loyalty-events.html` — Event bonus/cashback/multiplier

### E.10 Modul Komplain & CS
- [ ] `superadmin/complaints.html` — List komplain + assign CS
- [ ] `superadmin/complaints/show.html` — Detail + chat + badge unread
- [ ] `superadmin/complaint-slas.html` — SLA: urgent 4 jam, high 8 jam, medium 24 jam
- [ ] `superadmin/complaint-escalations.html` — Eskalasi ke supervisor

### E.11 Modul Email & Notifikasi
- [ ] `superadmin/email-templates.html` — CRUD template email
- [ ] `superadmin/email-logs.html` — Riwayat pengiriman email
- [ ] Notifikasi in-app (`/notifications`) + push FCM

### E.12 Modul Tax (V2.1)
- [ ] `superadmin/tax-configs.html` — CRUD konfigurasi PPN

---

## F. DATABASE — 106 TABEL / 130 MIGRATION (Ringkasan per Modul)

> Detail lengkap skema ada di review.md Section 4, 13, 14, 16, 17, 18, 19.

### F.1 Auth & RBAC (5)
- [ ] users, password_reset_tokens, personal_access_tokens, roles, permissions (+ pivot)

### F.2 Master Data (8)
- [ ] membership_tiers, hubs, categories, products, product_variants, hub_product, rewards, addresses

### F.3 Customer & Point (6)
- [ ] customer_profiles, point_wallets, point_transactions, point_savings, point_expiry_rules, customer_tier_history

### F.4 E-commerce & Order (6)
- [ ] carts, cart_items, orders, order_items, order_status_histories, product_reviews

### F.5 Wishlist & Referral (2)
- [ ] wishlists, referrals

### F.6 Payment (6)
- [ ] payment_methods, payments, payment_refunds, payment_installments, payment_reconciliation, payment_webhooks

### F.7 Subscription (7)
- [ ] subscription_plans, subscription_plan_items, subscriptions, subscription_cycles, subscription_pauses, subscription_upgrades, subscription_failures

### F.8 Delivery (8)
- [ ] couriers, deliveries, delivery_tracking, delivery_zones, delivery_routes, delivery_attempts, delivery_proofs, delivery_schedules

---

## G. NOTIFIKASI EMAIL (WAJIB — Section 16.3)

### G.1 Email Customer (10 jenis)
- [ ] Email: Pesanan #ORD-xxx Diterima (setelah checkout)
- [ ] Email: Pembayaran #ORD-xxx Berhasil (poin/tunai diterima)
- [ ] Email: Pesanan #ORD-xxx Sedang Diproses (warehouse mulai proses)
- [ ] Email: Pesanan #ORD-xxx Dalam Perjalanan (kurir di-assign)
- [ ] Email: Pesanan #ORD-xxx Telah Diterima (customer terima paket)
- [ ] Email: Top-Up Poin Berhasil
- [ ] Email: Poin Anda Akan Kadaluarsa (7 hari sebelum expired)
- [ ] Email: Tagihan Subscription #SUB-xxx (auto-renewal)
- [ ] Email: Komplain #CMP-xxx Telah Dibalas (CS merespon)
- [ ] Email: Reward #RWD-xxx Berhasil Diklaim

### G.2 Email Hub (7)
- [ ] Email: Order Stok #SO-xxx Telah Tiba
- [ ] Email: Stok Menipis: [Produk] (stok ≤ ROP)
- [ ] Email: PO #PO-xxx Dibuat (dikirim ke supplier)
- [ ] Email: PO #PO-xxx Disetujui
- [ ] Email: Delivery #DLV-xxx Selesai
- [ ] Email: Laporan Fee Bulan Ini (awal bulan)
- [ ] Email: Komplain Baru di Hub Anda

---

## H. ALUR BISNIS WAJIB (Section 6, 7)

- [ ] Alur order: Browse → Cart → Checkout → Payment → Confirmed → Packed → Shipped → Delivered
- [ ] Alur top-up poin: pilih nominal → metode bayar → payment sukses → wallet += amount → jurnal
- [ ] Alur subscription: pilih paket → auto-renew → cek saldo → auto-order / notifikasi → delivery
- [ ] Alur fee split 60/40: order selesai → fee 60% hub → 40% pusat
- [ ] Alur WMS: Inbound (PO→Receiving→QC→Put-away) → Inventory (bin, opname, replenish) → Outbound (picking→packing→kurir)
- [ ] Alur order stok: Stok ≤ ROP → auto-sugestion → PR → Approval → PO → Supplier → Receiving + QC → Stok bertambah
- [ ] Alur delivery end-to-end: Order → Packing → Delivery → Assign kurir → Rute → Bukti → Selesai / Retur
- [ ] Alur payment end-to-end: Checkout → Payment → success/failed → Refund → Rekonsiliasi → Jurnal
- [ ] Alur subscription end-to-end: Aktif → Siklus baru → Cek saldo → Auto-renewal → Sukses → Delivery / Gagal → Billing attempt (3x) → Pause/Cancel
- [ ] Race condition test: checkout ganda tidak double-deduct
- [ ] Cancel order: restore point + stock + alasan + riwayat

---

## I. CATATAN PENTING (Dari KESIMPULAN review.md)

- [ ] Total: 106 tabel, 130 migration, 88 controller, 100+ view blade
- [ ] Prioritas WMS: 🔴 Lokasi/Bin, Stock Opname, Receiving + QC, Supplier + PO
- [ ] Prioritas Order Stok: 🔴 ROP + Auto-suggestion, PR + Approval, Generate PO
- [ ] Barcode/QR scanner untuk receiving, picking, packing, stock opname
- [ ] Integrasi penuh: E-commerce Order → Stok (ROP) → Order Stok (PR/PO) → WMS (Receiving) → Stok kembali
- [ ] Hapus duplikat `nullable()` di `users` migration

---

## J. CHECKLIST PAGES & FILE YANG SUDAH DIBUAT (15 Agustus 2026 — Tema Tokopedia, HTML + JSON Statis)

> Semua file di bagian ini **SUDAH SELESAI dibuat** dan berfungsi.
> Keterangan: data statis + fallback inline di JS → berfungsi walau dibuka via `file://` tanpa server.

### J.1 Halaman Publik / Guest (14 halaman)
- [x] `index.html` — Landing page tema Tokopedia (topbar, header sticky, hero carousel, 16 kategori, 10 produk unggulan, keunggulan, Cara kerja, stats, CTA, footer)
- [x] `tentang.html` — Tentang Jastip (profil perusahaan, nilai-nilai, statistik, CTA)
- [x] `berjualan.html` — Mulai Berjualan (keuntungan mitra, 3 langkah daftar, FAQ, CTA)
- [x] `promo.html` — Halaman Promo (banner + 6 kartu promo + copy kode promo)
- [x] `bantuan.html` — Pusat Bantuan (8 kategori, 6 FAQ accordion, form kontak CS)
- [x] `login.html` — Login membaca `data/users.json` + fallback inline → redirect sesuai role
- [x] `register.html` — Register validasi + simpan user di localStorage → auto-login
- [x] `katalog.html` — Katalog produk publik (16 kategori + search + sort + filter + pagination)
- [x] `cart.html` — Keranjang Belanja (info cara belanja, simpan produk, checkout, lacak)
- [x] `points-topup.html` — Top Up Points (bonus 10%, metode pembayaran, points masuk otomatis)
- [x] `rewards.html` — Rewards (500+ reward, voucher, produk, paket Umrah)
- [x] `membership.html` — Membership & Tier (tier Bronze/Silver/Gold/Platinum dengan cashback)
- [x] `referral.html` — Referral (bonus 5.000 pts per teman, tanpa batas referral)
- [x] `subscription.html` — Langganan (paket sembako hemat 20%, pengiriman otomatis)
- [x] `wishlist.html` — Wishlist (simpat produk favorit, notifikasi harga turun)

### J.2 Customer (15 halaman)
- [x] `customer/catalog.html` — Katalog + search + sort + chips + sidebar filter
- [x] `customer/product-detail.html` — Detail produk + qty + add to cart + wishlist
- [x] `customer/cart.html` — Keranjang belanja (qty control, hapus, subtotal otomatis)
- [x] `customer/checkout.html` — Checkout (alamat, pilih metode bayar, ringkasan)
- [x] `customer/orders.html` — Riwayat pesanan (stats, tabel, filter status + search + pagination)
- [x] `customer/order-tracking.html` — Lacak paket (timeline 7 status, mit mockup)
- [x] `customer/points-topup.html` — Points & Top Up (saldo, pilih nominal, riwayat transaksi)
- [x] `customer/rewards.html` — Klaim reward (grid, saldo, tombol klaim)
- [x] `customer/profile-tier.html` — Profil & tier (info profil, progres tier, tabel benefit, tabungan poin)
- [x] `customer/subscriptions.html` — Subscription (langganan aktif, 3 paket, riwayat siklus)
- [x] `customer/complaints.html` — Komplain (form aduan, riwayat, chat CS demo)
- [x] `customer/email-preferences.html` — Preferensi email (toggle notifikasi)
- [x] `customer/referrals.html` — Program referral (link + copy, statistik, riwayat)
- [x] `customer/wishlists.html` — Wishlist (grid produk tersimpan)
- [x] `customer/product-reviews.html` — Review produk (star rating + daftar ulasan)
- [x] `css/customer.css` — CSS khusus halaman customer (panel, tabel, cart, tracking, subscription, toggle, dll)

### J.3 Dashboard per Role (3 halaman)
- [x] `dashboard/superadmin.html` — Dashboard Superadmin (stat cards, 3 chart, tabel order, filter + search + pagination)
- [x] `dashboard/hub.html` — Dashboard Hub (stat cards, chart delivery, tabel order hub)
- [x] `dashboard/customer.html` — Dashboard Customer INTERAKTIF (welcome banner, quick actions, stat cards, tab Ringkasan/Pesanan/Aktivitas, 3 chart, subscription, badge keranjang)

### J.4 File Pendukung (10 file)
- [x] `css/style.css` — CSS tema hijau di halaman publik
- [x] `css/dashboard.css` — CSS dashboard modern (sidebar, header, stats, chart, tabel)
- [x] `css/hub.css` — CSS khusus hub (sidebar collapsible, POS, toggle email)
- [x] `js/main.js` — Preloader, carousel, search, cart, wishlist, auth, toast, scroll
- [x] `js/auth.js` — Login/register + session (localStorage) + proteksi halaman
- [x] `js/dashboard.js` — Render sidebar per role, chart Chart.js, filter + pagination
- [x] `js/customer-layout.js` — Satu sumber sidebar & header untuk semua halaman customer
- [x] `js/hub-layout.js` — Layout sidebar kelompok untuk semua halaman hub
- [x] `js/wishlist.js` — Render wishlist dinamis dari localStorage
- [x] `js/catalog.js` — Render katalog + 16 kategori + filter + sort + pagination
- [x] `data/users.json` — 3 akun demo (superadmin, hub, customer)
- [x] `data/products.json` — 35 produk di 16 kategori
- [x] `data/dashboard.json` — Data cards + charts + tabel untuk 3 role

### J.5 Akun Demo Login
- [x] Superadmin: `admin@jastip.id` / `admin123` → `dashboard/superadmin.html`
- [x] Hub: `hub@jastip.id` / `hub123` → `dashboard/hub.html`
- [x] Customer: `customer@jastip.id` / `customer123` → `dashboard/customer.html`

### J.6 Fitur Interaktif (16 Agustus 2026)
- [x] **Wishlist interaktif** — tombol hati di katalog (`data-wishlist`), simpan & render dinamis dari localStorage (`jastip_wishlist`), hapus, toast
- [x] **Pembayaran checkout** — 4 metode (Points/Tunai/QRIS/Transfer), pilih bank + no rekening dinamis + Upload bukti
- [x] **Top-up points** — Transfer Bank + pilih bank + upload bukti + validasi
- [x] **Tombol Pilih Paket di subscription** — pilih paket → `jastip_subscription` aktif → tier kembali ke Gold (`jastip_tier`)
- [x] **Pembatalan langganan → tier Bronze** — `jastip_subscription` tidak aktif + `jastip_tier='bronze'` + alasan
- [x] **Sinkron tier via localStorage** — profile-tier.html membaca tier aktif dari localStorage
- [x] **Tabel benefit dengan kolom Bronze** — 0% cashback
- [x] **Info poin non-tunai** — "Poin tidak dapat diklaim dengan uang" di points-topup.html & profile-tier.html
- [x] **Filter kategori + pagination** di catalog
- [x] **Hub WMS & Procurement pages** — lihat Section 3 di atas

### J.7 Hub Owner (21 halaman — dashboard + sub-modul interaktif)
- [x] `dashboard/hub.html` — Dashboard Hub INTERAKTIF
- [x] `css/hub.css` — CSS khusus hub
- [x] `js/hub-layout.js` — satu sumber sidebar
- [x] `hub/fee-report.html`, `hub/email-preferences.html`
- [x] `hub/warehousing.html`, `hub/stock-order.html`, `hub/warehouse-locations.html`, `hub/stock-opname.html`
- [x] `hub/picking.html`, `hub/packing.html`
- [x] `hub/deliveries.html`, `hub/couriers.html`, `hub/delivery-zones.html`, `hub/delivery-routes.html`
- [x] `hub/delivery-attempts.html`, `hub/delivery-proofs.html`, `hub/delivery-schedules.html`,`hub/delivery-returns.html`
- [x] `hub/customers.html`, `hub/hub-coverage-map.html`, `hub/hub-customer.html`, `hub/orders.html`
- [x] `hub/pos.html` — POS

### J.7.3 Detail Barang & Jumlah di Halaman Warehouse (16 Agustus 2026)
- [x] **`hub/warehousing.html` (EDIT)** — Tambah modal **"Buat Order Stok"** (dipindah dari stock-order.html): pilih produk, jumlah, catatan, tombol Kirim Order
- [x] **`hub/stock-order.html` (EDIT)** — Hapus modal Buat Order Stok & tombol Order Baru (kini di warehousing); tabel **Riwayat Pengiriman** menampilkan **detail barang + jumlah** per order; modal laporan menampilkan **tabel detail barang + jumlah**
- [x] **`hub/receiving.html` (EDIT)** — Tabel penerimaan menampilkan **detail barang + jumlah**; modal laporan menampilkan **tabel detail barang + jumlah**
- [x] **`hub/deliveries.html` (EDIT)** — Tabel delivery menampilkan **detail barang + jumlah**; modal laporan menampilkan **tabel detail barang + jumlah**

### J.7.9 Master Konversi Rupiah ke Point (16 Agustus 2026)
> **Tujuan:** Menambahkan master konversi Rupiah ke Point (nilai tukar Rp → Poin) yang dapat dikonfigurasi oleh operator. Konversi point pada Kalkulasi RAB per produk menggunakan rate aktif dari master ini.

- [x] **`js/superadmin-layout.js` (EDIT)** — Tambah menu **"Konversi Rupiah ke Point"** (`currency-conversion.html`) di grup **Master Data**
- [x] **`js/superadmin-data.js` (EDIT)** — Modul baru **`currency-conversion`**:
  - Card stat: Rate Aktif, Total Konfigurasi, Poin Beredar, Total Transaksi
  - Kolom: Nama Konfigurasi, Rate (Rp / 1 Poin), Berlaku Sejak, Status
  - Data demo: Rate Standar 2026 (1 pts = Rp 1, Aktif), Rate Promo HUT (1 pts = Rp 5, Nonaktif), dll
  - CRUD lengkap + filter + search + pagination
- [x] **`dashboard/superadmin/currency-conversion.html` (BARU)** — Halaman master konversi
- [x] **`js/superadmin-core.js` (EDIT)** — Fungsi `getConversionRate()` membaca rate aktif dari localStorage (`jastip_sa_currency-conversion`), fallback `1 Poin = Rp 1`. Fungsi `calcRab()` menggunakan rate tersebut untuk konversi: `Point = Harga Jual (Rp) ÷ Rate`

**Rumus Konversi:**
```
Harga Jual (Rp) ÷ Rate (Rp per 1 Poin) = Point
Contoh: Harga Jual Rp 93.500 ÷ Rp 1 = 93.500 pts
        Harga Jual Rp 93.500 ÷ Rp 5 = 18.700 pts
```

### J.7.8 Master Kategori + Searchable Dropdown Produk (16 Agustus 2026)
> **Tujuan:** Tambah Master Kategori di menu Master Data, dan pada form modal Tambah/Edit Produk isian **Kategori** dan **Supplier** diambil dari master data masing-masing dengan fitur pencarian (searchable dropdown).

- [x] **`js/superadmin-layout.js` (EDIT)** — Tambah menu **"Kategori"** (`categories.html`) di grup **Master Data**
- [x] **`js/superadmin-data.js` (EDIT)** — Modul `products`:
  - Tambah kolom **Supplier** + data supplier pada rows produk
  - Field **Kategori** dynamic dari master `categories` (`dynamicSource`)
  - Field **Supplier** dynamic dari master `suppliers` (`dynamicSource`)
- [x] **`js/superadmin-core.js` (EDIT)** — **Searchable dropdown**: input pencarian realtime memfilter opsi Kategori/Supplier sebelum dipilih; dukungan navigasi keyboard (↑/↓)

### J.7.7 Restrukturisasi Menu Stok & Gudang (16 Agustus 2026)
> **Tujuan:** Mempermudah operator. Hapus Penyusunan RAB (dashboard-rabs.html) yang tidak diperlukan, kelompokkan dashboard warehouse + manajemen stok ke grup baru "Stok & Gudang", tambah Master Supplier di menu, dan tambah foto produk untuk katalog publik.

- [x] **Hapus** file `dashboard/superadmin/dashboard-rabs.html` (tidak diperlukan)
- [x] **`js/superadmin-layout.js` (EDIT)** — Struktur menu baru:
  - **📊 Dashboard** (5): Utama, Sales, Saldo/Point, Fee, Accounting
  - **🗂️ Master Data** (9): Membership & Tier, Points, Reward, Produk, **Supplier**, Promo/Event, Hub, Customer, User & Role
  - **🏭 Stok & Gudang** (3): **Manajemen Stok** (baru), Warehouse Internal, Warehouse External
  - **⚙️ Operasional** (3): Payment, Subscription, Pengaduan/CS
- [x] **`js/superadmin-data.js` (EDIT)** — Tambah modul **`stock-management`**:
  - Card stat: Total SKU, Stok Menipis, Stok Habis, Total Terjual
  - Kolom: Produk, SKU, Kategori, Stok, Min Stok, Terjual, Status (Aman/Menipis/Habis)
  - CRUD + filter kategori/status + search + pagination
- [x] **`js/superadmin-data.js` (EDIT)** — Modul `products`:
  - Tambah kolom **Foto** (`image` type) + field URL foto di modal
  - **Kategori** dinamis (diambil dari Master Data Kategori)
  - **SKU** otomatis (`PRD-001`, dll) saat tambah baru
  - **Stok & Min Stok** dihapus dari form produk (dikelola di Manajemen Stok)
- [x] **`js/superadmin-core.js` (EDIT)** — Support `type: 'image'` (thumbnail), dropdown dinamis dari master data, SKU otomatis
- [x] **`dashboard/superadmin/stock-management.html` (BARU)** — Halaman Manajemen Stok

### J.7.6 Penyusunan RAB per Produk (16 Agustus 2026)
> **Tujuan:** Harga jual produk dihasilkan dari penyusuna RAB (Rencana Anggaran Biaya) per produk dengan komponen persen (Fee, Diskon Member, Diskon Lainnya, Biaya Operasional, Biaya Lainnya, Overhead). Harga jual otomatis dikonversi ke point (1 pts = Rp 1).

- [x] **`js/superadmin-layout.js` (EDIT)** — Pindahkan menu **"Penyusunan RAB"** (`dashboard-rabs.html`) dari grup **Dashboard** ke grup **Master Data**
- [x] **`js/superadmin-data.js` (EDIT)** — Modul `products` kini memiliki:
  - Kolom **Harga Biaya** (`price`) + **Harga Jual** (`sellingPrice`) + **Harga Poin** (`points`)
  - Field RAB per produk: `feePercent` (Fee), `memberDiscountPercent` (Diskon Member), `otherDiscountPercent` (Diskon Lainnya), `operationalCostPercent` (Biaya Operasional), `otherCostPercent` (Biaya Lainnya), `overheadPercent` (Overhead)
  - `modalFields` input RAB per produk
- [x] **`js/superadmin-core.js` (EDIT)** — Kalkulasi RAB realtime saat modal produk terbuka:
  - `RAB_FIELDS` — daftar 6 komponent persen RAB
  - `calcRab()` — `Harga Jual = Harga Biaya × (1 + Total % / 100)`
  - `Point = Harga Jual` (1 pts = Rp 1)
  - `sellPrice` & `points` otomatis terisi saat input persen berubah

**Rumus RAB:**
```
Harga Biaya (Rp) × (1 + (Fee% + Diskon Member% + Diskon Lainnya% + Biaya Operasional% + Biaya Lainnya% + Overhead%) / 100) = Harga Jual (Rp)
Harga Jual (Rp) → Point (1 pts = Rp 1)
```

### J.7.4 Penyederhanaan Dashboard Superadmin (16 Agustus 2026 — Rencana Awal)
> **Tujuan:** Sederhanakan dashboard superadmin agar mudah dioperasikan operator. Menu sidebar digabung dari 12 group / 70+ menu menjadi **3 group / 19 menu** sesuai rencana awal (`superadmin_rencana awal/`). Halaman WMS/Pengadaan/Keuangan detail tetap ada di folder, hanya tidak lagi tampil di menu.

- [x] **`js/superadmin-layout.js` (EDIT)** — Sidebar superadmin sederhanakan menjadi 3 group:
  - **Dashboard** (8): Utama, Warehouse Internal, Warehouse External, Sales, Penyusunan RAB, Saldo/Point, Fee, Accounting
  - **Master Data** (8): Membership & Tier, Points, Reward, Produk, Promo/Event, Hub, Customer, User & Role
  - **Operasional** (3): Payment, Subscription, Pengaduan/CS
- [x] **`js/superadmin-layout.js` (EDIT)** — Update `FILE_TO_MENU` + `FILE_TO_GROUP` hanya untuk 19 menu yang tampil
- [x] **`js/superadmin-data.js` (EDIT)** — Aktiver CRUD (`hasCrud: true` + `modalFields`) pada modul:
  - `point-transactions` (Riwayat Transaksi Poin)
  - `payments` (Transaksi Payment)
  - `subscription-management` (Kelola Langganan)
  - `complaints` (Semua Komplain)
- [x] **Fitur lengkap** — Semua 19 halaman superadmin mendukung CRUD, pagination, chart, card stat, searching, filter dropdown + tanggal + chip

### J.7.4 Form Retur Barang Hub (16 Agustus 2026 — Skema Retur Lengkap)
- [x] **`js/return-data.js` (BARU)** — Satu sumber data retur hub:
  - Struktur data mengikuti skema `delivery_returns` di review.md (status: `requested → approved → picked_up → returned → refunded / rejected`)
  - Simpan ke `localStorage` (`jastip_returns`) + fallback data demo
  - API: `getAll()`, `getById()`, `add()`, `updateStatus()`, `statusBadge()`, `statusLabel()`, `formatItems()`
  - Ekspor global `window.JastipReturns`
- [x] **`hub/delivery-returns.html` (EDIT)** — Halaman Penerimaan / Retur lengkap:
  - Tombol **"Buat Retur"** di header
  - **Modal Form Retur**: pilih referensi (Delivery/Order Stok) → centang barang per-item + isi qty retur → pilih alasan (Barang rusak, Barang kurang, Salah kirim, Alamat tidak ditemukan, Customer menolak, Lainnya) → catatan → upload bukti foto (opsional)
  - **6 status badge** sesuai review.md: Diajukan (kuning), Disetujui (biru), Dijemput (biru), Dikembalikan (merah), Refund (hijau), Ditolak (abu-abu)
  - Tabel riwayat: kolom Kode, Referensi, Jenis, Detail Barang (nama + qty retur/kirim), Alasan, Status, Tanggal, Aksi (Detail)
  - **Modal Detail Retur**: info lengkap + tabel barang retur
  - Filter status 6 status + search + stat cards (Total, Diajukan, Disetujui, Dikembalikan, Refund)
  - Dukungan parameter URL `?ref=...&jenis=...` → form retur terbuka otomatis dengan referensi terisi
- [x] **`hub/deliveries.html` (EDIT)** — Tambah tombol **"Ajukan Retur"** di modal laporan penerimaan → redirect ke `delivery-returns.html?ref=DEL-xxx&jenis=Delivery`
- [x] **`hub/receiving.html` (EDIT)** — Tambah tombol **"Ajukan Retur"** di modal laporan penerimaan → redirect ke `delivery-returns.html?ref=SO-xxx&jenis=Order Stok`

**Alur Retur End-to-End:**
```
HUB menemukan barang rusak/kurang/salah
        │
        ▼
HUB buka menu "Penerimaan / Retur" → klik "Buat Retur"
        │
        ▼
Isi form: pilih referensi → centang barang + qty retur → alasan → catatan → bukti foto
        │
        ▼
Status: REQUESTED (Diajukan) — menunggu persetujuan pusat
        │
        ▼
Pusat setujui → APPROVED (Disetujui) → kurir jemput → PICKED_UP (Dijemput)
        │
        ▼
Barang sampai pusat → RETURNED (Dikembalikan)
        │
        ▼
Refund poin/dana → REFUNDED (Refund)   |   Jika ditolak → REJECTED (Ditolak)
```

### J.7.2 Penyederhanaan Portal Hub (16 Agustus 2026 — Peran Hub = Penyalur)
- [x] **`js/hub-layout.js` (EDIT)** — Hapus group **Proses WMS** (Picking, Packing) & **POS (Kasir)** dari sidebar hub
- [x] **`js/hub-layout.js` (EDIT)** — Sederhanakan **Warehouse & Stok** → hanya 3 menu: Stok Hub, Order Stok, Penerimaan Barang
- [x] **`js/hub-layout.js` (EDIT)** — Sederhanakan **Delivery & Kurir** → hanya 2 menu: Delivery Masuk, Penerimaan / Retur
- [x] **Hapus 11 halaman tidak digunakan**: `picking.html`, `packing.html`, `pos.html`, `couriers.html`, `delivery-zones.html`, `delivery-routes.html`, `delivery-attempts.html`, `delivery-proofs.html`, `delivery-schedules.html`, `warehouse-locations.html`, `stock-opname.html`
- [x] **`hub/receiving.html` (BARU)** — Penerimaan Barang: list barang masuk dari pusat + tombol Terima/Kembalikan + statistik
- [x] **`hub/warehousing.html` (EDIT)** — Hapus tombol Tambah Stok & modal edit (stok read-only dari pusat)
- [x] **`hub/stock-order.html` (EDIT)** — Tambah kolom Laporan: tombol Terima/Kembalikan
- [x] **`hub/deliveries.html` (EDIT)** — Hapus modal assign kurir & buat delivery; fokus list delivery dari pusat + tombol Terima/Kembalikan
- [x] **`hub/delivery-returns.html` (EDIT)** — Fokus laporan barang diterima/dikembalikan ke pusat
- [x] **`dashboard/hub.html` (EDIT)** — Hapus quick action Picking, Packing, POS; ganti dengan Penerimaan Barang & Retur

### J.7.1 Hub Sebagai Customer (16 Agustus 2026 — Group Sidebar Baru)
- [x] **`js/hub-layout.js` (EDIT)** — Tambah group dropdown **"Hub Sebagai Customer"** di sidebar hub berisi 14 menu:
  - Belanja & Poin (`hub-customer.html`), Katalog (`hub-catalog.html`), Detail Produk (`hub-product-detail.html`), Keranjang (`hub-cart.html`), Checkout (`hub-checkout.html`), Riwayat Pesanan (`hub-orders.html`), Lacak Paket (`hub-order-tracking.html`), Rewards (`hub-rewards.html`), Subscription (`hub-subscriptions.html`), Komplain (`hub-complaints.html`), Profil & Tier (`hub-profile-tier.html`), Wishlist (`hub-wishlists.html`), Review (`hub-product-reviews.html`), Referral (`hub-referrals.html`)
- [x] **Hapus** item "Belanja & Poin" & "Order Hub" dari group **Customer & Fee** (kini hanya Customers + Peta Jangkauan)
- [x] **`js/catalog.js` (EDIT)** — Deteksi path data `../../data/products.json` untuk halaman di folder `dashboard/hub/`
- [x] `hub/hub-catalog.html` (BARU) — Katalog produk hub sebagai customer (search + sort + filter + pagination)
- [x] `hub/hub-product-detail.html` (BARU) — Detail produk + qty + add to cart
- [x] `hub/hub-cart.html` (BARU) — Keranjang belanja hub (qty control, hapus, subtotal otomatis)
- [x] `hub/hub-checkout.html` (BARU) — Checkout hub (alamat, pilih metode bayar, ringkasan, buat pesanan)
- [x] `hub/hub-orders.html` (BARU) — Riwayat pesanan hub (stats, tabel, filter status + sumber + search)
- [x] `hub/hub-order-tracking.html` (BARU) — Lacak paket hub (timeline 7 status)
- [x] `hub/hub-rewards.html` (BARU) — Klaim reward hub (grid, saldo, tombol klaim)
- [x] `hub/hub-subscriptions.html` (BARU) — Subscription hub (langganan aktif, 3 paket, riwayat siklus)
- [x] `hub/hub-complaints.html` (BARU) — Komplain hub (form aduan, riwayat, chat CS demo)
- [x] `hub/hub-profile-tier.html` (BARU) — Profil & tier hub (info profil, progres tier, tabel benefit, tabungan poin)
- [x] `hub/hub-wishlists.html` (BARU) — Wishlist hub (grid produk tersimpan)
- [x] `hub/hub-product-reviews.html` (BARU) — Review produk hub (star rating + daftar ulasan)
- [x] `hub/hub-referrals.html` (BARU) — Program referral hub (link + copy, statistik, riwayat)

---

## K.0 DATA ORDER TERPUSAT (16 Agustus 2026)

- [x] **`js/order-data.js` (BARU)** — satu sumber data order customer:
  - Order dari **Checkout** (`jastip_orders`)
  - Order dari **Paket Member / Subscription** (`jastip_subscription_order`)
  - Fallback demo (8 order belanja + 3 order paket member)
  - Badge status (`JastipOrders.statusBadge`) & badge sumber (`JastipOrders.sourceBadge`)
- [x] **`customer/checkout.html`** — saat "Buat Pesanan" → order tersimpan ke localStorage via `JastipOrders.addCheckout()`
- [x] **`customer/subscriptions.html`** — saat "Pilih Paket" → otomatis membuat order `source: subscription` via `JastipOrders.setSubscription()`
- [x] **`customer/orders.html`** — menampilkan SEMUA order (Belanja + Paket Member) + kolom **Sumber** + filter sumber + stat cards dinamis
- [x] **`customer/complaints.html`** — dropdown "Pilih Pesanan" berisi SEMUA riwayat order (belanja + paket member)
- [x] **`customer/product-reviews.html`** — daftar produk yang bisa di-review diambil dari SEMUA order berstatus Selesai (belanja + paket member)

---

## K. SKEMA TIER OTOMATIS + DURASI LANGGANAN (16 Agustus 2026)

### K.1 Deskripsi
- Customer tier otomatis naik (upgrade) ketika **total belanja** dan/atau **lama berlangganan (tahun)** melebihi ambang yang ditentukan.
- Skema ini diimplementasikan sebagai prototype statis di `js/tier.js` + `js/customer-layout.js`.

### K.2 Ambang Tier
| Tier | Min Total Belanja (Rp) | Min Lama Berlangganan (tahun) |
|---|---|---|
| Bronze | 0 | 0 |
| Silver | 1.000.000 | 1 |
| Gold | 5.000.000 | 3 |
| Platinum | 10.000.000 | 5 |
| Diamond | 25.000.000 | — |

### K.3 File Baru — `js/tier.js`
- `getTier()` — membaca `localStorage.jastip_tier` (default: `bronze`)
- `calcTier(totalSpend, subscriptionYears)` — menghitung tier dari spend + durasi
- `autoUpgradeTier(totalSpend, years)` — membandingkan ambang, jika naik → simpan `jastip_tier` + `jastip_tier_alasan`, kembalikan tier baru
- Ekspor global: `window.JastipTier`

### K.4 Integrasi — `js/customer-layout.js`
- Dipanggil saat halaman customer (khususnya dashboard + `subscriptions.html`) dimuat
- Notifikasi toast "Selamat! Tier Anda naik ke X"

### K.5 Alur Saat User Pilih Paket / Berhenti (halaman `customer/subscriptions.html`)
- **pilihPaket(nama, harga)**: simpan `jastip_subscription` aktif → set tier kembali ke `'gold'` → `updateSubscriptionUI()`
- **batalkanLangganan()**: set status Tidak Aktif → `jastip_tier='bronze'` + alasan → peringatan penurunan tier muncul

### K.6 Relevansi dengan blueprint Laravel
- `TierService` (auto-upgrade) — review.md Section 17.4 (customer_tier_history reason `auto_upgrade`)
- `Subscriptions.Start_date` → lange years → upgrade tier via service
- `membership_tiers.auto_upgrade` (field tambahan §17.5)

---

### J.8 Panduan Dashboard Customer (16 Agustus 2026)
- [x] `dashboard/customer-guide.html` (BARU) — Halaman **Tata Cara Penggunaan Dashboard Customer** premium & minimalis:
  - Hero header + breadcrumb + tombol kembali ke dashboard
  - Stat cards ringkas (13 menu, 100% fitur interaktif, info lengkap, 5 tier)
  - Pencarian realtime untuk filter kartu panduan per menu
  - **13 kartu panduan menu** (Dashboard, Katalog, Keranjang, Pesanan, Points & Top Up, Rewards, Subscription, Komplain, Profil & Tier, Wishlist, Review, Preferensi Email, Referral) — masing-masing berisi pengertian & langkah pengoperasian berurutan (numbered steps)
  - Tips & aturan penting: poin non-tunai, upgrade tier otomatis, ongkir sudah termasuk, dua sumber pesanan
  - Alur penggunaan end-to-end dalam kartu gelap modern
- [x] `dashboard/customer.html` (EDIT) — Tombol **"Tata Cara Penggunaan"** ditambahkan di **Welcome Banner** (tombol putih solid, ikon info, teks jelas mudah dibaca) → menuju `customer-guide.html`

---

*Dokumen checklist diperbarui: 16 Agustus 2026 — Menambahkan kembali checklist halaman Section B–J + Section K (Skema Upgrade Tier Otomatis) + Section K.0 (Data Order Terpusat) + Section J.8 (Halaman Panduan Tata Cara Dashboard Customer).*

---

## L. GAP DASHBOARD ADMIN & RENCANA PERBAIKAN (17 Agustus 2026)

> **Sumber analisis:** pemeriksaan `dashboard/hub.html`, `dashboard/hub/orders.html`, `dashboard/hub/deliveries.html`, `dashboard/hub/stock-order.html`, `dashboard/customer/orders.html`, `js/order-data.js`, `js/superadmin-layout.js`, `js/superadmin-core.js`, `js/superadmin-data.js`, `data/dashboard.json`.

### L.1 Manajemen Pesanan (Order Management) — SUDAH ADA, PERLU DISEMPURNAKAN

| Fitur | Status | Detail |
|---|---|---|
| Riwayat pesanan Customer (checkout + member) | ✅ Ada | `customer/orders.html` + `js/order-data.js` (filter status + sumber) |
| Riwayat pesanan Hub (checkout + member) | ✅ Ada | `dashboard/hub/hub-orders.html` |
| Riwayat pesanan Hub sebagai customer ke pusat | ✅ Ada | `dashboard/hub/orders.html` (tabel sederhana) |
| **Detail pesanan** (klik lihat item, alamat, pembayaran) | ❌ Belum | perlu modal/halaman detail |
| **Aksi per pesanan** (Konfirmasi/Proses/Kirim/Selesai/Batalkan) | ❌ Belum | perlu tombol aksi + update status |
| **Cetak Invoice / Struk** | ❌ Belum | perlu template print |
| **Export CSV/Excel berfungsi** | ❌ Belum | masih demo `showToast('Export menyusul (Demo)')` |

### L.2 Manajemen Pengiriman (Delivery Management) — SUDAH ADA, PERLU DISEMPURNAKAN — SUDAH ADA + MODUL SUPERADMIN BARU ✅ (22 Agustus 2026)

- [x] **`dashboard/superadmin/deliveries.html` (BARU)** — Halaman **Pengiriman** superadmin: CRUD lengkap, kartu statistik, filter Hub/Kurir/Status + tanggal.
- [x] **`js/superadmin-data.js` (EDIT)** — Modul `deliveries` baru + CRUD via localStorage (`jastip_sa_deliveries`).
- [x] **`js/superadmin-layout.js` (EDIT)** — Menu **"Pengiriman"** ditambahkan ke group **Operasional** sidebar superadmin.
- [x] **`js/superadmin-core.js` (EDIT)** — Badge status `retur` (merah) & `dalam perjalanan` (amber).

| Fitur | Status | Detail |
|---|---|---|
| List delivery dari pusat | ✅ Ada | `dashboard/hub/deliveries.html` |
| Laporan penerimaan (Diterima/Dikembalikan) | ✅ Ada | modal + simpan laporan |
| Ajukan Retur (6 status) | ✅ Ada | `dashboard/hub/delivery-returns.html` + `js/return-data.js` |
| **Cetak Surat Jalan** | ❌ Belum | perlu template print |
| **Label Pengiriman (barcode/QR)** | ❌ Belum | perlu template print |
| **Assign Kurir + riwayat tracking** | ❌ Belum | sesuai penyederhanaan peran hub, kurir dikelola pusat |
| **Export CSV/Excel berfungsi** | ❌ Belum | masih demo |

### L.3 Manajemen Pembelian ke Supplier (Procurement) — MODUL ADA, MENU BELUM TAMPIL ✅ DIPERBAIKI

| Fitur | Status | Detail |
|---|---|---|
| `superadmin/purchase-requests.html` | ✅ Ada data | di `superadmin-data.js` (CRUD) |
| `superadmin/purchase-request-approval.html` | ✅ Ada data | di `superadmin-data.js` |
| `superadmin/purchase-orders.html` | ✅ Ada data | di `superadmin-data.js` (CRUD + **hasPrint**) |
| `superadmin/po-eta-dashboard.html` | ✅ Ada data | di `superadmin-data.js` |
| `superadmin/supplier-performance.html` | ✅ Ada data | di `superadmin-data.js` |
| `superadmin/replenishment-suggestions.html` | ✅ Ada data | di `superadmin-data.js` |
| `superadmin/backorders.html` | ✅ Ada data | di `superadmin-data.js` |
| **Sidebar group "Pengadaan"** | ✅ **DIPERBAIKI 17 Agu** | `js/superadmin-layout.js` — grup baru + `FILE_TO_MENU` + `FILE_TO_GROUP` |
| **Integrasi Stok → PR → PO → Cetak** | ❌ Belum | perlu workflow end-to-end |

### L.4 Cetak Surat Pesanan Otomatis (Purchase Order) — ✅ DIIMPLEMENTASIKAN (17 Agustus 2026)

- [x] **`js/superadmin-core.js` (EDIT)** — Fungsi `printPurchaseOrder(module, row)`:
  - Membuka window baru berisi **template surat pesanan otomatis**
  - **Kop perusahaan**: "JASTIP ERP", alamat, telepon, email
  - **No. PO** + **tanggal otomatis** (format `id-ID`)
  - **Data supplier**: nama, alamat, kontak, ETA
  - **Tabel item**: No, SKU, Nama Barang, Qty, Harga Satuan, Subtotal (dari `row.items`)
  - **Ringkasan keuangan**: Subtotal, PPN, Freight, TOTAL
  - **Status PO** + syarat ketentuan
  - **Kolom tanda tangan**: Dibuat Oleh, Menyetujui, Supplier
  - Print via `window.print()` + CSS print-friendly
- [x] **`js/superadmin-data.js` (EDIT)** — Modul `purchase-orders`:
  - `hasPrint: true` → tombol **🖨️ (cetak)** muncul di kolom Aksi
  - Rows PO dilengkapi data: `contact`, `supplierAddress`, `createdBy`, `approvedBy`, `items[]` (sku, nama, qty, harga)
- [x] **Tombol cetak** — Di tabel modul `purchase-orders.html`, tombol ikon printer `fa-print` tersedia untuk **setiap baris PO**

### L.5 Rencana Perbaikan Selanjutnya (Roadmap)

| Prioritas | Fitur | File |
|---|---|---|
| 🟠 Sedang | Halaman **Manajemen Pesanan Superadmin** (semua pesanan semua hub + filter sumber Belanja/Paket Member + aksi status) | `dashboard/superadmin/orders.html` (baru) + modul `orders` di `superadmin-data.js` |
| 🟠 Sedang | **Detail pesanan + aksi** di `hub/orders.html` & `hub/hub-orders.html` | Modal detail + tombol Konfirmasi/Proses/Kirim/Selesai/Batalkan |
| 🟠 Sedang | **Cetak Surat Jalan** di `hub/deliveries.html` | Template print via `window.print()` |
| 🟡 Rendah | **Export CSV/Excel** berfungsi (bukan demo "menyusul") | Ganti `showToast('Export menyusul (Demo)')` di semua halaman hub |

---

*Update v2.2 (17 Agustus 2026): Menambahkan Section L — Gap Dashboard Admin & Rencana Perbaikan. Implementasi utama: **grup menu Pengadaan** di sidebar superadmin + **cetak surat pesanan otomatis** (PO).*

---

*Update v2.3 (22 Agustus 2026): Menambahkan **menu Pengiriman** di dashboard superadmin — `dashboard/superadmin/deliveries.html` + modul data `deliveries` + badge status baru.*
