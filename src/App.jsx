import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  Moon, Sun, MapPin, Trophy, Volume2, CheckCircle2,
  Star, Clock, Coffee, Zap, RotateCcw, ChevronUp,
  Sparkles, X, AlertCircle, RefreshCw
} from 'lucide-react';

// ─────────────────────────────────────────────
// ALL JAKIM ZONES
// ─────────────────────────────────────────────
const ALL_ZONES = [
  { code: "WLY01", label: "Kuala Lumpur / Putrajaya", state: "Wilayah Persekutuan" },
  { code: "WLY02", label: "Labuan", state: "Wilayah Persekutuan" },
  { code: "JHR01", label: "Pulau Aur / Pemanggil", state: "Johor" },
  { code: "JHR02", label: "Johor Bahru / Kota Tinggi / Mersing", state: "Johor" },
  { code: "JHR03", label: "Batu Pahat / Muar / Segamat / Kluang / Pontian", state: "Johor" },
  { code: "JHR04", label: "Kota Tinggi / Mersing", state: "Johor" },
  { code: "KDH01", label: "Kota Setar / Kubang Pasu / Padang Terap", state: "Kedah" },
  { code: "KDH02", label: "Kuala Muda / Yan / Sik", state: "Kedah" },
  { code: "KDH03", label: "Baling", state: "Kedah" },
  { code: "KDH04", label: "Bandar Bahru / Kulim", state: "Kedah" },
  { code: "KTN01", label: "Kota Bharu / Bachok / Pasir Puteh / Tumpat", state: "Kelantan" },
  { code: "KTN03", label: "Gua Musang / Jeli", state: "Kelantan" },
  { code: "MLK01", label: "Seluruh Melaka", state: "Melaka" },
  { code: "NSN01", label: "Jempol / Tampin", state: "Negeri Sembilan" },
  { code: "NSN02", label: "Jelebu / Kuala Pilah / Seremban", state: "Negeri Sembilan" },
  { code: "NSN03", label: "Port Dickson / Rembau", state: "Negeri Sembilan" },
  { code: "PHG01", label: "Pulau Tioman", state: "Pahang" },
  { code: "PHG02", label: "Kuantan / Pekan / Rompin", state: "Pahang" },
  { code: "PHG03", label: "Bentong / Raub", state: "Pahang" },
  { code: "PHG04", label: "Temerloh / Maran / Jerantut", state: "Pahang" },
  { code: "PHG05", label: "Bera / Nenasi", state: "Pahang" },
  { code: "PLS01", label: "Kangar / Arau / Padang Besar", state: "Perlis" },
  { code: "PNG01", label: "Seluruh Pulau Pinang", state: "Pulau Pinang" },
  { code: "PRK01", label: "Tapah / Slim River / Tanjung Malim", state: "Perak" },
  { code: "PRK02", label: "Ipoh / Batu Gajah / Kampar / Teluk Intan", state: "Perak" },
  { code: "PRK03", label: "Lenggong / Pengkalan Hulu / Grik", state: "Perak" },
  { code: "PRK04", label: "Temengor / Belum", state: "Perak" },
  { code: "PRK05", label: "Selama", state: "Perak" },
  { code: "PRK06", label: "Parit Buntar / Bagan Serai / Penaga", state: "Perak" },
  { code: "PRK07", label: "Pangkor", state: "Perak" },
  { code: "SGR01", label: "Gombak / Hulu Selangor / Rawang / Sepang / Petaling", state: "Selangor" },
  { code: "SGR02", label: "Sabak Bernam / Kuala Selangor / Klang / Kuala Langat", state: "Selangor" },
  { code: "SGR03", label: "Shah Alam", state: "Selangor" },
  { code: "TRG01", label: "Kuala Terengganu / Marang / Kuala Nerus", state: "Terengganu" },
  { code: "TRG02", label: "Besut / Setiu", state: "Terengganu" },
  { code: "TRG03", label: "Hulu Terengganu", state: "Terengganu" },
  { code: "TRG04", label: "Kemaman / Dungun", state: "Terengganu" },
  { code: "SBH01", label: "Kota Marudu / Pitas / Kudat", state: "Sabah" },
  { code: "SBH02", label: "Beluran / Sandakan / Kinabatangan", state: "Sabah" },
  { code: "SBH03", label: "Lahad Datu / Semporna / Tawau / Kunak", state: "Sabah" },
  { code: "SBH04", label: "Sipitang / Ranau / Keningau / Tambunan", state: "Sabah" },
  { code: "SBH05", label: "Beaufort / Papar / Kota Belud", state: "Sabah" },
  { code: "SBH06", label: "Kota Kinabalu / Penampang / Tuaran", state: "Sabah" },
  { code: "SWK01", label: "Limbang / Lawas / Sundar / Trusan", state: "Sarawak" },
  { code: "SWK02", label: "Miri / Niah / Bekenu / Sibuti / Marudi", state: "Sarawak" },
  { code: "SWK03", label: "Pandan / Belaga / Bintulu", state: "Sarawak" },
  { code: "SWK04", label: "Kapit / Lubok Antu / Song", state: "Sarawak" },
  { code: "SWK05", label: "Sri Aman / Betong / Saratok", state: "Sarawak" },
  { code: "SWK06", label: "Sibu / Mukah / Dalat / Kanowit", state: "Sarawak" },
  { code: "SWK07", label: "Serian / Samarahan / Bau / Lundu", state: "Sarawak" },
  { code: "SWK08", label: "Kuching", state: "Sarawak" },
];

// ─────────────────────────────────────────────
// MISSIONS & GAME DATA
// ─────────────────────────────────────────────
const MISSIONS = [
  { day: 1,  title: "Niat Padu",       task: "Hafal niat puasa dengan betul",              icon: "🌙", xp: 10,  category: "ibadah" },
  { day: 2,  title: "Operasi Sahur",   task: "Bangun sahur & berdoa sebelum makan",        icon: "🌅", xp: 15,  category: "amalan" },
  { day: 3,  title: "Cari Kurma",      task: "Hidang kurma untuk berbuka",                 icon: "🌴", xp: 10,  category: "sunnah" },
  { day: 4,  title: "Zikir Tenang",    task: "Baca 33x SubhanAllah selepas Subuh",         icon: "📿", xp: 20,  category: "ibadah" },
  { day: 5,  title: "Artis Ramadan",   task: "Lukis Capybara pakai kopiah 😂",             icon: "🎨", xp: 15,  category: "fun" },
  { day: 6,  title: "Air Kosong Champ",task: "Minum 8 gelas air selepas berbuka",          icon: "💧", xp: 10,  category: "amalan" },
  { day: 7,  title: "Sedekah Senyum",  task: "Senyum pada 5 orang hari ini",               icon: "😊", xp: 15,  category: "akhlak" },
  { day: 8,  title: "Kisah Nabi",      task: "Dengar 1 kisah Nabi dari orang tua",         icon: "📖", xp: 20,  category: "ilmu" },
  { day: 9,  title: "Susun Kasut",     task: "Susun kasut keluarga tanpa disuruh",         icon: "👟", xp: 15,  category: "akhlak" },
  { day: 10, title: "CHECK-POINT 1",   task: "Tebus badge '10 Hari Legend'!",              icon: "🏆", xp: 50,  category: "boss" },
  { day: 11, title: "No-Gajet Hero",   task: "1 jam penuh tanpa tengok screen",            icon: "📵", xp: 25,  category: "amalan" },
  { day: 12, title: "Bantu Chef",      task: "Tolong mak/ayah masak berbuka",              icon: "🍳", xp: 20,  category: "akhlak" },
  { day: 13, title: "Doa Power",       task: "Tulis 3 doa untuk orang tersayang",          icon: "✍️", xp: 20,  category: "ibadah" },
  { day: 14, title: "Tabung Syurga",   task: "Derma sekurang-kurangnya RM1",               icon: "💰", xp: 30,  category: "amalan" },
  { day: 15, title: "Geng Tarawih",    task: "Solat Tarawih berjemaah malam ini",          icon: "🕌", xp: 35,  category: "ibadah" },
  { day: 16, title: "Lidah Wangi",     task: "Tak cakap perkataan kasar seharian",         icon: "🌸", xp: 25,  category: "akhlak" },
  { day: 17, title: "Nuzul Quran!",    task: "Baca 1 muka surat Al-Quran",                 icon: "📗", xp: 30,  category: "ibadah" },
  { day: 18, title: "Kemas Meja",      task: "Kemas meja makan selepas berbuka",           icon: "🍽️", xp: 15, category: "akhlak" },
  { day: 19, title: "Teka Doa",        task: "Teka maksud doa berbuka puasa",              icon: "🤔", xp: 20,  category: "ilmu" },
  { day: 20, title: "CHECK-POINT 2",   task: "Tebus badge '20 Hari Warrior'!",             icon: "⚔️", xp: 75, category: "boss" },
  { day: 21, title: "Buru Lailatul",   task: "Banyakkan doa malam ke-21",                  icon: "⭐", xp: 40,  category: "ibadah" },
  { day: 22, title: "Kemas Bilik",     task: "Kemas bilik sampai bersinar!",               icon: "✨", xp: 20,  category: "amalan" },
  { day: 23, title: "Kad Raya",        task: "Buat kad raya untuk kawan lama",             icon: "💌", xp: 25,  category: "fun" },
  { day: 24, title: "Kongsi Rezeki",   task: "Bagi jiran makanan berbuka",                 icon: "🥘", xp: 35,  category: "amalan" },
  { day: 25, title: "Hafal Doa",       task: "Hafal doa berbuka dengan sempurna",          icon: "🎯", xp: 25,  category: "ibadah" },
  { day: 26, title: "Baju Raya Ready", task: "Siapkan baju raya untuk hari raya",          icon: "👘", xp: 15,  category: "fun" },
  { day: 27, title: "Malam Seribu",    task: "Baca Surah Al-Qadr malam ini",               icon: "🌙", xp: 50,  category: "ibadah" },
  { day: 28, title: "Zakat Fitrah",    task: "Tengok ibu bapa bayar zakat fitrah",         icon: "🤲", xp: 30,  category: "amalan" },
  { day: 29, title: "Kuih Raya",       task: "Tolong susun kuih raya dengan cantik",       icon: "🍪", xp: 20,  category: "fun" },
  { day: 30, title: "KEMENANGAN! 🎊",  task: "Takbir! Selamat Hari Raya Aidilfitri!",     icon: "🎉", xp: 100, category: "boss" },
];

const BADGES = [
  { name: 'Mata Burung',  icon: '🦉', req: 3,  desc: 'Rajin bangun awal!',  color: 'from-amber-400 to-orange-500' },
  { name: 'Geng Sahur',   icon: '🥘', req: 5,  desc: 'Siap sahur setiap hari!', color: 'from-orange-400 to-red-500' },
  { name: 'Hero Sabar',   icon: '💎', req: 10, desc: '10 misi berjaya!',    color: 'from-blue-400 to-indigo-500' },
  { name: 'Master Doa',   icon: '📿', req: 15, desc: 'Rajin berdoa!',       color: 'from-purple-400 to-violet-500' },
  { name: 'Anak Soleh',   icon: '🌟', req: 20, desc: 'Akhlak terpuji!',     color: 'from-yellow-400 to-amber-500' },
  { name: 'Raja Raya',    icon: '👑', req: 30, desc: 'Legend Ramadan!',     color: 'from-emerald-400 to-teal-500' },
];

const CAPYBARA_MOODS = [
  { emoji: '😴', text: 'Ustaz ngantuk sikit... Tapi semangat ya! 💪' },
  { emoji: '🎉', text: 'YEAHHHH! Kita boleh buat ni! ALLAHU AKBAR!' },
  { emoji: '😎', text: 'Chill je bro. Lapar tu tanda badan sihat!' },
  { emoji: '🧠', text: 'Setiap saat sabar = pahala berganda. MasyaAllah!' },
  { emoji: '🤤', text: 'Ustaz dah nampak nasi lemak... Sabor ye...' },
];

const QUIZ_QUESTIONS = [
  { q: 'Apa nama bulan ke-9 dalam kalendar Islam?', options: ['Syaaban', 'Ramadan', 'Syawal', 'Zulhijjah'], ans: 1 },
  { q: 'Berapa rakaat solat Tarawih biasanya?', options: ['4 rakaat', '8 rakaat', '20 rakaat', 'Mana-mana dari atas'], ans: 3 },
  { q: 'Malam Lailatul Qadar lebih baik dari berapa malam?', options: ['100 malam', '500 malam', '1000 malam', '3000 malam'], ans: 2 },
  { q: 'Apakah syarat-syarat wajib puasa?', options: ['Islam, baligh, berakal', 'Sihat sahaja', 'Lelaki sahaja', 'Ada IC sahaja'], ans: 0 },
  { q: 'Apa yang membatalkan puasa?', options: ['Tidur', 'Makan sengaja', 'Peluh banyak', 'Baca Quran'], ans: 1 },
];

const USTAZ_SCRIPTS = {
  niat: {
    title: 'Niat Puasa Ramadan',
    arabic: 'نَوَيْتُ صَوْمَ غَدٍ عَنْ أَدَاءِ فَرْضِ شَهْرِ رَمَضَانَ هٰذِهِ السَّنَةِ لِلّٰهِ تَعَالَى',
    rumi: 'Nawaitu sauma ghadin an adaa-i fardhi syahri Ramadhana hadzihis-sanati lillahi taala.',
    meaning: 'Sahaja aku berpuasa esok hari untuk menunaikan fardhu Ramadan tahun ini kerana Allah Taala.',
    tip: 'Niat dibuat dalam hati sebelum Subuh. Ustaz pun baca ni setiap hari! 😊'
  },
  berbuka: {
    title: 'Doa Berbuka Puasa',
    arabic: 'اللَّهُمَّ لَكَ صُمْتُ وَبِكَ آمَنْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ',
    rumi: 'Allahumma laka sumtu wa bika aamantu wa ala rizqika aftartu.',
    meaning: 'Ya Allah, keranaMu aku berpuasa, kepadaMu aku beriman, dan dengan rezekiMu aku berbuka.',
    tip: 'Baca masa nak makan kurma tu! Makan kurma dulu, baru solat Maghrib! 🌴'
  },
  tanya: {
    title: 'Ustaz Menjawab!',
    arabic: null,
    rumi: null,
    meaning: null,
    tip: 'Kalau haus masa main, tak payah telan air liur tu okay? Buang je. Tapi jangan sengaja telan! Kalau rasa lapar sangat, buat aktiviti lain – lukis, main puzzle, baca buku. Masa berlalu laju kalau kita sibuk! Ingat, sabar tu separuh daripada iman. Ustaz pun tengah sabar sama-sama dengan korang! 😄'
  }
};

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

/** Convert Unix timestamp (seconds) → "HH:MM" local time */
function tsToHHMM(ts) {
  if (!ts || ts === 0) return '--:--';
  if (typeof ts === 'string' && ts.includes(':')) return ts.substring(0, 5);
  const d = new Date(Number(ts) * 1000);
  if (isNaN(d.getTime())) return '--:--';
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

/** Parse "HH:MM" → total minutes since midnight */
function parseHHMM(str) {
  if (!str || str === '--:--') return null;
  const parts = str.split(':').map(Number);
  if (parts.length !== 2 || parts.some(isNaN)) return null;
  return parts[0] * 60 + parts[1];
}

/** Find today's prayer entry from prayerTime array */
function findTodayEntry(arr) {
  if (!arr?.length) return null;
  const today = new Date();
  const yy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const todayStr = `${yy}-${mm}-${dd}`;

  // Try matching on date string
  const byDate = arr.find(p => typeof p.date === 'string' && p.date.startsWith(todayStr));
  if (byDate) return byDate;

  // Fallback: index by day-of-month (0-indexed)
  return arr[today.getDate() - 1] || arr[0];
}

/** Extract prayer times object from an API entry */
function extractTimes(entry) {
  if (!entry) return null;
  return {
    imsak:   tsToHHMM(entry.imsak),
    subuh:   tsToHHMM(entry.fajr),
    syuruk:  tsToHHMM(entry.syuruk),
    zohor:   tsToHHMM(entry.dhuhr),
    asar:    tsToHHMM(entry.asr),
    maghrib: tsToHHMM(entry.maghrib),
    isyak:   tsToHHMM(entry.isha),
  };
}

/** Return the next upcoming prayer label + time given current times object */
function getNextPrayer(times, nowMins) {
  const order = ['subuh','syuruk','zohor','asar','maghrib','isyak'];
  for (const key of order) {
    const mins = parseHHMM(times[key]);
    if (mins !== null && mins > nowMins) return { label: key.toUpperCase(), time: times[key] };
  }
  return { label: 'SUBUH', time: times.subuh }; // wrap to next day
}

// Confetti
const CONFETTI_COLORS = ['#f59e0b','#10b981','#3b82f6','#ec4899','#8b5cf6','#f97316'];
function spawnConfetti(count = 25) {
  const c = document.getElementById('gp-confetti');
  if (!c) return;
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    const size = 6 + Math.random() * 8;
    el.style.cssText = `
      position:fixed; pointer-events:none;
      left:${Math.random()*100}vw; top:-20px; z-index:9999;
      background:${CONFETTI_COLORS[Math.floor(Math.random()*CONFETTI_COLORS.length)]};
      width:${size}px; height:${size}px;
      border-radius:${Math.random()>0.5?'50%':'2px'};
      animation: gp-fall ${1.5+Math.random()*2}s ${Math.random()*0.4}s ease-in forwards;
      transform: translateX(${(Math.random()-0.5)*200}px);
    `;
    c.appendChild(el);
    setTimeout(() => el.remove(), 3500);
  }
}

// ─────────────────────────────────────────────
// PRAYER API — TWO SOURCES WITH AUTO-FALLBACK
// ─────────────────────────────────────────────
async function fetchPrayerAPI(zoneCode) {
  const today = new Date();
  const year  = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');

  // SOURCE 1: api.waktusolat.app (preferred)
  try {
    const res = await fetch(
      `https://api.waktusolat.app/v2/solat/zone/${zoneCode}`,
      { signal: AbortSignal.timeout(6000) }
    );
    if (res.ok) {
      const data = await res.json();
      const arr  = data.prayerTime || data.prayers || [];
      const entry = findTodayEntry(arr);
      if (entry) {
        console.log('[API1] waktusolat.app success, zone:', zoneCode, 'date:', entry.date);
        return extractTimes(entry);
      }
    }
  } catch (e) {
    console.warn('[API1] waktusolat.app failed:', e.message);
  }

  // SOURCE 2: e-solat.gov.my (JAKIM official)
  try {
    const res = await fetch(
      `https://www.e-solat.gov.my/index.php?r=esolatApi/takwimsolat&period=month&zone=${zoneCode}&year=${year}&month=${month}`,
      { signal: AbortSignal.timeout(8000) }
    );
    if (res.ok) {
      const data = await res.json();
      const arr  = data.prayerTime || [];
      const entry = findTodayEntry(arr);
      if (entry) {
        console.log('[API2] e-solat.gov.my success, zone:', zoneCode, 'date:', entry.date);
        return extractTimes(entry);
      }
    }
  } catch (e) {
    console.warn('[API2] e-solat.gov.my failed:', e.message);
  }

  throw new Error('Kedua-dua sumber API gagal');
}

// ─────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────

function NavBtn({ icon, label, active, onClick, badge }) {
  return (
    <button
      onClick={onClick}
      style={{ transition: 'all .25s' }}
      className={`relative flex flex-col items-center gap-1 px-5 py-2 rounded-2xl font-bold text-[9px] uppercase tracking-wider
        ${active ? 'bg-emerald-500 text-white shadow-lg scale-110' : 'text-slate-400'}`}
    >
      {React.cloneElement(icon, { size: 20 })}
      {label}
      {badge > 0 && (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[8px] font-black rounded-full flex items-center justify-center">
          {badge}
        </span>
      )}
    </button>
  );
}

/** Single prayer time card in the dark prayer panel */
function PrayerCard({ label, time, icon, highlight, isNext }) {
  return (
    <div className={`flex flex-col items-center p-2.5 rounded-xl transition-all
      ${highlight || isNext ? 'bg-emerald-500/25 ring-1 ring-emerald-400/50' : 'bg-white/5'}`}
    >
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-1.5 text-xs
        ${highlight || isNext ? 'bg-emerald-500/40 text-emerald-200' : 'bg-white/10 text-white/50'}`}>
        {icon}
      </div>
      <p className="text-[8px] font-bold opacity-40 uppercase tracking-wider mb-0.5">{label}</p>
      <p className={`text-xs font-black tracking-tight
        ${highlight || isNext ? 'text-emerald-300' : 'text-white'}`}>{time}</p>
      {isNext && <span className="text-[7px] font-black text-emerald-400 mt-0.5 uppercase">NEXT</span>}
    </div>
  );
}

// ─────────────────────────────────────────────
// ZONE PICKER SHEET
// ─────────────────────────────────────────────
function ZonePicker({ currentCode, onSelect, onClose }) {
  const [search, setSearch] = useState('');
  const states = [...new Set(ALL_ZONES.map(z => z.state))];

  const filtered = ALL_ZONES.filter(z =>
    z.label.toLowerCase().includes(search.toLowerCase()) ||
    z.state.toLowerCase().includes(search.toLowerCase()) ||
    z.code.toLowerCase().includes(search.toLowerCase())
  );
  const grouped = states.reduce((acc, s) => {
    const zones = filtered.filter(z => z.state === s);
    if (zones.length) acc[s] = zones;
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 z-[300] flex flex-col bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 px-5 pt-12 pb-5 text-white">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onClose} className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
            <X size={16} />
          </button>
          <div>
            <h2 className="font-black text-lg">Pilih Kawasan</h2>
            <p className="text-[10px] opacity-70">Zona Waktu Solat JAKIM</p>
          </div>
        </div>
        <div className="bg-white/20 rounded-2xl flex items-center px-4 py-3 gap-2">
          <MapPin size={14} className="opacity-60 flex-shrink-0" />
          <input
            autoFocus
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari bandar, negeri, atau kod zon..."
            className="bg-transparent flex-1 text-sm font-bold placeholder:opacity-50 outline-none"
          />
          {search && (
            <button onClick={() => setSearch('')} className="opacity-60">
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {Object.keys(grouped).length === 0 ? (
          <div className="text-center py-16 text-slate-300">
            <p className="text-5xl mb-3">🔍</p>
            <p className="font-bold text-sm">Tiada kawasan dijumpai</p>
          </div>
        ) : (
          Object.entries(grouped).map(([state, zones]) => (
            <div key={state}>
              <div className="px-5 py-2 bg-slate-50 border-b border-slate-100 sticky top-0">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{state}</p>
              </div>
              <div className="p-3 space-y-1.5">
                {zones.map(z => {
                  const isActive = z.code === currentCode;
                  return (
                    <button
                      key={z.code}
                      onClick={() => { onSelect(z); onClose(); }}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all flex justify-between items-center
                        ${isActive ? 'bg-emerald-500 text-white' : 'hover:bg-emerald-50 border border-transparent hover:border-emerald-100'}`}
                    >
                      <div>
                        <p className={`font-bold text-sm ${isActive ? 'text-white' : 'text-slate-700'}`}>
                          {z.label.split('/')[0].trim()}
                        </p>
                        <p className={`text-[10px] mt-0.5 ${isActive ? 'text-emerald-100' : 'text-slate-400'}`}>
                          {z.state}
                        </p>
                      </div>
                      <span className={`text-[9px] font-black px-2 py-1 rounded-full
                        ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                        {z.code}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// USTAZ MODAL
// ─────────────────────────────────────────────
function UstazModal({ type, onClose }) {
  const content = USTAZ_SCRIPTS[type];
  const [speaking, setSpeaking] = useState(false);

  const speak = () => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setSpeaking(true);
    const utt = new SpeechSynthesisUtterance(content.rumi || content.tip);
    utt.lang = 'ms-MY'; utt.rate = 0.85;
    utt.onend = () => setSpeaking(false);
    utt.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utt);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white w-full max-w-md rounded-t-3xl p-6 pb-10 shadow-2xl"
        style={{ animation: 'slideUp .3s ease' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-amber-100 rounded-2xl flex items-center justify-center text-2xl">🐹</div>
            <div>
              <h3 className="font-black text-lg text-slate-800">{content.title}</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Ustaz Cakap</p>
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center">
            <X size={16} className="text-slate-500" />
          </button>
        </div>

        {content.arabic && (
          <div className="bg-emerald-50 rounded-2xl p-5 mb-3 border border-emerald-100 text-right">
            <p className="text-xl font-bold text-emerald-800 leading-loose mb-2" dir="rtl">{content.arabic}</p>
            <p className="text-xs text-slate-400 italic text-left">{content.rumi}</p>
          </div>
        )}
        {content.meaning && (
          <div className="bg-amber-50 rounded-xl px-4 py-3 mb-3 border border-amber-100">
            <p className="text-[10px] font-black text-amber-600 uppercase mb-1">Maksud:</p>
            <p className="text-sm text-slate-600">{content.meaning}</p>
          </div>
        )}
        <div className="bg-blue-50 rounded-xl px-4 py-3 mb-5 border border-blue-100">
          <p className="text-[10px] font-black text-blue-600 uppercase mb-1">💡 Tip Ustaz:</p>
          <p className="text-sm text-slate-600">{content.tip}</p>
        </div>

        <div className="flex gap-3">
          {content.rumi && (
            <button onClick={speak}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-black transition-all
                ${speaking ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>
              <Volume2 size={15} className={speaking ? 'animate-pulse' : ''} />
              {speaking ? 'Membaca...' : 'Dengar'}
            </button>
          )}
          <button onClick={onClose}
            className="flex-1 bg-emerald-500 text-white py-3 rounded-2xl text-sm font-black shadow-lg shadow-emerald-500/30">
            FAHAM! ✅
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// QUIZ GAME
// ─────────────────────────────────────────────
function QuizGame({ onClose, onXP }) {
  const [qi, setQi] = useState(0);
  const [sel, setSel] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = QUIZ_QUESTIONS[qi];

  const pick = (idx) => {
    if (sel !== null) return;
    setSel(idx);
    const correct = idx === q.ans;
    if (correct) setScore(s => s + 1);
    setTimeout(() => {
      if (qi + 1 >= QUIZ_QUESTIONS.length) {
        const earned = (score + (correct ? 1 : 0)) * 10;
        setDone(true);
        onXP(earned);
        spawnConfetti(25);
      } else {
        setQi(i => i + 1);
        setSel(null);
      }
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white w-full max-w-md rounded-t-3xl p-6 pb-10 shadow-2xl"
        style={{ animation: 'slideUp .3s ease' }} onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-5">
          <div>
            <h3 className="font-black text-xl text-emerald-700">Kuiz Kilat! ⚡</h3>
            <p className="text-xs text-slate-400 font-bold">{done ? 'Selesai!' : `Soalan ${qi+1}/${QUIZ_QUESTIONS.length}`}</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center">
            <X size={16} className="text-slate-500" />
          </button>
        </div>

        {done ? (
          <div className="text-center py-6">
            <div className="text-6xl mb-4">{score >= 4 ? '🏆' : score >= 2 ? '⭐' : '💪'}</div>
            <p className="font-black text-3xl text-emerald-600 mb-2">{score}/{QUIZ_QUESTIONS.length}</p>
            <p className="text-slate-500 font-bold mb-5">
              {score >= 4 ? 'MasyaAllah! Genius betul!' : score >= 2 ? 'Bagus! Teruskan belajar!' : 'Jangan putus asa!'}
            </p>
            <p className="text-sm font-black text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full inline-block mb-5">
              +{score * 10} XP dikumpul! 🎉
            </p>
            <button onClick={onClose} className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-black text-sm">
              SYUKRAN! BALIK KE DASHBOARD
            </button>
          </div>
        ) : (
          <>
            <div className="bg-emerald-50 rounded-2xl p-5 mb-5">
              <p className="font-bold text-slate-700 text-sm leading-relaxed">{q.q}</p>
            </div>
            <div className="space-y-3">
              {q.options.map((opt, i) => {
                let cls = 'border-2 border-slate-100 bg-white text-slate-700';
                if (sel !== null) {
                  if (i === q.ans) cls = 'border-2 border-emerald-500 bg-emerald-50 text-emerald-700';
                  else if (i === sel) cls = 'border-2 border-red-400 bg-red-50 text-red-600';
                }
                return (
                  <button key={i} onClick={() => pick(i)}
                    className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-all ${cls}`}>
                    {opt}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────
export default function GengPuasa() {
  // ── Persisted state ──────────────────────────
  const [zone, setZone] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('gp_zone_v2') || 'null');
      return saved || { code: 'WLY01', label: 'Kuala Lumpur / Putrajaya', state: 'Wilayah Persekutuan' };
    } catch { return { code: 'WLY01', label: 'Kuala Lumpur / Putrajaya', state: 'Wilayah Persekutuan' }; }
  });

  const [completedDays, setCompletedDays] = useState(() => {
    try { return JSON.parse(localStorage.getItem('gp_done') || '[]'); } catch { return []; }
  });
  const [totalXP, setTotalXP] = useState(() => {
    try { return parseInt(localStorage.getItem('gp_xp') || '0'); } catch { return 0; }
  });

  // ── UI state ─────────────────────────────────
  const [tab, setTab]               = useState('dashboard');
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [loading, setLoading]       = useState(false);
  const [apiError, setApiError]     = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [moodIdx, setMoodIdx]       = useState(0);
  const [showZonePicker, setShowZonePicker] = useState(false);
  const [showUstaz, setShowUstaz]   = useState(null);
  const [showQuiz, setShowQuiz]     = useState(false);
  const [badgeToast, setBadgeToast] = useState(null);
  const [justDone, setJustDone]     = useState(null);
  const [missionFilter, setMissionFilter] = useState('all');

  // ── Clock ────────────────────────────────────
  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // ── Mood rotation ─────────────────────────────
  useEffect(() => {
    const t = setInterval(() => setMoodIdx(i => (i + 1) % CAPYBARA_MOODS.length), 30000);
    return () => clearInterval(t);
  }, []);

  // ── Persist zone ─────────────────────────────
  useEffect(() => {
    localStorage.setItem('gp_zone_v2', JSON.stringify(zone));
  }, [zone]);

  // ── Persist XP & missions ─────────────────────
  useEffect(() => {
    localStorage.setItem('gp_done', JSON.stringify(completedDays));
    localStorage.setItem('gp_xp', String(totalXP));
  }, [completedDays, totalXP]);

  // ── Fetch prayer times whenever zone changes ───
  const loadPrayerTimes = useCallback(async (zoneCode) => {
    setLoading(true);
    setApiError('');
    setPrayerTimes(null);           // clear old data immediately
    try {
      const times = await fetchPrayerAPI(zoneCode);
      setPrayerTimes(times);
    } catch (err) {
      console.error('Prayer fetch error:', err);
      setApiError('Gagal muat waktu solat. Semak sambungan internet & cuba lagi.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPrayerTimes(zone.code);
  }, [zone.code, loadPrayerTimes]);  // ← key fix: depend on zone.code

  // ── Derived values ────────────────────────────
  const nowMins = currentTime.getHours() * 60 + currentTime.getMinutes();

  const nextPrayer = useMemo(() => {
    if (!prayerTimes) return null;
    return getNextPrayer(prayerTimes, nowMins);
  }, [prayerTimes, nowMins]);

  // Countdown to Maghrib (iftar)
  const iftarInfo = useMemo(() => {
    if (!prayerTimes?.maghrib) return null;
    const maghribMins = parseHHMM(prayerTimes.maghrib);
    if (maghribMins === null) return null;

    const imsakMins = parseHHMM(prayerTimes.imsak) ?? 300;
    const diff = maghribMins - nowMins;
    const isIftar = diff <= 0;

    const h = Math.max(0, Math.floor(diff / 60));
    const m = Math.max(0, Math.floor(diff % 60));
    const s = Math.max(0, 60 - currentTime.getSeconds());
    const timer = isIftar ? null : `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s === 60 ? 0 : s).padStart(2,'0')}`;

    const progress = isIftar ? 100 : Math.max(0, Math.min(99, ((nowMins - imsakMins) / (maghribMins - imsakMins)) * 100));

    return { timer, isIftar, progress, maghrib: prayerTimes.maghrib, imsak: prayerTimes.imsak };
  }, [prayerTimes, nowMins, currentTime]);

  // Current highlighted prayer
  const currentHighlight = useMemo(() => {
    if (!prayerTimes) return null;
    const order = ['imsak','subuh','syuruk','zohor','asar','maghrib','isyak'];
    for (let i = order.length - 1; i >= 0; i--) {
      const mins = parseHHMM(prayerTimes[order[i]]);
      if (mins !== null && nowMins >= mins) return order[i];
    }
    return 'isyak'; // late night, past isyak
  }, [prayerTimes, nowMins]);

  // Level
  const level = useMemo(() => {
    const lvl = Math.floor(totalXP / 100) + 1;
    const xpIn = totalXP % 100;
    const titles = ['', 'Pelatih Baru', 'Pejuang Muda', 'Pahlawan Iman', 'Pahlawan Iman', 'Legend Akhirat'];
    return { lvl, xpIn, title: titles[Math.min(lvl, titles.length - 1)] || 'Legend Akhirat' };
  }, [totalXP]);

  // Mission helpers
  const toggleMission = (day) => {
    const mission = MISSIONS.find(m => m.day === day);
    if (!mission) return;

    if (completedDays.includes(day)) {
      setCompletedDays(d => d.filter(x => x !== day));
      setTotalXP(x => Math.max(0, x - mission.xp));
    } else {
      const newDone = [...completedDays, day];
      setCompletedDays(newDone);
      setTotalXP(x => x + mission.xp);
      setJustDone(day);
      setTimeout(() => setJustDone(null), 1200);
      spawnConfetti(mission.category === 'boss' ? 60 : 20);

      // Badge check
      const prev = BADGES.filter(b => b.req <= completedDays.length);
      const now  = BADGES.filter(b => b.req <= newDone.length);
      if (now.length > prev.length) {
        const newBadge = now[now.length - 1];
        setBadgeToast(newBadge);
        spawnConfetti(70);
        setTimeout(() => setBadgeToast(null), 4000);
      }
    }
  };

  const pendingCount = MISSIONS.filter(m => !completedDays.includes(m.day) && m.day <= new Date().getDate()).length;

  const filteredMissions = missionFilter === 'all' ? MISSIONS
    : missionFilter === 'done' ? MISSIONS.filter(m => completedDays.includes(m.day))
    : MISSIONS.filter(m => !completedDays.includes(m.day));

  const mood = CAPYBARA_MOODS[moodIdx];

  // ─────────────────────────────────────────────
  // STYLES (injected once)
  // ─────────────────────────────────────────────
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes gp-fall { to { transform: translateY(110vh) rotate(540deg); opacity: 0; } }
      @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
      @keyframes gpFloat { 0%,100%{ transform:translateY(0);} 50%{ transform:translateY(-6px);} }
      @keyframes gpPop { 0%{transform:scale(.5);opacity:0;} 70%{transform:scale(1.1);} 100%{transform:scale(1);opacity:1;} }
      @keyframes gpPulse { 0%,100%{opacity:1;} 50%{opacity:.5;} }
      .gp-float { animation: gpFloat 3s ease-in-out infinite; }
      .gp-pop   { animation: gpPop .4s ease forwards; }
      .gp-pulse { animation: gpPulse 2s ease infinite; }
      * { -webkit-tap-highlight-color: transparent; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-emerald-50 font-sans text-slate-800 pb-28 relative overflow-x-hidden">
      {/* Confetti layer */}
      <div id="gp-confetti" className="fixed inset-0 pointer-events-none z-[999]" />

      {/* Badge toast */}
      {badgeToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[500] gp-pop">
          <div className={`bg-gradient-to-r ${badgeToast.color} text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3`}>
            <span className="text-3xl">{badgeToast.icon}</span>
            <div>
              <p className="font-black text-sm">Badge Baru Dibuka! 🎊</p>
              <p className="font-bold text-xs opacity-90">{badgeToast.name} — {badgeToast.desc}</p>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showZonePicker && (
        <ZonePicker
          currentCode={zone.code}
          onSelect={(z) => setZone(z)}
          onClose={() => setShowZonePicker(false)}
        />
      )}
      {showUstaz && <UstazModal type={showUstaz} onClose={() => setShowUstaz(null)} />}
      {showQuiz   && <QuizGame onClose={() => setShowQuiz(false)} onXP={(xp) => setTotalXP(t => t + xp)} />}

      {/* ══ HEADER ══ */}
      <header className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white pt-12 pb-8 px-5 rounded-b-[3rem] shadow-xl shadow-emerald-900/20 relative overflow-hidden">
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-start mb-5">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex-shrink-0 flex items-center justify-center text-3xl border border-white/30 gp-float">
                🐹
              </div>
              <div className="min-w-0">
                <h1 className="font-black text-2xl tracking-tight">Geng Puasa</h1>
                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                  <span className="text-[10px] font-black bg-white/20 px-2 py-0.5 rounded-full uppercase">{level.title}</span>
                  <span className="text-[10px] font-black bg-amber-400/80 text-amber-900 px-2 py-0.5 rounded-full">Lvl {level.lvl}</span>
                </div>

                {/* ── Zone chip (always visible, tap to change) ── */}
                <button
                  onClick={() => setShowZonePicker(true)}
                  className="mt-2 flex items-center gap-1.5 bg-white/20 hover:bg-white/30 transition-all px-3 py-1.5 rounded-full max-w-[200px]"
                >
                  <MapPin size={10} className="flex-shrink-0" />
                  <span className="text-[10px] font-black truncate leading-tight">
                    {zone.state} · {zone.label.split('/')[0].trim()}
                  </span>
                  <span className="text-[9px] opacity-60 flex-shrink-0">[{zone.code}]</span>
                </button>
              </div>
            </div>

            <div className="text-right flex-shrink-0">
              <p className="text-[10px] font-black opacity-50 uppercase tracking-widest">Ramadan 1447H</p>
              <p className="text-sm font-black">
                {currentTime.toLocaleDateString('ms-MY', { day: 'numeric', month: 'short' })}
              </p>
              <p className="text-xs font-bold opacity-70 mt-1">
                {currentTime.toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </p>
            </div>
          </div>

          {/* XP Bar */}
          <div className="bg-white/15 rounded-full h-2.5 mb-1 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-300 to-yellow-400 rounded-full transition-all duration-700"
              style={{ width: `${level.xpIn}%` }} />
          </div>
          <div className="flex justify-between text-[9px] font-black opacity-50 uppercase">
            <span>{level.xpIn} / 100 XP</span>
            <span>→ Lvl {level.lvl + 1}</span>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-5">

        {/* ══ DASHBOARD TAB ══ */}
        {tab === 'dashboard' && (
          <div className="space-y-4">

            {/* Iftar Countdown */}
            {iftarInfo && (
              <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-slate-100 relative overflow-hidden">
                <div className="absolute top-3 right-3 text-[9px] font-black bg-emerald-50 text-emerald-600 px-2 py-1 rounded-full uppercase">
                  {iftarInfo.isIftar ? '🌙 Masa Berbuka!' : '⏳ Kira Masa'}
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                  {iftarInfo.isIftar ? 'ALHAMDULILLAH!' : 'Menunggu Iftar'}
                </p>
                <div className={`font-black text-5xl tracking-tight mb-4 ${iftarInfo.isIftar ? 'text-amber-500' : 'text-emerald-600'}`}>
                  {iftarInfo.isIftar ? '🎉 IFTAR!' : iftarInfo.timer}
                </div>

                {/* Capybara road */}
                <div className="relative h-12 flex items-center mb-2">
                  <div className="absolute w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div className="absolute inset-0 opacity-20" style={{
                      backgroundImage: 'repeating-linear-gradient(90deg,transparent,transparent 16px,rgba(0,0,0,.15) 16px,rgba(0,0,0,.15) 18px)'
                    }} />
                  </div>
                  <div className="absolute h-3 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full transition-all duration-1000"
                    style={{ width: `${iftarInfo.progress}%` }} />
                  <div className="absolute transition-all duration-1000 gp-float"
                    style={{ left: `calc(${Math.min(iftarInfo.progress, 95)}% - 14px)` }}>
                    <span className="text-3xl drop-shadow-md">🐹</span>
                  </div>
                  <span className="absolute right-0 text-2xl">🌴</span>
                  <span className="absolute left-0 text-xl">🏡</span>
                </div>
                <div className="flex justify-between text-[9px] font-black text-slate-300 uppercase px-1">
                  <span>Imsak {iftarInfo.imsak}</span>
                  <span>Maghrib {iftarInfo.maghrib}</span>
                </div>
              </div>
            )}

            {/* Capybara Mood */}
            <div className="flex gap-3 items-start cursor-pointer"
              onClick={() => setMoodIdx(i => (i + 1) % CAPYBARA_MOODS.length)}>
              <div className="w-14 h-14 bg-amber-50 border-2 border-amber-200 rounded-2xl flex-shrink-0 flex items-center justify-center text-3xl gp-float">
                {mood.emoji}
              </div>
              <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none border border-amber-100 shadow-sm flex-1 relative">
                <p className="text-xs font-bold text-slate-600 leading-relaxed">"{mood.text}"</p>
                <p className="absolute -bottom-5 left-3 text-[8px] text-slate-300 font-bold">Ketuk untuk tukar mood 👆</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-3 mt-2">
              {[
                { label: 'Niat Puasa',  icon: '📿', action: () => setShowUstaz('niat') },
                { label: 'Doa Berbuka', icon: '🌙', action: () => setShowUstaz('berbuka') },
                { label: 'Tanya Ustaz', icon: '❓', action: () => setShowUstaz('tanya') },
              ].map(btn => (
                <button key={btn.label} onClick={btn.action}
                  className="bg-white py-4 px-2 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center gap-2 active:scale-95 transition-all hover:shadow-md hover:border-emerald-100">
                  <span className="text-2xl">{btn.icon}</span>
                  <span className="text-[9px] font-black uppercase text-slate-500 text-center leading-tight">{btn.label}</span>
                </button>
              ))}
            </div>

            {/* Prayer Times Panel */}
            <div className="bg-slate-900 text-white rounded-[2rem] p-5 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 opacity-50 text-[10px] font-black uppercase tracking-widest">
                  <Clock size={10} /> Waktu Solat Hari Ini
                </div>
                {/* Zone displayed here too */}
                <button
                  onClick={() => setShowZonePicker(true)}
                  className="flex items-center gap-1 text-[9px] font-black bg-white/10 hover:bg-white/20 px-2 py-1 rounded-full transition-all"
                >
                  <MapPin size={8} />
                  <span className="max-w-[100px] truncate">{zone.label.split('/')[0].trim()}</span>
                  <span className="opacity-60">[{zone.code}]</span>
                </button>
              </div>

              {loading ? (
                <div className="text-center py-8 opacity-40">
                  <RefreshCw size={28} className="mx-auto mb-2 gp-pulse" />
                  <p className="text-[10px] font-bold uppercase tracking-wider">Memuatkan waktu solat...</p>
                </div>
              ) : apiError ? (
                <div className="text-center py-6">
                  <AlertCircle size={28} className="mx-auto mb-2 text-red-400" />
                  <p className="text-[10px] text-red-300 font-bold mb-3">{apiError}</p>
                  <button onClick={() => loadPrayerTimes(zone.code)}
                    className="bg-emerald-500 text-white text-xs font-black px-4 py-2 rounded-full flex items-center gap-1.5 mx-auto">
                    <RefreshCw size={11} /> Cuba Semula
                  </button>
                </div>
              ) : prayerTimes ? (
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { key: 'imsak',   label: 'Imsak',   icon: <Coffee size={12}/> },
                    { key: 'subuh',   label: 'Subuh',   icon: <Moon size={12}/> },
                    { key: 'syuruk',  label: 'Syuruk',  icon: <Sun size={12}/> },
                    { key: 'zohor',   label: 'Zohor',   icon: <Sun size={12}/> },
                    { key: 'asar',    label: 'Asar',    icon: <ChevronUp size={12}/> },
                    { key: 'maghrib', label: 'Maghrib', icon: <Moon size={12}/> },
                    { key: 'isyak',   label: 'Isyak',   icon: <Star size={12}/> },
                  ].map(p => (
                    <PrayerCard
                      key={p.key}
                      label={p.label}
                      time={prayerTimes[p.key]}
                      icon={p.icon}
                      highlight={currentHighlight === p.key}
                      isNext={nextPrayer?.label === p.label.toUpperCase()}
                    />
                  ))}
                  <div /> {/* spacer for 4-col grid */}
                </div>
              ) : null}
            </div>

            

            {/* Quiz Banner */}
            <button onClick={() => setShowQuiz(true)}
              className="w-full bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-2xl p-4 flex items-center justify-between shadow-lg shadow-purple-500/20 active:scale-[.98] transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl">⚡</div>
                <div className="text-left">
                  <p className="font-black text-sm">Kuiz Kilat Ramadan!</p>
                  <p className="text-[10px] opacity-80 font-bold">5 soalan • Dapat XP bonus!</p>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-white/20 px-3 py-1.5 rounded-full">
                <Star size={11} /><span className="text-xs font-black">+XP</span>
              </div>
            </button>

            {/* Today's Mission Teaser */}
            {(() => {
              const todayM = MISSIONS.find(m => m.day === new Date().getDate()) || MISSIONS[0];
              const done = completedDays.includes(todayM.day);
              return (
                <button onClick={() => setTab('missions')}
                  className={`w-full rounded-2xl p-5 flex items-center gap-4 active:scale-[.98] transition-all border-2 text-left
                    ${done ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
                  <span className="text-4xl">{todayM.icon}</span>
                  <div className="flex-1">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-0.5">Misi Hari Ini</p>
                    <p className="font-black text-slate-800 text-sm">{todayM.title}</p>
                    <p className="text-[10px] text-slate-500 font-bold">{todayM.task}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${done ? 'bg-emerald-500' : 'bg-amber-400'}`}>
                    {done ? <CheckCircle2 size={18} className="text-white" /> : <Zap size={18} className="text-white" />}
                  </div>
                </button>
              );
            })()}
          </div>
        )}

        {/* ══ MISSIONS TAB ══ */}
        {tab === 'missions' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <h2 className="font-black text-2xl text-slate-800">Misi Ramadan 🚀</h2>
              <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                {completedDays.length}/{MISSIONS.length}
              </span>
            </div>

            {/* Filter chips */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {[['all','Semua'],['pending','Belum'],['done','Siap ✅']].map(([key, lbl]) => (
                <button key={key} onClick={() => setMissionFilter(key)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-black transition-all
                    ${missionFilter === key ? 'bg-emerald-500 text-white shadow-md' : 'bg-white text-slate-400 border border-slate-100'}`}>
                  {lbl}
                </button>
              ))}
            </div>

            {filteredMissions.map((m, i) => {
              const done = completedDays.includes(m.day);
              const isBoss = m.category === 'boss';
              return (
                <div key={m.day}
                  onClick={() => toggleMission(m.day)}
                  className={`rounded-2xl border-2 flex items-center gap-4 p-4 cursor-pointer transition-all active:scale-[.98]
                    ${justDone === m.day ? 'scale-105' : ''}
                    ${isBoss
                      ? done ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-300' : 'bg-slate-50 border-slate-200 border-dashed'
                      : done ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-100 hover:border-slate-200'
                    }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex-shrink-0 flex flex-col items-center justify-center
                    ${done ? 'bg-emerald-500' : isBoss ? 'bg-amber-400' : 'bg-slate-100'}`}>
                    {done
                      ? <CheckCircle2 size={20} className="text-white" />
                      : <><span className="text-lg leading-none">{m.icon}</span><span className="text-[8px] font-black text-slate-400 mt-0.5">#{m.day}</span></>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className={`text-sm font-black truncate ${done ? 'text-emerald-700' : 'text-slate-800'}`}>{m.title}</h3>
                      {isBoss && <span className="text-[8px] bg-amber-400 text-white px-1.5 py-0.5 rounded-full font-black uppercase flex-shrink-0">BOSS</span>}
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold leading-relaxed truncate">{m.task}</p>
                  </div>
                  <p className={`flex-shrink-0 text-[10px] font-black ${done ? 'text-emerald-500' : 'text-slate-300'}`}>
                    +{m.xp} XP
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* ══ BADGES TAB ══ */}
        {tab === 'badges' && (
          <div className="space-y-5">
            {/* Level card */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[2rem] p-6 text-white shadow-xl text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full mx-auto mb-3 flex items-center justify-center text-4xl gp-float">
                {level.lvl >= 10 ? '🏆' : level.lvl >= 5 ? '⚔️' : level.lvl >= 3 ? '🛡️' : '🌱'}
              </div>
              <p className="font-black text-3xl mb-1">{level.title}</p>
              <p className="font-bold text-sm opacity-80">Level {level.lvl} • {totalXP} XP Total</p>
              <div className="bg-white/20 rounded-full h-3 mt-4 overflow-hidden">
                <div className="h-full bg-white rounded-full transition-all duration-700" style={{ width: `${level.xpIn}%` }} />
              </div>
              <p className="text-[10px] font-black opacity-70 mt-1">{level.xpIn}/100 XP → Level {level.lvl + 1}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Misi Siap', value: completedDays.length, icon: '✅' },
                { label: 'Badge', value: BADGES.filter(b => completedDays.length >= b.req).length, icon: '🎖️' },
                { label: 'Total XP', value: totalXP, icon: '⚡' },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-2xl p-4 text-center shadow-sm border border-slate-100">
                  <p className="text-2xl mb-1">{s.icon}</p>
                  <p className="font-black text-xl text-slate-800">{s.value}</p>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Badges grid */}
            <h3 className="font-black text-lg text-slate-700 px-1">Koleksi Badge</h3>
            <div className="grid grid-cols-2 gap-4">
              {BADGES.map(badge => {
                const earned = completedDays.length >= badge.req;
                return (
                  <div key={badge.name}
                    className={`bg-white rounded-2xl p-5 border-2 flex items-center gap-4 transition-all
                      ${earned ? 'border-emerald-200 shadow-md' : 'border-slate-100 opacity-40 grayscale'}`}>
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0
                      ${earned ? `bg-gradient-to-br ${badge.color} shadow-lg` : 'bg-slate-100'}`}>
                      {badge.icon}
                    </div>
                    <div>
                      <p className="font-black text-sm text-slate-800">{badge.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold">{badge.desc}</p>
                      <p className="text-[9px] font-black mt-1 text-slate-300">{badge.req} misi</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Reset */}
            <button
              onClick={() => {
                if (window.confirm('Reset semua data? Ini tak boleh diundo!')) {
                  setCompletedDays([]);
                  setTotalXP(0);
                  localStorage.removeItem('gp_done');
                  localStorage.removeItem('gp_xp');
                }
              }}
              className="w-full flex items-center justify-center gap-2 text-slate-300 text-xs font-black py-4 border-2 border-dashed border-slate-100 rounded-2xl hover:border-red-200 hover:text-red-400 transition-all"
            >
              <RotateCcw size={14} /> Reset Progress
            </button>
          </div>
        )}
      </main>

      {/* ══ BOTTOM NAV ══ */}
      <nav className="fixed bottom-0 left-0 right-0 z-50">
        <div className="max-w-md mx-auto px-4 mb-4">
          <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-2xl rounded-[1.75rem] px-4 py-3 flex justify-around">
            <NavBtn icon={<Clock />}   label="Waktu"  active={tab === 'dashboard'} onClick={() => setTab('dashboard')} />
            <NavBtn icon={<Zap />}    label="Misi"   active={tab === 'missions'}  onClick={() => setTab('missions')}  badge={pendingCount} />
            <NavBtn icon={<Trophy />} label="Badge"  active={tab === 'badges'}   onClick={() => setTab('badges')} />
          </div>
        </div>
      </nav>
    </div>
  );
}
