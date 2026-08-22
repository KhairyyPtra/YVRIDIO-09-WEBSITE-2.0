# YVRIDIO'09 — Panduan Web Push (Notifikasi Background)

Notifikasi ulang tahun bisa muncul **meski website ditutup**, lewat Web Push + Service Worker + Vercel Cron.

---

## Arsitektur singkat

```
User buka site sekali
   → izinkan notifikasi
   → browser subscribe push
   → subscription disimpan di Upstash Redis

Setiap hari jam 07:05 WITA (cron)
   → /api/send-birthday cek siapa ultah
   → kirim push ke semua subscription
   → HP user dapat notif (site boleh tertutup)
```

---

## File yang ditambahkan

| File | Fungsi |
|------|--------|
| `sw.js` | Service Worker — terima push di background |
| `api/subscribe.js` | Simpan subscription browser |
| `api/unsubscribe.js` | Hapus subscription |
| `api/send-birthday.js` | Cek ultah + kirim push |
| `lib/birthdays.js` | Data tanggal lahir (server) |
| `lib/subscriptions.js` | Helper Redis |
| `package.json` | Dependency `web-push` |
| `vercel.json` | Jadwal cron harian |
| `env.example` | Contoh environment variables |
| `script.js` | Register SW + subscribe push |

---

## Setup (sekali saja)

### 1. Letakkan file di project

Pastikan struktur di repo Vercel-mu kira-kira:

```
/
  index.html
  script.js
  style.css
  sw.js                 ← root (penting: URL /sw.js)
  package.json
  vercel.json
  api/
    subscribe.js
    unsubscribe.js
    send-birthday.js
  lib/
    birthdays.js
    subscriptions.js
  assets/...
```

### 2. Buat database Upstash Redis (gratis)

1. Buka https://console.upstash.com → daftar/login  
2. **Create Database** → region terdekat (mis. Singapore)  
3. Buka tab **REST API**  
4. Salin:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

### 3. VAPID keys

Keys contoh sudah ada di `env.example` dan di `script.js`.

**Disarankan generate sendiri:**

```bash
npm install
npm run vapid
```

Lalu:
- Public key → `VAPID_PUBLIC_KEY` (Vercel) **dan** konstanta `VAPID_PUBLIC_KEY` di `script.js`
- Private key → **hanya** `VAPID_PRIVATE_KEY` di Vercel (jangan ke frontend)

### 4. Environment Variables di Vercel

Project → **Settings** → **Environment Variables**:

| Name | Value |
|------|--------|
| `VAPID_PUBLIC_KEY` | (public key) |
| `VAPID_PRIVATE_KEY` | (private key) |
| `VAPID_SUBJECT` | `mailto:yvridio09@gmail.com` |
| `UPSTASH_REDIS_REST_URL` | dari Upstash |
| `UPSTASH_REDIS_REST_TOKEN` | dari Upstash |
| `CRON_SECRET` | string acak panjang (mis. password generator) |

Centang Production (dan Preview jika mau uji).

### 5. Deploy ulang

```bash
git add .
git commit -m "Add Web Push birthday notifications"
git push
```

Atau deploy lewat Vercel dashboard.

### 6. Cron

Di `vercel.json` sudah ada:

```json
"schedule": "5 23 * * *"
```

= setiap hari **23:05 UTC** = **07:05 WITA** (Waktu Indonesia Tengah).

Vercel Cron tersedia di hobby plan dengan batasan; pastikan project mendukung cron.

---

## Cara uji

### A. Subscribe (wajib sekali per device)

1. Buka website di HP/Chrome  
2. Tunggu loading selesai  
3. Klik **Allow** saat diminta notifikasi  
4. Cek Network tab: request `POST /api/subscribe` harus **200**

### B. Kirim push manual (tanpa nunggu cron)

```bash
curl -H "Authorization: Bearer CRON_SECRET_KAMU" \
  https://DOMAIN-KAMU.vercel.app/api/send-birthday
```

Respons contoh:

```json
{
  "ok": true,
  "birthdays": ["Zafran"],
  "subscribers": 12,
  "sent": 12,
  "failed": 0
}
```

Jika `birthdays` kosong, hari ini memang tidak ada yang ultah.  
Untuk uji, sementara ubah tanggal di `lib/birthdays.js` atau panggil saat ada yang ultah.

### C. Cek di HP

- Chrome Android: notif muncul di notification tray  
- iOS Safari: butuh **Add to Home Screen** (PWA) + iOS 16.4+  

---

## Perilaku akhir

| Situasi | Hasil |
|---------|--------|
| User pernah Allow + subscribe | Masuk daftar penerima |
| Hari ada ultah + cron jalan | Push ke semua subscriber |
| Website tertutup | Tetap dapat notif |
| User Block notifikasi | Tidak dapat notif |
| Subscription invalid (uninstall browser) | Otomatis dihapus server (410/404) |

---

## Troubleshooting

| Masalah | Cek |
|---------|-----|
| `/api/subscribe` 503 | Env Upstash belum di-set / belum redeploy |
| Subscribe gagal di browser | VAPID public key di `script.js` ≠ server |
| Cron tidak jalan | Hobby plan limit / path cron salah |
| iOS tidak dapat notif | Belum "Add to Home Screen", atau iOS < 16.4 |
| Notif dobel (lokal + push) | Normal jika site terbuka saat cron; tag sama biasanya digabung OS |

---

## Keamanan

- `VAPID_PRIVATE_KEY` dan `CRON_SECRET` **hanya** di Vercel env  
- Jangan commit `.env` berisi secret  
- Endpoint `/api/send-birthday` wajib Authorization / Vercel Cron header  

---

One class. One orbit. One story. 🌠
