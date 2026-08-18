/* ============================================================
   JASTIP — HUB LAYOUT JS (DINAMIS & TERKELOMPOK)
   Satu sumber menu + header untuk SEMUA halaman role hub.
   Sidebar dikelompokkan per modul (collapsible accordion)
   agar tidak terlihat banyak. Jika menu di-update di sini,
   semua halaman hub ikut otomatis.
   ============================================================ */

(function () {
  'use strict';

  /* ============ SATU SUMBER MENU HUB (GROUP) ============ */
  var HUB_MENU_GROUPS = [
    {
      id: 'manage',
      icon: 'fa-solid fa-chart-simple',
      label: 'Manajemen & Laporan',
      items: [
        { id: 'fee-report', icon: 'fa-solid fa-file-invoice-dollar', label: 'Laporan Fee', file: 'fee-report.html' },
        { id: 'email', icon: 'fa-solid fa-envelope', label: 'Preferensi Email', file: 'email-preferences.html' }
      ]
    },
    {
      id: 'warehouse',
      icon: 'fa-solid fa-warehouse',
      label: 'Gudang & Stok',
      items: [
        { id: 'warehousing', icon: 'fa-solid fa-boxes-stacked', label: 'Stok Hub', file: 'warehousing.html' },
        { id: 'stock-order', icon: 'fa-solid fa-truck-ramp-box', label: 'Order Stok', file: 'stock-order.html' },
        { id: 'receiving', icon: 'fa-solid fa-clipboard-check', label: 'Penerimaan Barang', file: 'receiving.html' }
      ]
    },
    {
      id: 'delivery',
      icon: 'fa-solid fa-truck-fast',
      label: 'Pengiriman & Retur',
      items: [
        { id: 'deliveries', icon: 'fa-solid fa-truck', label: 'Pengiriman Masuk', file: 'deliveries.html' },
        { id: 'returns', icon: 'fa-solid fa-rotate-left', label: 'Penerimaan / Retur', file: 'delivery-returns.html' }
      ]
    },
    {
      id: 'customer',
      icon: 'fa-solid fa-users',
      label: 'Pelanggan & Fee',
      items: [
        { id: 'customers', icon: 'fa-solid fa-user-group', label: 'Pelanggan', file: 'customers.html' },
        { id: 'coverage-map', icon: 'fa-solid fa-map-location-dot', label: 'Peta Jangkauan Hub', file: 'hub-coverage-map.html' }
      ]
    },
    {
      id: 'as-customer',
      icon: 'fa-solid fa-store',
      label: 'Hub Sebagai Pelanggan',
      items: [
        { id: 'hub-customer', icon: 'fa-solid fa-coins', label: 'Belanja & Poin', file: 'hub-customer.html' },
        { id: 'hub-catalog', icon: 'fa-solid fa-store', label: 'Katalog', file: 'hub-catalog.html' },
        { id: 'hub-product-detail', icon: 'fa-solid fa-box-open', label: 'Detail Produk', file: 'hub-product-detail.html' },
        { id: 'hub-cart', icon: 'fa-solid fa-cart-shopping', label: 'Keranjang', file: 'hub-cart.html' },
        { id: 'hub-checkout', icon: 'fa-solid fa-credit-card', label: 'Checkout', file: 'hub-checkout.html' },
        { id: 'hub-orders', icon: 'fa-solid fa-clipboard-list', label: 'Riwayat Pesanan', file: 'hub-orders.html' },
        { id: 'hub-order-tracking', icon: 'fa-solid fa-truck-fast', label: 'Lacak Paket', file: 'hub-order-tracking.html' },
        { id: 'hub-rewards', icon: 'fa-solid fa-gift', label: 'Hadiah', file: 'hub-rewards.html' },
        { id: 'hub-subscriptions', icon: 'fa-solid fa-arrows-rotate', label: 'Langganan', file: 'hub-subscriptions.html' },
        { id: 'hub-complaints', icon: 'fa-solid fa-headset', label: 'Komplain', file: 'hub-complaints.html' },
        { id: 'hub-profile-tier', icon: 'fa-solid fa-user', label: 'Profil & Tier', file: 'hub-profile-tier.html' },
        { id: 'hub-wishlists', icon: 'fa-regular fa-heart', label: 'Wishlist', file: 'hub-wishlists.html' },
        { id: 'hub-product-reviews', icon: 'fa-solid fa-star', label: 'Ulasan', file: 'hub-product-reviews.html' },
        { id: 'hub-referrals', icon: 'fa-solid fa-user-plus', label: 'Referral', file: 'hub-referrals.html' }
      ]
    }
  ];

  /* ============ MAP NAMA FILE → MENU & GROUP ============ */
  var FILE_TO_MENU = {
    'hub.html': 'dashboard',
    'fee-report.html': 'fee-report',
    'email-preferences.html': 'email',
    'warehousing.html': 'warehousing',
    'stock-order.html': 'stock-order',
    'receiving.html': 'receiving',
    'deliveries.html': 'deliveries',
    'delivery-returns.html': 'returns',
    'customers.html': 'customers',
    'hub-coverage-map.html': 'coverage-map',
    'hub-customer.html': 'hub-customer',
    'hub-catalog.html': 'hub-catalog',
    'hub-product-detail.html': 'hub-product-detail',
    'hub-cart.html': 'hub-cart',
    'hub-checkout.html': 'hub-checkout',
    'hub-orders.html': 'hub-orders',
    'hub-order-tracking.html': 'hub-order-tracking',
    'hub-rewards.html': 'hub-rewards',
    'hub-subscriptions.html': 'hub-subscriptions',
    'hub-complaints.html': 'hub-complaints',
    'hub-profile-tier.html': 'hub-profile-tier',
    'hub-wishlists.html': 'hub-wishlists',
    'hub-product-reviews.html': 'hub-product-reviews',
    'hub-referrals.html': 'hub-referrals',
    'orders.html': 'orders'
  };

  var FILE_TO_GROUP = {
    'hub.html': 'dashboard',
    'fee-report.html': 'manage',
    'email-preferences.html': 'manage',
    'warehousing.html': 'warehouse',
    'stock-order.html': 'warehouse',
    'receiving.html': 'warehouse',
    'deliveries.html': 'delivery',
    'delivery-returns.html': 'delivery',
    'customers.html': 'customer',
    'hub-coverage-map.html': 'customer',
    'hub-customer.html': 'as-customer',
    'hub-catalog.html': 'as-customer',
    'hub-product-detail.html': 'as-customer',
    'hub-cart.html': 'as-customer',
    'hub-checkout.html': 'as-customer',
    'hub-orders.html': 'as-customer',
    'hub-order-tracking.html': 'as-customer',
    'hub-rewards.html': 'as-customer',
    'hub-subscriptions.html': 'as-customer',
    'hub-complaints.html': 'as-customer',
    'hub-profile-tier.html': 'as-customer',
    'hub-wishlists.html': 'as-customer',
    'hub-product-reviews.html': 'as-customer',
    'hub-referrals.html': 'as-customer',
    'orders.html': 'customer'
  };

  /* ============ UTIL ============ */
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
    var path = window.location.pathname.split('/').pop() || 'hub.html';
    return FILE_TO_MENU[path] || 'dashboard';
  }

  /* ============ BASIS PATH RELATIF ============
     Halaman di dashboard/hub.html → ke submenu pakai 'hub/xxx.html'
     Halaman di dashboard/hub/xxx.html → submenu cuma 'xxx.html'     */
  function getFileHref(file) {
    var inHubFolder = window.location.pathname.indexOf('/hub/') !== -1;
    return inHubFolder ? file : 'hub/' + file;
  }
  function getDashboardHref() {
    var inHubFolder = window.location.pathname.indexOf('/hub/') !== -1;
    return inHubFolder ? '../../dashboard/hub.html' : 'hub.html';
  }
  function getProfileHref() {
    var inHubFolder = window.location.pathname.indexOf('/hub/') !== -1;
    return inHubFolder ? 'hub-profile-tier.html' : 'hub/hub-profile-tier.html';
  }

  function getActiveGroupId() {
    var path = window.location.pathname.split('/').pop() || 'hub.html';
    return FILE_TO_GROUP[path] || 'dashboard';
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

  /* ============ INJECT CSS ============ */
  function ensureCss(href) {
    var hasCss = $$('link[rel="stylesheet"]').some(function (l) {
      return l.getAttribute('href') && l.getAttribute('href').indexOf(href) !== -1;
    });
    if (!hasCss) {
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
    }
  }

  /* ============ BUILD SIDEBAR (GROUP) ============ */
  function buildSidebar(activeId, activeGroupId) {
    var groupHtml = HUB_MENU_GROUPS.map(function (group) {
      var isOpen = group.id === activeGroupId;
      var subItems = group.items.map(function (item) {
        var isActive = item.id === activeId;
        return '<a href="' + getFileHref(item.file) + '" class="hub-nav-item' + (isActive ? ' active' : '') + '" data-menu="' + item.id + '">' +
          '<i class="' + item.icon + '"></i>' +
          '<span>' + item.label + '</span>' +
          '</a>';
      }).join('');

      return '<div class="hub-nav-group' + (isOpen ? ' open' : '') + '" data-group="' + group.id + '">' +
        '<button type="button" class="hub-nav-toggle" aria-expanded="' + isOpen + '">' +
        '<i class="nav-icon ' + group.icon + '"></i>' +
        '<span class="nav-label">' + group.label + '</span>' +
        '<i class="fa-solid fa-chevron-down nav-chevron"></i>' +
        '</button>' +
        '<div class="hub-nav-sub">' + subItems + '</div>' +
        '</div>';
    }).join('');

    return '' +
      '<div id="sidebarOverlay"></div>' +
      '<aside id="sidebar">' +
      '  <div class="sidebar-brand">' +
      '    <span class="logo-badge">J</span>' +
      '    <span class="logo-text">Jastip<span>.</span> Hub</span>' +
      '  </div>' +
      '  <nav class="sidebar-nav">' +
      '    <p class="sidebar-label">Menu Utama</p>' +
      '    <a href="' + getDashboardHref() + '" class="dash-menu-item' + (activeId === 'dashboard' ? ' active' : '') + '" data-menu="dashboard">' +
      '      <i class="fa-solid fa-gauge-high"></i><span>Dasbor</span>' +
      '    </a>' +
      groupHtml +
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
      '      <h1 id="headerTitle">Dashboard Hub</h1>' +
      '      <p id="headerDate">-</p>' +
      '    </div>' +
      '  </div>' +
      '  <div class="header-search">' +
      '    <input type="search" placeholder="Cari stok, delivery, customer...">' +
      '    <i class="fa-solid fa-magnifying-glass"></i>' +
      '  </div>' +
      '  <div class="header-right">' +
      '    <button class="header-icon-btn" id="notifBtn" aria-label="Notifikasi"><i class="fa-regular fa-bell"></i><span class="dot"></span></button>' +
      '    <a href="' + getProfileHref() + '" class="header-user" id="headerUserLink" title="Profil & Tier">' +
      '      <div class="header-avatar" id="headerAvatar">?</div>' +
      '      <div class="header-user-info">' +
      '        <span class="name" id="headerName">-</span>' +
      '        <div class="header-user-role"><span class="role-badge role-hub" id="headerRole">Hub Owner</span></div>' +
      '      </div>' +
      '    </a>' +
      '    <button class="logout-btn" id="logoutBtn"><i class="fa-solid fa-right-from-bracket"></i> Keluar</button>' +
      '  </div>' +
      '</header>';
  }

  /* ============ RENDER USER INFO ============ */
  function renderUser(session) {
    var name = session ? session.name : 'Hub Owner';
    var avatar = session && session.avatar ? session.avatar : name.charAt(0).toUpperCase();
    var roleText = session && session.hub ? session.hub : (session ? session.position : 'Hub Owner');

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
    var notifBtn = $('#notifBtn');

    if (toggleBtn && sidebar) {
      toggleBtn.addEventListener('click', function () {
        sidebar.classList.toggle('open');
        if (overlay) overlay.classList.toggle('show');
      });
    }
    if (overlay) {
      overlay.addEventListener('click', function () {
        sidebar.classList.remove('open');
        overlay.classList.remove('show');
      });
    }

    // Collapsible group
    $$('.hub-nav-toggle').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var group = this.closest('.hub-nav-group');
        if (group) {
          var wasOpen = group.classList.contains('open');
          group.classList.toggle('open');
          this.setAttribute('aria-expanded', String(!wasOpen));
        }
        if (sidebar) { sidebar.classList.remove('open'); if (overlay) overlay.classList.remove('show'); }
      });
    });

    if (notifBtn) {
      notifBtn.addEventListener('click', function () {
        showToast('Tidak ada notifikasi baru');
      });
    }

    var logoutBtn = $('#logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function (e) {
        e.preventDefault();
        if (window.JastipAuth && window.JastipAuth.logout) {
          window.JastipAuth.logout();
        } else {
          window.location.href = getCssBase() + 'index.html';
        }
      });
    }
  }

  /* ============ MOVE CONTENT ============ */
  function moveContent() {
    var pageHead = $('.hub-page-head') || $('.cust-page-head');
    var main = $('.hub-main') || $('.cust-main');
    var content = $('#dashContent');
    if (!content) return;

    if (pageHead) {
      content.appendChild(pageHead);
      pageHead.style.marginBottom = '18px';
    }
    if (main) {
      content.appendChild(main);
    }
  }

  /* ============ INIT ============ */
  function getCssBase() {
    return window.location.pathname.indexOf('/hub/') !== -1 ? '../../' : '../';
  }

  function initHubLayout() {
    var body = document.body;
    if (!body.classList.contains('hub-body')) return;
    if ($('#sidebar')) return;

    ensureCss(getCssBase() + 'css/dashboard.css');
    ensureCss(getCssBase() + 'css/hub.css');
    ensureCss('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css');

    var activeId = getActiveMenuId();
    var activeGroupId = getActiveGroupId();

    var layout = document.createElement('div');
    layout.className = 'dash-layout';
    layout.innerHTML = buildSidebar(activeId, activeGroupId) +
      '<div class="dash-main">' +
      buildHeader() +
      '<main class="dash-content" id="dashContent"></main>' +
      '</div>';

    while (body.firstChild) {
      layout.querySelector('#dashContent').appendChild(body.firstChild);
    }
    body.appendChild(layout);

    // Set judul header dari halaman
    var titleEl = $('#headerTitle');
    var h1 = $('.hub-page-head h1') || $('.cust-page-head h1');
    if (titleEl && h1) titleEl.textContent = h1.textContent;

    renderUser(getSession());
    bindEvents();
    moveContent();
  }

  // Ekspos global
  window.JastipHubLayout = {
    init: initHubLayout,
    menuGroups: HUB_MENU_GROUPS
  };

  document.addEventListener('DOMContentLoaded', initHubLayout);
})();