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
  Sparkles
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useAuth } from "../contexts/AuthContext";

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
  const { currentUser } = useAuth();
  const notifRef = useRef<HTMLDivElement>(null);

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
    { path: "/dashboard", icon: <Music size={20} />, label: "Distribuição" },
    { path: "/dashboard/upload", icon: <Upload size={20} />, label: "Upload Music" },
    { path: "/dashboard/player", icon: <PlayCircle size={20} />, label: "Player" },
    { path: "/dashboard/analytics", icon: <BarChart2 size={20} />, label: "Analytics" },
    { path: "/dashboard/earnings", icon: <DollarSign size={20} />, label: "Earnings" },
    { path: "/dashboard/profile", icon: <User size={20} />, label: "Artist Profile" },
    { path: "/dashboard/assistant", icon: <Sparkles size={20} />, label: "SLYDE IA" },
    { path: "/dashboard/settings", icon: <Settings size={20} />, label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-[#0f0f12] text-white font-sans flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-white/5 bg-[#1a1a1f] sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#7a5cff] rounded-full flex items-center justify-center">
            <Music className="text-white" size={16} />
          </div>
          <span className="text-xl font-bold tracking-tighter text-[#7a5cff]">SLYDE MUSIK</span>
        </Link>
        <div className="flex items-center gap-4">
          <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} className="relative p-2 text-gray-400 hover:text-white">
            <Bell size={24} />
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
            )}
          </button>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-400 hover:text-white">
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-screen w-64 bg-[#1a1a1f] border-r border-white/5 flex flex-col z-40
        transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 hidden md:flex items-center gap-2">
          <div className="w-10 h-10 bg-[#7a5cff] rounded-full flex items-center justify-center">
            <Music className="text-white" size={20} />
          </div>
          <span className="text-2xl font-bold tracking-tighter text-[#7a5cff]">SLYDE MUSIK</span>
        </div>

        <nav className="flex-1 px-4 py-8 md:py-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path} 
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-[#7a5cff]/10 text-[#7a5cff] font-medium' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className={`${isActive ? 'text-[#7a5cff]' : 'text-gray-400'}`}>
                  {item.icon}
                </div>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all"
          >
            <LogOut size={20} />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden bg-[#0f0f12] relative">
        {/* Desktop Header / Notifications */}
        <div className="hidden md:flex justify-end p-6 pb-0">
          <div className="relative" ref={notifRef}>
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors relative"
            >
              <Bell size={20} />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#7a5cff] rounded-full border-2 border-[#0f0f12]"></span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-[#1c1c22] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden">
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                  <h3 className="font-bold text-white">Notificações</h3>
                  <span className="text-xs bg-[#7a5cff]/20 text-[#7a5cff] px-2 py-1 rounded-full">{notifications.length} novas</span>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-gray-400 text-sm">
                      Nenhuma notificação no momento.
                    </div>
                  ) : (
                    notifications.map((notif, idx) => (
                      <div key={idx} className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors flex gap-3">
                        <div className="mt-1 flex-shrink-0">
                          <CheckCircle2 size={18} className="text-[#00ff9d]" />
                        </div>
                        <div>
                          <p className="text-sm text-white">
                            <span className="font-bold">{notif.title}</span> foi aprovada na plataforma <span className="font-bold text-[#00ff9d]">{notif.platform_name}</span>.
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(notif.confirmed_at).toLocaleDateString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-10 pt-6">
          <Outlet />
        </div>
      </main>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
