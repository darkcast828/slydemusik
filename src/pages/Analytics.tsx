import { BarChart2, Globe, Music, Play, TrendingUp, Users } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { motion } from "motion/react";

const generate30DaysData = () => {
  const data = [];
  const today = new Date();
  for (let i = 30; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    data.push({
      name: `${d.getDate()}/${d.getMonth() + 1}`,
      streams: Math.floor(Math.random() * 5000) + 1000,
      listeners: Math.floor(Math.random() * 3000) + 500,
    });
  }
  return data;
};

const data = generate30DaysData();

const geoData = [
  { name: 'Estados Unidos', value: 35000, color: '#1db954' },
  { name: 'Brasil', value: 25000, color: '#ffeb3b' },
  { name: 'Portugal', value: 15000, color: '#f44336' },
  { name: 'Moçambique', value: 12000, color: '#009688' },
  { name: 'Angola', value: 10000, color: '#e91e63' },
  { name: 'Reino Unido', value: 8000, color: '#3f51b5' },
];

export default function Analytics() {
  return (
    <div className="space-y-6 md:space-y-10 pb-12">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">Estatísticas</h1>
          <p className="text-zinc-400 text-sm md:text-lg">Acompanhe o desempenho das suas músicas nos últimos 30 dias.</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <StatCard 
          title="Total de Streams (30d)" 
          value="124.5K" 
          change="+12.5%" 
          icon={<Play size={20} className="text-[#1db954] md:w-6 md:h-6" />} 
          delay={0.1}
        />
        <StatCard 
          title="Ouvintes Únicos (30d)" 
          value="45.2K" 
          change="+8.2%" 
          icon={<Users size={20} className="text-[#1db954] md:w-6 md:h-6" />} 
          delay={0.2}
        />
        <StatCard 
          title="Países Alcançados" 
          value="142" 
          change="+3" 
          icon={<Globe size={20} className="text-[#1db954] md:w-6 md:h-6" />} 
          delay={0.3}
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#1db954]/5 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-4 relative z-10">
          <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2 md:gap-3">
            <div className="p-1.5 md:p-2 bg-[#1db954]/10 rounded-lg shrink-0">
              <BarChart2 size={20} className="text-[#1db954] md:w-6 md:h-6" />
            </div>
            Tendências de Ouvintes
          </h2>
          <div className="flex w-full sm:w-auto gap-2 bg-black/40 p-1 rounded-xl border border-white/5 overflow-x-auto custom-scrollbar">
            <button className="flex-1 sm:flex-none px-4 md:px-6 py-2 md:py-2.5 text-xs md:text-sm font-bold bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors shadow-lg whitespace-nowrap">Streams Diários</button>
            <button className="flex-1 sm:flex-none px-4 md:px-6 py-2 md:py-2.5 text-xs md:text-sm font-bold text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors whitespace-nowrap">Ouvintes</button>
          </div>
        </div>

        <div className="h-[250px] md:h-[400px] w-full min-w-0 relative z-10">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorStreams" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1db954" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#1db954" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#ffffff50" 
                tick={{fill: '#ffffff50', fontSize: 10, fontWeight: 500}} 
                tickLine={false} 
                axisLine={false} 
                dy={10}
                minTickGap={20}
              />
              <YAxis 
                stroke="#ffffff50" 
                tick={{fill: '#ffffff50', fontSize: 10, fontWeight: 500}} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(value) => `${value / 1000}k`} 
                dx={-10}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', padding: '8px 12px' }}
                itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                labelStyle={{ color: '#a1a1aa', marginBottom: '4px', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase' }}
                cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2, strokeDasharray: '4 4' }}
              />
              <Area 
                type="monotone" 
                dataKey="streams" 
                name="Streams"
                stroke="#1db954" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorStreams)" 
                activeDot={{ r: 5, fill: '#1db954', stroke: '#fff', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-2xl md:rounded-3xl p-5 md:p-8 shadow-xl"
        >
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
            <div className="p-1.5 md:p-2 bg-[#1db954]/10 rounded-lg shrink-0">
              <Music size={20} className="text-[#1db954] md:w-6 md:h-6" />
            </div>
            Top Músicas
          </h2>
          <div className="space-y-2 md:space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div 
                key={i} 
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.05)' }}
                className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl md:rounded-2xl transition-all cursor-pointer border border-transparent hover:border-white/5"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 bg-black/40 rounded-xl flex items-center justify-center font-black text-lg md:text-xl text-zinc-500 shadow-inner shrink-0">
                  {i}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm md:text-lg text-white truncate">Hit Africano {i}</h3>
                  <p className="text-[10px] md:text-sm text-zinc-400 truncate font-medium">Single</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-black text-sm md:text-lg text-white">{(100 / i).toFixed(1)}K</p>
                  <p className="text-[9px] md:text-xs text-zinc-500 font-medium uppercase tracking-wider">streams</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-2xl md:rounded-3xl p-5 md:p-8 shadow-xl flex flex-col"
        >
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
            <div className="p-1.5 md:p-2 bg-[#1db954]/10 rounded-lg shrink-0">
              <Globe size={20} className="text-[#1db954] md:w-6 md:h-6" />
            </div>
            Distribuição Geográfica
          </h2>
          
          <div className="flex-1 flex flex-col items-center justify-center gap-4 md:gap-8">
            <div className="w-full h-[250px] md:h-[300px] min-w-0 relative">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <BarChart
                  data={geoData}
                  layout="vertical"
                  margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
                  <XAxis type="number" stroke="#ffffff50" tick={{fill: '#ffffff50', fontSize: 10}} tickFormatter={(val) => `${val/1000}k`} />
                  <YAxis dataKey="name" type="category" stroke="#ffffff50" tick={{fill: '#ffffff', fontSize: 10, fontWeight: 600}} width={80} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '8px 12px' }}
                    itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                    cursor={{fill: '#ffffff10'}}
                    formatter={(value: number) => [`${value.toLocaleString()}`, 'Streams']}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {geoData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, icon, delay }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-2xl md:rounded-3xl p-5 md:p-8 flex flex-col gap-4 md:gap-6 shadow-xl relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-white/5 rounded-bl-full -mr-12 -mt-12 md:-mr-16 md:-mt-16 transition-transform group-hover:scale-110" />
      
      <div className="flex items-center justify-between relative z-10">
        <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-black/40 flex items-center justify-center shadow-inner border border-white/5 shrink-0">
          {icon}
        </div>
        <div className="flex items-center gap-1 md:gap-1.5 text-[10px] md:text-sm font-bold text-[#1db954] bg-[#1db954]/10 px-2 md:px-3 py-1 md:py-1.5 rounded-full border border-[#1db954]/20 whitespace-nowrap">
          <TrendingUp size={12} className="md:w-4 md:h-4" />
          {change}
        </div>
      </div>
      <div className="relative z-10">
        <p className="text-zinc-400 text-[10px] md:text-sm font-bold uppercase tracking-wider mb-1 md:mb-2">{title}</p>
        <h3 className="text-2xl md:text-4xl font-black text-white tracking-tight">{value}</h3>
      </div>
    </motion.div>
  );
}
