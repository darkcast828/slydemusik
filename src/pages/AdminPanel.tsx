import React, { useState, useEffect } from "react";
import { ShieldAlert, Users, Music, DollarSign, Lock, Eye, EyeOff, LogOut, Mail, BarChart3, Settings, Bell, Search, MoreVertical, LayoutDashboard, Disc3, TrendingUp, ArrowUpRight, ArrowDownRight, CheckCircle, Clock } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from "motion/react";
import { collection, getDocs, doc, updateDoc, Timestamp, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";

const mockChartData = [
  { name: 'Jan', revenue: 1200, uploads: 45 },
  { name: 'Fev', revenue: 1900, uploads: 52 },
  { name: 'Mar', revenue: 1500, uploads: 38 },
  { name: 'Abr', revenue: 2200, uploads: 65 },
  { name: 'Mai', revenue: 2800, uploads: 80 },
  { name: 'Jun', revenue: 3500, uploads: 110 },
  { name: 'Jul', revenue: 4200, uploads: 145 },
];

export default function AdminPanel() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  const [stats, setStats] = useState({ artists: 0, songs: 0, revenue: 0 });
  const [artists, setArtists] = useState<any[]>([]);
  const [songs, setSongs] = useState<any[]>([]);
  const [firebaseUsers, setFirebaseUsers] = useState<any[]>([]);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    
    if (isAuthenticated) {
      const usersQuery = query(collection(db, "users"), orderBy("createdAt", "desc"));
      unsubscribe = onSnapshot(usersQuery, (snapshot) => {
        const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFirebaseUsers(usersData);
      }, (error) => {
        console.error("Erro ao buscar usuários em tempo real", error);
      });
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [isAuthenticated]);

  const fetchFirebaseUsers = async () => {
    // This is now handled by the real-time listener above, but we keep it for backward compatibility
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/stats", {
        headers: {
          "x-admin-email": email,
          "x-admin-password": password
        }
      });

      if (response.ok) {
        // Authenticate in Firebase as well
        try {
          const { signInWithEmailAndPassword, createUserWithEmailAndPassword } = await import("firebase/auth");
          const { auth, db } = await import("../firebase");
          const { doc, setDoc } = await import("firebase/firestore");
          
          try {
            await signInWithEmailAndPassword(auth, email, password);
          } catch (authErr: any) {
            if (authErr.code === 'auth/user-not-found' || authErr.code === 'auth/invalid-credential') {
              const userCredential = await createUserWithEmailAndPassword(auth, email, password);
              await setDoc(doc(db, 'users', userCredential.user.uid), {
                email: email,
                role: 'admin',
                createdAt: new Date()
              });
            }
          }
        } catch (firebaseErr) {
          console.error("Firebase auth error:", firebaseErr);
        }

        setIsAuthenticated(true);
        fetchData(email, password);
      } else {
        setError("Acesso negado. Credenciais incorretas.");
      }
    } catch (err) {
      setError("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async (adminEmail: string, adminPassword: string) => {
    try {
      const headers = { 
        "x-admin-email": adminEmail,
        "x-admin-password": adminPassword
      };
      
      const [statsRes, artistsRes, songsRes] = await Promise.all([
        fetch("/api/admin/stats", { headers }),
        fetch("/api/admin/artists", { headers }),
        fetch("/api/admin/songs", { headers })
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (artistsRes.ok) setArtists(await artistsRes.json());
      if (songsRes.ok) setSongs(await songsRes.json());
      
      await fetchFirebaseUsers();
    } catch (err) {
      console.error("Erro ao buscar dados do painel", err);
    }
  };

  const handleDistribute = async (songId: number) => {
    try {
      const response = await fetch(`/api/admin/songs/${songId}/distribute`, {
        method: "POST",
        headers: {
          "x-admin-email": email,
          "x-admin-password": password
        }
      });
      
      if (response.ok) {
        // Refresh songs
        fetchData(email, password);
      } else {
        alert("Erro ao distribuir música.");
      }
    } catch (err) {
      alert("Erro de conexão.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setEmail("");
    setPassword("");
    setArtists([]);
    setSongs([]);
  };

  const handleApproveUser = async (userId: string, durationMonths: number) => {
    try {
      const expirationDate = new Date();
      expirationDate.setMonth(expirationDate.getMonth() + durationMonths);
      
      await updateDoc(doc(db, "users", userId), {
        status: 'approved',
        hasPaid: true,
        subscriptionExpiresAt: Timestamp.fromDate(expirationDate),
        paymentSubmitted: false
      });
      
      // Refresh users
      fetchFirebaseUsers();
    } catch (err) {
      console.error("Erro ao aprovar usuário:", err);
      alert("Erro ao aprovar usuário.");
    }
  };

  const handleRejectUser = async (userId: string) => {
    try {
      await updateDoc(doc(db, "users", userId), {
        status: 'rejected',
        hasPaid: false,
        paymentSubmitted: false
      });
      
      // Refresh users
      fetchFirebaseUsers();
    } catch (err) {
      console.error("Erro ao rejeitar usuário:", err);
      alert("Erro ao rejeitar usuário.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#1db954]/10 rounded-full blur-[120px] pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative z-10"
        >
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-red-500/20 to-red-900/20 rounded-2xl flex items-center justify-center border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
              <ShieldAlert className="w-10 h-10 text-red-500" />
            </div>
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Acesso Restrito</h1>
            <p className="text-zinc-400">Painel de Administração SLYDE MUSIK</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400 ml-1">
                E-mail do Administrador
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-zinc-500 group-focus-within:text-red-500 transition-colors" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 bg-black/50 border border-white/10 rounded-2xl text-white placeholder-zinc-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                  placeholder="admin@slydemusik.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400 ml-1">
                Senha de Acesso
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-zinc-500 group-focus-within:text-red-500 transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-12 pr-12 py-4 bg-black/50 border border-white/10 rounded-2xl text-white placeholder-zinc-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                  placeholder="••••••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center flex items-center justify-center gap-2"
                >
                  <ShieldAlert className="w-4 h-4" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-4 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white rounded-2xl font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] active:scale-[0.98]"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Autenticando...
                </div>
              ) : (
                "Acessar Painel Seguro"
              )}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Usuários (Aprovações)', icon: Users },
    { id: 'artists', label: 'Artistas', icon: Users },
    { id: 'releases', label: 'Lançamentos', icon: Disc3 },
    { id: 'analytics', label: 'Relatórios', icon: BarChart3 },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      {/* Sidebar */}
      <aside className="w-72 bg-zinc-900/50 border-r border-white/5 hidden lg:flex flex-col">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center border border-red-500/30">
            <ShieldAlert className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <h2 className="font-bold text-lg tracking-tight">SLYDE ADMIN</h2>
            <p className="text-xs text-red-400 font-medium">Acesso Nível 5</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-white/10 text-white font-medium' 
                    : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-red-400' : ''}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>Encerrar Sessão</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-zinc-900/30 border-b border-white/5 flex items-center justify-between px-8 backdrop-blur-md">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative max-w-md w-full hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input 
                type="text" 
                placeholder="Buscar artistas, músicas, IDs..." 
                className="w-full bg-black/50 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-red-500/50"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="h-8 w-px bg-white/10 mx-2"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-white">Administrador</p>
                <p className="text-xs text-zinc-500">{email}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 border border-white/20 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-zinc-400" />
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {activeTab === 'dashboard' && (
              <>
                {/* Page Title */}
                <div>
                  <h1 className="text-3xl font-bold text-white tracking-tight">Visão Geral</h1>
                  <p className="text-zinc-400 mt-1">Acompanhe o desempenho da plataforma em tempo real.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:scale-110 group-hover:opacity-30 transition-all duration-500">
                      <Users className="w-24 h-24 text-[#1db954]" />
                    </div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-[#1db954]/20 rounded-xl flex items-center justify-center">
                          <Users className="w-5 h-5 text-[#1db954]" />
                        </div>
                        <h3 className="text-zinc-400 font-medium">Total de Artistas</h3>
                      </div>
                      <div className="flex items-end gap-3">
                        <p className="text-4xl font-bold text-white">{stats.artists}</p>
                        <span className="flex items-center text-sm text-[#1db954] mb-1 font-medium">
                          <ArrowUpRight className="w-4 h-4 mr-1" />
                          +12%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:scale-110 group-hover:opacity-30 transition-all duration-500">
                      <Disc3 className="w-24 h-24 text-blue-500" />
                    </div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                          <Music className="w-5 h-5 text-blue-500" />
                        </div>
                        <h3 className="text-zinc-400 font-medium">Músicas Distribuídas</h3>
                      </div>
                      <div className="flex items-end gap-3">
                        <p className="text-4xl font-bold text-white">{stats.songs}</p>
                        <span className="flex items-center text-sm text-blue-400 mb-1 font-medium">
                          <ArrowUpRight className="w-4 h-4 mr-1" />
                          +24%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:scale-110 group-hover:opacity-30 transition-all duration-500">
                      <DollarSign className="w-24 h-24 text-amber-500" />
                    </div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
                          <DollarSign className="w-5 h-5 text-amber-500" />
                        </div>
                        <h3 className="text-zinc-400 font-medium">Receita Total</h3>
                      </div>
                      <div className="flex items-end gap-3">
                        <p className="text-4xl font-bold text-white">${stats.revenue.toFixed(2)}</p>
                        <span className="flex items-center text-sm text-amber-400 mb-1 font-medium">
                          <ArrowUpRight className="w-4 h-4 mr-1" />
                          +8.5%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-red-900/40 to-black border border-red-500/30 rounded-3xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:scale-110 group-hover:opacity-30 transition-all duration-500">
                      <TrendingUp className="w-24 h-24 text-red-500" />
                    </div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
                          <TrendingUp className="w-5 h-5 text-red-500" />
                        </div>
                        <h3 className="text-red-200 font-medium">Crescimento (Mês)</h3>
                      </div>
                      <div className="flex items-end gap-3">
                        <p className="text-4xl font-bold text-white">+145%</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chart Section */}
                <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-6">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-xl font-bold text-white">Desempenho Financeiro</h2>
                      <p className="text-sm text-zinc-400">Receita gerada nos últimos 7 meses</p>
                    </div>
                    <select className="bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-red-500">
                      <option>Últimos 7 meses</option>
                      <option>Este ano</option>
                      <option>Ano passado</option>
                    </select>
                  </div>
                  <div className="h-[300px] w-full min-w-0">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                      <AreaChart data={mockChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                        <XAxis dataKey="name" stroke="#666" tick={{fill: '#888', fontSize: 12}} axisLine={false} tickLine={false} />
                        <YAxis stroke="#666" tick={{fill: '#888', fontSize: 12}} axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '12px', color: '#fff' }}
                          itemStyle={{ color: '#ef4444' }}
                        />
                        <Area type="monotone" dataKey="revenue" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'users' && (
              <div className="bg-zinc-900/50 border border-white/10 rounded-3xl overflow-hidden flex flex-col">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white">Aprovações de Usuários</h2>
                    <p className="text-sm text-zinc-400">Gerencie os usuários que pagaram e aguardam aprovação.</p>
                  </div>
                </div>
                <div className="overflow-x-auto flex-1">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-black/20 text-zinc-400">
                      <tr>
                        <th className="px-6 py-4 font-medium">Usuário</th>
                        <th className="px-6 py-4 font-medium">Email</th>
                        <th className="px-6 py-4 font-medium">Status</th>
                        <th className="px-6 py-4 font-medium">Pagamento</th>
                        <th className="px-6 py-4 font-medium text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {firebaseUsers.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">Nenhum usuário encontrado</td>
                        </tr>
                      ) : (
                        firebaseUsers.map((user) => (
                          <tr key={user.id} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center text-xs font-bold text-white">
                                  {(user.name || user.email || '?').charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <p className="font-medium text-white">{user.name || 'Sem nome'}</p>
                                  <p className="text-xs text-zinc-500">ID: {user.id}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-zinc-400">{user.email}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                                user.status === 'approved' 
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                                  : user.status === 'rejected'
                                  ? 'bg-red-500/10 text-red-400 border-red-500/20'
                                  : user.status === 'em_revisao'
                                  ? 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              }`}>
                                {user.status === 'approved' ? 'Aprovado' : user.status === 'rejected' ? 'Rejeitado' : user.status === 'em_revisao' ? 'Em Revisão' : 'Pendente'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              {user.paymentSubmitted ? (
                                <span className="text-emerald-400 flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Enviado</span>
                              ) : (
                                <span className="text-zinc-500 flex items-center gap-1"><Clock className="w-4 h-4" /> Aguardando</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button 
                                  onClick={() => handleApproveUser(user.id, 1)}
                                  className="px-3 py-1.5 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-xs font-bold transition-colors"
                                >
                                  Aprovar (1 Mês)
                                </button>
                                <button 
                                  onClick={() => handleApproveUser(user.id, 12)}
                                  className="px-3 py-1.5 bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg text-xs font-bold transition-colors"
                                >
                                  Aprovar (1 Ano)
                                </button>
                                <button 
                                  onClick={() => handleRejectUser(user.id)}
                                  className="px-3 py-1.5 bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-xs font-bold transition-colors"
                                >
                                  Rejeitar
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {(activeTab === 'dashboard' || activeTab === 'artists' || activeTab === 'releases') && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Artists Table */}
                {(activeTab === 'dashboard' || activeTab === 'artists') && (
                  <div className="bg-zinc-900/50 border border-white/10 rounded-3xl overflow-hidden flex flex-col">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white">Artistas Recentes</h2>
                  <button className="text-sm text-red-400 hover:text-red-300 font-medium">Ver todos</button>
                </div>
                <div className="overflow-x-auto flex-1">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-black/20 text-zinc-400">
                      <tr>
                        <th className="px-6 py-4 font-medium">Artista</th>
                        <th className="px-6 py-4 font-medium">Email</th>
                        <th className="px-6 py-4 font-medium text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {artists.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="px-6 py-12 text-center text-zinc-500">Nenhum artista encontrado</td>
                        </tr>
                      ) : (
                        artists.map((artist) => (
                          <tr key={artist.id} className="hover:bg-white/5 transition-colors group">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center text-xs font-bold text-white">
                                  {artist.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <p className="font-medium text-white">{artist.name}</p>
                                  <p className="text-xs text-zinc-500">ID: {artist.id}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-zinc-400">{artist.email}</td>
                            <td className="px-6 py-4 text-right">
                              <button className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              )}

              {/* Songs Table */}
              {(activeTab === 'dashboard' || activeTab === 'releases') && (
              <div className="bg-zinc-900/50 border border-white/10 rounded-3xl overflow-hidden flex flex-col">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white">Últimos Lançamentos</h2>
                  <button className="text-sm text-red-400 hover:text-red-300 font-medium">Ver todos</button>
                </div>
                <div className="overflow-x-auto flex-1">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-black/20 text-zinc-400">
                      <tr>
                        <th className="px-6 py-4 font-medium">Música</th>
                        <th className="px-6 py-4 font-medium">Gênero</th>
                        <th className="px-6 py-4 font-medium">Status</th>
                        <th className="px-6 py-4 font-medium">Plataformas</th>
                        <th className="px-6 py-4 font-medium text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {songs.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-12 text-center text-zinc-500">Nenhuma música encontrada</td>
                        </tr>
                      ) : (
                        songs.map((song) => (
                          <tr key={song.id} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                {song.cover ? (
                                  <img src={`/uploads/covers/${song.cover}`} alt="Cover" className="w-10 h-10 rounded-md object-cover" />
                                ) : (
                                  <div className="w-10 h-10 rounded-md bg-zinc-800 flex items-center justify-center">
                                    <Music className="w-4 h-4 text-zinc-500" />
                                  </div>
                                )}
                                <div>
                                  <p className="font-medium text-white">{song.title}</p>
                                  <p className="text-xs text-zinc-500">{song.artist_name || `ID: ${song.artist_id}`}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-zinc-300 capitalize">
                                {song.genre}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              {song.status === 'distributed' ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-medium border border-emerald-500/20">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                  Distribuída
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 text-amber-400 rounded-full text-xs font-medium border border-amber-500/20">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                  Pendente
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-xs text-zinc-400">Spotify, Apple Music, YouTube Music, TikTok, Deezer, Tidal, Amazon Music, Pandora, SoundCloud, Napster, Shazam</span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              {song.status !== 'distributed' && (
                                <button 
                                  onClick={() => handleDistribute(song.id)}
                                  className="px-3 py-1.5 bg-[#1db954]/20 text-[#1db954] hover:bg-[#1db954]/30 border border-[#1db954]/30 rounded-lg text-xs font-bold transition-colors"
                                >
                                  Distribuir
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              )}
            </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}
