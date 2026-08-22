#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Update review.md & view.md — catat modul Pengiriman baru di superadmin (22 Agu 2026)."""
from pathlib import Path

root = Path('.')

# ============ 1) REVIEW.MD ============
p = root / 'review.md'
lines = p.read_text(encoding='utf-8').splitlines()

new_lines = []
inserted = False
for line in lines:
    if line.startswith('### 20.2 Manajemen Pengiriman (Delivery Management)') and not inserted:
        new_lines.append(line + ' — SUDAH ADA, PERLU DISEMPURNAKAN + MODUL SUPERADMIN BARU')
        new_lines.append('')
        new_lines.append('**Perubahan yang dilakukan (22 Agustus 2026):**')
        new_lines.append('')
        new_lines.append('- **`dashboard/superadmin/deliveries.html` (BARU)** — Halaman **Pengiriman** superadmin: CRUD lengkap, 4 kartu statistik (Total, Dikirim, Dalam Perjalanan, Gagal/Retur), filter Hub/Kurir/Status + tanggal, data contoh, pagination.')
        new_lines.append('- **`js/superadmin-data.js` (EDIT)** — Modul `deliveries` baru: kolom Kode Delivery, Order, Customer, Hub, Kurir, Status, Tanggal; CRUD via localStorage (`jastip_sa_deliveries`).')
        new_lines.append('- **`js/superadmin-layout.js` (EDIT)** — Menu **"Pengiriman"** (ikon `fa-truck-fast`) ditambahkan ke group **Operasional** sidebar superadmin + update `FILE_TO_MENU` & `FILE_TO_GROUP`.')
        new_lines.append('- **`js/superadmin-core.js` (EDIT)** — Tambah warna badge untuk status `retur` (merah) dan `dalam perjalanan` (amber).')
        inserted = True
    else:
        new_lines.append(line)

s = '\n'.join(new_lines).rstrip()
changelog = '\n\n---\n\n*Update v2.3 (22 Agustus 2026): Menambahkan modul **Pengiriman (Delivery Management)** di dashboard superadmin — halaman `dashboard/superadmin/deliveries.html`, menu "Pengiriman" di sidebar Operasional, data CRUD modul `deliveries`, dan badge status `retur`/`dalam perjalanan` di `superadmin-core.js`.*\n'
if 'Update v2.3' not in s:
    s += changelog
p.write_text(s, encoding='utf-8', newline='\n')
print('review.md updated:', inserted)

# ============ 2) VIEW.MD ============
p2 = root / 'view.md'
lines2 = p2.read_text(encoding='utf-8').splitlines()

new_lines2 = []
inserted2 = False
for line in lines2:
    if line.startswith('### L.2 Manajemen Pengiriman (Delivery Management)') and not inserted2:
        new_lines2.append(line + ' — SUDAH ADA + MODUL SUPERADMIN BARU ✅ (22 Agustus 2026)')
        new_lines2.append('')
        new_lines2.append('- [x] **`dashboard/superadmin/deliveries.html` (BARU)** — Halaman **Pengiriman** superadmin: CRUD lengkap, kartu statistik, filter Hub/Kurir/Status + tanggal.')
        new_lines2.append('- [x] **`js/superadmin-data.js` (EDIT)** — Modul `deliveries` baru + CRUD via localStorage (`jastip_sa_deliveries`).')
        new_lines2.append('- [x] **`js/superadmin-layout.js` (EDIT)** — Menu **"Pengiriman"** ditambahkan ke group **Operasional** sidebar superadmin.')
        new_lines2.append('- [x] **`js/superadmin-core.js` (EDIT)** — Badge status `retur` (merah) & `dalam perjalanan` (amber).')
        inserted2 = True
    else:
        new_lines2.append(line)

s2 = '\n'.join(new_lines2).rstrip()
changelog2 = '\n\n---\n\n*Update v2.3 (22 Agustus 2026): Menambahkan **menu Pengiriman** di dashboard superadmin — `dashboard/superadmin/deliveries.html` + modul data `deliveries` + badge status baru.*\n'
if 'Update v2.3' not in s2:
    s2 += changelog2
p2.write_text(s2, encoding='utf-8', newline='\n')
print('view.md updated:', inserted2)