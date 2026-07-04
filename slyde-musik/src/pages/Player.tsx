import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music, Share2, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const MOCK_TRACKS = [
  {
    id: 1,
    title: "Batida Urbana",
    artist: "DJ Maputo",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover: "https://picsum.photos/seed/track1/400/400"
  },
  {
    id: 2,
    title: "Noites de Verão",
    artist: "Ana Silva",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover: "https://picsum.photos/seed/track2/400/400"
  },
  {
    id: 3,
    title: "Ritmo Quente",
    artist: "Os Primos",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover: "https://picsum.photos/seed/track3/400/400"
  }
];

export default function Player() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const currentTrack = MOCK_TRACKS[currentTrackIndex];

  // Toca automaticamente quando a faixa muda (se já estava tocando)
  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(error => console.error("Playback failed", error));
    }
  }, [currentTrackIndex]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => console.error("Playback failed", error));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration;
      setCurrentTime(current);
      if (total) {
        setProgress((current / total) * 100);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressBarRef.current && audioRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, x / rect.width));
      const newTime = percentage * audioRef.current.duration;
      
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      setProgress(percentage * 100);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (volume > 0) {
        audioRef.current.volume = 0;
        setVolume(0);
      } else {
        audioRef.current.volume = 1;
        setVolume(1);
      }
    }
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % MOCK_TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + MOCK_TRACKS.length) % MOCK_TRACKS.length);
    setIsPlaying(true);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const selectTrack = (index: number) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  };

  const handleCopyLink = () => {
    // Simulando link da plataforma
    const shareLink = `https://slydemusik.com/track/${currentTrack.id}`;
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-12">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">SLYDE PLAYER</h1>
          <p className="text-zinc-400 text-lg">Ouça suas faixas enviadas em alta qualidade.</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Player Area */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-zinc-900/50 backdrop-blur-xl rounded-3xl p-8 md:p-12 flex flex-col items-center justify-center gap-16 border border-white/5 shadow-2xl relative overflow-hidden"
        >
          {/* Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#1db954]/5 blur-[100px] pointer-events-none rounded-full" />

          {/* Album Art */}
          <motion.div 
            className="w-64 h-64 md:w-80 md:h-80 rounded-2xl shadow-2xl overflow-hidden relative group z-10"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <img 
              src={currentTrack.cover} 
              alt={currentTrack.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.div>

          {/* Track Info */}
          <div className="text-center space-y-4 relative w-full z-10">
            <motion.h2 
              key={currentTrack.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-black text-white tracking-tight"
            >
              {currentTrack.title}
            </motion.h2>
            <motion.p 
              key={currentTrack.artist}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-zinc-400 font-medium"
            >
              {currentTrack.artist}
            </motion.p>
            
            <button 
              onClick={() => setShowShareModal(true)}
              className="absolute right-0 top-1/2 -translate-y-1/2 p-3 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-all hover:scale-110"
              title="Compartilhar Música"
            >
              <Share2 size={24} />
            </button>
          </div>

          {/* Audio Element */}
          <audio 
            ref={audioRef} 
            src={currentTrack.url} 
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleNext}
          />

          {/* Controls */}
          <div className="w-full max-w-xl space-y-10 z-10">
            {/* Progress Bar */}
            <div className="space-y-3">
              <div 
                ref={progressBarRef}
                className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden cursor-pointer relative group py-4 -my-4"
                onClick={handleSeek}
              >
                <div className="absolute top-1/2 -translate-y-1/2 w-full h-2 bg-zinc-800 rounded-full" />
                <div 
                  className="absolute top-1/2 -translate-y-1/2 h-2 bg-gradient-to-r from-[#1db954] to-[#1ed760] rounded-full transition-all duration-100"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_10px_rgba(255,255,255,0.5)] scale-150" />
                </div>
              </div>
              <div className="flex justify-between text-sm text-zinc-500 font-mono font-medium tracking-wider">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-between w-full">
              <div className="w-1/3"></div>
              
              <div className="flex items-center justify-center gap-8 w-1/3">
                <button onClick={handlePrev} className="text-zinc-400 hover:text-white transition-colors hover:scale-110">
                  <SkipBack size={28} />
                </button>
                
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={togglePlay}
                  className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-black shadow-[0_0_30px_rgba(255,255,255,0.2)] shrink-0"
                >
                  {isPlaying ? <Pause size={36} className="fill-black" /> : <Play size={36} className="fill-black ml-2" />}
                </motion.button>
                
                <button onClick={handleNext} className="text-zinc-400 hover:text-white transition-colors hover:scale-110">
                  <SkipForward size={28} />
                </button>
              </div>

              <div className="flex items-center justify-end gap-4 w-1/3 group">
                <button onClick={toggleMute} className="text-zinc-400 hover:text-white transition-colors">
                  {volume === 0 ? <VolumeX size={24} /> : <Volume2 size={24} />}
                </button>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.01" 
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-24 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#1db954] opacity-50 group-hover:opacity-100 transition-opacity"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Playlist */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-zinc-900/50 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/5 shadow-xl flex flex-col"
        >
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <div className="p-2 bg-[#1db954]/10 rounded-lg">
              <Music size={24} className="text-[#1db954]" />
            </div>
            Sua Biblioteca
          </h3>
          <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-2">
            {MOCK_TRACKS.map((track, index) => (
              <motion.div 
                key={track.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => selectTrack(index)}
                className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all ${
                  currentTrackIndex === index 
                    ? 'bg-white/10 border border-white/10 shadow-lg' 
                    : 'hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 shadow-md relative">
                  <img src={track.cover} alt={track.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  {currentTrackIndex === index && isPlaying && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-1">
                      <div className="w-1 bg-[#1db954] animate-[bounce_1s_infinite] h-1/2 rounded-full"></div>
                      <div className="w-1 bg-[#1db954] animate-[bounce_1.2s_infinite] h-3/4 rounded-full"></div>
                      <div className="w-1 bg-[#1db954] animate-[bounce_0.8s_infinite] h-2/3 rounded-full"></div>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-bold text-lg truncate ${currentTrackIndex === index ? 'text-[#1db954]' : 'text-white'}`}>
                    {track.title}
                  </p>
                  <p className="text-sm text-zinc-400 truncate font-medium">{track.artist}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-zinc-900 border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/5 shrink-0 bg-black/20">
                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <Share2 size={20} className="text-white" />
                  </div>
                  Compartilhar Música
                </h3>
                <button 
                  onClick={() => setShowShareModal(false)}
                  className="text-zinc-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-8 overflow-y-auto custom-scrollbar space-y-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 bg-black/40 rounded-2xl border border-white/5 shrink-0">
                  <img src={currentTrack.cover} alt="Cover" className="w-24 h-24 rounded-xl object-cover shadow-2xl" />
                  <div className="flex-1">
                    <p className="text-white font-black text-2xl mb-1">{currentTrack.title}</p>
                    <p className="text-zinc-400 text-lg font-medium">{currentTrack.artist}</p>
                  </div>
                  <div className="sm:ml-auto w-full sm:w-auto">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCopyLink}
                      className={`w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-bold transition-all shadow-lg ${
                        copied 
                          ? 'bg-[#1db954]/20 text-[#1db954] border border-[#1db954]/50' 
                          : 'bg-white text-black hover:bg-zinc-200'
                      }`}
                    >
                      {copied ? <Check size={20} /> : <Share2 size={20} />}
                      <span>{copied ? "Link Copiado!" : "Copiar Link"}</span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
