import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  Moon, Sun, MapPin, Trophy, Volume2, CheckCircle2,
  Heart, Star, Clock, Coffee, Utensils, Zap, Gift,
  RotateCcw, ChevronUp, Sparkles, X, Calendar, Award,
  BookOpen, Smile, Target, AlertCircle
} from 'lucide-react';

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────

// Full JAKIM zone list for manual picker (grouped by state)
const ALL_ZONES = [
  // Wilayah Persekutuan
  { code: "WLY01", label: "Kuala Lumpur / Putrajaya", state: "Wilayah Persekutuan" },
  { code: "WLY02", label: "Labuan", state: "Wilayah Persekutuan" },
  // Johor
  { code: "JHR01", label: "Pulau Aur / Pemanggil", state: "Johor" },
  { code: "JHR02", label: "Johor Bahru / Kota Tinggi / Mersing", state: "Johor" },
  { code: "JHR03", label: "Batu Pahat / Muar / Segamat / Gemas Johor / Kluang / Pontian", state: "Johor" },
  { code: "JHR04", label: "Kota Tinggi / Mersing", state: "Johor" },
  // Kedah
  { code: "KDH01", label: "Kota Setar / Kubang Pasu / Padang Terap / Pokok Sena", state: "Kedah" },
  { code: "KDH02", label: "Kuala Muda / Yan / Sik", state: "Kedah" },
  { code: "KDH03", label: "Baling", state: "Kedah" },
  { code: "KDH04", label: "Bandar Bahru / Kulim", state: "Kedah" },
  // Kelantan
  { code: "KTN01", label: "Kota Bharu / Bachok / Pasir Puteh / Tumpat / Pasir Mas / Tanah Merah / Machang / Jeli / Kuala Krai", state: "Kelantan" },
  { code: "KTN03", label: "Gua Musang (Daerah Galas Dan Bertam) / Jeli", state: "Kelantan" },
  // Melaka
  { code: "MLK01", label: "Seluruh Melaka", state: "Melaka" },
  // Negeri Sembilan
  { code: "NSN01", label: "Jempol / Tampin", state: "Negeri Sembilan" },
  { code: "NSN02", label: "Jelebu / Kuala Pilah / Seremban", state: "Negeri Sembilan" },
  { code: "NSN03", label: "Port Dickson / Rembau", state: "Negeri Sembilan" },
  // Pahang
  { code: "PHG01", label: "Pulau Tioman", state: "Pahang" },
  { code: "PHG02", label: "Kuantan / Pekan / Rompin / Muadzam Shah", state: "Pahang" },
  { code: "PHG03", label: "Bentong / Raub", state: "Pahang" },
  { code: "PHG04", label: "Temerloh / Maran / Jerantut / Chenor / Jengka", state: "Pahang" },
  { code: "PHG05", label: "Bera / Nenasi", state: "Pahang" },
  // Perlis
  { code: "PLS01", label: "Kangar / Arau / Padang Besar", state: "Perlis" },
  // Pulau Pinang
  { code: "PNG01", label: "Seluruh Pulau Pinang", state: "Pulau Pinang" },
  // Perak
  { code: "PRK01", label: "Tapah / Slim River / Tanjung Malim", state: "Perak" },
  { code: "PRK02", label: "Ipoh / Batu Gajah / Kampar / Sungai Siput / Teluk Intan", state: "Perak" },
  { code: "PRK03", label: "Lenggong / Pengkalan Hulu / Grik", state: "Perak" },
  { code: "PRK04", label: "Temengor / Belum", state: "Perak" },
  { code: "PRK05", label: "Selama", state: "Perak" },
  { code: "PRK06", label: "Parit Buntar / Bagan Serai / Penaga", state: "Perak" },
  { code: "PRK07", label: "Pangkor", state: "Perak" },
  // Selangor
  { code: "SGR01", label: "Gombak / Hulu Selangor / Rawang / Hulu Langat / Sepang / Petaling", state: "Selangor" },
  { code: "SGR02", label: "Sabak Bernam / Kuala Selangor / Klang / Kuala Langat", state: "Selangor" },
  { code: "SGR03", label: "Shah Alam", state: "Selangor" },
  // Terengganu
  { code: "TRG01", label: "Kuala Terengganu / Marang / Kuala Nerus", state: "Terengganu" },
  { code: "TRG02", label: "Besut / Setiu", state: "Terengganu" },
  { code: "TRG03", label: "Hulu Terengganu", state: "Terengganu" },
  { code: "TRG04", label: "Kemaman / Dungun", state: "Terengganu" },
  // Sabah
  { code: "SBH01", label: "Kota Marudu / Pitas / Kudat", state: "Sabah" },
  { code: "SBH02", label: "Beluran / Sandakan / Kinabatangan", state: "Sabah" },
  { code: "SBH03", label: "Lahad Datu / Semporna / Tawau / Kunak", state: "Sabah" },
  { code: "SBH04", label: "Sipitang / Pensiangan / Hulu Sipitang / Ranau / Keningau / Tambunan / Nabawan", state: "Sabah" },
  { code: "SBH05", label: "Beaufort / Kuala Penyu / Menumbok / Papar / Kota Belud", state: "Sabah" },
  { code: "SBH06", label: "Kota Kinabalu / Penampang / Putatan / Tuaran", state: "Sabah" },
  { code: "SBH07", label: "Kudat / Kota Marudu / Pitas", state: "Sabah" },
  // Sarawak
  { code: "SWK01", label: "Limbang / Lawas / Sundar / Trusan", state: "Sarawak" },
  { code: "SWK02", label: "Miri / Niah / Bekenu / Sibuti / Marudi", state: "Sarawak" },
  { code: "SWK03", label: "Pandan / Belaga / Suai / Tatau / Sebauh / Bintulu", state: "Sarawak" },
  { code: "SWK04", label: "Kapit / Lubok Antu / Song", state: "Sarawak" },
  { code: "SWK05", label: "Sri Aman / Lubok Antu / Betong / Spaoh / Pusa / Saratok / Roban / Debak", state: "Sarawak" },
  { code: "SWK06", label: "Sibu / Mukah / Dalat / Song / Igan / Kanowit / Selangau", state: "Sarawak" },
  { code: "SWK07", label: "Serian / Simunjan / Samarahan / Bau / Lundu / Sematan", state: "Sarawak" },
  { code: "SWK08", label: "Kuching", state: "Sarawak" },
];

const MISSIONS = [
  { day: 1, title: "Niat Padu", task: "Hafal niat puasa dengan betul", icon: "🌙", xp: 10, category: "ibadah" },
  { day: 2, title: "Operasi Sahur", task: "Bangun sahur & berdoa sebelum makan", icon: "🌅", xp: 15, category: "amalan" },
  { day: 3, title: "Cari Kurma", task: "Hidang kurma untuk berbuka", icon: "🌴", xp: 10, category: "sunnah" },
  { day: 4, title: "Zikir Tenang", task: "Baca 33x SubhanAllah selepas Subuh", icon: "📿", xp: 20, category: "ibadah" },
  { day: 5, title: "Artis Ramadan", task: "Lukis Capybara pakai kopiah 😂", icon: "🎨", xp: 15, category: "fun" },
  { day: 6, title: "Air Kosong Champ", task: "Minum 8 gelas air selepas berbuka", icon: "💧", xp: 10, category: "amalan" },
  { day: 7, title: "Sedekah Senyum", task: "Senyum pada 5 orang hari ini", icon: "😊", xp: 15, category: "akhlak" },
  { day: 8, title: "Kisah Nabi", task: "Dengar 1 kisah Nabi dari orang tua", icon: "📖", xp: 20, category: "ilmu" },
  { day: 9, title: "Susun Kasut", task: "Susun kasut keluarga tanpa disuruh", icon: "👟", xp: 15, category: "akhlak" },
  { day: 10, title: "CHECK-POINT 1", task: "Tebus badge '10 Hari Legend'!", icon: "🏆", xp: 50, category: "boss" },
  { day: 11, title: "No-Gajet Hero", task: "1 jam penuh tanpa tengok screen", icon: "📵", xp: 25, category: "amalan" },
  { day: 12, title: "Bantu Chef", task: "Tolong mak/ayah masak berbuka", icon: "🍳", xp: 20, category: "akhlak" },
  { day: 13, title: "Doa Power", task: "Tulis 3 doa untuk orang tersayang", icon: "✍️", xp: 20, category: "ibadah" },
  { day: 14, title: "Tabung Syurga", task: "Derma sekurang-kurangnya RM1", icon: "💰", xp: 30, category: "amalan" },
  { day: 15, title: "Geng Tarawih", task: "Solat Tarawih berjemaah malam ini", icon: "🕌", xp: 35, category: "ibadah" },
  { day: 16, title: "Lidah Wangi", task: "Tak cakap perkataan kasar seharian", icon: "🌸", xp: 25, category: "akhlak" },
  { day: 17, title: "Nuzul Quran!", task: "Baca 1 muka surat Al-Quran", icon: "📗", xp: 30, category: "ibadah" },
  { day: 18, title: "Kemas Meja", task: "Kemas meja makan selepas berbuka", icon: "🍽️", xp: 15, category: "akhlak" },
  { day: 19, title: "Teka Doa", task: "Teka maksud doa berbuka puasa", icon: "🤔", xp: 20, category: "ilmu" },
  { day: 20, title: "CHECK-POINT 2", task: "Tebus badge '20 Hari Warrior'!", icon: "⚔️", xp: 75, category: "boss" },
  { day: 21, title: "Buru Lailatul", task: "Banyakkan doa malam ke-21", icon: "⭐", xp: 40, category: "ibadah" },
  { day: 22, title: "Kemas Bilik", task: "Kemas bilik sampai bersinar!", icon: "✨", xp: 20, category: "amalan" },
  { day: 23, title: "Kad Raya", task: "Buat kad raya untuk kawan lama", icon: "💌", xp: 25, category: "fun" },
  { day: 24, title: "Kongsi Rezeki", task: "Bagi jiran makanan berbuka", icon: "🥘", xp: 35, category: "amalan" },
  { day: 25, title: "Hafal Doa", task: "Hafal doa berbuka dengan sempurna", icon: "🎯", xp: 25, category: "ibadah" },
  { day: 26, title: "Baju Raya Ready", task: "Siapkan baju raya untuk hari raya", icon: "👘", xp: 15, category: "fun" },
  { day: 27, title: "Malam Seribu", task: "Baca Surah Al-Qadr malam ini", icon: "🌙", xp: 50, category: "ibadah" },
  { day: 28, title: "Zakat Fitrah", task: "Tengok ibu bapa bayar zakat fitrah", icon: "🤲", xp: 30, category: "amalan" },
  { day: 29, title: "Kuih Raya", task: "Tolong susun kuih raya dengan cantik", icon: "🍪", xp: 20, category: "fun" },
  { day: 30, title: "KEMENANGAN! 🎊", task: "Takbir! Selamat Hari Raya Aidilfitri!", icon: "🎉", xp: 100, category: "boss" },
];

const BADGES = [
  { name: 'Mata Burung', icon: '🦉', req: 3, desc: 'Rajin bangun awal!', color: 'from-amber-400 to-orange-500' },
  { name: 'Geng Sahur', icon: '🥘', req: 5, desc: 'Siap sahur setiap hari!', color: 'from-orange-400 to-red-500' },
  { name: 'Hero Sabar', icon: '💎', req: 10, desc: '10 misi berjaya!', color: 'from-blue-400 to-indigo-500' },
  { name: 'Master Doa', icon: '📿', req: 15, desc: 'Rajin berdoa!', color: 'from-purple-400 to-violet-500' },
  { name: 'Anak Soleh', icon: '🌟', req: 20, desc: 'Akhlak terpuji!', color: 'from-yellow-400 to-amber-500' },
  { name: 'Raja Raya', icon: '👑', req: 30, desc: 'Legend Ramadan!', color: 'from-emerald-400 to-teal-500' },
];

const CAPYBARA_MOODS = [
  { mood: 'sleepy', emoji: '😴', text: 'Ustaz ngantuk sikit... Tapi semangat ya! 💪' },
  { mood: 'hype', emoji: '🎉', text: 'YEAHHHH! Kita boleh buat ni! ALLAHU AKBAR!' },
  { mood: 'chill', emoji: '😎', text: 'Chill je bro. Lapar tu tanda badan sihat!' },
  { mood: 'wise', emoji: '🧠', text: 'Setiap saat sabar = pahala berganda. MasyaAllah!' },
  { mood: 'hungry', emoji: '🤤', text: 'Ustaz dah nampak nasi lemak... Sabor ye...' },
];

const MINI_GAMES = {
  quiz: {
    title: 'Kuiz Kilat!',
    questions: [
      { q: 'Apa nama bulan ke-9 dalam kalendar Islam?', options: ['Syaaban', 'Ramadan', 'Syawal', 'Zulhijjah'], ans: 1 },
      { q: 'Berapa rakaat solat Tarawih biasanya?', options: ['4 rakaat', '8 rakaat', '20 rakaat', 'Mana-mana dari atas'], ans: 3 },
      { q: 'Malam Lailatul Qadar lebih baik dari berapa malam?', options: ['100 malam', '500 malam', '1000 malam', '3000 malam'], ans: 2 },
      { q: 'Apakah syarat-syarat wajib puasa?', options: ['Islam, baligh, berakal', 'Sihat sahaja', 'Lelaki sahaja', 'Ada IC sahaja'], ans: 0 },
      { q: 'Apa yang membatalkan puasa?', options: ['Tidur', 'Makan sengaja', 'Peluh banyak', 'Baca Quran'], ans: 1 },
    ]
  }
};

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
// HELPER FUNCTIONS
// ─────────────────────────────────────────────

/**
 * Convert Unix timestamp (seconds) → "HH:MM" in local time
 */
function tsToHHMM(ts) {
  if (ts === null || ts === undefined || ts === 0) return '--:--';
  if (typeof ts === 'string' && ts.includes(':')) return ts.substring(0, 5);
  const d = new Date(Number(ts) * 1000);
  if (isNaN(d.getTime())) return '--:--';
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

/**
 * Find today's prayer entry from the prayerTime array
 */
function findTodayPrayer(prayerTime) {
  if (!prayerTime?.length) return null;

  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const date = String(today.getDate()).padStart(2, '0');
  const todayStr = `${year}-${month}-${date}`;

  // Primary: exact match on date string
  const match = prayerTime.find(p => {
    if (typeof p.date === 'string') {
      return p.date.startsWith(todayStr) || p.date === todayStr;
    }
    return false;
  });
  if (match) return match;

  // Secondary fallback: index by day-of-month
  const byIndex = prayerTime[today.getDate() - 1];
  if (byIndex) return byIndex;

  return prayerTime[0];
}

/**
 * Get zone label from code
 */
function getZoneLabel(zoneCode) {
  const zone = ALL_ZONES.find(z => z.code === zoneCode);
  return zone ? zone.label : zoneCode;
}

/**
 * Get zone full info
 */
function getZoneInfo(zoneCode) {
  return ALL_ZONES.find(z => z.code === zoneCode) || null;
}

/**
 * Calculate time remaining until next prayer
 */
function getNextPrayer(prayerTimes) {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  
  const prayers = [
    { name: 'Subuh', time: prayerTimes.subuh, icon: '🌙' },
    { name: 'Syuruk', time: prayerTimes.syuruk, icon: '☀️' },
    { name: 'Zuhur', time: prayerTimes.zuhur, icon: '☀️' },
    { name: 'Asar', time: prayerTimes.asar, icon: '☀️' },
    { name: 'Maghrib', time: prayerTimes.maghrib, icon: '🌙' },
    { name: 'Isyak', time: prayerTimes.isyak, icon: '🌙' }
  ];

  for (let prayer of prayers) {
    if (prayer.time === '--:--') continue;
    
    const [hours, minutes] = prayer.time.split(':').map(Number);
    const prayerTimeInMinutes = hours * 60 + minutes;
    
    if (prayerTimeInMinutes > currentTime) {
      const diff = prayerTimeInMinutes - currentTime;
      const hoursLeft = Math.floor(diff / 60);
      const minutesLeft = diff % 60;
      return {
        ...prayer,
        remaining: `${hoursLeft}j ${minutesLeft}m`,
        diff
      };
    }
  }
  
  // If all prayers passed, get tomorrow's Subuh
  return {
    name: 'Subuh (Esok)',
    time: prayerTimes.subuh,
    icon: '🌙',
    remaining: 'Esok',
    diff: null
  };
}

// ─────────────────────────────────────────────
// CONFETTI ENGINE
// ─────────────────────────────────────────────
const CONFETTI_COLORS = ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6', '#f97316'];

function spawnConfetti(count = 30) {
  const container = document.getElementById('confetti-container');
  if (!container) return;
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.cssText = `
      left: ${Math.random() * 100}vw;
      top: -20px;
      background: ${CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)]};
      width: ${6 + Math.random() * 8}px;
      height: ${6 + Math.random() * 8}px;
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      --duration: ${1.5 + Math.random() * 2}s;
      --delay: ${Math.random() * 0.5}s;
      --drift: ${(Math.random() - 0.5) * 200}px;
    `;
    container.appendChild(el);
    setTimeout(() => el.remove(), 4000);
  }
}

// ─────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────
const NavBtn = ({ icon, label, active, onClick, badge }) => (
  <button
    onClick={onClick}
    className={`relative flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all duration-300 ${
      active
        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-110'
        : 'text-slate-400 hover:text-slate-600'
    }`}
  >
    {React.cloneElement(icon, { size: 22 })}
    <span className="text-[9px] font-bold uppercase tracking-wider">{label}</span>
    {badge > 0 && (
      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[8px] font-black rounded-full flex items-center justify-center">
        {badge}
      </span>
    )}
  </button>
);

const PrayerCard = ({ label, time, icon, highlight }) => (
  <div className={`text-center p-3 rounded-2xl transition-all ${highlight ? 'bg-emerald-500/20 ring-1 ring-emerald-400/30' : 'bg-white/5'}`}>
    <div className={`mx-auto w-9 h-9 rounded-xl flex items-center justify-center mb-2 ${highlight ? 'bg-emerald-500/30 text-emerald-300' : 'bg-white/10 text-white/60'}`}>
      {icon}
    </div>
    <p className="text-[9px] font-bold opacity-50 uppercase tracking-wider mb-1">{label}</p>
    <p className={`text-sm font-black ${highlight ? 'text-emerald-300' : 'text-white'}`}>{time}</p>
  </div>
);

// ─────────────────────────────────────────────
// MINI GAME: QUIZ
// ─────────────────────────────────────────────
const QuizGame = ({ onClose, onXP }) => {
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const questions = MINI_GAMES.quiz.questions;

  const handleAnswer = (idx) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === questions[qIndex].ans) {
      setScore(s => s + 1);
    }
    setTimeout(() => {
      if (qIndex + 1 >= questions.length) {
        setDone(true);
        const earned = (score + (idx === questions[qIndex].ans ? 1 : 0)) * 10;
        onXP(earned);
        spawnConfetti(20);
      } else {
        setQIndex(q => q + 1);
        setSelected(null);
      }
    }, 800);
  };

  const q = questions[qIndex];

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center bg-slate-900/80 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white w-full max-w-md rounded-t-[2.5rem] p-6 pb-10 shadow-2xl animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-5">
          <div>
            <h3 className="font-display text-xl text-emerald-700">Kuiz Kilat! ⚡</h3>
            <p className="text-xs text-slate-400 font-bold">{done ? 'Selesai!' : `Soalan ${qIndex + 1}/${questions.length}`}</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center">
            <X size={16} className="text-slate-500" />
          </button>
        </div>

        {done ? (
          <div className="text-center py-6">
            <div className="text-6xl mb-4">{score >= 4 ? '🏆' : score >= 2 ? '⭐' : '💪'}</div>
            <p className="font-display text-3xl text-emerald-600 mb-2">{score}/{questions.length}</p>
            <p className="text-slate-500 font-bold mb-6">
              {score >= 4 ? 'MasyaAllah! Genius betul!' : score >= 2 ? 'Bagus! Teruskan belajar!' : 'Jangan putus asa, cuba lagi!'}
            </p>
            <p className="text-sm font-black text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full inline-block">
              +{score * 10} XP dikumpul! 🎉
            </p>
            <button onClick={onClose} className="w-full mt-6 bg-emerald-500 text-white py-4 rounded-2xl font-black text-sm">
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
                if (selected !== null) {
                  if (i === q.ans) cls = 'border-2 border-emerald-500 bg-emerald-50 text-emerald-700';
                  else if (i === selected) cls = 'border-2 border-red-400 bg-red-50 text-red-600';
                }
                return (
                  <button key={i} onClick={() => handleAnswer(i)}
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
};

// ─────────────────────────────────────────────
// USTAZ MODAL
// ─────────────────────────────────────────────
const UstazModal = ({ type, onClose }) => {
  const content = USTAZ_SCRIPTS[type];
  const [speaking, setSpeaking] = useState(false);

  const speak = () => {
    if (!('speechSynthesis' in window)) return;
    setSpeaking(true);
    const text = content.rumi || content.tip;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ms-MY';
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center bg-slate-900/80 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white w-full max-w-md rounded-t-[2.5rem] p-6 pb-10 shadow-2xl animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-display text-xl text-emerald-700">{content.title}</h3>
          <button onClick={onClose} className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center">
            <X size={16} className="text-slate-500" />
          </button>
        </div>

        <div className="space-y-4">
          {content.arabic && (
            <div className="bg-emerald-50 rounded-2xl p-5 text-right">
              <p className="font-arabic text-2xl text-emerald-800 leading-loose">{content.arabic}</p>
            </div>
          )}
          
          {content.rumi && (
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-sm text-slate-600 italic">{content.rumi}</p>
            </div>
          )}
          
          {content.meaning && (
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs font-bold text-slate-400 mb-1">MAKSUD:</p>
              <p className="text-sm text-slate-700">{content.meaning}</p>
            </div>
          )}
          
          {content.tip && (
            <div className="bg-amber-50 rounded-xl p-4 border-l-4 border-amber-400">
              <p className="text-xs font-bold text-amber-600 mb-1">TIP USTAZ:</p>
              <p className="text-sm text-amber-800">{content.tip}</p>
            </div>
          )}

          <button
            onClick={speak}
            disabled={speaking}
            className="w-full mt-4 bg-emerald-500 text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Volume2 size={18} />
            {speaking ? 'Sedang baca...' : 'Dengar Rumi'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// MISSIONS PAGE
// ─────────────────────────────────────────────
const MissionsPage = ({ missions, onMissionToggle, currentDay }) => {
  // Group missions by category
  const groupedMissions = missions.reduce((acc, mission) => {
    if (!acc[mission.category]) {
      acc[mission.category] = [];
    }
    acc[mission.category].push(mission);
    return acc;
  }, {});

  const categoryIcons = {
    ibadah: '🕌',
    amalan: '💫',
    sunnah: '🌴',
    fun: '🎮',
    akhlak: '🤝',
    ilmu: '📚',
    boss: '👑'
  };

  const categoryColors = {
    ibadah: 'bg-emerald-100 text-emerald-700',
    amalan: 'bg-blue-100 text-blue-700',
    sunnah: 'bg-amber-100 text-amber-700',
    fun: 'bg-purple-100 text-purple-700',
    akhlak: 'bg-pink-100 text-pink-700',
    ilmu: 'bg-indigo-100 text-indigo-700',
    boss: 'bg-red-100 text-red-700'
  };

  return (
    <div className="px-4 pb-24">
      <h2 className="font-display text-xl text-slate-800 mb-4">Semua Misi Ramadan</h2>
      
      {Object.entries(groupedMissions).map(([category, missions]) => (
        <div key={category} className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">{categoryIcons[category]}</span>
            <h3 className="font-bold text-slate-700 capitalize">{category}</h3>
            <span className={`text-xs px-2 py-1 rounded-full ${categoryColors[category]}`}>
              {missions.filter(m => m.completed).length}/{missions.length}
            </span>
          </div>
          
          <div className="space-y-3">
            {missions.map(mission => (
              <div 
                key={mission.day}
                className={`bg-white rounded-xl p-4 shadow-sm border transition-all ${
                  mission.completed ? 'border-emerald-200 bg-emerald-50/50' : 'border-slate-100'
                } ${mission.day === currentDay && !mission.completed ? 'ring-2 ring-emerald-500 ring-offset-2' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`text-3xl w-12 h-12 rounded-xl flex items-center justify-center ${
                    mission.completed ? 'bg-emerald-200' : 'bg-emerald-50'
                  }`}>
                    {mission.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-slate-800">{mission.title}</h4>
                        <p className="text-xs text-slate-400 mt-1">Hari {mission.day}</p>
                      </div>
                      <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                        +{mission.xp} XP
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mt-2">{mission.task}</p>
                    <button
                      onClick={() => onMissionToggle(mission.day)}
                      disabled={mission.completed}
                      className={`mt-3 w-full py-2 rounded-xl text-xs font-bold transition-colors ${
                        mission.completed
                          ? 'bg-emerald-500 text-white cursor-default'
                          : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                      }`}
                    >
                      {mission.completed ? '✓ Selesai' : 'Tanda Selesai'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────
// MAIN APP COMPONENT
// ─────────────────────────────────────────────
function App() {
  // State management
  const [currentTab, setCurrentTab] = useState('utama');
  const [selectedZone, setSelectedZone] = useState(() => {
    const saved = localStorage.getItem('selectedZone');
    return saved || 'WLY01';
  });
  const [zonePickerOpen, setZonePickerOpen] = useState(false);
  const [prayerData, setPrayerData] = useState(null);
  const [prayerLoading, setPrayerLoading] = useState(false);
  const [prayerError, setPrayerError] = useState(null);
  const [missions, setMissions] = useState(() => {
    const saved = localStorage.getItem('missions');
    return saved ? JSON.parse(saved) : MISSIONS.map(m => ({ ...m, completed: false }));
  });
  const [totalXP, setTotalXP] = useState(() => {
    const saved = localStorage.getItem('totalXP');
    return saved ? parseInt(saved) : 0;
  });
  const [ustazModal, setUstazModal] = useState(null);
  const [showGame, setShowGame] = useState(false);
  const [capybaraMood, setCapybaraMood] = useState('chill');
  const [searchQuery, setSearchQuery] = useState('');
  const [nextPrayer, setNextPrayer] = useState(null);

  // Refs
  const initialLoadDone = useRef(false);

  // ─────────────────────────────────────────
  // PRAYER API FETCHING
  // ─────────────────────────────────────────

  useEffect(() => {
    fetchPrayerTimes(selectedZone);
  }, [selectedZone]);

  // Update next prayer countdown every minute
  useEffect(() => {
    if (prayerTimes) {
      updateNextPrayer();
      const interval = setInterval(updateNextPrayer, 60000); // Update every minute
      return () => clearInterval(interval);
    }
  }, [prayerTimes]);

  const updateNextPrayer = () => {
    if (prayerTimes) {
      setNextPrayer(getNextPrayer(prayerTimes));
    }
  };

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('selectedZone', selectedZone);
  }, [selectedZone]);

  useEffect(() => {
    localStorage.setItem('missions', JSON.stringify(missions));
  }, [missions]);

  useEffect(() => {
    localStorage.setItem('totalXP', totalXP.toString());
  }, [totalXP]);

  // Change capybara mood randomly
  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * CAPYBARA_MOODS.length);
      setCapybaraMood(CAPYBARA_MOODS[randomIndex].mood);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchPrayerTimes = async (zoneCode) => {
    setPrayerLoading(true);
    setPrayerError(null);
    
    try {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      
      const url = `https://www.e-solat.gov.my/index.php?r=esolatApi/takwimsolat&period=month&zone=${zoneCode}&year=${year}&month=${month}`;
      
      console.log('Fetching prayer times for zone:', zoneCode);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Prayer data received:', data);
      
      if (data && data.prayerTime && data.prayerTime.length > 0) {
        setPrayerData(data);
      } else {
        throw new Error('No prayer data received');
      }
    } catch (error) {
      console.error('Error fetching prayer times:', error);
      setPrayerError('Gagal muat turun waktu solat. Sila cuba lagi.');
      setPrayerData(getMockPrayerData());
    } finally {
      setPrayerLoading(false);
    }
  };

  // Mock data function for fallback
  const getMockPrayerData = () => {
    const today = new Date();
    const mockData = [];
    
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today.getFullYear(), today.getMonth(), i);
      mockData.push({
        date: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`,
        day: i,
        imsak: Math.floor(date.setHours(5, 30) / 1000),
        fajr: Math.floor(date.setHours(5, 45) / 1000),
        syuruk: Math.floor(date.setHours(7, 0) / 1000),
        dhuhr: Math.floor(date.setHours(13, 15) / 1000),
        asr: Math.floor(date.setHours(16, 30) / 1000),
        maghrib: Math.floor(date.setHours(19, 15) / 1000),
        isha: Math.floor(date.setHours(20, 30) / 1000)
      });
    }
    
    return { prayerTime: mockData };
  };

  // ─────────────────────────────────────────
  // COMPUTED PROPERTIES
  // ─────────────────────────────────────────

  const todayPrayer = useMemo(() => {
    if (!prayerData?.prayerTime) return null;
    return findTodayPrayer(prayerData.prayerTime);
  }, [prayerData]);

  const prayerTimes = useMemo(() => {
    if (!todayPrayer) {
      return {
        imsak: '--:--',
        subuh: '--:--',
        syuruk: '--:--',
        zuhur: '--:--',
        asar: '--:--',
        maghrib: '--:--',
        isyak: '--:--'
      };
    }

    return {
      imsak: tsToHHMM(todayPrayer.imsak),
      subuh: tsToHHMM(todayPrayer.fajr),
      syuruk: tsToHHMM(todayPrayer.syuruk),
      zuhur: tsToHHMM(todayPrayer.dhuhr),
      asar: tsToHHMM(todayPrayer.asr),
      maghrib: tsToHHMM(todayPrayer.maghrib),
      isyak: tsToHHMM(todayPrayer.isha)
    };
  }, [todayPrayer]);

  const currentZoneInfo = useMemo(() => {
    return getZoneInfo(selectedZone);
  }, [selectedZone]);

  const filteredZones = useMemo(() => {
    if (!searchQuery) return ALL_ZONES;
    
    const query = searchQuery.toLowerCase();
    return ALL_ZONES.filter(zone => 
      zone.label.toLowerCase().includes(query) || 
      zone.state.toLowerCase().includes(query) ||
      zone.code.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const groupedZones = useMemo(() => {
    return filteredZones.reduce((acc, zone) => {
      if (!acc[zone.state]) {
        acc[zone.state] = [];
      }
      acc[zone.state].push(zone);
      return acc;
    }, {});
  }, [filteredZones]);

  const completedMissions = missions.filter(m => m.completed).length;
  const totalMissions = missions.length;
  const progress = (completedMissions / totalMissions) * 100;
  const currentDay = new Date().getDate();
  const currentMission = missions.find(m => m.day === currentDay) || missions[0];
  const earnedBadges = BADGES.filter(badge => completedMissions >= badge.req);

  // ─────────────────────────────────────────
  // HANDLERS
  // ─────────────────────────────────────────

  const handleZoneChange = (zoneCode) => {
    setSelectedZone(zoneCode);
    setZonePickerOpen(false);
    setSearchQuery('');
  };

  const handleMissionToggle = (day) => {
    setMissions(prev => 
      prev.map(m => {
        if (m.day === day && !m.completed) {
          setTotalXP(xp => xp + m.xp);
          spawnConfetti(15);
          return { ...m, completed: true };
        }
        return m;
      })
    );
  };

  const resetMissions = () => {
    setMissions(MISSIONS.map(m => ({ ...m, completed: false })));
    spawnConfetti(10);
  };

  const handleXPAdd = (amount) => {
    setTotalXP(prev => prev + amount);
  };

  // ─────────────────────────────────────────
  // RENDER ZONE PICKER MODAL
  // ─────────────────────────────────────────

  const renderZonePicker = () => (
    <div 
      className="fixed inset-0 z-[200] flex items-end justify-center bg-slate-900/80 backdrop-blur-sm"
      onClick={() => setZonePickerOpen(false)}
    >
      <div 
        className="bg-white w-full max-w-md rounded-t-[2.5rem] p-6 pb-10 shadow-2xl animate-slide-up max-h-[80vh] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-display text-xl text-emerald-700">Pilih Kawasan</h3>
            <p className="text-xs text-slate-400 font-bold">Cari zon waktu solat JAKIM</p>
          </div>
          <button 
            onClick={() => setZonePickerOpen(false)} 
            className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center"
          >
            <X size={16} className="text-slate-500" />
          </button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Cari negeri atau kawasan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="overflow-y-auto flex-1">
          {Object.keys(groupedZones).length === 0 ? (
            <p className="text-center text-slate-400 py-8">Tiada kawasan dijumpai</p>
          ) : (
            Object.entries(groupedZones).map(([state, zones]) => (
              <div key={state} className="mb-4">
                <h4 className="text-xs font-black text-emerald-600 mb-2 px-2">{state}</h4>
                {zones.map(zone => (
                  <button
                    key={zone.code}
                    onClick={() => handleZoneChange(zone.code)}
                    className={`w-full text-left px-3 py-3 rounded-xl mb-1 transition-all ${
                      selectedZone === zone.code 
                        ? 'bg-emerald-500 text-white' 
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <p className={`font-bold text-sm ${selectedZone === zone.code ? 'text-white' : 'text-slate-700'}`}>
                      {zone.label}
                    </p>
                    <p className={`text-xs ${selectedZone === zone.code ? 'text-emerald-100' : 'text-slate-400'}`}>
                      {zone.code}
                    </p>
                  </button>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  // ─────────────────────────────────────────
  // RENDER MAIN UI
  // ─────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 font-sans antialiased">
      {/* Confetti container */}
      <div id="confetti-container" className="fixed inset-0 pointer-events-none z-50" />

      {/* Modals */}
      {zonePickerOpen && renderZonePicker()}
      {showGame && <QuizGame onClose={() => setShowGame(false)} onXP={handleXPAdd} />}
      {ustazModal && <UstazModal type={ustazModal} onClose={() => setUstazModal(null)} />}

      {/* Main Content */}
      <div className="max-w-md mx-auto bg-white/60 backdrop-blur-sm shadow-xl min-h-screen relative overflow-hidden">
        {/* Header */}
        <div className="bg-emerald-600 text-white px-6 pt-8 pb-6 rounded-b-3xl shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMzAgMTBhMjAgMjAgMCAwIDEgMCA0MCAyMCAyMCAwIDAgMSAwLTQweiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg==')] opacity-20" />
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="font-display text-2xl font-black tracking-tight">RAMADAN</h1>
                <p className="text-emerald-100 text-xs font-bold">Tracker 1446H</p>
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-full">
                <Trophy size={14} className="text-yellow-300" />
                <span className="font-black text-sm">{totalXP} XP</span>
              </div>
            </div>

            <button
              onClick={() => setZonePickerOpen(true)}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 transition-colors px-4 py-3 rounded-2xl w-full"
            >
              <MapPin size={18} />
              <div className="flex-1 text-left">
                <p className="text-xs opacity-80">Kawasan dipilih:</p>
                <p className="font-bold text-sm truncate">
                  {currentZoneInfo ? currentZoneInfo.label : selectedZone}
                </p>
              </div>
              <ChevronUp size={18} className="rotate-180" />
            </button>
          </div>
        </div>

        {/* Countdown Timer */}
        {nextPrayer && nextPrayer.remaining && (
          <div className="px-4 -mt-3 relative z-20">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-4 shadow-lg text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock size={20} />
                  <span className="text-sm font-bold">Next: {nextPrayer.name}</span>
                </div>
                <span className="text-lg font-black">{nextPrayer.remaining}</span>
              </div>
              <p className="text-xs opacity-80 mt-1">Waktu {nextPrayer.name}: {nextPrayer.time}</p>
            </div>
          </div>
        )}

        {/* Prayer Times */}
        <div className="px-4 mt-4">
          <div className="bg-white rounded-2xl shadow-xl p-5 border border-slate-100">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-display text-lg text-slate-800">Waktu Solat</h2>
              <div className="flex items-center gap-1 text-xs bg-emerald-50 px-3 py-1 rounded-full">
                <Sun size={12} className="text-emerald-600" />
                <span className="font-bold text-emerald-700">
                  {new Date().toLocaleDateString('ms-MY', { day: 'numeric', month: 'long' })}
                </span>
              </div>
            </div>

            {prayerLoading ? (
              <div className="py-8 text-center text-slate-400">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto mb-2"></div>
                <p className="text-sm">Memuat turun waktu solat...</p>
              </div>
            ) : prayerError ? (
              <div className="py-8 text-center">
                <AlertCircle size={40} className="text-red-400 mx-auto mb-2" />
                <p className="text-red-500 text-sm mb-2">{prayerError}</p>
                <button 
                  onClick={() => fetchPrayerTimes(selectedZone)}
                  className="bg-emerald-500 text-white px-4 py-2 rounded-full text-xs font-bold"
                >
                  Cuba Semula
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2">
                <PrayerCard label="IMSAK" time={prayerTimes.imsak} icon={<Moon size={18} />} />
                <PrayerCard label="SUBUH" time={prayerTimes.subuh} icon={<Moon size={18} />} highlight />
                <PrayerCard label="SYURUK" time={prayerTimes.syuruk} icon={<Sun size={18} />} />
                <PrayerCard label="ZUHUR" time={prayerTimes.zuhur} icon={<Sun size={18} />} />
                <PrayerCard label="ASAR" time={prayerTimes.asar} icon={<Sun size={18} />} />
                <PrayerCard label="MAGHRIB" time={prayerTimes.maghrib} icon={<Moon size={18} />} highlight />
                <PrayerCard label="ISYAK" time={prayerTimes.isyak} icon={<Moon size={18} />} />
                <PrayerCard label="ESOK" time="--:--" icon={<Clock size={18} />} />
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Content Based on Tab */}
        {currentTab === 'utama' && (
          <>
            {/* Capybara Mood */}
            <div className="px-4 mt-4">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-4 text-white shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="text-4xl bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center">
                    {CAPYBARA_MOODS.find(m => m.mood === capybaraMood)?.emoji || '😎'}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs opacity-80 font-bold">Ustaz Capybara cakap...</p>
                    <p className="font-bold text-sm">{CAPYBARA_MOODS.find(m => m.mood === capybaraMood)?.text}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="px-4 mt-4 grid grid-cols-3 gap-2">
              <button 
                onClick={() => setUstazModal('niat')}
                className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center gap-1 hover:bg-emerald-50 transition-colors"
              >
                <span className="text-xl">🌙</span>
                <span className="text-[10px] font-bold">Niat</span>
              </button>
              <button 
                onClick={() => setUstazModal('berbuka')}
                className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center gap-1 hover:bg-emerald-50 transition-colors"
              >
                <span className="text-xl">🌴</span>
                <span className="text-[10px] font-bold">Doa Buka</span>
              </button>
              <button 
                onClick={() => setUstazModal('tanya')}
                className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center gap-1 hover:bg-emerald-50 transition-colors"
              >
                <span className="text-xl">🤲</span>
                <span className="text-[10px] font-bold">Tanya Ustaz</span>
              </button>
            </div>

            {/* Mission of the Day */}
            <div className="px-4 mt-4">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-display text-slate-800">Misi Hari Ini</h3>
                  <span className="text-xs bg-emerald-50 px-3 py-1 rounded-full font-bold text-emerald-600">
                    Hari {currentDay}
                  </span>
                </div>
                
                {currentMission && (
                  <div className="flex items-start gap-3">
                    <div className="text-3xl bg-emerald-50 w-14 h-14 rounded-xl flex items-center justify-center">
                      {currentMission.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-800">{currentMission.title}</h4>
                      <p className="text-xs text-slate-400 mt-1">{currentMission.task}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs font-black text-emerald-600">+{currentMission.xp} XP</span>
                        <button
                          onClick={() => handleMissionToggle(currentMission.day)}
                          disabled={currentMission.completed}
                          className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
                            currentMission.completed
                              ? 'bg-emerald-100 text-emerald-400 cursor-not-allowed'
                              : 'bg-emerald-500 text-white hover:bg-emerald-600'
                          }`}
                        >
                          {currentMission.completed ? 'Selesai ✓' : 'Tanda Selesai'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="px-4 mt-4">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs font-bold text-slate-400">Progress Ramadan</p>
                  <p className="text-xs font-black text-emerald-600">{completedMissions}/{totalMissions} Misi</p>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Badges Preview */}
            <div className="px-4 mt-4 pb-24">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-display text-slate-800">Badges Terkini</h3>
                <button 
                  onClick={() => setCurrentTab('misi')}
                  className="text-xs text-emerald-600 font-bold"
                >
                  Lihat Semua →
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {BADGES.slice(0, 3).map(badge => {
                  const earned = completedMissions >= badge.req;
                  return (
                    <div 
                      key={badge.name}
                      className={`bg-white rounded-xl p-3 text-center border transition-all ${
                        earned 
                          ? `bg-gradient-to-br ${badge.color} text-white border-transparent shadow-md` 
                          : 'border-slate-100 opacity-40'
                      }`}
                    >
                      <span className="text-2xl block mb-1">{badge.icon}</span>
                      <p className="text-[10px] font-black">{badge.name}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {currentTab === 'misi' && (
          <MissionsPage 
            missions={missions}
            onMissionToggle={handleMissionToggle}
            currentDay={currentDay}
          />
        )}

        {currentTab === 'game' && (
          <div className="px-4 py-8 pb-24 text-center">
            <Sparkles size={48} className="text-emerald-500 mx-auto mb-4" />
            <h2 className="font-display text-2xl text-slate-800 mb-2">Mini Games</h2>
            <p className="text-slate-400 mb-6">Tekan butang di bawah untuk main!</p>
            <button
              onClick={() => setShowGame(true)}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-4 rounded-2xl font-black text-lg shadow-lg hover:shadow-xl transition-all"
            >
              Main Kuiz Kilat! ⚡
            </button>
          </div>
        )}

        {/* Navigation */}
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/80 backdrop-blur-md border-t border-slate-200 px-4 py-2 rounded-t-3xl shadow-lg">
          <div className="flex justify-around items-center">
            <NavBtn 
              icon={<Moon />} 
              label="UTAMA" 
              active={currentTab === 'utama'} 
              onClick={() => setCurrentTab('utama')}
            />
            <NavBtn 
              icon={<Trophy />} 
              label="MISI" 
              active={currentTab === 'misi'} 
              onClick={() => setCurrentTab('misi')}
              badge={missions.filter(m => !m.completed && m.day <= currentDay).length}
            />
            <NavBtn 
              icon={<Sparkles />} 
              label="GAME" 
              active={currentTab === 'game'} 
              onClick={() => setCurrentTab('game')}
            />
            <NavBtn 
              icon={<RotateCcw />} 
              label="RESET" 
              active={false} 
              onClick={resetMissions}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;