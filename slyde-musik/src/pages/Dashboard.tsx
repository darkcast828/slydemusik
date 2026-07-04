import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Upload, CheckCircle2, Clock, PlayCircle, AlertCircle, RefreshCw, X, Music, TrendingUp, DollarSign, ArrowRight, Activity, Headphones } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

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
  const { currentUser, userProfile } = useAuth();
  const [distributions, setDistributions] = useState<SongDistribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSong, setSelectedSong] = useState<SongDistribution | null>(null);
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);
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
      <div className="flex justify-center items-center h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1db954]"></div>
      </div>
    );
  }

  const totalReleases = distributions.length;

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-16">
      {/* Welcome Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Visão Geral
          </h1>
          <p className="text-zinc-400 text-lg font-medium">
            Bem-vindo de volta, <span className="text-white">{userProfile?.displayName || 'Artista'}</span>. Aqui está o desempenho da sua música.
          </p>
        </div>
        <Link to="/dashboard/upload">
          <button className="group relative inline-flex items-center justify-center gap-2 bg-[#1db954] text-black font-bold py-3.5 px-8 rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(29,185,84,0.3)] hover:shadow-[0_0_30px_rgba(29,185,84,0.5)]">
            <Upload size={20} className="relative z-10" />
            <span className="relative z-10">Novo Lançamento</span>
          </button>
        </Link>
      </motion.div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#121212] border border-white/5 rounded-3xl p-8 relative overflow-hidden group hover:bg-[#181818] transition-all duration-300 shadow-xl"
        >
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#1db954]/10 rounded-full blur-3xl group-hover:bg-[#1db954]/20 transition-colors duration-500"></div>
          <div className="relative z-10 flex justify-between items-start mb-8">
            <div className="p-3.5 bg-black/50 border border-white/5 rounded-2xl text-zinc-400 group-hover:text-white transition-all shadow-inner">
              <Music size={24} />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-[#1db954] bg-[#1db954]/10 px-3 py-1.5 rounded-full border border-[#1db954]/20">
              <TrendingUp size={14} /> +1 este mês
            </span>
          </div>
          <div className="relative z-10">
            <h3 className="text-5xl font-black text-white tracking-tight mb-2">{totalReleases}</h3>
            <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest">Lançamentos</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#121212] border border-white/5 rounded-3xl p-8 relative overflow-hidden group hover:bg-[#181818] transition-all duration-300 shadow-xl"
        >
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-colors duration-500"></div>
          <div className="relative z-10 flex justify-between items-start mb-8">
            <div className="p-3.5 bg-black/50 border border-white/5 rounded-2xl text-zinc-400 group-hover:text-white transition-all shadow-inner">
              <Headphones size={24} />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-blue-400 bg-blue-400/10 px-3 py-1.5 rounded-full border border-blue-400/20">
              Atualizado hoje
            </span>
          </div>
          <div className="relative z-10">
            <h3 className="text-5xl font-black text-white tracking-tight mb-2">--</h3>
            <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest">Streams Estimados</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#121212] border border-white/5 rounded-3xl p-8 relative overflow-hidden group hover:bg-[#181818] transition-all duration-300 shadow-xl"
        >
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-colors duration-500"></div>
          <div className="relative z-10 flex justify-between items-start mb-8">
            <div className="p-3.5 bg-black/50 border border-white/5 rounded-2xl text-zinc-400 group-hover:text-white transition-all shadow-inner">
              <DollarSign size={24} />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-full border border-emerald-400/20">
              Aguardando lojas
            </span>
          </div>
          <div className="relative z-10">
            <h3 className="text-5xl font-black text-white tracking-tight mb-2">$0.00</h3>
            <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest">Ganhos (Mês Atual)</p>
          </div>
        </motion.div>
      </div>

      {/* Upload Banner */}
      {distributions.length === 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="relative rounded-[2.5rem] overflow-hidden p-10 md:p-16 border border-white/10 bg-zinc-900/50"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#1db954]/20 via-transparent to-[#1db954]/5 z-0"></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay z-0"></div>
          
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white font-medium text-sm mb-8">
              <Activity size={16} className="text-[#1db954]" />
              Sua jornada começa aqui
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight tracking-tight">
              Sua música merece <br/>o mundo.
            </h2>
            <p className="text-zinc-300 text-xl mb-10 leading-relaxed max-w-2xl font-light">
              Distribua suas faixas para o Spotify, Apple Music, TikTok e mais de 150 plataformas digitais. Mantenha 100% dos seus direitos e royalties. Sem taxas ocultas.
            </p>
            <Link to="/dashboard/upload">
              <button className="bg-[#1db954] text-black hover:bg-[#1ed760] font-bold py-4 px-10 rounded-full transition-all hover:scale-105 active:scale-95 text-lg shadow-[0_0_30px_rgba(29,185,84,0.3)]">
                Fazer meu primeiro Upload
              </button>
            </Link>
          </div>
        </motion.div>
      )}

      {/* Recent Uploads Table */}
      {distributions.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[#121212] border border-white/5 rounded-3xl overflow-hidden shadow-xl"
        >
          <div className="p-8 border-b border-white/5 flex items-center justify-between bg-black/20">
            <div>
              <h3 className="text-2xl font-black text-white tracking-tight">Lançamentos Recentes</h3>
              <p className="text-zinc-500 font-medium text-sm mt-1">Acompanhe o status das suas músicas nas plataformas.</p>
            </div>
            <Link to="/dashboard/analytics" className="hidden sm:flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors font-bold bg-white/5 hover:bg-white/10 px-5 py-2.5 rounded-full border border-white/5">
              Ver todos <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs uppercase tracking-widest text-zinc-600 bg-black/40">
                  <th className="p-6 font-bold">Lançamento</th>
                  <th className="p-6 font-bold">Data de Envio</th>
                  <th className="p-6 font-bold">Status</th>
                  <th className="p-6 font-bold text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {distributions.map((song) => {
                  const isExpanded = expandedRowId === song.id;
                  const isFullyConfirmed = song.stats.pending === 0 && song.stats.rejected === 0;
                  const hasRejections = song.stats.rejected > 0;
                  
                  let statusText = "Processando";
                  let statusBadge = "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
                  let StatusIcon = Clock;
                  
                  if (isFullyConfirmed) {
                    statusText = "Distribuído";
                    statusBadge = "bg-[#1db954]/10 text-[#1db954] border-[#1db954]/20";
                    StatusIcon = CheckCircle2;
                  } else if (hasRejections) {
                    statusText = "Ação Necessária";
                    statusBadge = "bg-red-500/10 text-red-500 border-red-500/20";
                    StatusIcon = AlertCircle;
                  }

                  const uploadDate = song.created_at ? new Date(song.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }) : '---';

                  return (
                    <React.Fragment key={song.id}>
                      <tr 
                        onClick={() => setExpandedRowId(isExpanded ? null : song.id)}
                        className={`hover:bg-[#181818] transition-colors group cursor-pointer ${isExpanded ? 'bg-[#181818]' : ''}`}
                      >
                        <td className="p-6">
                          <div className="flex items-center gap-5">
                            <div className="relative w-14 h-14 rounded-xl overflow-hidden shadow-lg group-hover:shadow-xl transition-all group-hover:scale-105 border border-white/5">
                              <img 
                                src={song.cover ? `/uploads/covers/${song.cover}` : "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=100&h=100&fit=crop"} 
                                alt={song.title} 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=100&h=100&fit=crop";
                                }}
                              />
                              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                            </div>
                            <div>
                              <p className="font-bold text-white text-lg leading-tight mb-1 group-hover:text-[#1db954] transition-colors">{song.title}</p>
                              <p className="text-sm text-zinc-500 font-medium">{song.artist_name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-6 text-sm text-zinc-400 font-medium">
                          {uploadDate}
                        </td>
                        <td className="p-6">
                          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider shadow-sm ${statusBadge}`}>
                            <StatusIcon size={14} />
                            {statusText}
                          </div>
                        </td>
                        <td className="p-6 text-right">
                          <button 
                            className="text-sm font-bold text-zinc-400 hover:text-white transition-colors px-5 py-2.5 rounded-full border border-white/5 hover:border-white/20 hover:bg-white/5 bg-black/20"
                          >
                            {isExpanded ? 'Ocultar' : 'Detalhes'}
                          </button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-black/40 shadow-inner">
                          <td colSpan={4} className="p-8">
                            <div className="flex flex-col md:flex-row gap-8 items-start">
                              <div className="relative group rounded-2xl border border-white/10 p-1 bg-white/5">
                                <img 
                                  src={song.cover ? `/uploads/covers/${song.cover}` : "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=200&h=200&fit=crop"} 
                                  alt={song.title} 
                                  className="w-40 h-40 rounded-xl object-cover shadow-2xl"
                                />
                                <button className="absolute inset-1 flex items-center justify-center bg-black/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity rounded-xl text-white font-bold border border-white/10">
                                  Editar Capa
                                </button>
                              </div>
                              <div className="flex-1 space-y-4">
                                <h4 className="text-2xl font-black text-white">{song.title}</h4>
                                <div className="space-y-1">
                                  <p className="text-zinc-500 font-medium">Artista: <span className="text-zinc-200">{song.artist_name}</span></p>
                                  <p className="text-zinc-500 font-medium">Data de Lançamento: <span className="text-zinc-200">{new Date(song.release_date).toLocaleDateString('pt-BR')}</span></p>
                                </div>
                                <div className="flex gap-3 pt-2">
                                  <button 
                                    onClick={() => handleSync(song.id)}
                                    disabled={syncing || song.stats.pending === 0}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm bg-white text-black hover:bg-gray-200 hover:scale-105 active:scale-95 transition-all shadow-lg disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                                  >
                                    <RefreshCw size={16} className={syncing ? "animate-spin" : ""} />
                                    Sincronizar Status
                                  </button>
                                  <button 
                                    onClick={() => setSelectedSong(song)}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm bg-zinc-800 text-white hover:bg-zinc-700 transition-all border border-white/10"
                                  >
                                    Visualizar Plataformas
                                  </button>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Platforms Modal */}
      <AnimatePresence>
        {selectedSong && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-zinc-900 border border-white/10 rounded-[2rem] w-full max-w-4xl max-h-[85vh] flex flex-col relative overflow-hidden shadow-2xl"
            >
              {/* Header */}
              <div className="p-8 md:p-10 border-b border-white/5 flex justify-between items-start bg-zinc-900/80 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#1db954]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="flex flex-col md:flex-row gap-8 items-start md:items-center relative z-10 w-full">
                  <img 
                    src={selectedSong.cover ? `/uploads/covers/${selectedSong.cover}` : "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=100&h=100&fit=crop"} 
                    alt={selectedSong.title} 
                    className="w-32 h-32 rounded-2xl object-cover shadow-2xl"
                  />
                  <div className="flex-1">
                    <h3 className="text-4xl font-black text-white tracking-tight mb-2">{selectedSong.title}</h3>
                    <p className="text-zinc-400 text-xl font-medium">{selectedSong.artist_name}</p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <span className="text-xs font-bold text-zinc-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                        Lançamento: {new Date(selectedSong.release_date).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedSong(null)}
                    className="absolute top-0 right-0 p-2 text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 md:p-10 overflow-y-auto flex-1 bg-black/40">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                  <div>
                    <h4 className="text-2xl font-bold text-white mb-1 tracking-tight">Status nas Plataformas</h4>
                    <p className="text-sm text-zinc-400 font-medium">Acompanhe o envio da sua música para as lojas digitais.</p>
                  </div>
                  
                  <button 
                    onClick={() => handleSync(selectedSong.id)}
                    disabled={syncing || selectedSong.stats.pending === 0}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all ${
                      selectedSong.stats.pending === 0 
                        ? 'bg-white/5 text-zinc-500 cursor-not-allowed border border-white/5' 
                        : 'bg-white text-black hover:bg-gray-200 shadow-lg hover:scale-105 active:scale-95'
                    }`}
                  >
                    <RefreshCw size={16} className={syncing ? "animate-spin" : ""} />
                    {syncing ? 'Sincronizando...' : 'Sincronizar Status'}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {selectedSong.platforms.map((platform, idx) => (
                    <div key={idx} className="bg-zinc-900/60 backdrop-blur-md border border-white/5 rounded-2xl p-6 flex flex-col gap-4 hover:bg-zinc-800/80 hover:border-white/10 transition-all group">
                      <span className="font-bold text-lg text-zinc-200 group-hover:text-white transition-colors">{platform.platform_name}</span>
                      <div className="flex items-center">
                        {platform.status === 'confirmed' ? (
                          <div className="flex items-center gap-2 bg-[#1db954]/10 px-4 py-2 rounded-full border border-[#1db954]/20">
                            <CheckCircle2 size={16} className="text-[#1db954]" />
                            <span className="text-xs text-[#1db954] font-bold uppercase tracking-wider">Confirmado</span>
                          </div>
                        ) : platform.status === 'rejected' ? (
                          <div className="flex items-center gap-2 bg-red-500/10 px-4 py-2 rounded-full border border-red-500/20">
                            <AlertCircle size={16} className="text-red-500" />
                            <span className="text-xs text-red-500 font-bold uppercase tracking-wider">Rejeitado</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 bg-yellow-500/10 px-4 py-2 rounded-full border border-yellow-500/20">
                            <Clock size={16} className="text-yellow-500" />
                            <span className="text-xs text-yellow-500 font-bold uppercase tracking-wider">Pendente</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

