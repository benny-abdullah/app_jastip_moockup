/* ============================================================
   JASTIP — MAIN JS (LOKAL)
   Preloader, Carousel, Search, Cart, Wishlist, Auth, Toast, Scroll Top
   ============================================================ */

(function () {
  'use strict';

  /* ============ UTILS ============ */
  function $(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function $$(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }

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
    toast._timer = setTimeout(function () {
      toast.classList.remove('show');
    }, 2600);
  }

  /* ============ PRELOADER ============ */
  function initPreloader() {
    window.addEventListener('load', function () {
      var preloader = $('#preloader');
      if (preloader) {
        setTimeout(function () {
          preloader.style.opacity = '0';
          setTimeout(function () {
            preloader.style.display = 'none';
          }, 400);
        }, 500);
      }
    });

    // Fallback: hide preloader after 3s regardless
    setTimeout(function () {
      var preloader = $('#preloader');
      if (preloader && preloader.style.display !== 'none') {
        preloader.style.display = 'none';
      }
    }, 3000);
  }

  /* ============ CAROUSEL BANNER ============ */
  function initCarousel() {
    var carousel = $('.carousel');
    if (!carousel) return;

    var track = $('.carousel-track', carousel);
    var slides = $$('.carousel-slide', carousel);
    var dotsWrap = $('.carousel-dots', carousel);
    var prevBtn = $('.carousel-nav.prev', carousel);
    var nextBtn = $('.carousel-nav.next', carousel);
    var index = 0;
    var timer = null;
    var total = slides.length;

    if (total <= 1) return;

    // Build dots
    slides.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', 'Ke slide ' + (i + 1));
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', function () {
        goTo(i);
        restartAutoplay();
      });
      dotsWrap.appendChild(dot);
    });

    var dots = $$('button', dotsWrap);

    function goTo(i) {
      index = (i + total) % total;
      track.style.transform = 'translateX(-' + (index * 100) + '%)';
      dots.forEach(function (d, di) {
        d.classList.toggle('active', di === index);
      });
    }

    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }

    function startAutoplay() {
      timer = setInterval(next, 5000);
    }
    function stopAutoplay() {
      clearInterval(timer);
    }
    function restartAutoplay() {
      stopAutoplay();
      startAutoplay();
    }

    if (nextBtn) nextBtn.addEventListener('click', function () { next(); restartAutoplay(); });
    if (prevBtn) prevBtn.addEventListener('click', function () { prev(); restartAutoplay(); });

    // Pause on hover
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);

    // Touch swipe
    var startX = 0;
    carousel.addEventListener('touchstart', function (e) {
      startX = e.touches[0].clientX;
      stopAutoplay();
    }, { passive: true });
    carousel.addEventListener('touchend', function (e) {
      var diff = e.changedTouches[0].clientX - startX;
      if (Math.abs(diff) > 42) {
        if (diff < 0) next();
        else prev();
      }
      restartAutoplay();
    }, { passive: true });

    startAutoplay();
  }

  /* ============ SEARCH (DEMO) ============ */
  function initSearch() {
    var inputs = $$('input[type="search"], .search-box input');
    inputs.forEach(function (input) {
      input.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
          var query = this.value.trim();
          if (query) {
            showToast('Mencari: "' + query + '" (Demo mode - belum ada backend)');
            // Demo: jump ke katalog
            // window.location.href = 'customer/catalog.html?q=' + encodeURIComponent(query);
          }
        }
      });
    });
  }

  /* ============ CART (DEMO) ============ */
  function initCart() {
    var cartCount = 0;

    function addToCart(button) {
      var card = button.closest('.product-card');
      var name = card ? $('.product-name', card).textContent.trim() : 'Produk';
      cartCount += 1;
      var badge = $('.header-icon .badge-count');
      if (badge) badge.textContent = String(cartCount);
      showToast(name + ' ditambahkan ke keranjang!');
      button.innerHTML = '<i class="fa-solid fa-check"></i>';
      button.style.background = '#00984F';
      setTimeout(function () {
        button.innerHTML = '<i class="fa-solid fa-cart-plus"></i>';
        button.style.background = '';
      }, 1200);
    }

    // Event delegation for dynamic product buttons
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-add-cart]');
      if (btn) addToCart(btn);
    });
  }

  /* ============ WISHLIST (LOCALSTORAGE) ============ */
  var WISHLIST_KEY = 'jastip_wishlist';

  function getWishlist() {
    try {
      return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function saveWishlist(list) {
    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
    } catch (e) {
      /* storage penuh / tidak tersedia */
    }
  }

  function isInWishlist(id) {
    return getWishlist().some(function (item) {
      return String(item.id) === String(id);
    });
  }

  function addToWishlist(id, data) {
    var list = getWishlist();
    if (isInWishlist(id)) return list;
    list.push({
      id: id,
      name: data.name || 'Produk',
      category: data.category || '',
      price: data.price || 0,
      unit: data.unit || 'pts',
      image: data.image || '',
      rating: data.rating || '',
      location: data.location || ''
    });
    saveWishlist(list);
    return list;
  }

  function removeFromWishlist(id) {
    var list = getWishlist().filter(function (item) {
      return String(item.id) !== String(id);
    });
    saveWishlist(list);
    return list;
  }

  function initWishlist() {
    // Event delegation: SEMUA elemen dengan [data-wishlist] — TIDAK pakai data-add-cart,
    // jadi klik hati TIDAK akan masuk ke keranjang.
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-wishlist]');
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();

      var id = btn.getAttribute('data-wishlist');
      var name = btn.getAttribute('data-name') || 'Produk';
      var inList = isInWishlist(id);

      if (inList) {
        removeFromWishlist(id);
        showToast(name + ' dihapus dari wishlist');
      } else {
        addToWishlist(id, {
          name: name,
          category: btn.getAttribute('data-category') || '',
          price: parseFloat(btn.getAttribute('data-price')) || 0,
          unit: btn.getAttribute('data-unit') || 'pts',
          image: btn.getAttribute('data-image') || '',
          rating: btn.getAttribute('data-rating') || '',
          location: btn.getAttribute('data-location') || ''
        });
        showToast(name + ' ditambahkan ke wishlist');
      }

      // Update status tombol hati yang ada di seluruh dokumen (katalog & wishlist)
      updateHeartButtons();
    });

    // Berlakukan status hati (terisi/kosong) pada semua tombol [data-wishlist]
    function updateHeartButtons() {
      $$('[data-wishlist]').forEach(function (btn) {
        var id = btn.getAttribute('data-wishlist');
        var active = isInWishlist(id);
        btn.classList.toggle('active', active);
        var icon = $('i', btn);
        if (icon) icon.className = active ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
      });
    }

    // Ekspos updateHeartButtons agar bisa dipanggil dari luar (mis. wishlist.js setelah render)
    window.JastipWishlist = {
      get: getWishlist,
      add: addToWishlist,
      remove: removeFromWishlist,
      has: isInWishlist,
      refreshHearts: updateHeartButtons
    };

    // Jalankan saat pertama kali agar tombol yang sudah ada di DOM langsung tampil benar
    // (initWishlist dipanggil dari dalam handler DOMContentLoaded, jadi panggil langsung)
    updateHeartButtons();
  }

  /* ============ REKOMENDASI TABS ============ */
  function initRecomTabs() {
    var tabs = $$('.recom-tab');
    if (!tabs.length) return;

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.remove('active'); });
        this.classList.add('active');
        showToast('Menampilkan: "' + this.textContent.trim() + '" (Demo)');
      });
    });
  }

  /* ============ SCROLL TOP ============ */
  function initScrollTop() {
    var btn = $('.scroll-top');
    if (!btn) return;

    window.addEventListener('scroll', function () {
      if (window.scrollY > 400) btn.classList.add('visible');
      else btn.classList.remove('visible');
    }, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ============ SMOOTH ANCHOR ============ */
  function initAnchors() {
    $$('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var target = $(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  /* ============ PASSWORD TOGGLE ============ */
  function initPasswordToggle() {
    $$('[data-toggle-password]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var targetId = this.getAttribute('data-toggle-password');
        var input = document.getElementById(targetId);
        if (!input) return;
        var isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        var icon = $('i', this);
        if (icon) {
          icon.className = isPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye';
        }
      });
    });
  }

  /* ============ FAQ ACCORDION ============ */
  function initFaqAccordion() {
    $$('.faq-question').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = this.parentElement;
        var isOpen = item.classList.contains('open');
        // Tutup semua
        $$('.faq-item', item.parentElement).forEach(function (i) { i.classList.remove('open'); });
        if (!isOpen) item.classList.add('open');
      });
    });
  }

  /* ============ PROMO COPY CODE ============ */
  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    // Fallback
    var ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    return Promise.resolve();
  }

  function initPromoCode() {
    $$('.promo-code').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var code = this.getAttribute('data-promo');
        var label = $('span', this);
        copyText(code).then(function () {
          if (label) label.textContent = 'Tersalin! ✓';
          showToast('Kode promo ' + code + ' disalin!');
          setTimeout(function () {
            if (label) label.textContent = code;
          }, 2000);
        });
      });
    });
  }

  /* ============ CONTACT FORM ============ */
  function initContactForm() {
    var form = $('#contactForm');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var nama = $('#cNama').value.trim();
      var email = $('#cEmail').value.trim();
      var pesan = $('#cPesan').value.trim();
      if (!nama) { showToast('Nama wajib diisi!'); return; }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showToast('Email tidak valid!'); return; }
      if (!pesan) { showToast('Pesan wajib diisi!'); return; }
      showToast('Pesan terkirim! Kami akan membalas dalam 1x24 jam (Demo)');
      form.reset();
    });
  }

  /* ============ CUSTOMER LAYOUT (DINAMIS) ============ */
  function initCustomerLayout() {
    // Hanya untuk halaman customer (body.cust-body)
    if (!document.body.classList.contains('cust-body')) return;

    // Muat customer-layout.js secara dinamis (jika belum ada)
    if (window.JastipCustomerLayout) {
      window.JastipCustomerLayout.init();
      return;
    }

    // Resolve path ke folder js/ dengan benar (aman dari root DAN folder customer/)
    // main.js selalu berada di /js/, jadi gunakan lokasi currentScript.
    var scriptSrc;
    var current = document.currentScript;
    if (current && current.src) {
      var dir = current.src.substring(0, current.src.lastIndexOf('/'));
      scriptSrc = dir + '/customer-layout.js';
    } else {
      // Fallback: deteksi dari lokasi halaman
      var inCustomer = window.location.pathname.indexOf('/customer/') !== -1;
      scriptSrc = (inCustomer ? '../js/' : 'js/') + 'customer-layout.js';
    }

    var script = document.createElement('script');
    script.src = scriptSrc;
    script.onload = function () {
      if (window.JastipCustomerLayout) window.JastipCustomerLayout.init();
    };
    document.head.appendChild(script);
  }

  /* ============ INIT ============ */
  document.addEventListener('DOMContentLoaded', function () {
    initPreloader();
    initCarousel();
    initSearch();
    initCart();
    initWishlist();
    initRecomTabs();
    initScrollTop();
    initAnchors();
    initPasswordToggle();
    initFaqAccordion();
    initPromoCode();
    initContactForm();
    initCustomerLayout();
  });
})();