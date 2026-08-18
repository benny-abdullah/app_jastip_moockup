/* ============================================================
   JASTIP — RETURN DATA JS (SATU SUMBER DATA RETUR HUB)
   Menyimpan & mengelola data retur/pengembalian barang ke pusat.
   Struktur mengikuti skema delivery_returns di review.md:
   status: requested → approved → picked_up → returned → refunded / rejected
   ============================================================ */

(function () {
  'use strict';

  var STORAGE_KEY = 'jastip_returns';

  /* ============ DATA DEMO / FALLBACK ============ */
  var DEMO_RETURNS = [
    {
      id: 'RT-2026-011',
      ref: 'DEL-2026-114',
      jenis: 'Delivery',
      status: 'returned',
      tanggal: '14 Agu 2026',
      alasan: 'Barang rusak',
      catatan: 'Skincare set penyok saat pengiriman',
      items: [
        { nama: 'Skincare Set Premium', qty_kirim: 3, qty_retur: 3 }
      ],
      bukti: null
    },
    {
      id: 'RT-2026-010',
      ref: 'SO-2026-083',
      jenis: 'Order Stok',
      status: 'refunded',
      tanggal: '13 Agu 2026',
      alasan: 'Barang kurang',
      catatan: 'Barang lengkap setelah retur diproses',
      items: [
        { nama: 'Skincare Set Premium', qty_kirim: 10, qty_retur: 1 },
        { nama: 'Power Bank 20000mAh', qty_kirim: 15, qty_retur: 0 }
      ],
      bukti: null
    },
    {
      id: 'RT-2026-009',
      ref: 'DEL-2026-112',
      jenis: 'Delivery',
      status: 'rejected',
      tanggal: '11 Agu 2026',
      alasan: 'Alamat tidak ditemukan',
      catatan: 'Retur ditolak pusat — barang sudah diterima customer',
      items: [
        { nama: 'Kopi Arabika 1kg', qty_kirim: 8, qty_retur: 8 }
      ],
      bukti: null
    },
    {
      id: 'RT-2026-008',
      ref: 'SO-2026-082',
      jenis: 'Order Stok',
      status: 'approved',
      tanggal: '10 Agu 2026',
      alasan: 'Salah kirim',
      catatan: 'Menunggu penjemputan kurir pusat',
      items: [
        { nama: 'Kaos Polos Premium', qty_kirim: 40, qty_retur: 5 },
        { nama: 'Backpack Travel 40L', qty_kirim: 20, qty_retur: 2 }
      ],
      bukti: null
    },
    {
      id: 'RT-2026-007',
      ref: 'DEL-2026-108',
      jenis: 'Delivery',
      status: 'requested',
      tanggal: '09 Agu 2026',
      alasan: 'Customer menolak',
      catatan: 'Menunggu persetujuan pusat',
      items: [
        { nama: 'Parfum Premium 100ml', qty_kirim: 2, qty_retur: 2 }
      ],
      bukti: null
    }
  ];

  /* ============ STATUS MAP ============ */
  var STATUS_MAP = {
    requested: { label: 'Diajukan', badge: 'badge-yellow' },
    approved:  { label: 'Disetujui', badge: 'badge-blue' },
    picked_up: { label: 'Dijemput', badge: 'badge-blue' },
    returned:  { label: 'Dikembalikan', badge: 'badge-red' },
    refunded:  { label: 'Refund', badge: 'badge-green' },
    rejected:  { label: 'Ditolak', badge: 'badge-gray' }
  };

  /* ============ UTIL ============ */
  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* storage tidak tersedia */ }
    return DEMO_RETURNS.slice();
  }

  function save(list) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) { /* storage tidak tersedia */ }
  }

  function genCode() {
    var list = load();
    var max = 0;
    list.forEach(function (r) {
      var m = String(r.id || '').match(/RT-(\d+)/);
      if (m) max = Math.max(max, parseInt(m[1], 10));
    });
    return 'RT-' + (2026000 + max + 1);
  }

  function today() {
    return new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  /* ============ API ============ */
  function getAll() {
    return load();
  }

  function getById(id) {
    return load().filter(function (r) { return r.id === id; })[0] || null;
  }

  function add(data) {
    var list = load();
    var item = {
      id: genCode(),
      ref: data.ref || '',
      jenis: data.jenis || 'Delivery',
      status: 'requested',
      tanggal: today(),
      alasan: data.alasan || 'Lainnya',
      catatan: data.catatan || '',
      items: (data.items || []).filter(function (it) { return it.qty_retur > 0; }),
      bukti: data.bukti || null
    };
    list.unshift(item);
    save(list);
    return item;
  }

  function updateStatus(id, status) {
    var list = load();
    var found = false;
    list.forEach(function (r) {
      if (r.id === id) { r.status = status; found = true; }
    });
    if (found) save(list);
    return found;
  }

  function statusBadge(status) {
    var s = STATUS_MAP[status] || { label: status, badge: 'badge-gray' };
    return '<span class="badge ' + s.badge + '">' + s.label + '</span>';
  }

  function statusLabel(status) {
    var s = STATUS_MAP[status] || { label: status };
    return s.label;
  }

  function formatItems(items) {
    return (items || []).map(function (it) {
      return it.nama + ' (retur ' + it.qty_retur + '/' + it.qty_kirim + ')';
    }).join(', ') || '—';
  }

  /* ============ EKSPOR GLOBAL ============ */
  window.JastipReturns = {
    getAll: getAll,
    getById: getById,
    add: add,
    updateStatus: updateStatus,
    statusBadge: statusBadge,
    statusLabel: statusLabel,
    formatItems: formatItems,
    STATUS_MAP: STATUS_MAP
  };
})();