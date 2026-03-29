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
  "Pop", "Rock", "Slow Rock", "Metal", "Jazz", "Blues", "Country", "Hip Hop", 
  "R&B", "Electronic", "EDM", "Classical", "Folk", "Reggae", "Dangdut", 
  "K-Pop", "Synthwave", "Lo-fi", "Acoustic", "Orchestral", "Indie", "Punk",
  "Soul", "Funk", "Disco", "Techno", "House", "Trance", "Dubstep", "Drum & Bass",
  "Latin", "Bossa Nova", "Afrobeat", "J-Pop", "City Pop", "Koplo", "Trap",
  "Grunge", "Ska", "Hardcore", "Emo", "Ambient", "Gospel", "Death Metal", "Thrash Metal"
];

const MOODS = [
  "Happy", "Sad", "Melancholic", "Energetic", "Relaxed", "Angry", "Romantic", 
  "Epic", "Dark", "Dreamy", "Nostalgic", "Aggressive", "Peaceful", "Mysterious",
  "Uplifting", "Cinematic", "Fierce", "Tense", "Chaotic", "Joyful", "Playful",
  "Hopeful", "Serene", "Confident", "Lonely", "Desperate", "Gloomy", "Haunting",
  "Ethereal", "Quirky", "Groovy", "Chill", "Sophisticated", "Raw"
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

const INTROS = [
  "Biola", "Grand Piano", "Saksofon", "Gitar Distorsi", "Gitar Elektrik", 
  "Perkusi Akustik", "Solo Gitar Sustain", "Solo Gitar Bending", 
  "Solo Gitar Vibrato", "Solo Nada Tinggi / Gitar Menjerit", "Solo Gitar Lead",
  "Cinematic Strings", "Atmospheric Pad", "Acoustic Guitar Strumming", 
  "Bass Slap", "Synth Arpeggio", "Heavy Drum Fill", "Ambient Rain/Nature", 
  "Lo-fi Vinyl Crackle", "Orchestral Hit", "Piano Ballad Intro", 
  "Heavy Metal Riff Intro", "Funk Bass Intro", "Jazz Sax Solo Intro", 
  "Electronic Arpeggio Intro", "Tribal Percussion Intro"
];

const VOCALS = [
  "Pria", "Wanita", "Serak", "Opera", "Paduan Suara", "Berbisik", 
  "Soulful", "Duo", "Nada Tinggi", "Berteriak", "Bass Dalam", 
  "Auto-tune", "Vocaloid", "Rap", "Growl", "Bernapas", "Harmonisasi", 
  "Furry", "Suara Anak-anak", "Falsetto", "Vibrato", "Monoton", 
  "Kata-kata Lisan", "Scat Singing", "Yodeling", "Belting", 
  "Head Voice", "Chest Voice", "Vokal Sopran", "Vokal Seriosa", 
  "Vokal Orkestra", "Vokal Dangdut", "Vokal Slowrock Malaysia", "Chanting"
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

const KEYS = [
  "C Major", "C# / Db Major", "D Major", "D# / Eb Major", "E Major", "F Major", 
  "F# / Gb Major", "G Major", "G# / Ab Major", "A Major", "A# / Bb Major", "B Major",
  "C Minor", "C# Minor", "D Minor", "D# Minor", "E Minor", "F Minor", 
  "F# Minor", "G Minor", "G# Minor", "A Minor", "A# Minor", "B Minor"
];

const MODELS = [
  "gemini-2.5-flash-preview",
  "gemini-3-flash-preview"
];

export default function App() {
  const [title, setTitle] = useState('');
  const [about, setAbout] = useState('');
  const [isPop, setIsPop] = useState(false);
  const [isPuitis, setIsPuitis] = useState(false);
  const [isDangdut, setIsDangdut] = useState(false);
  const [isRap, setIsRap] = useState(false);
  const [isDisco, setIsDisco] = useState(false);
  const [isIndoTimur, setIsIndoTimur] = useState(false);
  const [genres, setGenres] = useState<string[]>([]);
  const [intros, setIntros] = useState<string[]>([]);
  const [moods, setMoods] = useState<string[]>([]);
  const [instruments, setInstruments] = useState<string[]>([]);
  const [vocals, setVocals] = useState<string[]>([]);
  const [tempo, setTempo] = useState('');
  const [creator, setCreator] = useState('');
  const [key, setKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('gemini-2.5-flash-preview');
  
  const [loading, setLoading] = useState(false);
  const [lyrics, setLyrics] = useState('');
  const [musicStyle, setMusicStyle] = useState('');
  const [isModified, setIsModified] = useState(false);
  const [copiedLyrics, setCopiedLyrics] = useState(false);
  const [copiedStyle, setCopiedStyle] = useState(false);

  const generateContent = async () => {
    if (!about) return;
    setLoading(true);
    setIsModified(false);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const prompt = `
        Buat lirik lagu dan deskripsi gaya musik (music style prompt) untuk AI Music Generator (Suno/Udio).
        
        Detail Lagu:
        Judul: ${title || 'Tanpa Judul'}
        Tentang: ${about}
        Opsi Tambahan: ${[
          isPop && 'Pop Style',
          isPuitis && 'Puitis (Slow Rock Malaysia style)',
          isDangdut && 'Dangdut Style',
          isRap && 'Rap Style',
          isDisco && 'Disco Style',
          isIndoTimur && 'Indonesia Timur Style'
        ].filter(Boolean).join(', ')}
        Intro: ${intros.join(', ')}
        Genre: ${genres.join(', ')}
        Mood: ${moods.join(', ')}
        Alat Musik: ${instruments.join(', ')}
        Vokal: ${vocals.join(', ')}
        Tempo: ${tempo}
        Khas Pencipta: ${creator}
        Kunci Dasar: ${key}

        INSTRUKSI KHUSUS GAYA:
        ${isIndoTimur ? '1. Untuk gaya Indonesia Timur, gunakan perpaduan Bahasa Indonesia dan dialek/bahasa wilayah Indonesia Timur (seperti Ambon/Papua/NTT) yang puitis namun santai, mirip gaya lagu "Pergi dan Jangan Kembali". Gunakan kata-kata seperti "sa", "ko", "tra", "su", dll secara natural.' : ''}
        ${isPuitis ? '2. Untuk gaya Puitis, gunakan diksi yang mendalam dan melankolis khas Slow Rock Malaysia era 90-an.' : ''}
        ${creator ? `3. Gunakan gaya penulisan lirik yang sangat spesifik mengikuti karakteristik puitis, diksi, dan metafora khas ${creator}. Pastikan rima dan pemilihan kata mencerminkan identitas unik pencipta tersebut.` : ''}

        ATURAN KETAT STYLE PROMPT (FIELD "style"):
        1. JANGAN PERNAH menyebutkan nama artis, penyanyi, atau pencipta lagu secara spesifik (misal: dilarang menulis "Rhoma Irama style" atau "Melly Goeslaw type beat").
        2. Terjemahkan nama pencipta yang dipilih (${creator}) menjadi deskripsi teknis musik. Contoh:
           - Rhoma Irama -> "Classic Indonesian dangdut, deep baritone male vocal, moralistic lyrics, accordion, brass section, 90s production".
           - Melly Goeslaw -> "Eclectic Indonesian pop, ethereal female vocal, poetic metaphors, cinematic arrangement, dramatic strings".
           - Deddy Dores -> "90s Indonesian slow rock, melancholic male vocal, distorted guitar solo, power ballad, emotional lyrics".
           - Justy Aldrin -> "Modern eastern Indonesian pop, acoustic guitar, island vibes, smooth male vocal, relaxed tempo".
        3. Gunakan tag-tag musik yang umum diterima oleh Suno/Udio.

        INSTRUKSI KHUSUS HAK CIPTA:
        1. Identifikasi apakah lirik yang dihasilkan memiliki kemiripan tinggi dengan lagu yang sudah ada (potensi hak cipta).
        2. JIKA teridentifikasi potensi hak cipta, modifikasi otomatis SATU KATA kunci dalam lirik tersebut dengan sinonim yang memiliki arti dan nada/ritme yang sama agar lebih orisinal.
        3. JIKA TIDAK teridentifikasi, biarkan lirik tetap orisinal tanpa perubahan.

        Format Output (JSON):
        {
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
      setLyrics(result.lyrics || '');
      setMusicStyle(result.style || '');
      setIsModified(!!result.copyrightModified);
    } catch (error) {
      console.error("Error generating content:", error);
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
                <Type size={12} className="text-accent" /> Song Title
              </label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter song title..."
                className="w-full glass-input rounded-2xl px-6 py-4 text-lg font-serif placeholder:text-ink/20 text-ink"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40 flex items-center gap-2">
                <Sparkles size={12} className="text-accent" /> What is it about?
              </label>
              <textarea 
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder="Describe the story, theme, or emotions..."
                rows={5}
                className="w-full glass-input rounded-2xl px-6 py-4 text-lg placeholder:text-ink/20 text-ink resize-none"
              />
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
            </div>

            <div className="pt-4 border-t border-black/5 space-y-6">
              <SelectField 
                label="Khas Pencipta" 
                icon={<Sparkles size={12} className="text-accent" />} 
                value={creator} 
                onChange={setCreator} 
                options={CREATORS} 
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
              label="Intro" 
              icon={<Music size={12} className="text-accent" />} 
              selected={intros} 
              onToggle={(val) => setIntros(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val])} 
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
                : "bg-accent text-white shadow-[0_20px_40px_rgba(59,130,246,0.2)] hover:shadow-[0_25px_50px_rgba(59,130,246,0.3)]"
            )}
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : <Sparkles size={24} />}
            {loading ? 'Crafting Your Masterpiece...' : 'Generate Magic'}
          </motion.button>

          <div className="glass-card rounded-[40px] overflow-hidden flex flex-col h-full min-h-[700px] relative">
            {/* Decorative elements */}
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-accent/15 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-accent/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="border-b border-black/5 px-10 py-8 flex items-center justify-between bg-accent/5">
              <h2 className="font-serif italic text-2xl text-ink">Generated Masterpiece</h2>
              <div className="flex gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-black/10" />
                <div className="w-2.5 h-2.5 rounded-full bg-black/10" />
                <div className="w-2.5 h-2.5 rounded-full bg-accent/50" />
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
