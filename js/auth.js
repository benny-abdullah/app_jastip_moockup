/* ============================================================
   JASTIP — AUTH JS
   Login/Register membaca users.json + localStorage
   Session management & proteksi halaman dashboard
   ============================================================ */

(function () {
  'use strict';

  const SESSION_KEY = 'jastip_session';
  const CUSTOM_USERS_KEY = 'jastip_custom_users';

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

  /* ============ STORAGE ============ */
  function getSession() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY)); }
    catch (e) { return null; }
  }

  function setSession(user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  }

  function clearSession() {
    localStorage.removeItem(SESSION_KEY);
  }

  function getCustomUsers() {
    try { return JSON.parse(localStorage.getItem(CUSTOM_USERS_KEY)) || []; }
    catch (e) { return []; }
  }

  function saveCustomUser(user) {
    var users = getCustomUsers();
    users.push(user);
    localStorage.setItem(CUSTOM_USERS_KEY, JSON.stringify(users));
  }

  /* ============ FALLBACK USERS (untuk akses file:// tanpa server) ============ */
  var FALLBACK_USERS = [
    { id: 1, name: 'Andi Pratama', email: 'admin@jastip.id', password: 'admin123', role: 'superadmin', position: 'Superadmin / Admin Pusat', hub: 'Pusat — Jakarta', joinDate: '2024-01-01', avatar: 'AP' },
    { id: 2, name: 'Budi Santoso', email: 'hub@jastip.id', password: 'hub123', role: 'hub', position: 'Owner Hub', hub: 'Hub Jakarta Selatan', joinDate: '2024-03-15', avatar: 'BS' },
    { id: 3, name: 'Citra Lestari', email: 'customer@jastip.id', password: 'customer123', role: 'customer', position: 'Customer', hub: 'Hub Jakarta Selatan', joinDate: '2025-06-20', avatar: 'CL' }
  ];

  /* ============ FETCH USERS ============ */
  function fetchUsers() {
    return new Promise(function (resolve) {
      fetch('data/users.json')
        .then(function (res) {
          if (!res.ok) throw new Error('Status ' + res.status);
          return res.json();
        })
        .then(function (data) {
          resolve((data.users || []).concat(getCustomUsers()));
        })
        .catch(function () {
          // Fallback: data inline jika fetch gagal (mis. dibuka via file://)
          resolve(FALLBACK_USERS.concat(getCustomUsers()));
        });
    });
  }

  /* ============ LOGIN ============ */
  function loginUser(email, password) {
    return fetchUsers().then(function (users) {
      var found = users.filter(function (u) {
        return u.email && u.email.toLowerCase() === email.toLowerCase();
      })[0];

      if (!found) {
        return { ok: false, message: 'Email tidak terdaftar!' };
      }
      if (found.password !== password) {
        return { ok: false, message: 'Password salah!' };
      }

      setSession({
        id: found.id,
        name: found.name,
        email: found.email,
        role: found.role,
        position: found.position,
        hub: found.hub,
        avatar: found.avatar || found.name.charAt(0).toUpperCase()
      });

      return { ok: true, user: found };
    });
  }

  /* ============ REGISTER ============ */
  function registerUser(data) {
    return fetchUsers().then(function (users) {
      var emailExists = users.some(function (u) {
        return u.email && u.email.toLowerCase() === data.email.toLowerCase();
      });

      if (emailExists) {
        return { ok: false, message: 'Email sudah terdaftar!' };
      }

      var newUser = {
        id: Date.now(),
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        position: data.role === 'superadmin' ? 'Superadmin / Admin Pusat' : data.role === 'hub' ? 'Owner Hub' : 'Customer',
        hub: data.role === 'customer' || data.role === 'hub' ? 'Hub Jakarta Selatan' : 'Pusat — Jakarta',
        joinDate: new Date().toISOString().slice(0, 10),
        avatar: data.name.charAt(0).toUpperCase()
      };

      saveCustomUser(newUser);

      setSession({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        position: newUser.position,
        hub: newUser.hub,
        avatar: newUser.avatar
      });

      return { ok: true, user: newUser };
    });
  }

  /* ============ ROLE DASHBOARD MAP ============ */
  function dashboardForRole(role) {
    var map = {
      superadmin: 'dashboard/superadmin.html',
      hub: 'dashboard/hub.html',
      customer: 'dashboard/customer.html'
    };
    return rootPrefix() + (map[role] || 'index.html');
  }

  /* ============ ROOT PATH HELPER ============ */
  // Menghitung prefix '../' agar path relatif selalu mengarah ke root proyek,
  // berapapun kedalaman folder halaman saat ini (mis. dashboard/hub/...).
  // Catatan: pada file:// Windows, pathname diawali drive (mis. /C:/jastipku/...),
  // sehingga segmen pertama ('C:') adalah drive, bukan folder proyek.
  function rootPrefix() {
    var path = window.location.pathname;
    var segments = path.split('/').filter(function (s) { return s.length > 0; });
    var isFileDrive = segments.length > 0 && /^[a-zA-Z]:$/.test(segments[0]);
    var folderCount = segments.length - 1; // kurangi nama file
    if (isFileDrive) folderCount -= 1; // kurangi drive letter
    var depth = Math.max(0, folderCount - 1); // kurangi folder root proyek
    var prefix = '';
    for (var i = 0; i < depth; i++) prefix += '../';
    return prefix;
  }

  /* ============ SESSION GUARD ============ */
  function checkSession(role) {
    var session = getSession();
    if (!session) {
      window.location.href = rootPrefix() + 'login.html';
      return null;
    }
    if (role && session.role !== role) {
      window.location.href = dashboardForRole(session.role);
      return null;
    }
    return session;
  }

  /* ============ LOGOUT ============ */
  function logout() {
    clearSession();
    window.location.href = rootPrefix() + 'login.html';
  }

  /* ============ EXPOSE GLOBAL ============ */
  window.JastipAuth = {
    login: loginUser,
    register: registerUser,
    getSession: getSession,
    setSession: setSession,
    clearSession: clearSession,
    checkSession: checkSession,
    logout: logout,
    dashboardForRole: dashboardForRole,
    fetchUsers: fetchUsers,
    showToast: showToast
  };

  /* ============ INIT BINDINGS ============ */
  document.addEventListener('DOMContentLoaded', function () {
    // ---- LOGIN FORM ----
    var loginForm = $('#loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var email = $('#email').value.trim();
        var password = $('#password').value;

        if (!email || !password) {
          showToast('Email dan password wajib diisi!');
          return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          showToast('Format email tidak valid!');
          return;
        }

        var btn = $('button[type="submit"]', loginForm);
        if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Memproses...'; }

        window.JastipAuth.login(email, password).then(function (result) {
          if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Masuk'; }
          if (result.ok) {
            showToast('Login berhasil! Mengalihkan...');
            // Cek apakah ada redirect intent (dari halaman yang diproteksi)
            var redirectUrl = null;
            try { redirectUrl = sessionStorage.getItem('jastip_redirect'); } catch (e) {}
            if (redirectUrl) {
              try { sessionStorage.removeItem('jastip_redirect'); } catch (e) {}
              window.location.href = redirectUrl;
            } else {
              var dashUrl = dashboardForRole(result.user.role);
              window.location.href = dashUrl;
            }
          } else {
            showToast(result.message);
          }
        }).catch(function (err) {
          if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Masuk'; }
          showToast('Error: ' + err.message);
        });
      });

      // Social login (demo)
      $$('button[data-social-login]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var provider = this.getAttribute('data-social-login');
          showToast('Login dengan ' + provider + ' (Demo mode)');
        });
      });
    }

    // ---- REGISTER FORM ----
    var registerForm = $('#registerForm');
    if (registerForm) {
      registerForm.addEventListener('submit', function (e) {
        e.preventDefault();

        var nama = $('#nama').value.trim();
        var email = $('#email').value.trim();
        var hp = $('#hp').value.trim();
        var password = $('#password').value;
        var konfirmasi = $('#konfirmasi').value;
        var role = $('#role').value;
        var terms = $('#terms');

        if (!nama) { showToast('Nama lengkap wajib diisi!'); return; }
        if (!email) { showToast('Email wajib diisi!'); return; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showToast('Format email tidak valid!'); return; }
        if (!hp) { showToast('No. HP wajib diisi!'); return; }
        if (password.length < 8) { showToast('Password minimal 8 karakter!'); return; }
        if (password !== konfirmasi) { showToast('Konfirmasi password tidak cocok!'); return; }
        if (terms && !terms.checked) { showToast('Anda harus menyetujui Syarat & Ketentuan!'); return; }

        var btn = $('button[type="submit"]', registerForm);
        if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Memproses...'; }

        window.JastipAuth.register({
          name: nama,
          email: email,
          password: password,
          role: role
        }).then(function (result) {
          if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-user-plus"></i> Daftar Sekarang'; }
          if (result.ok) {
            showToast('Registrasi berhasil! Mengalihkan...');
            setTimeout(function () {
              window.location.href = dashboardForRole(result.user.role);
            }, 900);
          } else {
            showToast(result.message);
          }
        }).catch(function (err) {
          if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-user-plus"></i> Daftar Sekarang'; }
          showToast('Error: ' + err.message);
        });
      });
    }
  });
})();