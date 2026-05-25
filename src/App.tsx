/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, ReactNode } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  Music, 
  Type, 
  Sparkles, 
  Copy, 
  Check, 
  Loader2, 
  Mic2, 
  Guitar, 
  Smile, 
  Clock
} from 'lucide-react';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const GENRES = [
  "Dangdut", "Pop Indonesia", "Indie Indo", "Reggae", "Rock", "Lo-fi Hip Hop", 
  "Orkestra", "Dubstep", "Latin", "Arabic Music", "Pop Rap", "Sufi Music", 
  "Traditional Folk", "House", "Rap"
];

const MOODS = [
  "Epik", "Melankolis", "Membangkitkan Semangat", "Agresif", "Bermimpi", "Gelap", 
  "Enerjik", "Sinematik", "Romantis", "Santai", "Menyeramkan", "Nostalgia", 
  "Penuh Harapan", "Marah", "Tenang", "Misterius", "Ethereal", "Trippy", 
  "Sedih", "Aneh", "Lounge", "Megah", "Intens", "Peaceful", "Seksi", 
  "Heroik", "Gotik", "Ceria", "Cemas", "Psikedelik", "Minimalis", 
  "Sensual", "Canggih", "emosi",
  "Antisipasi", "Breakdown", "Catchy", "Crisp", "Danceable", "Depresif", 
  "Putus Asa", "Ear Candy", "Emosional", "Tempo Cepat", "Ketakutan", 
  "Futuristik", "Tegangan Tinggi", "Kegembiraan", "Melodis", "Misteri", 
  "Suasana Malam", "Progresif", "Rileks", "Kesedihan", "Menggoda", "Tajam", 
  "Lambat", "Sedih Lambat", "Soulful", "Suasana Hidup & Soulful", 
  "Bersemangat", "Kejutan", "Sinkopasi", "Lembut", "Trance", "Kemenangan", 
  "Trip-hop"
];

const INSTRUMENTS_AKUSTIK = [
  "Gitar Akustik Petik", "Gitar Akustik Persekusi", "Gitar Akustik Lead", 
  "Gitar Akustik Strumming", "Gitar Nilon", "Ukulele", "Banjo", "Mandolin",
  "Grand Piano", "Upright Piano", "Biola", "Cello", "Solo Cello", "Double Bass", 
  "Harpa", "Seruling", "Harmonika", "Akordeon", "Perkusi Akustik", 
  "Kendang", "Suling", "Angklung", "Cajon", "English Horn", "Piccolo", "Glockenspiel"
];

const INSTRUMENTS = [
  "Gitar Akustik", "Gitar Elektrik", "Gitar Distorsi", "Gitar Muted", 
  "Gitar Slide", "Gitar 12-Senar", "Gitar Nilon", "Biola", "Viola", 
  "Cello", "Double Bass", "Harpa", "Banjo", "Ukulele", "Mandolin", 
  "Sitar", "Grand Piano", "Upright Piano", "Piano Elektrik", "Rhodes", 
  "Organ Hammond", "Organ Pipa", "Akordeon", "Celesta", "Synthesizer", 
  "Synth Analog", "Moog Bass", "Wobble Bass", "FM Synth", "Pad", 
  "Arpeggio Synth", "Terompet", "Saksofon", "Trombon", "Tuba", 
  "French Horn", "Seruling", "Klarinet", "Oboe", "Bassoon", 
  "Harmonika", "Bagpipes", "Drum", "808 Bass", "TR-909", "Drum Machine", 
  "Perkusi Akustik", "Perkusi Sinematik", "Timpani", "Xilofon", 
  "Marimba", "Congas", "Bongos", "Tamborin", "Shaker", "Cowbell", 
  "Gamelan", "Kendang", "Kendang Dangdut Rock", "Kendang Melayu", "Kendang Pop", "Koplo", "Suling", "Angklung", "Koto", "Shamisen", 
  "Erhu", "Tabla", "Djembe", "Didgeridoo"
];

const INTROS_AKUSTIK = [
  "Melodi Main Theme", "Melodi Vocal Verse", "Melodi Vocal Chorus",
  "Petikan Gitar Akustik Lembut", "Strumming Gitar Akustik", "Intro Piano Solo", 
  "Intro Biola Melankolis", "Intro Suling Bambu", "Intro Ukulele Ceria",
  "Intro Cajon & Gitar", "Intro Harmonika Blues", "Intro Akordeon",
  "Intro Perkusi Tangan", "Intro Harpa Ethereal", "Intro Cello Dalam",
  "Intro Fingerstyle Guitar", "Intro Arpeggio Nilon"
];

const INTROS = [
  "Melodi Main Theme", "Melodi Vocal Verse", "Melodi Vocal Chorus",
  "Biola", "Grand Piano", "Saksofon", "Gitar Distorsi", "Gitar Elektrik", 
  "Perkusi Akustik", "Solo Gitar Sustain", "Solo Gitar Bending", 
  "Solo Gitar Vibrato", "Solo Nada Tinggi / Gitar Menjerit", "Solo Gitar Lead",
  "Cinematic Strings", "Atmospheric Pad", "Acoustic Guitar Strumming", 
  "Bass Slap", "Synth Arpeggio", "Heavy Drum Fill", "Ambient Rain/Nature", 
  "Lo-fi Vinyl Crackle", "Orchestral Hit", "Piano Ballad Intro", 
  "Heavy Metal Riff Intro", "Funk Bass Intro", "Jazz Sax Solo Intro", 
  "Electronic Arpeggio Intro", "Tribal Percussion Intro",
  "Drum", "Drum Machine", "Drum Trap", "Drum Dubstep", "Gitar Distorsi megah", "Drum Megah"
];

const VOCALS_AKUSTIK = [
  "Vokal Akustik Lembut", "Vokal Intim", "Vokal Raw", "Vokal Tanpa Efek", 
  "Vokal Folk", "Vokal Jazz Santai", "Vokal Akustik Pria", "Vokal Akustik Wanita",
  "Vokal Serak Alami", "Vokal Berbisik Lembut", "Vokal Soulful Akustik",
  "Vokal Harmonisasi Akustik", "Vokal Falsetto Tipis", "Vokal Jernih",
  "Vokal Deep Acoustic", "Vokal Indie Folk", "Vokal Country", "Vokal Blues Akustik"
];

const VOCALS = [
  "Male", "Female", "Serak", "Berbisik", "Berteriak", "Bass Dalam", "Rap", "Growl", 
  "Bernapas", "Suara Anak-anak", "Kata-kata Lisan", "Vokal Dangdut", 
  "Vokal Slowrock Malaysia", "Chanting", "Pernapasan Sirkular", 
  "Suara Jernih dan Merdu", "Vokal dengan Kedalaman Emosi", 
  "Suara Emosional Wanita", "Suara Lembut", "Suara Redam", "Rap Cepat", 
  "Nyanyian Tenggorokan", "Vokal Sangat Robotik", "Vocal Fry", "Whistle Register"
];

const TEMPOS = [
  "40-60 BPM (Very Slow)",
  "60-80 BPM (Slow)",
  "80-100 BPM (Moderate)",
  "100-120 BPM (Fast)",
  "120-140 BPM (Very Fast)",
  "140+ BPM (Extreme)"
];

const CREATORS = [
  "Melly Goeslaw", "Deddy Dores", "Ahmad Dhani", "Yovie Widianto", 
  "Rhoma Irama (Dangdut)", "Denny Caknan (Dangdut/Jawa)", "Hendro Saky (Dangdut)",
  "Iwa K (Rap/Hip Hop)", "Saykoji (Rap)", "Justy Aldrin (Indo Timur)", 
  "Vicky Salamor (Indo Timur)", "Toton Caribo (Indo Timur)", "Mace Purba (Indo Timur)",
  "Diskoria (Disco/Retro)", "Dipha Barus (EDM/Disco)", "Ian Antono (Rock)",
  "Eross Candra (Sheila on 7)", "Piyu Padi", "Dewiq", "Bebi Romeo", 
  "Rinto Harahap (Classic Pop)", "Guruh Soekarnoputra", "Titiek Puspa"
];

const MALAYSIA_CREATORS = [
  "Saari Amri", "Fauzi Marzuki", "M. Nasir", "Saari Amri (fokus lain)", 
  "Eddie Hamid", "Ajai", "LY", "Baiduri", "Shah Slam", "Adnan Abu Hassan"
];

const KEYS = [
  "C Major", "C# / Db Major", "D Major", "D# / Eb Major", "E Major", "F Major", 
  "F# / Gb Major", "G Major", "G# / Ab Major", "A Major", "A# / Bb Major", "B Major",
  "C Minor", "C# Minor", "D Minor", "D# Minor", "E Minor", "F Minor", 
  "F# Minor", "G Minor", "G# Minor", "A Minor", "A# Minor", "B Minor"
];

const MODELS = [
  "gemini-3-flash-preview",
  "gemini-3.1-flash-lite-preview"
];

const DURATIONS = ["4", "5", "6", "7", "8"];

export default function App() {
  const [about, setAbout] = useState('');
  const [isPop, setIsPop] = useState(false);
  const [isPuitis, setIsPuitis] = useState(false);
  const [isDangdut, setIsDangdut] = useState(false);
  const [isRap, setIsRap] = useState(false);
  const [isDisco, setIsDisco] = useState(false);
  const [isIndoTimur, setIsIndoTimur] = useState(false);
  const [isAkustikPop, setIsAkustikPop] = useState(false);
  const [isAkustikRock, setIsAkustikRock] = useState(false);
  const [isAkustikBallad, setIsAkustikBallad] = useState(false);
  const [genres, setGenres] = useState<string[]>([]);
  const [introsAkustik, setIntrosAkustik] = useState<string[]>([]);
  const [intros, setIntros] = useState<string[]>([]);
  const [moods, setMoods] = useState<string[]>([]);
  const [instrumentsAkustik, setInstrumentsAkustik] = useState<string[]>([]);
  const [instruments, setInstruments] = useState<string[]>([]);
  const [vocalsAkustik, setVocalsAkustik] = useState<string[]>([]);
  const [vocals, setVocals] = useState<string[]>([]);
  const [tempo, setTempo] = useState('');
  const [creator, setCreator] = useState('');
  const [malaysiaCreator, setMalaysiaCreator] = useState('');
  const [key, setKey] = useState('');
  const [duration, setDuration] = useState('4');
  const [lyricMode, setLyricMode] = useState('auto'); // 'auto' or 'manual'
  const [selectedModel, setSelectedModel] = useState('gemini-3-flash-preview');
  
  // Thematic Intro Modal State
  const [showThematicModal, setShowThematicModal] = useState(false);
  const [activeThematicIntro, setActiveThematicIntro] = useState('');
  const [thematicInstruments, setThematicInstruments] = useState<Record<string, string[]>>({});

  const [loading, setLoading] = useState(false);
  const [generatedTitle, setGeneratedTitle] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [musicStyle, setMusicStyle] = useState('');
  const [isModified, setIsModified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedLyrics, setCopiedLyrics] = useState(false);
  const [copiedStyle, setCopiedStyle] = useState(false);

  const generateContent = async () => {
    if (!about) return;
    setLoading(true);
    setIsModified(false);
    setError(null);
    
    try {
      // Try Vite env first, then fallback to process.env (for AI Studio preview)
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : null);
      
      if (!apiKey || apiKey === 'undefined') {
        throw new Error("API_KEY_INVALID");
      }
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `
        ATURAN GLOBAL PALING UTAMA:
        DILARANG KERAS menyebutkan nama artis, penyanyi, band, atau pencipta lagu di SEMUA field output (title, lyrics, style). Fokuslah pada deskripsi teknis, emosi, dan diksi puitis. Jangan pernah menulis "style of [Artist]" atau "type beat [Artist]".

        Buat lirik lagu dan deskripsi gaya musik (music style prompt) untuk AI Music Generator (Suno/Udio).
        
        Detail Lagu:
        Mode Lirik: ${lyricMode === 'auto' ? 'Tulis Baru Otomatis' : 'Gunakan Lirik Saya Sendiri'}
        ${lyricMode === 'auto' ? `Tentang/Tema: ${about}` : `LIRIK YANG HARUS DIGUNAKAN: \n${about}`}
        Opsi Tambahan: ${[
          isPop && 'Pop Style',
          isPuitis && 'Puitis (Slow Rock Malaysia style)',
          isDangdut && 'Dangdut Style',
          isRap && 'Rap Style',
          isDisco && 'Disco Style',
          isIndoTimur && 'Indonesia Timur Style',
          isAkustikPop && 'Akustik Pop Style',
          isAkustikRock && 'Akustik Rock Style',
          isAkustikBallad && 'Akustik Ballad Style'
        ].filter(Boolean).join(', ')}
        Intro Akustik: ${introsAkustik.join(', ')}
        Intro Lainnya: ${intros.join(', ')}
        Genre: ${genres.join(', ')}
        Mood: ${moods.join(', ')}
        Alat Musik Akustik: ${instrumentsAkustik.join(', ')}
        Alat Musik Lainnya: ${instruments.join(', ')}
        
        INSTRUKSI KHUSUS INTRO TEMATIK:
        ${Object.keys(thematicInstruments).map((intro) => {
          const insts = thematicInstruments[intro];
          return insts && insts.length > 0 ? `- Untuk "${intro}", gunakan instrumen: ${insts.join(', ')}` : '';
        }).filter(Boolean).join('\n')}

        Vokal Akustik: ${vocalsAkustik.join(', ')}
        Vokal Lainnya: ${vocals.join(', ')}
        Tempo: ${tempo}
        Khas Pencipta Indonesia: ${creator}
        Khas Pencipta Malaysia: ${malaysiaCreator}
        Kunci Dasar: ${key}
        Durasi: ${duration} menit

        INSTRUKSI KHUSUS LIRIK & MUSIK:
        ${lyricMode === 'manual' ? `PENTING: JANGAN membuat lirik baru secara total. Gunakan lirik yang telah disediakan di atas sebagai basis, namun lakukan optimasi berikut:
        a. Gunakan Distorsi Ejaan (Trik Terbaik): Ubah pengejaan kata-kata tertentu (terutama yang mungkin sensitif bagi sistem filter AI) dengan tanda hubung atau fonetik unik. Misal ubah "Kemesraan ini" menjadi "Kemes-ra-an iy-niy", atau "Mimpi" menjadi "Miym-piy". Pastikan pelafalan tetap mulus saat dinyanyikan.
        b. Ganti 1-2 Sinonim Kata: Ubah satu atau dua kata populer dengan padanannya yang lebih puitis. Contoh: ubah "bintang di surga" menjadi "lentera cakrawala" atau "permata angkasa".
        c. Format lirik ke dalam bagian-bagian lagu (Verse, Chorus, dll) dan tambahkan perintah musik di setiap bagian.` : 'Buat lirik lagu baru yang puitis dan orisinal berdasarkan tema yang diberikan.'}
        1. Di setiap bagian lirik (Verse, Chorus, Bridge, dll), tambahkan perintah musik dalam kurung di awal baris bagian tersebut.
        2. Perintah musik harus mencakup instruksi tempo yang dinamis namun TETAP berada dalam rentang yang dipilih user: ${tempo}.
           - Contoh: Jika user memilih "40-60 BPM", maka AI boleh menulis (Verse, Slow tempo 45 BPM, emotional piano) atau (Chorus, Faster 58 BPM, powerful strings).
           - AI BEBAS menentukan angka BPM spesifik selama masih dalam range ${tempo}.
        3. Tambahkan juga instruksi emosi atau instrumen pendukung dalam kurung tersebut.
        ${(isAkustikPop || isAkustikRock || isAkustikBallad) ? '4. KHUSUS GAYA AKUSTIK: Wajib selipkan progresi chord (misal: [C - G - Am - F]) di dalam kurung perintah musik tersebut.' : ''}

        INSTRUKSI KHUSUS JUDUL:
        Buatlah judul lagu yang:
        1. Tidak asing di telinga publik namun tetap segar.
        2. Membuat penasaran dan menarik perhatian.
        3. Puitis dan memiliki makna mendalam.
        4. Maksimal 5-7 kata.
        5. DILARANG menyebutkan nama artis atau tokoh nyata.

        INSTRUKSI KHUSUS GAYA:
        ${isIndoTimur ? '1. Untuk gaya Indonesia Timur, gunakan perpaduan Bahasa Indonesia dan dialek/bahasa wilayah Indonesia Timur (seperti Ambon/Papua/NTT) yang puitis namun santai, mirip gaya lagu "Pergi dan Jangan Kembali". Gunakan kata-kata seperti "sa", "ko", "tra", "su", dll secara natural.' : ''}
        ${isPuitis ? '2. Untuk gaya Puitis, gunakan diksi yang mendalam dan melankolis khas Slow Rock Malaysia era 90-an.' : ''}
        ${creator ? `3. Gunakan gaya penulisan lirik yang sangat spesifik mengikuti karakteristik puitis, diksi, dan metafora khas pencipta Indonesia ${creator}. Pastikan rima dan pemilihan kata mencerminkan identitas unik pencipta tersebut.` : ''}
        ${malaysiaCreator ? `4. Gunakan gaya penulisan lirik yang sangat spesifik mengikuti karakteristik puitis, penuh perasaan, diksi mendalam, dan metafora khas pencipta Malaysia ${malaysiaCreator} (Slow Rock/Pop Rock Malaysia style). Fokus pada tema cinta, rindu, dan pengorbanan. Pastikan rima dan pemilihan kata mencerminkan identitas unik pencipta tersebut.` : ''}
        ${(isAkustikPop || isAkustikRock || isAkustikBallad) ? `5. UNTUK GAYA AKUSTIK: Hasil Music Style Prompt (field "style") WAJIB HANYA menggunakan: "gitar akustik petik, gitar akustik persekusi, gitar akustik lead". JANGAN mencampur instrumen lain (seperti drum elektrik, synth, atau bass elektrik) KECUALI jika user secara eksplisit memilih alat musik lain di daftar berikut: ${[...instruments, ...instrumentsAkustik].join(', ')}.` : ''}

        ATURAN KETAT STYLE PROMPT (FIELD "style"):
        1. JANGAN PERNAH menyebutkan nama artis, penyanyi, atau pencipta lagu secara spesifik (misal: dilarang menulis "Rhoma Irama style" atau "Melly Goeslaw type beat").
        2. Terjemahkan nama pencipta yang dipilih (${creator} ${malaysiaCreator}) menjadi deskripsi teknis musik. Contoh:
           - Rhoma Irama -> "Classic Indonesian dangdut, deep baritone male vocal, moralistic lyrics, accordion, brass section, 90s production".
           - Melly Goeslaw -> "Eclectic Indonesian pop, ethereal female vocal, poetic metaphors, cinematic arrangement, dramatic strings".
           - Deddy Dores -> "90s Indonesian slow rock, melancholic male vocal, distorted guitar solo, power ballad, emotional lyrics".
           - Justy Aldrin -> "Modern eastern Indonesian pop, acoustic guitar, island vibes, smooth male vocal, relaxed tempo".
           - Pencipta Malaysia (Saari Amri/M. Nasir/etc) -> "90s Malaysian slow rock, high-pitched emotional male vocal, long screaming lead guitar solo, poetic lyrics, 60-90 BPM, melancholic atmosphere".
        3. Gunakan tag-tag musik yang umum diterima oleh Suno/Udio.

        INSTRUKSI KHUSUS HAK CIPTA:
        1. Identifikasi apakah lirik yang dihasilkan memiliki kemiripan tinggi dengan lagu yang sudah ada (potensi hak cipta).
        2. JIKA teridentifikasi potensi hak cipta, modifikasi otomatis SATU KATA kunci dalam lirik tersebut dengan sinonim yang memiliki arti dan nada/ritme yang sama agar lebih orisinal.
        3. JIKA TIDAK teridentifikasi, biarkan lirik tetap orisinal tanpa perubahan.

        Format Output (JSON):
        {
          "title": "Judul lagu yang puitis dan menarik...",
          "lyrics": "Lirik lagu lengkap...",
          "style": "Deskripsi gaya musik...",
          "copyrightModified": boolean (true jika ada kata yang diubah karena alasan hak cipta, false jika tidak)
        }
      `;

      const response = await ai.models.generateContent({
        model: selectedModel,
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const result = JSON.parse(response.text || '{}');
      setGeneratedTitle(result.title || '');
      setLyrics(result.lyrics || '');
      setMusicStyle(result.style || '');
      setIsModified(!!result.copyrightModified);
    } catch (err: any) {
      console.error("Error generating content:", err);
      let message = "Terjadi kesalahan saat menghubungi AI. Silakan coba lagi.";
      
      if (err.message?.includes("429") || err.message?.includes("quota")) {
        message = "Batas penggunaan (quota) tercapai. Silakan tunggu sebentar sebelum mencoba lagi.";
      } else if (err.message?.includes("API_KEY_INVALID") || err.message?.includes("403")) {
        message = "Kunci API tidak valid. Pastikan Anda telah memasukkan API_KEY yang benar di pengaturan.";
      } else if (err.message?.includes("safety")) {
        message = "Konten diblokir oleh filter keamanan AI. Coba ubah topik atau kata-kata Anda.";
      }
      
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, setter: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  return (
    <div className="min-h-screen bg-bg text-ink font-sans selection:bg-accent/20 overflow-x-hidden">
      <div className="atmosphere" />
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-bg/80 backdrop-blur-md border-b border-black/5">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-2 text-center"
          >
            <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center text-white shadow-[0_0_30px_rgba(59,130,246,0.2)] mb-1">
              <Music size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-serif italic tracking-tight text-ink leading-none uppercase">APLIKASI PENCIPTA LAGU</h1>
              <p className="text-[10px] text-black font-bold uppercase tracking-[0.2em] mt-1">Developer By Ali Maksum</p>
            </div>
          </motion.div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Inputs */}
        <div className="lg:col-span-5 space-y-8">
          <section className="glass-card rounded-[32px] p-8 space-y-8">
            <div className="space-y-6 pb-6 border-b border-black/5">
              <SelectField 
                label="AI Model" 
                icon={<Sparkles size={12} className="text-accent" />} 
                value={selectedModel} 
                onChange={setSelectedModel} 
                options={MODELS} 
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40 flex items-center gap-2">
                <Clock size={12} className="text-accent" /> Durasi (Menit)
              </label>
              <div className="flex gap-2">
                {DURATIONS.map(d => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    className={cn(
                      "flex-1 py-4 rounded-2xl text-sm font-bold transition-all border",
                      duration === d 
                        ? "bg-accent text-white border-accent shadow-lg shadow-accent/20" 
                        : "bg-black/[0.02] border-black/5 text-ink/40 hover:text-ink hover:bg-black/5"
                    )}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4">
                <button
                  onClick={() => setLyricMode('auto')}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all border",
                    lyricMode === 'auto'
                      ? "bg-accent text-white border-accent shadow-lg shadow-accent/20"
                      : "bg-black/[0.02] border-black/5 text-ink/40 hover:text-ink hover:bg-black/5"
                  )}
                >
                  <div className={cn(
                    "w-3 h-3 rounded-full border-2 flex items-center justify-center",
                    lyricMode === 'auto' ? "border-white" : "border-ink/20"
                  )}>
                    {lyricMode === 'auto' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                  Tulis Lirik Baru Otomatis
                </button>
                <button
                  onClick={() => setLyricMode('manual')}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all border",
                    lyricMode === 'manual'
                      ? "bg-accent text-white border-accent shadow-lg shadow-accent/20"
                      : "bg-black/[0.02] border-black/5 text-ink/40 hover:text-ink hover:bg-black/5"
                  )}
                >
                  <div className={cn(
                    "w-3 h-3 rounded-full border-2 flex items-center justify-center",
                    lyricMode === 'manual' ? "border-white" : "border-ink/20"
                  )}>
                    {lyricMode === 'manual' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                  Saya Punya Lirik Sendiri
                </button>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40 flex items-center gap-2">
                  <Sparkles size={12} className="text-accent" /> {lyricMode === 'auto' ? 'What is it about?' : 'Tempel Lirik Anda'}
                </label>
                <textarea 
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  placeholder={lyricMode === 'auto' ? "Describe the story, theme, or emotions..." : "Tulis atau tempel lirik Anda di sini..."}
                  rows={5}
                  className="w-full glass-input rounded-2xl px-6 py-4 text-lg placeholder:text-ink/20 text-ink resize-none"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-6 pt-2">
              <label className="flex items-center gap-4 cursor-pointer group">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    checked={isPop}
                    onChange={(e) => setIsPop(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="w-7 h-7 border-2 border-black/10 rounded-xl peer-checked:bg-accent peer-checked:border-accent transition-all duration-300" />
                  <Check className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white scale-0 peer-checked:scale-100 transition-transform duration-300" size={16} />
                </div>
                <span className="text-sm font-semibold text-ink/60 group-hover:text-ink transition-colors">Pop Style</span>
              </label>

              <label className="flex items-center gap-4 cursor-pointer group">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    checked={isPuitis}
                    onChange={(e) => setIsPuitis(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="w-7 h-7 border-2 border-black/10 rounded-xl peer-checked:bg-accent peer-checked:border-accent transition-all duration-300" />
                  <Check className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white scale-0 peer-checked:scale-100 transition-transform duration-300" size={16} />
                </div>
                <span className="text-sm font-semibold text-ink/60 group-hover:text-ink transition-colors">Puitis (Slow Rock)</span>
              </label>

              <label className="flex items-center gap-4 cursor-pointer group">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    checked={isDangdut}
                    onChange={(e) => setIsDangdut(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="w-7 h-7 border-2 border-black/10 rounded-xl peer-checked:bg-accent peer-checked:border-accent transition-all duration-300" />
                  <Check className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white scale-0 peer-checked:scale-100 transition-transform duration-300" size={16} />
                </div>
                <span className="text-sm font-semibold text-ink/60 group-hover:text-ink transition-colors">Dangdut</span>
              </label>

              <label className="flex items-center gap-4 cursor-pointer group">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    checked={isRap}
                    onChange={(e) => setIsRap(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="w-7 h-7 border-2 border-black/10 rounded-xl peer-checked:bg-accent peer-checked:border-accent transition-all duration-300" />
                  <Check className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white scale-0 peer-checked:scale-100 transition-transform duration-300" size={16} />
                </div>
                <span className="text-sm font-semibold text-ink/60 group-hover:text-ink transition-colors">Rap</span>
              </label>

              <label className="flex items-center gap-4 cursor-pointer group">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    checked={isDisco}
                    onChange={(e) => setIsDisco(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="w-7 h-7 border-2 border-black/10 rounded-xl peer-checked:bg-accent peer-checked:border-accent transition-all duration-300" />
                  <Check className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white scale-0 peer-checked:scale-100 transition-transform duration-300" size={16} />
                </div>
                <span className="text-sm font-semibold text-ink/60 group-hover:text-ink transition-colors">Disco</span>
              </label>

              <label className="flex items-center gap-4 cursor-pointer group">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    checked={isIndoTimur}
                    onChange={(e) => setIsIndoTimur(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="w-7 h-7 border-2 border-black/10 rounded-xl peer-checked:bg-accent peer-checked:border-accent transition-all duration-300" />
                  <Check className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white scale-0 peer-checked:scale-100 transition-transform duration-300" size={16} />
                </div>
                <span className="text-sm font-semibold text-ink/60 group-hover:text-ink transition-colors">Indonesia Timur</span>
              </label>

              <label className="flex items-center gap-4 cursor-pointer group">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    checked={isAkustikPop}
                    onChange={(e) => setIsAkustikPop(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="w-7 h-7 border-2 border-black/10 rounded-xl peer-checked:bg-accent peer-checked:border-accent transition-all duration-300" />
                  <Check className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white scale-0 peer-checked:scale-100 transition-transform duration-300" size={16} />
                </div>
                <span className="text-sm font-semibold text-ink/60 group-hover:text-ink transition-colors">Akustik Pop</span>
              </label>

              <label className="flex items-center gap-4 cursor-pointer group">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    checked={isAkustikRock}
                    onChange={(e) => setIsAkustikRock(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="w-7 h-7 border-2 border-black/10 rounded-xl peer-checked:bg-accent peer-checked:border-accent transition-all duration-300" />
                  <Check className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white scale-0 peer-checked:scale-100 transition-transform duration-300" size={16} />
                </div>
                <span className="text-sm font-semibold text-ink/60 group-hover:text-ink transition-colors">Akustik Rock</span>
              </label>

              <label className="flex items-center gap-4 cursor-pointer group">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    checked={isAkustikBallad}
                    onChange={(e) => setIsAkustikBallad(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="w-7 h-7 border-2 border-black/10 rounded-xl peer-checked:bg-accent peer-checked:border-accent transition-all duration-300" />
                  <Check className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white scale-0 peer-checked:scale-100 transition-transform duration-300" size={16} />
                </div>
                <span className="text-sm font-semibold text-ink/60 group-hover:text-ink transition-colors">Akustik Ballad</span>
              </label>
            </div>

            <div className="pt-4 border-t border-black/5 space-y-6">
              <SelectField 
                label="Khas Pencipta Indonesia" 
                icon={<Sparkles size={12} className="text-accent" />} 
                value={creator} 
                onChange={(val) => {
                  setCreator(val);
                  if (val) setMalaysiaCreator('');
                }} 
                options={CREATORS} 
              />
              <SelectField 
                label="Khas Pencipta Malaysia" 
                icon={<Music size={12} className="text-accent" />} 
                value={malaysiaCreator} 
                onChange={(val) => {
                  setMalaysiaCreator(val);
                  if (val) setCreator('');
                }} 
                options={MALAYSIA_CREATORS} 
              />
              <SelectField 
                label="Kunci Dasar" 
                icon={<Music size={12} className="text-accent" />} 
                value={key} 
                onChange={setKey} 
                options={KEYS} 
              />
            </div>
          </section>

          <section className="glass-card rounded-[32px] p-8 space-y-10">
            <MultiSelectField 
              label="Genres" 
              icon={<Music size={12} className="text-accent" />} 
              selected={genres} 
              onToggle={(val) => setGenres(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val])} 
              options={GENRES} 
            />
            <MultiSelectField 
              label="Intro Akustik" 
              icon={<Music size={12} className="text-accent" />} 
              selected={introsAkustik} 
              onToggle={(val) => {
                const isThematic = ["Melodi Main Theme", "Melodi Vocal Verse", "Melodi Vocal Chorus"].includes(val);
                if (isThematic && !introsAkustik.includes(val)) {
                  setActiveThematicIntro(val);
                  setShowThematicModal(true);
                }
                setIntrosAkustik(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);
              }} 
              options={INTROS_AKUSTIK} 
            />
            <MultiSelectField 
              label="Intro" 
              icon={<Music size={12} className="text-accent" />} 
              selected={intros} 
              onToggle={(val) => {
                const isThematic = ["Melodi Main Theme", "Melodi Vocal Verse", "Melodi Vocal Chorus"].includes(val);
                if (isThematic && !intros.includes(val)) {
                  setActiveThematicIntro(val);
                  setShowThematicModal(true);
                }
                setIntros(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);
              }} 
              options={INTROS} 
            />
            <MultiSelectField 
              label="Moods" 
              icon={<Smile size={12} className="text-accent" />} 
              selected={moods} 
              onToggle={(val) => setMoods(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val])} 
              options={MOODS} 
            />
            <div className="space-y-10">
              <MultiSelectField 
                label="Instruments Akustik" 
                icon={<Guitar size={12} className="text-accent" />} 
                selected={instrumentsAkustik} 
                onToggle={(val) => setInstrumentsAkustik(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val])} 
                options={INSTRUMENTS_AKUSTIK} 
              />
              <MultiSelectField 
                label="Instruments" 
                icon={<Guitar size={12} className="text-accent" />} 
                selected={instruments} 
                onToggle={(val) => setInstruments(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val])} 
                options={INSTRUMENTS} 
              />
              <SelectField 
                label="Tempo / BPM" 
                icon={<Clock size={12} className="text-accent" />} 
                value={tempo} 
                onChange={setTempo} 
                options={TEMPOS} 
              />
            </div>
            <MultiSelectField 
              label="Vocals Akustik" 
              icon={<Mic2 size={12} className="text-accent" />} 
              selected={vocalsAkustik} 
              onToggle={(val) => setVocalsAkustik(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val])} 
              options={VOCALS_AKUSTIK} 
            />
            <MultiSelectField 
              label="Vocals" 
              icon={<Mic2 size={12} className="text-accent" />} 
              selected={vocals} 
              onToggle={(val) => setVocals(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val])} 
              options={VOCALS} 
            />
          </section>
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-7 space-y-6">
          {/* Error Message */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-500/10 border border-red-500/20 rounded-[24px] text-red-600 text-xs font-medium flex items-center gap-3"
            >
              <div className="w-6 h-6 bg-red-500 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-white font-bold">!</span>
              </div>
              {error}
            </motion.div>
          )}

          <motion.button 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={generateContent}
            disabled={loading || !about}
            className={cn(
              "w-full flex items-center justify-center gap-3 px-8 py-6 rounded-[32px] font-bold text-xl transition-all duration-500",
              loading || !about 
                ? "bg-black/5 text-ink/20 cursor-not-allowed border border-black/5" 
                : "button-gradient"
            )}
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : <Sparkles size={24} />}
            {loading ? 'Crafting Your Masterpiece...' : 'Generate Magic'}
          </motion.button>

          <div className="glass-card rounded-[40px] overflow-hidden flex flex-col h-full min-h-[700px] relative">
            {/* Decorative elements */}
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-accent/15 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-accent/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="border-b border-black/5 px-10 py-8 flex flex-col gap-1 bg-accent/5">
              {generatedTitle && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="mb-2"
                >
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent/60 block mb-1">Judul Lagu</span>
                  <h1 className="text-3xl font-serif italic text-accent leading-tight">
                    {generatedTitle}
                  </h1>
                </motion.div>
              )}
              <div className="flex items-center justify-between">
                <h2 className="font-serif italic text-2xl text-ink">Generated Masterpiece</h2>
                <div className="flex gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-black/10" />
                  <div className="w-2.5 h-2.5 rounded-full bg-black/10" />
                  <div className="w-2.5 h-2.5 rounded-full bg-accent/50" />
                </div>
              </div>
            </div>

            <div className="flex-1 p-10 space-y-12 overflow-y-auto custom-scrollbar">
              {/* Lyrics Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40">Lyrics</h3>
                    {isModified && (
                      <span className="bg-accent/10 text-accent text-[10px] font-bold px-3 py-1 rounded-full border border-accent/20 flex items-center gap-1.5">
                        <Check size={10} /> Originality Guard Active
                      </span>
                    )}
                  </div>
                  {lyrics && (
                    <button 
                      onClick={() => copyToClipboard(lyrics, setCopiedLyrics)}
                      className="text-accent hover:bg-accent/10 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all"
                    >
                      {copiedLyrics ? <Check size={14} /> : <Copy size={14} />}
                      {copiedLyrics ? 'Copied' : 'Copy Lyrics'}
                    </button>
                  )}
                </div>
                <div className={cn(
                  "min-h-[300px] rounded-3xl p-8 font-serif text-2xl leading-relaxed whitespace-pre-wrap transition-all duration-700",
                  lyrics 
                    ? "bg-white/60 text-ink/90 shadow-sm border border-white/80" 
                    : "bg-black/[0.01] border border-dashed border-black/5 flex items-center justify-center text-ink/10 italic text-xl"
                )}>
                  {lyrics || "The soul of your song will manifest here..."}
                </div>
              </div>

              {/* Music Style Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40">Music Style Prompt</h3>
                  {musicStyle && (
                    <button 
                      onClick={() => copyToClipboard(musicStyle, setCopiedStyle)}
                      className="text-accent hover:bg-accent/10 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all"
                    >
                      {copiedStyle ? <Check size={14} /> : <Copy size={14} />}
                      {copiedStyle ? 'Copied' : 'Copy Style'}
                    </button>
                  )}
                </div>
                <div className={cn(
                  "rounded-2xl p-8 font-mono text-sm transition-all duration-700",
                  musicStyle 
                    ? "bg-white/60 text-accent border border-white/80 shadow-sm" 
                    : "bg-black/[0.01] border border-dashed border-black/5 flex items-center justify-center text-ink/10 italic"
                )}>
                  {musicStyle || "The sonic blueprint will appear here..."}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-6 py-16 border-t border-black/5 text-center">
        <p className="text-sm text-ink/20 font-medium tracking-widest uppercase">
          Aplikasi Pembuat Lirik <span className="text-ink/60">By Ali Maksum Gejes</span>
        </p>
      </footer>

      {/* Thematic Intro Modal */}
      {showThematicModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="glass-card w-full max-w-lg rounded-[40px] p-10 shadow-2xl border border-white/20 relative overflow-hidden"
          >
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-accent/20 blur-[80px] rounded-full pointer-events-none" />
            
            <div className="relative space-y-8">
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-accent">
                  <Sparkles size={20} />
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Thematic Configuration</span>
                </div>
                <h3 className="text-2xl font-serif italic text-ink">
                  Pilih Alat Musik untuk <span className="text-accent">{activeThematicIntro}</span>
                </h3>
                <p className="text-sm text-ink/40 leading-relaxed">
                  Pilih instrumen yang akan memainkan melodi utama pada bagian intro ini.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {[
                  "Solo Cello", "English Horn", "Piccolo", "Glockenspiel", "Gitar Akustik Lead", 
                  "Biola Solo", "Seruling Solo", "Piano Solo", "Biola", "Grand Piano", 
                  "Saksofon", "Gitar Distorsi", "Gitar Elektrik", "Perkusi Akustik", 
                  "Solo Gitar Sustain", "Solo Gitar Bending", "Solo Gitar Vibrato"
                ].map(inst => {
                  const isSelected = (thematicInstruments[activeThematicIntro] || []).includes(inst);
                  return (
                    <button
                      key={inst}
                      onClick={() => {
                        setThematicInstruments(prev => {
                          const current = prev[activeThematicIntro] || [];
                          const next = current.includes(inst) 
                            ? current.filter(i => i !== inst) 
                            : [...current, inst];
                          return { ...prev, [activeThematicIntro]: next };
                        });
                      }}
                      className={cn(
                        "px-6 py-3 rounded-2xl text-xs font-bold transition-all border",
                        isSelected 
                          ? "bg-accent text-white border-accent shadow-lg shadow-accent/20" 
                          : "bg-black/[0.02] border-black/5 text-ink/40 hover:text-ink hover:bg-black/5"
                      )}
                    >
                      {inst}
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 flex gap-4">
                <button 
                  onClick={() => setShowThematicModal(false)}
                  className="flex-1 py-4 bg-accent text-white rounded-2xl font-bold text-sm shadow-lg shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Simpan Konfigurasi
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function SelectField({ label, icon, value, onChange, options }: { 
  label: string, 
  icon: ReactNode, 
  value: string, 
  onChange: (v: string) => void, 
  options: string[] 
}) {
  return (
    <div className="space-y-3">
      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40 flex items-center gap-2">
        {icon} {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => {
          const isSelected = value === opt;
          return (
            <button
              key={opt}
              onClick={() => onChange(isSelected ? '' : opt)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold transition-all border",
                isSelected 
                  ? "bg-accent text-white border-accent shadow-lg shadow-accent/20" 
                  : "bg-black/[0.02] border-black/5 text-ink/40 hover:text-ink hover:bg-black/5"
              )}
            >
              {opt}
              {isSelected && <Check size={12} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MultiSelectField({ label, icon, selected, onToggle, options }: { 
  label: string, 
  icon: ReactNode, 
  selected: string[], 
  onToggle: (v: string) => void, 
  options: string[] 
}) {
  return (
    <div className="space-y-3">
      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40 flex items-center gap-2">
        {icon} {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => {
          const isSelected = selected.includes(opt);
          return (
            <button
              key={opt}
              onClick={() => onToggle(opt)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold transition-all border",
                isSelected 
                  ? "bg-accent text-white border-accent shadow-lg shadow-accent/20" 
                  : "bg-black/[0.02] border-black/5 text-ink/40 hover:text-ink hover:bg-black/5"
              )}
            >
              {opt}
              {isSelected && <Check size={12} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
