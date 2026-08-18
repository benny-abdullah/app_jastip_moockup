/* ============================================================
   GENERATOR HALAMAN SUPERADMIN
   Membaca dashboard/superadmin/_template.html dan membuat
   68 halaman HTML di dashboard/superadmin/ berdasarkan daftar
   modul yang terdaftar di js/superadmin-data.js.
   Jalankan: node tools/generate-superadmin.js
   ============================================================ */

const fs = require('fs');
const path = require('path');

const TEMPLATE_PATH = path.join(__dirname, '..', 'dashboard', 'superadmin', '_template.html');
const OUT_DIR = path.join(__dirname, '..', 'dashboard', 'superadmin');

// Daftar modul: [namaFile, judul]
const MODULES = [
  ['dashboard', 'Dashboard Utama'],
  ['dashboard-sales', 'Dashboard Sales'],
  ['dashboard-warehouse-internal', 'Dashboard Warehouse Internal'],
  ['dashboard-warehouse-external', 'Dashboard Warehouse External'],
  ['dashboard-rabs', 'Dashboard RAB'],
  ['dashboard-points-balance', 'Dashboard Points Balance'],
  ['dashboard-fee', 'Dashboard Fee'],
  ['dashboard-accounting', 'Dashboard Accounting'],
  ['categories', 'Kategori'],
  ['products', 'Produk & Varian'],
  ['hubs', 'Hub'],
  ['customers', 'Customer'],
  ['membership-tiers', 'Membership & Tier'],
  ['rewards', 'Reward'],
  ['promos', 'Promo / Event'],
  ['suppliers', 'Supplier'],
  ['payment-methods', 'Metode Pembayaran'],
  ['users', 'User & Role'],
  ['point-transactions', 'Riwayat Transaksi Poin'],
  ['point-expiry-rules', 'Aturan Kadaluarsa Poin'],
  ['payments', 'Transaksi Payment'],
  ['payment-refunds', 'Payment Refund'],
  ['payment-installments', 'Payment Installment'],
  ['payment-reconciliation', 'Payment Reconciliation'],
  ['payment-webhooks', 'Payment Webhook Log'],
  ['subscription-plans', 'Paket Langganan'],
  ['subscription-plan-items', 'Isi Paket Langganan'],
  ['subscription-management', 'Kelola Langganan'],
  ['subscription-failures', 'Subscription Gagal Bayar'],
  ['billing-attempts', 'Percobaan Tagihan'],
  ['warehouses', 'Gudang (Warehouse)'],
  ['warehouse-locations', 'Lokasi / Bin'],
  ['stock-bins', 'Stok per Bin'],
  ['stock-movements', 'Mutasi Stok'],
  ['product-batches', 'Batch / FEFO'],
  ['putaway', 'Put-away'],
  ['receiving', 'Receiving + QC'],
  ['picking', 'Picking'],
  ['packing', 'Packing'],
  ['stock-opname', 'Stock Opname'],
  ['replenishment', 'Replenishment'],
  ['barcode-labels', 'Barcode Label'],
  ['warehouse-reports', 'Laporan WMS'],
  ['purchase-requests', 'Purchase Request'],
  ['purchase-request-approval', 'Approval PR'],
  ['purchase-orders', 'Purchase Order'],
  ['po-eta-dashboard', 'ETA Dashboard'],
  ['supplier-performance', 'Supplier Performance'],
  ['replenishment-suggestions', 'Replenishment Suggestion'],
  ['backorders', 'Backorder'],
  ['accounts', 'Chart of Account'],
  ['journal-entries', 'Jurnal'],
  ['fee-configs', 'Konfigurasi Fee'],
  ['fee', 'Laporan Fee'],
  ['fee-payouts', 'Fee Payout'],
  ['rabs', 'RAB'],
  ['rab-actuals', 'Realisasi RAB'],
  ['accounting-reports', 'Laporan Accounting'],
  ['tier-history', 'Riwayat Tier'],
  ['reward-redemptions', 'Klaim Reward'],
  ['sales-targets', 'Target Penjualan'],
  ['loyalty-events', 'Loyalty Event'],
  ['complaints', 'Semua Komplain'],
  ['complaint-slas', 'SLA Komplain'],
  ['complaint-escalations', 'Eskalasi Komplain'],
  ['email-templates', 'Template Email'],
  ['email-logs', 'Log Email'],
  ['tax-configs', 'Konfigurasi PPN']
];

function main() {
  if (!fs.existsSync(TEMPLATE_PATH)) {
    console.error('Template tidak ditemukan: ' + TEMPLATE_PATH);
    process.exit(1);
  }

  const template = fs.readFileSync(TEMPLATE_PATH, 'utf8');
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  let count = 0;
  MODULES.forEach(([file, title]) => {
    const html = template
      .replace(/__TITLE__/g, title)
      .replace(/__MODULE_ID__/g, file);
    const outPath = path.join(OUT_DIR, file + '.html');
    fs.writeFileSync(outPath, html, 'utf8');
    count++;
    console.log('✓ ' + file + '.html');
  });

  console.log('\nSelesai! ' + count + ' halaman dibuat di ' + OUT_DIR);
}

main();