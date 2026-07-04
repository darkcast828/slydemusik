import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { 
  Music, 
  Upload, 
  PlayCircle,
  BarChart2, 
  DollarSign, 
  User, 
  Settings, 
  LogOut,
  Menu,
  X,
  Bell,
  CheckCircle2,
  Sparkles,
  Radio,
  ShoppingBag,
  Clock,
  Heart,
  TrendingUp,
  Download,
  SkipBack,
  SkipForward,
  Play,
  Pause,
  Repeat,
  Shuffle,
  Volume2
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useAuth } from "../contexts/AuthContext";
import { motion, AnimatePresence } from "motion/react";

interface Notification {
  title: string;
  platform_name: string;
  confirmed_at: string;
}

export default function DashboardLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, userProfile, loading } = useAuth();
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && currentUser) {
      // Logic removed
    }
  }, [currentUser, userProfile, loading, navigate]);

  useEffect(() => {
    if (currentUser) {
      fetch(`/api/distribution/notifications/${currentUser.uid}`)
        .then(res => res.json())
        .then(data => setNotifications(data))
        .catch(err => console.error(err));
    }
  }, [currentUser]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fechar o menu mobile automaticamente quando a rota mudar
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    setIsMobileMenuOpen(false);
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  const navItems = [
    { path: "/dashboard/library", icon: <Upload size={20} />, label: "Library" },
    { path: "/dashboard/radio", icon: <Radio size={20} />, label: "Radio" },
    { path: "/dashboard/store", icon: <ShoppingBag size={20} />, label: "Store" },
  ];

  const myMusicItems = [
    { path: "/dashboard/songs", icon: <Music size={20} />, label: "Songs" },
    { path: "/dashboard/recent", icon: <Clock size={20} />, label: "Recent" },
    { path: "/dashboard/local", icon: <Upload size={20} />, label: "Local" },
    { path: "/dashboard/albums", icon: <Music size={20} />, label: "Albums" },
    { path: "/dashboard/artists", icon: <User size={20} />, label: "Artists" },
  ];

  const playlistItems = [
    { path: "/dashboard/starred", icon: <CheckCircle2 size={20} />, label: "Starred" },
    { path: "/dashboard/discover", icon: <Sparkles size={20} />, label: "Discover" },
    { path: "/dashboard/favorites", icon: <Heart size={20} />, label: "Favorites" },
  ];

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-64 bg-[#050505] border-r border-white/5 flex flex-col p-6 hidden md:flex z-10">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 bg-gradient-to-br from-[#1db954] to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-[#1db954]/20">
            <Music className="text-white" size={16} />
          </div>
          <span className="text-xl font-black tracking-tighter text-white">SLYDE MUSIK</span>
        </div>

        <nav className="space-y-8 flex-1 overflow-y-auto no-scrollbar pb-6">
          <div className="space-y-1">
            {navItems.map(item => (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`flex items-center gap-4 py-2.5 px-3 rounded-xl transition-all duration-300 font-medium ${location.pathname === item.path ? 'bg-white/10 text-white shadow-sm' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
              >
                {item.icon} {item.label}
              </Link>
            ))}
          </div>
          
          <div>
            <h4 className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-3 px-3">MY MUSIC</h4>
            <div className="space-y-1">
              {myMusicItems.map(item => (
                <Link 
                  key={item.path} 
                  to={item.path} 
                  className={`flex items-center gap-4 py-2.5 px-3 rounded-xl transition-all duration-300 font-medium ${location.pathname === item.path ? 'bg-white/10 text-white shadow-sm' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
                >
                  {item.icon} {item.label}
                </Link>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-3 px-3">PLAYLISTS</h4>
            <div className="space-y-1">
              {playlistItems.map(item => (
                <Link 
                  key={item.path} 
                  to={item.path} 
                  className={`flex items-center gap-4 py-2.5 px-3 rounded-xl transition-all duration-300 font-medium ${location.pathname === item.path ? 'bg-white/10 text-white shadow-sm' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
                >
                  {item.icon} {item.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5">
          <Link to="/dashboard/profile" className="flex items-center gap-3 text-zinc-300 hover:text-white mb-4 transition-colors px-3">
            <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center border border-white/10">
              <User size={16} />
            </div>
            <span className="font-medium text-sm truncate max-w-[120px]">{userProfile?.displayName || 'Artista'}</span>
          </Link>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 text-zinc-400 hover:text-red-400 w-full transition-colors px-3 py-2 rounded-xl hover:bg-red-500/10"
          >
            <LogOut size={16} />
            <span className="font-medium text-sm">Sair da conta</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-[#0a0a0a] relative overflow-hidden h-screen">
        <div className="flex-1 overflow-y-auto p-4 md:p-8 no-scrollbar bg-gradient-to-b from-[#181818] to-[#0a0a0a]">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="min-h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Player Bar */}
        <div className="h-24 bg-[#050505]/95 backdrop-blur-xl border-t border-white/5 flex items-center justify-between px-6 z-20">
          <div className="flex items-center gap-4 w-1/3">
            <div className="w-14 h-14 bg-zinc-800 rounded-lg overflow-hidden shadow-md">
              <img src="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=100&h=100&fit=crop" alt="Cover" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-bold text-sm text-white hover:underline cursor-pointer">With You</p>
              <p className="text-xs text-zinc-400 hover:underline cursor-pointer">AP Dhillon</p>
            </div>
            <Heart size={18} className="text-zinc-400 hover:text-white ml-2 cursor-pointer transition-colors" />
          </div>
          
          <div className="flex flex-col items-center gap-2 w-1/3 max-w-[500px]">
            <div className="flex items-center gap-5 text-zinc-400">
              <Shuffle size={18} className="hover:text-white cursor-pointer transition-colors" />
              <SkipBack size={20} className="hover:text-white cursor-pointer fill-zinc-400 transition-colors" />
              <button className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-black hover:scale-105 transition-transform">
                <Play size={18} fill="black" className="ml-0.5" />
              </button>
              <SkipForward size={20} className="hover:text-white cursor-pointer fill-zinc-400 transition-colors" />
              <Repeat size={18} className="hover:text-white cursor-pointer transition-colors" />
            </div>
            <div className="w-full flex items-center gap-3">
              <span className="text-[11px] text-zinc-400 font-medium">0:00</span>
              <div className="flex-1 h-1 bg-zinc-800 rounded-full group cursor-pointer relative flex items-center">
                <div className="w-1/3 h-full bg-white group-hover:bg-[#1db954] rounded-full transition-colors"></div>
                <div className="absolute left-1/3 -ml-1.5 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-md transition-opacity"></div>
              </div>
              <span className="text-[11px] text-zinc-400 font-medium">3:24</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-zinc-400 w-1/3 justify-end">
            <Volume2 size={18} className="hover:text-white cursor-pointer transition-colors" />
            <div className="w-24 h-1 bg-zinc-800 rounded-full group cursor-pointer relative flex items-center">
              <div className="w-2/3 h-full bg-white group-hover:bg-[#1db954] rounded-full transition-colors"></div>
              <div className="absolute left-2/3 -ml-1.5 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-md transition-opacity"></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
