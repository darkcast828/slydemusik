import { BarChart2, Globe, Music, Play, TrendingUp, Users } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

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
  { name: 'Spotify', value: 45, color: '#0073C7' },
  { name: 'Apple Music', value: 25, color: '#ff2d55' },
  { name: 'YouTube Music', value: 15, color: '#ff0000' },
  { name: 'TikTok', value: 10, color: '#00f2fe' },
  { name: 'Deezer', value: 5, color: '#ff0092' },
];

export default function Analytics() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Estatísticas</h1>
        <p className="text-gray-400">Acompanhe o desempenho das suas músicas em tempo real.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total de Streams" 
          value="124.5K" 
          change="+12.5%" 
          icon={<Play size={24} className="text-[#0073C7]" />} 
        />
        <StatCard 
          title="Ouvintes Únicos" 
          value="45.2K" 
          change="+8.2%" 
          icon={<Users size={24} className="text-[#6c3cff]" />} 
        />
        <StatCard 
          title="Países Alcançados" 
          value="142" 
          change="+3" 
          icon={<Globe size={24} className="text-[#0073C7]" />} 
        />
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-white">Desempenho Semanal</h2>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-sm font-medium bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">Streams</button>
            <button className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors">Ouvintes</button>
          </div>
        </div>
        <div className="h-[400px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorStreams" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0073C7" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#0073C7" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis dataKey="name" stroke="#ffffff50" tick={{fill: '#ffffff50'}} tickLine={false} axisLine={false} />
              <YAxis stroke="#ffffff50" tick={{fill: '#ffffff50'}} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#111', border: '1px solid #ffffff20', borderRadius: '12px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Area type="monotone" dataKey="streams" stroke="#0073C7" strokeWidth={3} fillOpacity={1} fill="url(#colorStreams)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Top Músicas</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center font-bold text-gray-400">
                  {i}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-white truncate">Hit Africano {i}</h3>
                  <p className="text-sm text-gray-400 truncate">Single</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-white">{(100 / i).toFixed(1)}K</p>
                  <p className="text-xs text-gray-500">streams</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col">
          <h2 className="text-xl font-bold text-white mb-6">Top Plataformas</h2>
          <div className="flex-1 flex flex-col lg:flex-row items-center gap-8">
            <div className="w-full lg:w-1/2 h-[250px] min-w-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <PieChart>
                  <Pie
                    data={platformData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {platformData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111', border: '1px solid #ffffff20', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value: number) => [`${value}%`, 'Distribuição']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full lg:w-1/2 space-y-4">
              {platformData.map((platform, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: platform.color }}></div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-white truncate">{platform.name}</h3>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-white">{platform.value}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, icon }: any) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-4 hover:bg-white/10 transition-colors">
      <div className="flex items-center justify-between">
        <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center">
          {icon}
        </div>
        <div className="flex items-center gap-1 text-sm font-medium text-[#0073C7] bg-[#0073C7]/10 px-2.5 py-1 rounded-full">
          <TrendingUp size={14} />
          {change}
        </div>
      </div>
      <div>
        <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
      </div>
    </div>
  );
}
