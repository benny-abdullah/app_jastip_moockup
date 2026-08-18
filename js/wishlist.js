/* ============================================================
   JASTIP — WISHLIST JS
   Render produk wishlist dari localStorage (key: jastip_wishlist)
   Data disimpan oleh tombol hati di katalog (js/catalog.js)
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

  /* ============ WISHLIST DATA ============ */
  function getWishlist() {
    if (window.JastipWishlist && window.JastipWishlist.get) {
      return window.JastipWishlist.get();
    }
    try {
      return JSON.parse(localStorage.getItem('jastip_wishlist')) || [];
    } catch (e) {
      return [];
    }
  }

  function formatPrice(price) {
    return Number(price || 0).toLocaleString('id-ID');
  }

  /* ============ RENDER ============ */
  function renderWishlist(list) {
    var grid = $('#wishlistGrid');
    var countEl = $('#wishlistCount');
    if (!grid) return;

    if (countEl) countEl.textContent = list.length + ' Produk Tersimpan';

    if (list.length === 0) {
      grid.innerHTML = '<div class="catalog-empty">' +
        '<i class="fa-solid fa-heart-circle-plus"></i>' +
        '<p>Wishlist kosong</p>' +
        '<span>Klik ikon hati pada produk di katalog untuk menyimpannya di sini</span>' +
        '</div>';
      return;
    }

    grid.innerHTML = list.map(function (p) {
      var image = p.image || 'https://placehold.co/400x400?text=Produk';
      var ratingHtml = '';
      if (p.rating) {
        ratingHtml = '<p class="product-meta"><i class="fa-solid fa-star" style="color:#F0B429;"></i> ' +
          p.rating + (p.location ? ' · ' + p.location : '') + '</p>';
      }
      return '<div class="product-card catalog-product">' +
        '<div class="product-thumb">' +
        '<span class="product-badge">' + (p.category || 'Produk') + '</span>' +
        '<button class="product-heart active" data-wishlist="' + p.id + '"' +
        ' data-name="' + p.name + '" aria-label="Hapus dari wishlist">' +
        '<i class="fa-solid fa-heart"></i>' +
        '</button>' +
        '<img src="' + image + '" alt="' + p.name + '" loading="lazy">' +
        '</div>' +
        '<div class="product-body">' +
        '<p class="product-cat">' + (p.category || 'Produk') + '</p>' +
        '<h3 class="product-name">' + p.name + '</h3>' +
        ratingHtml +
        '<div class="product-price-row">' +
        '<div>' +
        '<p class="product-price-label">Harga</p>' +
        '<p class="product-price">' + formatPrice(p.price) + ' <small>' + (p.unit || 'pts') + '</small></p>' +
        '</div>' +
        '<button class="product-btn" data-add-cart data-name="' + p.name + '" aria-label="Tambah ke keranjang"><i class="fa-solid fa-cart-plus"></i></button>' +
        '</div>' +
        '</div>' +
        '</div>';
    }).join('');
  }

  /* ============ INIT ============ */
  function init() {
    var grid = $('#wishlistGrid');
    if (!grid) return;

    renderWishlist(getWishlist());

    // Klik hati di halaman wishlist → hapus dari localStorage (ditangani main.js),
    // lalu render ulang grid agar kartu yang dihapus langsung hilang.
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('#wishlistGrid [data-wishlist]');
      if (!btn) return;
      // Tunggu main.js selesai update localStorage, lalu render ulang
      setTimeout(function () {
        renderWishlist(getWishlist());
      }, 0);
    });
  }

  document.addEventListener('DOMContentLoaded', init);

  // Fallback: jika DOM sudah siap sebelum script dimuat
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(init, 0);
  }
})();