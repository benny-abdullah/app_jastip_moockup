/* ============================================================
   JASTIP — OPERATOR DATA JS
   Satu sumber data pour SEMUA halaman operator:
   cards, charts, tabel CRUD, dropdown filter.
   Data disimpan di localStorage agar CRUD (tambah/edit/hapus)
   tetap berfungsi + fallback data default inline.
   ============================================================ */

(function () {
  'use strict';

  var MODULES = {};

  /* ================= DASHBOARD UTAMA ================= */
  MODULES.dashboard = {
    id: 'dashboard', title: 'Dashboard Operator', desc: 'Ringkasan kinerja operasional Jastip',
    cards: [
      { label: 'Total Penjualan (30 hari)', value: 'Rp 685.420.000', sub: '+14,2% vs bulan lalu', icon: 'fa-solid fa-sack-dollar', color: 'linear-gradient(135deg,#00AA5B,#34d399)' },
      { label: 'Total Order', value: '8.942', sub: '1.240 order hari ini', icon: 'fa-solid fa-cart-shopping', color: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
      { label: 'Customer Aktif', value: '12.486', sub: '348 baru minggu ini', icon: 'fa-solid fa-user-group', color: 'linear-gradient(135deg,#8b5cf6,#a78bfa)' },
      { label: 'Komplain Open', value: '23', sub: '5 urgent butuh tindakan', icon: 'fa-solid fa-headset', color: 'linear-gradient(135deg,#f59e0b,#fbbf24)' }
    ],
    charts: [
      { title: 'Penjualan per Bulan', type: 'line', labels: ['Mar','Apr','Mei','Jun','Jul','Agu'], data: [420, 480, 510, 565, 610, 685], color: '#00AA5B' },
      { title: 'Status Order', type: 'doughnut', labels: ['Selesai','Diproses','Dikirim','Batal'], data: [64, 18, 12, 6] },
      { title: 'Top 5 Produk Terlaris', type: 'bar', labels: ['Beras 5kg','Minyak 2L','Gula 1kg','Telur 1kg','Kopi Sachet'], data: [1820, 1540, 1380, 1210, 980], color: '#0ea5e9' }
    ],
    filters: [
      { id: 'hubFilter', label: 'Hub', options: ['Semua Hub','Jakarta Selatan','Bandung','Surabaya','Medan','Makassar'] },
      { id: 'statusFilter', label: 'Status', options: ['Semua Status','Selesai','Diproses','Dikirim','Batal'] }
    ],
    hasDateFilter: true,
    chips: ['Semua', '7 Hari', '30 Hari', '90 Hari', '1 Tahun'],
    columns: [
      { key: 'orderCode', label: 'Kode Order' }, { key: 'customer', label: 'Customer' }, { key: 'hub', label: 'Hub' },
      { key: 'totalPoints', label: 'Total Poin', type: 'points' }, { key: 'status', label: 'Status', type: 'badge' }, { key: 'date', label: 'Tanggal' }
    ],
    rows: [
      { orderCode: 'ORD-2026-0815-001', customer: 'Budi Santoso', hub: 'Jakarta Selatan', totalPoints: 245000, status: 'Selesai', date: '15 Agu 2026' },
      { orderCode: 'ORD-2026-0815-002', customer: 'Siti Rahayu', hub: 'Bandung', totalPoints: 118500, status: 'Dikirim', date: '15 Agu 2026' },
      { orderCode: 'ORD-2026-0815-003', customer: 'Andi Wijaya', hub: 'Surabaya', totalPoints: 467000, status: 'Diproses', date: '15 Agu 2026' },
      { orderCode: 'ORD-2026-0814-018', customer: 'Dewi Lestari', hub: 'Jakarta Selatan', totalPoints: 89000, status: 'Selesai', date: '14 Agu 2026' },
      { orderCode: 'ORD-2026-0814-019', customer: 'Rudi Hartono', hub: 'Medan', totalPoints: 324000, status: 'Batal', date: '14 Agu 2026' },
      { orderCode: 'ORD-2026-0814-020', customer: 'Maya Anggraini', hub: 'Makassar', totalPoints: 156000, status: 'Selesai', date: '14 Agu 2026' }
    ],
    hasCrud: false
  };

  /* ================= MANAJEMEN PESANAN ================= */
  MODULES.orders = {
    id: 'orders', title: 'Manajemen Pesanan', desc: 'Semua pesanan customer & hub', icon: 'fa-solid fa-cart-shopping', hasCrud: true,
    cards: [
      { label: 'Total Pesanan', value: '8.942', sub: 'bulan Agustus', icon: 'fa-solid fa-cart-shopping', color: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
      { label: 'Pesanan Selesai', value: '5.720', sub: '64% dari total', icon: 'fa-solid fa-circle-check', color: 'linear-gradient(135deg,#00AA5B,#34d399)' },
      { label: 'Pesanan Diproses', value: '1.610', sub: '18% dari total', icon: 'fa-solid fa-gears', color: 'linear-gradient(135deg,#f59e0b,#fbbf24)' },
      { label: 'Pesanan Batal', value: '536', sub: '6% dari total', icon: 'fa-solid fa-circle-xmark', color: 'linear-gradient(135deg,#ef4444,#f87171)' }
    ],
    filters: [
      { id: 'hubFilter', label: 'Hub', options: ['Semua Hub','Jakarta Selatan','Bandung','Surabaya','Medan','Makassar'] },
      { id: 'statusFilter', label: 'Status', options: ['Semua Status','Selesai','Diproses','Dikirim','Batal'] }
    ],
    hasDateFilter: true,
    chips: ['Semua', 'Selesai', 'Diproses', 'Dikirim', 'Batal'],
    columns: [
      { key: 'orderCode', label: 'Kode Order' }, { key: 'customer', label: 'Customer' }, { key: 'hub', label: 'Hub' },
      { key: 'totalPoints', label: 'Total Poin', type: 'points' }, { key: 'status', label: 'Status', type: 'badge' }, { key: 'date', label: 'Tanggal' }
    ],
    rows: [
      { orderCode: 'ORD-2026-0815-001', customer: 'Budi Santoso', hub: 'Jakarta Selatan', totalPoints: 245000, status: 'Selesai', date: '15 Agu 2026' },
      { orderCode: 'ORD-2026-0815-002', customer: 'Siti Rahayu', hub: 'Bandung', totalPoints: 118500, status: 'Dikirim', date: '15 Agu 2026' },
      { orderCode: 'ORD-2026-0815-003', customer: 'Andi Wijaya', hub: 'Surabaya', totalPoints: 467000, status: 'Diproses', date: '15 Agu 2026' },
      { orderCode: 'ORD-2026-0814-018', customer: 'Dewi Lestari', hub: 'Jakarta Selatan', totalPoints: 89000, status: 'Selesai', date: '14 Agu 2026' },
      { orderCode: 'ORD-2026-0814-019', customer: 'Rudi Hartono', hub: 'Medan', totalPoints: 324000, status: 'Batal', date: '14 Agu 2026' },
      { orderCode: 'ORD-2026-0814-020', customer: 'Maya Anggraini', hub: 'Makassar', totalPoints: 156000, status: 'Selesai', date: '14 Agu 2026' }
    ],
    modalFields: [
      { key: 'orderCode', label: 'Kode Order', type: 'text' },
      { key: 'customer', label: 'Customer', type: 'text' },
      { key: 'hub', label: 'Hub', type: 'select', options: ['Jakarta Selatan','Bandung','Surabaya','Medan','Makassar'] },
      { key: 'totalPoints', label: 'Total Poin', type: 'number' },
      { key: 'status', label: 'Status', type: 'select', options: ['Selesai','Diproses','Dikirim','Batal'] },
      { key: 'date', label: 'Tanggal', type: 'date' }
    ]
  };

  /* ================= PENGIRIMAN ================= */
  MODULES.deliveries = {
    id: 'deliveries', title: 'Pengiriman', desc: 'Manajemen pengiriman & tracking', icon: 'fa-solid fa-truck-fast', hasCrud: true,
    cards: [
      { label: 'Total Pengiriman', value: '3.240', sub: 'bulan Agustus', icon: 'fa-solid fa-truck-fast', color: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
      { label: 'Dikirim', value: '2.890', sub: '89,2% on-time', icon: 'fa-solid fa-circle-check', color: 'linear-gradient(135deg,#00AA5B,#34d399)' },
      { label: 'Dalam Perjalanan', value: '312', sub: '9,6% dari total', icon: 'fa-solid fa-truck-ramp-box', color: 'linear-gradient(135deg,#f59e0b,#fbbf24)' },
      { label: 'Gagal / Retur', value: '38', sub: '1,2% dari total', icon: 'fa-solid fa-circle-xmark', color: 'linear-gradient(135deg,#ef4444,#f87171)' }
    ],
    filters: [
      { id: 'hubFilter', label: 'Hub', options: ['Semua Hub','Jakarta Selatan','Bandung','Surabaya','Medan','Makassar'] },
      { id: 'statusFilter', label: 'Status', options: ['Semua Status','Dikirim','Dalam Perjalanan','Gagal','Retur'] }
    ],
    hasDateFilter: true,
    chips: ['Semua', 'Dikirim', 'Dalam Perjalanan', 'Gagal', 'Retur'],
    columns: [
      { key: 'deliveryCode', label: 'Kode Delivery' }, { key: 'orderCode', label: 'Order' }, { key: 'hub', label: 'Hub' },
      { key: 'kurir', label: 'Kurir' }, { key: 'status', label: 'Status', type: 'badge' }, { key: 'date', label: 'Tanggal' }
    ],
    rows: [
      { deliveryCode: 'DLV-2026-0815-001', orderCode: 'ORD-2026-0815-001', hub: 'Jakarta Selatan', kurir: 'Rudi', status: 'Dikirim', date: '15 Agu 2026' },
      { deliveryCode: 'DLV-2026-0815-002', orderCode: 'ORD-2026-0815-002', hub: 'Bandung', kurir: 'Sari', status: 'Dalam Perjalanan', date: '15 Agu 2026' },
      { deliveryCode: 'DLV-2026-0815-003', orderCode: 'ORD-2026-0815-003', hub: 'Surabaya', kurir: 'Tono', status: 'Dalam Perjalanan', date: '15 Agu 2026' },
      { deliveryCode: 'DLV-2026-0814-018', orderCode: 'ORD-2026-0814-018', hub: 'Jakarta Selatan', kurir: 'Rudi', status: 'Dikirim', date: '14 Agu 2026' },
      { deliveryCode: 'DLV-2026-0814-019', orderCode: 'ORD-2026-0814-019', hub: 'Medan', kurir: 'Umar', status: 'Gagal', date: '14 Agu 2026' },
      { deliveryCode: 'DLV-2026-0814-020', orderCode: 'ORD-2026-0814-020', hub: 'Makassar', kurir: 'Vina', status: 'Dikirim', date: '14 Agu 2026' }
    ],
    modalFields: [
      { key: 'deliveryCode', label: 'Kode Delivery', type: 'text' },
      { key: 'orderCode', label: 'Kode Order', type: 'text' },
      { key: 'hub', label: 'Hub', type: 'select', options: ['Jakarta Selatan','Bandung','Surabaya','Medan','Makassar'] },
      { key: 'kurir', label: 'Kurir', type: 'text' },
      { key: 'status', label: 'Status', type: 'select', options: ['Dikirim','Dalam Perjalanan','Gagal','Retur'] },
      { key: 'date', label: 'Tanggal', type: 'date' }
    ]
  };

  /* ================= KOMPLAIN / CS ================= */
  MODULES.complaints = {
    id: 'complaints', title: 'Komplain / CS', desc: 'Manajemen pengaduan customer', icon: 'fa-solid fa-headset', hasCrud: true,
    cards: [
      { label: 'Total Komplain', value: '23', sub: '5 urgent butuh tindakan', icon: 'fa-solid fa-headset', color: 'linear-gradient(135deg,#f59e0b,#fbbf24)' },
      { label: 'Open', value: '8', sub: '34,8% dari total', icon: 'fa-solid fa-circle-exclamation', color: 'linear-gradient(135deg,#ef4444,#f87171)' },
      { label: 'In Progress', value: '9', sub: '39,1% dari total', icon: 'fa-solid fa-gears', color: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
      { label: 'Resolved', value: '6', sub: '26,1% dari total', icon: 'fa-solid fa-circle-check', color: 'linear-gradient(135deg,#00AA5B,#34d399)' }
    ],
    filters: [
      { id: 'priorityFilter', label: 'Prioritas', options: ['Semua','Low','Medium','High','Urgent'] },
      { id: 'statusFilter', label: 'Status', options: ['Semua','Open','In Progress','Resolved','Closed'] }
    ],
    hasDateFilter: true,
    chips: ['Semua', 'Open', 'In Progress', 'Resolved', 'Closed'],
    columns: [
      { key: 'code', label: 'Kode' }, { key: 'customer', label: 'Customer' }, { key: 'category', label: 'Kategori' },
      { key: 'subject', label: 'Subjek' }, { key: 'priority', label: 'Prioritas', type: 'badge' }, { key: 'status', label: 'Status', type: 'badge' }
    ],
    rows: [
      { code: 'CMP-2026-0001', customer: 'Budi Santoso', category: 'Delivery', subject: 'Paket belum sampai 3 hari', priority: 'Urgent', status: 'In Progress' },
      { code: 'CMP-2026-0002', customer: 'Siti Rahayu', category: 'Product', subject: 'Barang rusak saat tiba', priority: 'High', status: 'Resolved' },
      { code: 'CMP-2026-0003', customer: 'Andi Wijaya', category: 'Payment', subject: 'Poin belum masuk', priority: 'Medium', status: 'Open' },
      { code: 'CMP-2026-0004', customer: 'Dewi Lestari', category: 'Points', subject: 'Poin expired tidak wajar', priority: 'Low', status: 'Closed' },
      { code: 'CMP-2026-0005', customer: 'Rudi Hartono', category: 'Service', subject: 'CS kurang responsif', priority: 'Medium', status: 'In Progress' }
    ],
    modalFields: [
      { key: 'code', label: 'Kode Komplain', type: 'text' },
      { key: 'customer', label: 'Customer', type: 'text' },
      { key: 'category', label: 'Kategori', type: 'select', options: ['Product','Delivery','Payment','Points','Service','Other'] },
      { key: 'subject', label: 'Subjek', type: 'text', full: true },
      { key: 'priority', label: 'Prioritas', type: 'select', options: ['Low','Medium','High','Urgent'] },
      { key: 'status', label: 'Status', type: 'select', options: ['Open','In Progress','Resolved','Closed'] }
    ]
  };

  /* ================= MANAJEMEN STOK ================= */
  MODULES.stock = {
    id: 'stock', title: 'Manajemen Stok', desc: 'Stok produk & alert menipis', icon: 'fa-solid fa-boxes-stacked', hasCrud: true,
    cards: [
      { label: 'Total SKU', value: '1.284', sub: 'Semua kategori', icon: 'fa-solid fa-boxes-stacked', color: 'linear-gradient(135deg,#0ea5e9,#38bdf8)' },
      { label: 'Stok Menipis', value: '42', sub: 'di bawah ROP', icon: 'fa-solid fa-triangle-exclamation', color: 'linear-gradient(135deg,#ef4444,#f87171)' },
      { label: 'Stok Habis', value: '17', sub: 'perlu order stok', icon: 'fa-solid fa-circle-xmark', color: 'linear-gradient(135deg,#f59e0b,#fbbf24)' },
      { label: 'Total Terjual', value: '24.560', sub: '30 hari', icon: 'fa-solid fa-cart-shopping', color: 'linear-gradient(135deg,#00AA5B,#34d399)' }
    ],
    filters: [
      { id: 'catFilter', label: 'Kategori', options: ['Semua Kategori','Sembako','Makanan','Elektronik','Fashion','Kesehatan'] },
      { id: 'statusFilter', label: 'Status', options: ['Semua Status','Aman','Menipis','Habis'] }
    ],
    hasDateFilter: false,
    chips: ['Semua', 'Aman', 'Menipis', 'Habis'],
    columns: [
      { key: 'sku', label: 'SKU' }, { key: 'product', label: 'Produk' }, { key: 'cat', label: 'Kategori' },
      { key: 'stock', label: 'Stok', type: 'number' }, { key: 'rop', label: 'ROP', type: 'number' }, { key: 'status', label: 'Status', type: 'badge' }
    ],
    rows: [
      { sku: 'BR-001', product: 'Beras Premium 5kg', cat: 'Sembako', stock: 850, rop: 100, status: 'Aman' },
      { sku: 'MN-002', product: 'Minyak Goreng 2L', cat: 'Sembako', stock: 45, rop: 80, status: 'Menipis' },
      { sku: 'GR-003', product: 'Gula Pasir 1kg', cat: 'Sembako', stock: 320, rop: 50, status: 'Aman' },
      { sku: 'EL-010', product: 'Rice Cooker 1.2L', cat: 'Elektronik', stock: 8, rop: 15, status: 'Habis' },
      { sku: 'FS-021', product: 'Kaos Polos Cotton', cat: 'Fashion', stock: 240, rop: 30, status: 'Aman' },
      { sku: 'KS-015', product: 'Vitamin C 500mg', cat: 'Kesehatan', stock: 0, rop: 20, status: 'Habis' }
    ],
    modalFields: [
      { key: 'sku', label: 'SKU', type: 'text' },
      { key: 'product', label: 'Produk', type: 'text' },
      { key: 'cat', label: 'Kategori', type: 'select', options: ['Sembako','Makanan','Elektronik','Fashion','Kesehatan'] },
      { key: 'stock', label: 'Stok', type: 'number' },
      { key: 'rop', label: 'ROP', type: 'number' },
      { key: 'status', label: 'Status', type: 'select', options: ['Aman','Menipis','Habis'] }
    ]
  };

  /* ================= WAREHOUSE ================= */
  MODULES.warehouse = {
    id: 'warehouse', title: 'Warehouse', desc: 'Gudang internal & eksternal — stok & mutasi', icon: 'fa-solid fa-warehouse', hasCrud: true,
    cards: [
      { label: 'Total SKU', value: '1.284', sub: 'Semua kategori', icon: 'fa-solid fa-boxes-stacked', color: 'linear-gradient(135deg,#0ea5e9,#38bdf8)' },
      { label: 'Stok Masuk (30 hari)', value: '24.560', sub: '+312 mutasi inbound', icon: 'fa-solid fa-arrow-down-to-line', color: 'linear-gradient(135deg,#00AA5B,#34d399)' },
      { label: 'Stok Keluar (30 hari)', value: '21.830', sub: '+298 mutasi outbound', icon: 'fa-solid fa-arrow-up-from-line', color: 'linear-gradient(135deg,#f59e0b,#fbbf24)' },
      { label: 'Stok Menipis', value: '42', sub: 'di bawah ROP', icon: 'fa-solid fa-triangle-exclamation', color: 'linear-gradient(135deg,#ef4444,#f87171)' }
    ],
    filters: [
      { id: 'whFilter', label: 'Warehouse', options: ['Semua','WH Pusat 1','WH Pusat 2','WH Mitra A','WH Mitra B'] },
      { id: 'catFilter', label: 'Kategori', options: ['Semua Kategori','Sembako','Makanan','Elektronik','Fashion','Kesehatan'] }
    ],
    hasDateFilter: true,
    chips: ['Semua', '7 Hari', '30 Hari', '90 Hari', '1 Tahun'],
    columns: [
      { key: 'sku', label: 'SKU' }, { key: 'product', label: 'Produk' }, { key: 'wh', label: 'Gudang' },
      { key: 'stock', label: 'Stok', type: 'number' }, { key: 'rop', label: 'ROP', type: 'number' }, { key: 'status', label: 'Status', type: 'badge' }
    ],
    rows: [
      { sku: 'BR-001', product: 'Beras Premium 5kg', wh: 'WH Pusat 1', stock: 850, rop: 100, status: 'Aman' },
      { sku: 'MN-002', product: 'Minyak Goreng 2L', wh: 'WH Pusat 1', stock: 45, rop: 80, status: 'Menipis' },
      { sku: 'GR-003', product: 'Gula Pasir 1kg', wh: 'WH Pusat 2', stock: 320, rop: 50, status: 'Aman' },
      { sku: 'EL-010', product: 'Rice Cooker 1.2L', wh: 'WH Mitra A', stock: 8, rop: 15, status: 'Habis' },
      { sku: 'FS-021', product: 'Kaos Polos Cotton', wh: 'WH Mitra A', stock: 240, rop: 30, status: 'Aman' },
      { sku: 'KS-015', product: 'Vitamin C 500mg', wh: 'WH Mitra B', stock: 0, rop: 20, status: 'Habis' }
    ],
    modalFields: [
      { key: 'sku', label: 'SKU', type: 'text' },
      { key: 'product', label: 'Produk', type: 'text' },
      { key: 'wh', label: 'Gudang', type: 'select', options: ['WH Pusat 1','WH Pusat 2','WH Mitra A','WH Mitra B'] },
      { key: 'stock', label: 'Stok', type: 'number' },
      { key: 'rop', label: 'ROP', type: 'number' },
      { key: 'status', label: 'Status', type: 'select', options: ['Aman','Menipis','Habis'] }
    ]
  };

  /* ================= TRANSAKSI POIN ================= */
  MODULES.points = {
    id: 'points', title: 'Transaksi Poin', desc: 'Riwayat transaksi poin customer', icon: 'fa-solid fa-coins', hasCrud: true,
    cards: [
      { label: 'Poin Beredar', value: 'Rp 1,2 M', sub: 'total liability', icon: 'fa-solid fa-coins', color: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
      { label: 'Top-up (30 hari)', value: 'Rp 240 jt', sub: '+12,4% vs bulan lalu', icon: 'fa-solid fa-arrow-down-to-line', color: 'linear-gradient(135deg,#00AA5B,#34d399)' },
      { label: 'Poin Dipakai', value: 'Rp 185 jt', sub: 'belanja & redeem', icon: 'fa-solid fa-cart-shopping', color: 'linear-gradient(135deg,#f59e0b,#fbbf24)' },
      { label: 'Poin Expired', value: 'Rp 8,2 jt', sub: 'kadaluarsa 30 hari', icon: 'fa-solid fa-clock', color: 'linear-gradient(135deg,#ef4444,#f87171)' }
    ],
    filters: [
      { id: 'typeFilter', label: 'Type', options: ['Semua','Topup','Purchase','Redeem','Cashback','Bonus','Expired','Refund'] },
      { id: 'statusFilter', label: 'Status', options: ['Semua','Success','Pending','Failed','Expired'] }
    ],
    hasDateFilter: true,
    chips: ['Semua', 'Topup', 'Purchase', 'Redeem', 'Cashback', 'Expired'],
    columns: [
      { key: 'trxCode', label: 'Kode Trx' }, { key: 'customer', label: 'Customer' }, { key: 'type', label: 'Type', type: 'badge' },
      { key: 'amount', label: 'Amount', type: 'points' }, { key: 'status', label: 'Status', type: 'badge' }, { key: 'date', label: 'Tanggal' }
    ],
    rows: [
      { trxCode: 'TRX-2026-0815-001', customer: 'Budi Santoso', type: 'Topup', amount: 100000, status: 'Success', date: '15 Agu 2026' },
      { trxCode: 'TRX-2026-0815-002', customer: 'Siti Rahayu', type: 'Purchase', amount: -245000, status: 'Success', date: '15 Agu 2026' },
      { trxCode: 'TRX-2026-0815-003', customer: 'Andi Wijaya', type: 'Cashback', amount: 5000, status: 'Success', date: '15 Agu 2026' },
      { trxCode: 'TRX-2026-0814-018', customer: 'Dewi Lestari', type: 'Redeem', amount: -15000, status: 'Success', date: '14 Agu 2026' },
      { trxCode: 'TRX-2026-0814-019', customer: 'Rudi Hartono', type: 'Expired', amount: -20000, status: 'Expired', date: '14 Agu 2026' },
      { trxCode: 'TRX-2026-0814-020', customer: 'Maya Anggraini', type: 'Topup', amount: 50000, status: 'Failed', date: '14 Agu 2026' }
    ],
    modalFields: [
      { key: 'trxCode', label: 'Kode Trx', type: 'text' },
      { key: 'customer', label: 'Customer', type: 'text' },
      { key: 'type', label: 'Type', type: 'select', options: ['Topup','Purchase','Redeem','Cashback','Bonus','Expired','Refund'] },
      { key: 'amount', label: 'Amount (pts)', type: 'number' },
      { key: 'status', label: 'Status', type: 'select', options: ['Success','Failed','Expired'] },
      { key: 'date', label: 'Tanggal', type: 'date' }
    ]
  };

  /* ================= PAYMENT ================= */
  MODULES.payments = {
    id: 'payments', title: 'Payment', desc: 'Transaksi pembayaran semua metode', icon: 'fa-solid fa-credit-card', hasCrud: true,
    cards: [
      { label: 'Total Payment', value: 'Rp 685 jt', sub: 'bulan Agustus', icon: 'fa-solid fa-sack-dollar', color: 'linear-gradient(135deg,#00AA5B,#34d399)' },
      { label: 'Poin', value: 'Rp 320 jt', sub: '46,7% dari total', icon: 'fa-solid fa-coins', color: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
      { label: 'Tunai', value: 'Rp 180 jt', sub: '26,3% dari total', icon: 'fa-solid fa-money-bill', color: 'linear-gradient(135deg,#f59e0b,#fbbf24)' },
      { label: 'QRIS / E-Wallet', value: 'Rp 185 jt', sub: '27% dari total', icon: 'fa-solid fa-qrcode', color: 'linear-gradient(135deg,#8b5cf6,#a78bfa)' }
    ],
    filters: [
      { id: 'methodFilter', label: 'Metode', options: ['Semua','Poin','Tunai','QRIS','E-Wallet','VA','Transfer'] },
      { id: 'statusFilter', label: 'Status', options: ['Semua','Success','Pending','Failed','Cancelled'] }
    ],
    hasDateFilter: true,
    chips: ['Semua', 'Success', 'Pending', 'Failed', 'Cancelled'],
    columns: [
      { key: 'paymentCode', label: 'Kode Payment' }, { key: 'customer', label: 'Customer' }, { key: 'method', label: 'Metode', type: 'badge' },
      { key: 'amount', label: 'Amount', type: 'currency' }, { key: 'status', label: 'Status', type: 'badge' }, { key: 'date', label: 'Tanggal' }
    ],
    rows: [
      { paymentCode: 'PAY-2026-0815-001', customer: 'Budi Santoso', method: 'Poin', amount: 245000, status: 'Success', date: '15 Agu 2026' },
      { paymentCode: 'PAY-2026-0815-002', customer: 'Siti Rahayu', method: 'Tunai', amount: 118500, status: 'Success', date: '15 Agu 2026' },
      { paymentCode: 'PAY-2026-0815-003', customer: 'Andi Wijaya', method: 'QRIS', amount: 467000, status: 'Pending', date: '15 Agu 2026' },
      { paymentCode: 'PAY-2026-0814-018', customer: 'Dewi Lestari', method: 'E-Wallet', amount: 89000, status: 'Success', date: '14 Agu 2026' },
      { paymentCode: 'PAY-2026-0814-019', customer: 'Rudi Hartono', method: 'Transfer', amount: 324000, status: 'Failed', date: '14 Agu 2026' },
      { paymentCode: 'PAY-2026-0814-020', customer: 'Maya Anggraini', method: 'Poin', amount: 156000, status: 'Success', date: '14 Agu 2026' }
    ],
    modalFields: [
      { key: 'paymentCode', label: 'Kode Payment', type: 'text' },
      { key: 'customer', label: 'Customer', type: 'text' },
      { key: 'method', label: 'Metode', type: 'select', options: ['Poin','Tunai','QRIS','E-Wallet','VA','Transfer'] },
      { key: 'amount', label: 'Amount (Rp)', type: 'number' },
      { key: 'status', label: 'Status', type: 'select', options: ['Success','Failed','Pending','Cancelled'] },
      { key: 'date', label: 'Tanggal', type: 'date' }
    ]
  };

  /* ================= CUSTOMER ================= */
  MODULES.customers = {
    id: 'customers', title: 'Customer', desc: 'Manajemen customer & alamat', icon: 'fa-solid fa-user-group', hasCrud: true,
    cards: [
      { label: 'Total Customer', value: '12.486', sub: '348 baru minggu ini', icon: 'fa-solid fa-user-group', color: 'linear-gradient(135deg,#8b5cf6,#a78bfa)' },
      { label: 'Customer Aktif', value: '9.240', sub: '74% dari total', icon: 'fa-solid fa-circle-check', color: 'linear-gradient(135deg,#00AA5B,#34d399)' },
      { label: 'Customer Baru', value: '348', sub: 'minggu ini', icon: 'fa-solid fa-user-plus', color: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
      { label: 'Total Belanja', value: 'Rp 685 jt', sub: '30 hari', icon: 'fa-solid fa-sack-dollar', color: 'linear-gradient(135deg,#f59e0b,#fbbf24)' }
    ],
    filters: [
      { id: 'tierFilter', label: 'Tier', options: ['Semua','Bronze','Silver','Gold','Platinum','Diamond'] },
      { id: 'statusFilter', label: 'Status', options: ['Semua','Aktif','Nonaktif'] }
    ],
    hasDateFilter: true,
    chips: ['Semua', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'],
    columns: [
      { key: 'code', label: 'Kode' }, { key: 'name', label: 'Nama' }, { key: 'email', label: 'Email' },
      { key: 'tier', label: 'Tier', type: 'badge' }, { key: 'totalSpend', label: 'Total Belanja', type: 'currency' }, { key: 'status', label: 'Status', type: 'badge' }
    ],
    rows: [
      { code: 'CUS-001', name: 'Budi Santoso', email: 'budi@gmail.com', tier: 'Gold', totalSpend: 5200000, status: 'Aktif' },
      { code: 'CUS-002', name: 'Siti Rahayu', email: 'siti@gmail.com', tier: 'Silver', totalSpend: 1800000, status: 'Aktif' },
      { code: 'CUS-003', name: 'Andi Wijaya', email: 'andi@gmail.com', tier: 'Platinum', totalSpend: 12500000, status: 'Aktif' },
      { code: 'CUS-004', name: 'Dewi Lestari', email: 'dewi@gmail.com', tier: 'Bronze', totalSpend: 450000, status: 'Aktif' },
      { code: 'CUS-005', name: 'Rudi Hartono', email: 'rudi@gmail.com', tier: 'Gold', totalSpend: 6800000, status: 'Nonaktif' },
      { code: 'CUS-006', name: 'Maya Anggraini', email: 'maya@gmail.com', tier: 'Silver', totalSpend: 2100000, status: 'Aktif' }
    ],
    modalFields: [
      { key: 'code', label: 'Kode Customer', type: 'text' },
      { key: 'name', label: 'Nama', type: 'text' },
      { key: 'email', label: 'Email', type: 'text' },
      { key: 'tier', label: 'Tier', type: 'select', options: ['Bronze','Silver','Gold','Platinum','Diamond'] },
      { key: 'totalSpend', label: 'Total Belanja (Rp)', type: 'number' },
      { key: 'status', label: 'Status', type: 'select', options: ['Aktif','Nonaktif'] }
    ]
  };

  /* ================= MEMBERSHIP & TIER ================= */
  MODULES.membership = {
    id: 'membership', title: 'Membership & Tier', desc: 'Kelola tier membership & benefit', icon: 'fa-solid fa-ranking-star', hasCrud: true,
    cards: [
      { label: 'Total Tier', value: '5', sub: 'Bronze–Diamond', icon: 'fa-solid fa-ranking-star', color: 'linear-gradient(135deg,#8b5cf6,#a78bfa)' },
      { label: 'Customer Gold+', value: '3.240', sub: '26% dari total', icon: 'fa-solid fa-crown', color: 'linear-gradient(135deg,#f59e0b,#fbbf24)' },
      { label: 'Cashback Paid', value: 'Rp 24 jt', sub: 'bulan Agustus', icon: 'fa-solid fa-hand-holding-dollar', color: 'linear-gradient(135deg,#00AA5B,#34d399)' },
      { label: 'Upgrade (30 hari)', value: '486', sub: 'auto-upgrade', icon: 'fa-solid fa-arrow-trend-up', color: 'linear-gradient(135deg,#3b82f6,#60a5fa)' }
    ],
    filters: [
      { id: 'statusFilter', label: 'Status', options: ['Semua','Aktif','Nonaktif'] }
    ],
    hasDateFilter: false,
    chips: ['Semua', 'Aktif', 'Nonaktif'],
    columns: [
      { key: 'tier', label: 'Tier', type: 'badge' }, { key: 'minSpend', label: 'Min Belanja', type: 'currency' },
      { key: 'discount', label: 'Diskon', type: 'percent' }, { key: 'cashback', label: 'Cashback', type: 'percent' },
      { key: 'freeShipping', label: 'Free Shipping' }, { key: 'status', label: 'Status', type: 'badge' }
    ],
    rows: [
      { tier: 'Bronze', minSpend: 0, discount: 0, cashback: 0, freeShipping: 0, status: 'Aktif' },
      { tier: 'Silver', minSpend: 1000000, discount: 3, cashback: 2, freeShipping: 1, status: 'Aktif' },
      { tier: 'Gold', minSpend: 5000000, discount: 5, cashback: 3, freeShipping: 2, status: 'Aktif' },
      { tier: 'Platinum', minSpend: 10000000, discount: 8, cashback: 5, freeShipping: 3, status: 'Aktif' },
      { tier: 'Diamond', minSpend: 25000000, discount: 12, cashback: 8, freeShipping: 5, status: 'Aktif' }
    ],
    modalFields: [
      { key: 'tier', label: 'Tier', type: 'select', options: ['Bronze','Silver','Gold','Platinum','Diamond'] },
      { key: 'minSpend', label: 'Min Belanja (Rp)', type: 'number' },
      { key: 'discount', label: 'Diskon (%)', type: 'number' },
      { key: 'cashback', label: 'Cashback (%)', type: 'number' },
      { key: 'freeShipping', label: 'Free Shipping (per bulan)', type: 'number' },
      { key: 'status', label: 'Status', type: 'select', options: ['Aktif','Nonaktif'] }
    ]
  };

  /* ============================================================
     HELPER API — localStorage CRUD
     ============================================================ */
  var STORE_PREFIX = 'jastip_op_';

  function getModule(id) {
    if (!MODULES[id]) {
      MODULES[id] = {
        id: id, title: id, desc: '', icon: 'fa-solid fa-circle', hasCrud: false,
        cards: [{ label: 'Total', value: '0', sub: '', icon: 'fa-solid fa-circle', color: 'linear-gradient(135deg,#3b82f6,#60a5fa)' }],
        filters: [], hasDateFilter: false, chips: [],
        columns: [{ key: 'name', label: 'Nama' }],
        rows: [{ name: 'Belum ada data' }]
      };
    }
    return MODULES[id];
  }

  function getRows(id) {
    var module = getModule(id);
    try {
      var saved = localStorage.getItem(STORE_PREFIX + id);
      if (saved) {
        var parsed = JSON.parse(saved);
        if (parsed && parsed.rows) return parsed.rows;
      }
    } catch (e) {}
    return module.rows || [];
  }

  function saveRows(id, rows) {
    try {
      localStorage.setItem(STORE_PREFIX + id, JSON.stringify({ rows: rows, updatedAt: new Date().toISOString() }));
    } catch (e) {}
  }

  function addRow(id, row) {
    var rows = getRows(id).slice();
    rows.unshift(row);
    saveRows(id, rows);
    return rows;
  }

  function updateRow(id, index, row) {
    var rows = getRows(id).slice();
    if (rows[index]) rows[index] = row;
    saveRows(id, rows);
    return rows;
  }

  function deleteRow(id, index) {
    var rows = getRows(id).slice();
    rows.splice(index, 1);
    saveRows(id, rows);
    return rows;
  }

  /* ============================================================
     EXPOSE GLOBAL
     ============================================================ */
  window.JastipOperatorData = {
    modules: MODULES,
    getModule: getModule,
    getRows: getRows,
    saveRows: saveRows,
    addRow: addRow,
    updateRow: updateRow,
    deleteRow: deleteRow,
    STORE_PREFIX: STORE_PREFIX
  };
})();