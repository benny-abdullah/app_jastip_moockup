# 📋 REVIEW SISTEM JASTIP ERP RETAIL & TITIP-BELI
**Versi:** 2.0 — Persiapan Migrasi ke Laravel Production
**Tanggal Review:** 14 Agustus 2026

---

## 📑 DAFTAR ISI
1. [Overview Sistem](#1-overview-sistem)
2. [Arsitektur & Teknologi](#2-arsitektur--teknologi)
3. [Struktur Role & Halaman](#3-struktur-role--halaman)
4. [Skema Database Lengkap (Laravel Migrations)](#4-skema-database-lengkap-laravel-migrations)
5. [Struktur Folder Laravel](#5-struktur-folder-laravel)
6. [Alur Bisnis Lengkap](#6-alur-bisnis-lengkap)
7. [Skema Pengiriman Jastip](#7-skema-pengiriman-jastip)
8. [Implementasi Mockup](#8-implementasi-mockup)
9. [Analisis Manajemen Keuangan](#9-analisis-manajemen-keuangan)
10. [Keamanan Sistem](#10-keamanan-sistem)
11. [Kekurangan & Saran Perbaikan](#11-kekurangan--saran-perbaikan)
12. [Roadmap Migrasi Laravel](#12-roadmap-migrasi-laravel)
13. [Gap Analysis WMS (Warehouse Management System)](#13-gap-analysis-wms-warehouse-management-system)
14. [Order Stok Enterprise (Purchasing & Procurement)](#14-order-stok-enterprise-purchasing--procurement)
15. [Product Management & Integrasi Relasi](#15-product-management--integrasi-relasi)
16. [Email Notification & Transparansi Layanan](#16-email-notification--transparansi-layanan)
17. [Integrasi Modul Keuangan & Loyalty](#17-integrasi-modul-keuangan--loyalty)
18. [Delivery Management & Integrasi](#18-delivery-management--integrasi)
19. [Payment & Subscription Management](#19-payment--subscription-management)

---

## 1. OVERVIEW SISTEM

### 1.1 Deskripsi Bisnis
**Jastip** adalah sistem ERP Retail & Titip-Beli yang menggabungkan:
- **E-commerce** (katalog produk, keranjang, checkout)
- **Sistem Poin** sebagai alat bayar (1 pts = Rp 1)
- **Multi-Hub** (cabang distribusi di berbagai kota)
- **Subscription** (langganan sembako berkala)
- **Reward & Tabungan Poin** (Umroh, Berqurban, Travelling)
- **ERP Back-office** (warehouse, stok, pengiriman, keuangan)

### 1.2 Model Bisnis
```
                  ┌─────────────────────────────────────────┐
                  │           SUPERADMIN (PUSAT)            │
                  │  - Kelola Produk, Hub, Keuangan, RAB    │
                  └──────────────┬──────────────────────────┘
                                 │ 67/33 Split Fee
                  ┌──────────────▼──────────────────────────┐
                  │              HUB (CABANG)               │
                  │  - Kelola Stok & Pengiriman Lokal       │
                  │  - Sebagai Customer Juga                │
                  └──────────────┬──────────────────────────┘
                                 │
                  ┌──────────────▼──────────────────────────┐
                  │              CUSTOMER                   │
                  │  - Belanja, Top-up Poin, Subscription   │
                  │  - Rewards, Tabungan Poin               │
                  └─────────────────────────────────────────┘
```

### 1.3 Mata Uang & Multi-Payment
| Metode | Deskripsi |
|---|---|
| **Poin** | 1 poin = Rp 1, bebas top-up via Transfer Bank, E-Wallet, QRIS, VA |
| **Tunai** | Pembayaran langsung di Hub |
| **QRIS/E-Wallet** | Terintegrasi payment gateway (Midtrans/Xendit) |

---

## 2. ARSITEKTUR & TEKNOLOGI

### 2.1 Kondisi Saat Ini (Prototype)
| Komponen | Teknologi |
|---|---|
| Frontend | HTML5 + TailwindCSS (CDN) + FontAwesome 6 |
| JavaScript | Vanilla JS + pagination-filter.js |
| Backend | ❌ TIDAK ADA (static prototype) |
| Database | ❌ TIDAK ADA |
| Auth | ❌ TIDAK ADA |

### 2.2 Arsitektur Target (Laravel Production)
```
┌────────────────────────────────────────────────────────────┐
│                     LARAVEL 11+                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  WEB (Blade + Livewire/Inertia)                      │  │
│  │  - Customer Portal                                   │  │
│  │  - Hub Console                                       │  │
│  │  - Superadmin Console                                │  │
│  │  - Guest/Landing                                     │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  REST API (Sanctum) untuk Mobile App                │  │
│  │  - Auth, Catalog, Orders, Delivery Tracking          │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  SERVICES LAYER:                                      │  │
│  │  PaymentGatewayService (Midtrans/Xendit)             │  │
│  │  PointBalanceService (Liability)                     │  │
│  │  FeeCalculationService (67/33 split)                 │  │
│  │  NotificationService (FCM + Email + WA)              │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  DATABASE: MySQL 8 (InnoDB) + Redis Cache            │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

---

## 3. STRUKTUR ROLE & HALAMAN

### 3.1 Role & Permissions
| Role | Deskripsi | Akses |
|---|---|---|
| **Guest** | Pengunjung belum login | Landing, Katalog, Login, Register |
| **Customer** | Pembeli end-user | Dashboard, Katalog, Checkout, Orders, Points, Rewards, Subscription |
| **Hub Owner** | Pemilik cabang | Dashboard Hub, Warehousing, Deliveries, Customers, Fee Report |
| **Superadmin** | Admin Pusat | Semua modul + Keuangan + Master Data |

### 3.2 Daftar Halaman per Role

**👤 Guest (3 halaman)**
| Halaman | Path | Fungsi |
|---|---|---|
| Landing | `guest/landing.html` | Beranda publik, promo, produk unggulan |
| Login | `guest/login.html` | Form autentikasi |
| Register | `guest/register.html` | Pendaftaran akun baru |

**👤 Customer (10 halaman)**
| Halaman | Path | Fungsi |
|---|---|---|
| Dashboard | `customer/dashboard.html` | Ringkasan poin, pesanan, subscription |
| Katalog | `customer/catalog.html` | Grid produk + search + filter kategori |
| Detail Produk | `customer/product-detail.html` | Detail produk + qty + add to cart |
| Keranjang & Checkout | `customer/cart-checkout.html` | Cart, alamat, ringkasan, bayar pake poin |
| Riwayat Pesanan | `customer/orders.html` | List order + status + pagination |
| Points & Top Up | `customer/points-topup.html` | Saldo, top-up, tabungan poin |
| Rewards | `customer/rewards.html` | Klaim reward (sembako, voucher) |
| Profil & Tier | `customer/profile-tier.html` | Profil, tier membership, benefits |
| Subscription | `customer/subscription.html` | Paket langganan, kelola subscription |
| Komplain | `customer/complaints.html` | Submit/aduan, riwayat pengaduan |

**🏪 Hub (13 halaman)**
| Halaman | Path | Fungsi |
|---|---|---|
| Dashboard | `hub/dashboard.html` | Statistik hub, aktivitas |
| Warehousing | `hub/warehousing.html` | Stok produk hub + CRUD |
| Order Stok | `hub/stock-order.html` | Order stok dari pusat |
| Pengiriman | `hub/deliveries.html` | List delivery + assign kurir |
| Tambah Pengiriman | `hub/deliveries-create.html` | Form buat delivery |
| Edit Pengiriman | `hub/deliveries-edit.html` | Edit delivery |
| Customers | `hub/customers.html` | List customer + peta lokasi |
| Laporan Fee | `hub/fee-report.html` | Fee hub 15% - report |

**🏪 Hub Sebagai Customer (Group Sidebar — 16 Agustus 2026)**
| Halaman | Path | Fungsi |
|---|---|---|
| Belanja & Poin | `hub/hub-customer.html` | Saldo poin hub + top-up + riwayat transaksi |
| Katalog | `hub/hub-catalog.html` | Grid produk + search + filter + sort + pagination |
| Detail Produk | `hub/hub-product-detail.html` | Detail produk + qty + add to cart |
| Keranjang | `hub/hub-cart.html` | Keranjang belanja hub (qty control, hapus, subtotal) |
| Checkout | `hub/hub-checkout.html` | Alamat → metode bayar → ringkasan → buat pesanan |
| Riwayat Pesanan | `hub/hub-orders.html` | Semua order hub (belanja + paket member) + filter |
| Lacak Paket | `hub/hub-order-tracking.html` | Timeline 7 status pengiriman |
| Rewards | `hub/hub-rewards.html` | Klaim reward hub |
| Subscription | `hub/hub-subscriptions.html` | Langganan sembako berkala hub |
| Komplain | `hub/hub-complaints.html` | Form aduan + riwayat + chat CS |
| Profil & Tier | `hub/hub-profile-tier.html` | Profil + tier membership + benefit |
| Wishlist | `hub/hub-wishlists.html` | Produk tersimpan hub |
| Review | `hub/hub-product-reviews.html` | Rating + ulasan produk |
| Referral | `hub/hub-referrals.html` | Program referral hub |

**🏪 Penyederhanaan Portal Hub (16 Agustus 2026 — Peran Hub = Penyalur)**
> **Konsep:** Hub TIDAK melakukan Picking/Packing/POS. Hub hanya menerima barang dari pusat, melaporkan Diterima/Dikembalikan, dan menyalurkan ke customer. Produk subscription & checkout customer dikirim langsung dari pusat ke customer (tidak lewat hub). Hub sebagai customer checkout → barang langsung diterima/dikembalikan setelah dikirim.

| Perubahan | Detail |
|---|---|
| **Hapus group Proses WMS** | Picking, Packing — hub tidak memproses |
| **Hapus group POS (Kasir)** | Hub bukan kasir |
| **Sederhanakan Warehouse & Stok** | Hanya 3 menu: Stok Hub, Order Stok, Penerimaan Barang |
| **Sederhanakan Delivery & Kurir** | Hanya 2 menu: Delivery Masuk, Penerimaan / Retur |
| **Hapus 11 halaman** | `picking.html`, `packing.html`, `pos.html`, `couriers.html`, `delivery-zones.html`, `delivery-routes.html`, `delivery-attempts.html`, `delivery-proofs.html`, `delivery-schedules.html`, `warehouse-locations.html`, `stock-opname.html` |
| **`hub/receiving.html` (BARU)** | Penerimaan Barang: list barang masuk dari pusat + tombol Terima/Kembalikan + statistik |
| **`hub/warehousing.html` (EDIT)** | Stok read-only dari pusat (hapus Tambah Stok & modal edit) |
| **`hub/stock-order.html` (EDIT)** | Tambah kolom Laporan: tombol Terima/Kembalikan |
| **`hub/deliveries.html` (EDIT)** | Hapus assign kurir & buat delivery; fokus list delivery dari pusat + Terima/Kembalikan |
| **`hub/delivery-returns.html` (EDIT)** | Fokus laporan barang diterima/dikembalikan ke pusat |
| **`dashboard/hub.html` (EDIT)** | Hapus quick action Picking, Packing, POS; ganti dengan Penerimaan Barang & Retur |

**🏪 Detail Barang & Jumlah di Halaman Warehouse (16 Agustus 2026)**
> **Tujuan:** Semua halaman warehouse menampilkan **nama barang + jumlah lengkap** agar hub mudah memverifikasi penerimaan.

| Perubahan | Detail |
|---|---|
| **`hub/warehousing.html` (EDIT)** | Tambah modal **"Buat Order Stok"** (dipindah dari stock-order.html): pilih produk, jumlah, catatan, tombol Kirim Order. Tombol Order Stok di header & alert stok menipis → buka modal |
| **`hub/stock-order.html` (EDIT)** | Hapus modal Buat Order Stok & tombol Order Baru (kini di warehousing). Tabel **Riwayat Pengiriman** menampilkan **detail barang + jumlah** per order (contoh: Beras Premium 5kg x30, Minyak Goreng 2L x24). Modal laporan menampilkan **tabel detail barang + jumlah** |
| **`hub/receiving.html` (EDIT)** | Tabel penerimaan menampilkan **detail barang + jumlah** per referensi. Modal laporan menampilkan **tabel detail barang + jumlah** |
| **`hub/deliveries.html` (EDIT)** | Tabel delivery menampilkan **detail barang + jumlah** per order. Modal laporan menampilkan **tabel detail barang + jumlah** |

**🏪 Form Retur Barang Hub (16 Agustus 2026 — Skema Retur Lengkap)**
> **Tujuan:** Menambahkan form retur lengkap di menu **Penerimaan / Retur** agar hub dapat mengajukan retur barang per-item dengan alasan, catatan, dan bukti foto. Mengikuti skema tabel `delivery_returns` (Section 18) dengan 6 status: `requested → approved → picked_up → returned → refunded / rejected`.

| Perubahan | Detail |
|---|---|
| **`js/return-data.js` (BARU)** | Satu sumber data retur hub. Struktur mengikuti skema `delivery_returns`: `id`, `ref`, `jenis`, `status`, `tanggal`, `alasan`, `catatan`, `items[]` (nama, qty_kirim, qty_retur), `bukti`. Simpan ke `localStorage` (`jastip_returns`) + fallback data demo. API: `getAll()`, `getById()`, `add()`, `updateStatus()`, `statusBadge()`, `statusLabel()`, `formatItems()`. Ekspor global `window.JastipReturns` |
| **`hub/delivery-returns.html` (EDIT)** | Halaman Penerimaan / Retur lengkap: tombol **"Buat Retur"**, **modal form retur** (pilih referensi Delivery/Order Stok → centang barang per-item + isi qty retur → alasan → catatan → upload bukti foto), **6 status badge** (Diajukan/Disetujui/Dijemput/Dikembalikan/Refund/Ditolak), tabel riwayat dengan kolom Detail Barang + Alasan + Status + Aksi (Detail), **modal detail retur**, filter 6 status + search + stat cards, dukungan parameter URL `?ref=...&jenis=...` |
| **`hub/deliveries.html` (EDIT)** | Tambah tombol **"Ajukan Retur"** di modal laporan penerimaan → redirect ke `delivery-returns.html?ref=DEL-xxx&jenis=Delivery` |
| **`hub/receiving.html` (EDIT)** | Tambah tombol **"Ajukan Retur"** di modal laporan penerimaan → redirect ke `delivery-returns.html?ref=SO-xxx&jenis=Order Stok` |

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

**🛡️ Superadmin (35+ halaman)**
| Modul | Halaman |
|---|---|
| **Dashboard** | Utama, Warehouse Internal, Warehouse External, Sales, RAB, Points Balance, Fee, Accounting |
| **Master Data** | Membership & Tier, Points, Reward, Produk (kategori/produk), Promo/Event, Hub, Customer, User & Role |
| **Operasional** | Payment, Subscription, Complaints (CRUD semua) |
| **Keuangan** | Fee per Hub, Accounting, RAB, Points Liability |

---

## 4. SKEMA DATABASE LENGKAP (LARAVEL MIGRATIONS)

> **Urutan pembuatan tabel mengikuti dependency (foreign key).**

### 4.1 Tabel Auth & RBAC
```php
// 1. users (Laravel default + custom)
Schema::create('users', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('email')->unique();
    $table->string('phone', 20)->nullable()->unique();
    $table->timestamp('email_verified_at')->nullable();
    $table->timestamp('phone_verified_at')->nullable();
    $table->string('password');
    $table->string('avatar')->nullable();
    $table->boolean('is_active')->default(true);
    $table->boolean('is_verified')->default(false);
    $table->rememberToken();
    $table->timestamps();
    $table->softDeletes();
});

// 2. roles (spatie/laravel-permission)
// 3. permissions
// 4. model_has_roles, model_has_permissions, role_has_permissions
```

### 4.2 Tabel Master Data
```php
// 5. hubs
Schema::create('hubs', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
    $table->string('name');
    $table->string('slug')->unique();
    $table->string('address');
    $table->string('city');
    $table->decimal('latitude', 10, 7);
    $table->decimal('longitude', 10, 7);
    $table->decimal('service_radius_km', 5, 2)->default(10);
    $table->enum('status', ['active', 'inactive', 'pending'])->default('pending');
    $table->timestamps();
});

// 6. categories
Schema::create('categories', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('slug')->unique();
    $table->string('icon')->nullable();
    $table->integer('sort_order')->default(0);
    $table->boolean('is_active')->default(true);
    $table->timestamps();
});

// 7. products
Schema::create('products', function (Blueprint $table) {
    $table->id();
    $table->foreignId('category_id')->constrained()->cascadeOnDelete();
    $table->string('name');
    $table->string('sku')->unique();
    $table->text('description')->nullable();
    $table->decimal('base_price', 15, 2);
    $table->bigInteger('point_price');
    $table->string('image')->nullable();
    $table->integer('weight_grams')->nullable();
    $table->enum('unit', ['pcs', 'kg', 'liter', 'pack', 'box']);
    $table->boolean('is_active')->default(true);
    $table->boolean('is_available_for_subscription')->default(false);
    $table->timestamps();
});

// 8. product_variants
Schema::create('product_variants', function ($table) {
    $table->id();
    $table->foreignId('product_id')->constrained()->cascadeOnDelete();
    $table->string('name');
    $table->string('sku')->unique();
    $table->decimal('additional_price', 15, 2)->default(0);
    $table->bigInteger('additional_points')->default(0);
    $table->timestamps();
});

// 9. hub_product (pivot)
Schema::create('hub_product', function ($table) {
    $table->id();
    $table->foreignId('hub_id')->constrained()->cascadeOnDelete();
    $table->foreignId('product_id')->constrained()->cascadeOnDelete();
    $table->foreignId('product_variant_id')->nullable()->constrained()->cascadeOnDelete();
    $table->integer('stock_qty')->default(0);
    $table->integer('safety_stock')->default(10);
    $table->decimal('markup_price', 15, 2)->default(0);
    $table->timestamps();
    $table->unique(['hub_id', 'product_id', 'product_variant_id']);
});

// 10. rewards
Schema::create('rewards', function ($table) {
    $table->id();
    $table->string('name');
    $table->string('type');
    $table->text('description')->nullable();
    $table->bigInteger('point_cost');
    $table->integer('stock_qty')->default(0);
    $table->string('image')->nullable();
    $table->date('valid_until')->nullable();
    $table->boolean('is_active')->default(true);
    $table->timestamps();
});

// 11. membership_tiers
Schema::create('membership_tiers', function ($table) {
    $table->id();
    $table->string('name');
    $table->integer('min_spend');
    $table->integer('min_points');
    $table->decimal('discount_percent', 5, 2)->default(0);
    $table->decimal('cashback_percent', 5, 2)->default(0);
    $table->integer('free_shipping_monthly')->default(0);
    $table->boolean('is_active')->default(true);
    $table->timestamps();
});
```

### 4.3 Tabel Customer & Alamat
```php
// 12. customer_profiles
Schema::create('customer_profiles', function ($table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->cascadeOnDelete();
    $table->foreignId('membership_tier_id')->nullable()->constrained();
    $table->string('customer_code')->unique();
    $table->foreignId('hub_id')->nullable()->constrained();
    $table->string('nik', 20)->nullable();
    $table->string('identity_file')->nullable();
    $table->date('join_date');
    $table->decimal('total_spend', 15, 2)->default(0);
    $table->timestamps();
});

// 13. addresses
Schema::create('addresses', function ($table) {
    $table->id();
    $table->foreignId('customer_profile_id')->constrained()->cascadeOnDelete();
    $table->string('label', 50);
    $table->string('recipient_name');
    $table->string('recipient_phone', 20);
    $table->text('full_address');
    $table->string('province');
    $table->string('city');
    $table->string('district');
    $table->string('postal_code', 10);
    $table->decimal('latitude', 10, 7)->nullable();
    $table->decimal('longitude', 10, 7)->nullable();
    $table->boolean('is_default')->default(false);
    $table->timestamps();
});
```

### 4.3.1 Penugasan Customer ke Hub Berdasarkan Radius (10 km)

Setiap hub memiliki **radius layanan** (`hubs.service_radius_km`, default **10 km**). Customer otomatis ditugaskan ke hub berdasarkan jarak geografis dari alamat utamanya.

**Alur Penugasan Otomatis:**
```
CUSTOMER DAFTAR / TAMBAH ALAMAT
        │
        ▼
SISTEM HITUNG JARAK (Haversine)
  antara koordinat alamat customer (addresses.latitude/longitude)
  dengan koordinat setiap hub (hubs.latitude/longitude)
        │
        ▼
JARAK ≤ service_radius_km (10 km)?
  ├─ YA → customer_profiles.hub_id = hub tersebut
  └─ TIDAK → cari hub terdekat berikutnya
        │
        ▼
TIDAK ADA HUB DALAM RADIUS?
  └─ → customer_profiles.hub_id = hub terdekat (fallback)
       + notifikasi "di luar jangkauan, dilayani hub terdekat"
```

**Rumus Jarak (Haversine):**
```php
// Jarak antara 2 koordinat (km)
function haversine($lat1, $lng1, $lat2, $lng2) {
    $earthRadius = 6371; // km
    $dLat = deg2rad($lat2 - $lat1);
    $dLng = deg2rad($lng2 - $lng1);
    $a = sin($dLat/2) * sin($dLat/2) +
         cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
         sin($dLng/2) * sin($dLng/2);
    $c = 2 * atan2(sqrt($a), sqrt(1-$a));
    return $earthRadius * $c;
}
```

**Kebijakan:**
| Kondisi | Aksi |
|---|---|
| Customer dalam radius ≤ 10 km | Ditugaskan ke hub tersebut |
| Customer di luar radius semua hub | Ditugaskan ke hub terdekat + notifikasi |
| Customer pindah alamat | Hitung ulang otomatis → pindah hub jika perlu |
| Hub nonaktif | Customer dialihkan ke hub terdekat aktif |

**Tabel pendukung:**
| Tabel | Field | Fungsi |
|---|---|---|
| `hubs` | `latitude`, `longitude`, `service_radius_km` | Titik pusat & radius hub |
| `addresses` | `latitude`, `longitude` | Koordinat alamat customer |
| `customer_profiles` | `hub_id` | Hub penugasan customer |

### 4.4 Tabel Points (Wallet & Transaksi)
```php
// 14. point_wallets
Schema::create('point_wallets', function ($table) {
    $table->id();
    $table->foreignId('customer_profile_id')->constrained()->cascadeOnDelete();
    $table->bigInteger('balance')->default(0);
    $table->bigInteger('pending_balance')->default(0);
    $table->bigInteger('lifetime_earned')->default(0);
    $table->bigInteger('lifetime_spent')->default(0);
    $table->timestamps();
});

// 15. point_transactions
Schema::create('point_transactions', function ($table) {
    $table->id();
    $table->string('trx_code')->unique();
    $table->foreignId('point_wallet_id')->constrained()->cascadeOnDelete();
    $table->enum('type', ['topup', 'purchase', 'redeem', 'cashback', 'bonus', 'expired', 'refund', 'adjustment']);
    $table->bigInteger('amount');
    $table->enum('status', ['pending', 'success', 'failed', 'expired']);
    $table->string('description')->nullable();
    $table->morphs('source');
    $table->timestamp('expires_at')->nullable();
    $table->timestamp('processed_at')->nullable();
    $table->string('created_by')->nullable();
    $table->timestamps();
});

// 16. point_savings (tabungan poin)
Schema::create('point_savings', function ($table) {
    $table->id();
    $table->foreignId('customer_profile_id')->constrained()->cascadeOnDelete();
    $table->string('goal_name');
    $table->bigInteger('target_points');
    $table->bigInteger('current_points')->default(0);
    $table->enum('status', ['active', 'completed', 'cancelled']);
    $table->timestamp('target_date')->nullable();
    $table->timestamps();
});
```

### 4.5 Tabel Cart & Order
```php
// 17. carts
Schema::create('carts', function ($table) {
    $table->id();
    $table->foreignId('customer_profile_id')->constrained()->cascadeOnDelete();
    $table->foreignId('hub_id')->constrained();
    $table->timestamps();
});

// 18. cart_items
Schema::create('cart_items', function ($table) {
    $table->id();
    $table->foreignId('cart_id')->constrained()->cascadeOnDelete();
    $table->foreignId('product_id')->constrained();
    $table->foreignId('product_variant_id')->nullable()->constrained();
    $table->integer('qty')->default(1);
    $table->bigInteger('point_price_each');
    $table->bigInteger('subtotal_points');
    $table->timestamps();
});

// 19. orders
Schema::create('orders', function ($table) {
    $table->id();
    $table->string('order_code')->unique();
    $table->foreignId('customer_profile_id')->constrained();
    $table->foreignId('hub_id')->constrained();
    $table->foreignId('address_id')->nullable()->constrained();
    $table->enum('status', [
        'pending', 'paid', 'confirmed', 'processed', 'packed',
        'shipped', 'delivered', 'completed', 'cancelled', 'refunded'
    ])->default('pending');
    $table->bigInteger('subtotal_points');
    $table->bigInteger('discount_points')->default(0);
    $table->bigInteger('shipping_points')->default(0);
    $table->bigInteger('total_points');
    $table->decimal('total_amount', 15, 2)->nullable();
    $table->enum('payment_type', ['points', 'cash', 'qris', 'ewallet', 'va', 'transfer']);
    $table->foreignId('payment_id')->nullable()->constrained();
    $table->string('tracking_code')->nullable();
    $table->text('notes')->nullable();
    $table->timestamp('paid_at')->nullable();
    $table->timestamp('shipped_at')->nullable();
    $table->timestamp('delivered_at')->nullable();
    $table->timestamp('cancelled_at')->nullable();
    $table->string('cancelled_reason')->nullable();
    $table->boolean('is_backorder')->default(false);   // FIX-RELASI: koneksi ke Order Stok / backorders (Section 14.4)
    $table->timestamps();
});

// 20. order_items
Schema::create('order_items', function ($table) {
    $table->id();
    $table->foreignId('order_id')->constrained()->cascadeOnDelete();
    $table->foreignId('product_id')->constrained();
    $table->foreignId('product_variant_id')->nullable()->constrained();
    $table->string('product_name');
    $table->string('sku');
    $table->integer('qty');
    $table->bigInteger('point_price_each');
    $table->bigInteger('subtotal_points');
    $table->timestamps();
});

// 21. order_status_histories
Schema::create('order_status_histories', function ($table) {
    $table->id();
    $table->foreignId('order_id')->constrained()->cascadeOnDelete();
    $table->string('status');
    $table->text('note')->nullable();
    $table->string('location')->nullable();
    $table->string('updated_by');
    $table->timestamp('created_at');
});
```

### 4.6 Tabel Pembayaran
```php
// 22. payment_methods
Schema::create('payment_methods', function ($table) {
    $table->id();
    $table->string('name');
    $table->string('code')->unique();
    $table->string('provider');
    $table->boolean('is_active')->default(true);
    $table->timestamps();
});

// 23. payments
Schema::create('payments', function ($table) {
    $table->id();
    $table->string('payment_code')->unique();
    $table->foreignId('order_id')->nullable()->constrained();
    $table->foreignId('customer_profile_id')->constrained();
    $table->foreignId('payment_method_id')->constrained();
    $table->decimal('amount', 15, 2);
    $table->enum('type', ['topup', 'order', 'subscription', 'reward']);
    $table->enum('status', ['pending', 'success', 'failed', 'cancelled', 'expired'])->default('pending');
    $table->string('external_id')->nullable();
    $table->string('payment_url')->nullable();
    $table->json('gateway_response')->nullable();
    $table->timestamp('paid_at')->nullable();
    $table->timestamps();
});
```

### 4.7 Tabel Subscription
```php
// 24. subscription_plans
Schema::create('subscription_plans', function ($table) {
    $table->id();
    $table->string('name');
    $table->text('description');
    $table->decimal('price', 15, 2);
    $table->bigInteger('bonus_points')->default(0);
    $table->json('items');
    $table->enum('billing_period', ['monthly', 'weekly'])->default('monthly');
    $table->boolean('free_shipping')->default(true);
    $table->boolean('is_active')->default(true);
    $table->timestamps();
});

// 25. subscriptions
Schema::create('subscriptions', function ($table) {
    $table->id();
    $table->foreignId('customer_profile_id')->constrained();
    $table->foreignId('subscription_plan_id')->constrained();
    $table->foreignId('hub_id')->constrained();
    $table->foreignId('address_id')->constrained();
    $table->enum('status', ['active', 'paused', 'cancelled', 'expired']);
    $table->date('start_date');
    $table->date('next_delivery_date');
    $table->date('last_billing_date')->nullable();
    $table->timestamps();
});

// 26. subscription_cycles
Schema::create('subscription_cycles', function ($table) {
    $table->id();
    $table->foreignId('subscription_id')->constrained()->cascadeOnDelete();
    $table->date('delivery_date');
    $table->enum('status', ['scheduled', 'paid', 'shipped', 'delivered', 'failed', 'skipped']);
    $table->foreignId('order_id')->nullable()->constrained();
    $table->timestamps();
});
```

### 4.8 Tabel Pengiriman (Deliveries) - Sederhana
```php
// 27. couriers
Schema::create('couriers', function ($table) {
    $table->id();
    $table->foreignId('hub_id')->constrained()->cascadeOnDelete();
    $table->string('name');
    $table->string('phone', 20);
    $table->string('vehicle')->nullable();
    $table->enum('status', ['available', 'on_duty', 'off'])->default('available');
    $table->timestamps();
});

// 28. deliveries
Schema::create('deliveries', function ($table) {
    $table->id();
    $table->string('delivery_code')->unique();
    $table->foreignId('order_id')->constrained()->cascadeOnDelete();
    $table->foreignId('hub_id')->constrained();
    $table->foreignId('courier_id')->nullable()->constrained();
    $table->foreignId('address_id')->constrained();
    // Status sederhana:
    $table->enum('status', [
        'pending',        // menunggu kurir
        'in_transit',     // dalam perjalanan
        'delivered',      // diterima
        'failed',         // gagal
        'cancelled'       // dibatalkan
    ])->default('pending');
    $table->string('tracking_code')->nullable();
    $table->text('delivery_note')->nullable();
    $table->timestamp('picked_up_at')->nullable();
    $table->timestamp('delivered_at')->nullable();
    $table->timestamps();
});

// 29. delivery_tracking (minimal untuk info customer)
Schema::create('delivery_tracking', function ($table) {
    $table->id();
    $table->foreignId('delivery_id')->constrained()->cascadeOnDelete();
    $table->string('status');
    $table->text('description');
    $table->string('location')->nullable();
    $table->timestamp('created_at');
});
```

### 4.9 Tabel Warehouse & Stok
```php
// 30. warehouses
Schema::create('warehouses', function ($table) {
    $table->id();
    $table->enum('type', ['internal', 'external']);
    $table->string('name');
    $table->string('address')->nullable();
    $table->string('city')->nullable();
    $table->timestamps();
});

// 31. stock_movements
Schema::create('stock_movements', function ($table) {
    $table->id();
    $table->foreignId('warehouse_id')->nullable()->constrained();
    $table->foreignId('hub_id')->nullable()->constrained();
    $table->foreignId('product_id')->constrained();
    $table->foreignId('product_variant_id')->nullable()->constrained();
    $table->enum('type', ['in', 'out', 'adjustment', 'transfer', 'damaged', 'expired']);
    $table->integer('qty');
    $table->integer('stock_before');
    $table->integer('stock_after');
    $table->text('note')->nullable();
    $table->morphs('reference');
    $table->string('created_by');
    $table->timestamps();
});

// 32. stock_orders
Schema::create('stock_orders', function ($table) {
    $table->id();
    $table->string('stock_order_code')->unique();
    $table->foreignId('hub_id')->constrained();
    $table->foreignId('warehouse_id')->constrained();
    $table->enum('status', ['pending', 'approved', 'processing', 'shipped', 'received', 'cancelled']);
    $table->timestamp('requested_at');
    $table->timestamp('received_at')->nullable();
    $table->timestamps();
});

// 33. stock_order_items
Schema::create('stock_order_items', function ($table) {
    $table->id();
    $table->foreignId('stock_order_id')->constrained()->cascadeOnDelete();
    $table->foreignId('product_id')->constrained();
    $table->foreignId('product_variant_id')->nullable()->constrained();
    $table->integer('qty_requested');
    $table->integer('qty_shipped')->default(0);
    $table->timestamps();
});
```

### 4.10 Tabel Komplain & Notifikasi
```php
// 34. complaints
Schema::create('complaints', function ($table) {
    $table->id();
    $table->string('complaint_code')->unique();
    $table->foreignId('customer_profile_id')->constrained();
    $table->foreignId('order_id')->nullable()->constrained();
    $table->foreignId('hub_id')->nullable()->constrained();   // FIX: notifikasi komplain ke hub (Section 16.3 #7)
    $table->enum('category', ['product', 'delivery', 'payment', 'points', 'service', 'other']);
    $table->enum('priority', ['low', 'medium', 'high', 'urgent'])->default('medium');
    $table->text('subject');
    $table->text('description');
    $table->enum('status', ['open', 'in_progress', 'resolved', 'closed'])->default('open');
    $table->foreignId('assigned_to')->nullable()->constrained('users');
    $table->timestamp('resolved_at')->nullable();
    $table->timestamps();
});

// 35. complaint_messages
Schema::create('complaint_messages', function ($table) {
    $table->id();
    $table->foreignId('complaint_id')->constrained()->cascadeOnDelete();
    $table->foreignId('user_id')->constrained();
    $table->text('message');
    $table->string('attachment')->nullable();
    $table->boolean('is_read')->default(false);   // FIX: badge unread utk CS
    $table->timestamp('read_at')->nullable();
    $table->timestamps();
});

// 36. notifications
Schema::create('notifications', function ($table) {
    $table->uuid('id')->primary();
    $table->foreignId('user_id')->constrained()->cascadeOnDelete();
    $table->string('type');
    $table->string('title');
    $table->text('body');
    $table->json('data')->nullable();
    $table->timestamp('read_at')->nullable();
    $table->timestamps();
});
```

### 4.11 Tabel Keuangan & Fee
```php
// 37. fee_configs
Schema::create('fee_configs', function ($table) {
    $table->id();
    $table->string('name');
    $table->enum('type', ['hub_percentage', 'central_percentage']);
    $table->decimal('percentage', 5, 2);
    $table->date('effective_date');
    $table->boolean('is_active')->default(true);
    $table->timestamps();
});

// 38. fee_calculations
Schema::create('fee_calculations', function ($table) {
    $table->id();
    $table->foreignId('order_id')->constrained();
    $table->foreignId('hub_id')->constrained();
    $table->decimal('order_amount', 15, 2);
    $table->decimal('hub_fee', 15, 2);
    $table->decimal('central_fee', 15, 2);
    $table->enum('status', ['calculated', 'approved', 'paid', 'pending']);
    $table->timestamps();
});

// 39. accounts (COA)
Schema::create('accounts', function ($table) {
    $table->id();
    $table->string('code', 20)->unique();
    $table->string('name');
    $table->enum('type', ['aset', 'liabilitas', 'ekuitas', 'pendapatan', 'beban']);
    $table->enum('normal_balance', ['debit', 'kredit']);
    $table->string('parent_code', 20)->nullable();
    $table->boolean('is_active')->default(true);
    $table->timestamps();
});

// 40. journal_entries
Schema::create('journal_entries', function ($table) {
    $table->id();
    $table->string('journal_no')->unique();
    $table->date('transaction_date');
    $table->string('description');
    $table->morphs('transactable');
    $table->string('created_by');
    $table->timestamps();
});

// 41. journal_entry_lines
Schema::create('journal_entry_lines', function ($table) {
    $table->id();
    $table->foreignId('journal_entry_id')->constrained()->cascadeOnDelete();
    $table->foreignId('account_id')->constrained();
    $table->enum('type', ['debit', 'kredit']);
    $table->decimal('amount', 15, 2);
    $table->text('note')->nullable();
    $table->timestamps();
});

// 42. rabs
Schema::create('rabs', function ($table) {
    $table->id();
    $table->string('rab_code')->unique();
    $table->string('title');
    $table->year('year');
    $table->enum('status', ['draft', 'submitted', 'approved', 'rejected']);
    $table->decimal('total_budget', 15, 2)->default(0);
    $table->decimal('total_actual', 15, 2)->default(0);
    $table->timestamps();
});

// 43. rab_items
Schema::create('rab_items', function ($table) {
    $table->id();
    $table->foreignId('rab_id')->constrained()->cascadeOnDelete();
    $table->foreignId('account_id')->constrained();
    $table->string('description');
    $table->decimal('budget_amount', 15, 2);
    $table->decimal('actual_amount', 15, 2)->default(0);
    $table->timestamps();
});
```

### 4.12 Tabel Promo & Audit
```php
// 44. promos
Schema::create('promos', function ($table) {
    $table->id();
    $table->string('name');
    $table->string('code')->unique();
    $table->enum('type', ['discount', 'points_multiplier', 'cashback', 'bonus']);
    $table->decimal('value', 10, 2);
    $table->date('start_date');
    $table->date('end_date');
    $table->integer('max_usage')->nullable();
    $table->integer('used_count')->default(0);
    $table->boolean('is_active')->default(true);
    $table->timestamps();
});

// 45. promo_usages
Schema::create('promo_usages', function ($table) {
    $table->id();
    $table->foreignId('promo_id')->constrained()->cascadeOnDelete();
    $table->foreignId('user_id')->constrained();
    $table->foreignId('order_id')->nullable()->constrained();
    $table->timestamp('used_at');
});

// 46. audit_logs
Schema::create('audit_logs', function ($table) {
    $table->id();
    $table->foreignId('user_id')->nullable()->constrained();
    $table->string('event');
    $table->morphs('auditable');
    $table->json('old_values')->nullable();
    $table->json('new_values')->nullable();
    $table->string('ip_address', 45)->nullable();
    $table->string('user_agent')->nullable();
    $table->timestamps();
});

// ⚠️⚠️ FIX-RELASI EKSTERNAL (migration terpisah — tabel referensi dibuat SETELAH tabel ini):
// 1) payments.subscription_cycle_id  → referensi subscription_cycles (#26). Tambahkan di migration terpisah:
//    Schema::table('payments', fn($t) => $t->foreignId('subscription_cycle_id')->nullable()->after('order_id')->constrained('subscription_cycles'));
// 2) point_transactions.complaint_id → referensi complaints (#34). Tambahkan di migration terpisah:
//    Schema::table('point_transactions', fn($t) => $t->foreignId('complaint_id')->nullable()->after('source_id')->constrained('complaints'));
// 3) deliveries.packing_order_id     → referensi packing_orders (#61). Tambahkan di migration terpisah:
//    Schema::table('deliveries', fn($t) => $t->foreignId('packing_order_id')->nullable()->after('order_id')->constrained('packing_orders'));
```

---

## 5. STRUKTUR FOLDER LARAVEL

```
laravel-jastip/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Api/
│   │   │   ├── Customer/
│   │   │   ├── Hub/
│   │   │   └── Admin/
│   │   ├── Middleware/
│   │   └── Requests/
│   ├── Models/
│   ├── Services/
│   ├── Repositories/
│   ├── Policies/
│   └── Console/Commands/
├── database/
│   ├── migrations/
│   └── seeders/
├── resources/views/
│   ├── layouts/
│   ├── guest/
│   ├── customer/
│   ├── hub/
│   └── superadmin/
├── routes/
│   ├── web.php
│   ├── api.php
│   └── admin.php
└── composer.json
```

---

## 6. ALUR BISNIS LENGKAP

### 6.1 Alur Order & Checkout
```
┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
│ BROWSE   │ → │  CART    │ → │ CHECKOUT │ → │ PAYMENT  │
│ Katalog  │   │ (pilih   │   │ (alamat  │   │ (poin)   │
│ + Detail │   │ qty)     │   │ + summary│   │          │
└──────────┘   └──────────┘   └──────────┘   └────┬─────┘
                                                   ▼
┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
│ DELIVERED│ ← │ SHIPPED  │ ← │ PACKED   │ ← │ CONFIRMED│
│          │   │          │   │ di hub   │   │          │
└──────────┘   └──────────┘   └──────────┘   └──────────┘
```

### 6.2 Alur Top-Up Poin
```
Customer pilih nominal (50K/100K/250K)
        │
        ▼
Pilih metode pembayaran
        │
        ▼
Payment sukses → wallet.balance += amount
        │
        ▼
Jurnal: Kas (Debit) / Liabilitas Poin (Kredit)
```

### 6.3 Alur Subscription
```
Customer pilih paket → subscription (auto-renew)
        │
        ▼
Cron Job otomatis:
        ├─ Cek saldo poin cukup?
        │    ├─ YA → auto-order + payment
        │    └─ TIDAK → notifikasi customer
        ▼
Hub proses → delivery → selesai
```

### 6.4 Alur Fee Split (67/33)
```
Order selesai → Rp 100.000
               │
      ┌────────┴────────┐
      ▼                 ▼
Fee Hub 67%        Fee Pusat 33%
= Rp 67.000        = Rp 33.000
```

---

## 7. SKEMA PENGIRIMAN JASTIP (VERSI SEDERHANA & INFORMATIF)

### 7.1 Alur Pengiriman

Sistem Jastip menggunakan model **langganan** dengan **pembayaran poin**. Berikut alur pengiriman sederhana:

```
┌─────────────────┐
│  WAREHOUSE      │  Pusat mempersiapkan paket
│  PUSAT          │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  HUB            │  Cabang menerima & distribusikan
│  (cabang)       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  CUSTOMER       │  Customer menerima paket
└─────────────────┘
```

**Alur Lengkap:**
1. Customer melakukan **checkout** (poin dibayar)
2. Order masuk ke **Warehouse Pusat** → dipersiapkan & dikemas
3. Paket dikirim dari **Pusat ke Hub** kota terdekat
4. Kurir ditugaskan untuk mengantar ke alamat customer
5. Customer **menerima** paket dan status selesai

### 7.2 Status Pengiriman (7 Tahap Sederhana)

| # | Status | Keterangan |
|---|---|---|
| 1 | **Pesanan Dibuat** | Customer selesai checkout |
| 2 | **Pembayaran Diterima** | Poin sudah di terima |
| 3 | **Diproses dari Pusat** | Warehouse mempersiapkan |
| 4 | **Dalam Perjalanan ke Hub** | Paket menuju Hub |
| 5 | **Telah di Hub** | Paket sampai di Hub |
| 6 | **Dikirim ke Alamat** | Kurir anter |
| 7 | **Diterima ✅** | Selesai |

### 7.3 Biaya Pengiriman

> **Biaya pengiriman TIDAK dihitung terpisah.**  
> Semua biaya termasuk fee/ongkir **sudah termasuk** dalam harga produk yang ditetapkan melalui **RAB**.

### 7.4 Timeline Tracking untuk Customer

```
┌────────────────────────────────────────────┐
│  🚚 TRACKING — #ORD-2026-0812              │
│                                            │
│  STATUS: ✅ DITERIMA — 14 Agu 2026        │
│                                            │
│  ●━━━━━━━━━━━━━━━━━━━━━━━━━━━━●            │
│                                            │
│  ✅ 12 Agu — Pesanan dibuat               │
│  ✅ 12 Agu — Pembayaran poin diterima     │
│  ✅ 13 Agu — Diproses dari Pusat          │
│  ✅ 14 Agu — Dalam perjalanan ke Hub      │
│  ✅ 14 Agu — Telah di Hub Jakarta Selatan │
│  ✅ 14 Agu — Dikirim ke alamat Anda       │
│  ✅ 14 Agu — 🎉 Diterima ✓                │
├────────────────────────────────────────────┤
│  📍 Jl. Melati No. 12                      │
│  📦 Langganan: Sembako Bulanan            │
│     4 produk · Bayar: 114.000 pts          │
└────────────────────────────────────────────┘
```

Informasi sengaja dibuat **sederhana** agar customer bisa langsung memahami posisi pesanan.

---

## 8. IMPLEMENTASI MOCKUP

Berdasarkan Skema 7, hanya **1 halaman baru** yang perlu dibuat:

📄 **`pages/customer/order-tracking.html`**

### Mockup Halaman Tracking

```
┌─────────────────────────────────────────────────────┐
│ ← Kembali ke Pesanan                    Tracking    │
├─────────────────────────────────────────────────────┤
│  🚚 #ORD-2026-0812                                  │
│  ─────────────────────────────────────              │
│  [ ✅ DITERIMA ]  14 Agu 2026 14:30 WIB            │
│                                                     │
│  ●━━━━━━━━━━━━━━━━━━━━━━━━━━━━●                     │
│                                                     │
│  ✅  12 Agu — Pesanan dibuat                       │
│  ✅  12 Agu — Pembayaran poin diterima              │
│  ✅  13 Agu — Diproses dari Warehouse Pusat         │
│  ✅  14 Agu — Dalam perjalanan ke Hub               │
│  ✅  14 Agu — Telah di Hub Jakarta Selatan          │
│  ✅  14 Agu — Dikirim ke alamat Anda               │
│  ✅  14 Agu — ✓ Diterima                            │
│                                                     │
│  ─────────────────────────────────────────          │
│  │ Detail:                                        │ │
│  │ Subscription: Sembako Bulanan                  │ │
│  │ Barang: 4 produk · Rp 114.000 pts               │ │
│  │ Alamat: Jl. Melati No. 12                      │ │
│  │ Kurir: Rudi                                    │ │
│  └──────────────────────────────────────          │
│                                                     │
│  [Kembali ke Pesanan]                               │
└─────────────────────────────────────────────────────┘
```

### Kondisi Saat Ini

| Halaman | Status | Tindakan |
|---|---|---|
| `customer/order-tracking.html` | ❌ Belum ada | Buat halaman baru |
| `customer/orders.html` | ✅ Sudah ada | Link "Lacak" → arahkan ke tracking |
| `hub/deliveries.html` | ✅ Sudah ada | Status sederhana: Menunggu / Dikirim / Selesai |
| `hub/deliveries-create.html` | ✅ Sudah ada | Input kurir manual (sederhana) |

---

## 9. ANALISIS MANAJEMEN KEUANGAN

### 9.1 Aliran Pendapatan (Revenue Streams)
| Sumber | Deskripsi | Persentase |
|---|---|---|
| Penjualan Produk | Margin dari harga produk | ~60% |
| Fee Hub/Pusat | Split 67/33 dari transaksi | ~15% |
| Top-Up Poin | Dana float dari poin yang belum dipakai | ~10% |
| Subscription | Langganan bulk (auto renewal) | ~8% |
| Reward/Promo | Sponsorship merchant | ~5% |
| Lainnya | Delivery fee, administrasi | ~2% |

### 9.2 Beban Operasional
| Kategori | Contoh | Estimasi |
|---|---|---|
| COGS | Pembelian barang dari supplier | 50-60% dari revenue |
| Kurir | Gaji kurir + BBM + maintenance | 8-12% |
| Operasional | Sewa hub, listrik, internet | 8-10% |
| Gaji | Staff admin, CS | 10-15% |
| Marketing | Iklan, promo, referral | 5-8% |
| Platform | Payment gateway fee, server | 2-3% |

### 9.3 Chart of Account (COA) yang Diusulkan

```
NERACA (Balance Sheet)
├── 1-1000  Aset Lancar
│   ├── 1-1100  Kas
│   ├── 1-1200  Bank
│   ├── 1-1300  Piutang Usaha
│   ├── 1-1400  Persediaan Barang
│   └── 1-1500  Saldo Poin Beredar (Aset)
├── 1-2000  Aset Tetap
│   ├── 1-2100  Peralatan
│   ├── 1-2200  Kendaraan
│   └── 1-2300  Akumulasi Penyusutan (K)
├── 2-1000  Liabilitas
│   ├── 2-1100  Hutang Usaha
│   ├── 2-1200  Hutang Fee ke Hub
│   ├── 2-1300  Liabilitas Poin (K)  ← PENTING
│   ├── 2-1400  PPN Keluaran
│   └── 2-1500  Hutang Gaji
├── 3-1000  Ekuitas
│   ├── 3-1100  Modal
│   └── 3-1200  Laba Ditahan

LABA RUGI (Profit & Loss)
├── 4-1000  Pendapatan
│   ├── 4-1100  Pendapatan Penjualan
│   ├── 4-1200  Pendapatan Fee Hub
│   ├── 4-1300  Pendapatan Fee Pusat
│   ├── 4-1400  Pendapatan Top-Up Poin
│   ├── 4-1500  Pendapatan Subscription
│   └── 4-1600  Pendapatan Lainnya
├── 5-1000  Beban
│   ├── 5-1100  HPP (COGS)
│   ├── 5-1200  Beban Kurir
│   ├── 5-1300  Beban Operasional
│   ├── 5-1400  Beban Gaji
│   ├── 5-1500  Beban Marketing
│   ├── 5-1600  Beban Payment Gateway
│   └── 5-1700  Beban Penyusutan
```

### 9.4 Jurnal untuk Transaksi Kunci

**1. Top-Up Poin (Customer bayar 100K)**
```
Debit    Kas                 Rp 100.000
Kredit   Liabilitas Poin     Rp 100.000
```

**2. Order Belanja Pakai Poin (114.000 pts)**
```
Debit    Liabilitas Poin     Rp 114.000
Kredit   Pendapatan Penjualan Rp 114.000
```

**3. Order Belanja Tunai (Rp 100.000)**
```
Debit    Kas                 Rp 100.000
Kredit   Pendapatan Penjualan Rp 100.000
```

**4. Fee Split (Order Rp 100.000, Hub 67%, Pusat 33%)**
```
Debit    Beban Fee Hub       Rp 67.000
Debit    Beban Fee Pusat     Rp 33.000
Kredit   Hutang Fee ke Hub   Rp 67.000
Kredit   Pendapatan Fee Pusat Rp 33.000
```

**5. Stok Masuk dari Supplier (Rp 500.000)**
```
Debit    Persediaan Barang   Rp 500.000
Kredit   Kas / Hutang        Rp 500.000
```

**6. Expired Poin (poin kadaluarsa)**
```
Debit    Liabilitas Poin     Rp 20.000
Kredit   Pendapatan Lainnya  Rp 20.000
```

### 9.5 Laporan Keuangan (Wajib Ada)
1. **Neraca (Balance Sheet)** — Aset, Liabilitas, Ekuitas
2. **Laba Rugi (Profit & Loss)** — Pendapatan vs Beban
3. **Arus Kas (Cash Flow)** — Operasional, Investasi, Pendanaan
4. **Laporan Fee per Hub** — Rekapitulasi 67/33
5. **Laporan Poin Liability** — Poin beredar vs aset kas
6. **Realisasi RAB** — Budget vs Actual
7. **Laporan PPN** — Keluaran & Masukan

### 9.6 Analisis Risiko Keuangan
| Risiko | Dampak | Mitigasi |
|---|---|---|
| Poin liability > kas | Insolven | Batasi poin beredar maks 70% dari kas |
| Pencucian poin | Fraud via top-up dummynya | Limit harian + verifikasi |
| Double claim fee | Dua kali bayar | Unique constraint + audit trail |
| Expired tidak dijurnal | Laba understated | Cron auto-jurnal expired |

---

## 10. KEAMANAN SISTEM

### 10.1 Autentikasi & Otorisasi
| Aspek | Implementasi |
|---|---|
| Password | Bcrypt/Argon2 (Laravel default) |
| Session | Database/Redis driver |
| RBAC | `spatie/laravel-permission` |
| API Auth | `laravel/sanctum` |
| Email Verify | `MustVerifyEmail` |
| Rate Limit | `throttle:5,1` pada login |
| Account Lock | Lock 5x gagal login (15 min) |

### 10.2 Validasi & Keamanan Input
| Aspek | Laravel |
|---|---|
| Validation | Form Request |
| XSS | Blade auto-escape `{{ }}` |
| SQL Injection | Eloquent parameterized |
| CSRF | `@csrf` semua form |
| Mass Assignment | `$fillable` / `$guarded` |
| File Upload | Validasi mime + size |
| IDOR | Policy permission |

### 10.3 Keamanan Transaksi (Race Condition)
```
Gunakan Database Transaction untuk:
- Order checkout (deduct stock + points atomic)
- Top-up poin
- Fee split

Gunakan Locking: `lockForUpdate()` pada stock & wallet
Unique constraint untuk cegah duplikasi
```

### 10.4 Audit Trail
Semua perubahan berikut WAJIB tercatat:
```
Order: create/update/delete/cancel
Payment: create/confirm/fail
PointTransaction: create
StockMovement: create
UserRole: assign/revoke
FeeCalculation: approve/pay
```

### 10.5 Keamanan Data
| Data | Enkripsi |
|---|---|
| Password | Hash bcrypt |
| NIK/KTP | `Crypt::encryptString()` |
| Payment token | Tidak disimpan |
| API keys | `.env` |

---

## 11. KEKURANGAN & SARAN PERBAIKAN

### 11.1 Fungsional yang Kurang
| No | Kekurangan | Saran |
|---|---|---|
| 1 | Tidak ada rating/review produk | Tambah tabel `product_reviews` |
| 2 | Tidak ada wishlist | Tambah tabel `wishlists` |
| 3 | Tidak ada voucher/diskon dinamis | Perluas `promos` |
| 4 | Tidak ada manajemen supplier | Tambah tabel `suppliers` + `purchase_orders` |
| 5 | Subscription auto-renewal belum otomatis | Cron job + payment auto |
| 6 | Tidak ada export Excel | `maatwebsite/excel` |
| 7 | Tidak ada grafik dinamis | Chart.js / ApexCharts |
| 8 | Katalog belum ada filter/sort lengkap | Filter harga, kategori, rating |
| 9 | Tidak ada POS (Point of Sale) | Modul kasir hub |
| 10 | Tidak ada referral program | Tambah `referrals` tabel |
| 11 | Tidak ada manajemen lokasi/bin (Zona→Lorong→Rak→Level→Bin) | Tambah tabel `warehouse_locations` + `stock_bins` |
| 12 | Tidak ada barcode/QR scanner | Integrasi scanner + cetak label barcode |
| 13 | Tidak ada Receiving + QC (penerimaan barang) | Tambah tabel `receiving_orders` + `qc_results` |
| 14 | Tidak ada Put-away rules (penempatan otomatis) | Tambah tabel `putaway_rules` |
| 15 | Tidak ada Picking list + rute terpendek | Tambah tabel `picking_lists` + `picking_batches` |
| 16 | Tidak ada Packing verification (scan ulang) | Tambah tabel `packing_orders` |
| 17 | Tidak ada Stock Opname / Cycle Counting | Tambah tabel `stock_opnames` |
| 18 | Tidak ada Replenishment (isi ulang picking area) | Tambah tabel `replenishment_requests` |
| 19 | Tidak ada FIFO/FEFO (batch & expiry) | Tambah tabel `product_batches` |
| 20 | Tidak ada Order Allocation (lock stok) | Tambah tabel `stock_reservations` |
| 21 | Tidak ada laporan Fast/Slow Moving | Dashboard WMS + report |
| 22 | Tidak ada Purchase Requisition (PR) + approval workflow | Tambah tabel `purchase_requests` + digital approval |
| 23 | Tidak ada ROP & auto-replenishment | Tambah field `reorder_point` + algoritma forecasting |
| 24 | Tidak ada multi-supplier & vendor scoring | Tambah tabel `supplier_items` + `supplier_performance` |
| 25 | Tidak ada ETA dashboard & partial receiving | Tambah field `eta_date` + status `partial` |
| 26 | Tidak ada field WMS di tabel produk (storage_type, batch tracking, dll) | Tambah field `storage_type`, `is_batch_tracked`, `shelf_life_days` |
| 27 | Tidak ada default warehouse per produk | Tambah field `default_warehouse_id` |
| 28 | Tidak ada template email per transaksi | Tambah tabel `email_templates` |
| 29 | Tidak ada riwayat pengiriman email | Tambah tabel `email_logs` |
| 30 | Tidak ada pengaturan email per user | Tambah tabel `email_preferences` |
| 31 | Tidak ada riwayat naik/turun tier membership | Tambah tabel `customer_tier_history` |
| 32 | Tidak ada riwayat klaim reward | Tambah tabel `reward_redemptions` |
| 33 | Tidak ada target penjualan per periode | Tambah tabel `sales_targets` |
| 34 | Tidak ada realisasi RAB otomatis | Tambah tabel `rab_actuals` |
| 35 | Tidak ada aturan kadaluarsa poin terstruktur | Tambah tabel `point_expiry_rules` |
| 36 | Tidak ada pembayaran fee ke hub | Tambah tabel `fee_payouts` |
| 37 | Tidak ada event loyalty (bonus/cashback) | Tambah tabel `loyalty_events` |
| 38 | Tidak ada laporan keuangan otomatis | Tambah tabel `accounting_reports` |
| 39 | Tidak ada zona pengiriman per hub | Tambah tabel `delivery_zones` |
| 40 | Tidak ada rute kurir optimal | Tambah tabel `delivery_routes` |
| 41 | Tidak ada riwayat percobaan pengiriman | Tambah tabel `delivery_attempts` |
| 42 | Tidak ada bukti foto/ttd penerimaan | Tambah tabel `delivery_proofs` |
| 43 | Tidak ada jadwal pengiriman | Tambah tabel `delivery_schedules` |
| 44 | Tidak ada retur/pengembalian barang | Tambah tabel `delivery_returns` |
| 45 | Tidak ada riwayat refund pembayaran | Tambah tabel `payment_refunds` |
| 46 | Tidak ada cicilan pembayaran | Tambah tabel `payment_installments` |
| 47 | Tidak ada rekonsiliasi bank/gateway | Tambah tabel `payment_reconciliation` |
| 48 | Tidak ada log webhook gateway | Tambah tabel `payment_webhooks` |
| 49 | Tidak ada detail produk per paket subscription | Tambah tabel `subscription_plan_items` |
| 50 | Tidak ada riwayat pause langganan | Tambah tabel `subscription_pauses` |
| 51 | Tidak ada riwayat upgrade/downgrade paket | Tambah tabel `subscription_upgrades` |
| 52 | Tidak ada log gagal bayar subscription | Tambah tabel `subscription_failures` |
| 53 | Tidak ada percobaan tagihan subscription | Tambah tabel `subscription_billing_attempts` |

### 11.2 Perbaikan Skema Pengiriman (Sudah Sesuai Section 7)
| Aspek | Kondisi Setelah Update |
|---|---|
| Status sederhana | ✅ 7 status (cukup) |
| Est. ongkir | ✅ Tidak dihitung (sudah include di RAB) |
| Tracking timeline | ✅ Vertikal sederhana |
| Kurir | ✅ Manual input (sederhana) |

### 11.3 Perbaikan Manajemen Keuangan
| Gap | Solusi |
|---|---|
| Tidak ada COA | Sudah disediakan (section 9.3) |
| Jurnal otomatis | `AccountingService` |
| Poin liability | Tabel + jurnal liability |
| Fee split otomatis | `FeeCalculationService` |
| Tidak ada PPN | Hitung otomatis + laporkan |

---

## 12. ROADMAP MIGRASI LARAVEL

### Fase 1: Foundation (Minggu 1-2)
- [ ] Install Laravel 11 + Tailwind + Blade
- [ ] Setup database MySQL + Redis
- [ ] Setup auth + role (Spatie)
- [ ] Buat layout reusable
- [ ] Migrasi user, roles, permissions

### Fase 2: Master Data (Minggu 3-4)
- [ ] Migrasi: hubs, categories, products, variants
- [ ] CRUD Product Management (Admin)
- [ ] Bertah CRUD Hub Management
- [ ] Bertah CRUD Membership/Tier
- [ ] CRUD Reward
- [ ] CRUD Promo/Event

### Fase 3: E-commerce Core (Minggu 5-7)
- [ ] Migrasi: carts, orders, order_items
- [ ] Katalog + detail produk
- [ ] Keranjang + Checkout flow
- [ ] Order Management
- [ ] Payment Gateway integration
- [ ] Point wallet & top-up

### Fase 4: Delivery & Subscription (Minggu 8-10)
- [ ] Migrasi: deliveries, tracking, subscription
- [ ] Halaman tracking sederhana (sesuai section 8)
- [ ] CRUD manage delivery (Hub)
- [ ] Auto-order subscription (cron)
- [ ] Notification (email + WhatsApp)
- [ ] Email Templates + Email Logs + Email Preferences
- [ ] Notifikasi email transaksi Customer (10 jenis)
- [ ] Notifikasi email transaksi Hub (8 jenis)
- [ ] Delivery Zones + Delivery Routes
- [ ] Delivery Attempts + Delivery Proofs
- [ ] Delivery Schedules + Delivery Returns
- [ ] Payment Refunds + Payment Installments
- [ ] Payment Reconciliation + Payment Webhooks
- [ ] Subscription Plan Items + Subscription Pauses
- [ ] Subscription Upgrades + Subscription Failures + Billing Attempts

### Fase 5: Finance & Accounting (Minggu 11-13)
- [ ] Migrasi: COA, journal_entries, fee_calc
- [ ] Chart of Account seeder
- [ ] AccountingService (jurnal otomatis)
- [ ] Fee report (67/33)
- [ ] Laba Rugi, Neraca, Arus Kas
- [ ] RAB Dashboard
- [ ] Export Excel
- [ ] Customer Tier History + Reward Redemptions
- [ ] Sales Targets + RAB Actuals
- [ ] Point Expiry Rules + Fee Payouts
- [ ] Loyalty Events + Accounting Reports

### Fase 6: Security & Production (Minggu 14-16)
- [ ] Preloader lock + audit logs
- [ ] Rate limiting
- [ ] Unit test & feature test (PEST)
- [ ] Backup & monitoring
- [ ] Deployment

### Fase 7: Warehouse Management System (Minggu 17-24)
- [ ] Migrasi: suppliers, purchase_orders, receiving, qc, locations, bins
- [ ] Migrasi: picking, packing, stock_opname, replenishment, batches
- [ ] CRUD Supplier & Purchase Order
- [ ] Manajemen Lokasi/Bin (Zona→Lorong→Rak→Level→Bin)
- [ ] Receiving + QC (scan barcode)
- [ ] Put-away rules (penempatan otomatis)
- [ ] Picking list + Wave/Batch picking
- [ ] Packing verification (scan ulang)
- [ ] Stock Opname / Cycle Counting
- [ ] Replenishment alert
- [ ] FIFO/FEFO (batch & expiry)
- [ ] Laporan: Kartu Stok, Fast/Slow Moving, Mutasi Stok
- [ ] Tambah field WMS di tabel products (storage_type, batch tracking, default warehouse)

### Fase 8: Order Stok Enterprise (Minggu 25-30)
- [ ] Migrasi: purchase_requests, purchase_request_items, supplier_items
- [ ] Migrasi: supplier_performance, backorders, replenishment_suggestions
- [ ] Purchase Requisition + Approval Workflow (digital approval bertingkat)
- [ ] Auto-Replenishment (ROP + forecasting + backorder)
- [ ] Multi-supplier & Vendor Performance Scoring
- [ ] ETA Dashboard + Partial Receiving + Tolerance Limit
- [ ] PDF & Email Generator untuk PO
- [ ] Merge PR (gabungkan permintaan ke supplier sama)
- [ ] Termin Pembayaran (Cash / Net 30 / Konsinyasi)
- [ ] Integrasi penuh: Order → Stok → Order Stok → WMS Receiving → Stok

---

## 13. GAP ANALYSIS WMS (WAREHOUSE MANAGEMENT SYSTEM)

### 13.1 Perbandingan Fitur WMS Standar vs Kondisi Saat Ini

| Modul WMS | Fitur Standar | Status di Sistem Retail | Keterangan |
|---|---|---|---|
| **Master Data** | Manajemen SKU | ✅ Ada | `products.sku`, `product_variants.sku` |
| | Manajemen Lokasi (Zona→Lorong→Rak→Level→Bin) | ❌ Tidak Ada | Tidak ada tabel `warehouse_locations`/`stock_bins` |
| | Data Supplier | ❌ Tidak Ada | Tidak ada tabel `suppliers` |
| | Data Customer | ✅ Ada | `customer_profiles`, `addresses` |
| **User & Role** | Role-based access | ✅ Ada (rencana) | Spatie RBAC di roadmap |
| | Audit Trail | ✅ Ada | `audit_logs` §4.12 |
| **Inbound** | Receiving + QC | ❌ Tidak Ada | Tidak ada tabel `receiving_orders`/`qc_results` |
| | Barcode/QR Scanner | ❌ Tidak Ada | Tidak ada integrasi scanner |
| | Cetak Label Barcode | ❌ Tidak Ada | Tidak ada fitur label |
| | Put-away Rules | ❌ Tidak Ada | Tidak ada logika penempatan |
| | Purchase Order (PO) | ❌ Tidak Ada | Tidak ada tabel `purchase_orders` |
| **Inventory** | Tracking per Lokasi | ❌ Tidak Ada | `hub_product.stock_qty` hanya angka total |
| | Stock Opname / Cycle Counting | ❌ Tidak Ada | Tombol di dashboard hanya toast "akan segera hadir" |
| | Replenishment Alert | ⚠️ Sebagian | Ada alert stok menipis, tapi bukan replenishment picking area |
| | FIFO/FEFO | ❌ Tidak Ada | Tidak ada logika batch/expiry |
| | Mutasi Stok (Kartu Stok) | ⚠️ Sebagian | Ada `stock_movements` tapi belum ada laporan kartu stok |
| **Outbound** | Order Allocation (lock stok) | ❌ Tidak Ada | Tidak ada mekanisme reserved stock |
| | Picking List + Rute Terpendek | ❌ Tidak Ada | Tidak ada fitur picking |
| | Wave/Batch Picking | ❌ Tidak Ada | Tidak ada |
| | Packing Verification (scan ulang) | ❌ Tidak Ada | Tidak ada |
| | Shipping Label | ❌ Tidak Ada | Tidak ada |
| | Integrasi Kurir | ⚠️ Sebagian | `couriers` + `deliveries` sederhana |
| **Dashboard & Report** | Laporan Stok | ⚠️ Sebagian | Dashboard stok sederhana |
| | Fast/Slow Moving | ❌ Tidak Ada | Tidak ada |
| | Laporan Mutasi Stok | ❌ Tidak Ada | Tidak ada |

### 13.2 Skema Database Tambahan (20 Tabel Baru)

```php
// 47. suppliers
Schema::create('suppliers', function ($table) {
    $table->id();
    $table->string('name');
    $table->string('code')->unique();
    $table->string('contact_person')->nullable();
    $table->string('phone', 20)->nullable();
    $table->string('email')->nullable();
    $table->text('address')->nullable();
    $table->string('city')->nullable();
    $table->enum('status', ['active', 'inactive'])->default('active');
    $table->timestamps();
});

// 48. purchase_orders
Schema::create('purchase_orders', function ($table) {
    $table->id();
    $table->string('po_code')->unique();
    $table->foreignId('supplier_id')->constrained();
    $table->foreignId('warehouse_id')->constrained();
    $table->enum('status', ['draft', 'submitted', 'approved', 'received', 'cancelled'])->default('draft');
    $table->date('order_date');
    $table->date('expected_date')->nullable();
    $table->decimal('total_amount', 15, 2)->default(0);
    $table->text('notes')->nullable();
    $table->string('created_by');
    $table->timestamps();
});

// 49. purchase_order_items
Schema::create('purchase_order_items', function ($table) {
    $table->id();
    $table->foreignId('purchase_order_id')->constrained()->cascadeOnDelete();
    $table->foreignId('product_id')->constrained();
    $table->foreignId('product_variant_id')->nullable()->constrained();
    $table->integer('qty_ordered');
    $table->integer('qty_received')->default(0);
    $table->decimal('unit_price', 15, 2);
    $table->decimal('subtotal', 15, 2);
    $table->timestamps();
});

// 50. receiving_orders
Schema::create('receiving_orders', function ($table) {
    $table->id();
    $table->string('receiving_code')->unique();
    $table->foreignId('purchase_order_id')->nullable()->constrained();
    $table->foreignId('warehouse_id')->constrained();
    $table->foreignId('supplier_id')->constrained();
    $table->enum('status', ['expected', 'partial', 'received', 'completed'])->default('expected');
    $table->string('reference_document')->nullable(); // Surat Jalan
    $table->timestamp('received_at')->nullable();
    $table->string('received_by');
    $table->timestamps();
});

// 51. receiving_items
Schema::create('receiving_items', function ($table) {
    $table->id();
    $table->foreignId('receiving_order_id')->constrained()->cascadeOnDelete();
    $table->foreignId('product_id')->constrained();
    $table->foreignId('product_variant_id')->nullable()->constrained();
    $table->integer('qty_expected');
    $table->integer('qty_received');
    $table->integer('qty_damaged')->default(0);
    $table->timestamps();
});

// 52. qc_results
Schema::create('qc_results', function ($table) {
    $table->id();
    $table->foreignId('receiving_item_id')->constrained()->cascadeOnDelete();
    $table->enum('result', ['passed', 'failed', 'partial']);
    $table->integer('qty_passed');
    $table->integer('qty_failed');
    $table->text('notes')->nullable();
    $table->string('checked_by');
    $table->timestamp('checked_at');
    $table->timestamps();
});

// 53. warehouse_locations (Hirarki: Zona→Lorong→Rak→Level→Bin)
Schema::create('warehouse_locations', function ($table) {
    $table->id();
    $table->foreignId('warehouse_id')->constrained()->cascadeOnDelete();
    $table->string('zone');          // Zona A, B, C
    $table->string('aisle');         // Lorong 1, 2, 3
    $table->string('rack');          // Rak A1, A2
    $table->string('level');         // Level 1-5
    $table->string('bin');           // Bin 01-20
    $table->string('location_code')->unique(); // A-1-A1-2-05
    $table->enum('type', ['storage', 'picking', 'damaged', 'quarantine'])->default('storage');
    $table->integer('max_weight_kg')->nullable();
    $table->integer('max_volume')->nullable();
    $table->boolean('is_active')->default(true);
    $table->timestamps();
    $table->unique(['warehouse_id', 'zone', 'aisle', 'rack', 'level', 'bin']);
});

// 54. stock_bins (Stok per bin)
Schema::create('stock_bins', function ($table) {
    $table->id();
    $table->foreignId('warehouse_location_id')->constrained()->cascadeOnDelete();
    $table->foreignId('product_id')->constrained();
    $table->foreignId('product_variant_id')->nullable()->constrained();
    $table->integer('qty')->default(0);
    $table->integer('reserved_qty')->default(0);
    $table->timestamps();
    $table->unique(['warehouse_location_id', 'product_id', 'product_variant_id']);
});

// 55. putaway_rules
Schema::create('putaway_rules', function ($table) {
    $table->id();
    $table->foreignId('warehouse_id')->constrained()->cascadeOnDelete();
    $table->foreignId('category_id')->nullable()->constrained();
    $table->foreignId('product_id')->nullable()->constrained();
    $table->enum('priority', ['high', 'medium', 'low'])->default('medium');
    $table->integer('max_weight_kg')->nullable();
    $table->enum('storage_type', ['ambient', 'cold', 'frozen', 'hazardous'])->default('ambient');
    $table->string('preferred_zone');
    $table->boolean('is_active')->default(true);
    $table->timestamps();
});

// 56. product_batches (FIFO/FEFO)
Schema::create('product_batches', function ($table) {
    $table->id();
    $table->foreignId('product_id')->constrained();
    $table->foreignId('product_variant_id')->nullable()->constrained();
    $table->string('batch_code');
    $table->date('production_date')->nullable();
    $table->date('expiry_date')->nullable();
    $table->integer('qty')->default(0);
    $table->integer('qty_reserved')->default(0);
    $table->timestamps();
});

// 57. stock_reservations (Order Allocation / Lock Stok)
Schema::create('stock_reservations', function ($table) {
    $table->id();
    $table->foreignId('order_id')->constrained();
    $table->foreignId('product_id')->constrained();
    $table->foreignId('product_variant_id')->nullable()->constrained();
    $table->foreignId('stock_bin_id')->nullable()->constrained();
    $table->foreignId('product_batch_id')->nullable()->constrained();
    $table->integer('qty_reserved');
    $table->enum('status', ['active', 'picked', 'released', 'expired'])->default('active');
    $table->timestamp('reserved_at');
    $table->timestamp('released_at')->nullable();
    $table->timestamps();
});

// 58. picking_lists
Schema::create('picking_lists', function ($table) {
    $table->id();
    $table->string('picking_code')->unique();
    $table->foreignId('warehouse_id')->constrained();
    $table->foreignId('hub_id')->nullable()->constrained();
    $table->enum('status', ['pending', 'in_progress', 'completed', 'cancelled'])->default('pending');
    $table->enum('method', ['single', 'batch', 'wave'])->default('single');
    $table->string('assigned_to')->nullable();
    $table->timestamp('started_at')->nullable();
    $table->timestamp('completed_at')->nullable();
    $table->timestamps();
});

// 59. picking_list_items
Schema::create('picking_list_items', function ($table) {
    $table->id();
    $table->foreignId('picking_list_id')->constrained()->cascadeOnDelete();
    $table->foreignId('order_id')->constrained();
    $table->foreignId('product_id')->constrained();
    $table->foreignId('product_variant_id')->nullable()->constrained();
    $table->foreignId('stock_bin_id')->nullable()->constrained();
    $table->foreignId('product_batch_id')->nullable()->constrained();
    $table->integer('qty_required');
    $table->integer('qty_picked')->default(0);
    $table->enum('status', ['pending', 'picked', 'skipped'])->default('pending');
    $table->timestamps();
});

// 60. picking_batches (Wave/Batch Picking)
Schema::create('picking_batches', function ($table) {
    $table->id();
    $table->string('batch_code')->unique();
    $table->foreignId('warehouse_id')->constrained();
    $table->enum('status', ['open', 'processing', 'completed', 'cancelled'])->default('open');
    $table->integer('total_orders')->default(0);
    $table->integer('total_items')->default(0);
    $table->string('created_by');
    $table->timestamp('completed_at')->nullable();
    $table->timestamps();
});

// 61. packing_orders
Schema::create('packing_orders', function ($table) {
    $table->id();
    $table->string('packing_code')->unique();
    $table->foreignId('picking_list_id')->constrained();
    $table->foreignId('order_id')->constrained();
    $table->enum('status', ['pending', 'packed', 'verified', 'shipped'])->default('pending');
    $table->integer('total_items_expected');
    $table->integer('total_items_verified')->default(0);
    $table->string('packed_by')->nullable();
    $table->string('verified_by')->nullable();
    $table->timestamp('packed_at')->nullable();
    $table->timestamp('verified_at')->nullable();
    $table->timestamps();
});

// 62. stock_opnames
Schema::create('stock_opnames', function ($table) {
    $table->id();
    $table->string('opname_code')->unique();
    $table->foreignId('warehouse_id')->constrained();
    $table->foreignId('hub_id')->nullable()->constrained();
    $table->enum('type', ['full', 'cycle', 'spot'])->default('cycle');
    $table->enum('status', ['draft', 'in_progress', 'completed', 'cancelled'])->default('draft');
    $table->date('scheduled_date');
    $table->date('completed_date')->nullable();
    $table->string('created_by');
    $table->text('notes')->nullable();
    $table->timestamps();
});

// 63. stock_opname_items
Schema::create('stock_opname_items', function ($table) {
    $table->id();
    $table->foreignId('stock_opname_id')->constrained()->cascadeOnDelete();
    $table->foreignId('product_id')->constrained();
    $table->foreignId('product_variant_id')->nullable()->constrained();
    $table->foreignId('stock_bin_id')->nullable()->constrained();
    $table->integer('system_qty');
    $table->integer('physical_qty');
    $table->integer('difference_qty');
    $table->enum('status', ['match', 'difference', 'adjusted'])->default('difference');
    $table->text('notes')->nullable();
    $table->string('counted_by');
    $table->timestamps();
});

// 64. replenishment_requests
Schema::create('replenishment_requests', function ($table) {
    $table->id();
    $table->foreignId('warehouse_id')->constrained();
    $table->foreignId('product_id')->constrained();
    $table->foreignId('product_variant_id')->nullable()->constrained();
    $table->foreignId('from_bin_id')->nullable()->constrained('warehouse_locations');
    $table->foreignId('to_bin_id')->nullable()->constrained('warehouse_locations');
    $table->integer('qty_requested');
    $table->integer('qty_fulfilled')->default(0);
    $table->enum('status', ['pending', 'approved', 'in_progress', 'completed', 'cancelled'])->default('pending');
    $table->timestamp('requested_at');
    $table->timestamp('completed_at')->nullable();
    $table->timestamps();
});

// 65. barcode_labels
Schema::create('barcode_labels', function ($table) {
    $table->id();
    $table->string('label_code')->unique();
    $table->foreignId('product_id')->constrained();
    $table->foreignId('product_variant_id')->nullable()->constrained();
    $table->foreignId('product_batch_id')->nullable()->constrained();
    $table->enum('type', ['product', 'bin', 'batch', 'shipping']);
    $table->string('reference_code')->nullable();
    $table->string('printed_by');
    $table->timestamp('printed_at');
    $table->timestamps();
});

// 66. stock_movement_details (Detail mutasi per bin)
Schema::create('stock_movement_details', function ($table) {
    $table->id();
    $table->foreignId('stock_movement_id')->constrained()->cascadeOnDelete();
    $table->foreignId('stock_bin_id')->nullable()->constrained();
    $table->foreignId('product_batch_id')->nullable()->constrained();
    $table->integer('qty');
    $table->integer('bin_stock_before');
    $table->integer('bin_stock_after');
    $table->timestamps();
});
```

### 13.3 Alur Kerja WMS yang Harus Diimplementasikan

```
INBOUND (Barang Masuk):
Supplier → Purchase Order (PO) → Receiving (scan barcode)
→ QC (catat rusak) → Put-away (saran bin otomatis) → Stok masuk per bin

INVENTORY (Pengelolaan):
Tracking per bin (Zona→Lorong→Rak→Level→Bin)
→ Stock Opname / Cycle Counting (hitung fisik sebagian)
→ Replenishment alert (isi ulang picking area)
→ FIFO/FEFO via product_batches (expiry date)

OUTBOUND (Barang Keluar):
Order masuk → Order Allocation (lock stok via stock_reservations)
→ Generate Pick List (rute terpendek) → Picking (scan barcode)
→ Packing (verifikasi scan ulang) → Shipping Label → Kurir
```

### 13.4 Halaman Baru yang Perlu Dibuat

**🛡️ Superadmin (Warehouse Pusat) — 10 halaman baru:**
| Halaman | Path | Fungsi |
|---|---|---|
| Manajemen Lokasi | `superadmin/warehouse-locations.html` | CRUD Zona→Lorong→Rak→Level→Bin |
| Supplier | `superadmin/suppliers.html` | CRUD data supplier |
| Purchase Order | `superadmin/purchase-orders.html` | Buat & kelola PO ke supplier |
| Receiving + QC | `superadmin/receiving.html` | Penerimaan barang + QC (scan barcode) |
| Put-away | `superadmin/putaway.html` | Penempatan barang ke bin (saran otomatis) |
| Picking | `superadmin/picking.html` | Generate & kelola picking list |
| Packing | `superadmin/packing.html` | Verifikasi packing (scan ulang) |
| Stock Opname | `superadmin/stock-opname.html` | Cycle counting / stock opname |
| Replenishment | `superadmin/replenishment.html` | Alert & proses replenishment |
| Laporan WMS | `superadmin/warehouse-reports.html` | Kartu stok, fast/slow moving, mutasi |

**🏪 Hub (Cabang) — 4 halaman baru:**
| Halaman | Path | Fungsi |
|---|---|---|
| Lokasi Rak | `hub/warehouse-locations.html` | Lokasi rak di gudang hub |
| Stock Opname | `hub/stock-opname.html` | Stock opname hub |
| Picking | `hub/picking.html` | Picking list untuk order customer |
| Packing | `hub/packing.html` | Verifikasi packing sebelum kirim |

### 13.5 Prioritas Implementasi

| Prioritas | Fitur | Minggu |
|---|---|---|
| 🔴 **Tinggi** | Lokasi/Bin tracking, Stock Opname, Receiving + QC, Supplier + PO | 17-20 |
| 🟡 **Sedang** | Picking list, Packing verification, Replenishment | 21-22 |
| 🟢 **Rendah** | Wave picking, Fast/Slow Moving report, Integrasi barcode hardware | 23-24 |

---

## 14. ORDER STOK ENTERPRISE (PURCHASING & PROCUREMENT)

### 14.1 Diagram Integrasi Sistem (Terhubung dengan WMS, Stok & Order)

```
┌─────────────────────────────────────────────────────────────────────┐
│                    SISTEM TERINTEGRASI PENUH                        │
│                                                                     │
│  ┌─────────────┐     ┌──────────────────┐     ┌─────────────────┐  │
│  │  E-COMMERCE │     │  WMS (Section 13)│     │ ORDER STOK      │  │
│  │  ORDER      │     │  - Inbound       │     │ (Section 14)    │  │
│  │             │     │  - Inventory     │     │  - Trigger      │  │
│  │ Customer    │     │  - Outbound      │     │  - PR/PO        │  │
│  │ checkout    │     │                  │     │  - Receiving    │  │
│  └──────┬──────┘     └──────┬───────────┘     └───────┬─────────┘  │
│         │                   │                         │            │
│         ▼                   ▼                         ▼            │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    STOK (hub_product)                        │   │
│  │  stock_qty = total stok tersedia                             │   │
│  │  reserved_qty = stok di-lock oleh order                      │   │
│  │  reorder_point (ROP) = batas minimal pemicu order            │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ALUR LENGKAP:                                                      │
│  Order masuk → Lock stok (reserved) → Stok berkurang               │
│  → Stok ≤ ROP → Auto-suggestion + Backorder                        │
│  → PR → Approval → PO → Supplier kirim                             │
│  → Receiving + QC (WMS Inbound) → Put-away ke bin                  │
│  → Stok bertambah → Order bisa dipenuhi                            │
└─────────────────────────────────────────────────────────────────────┘
```

### 14.2 Perbandingan Fitur Blueprint vs Kondisi Saat Ini

| Tahap | Fitur yang Dibutuhkan | Status di review.md | Keterangan |
|---|---|---|---|
| **1. Trigger & Planning** | Reorder Point (ROP) & Safety Stock | ⚠️ Sebagian | Ada `safety_stock` di `hub_product`, tapi tidak ada ROP |
| | Perhitungan Lead Time | ❌ Tidak Ada | Tidak ada field `lead_time_days` di `suppliers` |
| | Auto-Replenishment Suggestion | ❌ Tidak Ada | Tidak ada algoritma forecasting |
| | Backorder Management | ❌ Tidak Ada | Tidak ada mekanisme backorder |
| **2. Purchase Requisition (PR)** | Pembuatan Draft PR | ❌ Tidak Ada | Tidak ada tabel `purchase_requests` |
| | Approval Workflow Bertingkat | ❌ Tidak Ada | Tidak ada approval flow (≤10jt vs >10jt) |
| | Merge PR | ❌ Tidak Ada | Tidak ada fitur penggabungan PR |
| **3. Purchase Order (PO)** | Generate PO Otomatis dari PR | ⚠️ Sebagian | Ada `purchase_orders`, tapi tidak ada konversi PR→PO |
| | Detail Harga & Pajak (PPN, Diskon, Freight) | ⚠️ Sebagian | Ada `unit_price` & `subtotal`, tapi tidak ada PPN/diskon/freight |
| | PDF & Email Generator | ❌ Tidak Ada | Tidak ada |
| | Termin Pembayaran (Cash/Net 30/Konsinyasi) | ❌ Tidak Ada | Tidak ada field `payment_terms` |
| **4. Tracking & Receiving** | Status PO Tracking (7 status) | ⚠️ Sebagian | Ada 5 status, kurang `partial` & `closed` |
| | ETA Dashboard | ❌ Tidak Ada | Tidak ada |
| | Partial Receiving | ⚠️ Sebagian | Ada `qty_received`, tapi belum ada status `partial` di PO |
| | Tolerance Limit | ❌ Tidak Ada | Tidak ada |
| **5. Vendor Management** | Master Data Supplier | ✅ Ada | Tabel `suppliers` (Section 13.2) |
| | Multi-Supplier untuk 1 SKU | ❌ Tidak Ada | Tidak ada tabel `supplier_items` |
| | Vendor Performance Scoring | ❌ Tidak Ada | Tidak ada field skor vendor |

### 14.3 Skema Database Tambahan (6 Tabel Baru) — Terhubung dengan Tabel Existing

```php
// 67. purchase_requests (Header PR) — Terhubung ke: users, hubs, warehouses
Schema::create('purchase_requests', function ($table) {
    $table->id();
    $table->string('pr_code')->unique();
    $table->foreignId('warehouse_id')->constrained();
    $table->foreignId('hub_id')->nullable()->constrained();
    $table->foreignId('requested_by')->constrained('users');
    $table->enum('status', ['draft', 'submitted', 'pending_approval', 'approved', 'rejected', 'merged', 'converted'])->default('draft');
    $table->decimal('total_amount', 15, 2)->default(0);
    $table->enum('priority', ['normal', 'urgent', 'critical'])->default('normal');
    $table->text('notes')->nullable();
    $table->timestamp('submitted_at')->nullable();
    $table->timestamp('approved_at')->nullable();
    $table->string('approved_by')->nullable();
    $table->timestamps();
});

// 68. purchase_request_items (Detail PR) — Terhubung ke: purchase_requests, products
Schema::create('purchase_request_items', function ($table) {
    $table->id();
    $table->foreignId('purchase_request_id')->constrained()->cascadeOnDelete();
    $table->foreignId('product_id')->constrained();
    $table->foreignId('product_variant_id')->nullable()->constrained();
    $table->integer('qty_requested');
    $table->integer('qty_approved')->default(0);
    $table->decimal('estimated_price', 15, 2)->default(0);
    $table->enum('source', ['manual', 'auto_rop', 'backorder', 'forecast'])->default('manual');
    $table->text('notes')->nullable();
    $table->timestamps();
});

// 69. supplier_items (Multi-supplier per SKU + histori harga) — Terhubung ke: suppliers, products
Schema::create('supplier_items', function ($table) {
    $table->id();
    $table->foreignId('supplier_id')->constrained()->cascadeOnDelete();
    $table->foreignId('product_id')->constrained();
    $table->foreignId('product_variant_id')->nullable()->constrained();
    $table->decimal('unit_price', 15, 2);
    $table->integer('lead_time_days')->default(7);
    $table->integer('min_order_qty')->default(1);
    $table->decimal('discount_percent', 5, 2)->default(0);
    $table->boolean('is_preferred')->default(false);
    $table->date('price_effective_date');
    $table->timestamps();
    $table->unique(['supplier_id', 'product_id', 'product_variant_id']);
});

// 70. supplier_performance (Skor vendor) — Terhubung ke: suppliers, purchase_orders
Schema::create('supplier_performance', function ($table) {
    $table->id();
    $table->foreignId('supplier_id')->constrained()->cascadeOnDelete();
    $table->foreignId('purchase_order_id')->nullable()->constrained();
    $table->integer('on_time_score')->default(100);      // Ketepatan waktu (0-100)
    $table->integer('accuracy_score')->default(100);     // Akurasi jumlah (0-100)
    $table->integer('quality_score')->default(100);      // Kualitas barang (0-100)
    $table->decimal('overall_score', 5, 2)->default(100);
    $table->enum('grade', ['A', 'B', 'C', 'D'])->default('A');
    $table->text('notes')->nullable();
    $table->timestamp('evaluated_at');
    $table->timestamps();
});

// 71. backorders (Backorder management) — Terhubung ke: orders, order_items, products
Schema::create('backorders', function ($table) {
    $table->id();
    $table->foreignId('order_id')->constrained();
    $table->foreignId('order_item_id')->constrained();
    $table->foreignId('product_id')->constrained();
    $table->foreignId('product_variant_id')->nullable()->constrained();
    $table->integer('qty_backordered');
    $table->integer('qty_fulfilled')->default(0);
    $table->enum('status', ['open', 'in_purchase', 'fulfilled', 'cancelled'])->default('open');
    $table->foreignId('purchase_order_id')->nullable()->constrained();
    $table->timestamp('created_at');
    $table->timestamp('fulfilled_at')->nullable();
});

// 72. replenishment_suggestions (Auto-forecasting) — Terhubung ke: products, hub_product, backorders
Schema::create('replenishment_suggestions', function ($table) {
    $table->id();
    $table->foreignId('warehouse_id')->constrained();
    $table->foreignId('hub_id')->nullable()->constrained();
    $table->foreignId('product_id')->constrained();
    $table->foreignId('product_variant_id')->nullable()->constrained();
    $table->integer('current_stock');
    $table->integer('reorder_point');
    $table->integer('safety_stock');
    $table->integer('avg_monthly_sales');
    $table->integer('lead_time_days');
    $table->integer('suggested_qty');
    $table->integer('backorder_qty')->default(0);
    $table->enum('priority', ['high', 'medium', 'low'])->default('medium');
    $table->enum('status', ['suggested', 'in_pr', 'in_po', 'fulfilled', 'ignored'])->default('suggested');
    $table->date('suggestion_date');
    $table->timestamps();
});
```

### 14.4 Field Tambahan pada Tabel Existing (Agar Terkoneksi)

| Tabel | Field Baru | Koneksi ke Modul |
|---|---|---|
| `suppliers` | `lead_time_days`, `payment_terms`, `performance_score`, `bank_account` | Order Stok → Vendor |
| `purchase_orders` | `payment_terms`, `discount_amount`, `ppn_amount`, `freight_cost`, `eta_date`, `tolerance_percent` | Order Stok → Receiving (WMS) |
| `purchase_order_items` | `discount_percent`, `ppn_percent` | Order Stok → Keuangan |
| `hub_product` | `reorder_point` (ROP) | Stok → Order Stok (Trigger) |
| `orders` | `is_backorder` | E-commerce → Order Stok (Backorder) |
| `stock_movements` | `reference_type` = `purchase_order` | WMS → Order Stok (Receiving) |
| `stock_bins` | `qty_on_order` | WMS → Order Stok (PO in transit) |

### 14.5 Alur Kerja Terintegrasi (5 Tahap + Koneksi ke WMS)

```
TAHAP 1: TRIGGER & PLANNING (Koneksi ke Stok & Order)
- Stok ≤ ROP → Auto-suggestion (forecasting dari penjualan bulan lalu)
- Backorder dari order customer yang stok kosong → prioritas "Wajib Diorder"
- Lead time supplier → prediksi kapan ROP dipicu
- Hasil: replenishment_suggestions (daftar barang yang harus dibeli hari ini)

TAHAP 2: PURCHASE REQUISITION (PR)
- Draft PR dari staf gudang atau sistem (auto dari suggestions)
- Approval Workflow bertingkat:
  ├─ ≤ Rp 10 Juta → disetujui Kepala Gudang
  └─ > Rp 10 Juta → disetujui Manajer Keuangan / Direktur
- Merge PR: gabungkan permintaan ke supplier sama → hemat ongkir

TAHAP 3: PURCHASE ORDER (PO)
- Generate PO otomatis dari PR yang disetujui (1 klik)
- Detail: Harga Satuan, Diskon Vendor, PPN, Ongkos Kirim (Freight)
- PDF & Email Generator → kirim PO ke supplier dari dalam sistem
- Termin Pembayaran: Cash / Net 30 / Konsinyasi
- PO masuk ke WMS sebagai "Expected Receiving"

TAHAP 4: TRACKING & RECEIVING (Koneksi ke WMS Inbound)
- Status PO: Draft → Waiting Approval → Sent to Vendor
  → Partial Received → Fully Received → Closed / Canceled
- ETA Dashboard: PO tiba hari ini / besok / minggu ini
- Partial Receiving: terima 40 pcs hari ini, 60 pcs minggu depan
  → WMS terima 40 pcs → stock_bins.qty bertambah → PO tetap "Partial"
- Tolerance Limit: pesan 100 kg, datang 101 kg → toleransi 1% atau tolak
- Setelah receiving → QC → Put-away → stok siap dijual

TAHAP 5: VENDOR MANAGEMENT
- Master Supplier: nama, PIC, alamat gudang, rekening bank
- Multi-supplier per SKU (supplier_items):
  → histori harga per vendor → saran "Pesan di Vendor B, paling murah"
- Vendor Performance Scoring (otomatis):
  ├─ Ketepatan Waktu (telat dari ETA?)
  ├─ Akurasi (jumlah sesuai pesanan?)
  └─ Kualitas (persen barang rusak/retur?)
```

### 14.6 Halaman Baru yang Perlu Dibuat (6 Halaman) — Terhubung ke Halaman WMS

| Halaman | Path | Koneksi ke Halaman Lain |
|---|---|---|
| Purchase Requisition | `superadmin/purchase-requests.html` | → `purchase-orders.html` (konversi PR→PO) |
| Approval PR | `superadmin/purchase-request-approval.html` | → `purchase-requests.html` |
| Purchase Order | `superadmin/purchase-orders.html` | → `receiving.html` (WMS Inbound) |
| ETA Dashboard | `superadmin/po-eta-dashboard.html` | → `receiving.html`, `warehouse-locations.html` |
| Supplier Performance | `superadmin/supplier-performance.html` | → `suppliers.html`, `purchase-orders.html` |
| Replenishment Suggestion | `superadmin/replenishment-suggestions.html` | → `warehousing.html`, `stock-order.html`, backorders |

### 14.7 Prioritas Implementasi

| Prioritas | Fitur | Minggu |
|---|---|---|
| 🔴 **Tinggi** | ROP + Auto-suggestion, PR + Approval Workflow, Generate PO | 25-26 |
| 🟡 **Sedang** | ETA Dashboard, Partial Receiving, Tolerance Limit, PDF/Email | 27-28 |
| 🟢 **Rendah** | Multi-supplier, Vendor Scoring, Merge PR, Backorder | 29-30 |

---

## 15. PRODUCT MANAGEMENT & INTEGRASI RELASI

### 15.1 Diagram Relasi Produk (Entity Relationship)

```
┌─────────────────────────────────────────────────────────────┐
│                    PRODUK (products)                         │
│  id, sku, name, category_id, base_price, point_price         │
│  + field baru: is_stock_managed, default_warehouse_id,       │
│    storage_type, shelf_life_days, is_batch_tracked           │
└──────────┬──────────────┬──────────────┬────────────────────┘
           │              │              │
     ┌─────▼─────┐  ┌─────▼─────┐  ┌─────▼─────┐
     │   STOK    │  │ WAREHOUSE │  │  ORDER    │
     │           │  │           │  │  STOK     │
     │ hub_product│  │ stock_bins│  │ PO/PR     │
     │ stock_mov │  │ putaway   │  │ supplier  │
     │ stock_bins│  │ receiving │  │ backorder │
     │ batches   │  │ picking   │  │ replenish │
     │ reservasi │  │ barcode   │  │           │
     └───────────┘  └───────────┘  └───────────┘
```

### 15.2 Tabel Relasi Lengkap (Produk → Semua Modul)

| Modul | Tabel | Field Relasi | Fungsi Koneksi |
|---|---|---|---|
| **Stok** | `hub_product` (#9) | `product_id`, `product_variant_id` | Stok per hub + safety stock + markup |
| | `stock_movements` (#31) | `product_id` | Mutasi stok (in/out/adjustment) |
| | `stock_orders` (#33) | `product_id` | Order stok antar gudang |
| | `stock_bins` (#54) | `product_id` | Stok per bin/lokasi |
| | `product_batches` (#56) | `product_id` | FIFO/FEFO (batch & expiry) |
| | `stock_reservations` (#57) | `product_id` | Lock stok untuk order |
| | `stock_opname_items` (#63) | `product_id` | Stock opname / cycle counting |
| **Warehouse** | `stock_bins` (#54) | `warehouse_location_id` + `product_id` | Produk di lokasi fisik (Zona→Lorong→Rak→Level→Bin) |
| | `putaway_rules` (#55) | `category_id` / `product_id` | Aturan penempatan produk ke zona |
| | `receiving_items` (#51) | `product_id` | Penerimaan barang masuk |
| | `picking_list_items` (#59) | `product_id` | Pengambilan barang keluar |
| | `barcode_labels` (#65) | `product_id` | Label barcode produk |
| **Order Stok** | `purchase_order_items` (#49) | `product_id` | PO ke supplier |
| | `purchase_request_items` (#68) | `product_id` | PR internal |
| | `supplier_items` (#69) | `product_id` | Multi-supplier per SKU |
| | `backorders` (#71) | `product_id` | Backorder dari order |
| | `replenishment_suggestions` (#72) | `product_id` | Auto-forecasting |
| **E-commerce** | `cart_items` (#18) | `product_id` | Keranjang belanja |
| | `order_items` (#20) | `product_id`, `product_name`, `sku` | Item pesanan |

### 15.3 Field Tambahan pada Tabel `products` (8 Field Baru untuk WMS)

```php
// Update tabel products dengan field WMS:
Schema::table('products', function ($table) {
    $table->boolean('is_stock_managed')->default(true);
    $table->foreignId('default_warehouse_id')->nullable()->constrained('warehouses');
    $table->enum('storage_type', ['ambient', 'cold', 'frozen', 'hazardous'])->default('ambient');
    $table->integer('shelf_life_days')->nullable();
    $table->boolean('is_batch_tracked')->default(false);
    $table->boolean('is_serial_tracked')->default(false);
    $table->integer('min_stock_qty')->default(0);
    $table->integer('max_stock_qty')->nullable();
});
```

### 15.4 Penjelasan Field Baru

| Field | Fungsi | Koneksi ke Modul |
|---|---|---|
| `is_stock_managed` | Apakah produk dihitung stoknya? (false = jasa/digital) | Stok & Warehouse |
| `default_warehouse_id` | Warehouse default untuk produk | Warehouse |
| `storage_type` | Jenis penyimpanan (ambient/cold/frozen/hazardous) | `putaway_rules` |
| `shelf_life_days` | Umur simpan produk (hari) | `product_batches` (FEFO) |
| `is_batch_tracked` | Apakah perlu batch tracking? | `product_batches` |
| `is_serial_tracked` | Apakah perlu serial number? | WMS Outbound |
| `min_stock_qty` | Stok minimum global | ROP / Replenishment |
| `max_stock_qty` | Stok maksimum (kapasitas) | Replenishment |

### 15.5 Alur Integrasi Produk (End-to-End)

```
PRODUK DIBUAT (Admin)
  ├─ Set storage_type (ambient/cold/frozen)
  ├─ Set default_warehouse_id
  ├─ Set is_batch_tracked (untuk FEFO)
  └─ Set min/max stock (untuk ROP)

PRODUK MASUK (Inbound)
  → PO → Receiving → QC → Put-away ke bin sesuai storage_type
  → stock_bins.qty bertambah → hub_product.stock_qty bertambah

PRODUK DIJUAL (Outbound)
  → Order masuk → stock_reservations (lock stok)
  → Picking (ambil dari bin) → Packing → Shipping
  → stock_bins.qty berkurang → hub_product.stock_qty berkurang

PRODUK MENIPIS (Replenishment)
  → Stok ≤ min_stock_qty / ROP → Auto-suggestion
  → PR → PO → Supplier kirim → Siklus berulang
```

---

## 16. EMAIL NOTIFICATION & TRANSPARANSI LAYANAN

### 16.1 Perbandingan Fitur vs Kondisi Saat Ini

| Fitur | Status di review.md | Keterangan |
|---|---|---|
| Field `email` di tabel `users` | ✅ Ada | `users.email` + `email_verified_at` |
| Tabel `notifications` | ✅ Ada | Tabel #36 — notifikasi in-app |
| `NotificationService (FCM + Email + WA)` | ✅ Ada | Arsitektur Target (Section 2.2) |
| `MustVerifyEmail` | ✅ Ada | Section 10.1 Keamanan |
| Roadmap "Notification (email + WhatsApp)" | ✅ Ada | Fase 4 |
| **Tabel `email_templates`** | ❌ Belum Ada | Template email per jenis transaksi |
| **Tabel `email_logs`** | ❌ Belum Ada | Riwayat pengiriman email |
| **Tabel `email_preferences`** | ❌ Belum Ada | Pengaturan email per user (opt-in/opt-out) |
| **Detail notifikasi email per transaksi** | ❌ Belum Ada | Tidak ada daftar transaksi apa saja yang dikirim ke email |
| **Email transparansi untuk Customer & Hub** | ❌ Belum Ada | Tidak ada detail email untuk order, payment, delivery, dll |

### 16.2 Skema Database Tambahan (3 Tabel Baru)

```php
// 73. email_templates — Template email per jenis transaksi
Schema::create('email_templates', function ($table) {
    $table->id();
    $table->string('code')->unique();       // order_confirmed, payment_received, dll
    $table->string('name');
    $table->enum('recipient', ['customer', 'hub', 'superadmin']);
    $table->string('subject');
    $table->text('body');                    // HTML template
    $table->json('variables')->nullable();   // [order_code, total_points, dll]
    $table->boolean('is_active')->default(true);
    $table->timestamps();
});

// 74. email_logs — Riwayat pengiriman email
Schema::create('email_logs', function ($table) {
    $table->id();
    $table->foreignId('user_id')->constrained();
    $table->string('recipient_email');
    $table->string('template_code');
    $table->string('subject');
    $table->enum('status', ['pending', 'sent', 'failed', 'opened'])->default('pending');
    $table->text('error_message')->nullable();
    $table->morphs('reference');             // order_id, payment_id, delivery_id, dll
    $table->timestamp('sent_at')->nullable();
    $table->timestamp('opened_at')->nullable();
    $table->timestamps();
});

// 75. email_preferences — Pengaturan email per user
Schema::create('email_preferences', function ($table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->cascadeOnDelete();
    $table->boolean('order_updates')->default(true);
    $table->boolean('payment_notifications')->default(true);
    $table->boolean('delivery_tracking')->default(true);
    $table->boolean('subscription_reminders')->default(true);
    $table->boolean('promo_newsletter')->default(false);
    $table->boolean('stock_alerts')->default(true);      // untuk Hub
    $table->boolean('purchase_orders')->default(true);   // untuk Hub
    $table->timestamps();
});
```

### 16.3 Daftar Notifikasi Email per Transaksi (Transparansi Layanan)

**👤 Customer (10 email):**
| # | Event | Email Subject | Kapan Dikirim |
|---|---|---|---|
| 1 | Order Dibuat | ✅ Pesanan #ORD-xxx Diterima | Setelah checkout |
| 2 | Pembayaran Diterima | 💳 Pembayaran #ORD-xxx Berhasil | Poin/tunai diterima |
| 3 | Order Diproses | 📦 Pesanan #ORD-xxx Sedang Diproses | Warehouse mulai proses |
| 4 | Order Dikirim | 🚚 Pesanan #ORD-xxx Dalam Perjalanan | Kurir di-assign |
| 5 | Order Diterima | 🎉 Pesanan #ORD-xxx Telah Diterima | Customer terima paket |
| 6 | Top-Up Poin | 💰 Top-Up Poin Berhasil | Top-up sukses |
| 7 | Poin Hampir Kadaluarsa | ⏰ Poin Anda Akan Kadaluarsa | 7 hari sebelum expired |
| 8 | Subscription Tagihan | 📅 Tagihan Subscription #SUB-xxx | Auto-renewal |
| 9 | Komplain Dibalas | 💬 Komplain #CMP-xxx Telah Dibalas | CS merespon |
| 10 | Reward Diklaim | 🎁 Reward #RWD-xxx Berhasil Diklaim | Klaim reward |

**🏪 Hub (8 email):**
| # | Event | Email Subject | Kapan Dikirim |
|---|---|---|---|
| 1 | Order Stok Masuk | 📦 Order Stok #SO-xxx Telah Tiba | Stok diterima |
| 2 | Stok Menipis | ⚠️ Stok Menipis: [Produk] | Stok ≤ ROP |
| 3 | Purchase Order Dibuat | 📄 PO #PO-xxx Dibuat | PO dikirim ke supplier |
| 4 | PO Disetujui | ✅ PO #PO-xxx Disetujui | Approval selesai |
| 5 | Delivery Selesai | 🚚 Delivery #DLV-xxx Selesai | Kurir selesai antar |
| 6 | Fee Report Bulanan | 📊 Laporan Fee Bulan Ini | Awal bulan |
| 7 | Komplain Baru | 📩 Komplain Baru di Hub Anda | Customer komplain |
| 8 | Laporan Penjualan | 📈 Ringkasan Penjualan Mingguan | Setiap Senin |

### 16.4 Alur Pengiriman Email

```
TRANSAKSI TERJADI (Order, Payment, Delivery, dll)
        │
        ▼
SISTEM DETEKSI EVENT + CEK EMAIL_PREFERENCES
        │
        ├─ User aktifkan email? → YA → Lanjut
        │                        └─ TIDAK → Skip
        ▼
AMBIL TEMPLATE (email_templates) + ISI VARIABLES
        │
        ▼
KIRIM VIA NotificationService (Email)
        │
        ▼
CATAT KE email_logs (status: sent/failed/opened)
```

### 16.5 Halaman Baru yang Perlu Dibuat

| Halaman | Path | Fungsi |
|---|---|---|
| Email Templates | `superadmin/email-templates.html` | CRUD template email |
| Email Logs | `superadmin/email-logs.html` | Riwayat pengiriman email |
| Email Preferences | `customer/email-preferences.html` | Pengaturan email customer |
| Email Preferences Hub | `hub/email-preferences.html` | Pengaturan email hub |

### 16.6 Prioritas Implementasi

| Prioritas | Fitur | Minggu |
|---|---|---|
| 🔴 **Tinggi** | Email Templates + Email Logs + Email Preferences | 8-9 |
| 🟡 **Sedang** | Notifikasi email Customer (10 jenis) | 9-10 |
| 🟢 **Rendah** | Notifikasi email Hub (8 jenis) | 10 |

---

## 17. INTEGRASI MODUL KEUANGAN & LOYALTY

### 17.1 Diagram Relasi Modul Keuangan & Loyalty

```
┌─────────────────────────────────────────────────────────────────┐
│                    MODUL KEUANGAN & LOYALTY                      │
│                                                                 │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐  │
│  │  SALES   │───▶│  FEE     │───▶│ACCOUNTING│◀───│   RAB    │  │
│  │ (orders) │    │ (67/33)  │    │ (jurnal) │    │ (budget) │  │
│  └────┬─────┘    └────┬─────┘    └────┬─────┘    └────┬─────┘  │
│       │               │               │               │        │
│       ▼               ▼               ▼               ▼        │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐  │
│  │  POINT   │───▶│MEMBERSHIP│───▶│  REWARD  │    │  HUB     │  │
│  │ (wallet) │    │  (tier)  │    │ (klaim)  │    │ (cabang) │  │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### 17.2 Relasi yang SUDAH ADA

| Modul | Tabel Relasi | Status | Keterangan |
|---|---|---|---|
| **Sales → Order** | `orders`, `order_items` | ✅ Terkoneksi | Sales dashboard dari data order |
| **Sales → Accounting** | `journal_entries` (morphs transactable) | ✅ Terkoneksi | Order → jurnal otomatis |
| **Sales → Fee** | `fee_calculations.order_id` | ✅ Terkoneksi | Fee split 67/33 dari order |
| **Sales → Point** | `point_transactions` (morphs source) | ✅ Terkoneksi | Pembayaran order pakai poin |
| **RAB → Accounting** | `rab_items.account_id` | ✅ Terkoneksi | Budget per akun COA |
| **Point → Accounting** | `journal_entries` (liabilitas poin) | ✅ Terkoneksi | Top-up → jurnal liability |
| **Fee → Accounting** | `fee_calculations` → jurnal | ✅ Terkoneksi | Fee split → jurnal |
| **Fee → Hub** | `fee_calculations.hub_id` | ✅ Terkoneksi | Fee per hub |
| **Accounting → Semua** | `journal_entries` (morphs) | ✅ Terkoneksi | Semua transaksi bisa dijurnal |

### 17.3 Relasi yang KURANG / BELUM ADA

| Modul | Kekurangan | Dampak |
|---|---|---|
| **Membership/Tier → Customer** | Tidak ada `customer_tier_history` | Tidak bisa lacak riwayat naik/turun tier |
| **Membership/Tier → Point** | Tidak ada otomatisasi upgrade tier berdasarkan `lifetime_earned` | Tier tidak otomatis naik |
| **Reward → Point** | Tidak ada `reward_redemptions` | Tidak bisa lacak riwayat klaim reward |
| **Sales → RAB** | Tidak ada `sales_targets` | Tidak bisa bandingkan target vs realisasi |
| **RAB → Realisasi** | Tidak ada `rab_actuals` | Budget vs actual tidak otomatis |
| **Point → Expiry** | Tidak ada `point_expiry_rules` | Aturan kadaluarsa poin tidak terstruktur |
| **Fee → Payout** | Tidak ada `fee_payouts` | Pembayaran fee ke hub tidak tercatat |
| **Loyalty → Event** | Tidak ada `loyalty_events` | Bonus poin/cashback tidak terstruktur |

### 17.4 Skema Database Tambahan (8 Tabel Baru)

```php
// 76. customer_tier_history — Riwayat naik/turun tier membership
Schema::create('customer_tier_history', function ($table) {
    $table->id();
    $table->foreignId('customer_profile_id')->constrained()->cascadeOnDelete();
    $table->foreignId('from_tier_id')->nullable()->constrained('membership_tiers');
    $table->foreignId('to_tier_id')->constrained('membership_tiers');
    $table->enum('reason', ['auto_upgrade', 'auto_downgrade', 'manual', 'promotion']);
    $table->decimal('total_spend_at_change', 15, 2);
    $table->bigInteger('total_points_at_change');
    $table->string('changed_by')->nullable();
    $table->timestamp('changed_at');
    $table->timestamps();
});

// 77. reward_redemptions — Riwayat klaim reward
Schema::create('reward_redemptions', function ($table) {
    $table->id();
    $table->string('redemption_code')->unique();
    $table->foreignId('customer_profile_id')->constrained();
    $table->foreignId('reward_id')->constrained();
    $table->bigInteger('points_spent');
    $table->enum('status', ['pending', 'processed', 'shipped', 'completed', 'cancelled'])->default('pending');
    $table->foreignId('order_id')->nullable()->constrained();
    $table->timestamp('redeemed_at');
    $table->timestamp('processed_at')->nullable();
    $table->timestamps();
});

// 78. sales_targets — Target penjualan per periode
Schema::create('sales_targets', function ($table) {
    $table->id();
    $table->foreignId('hub_id')->nullable()->constrained();
    $table->foreignId('warehouse_id')->nullable()->constrained();
    $table->year('year');
    $table->enum('period', ['monthly', 'quarterly', 'yearly']);
    $table->integer('period_month')->nullable();
    $table->decimal('target_amount', 15, 2);
    $table->decimal('actual_amount', 15, 2)->default(0);
    $table->decimal('achievement_percent', 5, 2)->default(0);
    $table->timestamps();
});

// 79. rab_actuals — Realisasi RAB vs actual
Schema::create('rab_actuals', function ($table) {
    $table->id();
    $table->foreignId('rab_item_id')->constrained()->cascadeOnDelete();
    $table->foreignId('journal_entry_id')->nullable()->constrained();
    $table->decimal('actual_amount', 15, 2);
    $table->date('transaction_date');
    $table->text('description')->nullable();
    $table->string('created_by');
    $table->timestamps();
});

// 80. point_expiry_rules — Aturan kadaluarsa poin
Schema::create('point_expiry_rules', function ($table) {
    $table->id();
    $table->string('name');
    $table->integer('validity_days')->default(365);
    $table->enum('grace_period', ['none', '7_days', '14_days', '30_days'])->default('7_days');
    $table->boolean('is_active')->default(true);
    $table->timestamps();
});

// 81. fee_payouts — Pembayaran fee ke hub
Schema::create('fee_payouts', function ($table) {
    $table->id();
    $table->string('payout_code')->unique();
    $table->foreignId('hub_id')->constrained();
    $table->decimal('total_amount', 15, 2);
    $table->enum('status', ['pending', 'approved', 'paid', 'rejected'])->default('pending');
    $table->date('payout_period_start');
    $table->date('payout_period_end');
    $table->string('bank_account')->nullable();
    $table->timestamp('paid_at')->nullable();
    $table->string('approved_by')->nullable();
    $table->timestamps();
});

// 82. loyalty_events — Event loyalty (bonus/cashback)
Schema::create('loyalty_events', function ($table) {
    $table->id();
    $table->string('event_code')->unique();
    $table->string('name');
    $table->enum('type', ['bonus_points', 'cashback', 'multiplier', 'special_discount']);
    $table->decimal('value', 10, 2);
    $table->date('start_date');
    $table->date('end_date');
    $table->boolean('is_active')->default(true);
    $table->timestamps();
});

// 83. accounting_reports — Laporan keuangan otomatis
Schema::create('accounting_reports', function ($table) {
    $table->id();
    $table->string('report_code')->unique();
    $table->enum('type', ['balance_sheet', 'profit_loss', 'cash_flow', 'fee_report', 'point_liability', 'rab_realization', 'ppn']);
    $table->date('period_start');
    $table->date('period_end');
    $table->json('report_data');
    $table->string('generated_by');
    $table->timestamp('generated_at');
    $table->timestamps();
});
```

### 17.5 Field Tambahan pada Tabel Existing

| Tabel | Field Baru | Koneksi |
|---|---|---|
| `membership_tiers` | `auto_upgrade` | Otomatis upgrade tier |
| `point_wallets` | `expiry_date` | Kadaluarsa poin |
| `fee_calculations` | `payout_status` | Status pembayaran fee |
| `rabs` | `actual_amount` | Realisasi otomatis |
| `rewards` | `redemption_count` | Jumlah klaim |

### 17.6 Alur Integrasi Keuangan & Loyalty

```
ORDER SELESAI
  ├─ Sales: total penjualan bertambah
  ├─ Fee: hitung 67/33 → fee_calculations
  ├─ Point: cashback/bonus → point_wallets
  ├─ Membership: cek total_spend → auto upgrade tier
  ├─ Reward: customer bisa klaim reward
  ├─ Accounting: jurnal otomatis
  └─ RAB: actual_amount bertambah

TOP-UP POIN
  ├─ Point: balance bertambah
  ├─ Accounting: jurnal liability
  └─ Expiry: point_expiry_rules → expires_at

FEE PAYOUT
  ├─ Fee: fee_calculations → fee_payouts
  ├─ Hub: terima pembayaran
  └─ Accounting: jurnal pembayaran
```

### 17.7 Halaman Baru yang Perlu Dibuat

| Halaman | Path | Fungsi |
|---|---|---|
| Tier History | `superadmin/tier-history.html` | Riwayat naik/turun tier |
| Reward Redemptions | `superadmin/reward-redemptions.html` | Riwayat klaim reward |
| Sales Targets | `superadmin/sales-targets.html` | Target vs realisasi penjualan |
| RAB Actuals | `superadmin/rab-actuals.html` | Realisasi RAB otomatis |
| Fee Payouts | `superadmin/fee-payouts.html` | Pembayaran fee ke hub |
| Loyalty Events | `superadmin/loyalty-events.html` | Event bonus/cashback |
| Accounting Reports | `superadmin/accounting-reports.html` | Laporan keuangan otomatis |

### 17.8 Prioritas Implementasi

| Prioritas | Fitur | Minggu |
|---|---|---|
| 🔴 **Tinggi** | Tier History, Reward Redemptions, Fee Payouts | 11-12 |
| 🟡 **Sedang** | Sales Targets, RAB Actuals, Point Expiry | 12-13 |
| 🟢 **Rendah** | Loyalty Events, Accounting Reports | 13 |

---

## 18. DELIVERY MANAGEMENT & INTEGRASI

### 18.1 Perbandingan Fitur vs Kondisi Saat Ini

| Fitur | Status di review.md | Keterangan |
|---|---|---|
| Tabel `couriers` (#27) | ✅ Ada | Kurir + status (available/on_duty/off) |
| Tabel `deliveries` (#28) | ✅ Ada | Pengiriman + status sederhana |
| Tabel `delivery_tracking` (#29) | ✅ Ada | Timeline tracking |
| Section 7 — Skema Pengiriman (7 tahap) | ✅ Ada | Alur Pusat → Hub → Customer |
| Section 8 — Mockup tracking | ✅ Ada | `order-tracking.html` |
| Email delivery tracking (Section 16) | ✅ Ada | Email "Order Dikirim" & "Order Diterima" |
| **Tabel `delivery_zones`** | ❌ Belum Ada | Zona pengiriman per hub |
| **Tabel `delivery_routes`** | ❌ Belum Ada | Rute kurir optimal |
| **Tabel `delivery_attempts`** | ❌ Belum Ada | Riwayat percobaan pengiriman |
| **Tabel `delivery_proofs`** | ❌ Belum Ada | Bukti foto/ttd penerimaan |
| **Tabel `delivery_schedules`** | ❌ Belum Ada | Jadwal pengiriman |
| **Tabel `delivery_returns`** | ❌ Belum Ada | Retur/pengembalian barang |
| **Integrasi WMS Outbound** | ⚠️ Sebagian | Ada `packing_orders` tapi belum terhubung ke `deliveries` |
| **Integrasi Order** | ✅ Ada | `deliveries.order_id` |
| **Integrasi Hub** | ✅ Ada | `deliveries.hub_id` |
| **Integrasi Kurir** | ✅ Ada | `deliveries.courier_id` |
| **Integrasi Alamat** | ✅ Ada | `deliveries.address_id` |

### 18.2 Skema Database Tambahan (6 Tabel Baru)

```php
// 84. delivery_zones — Zona pengiriman per hub
Schema::create('delivery_zones', function ($table) {
    $table->id();
    $table->foreignId('hub_id')->constrained()->cascadeOnDelete();
    $table->string('name');
    $table->string('city');
    $table->string('district');
    $table->decimal('latitude', 10, 7);
    $table->decimal('longitude', 10, 7);
    $table->integer('radius_km')->default(5);
    $table->decimal('delivery_fee', 15, 2)->default(0);
    $table->boolean('is_active')->default(true);
    $table->timestamps();
});

// 85. delivery_routes — Rute kurir optimal
Schema::create('delivery_routes', function ($table) {
    $table->id();
    $table->string('route_code')->unique();
    $table->foreignId('hub_id')->constrained();
    $table->foreignId('courier_id')->nullable()->constrained();
    $table->date('route_date');
    $table->json('stops');                    // [{delivery_id, sequence, address}]
    $table->decimal('total_distance_km', 10, 2)->default(0);
    $table->decimal('estimated_duration_min', 10, 2)->default(0);
    $table->enum('status', ['planned', 'in_progress', 'completed', 'cancelled'])->default('planned');
    $table->timestamp('started_at')->nullable();
    $table->timestamp('completed_at')->nullable();
    $table->timestamps();
});

// 86. delivery_attempts — Riwayat percobaan pengiriman
Schema::create('delivery_attempts', function ($table) {
    $table->id();
    $table->foreignId('delivery_id')->constrained()->cascadeOnDelete();
    $table->integer('attempt_number')->default(1);
    $table->timestamp('attempted_at');
    $table->enum('result', ['success', 'failed', 'rescheduled']);
    $table->string('failure_reason')->nullable();
    $table->text('notes')->nullable();
    $table->string('attempted_by');
    $table->timestamps();
});

// 87. delivery_proofs — Bukti foto/ttd penerimaan
Schema::create('delivery_proofs', function ($table) {
    $table->id();
    $table->foreignId('delivery_id')->constrained()->cascadeOnDelete();
    $table->string('proof_photo')->nullable();
    $table->string('recipient_signature')->nullable();
    $table->string('recipient_name');
    $table->string('recipient_phone', 20)->nullable();
    $table->text('notes')->nullable();
    $table->timestamp('proof_at');
    $table->timestamps();
});

// 88. delivery_schedules — Jadwal pengiriman
Schema::create('delivery_schedules', function ($table) {
    $table->id();
    $table->foreignId('hub_id')->constrained();
    $table->foreignId('delivery_zone_id')->constrained();
    $table->enum('day_of_week', ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']);
    $table->time('start_time');
    $table->time('end_time');
    $table->integer('max_deliveries')->default(20);
    $table->boolean('is_active')->default(true);
    $table->timestamps();
});

// 89. delivery_returns — Retur/pengembalian barang
Schema::create('delivery_returns', function ($table) {
    $table->id();
    $table->string('return_code')->unique();
    $table->foreignId('delivery_id')->constrained();
    $table->foreignId('order_id')->constrained();
    $table->enum('reason', ['wrong_item', 'damaged', 'expired', 'customer_refused', 'other']);
    $table->text('description')->nullable();
    $table->enum('status', ['requested', 'approved', 'picked_up', 'returned', 'refunded', 'rejected'])->default('requested');
    $table->foreignId('returned_by')->nullable()->constrained('users');
    $table->timestamp('requested_at');
    $table->timestamp('processed_at')->nullable();
    $table->timestamps();
});
```

### 18.3 Field Tambahan pada Tabel Existing

| Tabel | Field Baru | Koneksi |
|---|---|---|
| `deliveries` | `packing_order_id` | WMS Outbound → Delivery |
| `deliveries` | `delivery_zone_id` | Delivery → Zona |
| `deliveries` | `route_id` | Delivery → Rute |
| `deliveries` | `estimated_delivery_date` | ETA |
| `deliveries` | `actual_delivery_date` | Realisasi |
| `deliveries` | `proof_photo` | Bukti foto |
| `deliveries` | `recipient_signature` | TTD penerima |
| `couriers` | `current_latitude`, `current_longitude` | Live tracking GPS |

### 18.4 Alur Integrasi Delivery (End-to-End)

```
ORDER SELESAI → PACKING (WMS) → DELIVERY DIBUAT
  → Assign kurir → Pilih rute → Kirim
  → Live tracking (GPS) → Delivery attempt
  → Bukti foto/ttd → Selesai
  → Jika gagal → Retur / Reschedule
```

### 18.5 Halaman Baru yang Perlu Dibuat

| Halaman | Path | Fungsi |
|---|---|---|
| Delivery Zones | `hub/delivery-zones.html` | Zona pengiriman per hub |
| Delivery Routes | `hub/delivery-routes.html` | Rute kurir optimal |
| Delivery Attempts | `hub/delivery-attempts.html` | Riwayat percobaan pengiriman |
| Delivery Proofs | `hub/delivery-proofs.html` | Bukti foto/ttd penerimaan |
| Delivery Schedules | `hub/delivery-schedules.html` | Jadwal pengiriman |
| Delivery Returns | `hub/delivery-returns.html` | Retur/pengembalian barang |

### 18.6 Prioritas Implementasi

| Prioritas | Fitur | Minggu |
|---|---|---|
| 🔴 **Tinggi** | Delivery Zones + Delivery Routes | 8-9 |
| 🟡 **Sedang** | Delivery Attempts + Delivery Proofs | 9-10 |
| 🟢 **Rendah** | Delivery Schedules + Delivery Returns | 10 |

---

## 19. PAYMENT & SUBSCRIPTION MANAGEMENT

---

## 20. PENYEDERHANAAN DASHBOARD SUPERADMIN (16 Agustus 2026)

> **Tujuan:** Sederhanakan dashboard superadmin agar mudah dioperasikan operator. Menu sidebar digabung dari 12 group / 70+ menu menjadi **3 group / 19 menu** sesuai rencana awal (`superadmin_rencana awal/`). Halaman WMS/Pengadaan/Keuangan detail tetap ada di folder, hanya tidak lagi tampil di menu.

### 20.1 Menu Sidebar Superadmin (3 Group / 19 Menu)

**📊 Dashboard (8 menu)**
| Menu | File |
|---|---|
| Utama | `dashboard.html` |
| Warehouse Internal | `dashboard-warehouse-internal.html` |
| Warehouse External | `dashboard-warehouse-external.html` |
| Sales | `dashboard-sales.html` |
| Penyusunan RAB | `dashboard-rabs.html` |
| Saldo / Point | `dashboard-points-balance.html` |
| Fee | `dashboard-fee.html` |
| Accounting | `dashboard-accounting.html` |

**🗂️ Master Data (8 menu)**
| Menu | File |
|---|---|
| Membership & Tier | `membership-tiers.html` |
| Points | `point-transactions.html` |
| Reward | `rewards.html` |
| Produk | `products.html` |
| Promo / Event | `promos.html` |
| Hub | `hubs.html` |
| Customer | `customers.html` |
| User & Role | `users.html` |

**⚙️ Operasional (3 menu)**
| Menu | File |
|---|---|
| Payment | `payments.html` |
| Subscription | `subscription-management.html` |
| Pengaduan / CS | `complaints.html` |

### 20.2 File yang Diubah
- **`js/superadmin-layout.js`** — Sidebar sederhanakan menjadi 3 group / 19 menu; update `FILE_TO_MENU` + `FILE_TO_GROUP`
- **`js/superadmin-data.js`** — Aktiver CRUD (`hasCrud: true` + `modalFields`) pada modul: `point-transactions`, `payments`, `subscription-management`, `complaints`

### 20.3 Fitur Lengkap
Semua 19 halaman superadmin mendukung:
- ✅ CRUD (tambah/edit/hapus via modal + localStorage)
- ✅ Pagination (5/10/25 per halaman)
- ✅ Chart (line, doughnut, bar, area via Chart.js)
- ✅ Card stat (4 kartu ringkasan)
- ✅ Searching (pencarian realtime)
- ✅ Filter (dropdown + filter tanggal + filter chip)

---

## 21. PENYUSUNA RAB PER PRODUK (16 Agustus 2026)

> **Tujuan:** Harga jual produk dihasilkan dari penyusuna RAB (Rencana Anggaran Biaya) per produk. Komponen persen RAB ditambahkan ke modal produk, harga jual otomatis dihitung dan dikonversi ke point (1 pts = Rp 1).

### 21.1 Komponen RAB per Produk
| Komponen | Field | Deskripsi |
|---|---|---|
| Fee | `feePercent` | Persentase fee dari harga biaya |
| Diskon Member | `memberDiscountPercent` | Persentase diskon member |
| Diskon Lainnya | `otherDiscountPercent` | Persentase diskon lainnya |
| Biaya Operasional | `operationalCostPercent` | Persentase biaya operasional |
| Biaya Lainnya | `otherCostPercent` | Persentase biaya lainnya |
| Overhead | `overheadPercent` | Persentase overhead |

### 21.2 Rumus Perhitungan
```
Harga Jual = Harga Biaya × (1 + (Fee% + Diskon Member% + Diskon Lainnya% + Biaya Operasional% + Biaya Lainnya% + Overhead%) / 100)
Point = Harga Jual (1 pts = Rp 1)
```

### 21.3 File yang Diubah
- **`js/superadmin-layout.js`** — Pindahkan menu **"Penyusunan RAB"** (`dashboard-rabs.html`) dari grup **Dashboard** ke grup **Master Data**
- **`js/superadmin-data.js`** — Modul `products` kini memiliki:
  - Kolom **Harga Biaya** (`price`) + **Harga Jual** (`sellingPrice`) + **Harga Poin** (`points`)
  - Field RAB per produk: `feePercent`, `memberDiscountPercent`, `otherDiscountPercent`, `operationalCostPercent`, `otherCostPercent`, `overheadPercent`
  - `modalFields` input RAB per produk
- **`js/superadmin-core.js`** — Kalkulasi RAB realtime saat modal produk terbuka:
  - `RAB_FIELDS` — daftar 6 komponen persen RAB
  - `calcRab()` — hitung `sellingPrice` & `points` otomatis saat input persen berubah
  - `Point = Harga Jual` (1 pts = Rp 1)

---

## 22. RESTRUKTURISASI MENU STOK & GUDANG (16 Agustus 2026)

> **Tujuan:** Mempermudah operator. Hapus halaman Penyusunan RAB (dashboard-rabs.html) yang tidak diperlukan, kelompokkan dashboard warehouse + manajemen stok ke grup baru "Stok & Gudang", tambah Master Supplier di menu, tambah foto produk untuk katalog publik.

### 22.1 Struktur Menu Superadmin (4 Group / 20 Menu)
```
📊 Dashboard (5): Utama, Sales, Saldo/Point, Fee, Accounting
🗂️ Master Data (9): Membership & Tier, Points, Reward, Produk, Supplier, Promo/Event, Hub, Customer, User & Role
🏭 Stok & Gudang (3): Manajemen Stok, Warehouse Internal, Warehouse External
⚙️ Operasional (3): Payment, Subscription, Pengaduan/CS
```

### 22.2 Perubahan
- **Hapus** file `dashboard/superadmin/dashboard-rabs.html` (tidak diperlukan)
- **`js/superadmin-layout.js`** — Update struktur menu sesuai di bawah; `dashboard-warehouse-internal.html` & `dashboard-warehouse-external.html` dipindah ke group **Stok & Gudang**; tambah menu **Kategori** di Master Data
- **`js/superadmin-data.js`** (baru) — Modul **`stock-management`**:
  - Card stat: Total SKU, Stok Menipis, Stok Habis, Total Terjual
  - Kolom: Produk, SKU, Kategori, Stok, Min Stok, Terjual, Status
  - CRUD + filter kategori/status + search + pagination
- **`js/superadmin-data.js`** (edits) — Modul `products`:
  - Tambah kolom **Foto** (`type: 'image'`) + field URL foto
  - **Kategori dinamis** dari Master Kategori (`dynamicSource: 'categories'`)
  - **Supplier** baru + kolom + data (`dynamicSource: 'suppliers'`)
  - **SKU otomatis** (`PRD-001`, dll) saat tambah
  - **Stok & Min Stok** dihapus dari form produk
- **`js/superadmin-core.js`** — Support `type: 'image'` thumbnail + **searchable dropdown** (input pencarian realtime memfilter opsi Kategori/Supplier dengan navigasi keyboard ↑/↓) + SKU otomatis
- **`dashboard/superadmin/stock-management.html`** (baru) — Halaman Manajemen Stok

### 22.3 Searchable Dropdown (Kategori & Supplier)
Form modal **Tambah/Edit Produk** kini memiliki:
- **Kategori** — dropdown + input pencarian, diambil dari Master Data Kategori (`categories`)
- **Supplier** — dropdown + input pencarian, diambil dari Master Data Supplier (`suppliers`)
- Saat mengetik di kolom pencarian, opsi difilter realtime (mis. ketik "Semb" → tampil "Sembako")

### 22.3 Searchable Dropdown (Kategori & Supplier)
Form modal **Tambah/Edit Produk** kini memiliki:
- **Kategori** — dropdown + input pencarian, diambil dari Master Data Kategori (`categories`)
- **Supplier** — dropdown + input pencarian, diambil dari Master Data Supplier (`suppliers`)
- Saat mengetik di kolom pencarian, opsi difilter realtime (mis. ketik "Semb" → tampil "Sembako")

---

## 23. MASTER KONVERSI RUPIAH KE POINT (16 Agustus 2026)

> **Tujuan:** Menambahkan master konversi Rupiah ke Point (nilai tukar Rp → Poin) yang dapat dikonfigurasi oleh operator. Konversi point pada Kalkulasi RAB per produk menggunakan rate aktif dari master ini.

### 23.1 Modul Baru — `currency-conversion`
- **Card stat:** Rate Aktif, Total Konfigurasi, Poin Beredar, Total Transaksi
- **Kolom:** Nama Konfigurasi, Rate (Rp / 1 Poin), Berlaku Sejak, Status
- **Data demo:** Rate Standar 2026 (1 Poin = Rp 1, Aktif), Rate Promo HUT (1 Poin = Rp 5, Nonaktif), Rate Awal 2024 (1 Poin = Rp 10, Nonaktif), Rate Legacy 2023 (1 Poin = Rp 100, Nonaktif)
- **CRUD lengkap** + filter + search + pagination

### 23.2 Rumus Konversi
```
Harga Jual (Rp) ÷ Rate (Rp per 1 Poin) = Point
Contoh: Harga Jual Rp 93.500 ÷ Rp 1 = 93.500 pts
        Harga Jual Rp 93.500 ÷ Rp 5 = 18.700 pts
```

### 23.3 File yang Diubah
- **`js/superadmin-layout.js`** — Tambah menu **"Konversi Rupiah ke Point"** (`currency-conversion.html`) di grup **Master Data**
- **`js/superadmin-data.js`** — Modul baru **`currency-conversion`** dengan CRUD lengkap
- **`dashboard/superadmin/currency-conversion.html`** (BARU) — Halaman master konversi
- **`js/superadmin-core.js`** — Fungsi `getConversionRate()` membaca rate aktif dari localStorage (`jastip_sa_currency-conversion`), fallback `1 Poin = Rp 1`; `calcRab()` menggunakan rate tersebut

### 19.1 Perbandingan Fitur vs Kondisi Saat Ini

**A. Modul Payment**
| Fitur | Status di review.md | Keterangan |
|---|---|---|
| Tabel `payment_methods` (#22) | ✅ Ada | Metode: Poin, Cash, QRIS, E-Wallet, VA, Transfer |
| Tabel `payments` (#23) | ✅ Ada | Transaksi pembayaran + status |
| Integrasi → Order | ✅ Ada | `payments.order_id` |
| Integrasi → Customer | ✅ Ada | `payments.customer_profile_id` |
| Integrasi → Payment Gateway | ✅ Ada | `external_id`, `payment_url`, `gateway_response` |
| Integrasi → Accounting | ✅ Ada | Jurnal otomatis (Section 9.4) |
| Integrasi → Point | ✅ Ada | Pembayaran pakai poin |
| Email notif pembayaran (Section 16) | ✅ Ada | Email "Pembayaran Diterima" |
| **Tabel `payment_refunds`** | ❌ Belum Ada | Riwayat refund pembayaran |
| **Tabel `payment_installments`** | ❌ Belum Ada | Cicilan pembayaran |
| **Tabel `payment_reconciliation`** | ❌ Belum Ada | Rekonsiliasi dengan bank/gateway |
| **Tabel `payment_webhooks`** | ❌ Belum Ada | Log webhook dari gateway |

**B. Modul Subscription**
| Fitur | Status di review.md | Keterangan |
|---|---|---|
| Tabel `subscription_plans` (#24) | ✅ Ada | Paket + harga + bonus poin |
| Tabel `subscriptions` (#25) | ✅ Ada | Langganan customer |
| Tabel `subscription_cycles` (#26) | ✅ Ada | Siklus tagihan |
| Integrasi → Customer | ✅ Ada | `subscriptions.customer_profile_id` |
| Integrasi → Hub | ✅ Ada | `subscriptions.hub_id` |
| Integrasi → Address | ✅ Ada | `subscriptions.address_id` |
| Integrasi → Order | ✅ Ada | `subscription_cycles.order_id` |
| Email tagihan (Section 16) | ✅ Ada | Email "Subscription Tagihan" |
| Cron auto-renewal | ⚠️ Sebagian | Disebut Fase 4 tapi belum detail |
| **Tabel `subscription_plan_items`** | ❌ Belum Ada | Detail produk per paket (JSON saat ini) |
| **Tabel `subscription_pauses`** | ❌ Belum Ada | Riwayat pause/jeda langganan |
| **Tabel `subscription_upgrades`** | ❌ Belum Ada | Riwayat upgrade/downgrade paket |
| **Tabel `subscription_failures`** | ❌ Belum Ada | Log gagal bayar |
| **Tabel `subscription_billing_attempts`** | ❌ Belum Ada | Riwayat percobaan tagihan |
| Auto-renewal detail alur | ⚠️ Sebagian | Ada di Section 6.3 tapi belum detail |

### 19.2 Skema Database Tambahan (9 Tabel Baru)

```php
// 90. payment_refunds — Riwayat refund pembayaran
Schema::create('payment_refunds', function ($table) {
    $table->id();
    $table->string('refund_code')->unique();
    $table->foreignId('payment_id')->constrained()->cascadeOnDelete();
    $table->decimal('refund_amount', 15, 2);
    $table->enum('reason', ['cancelled', 'damaged', 'wrong_item', 'customer_request', 'other']);
    $table->enum('status', ['requested', 'approved', 'processed', 'rejected'])->default('requested');
    $table->string('refund_method');
    $table->string('processed_by')->nullable();
    $table->timestamp('requested_at');
    $table->timestamp('processed_at')->nullable();
    $table->timestamps();
});

// 91. payment_installments — Cicilan pembayaran
Schema::create('payment_installments', function ($table) {
    $table->id();
    $table->foreignId('payment_id')->constrained()->cascadeOnDelete();
    $table->integer('total_installments')->default(1);
    $table->integer('current_installment')->default(1);
    $table->decimal('installment_amount', 15, 2);
    $table->date('due_date');
    $table->date('paid_date')->nullable();
    $table->enum('status', ['pending', 'paid', 'overdue', 'cancelled'])->default('pending');
    $table->timestamps();
});

// 92. payment_reconciliation — Rekonsiliasi bank/gateway
Schema::create('payment_reconciliation', function ($table) {
    $table->id();
    $table->date('reconciliation_date');
    $table->foreignId('payment_method_id')->constrained();
    $table->decimal('system_amount', 15, 2);
    $table->decimal('bank_amount', 15, 2);
    $table->decimal('difference_amount', 15, 2);
    $table->enum('status', ['matched', 'unmatched', 'in_progress'])->default('in_progress');
    $table->text('notes')->nullable();
    $table->string('reconciled_by');
    $table->timestamps();
});

// 93. payment_webhooks — Log webhook dari gateway
Schema::create('payment_webhooks', function ($table) {
    $table->id();
    $table->string('event_type');
    $table->foreignId('payment_id')->nullable()->constrained();
    $table->json('payload');
    $table->enum('status', ['received', 'processed', 'failed']);
    $table->text('error_message')->nullable();
    $table->timestamp('received_at');
    $table->timestamp('processed_at')->nullable();
    $table->timestamps();
});

// 94. subscription_plan_items — Detail produk per paket
Schema::create('subscription_plan_items', function ($table) {
    $table->id();
    $table->foreignId('subscription_plan_id')->constrained()->cascadeOnDelete();
    $table->foreignId('product_id')->constrained();
    $table->foreignId('product_variant_id')->nullable()->constrained();
    $table->integer('qty');
    $table->timestamps();
});

// 95. subscription_pauses — Riwayat jeda langganan
Schema::create('subscription_pauses', function ($table) {
    $table->id();
    $table->foreignId('subscription_id')->constrained()->cascadeOnDelete();
    $table->date('pause_start');
    $table->date('pause_end')->nullable();
    $table->enum('reason', ['customer_request', 'payment_failed', 'holiday', 'other']);
    $table->text('notes')->nullable();
    $table->enum('status', ['active', 'ended', 'cancelled'])->default('active');
    $table->timestamps();
});

// 96. subscription_upgrades — Riwayat upgrade/downgrade paket
Schema::create('subscription_upgrades', function ($table) {
    $table->id();
    $table->foreignId('subscription_id')->constrained()->cascadeOnDelete();
    $table->foreignId('from_plan_id')->constrained('subscription_plans');
    $table->foreignId('to_plan_id')->constrained('subscription_plans');
    $table->enum('type', ['upgrade', 'downgrade']);
    $table->decimal('price_difference', 15, 2);
    $table->date('effective_date');
    $table->string('changed_by');
    $table->timestamps();
});

// 97. subscription_failures — Log gagal bayar
Schema::create('subscription_failures', function ($table) {
    $table->id();
    $table->foreignId('subscription_id')->constrained()->cascadeOnDelete();
    $table->foreignId('subscription_cycle_id')->constrained();
    $table->enum('reason', ['insufficient_points', 'payment_failed', 'gateway_error', 'other']);
    $table->text('error_message')->nullable();
    $table->timestamp('failed_at');
    $table->timestamps();
});

// 98. subscription_billing_attempts — Percobaan tagihan
Schema::create('subscription_billing_attempts', function ($table) {
    $table->id();
    $table->foreignId('subscription_id')->constrained()->cascadeOnDelete();
    $table->foreignId('subscription_cycle_id')->constrained();
    $table->integer('attempt_number')->default(1);
    $table->enum('status', ['success', 'failed']);
    $table->timestamp('attempted_at');
    $table->text('notes')->nullable();
    $table->timestamps();
});
```

### 19.3 Field Tambahan pada Tabel Existing

| Tabel | Field Baru | Koneksi |
|---|---|---|
| `payments` | `refund_amount`, `refunded_at` | Refund |
| `payments` | `installment_plan` | Cicilan |
| `subscription_plans` | `max_pause_days`, `allowed_pauses` | Kebijakan pause |
| `subscriptions` | `next_billing_amount` | Auto-renewal |

### 19.4 Alur Integrasi Payment & Subscription

```
ALUR PEMBAYARAN:
Checkout → Payment (poin/gateway) → Status success/failed
  → Refund (jika perlu) → Rekonsiliasi → Jurnal

ALUR SUBSCRIPTION:
Langganan aktif → Siklus baru → Cek saldo
  → Auto-renewal (poin/gateway) → Sukses → Delivery
  → Gagal → Billing attempt (3x) → Notifikasi → Pause/Cancel
  → Upgrade/Downgrade paket → Riwayat
```

### 19.5 Halaman Baru yang Perlu Dibuat

| Halaman | Path | Fungsi |
|---|---|---|
| Payment Refunds | `superadmin/payment-refunds.html` | Riwayat refund pembayaran |
| Payment Installments | `superadmin/payment-installments.html` | Kelola cicilan pembayaran |
| Payment Reconciliation | `superadmin/payment-reconciliation.html` | Rekonsiliasi bank/gateway |
| Payment Webhooks | `superadmin/payment-webhooks.html` | Log webhook gateway |
| Subscription Plan Items | `superadmin/subscription-plan-items.html` | Detail produk per paket |
| Subscription Pauses | `customer/subscription-pauses.html` | Kelola jeda langganan |
| Subscription Upgrades | `customer/subscription-upgrades.html` | Riwayat upgrade/downgrade |
| Billing Failures | `superadmin/billing-failures.html` | Log gagal bayar |

### 19.6 Prioritas Implementasi

| Prioritas | Fitur | Minggu |
|---|---|---|
| 🔴 **Tinggi** | Payment Refunds + Subscription Plan Items | 7-8 |
| 🟡 **Sedang** | Payment Installments + Billing Attempts + Failures | 8-9 |
| 🟢 **Rendah** | Rekonsiliasi + Webhooks + Pauses + Upgrades | 9-10 |

---

## 📌 KESIMPULAN

**Sistem Jastip** memiliki konsep bisnis yang kuat:
- ✅ E-commerce + Poin sebagai alat bayar
- ✅ Multi-hub distribution
- ✅ Subscription & reward loyalty
- ✅ Biaya kirim sudah include di RAB (tidak dihitung terpisah)
- ✅ Skema pengiriman sederhana namun informatif
- ✅ Timeliness tracking dibuat sederhana untuk Customer

**Yang perlu dilakukan untuk production:**
1. **Migrasi penuh ke Laravel** dengan +44 tabel (+20 tabel WMS + 6 tabel Order Stok + 3 tabel Email + 8 tabel Keuangan/Loyalty + 6 tabel Delivery + 9 tabel Payment/Subscription = total 98 tabel)
2. **Buat halaman tracking sesuai mockup** (1 halaman baru)
3. **Akuntansi & keuangan** dengan COA + jurnal + laporan
4. **Perkuat keamanan** (RBAC, throttle, audit trail, transaction lock)
5. **Tambahkan fitur** yang hilang (rating, wishlist, referral, POS, cron subscription)
6. **Implementasi WMS lengkap** (Section 13): +20 tabel, +14 halaman baru, alur Inbound→Inventory→Outbound
7. **Integrasi barcode/QR scanner** untuk receiving, picking, packing, dan stock opname
8. **Implementasi Order Stok Enterprise** (Section 14): +6 tabel, +6 halaman baru, alur Trigger→PR→PO→Receiving→Vendor
9. **Sistem terintegrasi penuh**: E-commerce Order → Stok (ROP) → Order Stok (PR/PO) → WMS (Receiving) → Stok kembali
10. **Integrasi Produk lengkap** (Section 15): +8 field WMS di tabel products, relasi ke 18 tabel (Stok, Warehouse, Order Stok, E-commerce)
11. **Email Notification & Transparansi Layanan** (Section 16): +3 tabel (email_templates, email_logs, email_preferences), +4 halaman baru, 18 jenis notifikasi email (10 Customer + 8 Hub)
12. **Integrasi Modul Keuangan & Loyalty** (Section 17): +8 tabel (customer_tier_history, reward_redemptions, sales_targets, rab_actuals, point_expiry_rules, fee_payouts, loyalty_events, accounting_reports), +7 halaman baru, relasi lengkap Sales→Fee→Accounting→RAB→Point→Membership→Reward
13. **Delivery Management & Integrasi** (Section 18): +6 tabel (delivery_zones, delivery_routes, delivery_attempts, delivery_proofs, delivery_schedules, delivery_returns), +6 halaman baru, integrasi Order→Packing (WMS)→Delivery→Live Tracking→Bukti→Retur
14. **Payment & Subscription Management** (Section 19): +9 tabel (payment_refunds, payment_installments, payment_reconciliation, payment_webhooks, subscription_plan_items, subscription_pauses, subscription_upgrades, subscription_failures, subscription_billing_attempts), +8 halaman baru, alur Checkout→Payment→Refund→Rekonsiliasi & Langganan→Auto-renewal→Billing Attempts→Pause

Dengan roadmap 30 minggu di atas (16 minggu core + 8 minggu WMS + 6 minggu Order Stok), sistem dapat berjalan di Laravel dengan standar WMS & Procurement Enterprise.

---
*Dokumen ini diperbarui: 15 Agustus 2026 — Penambahan Gap Analysis WMS (Section 13), Order Stok Enterprise (Section 14), Product Management & Integrasi Relasi (Section 15), Email Notification & Transparansi Layanan (Section 16), Integrasi Modul Keuangan & Loyalty (Section 17), Delivery Management & Integrasi (Section 18), Payment & Subscription Management (Section 19), Fase 7 & 8 Roadmap.*

---

## 📌 VERSI 2.1 — TAMBAHAN BLUEPRINT TEKNIS LENGKAP (15 AGUSTUS 2026)

> 💡 **Bagian ini ditambahkan untuk menjawab kebutuhan programmer:** relasi antar modul yang benar, urutan pengerjaan anti-bug, daftar Model/Controller/View, dan filter/card/chart per halaman.

---

## 20. MATRIX RELASI ANTAR MODUL (14 MODUL UTAMA)

> **Cara baca:** `Modul A → Modul B` artinya Modul A membutuhkan data Modul B melalui tabel/field yang dicantumkan.

### 20.1 Auth & User (M0)
| Modul B | Tabel Relasi | Field FK | Alur Data |
|---|---|---|---|
| Hub | `hubs.user_id` | user_id | Hub owner login |
| Customer | `customer_profiles.user_id` | user_id | Customer login |
| CS/Staff | `complaints.assigned_to` | user_id | Staff CS ditugaskan |
| Audit | `audit_logs.user_id` | user_id | Siapa melakukan aksi |

### 20.2 Hub (M1)
| Modul B | Tabel Relasi | Field FK | Alur Data |
|---|---|---|---|
| Customer | `customer_profiles.hub_id` | hub_id | Customer terdaftar di hub |
| Produk | `hub_product.hub_id` | hub_id | Stok per hub + markup |
| Order | `orders.hub_id` | hub_id | Order diproses hub |
| Delivery | `deliveries.hub_id` | hub_id | Pengiriman oleh hub |
| Komplain | `complaints.hub_id` | hub_id | Komplain diteruskan ke hub (FIX) |
| Keuangan | `fee_calculations.hub_id` | hub_id | Fee split per hub |
| Subscription | `subscriptions.hub_id` | hub_id | Langganan diproses hub |

### 20.3 Produk & Kategori (M2)
| Modul B | Tabel Relasi | Field FK | Alur Data |
|---|---|---|---|
| Stok | `hub_product.product_id` | product_id | Stok per hub |
| Stok | `stock_movements.product_id` | product_id | Mutasi stok |
| WMS | `stock_bins.product_id` | product_id | Stok per bin |
| WMS | `product_batches.product_id` | product_id | FIFO/FEFO |
| Order | `order_items.product_id` | product_id | Item order |
| Cart | `cart_items.product_id` | product_id | Keranjang |
| Procurement | `purchase_order_items.product_id` | product_id | PO supplier |
| Procurement | `replenishment_suggestions.product_id` | product_id | Auto-forecasting |
| Loyalty | `rewards.*` | product_id (opsional) | Reward berbasis produk |
| Email | `subscription_plan_items.product_id` | product_id | Detail paket |

### 20.4 Order & E-commerce (M3)
| Modul B | Tabel Relasi | Field FK | Alur Data |
|---|---|---|---|
| Payment | `payments.order_id` | order_id | Pembayaran order |
| Delivery | `deliveries.order_id` | order_id | Pengiriman order |
| WMS | `stock_reservations.order_id` | order_id | Lock stok |
| WMS | `picking_list_items.order_id` | order_id | Picking |
| WMS | `packing_orders.order_id` | order_id | Packing |
| Keuangan | `fee_calculations.order_id` | order_id | Fee split |
| Procurement | `backorders.order_id` | order_id | Backorder |
| Komplain | `complaints.order_id` | order_id | Komplain terkait order |
| Riwayat | `order_status_histories.order_id` | order_id | Timeline status |
| Loyalty | `reward_redemptions.order_id` | order_id | Klaim reward via order |

### 20.5 Payment (M4)
| Modul B | Tabel Relasi | Field FK | Alur Data |
|---|---|---|---|
| Point | `payments.type='topup'` | — | Top-up masuk wallet |
| Subscription | `payments.subscription_cycle_id` (FIX) | subscription_cycle_id | Tagihan langganan |
| Refund | `payment_refunds.payment_id` | payment_id | Refund |
| Keuangan | `journal_entries.transactable` | morphs | Jurnal otomatis |
| Audit | `payment_webhooks.payment_id` | payment_id | Log webhook |

### 20.6 Point & Wallet (M5)
| Modul B | Tabel Relasi | Field FK | Alur Data |
|---|---|---|---|
| Customer | `point_wallets.customer_profile_id` | customer_profile_id | Wallet per customer |
| Order | `point_transactions.source` | morphs | Pembayaran order |
| Loyalty | `reward_redemptions.points_spent` | — | Klaim reward |
| Komplain | `point_transactions.complaint_id` (FIX) | complaint_id | Refund poin via komplain |
| Keuangan | `journal_entries` (liabilitas) | morphs | Jurnal top-up |
| Expiry | `point_expiry_rules` | — | Aturan kadaluarsa |

### 20.7 Subscription (M6)
| Modul B | Tabel Relasi | Field FK | Alur Data |
|---|---|---|---|
| Customer | `subscriptions.customer_profile_id` | customer_profile_id | Pemilik langganan |
| Hub | `subscriptions.hub_id` | hub_id | Hub pemasok |
| Address | `subscriptions.address_id` | address_id | Alamat kirim |
| Order | `subscription_cycles.order_id` | order_id | Auto-order |
| Payment | `subscription_cycles` → billing | — | Tagihan otomatis |
| Produk | `subscription_plan_items.product_id` | product_id | Isi paket |
| Riwayat | `subscription_pauses/upgrades/failures` | subscription_id | Log aktivitas |

### 20.8 Delivery & Kurir (M7)
| Modul B | Tabel Relasi | Field FK | Alur Data |
|---|---|---|---|
| Order | `deliveries.order_id` | order_id | Paket order |
| Hub | `deliveries.hub_id` | hub_id | Hub pengirim |
| Kurir | `deliveries.courier_id` | courier_id | Kurir ditugaskan |
| Address | `deliveries.address_id` | address_id | Alamat tujuan |
| WMS | `deliveries.packing_order_id` (FIX) | packing_order_id | Dari packing |
| Zona | `deliveries.delivery_zone_id` | delivery_zone_id | Zona pengiriman |
| Riwayat | `delivery_tracking.delivery_id` | delivery_id | Timeline |
| Bukti | `delivery_proofs.delivery_id` | delivery_id | Foto/ttd |
| Retur | `delivery_returns.delivery_id` | delivery_id | Retur |

### 20.9 Warehouse & Stok (M8)
| Modul B | Tabel Relasi | Field FK | Alur Data |
|---|---|---|---|
| Produk | `stock_bins.product_id` | product_id | Stok per bin |
| Order | `stock_reservations.order_id` | order_id | Lock stok |
| Procurement | `replenishment_requests.product_id` | product_id | Replenishment |
| Procurement | `purchase_orders.warehouse_id` | warehouse_id | PO tujuan gudang |
| Delivery | `stock_movements.reference` | morphs | Mutasi via delivery |
| Produk | `products.default_warehouse_id` | warehouse_id | Gudang default |

### 20.10 Keuangan & COA (M9)
| Modul B | Tabel Relasi | Field FK | Alur Data |
|---|---|---|---|
| Order | `journal_entries.transactable` | morphs | Jurnal order |
| Payment | `journal_entries.transactable` | morphs | Jurnal payment |
| Point | `journal_entries` (liabilitas poin) | morphs | Jurnal top-up/expired |
| RAB | `rab_items.account_id` | account_id | Budget per akun |
| RAB | `rab_actuals.journal_entry_id` | journal_entry_id | Realisasi |
| Fee | `fee_calculations` → jurnal | — | Fee split |
| Fee | `fee_payouts.hub_id` | hub_id | Pembayaran ke hub |
| Target | `sales_targets` | hub/warehouse | Target vs actual |

### 20.11 Loyalty & Membership (M10)
| Modul B | Tabel Relasi | Field FK | Alur Data |
|---|---|---|---|
| Customer | `customer_profiles.membership_tier_id` | membership_tier_id | Tier aktif |
| Riwayat | `customer_tier_history.customer_profile_id` | customer_profile_id | Naik/turun tier |
| Reward | `reward_redemptions.reward_id` | reward_id | Klaim reward |
| Order | `reward_redemptions.order_id` | order_id | Reward via order |
| Point | `loyalty_events.type` | — | Bonus/cashback poin |
| Sales | `sales_targets` | hub_id | Target penjualan |
| RAB | `rab_actuals` | — | Realisasi |

### 20.12 Komplain/CS (M11)
| Modul B | Tabel Relasi | Field FK | Alur Data |
|---|---|---|---|
| Customer | `complaints.customer_profile_id` | customer_profile_id | Pelapor |
| Order | `complaints.order_id` | order_id | Order terkait |
| Hub | `complaints.hub_id` (FIX) | hub_id | Hub penerima notif |
| User | `complaints.assigned_to` | user_id | Staff CS |
| Pesan | `complaint_messages.complaint_id` | complaint_id | Chat |
| Point | `point_transactions.complaint_id` (FIX) | complaint_id | Refund poin |
| Email | `email_logs.reference` | morphs | Email komplain dibalas |
| Payment | `payment_refunds` | payment_id | Refund pembayaran |
| Delivery | `delivery_returns` | delivery_id | Retur barang |

### 20.13 Email & Notifikasi (M12)
| Modul B | Tabel Relasi | Field FK | Alur Data |
|---|---|---|---|
| User | `email_preferences.user_id` | user_id | Opt-in/out |
| User | `notifications.user_id` | user_id | Notif in-app |
| Semua | `email_logs.reference` | morphs | Referensi transaksi |
| Template | `email_templates.code` | — | Template per event |
| Device | `user_devices.user_id` (BARU) | user_id | Token FCM push |

### 20.14 Procurement (M13)
| Modul B | Tabel Relasi | Field FK | Alur Data |
|---|---|---|---|
| Produk | `purchase_order_items.product_id` | product_id | Barang dipesan |
| Supplier | `purchase_orders.supplier_id` | supplier_id | Vendor |
| Warehouse | `purchase_orders.warehouse_id` | warehouse_id | Gudang tujuan |
| WMS | `receiving_orders.purchase_order_id` | purchase_order_id | Inbound |
| Stok | `replenishment_suggestions.product_id` | product_id | Auto-order |
| Backorder | `backorders.purchase_order_id` | purchase_order_id | Backorder |
| PR | `purchase_requests.requested_by` | user_id | Pengaju |

---

## 21. URUTAN PENGERJAAN BUILD ORDER (12 FASE ANTI-BUG)

> 🎯 **Prinsip:** Setiap fase WAJIB lulus checklist sebelum lanjut ke fase berikutnya. Ini mencegah error FK di migration, bug null pointer, dan logic yang bergantung ke tabel yang belum ada.

### FASE 0 — SETUP & FOUNDATION (Minggu 1)
**Output:** Aplikasi Laravel bisa jalan + login.

| # | Task | Detail |
|---|---|---|
| 1 | Install Laravel 11 | `composer create-project laravel/laravel jastip` |
| 2 | Setup DB | MySQL 8 + Redis + konfigurasi `.env` |
| 3 | Install package | spatie/permission, laravel/sanctum, maatwebsite/excel, barryvdh/laravel-dompdf |
| 4 | Auth scaffold | Breeze/Jetstream (Blade) |
| 5 | RBAC | Seeder: roles (superadmin, hub, customer, staff_cs) + admin user |
| 6 | Layout | `layouts/app.blade`, `layouts/admin.blade`, `layouts/hub.blade`, `layouts/customer.blade` |
| 7 | Tailwind | Configure + asset |

**✅ Checklist Lulus:** `php artisan migrate` OK • `php artisan db:seed` OK • Login superadmin OK • Menu sidebar tampil sesuai role.

---

### FASE 1 — MIGRASI 106 TABEL (Minggu 1–2)
**Output:** Semua tabel ter-create dengan FK benar.

Urutan file migration (prefix nomor menandakan dependency):
```
0001_create_users_table
0002_create_password_reset_tokens
0003_create_personal_access_tokens
0010_create_roles_permissions (spatie)
0020_create_membership_tiers_table
0021_create_hubs_table
0022_create_categories_table
0023_create_products_table
0024_create_product_variants_table
0025_create_customer_profiles_table
0026_create_addresses_table
0027_create_rewards_table
0030_create_point_wallets_table
0031_create_point_transactions_table
0032_create_point_savings_table
0035_create_carts_table
0036_create_cart_items_table
0037_create_orders_table
0038_create_order_items_table
0039_create_order_status_histories_table
0040_create_payment_methods_table
0041_create_payments_table
0042_create_subscription_plans_table
0043_create_subscriptions_table
0044_create_subscription_cycles_table
0045_create_couriers_table
0046_create_deliveries_table
0047_create_delivery_tracking_table
0050_create_warehouses_table
0051_create_hub_product_table
0052_create_stock_movements_table
0053_create_stock_orders_table
0054_create_stock_order_items_table
0055_create_complaints_table
0056_create_complaint_messages_table
0057_create_notifications_table
0060_create_accounts_table (COA)
0061_create_fee_configs_table
0062_create_fee_calculations_table
0063_create_journal_entries_table
0064_create_journal_entry_lines_table
0065_create_rabs_table
0066_create_rab_items_table
0067_create_promos_table
0068_create_promo_usages_table
0069_create_audit_logs_table
0070_create_suppliers_table
0071_create_purchase_orders_table
0072_create_purchase_order_items_table
0073_create_receiving_orders_table
0074_create_receiving_items_table
0075_create_qc_results_table
0076_create_warehouse_locations_table
0077_create_stock_bins_table
0078_create_putaway_rules_table
0079_create_product_batches_table
0080_create_stock_reservations_table
0081_create_picking_lists_table
0082_create_picking_list_items_table
0083_create_picking_batches_table
0084_create_packing_orders_table
0085_create_stock_opnames_table
0086_create_stock_opname_items_table
0087_create_replenishment_requests_table
0088_create_barcode_labels_table
0089_create_stock_movement_details_table
0090_create_purchase_requests_table
0091_create_purchase_request_items_table
0092_create_supplier_items_table
0093_create_supplier_performance_table
0094_create_backorders_table
0095_create_replenishment_suggestions_table
0096_create_email_templates_table
0097_create_email_logs_table
0098_create_email_preferences_table
0099_create_customer_tier_history_table
0100_create_reward_redemptions_table
0101_create_sales_targets_table
0102_create_rab_actuals_table
0103_create_point_expiry_rules_table
0104_create_fee_payouts_table
0105_create_loyalty_events_table
0106_create_accounting_reports_table
0107_create_delivery_zones_table
0108_create_delivery_routes_table
0109_create_delivery_attempts_table
0110_create_delivery_proofs_table
0111_create_delivery_schedules_table
0112_create_delivery_returns_table
0113_create_payment_refunds_table
0114_create_payment_installments_table
0115_create_payment_reconciliation_table
0116_create_payment_webhooks_table
0117_create_subscription_plan_items_table
0118_create_subscription_pauses_table
0119_create_subscription_upgrades_table
0120_create_subscription_failures_table
0121_create_subscription_billing_attempts_table
-- TABEL BARU V2.1:
0122_create_product_reviews_table
0123_create_wishlists_table
0124_create_referrals_table
0125_create_pos_sessions_table
0126_create_pos_transactions_table
0127_create_user_devices_table
0128_create_complaint_slas_table
0129_create_complaint_escalations_table
0130_create_tax_configs_table
-- FIX FIELD TAMBAHAN (migration terpisah):
0131_add_fields_to_products_table (WMS fields)
0132_add_fields_to_hub_product_table (reorder_point)
0133_add_fields_to_orders_table (is_backorder)
0134_add_fields_to_payments_table (subscription_cycle_id)
0135_add_fields_to_point_transactions_table (complaint_id)
0136_add_fields_to_deliveries_table (packing_order_id, delivery_zone_id, route_id, eta, proof)
0137_add_fields_to_purchase_orders_table (ppn, discount, freight, eta, tolerance, payment_terms)
```

**✅ Checklist Lulus:** `php artisan migrate:fresh` 100% OK • `php artisan migrate:status` tampil 130 file • Tidak ada error FK constraint.

---

### FASE 2 — MASTER DATA & SEEDER (Minggu 2–3)
**Output:** Data master terisi, admin bisa manage.

| # | Task | Detail |
|---|---|---|
| 1 | Seeder COA | 30+ akun dari Section 9.3 |
| 2 | Seeder Roles | superadmin, hub_owner, staff_cs, customer |
| 3 | Seeder Membership | Silver, Gold, Platinum, Diamond |
| 4 | CRUD Category | `categories/{index,create,edit,show}` |
| 5 | CRUD Product | `products/{index,create,edit,show}` + varian + WMS fields |
| 6 | CRUD Hub | `hubs/{index,create,edit,show}` |
| 7 | CRUD Customer | `customers/{index,create,edit,show}` |
| 8 | CRUD Reward | `rewards/{index,create,edit}` |
| 9 | CRUD Promo | `promos/{index,create,edit}` |
| 10 | CRUD Supplier | `suppliers/{index,create,edit}` |

**✅ Checklist Lulus:** CRUD produk tersimpan OK • Foto upload OK • Soft delete OK • Filter + pagination OK.

---

### FASE 3 — WALLET & POIN (Minggu 3–4)
**Output:** Top-up poin end-to-end.

| # | Task | Detail |
|---|---|---|
| 1 | Model + Migration | PointWallet, PointTransaction, PointSaving |
| 2 | `PointBalanceService` | Balance, add, deduct, pending, expired |
| 3 | Top-up flow | Form nominal → Payment → Webhook → Wallet topup |
| 4 | Jurnal top-up | Debit Kas / Kredit Liabilitas Poin |
| 5 | Expiry cron | `php artisan points:expire` + `points:check-expiry` |
| 6 | Riwayat transaksi | `point_transactions` filter tanggal |
| 7 | Tabungan | PointSaving CRUD (goal umroh, dll) |

**✅ Checklist Lulus:** Top-up 100K masuk wallet OK • Saldo tampil di dashboard OK • Expiry mengurangi saldo + jurnal OK.

---

### FASE 4 — E-COMMERCE CORE (Minggu 4–6)
**Output:** Order end-to-end (katalog → checkout → order).

| # | Task | Detail |
|---|---|---|
| 1 | Model | Cart, CartItem, Order, OrderItem, OrderStatusHistory |
| 2 | Cart flow | Add/update/remove item + qty |
| 3 | Checkout | Alamat → summary → pilih bayar |
| 4 | OrderService | `placeOrder()` — DB transaction + `lockForUpdate()` |
| 5 | Stock deduct | `hub_product.stock_qty -= qty` |
| 6 | Point deduct | `point_wallets.balance -= total` + transaksi |
| 7 | Jurnal order | Liabilitas Poin → Pendapatan |
| 8 | Cancel order | Restore point + stock + alasan |
| 9 | Riwayat | OrderStatusHistory tiap perubahan |

**✅ Checklist Lulus:** Checkout ganda tidak double-deduct (race condition test) • Saldo tidak minus • Stock tidak minus • Cancel mengembalikan saldo.

---

### FASE 5 — PAYMENT & KEUANGAN (Minggu 6–8)
**Output:** Payment gateway, refund, jurnal, fee split.

| # | Task | Detail |
|---|---|---|
| 1 | PaymentGatewayService | Midtrans/Xendit create-token, charge, webhook |
| 2 | Payment flow | Create payment → redirect → webhook → update |
| 3 | PaymentWebhook | Simpan payload + validasi signature |
| 4 | Refund | `payment_refunds` + jurnal balik |
| 5 | AccountingService | `createJournal()` reusable |
| 6 | COA seeder | 30+ akun |
| 7 | FeeCalculationService | 67/33 saat order paid/completed |
| 8 | Laporan | Neraca, Laba rugi, Arus kas (query builder) |
| 9 | Rekonsiliasi | Manual match payment vs bank |

**✅ Checklist Lulus:** Webhook gagal → payment tidak double-credited • Refund menjurnal benar • Fee split 67/33 untuk order 100K = 67K/33K.

---

### FASE 6 — WAREHOUSE & WMS (Minggu 8–12)
**Output:** Stok tercatat per bin, inbound/outbound flow.

| # | Task | Detail |
|---|---|---|
| 1 | Model | Warehouse, StockMovement, HubProduct, StockOrder |
| 2 | StockMovementService | in/out/adjustment/transfer + stock_before/after |
| 3 | Lokasi | WarehouseLocation CRUD (Zona→Lorong→Rak→Level→Bin) |
| 4 | StockBin | Stok per bin + reserved_qty |
| 5 | Receiving | ReceivingOrder + QC + Putaway |
| 6 | Picking | PickingList + items + scan |
| 7 | Packing | PackingOrder + verifikasi |
| 8 | StockOpname | Count fisik vs sistem + adjustment |
| 9 | Replenishment | Request isi ulang picking area |

**✅ Checklist Lulus:** Receiving 100 pcs → bin bertambah OK • Picking kurangi used_qty OK • Opname selisih → adjustment + audit OK.

---

### FASE 7 — DELIVERY (Minggu 12–14)
**Output:** Pengiriman + tracking customer.

| # | Task | Detail |
|---|---|---|
| 1 | Model | Courier, Delivery, DeliveryTracking |
| 2 | Courier CRUD | assign status available/on_duty/off |
| 3 | DeliveryService | create from order/packing + assign kurir |
| 4 | Tracking | update status → DeliveryTracking + email |
| 5 | Zones | DeliveryZone per hub |
| 6 | Routes | DeliveryRoute + stops (JSON) |
| 7 | Attempts | DeliveryAttempt gagal/reschedule |
| 8 | Proofs | Foto/ttd penerima |
| 9 | Returns | DeliveryReturn + refund |
| 10 | Customer tracking | Halaman tracking = Section 8 mockup |

**✅ Checklist Lulus:** Status berubah di tracking customer realtime OK • Email "Order Dikirim" terkirim OK • Retur memicu refund.

---

### FASE 8 — SUBSCRIPTION (Minggu 14–15)
**Output:** Auto-renewal berjalan via cron.

| # | Task | Detail |
|---|---|---|
| 1 | Model | SubscriptionPlan, Subscription, SubscriptionCycle |
| 2 | CRUD Plan | + subscription_plan_items (detail paket) |
| 3 | Subscribe flow | Pilih paket → bayar → aktif |
| 4 | Cron `subscription:renew` | Cek siklus hari ini → auto-order |
| 5 | BillingAttempt | 3x percobaan → gagal → notifikasi |
| 6 | Failures | Log alasan gagal |
| 7 | Pause | Request pause + resume |
| 8 | Upgrade | Upgrade/downgrade + selisih harga |

**✅ Checklist Lulus:** Cron auto-buat order saat jatuh tempo OK • Saldo kurang → billing_attempt 3x → pause OK • Upgrade mengubah next_billing.

---

### FASE 9 — LOYALTY & REWARD (Minggu 15–16)
**Output:** Tier otomatis + klaim reward.

| # | Task | Detail |
|---|---|---|
| 1 | TierService | Auto-upgrade berdasarkan total_spend/lifetime_earned |
| 2 | TierHistory | Riwayat naik/turun |
| 3 | RewardRedemption | Klaim → deduct points → status |
| 4 | LoyaltyEvent | Bonus/cashback/multiplier |
| 5 | SalesTarget | Target bulanan/kuartal per hub |
| 6 | RABActual | Realisasi dari jurnal |

**✅ Checklist Lulus:** Customer spend Rp 1jt → auto naik tier OK • Klaim reward kurangi poin + riwayat tercatat OK.

---

### FASE 10 — KOMPLAIN/CS (Minggu 16–17)
**Output:** Komplain + chat + SLA + eskalasi.

| # | Task | Detail |
|---|---|---|
| 1 | Model | Complaint, ComplaintMessage |
| 2 | ComplaintController Customer | submit + pilih order + kategori + prioritas + upload |
| 3 | ComplaintController Admin | list + filter + detail + assign CS |
| 4 | Chat | ComplaintMessage (is_read) realtime-ish |
| 5 | SLA | complaint_slas (urgent 4jam, high 8jam, medium 24jam) |
| 6 | Eskalasi | complaint_escalations (level → supervisor) |
| 7 | Aksi modul | Refund poin/payment, retur delivery, adjustment |
| 8 | Email | "Komplain Baru" ke hub + "Komplain Dibalas" ke customer |

**✅ Checklist Lulus:** Customer kirim komplain → muncul di admin OK • CS balas → customer lihat chat OK • Urgent > 4 jam → eskalasi otomatis OK.

---

### FASE 11 — PROCUREMENT (Minggu 17–20)
**Output:** PR → PO → Receiving → Replenishment.

| # | Task | Detail |
|---|---|---|
| 1 | Model | PurchaseRequest, PurchaseOrder, Supplier, SupplierItem |
| 2 | ROP trigger | `replenishment:check` → suggestions |
| 3 | PR flow | Draft → submit → approval |
| 4 | Approval | ≤10jt (kepala gudang) / >10jt (manajer keuangan) |
| 5 | PO generate | Konversi PR → PO + PDF |
| 6 | Receiving | ReceivingOrder + QC + Partial |
| 7 | ETA | Dashboard kedatangan PO |

**✅ Checklist Lulus:** Stok ≤ ROP → suggestion muncul OK • PR disetujui → PO otomatis OK • PO received → stok bertambah + jurnal HPP OK.

---

### FASE 12 — REPORT, SECURITY, TESTING, DEPLOY (Minggu 20–24)
**Output:** Siap production.

| # | Task | Detail |
|---|---|---|
| 1 | Export Excel | Semua tabel utama + laporan |
| 2 | Export PDF | PO, invoicing, laporan |
| 3 | Rate limit | Login, API |
| 4 | Audit trail | Semua event sesuai Section 10.4 |
| 5 | PEST Test | Feature: login, topup, order, komplain, subscription |
| 6 | Backup | Schedule mysqldump harian |
| 7 | Deploy | VPS/Forge + Supervisor queues |

**✅ Checklist Lulus:** `php artisan test` 100% hijau • Deploy staging OK • Rollback OK.

---

## 22. DAFTAR LENGKAP MODEL, CONTROLLER & SERVICE

> Format: `Model | Controller | Service | FormRequest | Route Prefix`. Semua controller pake `resource` kecuali disebut khusus.

### 22.1 Modul Master Data
| No | Model | Controller | Service | FormRequest | Route Prefix |
|---|---|---|---|---|---|
| 1 | Category | CategoryController | — | CategoryRequest | `/admin/categories` |
| 2 | Product | ProductController | ProductService | ProductRequest | `/admin/products` |
| 3 | ProductVariant | ProductVariantController | — | VariantRequest | `/admin/products/{product}/variants` |
| 4 | Hub | HubController | HubService | HubRequest | `/admin/hubs` |
| 5 | CustomerProfile | CustomerController | CustomerService | CustomerRequest | `/admin/customers` |
| 6 | Address | AddressController | — | AddressRequest | `/admin/customers/{profile}/addresses` |
| 7 | MembershipTier | MembershipTierController | TierService | TierRequest | `/admin/membership-tiers` |
| 8 | Reward | RewardController | RewardService | RewardRequest | `/admin/rewards` |
| 9 | Promo | PromoController | PromoService | PromoRequest | `/admin/promos` |
| 10 | Supplier | SupplierController | SupplierService | SupplierRequest | `/admin/suppliers` |

### 22.2 Modul Point & Wallet
| No | Model | Controller | Service | FormRequest | Route Prefix |
|---|---|---|---|---|---|
| 11 | PointWallet | WalletController | PointBalanceService | — | `/customer/wallet` |
| 12 | PointTransaction | PointTransactionController | PointBalanceService | TopupRequest | `/admin/point-transactions` |
| 13 | PointSaving | PointSavingController | — | SavingRequest | `/customer/point-savings` |
| 14 | PointExpiryRule | PointExpiryRuleController | PointExpiryService | RuleRequest | `/admin/point-expiry-rules` |

### 22.3 Modul E-commerce & Order
| No | Model | Controller | Service | FormRequest | Route Prefix |
|---|---|---|---|---|---|
| 15 | Cart / CartItem | CartController | CartService | — | `/customer/cart` |
| 16 | Order | OrderController (Customer/Admin) | OrderService | CheckoutRequest | `/customer/orders` + `/admin/orders` |
| 17 | OrderItem | (via OrderController) | OrderService | — | — |
| 18 | OrderStatusHistory | (via OrderController) | OrderService | — | — |

### 22.4 Modul Payment
| No | Model | Controller | Service | FormRequest | Route Prefix |
|---|---|---|---|---|---|
| 19 | PaymentMethod | PaymentMethodController | — | MethodRequest | `/admin/payment-methods` |
| 20 | Payment | PaymentController | PaymentGatewayService | PaymentRequest | `/admin/payments` |
| 21 | PaymentRefund | PaymentRefundController | PaymentGatewayService | RefundRequest | `/admin/payment-refunds` |
| 22 | PaymentInstallment | PaymentInstallmentController | — | — | `/admin/payment-installments` |
| 23 | PaymentReconciliation | PaymentReconController | ReconService | — | `/admin/payment-reconciliation` |
| 24 | PaymentWebhook | WebhookController | PaymentGatewayService | — | `/api/webhooks/payment` |

### 22.5 Modul Subscription
| No | Model | Controller | Service | FormRequest | Route Prefix |
|---|---|---|---|---|---|
| 25 | SubscriptionPlan | SubscriptionPlanController | — | PlanRequest | `/admin/subscription-plans` |
| 26 | SubscriptionPlanItem | (via PlanController) | — | — | `/admin/subscription-plans/{plan}/items` |
| 27 | Subscription | SubscriptionController | SubscriptionService | SubscribeRequest | `/customer/subscriptions` |
| 28 | SubscriptionCycle | (via SubscriptionController) | SubscriptionService (cron) | — | — |
| 29 | SubscriptionPause | SubscriptionPauseController | — | PauseRequest | `/customer/subscriptions/{sub}/pause` |
| 30 | SubscriptionUpgrade | SubscriptionController | SubscriptionService | UpgradeRequest | `/customer/subscriptions/{sub}/upgrade` |
| 31 | SubscriptionFailure | (via SubscriptionController) | SubscriptionService | — | — |
| 32 | SubscriptionBillingAttempt | (via SubscriptionController) | SubscriptionService | — | — |

### 22.6 Modul Delivery
| No | Model | Controller | Service | FormRequest | Route Prefix |
|---|---|---|---|---|---|
| 33 | Courier | CourierController | — | CourierRequest | `/hub/couriers` |
| 34 | Delivery | DeliveryController (Hub/Admin) | DeliveryService | DeliveryRequest | `/hub/deliveries` |
| 35 | DeliveryTracking | (via DeliveryController) | DeliveryService | — | — |
| 36 | DeliveryZone | DeliveryZoneController | — | ZoneRequest | `/hub/delivery-zones` |
| 37 | DeliveryRoute | DeliveryRouteController | RouteOptimizerService | — | `/hub/delivery-routes` |
| 38 | DeliveryAttempt | DeliveryAttemptController | — | — | `/hub/delivery-attempts` |
| 39 | DeliveryProof | DeliveryProofController | — | ProofRequest | `/hub/delivery-proofs` |
| 40 | DeliverySchedule | DeliveryScheduleController | — | ScheduleRequest | `/hub/delivery-schedules` |
| 41 | DeliveryReturn | DeliveryReturnController | ReturnService | ReturnRequest | `/hub/delivery-returns` |

### 22.7 Modul Warehouse & WMS
| No | Model | Controller | Service | FormRequest | Route Prefix |
|---|---|---|---|---|---|
| 42 | Warehouse | WarehouseController | — | WarehouseRequest | `/admin/warehouses` |
| 43 | HubProduct (Stok) | StockController | StockMovementService | StockRequest | `/hub/warehousing` |
| 44 | StockMovement | StockMovementController | StockMovementService | — | `/admin/stock-movements` |
| 45 | StockOrder / StockOrderItem | StockOrderController | StockMovementService | — | `/hub/stock-orders` |
| 46 | WarehouseLocation | WarehouseLocationController | — | LocationRequest | `/admin/warehouse-locations` |
| 47 | StockBin | StockBinController | — | — | `/admin/stock-bins` |
| 48 | ProductBatch | ProductBatchController | — | BatchRequest | `/admin/product-batches` |
| 49 | StockReservation | (via OrderService) | OrderService | — | — |
| 50 | PutawayRule | PutawayController | PutawayService | — | `/admin/putaway-rules` |
| 51 | ReceivingOrder / Item / QC | ReceivingController | ReceivingService | — | `/admin/receiving` |
| 52 | PickingList / Item / Batch | PickingController | PickingService | — | `/admin/picking` |
| 53 | PackingOrder | PackingController | PackingService | — | `/admin/packing` |
| 54 | StockOpname / Item | StockOpnameController | — | — | `/admin/stock-opname` |
| 55 | ReplenishmentRequest | ReplenishmentController | ReplenishmentService | — | `/admin/replenishment` |
| 56 | BarcodeLabel | BarcodeController | BarcodeService | — | `/admin/barcode-labels` |

### 22.8 Modul Procurement
| No | Model | Controller | Service | FormRequest | Route Prefix |
|---|---|---|---|---|---|
| 57 | PurchaseRequest / Item | PurchaseRequestController | ReplenishmentService | — | `/admin/purchase-requests` |
| 58 | PurchaseOrder / Item | PurchaseOrderController | PurchaseOrderService | — | `/admin/purchase-orders` |
| 59 | SupplierItem | SupplierItemController | — | — | `/admin/suppliers/{supplier}/items` |
| 60 | SupplierPerformance | SupplierPerformanceController | VendorScoreService | — | `/admin/supplier-performance` |
| 61 | Backorder | BackorderController | — | — | `/admin/backorders` |
| 62 | ReplenishmentSuggestion | ReplenishmentSuggestionController | ReplenishmentService | — | `/admin/replenishment-suggestions` |

### 22.9 Modul Keuangan
| No | Model | Controller | Service | FormRequest | Route Prefix |
|---|---|---|---|---|---|
| 63 | Account (COA) | AccountController | — | AccountRequest | `/admin/accounts` |
| 64 | JournalEntry / Line | JournalController | AccountingService | — | `/admin/journal-entries` |
| 65 | FeeConfig | FeeConfigController | — | — | `/admin/fee-configs` |
| 66 | FeeCalculation | FeeController | FeeCalculationService | — | `/admin/fee` |
| 67 | FeePayout | FeePayoutController | — | — | `/admin/fee-payouts` |
| 68 | Rab / RabItem | RabController | AccountingService | RabRequest | `/admin/rabs` |
| 69 | RabActual | (via RabController) | AccountingService | — | — |
| 70 | AccountingReport | AccountingReportController | ReportService | — | `/admin/accounting-reports` |

### 22.10 Modul Loyalty
| No | Model | Controller | Service | FormRequest | Route Prefix |
|---|---|---|---|---|---|
| 71 | CustomerTierHistory | TierHistoryController | TierService | — | `/admin/tier-history` |
| 72 | RewardRedemption | RewardRedemptionController | RewardService | — | `/admin/reward-redemptions` |
| 73 | SalesTarget | SalesTargetController | — | — | `/admin/sales-targets` |
| 74 | LoyaltyEvent | LoyaltyEventController | — | — | `/admin/loyalty-events` |

### 22.11 Modul Komplain/CS
| No | Model | Controller | Service | FormRequest | Route Prefix |
|---|---|---|---|---|---|
| 75 | Complaint | ComplaintController (Customer) | ComplaintService | ComplaintRequest | `/customer/complaints` |
| 76 | ComplaintMessage | ComplaintAdminController (Admin) | ComplaintService | — | `/admin/complaints` |
| 77 | ComplaintSla | ComplaintSlaController | ComplaintSlaService | — | `/admin/complaint-slas` |
| 78 | ComplaintEscalation | ComplaintEscalationController | EscalationService | — | `/admin/complaint-escalations` |

### 22.12 Modul Email & Notifikasi
| No | Model | Controller | Service | FormRequest | Route Prefix |
|---|---|---|---|---|---|
| 79 | EmailTemplate | EmailTemplateController | NotificationService | — | `/admin/email-templates` |
| 80 | EmailLog | EmailLogController | NotificationService | — | `/admin/email-logs` |
| 81 | EmailPreference | EmailPreferenceController | — | — | `/customer/email-preferences` + `/hub/email-preferences` |
| 82 | Notification | (via NotificationController) | NotificationService | — | `/notifications` |
| 83 | UserDevice | (via API) | NotificationService | — | `/api/devices` |

### 22.13 Modul Tambahan V2.1 (Fitur Baru)
| No | Model | Controller | Service | FormRequest | Route Prefix |
|---|---|---|---|---|---|
| 84 | ProductReview | ProductReviewController | — | ReviewRequest | `/customer/products/{product}/reviews` |
| 85 | Wishlist | WishlistController | — | — | `/customer/wishlists` |
| 86 | Referral | ReferralController | ReferralService | — | `/customer/referrals` |
| 87 | PosSession / PosTransaction | PosController | PosService | — | `/hub/pos` |
| 88 | TaxConfig | TaxController | TaxService | — | `/admin/tax-configs` |

---

## 23. DAFTAR LENGKAP VIEW CRUD (BLADE)

> Format: `View (blade) | Fungsi | Komponen`. Semua list view pake `table-generic + pagination-filter + search-filter-bar`.

### 23.1 Modul Master Data (Superadmin)
| Modul | View | Fungsi | Komponen |
|---|---|---|---|
| Category | `categories/index | create | edit | show` | List/tambah/edit/detail | table + modal-form |
| Product | `products/index | create | edit | show` | List/tambah/edit/detail + varian | table + modal-form + tabs-component |
| Hub | `hubs/index | create | edit | show` | List/tambah/edit/detail | table + modal-form + card-stat |
| Customer | `customers/index | create | edit | show` | List/tambah/edit/detail | table + modal-form |
| Address | `addresses/index` (per customer) | Kelola alamat | card + modal-form |
| Membership | `membership-tiers/index | create | edit` | Kelola tier | card + modal-form |
| Reward | `rewards/index | create | edit` | Kelola reward | card + modal-form |
| Promo | `promos/index | create | edit` | Kelola promo | table + modal-form |
| Supplier | `suppliers/index | create | edit | show` | Kelola supplier | table + modal-form |

### 23.2 Modul Point (Customer + Superadmin)
| View | Fungsi | Komponen |
|---|---|---|
| `customer/points-topup` | Saldo + form top-up + riwayat | card-stat + table + search-filter-bar |
| `customer/point-savings | create` | Tabungan poin | card + modal-form |
| `admin/point-transactions/index` | Semua transaksi | table + filter + pagination-filter |
| `admin/point-expiry-rules/index | create | edit` | Aturan kadaluarsa | table + modal-form |

### 23.3 Modul E-commerce (Customer)
| View | Fungsi | Komponen |
|---|---|---|
| `customer/catalog` | Katalog + filter | card-product + search-filter-bar + pagination-filter |
| `customer/product-detail` | Detail + review + wishlist | card-product + tabs-component |
| `customer/cart` | Keranjang | table + card-stat |
| `customer/checkout` | Alamat + ringkasan | form + card |
| `customer/orders | show | tracking` | Riwayat + detail + lacak | table + timeline |

### 23.4 Modul Payment (Admin)
| View | Fungsi | Komponen |
|---|---|---|
| `admin/payments/index | show` | List + detail payment | table + modal-form |
| `admin/payment-methods/index | create | edit` | Metode bayar | table + modal-form |
| `admin/payment-refunds/index | show` | Refund | table + modal-confirm |
| `admin/payment-installments/index` | Cicilan | table |
| `admin/payment-reconciliation/index | create` | Rekonsiliasi | table + modal-form |
| `admin/payment-webhooks/index | show` | Log webhook | table |

### 23.5 Modul Subscription (Customer + Admin)
| View | Fungsi | Komponen |
|---|---|---|
| `customer/subscriptions/index | create | show` | List langganan | card-product |
| `customer/subscriptions/pause | upgrade` | Jeda/upgrade | form + modal-confirm |
| `admin/subscription-plans/index | create | edit` | Paket | table + modal-form |
| `admin/subscription-plans/items` | Detail isi paket | table |
| `admin/subscription-management/index | show` | Kelola customer langganan | table |
| `admin/subscription-failures/index` | Gagal bayar | table |
| `admin/billing-attempts/index` | Percobaan tagihan | table |

### 23.6 Modul Delivery (Hub)
| View | Fungsi | Komponen |
|---|---|---|
| `hub/deliveries/index | create | edit | show` | Kelola pengiriman | table + modal-form |
| `hub/delivery-tracking/show` | Timeline pengiriman | timeline |
| `hub/couriers/index | create | edit` | Kurir | table + modal-form |
| `hub/delivery-zones/index | create | edit` | Zona | table + modal-form |
| `hub/delivery-routes/index | create` | Rute | table + peta |
| `hub/delivery-attempts/index` | Percobaan | table |
| `hub/delivery-proofs/show` | Bukti foto/ttd | card |
| `hub/delivery-schedules/index | create` | Jadwal | table |
| `hub/delivery-returns/index | create | show` | Retur | table + modal-confirm |
| `customer/orders/tracking` | Lacak paket | timeline (Section 8) |

### 23.7 Modul Warehouse & WMS (Superadmin + Hub)
| View | Fungsi | Komponen |
|---|---|---|
| `admin/warehouses/index | create | edit` | Gudang | table + modal-form |
| `hub/warehousing/index | create | edit` | Stok hub | table + card-stat |
| `admin/stock-movements/index | show` | Mutasi stok | table + filter tanggal |
| `hub/stock-orders/index | create | show` | Order stok | table + modal-form |
| `admin/warehouse-locations/index | create | edit` | Lokasi/bin | table + card |
| `admin/stock-bins/index` | Stok per bin | table |
| `admin/product-batches/index | create` | Batch/FEFO | table |
| `admin/putaway/index | create` | Penempatan | table + form |
| `admin/receiving/index | create | show` | Penerimaan + QC | table + modal-form |
| `admin/picking/index | create | show` | Picking | table + checklist |
| `admin/packing/index | create | show` | Packing | table + verifikasi |
| `admin/stock-opname/index | create | show` | Opname | table |
| `admin/replenishment/index` | Replenishment | table + alert |
| `admin/warehouse-reports/index` | Laporan WMS | table + chart |

### 23.8 Modul Procurement (Superadmin)
| View | Fungsi | Komponen |
|---|---|---|
| `admin/purchase-requests/index | create | show` | PR | table + modal-form |
| `admin/purchase-request-approval/index | show` | Approval PR | table + modal-confirm |
| `admin/purchase-orders/index | create | show` | PO | table + modal-form + PDF |
| `admin/po-eta-dashboard/index` | ETA | card-stat + table |
| `admin/supplier-performance/index` | Skor vendor | table + rating |
| `admin/replenishment-suggestions/index` | Auto-order | table + alert |

### 23.9 Modul Keuangan (Superadmin)
| View | Fungsi | Komponen |
|---|---|---|
| `admin/accounts/index | create | edit` | COA | tree table |
| `admin/journal-entries/index | create | show` | Jurnal | table |
| `admin/fee-configs/index | create | edit` | Konfigurasi fee | table + modal-form |
| `admin/fee/index | show` | Fee per hub | table + chart |
| `admin/fee-payouts/index | create | show` | Payout | table + modal-confirm |
| `admin/rabs/index | create | edit | show` | RAB | table + form |
| `admin/rab-actuals/index` | Realisasi | table + chart |
| `admin/accounting-reports/index | show` | Laporan otomatis | card + chart + export |
| `admin/dashboard-accounting` | Dashboard | card-stat + chart |

### 23.10 Modul Loyalty (Superadmin + Customer)
| View | Fungsi | Komponen |
|---|---|---|
| `admin/tier-history/index` | Riwayat tier | table |
| `admin/reward-redemptions/index | show` | Klaim reward | table + modal-confirm |
| `admin/sales-targets/index | create | edit` | Target | table + modal-form |
| `admin/loyalty-events/index | create | edit` | Event | table + modal-form |
| `customer/rewards/index` | Klaim reward customer | card-reward |
| `customer/profile-tier` | Profil + tier | card + progress-tier |

### 23.11 Modul Komplain/CS (Customer + Superadmin)
| View | Fungsi | Komponen |
|---|---|---|
| `customer/complaints/index | create | show` | Submit/riwayat/chat | form + chat + timeline |
| `admin/complaints/index | show` | List + detail + chat | table + chat + modal-confirm |
| `admin/complaints/create | edit` | Tambah/edit internal | form |
| `admin/complaint-slas/index | create | edit` | SLA | table + modal-form |
| `admin/complaint-escalations/index` | Eskalasi | table + alert |

### 23.12 Modul Email & Notifikasi
| View | Fungsi | Komponen |
|---|---|---|
| `admin/email-templates/index | create | edit` | Template | table + editor |
| `admin/email-logs/index | show` | Log | table + filter tanggal |
| `customer/email-preferences` | Preferensi | form toggle |
| `hub/email-preferences` | Preferensi hub | form toggle |
| `notifications/index` | Notif in-app | list + dropdown |

### 23.13 Modul Tambahan V2.1
| View | Fungsi | Komponen |
|---|---|---|
| `customer/products/reviews | create` | Review | card + form rating |
| `customer/wishlists/index` | Wishlist | card-product |
| `customer/referrals/index` | Referral | card + copy link |
| `hub/pos/index | create` | POS | grid produk + cart + total |
| `admin/tax-configs/index | create | edit` | PPN | table + modal-form |

---

## 24. FILTER, CARD & CHART PER HALAMAN + FILTER TANGGAL

> **Standar:** Semua halaman list/dashboard WAJIB punya filter dropdown + **filter tanggal Mulai–Akhir** (`input type=date` + tombol Terapkan/Reset). Format `input type="date"` → `YYYY-MM-DD` → query `whereBetween`.

### 24.1 Dashboard Utama (Superadmin)
| Card | Chart | Filter Dropdown | Filter Tanggal |
|---|---|---|---|
| Total Penjualan, Total Order, Customer Aktif, Komplain Open | Line (penjualan/bulan), Doughnut (status order) | Hub, 7/30/90 hari | ✅ Mulai–Akhir (default: 1 bulan) |

### 24.2 Dashboard Sales
| Card | Chart | Filter Dropdown | Filter Tanggal |
|---|---|---|---|
| Total Penjualan, Order Hari Ini, Avg Transaksi, Top Hub | Line (penjualan per bulan), Doughnut (status order), Bar (top 5 produk) | Hub, Kategori, Status | ✅ Mulai–Akhir |

### 24.3 Dashboard Points Balance
| Card | Chart | Filter Dropdown | Filter Tanggal |
|---|---|---|---|
| Poin Beredar, Poin Aktif, Poin Expired, Top-up Bulan Ini | Line (top-up/bulan), Area (saldo berjalan) | Hub, Tipe Transaksi | ✅ Mulai–Akhir |

### 24.4 Dashboard Fee
| Card | Chart | Filter Dropdown | Filter Tanggal |
|---|---|---|---|
| Fee Hub, Fee Pusat, Total Hutang Hub, % Split | Bar (fee per hub), Line (fee/bulan) | Hub, Status | ✅ Mulai–Akhir |

### 24.5 Dashboard RAB
| Card | Chart | Filter Dropdown | Filter Tanggal |
|---|---|---|---|
| Total Budget, Total Actual, Deviasi, % Realisasi | Doughnut (budget vs actual), Bar (per akun) | Tahun, Status, Akun | ✅ Mulai–Akhir (tahun) |

### 24.6 Dashboard Accounting
| Card | Chart | Filter Dropdown | Filter Tanggal |
|---|---|---|---|
| Total Aset, Total Liabilitas, Laba Bersih, Arus Kas | Line (laba/bulan), Doughnut (pendapatan), Bar (beban) | Periode, Akun | ✅ Mulai–Akhir |

### 24.7 Dashboard Warehouse Internal/External
| Card | Chart | Filter Dropdown | Filter Tanggal |
|---|---|---|---|
| Total SKU, Stok Masuk, Stok Keluar, Stok Menipis | Bar (stok per kategori), Line (mutasi/bulan) | Warehouse, Kategori, Status | ✅ Mulai–Akhir |

### 24.8 Dashboard Hub
| Card | Chart | Filter Dropdown | Filter Tanggal |
|---|---|---|---|
| Penjualan Hub, Order Diproses, Delivery Aktif, Stok | Bar (penjualan/bulan), Doughnut (status delivery) | Kategori, Kurir, Status | ✅ Mulai–Akhir |

### 24.9 Halaman Produk (Admin)
| Card | Chart | Filter Dropdown | Filter Tanggal |
|---|---|---|---|
| Total Produk, Aktif, Nonaktif, Stok Rendah | — | Kategori, Status, Stok, Supplier | ✅ (berdasar created_at) |

### 24.10 Halaman Order (Admin)
| Card | Chart | Filter Dropdown | Filter Tanggal |
|---|---|---|---|
| Total Order, Paid, Selesai, Batal | — | Hub, Status, Payment Type | ✅ Mulai–Akhir |

### 24.11 Halaman Payment (Admin)
| Card | Chart | Filter Dropdown | Filter Tanggal |
|---|---|---|---|
| Total Payment, Sukses, Gagal, Pending | — | Metode, Status, Type | ✅ Mulai–Akhir |

### 24.12 Halaman Komplain (Admin)
| Card | Chart | Filter Dropdown | Filter Tanggal |
|---|---|---|---|
| Total, Open, Diproses, Selesai | — | Status, Kategori, Prioritas, CS | ✅ Mulai–Akhir |

### 24.13 Halaman Delivery (Hub)
| Card | Chart | Filter Dropdown | Filter Tanggal |
|---|---|---|---|
| Total, Pending, In Transit, Selesai | — | Status, Kurir, Zona | ✅ Mulai–Akhir |

### 24.14 Halaman Stok (Hub)
| Card | Chart | Filter Dropdown | Filter Tanggal |
|---|---|---|---|
| Total SKU, Tersedia, Menipis, Habis | Bar (stok per kategori) | Kategori, Status Stok | ✅ (created_at) |

### 24.15 Halaman WMS Receiving
| Card | Chart | Filter Dropdown | Filter Tanggal |
|---|---|---|---|
| Expected, Partial, Received, Completed | — | Supplier, Warehouse, Status | ✅ Mulai–Akhir |

### 24.16 Halaman Purchase Order
| Card | Chart | Filter Dropdown | Filter Tanggal |
|---|---|---|---|
| Draft, Approved, Received, Batal | — | Supplier, Status, Warehouse | ✅ Mulai–Akhir |

### 24.17 Halaman Katalog (Customer)
| Card | Chart | Filter Dropdown | Filter Tanggal |
|---|---|---|---|
| — | — | Kategori, Harga Min/Max, Rating, Urutkan | — |

### 24.18 Halaman Riwayat Point (Customer)
| Card | Chart | Filter Dropdown | Filter Tanggal |
|---|---|---|---|
| Saldo, Lifetime Earned, Lifetime Spent | Line (saldo bulan ini) | Tipe Transaksi, Status | ✅ Mulai–Akhir |

### 24.19 Halaman Subscription (Admin)
| Card | Chart | Filter Dropdown | Filter Tanggal |
|---|---|---|---|
| Aktif, Paused, Gagal, Expired | Line (auto-renew/bulan) | Paket, Status, Hub | ✅ Mulai–Akhir |

### 24.20 Halaman Email Logs
| Card | Chart | Filter Dropdown | Filter Tanggal |
|---|---|---|---|
| Terkirim, Gagal, Dibuka, Total | — | Template, Status | ✅ Mulai–Akhir |

---

## 📌 KESIMPULAN V2.1

**Dengan tambahan Section 20–24, review.md kini menjadi blueprint teknis lengkap 106 tabel + 130 migration + 88 controller + 100+ view:**

1. **Relasi antar modul benar** (Section 20) — 14 modul utama sudah terpetakan lengkap dengan field FK
2. **Urutan pengerjaan anti-bug** (Section 21) — 13 fase dependency-driven dengan checklist wajib lulus
3. **Model/Controller/Service lengkap** (Section 22) — 88 arsitektur backend siap koding
4. **View CRUD lengkap** (Section 23) — 100+ blade view per role per modul
5. **Filter/Card/Chart + filter tanggal** (Section 24) — 20 halaman dashboard/list dengan standar filter Mulai–Akhir

**Perbaikan relasi yang sudah diterapkan:**
- ✅ `complaints.hub_id` (notifikasi komplain ke hub)
- ✅ `complaint_messages.is_read` (badge unread CS)
- ✅ `orders.is_backorder` (koneksi backorder)
- ✅ `payments.subscription_cycle_id` (tagihan langganan)
- ✅ `point_transactions.complaint_id` (refund via komplain)
- ✅ `deliveries.packing_order_id` (WMS → Delivery)
- ✅ Hapus duplikat `nullable()` di `users`

---
*Dokumen v2.1 diperbarui: 15 Agustus 2026 — Tambahan Section 20 (Matrix Relasi), 21 (Build Order 12 Fase), 22 (Model & Controller), 23 (View CRUD), 24 (Filter/Card/Chart + Filter Tanggal).*

---
*Dokumen v2.1 (Update 16 Agustus 2026) — Implementasi Prototype Wishlist Interaktif di `/customer` (HTML + JS statis, belum backend):*

1. **Tombol hati di katalog** — `customer/catalog.html` + `js/catalog.js` kini menampilkan ikon hati (`fa-heart`) di pojok kanan atas setiap thumbnail produk dengan atribut `data-wishlist`.
2. **Klik hati ≠ masuk keranjang** — Icon hati memakai `data-wishlist` (bukan `data-add-cart`), sehingga klik hati menyimpan ke wishlist (localStorage key `jastip_wishlist`) dan TIDAK menambahkan ke keranjang. Hal ini membedakan handler `initWishlist()` (baru) dari `initCart()` (existing) di `js/main.js`.
3. **Status hati dinamis** — Produk yang sudah disimpan menampilkan hati merah terisi (`fa-solid fa-heart` + class `.active`); belum disimpan tampil outline (`fa-regular fa-heart`). `window.JastipWishlist.refreshHearts()` menyinkronkan semua tombol setelah render.
4. **Halaman wishlist dinamis** — `customer/wishlists.html` (sebelumnya statis 3 produk hardcoded) kini di-render dari localStorage via file baru `js/wishlist.js`:
   - Grid produk + tombol hapus (hati terisi) + tombol tambah ke keranjang (`data-add-cart`).
   - Jumlah "N Produk Tersimpan" diperbarui realtime.
   - Kartu yang dihapus langsung hilang tanpa reload.
5. **Styling** — `css/style.css` menambah kelas `.product-heart` (tombol bulat putih di pojok thumbnail, merah `#E0245E` saat aktif).
6. **Relevansi dengan blueprint** — Fitur ini merupakan bentuk prototype dari modul `WishlistController` (review.md Section 3/22) dan tabel `wishlists` (migration 0122). Saat migrasi ke Laravel, data localStorage dapat dipindahkan ke endpoint `POST /api/wishlist` + tabel `wishlists` (customer_id, product_id).

---
*Dokumen v2.1 (Update Lanjutan 16 Agustus 2026) — Implementasi Prototype Pembayaran Transfer Bank + Upload Bukti di `/customer` (HTML + JS statis, belum backend):*

1. **`customer/checkout.html` — Metode Pembayaran lengkap:**
   - **Points (Saldo: 125.000 pts)** — Radio default; total belanja (163.000 pts) otomatis dipotong dari saldo poin. Info "Akan dipotong dari saldo points Anda (saldo cukup)" tampil di ringkasan.
   - **Tunai di Hub** — Info "Bayar tunai saat pengambilan di Hub".
   - **QRIS / E-Wallet** — Info instruksi QRIS ditampilkan.
   - **Transfer Bank** — Saat dipilih, muncul form detail (`.pay-detail-box`):
     - Pilih Bank: BCA / BNI / Mandiri / BRI (dropdown `#payBank`).
     - No. Rekening tujuan ditampilkan dinamis sesuai bank (mis. BCA 1234567890 a.n. Jastipku Indonesia) via objek `REKENING`.
     - Upload Bukti Pembayaran (`#payProof`, image/*) dengan preview nama file.
     - Catatan verifikasi 1x24 jam.
   - Tombol **Buat Pesanan** memvalidasi sesuai metode: transfer → wajib pilih bank + upload bukti; points → konfirmasi potong 163.000 pts; tunai/QRIS → alert sesuai alur.

2. **`customer/points-topup.html` — Metode Transfer Bank + Upload Bukti Pembayaran:**
   - Metode Pembayaran kini **hanya Transfer Bank** (radio `name="topupMetode"` value "Transfer Bank").
   - Setelah metode, ada **Pilih Bank** (dropdown `#topupBank`: BCA / BNI / Mandiri / BRI).
   - Saat bank dipilih, **no. rekening tujuan ditampilkan dinamis** (`#topupRekening` + `#topupRekNumber`) via objek `TOPUP_REKENING` (mis. BCA 1234567890 a.n. Jastipku Indonesia).
   - Setelah itu **Upload Bukti Pembayaran** (`#topupProof` + `.file-upload`).
   - Fungsi `topUpSekarang()` memvalidasi: nominal wajib (min Rp 10.000), bank wajib, bukti wajib diisi → alert "Top-up N pts berhasil diproses via Transfer Bank [bank]! Bukti pembayaran sedang diverifikasi."

3. **CSS baru di `css/customer.css`:**
   - `.pay-detail-box`, `.pay-detail-title`, `.pay-detail-desc`, `.pay-detail-note` — kotak form transfer.
   - `.rek-info`, `.rek-label`, `.rek-number`, `.rek-name` — tampilan no. rekening tujuan.
   - `.pay-info` — info ringkasan pembayaran di summary.
   - `.file-upload` — kotak upload bukti bergaris putus-putus dengan ikon + preview nama file.

4. **Validasi & alur nyata (prototype):**
   - Transfer Bank: pilih bank → no rekening tampil → upload bukti → Buat Pesanan → "menunggu verifikasi".
   - Points: potong saldo poin sesuai total belanja.
   - Top-up: nominal → metode → upload bukti → proses top-up.

5. **Relevansi dengan blueprint:** Form transfer + upload bukti ini adalah prototype dari alur `payments` type `topup`/`order` + `payment_methods` code `transfer`/`va` (review.md Section 4.6, 6.2, 19). Saat migrasi ke Laravel, file bukti dapat disimpan via `UploadedFile` + tabel `payments.proof_path`, dan status verifikasi memakai `payments.status` (pending → success). Dropdown bank (BCA/BNI/Mandiri/BRI) dapat disimpan ke `payment_methods` per hub.

---
*Dokumen v2.1 (Update 16 Agustus 2026 — Skema Tier & Ketentuan Poin):*

1. **`customer/subscriptions.html` — Penurunan tier saat berhenti berlangganan:**
   - Panel peringatan `.info-warning` (amber) di bagian "Langganan Aktif" yang menjelaskan: membatalkan langganan → tier turun ke level terendah (Silver) + benefit tier hilang (cashback, diskon, gratis ongkir, akses reward premium) + poin terpakai tidak dikembalikan.
   - Tombol **Batalkan** kini memanggil `batalkanLangganan()` yang menampilkan `confirm()` berisi peringatan penurunan tier sebelum benar-benar membatalkan (menggantikan alert demo sederhana).
   - Setelah dikonfirmasi, fungsi menyimpan penurunan tier ke localStorage: `jastip_tier = 'silver'` dan `jastip_tier_alasan = 'Berhenti langganan di halaman Subscription'` — sehingga **terkoneksi nyata** ke halaman `customer/profile-tier.html`.

2. **`customer/profile-tier.html` — Penurunan tier nyata + ketentuan poin:**
   - Saat halaman dimuat, JS membaca `localStorage.getItem('jastip_tier')`. Jika `'silver'`:
     - Badge tier berubah menjadi **"Silver Member"** (via `#tierName`).
     - Info berlaku menjadi "Tier diturunkan karena berhenti langganan".
     - Muncul panel peringatan `#tierWarningBox` "Tier Telah Diturunkan" + alasan dari `jastip_tier_alasan`.
     - Progress di-reset: "Progress ke Gold" 0%, target Rp 500.000.
     - Tabel benefit menyorot kolom **Silver** (cashback 1%, diskon 0%, dsb).
   - Panel info `.info-note` (hijau) baru: **Poin hanya dapat digunakan/ditukar dengan barang atau reward** (produk, voucher belanja, paket umroh, berqurban, dll).
   - Poin **TIDAK dapat ditukar menjadi uang tunai** dan tidak dapat ditarik (non-cashable / non-withdrawable).

3. **CSS baru di `css/customer.css`:**
   - `.info-warning` — kotak peringatan amber (background `#FFF8E1`, border `#F0C040`, teks `#7A5B00`) dengan ikon segitiga.
   - `.info-note` — kotak info hijau (background `var(--gn50)`, border `var(--gn100)`, teks `var(--gn700)`) dengan ikon info.

4. **Relevansi dengan blueprint:** Skema ini merepresentasikan aturan bisnis yang kelak diimplementasikan di `TierService` (auto-downgrade saat subscription cancel → `customer_tier_history` reason `auto_downgrade`, Section 17.4 tabel #76) dan kebijakan poin non-tunai (`point_transactions` type hanya topup/purchase/redeem/cashback/bonus/expired/refund/adjustment — tidak ada cash-out; Section 4.4, 9.6). Saat migrasi ke Laravel, cancel subscription akan memanggil `TierService::downgradeToLowest()` + mencatat ke `customer_tier_history` dan mengirim email "Tier diturunkan" (Section 16.3). Pada prototype ini, sinkronisasi antar halaman diwakili oleh localStorage (`jastip_tier`) — setara dengan membaca `customer_profiles.membership_tier_id` dari database.

---
*Dokumen v2.1 (Update 16 Agustus 2026 — Tombol Pilih Paket & Tier Terendah Bronze):*

1. **`customer/subscriptions.html` — Tombol "Pilih Paket" berfungsi (berlangganan aktif):**
   - Setiap tombol Pilih Paket (Hemat / Keluarga / Premium) memanggil `pilihPaket(namaPaket, hargaPts)`:
     - Menyimpan ke localStorage: `jastip_subscription = { paket, harga, status: 'aktif' }`.
     - Mengembalikan tier ke **Gold** (`jastip_tier = 'gold'`) + hapus `jastip_tier_alasan`.
     - Memperbarui panel **"Langganan Anda"** (`updateSubscriptionUI()`): badge **Aktif**, nama paket, harga; peringatan penurunan tier disembunyikan.
     - Alert: "Berhasil berlangganan paket [nama]! Tier Anda kembali ke Gold."

2. **Berhenti langganan → grade terendah (Bronze):**
   - `batalkanLangganan()` menyimpan `jastip_subscription.status = 'tidak aktif'`, `jastip_tier = 'bronze'` + `jastip_tier_alasan = 'Berhenti langganan di halaman Subscription'`.
   - Panel "Langganan Anda" berubah: badge **Tidak Aktif** (gray), paket '—', harga '—', peringatan penurunan tier muncul.
   - Alert: "Langganan dibatalkan! Tier Anda telah turun ke Bronze."

3. **`customer/profile-tier.html` — Status grade sinkron dengan subscription:**
   - Tabel benefit kini memiliki kolom **Bronze** (hierarki: Bronze 0% cashback → Silver 1% → Gold 3% → Platinum 5% → Diamond 8%).
   - Jika `jastip_tier = 'bronze'` (berhenti langganan): badge **"Bronze Member"**, progres "Progress ke Silver" 0%, panel `tierWarningBox` "Tier Telah Diturunkan" + alasan, kolom Bronze disorot.
   - Jika `jastip_tier = 'gold'` (berlangganan aktif) atau tidak diset: badge **"Gold Member"** dengan progres ke Platinum 75% (default).

4. **`customer/points-topup.html` — Info peringatan poin non-tunai:**
   - Panel `.info-warning` baru di atas form Top Up:
     > **Perhatian — Poin Tidak Bisa Diklaim dengan Uang:** Poin Anda TIDAK dapat diklaim/ditukar dengan uang tunai. Poin hanya dapat digunakan untuk **berbelanja barang** (produk, voucher belanja, paket umroh, berqurban, dll).

5. **Relevansi ke blueprint:** Layer ini set `set` `subscriptions.status` ('active'/'cancelled') + `customer_profiles.membership_tier_id` (bronze = id terendah) + `customer_tier_history` reason `auto_downgrade`. Saat migrasi ke Laravel: `pilihPaket()` → `SubscriptionService::subscribe()` (status active) + `TierService::upgradeTo('gold')`; `batalkanLangganan()` → `SubscriptionService::cancel()` + `TierService::downgradeToLowest()` ('bronze'). Peringatan poin non-tunai di top-up mengikuti `point_expiry_rules` & `point_transactions` (tidak ada tipe cash-out).

---

## 📌 V2.1 (Update Tambahan 16 Agustus 2026) — SKEMA UPGRADE TIER OTOMATIS + DURASI LANGGANAN

> 💡 **Tujuan:** Customer tier otomatis naik (upgrade) ketika **total belanja** dan/atau **lama berlangganan (tahun)** melebihi ambang yang ditentukan. Ini memperbaiki perilaku sebelumnya (pilih paket → langsung Gold, berhenti → langsung Bronze) menjadi skema berbasis data.

### Skema Ambang Tier (RUJUKAN — `js/tier.js`)

| Tier | Min Total Belanja (Rp) | Min Lama Berlangganan (tahun) |
|---|---|---|
| Bronze | 0 | 0 |
| Silver | 1.000.000 | 1 |
| Gold | 5.000.000 | 3 |
| Platinum | 10.000.000 | 5 |
| Diamond | 25.000.000 | — |

> **Cara penghitungan:** tier = tier tertinggi yang memenuhi **kedua kondisi** (spend ≥ minSpend AND years ≥ minYears).

### 2. File Baru — `js/tier.js`

```js
var TIER_THRESHOLDS = [
  { tier: 'bronze',   minSpend: 0,        minYears: 0 },
  { tier: 'silver',   minSpend: 1000000,  minYears: 1 },
  { tier: 'gold',     minSpend: 5000000,  minYears: 3 },
  { tier: 'platinum', minSpend: 10000000, minYears: 5 },
  { tier: 'diamond',  minSpend: 25000000, minYears: 0 }
];

function calcTier(totalSpend, subscriptionYears) {
  var current = { tier: 'bronze' };
  TIER_THRESHOLDS.forEach(function (t) {
    if (totalSpend >= t.minSpend && subscriptionYears >= t.minYears) {
      // pilih yang paling tinggi
      ...
    }
  });
  return current;
}
```

**API yang diekspor:**
- `JastipTier.getTier()` → baca `localStorage.jastip_tier` (default: `'bronze'`)
- `JastipTier.autoUpgradeTier(totalSpend, years)` → hitung & simpan jika naik
- `JastipTier.thresholds` → array ambang tier

### 3. Integrasi `js/customer-layout.js` (Layout customer)

- Saat halaman customer dimuat (dashboard, subscription, profile-tier), panggil `autoUpgradeTier()` dengan data mock:
  - `totalSpend` — dari `customer_profiles[0].total_spend` (atau fallback 5.000.000)
  - `subscriptionYears` — dari perbandingan `subscriptions.start_date` vs hari ini (atau fallback 3 tahun)
- Jika tier naik → tampilkan toast **"Selamat! Tier Anda naik ke Gold 🎉"**

### 4. `customer/subscriptions.html` (SKEMA BARU — bukan langsung Gold)

- **pilihPaket(nama, harga):**
  - Simpan `jastip_subscription = { paket, harga, status: 'aktif' }`
  - **Tidak hardcode `jastip_tier='gold'`** — melainkan panggil `autoUpgradeTier(totalSpend, years)` agar tier dihitung berdasarkan spend + durasi
  - Update UI dengan hasil dari localStorage
- **batalkanLangganan():**
  - Set `jastip_subscription.status = 'tidak aktif'`
  - **Jangan langsung hardcode bronze** — setelah berhenti, hitung ulang dari spend terakhir (jika spend masih tinggi, tier tidak harus turun)
  - Simpan `jastip_tier_alasan = 'Berhenti langganan di halaman Subscription'`

### 5. `customer/profile-tier.html` (pembaruan)

- Baca `JastipTier.getTier()` (bukan asumsi gold/bronze)
- Tampilkan badge & progress sesuai tier aktif
- Panel warning hanya muncul jika `jastip_tier_alasan` terisi

### 6. Relevansi dengan blueprint Laravel

| Prototype (lokalStorage) | Laravel |
|---|---|
| `jastip_tier` | `customer_profiles.membership_tier_id` |
| `autoUpgradeTier()` | `TierService::autoUpgrade()` — review.md Section 17.4 |
| `subscriptions.start_date` → years | `Subscriptions.start_date` → `diffInYears()` |
| Pilih paket → auto upgrade | `SubscriptionService::subscribe()` + `TierService::upgradeTo()` |
| Berhenti → recalculate | `TierService::recalculate()` + `customer_tier_history` `auto_upgrade`/`auto_downgrade` |

---

---

## 📌 V2.1 (Update Lanjutan 16 Agustus 2026) — PANDUAN TATA CARA DASHBOARD CUSTOMER

> 💡 **Tujuan:** Menyediakan halaman panduan lengkap bagi customer agar mudah memahami cara pengoperasian setiap menu di dashboard, dengan tampilan modern-minimalis profesional.

### 1. Halaman Baru — `dashboard/customer-guide.html`

Halaman **"Tata Cara Penggunaan Dashboard"** dengan gaya premium (hero gradasi hijau, kartu, search realtime):

- **Hero Header** — judul, breadcrumb, tombol kembali ke dashboard.
- **Stat Cards** — ringkasan: 13 menu dijelaskan, 100% fitur interaktif, info lengkap, 5 tier (Bronze–Diamond).
- **Pencarian Realtime** — memfilter kartu panduan per menu berdasarkan kata kunci.
- **13 Kartu Panduan Menu**, masing-masing berisi:
  - Ikon + nama menu + tombol "Buka" (link langsung ke halaman).
  - Deskripsi / pengertian singkat menu.
  - **Cara Pengoperasian** berupa numbered steps.

Menu yang dijelaskan:
| # | Menu | Path |
|---|---|---|
| 1 | Dashboard (Beranda) | `dashboard/customer.html` |
| 2 | Katalog | `customer/catalog.html` |
| 3 | Keranjang | `customer/cart.html` |
| 4 | Pesanan | `customer/orders.html` |
| 5 | Points & Top Up | `customer/points-topup.html` |
| 6 | Rewards | `customer/rewards.html` |
| 7 | Subscription (Paket Member) | `customer/subscriptions.html` |
| 8 | Komplain | `customer/complaints.html` |
| 9 | Profil & Tier | `customer/profile-tier.html` |
| 10 | Wishlist | `customer/wishlists.html` |
| 11 | Review Produk | `customer/product-reviews.html` |
| 12 | Preferensi Email | `customer/email-preferences.html` |
| 13 | Referral | `customer/referrals.html` |

- **Tips & Aturan Penting** — poin non-tunai, upgrade tier otomatis, ongkir sudah termasuk, dua sumber pesanan (Belanja & Paket Member).
- **Alur Penggunaan End-to-End** — 7 langkah (Isi Saldo → Belanja → Checkout → Pantau → Terima & Review → Upgrade Tier → Referral & Reward).
- Footer support (`support@jastip.id` + link Komplain).

### 2. Integrasi Tombol — `dashboard/customer.html`

Tombol **"Tata Cara Penggunaan"** ditambahkan di **Welcome Banner** (kiri, tombol putih solid dengan ikon info, kontras di banner hijau) yang mengarah ke `customer-guide.html`. Penempatan hanya di welcome banner agar jelas dan mudah dibaca pengguna.

### 3. Relevansi dengan Blueprint Laravel

| Prototype (HTML+JS) | Laravel |
|---|---|
| `dashboard/customer-guide.html` | View `customer/dashboard-guide.blade` (opsional) |
| Menu statis 13 | Route resource customer sesuai `review.md` Section 23 |
| Search realtime (JS) | Livewire/Inertia search atau Alpine.js |
| Stat cards | Komponen `card-stat` reusable (Section A.3) |

---

*Update v2.1 (16 Agustus 2026): Ditambahkan halaman Panduan Tata Cara Dashboard Customer ke `view.md` (Section J.8) & `review.md` (Section V2.1 update lanjutan).*

---

## 📌 V2.1 (Update 16 Agustus 2026) — FORM RETUR BARANG HUB (SKEMA RETUR LENGKAP)

> 💡 **Tujuan:** Menambahkan form retur lengkap di menu **Penerimaan / Retur** pada role Hub agar hub dapat mengajukan retur barang per-item dengan alasan, catatan, dan bukti foto. Mengikuti skema tabel `delivery_returns` (Section 18, tabel #89) dengan 6 status: `requested → approved → picked_up → returned → refunded / rejected`.

### 1. File Baru — `js/return-data.js`

Satu sumber data retur hub dengan struktur mengikuti skema `delivery_returns`:

```js
{
  id: 'RT-2026-012',          // return_code (auto-generate)
  ref: 'DEL-2026-118',        // delivery_id / stock_order_id
  jenis: 'Delivery',          // Delivery / Order Stok
  status: 'requested',        // requested/approved/picked_up/returned/refunded/rejected
  tanggal: '16 Agu 2026',     // requested_at
  alasan: 'Barang rusak',     // reason (wrong_item/damaged/expired/customer_refused/other)
  catatan: '2 dari 10 beras penyok',  // description
  items: [                    // detail barang retur
    { nama: 'Beras Premium 5kg', qty_kirim: 10, qty_retur: 2 }
  ],
  bukti: null                 // bukti foto (opsional)
}
```

**API yang diekspor (`window.JastipReturns`):**
| Fungsi | Deskripsi |
|---|---|
| `getAll()` | Ambil semua data retur (localStorage `jastip_returns` + fallback demo) |
| `getById(id)` | Ambil satu retur berdasarkan kode |
| `add(data)` | Tambah retur baru (status otomatis `requested`, kode auto-generate `RT-xxx`) |
| `updateStatus(id, status)` | Ubah status retur |
| `statusBadge(status)` | HTML badge sesuai status (6 warna) |
| `statusLabel(status)` | Label Indonesia per status |
| `formatItems(items)` | Format detail barang "Nama (retur qty/kirim)" |

**Status & Badge:**
| Status | Label | Badge |
|---|---|---|
| `requested` | Diajukan | kuning |
| `approved` | Disetujui | biru |
| `picked_up` | Dijemput | biru |
| `returned` | Dikembalikan | merah |
| `refunded` | Refund | hijau |
| `rejected` | Ditolak | abu-abu |

### 2. `hub/delivery-returns.html` (EDIT) — Halaman Penerimaan / Retur Lengkap

- **Tombol "Buat Retur"** di header halaman.
- **Modal Form Retur** berisi:
  - Dropdown **Referensi** (Delivery: DEL-2026-118/117/116, Order Stok: SO-2026-084/083).
  - Dropdown **Alasan Retur**: Barang rusak, Barang kurang, Salah kirim, Alamat tidak ditemukan, Customer menolak, Lainnya.
  - **Tabel Detail Barang per-item**: checkbox pilih + nama barang + qty kirim + input qty retur (disabled sampai dicentang, max = qty kirim).
  - Input **Catatan** tambahan.
  - Upload **Bukti Foto** (opsional, `accept="image/*"`).
  - Tombol **Ajukan Retur** → validasi (referensi wajib, minimal 1 item dengan qty > 0) → simpan via `JastipReturns.add()` → toast sukses.
- **Tabel Riwayat** dengan kolom: Kode, Referensi, Jenis, Detail Barang (nama + qty retur/kirim), Alasan, Status (6 badge), Tanggal, Aksi (Detail).
- **Modal Detail Retur**: info lengkap (kode, referensi, jenis, alasan, status, tanggal, catatan) + tabel barang retur.
- **Filter status** 6 status + search + stat cards (Total, Diajukan, Disetujui, Dikembalikan, Refund).
- **Dukungan parameter URL** `?ref=...&jenis=...` → form retur terbuka otomatis dengan referensi terisi (dari tombol Ajukan Retur di deliveries/receiving).

### 3. `hub/deliveries.html` (EDIT) — Integrasi Tombol Ajukan Retur

- Tambah tombol **"Ajukan Retur"** di modal laporan penerimaan.
- Klik → redirect ke `delivery-returns.html?ref=DEL-xxx&jenis=Delivery` → form retur terbuka otomatis dengan referensi delivery terisi.

### 4. `hub/receiving.html` (EDIT) — Integrasi Tombol Ajukan Retur

- Tambah tombol **"Ajukan Retur"** di modal laporan penerimaan.
- Klik → redirect ke `delivery-returns.html?ref=SO-xxx&jenis=Order Stok` → form retur terbuka otomatis dengan referensi order stok terisi.

### 5. Alur Retur End-to-End

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

### 6. Relevansi dengan Blueprint Laravel

| Prototype (HTML+JS) | Laravel |
|---|---|
| `js/return-data.js` (localStorage `jastip_returns`) | Tabel `delivery_returns` (Section 18, tabel #89) + `ReturnService` |
| `JastipReturns.add()` | `DeliveryReturnController@store` + `ReturnService::create()` |
| `JastipReturns.updateStatus()` | `DeliveryReturnController@update` (approve/pickup/return/refund/reject) |
| Status `requested/approved/picked_up/returned/refunded/rejected` | Enum `delivery_returns.status` (Section 18.2) |
| Form retur per-item (qty_kirim, qty_retur) | `delivery_return_items` (tabel detail retur) |
| Upload bukti foto | `delivery_returns.proof_photo` / `delivery_proofs` |
| Parameter URL `?ref=` | Route `hub/delivery-returns/create?delivery_id=xxx` |
| Alasan retur (Barang rusak, dll) | Enum `delivery_returns.reason` (wrong_item/damaged/expired/customer_refused/other) |
| Refund setelah retur | `payment_refunds` + `ReturnService` memicu refund (Section 18.4) |

---

*Update v2.1 (16 Agustus 2026): Ditambahkan Form Retur Barang Hub (Section V2.1 update lanjutan) ke `view.md` (Section J.7.4) & `review.md` (Section V2.1 update lanjutan).*

---

## 20. GAP ANALYSIS DASHBOARD ADMIN & RENCANA PERBAIKAN (17 Agustus 2026)

> **Sumber analisis:** pemeriksaan menyeluruh pada `dashboard/hub.html`, `dashboard/hub/orders.html`, `dashboard/hub/deliveries.html`, `dashboard/hub/stock-order.html`, `dashboard/hub/receiving.html`, `dashboard/superadmin.html`, `dashboard/superadmin/`, `js/auth.js`, `js/superadmin-layout.js`, `js/superadmin-core.js`, `js/superadmin-data.js`, `js/order-data.js`, `customer/orders.html`, `customer/checkout.html`, `data/dashboard.json`.

### 20.1 Manajemen Pesanan (Order Management) — SUDAH ADA, PERLU DISEMPURNAKAN

**Kondisi saat ini:**

| Sumber Order | Halaman | Fitur yang Ada | Gap |
|---|---|---|---|
| **Checkout** (Belanja 1×24 jam verifikasi) | `customer/orders.html` | Filter status + sumber + stat cards | ❌ Tidak ada detail pesanan, aksi, cetak invoice |
| **Paket Member** (Subscription auto-renewal) | `customer/orders.html` | Badge sumber "Paket Member" | ❌ Tidak ada detail pesanan |
| **Hub sebagai Customer** (checkout + member) | `dashboard/hub/hub-orders.html` | Filter status + sumber | ❌ Tidak ada aksi/konfirmasi |
| **Hub order ke pusat** | `dashboard/hub/orders.html` | Tabel sederhana | ❌ Tidak ada detail, aksi, export CSV |
| **Superadmin** | ❌ **BELUM ADA** | - | 🔴 **Perlu halaman `orders.html`** — semua pesanan semua hub dengan filter sumber |

**Rekomendasi perbaikan (prioritas 🟠 Sedang):**
1. Halaman **Manajemen Pesanan Superadmin** (`dashboard/superadmin/orders.html`) — modul `orders` di `superadmin-data.js` dengan kolom: Kode, Customer, Hub, Sumber (Belanja/Paket Member), Total, Status, Tanggal + filter + aksi status.
2. **Detail pesanan** (modal) di `hub/orders.html`, `hub/hub-orders.html`, `customer/orders.html`.
3. **Aksi per pesanan**: Konfirmasi → Proses → Kirim → Selesai → Batalkan.
4. **Export CSV/Excel berfungsi** (ganti `showToast('Export menyusul (Demo)')`).

### 20.2 Manajemen Pengiriman (Delivery Management) — SUDAH ADA, PERLU DISEMPURNAKAN — SUDAH ADA, PERLU DISEMPURNAKAN + MODUL SUPERADMIN BARU

**Perubahan yang dilakukan (22 Agustus 2026):**

- **`dashboard/superadmin/deliveries.html` (BARU)** — Halaman **Pengiriman** superadmin: CRUD lengkap, 4 kartu statistik (Total, Dikirim, Dalam Perjalanan, Gagal/Retur), filter Hub/Kurir/Status + tanggal, data contoh, pagination.
- **`js/superadmin-data.js` (EDIT)** — Modul `deliveries` baru: kolom Kode Delivery, Order, Customer, Hub, Kurir, Status, Tanggal; CRUD via localStorage (`jastip_sa_deliveries`).
- **`js/superadmin-layout.js` (EDIT)** — Menu **"Pengiriman"** (ikon `fa-truck-fast`) ditambahkan ke group **Operasional** sidebar superadmin + update `FILE_TO_MENU` & `FILE_TO_GROUP`.
- **`js/superadmin-core.js` (EDIT)** — Tambah warna badge untuk status `retur` (merah) dan `dalam perjalanan` (amber).

**Kondisi saat ini (peran hub = penyalur):**

| Fitur | Status | Detail |
|---|---|---|
| Delivery masuk dari pusat | ✅ Ada | `dashboard/hub/deliveries.html` + badge status |
| Laporan penerimaan (Diterima/Dikembalikan) | ✅ Ada | Modal + simpan laporan + catatan |
| Ajukan Retur (6 status) | ✅ Ada | `dashboard/hub/delivery-returns.html` + `js/return-data.js` |
| **Cetak Surat Jalan** | ❌ Belum | Perlu template print via `window.print()` |
| **Label Pengiriman (barcode/QR)** | ❌ Belum | Perlu template print |
| **Assign kurir** | ❌ Tidak | Dikelola pusat (sesuai penyederhanaan peran hub) |
| **Export CSV/Excel** | ❌ Belum | Masih demo |

**Rekomendasi perbaikan (prioritas 🟠 Sedang):**
1. **Cetak Surat Jalan** di `dashboard/hub/deliveries.html` — tombol per delivery + template (no delivery, order, asal, detail barang, ETA, penerima).
2. **Cetak Label Pengiriman** (barcode/QR) per delivery.

### 20.3 Manajemen Pembelian ke Supplier (Procurement) — MODUL ADA, MENU SEBELUMNYA BELUM TAMPIL ✅ **SUDAH DIPERBAIKI**

**Kondisi saat ini:**

| Modul Superadmin | File Data | Sidebar Sebelumnya | Sidebar Sekarang (17 Agu) |
|---|---|---|---|
| Purchase Request (PR) | ✅ `superadmin-data.js` | ❌ Tidak tampil | ✅ Group **Pengadaan** |
| Approval PR | ✅ `superadmin-data.js` | ❌ Tidak tampil | ✅ Group **Pengadaan** |
| **Purchase Order (PO)** | ✅ `superadmin-data.js` (CRUD + hasPrint) | ❌ Tidak tampil | ✅ Group **Pengadaan** |
| ETA Dashboard | ✅ `superadmin-data.js` | ❌ Tidak tampil | ✅ Group **Pengadaan** |
| Supplier Performance | ✅ `superadmin-data.js` | ❌ Tidak tampil | ✅ Group **Pengadaan** |
| Replenishment Suggestion | ✅ `superadmin-data.js` | ❌ Tidak tampil | ✅ Group **Pengadaan** |
| Backorder | ✅ `superadmin-data.js` | ❌ Tidak tampil | ✅ Group **Pengadaan** |

**Perubahan yang dilakukan (17 Agustus 2026):**
- **`js/superadmin-layout.js` (EDIT)** — Tambah group **"Pengadaan"** di sidebar superadmin (7 menu: Purchase Request, Approval PR, Purchase Order, ETA Dashboard, Supplier Performance, Replenishment, Backorder). Update `FILE_TO_MENU` + `FILE_TO_GROUP` agar menu aktif ditandai benar.
- Halaman-halaman modul (ADA DI FOLDER): `dashboard/superadmin/purchase-requests.html`, `purchase-request-approval.html`, `purchase-orders.html`, `po-eta-dashboard.html`, `supplier-performance.html`, `replenishment-suggestions.html`, `backorders.html`.

### 20.4 Cetak Surat Pesanan Otomatis (Purchase Order) — ✅ **DIIMPLEMENTASIKAN (17 Agustus 2026)**

**Fitur baru:**
- **`js/superadmin-core.js` (EDIT)** — Fungsi `printPurchaseOrder(module, row)`:
  - Membuka window baru **template surat pesanan otomatis** berisi:
    - **Kop perusahaan**: "JASTIP ERP", alamat (Jl. Merdeka No. 1, Jakarta Pusat), telepon, email
    - **No. PO** (`row.code`) + **tanggal otomatis** (`toLocaleDateString('id-ID')`)
    - **Data supplier**: nama, alamat, kontak, ETA
    - **Tabel item**: No, SKU, Nama Barang, Qty, Harga Satuan, Subtotal (dari `row.items`)
    - **Ringkasan keuangan**: Subtotal, PPN, Freight, TOTAL
    - **Status PO** + syarat ketentuan
    - **Kolom tanda tangan**: Dibuat Oleh, Menyetujui, Supplier
  - Print via `window.print()` + CSS print-friendly
- **`js/superadmin-data.js` (EDIT)** — Modul `purchase-orders`:
  - Tambah `hasPrint: true` → tombol **🖨️ cetak** muncul di kolom Aksi
  - Rows PO dilengkapi: `contact`, `supplierAddress`, `createdBy`, `approvedBy`, `items[]` (sku, nama, qty, harga)
- **Verifikasi**: `node --check` pada `superadmin-layout.js`, `superadmin-core.js`, `superadmin-data.js` → **OK tanpa error**.

### 20.5 Tabel Prioritas Perbaikan

| Prioritas | Fitur | Status | File |
|---|---|---|---|
| ✅ Selesai | Menu **Pengadaan** di sidebar superadmin | **DIPERBAIKI 17 Agu** | `js/superadmin-layout.js` |
| ✅ Selesai | **Cetak Surat Pesanan Otomatis** (PO) | **DIIMPLEMENTASIKAN 17 Agu** | `js/superadmin-core.js`, `js/superadmin-data.js` |
| 🟠 Sedang | Halaman **Manajemen Pesanan Superadmin** | Belum | `dashboard/superadmin/orders.html` + modul `orders` |
| 🟠 Sedang | **Detail pesanan + aksi** di hub & customer | Belum | `hub/orders.html`, `hub/hub-orders.html`, `customer/orders.html` |
| 🟠 Sedang | **Cetak Surat Jalan** di deliveries | Belum | `dashboard/hub/deliveries.html` |
| 🟡 Rendah | **Export CSV/Excel** berfungsi | Belum | Semua halaman hub |
| 🟡 Rendah | **Cetak Invoice / Struk** pesanan | Belum | Halaman order |

---

*Update v2.2 (17 Agustus 2026): Menambahkan Section 20 — Gap Analysis Dashboard Admin & Rencana Perbaikan. Implementasi utama: **grup menu Pengadaan** di sidebar superadmin (7 modul Procurement) + **cetak surat pesanan otomatis** (Purchase Order) dengan template lengkap.*

---

*Update v2.3 (22 Agustus 2026): Menambahkan modul **Pengiriman (Delivery Management)** di dashboard superadmin — halaman `dashboard/superadmin/deliveries.html`, menu "Pengiriman" di sidebar Operasional, data CRUD modul `deliveries`, dan badge status `retur`/`dalam perjalanan` di `superadmin-core.js`.*
