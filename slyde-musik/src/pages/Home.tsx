import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Check, Infinity, Quote, BadgeCheck, PieChart, Wrench, Smartphone, Mic2, LineChart, Disc, Calendar, DollarSign, Mail, Lock } from "lucide-react";
import { auth } from "../firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  OAuthProvider,
  signInWithCredential
} from "firebase/auth";
import { motion, AnimatePresence } from "motion/react";

declare global {
  interface Window {
    AppleID: any;
  }
}

export default function Home() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{name: string, mzn: number} | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'emola'>('mpesa');

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";
    script.async = true;
    script.onload = () => {
      if (window.AppleID) {
        window.AppleID.auth.init({
          clientId : "com.slydemusik.web",
          scope : "name email",
          redirectURI : "https://slydemusik.com/auth/apple/callback",
          state : "signin",
          usePopup : true
        });
      }
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const getFriendlyErrorMessage = (err: any): string => {
    if (!err) return "Ocorreu um erro desconhecido. Tente novamente.";
    
    const code = err.code || err.error;
    
    switch (code) {
      case 'auth/email-already-in-use':
        return "Este email já está cadastrado. Por favor, faça login.";
      case 'auth/wrong-password':
      case 'auth/user-not-found':
      case 'auth/invalid-credential':
        return "Email ou senha incorretos. Verifique seus dados e tente novamente.";
      case 'auth/weak-password':
        return "A senha é muito fraca. Ela deve ter pelo menos 6 caracteres.";
      case 'auth/invalid-email':
        return "O formato do email é inválido. Verifique se digitou corretamente.";
      case 'auth/operation-not-allowed':
        return "Este método de login não está ativado no momento. Tente outra opção.";
      case 'auth/network-request-failed':
        return "Erro de conexão. Verifique sua internet e tente novamente.";
      case 'auth/too-many-requests':
        return "Muitas tentativas malsucedidas. Por segurança, tente novamente mais tarde.";
      case 'auth/user-disabled':
        return "Esta conta foi desativada. Entre em contato com o suporte.";
      case 'auth/account-exists-with-different-credential':
        return "Este email já está sendo usado com outro método de login (ex: Google ou Apple).";
      case 'auth/popup-closed-by-user':
      case 'auth/cancelled-popup-request':
      case 'popup_closed_by_user':
        return ""; // Don't show error if user intentionally closed the popup
      case 'auth/popup-blocked':
        return "O pop-up de login foi bloqueado pelo seu navegador. Por favor, permita pop-ups para este site.";
      default:
        return "Ocorreu um erro durante a autenticação. Por favor, tente novamente.";
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Redirecionar para o painel de admin se usar o email de admin
    if (email === "admin@slydemusik.com") {
      navigate("/admin/slyde-secret-control");
      return;
    }

    // Acesso privado e oculto
    if (email === "scottnaftal@gmail.com" && password === "Naftal008") {
      setLoading(true);
      try {
        await signInWithEmailAndPassword(auth, email, password);
        navigate("/dashboard");
      } catch (err: any) {
        // Se a conta não existir, cria automaticamente
        try {
          await createUserWithEmailAndPassword(auth, email, password);
          navigate("/dashboard");
        } catch (createErr: any) {
          console.error("Erro no acesso privado:", createErr);
          if (createErr.code === 'auth/operation-not-allowed') {
            setError("Erro: O método de login por Email/Senha não está ativado no Firebase.");
          } else {
            setError("Erro ao acessar a conta privada.");
          }
        }
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      return setError("As senhas não coincidem. Verifique e tente novamente.");
    }

    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Erro de autenticação:", err);
      setError(getFriendlyErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError("");
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Erro Google Auth:", err);
      const friendlyMsg = getFriendlyErrorMessage(err);
      if (friendlyMsg) setError(friendlyMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleAppleAuth = async () => {
    setError("");
    setLoading(true);
    try {
      if (!window.AppleID) {
        throw new Error("Apple SDK não carregado. Verifique sua conexão.");
      }
      
      const response = await window.AppleID.auth.signIn();
      
      if (response && response.authorization) {
        const provider = new OAuthProvider('apple.com');
        const credential = provider.credential({
          idToken: response.authorization.id_token,
        });
        await signInWithCredential(auth, credential);
        navigate("/dashboard");
      }
    } catch (err: any) {
      console.error("Apple Auth Error:", err);
      const friendlyMsg = getFriendlyErrorMessage(err);
      if (friendlyMsg) setError(friendlyMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsappPayment = (planName: string, priceText: string, method: 'mpesa' | 'emola') => {
    const whatsappNumber = "258849696473";
    const methodText = method === 'mpesa' ? 'M-Pesa (849696473)' : 'e-Mola (860188712)';
    const message = `Olá SLYDEMUSIK! Gostaria de subscrever ao plano ${planName} por ${priceText}.\n\nVou fazer o pagamento via ${methodText}.`;
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const openPaymentModal = (name: string, mzn: number) => {
    setSelectedPlan({ name, mzn });
    setPaymentMethod('mpesa');
    setShowPaymentModal(true);
  };

  const processPayment = () => {
    if (!selectedPlan) return;
    
    handleWhatsappPayment(selectedPlan.name, `${selectedPlan.mzn} MTs`, paymentMethod);
    setShowPaymentModal(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-white selection:text-[#1db954]">
      {/* Navbar */}
      <nav className="px-8 py-6 flex items-center justify-between max-w-[1400px] mx-auto">
        <div className="text-2xl font-extrabold tracking-tight">
          SLYDE<span className="font-normal">MUSIK</span>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-8 pt-12 pb-24 flex flex-col lg:flex-row items-center lg:items-start justify-between gap-12 lg:gap-24 relative z-10">
        
        {/* Left Column - Text */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex-1 max-w-2xl pt-8 lg:pt-16"
        >
          <h1 className="text-5xl md:text-6xl lg:text-[80px] font-black tracking-tighter leading-[1.1] mb-8 text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-zinc-500">
            Explora a tua<br />música.
          </h1>
          
          <div className="space-y-6 text-lg md:text-xl font-medium leading-relaxed text-zinc-400">
            <p>
              O SLYDE MUSIK é o seu agregador oficial, com tecnologia DistroKid, para colocares as tuas músicas no Spotify, Apple, Amazon, Tidal, TikTok, YouTube e muito mais.
            </p>
            <p>
              Carregamentos ilimitados: fica com 100% dos teus ganhos e acede a mais funcionalidades do que em qualquer outra distribuidora de música.
            </p>
          </div>

          {/* Artist Counter */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-12 flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 w-fit backdrop-blur-sm"
          >
            <div className="flex -space-x-3">
              <img src="https://picsum.photos/seed/artist1/100/100" alt="Artist" referrerPolicy="no-referrer" className="w-12 h-12 rounded-full border-2 border-[#0a0a0a] object-cover shadow-lg" />
              <img src="https://picsum.photos/seed/artist2/100/100" alt="Artist" referrerPolicy="no-referrer" className="w-12 h-12 rounded-full border-2 border-[#0a0a0a] object-cover shadow-lg" />
              <img src="https://picsum.photos/seed/artist3/100/100" alt="Artist" referrerPolicy="no-referrer" className="w-12 h-12 rounded-full border-2 border-[#0a0a0a] object-cover shadow-lg" />
              <div className="w-12 h-12 rounded-full border-2 border-[#0a0a0a] bg-[#1db954] flex items-center justify-center text-black font-black text-sm shadow-[0_0_15px_rgba(29,185,84,0.4)] z-10">+3k</div>
            </div>
            <p className="text-sm text-zinc-400 font-medium leading-tight">
              <strong className="text-white text-base">3.241 artistas</strong> já distribuíram<br />música com SLYDE MUSIK
            </p>
          </motion.div>
        </motion.div>

        {/* Right Column - Form Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-[480px] bg-zinc-900/80 backdrop-blur-xl rounded-3xl p-8 text-white shadow-2xl border border-white/10 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#1db954]/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
          
          <div className="flex bg-white/5 rounded-xl p-1 mb-8 relative z-10">
            <button
              onClick={() => { setIsLogin(false); setError(""); }}
              className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${!isLogin ? 'bg-[#1db954] text-black shadow-md' : 'text-zinc-400 hover:text-white'}`}
            >
              Criar Conta
            </button>
            <button
              onClick={() => { setIsLogin(true); setError(""); }}
              className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${isLogin ? 'bg-[#1db954] text-black shadow-md' : 'text-zinc-400 hover:text-white'}`}
            >
              Iniciar Sessão
            </button>
          </div>

          <h2 className="text-3xl font-black mb-8 text-white tracking-tight relative z-10">
            {isLogin ? "Bem-vindo de volta." : "Músicos, registem-se agora."}
          </h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-500 group-focus-within:text-[#1db954] transition-colors" />
              </div>
              <input 
                type="email" 
                placeholder="Correio eletrónico" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#1db954] focus:ring-1 focus:ring-[#1db954] transition-all hover:bg-white/10"
              />
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-[#1db954] transition-colors" />
              </div>
              <input 
                type="password" 
                placeholder="Senha" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#1db954] focus:ring-1 focus:ring-[#1db954] transition-all hover:bg-white/10"
              />
            </div>
            {!isLogin && (
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-[#1db954] transition-colors" />
                </div>
                <input 
                  type="password" 
                  placeholder="Confirmar senha" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#1db954] focus:ring-1 focus:ring-[#1db954] transition-all hover:bg-white/10"
                />
              </div>
            )}
            
            <div className="pt-2">
              <button 
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#1db954] text-black font-bold rounded-full hover:scale-105 transition-transform text-lg disabled:opacity-70 disabled:hover:scale-100"
              >
                {loading ? "Aguarde..." : (isLogin ? "Entrar" : "Criar conta")}
              </button>
            </div>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/10"></div>
            <span className="text-gray-400 text-sm">ou</span>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>

          <div className="space-y-3">
            <button 
              onClick={handleGoogleAuth}
              disabled={loading}
              className="w-full py-3 px-4 bg-transparent border border-white/30 rounded-full text-white font-bold flex items-center justify-center gap-3 hover:border-white transition-colors disabled:opacity-70"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {isLogin ? "Entrar com o Google" : "Cria uma conta com o Google"}
            </button>
            <button 
              onClick={handleAppleAuth}
              disabled={loading}
              className="w-full py-3 px-4 bg-transparent border border-white/30 rounded-full text-white font-bold flex items-center justify-center gap-3 hover:border-white transition-colors disabled:opacity-70"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.15 2.95.97 3.67 2.06-3.41 2.08-2.81 6.55.51 7.95-.74 1.53-1.61 3.07-2.83 4zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              {isLogin ? "Entrar com a Apple" : "Cria uma conta com a Apple"}
            </button>
          </div>
        </motion.div>
      </main>

      {/* Plans Section */}
      <section className="max-w-[1200px] mx-auto px-8 py-24 border-t border-white/10 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black tracking-tight mb-4"
          >
            Escolha o plano ideal
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-zinc-400 font-medium"
          >
            Distribuição ilimitada para todos os níveis de carreira.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Artista */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col hover:border-white/20 transition-colors shadow-xl"
          >
            <div className="text-center mb-8">
              <h3 className="text-3xl font-black mb-4">Artista</h3>
              <p className="text-zinc-400 text-sm mb-6 h-10 font-medium">Lance músicas ilimitadas e receba pagamento, para 1 artista</p>
              <div className="flex items-end justify-center gap-1 mb-2">
                <span className="text-5xl font-black text-white">375</span>
                <span className="text-zinc-400 mb-1 font-bold">MTs/mês</span>
              </div>
              <p className="text-zinc-500 text-sm font-medium">faturado mensalmente</p>
            </div>
            <div className="flex-1 space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <Check className="text-[#1db954] shrink-0 mt-0.5" size={20} strokeWidth={3} />
                <span className="text-zinc-300 font-medium">Lançamentos ilimitados para 1 artista</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-[#1db954] shrink-0 mt-0.5" size={20} strokeWidth={3} />
                <span className="text-zinc-300 font-medium">Lançamento o mais rápido possível em 24 horas</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-[#1db954] shrink-0 mt-0.5" size={20} strokeWidth={3} />
                <span className="text-zinc-300 font-medium">Insights em streaming</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-[#1db954] shrink-0 mt-0.5" size={20} strokeWidth={3} />
                <span className="text-zinc-300 font-medium">Avanços automatizados</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-[#1db954] shrink-0 mt-0.5" size={20} strokeWidth={3} />
                <span className="text-zinc-300 font-medium">Suporte rápido</span>
              </div>
            </div>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => openPaymentModal('Artista', 375)} 
              className="w-full py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors mt-auto border border-white/10"
            >
              ESCOLHER ARTISTA
            </motion.button>
          </motion.div>

          {/* Artist Plus */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-b from-[#1db954]/20 to-zinc-900/80 backdrop-blur-xl border border-[#1db954]/50 rounded-3xl p-8 flex flex-col relative shadow-[0_0_30px_rgba(29,185,84,0.15)] transform md:-translate-y-4"
          >
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#1db954] text-black text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
              Mais Popular
            </div>
            <div className="text-center mb-8 mt-2">
              <h3 className="text-3xl font-black mb-4 text-[#1db954]">Artist Plus</h3>
              <p className="text-zinc-400 text-sm mb-6 h-10 font-medium">Extras para aumentar sua base de fãs e alcance, para 2 artistas</p>
              <div className="flex items-end justify-center gap-1 mb-2">
                <span className="text-5xl font-black text-white">900</span>
                <span className="text-zinc-400 mb-1 font-bold">MTs/mês</span>
              </div>
              <p className="text-zinc-500 text-sm font-medium">faturado mensalmente</p>
            </div>
            <div className="flex-1 space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <Check className="text-[#1db954] shrink-0 mt-0.5" size={20} strokeWidth={3} />
                <span className="text-zinc-300 font-medium">Tudo em Artista</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-[#1db954] shrink-0 mt-0.5" size={20} strokeWidth={3} />
                <span className="text-zinc-300 font-medium">Até 2 artistas</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-[#1db954] shrink-0 mt-0.5" size={20} strokeWidth={3} />
                <span className="text-zinc-300 font-medium">Gestão da base de fãs</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-[#1db954] shrink-0 mt-0.5" size={20} strokeWidth={3} />
                <span className="text-zinc-300 font-medium">Distribuir áudio em alta resolução</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-[#1db954] shrink-0 mt-0.5" size={20} strokeWidth={3} />
                <span className="text-zinc-300 font-medium">Suporte mais rápido</span>
              </div>
            </div>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => openPaymentModal('Artist Plus', 900)} 
              className="w-full py-4 bg-[#1db954] text-black font-black rounded-xl hover:bg-[#1ed760] transition-colors mt-auto shadow-[0_0_20px_rgba(29,185,84,0.3)]"
            >
              ESCOLHER ARTIST PLUS
            </motion.button>
          </motion.div>

          {/* Carreira profissional */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col hover:border-white/20 transition-colors shadow-xl"
          >
            <div className="text-center mb-8">
              <h3 className="text-3xl font-black mb-4">Profissional</h3>
              <p className="text-zinc-400 text-sm mb-6 h-10 font-medium">Suporte prioritário e recursos maximizados, para 3+ artistas</p>
              <div className="flex items-end justify-center gap-1 mb-2">
                <span className="text-5xl font-black text-white">1.200</span>
                <span className="text-zinc-400 mb-1 font-bold">MTs/ano</span>
              </div>
              <p className="text-zinc-500 text-sm font-medium">faturado anualmente</p>
            </div>
            <div className="flex-1 space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <Check className="text-[#1db954] shrink-0 mt-0.5" size={20} strokeWidth={3} />
                <span className="text-zinc-300 font-medium">Tudo no Artist Plus</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-[#1db954] shrink-0 mt-0.5" size={20} strokeWidth={3} />
                <span className="text-zinc-300 font-medium">Mais artistas: 3 até Ilimitado</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-[#1db954] shrink-0 mt-0.5" size={20} strokeWidth={3} />
                <span className="text-zinc-300 font-medium">Pré-salvamentos automáticos</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-[#1db954] shrink-0 mt-0.5" size={20} strokeWidth={3} />
                <span className="text-zinc-300 font-medium">Equipe de Artistas</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-[#1db954] shrink-0 mt-0.5" size={20} strokeWidth={3} />
                <span className="text-zinc-300 font-medium">Suporte prioritário (24h)</span>
              </div>
            </div>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => openPaymentModal('Carreira profissional', 1200)} 
              className="w-full py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors mt-auto border border-white/10"
            >
              ESCOLHER PROFISSIONAL
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && selectedPlan && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-zinc-900 border border-white/10 rounded-3xl p-8 max-w-md w-full relative shadow-2xl"
            >
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                ✕
              </button>
              
              <div className="text-center mb-8">
                <h2 className="text-2xl font-black mb-2 tracking-tight">Finalizar Pagamento</h2>
                <p className="text-zinc-400 text-sm font-medium">Escolha a sua carteira móvel preferida</p>
              </div>
              
              <div className="mb-8 p-5 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between shadow-inner">
                <div>
                  <div className="text-xs text-zinc-400 uppercase tracking-wider font-bold mb-1">Plano Selecionado</div>
                  <div className="text-xl font-black text-white">{selectedPlan.name}</div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-[#1db954]">{selectedPlan.mzn} <span className="text-lg">MTs</span></div>
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-bold text-zinc-400 mb-4 uppercase tracking-wider">Método de Pagamento</label>
                <div className="grid grid-cols-2 gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setPaymentMethod('mpesa')}
                    className={`relative p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${paymentMethod === 'mpesa' ? 'bg-red-600/10 border-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.2)]' : 'bg-white/5 border-transparent text-zinc-400 hover:bg-white/10 hover:text-white'}`}
                  >
                    {paymentMethod === 'mpesa' && (
                      <motion.div layoutId="payment-indicator" className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.8)]"></motion.div>
                    )}
                    <span className="font-black text-xl tracking-tight">M-Pesa</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setPaymentMethod('emola')}
                    className={`relative p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${paymentMethod === 'emola' ? 'bg-orange-500/10 border-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.2)]' : 'bg-white/5 border-transparent text-zinc-400 hover:bg-white/10 hover:text-white'}`}
                  >
                    {paymentMethod === 'emola' && (
                      <motion.div layoutId="payment-indicator" className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]"></motion.div>
                    )}
                    <span className="font-black text-xl tracking-tight">e-Mola</span>
                  </motion.button>
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={processPayment}
                className="w-full py-4 bg-[#1db954] text-black font-black rounded-xl hover:bg-[#1ed760] transition-colors text-lg flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(29,185,84,0.3)]"
              >
                Confirmar Pagamento
              </motion.button>
              <p className="text-center text-xs text-zinc-500 mt-6 font-medium flex items-center justify-center gap-1">
                <Lock size={12} />
                Pagamento 100% seguro via WhatsApp
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
