import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Upload, CheckCircle2, Clock, MoreHorizontal, AlertCircle, RefreshCw, X, Globe } from "lucide-react";

interface Platform {
  platform_name: string;
  status: 'pending' | 'confirmed' | 'rejected';
  confirmed_at: string | null;
}

interface SongDistribution {
  id: number;
  title: string;
  artist_name: string;
  cover: string;
  release_date: string;
  created_at: string;
  stats: {
    total: number;
    confirmed: number;
    pending: number;
    rejected: number;
  };
  platforms: Platform[];
}

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [distributions, setDistributions] = useState<SongDistribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSong, setSelectedSong] = useState<SongDistribution | null>(null);
  const [syncing, setSyncing] = useState(false);

  const fetchDistributions = () => {
    if (currentUser) {
      fetch(`/api/distribution/${currentUser.uid}`)
        .then(res => res.json())
        .then(data => {
          setDistributions(data);
          setLoading(false);
          if (selectedSong) {
            const updatedSong = data.find((s: SongDistribution) => s.id === selectedSong.id);
            if (updatedSong) setSelectedSong(updatedSong);
          }
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    fetchDistributions();
  }, [currentUser]);

  const handleSync = async (songId: number) => {
    setSyncing(true);
    try {
      await fetch(`/api/distribution/sync/${songId}`, { method: 'POST' });
      fetchDistributions();
    } catch (error) {
      console.error("Erro ao sincronizar:", error);
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1db954]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Upload Card */}
      <div className="bg-[#1c1c22] p-6 rounded-[10px] mb-6">
        <h3 className="text-xl font-bold text-white mb-2">Upload New Song</h3>
        <p className="text-gray-400 mb-6">Distribute your music to 45+ platforms.</p>
        
        <Link to="/dashboard/upload">
          <button className="bg-[#7a5cff] hover:bg-[#6246ea] text-white border-none py-3 px-6 rounded-md cursor-pointer transition-colors font-medium">
            Upload Music
          </button>
        </Link>
      </div>

      {/* Releases Card */}
      <div className="bg-[#1c1c22] p-6 rounded-[10px] mb-6">
        <h3 className="text-xl font-bold text-white mb-4">Your Releases</h3>
        
        {distributions.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-400">Nenhum lançamento ainda. Faça o upload da sua primeira música!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 mt-4">
            {distributions.map((song) => {
              const isFullyConfirmed = song.stats.pending === 0 && song.stats.rejected === 0;
              const hasRejections = song.stats.rejected > 0;
              
              let statusText = "Processing";
              let statusColor = "text-yellow-500";
              
              if (isFullyConfirmed) {
                statusText = "Delivered";
                statusColor = "text-[#00ff9d]";
              } else if (hasRejections) {
                statusText = "Action Needed";
                statusColor = "text-red-500";
              }

              return (
                <div 
                  key={song.id} 
                  onClick={() => setSelectedSong(song)}
                  className="bg-[#202028] p-4 rounded-lg flex justify-between items-center cursor-pointer hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <img 
                      src={song.cover ? `/uploads/covers/${song.cover}` : "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=100&h=100&fit=crop"} 
                      alt={song.title} 
                      className="w-10 h-10 rounded object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=100&h=100&fit=crop";
                      }}
                    />
                    <span className="font-medium text-white">{song.title}</span>
                  </div>
                  <span className={`${statusColor} font-medium`}>{statusText}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Platforms Modal */}
      {selectedSong && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-[#1c1c22] border border-white/10 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col relative overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-start bg-[#202028]">
              <div className="flex gap-4 items-center">
                <img 
                  src={selectedSong.cover ? `/uploads/covers/${selectedSong.cover}` : "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=100&h=100&fit=crop"} 
                  alt={selectedSong.title} 
                  className="w-16 h-16 rounded object-cover shadow-md"
                />
                <div>
                  <h3 className="text-2xl font-bold text-white">{selectedSong.title}</h3>
                  <p className="text-gray-400">{selectedSong.artist_name}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedSong(null)}
                className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h4 className="text-lg font-bold text-white mb-1">Status das APIs de Distribuição</h4>
                  <p className="text-sm text-gray-400">Acompanhe o envio da sua música para as plataformas digitais.</p>
                </div>
                
                <button 
                  onClick={() => handleSync(selectedSong.id)}
                  disabled={syncing || selectedSong.stats.pending === 0}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                    selectedSong.stats.pending === 0 
                      ? 'bg-white/10 text-gray-500 cursor-not-allowed' 
                      : 'bg-[#7a5cff] hover:bg-[#6246ea] text-white shadow-[0_0_15px_rgba(122,92,255,0.3)]'
                  }`}
                >
                  <RefreshCw size={16} className={syncing ? "animate-spin" : ""} />
                  {syncing ? 'Sincronizando...' : 'Forçar Sincronização API'}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {selectedSong.platforms.map((platform, idx) => (
                  <div key={idx} className="bg-white/5 border border-white/5 rounded-xl p-3 flex items-center justify-between hover:bg-white/10 transition-colors">
                    <span className="font-medium text-sm text-gray-200">{platform.platform_name}</span>
                    <div className="flex items-center gap-1.5">
                      {platform.status === 'confirmed' ? (
                        <>
                          <span className="text-xs text-[#00ff9d] font-bold uppercase tracking-wider">Online</span>
                          <CheckCircle2 size={14} className="text-[#00ff9d]" />
                        </>
                      ) : platform.status === 'rejected' ? (
                        <>
                          <span className="text-xs text-red-500 font-bold uppercase tracking-wider">Erro</span>
                          <AlertCircle size={14} className="text-red-500" />
                        </>
                      ) : (
                        <>
                          <span className="text-xs text-yellow-500 font-bold uppercase tracking-wider">Pendente</span>
                          <Clock size={14} className="text-yellow-500" />
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
