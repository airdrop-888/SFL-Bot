<div align="center">

# 🌻 SFL Automation — Smart Full Auto Bot

**Sunflower Land Game Automation Script v6.1**

[![JavaScript](https://img.shields.io/badge/JavaScript-ES2021-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Sunflower Land](https://img.shields.io/badge/Game-Sunflower_Land-4CAF50?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48Y2lyY2xlIGN4PSI4IiBjeT0iOCIgcj0iOCIgZmlsbD0iI0ZGOTgwMCIvPjwvc3ZnPg==&logoColor=white)](https://www.sunflower-land.com)
[![Version](https://img.shields.io/badge/Version-6.1.0-4CAF50?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/License-MIT-FACC15?style=for-the-badge)](#)

<br />

```
╔══════════════════════════════════════════════════════════════════╗
║  🌻 SFL v6.1 - Smart Full Auto                                  ║
║  🌾 Delivery-aware planting + buying                            ║
║  💰 Smart sell (keep recipe ingredients)                        ║
║  📊 XP/hour tracking + time to level                            ║
║  💾 Stats persistence (localStorage)                            ║
║  🔄 Auto-reconnect (every 30s)                                  ║
║  🛡️ Rate-limit protection                                       ║
╚══════════════════════════════════════════════════════════════════╝
```

</div>

---

## 📖 Tentang

**SFL Automation** adalah script bot otomatis untuk game [Sunflower Land](https://www.sunflower-land.com). Script ini mengotomatiskan seluruh aktivitas farm — mulai dari menanam, memanen, memasak, menjual, hingga mengirim delivery — dengan strategi **smart** yang memprioritaskan XP rate, delivery needs, dan efisiensi inventory.

Dibangun murni dengan **vanilla JavaScript**, script ini langsung dijalankan di browser console tanpa dependency apapun.

---

## ✨ Fitur Utama

| Fitur | Deskripsi |
|-------|-----------|
| 🌾 **Auto Harvest & Plant** | Panen massal & tanam otomatis dengan seed selection cerdas |
| 📦 **Delivery-Aware Planting** | Prioritan tanam untuk kebutuhan delivery NPC |
| 🍳 **Auto Cook** | Masak resep terbaik berdasarkan XP/min, collect & cook otomatis |
| 💰 **Smart Sell** | Jual crop berlebih, tahan bahan resep & kebutuhan delivery |
| 🪓 **Auto Chop & Mine** | Tebang pohon & tambang batu otomatis (termasuk Iron & Gold) |
| 🍋 **Auto Fruit** | Panen fruit patch otomatis |
| ♻️ **Auto Composter** | Koleksi & mulai kompos dari Compost Bin dan Worm |
| 🛒 **Auto Buy Seeds** | Beli benih musiman terbaik, prioritas untuk delivery |
| 🐔 **Animals & Pets** | Auto feed & interaksi hewan dan pet |
| 📊 **XP/Hour Tracking** | Pantau rate XP per jam dan estimasi waktu naik level |
| 💾 **Persistence** | Stats tersimpan di localStorage, survive page refresh |
| 🔄 **Auto-Reconnect** | Koneksi ulang otomatis setiap 30 detik jika terputus |
| 🛡️ **Rate Limit Protection** | Exponential backoff otomatis jika kena rate limit |
| ⚙️ **Configurable** | Toggle setiap fitur on/off dari console |

---

## 🎮 Commands

Semua command dijalankan dari **browser console** (`F12` → Console) saat game Sunflower Land sedang dibuka:

### Controls

| Command | Deskripsi |
|---------|-----------|
| `sfl.start()` | 🚀 Mulai semua task otomatis |
| `sfl.stop()` | ⏹️ Hentikan bot & simpan stats |
| `sfl.pause()` | ⏸️ Jeda bot (sisa task tetap di-queue) |
| `sfl.resume()` | ▶️ Lanjutkan bot setelah pause |
| `sfl.status()` | 📊 Tampilkan status lengkap, XP rate, delivery |

### Manual Actions

| Command | Deskripsi |
|---------|-----------|
| `sfl.harvest()` | 🌾 Panen sekali |
| `sfl.plant()` | 🌱 Tanam sekali |
| `sfl.cook()` | 🍳 Masak sekali |
| `sfl.chop()` | 🪓 Tebang pohon sekali |
| `sfl.mine()` | ⛏️ Tambang batu sekali |
| `sfl.sell()` | 💰 Jual crop |
| `sfl.buy()` | 🛒 Beli benih |
| `sfl.eat()` | 🍽️ Makan makanan terbaik |
| `sfl.deliver()` | 📦 Kirim delivery |
| `sfl.fruit()` | 🍋 Panen fruit patch |
| `sfl.composter()` | ♻️ Koleksi kompos |

### Info & Debug

| Command | Deskripsi |
|---------|-----------|
| `sfl.inventory()` | 📦 Lihat inventory + flag resep & musiman |
| `sfl.recipes()` | 🍳 Lihat semua resep + status ketersediaan |
| `sfl.deliveryNeeds()` | 📦 Lihat kebutuhan delivery tertunda |
| `sfl.debug()` | 🔍 Debug info semua resources |
| `sfl.state()` | 📋 Raw game state object |
| `sfl.sniff()` | 🔍 JSON dump game state |
| `sfl.init()` | 🔌 Reconnect ke game service |

### Toggle Features

| Command | Deskripsi |
|---------|-----------|
| `sfl.enable('harvest')` | Toggle auto harvest |
| `sfl.enable('plant')` | Toggle auto plant |
| `sfl.enable('cook')` | Toggle auto cook |
| `sfl.enable('chop')` | Toggle auto chop |
| `sfl.enable('mine')` | Toggle auto mine |
| `sfl.enable('sell')` | Toggle auto sell |
| `sfl.enable('fruit')` | Toggle auto fruit |
| `sfl.enable('composter')` | Toggle auto composter |
| `sfl.enable('tools')` | Toggle auto craft tools |

### Config

| Command | Deskripsi |
|---------|-----------|
| `sfl.config()` | Lihat semua config |
| `sfl.config('AUTO_HARVEST', false)` | Set config tertentu |
| `sfl.craft('Axe', 20)` | Craft 20 Axe |

---

## 🧠 Strategi Smart

### 🌱 Smart Seed Selection
Bot tidak asal tanam. Prioritas seed selection:

1. **Delivery Priority** — Tanam crop yang dibutuhkan delivery NPC terlebih dahulu
2. **XP/min Rate** — Kalau tidak ada delivery need, pilih seed dengan XP per menit tertinggi
3. **Seasonal Only** — Hanya pakai seed yang sesuai musim saat ini

### 💰 Smart Sell
- Jual crop sesuai urutan value (Parsnip > Corn > Artichoke > ... > Sunflower)
- **Tahan** crop yang merupakan bahan resep (minimum `SELL_KEEP` amount)
- **Tahan** crop yang dibutuhkan delivery

### 🍳 Smart Cooking
- Pilih resep dengan **XP per menit** tertinggi yang bisa dibuat
- Prioritaskan collection dari building yang sudah selesai dulu
- Otomatis cari free slot di Fire Pit / Kitchen

### 📦 Smart Delivery
- Prioritaskan delivery dengan reward coins tertinggi
- Skip order yang terlalu rumit (>3 item atau need > 50 tapi inventory < 10)
- Auto-skip order yang sudah lewat waktu

---

## 📋 Game Data

### Seed Info

| Seed | Level | Grow Time | XP | Season |
|------|-------|-----------|-----|--------|
| Sunflower | 1 | 1 min | 1 | All |
| Potato | 2 | 5 min | 3 | Summer/Autumn/Winter |
| Pumpkin | 3 | 30 min | 5 | Autumn |
| Rhubarb | 3 | 20 min | 5 | Spring |
| Carrot | 4 | 45 min | 8 | Spring/Autumn |
| Cabbage | 5 | 60 min | 12 | Spring/Winter |
| Soybean | 5 | 60 min | 12 | Spring/Autumn |
| Beetroot | 7 | 75 min | 16 | Summer/Winter |
| Corn | 18 | 240 min | 55 | Spring |
| Kale | 26 | 360 min | 70 | Spring/Winter |

> 💡 Total **44 seed types** termasuk buah (Tomato, Lemon, Blueberry, Orange, Apple, Banana) dengan grow time hingga 12 jam.

### Recipe Info

| Recipe | Building | XP | Time | Ingredients |
|--------|----------|-----|------|-------------|
| Mashed Potato | Fire Pit | 3 | 30s | Potato ×8 |
| Rhubarb Tart | Fire Pit | 5 | 60s | Rhubarb ×3 |
| Pumpkin Soup | Fire Pit | 24 | 3min | Pumpkin ×10 |
| Reindeer Carrot | Fire Pit | 36 | 5min | Carrot ×5 |
| Popcorn | Fire Pit | 200 | 12min | Sunflower ×100, Corn ×5 |
| Kale Stew | Fire Pit | 400 | 120min | Kale ×10 |
| Kale Omelette | Fire Pit | 1250 | 210min | Egg ×40, Kale ×5 |
| Rice Bun | Fire Pit | 2600 | 300min | Rice ×2, Wheat ×50 |
| Antipasto | Fire Pit | 3000 | 180min | Olive ×2, Grape ×2 |
| Sunflower Crunch | Kitchen | 50 | 10min | Sunflower ×300 |
| Mushroom Jacket Potatoes | Kitchen | 240 | 10min | Wild Mushroom ×10, Potato ×5 |

---

## 🚀 Cara Pakai

### Langkah 1: Buka Game

Buka [Sunflower Land](https://www.sunflower-land.com) di browser dan masuk ke farm Anda.

### Langkah 2: Buka Console

Tekan `F12` → pilih tab **Console**.

### Langkah 3: Copy & Paste Script

Copy seluruh isi [`sfl-automation.js`](sfl-automation.js) dan paste ke console, lalu tekan **Enter**.

### Langkah 4: Start Bot!

```javascript
sfl.start()
```

Bot akan langsung mendeteksi game state dan mulai menjalankan semua task secara otomatis.

---

## ⚙️ Configuration

```javascript
// Lihat semua config
sfl.config()

// Contoh mengubah config
sfl.config('AUTO_SELL', false)    // Matikan auto sell
sfl.config('SELL_KEEP', 100)       // Simpan 100 crop untuk delivery/recipe
sfl.config('LOG_LEVEL', 'debug')  // Aktifkan debug log
```

| Config | Default | Deskripsi |
|--------|---------|-----------|
| `AUTO_SAVE` | `true` | Auto simpan stats ke localStorage |
| `AUTO_HARVEST` | `true` | Auto panen |
| `AUTO_PLANT` | `true` | Auto tanam |
| `AUTO_COOK` | `true` | Auto masak |
| `AUTO_CHOP` | `true` | Auto tebang pohon |
| `AUTO_MINE` | `true` | Auto tambang |
| `AUTO_CRAFT_TOOLS` | `true` | Auto craft Axe & Pickaxe |
| `AUTO_BUY_SEEDS` | `true` | Auto beli benih musiman |
| `AUTO_SELL` | `true` | Auto jual crop berlebih |
| `AUTO_FRUIT` | `true` | Auto panen fruit patch |
| `AUTO_COMPOSTER` | `true` | Auto kompos |
| `SELL_KEEP` | `50` | Minimum crop ditahan untuk recipe/delivery |
| `LOG_LEVEL` | `info` | `info` / `debug` / `silent` |

---

## 🏗️ Task Scheduler

Bot menggunakan **priority-based scheduler** dengan 14 task yang berjalan secara concurrent:

| Priority | Task | Default Interval | Deskripsi |
|----------|------|-----------------|-----------|
| 1 | Harvest | 5s | Panen semua crop |
| 2 | Plant | 5s | Tanam seed terbaik ke plot kosong |
| 3 | Eat | 5s | Makan makanan XP tertinggi |
| 4 | Buy | 30s | Beli seed musiman |
| 5 | Cook | 5s | Masak resep terbaik |
| 6 | Deliver | 10s | Kirim delivery NPC |
| 7 | Sell | 30s | Jual crop berlebih |
| 8 | Fruit | 30s | Panen fruit patches |
| 9 | Compost | 60s | Koleksi & mulai kompos |
| 10 | Chop | 60s | Tebang semua pohon |
| 11 | Mine | 60s | Tambang batu (Stone/Iron/Gold) |
| 12 | Skip | 120s | Skip delivery order sulit |
| 13 | Animals | 4hr | Feed & wake hewan |
| 14 | Pets | 12hr | Interaksi pets |

> ⚡ Setiap action memiliki **exponential backoff** jika kena rate limit, dengan gap minimum 3 detik antar request server.

---

## 🔧 Tech Detail

- **Vanilla JavaScript** — Tanpa dependency, langsung paste ke console
- **React Fiber Traversal** — Mendeteksi game service dari React internal state
- **Game State Machine** — Berinteraksi via `gameService.send()` (XState)
- **localStorage** — Persistensi stats antar session
- **Auto-Reconnect** — Reconnect otomatis setiap 30 detik

---

## 📊 Stats Tracking

Bot melacak semua aktivitas secara otomatis dan tersimpan di localStorage:

| Stat | Deskripsi |
|------|-----------|
| 🌾 Harvested | Jumlah panen |
| 🌱 Planted | Jumlah tanam |
| 🍳 Cooked | Jumlah masak |
| 📦 Collected | Jumlah collect resep |
| 🪵 Chopped | Jumlah tebang pohon |
| ⛏️ Mined | Jumlah tambang |
| 🔨 Crafted | Jumlah craft tools |
| 🍽️ Eaten | Jumlah makan |
| 💰 Sold | Jumlah crop dijual |
| 📦 Delivered | Jumlah delivery selesai |
| 🍋 Fruits | Jumlah panen buah |
| ♻️ Composted | Jumlah kompos |
| 🌱 Bought | Jumlah seed dibeli |

---

## ⚠️ Disclaimer

Script ini dibuat untuk **tujuan edukasi** dan penggunaan pribadi. Penggunaan bot/automation melanggar Terms of Service game Sunflower Land dan dapat mengakibatkan **banned akun**. Gunakan dengan risiko Anda sendiri.

---

## 📄 License

Projek ini menggunakan lisensi **MIT**.

---

## 👨‍💻 Author

**airdrop-888**

[![GitHub](https://img.shields.io/badge/GitHub-airdrop--888-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/airdrop-888)

---

<div align="center">

**Dibuat dengan 🌻 untuk sesama farmer Sunflower Land**

*Star ⭐ repository ini jika project ini bermanfaat untuk Anda!*

</div>
