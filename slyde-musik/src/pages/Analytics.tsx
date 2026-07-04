import { BarChart2, Globe, Music, Play, TrendingUp, Users } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { motion } from "motion/react";

const data = [
  { name: 'Seg', streams: 4000, listeners: 2400 },
  { name: 'Ter', streams: 3000, listeners: 1398 },
  { name: 'Qua', streams: 2000, listeners: 9800 },
  { name: 'Qui', streams: 2780, listeners: 3908 },
  { name: 'Sex', streams: 1890, listeners: 4800 },
  { name: 'Sáb', streams: 2390, listeners: 3800 },
  { name: 'Dom', streams: 3490, listeners: 4300 },
];

const platformData = [
  { name: 'Spotify', value: 35, color: '#1db954' },
  { name: 'Apple Music', value: 20, color: '#ff2d55' },
  { name: 'YouTube Music', value: 15, color: '#ff0000' },
  { name: 'TikTok', value: 10, color: '#00f2fe' },
  { name: 'Deezer', value: 8, color: '#ff0092' },
  { name: 'Amazon Music', value: 5, color: '#ff9900' },
  { name: 'Tidal', value: 4, color: '#ffffff' },
  { name: 'SoundCloud', value: 3, color: '#ff5500' },
];

export default function Analytics() {
  return (
    <div className="space-y-10 pb-12">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">Estatísticas</h1>
          <p className="text-zinc-400 text-lg">Acompanhe o desempenho das suas músicas em tempo real.</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total de Streams" 
          value="124.5K" 
          change="+12.5%" 
          icon={<Play size={24} className="text-[#1db954]" />} 
          delay={0.1}
        />
        <StatCard 
          title="Ouvintes Únicos" 
          value="45.2K" 
          change="+8.2%" 
          icon={<Users size={24} className="text-[#1db954]" />} 
          delay={0.2}
        />
        <StatCard 
          title="Países Alcançados" 
          value="142" 
          change="+3" 
          icon={<Globe size={24} className="text-[#1db954]" />} 
          delay={0.3}
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#1db954]/5 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 relative z-10">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="p-2 bg-[#1db954]/10 rounded-lg">
              <BarChart2 size={24} className="text-[#1db954]" />
            </div>
            Desempenho Semanal
          </h2>
          <div className="flex gap-2 bg-black/40 p-1 rounded-xl border border-white/5">
            <button className="px-6 py-2.5 text-sm font-bold bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors shadow-lg">Streams</button>
            <button className="px-6 py-2.5 text-sm font-bold text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">Ouvintes</button>
          </div>
        </div>
        <div className="h-[400px] w-full min-w-0 relative z-10">
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
                tick={{fill: '#ffffff50', fontSize: 12, fontWeight: 500}} 
                tickLine={false} 
                axisLine={false} 
                dy={10}
              />
              <YAxis 
                stroke="#ffffff50" 
                tick={{fill: '#ffffff50', fontSize: 12, fontWeight: 500}} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(value) => `${value / 1000}k`} 
                dx={-10}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', padding: '12px 16px' }}
                itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                labelStyle={{ color: '#a1a1aa', marginBottom: '4px', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}
                cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2, strokeDasharray: '4 4' }}
              />
              <Area 
                type="monotone" 
                dataKey="streams" 
                stroke="#1db954" 
                strokeWidth={4} 
                fillOpacity={1} 
                fill="url(#colorStreams)" 
                activeDot={{ r: 6, fill: '#1db954', stroke: '#fff', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-xl"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <div className="p-2 bg-[#1db954]/10 rounded-lg">
              <Music size={24} className="text-[#1db954]" />
            </div>
            Top Músicas
          </h2>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div 
                key={i} 
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.05)' }}
                className="flex items-center gap-4 p-4 rounded-2xl transition-all cursor-pointer border border-transparent hover:border-white/5"
              >
                <div className="w-12 h-12 bg-black/40 rounded-xl flex items-center justify-center font-black text-xl text-zinc-500 shadow-inner">
                  {i}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-white truncate">Hit Africano {i}</h3>
                  <p className="text-sm text-zinc-400 truncate font-medium">Single</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-lg text-white">{(100 / i).toFixed(1)}K</p>
                  <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">streams</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-xl flex flex-col"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <div className="p-2 bg-[#1db954]/10 rounded-lg">
              <Globe size={24} className="text-[#1db954]" />
            </div>
            Top Plataformas
          </h2>
          <div className="flex-1 flex flex-col lg:flex-row items-center gap-8">
            <div className="w-full lg:w-1/2 h-[250px] min-w-0 relative">
              <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                <span className="text-3xl font-black text-white">100%</span>
                <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Distribuição</span>
              </div>
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <PieChart>
                  <Pie
                    data={platformData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                    cornerRadius={8}
                  >
                    {platformData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '8px 12px' }}
                    itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                    formatter={(value: number) => [`${value}%`, 'Distribuição']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full lg:w-1/2 space-y-3">
              {platformData.map((platform, i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <div className="w-4 h-4 rounded-full shadow-lg" style={{ backgroundColor: platform.color, boxShadow: `0 0 10px ${platform.color}80` }}></div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white truncate">{platform.name}</h3>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-white">{platform.value}%</p>
                  </div>
                </motion.div>
              ))}
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
      className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-8 flex flex-col gap-6 shadow-xl relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
      
      <div className="flex items-center justify-between relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-black/40 flex items-center justify-center shadow-inner border border-white/5">
          {icon}
        </div>
        <div className="flex items-center gap-1.5 text-sm font-bold text-[#1db954] bg-[#1db954]/10 px-3 py-1.5 rounded-full border border-[#1db954]/20">
          <TrendingUp size={16} />
          {change}
        </div>
      </div>
      <div className="relative z-10">
        <p className="text-zinc-400 text-sm font-bold uppercase tracking-wider mb-2">{title}</p>
        <h3 className="text-4xl font-black text-white tracking-tight">{value}</h3>
      </div>
    </motion.div>
  );
}
