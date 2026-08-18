/* ============================================================
   JASTIP — SUPERADMIN DATA JS
   Satu sumber data untuk SEMUA halaman superadmin:
   cards, charts, tabel CRUD, dropdown filter.
   Data disimpan di localStorage agar CRUD (tambah/edit/hapus)
   tetap berfungsi + fallback data default inline.
   ============================================================ */

(function () {
  'use strict';

  /* ============================================================
     DATA MODUL — Setiap modul punya:
     {
       id, title, desc, icon,
       cards: [{label, value, sub, icon, color}],
       filters: [{id, label, options:['Semua',...]}],
       hasDateFilter: bool,
       chips: [{label, value:fn|'all'}],
       columns: [{key, label, type:'text'|'badge'|'progress'|'currency'|'number'|'points'}],
       rows: [ {...}, ... ],
       modalFields: [{key, label, type:'text'|'select'|'number'|'textarea'|'date', options?, full?}],
       hasCrud: bool,
       charts: [{title, type:'line'|'doughnut'|'bar'|'area', labels:[], data:[], options?}]
     }
     ============================================================ */

  var MODULES = {};

  /* ================= DASHBOARD UTAMA ================= */
  MODULES.dashboard = {
    id: 'dashboard', title: 'Dashboard Utama', desc: 'Ringkasan kinerja keseluruhan Jastip',
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

  /* ================= DASHBOARD SALES ================= */
  MODULES['dashboard-sales'] = {
    id: 'dashboard-sales', title: 'Dashboard Sales', desc: 'Analisis penjualan & performa toko',
    cards: [
      { label: 'Total Penjualan', value: 'Rp 685.420.000', sub: 'Bulan Agustus', icon: 'fa-solid fa-sack-dollar', color: 'linear-gradient(135deg,#00AA5B,#34d399)' },
      { label: 'Order Hari Ini', value: '1.240', sub: '8.942 total bulan ini', icon: 'fa-solid fa-receipt', color: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
      { label: 'Avg Transaksi', value: 'Rp 76.640', sub: 'per transaksi', icon: 'fa-solid fa-calculator', color: 'linear-gradient(135deg,#8b5cf6,#a78bfa)' },
      { label: 'Top Hub', value: 'Jakarta Selatan', sub: 'Rp 182 jt bulan ini', icon: 'fa-solid fa-trophy', color: 'linear-gradient(135deg,#f59e0b,#fbbf24)' }
    ],
    charts: [
      { title: 'Penjualan per Bulan', type: 'line', labels: ['Mar','Apr','Mei','Jun','Jul','Agu'], data: [420, 480, 510, 565, 610, 685], color: '#00AA5B' },
      { title: 'Status Order', type: 'doughnut', labels: ['Selesai','Diproses','Dikirim','Batal'], data: [64, 18, 12, 6] },
      { title: 'Top 5 Produk (Revenue)', type: 'bar', labels: ['Beras 5kg','Minyak 2L','Gula 1kg','Telur 1kg','Kopi Sachet'], data: [1820, 1540, 1380, 1210, 980], color: '#0ea5e9' }
    ],
    filters: [
      { id: 'hubFilter', label: 'Hub', options: ['Semua Hub','Jakarta Selatan','Bandung','Surabaya','Medan','Makassar'] },
      { id: 'catFilter', label: 'Kategori', options: ['Semua Kategori','Sembako','Makanan','Elektronik','Fashion'] },
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

  /* ================= DASHBOARD WAREHOUSE (INTERNAL & EXTERNAL) ================= */
  MODULES['dashboard-warehouse-internal'] = {
    id: 'dashboard-warehouse-internal', title: 'Dashboard Warehouse Internal', desc: 'Gudang internal pusat — stok & mutasi',
    cards: [
      { label: 'Total SKU', value: '1.284', sub: 'Semua kategori', icon: 'fa-solid fa-boxes-stacked', color: 'linear-gradient(135deg,#0ea5e9,#38bdf8)' },
      { label: 'Stok Masuk (30 hari)', value: '24.560', sub: '+312 mutasi inbound', icon: 'fa-solid fa-arrow-down-to-line', color: 'linear-gradient(135deg,#00AA5B,#34d399)' },
      { label: 'Stok Keluar (30 hari)', value: '21.830', sub: '+298 mutasi outbound', icon: 'fa-solid fa-arrow-up-from-line', color: 'linear-gradient(135deg,#f59e0b,#fbbf24)' },
      { label: 'Stok Menipis', value: '42', sub: 'di bawah ROP', icon: 'fa-solid fa-triangle-exclamation', color: 'linear-gradient(135deg,#ef4444,#f87171)' }
    ],
    charts: [
      { title: 'Stok per Kategori', type: 'bar', labels: ['Sembako','Makanan','Elektronik','Fashion','Kesehatan'], data: [8400, 5200, 3100, 2600, 1900], color: '#0ea5e9' },
      { title: 'Mutasi Stok per Bulan', type: 'line', labels: ['Mar','Apr','Mei','Jun','Jul','Agu'], data: [1240, 1320, 1410, 1580, 1720, 1840], color: '#00AA5B' }
    ],
    filters: [
      { id: 'whFilter', label: 'Warehouse', options: ['Semua','WH Pusat 1','WH Pusat 2'] },
      { id: 'catFilter', label: 'Kategori', options: ['Semua Kategori','Sembako','Makanan','Elektronik','Fashion'] },
      { id: 'statusFilter', label: 'Status', options: ['Semua Status','Aman','Menipis','Habis'] }
    ],
    hasDateFilter: true,
    chips: ['Semua', '7 Hari', '30 Hari', '90 Hari', '1 Tahun'],
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
    hasCrud: false
  };

  MODULES['dashboard-warehouse-external'] = {
    id: 'dashboard-warehouse-external', title: 'Dashboard Warehouse External', desc: 'Gudang eksternal mitra — stok & mutasi',
    cards: [
      { label: 'Total SKU', value: '486', sub: '2 gudang mitra', icon: 'fa-solid fa-boxes-stacked', color: 'linear-gradient(135deg,#8b5cf6,#a78bfa)' },
      { label: 'Stok Masuk (30 hari)', value: '9.120', sub: '+118 mutasi inbound', icon: 'fa-solid fa-arrow-down-to-line', color: 'linear-gradient(135deg,#00AA5B,#34d399)' },
      { label: 'Stok Keluar (30 hari)', value: '8.450', sub: '+104 mutasi outbound', icon: 'fa-solid fa-arrow-up-from-line', color: 'linear-gradient(135deg,#f59e0b,#fbbf24)' },
      { label: 'Stok Menipis', value: '17', sub: 'di bawah ROP', icon: 'fa-solid fa-triangle-exclamation', color: 'linear-gradient(135deg,#ef4444,#f87171)' }
    ],
    charts: [
      { title: 'Stok per Kategori', type: 'bar', labels: ['Sembako','Makanan','Elektronik','Fashion','Kesehatan'], data: [3200, 2100, 950, 1400, 780], color: '#8b5cf6' },
      { title: 'Mutasi Stok per Bulan', type: 'line', labels: ['Mar','Apr','Mei','Jun','Jul','Agu'], data: [540, 610, 680, 720, 790, 850], color: '#00AA5B' }
    ],
    filters: [
      { id: 'whFilter', label: 'Warehouse', options: ['Semua','WH Mitra A','WH Mitra B'] },
      { id: 'catFilter', label: 'Kategori', options: ['Semua Kategori','Sembako','Makanan','Elektronik','Fashion'] },
      { id: 'statusFilter', label: 'Status', options: ['Semua Status','Aman','Menipis','Habis'] }
    ],
    hasDateFilter: true,
    chips: ['Semua', '7 Hari', '30 Hari', '90 Hari', '1 Tahun'],
    columns: [
      { key: 'sku', label: 'SKU' }, { key: 'product', label: 'Produk' }, { key: 'wh', label: 'Gudang' },
      { key: 'stock', label: 'Stok', type: 'number' }, { key: 'rop', label: 'ROP', type: 'number' }, { key: 'status', label: 'Status', type: 'badge' }
    ],
    rows: [
      { sku: 'BR-001', product: 'Beras Premium 5kg', wh: 'WH Mitra A', stock: 420, rop: 60, status: 'Aman' },
      { sku: 'MN-002', product: 'Minyak Goreng 2L', wh: 'WH Mitra A', stock: 22, rop: 40, status: 'Menipis' },
      { sku: 'GR-003', product: 'Gula Pasir 1kg', wh: 'WH Mitra B', stock: 180, rop: 30, status: 'Aman' },
      { sku: 'EL-010', product: 'Rice Cooker 1.2L', wh: 'WH Mitra B', stock: 0, rop: 10, status: 'Habis' },
      { sku: 'FS-021', product: 'Kaos Polos Cotton', wh: 'WH Mitra A', stock: 110, rop: 15, status: 'Aman' },
      { sku: 'KS-015', product: 'Vitamin C 500mg', wh: 'WH Mitra B', stock: 5, rop: 12, status: 'Menipis' }
    ],
    hasCrud: false
  };

  /* ================= DASHBOARD RAB ================= */
  MODULES['dashboard-rabs'] = {
    id: 'dashboard-rabs', title: 'Dashboard RAB', desc: 'Realisasi anggaran vs budget (Rencana Anggaran Biaya)',
    cards: [
      { label: 'Total Budget 2026', value: 'Rp 2,4 M', sub: '12 bulan', icon: 'fa-solid fa-file-invoice-dollar', color: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
      { label: 'Total Actual', value: 'Rp 1,68 M', sub: '70% dari budget', icon: 'fa-solid fa-circle-check', color: 'linear-gradient(135deg,#00AA5B,#34d399)' },
      { label: 'Deviasi', value: 'Rp 720 jt', sub: 'sisa anggaran', icon: 'fa-solid fa-scale-balanced', color: 'linear-gradient(135deg,#f59e0b,#fbbf24)' },
      { label: '% Realisasi', value: '70,2%', sub: 'target 75% untuk bulan ini', icon: 'fa-solid fa-percent', color: 'linear-gradient(135deg,#8b5cf6,#a78bfa)' }
    ],
    charts: [
      { title: 'Budget vs Actual', type: 'doughnut', labels: ['Terealisasi','Sisa Budget'], data: [70, 30] },
      { title: 'Realisasi per Akun', type: 'bar', labels: ['HPP','Kurir','Operasional','Gaji','Marketing'], data: [820, 260, 180, 340, 80], color: '#f59e0b' }
    ],
    filters: [
      { id: 'yearFilter', label: 'Tahun', options: ['2026','2025','2024'] },
      { id: 'statusFilter', label: 'Status', options: ['Semua','Draft','Approved','Rejected'] },
      { id: 'acctFilter', label: 'Akun', options: ['Semua Akun','HPP','Kurir','Operasional','Gaji','Marketing'] }
    ],
    hasDateFilter: false,
    chips: ['Semua', 'Draft', 'Approved', 'Rejected'],
    columns: [
      { key: 'rabCode', label: 'Kode RAB' }, { key: 'title', label: 'Judul' }, { key: 'year', label: 'Tahun' },
      { key: 'budget', label: 'Budget', type: 'currency' }, { key: 'actual', label: 'Actual', type: 'currency' },
      { key: 'progress', label: 'Realisasi', type: 'progress' }, { key: 'status', label: 'Status', type: 'badge' }
    ],
    rows: [
      { rabCode: 'RAB-2026-001', title: 'RAB Operasional Tahunan', year: '2026', budget: 840000000, actual: 612000000, progress: 73, status: 'Approved' },
      { rabCode: 'RAB-2026-002', title: 'RAB Pengadaan Kendaraan', year: '2026', budget: 480000000, actual: 0, progress: 0, status: 'Draft' },
      { rabCode: 'RAB-2026-003', title: 'RAB Marketing Q3', year: '2026', budget: 320000000, actual: 210000000, progress: 66, status: 'Approved' },
      { rabCode: 'RAB-2025-001', title: 'RAB Operasional 2025', year: '2025', budget: 760000000, actual: 748000000, progress: 98, status: 'Approved' },
      { rabCode: 'RAB-2024-002', title: 'RAB IT Infrastruktur', year: '2024', budget: 250000000, actual: 240000000, progress: 96, status: 'Approved' }
    ],
    hasCrud: false
  };

  /* ================= DASHBOARD POINTS BALANCE ================= */
  MODULES['dashboard-points-balance'] = {
    id: 'dashboard-points-balance', title: 'Dashboard Points Balance', desc: 'Poin beredar, top-up & kadaluarsa',
    cards: [
      { label: 'Poin Beredar', value: 'Rp 1,89 M', sub: 'liabilitas poin aktif', icon: 'fa-solid fa-coins', color: 'linear-gradient(135deg,#f59e0b,#fbbf24)' },
      { label: 'Poin Aktif', value: 'Rp 1,72 M', sub: '91% dari total', icon: 'fa-solid fa-circle-check', color: 'linear-gradient(135deg,#00AA5B,#34d399)' },
      { label: 'Poin Expired (30 hari)', value: 'Rp 42 jt', sub: '12.480 transaksi', icon: 'fa-solid fa-clock', color: 'linear-gradient(135deg,#ef4444,#f87171)' },
      { label: 'Top-up Bulan Ini', value: 'Rp 384 jt', sub: '+12,4% vs bulan lalu', icon: 'fa-solid fa-arrow-trend-up', color: 'linear-gradient(135deg,#3b82f6,#60a5fa)' }
    ],
    charts: [
      { title: 'Top-up per Bulan', type: 'line', labels: ['Mar','Apr','Mei','Jun','Jul','Agu'], data: [240, 268, 290, 315, 342, 384], color: '#3b82f6' },
      { title: 'Saldo Berjalan', type: 'area', labels: ['Minggu 1','Minggu 2','Minggu 3','Minggu 4'], data: [1680, 1740, 1810, 1890], color: '#00AA5B' }
    ],
    filters: [
      { id: 'hubFilter', label: 'Hub', options: ['Semua Hub','Jakarta Selatan','Bandung','Surabaya','Medan','Makassar'] },
      { id: 'typeFilter', label: 'Tipe', options: ['Semua Tipe','Topup','Purchase','Redeem','Cashback','Bonus','Expired'] }
    ],
    hasDateFilter: true,
    chips: ['Semua', '7 Hari', '30 Hari', '90 Hari', '1 Tahun'],
    columns: [
      { key: 'trxCode', label: 'Kode Trx' }, { key: 'customer', label: 'Customer' }, { key: 'type', label: 'Tipe', type: 'badge' },
      { key: 'amount', label: 'Jumlah', type: 'points' }, { key: 'status', label: 'Status', type: 'badge' }, { key: 'date', label: 'Tanggal' }
    ],
    rows: [
      { trxCode: 'PT-2026-0815-001', customer: 'Budi Santoso', type: 'Topup', amount: 250000, status: 'Success', date: '15 Agu 2026' },
      { trxCode: 'PT-2026-0815-002', customer: 'Siti Rahayu', type: 'Purchase', amount: -118500, status: 'Success', date: '15 Agu 2026' },
      { trxCode: 'PT-2026-0815-003', customer: 'Andi Wijaya', type: 'Cashback', amount: 12500, status: 'Success', date: '15 Agu 2026' },
      { trxCode: 'PT-2026-0814-018', customer: 'Dewi Lestari', type: 'Expired', amount: -45000, status: 'Success', date: '14 Agu 2026' },
      { trxCode: 'PT-2026-0814-019', customer: 'Rudi Hartono', type: 'Redeem', amount: -50000, status: 'Success', date: '14 Agu 2026' },
      { trxCode: 'PT-2026-0814-020', customer: 'Maya Anggraini', type: 'Bonus', amount: 10000, status: 'Success', date: '14 Agu 2026' }
    ],
    hasCrud: false
  };

  /* ================= DASHBOARD FEE ================= */
  MODULES['dashboard-fee'] = {
    id: 'dashboard-fee', title: 'Dashboard Fee', desc: 'Fee split 67/33 antara hub & pusat',
    cards: [
      { label: 'Fee Hub (67%)', value: 'Rp 412 jt', sub: 'bulan ini', icon: 'fa-solid fa-store', color: 'linear-gradient(135deg,#00AA5B,#34d399)' },
      { label: 'Fee Pusat (33%)', value: 'Rp 203 jt', sub: 'bulan ini', icon: 'fa-solid fa-building', color: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
      { label: 'Total Hutang ke Hub', value: 'Rp 96 jt', sub: 'belum dibayar', icon: 'fa-solid fa-clock', color: 'linear-gradient(135deg,#f59e0b,#fbbf24)' },
      { label: 'Split Ratio', value: '67 / 33', sub: 'sesuai fee_configs', icon: 'fa-solid fa-scale-balanced', color: 'linear-gradient(135deg,#8b5cf6,#a78bfa)' }
    ],
    charts: [
      { title: 'Fee per Hub', type: 'bar', labels: ['Jakarta Selatan','Bandung','Surabaya','Medan','Makassar'], data: [142, 98, 76, 54, 42], color: '#00AA5B' },
      { title: 'Fee per Bulan', type: 'line', labels: ['Mar','Apr','Mei','Jun','Jul','Agu'], data: [380, 402, 425, 455, 490, 512], color: '#3b82f6' }
    ],
    filters: [
      { id: 'hubFilter', label: 'Hub', options: ['Semua Hub','Jakarta Selatan','Bandung','Surabaya','Medan','Makassar'] },
      { id: 'statusFilter', label: 'Status', options: ['Semua','Calculated','Approved','Paid','Pending'] }
    ],
    hasDateFilter: true,
    chips: ['Semua', '7 Hari', '30 Hari', '90 Hari', '1 Tahun'],
    columns: [
      { key: 'code', label: 'Kode' }, { key: 'hub', label: 'Hub' }, { key: 'orderAmount', label: 'Order', type: 'currency' },
      { key: 'hubFee', label: 'Fee Hub 67%', type: 'currency' }, { key: 'centralFee', label: 'Fee Pusat 33%', type: 'currency' },
      { key: 'status', label: 'Status', type: 'badge' }, { key: 'date', label: 'Tanggal' }
    ],
    rows: [
      { code: 'FC-2026-0815-01', hub: 'Jakarta Selatan', orderAmount: 245000000, hubFee: 164150000, centralFee: 80850000, status: 'Approved', date: '15 Agu 2026' },
      { code: 'FC-2026-0815-02', hub: 'Bandung', orderAmount: 182000000, hubFee: 121940000, centralFee: 60060000, status: 'Pending', date: '15 Agu 2026' },
      { code: 'FC-2026-0814-01', hub: 'Surabaya', orderAmount: 156000000, hubFee: 104520000, centralFee: 51480000, status: 'Paid', date: '14 Agu 2026' },
      { code: 'FC-2026-0814-02', hub: 'Medan', orderAmount: 98000000, hubFee: 65660000, centralFee: 32340000, status: 'Calculated', date: '14 Agu 2026' },
      { code: 'FC-2026-0813-01', hub: 'Makassar', orderAmount: 72000000, hubFee: 48240000, centralFee: 23760000, status: 'Paid', date: '13 Agu 2026' }
    ],
    hasCrud: false
  };

  /* ================= DASHBOARD ACCOUNTING ================= */
  MODULES['dashboard-accounting'] = {
    id: 'dashboard-accounting', title: 'Dashboard Accounting', desc: 'Neraca, laba rugi & arus kas',
    cards: [
      { label: 'Total Aset', value: 'Rp 5,2 M', sub: 'aset lancar + tetap', icon: 'fa-solid fa-building-columns', color: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
      { label: 'Total Liabilitas', value: 'Rp 1,9 M', sub: 'termasuk liabilitas poin', icon: 'fa-solid fa-landmark', color: 'linear-gradient(135deg,#f59e0b,#fbbf24)' },
      { label: 'Laba Bersih (YTD)', value: 'Rp 680 jt', sub: '+8,2% vs tahun lalu', icon: 'fa-solid fa-chart-line', color: 'linear-gradient(135deg,#00AA5B,#34d399)' },
      { label: 'Arus Kas Operasional', value: 'Rp 412 jt', sub: 'bulan ini', icon: 'fa-solid fa-money-bill-trend-up', color: 'linear-gradient(135deg,#8b5cf6,#a78bfa)' }
    ],
    charts: [
      { title: 'Laba per Bulan', type: 'line', labels: ['Mar','Apr','Mei','Jun','Jul','Agu'], data: [72, 78, 84, 91, 96, 105], color: '#00AA5B' },
      { title: 'Pendapatan', type: 'doughnut', labels: ['Penjualan','Fee Pusat','Top-up','Subscription','Lainnya'], data: [58, 12, 18, 8, 4] },
      { title: 'Beban per Kategori', type: 'bar', labels: ['HPP','Kurir','Operasional','Gaji','Marketing'], data: [820, 260, 180, 340, 80], color: '#ef4444' }
    ],
    filters: [
      { id: 'periodFilter', label: 'Periode', options: ['Bulan Ini','Kuartal Ini','Tahun Ini'] },
      { id: 'acctFilter', label: 'Akun', options: ['Semua Akun','Kas','Bank','Piutang','Persediaan','Liabilitas Poin'] }
    ],
    hasDateFilter: true,
    chips: ['Semua', '7 Hari', '30 Hari', '90 Hari', '1 Tahun'],
    columns: [
      { key: 'journalNo', label: 'No Jurnal' }, { key: 'desc', label: 'Deskripsi' }, { key: 'type', label: 'Tipe', type: 'badge' },
      { key: 'debit', label: 'Debit', type: 'currency' }, { key: 'credit', label: 'Kredit', type: 'currency' }, { key: 'date', label: 'Tanggal' }
    ],
    rows: [
      { journalNo: 'JRN-2026-0815-001', desc: 'Top-up poin 100K - Budi', type: 'Topup', debit: 100000, credit: 0, date: '15 Agu 2026' },
      { journalNo: 'JRN-2026-0815-002', desc: 'Order ORD-0815-001', type: 'Order', debit: 0, credit: 245000, date: '15 Agu 2026' },
      { journalNo: 'JRN-2026-0815-003', desc: 'Fee split order ORD-0815-001', type: 'Fee', debit: 164150, credit: 80850, date: '15 Agu 2026' },
      { journalNo: 'JRN-2026-0814-018', desc: 'Expired poin - Dewi', type: 'Expired', debit: 0, credit: 45000, date: '14 Agu 2026' },
      { journalNo: 'JRN-2026-0814-019', desc: 'Stok masuk dari supplier', type: 'Purchase', debit: 500000, credit: 0, date: '14 Agu 2026' }
    ],
    hasCrud: false
  };

  /* ================= MASTER DATA: KATEGORI ================= */
  MODULES.categories = {
    id: 'categories', title: 'Kategori', desc: 'Kelola kategori produk', icon: 'fa-solid fa-tags', hasCrud: true,
    cards: [
      { label: 'Total Kategori', value: '16', sub: 'semua aktif', icon: 'fa-solid fa-tags', color: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
      { label: 'Aktif', value: '16', sub: 'ditampilkan di katalog', icon: 'fa-solid fa-circle-check', color: 'linear-gradient(135deg,#00AA5B,#34d399)' },
      { label: 'Nonaktif', value: '0', sub: 'tidak ditampilkan', icon: 'fa-solid fa-circle-xmark', color: 'linear-gradient(135deg,#f59e0b,#fbbf24)' },
      { label: 'Total Produk', value: '35', sub: 'di semua kategori', icon: 'fa-solid fa-box', color: 'linear-gradient(135deg,#8b5cf6,#a78bfa)' }
    ],
    filters: [
      { id: 'statusFilter', label: 'Status', options: ['Semua','Aktif','Nonaktif'] }
    ],
    hasDateFilter: true,
    chips: ['Semua', 'Aktif', 'Nonaktif'],
    columns: [
      { key: 'id', label: 'ID' }, { key: 'icon', label: 'Ikon', type: 'icon' }, { key: 'name', label: 'Nama Kategori' },
      { key: 'slug', label: 'Slug' }, { key: 'sort', label: 'Urutan', type: 'number' }, { key: 'isActive', label: 'Status', type: 'badge' }
    ],
    rows: [
      { id: 1, icon: 'fa-bowl-rice', name: 'Sembako', slug: 'sembako', sort: 1, isActive: 'Aktif' },
      { id: 2, icon: 'fa-utensils', name: 'Makanan', slug: 'makanan', sort: 2, isActive: 'Aktif' },
      { id: 3, icon: 'fa-plug', name: 'Elektronik', slug: 'elektronik', sort: 3, isActive: 'Aktif' },
      { id: 4, icon: 'fa-shirt', name: 'Fashion', slug: 'fashion', sort: 4, isActive: 'Aktif' },
      { id: 5, icon: 'fa-toolbox', name: 'Peralatan', slug: 'peralatan', sort: 5, isActive: 'Aktif' },
      { id: 6, icon: 'fa-wand-magic-sparkles', name: 'Kecantikan', slug: 'kecantikan', sort: 6, isActive: 'Aktif' },
      { id: 7, icon: 'fa-gift', name: 'Rewards', slug: 'rewards', sort: 7, isActive: 'Aktif' },
      { id: 8, icon: 'fa-car', name: 'Otomotif', slug: 'otomotif', sort: 8, isActive: 'Aktif' },
      { id: 9, icon: 'fa-couch', name: 'Rumah Tangga', slug: 'rumah-tangga', sort: 9, isActive: 'Aktif' },
      { id: 10, icon: 'fa-heart-pulse', name: 'Kesehatan', slug: 'kesehatan', sort: 10, isActive: 'Aktif' },
      { id: 11, icon: 'fa-dumbbell', name: 'Olahraga', slug: 'olahraga', sort: 11, isActive: 'Aktif' },
      { id: 12, icon: 'fa-chess-king', name: 'Hobi & Mainan', slug: 'hobi-mainan', sort: 12, isActive: 'Aktif' },
      { id: 13, icon: 'fa-book', name: 'Buku & ATK', slug: 'buku-atk', sort: 13, isActive: 'Aktif' },
      { id: 14, icon: 'fa-baby', name: 'Bayi & Anak', slug: 'bayi-anak', sort: 14, isActive: 'Aktif' },
      { id: 15, icon: 'fa-paw', name: 'Peliharaan', slug: 'peliharaan', sort: 15, isActive: 'Aktif' },
      { id: 16, icon: 'fa-apple-whole', name: 'Buah & Sayur', slug: 'buah-sayur', sort: 16, isActive: 'Aktif' }
    ],
    modalFields: [
      { key: 'name', label: 'Nama Kategori', type: 'text' },
      { key: 'icon', label: 'Ikon (FontAwesome)', type: 'text', placeholder: 'fa-bowl-rice' },
      { key: 'sort', label: 'Urutan', type: 'number' },
      { key: 'isActive', label: 'Status', type: 'select', options: ['Aktif','Nonaktif'] }
    ]
  };

  /* ================= MASTER DATA: PRODUK ================= */
  MODULES.products = {
    id: 'products', title: 'Produk & Varian', desc: 'Kelola produk, varian, field WMS & penyusuna RAB', icon: 'fa-solid fa-box', hasCrud: true,
    cards: [
      { label: 'Total Produk', value: '35', sub: 'tampil di katalog', icon: 'fa-solid fa-box', color: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
      { label: 'Aktif', value: '32', sub: 'bisa dibeli', icon: 'fa-solid fa-circle-check', color: 'linear-gradient(135deg,#00AA5B,#34d399)' },
      { label: 'Nonaktif', value: '3', sub: 'sembunyikan', icon: 'fa-solid fa-circle-xmark', color: 'linear-gradient(135deg,#f59e0b,#fbbf24)' },
      { label: 'Stok Rendah', value: '7', sub: 'di bawah min stock', icon: 'fa-solid fa-triangle-exclamation', color: 'linear-gradient(135deg,#ef4444,#f87171)' }
    ],
    filters: [
      { id: 'catFilter', label: 'Kategori', options: ['Semua Kategori','Sembako','Makanan','Elektronik','Fashion','Kesehatan'] },
      { id: 'statusFilter', label: 'Status', options: ['Semua','Aktif','Nonaktif'] },
      { id: 'stockFilter', label: 'Stok', options: ['Semua','Stok Rendah','Stok Habis'] }
    ],
    hasDateFilter: true,
    chips: ['Semua', 'Aktif', 'Nonaktif', 'Stok Rendah', 'Stok Habis'],
    columns: [
      { key: 'image', label: 'Foto', type: 'image' }, { key: 'sku', label: 'SKU' }, { key: 'name', label: 'Produk' }, { key: 'category', label: 'Kategori' },
      { key: 'supplier', label: 'Supplier' },
      { key: 'price', label: 'Harga Biaya', type: 'currency' }, { key: 'sellingPrice', label: 'Harga Jual', type: 'currency' },
      { key: 'points', label: 'Harga Poin', type: 'points' },
      { key: 'isActive', label: 'Status', type: 'badge' }
    ],
    rows: [
      { sku: 'BR-001', name: 'Beras Premium 5kg', category: 'Sembako', supplier: 'PT Beras Sejahtera', image: 'https://img.jastip.id/beras-premium.jpg', price: 85000, sellingPrice: 93500, points: 93500, isActive: 'Aktif', feePercent: 5, memberDiscountPercent: 2, otherDiscountPercent: 0, operationalCostPercent: 3, otherCostPercent: 0, overheadPercent: 0 },
      { sku: 'MN-002', name: 'Minyak Goreng 2L', category: 'Sembako', supplier: 'CV Minyak Nusantara', image: 'https://img.jastip.id/minyak-goreng.jpg', price: 42000, sellingPrice: 46200, points: 46200, isActive: 'Aktif', feePercent: 5, memberDiscountPercent: 2, otherDiscountPercent: 0, operationalCostPercent: 3, otherCostPercent: 0, overheadPercent: 0 },
      { sku: 'GR-003', name: 'Gula Pasir 1kg', category: 'Sembako', supplier: 'PT Gula Manis', image: 'https://img.jastip.id/gula-pasir.jpg', price: 18000, sellingPrice: 19800, points: 19800, isActive: 'Aktif', feePercent: 5, memberDiscountPercent: 2, otherDiscountPercent: 0, operationalCostPercent: 3, otherCostPercent: 0, overheadPercent: 0 },
      { sku: 'EL-010', name: 'Rice Cooker 1.2L', category: 'Elektronik', supplier: 'UD Elektronik Prima', image: 'https://img.jastip.id/rice-cooker.jpg', price: 285000, sellingPrice: 313500, points: 313500, isActive: 'Aktif', feePercent: 5, memberDiscountPercent: 2, otherDiscountPercent: 0, operationalCostPercent: 3, otherCostPercent: 0, overheadPercent: 0 },
      { sku: 'FS-021', name: 'Kaos Polos Cotton', category: 'Fashion', supplier: 'PT Fashion Kreatif', image: 'https://img.jastip.id/kaos-cotton.jpg', price: 65000, sellingPrice: 71500, points: 71500, isActive: 'Aktif', feePercent: 5, memberDiscountPercent: 2, otherDiscountPercent: 0, operationalCostPercent: 3, otherCostPercent: 0, overheadPercent: 0 },
      { sku: 'KS-015', name: 'Vitamin C 500mg', category: 'Kesehatan', supplier: 'PT Beras Sejahtera', image: 'https://img.jastip.id/vitamin-c.jpg', price: 25000, sellingPrice: 27500, points: 27500, isActive: 'Nonaktif', feePercent: 5, memberDiscountPercent: 2, otherDiscountPercent: 0, operationalCostPercent: 3, otherCostPercent: 0, overheadPercent: 0 },
      { sku: 'MK-005', name: 'Indomie Goreng (10 pcs)', category: 'Makanan', supplier: 'PT Gula Manis', image: 'https://img.jastip.id/indomie.jpg', price: 28000, sellingPrice: 30800, points: 30800, isActive: 'Aktif', feePercent: 5, memberDiscountPercent: 2, otherDiscountPercent: 0, operationalCostPercent: 3, otherCostPercent: 0, overheadPercent: 0 },
      { sku: 'RT-012', name: 'Sabun Mandi Cair 800ml', category: 'Rumah Tangga', supplier: 'CV Minyak Nusantara', image: 'https://img.jastip.id/sabun-cair.jpg', price: 24000, sellingPrice: 26400, points: 26400, isActive: 'Aktif', feePercent: 5, memberDiscountPercent: 2, otherDiscountPercent: 0, operationalCostPercent: 3, otherCostPercent: 0, overheadPercent: 0 },
      { sku: 'OT-008', name: 'Oli Mesin 1L', category: 'Otomotif', supplier: 'UD Elektronik Prima', image: 'https://img.jastip.id/oli-mesin.jpg', price: 78000, sellingPrice: 85800, points: 85800, isActive: 'Aktif', feePercent: 5, memberDiscountPercent: 2, otherDiscountPercent: 0, operationalCostPercent: 3, otherCostPercent: 0, overheadPercent: 0 },
      { sku: 'BB-001', name: 'Susu Bayi 900g', category: 'Bayi & Anak', supplier: 'PT Beras Sejahtera', image: 'https://img.jastip.id/susu-bayi.jpg', price: 128000, sellingPrice: 140800, points: 140800, isActive: 'Aktif', feePercent: 5, memberDiscountPercent: 2, otherDiscountPercent: 0, operationalCostPercent: 3, otherCostPercent: 0, overheadPercent: 0 }
    ],
    modalFields: [
      { key: 'name', label: 'Nama Produk', type: 'text', full: true },
      { key: 'category', label: 'Kategori', type: 'select', dynamic: true, dynamicSource: 'categories' },
      { key: 'supplier', label: 'Supplier', type: 'select', dynamic: true, dynamicSource: 'suppliers' },
      { key: 'image', label: 'URL Foto Produk', type: 'text', full: true },
      { key: 'price', label: 'Harga Biaya (Rp)', type: 'number' },
      { key: 'feePercent', label: 'Fee (%)', type: 'number' },
      { key: 'memberDiscountPercent', label: 'Diskon Member (%)', type: 'number' },
      { key: 'otherDiscountPercent', label: 'Diskon Lainnya (%)', type: 'number' },
      { key: 'operationalCostPercent', label: 'Biaya Operasional (%)', type: 'number' },
      { key: 'otherCostPercent', label: 'Biaya Lainnya (%)', type: 'number' },
      { key: 'overheadPercent', label: 'Overhead (%)', type: 'number' },
      { key: 'sellingPrice', label: 'Harga Jual (Rp)', type: 'number' },
      { key: 'points', label: 'Harga (Poin)', type: 'number' },
      { key: 'storageType', label: 'Storage Type', type: 'select', options: ['Ambient','Cold','Frozen','Hazardous'] },
      { key: 'isBatchTracked', label: 'Batch Tracking', type: 'select', options: ['Ya','Tidak'] },
      { key: 'isActive', label: 'Status', type: 'select', options: ['Aktif','Nonaktif'] }
    ]
  };

  /* ================= STOK & GUDANG: MANAJEMEN STOK ================= */
  MODULES['stock-management'] = {
    id: 'stock-management', title: 'Manajemen Stok', desc: 'Kelola stok produk, mutasi masuk/keluar & status ketersediaan', icon: 'fa-solid fa-boxes-stacked', hasCrud: true,
    cards: [
      { label: 'Total SKU', value: '1.284', sub: 'Semua kategori', icon: 'fa-solid fa-boxes-stacked', color: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
      { label: 'Stok Menipis', value: '42', sub: 'di bawah min stok', icon: 'fa-solid fa-triangle-exclamation', color: 'linear-gradient(135deg,#f59e0b,#fbbf24)' },
      { label: 'Stok Habis', value: '17', sub: 'perlu re-stock', icon: 'fa-solid fa-circle-xmark', color: 'linear-gradient(135deg,#ef4444,#f87171)' },
      { label: 'Total Terjual', value: '21.830', sub: '30 hari', icon: 'fa-solid fa-cart-shopping', color: 'linear-gradient(135deg,#00AA5B,#34d399)' }
    ],
    filters: [
      { id: 'catFilter', label: 'Kategori', options: ['Semua Kategori','Sembako','Makanan','Elektronik','Fashion','Kesehatan','Rumah Tangga','Otomotif','Bayi & Anak'] },
      { id: 'statusFilter', label: 'Status', options: ['Semua','Aman','Menipis','Habis'] }
    ],
    hasDateFilter: true,
    chips: ['Semua', 'Aman', 'Menipis', 'Habis'],
    columns: [
      { key: 'product', label: 'Produk' }, { key: 'sku', label: 'SKU' }, { key: 'category', label: 'Kategori' },
      { key: 'currentStock', label: 'Stok', type: 'number' }, { key: 'minStock', label: 'Min Stok', type: 'number' },
      { key: 'sold', label: 'Terjual', type: 'number' }, { key: 'status', label: 'Status', type: 'badge' }
    ],
    rows: [
      { product: 'Beras Premium 5kg', sku: 'BR-001', category: 'Sembako', currentStock: 850, minStock: 100, sold: 420, status: 'Aman' },
      { product: 'Minyak Goreng 2L', sku: 'MN-002', category: 'Sembako', currentStock: 45, minStock: 80, sold: 120, status: 'Menipis' },
      { product: 'Gula Pasir 1kg', sku: 'GR-003', category: 'Sembako', currentStock: 320, minStock: 50, sold: 260, status: 'Aman' },
      { product: 'Rice Cooker 1.2L', sku: 'EL-010', category: 'Elektronik', currentStock: 8, minStock: 15, sold: 18, status: 'Habis' },
      { product: 'Kaos Polos Cotton', sku: 'FS-021', category: 'Fashion', currentStock: 240, minStock: 30, sold: 90, status: 'Aman' },
      { product: 'Vitamin C 500mg', sku: 'KS-015', category: 'Kesehatan', currentStock: 0, minStock: 20, sold: 35, status: 'Habis' },
      { product: 'Indomie Goreng (10 pcs)', sku: 'MK-005', category: 'Makanan', currentStock: 12, minStock: 20, sold: 140, status: 'Habis' },
      { product: 'Sabun Mandi Cair 800ml', sku: 'RT-012', category: 'Rumah Tangga', currentStock: 96, minStock: 25, sold: 58, status: 'Aman' },
      { product: 'Oli Mesin 1L', sku: 'OT-008', category: 'Otomotif', currentStock: 34, minStock: 15, sold: 22, status: 'Aman' },
      { product: 'Susu Bayi 900g', sku: 'BB-001', category: 'Bayi & Anak', currentStock: 5, minStock: 10, sold: 12, status: 'Menipis' }
    ],
    modalFields: [
      { key: 'product', label: 'Nama Produk', type: 'text', full: true },
      { key: 'sku', label: 'SKU', type: 'text' },
      { key: 'category', label: 'Kategori', type: 'select', options: ['Sembako','Makanan','Elektronik','Fashion','Kesehatan','Rumah Tangga','Otomotif','Bayi & Anak'] },
      { key: 'currentStock', label: 'Stok Saat Ini', type: 'number' },
      { key: 'minStock', label: 'Min Stok', type: 'number' },
      { key: 'sold', label: 'Terjual', type: 'number' },
      { key: 'status', label: 'Status', type: 'select', options: ['Aman','Menipis','Habis'] }
    ]
  };

  /* ================= MASTER DATA: KONVERSI RUPIAH KE POINT ================= */
  MODULES['currency-conversion'] = {
    id: 'currency-conversion', title: 'Konversi Rupiah ke Point', desc: 'Kelola nilai tukar Rupiah ke Poin (1 Poin = Rp X)', icon: 'fa-solid fa-arrow-right-arrow-left', hasCrud: true,
    cards: [
      { label: 'Rate Aktif', value: '1 Poin = Rp 1', sub: 'Berlaku sejak 1 Jan 2026', icon: 'fa-solid fa-check-circle', color: 'linear-gradient(135deg,#00AA5B,#34d399)' },
      { label: 'Total Konfigurasi', value: '4', sub: '3 nonaktif, 1 aktif', icon: 'fa-solid fa-sliders', color: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
      { label: 'Poin Beredar', value: 'Rp 1,89 M', sub: 'liabilitas poin aktif', icon: 'fa-solid fa-coins', color: 'linear-gradient(135deg,#f59e0b,#fbbf24)' },
      { label: 'Total Transaksi (30 hari)', value: '12.480', sub: 'semua tipe', icon: 'fa-solid fa-receipt', color: 'linear-gradient(135deg,#8b5cf6,#a78bfa)' }
    ],
    filters: [
      { id: 'statusFilter', label: 'Status', options: ['Semua','Aktif','Nonaktif'] }
    ],
    hasDateFilter: true,
    chips: ['Semua', 'Aktif', 'Nonaktif'],
    columns: [
      { key: 'name', label: 'Nama Konfigurasi' }, { key: 'rate', label: 'Rate (Rp / 1 Poin)', type: 'number' },
      { key: 'effectiveDate', label: 'Berlaku Sejak' }, { key: 'status', label: 'Status', type: 'badge' }
    ],
    rows: [
      { name: 'Rate Standar 2026', rate: 1, effectiveDate: '01 Jan 2026', status: 'Aktif' },
      { name: 'Rate Promo HUT', rate: 5, effectiveDate: '01 Agu 2026', status: 'Nonaktif' },
      { name: 'Rate Awal 2024', rate: 10, effectiveDate: '01 Jan 2024', status: 'Nonaktif' },
      { name: 'Rate Legacy 2023', rate: 100, effectiveDate: '01 Jul 2023', status: 'Nonaktif' }
    ],
    modalFields: [
      { key: 'name', label: 'Nama Konfigurasi', type: 'text' },
      { key: 'rate', label: 'Rate (Rp per 1 Poin)', type: 'number' },
      { key: 'effectiveDate', label: 'Berlaku Sejak', type: 'date' },
      { key: 'status', label: 'Status', type: 'select', options: ['Aktif','Nonaktif'] }
    ]
  };

  /* ================= MASTER DATA: HUB ================= */
  MODULES.hubs = {
    id: 'hubs', title: 'Hub', desc: 'Kelola cabang/distribusi hub', icon: 'fa-solid fa-store', hasCrud: true,
    cards: [
      { label: 'Total Hub', value: '5', sub: 'aktif semua', icon: 'fa-solid fa-store', color: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
      { label: 'Aktif', value: '5', sub: 'melayani customer', icon: 'fa-solid fa-circle-check', color: 'linear-gradient(135deg,#00AA5B,#34d399)' },
      { label: 'Pending', value: '0', sub: 'menunggu aktivasi', icon: 'fa-solid fa-clock', color: 'linear-gradient(135deg,#f59e0b,#fbbf24)' },
      { label: 'Total Customer', value: '12.486', sub: 'tersebar di 5 hub', icon: 'fa-solid fa-user-group', color: 'linear-gradient(135deg,#8b5cf6,#a78bfa)' }
    ],
    filters: [
      { id: 'statusFilter', label: 'Status', options: ['Semua','Aktif','Inaktif','Pending'] },
      { id: 'cityFilter', label: 'Kota', options: ['Semua Kota','Jakarta Selatan','Bandung','Surabaya','Medan','Makassar'] }
    ],
    hasDateFilter: true,
    chips: ['Semua', 'Aktif', 'Inaktif', 'Pending'],
    columns: [
      { key: 'name', label: 'Nama Hub' }, { key: 'city', label: 'Kota' }, { key: 'address', label: 'Alamat' },
      { key: 'radiusKm', label: 'Radius', type: 'number' }, { key: 'owner', label: 'Owner' }, { key: 'status', label: 'Status', type: 'badge' }
    ],
    rows: [
      { name: 'Hub Jakarta Selatan', city: 'Jakarta Selatan', address: 'Jl. Kemang Raya No. 10', radiusKm: 10, owner: 'Rudi', status: 'Aktif' },
      { name: 'Hub Bandung', city: 'Bandung', address: 'Jl. Dago No. 25', radiusKm: 10, owner: 'Sari', status: 'Aktif' },
      { name: 'Hub Surabaya', city: 'Surabaya', address: 'Jl. Darmo No. 8', radiusKm: 10, owner: 'Bambang', status: 'Aktif' },
      { name: 'Hub Medan', city: 'Medan', address: 'Jl. Gatot Subroto No. 12', radiusKm: 10, owner: 'Tono', status: 'Aktif' },
      { name: 'Hub Makassar', city: 'Makassar', address: 'Jl. Sudirman No. 5', radiusKm: 10, owner: 'Ika', status: 'Aktif' }
    ],
    modalFields: [
      { key: 'name', label: 'Nama Hub', type: 'text' },
      { key: 'city', label: 'Kota', type: 'text' },
      { key: 'address', label: 'Alamat', type: 'text', full: true },
      { key: 'radiusKm', label: 'Radius Layanan (km)', type: 'number' },
      { key: 'owner', label: 'Nama Owner', type: 'text' },
      { key: 'status', label: 'Status', type: 'select', options: ['Aktif','Inaktif','Pending'] }
    ]
  };

  /* ================= MASTER DATA: CUSTOMER ================= */
  MODULES.customers = {
    id: 'customers', title: 'Customer', desc: 'Kelola data customer & alamat', icon: 'fa-solid fa-user-group', hasCrud: true,
    cards: [
      { label: 'Total Customer', value: '12.486', sub: 'terdaftar', icon: 'fa-solid fa-user-group', color: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
      { label: 'Aktif', value: '11.240', sub: '90% dari total', icon: 'fa-solid fa-circle-check', color: 'linear-gradient(135deg,#00AA5B,#34d399)' },
      { label: 'Tier Gold+', value: '2.184', sub: 'customer premium', icon: 'fa-solid fa-ranking-star', color: 'linear-gradient(135deg,#f59e0b,#fbbf24)' },
      { label: 'Baru (30 hari)', value: '348', sub: '+12% vs bulan lalu', icon: 'fa-solid fa-user-plus', color: 'linear-gradient(135deg,#8b5cf6,#a78bfa)' }
    ],
    filters: [
      { id: 'hubFilter', label: 'Hub', options: ['Semua Hub','Jakarta Selatan','Bandung','Surabaya','Medan','Makassar'] },
      { id: 'tierFilter', label: 'Tier', options: ['Semua Tier','Bronze','Silver','Gold','Platinum'] },
      { id: 'statusFilter', label: 'Status', options: ['Semua','Aktif','Nonaktif'] }
    ],
    hasDateFilter: true,
    chips: ['Semua', 'Aktif', 'Nonaktif', 'Gold+', 'Platinum'],
    columns: [
      { key: 'code', label: 'Kode' }, { key: 'name', label: 'Nama' }, { key: 'email', label: 'Email' },
      { key: 'hub', label: 'Hub' }, { key: 'tier', label: 'Tier', type: 'badge' }, { key: 'spend', label: 'Total Belanja', type: 'currency' }, { key: 'status', label: 'Status', type: 'badge' }
    ],
    rows: [
      { code: 'CUS-0001', name: 'Budi Santoso', email: 'budi@gmail.com', hub: 'Jakarta Selatan', tier: 'Gold', spend: 2450000, status: 'Aktif' },
      { code: 'CUS-0002', name: 'Siti Rahayu', email: 'siti@gmail.com', hub: 'Bandung', tier: 'Silver', spend: 820000, status: 'Aktif' },
      { code: 'CUS-0003', name: 'Andi Wijaya', email: 'andi@gmail.com', hub: 'Surabaya', tier: 'Platinum', spend: 6840000, status: 'Aktif' },
      { code: 'CUS-0004', name: 'Dewi Lestari', email: 'dewi@gmail.com', hub: 'Jakarta Selatan', tier: 'Bronze', spend: 210000, status: 'Aktif' },
      { code: 'CUS-0005', name: 'Rudi Hartono', email: 'rudi@gmail.com', hub: 'Medan', tier: 'Gold', spend: 1980000, status: 'Nonaktif' },
      { code: 'CUS-0006', name: 'Maya Anggraini', email: 'maya@gmail.com', hub: 'Makassar', tier: 'Silver', spend: 640000, status: 'Aktif' }
    ],
    modalFields: [
      { key: 'name', label: 'Nama', type: 'text' },
      { key: 'email', label: 'Email', type: 'text' },
      { key: 'hub', label: 'Hub', type: 'select', options: ['Jakarta Selatan','Bandung','Surabaya','Medan','Makassar'] },
      { key: 'tier', label: 'Tier', type: 'select', options: ['Bronze','Silver','Gold','Platinum'] },
      { key: 'spend', label: 'Total Belanja (Rp)', type: 'number' },
      { key: 'status', label: 'Status', type: 'select', options: ['Aktif','Nonaktif'] }
    ]
  };

  /* ================= MASTER DATA: MEMBERSHIP TIER ================= */
  MODULES['membership-tiers'] = {
    id: 'membership-tiers', title: 'Membership & Tier', desc: 'Kelola tier & benefit membership', icon: 'fa-solid fa-ranking-star', hasCrud: true,
    cards: [
      { label: 'Total Tier', value: '4', sub: 'Bronze–Platinum', icon: 'fa-solid fa-ranking-star', color: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
      { label: 'Customer PLATINUM', value: '412', sub: 'belanja > Rp 5 jt', icon: 'fa-solid fa-crown', color: 'linear-gradient(135deg,#8b5cf6,#a78bfa)' },
      { label: 'Auto Upgrade Aktif', value: 'Ya', sub: 'berdasarkan total spend', icon: 'fa-solid fa-arrow-trend-up', color: 'linear-gradient(135deg,#00AA5B,#34d399)' },
      { label: 'Cashback Tertinggi', value: '5%', sub: 'tier Platinum', icon: 'fa-solid fa-percent', color: 'linear-gradient(135deg,#f59e0b,#fbbf24)' }
    ],
    filters: [
      { id: 'statusFilter', label: 'Status', options: ['Semua','Aktif','Nonaktif'] }
    ],
    hasDateFilter: false,
    chips: ['Semua', 'Aktif', 'Nonaktif'],
    columns: [
      { key: 'name', label: 'Tier' }, { key: 'minSpend', label: 'Min Belanja', type: 'currency' },
      { key: 'discount', label: 'Diskon', type: 'percent' }, { key: 'cashback', label: 'Cashback', type: 'percent' },
      { key: 'freeShip', label: 'Gratis Ongkir', type: 'number' }, { key: 'status', label: 'Status', type: 'badge' }
    ],
    rows: [
      { name: 'Bronze', minSpend: 0, discount: 0, cashback: 0.5, freeShip: 0, status: 'Aktif' },
      { name: 'Silver', minSpend: 500000, discount: 1, cashback: 1, freeShip: 1, status: 'Aktif' },
      { name: 'Gold', minSpend: 1500000, discount: 2, cashback: 2, freeShip: 3, status: 'Aktif' },
      { name: 'Platinum', minSpend: 5000000, discount: 3, cashback: 5, freeShip: 5, status: 'Aktif' }
    ],
    modalFields: [
      { key: 'name', label: 'Nama Tier', type: 'text' },
      { key: 'minSpend', label: 'Min Belanja (Rp)', type: 'number' },
      { key: 'discount', label: 'Diskon (%)', type: 'number' },
      { key: 'cashback', label: 'Cashback (%)', type: 'number' },
      { key: 'freeShip', label: 'Gratis Ongkir / bln', type: 'number' },
      { key: 'status', label: 'Status', type: 'select', options: ['Aktif','Nonaktif'] }
    ]
  };

  /* ================= MASTER DATA: REWARD ================= */
  MODULES.rewards = {
    id: 'rewards', title: 'Reward', desc: 'Kelola katalog reward', icon: 'fa-solid fa-gift', hasCrud: true,
    cards: [
      { label: 'Total Reward', value: '32', sub: 'tersedia', icon: 'fa-solid fa-gift', color: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
      { label: 'Aktif', value: '28', sub: 'bisa diklaim', icon: 'fa-solid fa-circle-check', color: 'linear-gradient(135deg,#00AA5B,#34d399)' },
      { label: 'Stok Habis', value: '4', sub: 'perlu isi ulang', icon: 'fa-solid fa-triangle-exclamation', color: 'linear-gradient(135deg,#ef4444,#f87171)' },
      { label: 'Total Klaim', value: '1.284', sub: 'semua reward', icon: 'fa-solid fa-hand-holding-heart', color: 'linear-gradient(135deg,#f59e0b,#fbbf24)' }
    ],
    filters: [
      { id: 'typeFilter', label: 'Tipe', options: ['Semua Tipe','Voucher','Produk','Paket Umrah','Sembako','Elektronik'] },
      { id: 'statusFilter', label: 'Status', options: ['Semua','Aktif','Nonaktif'] }
    ],
    hasDateFilter: false,
    chips: ['Semua', 'Aktif', 'Nonaktif', 'Habis'],
    columns: [
      { key: 'name', label: 'Nama Reward' }, { key: 'type', label: 'Tipe' }, { key: 'points', label: 'Poin', type: 'points' },
      { key: 'stock', label: 'Stok', type: 'number' }, { key: 'validUntil', label: 'Berlaku s/d' }, { key: 'status', label: 'Status', type: 'badge' }
    ],
    rows: [
      { name: 'Voucher Belanja 50K', type: 'Voucher', points: 55000, stock: 120, validUntil: '31 Des 2026', status: 'Aktif' },
      { name: 'Paket Sembako Hemat', type: 'Sembako', points: 115000, stock: 45, validUntil: '31 Des 2026', status: 'Aktif' },
      { name: 'Blender 1.5L', type: 'Elektronik', points: 185000, stock: 0, validUntil: '30 Sep 2026', status: 'Nonaktif' },
      { name: 'Paket Umroh Reguler', type: 'Paket Umrah', points: 25000000, stock: 8, validUntil: '31 Des 2027', status: 'Aktif' },
      { name: 'Voucher Pulsa 25K', type: 'Voucher', points: 27500, stock: 500, validUntil: '31 Des 2026', status: 'Aktif' }
    ],
    modalFields: [
      { key: 'name', label: 'Nama Reward', type: 'text' },
      { key: 'type', label: 'Tipe', type: 'select', options: ['Voucher','Produk','Paket Umrah','Sembako','Elektronik'] },
      { key: 'points', label: 'Harga (Poin)', type: 'number' },
      { key: 'stock', label: 'Stok', type: 'number' },
      { key: 'validUntil', label: 'Berlaku s/d', type: 'date' },
      { key: 'status', label: 'Status', type: 'select', options: ['Aktif','Nonaktif'] }
    ]
  };

  /* ================= MASTER DATA: PROMO ================= */
  MODULES.promos = {
    id: 'promos', title: 'Promo / Event', desc: 'Kelola kode promo & event', icon: 'fa-solid fa-percent', hasCrud: true,
    cards: [
      { label: 'Total Promo', value: '12', sub: 'aktif 8', icon: 'fa-solid fa-percent', color: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
      { label: 'Aktif', value: '8', sub: 'berjalan saat ini', icon: 'fa-solid fa-circle-check', color: 'linear-gradient(135deg,#00AA5B,#34d399)' },
      { label: 'Kedaluarsa', value: '4', sub: 'perlu perpanjang', icon: 'fa-solid fa-clock', color: 'linear-gradient(135deg,#f59e0b,#fbbf24)' },
      { label: 'Total Pemakaian', value: '3.842', sub: 'semua kode promo', icon: 'fa-solid fa-receipt', color: 'linear-gradient(135deg,#8b5cf6,#a78bfa)' }
    ],
    filters: [
      { id: 'typeFilter', label: 'Tipe', options: ['Semua Tipe','Discount','Points Multiplier','Cashback','Bonus'] },
      { id: 'statusFilter', label: 'Status', options: ['Semua','Aktif','Nonaktif'] }
    ],
    hasDateFilter: true,
    chips: ['Semua', 'Aktif', 'Nonaktif', 'Kedaluarsa'],
    columns: [
      { key: 'code', label: 'Kode' }, { key: 'name', label: 'Nama Promo' }, { key: 'type', label: 'Tipe', type: 'badge' },
      { key: 'value', label: 'Nilai', type: 'percent' }, { key: 'used', label: 'Pemakaian', type: 'number' },
      { key: 'endDate', label: 'Berakhir' }, { key: 'status', label: 'Status', type: 'badge' }
    ],
    rows: [
      { code: 'HEMAT10', name: 'Diskon 10% Sembako', type: 'Discount', value: 10, used: 1240, endDate: '31 Agu 2026', status: 'Aktif' },
      { code: 'POINX2', name: 'Poin 2x untuk Makanan', type: 'Points Multiplier', value: 2, used: 860, endDate: '30 Sep 2026', status: 'Aktif' },
      { code: 'CASHBACK5', name: 'Cashback 5% Elektronik', type: 'Cashback', value: 5, used: 320, endDate: '15 Agu 2026', status: 'Nonaktif' },
      { code: 'BONUS100', name: 'Bonus 100 poin tiap transaksi', type: 'Bonus', value: 100, used: 1422, endDate: '31 Des 2026', status: 'Aktif' },
      { code: 'RAMADHAN', name: 'Promo Ramadhan 2026', type: 'Discount', value: 15, used: 0, endDate: '30 Apr 2026', status: 'Nonaktif' }
    ],
    modalFields: [
      { key: 'code', label: 'Kode Promo', type: 'text' },
      { key: 'name', label: 'Nama Promo', type: 'text' },
      { key: 'type', label: 'Tipe', type: 'select', options: ['Discount','Points Multiplier','Cashback','Bonus'] },
      { key: 'value', label: 'Nilai', type: 'number' },
      { key: 'endDate', label: 'Tanggal Berakhir', type: 'date' },
      { key: 'status', label: 'Status', type: 'select', options: ['Aktif','Nonaktif'] }
    ]
  };

  /* ================= MASTER DATA: SUPPLIER ================= */
  MODULES.suppliers = {
    id: 'suppliers', title: 'Supplier', desc: 'Kelola vendor/pemasok barang', icon: 'fa-solid fa-truck-field', hasCrud: true,
    cards: [
      { label: 'Total Supplier', value: '18', sub: 'aktif 16', icon: 'fa-solid fa-truck-field', color: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
      { label: 'Aktif', value: '16', sub: 'bisa dipesan', icon: 'fa-solid fa-circle-check', color: 'linear-gradient(135deg,#00AA5B,#34d399)' },
      { label: 'Skor Rata-rata', value: '87,4', sub: 'grade B+', icon: 'fa-solid fa-star', color: 'linear-gradient(135deg,#f59e0b,#fbbf24)' },
      { label: 'Total PO (30 hari)', value: 'Rp 1,2 M', sub: '46 purchase order', icon: 'fa-solid fa-file-invoice', color: 'linear-gradient(135deg,#8b5cf6,#a78bfa)' }
    ],
    filters: [
      { id: 'statusFilter', label: 'Status', options: ['Semua','Aktif','Nonaktif'] },
      { id: 'cityFilter', label: 'Kota', options: ['Semua Kota','Jakarta','Tangerang','Bekasi','Surabaya'] }
    ],
    hasDateFilter: true,
    chips: ['Semua', 'Aktif', 'Nonaktif'],
    columns: [
      { key: 'code', label: 'Kode' }, { key: 'name', label: 'Nama Supplier' }, { key: 'contact', label: 'Kontak' },
      { key: 'city', label: 'Kota' }, { key: 'leadTime', label: 'Lead Time', type: 'number' },
      { key: 'score', label: 'Skor', type: 'number' }, { key: 'status', label: 'Status', type: 'badge' }
    ],
    rows: [
      { code: 'SUP-001', name: 'PT Beras Sejahtera', contact: 'Pak Hadi', city: 'Karawang', leadTime: 3, score: 92, status: 'Aktif' },
      { code: 'SUP-002', name: 'CV Minyak Nusantara', contact: 'Bu Yanti', city: 'Tangerang', leadTime: 2, score: 88, status: 'Aktif' },
      { code: 'SUP-003', name: 'PT Gula Manis', contact: 'Pak Joko', city: 'Jakarta', leadTime: 4, score: 85, status: 'Aktif' },
      { code: 'SUP-004', name: 'UD Elektronik Prima', contact: 'Pak Anton', city: 'Surabaya', leadTime: 7, score: 74, status: 'Nonaktif' },
      { code: 'SUP-005', name: 'PT Fashion Kreatif', contact: 'Bu Sinta', city: 'Bandung', leadTime: 5, score: 90, status: 'Aktif' }
    ],
    modalFields: [
      { key: 'code', label: 'Kode Supplier', type: 'text' },
      { key: 'name', label: 'Nama Supplier', type: 'text' },
      { key: 'contact', label: 'Kontak Person', type: 'text' },
      { key: 'city', label: 'Kota', type: 'text' },
      { key: 'leadTime', label: 'Lead Time (hari)', type: 'number' },
      { key: 'score', label: 'Skor Performa', type: 'number' },
      { key: 'status', label: 'Status', type: 'select', options: ['Aktif','Nonaktif'] }
    ]
  };

  /* ================= MASTER DATA: PAYMENT METHODS ================= */
  MODULES['payment-methods'] = {
    id: 'payment-methods', title: 'Metode Pembayaran', desc: 'Kelola metode bayar', icon: 'fa-solid fa-credit-card', hasCrud: true,
    cards: [
      { label: 'Total Metode', value: '6', sub: 'poin + 5 gateway', icon: 'fa-solid fa-credit-card', color: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
      { label: 'Aktif', value: '6', sub: 'semua aktif', icon: 'fa-solid fa-circle-check', color: 'linear-gradient(135deg,#00AA5B,#34d399)' },
      { label: 'Metode Favorit', value: 'QRIS', sub: '38% transaksi', icon: 'fa-solid fa-qrcode', color: 'linear-gradient(135deg,#f59e0b,#fbbf24)' },
      { label: 'Transaksi (30 hari)', value: '8.942', sub: 'semua metode', icon: 'fa-solid fa-receipt', color: 'linear-gradient(135deg,#8b5cf6,#a78bfa)' }
    ],
    filters: [
      { id: 'statusFilter', label: 'Status', options: ['Semua','Aktif','Nonaktif'] }
    ],
    hasDateFilter: false,
    chips: ['Semua', 'Aktif', 'Nonaktif'],
    columns: [
      { key: 'name', label: 'Metode' }, { key: 'code', label: 'Kode' }, { key: 'provider', label: 'Provider' },
      { key: 'status', label: 'Status', type: 'badge' }
    ],
    rows: [
      { name: 'Poin', code: 'points', provider: 'Internal', status: 'Aktif' },
      { name: 'Tunai', code: 'cash', provider: 'Hub', status: 'Aktif' },
      { name: 'QRIS', code: 'qris', provider: 'Midtrans', status: 'Aktif' },
      { name: 'E-Wallet', code: 'ewallet', provider: 'Midtrans', status: 'Aktif' },
      { name: 'Virtual Account', code: 'va', provider: 'Xendit', status: 'Aktif' },
      { name: 'Transfer Bank', code: 'transfer', provider: 'Xendit', status: 'Aktif' }
    ],
    modalFields: [
      { key: 'name', label: 'Nama Metode', type: 'text' },
      { key: 'code', label: 'Kode', type: 'text' },
      { key: 'provider', label: 'Provider', type: 'text' },
      { key: 'status', label: 'Status', type: 'select', options: ['Aktif','Nonaktif'] }
    ]
  };

  /* ================= MASTER DATA: USERS ================= */
  MODULES.users = {
    id: 'users', title: 'User & Role', desc: 'Manajemen user & RBAC', icon: 'fa-solid fa-user-shield', hasCrud: true,
    cards: [
      { label: 'Total User', value: '48', sub: 'semua role', icon: 'fa-solid fa-users', color: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
      { label: 'Superadmin', value: '2', sub: 'akses penuh', icon: 'fa-solid fa-user-shield', color: 'linear-gradient(135deg,#ef4444,#f87171)' },
      { label: 'Hub Owner', value: '5', sub: 'pemilik cabang', icon: 'fa-solid fa-store', color: 'linear-gradient(135deg,#00AA5B,#34d399)' },
      { label: 'Staff CS', value: '8', sub: 'layanan komplain', icon: 'fa-solid fa-headset', color: 'linear-gradient(135deg,#f59e0b,#fbbf24)' }
    ],
    filters: [
      { id: 'roleFilter', label: 'Role', options: ['Semua Role','Superadmin','Hub Owner','Staff CS','Customer'] },
      { id: 'statusFilter', label: 'Status', options: ['Semua','Aktif','Nonaktif'] }
    ],
    hasDateFilter: false,
    chips: ['Semua', 'Superadmin', 'Hub Owner', 'Staff CS', 'Customer'],
    columns: [
      { key: 'name', label: 'Nama' }, { key: 'email', label: 'Email' }, { key: 'role', label: 'Role', type: 'badge' },
      { key: 'hub', label: 'Hub' }, { key: 'status', label: 'Status', type: 'badge' }, { key: 'lastLogin', label: 'Login Terakhir' }
    ],
    rows: [
      { name: 'Admin Pusat', email: 'admin@jastip.id', role: 'Superadmin', hub: 'Pusat', status: 'Aktif', lastLogin: '15 Agu 2026' },
      { name: 'Rudi', email: 'hub@jastip.id', role: 'Hub Owner', hub: 'Jakarta Selatan', status: 'Aktif', lastLogin: '15 Agu 2026' },
      { name: 'Sari', email: 'sari@jastip.id', role: 'Hub Owner', hub: 'Bandung', status: 'Aktif', lastLogin: '14 Agu 2026' },
      { name: 'Rina CS', email: 'rina@jastip.id', role: 'Staff CS', hub: 'Pusat', status: 'Aktif', lastLogin: '15 Agu 2026' },
      { name: 'Customer Demo', email: 'customer@jastip.id', role: 'Customer', hub: 'Jakarta Selatan', status: 'Aktif', lastLogin: '15 Agu 2026' }
    ],
    modalFields: [
      { key: 'name', label: 'Nama', type: 'text' },
      { key: 'email', label: 'Email', type: 'text' },
      { key: 'role', label: 'Role', type: 'select', options: ['Superadmin','Hub Owner','Staff CS','Customer'] },
      { key: 'hub', label: 'Hub', type: 'select', options: ['Pusat','Jakarta Selatan','Bandung','Surabaya','Medan','Makassar'] },
      { key: 'status', label: 'Status', type: 'select', options: ['Aktif','Nonaktif'] }
    ]
  };

  /* ============================================================
     FUNGSI HELPER — ambil data module dari localStorage
     ============================================================ */
  var MODULES_DEFS = {
    'point-transactions': {
      title: 'Riwayat Transaksi Poin', desc: 'Semua transaksi poin seluruh customer', icon: 'fa-solid fa-arrow-right-arrow-left', hasCrud: true,
      cards: [
        { label: 'Total Transaksi', value: '12.480', sub: 'semua tipe', icon: 'fa-solid fa-receipt', color: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
        { label: 'Volume Top-up', value: 'Rp 384 jt', sub: 'bulan ini', icon: 'fa-solid fa-arrow-trend-up', color: 'linear-gradient(135deg,#00AA5B,#34d399)' },
        { label: 'Volume Belanja', value: 'Rp 685 jt', sub: 'bulan ini', icon: 'fa-solid fa-cart-shopping', color: 'linear-gradient(135deg,#8b5cf6,#a78bfa)' },
        { label: 'Transaksi Gagal', value: '34', sub: '0,3% dari total', icon: 'fa-solid fa-triangle-exclamation', color: 'linear-gradient(135deg,#ef4444,#f87171)' }
      ],
      filters: [
        { id: 'typeFilter', label: 'Tipe', options: ['Semua Tipe','Topup','Purchase','Redeem','Cashback','Bonus','Expired','Refund'] },
        { id: 'statusFilter', label: 'Status', options: ['Semua','Success','Pending','Failed','Expired'] }
      ],
      hasDateFilter: true, chips: ['Semua', 'Topup', 'Purchase', 'Cashback', 'Expired', 'Refund'],
      columns: [
        { key: 'trxCode', label: 'Kode' }, { key: 'customer', label: 'Customer' }, { key: 'type', label: 'Tipe', type: 'badge' },
        { key: 'amount', label: 'Jumlah', type: 'points' }, { key: 'status', label: 'Status', type: 'badge' }, { key: 'date', label: 'Tanggal' }
      ],
      rows: [
        { trxCode: 'PT-2026-0815-001', customer: 'Budi Santoso', type: 'Topup', amount: 250000, status: 'Success', date: '15 Agu 2026' },
        { trxCode: 'PT-2026-0815-002', customer: 'Siti Rahayu', type: 'Purchase', amount: -118500, status: 'Success', date: '15 Agu 2026' },
        { trxCode: 'PT-2026-0815-003', customer: 'Andi Wijaya', type: 'Cashback', amount: 12500, status: 'Success', date: '15 Agu 2026' },
        { trxCode: 'PT-2026-0814-018', customer: 'Dewi Lestari', type: 'Expired', amount: -45000, status: 'Success', date: '14 Agu 2026' },
        { trxCode: 'PT-2026-0814-019', customer: 'Rudi Hartono', type: 'Redeem', amount: -50000, status: 'Failed', date: '14 Agu 2026' },
        { trxCode: 'PT-2026-0814-020', customer: 'Maya Anggraini', type: 'Bonus', amount: 10000, status: 'Success', date: '14 Agu 2026' }
      ],
      modalFields: [
        { key: 'trxCode', label: 'Kode Transaksi', type: 'text' },
        { key: 'customer', label: 'Customer', type: 'text' },
        { key: 'type', label: 'Tipe', type: 'select', options: ['Topup','Purchase','Redeem','Cashback','Bonus','Expired','Refund'] },
        { key: 'amount', label: 'Jumlah (poin)', type: 'number' },
        { key: 'status', label: 'Status', type: 'select', options: ['Success','Pending','Failed','Expired'] },
        { key: 'date', label: 'Tanggal', type: 'text' }
      ]
    },
    'point-expiry-rules': {
      title: 'Aturan Kadaluarsa Poin', desc: 'Konfigurasi masa berlaku poin', icon: 'fa-solid fa-clock', hasCrud: true,
      cards: [
        { label: 'Total Aturan', value: '3', sub: 'aktif 2', icon: 'fa-solid fa-clock', color: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
        { label: 'Default Aktif', value: '365 hari', sub: 'masa berlaku poin', icon: 'fa-solid fa-calendar-check', color: 'linear-gradient(135deg,#00AA5B,#34d399)' },
        { label: 'Grace Period', value: '7 hari', sub: 'notifikasi awal', icon: 'fa-solid fa-bell', color: 'linear-gradient(135deg,#f59e0b,#fbbf24)' },
        { label: 'Poin Akan Expired', value: 'Rp 42 jt', sub: '30 hari ke depan', icon: 'fa-solid fa-triangle-exclamation', color: 'linear-gradient(135deg,#ef4444,#f87171)' }
      ],
      filters: [{ id: 'statusFilter', label: 'Status', options: ['Semua','Aktif','Nonaktif'] }],
      hasDateFilter: false, chips: ['Semua', 'Aktif', 'Nonaktif'],
      columns: [
        { key: 'name', label: 'Nama Aturan' }, { key: 'validity', label: 'Masa Berlaku', type: 'number' },
        { key: 'grace', label: 'Grace Period' }, { key: 'status', label: 'Status', type: 'badge' }
      ],
      rows: [
        { name: 'Poin Top-up', validity: 365, grace: '7 Hari', status: 'Aktif' },
        { name: 'Poin Cashback', validity: 180, grace: '14 Hari', status: 'Aktif' },
        { name: 'Poin Bonus', validity: 90, grace: 'Tidak Ada', status: 'Nonaktif' }
      ],
      modalFields: [
        { key: 'name', label: 'Nama Aturan', type: 'text' },
        { key: 'validity', label: 'Masa Berlaku (hari)', type: 'number' },
        { key: 'grace', label: 'Grace Period', type: 'select', options: ['Tidak Ada','7 Hari','14 Hari','30 Hari'] },
        { key: 'status', label: 'Status', type: 'select', options: ['Aktif','Nonaktif'] }
      ]
    },
    payments: {
      title: 'Transaksi Payment', desc: 'Semua pembayaran (poin, gateway, tunai)', icon: 'fa-solid fa-receipt', hasCrud: true,
      cards: [
        { label: 'Total Payment', value: '8.942', sub: 'bulan ini', icon: 'fa-solid fa-receipt', color: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
        { label: 'Sukses', value: '8.560', sub: '95,7%', icon: 'fa-solid fa-circle-check', color: 'linear-gradient(135deg,#00AA5B,#34d399)' },
        { label: 'Pending', value: '214', sub: 'perlu cek', icon: 'fa-solid fa-clock', color: 'linear-gradient(135deg,#f59e0b,#fbbf24)' },
        { label: 'Gagal', value: '168', sub: '4,3%', icon: 'fa-solid fa-circle-xmark', color: 'linear-gradient(135deg,#ef4444,#f87171)' }
      ],
      filters: [
        { id: 'methodFilter', label: 'Metode', options: ['Semua','Poin','Tunai','QRIS','E-Wallet','VA','Transfer'] },
        { id: 'statusFilter', label: 'Status', options: ['Semua','Success','Pending','Failed','Cancelled','Expired'] },
        { id: 'typeFilter', label: 'Tipe', options: ['Semua','Topup','Order','Subscription','Reward'] }
      ],
      hasDateFilter: true, chips: ['Semua', 'Sukses', 'Pending', 'Gagal'],
      columns: [
        { key: 'code', label: 'Kode' }, { key: 'customer', label: 'Customer' }, { key: 'method', label: 'Metode' },
        { key: 'type', label: 'Tipe', type: 'badge' }, { key: 'amount', label: 'Nominal', type: 'currency' },
        { key: 'status', label: 'Status', type: 'badge' }, { key: 'date', label: 'Tanggal' }
      ],
      rows: [
        { code: 'PAY-2026-0815-001', customer: 'Budi Santoso', method: 'QRIS', type: 'Topup', amount: 250000, status: 'Success', date: '15 Agu 2026' },
        { code: 'PAY-2026-0815-002', customer: 'Siti Rahayu', method: 'Poin', type: 'Order', amount: 118500, status: 'Success', date: '15 Agu 2026' },
        { code: 'PAY-2026-0815-003', customer: 'Andi Wijaya', method: 'VA', type: 'Order', amount: 467000, status: 'Pending', date: '15 Agu 2026' },
        { code: 'PAY-2026-0814-018', customer: 'Dewi Lestari', method: 'E-Wallet', type: 'Subscription', amount: 114000, status: 'Success', date: '14 Agu 2026' },
        { code: 'PAY-2026-0814-019', customer: 'Rudi Hartono', method: 'Transfer', type: 'Topup', amount: 100000, status: 'Failed', date: '14 Agu 2026' },
        { code: 'PAY-2026-0814-020', customer: 'Maya Anggraini', method: 'Poin', type: 'Reward', amount: 55000, status: 'Success', date: '14 Agu 2026' }
      ],
      modalFields: [
        { key: 'code', label: 'Kode Payment', type: 'text' },
        { key: 'customer', label: 'Customer', type: 'text' },
        { key: 'method', label: 'Metode', type: 'select', options: ['Poin','Tunai','QRIS','E-Wallet','VA','Transfer'] },
        { key: 'type', label: 'Tipe', type: 'select', options: ['Topup','Order','Subscription','Reward'] },
        { key: 'amount', label: 'Nominal (Rp)', type: 'number' },
        { key: 'status', label: 'Status', type: 'select', options: ['Success','Pending','Failed','Cancelled','Expired'] },
        { key: 'date', label: 'Tanggal', type: 'text' }
      ]
    },
    'payment-refunds': {
      title: 'Payment Refund', desc: 'Riwayat refund pembayaran', icon: 'fa-solid fa-rotate-left', hasCrud: true,
      cards: [
        { label: 'Total Refund', value: '48', sub: 'bulan ini', icon: 'fa-solid fa-rotate-left', color: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
        { label: 'Diproses', value: '36', sub: '75% selesai', icon: 'fa-solid fa-circle-check', color: 'linear-gradient(135deg,#00AA5B,#34d399)' },
        { label: 'Menunggu', value: '8', sub: 'perlu approval', icon: 'fa-solid fa-clock', color: 'linear-gradient(135deg,#f59e0b,#fbbf24)' },
        { label: 'Total Nilai', value: 'Rp 18,6 jt', sub: 'bulan ini', icon: 'fa-solid fa-money-bill-wave', color: 'linear-gradient(135deg,#8b5cf6,#a78bfa)' }
      ],
      filters: [
        { id: 'statusFilter', label: 'Status', options: ['Semua','Requested','Approved','Processed','Rejected'] },
        { id: 'reasonFilter', label: 'Alasan', options: ['Semua','Cancelled','Damaged','Wrong Item','Customer Request'] }
      ],
      hasDateFilter: true, chips: ['Semua', 'Requested', 'Approved', 'Processed', 'Rejected'],
      columns: [
        { key: 'code', label: 'Kode' }, { key: 'payment', label: 'Payment' }, { key: 'amount', label: 'Nominal', type: 'currency' },
        { key: 'reason', label: 'Alasan', type: 'badge' }, { key: 'status', label: 'Status', type: 'badge' }, { key: 'date', label: 'Tanggal' }
      ],
      rows: [
        { code: 'RF-2026-0815-01', payment: 'PAY-2026-0814-019', amount: 100000, reason: 'Cancelled', status: 'Processed', date: '15 Agu 2026' },
        { code: 'RF-2026-0815-02', payment: 'PAY-2026-0814-015', amount: 45000, reason: 'Damaged', status: 'Approved', date: '15 Agu 2026' },
        { code: 'RF-2026-0814-01', payment: 'PAY-2026-0813-022', amount: 285000, reason: 'Wrong Item', status: 'Requested', date: '14 Agu 2026' },
        { code: 'RF-2026-0814-02', payment: 'PAY-2026-0813-018', amount: 24500, reason: 'Customer Request', status: 'Processed', date: '14 Agu 2026' },
        { code: 'RF-2026-0813-01', payment: 'PAY-2026-0812-030', amount: 78000, reason: 'Cancelled', status: 'Rejected', date: '13 Agu 2026' }
      ],
      modalFields: [
        { key: 'payment', label: 'Kode Payment', type: 'text' },
        { key: 'amount', label: 'Nominal (Rp)', type: 'number' },
        { key: 'reason', label: 'Alasan', type: 'select', options: ['Cancelled','Damaged','Wrong Item','Customer Request','Other'] },
        { key: 'status', label: 'Status', type: 'select', options: ['Requested','Approved','Processed','Rejected'] }
      ]
    },
    'payment-installments': {
      title: 'Payment Installment', desc: 'Kelola cicilan pembayaran', icon: 'fa-solid fa-calendar-check', hasCrud: true,
      cards: [
        { label: 'Total Cicilan Aktif', value: '126', sub: 'semua customer', icon: 'fa-solid fa-calendar-check', color: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
        { label: 'Lancar', value: '98', sub: '77,8%', icon: 'fa-solid fa-circle-check', color: 'linear-gradient(135deg,#00AA5B,#34d399)' },
        { label: 'Tunggakan', value: '18', sub: 'perlu follow-up', icon: 'fa-solid fa-triangle-exclamation', color: 'linear-gradient(135deg,#f59e0b,#fbbf24)' },
        { label: 'Total Piutang', value: 'Rp 142 jt', sub: 'sisa cicilan', icon: 'fa-solid fa-money-bill-wave', color: 'linear-gradient(135deg,#8b5cf6,#a78bfa)' }
      ],
      filters: [
        { id: 'statusFilter', label: 'Status', options: ['Semua','Pending','Paid','Overdue','Cancelled'] }
      ],
      hasDateFilter: true, chips: ['Semua', 'Lancar', 'Tunggakan', 'Lunas'],
      columns: [
        { key: 'code', label: 'Kode' }, { key: 'customer', label: 'Customer' }, { key: 'total', label: 'Total', type: 'currency' },
        { key: 'progress', label: 'Cicilan', type: 'progress' }, { key: 'due', label: 'Jatuh Tempo' }, { key: 'status', label: 'Status', type: 'badge' }
      ],
      rows: [
        { code: 'INST-001', customer: 'Andi Wijaya', total: 467000, progress: 50, due: '20 Agu 2026', status: 'Lancar' },
        { code: 'INST-002', customer: 'Budi Santoso', total: 245000, progress: 67, due: '18 Agu 2026', status: 'Lancar' },
        { code: 'INST-003', customer: 'Dewi Lestari', total: 890000, progress: 33, due: '10 Agu 2026', status: 'Tunggakan' },
        { code: 'INST-004', customer: 'Rudi Hartono', total: 324000, progress: 100, due: '01 Agu 2026', status: 'Lunas' },
        { code: 'INST-005', customer: 'Maya Anggraini', total: 156000, progress: 25, due: '25 Agu 2026', status: 'Lancar' }
      ],
      modalFields: [
        { key: 'customer', label: 'Customer', type: 'text' },
        { key: 'total', label: 'Total (Rp)', type: 'number' },
        { key: 'progress', label: 'Progres (%)', type: 'number' },
        { key: 'due', label: 'Jatuh Tempo', type: 'date' },
        { key: 'status', label: 'Status', type: 'select', options: ['Lancar','Tunggakan','Lunas','Batal'] }
      ]
    },
    'payment-reconciliation': {
      title: 'Payment Reconciliation', desc: 'Rekonsiliasi bank/gateway vs sistem', icon: 'fa-solid fa-scale-balanced', hasCrud: true,
      cards: [
        { label: 'Periode Aktif', value: 'Agu 2026', sub: 'bulan berjalan', icon: 'fa-solid fa-calendar', color: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
        { label: 'Match', value: 'Rp 612 jt', sub: '98,2% cocok', icon: 'fa-solid fa-circle-check', color: 'linear-gradient(135deg,#00AA5B,#34d399)' },
        { label: 'Unmatched', value: 'Rp 11,2 jt', sub: 'perlu investigasi', icon: 'fa-solid fa-triangle-exclamation', color: 'linear-gradient(135deg,#ef4444,#f87171)' },
        { label: 'Selisih', value: 'Rp 3,4 jt', sub: 'total perbedaan', icon: 'fa-solid fa-scale-balanced', color: 'linear-gradient(135deg,#f59e0b,#fbbf24)' }
      ],
      filters: [
        { id: 'statusFilter', label: 'Status', options: ['Semua','Matched','Unmatched','In Progress'] },
        { id: 'methodFilter', label: 'Metode', options: ['Semua','QRIS','E-Wallet','VA','Transfer'] }
      ],
      hasDateFilter: true, chips: ['Semua', 'Matched', 'Unmatched', 'In Progress'],
      columns: [
        { key: 'date', label: 'Tanggal' }, { key: 'method', label: 'Metode' }, { key: 'system', label: 'Sistem', type: 'currency' },
        { key: 'bank', label: 'Bank/Gateway', type: 'currency' }, { key: 'diff', label: 'Selisih', type: 'currency' },
        { key: 'status', label: 'Status', type: 'badge' }
      ],
      rows: [
        { date: '15 Agu 2026', method: 'QRIS', system: 12500000, bank: 12500000, diff: 0, status: 'Matched' },
        { date: '15 Agu 2026', method: 'E-Wallet', system: 8420000, bank: 8380000, diff: -40000, status: 'Unmatched' },
        { date: '14 Agu 2026', method: 'VA', system: 4800000, bank: 4800000, diff: 0, status: 'Matched' },
        { date: '14 Agu 2026', method: 'Transfer', system: 2900000, bank: 2920000, diff: 20000, status: 'In Progress' },
        { date: '13 Agu 2026', method: 'QRIS', system: 11200000, bank: 11200000, diff: 0, status: 'Matched' }
      ],
      modalFields: [
        { key: 'date', label: 'Tanggal', type: 'date' },
        { key: 'method', label: 'Metode', type: 'select', options: ['QRIS','E-Wallet','VA','Transfer'] },
        { key: 'system', label: 'Jumlah Sistem', type: 'number' },
        { key: 'bank', label: 'Jumlah Bank', type: 'number' },
        { key: 'status', label: 'Status', type: 'select', options: ['Matched','Unmatched','In Progress'] }
      ]
    },
    'payment-webhooks': {
      title: 'Payment Webhook Log', desc: 'Log callback dari payment gateway', icon: 'fa-solid fa-webhook', hasCrud: false,
      cards: [
        { label: 'Total Webhook', value: '2.480', sub: '30 hari', icon: 'fa-solid fa-webhook', color: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
        { label: 'Diproses', value: '2.448', sub: '98,7%', icon: 'fa-solid fa-circle-check', color: 'linear-gradient(135deg,#00AA5B,#34d399)' },
        { label: 'Gagal', value: '32', sub: 'perlu retry', icon: 'fa-solid fa-circle-xmark', color: 'linear-gradient(135deg,#ef4444,#f87171)' },
        { label: 'Event Terbanyak', value: 'payment.paid', sub: '1.842 events', icon: 'fa-solid fa-bolt', color: 'linear-gradient(135deg,#f59e0b,#fbbf24)' }
      ],
      filters: [
        { id: 'statusFilter', label: 'Status', options: ['Semua','Received','Processed','Failed'] },
        { id: 'eventFilter', label: 'Event', options: ['Semua','payment.paid','payment.pending','payment.failed','payment.expired'] }
      ],
      hasDateFilter: true, chips: ['Semua', 'Received', 'Processed', 'Failed'],
      columns: [
        { key: 'id', label: 'ID' }, { key: 'event', label: 'Event', type: 'badge' }, { key: 'payment', label: 'Payment' },
        { key: 'status', label: 'Status', type: 'badge' }, { key: 'received', label: 'Diterima' }, { key: 'processed', label: 'Diproses' }
      ],
      rows: [
        { id: 'WH-2481', event: 'payment.paid', payment: 'PAY-2026-0815-001', status: 'Processed', received: '15 Agu 09:12', processed: '15 Agu 09:12' },
        { id: 'WH-2482', event: 'payment.pending', payment: 'PAY-2026-0815-003', status: 'Received', received: '15 Agu 09:30', processed: '-' },
        { id: 'WH-2483', event: 'payment.paid', payment: 'PAY-2026-0815-004', status: 'Processed', received: '15 Agu 10:05', processed: '15 Agu 10:05' },
        { id: 'WH-2484', event: 'payment.failed', payment: 'PAY-2026-0814-019', status: 'Failed', received: '14 Agu 22:40', processed: '14 Agu 22:40' },
        { id: 'WH-2485', event: 'payment.expired', payment: 'PAY-2026-0814-021', status: 'Processed', received: '14 Agu 23:55', processed: '14 Agu 23:55' }
      ]
    },
    'subscription-plans': {
      title: 'Paket Langganan', desc: 'Kelola paket subscription', icon: 'fa-solid fa-box-open', hasCrud: true,
      cards: [
        { label: 'Total Paket', value: '4', sub: 'aktif semua', icon: 'fa-solid fa-box-open', color: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
        { label: 'Aktif', value: '4', sub: 'bisa dipilih', icon: 'fa-solid fa-circle-check', color: 'linear-gradient(135deg,#00AA5B,#34d399)' },
        { label: 'Pelanggan Aktif', value: '2.184', sub: 'semua paket', icon: 'fa-solid fa-users', color: 'linear-gradient(135deg,#8b5cf6,#a78bfa)' },
        { label: 'Revenue Bulanan', value: 'Rp 248 jt', sub: 'bulan ini', icon: 'fa-solid fa-sack-dollar', color: 'linear-gradient(135deg,#f59e0b,#fbbf24)' }
      ],
      filters: [
        { id: 'statusFilter', label: 'Status', options: ['Semua','Aktif','Nonaktif'] },
        { id: 'periodFilter', label: 'Periode', options: ['Semua','Monthly','Weekly'] }
      ],
      hasDateFilter: false, chips: ['Semua', 'Aktif', 'Nonaktif'],
      columns: [
        { key: 'name', label: 'Paket' }, { key: 'price', label: 'Harga', type: 'currency' },
        { key: 'bonus', label: 'Bonus Poin', type: 'points' }, { key: 'period', label: 'Periode', type: 'badge' },
        { key: 'freeShip', label: 'Ongkir Gratis' }, { key: 'status', label: 'Status', type: 'badge' }
      ],
      rows: [
        { name: 'Sembako Hemat', price: 114000, bonus: 5000, period: 'Monthly', freeShip: 'Ya', status: 'Aktif' },
        { name: 'Sembako Family', price: 225000, bonus: 10000, period: 'Monthly', freeShip: 'Ya', status: 'Aktif' },
        { name: 'Sembako Mini', price: 62000, bonus: 2500, period: 'Weekly', freeShip: 'Ya', status: 'Aktif' },
        { name: 'Paket Premium', price: 450000, bonus: 20000, period: 'Monthly', freeShip: 'Ya', status: 'Aktif' }
      ],
      modalFields: [
        { key: 'name', label: 'Nama Paket', type: 'text' },
        { key: 'price', label: 'Harga (Rp)', type: 'number' },
        { key: 'bonus', label: 'Bonus Poin', type: 'number' },
        { key: 'period', label: 'Periode', type: 'select', options: ['Monthly','Weekly'] },
        { key: 'freeShip', label: 'Ongkir Gratis', type: 'select', options: ['Ya','Tidak'] },
        { key: 'status', label: 'Status', type: 'select', options: ['Aktif','Nonaktif'] }
      ]
    },
    'subscription-plan-items': {
      title: 'Isi Paket Langganan', desc: 'Detail produk per paket subscription', icon: 'fa-solid fa-list-ul', hasCrud: true,
      cards: [
        { label: 'Total Item', value: '16', sub: 'di 4 paket', icon: 'fa-solid fa-list-ul', color: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
        { label: 'Paket Terbanyak', value: 'Sembako Family', sub: '5 produk', icon: 'fa-solid fa-box-open', color: 'linear-gradient(135deg,#00AA5B,#34d399)' },
        { label: 'Produk Populer', value: 'Beras 5kg', sub: 'di 4 paket', icon: 'fa-solid fa-bowl-rice', color: 'linear-gradient(135deg,#f59e0b,#fbbf24)' },
        { label: 'Total Qty / bulan', value: '8.420', sub: 'semua paket', icon: 'fa-solid fa-boxes-stacked', color: 'linear-gradient(135deg,#8b5cf6,#a78bfa)' }
      ],
      filters: [
        { id: 'planFilter', label: 'Paket', options: ['Semua Paket','Sembako Hemat','Sembako Family','Sembako Mini','Paket Premium'] }
      ],
      hasDateFilter: false, chips: ['Semua', 'Sembako Hemat', 'Sembako Family', 'Sembako Mini', 'Paket Premium'],
      columns: [
        { key: 'plan', label: 'Paket' }, { key: 'product', label: 'Produk' }, { key: 'qty', label: 'Qty', type: 'number' }
      ],
      rows: [
        { plan: 'Sembako Hemat', product: 'Beras Premium 5kg', qty: 1 },
        { plan: 'Sembako Hemat', product: 'Minyak Goreng 2L', qty: 2 },
        { plan: 'Sembako Hemat', product: 'Gula Pasir 1kg', qty: 1 },
        { plan: 'Sembako Hemat', product: 'Telur 1kg', qty: 1 },
        { plan: 'Sembako Family', product: 'Beras Premium 5kg', qty: 2 },
        { plan: 'Sembako Family', product: 'Minyak Goreng 2L', qty: 3 },
        { plan: 'Sembako Family', product: 'Gula Pasir 1kg', qty: 2 },
        { plan: 'Sembako Family', product: 'Telur 1kg', qty: 2 },
        { plan: 'Sembako Family', product: 'Kopi Sachet (10)', qty: 2 },
        { plan: 'Sembako Mini', product: 'Beras Premium 2kg', qty: 1 },
        { plan: 'Sembako Mini', product: 'Minyak Goreng 1L', qty: 1 },
        { plan: 'Paket Premium', product: 'Beras Premium 5kg', qty: 3 },
        { plan: 'Paket Premium', product: 'Minyak Goreng 2L', qty: 4 },
        { plan: 'Paket Premium', product: 'Gula Pasir 1kg', qty: 3 },
        { plan: 'Paket Premium', product: 'Telur 1kg', qty: 3 },
        { plan: 'Paket Premium', product: 'Susu UHT 1L', qty: 4 }
      ],
      modalFields: [
        { key: 'plan', label: 'Paket', type: 'select', options: ['Sembako Hemat','Sembako Family','Sembako Mini','Paket Premium'] },
        { key: 'product', label: 'Produk', type: 'text' },
        { key: 'qty', label: 'Qty', type: 'number' }
      ]
    },
    'subscription-management': {
      title: 'Kelola Langganan', desc: 'Semua langganan customer', icon: 'fa-solid fa-users-gear', hasCrud: true,
      cards: [
        { label: 'Total Langganan', value: '2.184', sub: 'aktif', icon: 'fa-solid fa-users-gear', color: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
        { label: 'Aktif', value: '2.184', sub: '84% dari total', icon: 'fa-solid fa-circle-check', color: 'linear-gradient(135deg,#00AA5B,#34d399)' },
        { label: 'Paused', value: '284', sub: 'jeda sementara', icon: 'fa-solid fa-pause', color: 'linear-gradient(135deg,#f59e0b,#fbbf24)' },
        { label: 'Gagal Bayar', value: '126', sub: 'perlu follow-up', icon: 'fa-solid fa-triangle-exclamation', color: 'linear-gradient(135deg,#ef4444,#f87171)' }
      ],
      filters: [
        { id: 'planFilter', label: 'Paket', options: ['Semua Paket','Sembako Hemat','Sembako Family','Sembako Mini','Paket Premium'] },
        { id: 'statusFilter', label: 'Status', options: ['Semua','Aktif','Paused','Gagal','Expired'] },
        { id: 'hubFilter', label: 'Hub', options: ['Semua Hub','Jakarta Selatan','Bandung','Surabaya','Medan','Makassar'] }
      ],
      hasDateFilter: true, chips: ['Semua', 'Aktif', 'Paused', 'Gagal', 'Expired'],
      columns: [
        { key: 'code', label: 'Kode' }, { key: 'customer', label: 'Customer' }, { key: 'plan', label: 'Paket' },
        { key: 'hub', label: 'Hub' }, { key: 'nextDelivery', label: 'Kirim Berikutnya' }, { key: 'status', label: 'Status', type: 'badge' }
      ],
      rows: [
        { code: 'SUB-2026-0001', customer: 'Budi Santoso', plan: 'Sembako Hemat', hub: 'Jakarta Selatan', nextDelivery: '01 Sep 2026', status: 'Aktif' },
        { code: 'SUB-2026-0002', customer: 'Siti Rahayu', plan: 'Sembako Family', hub: 'Bandung', nextDelivery: '28 Agu 2026', status: 'Aktif' },
        { code: 'SUB-2026-0003', customer: 'Andi Wijaya', plan: 'Paket Premium', hub: 'Surabaya', nextDelivery: '30 Agu 2026', status: 'Paused' },
        { code: 'SUB-2026-0004', customer: 'Dewi Lestari', plan: 'Sembako Mini', hub: 'Jakarta Selatan', nextDelivery: '-', status: 'Gagal' },
        { code: 'SUB-2026-0005', customer: 'Rudi Hartono', plan: 'Sembako Hemat', hub: 'Medan', nextDelivery: '02 Sep 2026', status: 'Aktif' }
      ],
      modalFields: [
        { key: 'code', label: 'Kode Langganan', type: 'text' },
        { key: 'customer', label: 'Customer', type: 'text' },
        { key: 'plan', label: 'Paket', type: 'select', options: ['Sembako Hemat','Sembako Family','Sembako Mini','Paket Premium'] },
        { key: 'hub', label: 'Hub', type: 'select', options: ['Jakarta Selatan','Bandung','Surabaya','Medan','Makassar'] },
        { key: 'nextDelivery', label: 'Kirim Berikutnya', type: 'date' },
        { key: 'status', label: 'Status', type: 'select', options: ['Aktif','Paused','Gagal','Expired'] }
      ]
    },
    'subscription-failures': {
      title: 'Subscription Gagal Bayar', desc: 'Log gagal bayar subscription', icon: 'fa-solid fa-triangle-exclamation', hasCrud: false,
      cards: [
        { label: 'Total Gagal', value: '126', sub: 'bulan ini', icon: 'fa-solid fa-triangle-exclamation', color: 'linear-gradient(135deg,#ef4444,#f87171)' },
        { label: 'Saldo Kurang', value: '84', sub: '66,7%', icon: 'fa-solid fa-coins', color: 'linear-gradient(135deg,#f59e0b,#fbbf24)' },
        { label: 'Gateway Error', value: '28', sub: '22,2%', icon: 'fa-solid fa-plug-circle-xmark', color: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
        { label: 'Poin Tidak Aktif', value: '14', sub: '11,1%', icon: 'fa-solid fa-user-xmark', color: 'linear-gradient(135deg,#8b5cf6,#a78bfa)' }
      ],
      filters: [
        { id: 'reasonFilter', label: 'Alasan', options: ['Semua','Insufficient Points','Payment Failed','Gateway Error','Other'] }
      ],
      hasDateFilter: true, chips: ['Semua', 'Saldo Kurang', 'Gateway Error', 'Lainnya'],
      columns: [
        { key: 'subscription', label: 'Langganan' }, { key: 'customer', label: 'Customer' }, { key: 'reason', label: 'Alasan', type: 'badge' },
        { key: 'failedAt', label: 'Waktu Gagal' }, { key: 'status', label: 'Status', type: 'badge' }
      ],
      rows: [
        { subscription: 'SUB-2026-0004', customer: 'Dewi Lestari', reason: 'Insufficient Points', failedAt: '15 Agu 08:00', status: 'Aktif' },
        { subscription: 'SUB-2026-0008', customer: 'Tono Wibowo', reason: 'Gateway Error', failedAt: '15 Agu 09:15', status: 'Aktif' },
        { subscription: 'SUB-2026-0012', customer: 'Sari Dewi', reason: 'Payment Failed', failedAt: '14 Agu 20:30', status: 'Aktif' },
        { subscription: 'SUB-2026-0016', customer: 'Joko Susilo', reason: 'Other', failedAt: '14 Agu 21:00', status: 'Aktif' },
        { subscription: 'SUB-2026-0020', customer: 'Lina Marlina', reason: 'Insufficient Points', failedAt: '13 Agu 08:00', status: 'Resolved' }
      ]
    },
    'billing-attempts': {
      title: 'Percobaan Tagihan', desc: 'Riwayat percobaan tagihan subscription', icon: 'fa-solid fa-repeat', hasCrud: false,
      cards: [
        { label: 'Total Percobaan', value: '680', sub: 'bulan ini', icon: 'fa-solid fa-repeat', color: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
        { label: 'Sukses', value: '554', sub: '81,5%', icon: 'fa-solid fa-circle-check', color: 'linear-gradient(135deg,#00AA5B,#34d399)' },
        { label: 'Gagal', value: '126', sub: '18,5%', icon: 'fa-solid fa-circle-xmark', color: 'linear-gradient(135deg,#ef4444,#f87171)' },
        { label: 'Rata-rata Percobaan', value: '2,3x', sub: 'sebelum berhasil', icon: 'fa-solid fa-gauge-high', color: 'linear-gradient(135deg,#8b5cf6,#a78bfa)' }
      ],
      filters: [
        { id: 'statusFilter', label: 'Status', options: ['Semua','Success','Failed'] }
      ],
      hasDateFilter: true, chips: ['Semua', 'Sukses', 'Gagal'],
      columns: [
        { key: 'subscription', label: 'Langganan' }, { key: 'attempt', label: 'Percobaan', type: 'number' },
        { key: 'status', label: 'Status', type: 'badge' }, { key: 'time', label: 'Waktu' }, { key: 'note', label: 'Catatan' }
      ],
      rows: [
        { subscription: 'SUB-2026-0004', attempt: 1, status: 'Failed', time: '15 Agu 08:00', note: 'Saldo tidak cukup' },
        { subscription: 'SUB-2026-0004', attempt: 2, status: 'Failed', time: '15 Agu 08:15', note: 'Saldo tidak cukup' },
        { subscription: 'SUB-2026-0004', attempt: 3, status: 'Failed', time: '15 Agu 08:30', note: 'Saldo tidak cukup' },
        { subscription: 'SUB-2026-0001', attempt: 1, status: 'Success', time: '15 Agu 09:00', note: 'Auto-charge berhasil' },
        { subscription: 'SUB-2026-0002', attempt: 1, status: 'Success', time: '15 Agu 09:05', note: 'Auto-charge berhasil' }
      ]
    },
    warehouses: {
      title: 'Gudang (Warehouse)', desc: 'Kelola warehouse internal & eksternal', icon: 'fa-solid fa-building', hasCrud: true,
      cards: [
        { label: 'Total Gudang', value: '4', sub: '2 internal + 2 eksternal', icon: 'fa-solid fa-building', color: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
        { label: 'Internal', value: '2', sub: 'WH Pusat 1 & 2', icon: 'fa-solid fa-warehouse', color: 'linear-gradient(135deg,#00AA5B,#34d399)' },
        { label: 'Eksternal', value: '2', sub: 'Mitra A & B', icon: 'fa-solid fa-boxes-stacked', color: 'linear-gradient(135deg,#8b5cf6,#a78bfa)' },
        { label: 'Total Lokasi', value: '48', sub: 'bin aktif', icon: 'fa-solid fa-location-dot', color: 'linear-gradient(135deg,#f59e0b,#fbbf24)' }
      ],
      filters: [
        { id: 'typeFilter', label: 'Tipe', options: ['Semua','Internal','Eksternal'] },
        { id: 'cityFilter', label: 'Kota', options: ['Semua Kota','Jakarta','Tangerang','Bekasi','Surabaya'] }
      ],
      hasDateFilter: false, chips: ['Semua', 'Internal', 'Eksternal'],
      columns: [
        { key: 'name', label: 'Nama Gudang' }, { key: 'type', label: 'Tipe', type: 'badge' }, { key: 'address', label: 'Alamat' },
        { key: 'city', label: 'Kota' }, { key: 'locations', label: 'Lokasi', type: 'number' }
      ],
      rows: [
        { name: 'WH Pusat 1', type: 'Internal', address: 'Jl. Raya Cikarang No. 1', city: 'Bekasi', locations: 18 },
        { name: 'WH Pusat 2', type: 'Internal', address: 'Jl. Industri No. 12', city: 'Tangerang', locations: 14 },
        { name: 'WH Mitra A', type: 'Eksternal', address: 'Jl. Rungkut No. 5', city: 'Surabaya', locations: 9 },
        { name: 'WH Mitra B', type: 'Eksternal', address: 'Jl. Pulo Gadung No. 3', city: 'Jakarta', locations: 7 }
      ],
      modalFields: [
        { key: 'name', label: 'Nama Gudang', type: 'text' },
        { key: 'type', label: 'Tipe', type: 'select', options: ['Internal','Eksternal'] },
        { key: 'address', label: 'Alamat', type: 'text', full: true },
        { key: 'city', label: 'Kota', type: 'text' },
        { key: 'locations', label: 'Jumlah Lokasi', type: 'number' }
      ]
    },
    'warehouse-locations': {
      title: 'Lokasi / Bin', desc: 'Manajemen Zona → Lorong → Rak → Level → Bin', icon: 'fa-solid fa-location-dot', hasCrud: true,
      cards: [
        { label: 'Total Lokasi', value: '48', sub: 'semua bin', icon: 'fa-solid fa-location-dot', color: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
        { label: 'Storage', value: '36', sub: 'bin penyimpanan', icon: 'fa-solid fa-boxes-stacked', color: 'linear-gradient(135deg,#00AA5B,#34d399)' },
        { label: 'Picking', value: '8', sub: 'bin pengambilan', icon: 'fa-solid fa-list-check', color: 'linear-gradient(135deg,#8b5cf6,#a78bfa)' },
        { label: 'Damaged', value: '4', sub: 'bin rusak/quarantine', icon: 'fa-solid fa-triangle-exclamation', color: 'linear-gradient(135deg,#ef4444,#f87171)' }
      ],
      filters: [
        { id: 'whFilter', label: 'Gudang', options: ['Semua','WH Pusat 1','WH Pusat 2','WH Mitra A','WH Mitra B'] },
        { id: 'typeFilter', label: 'Tipe', options: ['Semua','Storage','Picking','Damaged','Quarantine'] }
      ],
      hasDateFilter: false, chips: ['Semua', 'Storage', 'Picking', 'Damaged', 'Quarantine'],
      columns: [
        { key: 'code', label: 'Kode Lokasi' }, { key: 'wh', label: 'Gudang' }, { key: 'zone', label: 'Zona' },
        { key: 'aisle', label: 'Lorong' }, { key: 'rack', label: 'Rak' }, { key: 'level', label: 'Level' },
        { key: 'bin', label: 'Bin' }, { key: 'type', label: 'Tipe', type: 'badge' }
      ],
      rows: [
        { code: 'A-1-A1-2-05', wh: 'WH Pusat 1', zone: 'Zona A', aisle: 'Lorong 1', rack: 'Rak A1', level: 'Level 2', bin: 'Bin 05', type: 'Storage' },
        { code: 'A-2-A2-1-01', wh: 'WH Pusat 1', zone: 'Zona A', aisle: 'Lorong 2', rack: 'Rak A2', level: 'Level 1', bin: 'Bin 01', type: 'Picking' },
        { code: 'B-1-B1-3-10', wh: 'WH Pusat 2', zone: 'Zona B', aisle: 'Lorong 1', rack: 'Rak B1', level: 'Level 3', bin: 'Bin 10', type: 'Storage' },
        { code: 'C-1-C1-1-02', wh: 'WH Mitra A', zone: 'Zona C', aisle: 'Lorong 1', rack: 'Rak C1', level: 'Level 1', bin: 'Bin 02', type: 'Damaged' },
        { code: 'D-2-D2-2-04', wh: 'WH Mitra B', zone: 'Zona D', aisle: 'Lorong 2', rack: 'Rak D2', level: 'Level 2', bin: 'Bin 04', type: 'Quarantine' }
      ],
      modalFields: [
        { key: 'code', label: 'Kode Lokasi', type: 'text' },
        { key: 'wh', label: 'Gudang', type: 'select', options: ['WH Pusat 1','WH Pusat 2','WH Mitra A','WH Mitra B'] },
        { key: 'zone', label: 'Zona', type: 'text' },
        { key: 'aisle', label: 'Lorong', type: 'text' },
        { key: 'rack', label: 'Rak', type: 'text' },
        { key: 'level', label: 'Level', type: 'text' },
        { key: 'bin', label: 'Bin', type: 'text' },
        { key: 'type', label: 'Tipe', type: 'select', options: ['Storage','Picking','Damaged','Quarantine'] }
      ]
    },
    'stock-bins': {
      title: 'Stok per Bin', desc: 'Stok produk pada setiap lokasi bin', icon: 'fa-solid fa-cubes', hasCrud: true,
      cards: [
        { label: 'Total Bin Berisi', value: '36', sub: 'dari 48 lokasi', icon: 'fa-solid fa-cubes', color: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
        { label: 'Total Unit', value: '24.560', sub: 'semua bin', icon: 'fa-solid fa-box', color: 'linear-gradient(135deg,#00AA5B,#34d399)' },
        { label: 'Reserved', value: '4.210', sub: 'ter-lock order', icon: 'fa-solid fa-lock', color: 'linear-gradient(135deg,#f59e0b,#fbbf24)' },
        { label: 'Qty On Order', value: '3.800', sub: 'PO in transit', icon: 'fa-solid fa-truck', color: 'linear-gradient(135deg,#8b5cf6,#a78bfa)' }
      ],
      filters: [
        { id: 'whFilter', label: 'Gudang', options: ['Semua','WH Pusat 1','WH Pusat 2','WH Mitra A','WH Mitra B'] }
      ],
      hasDateFilter: false, chips: ['Semua', 'WH Pusat 1', 'WH Pusat 2', 'WH Mitra A', 'WH Mitra B'],
      columns: [
        { key: 'location', label: 'Lokasi' }, { key: 'product', label: 'Produk' }, { key: 'qty', label: 'Qty', type: 'number' },
        { key: 'reserved', label: 'Reserved', type: 'number' }, { key: 'onOrder', label: 'On Order', type: 'number' }
      ],
      rows: [
        { location: 'A-1-A1-2-05', product: 'Beras Premium 5kg', qty: 420, reserved: 50, onOrder: 100 },
        { location: 'A-1-A1-2-06', product: 'Minyak Goreng 2L', qty: 45, reserved: 12, onOrder: 80 },
        { location: 'A-2-A2-1-01', product: 'Gula Pasir 1kg', qty: 320, reserved: 40, onOrder: 0 },
        { location: 'B-1-B1-3-10', product: 'Rice Cooker 1.2L', qty: 8, reserved: 3, onOrder: 20 },
        { location: 'C-1-C1-1-02', product: 'Vitamin C 500mg', qty: 0, reserved: 0, onOrder: 12 }
      ],
      modalFields: [
        { key: 'location', label: 'Kode Lokasi', type: 'text' },
        { key: 'product', label: 'Produk', type: 'text' },
        { key: 'qty', label: 'Qty', type: 'number' },
        { key: 'reserved', label: 'Reserved', type: 'number' },
        { key: 'onOrder', label: 'On Order', type: 'number' }
      ]
    },
    'stock-movements': {
      title: 'Mutasi Stok', desc: 'Riwayat pergerakan stok (in/out/adjustment/transfer)', icon: 'fa-solid fa-arrows-spin', hasCrud: false,
      cards: [
        { label: 'Total Mutasi', value: '610', sub: '30 hari', icon: 'fa-solid fa-arrows-spin', color: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
        { label: 'Barang Masuk', value: '312', sub: '+24.560 unit', icon: 'fa-solid fa-arrow-down-to-line', color: 'linear-gradient(135deg,#00AA5B,#34d399)' },
        { label: 'Barang Keluar', value: '298', sub: '-21.830 unit', icon: 'fa-solid fa-arrow-up-from-line', color: 'linear-gradient(135deg,#f59e0b,#fbbf24)' },
        { label: 'Adjustment', value: '48', sub: 'selisih opname', icon: 'fa-solid fa-sliders', color: 'linear-gradient(135deg,#8b5cf6,#a78bfa)' }
      ],
      filters: [
        { id: 'typeFilter', label: 'Tipe', options: ['Semua','IN','OUT','Adjustment','Transfer','Damaged','Expired'] },
        { id: 'whFilter', label: 'Gudang', options: ['Semua','WH Pusat 1','WH Pusat 2','WH Mitra A','WH Mitra B'] }
      ],
      hasDateFilter: true, chips: ['Semua', 'IN', 'OUT', 'Adjustment', 'Transfer', 'Damaged'],
      columns: [
        { key: 'code', label: 'Kode' }, { key: 'product', label: 'Produk' }, { key: 'type', label: 'Tipe', type: 'badge' },
        { key: 'qty', label: 'Qty', type: 'number' }, { key: 'before', label: 'Stok Awal', type: 'number' },
        { key: 'after', label: 'Stok Akhir', type: 'number' }, { key: 'date', label: 'Tanggal' }
      ],
      rows: [
        { code: 'SM-2026-0815-01', product: 'Beras Premium 5kg', type: 'IN', qty: 100, before: 320, after: 420, date: '15 Agu 2026' },
        { code: 'SM-2026-0815-02', product: 'Minyak Goreng 2L', type: 'OUT', qty: -12, before: 57, after: 45, date: '15 Agu 2026' },
        { code: 'SM-2026-0815-03', product: 'Gula Pasir 1kg', type: 'Adjustment', qty: 2, before: 318, after: 320, date: '15 Agu 2026' },
        { code: 'SM-2026-0814-01', product: 'Rice Cooker 1.2L', type: 'Transfer', qty: -5, before: 13, after: 8, date: '14 Agu 2026' },
        { code: 'SM-2026-0814-02', product: 'Vitamin C 500mg', type: 'Damaged', qty: -3, before: 3, after: 0, date: '14 Agu 2026' }
      ]
    },
    'product-batches': {
      title: 'Batch / FEFO', desc: 'Manajemen batch & expiry (FIFO/FEFO)', icon: 'fa-solid fa-boxes', hasCrud: true,
      cards: [
        { label: 'Total Batch', value: '84', sub: 'aktif', icon: 'fa-solid fa-boxes', color: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
        { label: 'Akan Expired', value: '6', sub: '7 hari ke depan', icon: 'fa-solid fa-triangle-exclamation', color: 'linear-gradient(135deg,#ef4444,#f87171)' },
        { label: 'Batch Tracked', value: '12 produk', sub: 'perlu FEFO', icon: 'fa-solid fa-clock', color: 'linear-gradient(135deg,#f59e0b,#fbbf24)' },
        { label: 'Total Unit', value: '18.420', sub: 'semua batch', icon: 'fa-solid fa-box', color: 'linear-gradient(135deg,#00AA5B,#34d399)' }
      ],
      filters: [
        { id: 'statusFilter', label: 'Status', options: ['Semua','Aktif','Hampir Expired','Expired'] }
      ],
      hasDateFilter: false, chips: ['Semua', 'Aktif', 'Hampir Expired', 'Expired'],
      columns: [
        { key: 'batch', label: 'Kode Batch' }, { key: 'product', label: 'Produk' }, { key: 'prodDate', label: 'Produksi' },
        { key: 'expDate', label: 'Expiry' }, { key: 'qty', label: 'Qty', type: 'number' },
        { key: 'reserved', label: 'Reserved', type: 'number' }, { key: 'status', label: 'Status', type: 'badge' }
      ],
      rows: [
        { batch: 'BT-2026-001', product: 'Susu UHT 1L', prodDate: '01 Jul 2026', expDate: '01 Okt 2026', qty: 240, reserved: 20, status: 'Aktif' },
        { batch: 'BT-2026-002', product: 'Vitamin C 500mg', prodDate: '20 Jun 2026', expDate: '20 Agu 2026', qty: 85, reserved: 10, status: 'Hampir Expired' },
        { batch: 'BT-2026-003', product: 'Yogurt 500ml', prodDate: '10 Jul 2026', expDate: '10 Sep 2026', qty: 160, reserved: 15, status: 'Aktif' },
        { batch: 'BT-2026-004', product: 'Susu UHT 1L', prodDate: '15 Mei 2026', expDate: '15 Agu 2026', qty: 0, reserved: 0, status: 'Expired' },
        { batch: 'BT-2026-005', product: 'Minyak Goreng 2L', prodDate: '01 Agu 2026', expDate: '01 Agu 2027', qty: 480, reserved: 40, status: 'Aktif' }
      ],
      modalFields: [
        { key: 'batch', label: 'Kode Batch', type: 'text' },
        { key: 'product', label: 'Produk', type: 'text' },
        { key: 'prodDate', label: 'Tanggal Produksi', type: 'date' },
        { key: 'expDate', label: 'Tanggal Expiry', type: 'date' },
        { key: 'qty', label: 'Qty', type: 'number' },
        { key: 'reserved', label: 'Reserved', type: 'number' }
      ]
    },
    putaway: {
      title: 'Put-away', desc: 'Penempatan barang ke bin (saran otomatis)', icon: 'fa-solid fa-arrow-right-to-bracket', hasCrud: true,
      cards: [
        { label: 'Menunggu', value: '12', sub: 'putaway task', icon: 'fa-solid fa-clock', color: 'linear-gradient(135deg,#f59e0b,#fbbf24)' },
        { label: 'Diproses', value: '4', sub: 'sedang dikerjakan', icon: 'fa-solid fa-spinner', color: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
        { label: 'Selesai (30 hari)', value: '86', sub: 'semua selesai', icon: 'fa-solid fa-circle-check', color: 'linear-gradient(135deg,#00AA5B,#34d399)' },
        { label: 'Auto-Saran Aktif', value: '48 bin', sub: 'putaway rules', icon: 'fa-solid fa-wand-magic-sparkles', color: 'linear-gradient(135deg,#8b5cf6,#a78bfa)' }
      ],
      filters: [
        { id: 'statusFilter', label: 'Status', options: ['Semua','Menunggu','Diproses','Selesai'] }
      ],
      hasDateFilter: true, chips: ['Semua', 'Menunggu', 'Diproses', 'Selesai'],
      columns: [
        { key: 'code', label: 'Kode' }, { key: 'product', label: 'Produk' }, { key: 'qty', label: 'Qty', type: 'number' },
        { key: 'from', label: 'Dari' }, { key: 'to', label: 'Ke Bin' }, { key: 'status', label: 'Status', type: 'badge' }
      ],
      rows: [
        { code: 'PA-2026-0815-01', product: 'Beras Premium 5kg', qty: 100, from: 'Receiving D1', to: 'A-1-A1-2-05', status: 'Menunggu' },
        { code: 'PA-2026-0815-02', product: 'Minyak Goreng 2L', qty: 80, from: 'Receiving D1', to: 'A-1-A1-2-06', status: 'Diproses' },
        { code: 'PA-2026-0815-03', product: 'Gula Pasir 1kg', qty: 60, from: 'Receiving D1', to: 'A-2-A2-1-01', status: 'Selesai' },
        { code: 'PA-2026-0814-01', product: 'Rice Cooker 1.2L', qty: 20, from: 'Receiving D2', to: 'B-1-B1-3-10', status: 'Selesai' },
        { code: 'PA-2026-0814-02', product: 'Vitamin C 500mg', qty: 12, from: 'Receiving D2', to: 'C-1-C1-1-02', status: 'Menunggu' }
      ],
      modalFields: [
        { key: 'product', label: 'Produk', type: 'text' },
        { key: 'qty', label: 'Qty', type: 'number' },
        { key: 'from', label: 'Dari', type: 'text' },
        { key: 'to', label: 'Ke Bin', type: 'text' },
        { key: 'status', label: 'Status', type: 'select', options: ['Menunggu','Diproses','Selesai'] }
      ]
    },
    receiving: {
      title: 'Receiving + QC', desc: 'Penerimaan barang + quality check', icon: 'fa-solid fa-inbox', hasCrud: true,
      cards: [
        { label: 'Expected', value: '8', sub: 'PO belum tiba', icon: 'fa-solid fa-clock', color: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
        { label: 'Partial', value: '3', sub: 'diterima sebagian', icon: 'fa-solid fa-boxes-stacked', color: 'linear-gradient(135deg,#f59e0b,#fbbf24)' },
        { label: 'Received', value: '12', sub: 'bulan ini', icon: 'fa-solid fa-inbox', color: 'linear-gradient(135deg,#00AA5B,#34d399)' },
        { label: 'Completed', value: '10', sub: 'QC lulus semua', icon: 'fa-solid fa-circle-check', color: 'linear-gradient(135deg,#8b5cf6,#a78bfa)' }
      ],
      filters: [
        { id: 'statusFilter', label: 'Status', options: ['Semua','Expected','Partial','Received','Completed'] },
        { id: 'supplierFilter', label: 'Supplier', options: ['Semua','PT Beras Sejahtera','CV Minyak Nusantara','PT Gula Manis','PT Fashion Kreatif'] }
      ],
      hasDateFilter: true, chips: ['Semua', 'Expected', 'Partial', 'Received', 'Completed'],
      columns: [
        { key: 'code', label: 'Kode' }, { key: 'po', label: 'Kode PO' }, { key: 'supplier', label: 'Supplier' },
        { key: 'items', label: 'Item', type: 'number' }, { key: 'qty', label: 'Qty', type: 'number' },
        { key: 'status', label: 'Status', type: 'badge' }, { key: 'date', label: 'Tanggal' }
      ],
      rows: [
        { code: 'RC-2026-0815-01', po: 'PO-2026-012', supplier: 'PT Beras Sejahtera', items: 2, qty: 100, status: 'Received', date: '15 Agu 2026' },
        { code: 'RC-2026-0815-02', po: 'PO-2026-013', supplier: 'CV Minyak Nusantara', items: 1, qty: 80, status: 'Partial', date: '15 Agu 2026' },
        { code: 'RC-2026-0814-01', po: 'PO-2026-010', supplier: 'PT Gula Manis', items: 3, qty: 150, status: 'Completed', date: '14 Agu 2026' },
        { code: 'RC-2026-0814-02', po: 'PO-2026-014', supplier: 'PT Fashion Kreatif', items: 4, qty: 60, status: 'Expected', date: '18 Agu 2026' },
        { code: 'RC-2026-0813-01', po: 'PO-2026-009', supplier: 'PT Beras Sejahtera', items: 2, qty: 120, status: 'Completed', date: '13 Agu 2026' }
      ],
      modalFields: [
        { key: 'code', label: 'Kode Receiving', type: 'text' },
        { key: 'po', label: 'Kode PO', type: 'text' },
        { key: 'supplier', label: 'Supplier', type: 'select', options: ['PT Beras Sejahtera','CV Minyak Nusantara','PT Gula Manis','PT Fashion Kreatif'] },
        { key: 'items', label: 'Jumlah Item', type: 'number' },
        { key: 'qty', label: 'Qty', type: 'number' },
        { key: 'status', label: 'Status', type: 'select', options: ['Expected','Partial','Received','Completed'] }
      ]
    },
    picking: {
      title: 'Picking', desc: 'Generate & kelola picking list', icon: 'fa-solid fa-list-check', hasCrud: true,
      cards: [
        { label: 'Pending', value: '9', sub: 'picking list', icon: 'fa-solid fa-clock', color: 'linear-gradient(135deg,#f59e0b,#fbbf24)' },
        { label: 'In Progress', value: '5', sub: 'sedang dipetik', icon: 'fa-solid fa-spinner', color: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
        { label: 'Completed', value: '42', sub: '30 hari', icon: 'fa-solid fa-circle-check', color: 'linear-gradient(135deg,#00AA5B,#34d399)' },
        { label: 'Item Pending', value: '64', sub: 'perlu dipetik', icon: 'fa-solid fa-list-check', color: 'linear-gradient(135deg,#8b5cf6,#a78bfa)' }
      ],
      filters: [
        { id: 'statusFilter', label: 'Status', options: ['Semua','Pending','In Progress','Completed','Cancelled'] }
      ],
      hasDateFilter: true, chips: ['Semua', 'Pending', 'In Progress', 'Completed', 'Cancelled'],
      columns: [
        { key: 'code', label: 'Kode' }, { key: 'method', label: 'Metode', type: 'badge' }, { key: 'orders', label: 'Order', type: 'number' },
        { key: 'items', label: 'Item', type: 'number' }, { key: 'assigned', label: 'Petugas' },
        { key: 'status', label: 'Status', type: 'badge' }, { key: 'date', label: 'Tanggal' }
      ],
      rows: [
        { code: 'PK-2026-0815-01', method: 'Batch', orders: 8, items: 24, assigned: 'Ahmad', status: 'In Progress', date: '15 Agu 2026' },
        { code: 'PK-2026-0815-02', method: 'Wave', orders: 12, items: 36, assigned: 'Rina', status: 'Pending', date: '15 Agu 2026' },
        { code: 'PK-2026-0814-01', method: 'Single', orders: 1, items: 4, assigned: 'Ahmad', status: 'Completed', date: '14 Agu 2026' },
        { code: 'PK-2026-0814-02', method: 'Batch', orders: 6, items: 18, assigned: 'Budi', status: 'Completed', date: '14 Agu 2026' },
        { code: 'PK-2026-0813-01', method: 'Wave', orders: 10, items: 30, assigned: 'Rina', status: 'Cancelled', date: '13 Agu 2026' }
      ],
      modalFields: [
        { key: 'code', label: 'Kode Picking', type: 'text' },
        { key: 'method', label: 'Metode', type: 'select', options: ['Single','Batch','Wave'] },
        { key: 'orders', label: 'Jumlah Order', type: 'number' },
        { key: 'items', label: 'Jumlah Item', type: 'number' },
        { key: 'assigned', label: 'Petugas', type: 'text' },
        { key: 'status', label: 'Status', type: 'select', options: ['Pending','In Progress','Completed','Cancelled'] }
      ]
    },
    packing: {
      title: 'Packing', desc: 'Verifikasi packing & scan ulang', icon: 'fa-solid fa-box-open', hasCrud: true,
      cards: [
        { label: 'Pending', value: '7', sub: 'packing list', icon: 'fa-solid fa-clock', color: 'linear-gradient(135deg,#f59e0b,#fbbf24)' },
        { label: 'Packed', value: '4', sub: 'sudah dikemas', icon: 'fa-solid fa-box', color: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
        { label: 'Verified', value: '12', sub: 'scan ulang OK', icon: 'fa-solid fa-circle-check', color: 'linear-gradient(135deg,#00AA5B,#34d399)' },
        { label: 'Shipped', value: '38', sub: '30 hari', icon: 'fa-solid fa-truck', color: 'linear-gradient(135deg,#8b5cf6,#a78bfa)' }
      ],
      filters: [
        { id: 'statusFilter', label: 'Status', options: ['Semua','Pending','Packed','Verified','Shipped'] }
      ],
      hasDateFilter: true, chips: ['Semua', 'Pending', 'Packed', 'Verified', 'Shipped'],
      columns: [
        { key: 'code', label: 'Kode' }, { key: 'picking', label: 'Kode Picking' }, { key: 'expected', label: 'Item Diharapkan', type: 'number' },
        { key: 'verified', label: 'Item Terverifikasi', type: 'number' }, { key: 'packer', label: 'Packer' },
        { key: 'status', label: 'Status', type: 'badge' }, { key: 'date', label: 'Tanggal' }
      ],
      rows: [
        { code: 'PAK-2026-0815-01', picking: 'PK-2026-0815-01', expected: 24, verified: 18, packer: 'Dedi', status: 'Packed', date: '15 Agu 2026' },
        { code: 'PAK-2026-0815-02', picking: 'PK-2026-0815-02', expected: 36, verified: 0, packer: 'Eka', status: 'Pending', date: '15 Agu 2026' },
        { code: 'PAK-2026-0814-01', picking: 'PK-2026-0814-01', expected: 4, verified: 4, packer: 'Dedi', status: 'Verified', date: '14 Agu 2026' },
        { code: 'PAK-2026-0814-02', picking: 'PK-2026-0814-02', expected: 18, verified: 18, packer: 'Fajar', status: 'Shipped', date: '14 Agu 2026' },
        { code: 'PAK-2026-0813-01', picking: 'PK-2026-0813-01', expected: 30, verified: 0, packer: 'Eka', status: 'Cancelled', date: '13 Agu 2026' }
      ],
      modalFields: [
        { key: 'code', label: 'Kode Packing', type: 'text' },
        { key: 'picking', label: 'Kode Picking', type: 'text' },
        { key: 'expected', label: 'Item Diharapkan', type: 'number' },
        { key: 'verified', label: 'Item Terverifikasi', type: 'number' },
        { key: 'packer', label: 'Packer', type: 'text' },
        { key: 'status', label: 'Status', type: 'select', options: ['Pending','Packed','Verified','Shipped'] }
      ]
    },
    'stock-opname': {
      title: 'Stock Opname', desc: 'Cycle counting & stock opname', icon: 'fa-solid fa-clipboard-check', hasCrud: true,
      cards: [
        { label: 'Draft', value: '3', sub: 'belum mulai', icon: 'fa-solid fa-file-pen', color: 'linear-gradient(135deg,#94a3b8,#cbd5e1)' },
        { label: 'In Progress', value: '2', sub: 'sedang hitung', icon: 'fa-solid fa-spinner', color: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
        { label: 'Completed', value: '14', sub: '30 hari', icon: 'fa-solid fa-circle-check', color: 'linear-gradient(135deg,#00AA5B,#34d399)' },
        { label: 'Selisih Ditemukan', value: '28', sub: 'perlu adjustment', icon: 'fa-solid fa-triangle-exclamation', color: 'linear-gradient(135deg,#ef4444,#f87171)' }
      ],
      filters: [
        { id: 'statusFilter', label: 'Status', options: ['Semua','Draft','In Progress','Completed','Cancelled'] },
        { id: 'typeFilter', label: 'Tipe', options: ['Semua','Full','Cycle','Spot'] }
      ],
      hasDateFilter: true, chips: ['Semua', 'Draft', 'In Progress', 'Completed', 'Cancelled'],
      columns: [
        { key: 'code', label: 'Kode' }, { key: 'type', label: 'Tipe', type: 'badge' }, { key: 'wh', label: 'Gudang' },
        { key: 'scheduled', label: 'Jadwal' }, { key: 'completed', label: 'Selesai' },
        { key: 'diff', label: 'Selisih', type: 'number' }, { key: 'status', label: 'Status', type: 'badge' }
      ],
      rows: [
        { code: 'OP-2026-0815-01', type: 'Cycle', wh: 'WH Pusat 1', scheduled: '15 Agu 2026', completed: '-', diff: 0, status: 'In Progress' },
        { code: 'OP-2026-0815-02', type: 'Spot', wh: 'WH Mitra A', scheduled: '15 Agu 2026', completed: '-', diff: 0, status: 'Draft' },
        { code: 'OP-2026-0814-01', type: 'Full', wh: 'WH Pusat 1', scheduled: '14 Agu 2026', completed: '14 Agu 2026', diff: 8, status: 'Completed' },
        { code: 'OP-2026-0814-02', type: 'Cycle', wh: 'WH Pusat 2', scheduled: '14 Agu 2026', completed: '14 Agu 2026', diff: 3, status: 'Completed' },
        { code: 'OP-2026-0813-01', type: 'Full', wh: 'WH Mitra B', scheduled: '13 Agu 2026', completed: '-', diff: 0, status: 'Cancelled' }
      ],
      modalFields: [
        { key: 'code', label: 'Kode Opname', type: 'text' },
        { key: 'type', label: 'Tipe', type: 'select', options: ['Full','Cycle','Spot'] },
        { key: 'wh', label: 'Gudang', type: 'select', options: ['WH Pusat 1','WH Pusat 2','WH Mitra A','WH Mitra B'] },
        { key: 'scheduled', label: 'Tanggal Jadwal', type: 'date' },
        { key: 'diff', label: 'Selisih', type: 'number' },
        { key: 'status', label: 'Status', type: 'select', options: ['Draft','In Progress','Completed','Cancelled'] }
      ]
    },
    replenishment: {
      title: 'Replenishment', desc: 'Alert & proses isi ulang picking area', icon: 'fa-solid fa-arrows-rotate', hasCrud: true,
      cards: [
        { label: 'Pending', value: '7', sub: 'permintaan', icon: 'fa-solid fa-clock', color: 'linear-gradient(135deg,#f59e0b,#fbbf24)' },
        { label: 'Approved', value: '4', sub: 'disetujui', icon: 'fa-solid fa-circle-check', color: 'linear-gradient(135deg,#00AA5B,#34d399)' },
        { label: 'In Progress', value: '3', sub: 'sedang diisi', icon: 'fa-solid fa-spinner', color: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
        { label: 'Completed', value: '52', sub: '30 hari', icon: 'fa-solid fa-boxes-stacked', color: 'linear-gradient(135deg,#8b5cf6,#a78bfa)' }
      ],
      filters: [
        { id: 'statusFilter', label: 'Status', options: ['Semua','Pending','Approved','In Progress','Completed','Cancelled'] }
      ],
      hasDateFilter: true, chips: ['Semua', 'Pending', 'Approved', 'In Progress', 'Completed'],
      columns: [
        { key: 'code', label: 'Kode' }, { key: 'product', label: 'Produk' }, { key: 'from', label: 'Dari Bin' },
        { key: 'to', label: 'Ke Bin' }, { key: 'qty', label: 'Qty', type: 'number' },
        { key: 'status', label: 'Status', type: 'badge' }, { key: 'date', label: 'Tanggal' }
      ],
      rows: [
        { code: 'RP-2026-0815-01', product: 'Beras Premium 5kg', from: 'A-1-A1-2-05', to: 'A-2-A2-1-01', qty: 50, status: 'Approved', date: '15 Agu 2026' },
        { code: 'RP-2026-0815-02', product: 'Minyak Goreng 2L', from: 'A-1-A1-2-06', to: 'A-2-A2-1-02', qty: 30, status: 'Pending', date: '15 Agu 2026' },
        { code: 'RP-2026-0814-01', product: 'Gula Pasir 1kg', from: 'B-1-B1-3-10', to: 'B-2-B2-1-01', qty: 40, status: 'In Progress', date: '14 Agu 2026' },
        { code: 'RP-2026-0814-02', product: 'Rice Cooker 1.2L', from: 'B-1-B1-3-10', to: 'B-2-B2-1-02', qty: 5, status: 'Completed', date: '14 Agu 2026' },
        { code: 'RP-2026-0813-01', product: 'Vitamin C 500mg', from: 'C-1-C1-1-02', to: 'C-2-C2-1-01', qty: 10, status: 'Completed', date: '13 Agu 2026' }
      ],
      modalFields: [
        { key: 'product', label: 'Produk', type: 'text' },
        { key: 'from', label: 'Dari Bin', type: 'text' },
        { key: 'to', label: 'Ke Bin', type: 'text' },
        { key: 'qty', label: 'Qty', type: 'number' },
        { key: 'status', label: 'Status', type: 'select', options: ['Pending','Approved','In Progress','Completed','Cancelled'] }
      ]
    },
    'barcode-labels': {
      title: 'Barcode Label', desc: 'Cetak label barcode produk/bin/batch', icon: 'fa-solid fa-barcode', hasCrud: true,
      cards: [
        { label: 'Total Label', value: '1.240', sub: '30 hari', icon: 'fa-solid fa-barcode', color: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
        { label: 'Produk', value: '780', sub: 'label produk', icon: 'fa-solid fa-box', color: 'linear-gradient(135deg,#00AA5B,#34d399)' },
        { label: 'Bin', value: '180', sub: 'label lokasi', icon: 'fa-solid fa-location-dot', color: 'linear-gradient(135deg,#f59e0b,#fbbf24)' },
        { label: 'Shipping', value: '280', sub: 'label kirim', icon: 'fa-solid fa-truck', color: 'linear-gradient(135deg,#8b5cf6,#a78bfa)' }
      ],
      filters: [
        { id: 'typeFilter', label: 'Tipe', options: ['Semua','Product','Bin','Batch','Shipping'] }
      ],
      hasDateFilter: true, chips: ['Semua', 'Product', 'Bin', 'Batch', 'Shipping'],
      columns: [
        { key: 'code', label: 'Kode Label' }, { key: 'type', label: 'Tipe', type: 'badge' }, { key: 'reference', label: 'Referensi' },
        { key: 'printed', label: 'Dicetak Oleh' }, { key: 'date', label: 'Tanggal' }
      ],
      rows: [
        { code: 'LBL-2026-0815-001', type: 'Product', reference: 'BR-001', printed: 'Ahmad', date: '15 Agu 2026' },
        { code: 'LBL-2026-0815-002', type: 'Bin', reference: 'A-1-A1-2-05', printed: 'Ahmad', date: '15 Agu 2026' },
        { code: 'LBL-2026-0815-003', type: 'Batch', reference: 'BT-2026-001', printed: 'Rina', date: '15 Agu 2026' },
        { code: 'LBL-2026-0814-001', type: 'Shipping', reference: 'ORD-2026-0814-018', printed: 'Budi', date: '14 Agu 2026' },
        { code: 'LBL-2026-0814-002', type: 'Product', reference: 'MN-002', printed: 'Ahmad', date: '14 Agu 2026' }
      ],
      modalFields: [
        { key: 'code', label: 'Kode Label', type: 'text' },
        { key: 'type', label: 'Tipe', type: 'select', options: ['Product','Bin','Batch','Shipping'] },
        { key: 'reference', label: 'Referensi', type: 'text' },
        { key: 'printed', label: 'Dicetak Oleh', type: 'text' }
      ]
    },
    'warehouse-reports': {
      title: 'Laporan WMS', desc: 'Kartu stok, fast/slow moving, mutasi stok', icon: 'fa-solid fa-chart-column', hasCrud: false,
      cards: [
        { label: 'Total SKU', value: '1.284', sub: 'semua gudang', icon: 'fa-solid fa-boxes-stacked', color: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
        { label: 'Fast Moving', value: '24', sub: 'top seller', icon: 'fa-solid fa-fire', color: 'linear-gradient(135deg,#ef4444,#f87171)' },
        { label: 'Slow Moving', value: '68', sub: 'perlu promo', icon: 'fa-solid fa-snowflake', color: 'linear-gradient(135deg,#38bdf8,#7dd3fc)' },
        { label: 'Nilai Persediaan', value: 'Rp 842 jt', sub: 'total stok', icon: 'fa-solid fa-money-bill-wave', color: 'linear-gradient(135deg,#00AA5B,#34d399)' }
      ],
      charts: [
        { title: 'Fast vs Slow Moving', type: 'doughnut', labels: ['Fast Moving','Slow Moving','Normal'], data: [24, 68, 892] },
        { title: 'Nilai Stok per Kategori', type: 'bar', labels: ['Sembako','Makanan','Elektronik','Fashion','Kesehatan'], data: [320, 210, 145, 95, 72], color: '#0ea5e9' }
      ],
      filters: [
        { id: 'whFilter', label: 'Gudang', options: ['Semua','WH Pusat 1','WH Pusat 2','WH Mitra A','WH Mitra B'] },
        { id: 'reportFilter', label: 'Laporan', options: ['Kartu Stok','Fast/Slow Moving','Mutasi Stok'] }
      ],
      hasDateFilter: true, chips: ['Semua', 'Kartu Stok', 'Fast/Slow Moving', 'Mutasi Stok'],
      columns: [
        { key: 'sku', label: 'SKU' }, { key: 'product', label: 'Produk' }, { key: 'type', label: 'Tipe', type: 'badge' },
        { key: 'qty', label: 'Qty', type: 'number' }, { key: 'value', label: 'Nilai', type: 'currency' }, { key: 'period', label: 'Periode' }
      ],
      rows: [
        { sku: 'BR-001', product: 'Beras Premium 5kg', type: 'Fast Moving', qty: 420, value: 35700000, period: '30 hari' },
        { sku: 'MN-002', product: 'Minyak Goreng 2L', type: 'Fast Moving', qty: 45, value: 1890000, period: '30 hari' },
        { sku: 'GR-003', product: 'Gula Pasir 1kg', type: 'Fast Moving', qty: 320, value: 5760000, period: '30 hari' },
        { sku: 'EL-010', product: 'Rice Cooker 1.2L', type: 'Slow Moving', qty: 8, value: 2280000, period: '30 hari' },
        { sku: 'FS-021', product: 'Kaos Polos Cotton', type: 'Normal', qty: 240, value: 15600000, period: '30 hari' }
      ]
    },
    'purchase-requests': {
      title: 'Purchase Request', desc: 'Permintaan pembelian barang (PR)', icon: 'fa-solid fa-file-signature', hasCrud: true,
      cards: [
        { label: 'Draft', value: '6', sub: 'belum disubmit', icon: 'fa-solid fa-file-pen', color: 'linear-gradient(135deg,#94a3b8,#cbd5e1)' },
        { label: 'Pending Approval', value: '4', sub: 'menunggu approval', icon: 'fa-solid fa-clock', color: 'linear-gradient(135deg,#f59e0b,#fbbf24)' },
        { label: 'Approved', value: '8', sub: 'siap jadi PO', icon: 'fa-solid fa-circle-check', color: 'linear-gradient(135deg,#00AA5B,#34d399)' },
        { label: 'Total Nilai', value: 'Rp 384 jt', sub: 'bulan ini', icon: 'fa-solid fa-money-bill-wave', color: 'linear-gradient(135deg,#8b5cf6,#a78bfa)' }
      ],
      filters: [
        { id: 'statusFilter', label: 'Status', options: ['Semua','Draft','Submitted','Pending Approval','Approved','Rejected','Merged','Converted'] },
        { id: 'priorityFilter', label: 'Prioritas', options: ['Semua','Normal','Urgent','Critical'] }
      ],
      hasDateFilter: true, chips: ['Semua', 'Draft', 'Pending Approval', 'Approved', 'Rejected'],
      columns: [
        { key: 'code', label: 'Kode' }, { key: 'title', label: 'Judul' }, { key: 'requested', label: 'Pengaju' },
        { key: 'priority', label: 'Prioritas', type: 'badge' }, { key: 'total', label: 'Total', type: 'currency' },
        { key: 'status', label: 'Status', type: 'badge' }, { key: 'date', label: 'Tanggal' }
      ],
      rows: [
        { code: 'PR-2026-012', title: 'Pengadaan Beras 500kg', requested: 'Kepala Gudang', priority: 'Urgent', total: 42500000, status: 'Pending Approval', date: '15 Agu 2026' },
        { code: 'PR-2026-011', title: 'Pengadaan Minyak 200L', requested: 'Kepala Gudang', priority: 'Normal', total: 8400000, status: 'Approved', date: '15 Agu 2026' },
        { code: 'PR-2026-010', title: 'Restock Elektronik', requested: 'Manager Purchasing', priority: 'Critical', total: 28500000, status: 'Draft', date: '14 Agu 2026' },
        { code: 'PR-2026-009', title: 'Pengadaan Gula 300kg', requested: 'Kepala Gudang', priority: 'Normal', total: 5400000, status: 'Converted', date: '14 Agu 2026' },
        { code: 'PR-2026-008', title: 'Pengadaan Susu Bayi', requested: 'Manager Purchasing', priority: 'Urgent', total: 12800000, status: 'Rejected', date: '13 Agu 2026' }
      ],
      modalFields: [
        { key: 'code', label: 'Kode PR', type: 'text' },
        { key: 'title', label: 'Judul', type: 'text' },
        { key: 'requested', label: 'Pengaju', type: 'text' },
        { key: 'priority', label: 'Prioritas', type: 'select', options: ['Normal','Urgent','Critical'] },
        { key: 'total', label: 'Total (Rp)', type: 'number' },
        { key: 'status', label: 'Status', type: 'select', options: ['Draft','Submitted','Pending Approval','Approved','Rejected'] }
      ]
    },
    'purchase-request-approval': {
      title: 'Approval PR', desc: 'Workflow approval bertingkat (≤10jt / >10jt)', icon: 'fa-solid fa-check-double', hasCrud: false,
      cards: [
        { label: 'Menunggu', value: '4', sub: 'perlu approval', icon: 'fa-solid fa-clock', color: 'linear-gradient(135deg,#f59e0b,#fbbf24)' },
        { label: '≤ Rp 10 jt', value: 'Kepala Gudang', sub: 'level 1 approver', icon: 'fa-solid fa-user-tie', color: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
        { label: '> Rp 10 jt', value: 'Manajer Keuangan', sub: 'level 2 approver', icon: 'fa-solid fa-building-columns', color: 'linear-gradient(135deg,#8b5cf6,#a78bfa)' },
        { label: 'Approved (bulan ini)', value: '12', sub: '5 jadi PO', icon: 'fa-solid fa-circle-check', color: 'linear-gradient(135deg,#00AA5B,#34d399)' }
      ],
      filters: [
        { id: 'statusFilter', label: 'Status', options: ['Semua','Pending Approval','Approved','Rejected'] }
      ],
      hasDateFilter: true, chips: ['Semua', 'Pending Approval', 'Approved', 'Rejected'],
      columns: [
        { key: 'code', label: 'Kode' }, { key: 'title', label: 'Judul' }, { key: 'total', label: 'Total', type: 'currency' },
        { key: 'level', label: 'Level Approval', type: 'badge' }, { key: 'approver', label: 'Approver' },
        { key: 'status', label: 'Status', type: 'badge' }, { key: 'date', label: 'Tanggal' }
      ],
      rows: [
        { code: 'PR-2026-012', title: 'Pengadaan Beras 500kg', total: 42500000, level: 'Level 2', approver: 'Manajer Keuangan', status: 'Pending Approval', date: '15 Agu 2026' },
        { code: 'PR-2026-011', title: 'Pengadaan Minyak 200L', total: 8400000, level: 'Level 1', approver: 'Kepala Gudang', status: 'Approved', date: '15 Agu 2026' },
        { code: 'PR-2026-010', title: 'Restock Elektronik', total: 28500000, level: 'Level 2', approver: 'Manajer Keuangan', status: 'Pending Approval', date: '14 Agu 2026' },
        { code: 'PR-2026-009', title: 'Pengadaan Gula 300kg', total: 5400000, level: 'Level 1', approver: 'Kepala Gudang', status: 'Rejected', date: '14 Agu 2026' },
        { code: 'PR-2026-007', title: 'Pengadaan Susu UHT', total: 7200000, level: 'Level 1', approver: 'Kepala Gudang', status: 'Approved', date: '13 Agu 2026' }
      ]
    },
    'purchase-orders': {
      title: 'Purchase Order', desc: 'Kelola PO ke supplier (generate dari PR) + cetak surat pesanan otomatis', icon: 'fa-solid fa-file-invoice', hasCrud: true, hasPrint: true,
      cards: [
        { label: 'Draft', value: '5', sub: 'belum dikirim', icon: 'fa-solid fa-file-pen', color: 'linear-gradient(135deg,#94a3b8,#cbd5e1)' },
        { label: 'Approved', value: '8', sub: 'disetujui', icon: 'fa-solid fa-circle-check', color: 'linear-gradient(135deg,#00AA5B,#34d399)' },
        { label: 'Received', value: '12', sub: 'bulan ini', icon: 'fa-solid fa-inbox', color: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
        { label: 'Total Nilai', value: 'Rp 1,2 M', sub: 'semua PO', icon: 'fa-solid fa-money-bill-wave', color: 'linear-gradient(135deg,#8b5cf6,#a78bfa)' }
      ],
      filters: [
        { id: 'statusFilter', label: 'Status', options: ['Semua','Draft','Submitted','Approved','Partial Received','Fully Received','Closed','Cancelled'] },
        { id: 'supplierFilter', label: 'Supplier', options: ['Semua','PT Beras Sejahtera','CV Minyak Nusantara','PT Gula Manis','PT Fashion Kreatif'] }
      ],
      hasDateFilter: true, chips: ['Semua', 'Draft', 'Approved', 'Partial Received', 'Fully Received', 'Cancelled'],
      columns: [
        { key: 'code', label: 'Kode' }, { key: 'supplier', label: 'Supplier' }, { key: 'total', label: 'Total', type: 'currency' },
        { key: 'ppn', label: 'PPN', type: 'currency' }, { key: 'freight', label: 'Freight', type: 'currency' },
        { key: 'eta', label: 'ETA' }, { key: 'status', label: 'Status', type: 'badge' }
      ],
      rows: [
        {
          code: 'PO-2026-015', supplier: 'PT Beras Sejahtera', total: 42500000, ppn: 4250000, freight: 500000, eta: '18 Agu 2026', status: 'Approved',
          contact: 'Pak Hadi · 0812-3456-7890', supplierAddress: 'Jl. Raya Karawang No. 45, Karawang, Jawa Barat',
          createdBy: 'Manager Purchasing', approvedBy: 'Direktur Operasional',
          items: [
            { sku: 'BR-001', nama: 'Beras Premium 5kg', qty: 30, harga: 850000 },
            { sku: 'MN-002', nama: 'Minyak Goreng 2L', qty: 24, harga: 42000 },
            { sku: 'GR-003', nama: 'Gula Pasir 1kg', qty: 50, harga: 18000 }
          ]
        },
        {
          code: 'PO-2026-014', supplier: 'CV Minyak Nusantara', total: 8400000, ppn: 840000, freight: 200000, eta: '17 Agu 2026', status: 'Partial Received',
          contact: 'Bu Yanti · 0813-9876-5432', supplierAddress: 'Jl. Industri No. 88, Tangerang, Banten',
          createdBy: 'Manager Purchasing', approvedBy: 'Direktur Operasional',
          items: [
            { sku: 'MN-002', nama: 'Minyak Goreng 2L', qty: 100, harga: 42000 },
            { sku: 'RT-012', nama: 'Sabun Mandi Cair 800ml', qty: 100, harga: 24000 }
          ]
        },
        {
          code: 'PO-2026-013', supplier: 'PT Fashion Kreatif', total: 28500000, ppn: 2850000, freight: 800000, eta: '20 Agu 2026', status: 'Submitted',
          contact: 'Bu Sinta · 0821-1111-2222', supplierAddress: 'Jl. Dago No. 77, Bandung, Jawa Barat',
          createdBy: 'Manager Purchasing', approvedBy: 'Direktur Operasional',
          items: [
            { sku: 'FS-021', nama: 'Kaos Polos Cotton', qty: 200, harga: 65000 },
            { sku: 'BT-999', nama: 'Backpack Travel 40L', qty: 100, harga: 95000 }
          ]
        },
        {
          code: 'PO-2026-012', supplier: 'PT Gula Manis', total: 5400000, ppn: 540000, freight: 150000, eta: '16 Agu 2026', status: 'Fully Received',
          contact: 'Pak Joko · 0857-5555-6666', supplierAddress: 'Jl. Mangga Besar No. 12, Jakarta Barat',
          createdBy: 'Manager Purchasing', approvedBy: 'Direktur Operasional',
          items: [
            { sku: 'GR-003', nama: 'Gula Pasir 1kg', qty: 300, harga: 18000 }
          ]
        },
        {
          code: 'PO-2026-011', supplier: 'UD Elektronik Prima', total: 12800000, ppn: 1280000, freight: 350000, eta: '19 Agu 2026', status: 'Draft',
          contact: 'Pak Anton · 0896-0000-1111', supplierAddress: 'Jl. Rungkut No. 99, Surabaya, Jawa Timur',
          createdBy: 'Manager Purchasing', approvedBy: 'Direktur Operasional',
          items: [
            { sku: 'EL-010', nama: 'Rice Cooker 1.2L', qty: 20, harga: 285000 },
            { sku: 'EL-011', nama: 'Blender 1.5L', qty: 15, harga: 220000 }
          ]
        }
      ],
      modalFields: [
        { key: 'code', label: 'Kode PO', type: 'text' },
        { key: 'supplier', label: 'Supplier', type: 'select', options: ['PT Beras Sejahtera','CV Minyak Nusantara','PT Gula Manis','PT Fashion Kreatif'] },
        { key: 'total', label: 'Total (Rp)', type: 'number' },
        { key: 'ppn', label: 'PPN (Rp)', type: 'number' },
        { key: 'freight', label: 'Freight (Rp)', type: 'number' },
        { key: 'eta', label: 'ETA', type: 'date' },
        { key: 'status', label: 'Status', type: 'select', options: ['Draft','Submitted','Approved','Partial Received','Fully Received','Closed','Cancelled'] }
      ]
    },
    'po-eta-dashboard': {
      title: 'ETA Dashboard', desc: 'Kedatangan PO: hari ini / besok / minggu ini', icon: 'fa-solid fa-clock', hasCrud: false,
      cards: [
        { label: 'Tiba Hari Ini', value: '3', sub: 'PO', icon: 'fa-solid fa-truck-fast', color: 'linear-gradient(135deg,#00AA5B,#34d399)' },
        { label: 'Tiba Besok', value: '4', sub: 'PO', icon: 'fa-solid fa-calendar-day', color: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
        { label: 'Minggu Ini', value: '9', sub: 'total PO', icon: 'fa-solid fa-calendar-week', color: 'linear-gradient(135deg,#f59e0b,#fbbf24)' },
        { label: 'Terlambat', value: '1', sub: 'melebihi ETA', icon: 'fa-solid fa-triangle-exclamation', color: 'linear-gradient(135deg,#ef4444,#f87171)' }
      ],
      charts: [
        { title: 'Kedatangan minggu ini', type: 'bar', labels: ['Sen','Sel','Rab','Kam','Jum','Sab','Min'], data: [2, 1, 3, 0, 2, 1, 0], color: '#00AA5B' }
      ],
      filters: [
        { id: 'rangeFilter', label: 'Range', options: ['Semua','Hari Ini','Besok','Minggu Ini'] },
        { id: 'supplierFilter', label: 'Supplier', options: ['Semua','PT Beras Sejahtera','CV Minyak Nusantara','PT Gula Manis','PT Fashion Kreatif'] }
      ],
      hasDateFilter: true, chips: ['Semua', 'Hari Ini', 'Besok', 'Minggu Ini'],
      columns: [
        { key: 'code', label: 'Kode' }, { key: 'supplier', label: 'Supplier' }, { key: 'eta', label: 'ETA' },
        { key: 'total', label: 'Total', type: 'currency' }, { key: 'status', label: 'Status', type: 'badge' }
      ],
      rows: [
        { code: 'PO-2026-012', supplier: 'PT Gula Manis', eta: 'Hari Ini', total: 5400000, status: 'Tiba Hari Ini' },
        { code: 'PO-2026-014', supplier: 'CV Minyak Nusantara', eta: 'Hari Ini', total: 8400000, status: 'Tiba Hari Ini' },
        { code: 'PO-2026-013', supplier: 'PT Fashion Kreatif', eta: 'Besok', total: 28500000, status: 'Tiba Besok' },
        { code: 'PO-2026-015', supplier: 'PT Beras Sejahtera', eta: 'Minggu Ini', total: 42500000, status: 'Minggu Ini' },
        { code: 'PO-2026-010', supplier: 'PT Gula Manis', eta: 'Terlambat', total: 6800000, status: 'Terlambat' }
      ]
    },
    'supplier-performance': {
      title: 'Supplier Performance', desc: 'Skor vendor: on-time, akurasi, kualitas', icon: 'fa-solid fa-star-half-stroke', hasCrud: true,
      cards: [
        { label: 'Grade A', value: '8', sub: 'skor ≥ 90', icon: 'fa-solid fa-star', color: 'linear-gradient(135deg,#00AA5B,#34d399)' },
        { label: 'Grade B', value: '6', sub: 'skor 75–89', icon: 'fa-solid fa-star-half-stroke', color: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
        { label: 'Grade C', value: '3', sub: 'skor 60–74', icon: 'fa-solid fa-star', color: 'linear-gradient(135deg,#f59e0b,#fbbf24)' },
        { label: 'Grade D', value: '1', sub: 'skor < 60', icon: 'fa-solid fa-star', color: 'linear-gradient(135deg,#ef4444,#f87171)' }
      ],
      charts: [
        { title: 'Skor per Supplier', type: 'bar', labels: ['PT Beras Sejahtera','CV Minyak Nusantara','PT Gula Manis','PT Fashion Kreatif','PT Elektronik Prima'], data: [92, 88, 85, 90, 74], color: '#8b5cf6' }
      ],
      filters: [
        { id: 'gradeFilter', label: 'Grade', options: ['Semua','A','B','C','D'] }
      ],
      hasDateFilter: false, chips: ['Semua', 'Grade A', 'Grade B', 'Grade C', 'Grade D'],
      columns: [
        { key: 'supplier', label: 'Supplier' }, { key: 'onTime', label: 'On-time', type: 'number' },
        { key: 'accuracy', label: 'Akurasi', type: 'number' }, { key: 'quality', label: 'Kualitas', type: 'number' },
        { key: 'overall', label: 'Skor', type: 'number' }, { key: 'grade', label: 'Grade', type: 'badge' }
      ],
      rows: [
        { supplier: 'PT Beras Sejahtera', onTime: 95, accuracy: 92, quality: 90, overall: 92, grade: 'A' },
        { supplier: 'CV Minyak Nusantara', onTime: 90, accuracy: 88, quality: 86, overall: 88, grade: 'B' },
        { supplier: 'PT Gula Manis', onTime: 85, accuracy: 87, quality: 83, overall: 85, grade: 'B' },
        { supplier: 'PT Fashion Kreatif', onTime: 92, accuracy: 90, quality: 88, overall: 90, grade: 'A' },
        { supplier: 'PT Elektronik Prima', onTime: 70, accuracy: 76, quality: 72, overall: 74, grade: 'C' }
      ],
      modalFields: [
        { key: 'supplier', label: 'Supplier', type: 'text' },
        { key: 'onTime', label: 'On-time (0-100)', type: 'number' },
        { key: 'accuracy', label: 'Akurasi (0-100)', type: 'number' },
        { key: 'quality', label: 'Kualitas (0-100)', type: 'number' },
        { key: 'overall', label: 'Skor Keseluruhan', type: 'number' }
      ]
    },
    'replenishment-suggestions': {
      title: 'Replenishment Suggestion', desc: 'Auto-forecasting: ROP + penjualan + lead time', icon: 'fa-solid fa-wand-magic-sparkles', hasCrud: false,
      cards: [
        { label: 'Suggestion Aktif', value: '16', sub: 'perlu diorder', icon: 'fa-solid fa-wand-magic-sparkles', color: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
        { label: 'Prioritas Tinggi', value: '5', sub: 'stok kritis', icon: 'fa-solid fa-fire', color: 'linear-gradient(135deg,#ef4444,#f87171)' },
        { label: 'Sudah di PR/PO', value: '8', sub: 'dalam proses', icon: 'fa-solid fa-circle-check', color: 'linear-gradient(135deg,#00AA5B,#34d399)' },
        { label: 'Total Nilai Saran', value: 'Rp 82 jt', sub: 'jika semua dipesan', icon: 'fa-solid fa-money-bill-wave', color: 'linear-gradient(135deg,#8b5cf6,#a78bfa)' }
      ],
      filters: [
        { id: 'priorityFilter', label: 'Prioritas', options: ['Semua','High','Medium','Low'] },
        { id: 'statusFilter', label: 'Status', options: ['Semua','Suggested','In PR','In PO','Fulfilled','Ignored'] }
      ],
      hasDateFilter: false, chips: ['Semua', 'High', 'Medium', 'Low'],
      columns: [
        { key: 'product', label: 'Produk' }, { key: 'current', label: 'Stok', type: 'number' },
        { key: 'rop', label: 'ROP', type: 'number' }, { key: 'avgSales', label: 'Rata2 Sales', type: 'number' },
        { key: 'leadTime', label: 'Lead Time', type: 'number' }, { key: 'suggested', label: 'Saran Qty', type: 'number' },
        { key: 'priority', label: 'Prioritas', type: 'badge' }
      ],
      rows: [
        { product: 'Minyak Goreng 2L', current: 45, rop: 80, avgSales: 120, leadTime: 2, suggested: 100, priority: 'High' },
        { product: 'Rice Cooker 1.2L', current: 8, rop: 15, avgSales: 18, leadTime: 7, suggested: 25, priority: 'High' },
        { product: 'Vitamin C 500mg', current: 0, rop: 20, avgSales: 35, leadTime: 4, suggested: 50, priority: 'High' },
        { product: 'Susu Bayi 900g', current: 5, rop: 10, avgSales: 12, leadTime: 3, suggested: 20, priority: 'Medium' },
        { product: 'Kaos Polos Cotton', current: 240, rop: 30, avgSales: 40, leadTime: 5, suggested: 0, priority: 'Low' },
        { product: 'Beras Premium 5kg', current: 850, rop: 100, avgSales: 400, leadTime: 3, suggested: 0, priority: 'Low' }
      ]
    },
    backorders: {
      title: 'Backorder', desc: 'Manajemen order tertunda karena stok kosong', icon: 'fa-solid fa-circle-exclamation', hasCrud: false,
      cards: [
        { label: 'Backorder Aktif', value: '18', sub: 'order tertunda', icon: 'fa-solid fa-circle-exclamation', color: 'linear-gradient(135deg,#f59e0b,#fbbf24)' },
        { label: 'Menunggu PO', value: '12', sub: 'sudah di-purchase', icon: 'fa-solid fa-clock', color: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
        { label: 'Fulfilled', value: '24', sub: '30 hari', icon: 'fa-solid fa-circle-check', color: 'linear-gradient(135deg,#00AA5B,#34d399)' },
        { label: 'Total Nilai', value: 'Rp 28 jt', sub: 'backorder aktif', icon: 'fa-solid fa-money-bill-wave', color: 'linear-gradient(135deg,#8b5cf6,#a78bfa)' }
      ],
      filters: [
        { id: 'statusFilter', label: 'Status', options: ['Semua','Open','In Purchase','Fulfilled','Cancelled'] }
      ],
      hasDateFilter: true, chips: ['Semua', 'Open', 'In Purchase', 'Fulfilled', 'Cancelled'],
      columns: [
        { key: 'order', label: 'Kode Order' }, { key: 'product', label: 'Produk' }, { key: 'qty', label: 'Qty', type: 'number' },
        { key: 'po', label: 'Referensi PO' }, { key: 'status', label: 'Status', type: 'badge' }, { key: 'date', label: 'Tanggal' }
      ],
      rows: [
        { order: 'ORD-2026-0815-003', product: 'Rice Cooker 1.2L', qty: 2, po: 'PO-2026-015', status: 'In Purchase', date: '15 Agu 2026' },
        { order: 'ORD-2026-0815-004', product: 'Vitamin C 500mg', qty: 3, po: 'PO-2026-015', status: 'In Purchase', date: '15 Agu 2026' },
        { order: 'ORD-2026-0814-019', product: 'Minyak Goreng 2L', qty: 4, po: 'PO-2026-014', status: 'In Purchase', date: '14 Agu 2026' },
        { order: 'ORD-2026-0813-008', product: 'Susu Bayi 900g', qty: 1, po: '-', status: 'Open', date: '13 Agu 2026' },
        { order: 'ORD-2026-0812-003', product: 'Gula Pasir 1kg', qty: 5, po: 'PO-2026-012', status: 'Fulfilled', date: '12 Agu 2026' }
      ]
    },
    accounts: {
      title: 'Chart of Account', desc: 'Master akun akuntansi (COA)', icon: 'fa-solid fa-sitemap', hasCrud: true,
      cards: [
        { label: 'Total Akun', value: '34', sub: 'aktif', icon: 'fa-solid fa-sitemap', color: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
        { label: 'Aset', value: '8', sub: 'lancar + tetap', icon: 'fa-solid fa-building-columns', color: 'linear-gradient(135deg,#00AA5B,#34d399)' },
        { label: 'Liabilitas', value: '6', sub: 'termasuk LLP', icon: 'fa-solid fa-landmark', color: 'linear-gradient(135deg,#f59e0b,#fbbf24)' },
        { label: 'Pendapatan & Beban', value: '16', sub: 'laba rugi', icon: 'fa-solid fa-chart-line', color: 'linear-gradient(135deg,#8b5cf6,#a78bfa)' }
      ],
      filters: [
        { id: 'typeFilter', label: 'Tipe', options: ['Semua','Aset','Liabilitas','Ekuitas','Pendapatan','Beban'] }
      ],
      hasDateFilter: false, chips: ['Semua', 'Aset', 'Liabilitas', 'Ekuitas', 'Pendapatan', 'Beban'],
      columns: [
        { key: 'code', label: 'Kode' }, { key: 'name', label: 'Nama Akun' }, { key: 'type', label: 'Tipe', type: 'badge' },
        { key: 'balance', label: 'Normal' }, { key: 'status', label: 'Status', type: 'badge' }
      ],
      rows: [
        { code: '1-1100', name: 'Kas', type: 'Aset', balance: 'Debit', status: 'Aktif' },
        { code: '1-1200', name: 'Bank', type: 'Aset', balance: 'Debit', status: 'Aktif' },
        { code: '1-1400', name: 'Persediaan Barang', type: 'Aset', balance: 'Debit', status: 'Aktif' },
        { code: '2-1300', name: 'Liabilitas Poin', type: 'Liabilitas', balance: 'Kredit', status: 'Aktif' },
        { code: '4-1100', name: 'Pendapatan Penjualan', type: 'Pendapatan', balance: 'Kredit', status: 'Aktif' },
        { code: '5-1100', name: 'HPP (COGS)', type: 'Beban', balance: 'Debit', status: 'Aktif' }
      ],
      modalFields: [
        { key: 'code', label: 'Kode Akun', type: 'text' },
        { key: 'name', label: 'Nama Akun', type: 'text' },
        { key: 'type', label: 'Tipe', type: 'select', options: ['Aset','Liabilitas','Ekuitas','Pendapatan','Beban'] },
        { key: 'balance', label: 'Normal Balance', type: 'select', options: ['Debit','Kredit'] },
        { key: 'status', label: 'Status', type: 'select', options: ['Aktif','Nonaktif'] }
      ]
    },
    'journal-entries': {
      title: 'Jurnal', desc: 'Jurnal akuntansi otomatis & manual', icon: 'fa-solid fa-book', hasCrud: true,
      cards: [
        { label: 'Total Jurnal', value: '1.842', sub: 'bulan ini', icon: 'fa-solid fa-book', color: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
        { label: 'Otomatis', value: '1.790', sub: '97,2%', icon: 'fa-solid fa-robot', color: 'linear-gradient(135deg,#00AA5B,#34d399)' },
        { label: 'Manual', value: '52', sub: 'adjustment', icon: 'fa-solid fa-pen', color: 'linear-gradient(135deg,#f59e0b,#fbbf24)' },
        { label: 'Total Debit', value: 'Rp 685 jt', sub: 'balance OK', icon: 'fa-solid fa-scale-balanced', color: 'linear-gradient(135deg,#8b5cf6,#a78bfa)' }
      ],
      filters: [
        { id: 'typeFilter', label: 'Tipe', options: ['Semua','Topup','Order','Fee','Expired','Purchase','Adjustment'] }
      ],
      hasDateFilter: true, chips: ['Semua', 'Topup', 'Order', 'Fee', 'Expired', 'Purchase'],
      columns: [
        { key: 'no', label: 'No Jurnal' }, { key: 'desc', label: 'Deskripsi' }, { key: 'type', label: 'Tipe', type: 'badge' },
        { key: 'debit', label: 'Debit', type: 'currency' }, { key: 'credit', label: 'Kredit', type: 'currency' }, { key: 'date', label: 'Tanggal' }
      ],
      rows: [
        { no: 'JRN-2026-0815-001', desc: 'Top-up poin 100K - Budi', type: 'Topup', debit: 100000, credit: 0, date: '15 Agu 2026' },
        { no: 'JRN-2026-0815-002', desc: 'Order ORD-0815-001', type: 'Order', debit: 0, credit: 245000, date: '15 Agu 2026' },
        { no: 'JRN-2026-0815-003', desc: 'Fee split order ORD-0815-001', type: 'Fee', debit: 164150, credit: 80850, date: '15 Agu 2026' },
        { no: 'JRN-2026-0814-018', desc: 'Expired poin - Dewi', type: 'Expired', debit: 0, credit: 45000, date: '14 Agu 2026' },
        { no: 'JRN-2026-0814-019', desc: 'Stok masuk dari supplier', type: 'Purchase', debit: 500000, credit: 0, date: '14 Agu 2026' }
      ],
      modalFields: [
        { key: 'no', label: 'No Jurnal', type: 'text' },
        { key: 'desc', label: 'Deskripsi', type: 'text', full: true },
        { key: 'type', label: 'Tipe', type: 'select', options: ['Topup','Order','Fee','Expired','Purchase','Adjustment'] },
        { key: 'debit', label: 'Debit (Rp)', type: 'number' },
        { key: 'credit', label: 'Kredit (Rp)', type: 'number' }
      ]
    },
    'fee-configs': {
      title: 'Konfigurasi Fee', desc: 'Pengaturan persentase fee hub & pusat', icon: 'fa-solid fa-sliders', hasCrud: true,
      cards: [
        { label: 'Config Aktif', value: '1', sub: '67/33', icon: 'fa-solid fa-sliders', color: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
        { label: 'Fee Hub', value: '67%', sub: 'berlaku sejak 1 Jan 2026', icon: 'fa-solid fa-store', color: 'linear-gradient(135deg,#00AA5B,#34d399)' },
        { label: 'Fee Pusat', value: '33%', sub: 'berlaku sejak 1 Jan 2026', icon: 'fa-solid fa-building', color: 'linear-gradient(135deg,#8b5cf6,#a78bfa)' },
        { label: 'Histori Config', value: '4', sub: 'semua versi', icon: 'fa-solid fa-clock', color: 'linear-gradient(135deg,#f59e0b,#fbbf24)' }
      ],
      filters: [
        { id: 'statusFilter', label: 'Status', options: ['Semua','Aktif','Nonaktif'] }
      ],
      hasDateFilter: false, chips: ['Semua', 'Aktif', 'Nonaktif'],
      columns: [
        { key: 'name', label: 'Nama' }, { key: 'hubPercent', label: 'Hub %', type: 'percent' },
        { key: 'centralPercent', label: 'Pusat %', type: 'percent' }, { key: 'effective', label: 'Berlaku' },
        { key: 'status', label: 'Status', type: 'badge' }
      ],
      rows: [
        { name: 'Config 2026 (67/33)', hubPercent: 67, centralPercent: 33, effective: '01 Jan 2026', status: 'Aktif' },
        { name: 'Config 2025 (65/35)', hubPercent: 65, centralPercent: 35, effective: '01 Jan 2025', status: 'Nonaktif' },
        { name: 'Config 2024 (60/40)', hubPercent: 60, centralPercent: 40, effective: '01 Jul 2024', status: 'Nonaktif' },
        { name: 'Config Awal (50/50)', hubPercent: 50, centralPercent: 50, effective: '01 Jan 2024', status: 'Nonaktif' }
      ],
      modalFields: [
        { key: 'name', label: 'Nama Config', type: 'text' },
        { key: 'hubPercent', label: 'Fee Hub (%)', type: 'number' },
        { key: 'centralPercent', label: 'Fee Pusat (%)', type: 'number' },
        { key: 'effective', label: 'Tanggal Efektif', type: 'date' },
        { key: 'status', label: 'Status', type: 'select', options: ['Aktif','Nonaktif'] }
      ]
    },
    fee: {
      title: 'Laporan Fee', desc: 'Rekapitulasi fee per hub (67/33)', icon: 'fa-solid fa-hand-holding-dollar', hasCrud: false,
      cards: [
        { label: 'Fee Hub', value: 'Rp 412 jt', sub: 'bulan ini', icon: 'fa-solid fa-store', color: 'linear-gradient(135deg,#00AA5B,#34d399)' },
        { label: 'Fee Pusat', value: 'Rp 203 jt', sub: 'bulan ini', icon: 'fa-solid fa-building', color: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
        { label: 'Total Dibayar', value: 'Rp 316 jt', sub: 'payout bulan ini', icon: 'fa-solid fa-money-bill-wave', color: 'linear-gradient(135deg,#8b5cf6,#a78bfa)' },
        { label: 'Outstanding', value: 'Rp 96 jt', sub: 'belum dibayar', icon: 'fa-solid fa-clock', color: 'linear-gradient(135deg,#f59e0b,#fbbf24)' }
      ],
      charts: [
        { title: 'Fee per Hub', type: 'bar', labels: ['Jakarta Selatan','Bandung','Surabaya','Medan','Makassar'], data: [142, 98, 76, 54, 42], color: '#00AA5B' },
        { title: 'Fee per Bulan', type: 'line', labels: ['Mar','Apr','Mei','Jun','Jul','Agu'], data: [380, 402, 425, 455, 490, 512], color: '#3b82f6' }
      ],
      filters: [
        { id: 'hubFilter', label: 'Hub', options: ['Semua Hub','Jakarta Selatan','Bandung','Surabaya','Medan','Makassar'] },
        { id: 'statusFilter', label: 'Status', options: ['Semua','Calculated','Approved','Paid','Pending'] }
      ],
      hasDateFilter: true, chips: ['Semua', 'Calculated', 'Approved', 'Paid', 'Pending'],
      columns: [
        { key: 'hub', label: 'Hub' }, { key: 'order', label: 'Order', type: 'currency' },
        { key: 'hubFee', label: 'Fee Hub', type: 'currency' }, { key: 'centralFee', label: 'Fee Pusat', type: 'currency' },
        { key: 'payout', label: 'Payout', type: 'currency' }, { key: 'status', label: 'Status', type: 'badge' }
      ],
      rows: [
        { hub: 'Jakarta Selatan', order: 245000000, hubFee: 164150000, centralFee: 80850000, payout: 120000000, status: 'Approved' },
        { hub: 'Bandung', order: 182000000, hubFee: 121940000, centralFee: 60060000, payout: 80000000, status: 'Pending' },
        { hub: 'Surabaya', order: 156000000, hubFee: 104520000, centralFee: 51480000, payout: 104520000, status: 'Paid' },
        { hub: 'Medan', order: 98000000, hubFee: 65660000, centralFee: 32340000, payout: 0, status: 'Calculated' },
        { hub: 'Makassar', order: 72000000, hubFee: 48240000, centralFee: 23760000, payout: 12000000, status: 'Pending' }
      ]
    },
    'fee-payouts': {
      title: 'Fee Payout', desc: 'Pembayaran fee ke hub', icon: 'fa-solid fa-money-bill-wave', hasCrud: true,
      cards: [
        { label: 'Pending', value: '3', sub: 'payout', icon: 'fa-solid fa-clock', color: 'linear-gradient(135deg,#f59e0b,#fbbf24)' },
        { label: 'Approved', value: '2', sub: 'siap transfer', icon: 'fa-solid fa-circle-check', color: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
        { label: 'Paid', value: '6', sub: 'bulan ini', icon: 'fa-solid fa-money-bill-wave', color: 'linear-gradient(135deg,#00AA5B,#34d399)' },
        { label: 'Total Dibayar', value: 'Rp 316 jt', sub: 'bulan ini', icon: 'fa-solid fa-sack-dollar', color: 'linear-gradient(135deg,#8b5cf6,#a78bfa)' }
      ],
      filters: [
        { id: 'statusFilter', label: 'Status', options: ['Semua','Pending','Approved','Paid','Rejected'] },
        { id: 'hubFilter', label: 'Hub', options: ['Semua Hub','Jakarta Selatan','Bandung','Surabaya','Medan','Makassar'] }
      ],
      hasDateFilter: true, chips: ['Semua', 'Pending', 'Approved', 'Paid', 'Rejected'],
      columns: [
        { key: 'code', label: 'Kode' }, { key: 'hub', label: 'Hub' }, { key: 'amount', label: 'Nominal', type: 'currency' },
        { key: 'period', label: 'Periode' }, { key: 'status', label: 'Status', type: 'badge' }, { key: 'date', label: 'Tanggal' }
      ],
      rows: [
        { code: 'FP-2026-003', hub: 'Jakarta Selatan', amount: 120000000, period: 'Jul 2026', status: 'Approved', date: '15 Agu 2026' },
        { code: 'FP-2026-002', hub: 'Bandung', amount: 80000000, period: 'Jul 2026', status: 'Pending', date: '15 Agu 2026' },
        { code: 'FP-2026-001', hub: 'Surabaya', amount: 104520000, period: 'Jul 2026', status: 'Paid', date: '14 Agu 2026' },
        { code: 'FP-2026-004', hub: 'Makassar', amount: 12000000, period: 'Jul 2026', status: 'Paid', date: '13 Agu 2026' },
        { code: 'FP-2026-005', hub: 'Medan', amount: 50000000, period: 'Jun 2026', status: 'Rejected', date: '12 Agu 2026' }
      ],
      modalFields: [
        { key: 'code', label: 'Kode Payout', type: 'text' },
        { key: 'hub', label: 'Hub', type: 'select', options: ['Jakarta Selatan','Bandung','Surabaya','Medan','Makassar'] },
        { key: 'amount', label: 'Nominal (Rp)', type: 'number' },
        { key: 'period', label: 'Periode', type: 'text' },
        { key: 'status', label: 'Status', type: 'select', options: ['Pending','Approved','Paid','Rejected'] }
      ]
    },
    rabs: {
      title: 'RAB', desc: 'Rencana Anggaran Biaya per periode', icon: 'fa-solid fa-file-invoice-dollar', hasCrud: true,
      cards: [
        { label: 'Total RAB', value: '12', sub: 'semua tahun', icon: 'fa-solid fa-file-invoice-dollar', color: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
        { label: 'Draft', value: '3', sub: 'belum disubmit', icon: 'fa-solid fa-file-pen', color: 'linear-gradient(135deg,#94a3b8,#cbd5e1)' },
        { label: 'Approved', value: '7', sub: 'disetujui', icon: 'fa-solid fa-circle-check', color: 'linear-gradient(135deg,#00AA5B,#34d399)' },
        { label: 'Total Budget 2026', value: 'Rp 2,4 M', sub: 'semua RAB 2026', icon: 'fa-solid fa-sack-dollar', color: 'linear-gradient(135deg,#8b5cf6,#a78bfa)' }
      ],
      filters: [
        { id: 'yearFilter', label: 'Tahun', options: ['Semua','2026','2025','2024'] },
        { id: 'statusFilter', label: 'Status', options: ['Semua','Draft','Submitted','Approved','Rejected'] }
      ],
      hasDateFilter: false, chips: ['Semua', 'Draft', 'Submitted', 'Approved', 'Rejected'],
      columns: [
        { key: 'code', label: 'Kode' }, { key: 'title', label: 'Judul' }, { key: 'year', label: 'Tahun' },
        { key: 'budget', label: 'Budget', type: 'currency' }, { key: 'actual', label: 'Actual', type: 'currency' },
        { key: 'progress', label: 'Realisasi', type: 'progress' }, { key: 'status', label: 'Status', type: 'badge' }
      ],
      rows: [
        { code: 'RAB-2026-001', title: 'RAB Operasional Tahunan', year: '2026', budget: 840000000, actual: 612000000, progress: 73, status: 'Approved' },
        { code: 'RAB-2026-002', title: 'RAB Pengadaan Kendaraan', year: '2026', budget: 480000000, actual: 0, progress: 0, status: 'Draft' },
        { code: 'RAB-2026-003', title: 'RAB Marketing Q3', year: '2026', budget: 320000000, actual: 210000000, progress: 66, status: 'Approved' },
        { code: 'RAB-2025-001', title: 'RAB Operasional 2025', year: '2025', budget: 760000000, actual: 748000000, progress: 98, status: 'Approved' },
        { code: 'RAB-2024-002', title: 'RAB IT Infrastruktur', year: '2024', budget: 250000000, actual: 240000000, progress: 96, status: 'Rejected' }
      ],
      modalFields: [
        { key: 'code', label: 'Kode RAB', type: 'text' },
        { key: 'title', label: 'Judul', type: 'text' },
        { key: 'year', label: 'Tahun', type: 'text' },
        { key: 'budget', label: 'Budget (Rp)', type: 'number' },
        { key: 'status', label: 'Status', type: 'select', options: ['Draft','Submitted','Approved','Rejected'] }
      ]
    },
    'rab-actuals': {
      title: 'Realisasi RAB', desc: 'Realisasi real-time vs budget per akun', icon: 'fa-solid fa-chart-pie', hasCrud: false,
      cards: [
        { label: 'Total Realisasi', value: 'Rp 1,68 M', sub: 'YTD 2026', icon: 'fa-solid fa-chart-pie', color: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
        { label: 'Budget Terpakai', value: '70,2%', sub: 'dari total budget', icon: 'fa-solid fa-percent', color: 'linear-gradient(135deg,#f59e0b,#fbbf24)' },
        { label: 'Per Akun Tertinggi', value: 'HPP', sub: 'Rp 820 jt', icon: 'fa-solid fa-chart-column', color: 'linear-gradient(135deg,#00AA5B,#34d399)' },
        { label: 'Over Budget', value: '2 akun', sub: 'perlu perhatian', icon: 'fa-solid fa-triangle-exclamation', color: 'linear-gradient(135deg,#ef4444,#f87171)' }
      ],
      charts: [
        { title: 'Budget vs Actual per Akun', type: 'bar', labels: ['HPP','Kurir','Operasional','Gaji','Marketing'], budget: [820, 260, 180, 340, 80], actual: [612, 148, 62, 280, 54] },
        { title: 'Progres Realisasi', type: 'doughnut', labels: ['Terealisasi','Sisa'], data: [70, 30] }
      ],
      filters: [
        { id: 'yearFilter', label: 'Tahun', options: ['2026','2025'] },
        { id: 'acctFilter', label: 'Akun', options: ['Semua Akun','HPP','Kurir','Operasional','Gaji','Marketing'] }
      ],
      hasDateFilter: true, chips: ['Semua', 'HPP', 'Kurir', 'Operasional', 'Gaji', 'Marketing'],
      columns: [
        { key: 'account', label: 'Akun' }, { key: 'budget', label: 'Budget', type: 'currency' },
        { key: 'actual', label: 'Actual', type: 'currency' }, { key: 'progress', label: 'Realisasi', type: 'progress' },
        { key: 'status', label: 'Status', type: 'badge' }
      ],
      rows: [
        { account: 'HPP (COGS)', budget: 820000000, actual: 612000000, progress: 75, status: 'Normal' },
        { account: 'Beban Kurir', budget: 260000000, actual: 148000000, progress: 57, status: 'Normal' },
        { account: 'Beban Operasional', budget: 180000000, actual: 162000000, progress: 90, status: 'Over Budget' },
        { account: 'Beban Gaji', budget: 340000000, actual: 280000000, progress: 82, status: 'Normal' },
        { account: 'Beban Marketing', budget: 80000000, actual: 54000000, progress: 68, status: 'Normal' }
      ]
    },
    'accounting-reports': {
      title: 'Laporan Accounting', desc: 'Neraca, Laba Rugi, Arus Kas, PPN otomatis', icon: 'fa-solid fa-file-lines', hasCrud: false,
      cards: [
        { label: 'Total Aset', value: 'Rp 5,2 M', sub: 'per 15 Agu 2026', icon: 'fa-solid fa-building-columns', color: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
        { label: 'Total Liabilitas', value: 'Rp 1,9 M', sub: 'termasuk LLP Rp 1,89 M', icon: 'fa-solid fa-landmark', color: 'linear-gradient(135deg,#f59e0b,#fbbf24)' },
        { label: 'Laba Bersih', value: 'Rp 680 jt', sub: 'YTD 2026', icon: 'fa-solid fa-chart-line', color: 'linear-gradient(135deg,#00AA5B,#34d399)' },
        { label: 'PPN Keluaran', value: 'Rp 64 jt', sub: 'bulan ini', icon: 'fa-solid fa-percent', color: 'linear-gradient(135deg,#8b5cf6,#a78bfa)' }
      ],
      charts: [
        { title: 'Neraca (Aset vs Liabilitas)', type: 'doughnut', labels: ['Aset','Liabilitas','Ekuitas'], data: [52, 19, 29] },
        { title: 'Laba per Bulan', type: 'line', labels: ['Mar','Apr','Mei','Jun','Jul','Agu'], data: [72, 78, 84, 91, 96, 105], color: '#00AA5B' },
        { title: 'Pendapatan vs Beban', type: 'bar', labels: ['Pendapatan','Beban'], data: [968, 420], color: '#3b82f6' }
      ],
      filters: [
        { id: 'reportFilter', label: 'Laporan', options: ['Neraca','Laba Rugi','Arus Kas','Fee Report','Poin Liability','Realisasi RAB','PPN'] },
        { id: 'periodFilter', label: 'Periode', options: ['Bulan Ini','Kuartal Ini','Tahun Ini'] }
      ],
      hasDateFilter: true, chips: ['Semua', 'Neraca', 'Laba Rugi', 'Arus Kas', 'PPN'],
      columns: [
        { key: 'code', label: 'Kode' }, { key: 'type', label: 'Laporan', type: 'badge' }, { key: 'period', label: 'Periode' },
        { key: 'generated', label: 'Dibuat' }, { key: 'status', label: 'Status', type: 'badge' }
      ],
      rows: [
        { code: 'ACC-2026-0815-001', type: 'Neraca', period: 'Agu 2026', generated: '15 Agu 2026', status: 'Selesai' },
        { code: 'ACC-2026-0815-002', type: 'Laba Rugi', period: 'Agu 2026', generated: '15 Agu 2026', status: 'Selesai' },
        { code: 'ACC-2026-0815-003', type: 'Arus Kas', period: 'Agu 2026', generated: '15 Agu 2026', status: 'Selesai' },
        { code: 'ACC-2026-0815-004', type: 'PPN', period: 'Jul 2026', generated: '10 Agu 2026', status: 'Draft' },
        { code: 'ACC-2026-0814-001', type: 'Fee Report', period: 'Jul 2026', generated: '14 Agu 2026', status: 'Selesai' }
      ]
    },
    'tier-history': {
      title: 'Riwayat Tier', desc: 'Riwayat naik/turun tier membership', icon: 'fa-solid fa-arrow-trend-up', hasCrud: false,
      cards: [
        { label: 'Total Perubahan', value: '486', sub: '30 hari', icon: 'fa-solid fa-arrow-trend-up', color: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
        { label: 'Upgrade', value: '342', sub: '70,4%', icon: 'fa-solid fa-arrow-trend-up', color: 'linear-gradient(135deg,#00AA5B,#34d399)' },
        { label: 'Downgrade', value: '98', sub: '20,2%', icon: 'fa-solid fa-arrow-trend-down', color: 'linear-gradient(135deg,#ef4444,#f87171)' },
        { label: 'Promosi Manual', value: '46', sub: '9,4%', icon: 'fa-solid fa-star', color: 'linear-gradient(135deg,#f59e0b,#fbbf24)' }
      ],
      filters: [
        { id: 'reasonFilter', label: 'Alasan', options: ['Semua','Auto Upgrade','Auto Downgrade','Manual','Promotion'] }
      ],
      hasDateFilter: true, chips: ['Semua', 'Auto Upgrade', 'Auto Downgrade', 'Manual', 'Promotion'],
      columns: [
        { key: 'customer', label: 'Customer' }, { key: 'from', label: 'Dari Tier' }, { key: 'to', label: 'Ke Tier' },
        { key: 'reason', label: 'Alasan', type: 'badge' }, { key: 'date', label: 'Tanggal' }
      ],
      rows: [
        { customer: 'Andi Wijaya', from: 'Gold', to: 'Platinum', reason: 'Auto Upgrade', date: '15 Agu 2026' },
        { customer: 'Budi Santoso', from: 'Silver', to: 'Gold', reason: 'Auto Upgrade', date: '15 Agu 2026' },
        { customer: 'Dewi Lestari', from: 'Gold', to: 'Silver', reason: 'Auto Downgrade', date: '14 Agu 2026' },
        { customer: 'Maya Anggraini', from: 'Bronze', to: 'Silver', reason: 'Promotion', date: '14 Agu 2026' },
        { customer: 'Rudi Hartono', from: 'Silver', to: 'Bronze', reason: 'Manual', date: '13 Agu 2026' }
      ]
    },
    'reward-redemptions': {
      title: 'Klaim Reward', desc: 'Riwayat klaim reward customer', icon: 'fa-solid fa-gift', hasCrud: true,
      cards: [
        { label: 'Total Klaim', value: '1.284', sub: 'semua reward', icon: 'fa-solid fa-gift', color: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
        { label: 'Pending', value: '18', sub: 'perlu diproses', icon: 'fa-solid fa-clock', color: 'linear-gradient(135deg,#f59e0b,#fbbf24)' },
        { label: 'Processed', value: '1.248', sub: '97,2% selesai', icon: 'fa-solid fa-circle-check', color: 'linear-gradient(135deg,#00AA5B,#34d399)' },
        { label: 'Total Poin Terpakai', value: 'Rp 84 jt', sub: 'semua klaim', icon: 'fa-solid fa-coins', color: 'linear-gradient(135deg,#8b5cf6,#a78bfa)' }
      ],
      filters: [
        { id: 'statusFilter', label: 'Status', options: ['Semua','Pending','Processed','Shipped','Completed','Cancelled'] }
      ],
      hasDateFilter: true, chips: ['Semua', 'Pending', 'Processed', 'Shipped', 'Completed', 'Cancelled'],
      columns: [
        { key: 'code', label: 'Kode' }, { key: 'customer', label: 'Customer' }, { key: 'reward', label: 'Reward' },
        { key: 'points', label: 'Poin', type: 'points' }, { key: 'status', label: 'Status', type: 'badge' }, { key: 'date', label: 'Tanggal' }
      ],
      rows: [
        { code: 'RD-2026-0815-001', customer: 'Budi Santoso', reward: 'Voucher Belanja 50K', points: 55000, status: 'Processed', date: '15 Agu 2026' },
        { code: 'RD-2026-0815-002', customer: 'Siti Rahayu', reward: 'Paket Sembako Hemat', points: 115000, status: 'Pending', date: '15 Agu 2026' },
        { code: 'RD-2026-0814-001', customer: 'Andi Wijaya', reward: 'Voucher Pulsa 25K', points: 27500, status: 'Completed', date: '14 Agu 2026' },
        { code: 'RD-2026-0814-002', customer: 'Dewi Lestari', reward: 'Voucher Belanja 50K', points: 55000, status: 'Cancelled', date: '14 Agu 2026' },
        { code: 'RD-2026-0813-001', customer: 'Maya Anggraini', reward: 'Paket Sembako Hemat', points: 115000, status: 'Shipped', date: '13 Agu 2026' }
      ],
      modalFields: [
        { key: 'code', label: 'Kode Redemption', type: 'text' },
        { key: 'customer', label: 'Customer', type: 'text' },
        { key: 'reward', label: 'Reward', type: 'text' },
        { key: 'points', label: 'Poin', type: 'number' },
        { key: 'status', label: 'Status', type: 'select', options: ['Pending','Processed','Shipped','Completed','Cancelled'] }
      ]
    },
    'sales-targets': {
      title: 'Target Penjualan', desc: 'Target vs realisasi penjualan per periode', icon: 'fa-solid fa-bullseye', hasCrud: true,
      cards: [
        { label: 'Target 2026', value: 'Rp 8,2 M', sub: 'tahunan', icon: 'fa-solid fa-bullseye', color: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
        { label: 'Realisasi YTD', value: 'Rp 4,1 M', sub: '50,1%', icon: 'fa-solid fa-circle-check', color: 'linear-gradient(135deg,#00AA5B,#34d399)' },
        { label: 'Target Bulan Ini', value: 'Rp 720 jt', sub: 'Agustus 2026', icon: 'fa-solid fa-calendar', color: 'linear-gradient(135deg,#f59e0b,#fbbf24)' },
        { label: 'Realisasi Bulan Ini', value: 'Rp 685 jt', sub: '95,2% dari target', icon: 'fa-solid fa-gauge-high', color: 'linear-gradient(135deg,#8b5cf6,#a78bfa)' }
      ],
      charts: [
        { title: 'Target vs Realisasi (2026)', type: 'bar', labels: ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu'], target: [520, 540, 560, 580, 600, 620, 640, 720], actual: [480, 510, 535, 555, 580, 605, 630, 685] }
      ],
      filters: [
        { id: 'yearFilter', label: 'Tahun', options: ['2026','2025'] },
        { id: 'hubFilter', label: 'Hub', options: ['Semua Hub','Jakarta Selatan','Bandung','Surabaya','Medan','Makassar'] }
      ],
      hasDateFilter: true, chips: ['Semua', 'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu'],
      columns: [
        { key: 'period', label: 'Periode' }, { key: 'hub', label: 'Hub' }, { key: 'target', label: 'Target', type: 'currency' },
        { key: 'actual', label: 'Realisasi', type: 'currency' }, { key: 'progress', label: 'Pencapaian', type: 'progress' }
      ],
      rows: [
        { period: 'Agu 2026', hub: 'Jakarta Selatan', target: 220000000, actual: 212000000, progress: 96 },
        { period: 'Agu 2026', hub: 'Bandung', target: 160000000, actual: 158000000, progress: 99 },
        { period: 'Agu 2026', hub: 'Surabaya', target: 140000000, actual: 131000000, progress: 94 },
        { period: 'Agu 2026', hub: 'Medan', target: 100000000, actual: 92000000, progress: 92 },
        { period: 'Agu 2026', hub: 'Makassar', target: 80000000, actual: 92000000, progress: 115 }
      ],
      modalFields: [
        { key: 'period', label: 'Periode', type: 'text' },
        { key: 'hub', label: 'Hub', type: 'select', options: ['Jakarta Selatan','Bandung','Surabaya','Medan','Makassar'] },
        { key: 'target', label: 'Target (Rp)', type: 'number' },
        { key: 'actual', label: 'Realisasi (Rp)', type: 'number' }
      ]
    },
    'loyalty-events': {
      title: 'Loyalty Event', desc: 'Event bonus poin / cashback / multiplier', icon: 'fa-solid fa-fire', hasCrud: true,
      cards: [
        { label: 'Event Aktif', value: '3', sub: 'berjalan', icon: 'fa-solid fa-fire', color: 'linear-gradient(135deg,#ef4444,#f87171)' },
        { label: 'Akan Datang', value: '2', sub: 'terjadwal', icon: 'fa-solid fa-calendar', color: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
        { label: 'Selesai', value: '8', sub: '30 hari', icon: 'fa-solid fa-circle-check', color: 'linear-gradient(135deg,#00AA5B,#34d399)' },
        { label: 'Total Poin Bonus', value: 'Rp 24 jt', sub: 'karena event', icon: 'fa-solid fa-coins', color: 'linear-gradient(135deg,#8b5cf6,#a78bfa)' }
      ],
      filters: [
        { id: 'typeFilter', label: 'Tipe', options: ['Semua','Bonus Points','Cashback','Multiplier','Special Discount'] },
        { id: 'statusFilter', label: 'Status', options: ['Semua','Aktif','Nonaktif'] }
      ],
      hasDateFilter: true, chips: ['Semua', 'Aktif', 'Nonaktif', 'Selesai'],
      columns: [
        { key: 'code', label: 'Kode' }, { key: 'name', label: 'Nama Event' }, { key: 'type', label: 'Tipe', type: 'badge' },
        { key: 'value', label: 'Nilai' }, { key: 'start', label: 'Mulai' }, { key: 'end', label: 'Selesai' },
        { key: 'status', label: 'Status', type: 'badge' }
      ],
      rows: [
        { code: 'EV-2026-003', name: 'HUT Jastip ke-2', type: 'Cashback', value: '5%', start: '01 Agu 2026', end: '31 Agu 2026', status: 'Aktif' },
        { code: 'EV-2026-004', name: 'Poin 2x Akhir Pekan', type: 'Multiplier', value: '2x', start: '01 Agu 2026', end: '31 Des 2026', status: 'Aktif' },
        { code: 'EV-2026-005', name: 'Bonus 100 Pts Sembako', type: 'Bonus Points', value: '100 poin', start: '15 Agu 2026', end: '30 Sep 2026', status: 'Aktif' },
        { code: 'EV-2026-001', name: 'Ramadhan Berkah', type: 'Special Discount', value: '15%', start: '01 Mar 2026', end: '30 Apr 2026', status: 'Nonaktif' },
        { code: 'EV-2026-002', name: 'Lebaran Cashback', type: 'Cashback', value: '8%', start: '01 Jun 2026', end: '30 Jun 2026', status: 'Nonaktif' }
      ],
      modalFields: [
        { key: 'code', label: 'Kode Event', type: 'text' },
        { key: 'name', label: 'Nama Event', type: 'text' },
        { key: 'type', label: 'Tipe', type: 'select', options: ['Bonus Points','Cashback','Multiplier','Special Discount'] },
        { key: 'value', label: 'Nilai', type: 'text' },
        { key: 'start', label: 'Tanggal Mulai', type: 'date' },
        { key: 'end', label: 'Tanggal Selesai', type: 'date' },
        { key: 'status', label: 'Status', type: 'select', options: ['Aktif','Nonaktif'] }
      ]
    },
    complaints: {
      title: 'Semua Komplain', desc: 'Kelola seluruh komplain customer', icon: 'fa-solid fa-comments', hasCrud: true,
      cards: [
        { label: 'Total Komplain', value: '486', sub: 'bulan ini', icon: 'fa-solid fa-comments', color: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
        { label: 'Open', value: '23', sub: 'belum ditangani', icon: 'fa-solid fa-circle-exclamation', color: 'linear-gradient(135deg,#ef4444,#f87171)' },
        { label: 'In Progress', value: '42', sub: 'sedang ditindaklanjuti', icon: 'fa-solid fa-spinner', color: 'linear-gradient(135deg,#f59e0b,#fbbf24)' },
        { label: 'Resolved', value: '421', sub: '86,6% selesai', icon: 'fa-solid fa-circle-check', color: 'linear-gradient(135deg,#00AA5B,#34d399)' }
      ],
      filters: [
        { id: 'statusFilter', label: 'Status', options: ['Semua','Open','In Progress','Resolved','Closed'] },
        { id: 'catFilter', label: 'Kategori', options: ['Semua','Product','Delivery','Payment','Points','Service','Other'] },
        { id: 'priorityFilter', label: 'Prioritas', options: ['Semua','Low','Medium','High','Urgent'] }
      ],
      hasDateFilter: true, chips: ['Semua', 'Open', 'In Progress', 'Resolved', 'Urgent'],
      columns: [
        { key: 'code', label: 'Kode' }, { key: 'customer', label: 'Customer' }, { key: 'category', label: 'Kategori', type: 'badge' },
        { key: 'subject', label: 'Subjek' }, { key: 'priority', label: 'Prioritas', type: 'badge' },
        { key: 'cs', label: 'CS' }, { key: 'status', label: 'Status', type: 'badge' }
      ],
      rows: [
        { code: 'CMP-2026-0001', customer: 'Budi Santoso', category: 'Delivery', subject: 'Paket belum sampai 3 hari', priority: 'Urgent', cs: 'Rina CS', status: 'In Progress' },
        { code: 'CMP-2026-0002', customer: 'Siti Rahayu', category: 'Product', subject: 'Barang rusak saat tiba', priority: 'High', cs: 'Rina CS', status: 'Resolved' },
        { code: 'CMP-2026-0003', customer: 'Andi Wijaya', category: 'Payment', subject: 'Poin belum masuk', priority: 'Medium', cs: '-', status: 'Open' },
        { code: 'CMP-2026-0004', customer: 'Dewi Lestari', category: 'Points', subject: 'Poin expired tidak wajar', priority: 'Low', cs: 'Rina CS', status: 'Closed' },
        { code: 'CMP-2026-0005', customer: 'Rudi Hartono', category: 'Service', subject: 'CS kurang responsif', priority: 'Medium', cs: 'Budi CS', status: 'In Progress' }
      ],
      modalFields: [
        { key: 'code', label: 'Kode Komplain', type: 'text' },
        { key: 'customer', label: 'Customer', type: 'text' },
        { key: 'category', label: 'Kategori', type: 'select', options: ['Product','Delivery','Payment','Points','Service','Other'] },
        { key: 'subject', label: 'Subjek', type: 'text', full: true },
        { key: 'priority', label: 'Prioritas', type: 'select', options: ['Low','Medium','High','Urgent'] },
        { key: 'cs', label: 'CS', type: 'text' },
        { key: 'status', label: 'Status', type: 'select', options: ['Open','In Progress','Resolved','Closed'] }
      ]
    },
    'complaint-slas': {
      title: 'SLA Komplain', desc: 'Target respons & resolusi SLA', icon: 'fa-solid fa-stopwatch', hasCrud: true,
      cards: [
        { label: 'Urgent', value: '4 jam', sub: 'target respons', icon: 'fa-solid fa-stopwatch', color: 'linear-gradient(135deg,#ef4444,#f87171)' },
        { label: 'High', value: '8 jam', sub: 'target respons', icon: 'fa-solid fa-stopwatch', color: 'linear-gradient(135deg,#f59e0b,#fbbf24)' },
        { label: 'Medium', value: '24 jam', sub: 'target respons', icon: 'fa-solid fa-stopwatch', color: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
        { label: 'Low', value: '48 jam', sub: 'target respons', icon: 'fa-solid fa-stopwatch', color: 'linear-gradient(135deg,#94a3b8,#cbd5e1)' }
      ],
      filters: [
        { id: 'priorityFilter', label: 'Prioritas', options: ['Semua','Low','Medium','High','Urgent'] }
      ],
      hasDateFilter: false, chips: ['Semua', 'Low', 'Medium', 'High', 'Urgent'],
      columns: [
        { key: 'priority', label: 'Prioritas', type: 'badge' }, { key: 'responseHours', label: 'Respons (jam)', type: 'number' },
        { key: 'resolveHours', label: 'Resolusi (jam)', type: 'number' }, { key: 'escalateAfter', label: 'Eskalasi setelah' },
        { key: 'status', label: 'Status', type: 'badge' }
      ],
      rows: [
        { priority: 'Urgent', responseHours: 4, resolveHours: 24, escalateAfter: '4 jam', status: 'Aktif' },
        { priority: 'High', responseHours: 8, resolveHours: 48, escalateAfter: '8 jam', status: 'Aktif' },
        { priority: 'Medium', responseHours: 24, resolveHours: 72, escalateAfter: '24 jam', status: 'Aktif' },
        { priority: 'Low', responseHours: 48, resolveHours: 120, escalateAfter: '48 jam', status: 'Aktif' }
      ],
      modalFields: [
        { key: 'priority', label: 'Prioritas', type: 'select', options: ['Low','Medium','High','Urgent'] },
        { key: 'responseHours', label: 'Target Respons (jam)', type: 'number' },
        { key: 'resolveHours', label: 'Target Resolusi (jam)', type: 'number' },
        { key: 'escalateAfter', label: 'Eskalasi setelah', type: 'text' },
        { key: 'status', label: 'Status', type: 'select', options: ['Aktif','Nonaktif'] }
      ]
    },
    'complaint-escalations': {
      title: 'Eskalasi Komplain', desc: 'Eskalasi otomatis komplain lampaui SLA', icon: 'fa-solid fa-level-up-alt', hasCrud: false,
      cards: [
        { label: 'Eskalasi Aktif', value: '4', sub: 'perlu tindakan', icon: 'fa-solid fa-level-up-alt', color: 'linear-gradient(135deg,#ef4444,#f87171)' },
        { label: 'Level 1', value: '2', sub: 'Supervisor', icon: 'fa-solid fa-user-tie', color: 'linear-gradient(135deg,#f59e0b,#fbbf24)' },
        { label: 'Level 2', value: '1', sub: 'Manajer CS', icon: 'fa-solid fa-briefcase', color: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
        { label: 'Level 3', value: '1', sub: 'Direktur', icon: 'fa-solid fa-crown', color: 'linear-gradient(135deg,#8b5cf6,#a78bfa)' }
      ],
      filters: [
        { id: 'levelFilter', label: 'Level', options: ['Semua','Level 1','Level 2','Level 3'] },
        { id: 'statusFilter', label: 'Status', options: ['Semua','Aktif','Resolved'] }
      ],
      hasDateFilter: true, chips: ['Semua', 'Level 1', 'Level 2', 'Level 3'],
      columns: [
        { key: 'code', label: 'Kode' }, { key: 'complaint', label: 'Komplain' }, { key: 'customer', label: 'Customer' },
        { key: 'level', label: 'Level', type: 'badge' }, { key: 'escalatedTo', label: 'Eskalasi ke' },
        { key: 'reason', label: 'Alasan' }, { key: 'status', label: 'Status', type: 'badge' }
      ],
      rows: [
        { code: 'ESC-2026-001', complaint: 'CMP-2026-0001', customer: 'Budi Santoso', level: 'Level 2', escalatedTo: 'Manajer CS', reason: 'Melebihi SLA', status: 'Aktif' },
        { code: 'ESC-2026-002', complaint: 'CMP-2026-0006', customer: 'Tono Wibowo', level: 'Level 1', escalatedTo: 'Supervisor', reason: 'Permintaan customer', status: 'Aktif' },
        { code: 'ESC-2026-003', complaint: 'CMP-2026-0003', customer: 'Andi Wijaya', level: 'Level 3', escalatedTo: 'Direktur', reason: 'Klaim besar', status: 'Aktif' },
        { code: 'ESC-2026-004', complaint: 'CMP-2026-0008', customer: 'Sari Dewi', level: 'Level 1', escalatedTo: 'Supervisor', reason: 'Melebihi SLA', status: 'Resolved' },
        { code: 'ESC-2026-005', complaint: 'CMP-2026-0009', customer: 'Joko Susilo', level: 'Level 2', escalatedTo: 'Manajer CS', reason: 'Komplain berulang', status: 'Resolved' }
      ]
    },
    'email-templates': {
      title: 'Template Email', desc: 'CRUD template email per transaksi', icon: 'fa-solid fa-envelope-open-text', hasCrud: true,
      cards: [
        { label: 'Total Template', value: '18', sub: '10 customer + 8 hub', icon: 'fa-solid fa-envelope-open-text', color: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
        { label: 'Customer', value: '10', sub: 'template customer', icon: 'fa-solid fa-user', color: 'linear-gradient(135deg,#00AA5B,#34d399)' },
        { label: 'Hub', value: '8', sub: 'template hub', icon: 'fa-solid fa-store', color: 'linear-gradient(135deg,#8b5cf6,#a78bfa)' },
        { label: 'Aktif', value: '18', sub: 'semua aktif', icon: 'fa-solid fa-circle-check', color: 'linear-gradient(135deg,#f59e0b,#fbbf24)' }
      ],
      filters: [
        { id: 'recipientFilter', label: 'Penerima', options: ['Semua','Customer','Hub','Superadmin'] },
        { id: 'statusFilter', label: 'Status', options: ['Semua','Aktif','Nonaktif'] }
      ],
      hasDateFilter: false, chips: ['Semua', 'Customer', 'Hub', 'Superadmin'],
      columns: [
        { key: 'code', label: 'Kode' }, { key: 'name', label: 'Nama' }, { key: 'recipient', label: 'Penerima', type: 'badge' },
        { key: 'subject', label: 'Subjek' }, { key: 'status', label: 'Status', type: 'badge' }
      ],
      rows: [
        { code: 'order_confirmed', name: 'Pesanan Diterima', recipient: 'Customer', subject: '✅ Pesanan #ORD-xxx Diterima', status: 'Aktif' },
        { code: 'payment_received', name: 'Pembayaran Berhasil', recipient: 'Customer', subject: '💳 Pembayaran #ORD-xxx Berhasil', status: 'Aktif' },
        { code: 'order_shipped', name: 'Order Dikirim', recipient: 'Customer', subject: '🚚 Pesanan #ORD-xxx Dalam Perjalanan', status: 'Aktif' },
        { code: 'topup_success', name: 'Top-up Poin Berhasil', recipient: 'Customer', subject: '💰 Top-Up Poin Berhasil', status: 'Aktif' },
        { code: 'stock_low_alert', name: 'Stok Menipis', recipient: 'Hub', subject: '⚠️ Stok Menipis: [Produk]', status: 'Aktif' },
        { code: 'fee_report', name: 'Laporan Fee Bulanan', recipient: 'Hub', subject: '📊 Laporan Fee Bulan Ini', status: 'Aktif' },
        { code: 'complaint_new_hub', name: 'Komplain Baru di Hub', recipient: 'Hub', subject: '📩 Komplain Baru di Hub Anda', status: 'Aktif' },
        { code: 'weekly_sales', name: 'Ringkasan Penjualan', recipient: 'Hub', subject: '📈 Ringkasan Penjualan Mingguan', status: 'Aktif' }
      ],
      modalFields: [
        { key: 'code', label: 'Kode Template', type: 'text' },
        { key: 'name', label: 'Nama Template', type: 'text' },
        { key: 'recipient', label: 'Penerima', type: 'select', options: ['Customer','Hub','Superadmin'] },
        { key: 'subject', label: 'Subjek Email', type: 'text', full: true },
        { key: 'status', label: 'Status', type: 'select', options: ['Aktif','Nonaktif'] }
      ]
    },
    'email-logs': {
      title: 'Log Email', desc: 'Riwayat pengiriman email', icon: 'fa-solid fa-list-check', hasCrud: false,
      cards: [
        { label: 'Total Terkirim', value: '18.420', sub: '30 hari', icon: 'fa-solid fa-paper-plane', color: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
        { label: 'Sent', value: '18.120', sub: '98,4%', icon: 'fa-solid fa-circle-check', color: 'linear-gradient(135deg,#00AA5B,#34d399)' },
        { label: 'Failed', value: '218', sub: '1,2%', icon: 'fa-solid fa-circle-xmark', color: 'linear-gradient(135deg,#ef4444,#f87171)' },
        { label: 'Opened', value: '12.480', sub: '68,8% open rate', icon: 'fa-solid fa-envelope-open', color: 'linear-gradient(135deg,#8b5cf6,#a78bfa)' }
      ],
      filters: [
        { id: 'statusFilter', label: 'Status', options: ['Semua','Pending','Sent','Failed','Opened'] },
        { id: 'templateFilter', label: 'Template', options: ['Semua','order_confirmed','payment_received','order_shipped','topup_success','stock_low_alert'] }
      ],
      hasDateFilter: true, chips: ['Semua', 'Sent', 'Failed', 'Opened', 'Pending'],
      columns: [
        { key: 'to', label: 'Penerima' }, { key: 'template', label: 'Template', type: 'badge' }, { key: 'subject', label: 'Subjek' },
        { key: 'status', label: 'Status', type: 'badge' }, { key: 'sentAt', label: 'Terkirim' }, { key: 'openedAt', label: 'Dibuka' }
      ],
      rows: [
        { to: 'budi@gmail.com', template: 'order_confirmed', subject: '✅ Pesanan #ORD-2026-0815-001 Diterima', status: 'Opened', sentAt: '15 Agu 09:00', openedAt: '15 Agu 09:05' },
        { to: 'siti@gmail.com', template: 'payment_received', subject: '💳 Pembayaran #ORD-2026-0815-002 Berhasil', status: 'Sent', sentAt: '15 Agu 09:10', openedAt: '-' },
        { to: 'hub@jastip.id', template: 'stock_low_alert', subject: '⚠️ Stok Menipis: Minyak Goreng 2L', status: 'Opened', sentAt: '15 Agu 08:00', openedAt: '15 Agu 08:15' },
        { to: 'dewi@gmail.com', template: 'topup_success', subject: '💰 Top-Up Poin Berhasil', status: 'Failed', sentAt: '14 Agu 20:00', openedAt: '-' },
        { to: 'andi@gmail.com', template: 'order_shipped', subject: '🚚 Pesanan #ORD-2026-0815-003 Dalam Perjalanan', status: 'Opened', sentAt: '15 Agu 10:00', openedAt: '15 Agu 10:30' }
      ]
    },
    'tax-configs': {
      title: 'Konfigurasi PPN', desc: 'Pengaturan pajak PPN', icon: 'fa-solid fa-scale-balanced', hasCrud: true,
      cards: [
        { label: 'PPN Aktif', value: '11%', sub: 'berlaku sejak 2025', icon: 'fa-solid fa-percent', color: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
        { label: 'Total Config', value: '3', sub: 'riwayat perubahan', icon: 'fa-solid fa-sliders', color: 'linear-gradient(135deg,#00AA5B,#34d399)' },
        { label: 'PPN Keluaran (bln ini)', value: 'Rp 64 jt', sub: 'penjualan', icon: 'fa-solid fa-arrow-up', color: 'linear-gradient(135deg,#f59e0b,#fbbf24)' },
        { label: 'PPN Masukan (bln ini)', value: 'Rp 38 jt', sub: 'pembelian', icon: 'fa-solid fa-arrow-down', color: 'linear-gradient(135deg,#8b5cf6,#a78bfa)' }
      ],
      filters: [
        { id: 'statusFilter', label: 'Status', options: ['Semua','Aktif','Nonaktif'] }
      ],
      hasDateFilter: false, chips: ['Semua', 'Aktif', 'Nonaktif'],
      columns: [
        { key: 'name', label: 'Nama' }, { key: 'rate', label: 'Tarif', type: 'percent' },
        { key: 'effective', label: 'Berlaku' }, { key: 'status', label: 'Status', type: 'badge' }
      ],
      rows: [
        { name: 'PPN Standar 2025', rate: 11, effective: '01 Jan 2025', status: 'Aktif' },
        { name: 'PPN Standar 2022', rate: 11, effective: '01 Apr 2022', status: 'Nonaktif' },
        { name: 'PPN Lama 2020', rate: 10, effective: '01 Jul 2020', status: 'Nonaktif' }
      ],
      modalFields: [
        { key: 'name', label: 'Nama Config', type: 'text' },
        { key: 'rate', label: 'Tarif PPN (%)', type: 'number' },
        { key: 'effective', label: 'Tanggal Efektif', type: 'date' },
        { key: 'status', label: 'Status', type: 'select', options: ['Aktif','Nonaktif'] }
      ]
    }
  };

  // Merge MODULES + MODULES_DEFS
  Object.keys(MODULES_DEFS).forEach(function (key) {
    MODULES[key] = MODULES[key] || MODULES_DEFS[key];
  });

  /* ============================================================
     HELPER API — localStorage CRUD
     ============================================================ */
  var STORE_PREFIX = 'jastip_sa_';

  function getModule(id) {
    if (!MODULES[id]) {
      // fallback: buat modul generik agar halaman tidak error
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
  window.JastipSuperadminData = {
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