import React, { useState, useEffect } from "react";
import { DollarSign, ArrowUpRight, ArrowDownRight, CreditCard, Download, Music, Play } from "lucide-react";

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
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Ganhos e Pagamentos</h1>
          <p className="text-gray-400">Gerencie sua receita e solicite saques.</p>
        </div>
        <button className="px-6 py-3 bg-[#0073C7] text-black font-bold rounded-full hover:bg-[#005bb5] transition-transform hover:scale-105 active:scale-95 flex items-center gap-2">
          <DollarSign size={20} />
          Solicitar Saque
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-[#0073C7]/20 to-[#0073C7]/5 border border-[#0073C7]/30 rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#0073C7]/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
          <div>
            <p className="text-[#0073C7] font-medium mb-2">Saldo Disponível</p>
            <h2 className="text-5xl font-bold text-white tracking-tighter">$450.20</h2>
          </div>
          <div className="mt-8 flex items-center gap-2 text-sm text-gray-300">
            <CreditCard size={16} />
            <span>Saque mínimo: $50.00</span>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col justify-between">
          <div>
            <p className="text-gray-400 font-medium mb-2">Ganhos Totais (Este Mês)</p>
            <h2 className="text-4xl font-bold text-white tracking-tighter">$124.50</h2>
          </div>
          <div className="mt-8 flex items-center gap-2 text-sm text-[#0073C7] bg-[#0073C7]/10 px-3 py-1.5 rounded-full w-fit">
            <ArrowUpRight size={16} />
            <span className="font-bold">+12.5% vs último mês</span>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col justify-between">
          <div>
            <p className="text-gray-400 font-medium mb-2">Próximo Pagamento</p>
            <h2 className="text-4xl font-bold text-white tracking-tighter">15 Nov</h2>
          </div>
          <div className="mt-8 flex items-center gap-2 text-sm text-gray-400">
            <span>Processamento automático</span>
          </div>
        </div>
      </div>

      {/* Ganhos por Música */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Music className="text-[#0073C7]" size={24} />
            Ganhos por Música
          </h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0073C7]"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 text-sm">
                  <th className="pb-4 font-medium">Música</th>
                  <th className="pb-4 font-medium text-right">Streams Totais</th>
                  <th className="pb-4 font-medium text-right">Receita Gerada</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {songRoyalties.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-gray-500">
                      Nenhum dado de royalties disponível ainda.
                    </td>
                  </tr>
                ) : (
                  songRoyalties.map((song, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden">
                            {song.cover ? (
                              <img src={`/uploads/covers/${song.cover}`} alt={song.title} className="w-full h-full object-cover" />
                            ) : (
                              <Music size={20} className="text-gray-500" />
                            )}
                          </div>
                          <span className="text-white font-medium">{song.title}</span>
                        </div>
                      </td>
                      <td className="py-4 text-right text-gray-300">
                        <div className="flex items-center justify-end gap-1">
                          <Play size={14} className="text-gray-500" />
                          {song.streams.toLocaleString()}
                        </div>
                      </td>
                      <td className="py-4 text-right font-bold text-[#0073C7]">
                        ${song.revenue.toFixed(2)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Histórico de Transações */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Histórico de Transações</h2>
          <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
            <Download size={16} />
            Exportar CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 text-sm">
                <th className="pb-4 font-medium">Data</th>
                <th className="pb-4 font-medium">Descrição</th>
                <th className="pb-4 font-medium">Plataforma</th>
                <th className="pb-4 font-medium text-right">Valor</th>
                <th className="pb-4 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {[
                { date: '01 Nov 2023', desc: 'Royalties Outubro', plat: 'Spotify', amount: '+$84.20', status: 'Concluído', color: 'text-[#0073C7]' },
                { date: '28 Out 2023', desc: 'Saque PayPal', plat: '-', amount: '-$200.00', status: 'Processado', color: 'text-white' },
                { date: '01 Out 2023', desc: 'Royalties Setembro', plat: 'Apple Music', amount: '+$45.30', status: 'Concluído', color: 'text-[#0073C7]' },
                { date: '01 Set 2023', desc: 'Royalties Agosto', plat: 'Múltiplas', amount: '+$112.50', status: 'Concluído', color: 'text-[#0073C7]' },
              ].map((tx, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-4 text-gray-300">{tx.date}</td>
                  <td className="py-4 text-white font-medium">{tx.desc}</td>
                  <td className="py-4 text-gray-400">{tx.plat}</td>
                  <td className={`py-4 text-right font-bold ${tx.color}`}>{tx.amount}</td>
                  <td className="py-4 text-right">
                    <span className="px-2.5 py-1 rounded-full bg-white/10 text-xs font-medium text-gray-300">
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
