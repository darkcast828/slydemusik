import React, { useState, useEffect } from "react";
import { DollarSign, ArrowUpRight, ArrowDownRight, CreditCard, Download, Music, Play, Wallet, Calendar, TrendingUp } from "lucide-react";
import { motion } from "motion/react";

export default function Earnings() {
  const [songRoyalties, setSongRoyalties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRoyalties = async () => {
      try {
        const response = await fetch("/api/royalties/all");
        if (response.ok) {
          const data = await response.json();
          setSongRoyalties(data);
        }
      } catch (error) {
        console.error("Erro ao buscar royalties:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoyalties();
  }, []);

  return (
    <div className="space-y-10 pb-12">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
      >
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">Ganhos e Pagamentos</h1>
          <p className="text-zinc-400 text-lg">Gerencie sua receita e solicite saques com facilidade.</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-4 bg-[#1db954] text-black font-bold rounded-xl hover:bg-[#1ed760] transition-colors shadow-[0_0_20px_rgba(29,185,84,0.3)] flex items-center gap-3"
        >
          <Wallet size={20} />
          Solicitar Saque
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-[#1db954]/20 to-[#1db954]/5 border border-[#1db954]/30 rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden shadow-xl"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#1db954]/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          <div className="relative z-10">
            <p className="text-[#1db954] font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
              <DollarSign size={18} />
              Saldo Disponível
            </p>
            <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter">MT 450.20</h2>
          </div>
          <div className="mt-8 flex items-center gap-2 text-sm text-zinc-300 font-medium relative z-10 bg-black/20 w-fit px-4 py-2 rounded-lg border border-white/5">
            <CreditCard size={16} className="text-[#1db954]" />
            <span>Saque mínimo: MT 50.00</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-8 flex flex-col justify-between shadow-xl relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110 pointer-events-none" />
          <div className="relative z-10">
            <p className="text-zinc-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
              <TrendingUp size={18} />
              Ganhos Totais (Este Mês)
            </p>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter">MT 124.50</h2>
          </div>
          <div className="mt-8 flex items-center gap-2 text-sm text-[#1db954] bg-[#1db954]/10 px-4 py-2 rounded-xl w-fit border border-[#1db954]/20 relative z-10">
            <ArrowUpRight size={18} />
            <span className="font-bold">+12.5% vs último mês</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-8 flex flex-col justify-between shadow-xl relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110 pointer-events-none" />
          <div className="relative z-10">
            <p className="text-zinc-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
              <Calendar size={18} />
              Próximo Pagamento
            </p>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter">15 Nov</h2>
          </div>
          <div className="mt-8 flex items-center gap-2 text-sm text-zinc-400 font-medium relative z-10 bg-white/5 w-fit px-4 py-2 rounded-xl border border-white/5">
            <span>Processamento automático</span>
          </div>
        </motion.div>
      </div>

      {/* Ganhos por Música */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-xl"
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="p-2 bg-[#1db954]/10 rounded-lg">
              <Music className="text-[#1db954]" size={24} />
            </div>
            Ganhos por Música
          </h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1db954]"></div>
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-zinc-400 text-sm uppercase tracking-wider">
                  <th className="pb-4 font-bold px-2 md:px-4">Música</th>
                  <th className="hidden md:table-cell pb-4 font-bold text-right px-4">Streams Totais</th>
                  <th className="pb-4 font-bold text-right px-2 md:px-4">Receita Gerada</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {songRoyalties.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-12 text-center text-zinc-500 font-medium text-lg">
                      Nenhum dado de royalties disponível ainda.
                    </td>
                  </tr>
                ) : (
                  songRoyalties.map((song, i) => (
                    <motion.tr 
                      key={i} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * i }}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                    >
                      <td className="py-4 px-2 md:px-4">
                        <div className="flex items-center gap-3 md:gap-4">
                          <div className="w-10 h-10 md:w-12 md:h-12 bg-black/40 rounded-xl flex items-center justify-center overflow-hidden shadow-md border border-white/5 group-hover:border-white/10 transition-colors shrink-0">
                            {song.cover ? (
                              <img src={`/uploads/covers/${song.cover}`} alt={song.title} className="w-full h-full object-cover" />
                            ) : (
                              <Music size={20} className="text-zinc-500" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <span className="text-white font-bold text-sm md:text-base block truncate">{song.title}</span>
                            <span className="md:hidden text-zinc-400 text-xs mt-0.5 flex items-center gap-1">
                              <Play size={10} className="text-[#1db954]" />
                              {song.streams.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="hidden md:table-cell py-4 px-4 text-right text-zinc-300">
                        <div className="flex items-center justify-end gap-2 font-medium">
                          <Play size={14} className="text-[#1db954]" />
                          {song.streams.toLocaleString()}
                        </div>
                      </td>
                      <td className="py-4 px-2 md:px-4 text-right font-black text-base md:text-lg text-[#1db954] whitespace-nowrap">
                        MT {song.revenue.toFixed(2)}
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Histórico de Transações */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-xl"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <DollarSign size={24} className="text-white" />
            </div>
            Histórico de Transações
          </h2>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-sm font-bold text-black bg-white hover:bg-zinc-200 px-6 py-2.5 rounded-xl transition-colors shadow-lg"
          >
            <Download size={18} />
            Exportar CSV
          </motion.button>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-zinc-400 text-[10px] md:text-sm uppercase tracking-wider">
                <th className="pb-4 font-bold px-2 md:px-4">Data</th>
                <th className="pb-4 font-bold px-2 md:px-4">Descrição</th>
                <th className="hidden sm:table-cell pb-4 font-bold px-4">Plataforma</th>
                <th className="pb-4 font-bold text-right px-2 md:px-4">Valor</th>
                <th className="hidden md:table-cell pb-4 font-bold text-right px-4">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {[
                { date: '01 Nov 2023', desc: 'Royalties Outubro', plat: 'Spotify', amount: '+MT 84.20', status: 'Concluído', color: 'text-[#1db954]' },
                { date: '28 Out 2023', desc: 'Saque PayPal', plat: '-', amount: '-MT 200.00', status: 'Processado', color: 'text-white' },
                { date: '01 Out 2023', desc: 'Royalties Setembro', plat: 'Apple Music', amount: '+MT 45.30', status: 'Concluído', color: 'text-[#1db954]' },
                { date: '01 Set 2023', desc: 'Royalties Agosto', plat: 'Múltiplas', amount: '+MT 112.50', status: 'Concluído', color: 'text-[#1db954]' },
              ].map((tx, i) => (
                <motion.tr 
                  key={i} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="py-3 md:py-4 px-2 md:px-4 text-zinc-400 font-medium text-xs md:text-sm">{tx.date}</td>
                  <td className="py-3 md:py-4 px-2 md:px-4 text-white font-bold text-xs md:text-sm">
                    {tx.desc}
                    <div className="sm:hidden text-zinc-500 text-[10px] mt-0.5">{tx.plat}</div>
                  </td>
                  <td className="hidden sm:table-cell py-3 md:py-4 px-4 text-zinc-400 font-medium">{tx.plat}</td>
                  <td className={`py-3 md:py-4 px-2 md:px-4 text-right font-black text-sm md:text-lg whitespace-nowrap ${tx.color}`}>
                    {tx.amount}
                    <div className="md:hidden mt-1 flex justify-end">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold inline-block ${
                        tx.status === 'Concluído' 
                          ? 'bg-[#1db954]/10 text-[#1db954] border border-[#1db954]/20' 
                          : 'bg-white/10 text-white border border-white/20'
                      }`}>
                        {tx.status}
                      </span>
                    </div>
                  </td>
                  <td className="hidden md:table-cell py-3 md:py-4 px-4 text-right">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                      tx.status === 'Concluído' 
                        ? 'bg-[#1db954]/10 text-[#1db954] border border-[#1db954]/20' 
                        : 'bg-white/10 text-white border border-white/20'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
