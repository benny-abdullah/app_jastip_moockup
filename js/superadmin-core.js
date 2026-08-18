/* ============================================================
   JASTIP — SUPERADMIN CORE JS
   Renderer GENERIK untuk semua halaman superadmin:
   - Card info (4 kartu)
   - Filter bar (dropdown + filter tanggal Mulai–Akhir)
   - Tabel CRUD (search + filter chip + pagination)
   - Modal tambah/edit/hapus (CRUD via localStorage)
   - Charts (Chart.js: line, doughnut, bar, area)
   Halaman cukup buat <body class="sa-body"> + <div data-sa-page="modulId">
   ============================================================ */

(function () {
  'use strict';

  function $(sel, scope) { return (scope || document).querySelector(sel); }
  function $$(sel, scope) { return Array.prototype.slice.call((scope || document).querySelectorAll(sel)); }

  var PAGE_SELECTOR = '[data-sa-page]';

  /* ============ FORMATTERS ============ */
  function formatRp(n) {
    return 'Rp ' + Number(n || 0).toLocaleString('id-ID');
  }
  function formatPts(n) {
    var v = Number(n || 0);
    return (v < 0 ? '- ' : '') + Number(Math.abs(v)).toLocaleString('id-ID') + ' pts';
  }
  function formatNum(n) {
    return Number(n || 0).toLocaleString('id-ID');
  }
  function formatPercent(n) {
    return Number(n || 0).toLocaleString('id-ID') + '%';
  }

  /* ============ BADGE COLOR MAP ============ */
  function badgeClass(value) {
    var v = String(value || '').toLowerCase();
    var map = {
      'aktif': 'green', 'active': 'green', 'success': 'green', 'selesai': 'green', 'paid': 'green',
      'lunas': 'green', 'matched': 'green', 'completed': 'green', 'resolved': 'green', 'approved': 'green',
      'a': 'green', 'verified': 'green', 'received': 'green', 'shipped': 'green', 'sent': 'green',
      'nonaktif': 'gray', 'rejected': 'gray', 'cancelled': 'gray', 'closed': 'gray', 'expired': 'gray',
      'nonaktif': 'gray', 'd': 'gray', 'draft': 'gray', 'skipped': 'gray',
      'pending': 'amber', 'menunggu': 'amber', 'in progress': 'amber', 'diproses': 'amber',
      'partial': 'amber', 'overdue': 'amber', 'b': 'amber', 'paused': 'amber', 'gagal': 'amber',
      'failed': 'red', 'open': 'red', 'urgent': 'red', 'habis': 'red', 'over budget': 'red',
      'terlambat': 'red', 'tunggakan': 'red', 'unmatched': 'red', 'c': 'amber',
      'topup': 'blue', 'cashback': 'green', 'bonus': 'purple', 'purchase': 'blue', 'redeem': 'amber',
      'processed': 'blue', 'in_purchase': 'blue', 'level 2': 'purple', 'high': 'red', 'medium': 'amber',
      'low': 'gray', 'platinum': 'purple', 'gold': 'amber', 'silver': 'gray', 'bronze': 'amber',
      'normal': 'blue', 'in progress': 'amber', 'menunggu': 'amber', 'storage': 'blue', 'picking': 'purple',
      'damaged': 'red', 'quarantine': 'amber', 'fast moving': 'red', 'slow moving': 'blue',
      'expected': 'amber', 'paid': 'green', 'calculated': 'blue'
    };
    if (v.indexOf('approved') !== -1) return 'green';
    if (v.indexOf('pending') !== -1) return 'amber';
    if (v.indexOf('failed') !== -1 || v.indexOf('urgent') !== -1 || v.indexOf('open') !== -1 || v.indexOf('habis') !== -1) return 'red';
    if (v.indexOf('processed') !== -1) return 'blue';
    return map[v] || 'gray';
  }

  function valueCell(col, val) {
    if (val === undefined || val === null || val === '') return '<span style="color:#94a3b8">-</span>';
    switch (col.type) {
      case 'currency': return formatRp(val);
      case 'points': return formatPts(val);
      case 'number': return formatNum(val);
      case 'percent': return formatPercent(val);
      case 'badge': return '<span class="sa-badge ' + badgeClass(val) + '">' + (typeof val === 'string' ? val.replace(/_/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); }) : val) + '</span>';
      case 'progress':
        var pct = Math.min(100, Number(val) || 0);
        return '<div style="min-width:90px;max-width:160px">' +
          '<div class="sa-progress"><div class="sa-progress-bar" style="width:' + pct + '%"></div></div>' +
          '<div style="font-size:11px;color:#64748b;margin-top:4px">' + pct + '%</div></div>';
      case 'icon': return '<i class="fa-solid ' + (val || 'fa-circle') + '" style="color:#00AA5B;font-size:16px"></i>';
      case 'image':
        var src = val || 'https://placehold.co/60x60/e2e8f0/64748b?text=No+Image';
        return '<img src="' + src + '" alt="Foto Produk" style="width:44px;height:44px;object-fit:cover;border-radius:8px;border:1px solid #e2e8f0">';
      default: return String(val);
    }
  }

  /* ============ STATE ============ */
  var state = {
    rows: [],
    filtered: [],
    page: 1,
    perPage: 5,
    search: '',
    chip: 'Semua',
    modalIndex: -1,
    modalMode: 'create',
    container: null
  };

  /* ============ BUILD CARD GRID ============ */
  function buildCards(module) {
    var html = (module.cards || []).map(function (c) {
      return '<div class="sa-card">' +
        '<div class="sa-card-icon" style="background:' + (c.color || 'linear-gradient(135deg,#00AA5B,#34d399)') + '">' +
        '<i class="' + (c.icon || 'fa-solid fa-chart-simple') + '"></i></div>' +
        '<div><div class="sa-card-label">' + c.label + '</div>' +
        '<div class="sa-card-value">' + c.value + '</div>' +
        (c.sub ? '<div class="sa-card-sub">' + c.sub + '</div>' : '') +
        '</div></div>';
    }).join('');
    return '<div class="sa-card-grid">' + html + '</div>';
  }

  /* ============ BUILD FILTER BAR ============ */
  function buildFilterBar(module) {
    var selects = (module.filters || []).map(function (f) {
      var opts = (f.options || []).map(function (o) {
        return '<option value="' + o + '">' + o + '</option>';
      }).join('');
      return '<div class="sa-filter-group">' +
        '<label>' + f.label + '</label>' +
        '<select id="sa-filter-' + f.id + '" data-filter-key="' + f.id + '">' + opts + '</select></div>';
    }).join('');

    var dateHtml = '';
    if (module.hasDateFilter) {
      dateHtml = '<div class="sa-filter-group"><label>Dari</label><input type="date" id="sa-dateFrom" value="2026-07-16"></div>' +
        '<div class="sa-filter-group"><label>Sampai</label><input type="date" id="sa-dateTo" value="2026-08-15"></div>';
    }

    return '<div class="sa-filter-bar">' + selects + dateHtml +
      '<div class="sa-filter-group"><label>&nbsp;</label><button type="button" class="sa-btn-primary" id="sa-applyFilter" style="height:36px"><i class="fa-solid fa-filter"></i> Terapkan</button></div>' +
      '<div class="sa-filter-group"><label>&nbsp;</label><button type="button" class="sa-btn-secondary" id="sa-resetFilter" style="height:36px">Reset</button></div>' +
      '</div>';
  }

  /* ============ BUILD CHIP BAR ============ */
  function buildChips(module) {
    var chips = (module.chips || ['Semua']).map(function (c) {
      return '<button type="button" class="sa-chip' + (c === 'Semua' ? ' active' : '') + '" data-chip="' + c + '">' + c + '</button>';
    }).join('');
    return '<div class="sa-chips">' + chips + '</div>';
  }

  /* ============ BUILD TABLE ============ */
  function buildTable(module) {
    var cols = module.columns || [{ key: 'name', label: 'Nama' }];

    var thead = '<tr>' + cols.map(function (c) {
      return '<th>' + c.label + '</th>';
    }).join('') + (module.hasCrud ? '<th style="text-align:right">Aksi</th>' : '') + '</tr>';

    var tbody;
    if (state.filtered.length === 0) {
      tbody = '<tr><td colspan="' + (cols.length + (module.hasCrud ? 1 : 0)) + '" style="text-align:center;color:#94a3b8;padding:28px"><i class="fa-solid fa-inbox" style="font-size:22px;display:block;margin-bottom:8px"></i>Tidak ada data</td></tr>';
    } else {
      var start = (state.page - 1) * state.perPage;
      var pageRows = state.filtered.slice(start, start + state.perPage);
      tbody = pageRows.map(function (row, i) {
        var cells = cols.map(function (c) {
          return '<td>' + valueCell(c, row[c.key]) + '</td>';
        }).join('');
        var actions = '';
        if (module.hasCrud) {
          var realIdx = state.rows.indexOf(row);
          actions = '<td><div class="sa-actions">' +
            '<button class="sa-edit" data-index="' + realIdx + '" title="Edit"><i class="fa-solid fa-pen"></i></button>' +
            (module.hasPrint ? '<button class="sa-print" data-index="' + realIdx + '" title="Cetak Surat Pesanan"><i class="fa-solid fa-print"></i></button>' : '') +
            '<button class="sa-del" data-index="' + realIdx + '" title="Hapus"><i class="fa-solid fa-trash"></i></button>' +
            '</div></td>';
        } else if (module.hasPrint) {
          var realIdx2 = state.rows.indexOf(row);
          actions = '<td><div class="sa-actions">' +
            '<button class="sa-print" data-index="' + realIdx2 + '" title="Cetak Surat Pesanan"><i class="fa-solid fa-print"></i></button>' +
            '</div></td>';
        }
        return '<tr>' + cells + actions + '</tr>';
      }).join('');
    }

    return '<div class="sa-table-wrap"><table class="sa-table"><thead>' + thead + '</thead><tbody>' + tbody + '</tbody></table></div>';
  }

  /* ============ BUILD PAGINATION ============ */
  function buildPagination(module) {
    var total = state.filtered.length;
    var pages = Math.max(1, Math.ceil(total / state.perPage));
    if (state.page > pages) state.page = pages;
    if (state.page < 1) state.page = 1;

    var btn = '';
    var startP = Math.max(1, state.page - 2);
    var endP = Math.min(pages, state.page + 2);
    if (startP > 1) {
      btn += '<button data-page="1">1</button>';
      if (startP > 2) btn += '<span style="color:#94a3b8;font-size:12px">…</span>';
    }
    for (var p = startP; p <= endP; p++) {
      btn += '<button data-page="' + p + '" class="' + (p === state.page ? 'active' : '') + '">' + p + '</button>';
    }
    if (endP < pages) {
      if (endP < pages - 1) btn += '<span style="color:#94a3b8;font-size:12px">…</span>';
      btn += '<button data-page="' + pages + '">' + pages + '</button>';
    }

    var from = total === 0 ? 0 : (state.page - 1) * state.perPage + 1;
    var to = Math.min(total, state.page * state.perPage);

    return '<div class="sa-pagination">' +
      '<span class="sa-page-info">Menampilkan <b>' + from + '–' + to + '</b> dari <b>' + total + '</b> data</span>' +
      '<div class="sa-page-btns">' +
      '<button data-page="' + (state.page - 1) + '" ' + (state.page <= 1 ? 'disabled' : '') + '><i class="fa-solid fa-chevron-left"></i></button>' + btn +
      '<button data-page="' + (state.page + 1) + '" ' + (state.page >= pages ? 'disabled' : '') + '><i class="fa-solid fa-chevron-right"></i></button>' +
      '</div></div>';
  }

  /* ============ FILTER LOGIC ============ */
  function applyFilters(module) {
    var rows = state.rows.slice();
    var search = state.search.toLowerCase();

    if (search) {
      rows = rows.filter(function (r) {
        return (module.columns || []).some(function (c) {
          var v = r[c.key];
          return v !== undefined && v !== null && String(v).toLowerCase().indexOf(search) !== -1;
        });
      });
    }

    // Filter dropdown (generic: cocokkan nilai kolom yang mengandung label filter)
    $$('.sa-filter-bar select[data-filter-key]').forEach(function (sel) {
      var val = sel.value;
      if (!val || val.indexOf('Semua') === 0) return;
      rows = rows.filter(function (r) {
        return Object.keys(r).some(function (k) {
          var v = String(r[k] || '').toLowerCase();
          return v.indexOf(val.toLowerCase()) !== -1;
        });
      });
    });

    // Filter chip (fallback: string match di seluruh sel)
    if (state.chip && state.chip !== 'Semua') {
      var chipL = state.chip.toLowerCase();
      rows = rows.filter(function (r) {
        return Object.keys(r).some(function (k) {
          var v = String(r[k] || '').toLowerCase();
          return v.indexOf(chipL) !== -1;
        });
      });
    }

    state.filtered = rows;
  }

  /* ============ RENDER SEMUA ============ */
  function render(module, container) {
    applyFilters(module);

    var head = container.querySelector('.sa-table-head');
    var searchInput = container.querySelector('#sa-tableSearch');
    var perPage = container.querySelector('#sa-perPage');

    // Update tabel
    var tableWrap = container.querySelector('#sa-tableContainer');
    if (tableWrap) tableWrap.innerHTML = buildTable(module);

    var pageWrap = container.querySelector('#sa-paginationContainer');
    if (pageWrap) pageWrap.innerHTML = buildPagination(module);

    if (head) {
      var count = container.querySelector('#sa-countBadge');
      if (count) count.textContent = state.filtered.length + ' data';
    }
    if (searchInput) searchInput.value = state.search;
    if (perPage) perPage.value = state.perPage;
  }

  /* ============ BUILD MODAL (CREATE/EDIT) ============ */
  function buildModal(module) {
    var fields = module.modalFields || [];
    var dataAPI = window.JastipSuperadminData || {};
    var grid = fields.map(function (f) {
      var inputHtml;
      if (f.type === 'select') {
        var options = f.options || [];
        // Dynamic: ambil opsi dari master data (kategori & supplier) + searchable.
        // Gunakan getRows() agar membaca localStorage — CRUD yang dilakukan
        // di suppliers.html / categories.html langsung tampil di dropdown.
        if (f.dynamic) {
          var rows = dataAPI.getRows ? dataAPI.getRows(f.dynamicSource || 'categories') : [];
          options = rows.map(function (r) { return r.name; });
        }
        var opts = options.map(function (o) {
          return '<option value="' + o + '">' + o + '</option>';
        }).join('');
        inputHtml = '' +
          '<div class="sa-search-select">' +
          '<input type="search" class="sa-select-search" id="sa-search-' + f.key + '" placeholder="Ketik untuk mencari..." autocomplete="off">' +
          '<select id="sa-field-' + f.key + '" size="5" style="width:100%">' + opts + '</select>' +
          '</div>';
      } else if (f.type === 'textarea') {
        inputHtml = '<textarea id="sa-field-' + f.key + '" rows="3" placeholder="' + (f.placeholder || '') + '"></textarea>';
      } else if (f.type === 'date') {
        inputHtml = '<input type="date" id="sa-field-' + f.key + '">';
      } else {
        inputHtml = '<input type="' + (f.type === 'number' ? 'number' : 'text') + '" id="sa-field-' + f.key + '" placeholder="' + (f.placeholder || '') + '">';
      }
      return '<div class="sa-form-group' + (f.full ? ' full' : '') + '">' +
        '<label>' + f.label + '</label>' + inputHtml + '</div>';
    }).join('');

    return '' +
      '<div class="sa-modal-overlay" id="saModalOverlay">' +
      '<div class="sa-modal">' +
      '<div class="sa-modal-head"><h3 id="saModalTitle">Tambah Data</h3>' +
      '<button type="button" class="sa-modal-close" id="saModalClose"><i class="fa-solid fa-xmark"></i></button></div>' +
      '<div class="sa-modal-body"><div class="sa-form-grid">' + grid + '</div></div>' +
      '<div class="sa-modal-foot">' +
      '<button type="button" class="sa-btn-secondary" id="saModalCancel">Batal</button>' +
      '<button type="button" class="sa-btn-primary" id="saModalSave"><i class="fa-solid fa-floppy-disk"></i> Simpan</button>' +
      '</div>' +
      '</div></div>';
  }

  function openModal(module, index) {
    state.modalIndex = index;
    state.modalMode = index === -1 ? 'create' : 'edit';

    var overlay = $('#saModalOverlay');
    if (!overlay) return;
    var title = $('#saModalTitle');
    if (title) title.textContent = state.modalMode === 'create' ? 'Tambah ' + module.title : 'Edit ' + module.title;

    var row = state.modalIndex === -1 ? {} : state.rows[state.modalIndex];
    (module.modalFields || []).forEach(function (f) {
      var el = $('#sa-field-' + f.key);
      if (el && row) {
        el.value = row[f.key] !== undefined && row[f.key] !== null ? row[f.key] : (f.type === 'date' ? '' : '');
      }
    });

    overlay.classList.add('show');

    // Bind searchable select (dynamic dropdown: kategori/supplier)
    $$('.sa-select-search').forEach(function (searchInput) {
      var key = searchInput.getAttribute('id').replace('sa-search-', '');
      var selectEl = $('#sa-field-' + key);
      if (selectEl) {
        searchInput.addEventListener('input', function () {
          var q = this.value.toLowerCase();
          $$('option', selectEl).forEach(function (opt) {
            opt.style.display = opt.text.toLowerCase().indexOf(q) !== -1 ? '' : 'none';
          });
        });
        searchInput.addEventListener('keydown', function (e) {
          if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            var visible = $$('option', selectEl).filter(function (o) { return o.style.display !== 'none'; });
            var idx = visible.indexOf(selectEl.selectedOptions[0]) + (e.key === 'ArrowDown' ? 1 : -1);
            if (idx >= 0 && idx < visible.length) selectEl.selectedIndex = visible[idx].index;
          }
        });
      }
    });

    // === MODUL PRODUK: SKU OTOMATIS + KALKULASI RAB REALTIME ===
    if (module.id === 'products') {
      // SKU otomatis saat tambah baru (tidak perlu input manual)
      var skuEl = $('#sa-field-sku');
      if (skuEl && state.modalMode === 'create') {
        var nextNum = (state.rows.length + 1);
        skuEl.value = 'PRD-' + String(nextNum).padStart(3, '0');
      }
      bindRabCalculation();
      updateRabCalculation();
    }
  }

  /* ============ KALKULASI RAB PER PRODUK (REALTIME) ============
     Harga Jual = Harga Biaya × (1 + Total % RAB)
     Point = Harga Jual (1 pts = Rp 1)
     Komponen RAB: Fee, Diskon Member, Diskon Lainnya,
     Biaya Operasional, Biaya Lainnya, Overhead.                */
  var RAB_FIELDS = [
    { key: 'feePercent', label: 'Fee' },
    { key: 'memberDiscountPercent', label: 'Diskon Member' },
    { key: 'otherDiscountPercent', label: 'Diskon Lainnya' },
    { key: 'operationalCostPercent', label: 'Biaya Operasional' },
    { key: 'otherCostPercent', label: 'Biaya Lainnya' },
    { key: 'overheadPercent', label: 'Overhead' }
  ];

  function bindRabCalculation() {
    var priceEl = $('#sa-field-price');
    if (!priceEl) return;

    RAB_FIELDS.forEach(function (f) {
      var el = $('#sa-field-' + f.key);
      if (el) {
        el.addEventListener('input', function () { calcRab(); });
      }
    });
    if (priceEl) priceEl.addEventListener('input', calcRab);
  }

  // Konversi Rupiah ke Poin memakai rate aktif dari master currency-conversion.
  function getConversionRate() {
    var dataAPI = window.JastipSuperadminData;
    if (dataAPI && dataAPI.getRows) {
      var rates = dataAPI.getRows('currency-conversion');
      var aktif = rates.filter(function (r) { return r.status === 'Aktif'; })[0];
      if (aktif && aktif.rate > 0) return Number(aktif.rate);
    }
    return 1; // fallback: 1 Poin = Rp 1
  }

  function calcRab() {
    var priceEl = $('#sa-field-price');
    var sellingEl = $('#sa-field-sellingPrice');
    var pointsEl = $('#sa-field-points');
    if (!priceEl || !sellingEl || !pointsEl) return;

    var base = parseFloat(priceEl.value) || 0;
    var totalPct = 0;
    RAB_FIELDS.forEach(function (f) {
      var el = $('#sa-field-' + f.key);
      var v = el ? (parseFloat(el.value) || 0) : 0;
      totalPct += v;
    });

    var selling = Math.round(base * (1 + totalPct / 100));
    sellingEl.value = selling;
    var rate = getConversionRate();
    pointsEl.value = Math.round(selling / rate); // Harga Jual (Rp) ÷ Rate = Point
  }

  function updateRabCalculation() {
    var priceEl = $('#sa-field-price');
    if (priceEl) {
      calcRab();
    }
  }

  function saveModal(module) {
    var dataAPI = window.JastipSuperadminData;
    if (!dataAPI) return;

    var newRow = {};
    (module.modalFields || []).forEach(function (f) {
      var el = $('#sa-field-' + f.key);
      if (el) {
        var v = el.value;
        if (f.type === 'number') v = Number(v) || 0;
        newRow[f.key] = v;
      }
    });

    if (state.modalMode === 'create') {
      state.rows = dataAPI.addRow(module.id, newRow);
    } else if (state.modalIndex >= 0) {
      state.rows = dataAPI.updateRow(module.id, state.modalIndex, newRow);
    }

    var overlay = $('#saModalOverlay');
    if (overlay) overlay.classList.remove('show');

    var toast = window.JastipSuperadminLayout && window.JastipSuperadminLayout.toast;
    if (toast) toast(state.modalMode === 'create' ? 'Data berhasil ditambahkan' : 'Data berhasil diperbarui');

    if (state.container) render(module, state.container);
  }

  function deleteRowConfirm(module, index) {
    var dataAPI = window.JastipSuperadminData;
    if (!dataAPI) return;
    if (!window.confirm('Yakin ingin menghapus data ini?')) return;
    state.rows = dataAPI.deleteRow(module.id, index);
    var toast = window.JastipSuperadminLayout && window.JastipSuperadminLayout.toast;
    if (toast) toast('Data berhasil dihapus');
    if (state.container) render(module, state.container);
  }

  /* ============ BUILD CHARTS ============ */
  var chartInstances = [];
  function destroyCharts() {
    chartInstances.forEach(function (c) { try { c.destroy(); } catch (e) {} });
    chartInstances = [];
  }

  function buildCharts(module, container) {
    var charts = module.charts || [];
    if (charts.length === 0 || typeof Chart === 'undefined') return;

    var html = chartBoxesHtml(module);
    var holder = container.querySelector('#sa-chartsContainer');
    if (holder) holder.innerHTML = html;

    charts.forEach(function (ch, i) {
      var canvas = container.querySelector('#sa-chart-' + i);
      if (!canvas) return;
      var ctx = canvas.getContext('2d');

      var config = { type: ch.type === 'area' ? 'line' : ch.type, data: { labels: ch.labels || [], datasets: [] } };
      var palette = ['#00AA5B', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#0ea5e9', '#14b8a6', '#f97316'];

      if (ch.type === 'doughnut') {
        config.data.datasets.push({ data: ch.data || [], backgroundColor: palette, borderWidth: 2, borderColor: '#fff' });
      } else if (ch.type === 'bar') {
        var color = ch.color || palette[0];
        var hasPair = ch.budget && ch.actual;
        if (hasPair) {
          config.data.datasets.push(
            { label: 'Budget', data: ch.budget || [], backgroundColor: 'rgba(59,130,246,.75)', borderRadius: 6 },
            { label: 'Actual', data: ch.actual || [], backgroundColor: 'rgba(0,170,91,.75)', borderRadius: 6 }
          );
        } else {
          config.data.datasets.push({ label: ch.title, data: ch.data || [], backgroundColor: color, borderRadius: 6 });
        }
      } else { // line & area
        config.data.datasets.push({
          label: ch.title, data: ch.data || [],
          borderColor: ch.color || '#00AA5B', backgroundColor: ch.type === 'area' ? 'rgba(0,170,91,.15)' : 'transparent',
          fill: ch.type === 'area', tension: .4, borderWidth: 2.5, pointBackgroundColor: '#fff', pointBorderColor: ch.color || '#00AA5B', pointRadius: 4
        });
      }

      chartInstances.push(new Chart(ctx, config));
    });
  }

  function chartBoxesHtml(module) {
    var charts = module.charts || [];
    var hasBarLast = charts.length === 3;
    return '<div class="sa-charts-grid' + (hasBarLast ? ' has-bar-last' : '') + '">' +
      charts.map(function (ch, i) {
        return '<div class="sa-chart-box' + (hasBarLast && i === charts.length - 1 ? ' wide' : '') + '">' +
          '<h3>' + ch.title + '</h3>' +
          '<div class="sa-chart-container"><canvas id="sa-chart-' + i + '"></canvas></div>' +
          '</div>';
      }).join('') + '</div>';
  }

  /* ============ BIND EVENTS ============ */
  function bindEvents(module, container) {
    // Search
    var searchInput = container.querySelector('#sa-tableSearch');
    if (searchInput) {
      searchInput.addEventListener('input', function () {
        state.search = this.value;
        state.page = 1;
        render(module, container);
      });
    }

    // Per page
    var perPage = container.querySelector('#sa-perPage');
    if (perPage) {
      perPage.addEventListener('change', function () {
        state.perPage = Number(this.value);
        state.page = 1;
        render(module, container);
      });
    }

    // Chips (event delegation)
    var chipsWrap = container.querySelector('#sa-chipsContainer');
    if (chipsWrap) {
      chipsWrap.addEventListener('click', function (e) {
        var chip = e.target.closest('.sa-chip');
        if (!chip) return;
        $$('.sa-chip', chipsWrap).forEach(function (c) { c.classList.remove('active'); });
        chip.classList.add('active');
        state.chip = chip.getAttribute('data-chip');
        state.page = 1;
        render(module, container);
      });
    }

    // Pagination (event delegation)
    var pageWrap = container.querySelector('#sa-paginationContainer');
    if (pageWrap) {
      pageWrap.addEventListener('click', function (e) {
        var btn = e.target.closest('button[data-page]');
        if (!btn) return;
        var p = Number(btn.getAttribute('data-page'));
        if (!btn.disabled && p >= 1) {
          state.page = p;
          render(module, container);
        }
      });
    }

    // Tombol aksi tabel (edit/hapus) — delegation
    var tableWrap = container.querySelector('#sa-tableContainer');
    if (tableWrap) {
      tableWrap.addEventListener('click', function (e) {
        var editBtn = e.target.closest('.sa-edit');
        var delBtn = e.target.closest('.sa-del');
        var printBtn = e.target.closest('.sa-print');
        if (editBtn) {
          openModal(module, Number(editBtn.getAttribute('data-index')));
        } else if (delBtn) {
          deleteRowConfirm(module, Number(delBtn.getAttribute('data-index')));
        } else if (printBtn) {
          var idx = Number(printBtn.getAttribute('data-index'));
          var row = state.rows[idx];
          if (row) printPurchaseOrder(module, row);
        }
      });
    }

    // Tombol tambah
    var addBtn = container.querySelector('#sa-addBtn');
    if (addBtn) {
      addBtn.addEventListener('click', function () {
        openModal(module, -1);
      });
    }

    // Filter apply/reset
    var applyBtn = container.querySelector('#sa-applyFilter');
    if (applyBtn) {
      applyBtn.addEventListener('click', function () {
        state.page = 1;
        render(module, container);
      });
    }
    var resetBtn = container.querySelector('#sa-resetFilter');
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        $$('.sa-filter-bar select', container).forEach(function (s) { s.selectedIndex = 0; });
        $$('#sa-tableSearch', container).forEach(function (s) { s.value = ''; });
        state.search = '';
        state.chip = 'Semua';
        state.page = 1;
        $$('.sa-chip', container).forEach(function (c) { c.classList.toggle('active', c.getAttribute('data-chip') === 'Semua'); });
        render(module, container);
      });
    }

    // Modal close/cancel/save
    var overlay = $('#saModalOverlay');
    if (overlay) {
      var closeBtn = $('#saModalClose');
      var cancelBtn = $('#saModalCancel');
      var saveBtn = $('#saModalSave');
      if (closeBtn) closeBtn.addEventListener('click', function () { overlay.classList.remove('show'); });
      if (cancelBtn) cancelBtn.addEventListener('click', function () { overlay.classList.remove('show'); });
      if (saveBtn) saveBtn.addEventListener('click', function () { saveModal(module); });
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) overlay.classList.remove('show');
      });
    }
  }

  /* ============ CETAK SURAT PESANAN (PURCHASE ORDER) ============
     Menampilkan template surat pesanan otomatis dalam window baru
     lalu mencetaknya via window.print(). Data diambil dari row PO. */
  function printPurchaseOrder(module, row) {
    if (!row) return;

    var now = new Date();
    var tanggal = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    // Format Rp
    function fmtRp(n) {
      return 'Rp ' + Number(n || 0).toLocaleString('id-ID');
    }

    // Data supplier (fallback ke nama supplier saja)
    var supplierName = row.supplier || '-';
    var supplierAddress = row.supplierAddress || '-';
    var supplierContact = row.contact || '-';

    // Detail barang: jika row.items tersedia render, jika tidak placeholder
    var itemsHtml = '';
    if (row.items && row.items.length) {
      itemsHtml = row.items.map(function (it, i) {
        return '<tr>' +
          '<td style="padding:6px;border:1px solid #ccc;text-align:center;width:36px;">' + (i + 1) + '</td>' +
          '<td style="padding:6px;border:1px solid #ccc;width:90px;">' + (it.sku || '-') + '</td>' +
          '<td style="padding:6px;border:1px solid #ccc;">' + it.nama + '</td>' +
          '<td style="padding:6px;border:1px solid #ccc;text-align:center;">' + (it.qty || 0) + '</td>' +
          '<td style="padding:6px;border:1px solid #ccc;text-align:right;">' + fmtRp(it.harga) + '</td>' +
          '<td style="padding:6px;border:1px solid #ccc;text-align:right;">' + fmtRp((it.qty || 0) * (it.harga || 0)) + '</td>' +
          '</tr>';
      }).join('');
    } else {
      itemsHtml = '<tr>' +
        '<td style="padding:8px;border:1px solid #ccc;text-align:center;">1</td>' +
        '<td style="padding:8px;border:1px solid #ccc;">-</td>' +
        '<td style="padding:8px;border:1px solid #ccc;">Barang sesuai detail pada Purchase Order ' + row.code + '</td>' +
        '<td style="padding:8px;border:1px solid #ccc;text-align:center;">-</td>' +
        '<td style="padding:8px;border:1px solid #ccc;text-align:right;">' + fmtRp(row.total) + '</td>' +
        '<td style="padding:8px;border:1px solid #ccc;text-align:right;">' + fmtRp(row.total) + '</td>' +
        '</tr>';
    }

    var html = '<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8">' +
      '<title>Surat Pesanan ' + row.code + '</title>' +
      '<style>' +
      'body{font-family:Arial,Helvetica,sans-serif;color:#111;margin:24px;}' +
      '.kop{border-bottom:3px double #000;padding-bottom:12px;margin-bottom:18px;}' +
      '.kop h1{margin:0;font-size:22px;}' +
      '.kop p{margin:2px 0;font-size:12px;color:#333;}' +
      '.judul{text-align:center;margin:20px 0;}' +
      '.judul h2{margin:0;font-size:18px;}' +
      '.judul p{margin:2px 0;font-size:12px;}' +
      'table{width:100%;border-collapse:collapse;}' +
      'th{background:#f0f0f0;}' +
      '.info{margin:12px 0;}' +
      '.info table{border:none;}' +
      '.info td{padding:2px 0;}' +
      '.ttd{display:flex;gap:48px;margin-top:56px;}' +
      '.ttd div{flex:1;text-align:center;}' +
      '.ttd .nama{margin-top:64px;font-weight:bold;text-decoration:underline;}' +
      '.ttd .label{font-size:11px;color:#555;}' +
      '@media print{body{margin:16px;}}' +
      '</style></head><body>' +
      // Kop perusahaan
      '<div class="kop">' +
      '<h1>JASTIP ERP</h1>' +
      '<p>Jl. Merdeka No. 1, Jakarta Pusat, Indonesia</p>' +
      '<p>Telp: (021) 1234-5678 · Email: admin@jastip.id</p>' +
      '</div>' +
      // Judul surat
      '<div class="judul">' +
      '<h2>SURAT PESANAN (PURCHASE ORDER)</h2>' +
      '<p>Nomor: ' + row.code + '</p>' +
      '<p>Tanggal: ' + tanggal + '</p>' +
      '</div>' +
      // Data supplier
      '<div class="info">' +
      '<table>' +
      '<tr><td style="width:140px;"><strong>Kepada Yth.</strong></td><td>' + supplierName + '</td></tr>' +
      '<tr><td>Alamat</td><td>' + supplierAddress + '</td></tr>' +
      '<tr><td>Kontak</td><td>' + supplierContact + '</td></tr>' +
      '<tr><td>Estimasi Tiba (ETA)</td><td>' + (row.eta || '-') + '</td></tr>' +
      '</table>' +
      '</div>' +
      '<p>Dengan hormat, kami memesan barang-barang sebagai berikut:</p>' +
      // Tabel item
      '<table>' +
      '<thead><tr>' +
      '<th style="padding:6px;border:1px solid #ccc;text-align:center;">No</th>' +
      '<th style="padding:6px;border:1px solid #ccc;">SKU</th>' +
      '<th style="padding:6px;border:1px solid #ccc;text-align:left;">Nama Barang</th>' +
      '<th style="padding:6px;border:1px solid #ccc;text-align:center;">Qty</th>' +
      '<th style="padding:6px;border:1px solid #ccc;text-align:right;">Harga Satuan</th>' +
      '<th style="padding:6px;border:1px solid #ccc;text-align:right;">Subtotal</th>' +
      '</tr></thead><tbody>' + itemsHtml +
      '</tbody></table>' +
      // Ringkasan keuangan
      '<table style="margin-top:12px;width:300px;margin-left:auto;">' +
      '<tr><td style="padding:4px;border-top:1px solid #ccc;">Subtotal</td><td style="padding:4px;border-top:1px solid #ccc;text-align:right;">' + fmtRp(row.total) + '</td></tr>' +
      '<tr><td style="padding:4px;">PPN</td><td style="padding:4px;text-align:right;">' + fmtRp(row.ppn) + '</td></tr>' +
      '<tr><td style="padding:4px;">Ongkos Kirim (Freight)</td><td style="padding:4px;text-align:right;">' + fmtRp(row.freight) + '</td></tr>' +
      '<tr><td style="padding:4px;border-top:2px solid #000;"><strong>TOTAL</strong></td><td style="padding:4px;border-top:2px solid #000;text-align:right;"><strong>' + fmtRp((row.total || 0) + (row.ppn || 0) + (row.freight || 0)) + '</strong></td></tr>' +
      '</table>' +
      '<p style="font-size:12px;margin-top:8px;"><strong>Status:</strong> ' + (row.status || '-') + '</p>' +
      '<p style="font-size:12px;">Syarat & ketentuan berlaku sesuai kesepakatan. Mohon konfirmasi penerimaan pesanan ini sebelum tanggal ETA.</p>' +
      // Tanda tangan
      '<div class="ttd">' +
      '<div><div class="label">Dibuat Oleh</div><div class="nama">' + (row.createdBy || 'Manager Purchasing') + '</div></div>' +
      '<div><div class="label">Menyetujui</div><div class="nama">' + (row.approvedBy || 'Direktur') + '</div></div>' +
      '<div><div class="label">Supplier</div><div class="nama">' + supplierName + '</div></div>' +
      '</div>' +
      '</body></html>';

    var win = window.open('', '_blank', 'width=800,height=900');
    if (!win) { alert('Popup diblokir. Izinkan popup untuk mencetak surat pesanan.'); return; }
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(function () {
      win.print();
    }, 400);
  }

  /* ============ BUILD PAGE (main) ============ */
  function buildPage(module, container) {
    var headAction = '';
    if (module.hasCrud) {
      headAction = '<button type="button" class="sa-btn-primary" id="sa-addBtn"><i class="fa-solid fa-plus"></i> Tambah</button>';
    }

    var tableHead = '<div class="sa-table-head">' +
      '<h3>' + module.title + ' <span style="color:#94a3b8;font-weight:600" id="sa-countBadge"></span></h3>' +
      '<div class="sa-table-tools">' +
      '<div class="sa-search-input"><input type="search" id="sa-tableSearch" placeholder="Cari data..."><i class="fa-solid fa-magnifying-glass"></i></div>' +
      '<select class="sa-per-page" id="sa-perPage"><option value="5">5 / hal</option><option value="10">10 / hal</option><option value="25">25 / hal</option></select>' +
      '</div></div>';

    var html =
      '<div class="sa-page-head">' +
      '<div><h1>' + module.title + '</h1>' +
      '<p>' + (module.desc || '') + '</p></div>' +
      '<div class="sa-head-actions">' + headAction + '</div>' +
      '</div>' +
      '<div class="sa-main">' +
      buildCards(module) +
      buildFilterBar(module) +
      '<div class="sa-table-card">' +
      tableHead +
      '<div id="sa-chipsContainer">' + buildChips(module) + '</div>' +
      '<div id="sa-tableContainer"></div>' +
      '<div id="sa-paginationContainer"></div>' +
      '</div>' +
      '<div id="sa-chartsContainer"></div>' +
      buildModal(module) +
      '</div>';

    container.innerHTML = html;
  }

  /* ============ INIT ============ */
  function init() {
    var container = $(PAGE_SELECTOR);
    if (!container) return;
    var moduleId = container.getAttribute('data-sa-page');
    var dataAPI = window.JastipSuperadminData;
    if (!dataAPI) return;

    state.container = container;
    var module = dataAPI.getModule(moduleId);
    state.rows = dataAPI.getRows(moduleId);
    state.filtered = state.rows.slice();
    state.page = 1;
    state.perPage = 5;
    state.search = '';
    state.chip = 'Semua';

    buildPage(module, container);
    bindEvents(module, container);
    render(module, container);

    // Pindahkan konten ke dalam #dashContent setelah layout sidebar ter-inject.
    // (superadmin-layout.js hanya memindahkan .sa-page-head/.sa-main saat init —
    //  konten belum ada, jadi kita pindahkan seluruh container di sini.)
    var dashContent = $('#dashContent');
    if (dashContent && container.parentNode !== dashContent && !dashContent.contains(container)) {
      dashContent.appendChild(container);
    }

    // Render chart setelah container tersedia & berada di #dashContent
    if (window.Chart) {
      destroyCharts();
      buildCharts(module, container);
    }
  }

  // Ulangi init ketika layout sudah inject (DOM ready)
  function safeInit() {
    var tries = 0;
    var loop = setInterval(function () {
      tries++;
      var container = $(PAGE_SELECTOR);
      // Pastikan layout sidebar sudah ditambahkan oleh superadmin-layout.js
      if (container && !$('#sidebar') && tries < 5) return;
      if (container) init();
      clearInterval(loop);
    }, 120);
    // Juga init langsung di DOMContentLoaded kasus sederhana
  }

  document.addEventListener('DOMContentLoaded', function () {
    // Parent layout init berjalan di DOMContentLoaded juga. Definisikan setelah.
    setTimeout(function () { safeInit(); }, 250);
  });
})();