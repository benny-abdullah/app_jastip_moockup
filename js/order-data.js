/* ============================================================
   JASTIP — ORDER-DATA.JS
   Satu sumber data order customer:
   - Order dari Checkout (jastip_orders)
   - Order dari Paket Member / Subscription (jastip_subscription_order)
   + fallback demo agar semua halaman (orders, complaints, reviews)
     menampilkan riwayat lengkap.
   ============================================================ */
(function () {
  'use strict';

  var ORDERS_KEY = 'jastip_orders';
  var SUB_ORDER_KEY = 'jastip_subscription_order';

  /* ============ FALLBACK DEMO (jika localStorage kosong) ============ */
  var DEMO_ORDERS = [
    { id: 'ORD-2026-0814-01', source: 'checkout',     sourceLabel: 'Belanja',        produk: [{ nama: 'Beras Premium 5kg', qty: 1, harga: 50000 }], totalPts: 50000, status: 'Selesai',   metode: 'Points', tanggal: '14 Agu 2026' },
    { id: 'ORD-2026-0814-02', source: 'checkout',     sourceLabel: 'Belanja',        produk: [{ nama: 'Skincare Set Premium', qty: 1, harga: 150000 }], totalPts: 150000, status: 'Dikirim',    metode: 'Transfer', tanggal: '13 Agu 2026' },
    { id: 'ORD-2026-0814-03', source: 'checkout',     sourceLabel: 'Belanja',        produk: [{ nama: 'Kopi Arabika 1kg', qty: 1, harga: 95000 }], totalPts: 95000, status: 'Diproses',   metode: 'Points',   tanggal: '13 Agu 2026' },
    { id: 'ORD-2026-0814-04', source: 'checkout',     sourceLabel: 'Belanja',        produk: [{ nama: 'Minyak Goreng 2L', qty: 1, harga: 28000 }], totalPts: 28000, status: 'Selesai',    metode: 'Points',   tanggal: '08 Agu 2026' },
    { id: 'ORD-2026-0814-05', source: 'checkout',     sourceLabel: 'Belanja',        produk: [{ nama: 'Voucher Belanja 100rb', qty: 1, harga: 75000 }], totalPts: 75000, status: 'Selesai',   metode: 'Points',   tanggal: '02 Agu 2026' },
    { id: 'ORD-2026-0814-06', source: 'checkout',     sourceLabel: 'Belanja',        produk: [{ nama: 'Backpack Travel 40L', qty: 1, harga: 120000 }], totalPts: 120000, status: 'Dibatalkan', metode: 'Points',  tanggal: '30 Jul 2026' },
    { id: 'ORD-2026-0814-07', source: 'checkout',     sourceLabel: 'Belanja',        produk: [{ nama: 'Power Bank 20000mAh', qty: 1, harga: 85000 }], totalPts: 85000, status: 'Selesai',    metode: 'Transfer', tanggal: '25 Jul 2026' },
    { id: 'ORD-2026-0814-08', source: 'checkout',     sourceLabel: 'Belanja',        produk: [{ nama: 'Kaos Polos Premium', qty: 1, harga: 35000 }], totalPts: 35000, status: 'Selesai',    metode: 'Points',   tanggal: '20 Jul 2026' },
    // Demo order paket member (subscription)
    { id: 'ORD-2026-0814-S1', source: 'subscription', sourceLabel: 'Paket Member',   produk: [{ nama: 'Paket Keluarga (6 produk sembako)', qty: 1, harga: 114000 }], totalPts: 114000, status: 'Selesai', metode: 'Auto-renewal', tanggal: '15 Agu 2026' },
    { id: 'ORD-2026-0814-S2', source: 'subscription', sourceLabel: 'Paket Member',   produk: [{ nama: 'Paket Keluarga (6 produk sembako)', qty: 1, harga: 114000 }], totalPts: 114000, status: 'Selesai', metode: 'Auto-renewal', tanggal: '15 Jul 2026' },
    { id: 'ORD-2026-0814-S3', source: 'subscription', sourceLabel: 'Paket Member',   produk: [{ nama: 'Paket Keluarga (6 produk sembako)', qty: 1, harga: 114000 }], totalPts: 114000, status: 'Selesai', metode: 'Auto-renewal', tanggal: '15 Jun 2026' }
  ];

  /* ============ HELPERS ============ */
  function getItem(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function setItem(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }

  /* ============ AMBIL SEMUA ORDER (gabung checkout + subscription) ============ */
  function getAllOrders() {
    var orders = [];

    // 1. Order dari checkout (localStorage jastip_orders)
    try {
      var fromCheckout = JSON.parse(getItem(ORDERS_KEY));
      if (Array.isArray(fromCheckout)) orders = orders.concat(fromCheckout);
    } catch (e) {}

    // 2. Order dari paket member (jastip_subscription_order)
    try {
      var fromSub = JSON.parse(getItem(SUB_ORDER_KEY));
      if (fromSub) orders.push(fromSub);
    } catch (e) {}

    // 3. Fallback demo jika kosong
    if (orders.length === 0) {
      orders = DEMO_ORDERS.slice();
      // Simpan demo agar konsisten sejak awal
      setItem('jastip_orders_seed', DEMO_ORDERS);
    }

    // Urutkan terbaru dulu (id DESC kasar)
    orders.sort(function (a, b) {
      return String(b.id).localeCompare(String(a.id));
    });

    return orders;
  }

  /* ============ SIMPAN ORDER DARI CHECKOUT ============ */
  function addOrderFromCheckout(order) {
    var list = [];
    try { list = JSON.parse(getItem(ORDERS_KEY)) || []; } catch (e) { list = []; }
    if (!Array.isArray(list)) list = [];
    list.push(order);
    setItem(ORDERS_KEY, list);
    return list;
  }

  /* ============ SIMPAN ORDER AKTIF DARI SUBCRIPTION ============ */
  function setSubscriptionOrder(order) {
    setItem(SUB_ORDER_KEY, order);
    return order;
  }

  /* ============ STATUS BADGE HELPERS ============ */
  function statusBadge(status) {
    var cls = 'badge-gray';
    if (status === 'Selesai') cls = 'badge-green';
    else if (status === 'Dikirim' || status === 'Terkirim' || status === 'Terbayar') cls = 'badge-blue';
    else if (status === 'Diproses') cls = 'badge-warning';
    else if (status === 'Dibatalkan') cls = 'badge-red';
    return '<span class="badge ' + cls + '">' + status + '</span>';
  }

  function sourceBadge(source) {
    if (source === 'subscription') {
      return '<span class="badge" style="background:#F3E8FF; color:#7C3AED;">Paket Member</span>';
    }
    return '<span class="badge" style="background:#E5FFF3; color:#00AA5B;">Belanja</span>';
  }

  /* ============ EKSPOR GLOBAL ============ */
  window.JastipOrders = {
    getAll: getAllOrders,
    addCheckout: addOrderFromCheckout,
    setSubscription: setSubscriptionOrder,
    statusBadge: statusBadge,
    sourceBadge: sourceBadge
  };
})();