# 🐹 Geng Puasa — App Ramadan 1447H

App Ramadan interaktif untuk budak-budak Malaysia! Countdown berbuka, misi harian, kuiz, badge system, dan mascot Capybara!

## ✨ Features

- ⏰ **Real-time countdown** ke waktu Maghrib (API JAKIM)
- 🗺️ **Progress road** — Capybara berjalan dari Imsak ke Maghrib
- 📋 **30 Misi Ramadan** — siap dengan XP, kategori & boss battles
- ⚡ **Kuiz Kilat** — 5 soalan agama, dapat XP bonus
- 🎖️ **Badge System** — 6 badge untuk dikumpul
- 📈 **Level & XP System** — naik level, tunjuk progress
- 🐹 **Mood Capybara** — 5 mood berbeza, tukar dengan ketuk
- 🔊 **Text-to-Speech** — dengar lafaz doa & niat
- 🎊 **Confetti** — meledak bila complete misi & boss battles
- 💾 **localStorage** — data disimpan auto

## 🚀 Deploy ke Netlify

### Step 1: Upload ke GitHub

```bash
git init
git add .
git commit -m "🐹 Geng Puasa - App Ramadan 1447H"
git branch -M main
git remote add origin https://github.com/USERNAME/geng-puasa.git
git push -u origin main
```

### Step 2: Deploy di Netlify

1. Pergi ke [netlify.com](https://netlify.com)
2. Klik **"Add new site"** → **"Import an existing project"**
3. Connect GitHub → pilih repo `geng-puasa`
4. Settings auto-detect dari `netlify.toml`:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Klik **Deploy site**!

Siap dalam ~2 minit! 🎉

## 🛠️ Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## 📦 Build

```bash
npm run build
```

## 🎨 Tech Stack

- React 18 + Vite
- Tailwind CSS
- Lucide React icons
- Google Fonts (Fredoka One + Nunito)
- API Waktu Solat Malaysia (api.waktusolat.app)
- Web Speech API (text-to-speech)

---

*Selamat Berpuasa! 🌙 MasyaAllah tabarakallah!*
