import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  Moon, Sun, MapPin, Trophy, Volume2, CheckCircle2,
  Heart, Star, Clock, Coffee, Utensils, Zap, Gift,
  RotateCcw, ChevronUp, Sparkles, X
} from 'lucide-react';

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────
const ZONE_MAPPING = {
  "Kuala Lumpur": "WLY01", "Putrajaya": "WLY01", "Bangi": "SGR01",
  "Petaling Jaya": "SGR01", "Shah Alam": "SGR01", "Johor Bahru": "JHR02",
  "Kota Bharu": "KTN01", "Georgetown": "PNG01", "Kuching": "SWK08",
  "Kota Kinabalu": "SBH07", "Kuantan": "PHG02", "Seremban": "NSN01",
  "Melaka": "MLK01", "Alor Setar": "KDH01", "Kangar": "PsL01",
  "Kuala Terengganu": "TRG01", "Ipoh": "PRK02"
};

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
    utterance.rate = 0.85;
    utterance.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-end justify-center bg-slate-900/80 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white w-full max-w-md rounded-t-[2.5rem] p-6 pb-10 shadow-2xl animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${speaking ? 'animate-wiggle bg-emerald-100' : 'bg-amber-100'}`}>
              🐹
            </div>
            <div>
              <h3 className="font-display text-lg text-slate-800">{content.title}</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ustaz Cakap</p>
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center">
            <X size={16} className="text-slate-500" />
          </button>
        </div>

        {content.arabic && (
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-5 mb-4 text-right border border-emerald-100">
            <p className="text-xl font-bold text-emerald-800 leading-loose mb-3" dir="rtl">{content.arabic}</p>
            <p className="text-xs text-slate-500 font-bold text-left italic">{content.rumi}</p>
          </div>
        )}

        {content.meaning && (
          <div className="bg-amber-50 rounded-xl px-4 py-3 mb-4 border border-amber-100">
            <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">Maksud:</p>
            <p className="text-sm text-slate-600 font-medium leading-relaxed">{content.meaning}</p>
          </div>
        )}

        <div className="bg-blue-50 rounded-xl px-4 py-3 mb-5 border border-blue-100">
          <p className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">💡 Tips Ustaz:</p>
          <p className="text-sm text-slate-600 font-medium leading-relaxed">{content.tip}</p>
        </div>

        <div className="flex gap-3">
          {content.rumi && (
            <button onClick={speak}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-black text-sm transition-all ${
                speaking ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'
              }`}>
              <Volume2 size={16} className={speaking ? 'animate-pulse' : ''} />
              {speaking ? 'Membaca...' : 'Dengar'}
            </button>
          )}
          <button onClick={onClose}
            className="flex-1 bg-emerald-500 text-white py-3 rounded-2xl font-black text-sm shadow-lg shadow-emerald-500/30">
            FAHAM USTAZ! ✅
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────
export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [completedMissions, setCompletedMissions] = useState(() => {
    try { return JSON.parse(localStorage.getItem('gp_missions') || '[]'); } catch { return []; }
  });
  const [totalXP, setTotalXP] = useState(() => {
    try { return parseInt(localStorage.getItem('gp_xp') || '0'); } catch { return 0; }
  });
  const [lastUnlocked, setLastUnlocked] = useState(null);
  const [moodIndex, setMoodIndex] = useState(0);
  const [showUstaz, setShowUstaz] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [newBadgeAnim, setNewBadgeAnim] = useState(null);
  const [streakDays, setStreakDays] = useState(() => {
    try { return parseInt(localStorage.getItem('gp_streak') || '0'); } catch { return 0; }
  });
  const [zoneCode] = useState('SGR01');
  const [missionFilter, setMissionFilter] = useState('all');
  const [justCompleted, setJustCompleted] = useState(null);

  // Clock tick
  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Rotate mood every 30s
  useEffect(() => {
    const t = setInterval(() => setMoodIndex(i => (i + 1) % CAPYBARA_MOODS.length), 30000);
    return () => clearInterval(t);
  }, []);

  // Persist state
  useEffect(() => {
    localStorage.setItem('gp_missions', JSON.stringify(completedMissions));
    localStorage.setItem('gp_xp', String(totalXP));
    localStorage.setItem('gp_streak', String(streakDays));
  }, [completedMissions, totalXP, streakDays]);

  // Fetch prayer times
  useEffect(() => {
    const fetchTimes = async () => {
      try {
        const res = await fetch(`https://api.waktusolat.app/v2/solat/zone/${zoneCode}`);
        const data = await res.json();
        if (data.prayers?.[0]) setPrayerTimes(data.prayers[0]);
      } catch {
        // Fallback times for Selangor
        setPrayerTimes({ imsak: '05:47', fajr: '05:57', dhuhr: '13:20', asr: '16:39', maghrib: '19:22', isha: '20:34' });
      }
    };
    fetchTimes();
  }, [zoneCode]);

  // Countdown + progress
  const stats = useMemo(() => {
    const maghribStr = prayerTimes?.maghrib || '19:22';
    const imsakStr = prayerTimes?.imsak || '05:47';
    const [mh, mm] = maghribStr.split(':').map(Number);
    const [ih, im] = imsakStr.split(':').map(Number);

    const target = new Date(currentTime);
    target.setHours(mh, mm, 0, 0);

    const diff = target - currentTime;
    const isIftar = diff <= 0;

    const hours = Math.max(0, Math.floor(diff / 3600000));
    const mins = Math.max(0, Math.floor((diff % 3600000) / 60000));
    const secs = Math.max(0, Math.floor((diff % 60000) / 1000));

    const startMin = ih * 60 + im;
    const endMin = mh * 60 + mm;
    const nowMin = currentTime.getHours() * 60 + currentTime.getMinutes();
    const progress = isIftar ? 100 : Math.max(0, Math.min(99, ((nowMin - startMin) / (endMin - startMin)) * 100));

    return {
      timer: `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`,
      progress,
      isIftar,
      maghrib: maghribStr,
      imsak: imsakStr,
    };
  }, [currentTime, prayerTimes]);

  // Level system
  const level = useMemo(() => {
    const lvl = Math.floor(totalXP / 100) + 1;
    const xpInLevel = totalXP % 100;
    return { level: lvl, xpInLevel, title: lvl >= 10 ? 'Legend Akhirat' : lvl >= 5 ? 'Pahlawan Iman' : lvl >= 3 ? 'Pejuang Muda' : 'Pelatih Baru' };
  }, [totalXP]);

  const toggleMission = (day) => {
    const mission = MISSIONS.find(m => m.day === day);
    if (!mission) return;

    const prevCompleted = completedMissions.length;
    let newCompleted;

    if (completedMissions.includes(day)) {
      newCompleted = completedMissions.filter(d => d !== day);
      setCompletedMissions(newCompleted);
      setTotalXP(xp => Math.max(0, xp - mission.xp));
    } else {
      newCompleted = [...completedMissions, day];
      setCompletedMissions(newCompleted);
      setTotalXP(xp => xp + mission.xp);
      setJustCompleted(day);
      setTimeout(() => setJustCompleted(null), 1000);

      // Confetti on boss missions
      if (mission.category === 'boss') spawnConfetti(50);
      else spawnConfetti(15);

      // Badge unlock check
      const earned = BADGES.filter(b => b.req <= newCompleted.length);
      const prevEarned = BADGES.filter(b => b.req <= prevCompleted);
      if (earned.length > prevEarned.length) {
        const newBadge = earned[earned.length - 1];
        setNewBadgeAnim(newBadge);
        spawnConfetti(60);
        setTimeout(() => setNewBadgeAnim(null), 4000);
      }

      setStreakDays(s => s + 1);
    }
  };

  const addXP = (xp) => setTotalXP(t => t + xp);

  const pendingMissions = MISSIONS.filter(m => !completedMissions.includes(m.day)).length;
  const filteredMissions = missionFilter === 'all'
    ? MISSIONS
    : missionFilter === 'done'
    ? MISSIONS.filter(m => completedMissions.includes(m.day))
    : MISSIONS.filter(m => !completedMissions.includes(m.day));

  const mood = CAPYBARA_MOODS[moodIndex];

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-emerald-50 font-body text-slate-800 pb-28 relative overflow-x-hidden">
      <div id="confetti-container" className="fixed inset-0 pointer-events-none z-[999]" />

      {/* Badge unlock toast */}
      {newBadgeAnim && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[500] animate-pop">
          <div className={`bg-gradient-to-r ${newBadgeAnim.color} text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3`}>
            <span className="text-3xl">{newBadgeAnim.icon}</span>
            <div>
              <p className="font-black text-sm">Badge Baru Dibuka! 🎊</p>
              <p className="font-bold text-xs opacity-90">{newBadgeAnim.name}</p>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showUstaz && <UstazModal type={showUstaz} onClose={() => setShowUstaz(null)} />}
      {showQuiz && <QuizGame onClose={() => setShowQuiz(false)} onXP={addXP} />}

      {/* Header */}
      <header className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white pt-12 pb-8 px-6 rounded-b-[3rem] shadow-xl shadow-emerald-900/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-star-pattern opacity-20" />
        <div className="max-w-md mx-auto relative">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-white/30 animate-float">
                🐹
              </div>
              <div>
                <h1 className="font-display text-2xl text-shadow">Geng Puasa</h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-black bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {level.title}
                  </span>
                  <span className="text-[10px] font-black bg-amber-400/80 text-amber-900 px-2 py-0.5 rounded-full">
                    Lvl {level.level}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black opacity-60 uppercase tracking-widest">Ramadan 1447H</p>
              <p className="text-sm font-black">
                {currentTime.toLocaleDateString('ms-MY', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
              <p className="text-[10px] font-bold opacity-70 mt-1">🔥 {streakDays} hari streak</p>
            </div>
          </div>

          {/* XP Bar */}
          <div className="bg-white/10 rounded-full h-2.5 mb-1 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-300 to-yellow-400 rounded-full transition-all duration-700"
              style={{ width: `${level.xpInLevel}%` }}
            />
          </div>
          <div className="flex justify-between text-[9px] font-black opacity-60 uppercase tracking-wider">
            <span>{level.xpInLevel} XP</span>
            <span>100 XP → Lvl {level.level + 1}</span>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-6">

        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-5">

            {/* Countdown Card */}
            <div className="bg-white rounded-[2rem] p-6 card-glow relative overflow-hidden">
              <div className="absolute top-3 right-3 bg-emerald-50 text-emerald-600 text-[9px] font-black px-2 py-1 rounded-full uppercase tracking-wider">
                {stats.isIftar ? '🌙 Masa Berbuka!' : '⏳ Kira Masa'}
              </div>

              <div className="relative z-10 text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
                  {stats.isIftar ? 'ALHAMDULILLAH!' : 'Masa Berbuka'}
                </p>
                <div className={`font-display text-6xl mb-5 tracking-tight transition-colors ${stats.isIftar ? 'text-amber-500' : 'text-emerald-600'}`}>
                  {stats.isIftar ? '🎉 IFTAR!' : stats.timer}
                </div>

                {/* Capybara Road */}
                <div className="relative h-14 flex items-center mb-2">
                  <div className="absolute w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div className="absolute inset-0 opacity-30" style={{
                      backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(0,0,0,0.1) 20px, rgba(0,0,0,0.1) 22px)'
                    }} />
                  </div>
                  <div
                    className="absolute h-3 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full transition-all duration-1000"
                    style={{ width: `${stats.progress}%` }}
                  />
                  <div
                    className="absolute transition-all duration-1000"
                    style={{ left: `calc(${stats.progress}% - 16px)` }}
                  >
                    <div className="text-4xl filter drop-shadow-lg animate-float">🐹</div>
                  </div>
                  <div className="absolute right-0 text-3xl">🌴</div>
                  <div className="absolute left-0 text-2xl">🏡</div>
                </div>
                <div className="flex justify-between text-[9px] font-black text-slate-300 uppercase px-1">
                  <span>Imsak {stats.imsak}</span>
                  <span>Maghrib {stats.maghrib}</span>
                </div>
              </div>
            </div>

            {/* Capybara Mood Chat */}
            <div
              className="flex gap-3 items-start cursor-pointer"
              onClick={() => setMoodIndex(i => (i + 1) % CAPYBARA_MOODS.length)}
            >
              <div className="w-14 h-14 bg-amber-50 border-2 border-amber-200 rounded-2xl flex-shrink-0 flex items-center justify-center text-3xl shadow-sm animate-float">
                {mood.emoji}
              </div>
              <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none border border-amber-100 shadow-sm flex-1 relative">
                <p className="text-xs font-bold text-slate-600 leading-relaxed">"{mood.text}"</p>
                <div className="absolute -bottom-5 left-3 text-[9px] text-slate-300 font-bold">Ketuk untuk tukar mood 👆</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-3 mt-2">
              {[
                { label: 'Niat Puasa', icon: '📿', color: 'bg-blue-50 text-blue-500', action: () => setShowUstaz('niat') },
                { label: 'Doa Berbuka', icon: '🌙', color: 'bg-emerald-50 text-emerald-500', action: () => setShowUstaz('berbuka') },
                { label: 'Tanya Ustaz', icon: '❓', color: 'bg-amber-50 text-amber-500', action: () => setShowUstaz('tanya') },
              ].map(btn => (
                <button key={btn.label} onClick={btn.action}
                  className="bg-white py-4 px-2 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center gap-2 active:scale-95 transition-all hover:shadow-md">
                  <span className="text-2xl">{btn.icon}</span>
                  <span className="text-[9px] font-black uppercase text-slate-500 text-center leading-tight">{btn.label}</span>
                </button>
              ))}
            </div>

            {/* Mini Game Banner */}
            <button
              onClick={() => setShowQuiz(true)}
              className="w-full bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-2xl p-4 flex items-center justify-between shadow-lg shadow-purple-500/20 active:scale-98 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl">⚡</div>
                <div className="text-left">
                  <p className="font-black text-sm">Kuiz Kilat Ramadan!</p>
                  <p className="text-[10px] opacity-80 font-bold">5 soalan • Dapat XP bonus!</p>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-white/20 px-3 py-1.5 rounded-full">
                <Star size={12} />
                <span className="text-xs font-black">+XP</span>
              </div>
            </button>

            {/* Prayer Times */}
            <div className="bg-slate-900 text-white rounded-[2rem] p-5 shadow-2xl">
              <div className="flex items-center gap-2 mb-4 opacity-50 text-[10px] font-black uppercase tracking-widest">
                <Clock size={11} /> Jadual Solat Hari Ini
              </div>
              <div className="grid grid-cols-3 gap-3">
                <PrayerCard label="Imsak" time={prayerTimes?.imsak || '05:47'} icon={<Coffee size={14}/>} />
                <PrayerCard label="Zohor" time={prayerTimes?.dhuhr || '13:20'} icon={<Sun size={14}/>} />
                <PrayerCard label="Asar" time={prayerTimes?.asr || '16:39'} icon={<ChevronUp size={14}/>} />
                <PrayerCard label="Maghrib" time={prayerTimes?.maghrib || '19:22'} icon={<Moon size={14}/>} highlight />
                <PrayerCard label="Isyak" time={prayerTimes?.isha || '20:34'} icon={<Star size={14}/>} />
                <PrayerCard label="Subuh" time={prayerTimes?.fajr || '05:57'} icon={<Sparkles size={14}/>} />
              </div>
            </div>

            {/* Today's Mission Teaser */}
            {(() => {
              const todayMission = MISSIONS.find(m => m.day === new Date().getDate()) || MISSIONS[0];
              const done = completedMissions.includes(todayMission.day);
              return (
                <div
                  onClick={() => { setActiveTab('missions'); }}
                  className={`rounded-2xl p-5 flex items-center gap-4 cursor-pointer transition-all active:scale-98 border-2 ${done ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}
                >
                  <div className="text-4xl">{todayMission.icon}</div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-0.5">Misi Hari Ini</p>
                    <p className="font-black text-slate-800 text-sm">{todayMission.title}</p>
                    <p className="text-[10px] text-slate-500 font-bold">{todayMission.task}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${done ? 'bg-emerald-500' : 'bg-amber-400'}`}>
                    {done ? <CheckCircle2 size={20} className="text-white" /> : <Zap size={20} className="text-white" />}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* MISSIONS TAB */}
        {activeTab === 'missions' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <h2 className="font-display text-2xl text-slate-800">Misi Ramadan 🚀</h2>
              <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                {completedMissions.length}/{MISSIONS.length}
              </span>
            </div>

            {/* Filter chips */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {[
                { key: 'all', label: 'Semua' },
                { key: 'pending', label: 'Belum' },
                { key: 'done', label: 'Siap ✅' },
              ].map(f => (
                <button key={f.key} onClick={() => setMissionFilter(f.key)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-black transition-all ${
                    missionFilter === f.key
                      ? 'bg-emerald-500 text-white shadow-md'
                      : 'bg-white text-slate-400 border border-slate-100'
                  }`}>
                  {f.label}
                </button>
              ))}
            </div>

            {filteredMissions.map((m, i) => {
              const done = completedMissions.includes(m.day);
              const isBoss = m.category === 'boss';
              const isNew = justCompleted === m.day;

              return (
                <div
                  key={m.day}
                  onClick={() => toggleMission(m.day)}
                  style={{ animationDelay: `${i * 30}ms` }}
                  className={`rounded-2xl border-2 flex items-center gap-4 p-4 cursor-pointer transition-all active:scale-98 ${isNew ? 'mission-complete-anim' : ''} ${
                    isBoss
                      ? done
                        ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-300'
                        : 'bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200 border-dashed'
                      : done
                      ? 'bg-emerald-50 border-emerald-200'
                      : 'bg-white border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex-shrink-0 flex flex-col items-center justify-center ${
                    done ? 'bg-emerald-500' : isBoss ? 'bg-amber-400' : 'bg-slate-100'
                  }`}>
                    {done ? (
                      <CheckCircle2 size={22} className="text-white" />
                    ) : (
                      <>
                        <span className="text-lg leading-none">{m.icon}</span>
                        <span className="text-[8px] font-black text-slate-400 mt-0.5">#{m.day}</span>
                      </>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className={`text-sm font-black truncate ${done ? 'text-emerald-700' : 'text-slate-800'}`}>{m.title}</h3>
                      {isBoss && <span className="text-[8px] bg-amber-400 text-white px-1.5 py-0.5 rounded-full font-black uppercase flex-shrink-0">BOSS</span>}
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold leading-relaxed truncate">{m.task}</p>
                  </div>

                  <div className="flex-shrink-0 text-right">
                    <p className={`text-[10px] font-black ${done ? 'text-emerald-500' : 'text-slate-300'}`}>+{m.xp} XP</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* BADGES TAB */}
        {activeTab === 'badges' && (
          <div className="space-y-6">
            {/* Level card */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[2rem] p-6 text-white shadow-xl shadow-emerald-500/20 text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full mx-auto mb-3 flex items-center justify-center text-4xl animate-float">
                {level.level >= 10 ? '🏆' : level.level >= 5 ? '⚔️' : level.level >= 3 ? '🛡️' : '🌱'}
              </div>
              <p className="font-display text-3xl mb-1">{level.title}</p>
              <p className="font-bold text-sm opacity-80">Level {level.level} • {totalXP} XP Total</p>

              <div className="bg-white/20 rounded-full h-3 mt-4 overflow-hidden">
                <div className="h-full bg-white rounded-full transition-all duration-700" style={{ width: `${level.xpInLevel}%` }} />
              </div>
              <p className="text-[10px] font-black opacity-70 mt-1">{level.xpInLevel}/100 XP → Level {level.level + 1}</p>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Misi Siap', value: completedMissions.length, icon: '✅' },
                { label: 'Streak', value: `${streakDays}🔥`, icon: '⚡' },
                { label: 'Badge', value: BADGES.filter(b => completedMissions.length >= b.req).length, icon: '🎖️' },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-2xl p-4 text-center shadow-sm border border-slate-100">
                  <p className="text-2xl mb-1">{s.icon}</p>
                  <p className="font-display text-xl text-slate-800">{s.value}</p>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Badges grid */}
            <div>
              <h3 className="font-display text-lg text-slate-700 mb-4 px-1">Koleksi Badge</h3>
              <div className="grid grid-cols-2 gap-4">
                {BADGES.map((badge) => {
                  const earned = completedMissions.length >= badge.req;
                  return (
                    <div key={badge.name}
                      className={`bg-white rounded-2xl p-5 border-2 flex items-center gap-4 transition-all ${
                        earned ? 'border-emerald-200 shadow-md shadow-emerald-500/10' : 'border-slate-100 opacity-40 grayscale'
                      }`}>
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 ${
                        earned ? `bg-gradient-to-br ${badge.color}` : 'bg-slate-100'
                      } ${earned ? 'shadow-lg' : ''}`}>
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
            </div>

            {/* Reset button */}
            <button
              onClick={() => {
                if (window.confirm('Reset semua data? Ini tak boleh diundo!')) {
                  setCompletedMissions([]);
                  setTotalXP(0);
                  setStreakDays(0);
                }
              }}
              className="w-full flex items-center justify-center gap-2 text-slate-300 text-xs font-black py-4 border-2 border-dashed border-slate-100 rounded-2xl hover:border-red-200 hover:text-red-400 transition-all"
            >
              <RotateCcw size={14} /> Reset Progress
            </button>
          </div>
        )}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50">
        <div className="max-w-md mx-auto">
          <div className="glass border-t border-white/50 shadow-2xl mx-4 mb-4 rounded-[1.75rem] px-4 py-3 flex justify-around">
            <NavBtn icon={<Clock />} label="Waktu" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
            <NavBtn icon={<Zap />} label="Misi" active={activeTab === 'missions'} onClick={() => setActiveTab('missions')} badge={pendingMissions > 0 ? Math.min(pendingMissions, 9) : 0} />
            <NavBtn icon={<Trophy />} label="Badge" active={activeTab === 'badges'} onClick={() => setActiveTab('badges')} />
          </div>
        </div>
      </nav>
    </div>
  );
}
