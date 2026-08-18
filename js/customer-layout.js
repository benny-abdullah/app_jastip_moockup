/* ============================================================
   JASTIP — CUSTOMER LAYOUT JS (DINAMIS)
   Otomatis inject sidebar + header ala dashboard ke semua
   halaman customer (body.cust-body). Menu dari SATU sumber —
   jika menu di-update di sini, semua halaman ikut otomatis.
   ============================================================ */

(function () {
  'use strict';

  /* ============ SATU SUMBER MENU CUSTOMER ============ */
  var CUSTOMER_MENU = [
    { id: 'dashboard', icon: 'fa-solid fa-gauge-high', label: 'Dasbor', href: '../dashboard/customer.html' },
    { id: 'catalog', icon: 'fa-solid fa-store', label: 'Katalog', href: '../customer/catalog.html' },
    { id: 'cart', icon: 'fa-solid fa-cart-shopping', label: 'Keranjang', href: '../customer/cart.html' },
    { id: 'orders', icon: 'fa-solid fa-list-check', label: 'Pesanan', href: '../customer/orders.html' },
    { id: 'points', icon: 'fa-solid fa-coins', label: 'Poin & Top Up', href: '../customer/points-topup.html' },
    { id: 'rewards', icon: 'fa-solid fa-gift', label: 'Hadiah', href: '../customer/rewards.html' },
    { id: 'subscription', icon: 'fa-solid fa-arrows-rotate', label: 'Langganan', href: '../customer/subscriptions.html' },
    { id: 'complaints', icon: 'fa-solid fa-headset', label: 'Komplain', href: '../customer/complaints.html' },
    { id: 'profile', icon: 'fa-solid fa-user', label: 'Profil & Tier', href: '../customer/profile-tier.html' },
    { id: 'wishlist', icon: 'fa-regular fa-heart', label: 'Wishlist', href: '../customer/wishlists.html' },
    { id: 'reviews', icon: 'fa-solid fa-star', label: 'Ulasan', href: '../customer/product-reviews.html' },
    { id: 'email', icon: 'fa-solid fa-envelope', label: 'Preferensi Email', href: '../customer/email-preferences.html' },
    { id: 'referral', icon: 'fa-solid fa-user-plus', label: 'Referral', href: '../customer/referrals.html' }
  ];

  /* ============ MAP NAMA FILE → ID MENU AKTIF ============ */
  var FILE_TO_MENU = {
    'customer.html': 'dashboard',
    'catalog.html': 'catalog',
    'cart.html': 'cart',
    'checkout.html': 'cart',
    'orders.html': 'orders',
    'order-tracking.html': 'orders',
    'points-topup.html': 'points',
    'rewards.html': 'rewards',
    'profile-tier.html': 'profile',
    'subscriptions.html': 'subscription',
    'complaints.html': 'complaints',
    'email-preferences.html': 'email',
    'referrals.html': 'referral',
    'wishlists.html': 'wishlist',
    'product-reviews.html': 'reviews'
  };

  /* ============ UTILS ============ */
  function $(sel, scope) { return (scope || document).querySelector(sel); }
  function $$(sel, scope) { return Array.prototype.slice.call((scope || document).querySelectorAll(sel)); }

  function showToast(message) {
    var toast = $('#toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(function () { toast.classList.remove('show'); }, 2600);
  }

  /* ============ DETEKSI HALAMAN AKTIF ============ */
  function getActiveMenuId() {
    var path = window.location.pathname.split('/').pop() || 'customer.html';
    return FILE_TO_MENU[path] || 'dashboard';
  }

  /* ============ AMBIL SESSION USER ============ */
  function getSession() {
    try {
      if (window.JastipAuth && window.JastipAuth.getSession) {
        return window.JastipAuth.getSession();
      }
    } catch (e) {}
    return null;
  }

  /* ============ INJECT CSS DASHBOARD (jika belum ada) ============ */
  function ensureDashboardCss() {
    var hasCss = $$('link[rel="stylesheet"]').some(function (l) {
      return l.getAttribute('href') && l.getAttribute('href').indexOf('dashboard.css') !== -1;
    });
    if (!hasCss) {
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '../css/dashboard.css';
      document.head.appendChild(link);
    }
  }

  /* ============ BUILD SIDEBAR ============ */
  function buildSidebar(activeId) {
    var menuHtml = CUSTOMER_MENU.map(function (item) {
      var isActive = item.id === activeId;
      return '<a href="' + item.href + '" class="dash-menu-item' + (isActive ? ' active' : '') + '" data-menu="' + item.id + '">' +
        '<i class="' + item.icon + '"></i>' +
        '<span>' + item.label + '</span>' +
        '</a>';
    }).join('');

    return '' +
      '<div id="sidebarOverlay"></div>' +
      '<aside id="sidebar">' +
      '  <div class="sidebar-brand">' +
      '    <span class="logo-badge">J</span>' +
      '    <span class="logo-text">Jastip<span>.</span> Saya</span>' +
      '  </div>' +
      '  <nav class="sidebar-nav">' +
      '    <p class="sidebar-label">Menu Utama</p>' +
      '    <div id="sidebarMenu">' + menuHtml + '</div>' +
      '  </nav>' +
      '  <div class="sidebar-user">' +
      '    <div class="sidebar-avatar" id="sidebarAvatar">?</div>' +
      '    <div class="sidebar-user-info">' +
      '      <p class="name" id="sidebarName">-</p>' +
      '      <p class="role" id="sidebarRole">-</p>' +
      '    </div>' +
      '  </div>' +
      '</aside>';
  }

  /* ============ BUILD HEADER ============ */
  function buildHeader() {
    return '' +
      '<header class="dash-header">' +
      '  <div class="header-left">' +
      '    <button class="sidebar-toggle" id="sidebarToggle" aria-label="Buka menu"><i class="fa-solid fa-bars"></i></button>' +
      '    <div class="header-title">' +
      '      <h1 id="headerTitle">Akun Saya</h1>' +
      '      <p id="headerDate">-</p>' +
      '    </div>' +
      '  </div>' +
      '  <div class="header-search">' +
      '    <input type="search" placeholder="Cari produk, pesanan...">' +
      '    <i class="fa-solid fa-magnifying-glass"></i>' +
      '  </div>' +
      '  <div class="header-right">' +
      '    <button class="header-icon-btn" id="notifBtn" aria-label="Notifikasi"><i class="fa-regular fa-bell"></i><span class="dot"></span></button>' +
      '    <div class="header-user">' +
      '      <div class="header-avatar" id="headerAvatar">?</div>' +
      '      <div class="header-user-info">' +
      '        <span class="name" id="headerName">-</span>' +
      '        <div class="header-user-role"><span class="role-badge role-customer" id="headerRole">Customer</span></div>' +
      '      </div>' +
      '    </div>' +
      '    <button class="logout-btn" id="logoutBtn"><i class="fa-solid fa-right-from-bracket"></i> Keluar</button>' +
      '  </div>' +
      '</header>';
  }

  /* ============ RENDER USER INFO ============ */
  function renderUser(session) {
    var name = session ? session.name : 'Customer';
    var avatar = session && session.avatar ? session.avatar : name.charAt(0).toUpperCase();
    var roleText = session && session.hub ? session.hub : 'Customer';

    var els = {
      '#headerAvatar': avatar,
      '#headerName': name,
      '#sidebarAvatar': avatar,
      '#sidebarName': name,
      '#sidebarRole': roleText
    };
    Object.keys(els).forEach(function (sel) {
      var el = $(sel);
      if (el) el.textContent = els[sel];
    });

    var dateEl = $('#headerDate');
    if (dateEl) {
      dateEl.textContent = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    }
  }

  /* ============ BIND EVENTS ============ */
  function bindEvents() {
    var toggleBtn = $('#sidebarToggle');
    var sidebar = $('#sidebar');
    var overlay = $('#sidebarOverlay');

    if (toggleBtn && sidebar) {
      toggleBtn.addEventListener('click', function () {
        sidebar.classList.toggle('open');
        if (overlay) overlay.classList.toggle('show');
      });
    }
    if (overlay && sidebar) {
      overlay.addEventListener('click', function () {
        sidebar.classList.remove('open');
        overlay.classList.remove('show');
      });
    }

    var logoutBtn = $('#logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function (e) {
        e.preventDefault();
        if (window.JastipAuth && window.JastipAuth.logout) {
          window.JastipAuth.logout();
        } else {
          window.location.href = '../login.html';
        }
      });
    }

    var notifBtn = $('#notifBtn');
    if (notifBtn) {
      notifBtn.addEventListener('click', function () {
        showToast('Tidak ada notifikasi baru');
      });
    }
  }

  /* ============ MOVE KONTEN KE DALAM LAYOUT ============ */
  function moveContent() {
    var pageHead = $('.cust-page-head');
    var main = $('.cust-main');
    var content = $('#dashContent');
    if (!content) return;

    // Pindahkan page-head (jika ada) ke dalam dash-content
    if (pageHead) {
      content.appendChild(pageHead);
      pageHead.style.marginBottom = '24px';
    }
    // Pindahkan main (jika ada) ke dalam dash-content
    if (main) {
      content.appendChild(main);
    }
  }

  /* ============ SESSION GUARD ============ */
  function requireLogin() {
    var session = getSession();
    if (!session) {
      // Simpan halaman tujuan agar bisa kembali setelah login
      try {
        sessionStorage.setItem('jastip_redirect', window.location.href);
      } catch (e) {}
      window.location.href = '../login.html';
      return null;
    }
    // Jika role bukan customer, arahkan ke dashboard sesuai role
    if (session.role !== 'customer') {
      if (window.JastipAuth && window.JastipAuth.dashboardForRole) {
        window.location.href = window.JastipAuth.dashboardForRole(session.role);
      } else {
        window.location.href = '../dashboard/customer.html';
      }
      return null;
    }
    return session;
  }

  /* ============ INIT ============ */
  function initCustomerLayout() {
    var body = document.body;
    if (!body.classList.contains('cust-body')) return;

    // Jangan double-inject
    if ($('#sidebar')) return;

    // Proteksi login sementara dinonaktifkan — semua halaman customer bisa diakses tanpa login
    // var session = requireLogin();
    // if (!session) return;

    ensureDashboardCss();

    // Muat tier.js (untuk auto-upgrade tier) jika belum ada
    if (!window.JastipTier) {
      var tierScript = document.createElement('script');
      tierScript.src = '../js/tier.js';
      tierScript.onload = function () {
        runAutoUpgrade();
      };
      document.head.appendChild(tierScript);
    } else {
      runAutoUpgrade();
    }

    var activeId = getActiveMenuId();

    // Inject sidebar + header + content wrapper
    var layout = document.createElement('div');
    layout.className = 'dash-layout';
    layout.innerHTML = buildSidebar(activeId) +
      '<div class="dash-main">' +
      buildHeader() +
      '<main class="dash-content" id="dashContent"></main>' +
      '</div>';

    // Pindahkan semua child body ke dalam dashContent, lalu sisipkan layout
    while (body.firstChild) {
      layout.querySelector('#dashContent').appendChild(body.firstChild);
    }
    body.appendChild(layout);

    // Set judul header dari halaman
    var titleEl = $('#headerTitle');
    var h1 = $('.cust-page-head h1');
    if (titleEl && h1) titleEl.textContent = h1.textContent;

    renderUser(getSession());
    bindEvents();
    moveContent();
  }

  /* ============ AUTO-UPGRADE TIER ============ */
  function runAutoUpgrade() {
    if (!window.JastipTier) return;
    try {
      var tier = window.JastipTier.autoUpgradeTier();
      var badge = $('.role-badge');
      if (badge) badge.textContent = 'Tier: ' + tier.charAt(0).toUpperCase() + tier.slice(1);
    } catch (e) { /* silent */ }
  }

  // Ekspor global agar bisa dipanggil dari main.js
  window.JastipCustomerLayout = {
    init: initCustomerLayout,
    menu: CUSTOMER_MENU
  };
})();