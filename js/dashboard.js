/* ============================================================
   JASTIP — DASHBOARD JS
   Render sidebar, header, cards, charts (Chart.js), tabel
   + filter chip, search, pagination (client-side)
   + aktivitas, tab switch, welcome banner (customer)
   ============================================================ */

(function () {
  'use strict';

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

  /* ============ FALLBACK DATA (untuk akses file:// tanpa server) ============ */
  var FALLBACK_DATA = {
    superadmin: {
      cards: [
        { id: 1, icon: 'fa-solid fa-dollar-sign', color: '#00AA5B', label: 'Total Penjualan', value: 'Rp 1.250.000.000', change: 12.5, changeLabel: 'vs bulan lalu', positive: true },
        { id: 2, icon: 'fa-solid fa-cart-shopping', color: '#2C7AFF', label: 'Total Order', value: '24.560', change: 8.2, changeLabel: 'vs bulan lalu', positive: true },
        { id: 3, icon: 'fa-solid fa-users', color: '#A78BFA', label: 'Customer Aktif', value: '50.320', change: 4.7, changeLabel: 'vs bulan lalu', positive: true },
        { id: 4, icon: 'fa-solid fa-warehouse', color: '#F0B429', label: 'Hub Aktif', value: '100', change: 2.0, changeLabel: 'vs bulan lalu', positive: true }
      ],
      charts: {
        sales: { type: 'line', label: 'Penjualan per Bulan', labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu'], datasets: [{ label: 'Penjualan (juta Rp)', data: [780, 820, 910, 870, 960, 1050, 1120, 1250], color: '#00AA5B' }] },
        orders: { type: 'doughnut', label: 'Status Order', labels: ['Selesai', 'Diproses', 'Dikirim', 'Batal'], datasets: [{ data: [15420, 4320, 3280, 1540], colors: ['#00AA5B', '#2C7AFF', '#F0B429', '#F94D63'] }] },
        products: { type: 'bar', label: 'Top 5 Produk Terlaris', labels: ['Beras 5kg', 'Minyak 2L', 'Skincare', 'Kopi Arabika', 'Power Bank'], datasets: [{ data: [5200, 4800, 3600, 2900, 2400], color: '#00AA5B' }] }
      },
      tables: {
        recentOrders: {
          title: 'Order Terbaru',
          columns: ['Order ID', 'Customer', 'Produk', 'Total', 'Status', 'Tanggal'],
          rows: [
            ['ORD-2026-0814-01', 'Citra Lestari', 'Beras Premium 5kg', '50.000 pts', 'Selesai', '14 Agu 2026'],
            ['ORD-2026-0814-02', 'Dewi Anggraini', 'Skincare Set', '150.000 pts', 'Dikirim', '14 Agu 2026'],
            ['ORD-2026-0814-03', 'Eko Saputra', 'Power Bank', '85.000 pts', 'Diproses', '13 Agu 2026'],
            ['ORD-2026-0814-04', 'Fitri Handayani', 'Kopi Arabika', '95.000 pts', 'Selesai', '13 Agu 2026'],
            ['ORD-2026-0814-05', 'Galih Prakoso', 'Kaos Polos', '35.000 pts', 'Dibatalkan', '12 Agu 2026'],
            ['ORD-2026-0814-06', 'Hendra Wijaya', 'Backpack 40L', '120.000 pts', 'Selesai', '12 Agu 2026'],
            ['ORD-2026-0814-07', 'Indah Permata', 'Voucher 100rb', '75.000 pts', 'Diproses', '11 Agu 2026'],
            ['ORD-2026-0814-08', 'Joko Susilo', 'Minyak Goreng 2L', '28.000 pts', 'Selesai', '11 Agu 2026'],
            ['ORD-2026-0814-09', 'Kartika Dewi', 'Parfum 100ml', '180.000 pts', 'Dikirim', '10 Agu 2026'],
            ['ORD-2026-0814-10', 'Lukman Hakim', 'Vacuum Cleaner', '250.000 pts', 'Selesai', '10 Agu 2026']
          ]
        }
      }
    },
    hub: {
      cards: [
        { id: 1, icon: 'fa-solid fa-coins', color: '#00AA5B', label: 'Pendapatan Hub', value: 'Rp 325.000.000', change: 10.2, changeLabel: 'vs bulan lalu', positive: true },
        { id: 2, icon: 'fa-solid fa-boxes-stacked', color: '#2C7AFF', label: 'Stok Tersedia', value: '8.420', change: -3.1, changeLabel: 'vs bulan lalu', positive: false },
        { id: 3, icon: 'fa-solid fa-truck-fast', color: '#A78BFA', label: 'Delivery Aktif', value: '128', change: 15.0, changeLabel: 'vs bulan lalu', positive: true },
        { id: 4, icon: 'fa-solid fa-users', color: '#F0B429', label: 'Customer Terdaftar', value: '5.240', change: 6.8, changeLabel: 'vs bulan lalu', positive: true }
      ],
      charts: {
        sales: { type: 'line', label: 'Penjualan Hub per Bulan', labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu'], datasets: [{ label: 'Penjualan (juta Rp)', data: [190, 210, 235, 220, 260, 285, 300, 325], color: '#00AA5B' }] },
        orders: { type: 'doughnut', label: 'Status Delivery', labels: ['Terantar', 'Dalam Perjalanan', 'Menunggu', 'Gagal'], datasets: [{ data: [980, 128, 54, 12], colors: ['#00AA5B', '#2C7AFF', '#F0B429', '#F94D63'] }] },
        products: { type: 'bar', label: 'Stok per Kategori', labels: ['Sembako', 'Elektronik', 'Fashion', 'Kecantikan', 'Peralatan'], datasets: [{ data: [3200, 1250, 980, 760, 540], color: '#2C7AFF' }] }
      },
      tables: {
        recentOrders: {
          title: 'Order Terbaru di Hub',
          columns: ['Order ID', 'Customer', 'Produk', 'Total', 'Status', 'Tanggal'],
          rows: [
            ['ORD-2026-0814-01', 'Citra Lestari', 'Beras Premium 5kg', '50.000 pts', 'Terantar', '14 Agu 2026'],
            ['ORD-2026-0814-02', 'Maya Sari', 'Minyak Goreng 2L', '28.000 pts', 'Dalam Perjalanan', '14 Agu 2026'],
            ['ORD-2026-0814-03', 'Bambang', 'Skincare Set', '150.000 pts', 'Menunggu', '13 Agu 2026'],
            ['ORD-2026-0814-04', 'Rina Amelia', 'Kopi Arabika', '95.000 pts', 'Terantar', '13 Agu 2026'],
            ['ORD-2026-0814-05', 'Agus Salim', 'Kaos Polos', '35.000 pts', 'Gagal', '12 Agu 2026'],
            ['ORD-2026-0814-06', 'Sari Dewi', 'Backpack 40L', '120.000 pts', 'Terantar', '12 Agu 2026']
          ]
        }
      }
    },
    customer: {
      cards: [
        { id: 1, icon: 'fa-solid fa-coins', color: '#00AA5B', label: 'Saldo Points', value: '125.000 pts', change: 15.0, changeLabel: 'dari top-up terakhir', positive: true },
        { id: 2, icon: 'fa-solid fa-cart-shopping', color: '#2C7AFF', label: 'Total Pesanan', value: '24', change: 3.0, changeLabel: 'bulan ini', positive: true },
        { id: 3, icon: 'fa-solid fa-truck', color: '#A78BFA', label: 'Pengiriman Aktif', value: '2', change: 0, changeLabel: 'dalam perjalanan', positive: true },
        { id: 4, icon: 'fa-solid fa-gem', color: '#F0B429', label: 'Tier Membership', value: 'Gold', change: 75, changeLabel: 'progress ke Platinum', positive: true }
      ],
      charts: {
        sales: { type: 'line', label: 'Pengeluaran per Bulan', labels: ['Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu'], datasets: [{ label: 'Belanja (ribu pts)', data: [60, 45, 80, 50, 95, 125], color: '#00AA5B' }] },
        orders: { type: 'doughnut', label: 'Status Pesanan', labels: ['Selesai', 'Dikirim', 'Diproses'], datasets: [{ data: [18, 2, 4], colors: ['#00AA5B', '#2C7AFF', '#F0B429'] }] },
        products: { type: 'bar', label: 'Riwayat Top Up Points', labels: ['Agu', 'Jul', 'Jun', 'Mei'], datasets: [{ data: [150, 100, 100, 100], color: '#A78BFA' }] }
      },
      tables: {
        recentOrders: {
          title: 'Riwayat Pesanan',
          columns: ['Order ID', 'Produk', 'Total', 'Status', 'Tanggal'],
          rows: [
            ['ORD-2026-0814-01', 'Beras Premium 5kg', '50.000 pts', 'Selesai', '14 Agu 2026'],
            ['ORD-2026-0814-02', 'Skincare Set Premium', '150.000 pts', 'Dikirim', '13 Agu 2026'],
            ['ORD-2026-0814-03', 'Kopi Arabika 1kg', '95.000 pts', 'Selesai', '10 Agu 2026'],
            ['ORD-2026-0814-04', 'Minyak Goreng 2L', '28.000 pts', 'Diproses', '08 Agu 2026'],
            ['ORD-2026-0814-05', 'Voucher Belanja', '75.000 pts', 'Selesai', '02 Agu 2026']
          ]
        }
      }
    }
  };

  /* ============ DATA ============ */
  function loadData(path) {
    return new Promise(function (resolve) {
      fetch(path)
        .then(function (res) {
          if (!res.ok) throw new Error('Status ' + res.status);
          return res.json();
        })
        .then(function (data) { resolve(data); })
        .catch(function () { resolve(FALLBACK_DATA); });
    });
  }

  /* ============ MENU PER ROLE ============ */
  var MENUS = {
    superadmin: [
      { id: 'dashboard', icon: 'fa-solid fa-gauge-high', label: 'Dashboard', active: true, href: '#' },
      { id: 'sales', icon: 'fa-solid fa-chart-line', label: 'Sales', href: '#' },
      { id: 'warehouse', icon: 'fa-solid fa-warehouse', label: 'Warehouse', href: '#' },
      { id: 'rab', icon: 'fa-solid fa-file-invoice-dollar', label: 'RAB', href: '#' },
      { id: 'points', icon: 'fa-solid fa-coins', label: 'Points Balance', href: '#' },
      { id: 'fee', icon: 'fa-solid fa-percent', label: 'Fee', href: '#' },
      { id: 'accounting', icon: 'fa-solid fa-scale-balanced', label: 'Accounting', href: '#' },
      { id: 'master', icon: 'fa-solid fa-database', label: 'Master Data', href: '#' },
      { id: 'keuangan', icon: 'fa-solid fa-money-bill-trend-up', label: 'Keuangan', href: '#' }
    ],
    hub: [
      { id: 'dashboard', icon: 'fa-solid fa-gauge-high', label: 'Dashboard Hub', active: true, href: '#' },
      { id: 'warehousing', icon: 'fa-solid fa-boxes-stacked', label: 'Warehousing', href: '#' },
      { id: 'stock-order', icon: 'fa-solid fa-truck-ramp-box', label: 'Order Stok', href: '#' },
      { id: 'delivery', icon: 'fa-solid fa-truck-fast', label: 'Pengiriman', href: '#' },
      { id: 'customers', icon: 'fa-solid fa-users', label: 'Customers', href: '#' },
      { id: 'fee-report', icon: 'fa-solid fa-file-invoice-dollar', label: 'Laporan Fee', href: '#' },
      { id: 'pos', icon: 'fa-solid fa-cash-register', label: 'POS', href: '#' }
    ],
    customer: [
      { id: 'dashboard', icon: 'fa-solid fa-gauge-high', label: 'Dashboard', active: true, href: '../dashboard/customer.html' },
      { id: 'catalog', icon: 'fa-solid fa-store', label: 'Katalog', href: '../customer/catalog.html' },
      { id: 'cart', icon: 'fa-solid fa-cart-shopping', label: 'Keranjang', href: '../customer/cart.html' },
      { id: 'orders', icon: 'fa-solid fa-list-check', label: 'Pesanan', href: '../customer/orders.html' },
      { id: 'points', icon: 'fa-solid fa-coins', label: 'Points & Top Up', href: '../customer/points-topup.html' },
      { id: 'rewards', icon: 'fa-solid fa-gift', label: 'Rewards', href: '../customer/rewards.html' },
      { id: 'subscription', icon: 'fa-solid fa-arrows-rotate', label: 'Subscription', href: '../customer/subscriptions.html' },
      { id: 'complaints', icon: 'fa-solid fa-headset', label: 'Komplain', href: '../customer/complaints.html' },
      { id: 'profile', icon: 'fa-solid fa-user', label: 'Profil & Tier', href: '../customer/profile-tier.html' },
      { id: 'wishlist', icon: 'fa-regular fa-heart', label: 'Wishlist', href: '../customer/wishlists.html' },
      { id: 'reviews', icon: 'fa-solid fa-star', label: 'Review', href: '../customer/product-reviews.html' },
      { id: 'email', icon: 'fa-solid fa-envelope', label: 'Preferensi Email', href: '../customer/email-preferences.html' },
      { id: 'referral', icon: 'fa-solid fa-user-plus', label: 'Referral', href: '../customer/referrals.html' }
    ]
  };

  var ROLE_LABEL = {
    superadmin: 'Superadmin',
    hub: 'Hub Owner',
    customer: 'Customer'
  };

  /* ============ RENDER SIDEBAR ============ */
  function renderSidebar(menu, activeId) {
    var container = $('#sidebarMenu');
    if (!container) return;

    container.innerHTML = menu.map(function (item) {
      var isActive = item.active || item.id === activeId;
      return '<a href="' + item.href + '" class="dash-menu-item' + (isActive ? ' active' : '') + '" data-menu="' + item.id + '">' +
        '<i class="' + item.icon + '"></i>' +
        '<span>' + item.label + '</span>' +
        '</a>';
    }).join('');

    $$('.dash-menu-item', container).forEach(function (item) {
      item.addEventListener('click', function (e) {
        if (this.getAttribute('href') === '#') {
          e.preventDefault();
          $$('.dash-menu-item', container).forEach(function (m) { m.classList.remove('active'); });
          this.classList.add('active');
          showToast('Menu "' + $('span', this).textContent + '" — fitur menyusul (Demo)');
        }
      });
    });
  }

  /* ============ RENDER HEADER ============ */
  function renderHeader(session) {
    var avatarEl = $('#headerAvatar');
    var nameEl = $('#headerName');
    var roleEl = $('#headerRole');
    var positionEl = $('#headerPosition');

    if (avatarEl) avatarEl.textContent = session.avatar || session.name.charAt(0).toUpperCase();
    if (nameEl) nameEl.textContent = session.name;
    if (roleEl) {
      roleEl.textContent = ROLE_LABEL[session.role] || session.role;
      roleEl.className = 'role-badge role-' + session.role;
    }
    if (positionEl) positionEl.textContent = session.position || session.hub || '';

    var currentDateEl = $('#headerDate');
    if (currentDateEl) {
      currentDateEl.textContent = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    }

    var sidebarAvatar = $('#sidebarAvatar');
    var sidebarName = $('#sidebarName');
    var sidebarRole = $('#sidebarRole');
    if (sidebarAvatar) sidebarAvatar.textContent = session.avatar || session.name.charAt(0).toUpperCase();
    if (sidebarName) sidebarName.textContent = session.name;
    if (sidebarRole) sidebarRole.textContent = session.hub || session.position || ROLE_LABEL[session.role];
  }

  /* ============ RENDER CARDS ============ */
  function renderCards(cards) {
    var container = $('#cardsContainer');
    if (!container) return;

    container.innerHTML = cards.map(function (card) {
      var changeClass = card.positive ? 'up' : 'down';
      var changeIcon = card.positive ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down';
      return '<div class="stat-card">' +
        '<div class="stat-icon" style="background:' + card.color + '14; color:' + card.color + ';">' +
        '<i class="' + card.icon + '"></i>' +
        '</div>' +
        '<div class="stat-info">' +
        '<p class="stat-label">' + card.label + '</p>' +
        '<p class="stat-value">' + card.value + '</p>' +
        '<p class="stat-change ' + changeClass + '">' +
        '<i class="fa-solid ' + changeIcon + '"></i> ' +
        (card.change > 0 ? '+' : '') + card.change + '% ' +
        '<span>' + card.changeLabel + '</span>' +
        '</p>' +
        '</div>' +
        '</div>';
    }).join('');
  }

  /* ============ RENDER CHARTS ============ */
  var chartInstances = {};

  function renderCharts(charts) {
    Object.keys(charts).forEach(function (key) {
      var chart = charts[key];
      var canvas = $('#chart-' + key);
      var titleEl = $('#chart-' + key + '-title');
      if (!canvas) return;

      if (titleEl) titleEl.textContent = chart.label;

      if (chartInstances[key]) { chartInstances[key].destroy(); }

      var ctx = canvas.getContext('2d');
      var config;

      if (chart.type === 'line') {
        config = {
          type: 'line',
          data: {
            labels: chart.labels,
            datasets: chart.datasets.map(function (d) {
              return {
                label: d.label,
                data: d.data,
                borderColor: d.color,
                backgroundColor: d.color + '22',
                fill: true,
                tension: 0.4,
                borderWidth: 2.5,
                pointRadius: 3,
                pointBackgroundColor: d.color
              };
            })
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              y: { beginAtZero: true, grid: { color: '#F2F4F7' }, ticks: { font: { size: 11 } } },
              x: { grid: { display: false }, ticks: { font: { size: 11 } } }
            }
          }
        };
      } else if (chart.type === 'doughnut') {
        var doughnutData = chart.datasets[0];
        config = {
          type: 'doughnut',
          data: {
            labels: chart.labels,
            datasets: [{
              data: doughnutData.data,
              backgroundColor: doughnutData.colors,
              borderWidth: 2,
              borderColor: '#FFFFFF'
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '65%',
            plugins: { legend: { position: 'bottom', labels: { padding: 12, usePointStyle: true, pointStyle: 'circle', font: { size: 11 } } } }
          }
        };
      } else if (chart.type === 'bar') {
        var barData = chart.datasets[0];
        config = {
          type: 'bar',
          data: {
            labels: chart.labels,
            datasets: [{
              label: barData.label || chart.label,
              data: barData.data,
              backgroundColor: barData.color + 'CC',
              borderRadius: 6,
              barPercentage: 0.6
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              y: { beginAtZero: true, grid: { color: '#F2F4F7' }, ticks: { font: { size: 11 } } },
              x: { grid: { display: false }, ticks: { font: { size: 11 } } }
            }
          }
        };
      }

      if (config && window.Chart) {
        chartInstances[key] = new window.Chart(ctx, config);
      }
    });
  }

  /* ============ TABLE + FILTER + SEARCH + PAGINATION ============ */
  var tableState = { page: 1, perPage: 5, filter: 'all', search: '' };

  function getStatusClass(status) {
    var s = status.toLowerCase();
    if (s.includes('selesai') || s.includes('terantar') || s.includes('diterima')) return 'badge-green';
    if (s.includes('dibatalkan') || s.includes('gagal') || s.includes('batal')) return 'badge-red';
    if (s.includes('dikirim') || s.includes('perjalanan') || s.includes('diproses') || s.includes('proses')) return 'badge-blue';
    if (s.includes('menunggu') || s.includes('pending')) return 'badge-yellow';
    return 'badge-gray';
  }

  function getChipValues(rows, statusColIndex) {
    var values = {};
    rows.forEach(function (row) {
      var v = row[statusColIndex];
      if (v) values[v] = true;
    });
    return Object.keys(values);
  }

  function renderTable(tableData) {
    var container = $('#tableContainer');
    var titleEl = $('#tableTitle');
    var chipsEl = $('#filterChips');
    if (!container) return;

    if (titleEl) titleEl.textContent = tableData.title || 'Data';
    var columns = tableData.columns;
    var rows = tableData.rows;
    var statusColIndex = columns.length - 2;

    if (chipsEl) {
      var statuses = getChipValues(rows, statusColIndex);
      var chipsHtml = '<button class="chip active" data-filter="all">Semua</button>';
      statuses.forEach(function (s) {
        chipsHtml += '<button class="chip" data-filter="' + s.replace(/"/g, '"') + '">' + s + '</button>';
      });
      chipsEl.innerHTML = chipsHtml;

      $$('.chip', chipsEl).forEach(function (chip) {
        chip.addEventListener('click', function () {
          $$('.chip', chipsEl).forEach(function (c) { c.classList.remove('active'); });
          this.classList.add('active');
          tableState.filter = this.getAttribute('data-filter');
          tableState.page = 1;
          renderTbody();
        });
      });
    }

    var thead = '<tr>' + columns.map(function (c) { return '<th>' + c + '</th>'; }).join('') + '</tr>';
    container.innerHTML = '<div class="table-scroll"><table class="dash-table"><thead>' + thead + '</thead><tbody id="tableBody"></tbody></table></div>' +
      '<div class="pagination-wrap" id="paginationWrap"></div>';

    window._jastipTable = { columns: columns, rows: rows, statusColIndex: statusColIndex };
    renderTbody();
  }

  function getFilteredRows() {
    var t = window._jastipTable || { rows: [], statusColIndex: 0 };
    var rows = t.rows;
    var statusColIndex = t.statusColIndex;

    if (tableState.filter !== 'all') {
      rows = rows.filter(function (r) { return r[statusColIndex] === tableState.filter; });
    }

    if (tableState.search) {
      var q = tableState.search.toLowerCase();
      rows = rows.filter(function (r) { return r.join(' ').toLowerCase().includes(q); });
    }

    return rows;
  }

  function renderTbody() {
    var tbody = $('#tableBody');
    var paginationWrap = $('#paginationWrap');
    if (!tbody) return;

    var rows = getFilteredRows();
    var perPage = tableState.perPage;
    var totalPages = Math.max(1, Math.ceil(rows.length / perPage));

    if (tableState.page > totalPages) tableState.page = totalPages;
    var start = (tableState.page - 1) * perPage;
    var pageRows = rows.slice(start, start + perPage);
    var columns = window._jastipTable.columns;
    var statusColIndex = window._jastipTable.statusColIndex;

    if (pageRows.length === 0) {
      tbody.innerHTML = '<tr><td colspan="' + columns.length + '" class="table-empty">Tidak ada data yang cocok</td></tr>';
    } else {
      tbody.innerHTML = pageRows.map(function (row) {
        return '<tr>' + row.map(function (cell, ci) {
          if (ci === statusColIndex) {
            return '<td><span class="badge ' + getStatusClass(cell) + '">' + cell + '</span></td>';
          }
          return '<td>' + cell + '</td>';
        }).join('') + '</tr>';
      }).join('');
    }

    if (paginationWrap) {
      var totalShown = rows.length;
      var pagHtml = '<div class="pagination-info">Menampilkan <strong>' + (rows.length === 0 ? 0 : start + 1) + '–' + Math.min(start + perPage, totalShown) + '</strong> dari <strong>' + totalShown + '</strong> data</div>';
      pagHtml += '<div class="pagination-btns">';
      pagHtml += '<button class="page-btn" data-page="prev" ' + (tableState.page <= 1 ? 'disabled' : '') + '><i class="fa-solid fa-chevron-left"></i></button>';
      for (var i = 1; i <= totalPages; i++) {
        pagHtml += '<button class="page-btn ' + (i === tableState.page ? 'active' : '') + '" data-page="' + i + '">' + i + '</button>';
      }
      pagHtml += '<button class="page-btn" data-page="next" ' + (tableState.page >= totalPages ? 'disabled' : '') + '><i class="fa-solid fa-chevron-right"></i></button>';
      pagHtml += '</div>';
      paginationWrap.innerHTML = pagHtml;

      $$('.page-btn', paginationWrap).forEach(function (btn) {
        btn.addEventListener('click', function () {
          if (this.disabled) return;
          var p = this.getAttribute('data-page');
          if (p === 'prev') tableState.page = Math.max(1, tableState.page - 1);
          else if (p === 'next') tableState.page = Math.min(totalPages, tableState.page + 1);
          else tableState.page = parseInt(p, 10);
          renderTbody();
        });
      });
    }
  }

  function initTableControls() {
    var searchInput = $('#tableSearch');
    if (searchInput) {
      searchInput.addEventListener('input', function () {
        tableState.search = this.value.trim();
        tableState.page = 1;
        renderTbody();
      });
    }

    var perPageSelect = $('#perPageSelect');
    if (perPageSelect) {
      perPageSelect.addEventListener('change', function () {
        tableState.perPage = parseInt(this.value, 10) || 5;
        tableState.page = 1;
        renderTbody();
      });
    }
  }

  function resetTableState() {
    tableState = { page: 1, perPage: 5, filter: 'all', search: '' };
    var searchInput = $('#tableSearch');
    if (searchInput) searchInput.value = '';
    var perPageSelect = $('#perPageSelect');
    if (perPageSelect) perPageSelect.value = '5';
  }

  /* ============ RENDER ACTIVITIES (Customer) ============ */
  var ACTIVITIES = [
    { icon: 'fa-solid fa-coins', color: '#00AA5B', bg: '#E5FFF3', title: 'Top Up Points Berhasil', desc: 'Top-up 100.000 pts via BCA', time: 'Hari ini · 09:15', pts: '+100.000', plus: true },
    { icon: 'fa-solid fa-truck', color: '#2C7AFF', bg: '#EFF6FF', title: 'Pesanan Dalam Pengiriman', desc: 'ORD-2026-0814-02 · Skincare Set Premium', time: 'Hari ini · 08:40', pts: '150.000', plus: false },
    { icon: 'fa-solid fa-boxes-stacked', color: '#B8860B', bg: '#FFFBEB', title: 'Pesanan Diproses', desc: 'ORD-2026-0814-03 · Kopi Arabika 1kg', time: 'Kemarin · 14:20', pts: '95.000', plus: false },
    { icon: 'fa-solid fa-tag', color: '#DB2777', bg: '#FDF2F8', title: 'Cashback 10% Sembako', desc: 'Promo CBSEM10 diterapkan', time: 'Kemarin · 10:05', pts: '+5.000', plus: true },
    { icon: 'fa-solid fa-gift', color: '#F0B429', bg: '#FFFBEB', title: 'Reward Berhasil Diklaim', desc: 'Voucher Belanja 100rb', time: '02 Agu · 16:30', pts: '-75.000', plus: false },
    { icon: 'fa-solid fa-circle-check', color: '#00AA5B', bg: '#E5FFF3', title: 'Pesanan Selesai', desc: 'ORD-2026-0814-01 · Beras Premium 5kg', time: '14 Agu · 14:30', pts: '50.000', plus: false },
    { icon: 'fa-solid fa-headset', color: '#2563EB', bg: '#EFF6FF', title: 'Komplain Dibalas', desc: 'CMP-2026-001 · Skincare retur', time: '14 Agu · 10:06', pts: '', plus: false },
    { icon: 'fa-solid fa-arrows-rotate', color: '#008743', bg: '#E5FFF3', title: 'Subscription Diperbarui', desc: 'Paket Sembako Bulanan · terkirim 15 Agu', time: '15 Agu · 07:00', pts: '-114.000', plus: false }
  ];

  function renderActivities() {
    var container = $('#activityList');
    if (!container) return;

    container.innerHTML = ACTIVITIES.map(function (a) {
      return '<div class="activity-item">' +
        '<div class="ai-icon" style="background:' + a.bg + '; color:' + a.color + ';"><i class="' + a.icon + '"></i></div>' +
        '<div class="ai-content">' +
        '<p class="ai-title">' + a.title + '</p>' +
        '<p class="ai-desc">' + a.desc + '</p>' +
        '<p class="ai-time">' + a.time + '</p>' +
        '</div>' +
        '<div class="ai-pts ' + (a.plus ? 'plus' : 'minus') + '">' + a.pts + '</div>' +
        '</div>';
    }).join('');
  }

  /* ============ INIT TABS ============ */
  function initTabs() {
    var tabs = $$('.dash-tab');
    if (tabs.length === 0) return;

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var target = this.getAttribute('data-tab');
        tabs.forEach(function (t) { t.classList.remove('active'); });
        this.classList.add('active');

        $$('.tab-panel').forEach(function (panel) {
          panel.classList.toggle('active', panel.id === 'tab-' + target);
        });
      });
    });
  }

  /* ============ RENDER WELCOME CUSTOMER ============ */
  function renderWelcome(session) {
    var titleEl = $('#welcomeTitle');
    var subEl = $('#welcomeSub');
    if (!titleEl) return;

    var firstName = session && session.name ? session.name.split(' ')[0] : 'Customer';
    titleEl.textContent = 'Halo, ' + firstName + '! 👋';
    if (subEl) {
      subEl.textContent = 'Selamat berbelanja. Saldo points Anda ' + (session ? 'siap digunakan' : 'sedang dipantau') + '.';
    }
  }

  /* ============ INIT ============ */
  function init() {
    var role = document.body.getAttribute('data-role');
    if (!role) return;

    // Halaman role hub memakai layout dinamis env:js/hub-layout.js
    if (document.body.classList.contains('hub-body')) return;

    // Proteksi sesi
    var session = window.JastipAuth ? window.JastipAuth.checkSession(role) : null;
    if (!session) return;

    var dataPath = '../data/dashboard.json';

    renderSidebar(MENUS[role] || [], 'dashboard');
    renderHeader(session);
    renderWelcome(session);
    renderActivities();
    initTabs();

    loadData(dataPath).then(function (data) {
      var roleData = data[role];
      if (!roleData) {
        showToast('Data untuk role ini belum tersedia');
        return;
      }
      renderCards(roleData.cards || []);
      if (window.Chart) {
        renderCharts(roleData.charts || {});
      } else {
        $$('.chart-box').forEach(function (el) {
          el.innerHTML = '<p class="table-empty">Chart.js tidak dimuat. Periksa koneksi internet.</p>';
        });
      }
      if (roleData.tables) {
        resetTableState();
        renderTable(roleData.tables.recentOrders || { columns: [], rows: [] });
        initTableControls();
      }
    }).catch(function (err) {
      showToast('Error: ' + err.message);
    });

    var toggleBtn = $('#sidebarToggle');
    var sidebar = $('#sidebar');
    if (toggleBtn && sidebar) {
      toggleBtn.addEventListener('click', function () {
        sidebar.classList.toggle('open');
      });
    }

    var overlay = $('#sidebarOverlay');
    if (overlay && sidebar) {
      overlay.addEventListener('click', function () {
        sidebar.classList.remove('open');
      });
    }

    var logoutBtn = $('#logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function (e) {
        e.preventDefault();
        window.JastipAuth.logout();
      });
    }

    var notifBtn = $('#notifBtn');
    if (notifBtn) {
      notifBtn.addEventListener('click', function () {
        showToast('Tidak ada notifikasi baru');
      });
    }
  }

  /* ============ PUBLIC HELPERS (dipakai halaman hub) ============ */
  window.renderHubCharts = function (roleData) {
    if (!roleData) return;
    if (!window.Chart) {
      $$('.chart-box').forEach(function (el) {
        el.innerHTML = '<p class="table-empty">Chart.js tidak dimuat. Periksa koneksi internet.</p>';
      });
      return;
    }
    renderCharts(roleData.charts || {});
  };

  window.renderDashboardTable = function (roleData) {
    if (!roleData || !roleData.tables) return;
    resetTableState();
    renderTable(roleData.tables.recentOrders || { columns: [], rows: [] });
    initTableControls();
  };

  document.addEventListener('DOMContentLoaded', init);
})();
