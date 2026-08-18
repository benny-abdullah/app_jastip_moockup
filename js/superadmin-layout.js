/* ============================================================
   JASTIP — SUPERADMIN LAYOUT JS (DINAMIS & TERKELOMPOK)
   Satu sumber menu + header untuk SEMUA halaman role superadmin.
   Sidebar dikelompokkan per modul (collapsible accordion).
   Jika menu di-update di sini, semua halaman ikut otomatis.
   ============================================================ */

(function () {
  'use strict';

  /* ============ SATU SUMBER MENU SUPERADMIN (GROUP) ============ */
  // Disederhanakan sesuai rencana awal (superadmin_rencana awal):
  // 3 group — Dashboard, Master Data, Operasional (19 menu).
  var SA_MENU_GROUPS = [
    {
      id: 'dashboard-group',
      icon: 'fa-solid fa-chart-line',
      label: 'Dashboard',
      items: [
        { id: 'dashboard', icon: 'fa-solid fa-gauge-high', label: 'Utama', file: 'dashboard.html' },
        { id: 'dashboard-sales', icon: 'fa-solid fa-cart-shopping', label: 'Sales', file: 'dashboard-sales.html' },
        { id: 'dashboard-points', icon: 'fa-solid fa-coins', label: 'Saldo / Point', file: 'dashboard-points-balance.html' },
        { id: 'dashboard-fee', icon: 'fa-solid fa-hand-holding-dollar', label: 'Fee', file: 'dashboard-fee.html' },
        { id: 'dashboard-accounting', icon: 'fa-solid fa-calculator', label: 'Accounting', file: 'dashboard-accounting.html' }
      ]
    },
    {
      id: 'master',
      icon: 'fa-solid fa-database',
      label: 'Master Data',
      items: [
        { id: 'membership-tiers', icon: 'fa-solid fa-ranking-star', label: 'Membership & Tier', file: 'membership-tiers.html' },
        { id: 'point-transactions', icon: 'fa-solid fa-coins', label: 'Points', file: 'point-transactions.html' },
        { id: 'currency-conversion', icon: 'fa-solid fa-arrow-right-arrow-left', label: 'Konversi Rupiah ke Point', file: 'currency-conversion.html' },
        { id: 'rewards', icon: 'fa-solid fa-gift', label: 'Reward', file: 'rewards.html' },
        { id: 'products', icon: 'fa-solid fa-box', label: 'Produk', file: 'products.html' },
        { id: 'categories', icon: 'fa-solid fa-tags', label: 'Kategori', file: 'categories.html' },
        { id: 'suppliers', icon: 'fa-solid fa-truck-field', label: 'Supplier', file: 'suppliers.html' },
        { id: 'promos', icon: 'fa-solid fa-percent', label: 'Promo / Event', file: 'promos.html' },
        { id: 'hubs', icon: 'fa-solid fa-store', label: 'Hub', file: 'hubs.html' },
        { id: 'customers', icon: 'fa-solid fa-user-group', label: 'Customer', file: 'customers.html' },
        { id: 'users', icon: 'fa-solid fa-user-shield', label: 'User & Role', file: 'users.html' }
      ]
    },
    {
      // ============ BARU: GRUP PENGADAAN (PROCUREMENT) ============
      id: 'pengadaan',
      icon: 'fa-solid fa-cart-shopping',
      label: 'Pengadaan',
      items: [
        { id: 'purchase-requests', icon: 'fa-solid fa-file-signature', label: 'Purchase Request', file: 'purchase-requests.html' },
        { id: 'purchase-request-approval', icon: 'fa-solid fa-check-double', label: 'Approval PR', file: 'purchase-request-approval.html' },
        { id: 'purchase-orders', icon: 'fa-solid fa-file-invoice', label: 'Purchase Order', file: 'purchase-orders.html' },
        { id: 'po-eta-dashboard', icon: 'fa-solid fa-clock', label: 'ETA Dashboard', file: 'po-eta-dashboard.html' },
        { id: 'supplier-performance', icon: 'fa-solid fa-star', label: 'Supplier Performance', file: 'supplier-performance.html' },
        { id: 'replenishment-suggestions', icon: 'fa-solid fa-wand-magic-sparkles', label: 'Replenishment', file: 'replenishment-suggestions.html' },
        { id: 'backorders', icon: 'fa-solid fa-circle-exclamation', label: 'Backorder', file: 'backorders.html' }
      ]
    },
    {
      id: 'stok-gudang',
      icon: 'fa-solid fa-warehouse',
      label: 'Stok & Gudang',
      items: [
        { id: 'stock-management', icon: 'fa-solid fa-boxes-stacked', label: 'Manajemen Stok', file: 'stock-management.html' },
        { id: 'dashboard-wh-internal', icon: 'fa-solid fa-warehouse', label: 'Warehouse Internal', file: 'dashboard-warehouse-internal.html' },
        { id: 'dashboard-wh-external', icon: 'fa-solid fa-boxes-stacked', label: 'Warehouse External', file: 'dashboard-warehouse-external.html' }
      ]
    },
    {
      id: 'operasional',
      icon: 'fa-solid fa-gears',
      label: 'Operasional',
      items: [
        { id: 'payments', icon: 'fa-solid fa-credit-card', label: 'Payment', file: 'payments.html' },
        { id: 'subscription-management', icon: 'fa-solid fa-arrows-rotate', label: 'Subscription', file: 'subscription-management.html' },
        { id: 'complaints', icon: 'fa-solid fa-headset', label: 'Pengaduan / CS', file: 'complaints.html' }
      ]
    }
  ];

  /* ============ MAP NAMA FILE → MENU & GROUP ============ */
  // Hanya 19 menu yang tampil (sesuai rencana awal).
  var FILE_TO_MENU = {
    'dashboard.html': 'dashboard',
    'dashboard-warehouse-internal.html': 'dashboard-wh-internal',
    'dashboard-warehouse-external.html': 'dashboard-wh-external',
    'dashboard-sales.html': 'dashboard-sales',
    'dashboard-points-balance.html': 'dashboard-points',
    'dashboard-fee.html': 'dashboard-fee',
    'dashboard-accounting.html': 'dashboard-accounting',
    'membership-tiers.html': 'membership-tiers',
    'point-transactions.html': 'point-transactions',
    'currency-conversion.html': 'currency-conversion',
    'rewards.html': 'rewards',
    'products.html': 'products',
    'categories.html': 'categories',
    'suppliers.html': 'suppliers',
    'promos.html': 'promos',
    'hubs.html': 'hubs',
    'customers.html': 'customers',
    'users.html': 'users',
    'stock-management.html': 'stock-management',
    'payments.html': 'payments',
    'subscription-management.html': 'subscription-management',
    'complaints.html': 'complaints',
    // ===== MODUL PENGADAAN (PROCUREMENT) =====
    'purchase-requests.html': 'purchase-requests',
    'purchase-request-approval.html': 'purchase-request-approval',
    'purchase-orders.html': 'purchase-orders',
    'po-eta-dashboard.html': 'po-eta-dashboard',
    'supplier-performance.html': 'supplier-performance',
    'replenishment-suggestions.html': 'replenishment-suggestions',
    'backorders.html': 'backorders'
  };

  var FILE_TO_GROUP = {
    'dashboard.html': 'dashboard-group',
    'dashboard-sales.html': 'dashboard-group',
    'dashboard-points-balance.html': 'dashboard-group',
    'dashboard-fee.html': 'dashboard-group',
    'dashboard-accounting.html': 'dashboard-group',
    'membership-tiers.html': 'master',
    'point-transactions.html': 'master',
    'currency-conversion.html': 'master',
    'rewards.html': 'master',
    'products.html': 'master',
    'categories.html': 'master',
    'suppliers.html': 'master',
    'promos.html': 'master',
    'hubs.html': 'master',
    'customers.html': 'master',
    'users.html': 'master',
    'stock-management.html': 'stok-gudang',
    'dashboard-warehouse-internal.html': 'stok-gudang',
    'dashboard-warehouse-external.html': 'stok-gudang',
    'payments.html': 'operasional',
    'subscription-management.html': 'operasional',
    'complaints.html': 'operasional',
    // ===== MODUL PENGADAAN (PROCUREMENT) =====
    'purchase-requests.html': 'pengadaan',
    'purchase-request-approval.html': 'pengadaan',
    'purchase-orders.html': 'pengadaan',
    'po-eta-dashboard.html': 'pengadaan',
    'supplier-performance.html': 'pengadaan',
    'replenishment-suggestions.html': 'pengadaan',
    'backorders.html': 'pengadaan'
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
    var path = window.location.pathname.split('/').pop() || 'dashboard.html';
    return FILE_TO_MENU[path] || 'dashboard';
  }
  function getActiveGroupId() {
    var path = window.location.pathname.split('/').pop() || 'dashboard.html';
    return FILE_TO_GROUP[path] || 'dashboard-group';
  }

  /* ============ BASIS PATH RELATIF ============
     Halaman dashboard/superadmin.html → submenu pakai 'superadmin/xxx.html'
     Halaman dashboard/superadmin/xxx.html → submenu cuma 'xxx.html'     */
  function getFileHref(file) {
    var inFolder = window.location.pathname.indexOf('/superadmin/') !== -1;
    return inFolder ? file : 'superadmin/' + file;
  }
  function getDashboardHref() {
    var inFolder = window.location.pathname.indexOf('/superadmin/') !== -1;
    return inFolder ? '../../dashboard/superadmin.html' : 'superadmin.html';
  }
  function getCssBase() {
    return window.location.pathname.indexOf('/superadmin/') !== -1 ? '../../' : '../';
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
    var groupHtml = SA_MENU_GROUPS.map(function (group) {
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
      '    <span class="logo-text">Jastip<span>.</span> Admin</span>' +
      '  </div>' +
      '  <nav class="sidebar-nav">' +
      '    <p class="sidebar-label">Menu Utama</p>' +
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
      '      <h1 id="headerTitle">Dashboard Superadmin</h1>' +
      '      <p id="headerDate">-</p>' +
      '    </div>' +
      '  </div>' +
      '  <div class="header-search">' +
      '    <input type="search" placeholder="Cari produk, order, supplier...">' +
      '    <i class="fa-solid fa-magnifying-glass"></i>' +
      '  </div>' +
      '  <div class="header-right">' +
      '    <button class="header-icon-btn" id="notifBtn" aria-label="Notifikasi"><i class="fa-regular fa-bell"></i><span class="dot"></span></button>' +
      '    <div class="header-user">' +
      '      <div class="header-avatar" id="headerAvatar">?</div>' +
      '      <div class="header-user-info">' +
      '        <span class="name" id="headerName">-</span>' +
      '        <div class="header-user-role"><span class="role-badge role-admin" id="headerRole">Superadmin</span></div>' +
      '      </div>' +
      '    </div>' +
      '    <button class="logout-btn" id="logoutBtn"><i class="fa-solid fa-right-from-bracket"></i> Keluar</button>' +
      '  </div>' +
      '</header>';
  }

  /* ============ RENDER USER INFO ============ */
  function renderUser(session) {
    var name = session ? session.name : 'Admin Pusat';
    var avatar = session && session.avatar ? session.avatar : name.charAt(0).toUpperCase();
    var roleText = session && session.hub ? session.hub : (session && session.position ? session.position : 'Superadmin');

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
    var pageHead = $('.sa-page-head');
    var main = $('.sa-main');
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
  function initSuperadminLayout() {
    var body = document.body;
    if (!body.classList.contains('sa-body')) return;
    if ($('#sidebar')) return;

    ensureCss(getCssBase() + 'css/dashboard.css');
    ensureCss(getCssBase() + 'css/hub.css');
    ensureCss(getCssBase() + 'css/superadmin.css');
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
    var h1 = $('.sa-page-head h1');
    if (titleEl && h1) titleEl.textContent = h1.textContent;

    renderUser(getSession());
    bindEvents();
    moveContent();
  }

  // Ekspos global
  window.JastipSuperadminLayout = {
    init: initSuperadminLayout,
    menuGroups: SA_MENU_GROUPS,
    toast: showToast
  };

  document.addEventListener('DOMContentLoaded', initSuperadminLayout);
})();