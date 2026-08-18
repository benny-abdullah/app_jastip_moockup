/* ============================================================
   JASTIP — CATALOG JS
   Render produk, filter kategori, search, sort, add-to-cart
   Data dari data/products.json + fallback inline (file://)
   ============================================================ */

(function () {
  'use strict';

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

  /* ============ CATEGORIES ============ */
  var CATEGORIES = [
    { name: 'Semua', icon: 'fa-solid fa-border-all', color: '#00AA5B' },
    { name: 'Sembako', icon: 'fa-solid fa-boxes-stacked', color: '#FF8A3D' },
    { name: 'Makanan', icon: 'fa-solid fa-utensils', color: '#F5C542' },
    { name: 'Elektronik', icon: 'fa-solid fa-mobile-screen', color: '#4A90E2' },
    { name: 'Fashion', icon: 'fa-solid fa-shirt', color: '#FF6B9D' },
    { name: 'Peralatan', icon: 'fa-solid fa-screwdriver-wrench', color: '#5BC26D' },
    { name: 'Kecantikan', icon: 'fa-solid fa-spa', color: '#A78BFA' },
    { name: 'Rewards', icon: 'fa-solid fa-gift', color: '#F94D63' },
    { name: 'Otomotif', icon: 'fa-solid fa-car', color: '#64748B' },
    { name: 'Rumah Tangga', icon: 'fa-solid fa-house-chimney', color: '#F97316' },
    { name: 'Kesehatan', icon: 'fa-solid fa-heart-pulse', color: '#EF4444' },
    { name: 'Olahraga', icon: 'fa-solid fa-dumbbell', color: '#3B82F6' },
    { name: 'Hobi & Mainan', icon: 'fa-solid fa-gamepad', color: '#8B5CF6' },
    { name: 'Buku & Alat Tulis', icon: 'fa-solid fa-book-open', color: '#06B6D4' },
    { name: 'Bayi & Anak', icon: 'fa-solid fa-baby', color: '#EC4899' },
    { name: 'Peliharaan', icon: 'fa-solid fa-paw', color: '#84CC16' }
  ];

  /* ============ FALLBACK PRODUCTS (untuk akses file:// tanpa server) ============ */
  var FALLBACK_PRODUCTS = [
    { id: 1, name: 'Beras Premium 5kg', category: 'Sembako', price: 50000, unit: 'pts', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop&q=80', rating: 4.8, location: 'Jakarta Selatan' },
    { id: 2, name: 'Minyak Goreng 2L', category: 'Sembako', price: 28000, unit: 'pts', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=400&fit=crop&q=80', rating: 4.6, location: 'Jakarta Selatan' },
    { id: 3, name: 'Gula Pasir 1kg', category: 'Sembako', price: 18000, unit: 'pts', image: 'https://images.unsplash.com/photo-1581441363689-1f3c3c414635?w=400&h=400&fit=crop&q=80', rating: 4.5, location: 'Jakarta Pusat' },
    { id: 4, name: 'Kopi Arabika 1kg', category: 'Makanan', price: 95000, unit: 'pts', image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=400&fit=crop&q=80', rating: 4.9, location: 'Aceh' },
    { id: 5, name: 'Roti Tawar Gandum', category: 'Makanan', price: 22000, unit: 'pts', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop&q=80', rating: 4.4, location: 'Bandung' },
    { id: 6, name: 'Power Bank 20000mAh', category: 'Elektronik', price: 85000, unit: 'pts', image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=400&fit=crop&q=80', rating: 4.7, location: 'Jakarta Timur' },
    { id: 7, name: 'TWS Bluetooth Earbuds', category: 'Elektronik', price: 65000, unit: 'pts', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop&q=80', rating: 4.5, location: 'Surabaya' },
    { id: 8, name: 'Kaos Polos Premium', category: 'Fashion', price: 35000, unit: 'pts', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&q=80', rating: 4.6, location: 'Bandung' },
    { id: 9, name: 'Backpack Travel 40L', category: 'Fashion', price: 120000, unit: 'pts', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop&q=80', rating: 4.8, location: 'Yogyakarta' },
    { id: 10, name: 'Vacuum Cleaner Cordless', category: 'Peralatan', price: 250000, unit: 'pts', image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400&h=400&fit=crop&q=80', rating: 4.7, location: 'Jakarta Barat' },
    { id: 11, name: 'Blender Portable USB', category: 'Peralatan', price: 95000, unit: 'pts', image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400&h=400&fit=crop&q=80', rating: 4.4, location: 'Semarang' },
    { id: 12, name: 'Skincare Set Premium', category: 'Kecantikan', price: 150000, unit: 'pts', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop&q=80', rating: 4.8, location: 'Jakarta Pusat' },
    { id: 13, name: 'Parfum Premium 100ml', category: 'Kecantikan', price: 180000, unit: 'pts', image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop&q=80', rating: 4.7, location: 'Surabaya' },
    { id: 14, name: 'Voucher Belanja 100rb', category: 'Rewards', price: 75000, unit: 'pts', image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=400&h=400&fit=crop&q=80', rating: 5.0, location: 'Berlaku Nasional' },
    { id: 15, name: 'Voucher Umroh 1.5jt', category: 'Rewards', price: 1200000, unit: 'pts', image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=400&h=400&fit=crop&q=80', rating: 5.0, location: 'Berlaku Nasional' },
    { id: 16, name: 'Paket Qurban Kambing', category: 'Rewards', price: 2500000, unit: 'pts', image: 'https://images.unsplash.com/photo-1484557985045-edf25e08da73?w=400&h=400&fit=crop&q=80', rating: 4.9, location: 'Berlaku Nasional' },
    { id: 17, name: 'Oli Mesin 1L', category: 'Otomotif', price: 55000, unit: 'pts', image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&h=400&fit=crop&q=80', rating: 4.7, location: 'Jakarta Utara' },
    { id: 18, name: 'Helm Half Face Premium', category: 'Otomotif', price: 185000, unit: 'pts', image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400&h=400&fit=crop&q=80', rating: 4.6, location: 'Tangerang' },
    { id: 19, name: 'Wiper Kaca Depan', category: 'Otomotif', price: 42000, unit: 'pts', image: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=400&h=400&fit=crop&q=80', rating: 4.4, location: 'Bekasi' },
    { id: 20, name: 'Set Panci Stainless 5pc', category: 'Rumah Tangga', price: 210000, unit: 'pts', image: 'https://images.unsplash.com/photo-1584990347449-a2d4c2c5d2e4?w=400&h=400&fit=crop&q=80', rating: 4.7, location: 'Jakarta Pusat' },
    { id: 21, name: 'Sprei Queen 180x200', category: 'Rumah Tangga', price: 98000, unit: 'pts', image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=400&fit=crop&q=80', rating: 4.5, location: 'Depok' },
    { id: 22, name: 'Dispenser Air Galon', category: 'Rumah Tangga', price: 320000, unit: 'pts', image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&h=400&fit=crop&q=80', rating: 4.6, location: 'Jakarta Timur' },
    { id: 23, name: 'Vitamin C 1000mg', category: 'Kesehatan', price: 45000, unit: 'pts', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop&q=80', rating: 4.8, location: 'Jakarta Selatan' },
    { id: 24, name: 'Masker Medis 50pcs', category: 'Kesehatan', price: 25000, unit: 'pts', image: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=400&h=400&fit=crop&q=80', rating: 4.5, location: 'Bandung' },
    { id: 25, name: 'Termometer Digital', category: 'Kesehatan', price: 62000, unit: 'pts', image: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?w=400&h=400&fit=crop&q=80', rating: 4.6, location: 'Surabaya' },
    { id: 26, name: 'Matras Yoga 6mm', category: 'Olahraga', price: 88000, unit: 'pts', image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop&q=80', rating: 4.7, location: 'Yogyakarta' },
    { id: 27, name: 'Dumbbell 5kg (Pair)', category: 'Olahraga', price: 135000, unit: 'pts', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&q=80', rating: 4.8, location: 'Jakarta Barat' },
    { id: 28, name: 'Mainan Edukasi Kayu', category: 'Hobi & Mainan', price: 78000, unit: 'pts', image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&h=400&fit=crop&q=80', rating: 4.6, location: 'Tangerang' },
    { id: 29, name: 'Puzzle 1000 pcs', category: 'Hobi & Mainan', price: 56000, unit: 'pts', image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=400&fit=crop&q=80', rating: 4.7, location: 'Bandung' },
    { id: 30, name: 'Novel Best Seller', category: 'Buku & Alat Tulis', price: 65000, unit: 'pts', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop&q=80', rating: 4.9, location: 'Jakarta Pusat' },
    { id: 31, name: 'Set Alat Tulis Premium', category: 'Buku & Alat Tulis', price: 48000, unit: 'pts', image: 'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=400&h=400&fit=crop&q=80', rating: 4.5, location: 'Jakarta Selatan' },
    { id: 32, name: 'Popok Bayi Premium M', category: 'Bayi & Anak', price: 72000, unit: 'pts', image: 'https://images.unsplash.com/photo-1571731956672-f2b94d7dd0cb?w=400&h=400&fit=crop&q=80', rating: 4.8, location: 'Jakarta Timur' },
    { id: 33, name: 'Botol Susu Anti Kolik', category: 'Bayi & Anak', price: 58000, unit: 'pts', image: 'https://images.unsplash.com/photo-1555252337-9f8e92e837df?w=400&h=400&fit=crop&q=80', rating: 4.7, location: 'Surabaya' },
    { id: 34, name: 'Makanan Kucing 1kg', category: 'Peliharaan', price: 38000, unit: 'pts', image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&h=400&fit=crop&q=80', rating: 4.6, location: 'Depok' },
    { id: 35, name: 'Candit Hewan Peliharaan', category: 'Peliharaan', price: 185000, unit: 'pts', image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop&q=80', rating: 4.7, location: 'Bekasi' }
  ];

  /* ============ STATE ============ */
  var state = {
    category: 'Semua',
    search: '',
    sort: 'popular',
    page: 1,
    perPage: 10
  };

  var allProducts = [];
  var filteredProducts = [];

  /* ============ LOAD DATA ============ */
  function loadProducts() {
    // Deteksi path: jika halaman di folder customer/, path data = ../data/products.json
    // Jika halaman di folder dashboard/hub/, path data = ../../data/products.json
    // Jika halaman di root, path data = data/products.json
    var inCustomerFolder = window.location.pathname.indexOf('/customer/') !== -1;
    var inHubFolder = window.location.pathname.indexOf('/dashboard/hub/') !== -1;
    var dataPath;
    if (inHubFolder) {
      dataPath = '../../data/products.json';
    } else if (inCustomerFolder) {
      dataPath = '../data/products.json';
    } else {
      dataPath = 'data/products.json';
    }
    return fetch(dataPath)
      .then(function (res) {
        if (!res.ok) throw new Error('Status ' + res.status);
        return res.json();
      })
      .then(function (data) { return data.products || []; })
      .catch(function () { return FALLBACK_PRODUCTS; });
  }

  /* ============ RENDER CATEGORY LIST (Sidebar) ============ */
  function renderCategories() {
    var container = $('#categoryList');
    if (!container) return;

    container.innerHTML = CATEGORIES.map(function (cat) {
      var count = cat.name === 'Semua' ? allProducts.length : allProducts.filter(function (p) { return p.category === cat.name; }).length;
      var isActive = cat.name === state.category;
      return '<div class="catalog-side-item' + (isActive ? ' active' : '') + '" data-category="' + cat.name + '">' +
        '<span class="cat-name"><i class="' + cat.icon + '" style="color:' + cat.color + '; width:16px; text-align:center; margin-right:8px;"></i>' + cat.name + '</span>' +
        '<span class="count">' + count + '</span>' +
        '</div>';
    }).join('');

    $$('.catalog-side-item', container).forEach(function (item) {
      item.addEventListener('click', function () {
        state.category = this.getAttribute('data-category');
        state.page = 1;
        renderCategories();
        renderChips();
        renderFilterChips();
        renderProducts();
        renderPagination();
        var titleEl = $('#catalogTitle');
        if (titleEl) titleEl.textContent = state.category === 'Semua' ? 'Semua Produk' : state.category;
      });
    });
  }

  /* ============ RENDER CHIPS (mobile) ============ */
  function renderChips() {
    var container = $('#categoryChips');
    if (!container) return;

    container.innerHTML = CATEGORIES.map(function (cat) {
      var isActive = cat.name === state.category;
      return '<button class="catalog-chip' + (isActive ? ' active' : '') + '" data-cat="' + cat.name + '">' + cat.name + '</button>';
    }).join('');

    $$('.catalog-chip', container).forEach(function (chip) {
      chip.addEventListener('click', function () {
        state.category = this.getAttribute('data-cat');
        state.page = 1;
        renderCategories();
        renderChips();
        renderFilterChips();
        renderProducts();
        renderPagination();
        var titleEl = $('#catalogTitle');
        if (titleEl) titleEl.textContent = state.category === 'Semua' ? 'Semua Produk' : state.category;
      });
    });
  }

  /* ============ RENDER FILTER KATEGORI ============ */
  function renderFilterChips() {
    var container = $('#filterChips');
    if (!container) return;

    container.innerHTML = CATEGORIES.map(function (cat) {
      var count = cat.name === 'Semua' ? allProducts.length : allProducts.filter(function (p) { return p.category === cat.name; }).length;
      var isActive = cat.name === state.category;
      return '<button class="catalog-filter-chip' + (isActive ? ' active' : '') + '" data-cat="' + cat.name + '">' +
        cat.name +
        '<span class="chip-count">' + count + '</span>' +
        '</button>';
    }).join('');

    $$('.catalog-filter-chip', container).forEach(function (chip) {
      chip.addEventListener('click', function () {
        state.category = this.getAttribute('data-cat');
        state.page = 1;
        renderFilterChips();
        renderProducts();
        renderPagination();
        var titleEl = $('#catalogTitle');
        if (titleEl) titleEl.textContent = state.category === 'Semua' ? 'Semua Produk' : state.category;
      });
    });
  }

  /* ============ RENDER PAGINATION ============ */
  function renderPagination() {
    var container = $('#pagination');
    if (!container) return;

    var totalPages = Math.ceil(filteredProducts.length / state.perPage);
    if (totalPages <= 1) {
      container.innerHTML = '';
      return;
    }

    var current = state.page;
    var html = '';

    // Prev button
    html += '<button class="pagination-btn" data-page="' + (current - 1) + '" ' + (current <= 1 ? 'disabled' : '') + ' aria-label="Halaman sebelumnya"><i class="fa-solid fa-chevron-left"></i></button>';

    // Page numbers with ellipsis
    var pages = [];
    for (var i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= current - 1 && i <= current + 1)) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }

    pages.forEach(function (p) {
      if (p === '...') {
        html += '<span class="pagination-ellipsis">...</span>';
      } else {
        html += '<button class="pagination-btn' + (p === current ? ' active' : '') + '" data-page="' + p + '">' + p + '</button>';
      }
    });

    // Next button
    html += '<button class="pagination-btn" data-page="' + (current + 1) + '" ' + (current >= totalPages ? 'disabled' : '') + ' aria-label="Halaman berikutnya"><i class="fa-solid fa-chevron-right"></i></button>';

    container.innerHTML = html;

    $$('.pagination-btn', container).forEach(function (btn) {
      if (btn.disabled) return;
      btn.addEventListener('click', function () {
        var page = parseInt(this.getAttribute('data-page'), 10);
        if (page >= 1 && page <= totalPages) {
          state.page = page;
          renderProducts();
          renderPagination();
          // Scroll ke atas grid
          var grid = $('#productGrid');
          if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  /* ============ RENDER PRODUCTS ============ */
  function getFilteredProducts() {
    var list = allProducts.filter(function (p) {
      var matchCat = state.category === 'Semua' || p.category === state.category;
      var matchSearch = !state.search || p.name.toLowerCase().includes(state.search.toLowerCase()) || p.category.toLowerCase().includes(state.search.toLowerCase());
      return matchCat && matchSearch;
    });

    if (state.sort === 'price-asc') {
      list.sort(function (a, b) { return a.price - b.price; });
    } else if (state.sort === 'price-desc') {
      list.sort(function (a, b) { return b.price - a.price; });
    } else if (state.sort === 'rating') {
      list.sort(function (a, b) { return b.rating - a.rating; });
    } else {
      list.sort(function (a, b) { return b.rating - a.rating; });
    }

    return list;
  }

  function formatPrice(price) {
    return price.toLocaleString('id-ID');
  }

  function renderProducts() {
    var container = $('#productGrid');
    var countEl = $('#productCount');
    if (!container) return;

    filteredProducts = getFilteredProducts();
    var totalPages = Math.ceil(filteredProducts.length / state.perPage);

    // Reset page jika melebihi total
    if (state.page > totalPages) state.page = totalPages || 1;

    var start = (state.page - 1) * state.perPage;
    var end = Math.min(start + state.perPage, filteredProducts.length);
    var pageItems = filteredProducts.slice(start, end);

    if (countEl) countEl.textContent = filteredProducts.length + ' produk ditemukan';

    if (filteredProducts.length === 0) {
      container.innerHTML = '<div class="catalog-empty"><i class="fa-solid fa-box-open"></i><p>Produk tidak ditemukan</p><span>Coba ubah kata kunci atau pilih kategori lain</span></div>';
      renderPagination();
      return;
    }

    container.innerHTML = pageItems.map(function (p) {
      var badge = p.badge || p.category;
      var price = typeof p.price === 'number' ? p.price : parseFloat(p.price) || 0;
      return '<div class="product-card catalog-product">' +
        '<div class="product-thumb">' +
        '<span class="product-badge">' + badge + '</span>' +
        '<button class="product-heart" data-wishlist="' + p.id + '"' +
        ' data-name="' + p.name + '"' +
        ' data-category="' + p.category + '"' +
        ' data-price="' + price + '"' +
        ' data-unit="' + (p.unit || 'pts') + '"' +
        ' data-image="' + p.image + '"' +
        ' data-rating="' + (p.rating || '') + '"' +
        ' data-location="' + (p.location || '') + '"' +
        ' aria-label="Tambah ke wishlist">' +
        '<i class="fa-regular fa-heart"></i>' +
        '</button>' +
        '<img src="' + p.image + '" alt="' + p.name + '" loading="lazy">' +
        '</div>' +
        '<div class="product-body">' +
        '<p class="product-cat">' + p.category + '</p>' +
        '<h3 class="product-name">' + p.name + '</h3>' +
        '<p class="product-meta"><i class="fa-solid fa-star" style="color:#F0B429;"></i> ' + p.rating + ' · ' + p.location + '</p>' +
        '<div class="product-price-row">' +
        '<div>' +
        '<p class="product-price-label">Harga</p>' +
        '<p class="product-price">' + formatPrice(price) + ' <small>pts</small></p>' +
        '</div>' +
        '<button class="product-btn" data-add-cart data-name="' + p.name + '" aria-label="Tambah ke keranjang"><i class="fa-solid fa-cart-plus"></i></button>' +
        '</div>' +
        '</div>' +
        '</div>';
    }).join('');

    // Refresh status hati (terisi/kosong) sesuai isi localStorage wishlist
    if (window.JastipWishlist && window.JastipWishlist.refreshHearts) {
      window.JastipWishlist.refreshHearts();
    }
  }

  /* ============ INIT CONTROLS ============ */
  function initControls() {
    var searchInput = $('#catalogSearch');
    if (searchInput) {
      searchInput.addEventListener('input', function () {
        state.search = this.value.trim();
        state.page = 1;
        renderProducts();
        renderPagination();
      });
    }

    var sortSelect = $('#sortSelect');
    if (sortSelect) {
      sortSelect.addEventListener('change', function () {
        state.sort = this.value;
        state.page = 1;
        renderProducts();
        renderPagination();
      });
    }

    var params = new URLSearchParams(window.location.search);
    var urlCat = params.get('cat');
    if (urlCat && CATEGORIES.some(function (c) { return c.name === urlCat; })) {
      state.category = urlCat;
    }

    var titleEl = $('#catalogTitle');
    if (titleEl) titleEl.textContent = state.category === 'Semua' ? 'Semua Produk' : state.category;
  }

  /* ============ INIT ============ */
  function init() {
    var container = $('#productGrid');
    if (!container) return;

    initControls();

    loadProducts().then(function (products) {
      allProducts = products;
      // renderCategories() dan renderChips() hanya jika elemennya ada
      if ($('#categoryList')) renderCategories();
      if ($('#categoryChips')) renderChips();
      if ($('#filterChips')) renderFilterChips();
      renderProducts();
      renderPagination();
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();