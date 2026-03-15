import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from "lucide-react";

export default function Player() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setProgress((current / duration) * 100);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">SLYDE MUSIK PLAYER</h1>
        <p className="text-gray-400">Ouça suas faixas enviadas.</p>
      </div>

      <div className="bg-[#1a1a1a] rounded-xl p-8 flex flex-col items-center justify-center gap-8 border border-white/10 shadow-2xl">
        {/* Album Art Placeholder */}
        <div className="w-64 h-64 bg-gradient-to-br from-[#1db954] to-black rounded-lg shadow-2xl flex items-center justify-center">
          <Music size={80} className="text-black/50" />
        </div>

        {/* Track Info */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white">Faixa de Teste</h2>
          <p className="text-gray-400">Artista Independente</p>
        </div>

        {/* Audio Element */}
        <audio 
          ref={audioRef} 
          src="/uploads/music/song.wav" 
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
        />

        {/* Controls */}
        <div className="w-full max-w-md space-y-6">
          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer">
            <div 
              className="h-full bg-[#1db954] transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-center gap-8">
            <button className="text-gray-400 hover:text-white transition-colors">
              <SkipBack size={24} />
            </button>
            
            <button 
              onClick={togglePlay}
              className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-black hover:scale-105 transition-transform"
            >
              {isPlaying ? <Pause size={32} className="fill-black" /> : <Play size={32} className="fill-black ml-1" />}
            </button>
            
            <button className="text-gray-400 hover:text-white transition-colors">
              <SkipForward size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
