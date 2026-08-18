/* ============================================================
   JASTIP — TIER.JS
   Logika tier membership & auto-upgrade otomatis
   berdasarkan total belanja (spend) & lama berlangganan (tahun)
   ============================================================ */
(function () {
  'use strict';

  var TIER_KEY = 'jastip_tier';
  var TIER_REASON_KEY = 'jastip_tier_alasan';
  var SUBSCRIPTION_KEY = 'jastip_subscription';

  var TIER_THRESHOLDS = [
    { tier: 'bronze',   minSpend: 0,        minYears: 0 },
    { tier: 'silver',   minSpend: 1000000,  minYears: 1 },
    { tier: 'gold',     minSpend: 5000000,  minYears: 3 },
    { tier: 'platinum', minSpend: 10000000, minYears: 5 },
    { tier: 'diamond',  minSpend: 25000000, minYears: 0 }
  ];

  function getItem(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }

  function setItem(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* storage unavailable */ }
  }

  function removeItem(key) {
    try { localStorage.removeItem(key); } catch (e) { /* storage unavailable */ }
  }

  /* Baca tier saat ini (default: bronze) */
  function getTier() {
    return getItem(TIER_KEY) || 'bronze';
  }

  /* Simpan tier + alasan */
  function saveTier(tier, reason) {
    setItem(TIER_KEY, tier);
    if (reason) setItem(TIER_REASON_KEY, reason);
    else removeItem(TIER_REASON_KEY);
  }

  /* Hitung tier tertinggi yang memenuhi kedua syarat (spend & durasi) */
  function calcTier(totalSpend, subscriptionYears) {
    var current = TIER_THRESHOLDS[0]; // bronze
    for (var i = 0; i < TIER_THRESHOLDS.length; i++) {
      var t = TIER_THRESHOLDS[i];
      if (totalSpend >= t.minSpend && subscriptionYears >= t.minYears) {
        current = t;
      }
    }
    return current;
  }

  /* Hitung lama berlangganan (tahun) dari localStorage subscription */
  function getSubscriptionYears() {
    try {
      var sub = JSON.parse(getItem(SUBSCRIPTION_KEY));
      if (sub && sub.startDate) {
        var start = new Date(sub.startDate);
        var now = new Date();
        return Math.floor((now - start) / (365.25 * 24 * 60 * 60 * 1000));
      }
    } catch (e) {}
    return 0;
  }

  /* Hitung tier sekarang dari data yang tersedia (spend opsional, years opsional) */
  function autoUpgradeTier(totalSpend, subscriptionYears) {
    var spend = (typeof totalSpend === 'number') ? totalSpend : 5000000; // fallback demo
    var years = (typeof subscriptionYears === 'number') ? subscriptionYears : getSubscriptionYears();

    var newTier = calcTier(spend, years);
    var oldTier = getTier();

    // Naikkan tier jika hasil kalkulasi lebih tinggi
    var rank = function (t) {
      for (var i = 0; i < TIER_THRESHOLDS.length; i++) {
        if (TIER_THRESHOLDS[i].tier === t) return i;
      }
      return 0;
    };

    if (rank(newTier.tier) > rank(oldTier)) {
      saveTier(newTier.tier, 'Otomatis naik tier (total belanja & durasi langganan)');
      return newTier.tier;
    }
    return oldTier;
  }

  window.JastipTier = {
    getTier: getTier,
    calcTier: calcTier,
    autoUpgradeTier: autoUpgradeTier,
    getSubscriptionYears: getSubscriptionYears,
    thresholds: TIER_THRESHOLDS
  };
})();