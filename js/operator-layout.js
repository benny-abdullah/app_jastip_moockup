/* ============================================================
   JASTIP — OPERATOR LAYOUT JS (DINAMIS & TERKELOMPOK)
   Satu sumber menu + header pour SEMUA halaman role operator.
   Sidebar dikelompokkan per modul (collapsible accordion).
   Operator/Admin mencakup semua menu operasional.
   ============================================================ */

(function () {
  'use strict';

  /* ============ SATU SUMBER MENU OPERATOR (GROUP) ============ */
  var OP_MENU_GROUPS = [
    {
      id: 'dashboard-group',
      icon: 'fa-solid fa-chart-line',
      label: 'Dashboard',
      items: [
        { id: 'dashboard', icon: 'fa-solid fa-gauge-high', label: 'Utama', file: 'dashboard.html' }
      ]
    },
    {
      id: 'operasional',
      icon: 'fa-solid fa-gears',
      label: 'Operasional',
      items: [
        { id: 'orders', icon: 'fa-solid fa-cart-shopping', label: 'Pesanan', file: 'orders.html' },
        { id: 'deliveries', icon: 'fa-solid fa-truck-fast', label: 'Pengiriman', file: 'deliveries.html' },
        { id: 'complaints', icon: 'fa-solid fa-headset', label: 'Komplain / CS', file: 'complaints.html' }
      ]
    },
    {
      id: 'stok-gudang',
      icon: 'fa-solid fa-warehouse',
      label: 'Stok & Gudang',
      items: [
        { id: 'stock', icon: 'fa-solid fa-boxes-stacked', label: 'Manajemen Stok', file: 'stock.html' },
        { id: 'warehouse', icon: 'fa-solid fa-warehouse', label: 'Warehouse', file: 'warehouse.html' }
      ]
    },
    {
      id: 'keuangan',
      icon: 'fa-solid fa-sack-dollar',
      label: 'Keuangan',
      items: [
        { id: 'points', icon: 'fa-solid fa-coins', label: 'Transaksi Poin', file: 'points.html' },
        { id: 'payments', icon: 'fa-solid fa-credit-card', label: 'Payment', file: 'payments.html' }
      ]
    },
    {
      id: 'pelanggan',
      icon: 'fa-solid fa-user-group',
      label: 'Pelanggan',
      items: [
        { id: 'customers', icon: 'fa-solid fa-user', label: 'Customer', file: 'customers.html' },
        { id: 'membership', icon: 'fa-solid fa-ranking-star', label: 'Membership & Tier', file: 'membership.html' }
      ]
    }
  ];

  /* ============ MAP NAMA FILE → MENU & GROUP ============ */
  var FILE_TO_MENU = {
    'dashboard.html': 'dashboard',
    'orders.html': 'orders',
    'deliveries.html': 'deliveries',
    'complaints.html': 'complaints',
    'stock.html': 'stock',
    'warehouse.html': 'warehouse',
    'points.html': 'points',
    'payments.html': 'payments',
    'customers.html': 'customers',
    'membership.html': 'membership'
  };

  var FILE_TO_GROUP = {
    'dashboard.html': 'dashboard-group',
    'orders.html': 'operasional',
    'deliveries.html': 'operasional',
    'complaints.html': 'operasional',
    'stock.html': 'stok-gudang',
    'warehouse.html': 'stok-gudang',
    'points.html': 'keuangan',
    'payments.html': 'keuangan',
    'customers.html': 'pelanggan',
    'membership.html': 'pelanggan'
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
     Halaman dashboard/operator.html → submenu pakai 'operator/xxx.html'
     Halaman dashboard/operator/xxx.html → submenu cuma 'xxx.html'     */
  function getFileHref(file) {
    var inFolder = window.location.pathname.indexOf('/operator/') !== -1;
    return inFolder ? file : 'operator/' + file;
  }
  function getDashboardHref() {
    var inFolder = window.location.pathname.indexOf('/operator/') !== -1;
    return inFolder ? '../../dashboard/operator.html' : 'operator.html';
  }
  function getCssBase() {
    return window.location.pathname.indexOf('/operator/') !== -1 ? '../../' : '../';
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
    var groupHtml = OP_MENU_GROUPS.map(function (group) {
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
      '    <span class="logo-text">Jastip<span>.</span> Operator</span>' +
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
      '      <h1 id="headerTitle">Dashboard Operator</h1>' +
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
      '        <div class="header-user-role"><span class="role-badge role-admin" id="headerRole">Operator</span></div>' +
      '      </div>' +
      '    </div>' +
      '    <button class="logout-btn" id="logoutBtn"><i class="fa-solid fa-right-from-bracket"></i> Keluar</button>' +
      '  </div>' +
      '</header>';
  }

  /* ============ RENDER USER INFO ============ */
  function renderUser(session) {
    var name = session ? session.name : 'Operator';
    var avatar = session && session.avatar ? session.avatar : name.charAt(0).toUpperCase();
    var roleText = session && session.position ? session.position : 'Operator / Admin';

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
    var pageHead = $('.op-page-head');
    var main = $('.op-main');
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
  function initOperatorLayout() {
    var body = document.body;
    if (!body.classList.contains('op-body')) return;
    if ($('#sidebar')) return;

    // Proteksi: hanya role operator yang bisa akses halaman operator
    if (window.JastipAuth && window.JastipAuth.checkSession) {
      var session = window.JastipAuth.checkSession('operator');
      if (!session) return;
    }

    ensureCss(getCssBase() + 'css/dashboard.css');
    ensureCss(getCssBase() + 'css/hub.css');
    ensureCss(getCssBase() + 'css/superadmin.css');
    ensureCss(getCssBase() + 'css/operator.css');
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
    var h1 = $('.op-page-head h1');
    if (titleEl && h1) titleEl.textContent = h1.textContent;

    renderUser(getSession());
    bindEvents();
    moveContent();
  }

  // Ekspos global
  window.JastipOperatorLayout = {
    init: initOperatorLayout,
    menuGroups: OP_MENU_GROUPS,
    toast: showToast
  };

  document.addEventListener('DOMContentLoaded', initOperatorLayout);
})();