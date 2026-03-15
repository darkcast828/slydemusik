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
  const [currency, setCurrency] = useState<'MZN' | 'USD'>('MZN');

  // Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{name: string, mzn: number, usd: number} | null>(null);
  const [paymentCurrency, setPaymentCurrency] = useState<'MZN' | 'USD'>('MZN');
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'emola' | 'paypal'>('mpesa');

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

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Redirecionar para o painel de admin se usar o email de admin
    if (email === "admin@slydemusik.com") {
      navigate("/admin/slyde-secret-control");
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      return setError("As senhas não coincidem.");
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
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError("Este email já está em uso. Tente iniciar sessão.");
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setError("Email ou senha incorretos.");
      } else if (err.code === 'auth/weak-password') {
        setError("A senha deve ter pelo menos 6 caracteres.");
      } else if (err.code === 'auth/invalid-email') {
        setError("O formato do email é inválido.");
      } else {
        setError(`Erro: ${err.message || 'Tente novamente.'}`);
      }
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
      console.error(err);
      if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
        // User intentionally closed the popup, no need to show a scary error
        setError("");
      } else {
        setError("Erro ao autenticar com o Google.");
      }
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
      if (err.error === 'popup_closed_by_user' || err.code === 'auth/cancelled-popup-request') {
        console.log("Login com Apple cancelado pelo usuário.");
        setError("");
      } else {
        console.error("Apple Auth Error:", err);
        setError(`Erro ao autenticar com a Apple: ${err.message || err.error || 'Tente novamente.'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePaypalPayment = (planName: string, price: number) => {
    const businessEmail = "charlestembe928@gmail.com";
    const url = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${encodeURIComponent(businessEmail)}&item_name=${encodeURIComponent(`Plano ${planName} - SLYDEMUSIK`)}&amount=${price}&currency_code=USD`;
    window.open(url, '_blank');
  };

  const handleWhatsappPayment = (planName: string, priceText: string, method: 'mpesa' | 'emola') => {
    const whatsappNumber = "258849696473";
    const methodText = method === 'mpesa' ? 'M-Pesa (849696473)' : 'e-Mola (860188712)';
    const message = `Olá SLYDEMUSIK! Gostaria de subscrever ao plano ${planName} por ${priceText}.\n\nVou fazer o pagamento via ${methodText}.`;
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const openPaymentModal = (name: string, mzn: number, usd: number) => {
    setSelectedPlan({ name, mzn, usd });
    setPaymentCurrency(currency);
    setPaymentMethod(currency === 'USD' ? 'paypal' : 'mpesa');
    setShowPaymentModal(true);
  };

  const processPayment = () => {
    if (!selectedPlan) return;
    
    if (paymentMethod === 'paypal') {
      handlePaypalPayment(selectedPlan.name, selectedPlan.usd);
    } else {
      handleWhatsappPayment(selectedPlan.name, `${selectedPlan.mzn} MTs`, paymentMethod);
    }
    setShowPaymentModal(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-white selection:text-[#1db954]">
      {/* Navbar */}
      <nav className="px-8 py-6 flex items-center justify-between max-w-[1400px] mx-auto">
        <div className="text-2xl font-extrabold tracking-tight">
          SLYDE<span className="font-normal">MUSIK</span>
        </div>
        <div 
          onClick={() => setIsLogin(!isLogin)}
          className="flex items-center gap-1 text-sm font-bold cursor-pointer hover:text-[#1db954] transition-colors"
        >
          {isLogin ? "Criar conta" : "Iniciar sessão"} <ChevronDown size={16} strokeWidth={3} />
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-8 pt-12 pb-24 flex flex-col lg:flex-row items-center lg:items-start justify-between gap-12 lg:gap-24">
        
        {/* Left Column - Text */}
        <div className="flex-1 max-w-2xl pt-8 lg:pt-16">
          <h1 className="text-5xl md:text-6xl lg:text-[80px] font-extrabold tracking-tight leading-[1.1] mb-8">
            Explora a tua<br />música.
          </h1>
          
          <div className="space-y-6 text-lg md:text-xl font-medium leading-relaxed text-gray-300">
            <p>
              O SLYDE MUSIK é a forma mais fácil de colocares as tuas músicas no Spotify, Apple, Amazon, Tidal, TikTok, YouTube e muito mais.
            </p>
            <p>
              Carregamentos ilimitados: fica com 100% dos teus ganhos e acede a mais funcionalidades do que em qualquer outra distribuidora de música.
            </p>
          </div>

          {/* Artist Counter */}
          <div className="mt-12 flex items-center gap-4">
            <div className="flex -space-x-3">
              <img src="https://picsum.photos/seed/artist1/100/100" alt="Artist" referrerPolicy="no-referrer" className="w-10 h-10 rounded-full border-2 border-[#0a0a0a] object-cover" />
              <img src="https://picsum.photos/seed/artist2/100/100" alt="Artist" referrerPolicy="no-referrer" className="w-10 h-10 rounded-full border-2 border-[#0a0a0a] object-cover" />
              <img src="https://picsum.photos/seed/artist3/100/100" alt="Artist" referrerPolicy="no-referrer" className="w-10 h-10 rounded-full border-2 border-[#0a0a0a] object-cover" />
              <div className="w-10 h-10 rounded-full border-2 border-[#0a0a0a] bg-[#1db954] flex items-center justify-center text-black font-bold text-xs">+3k</div>
            </div>
            <p className="text-sm text-gray-400 font-medium leading-tight">
              <strong className="text-white">3.241 artistas</strong> já distribuíram<br />música com SLYDE MUSIK
            </p>
          </div>
        </div>

        {/* Right Column - Form Card */}
        <div className="w-full max-w-[480px] bg-[#1a1a1a] rounded-xl p-8 text-white shadow-2xl border border-white/10">
          <h2 className="text-2xl font-bold mb-6 text-white">
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
        </div>
      </main>

      {/* Plans Section */}
      <section className="max-w-[1200px] mx-auto px-8 py-24 border-t border-white/10">
        <div className="flex justify-center mb-12">
          <div className="bg-white/5 p-1 rounded-lg inline-flex">
            <button 
              onClick={() => setCurrency('MZN')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${currency === 'MZN' ? 'bg-[#1db954] text-black' : 'text-gray-400 hover:text-white'}`}
            >
              Meticais (MTs)
            </button>
            <button 
              onClick={() => setCurrency('USD')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${currency === 'USD' ? 'bg-[#0073C7] text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Dólares (USD)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Artista */}
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-8 flex flex-col">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold mb-4">Artista</h3>
              <p className="text-gray-400 text-sm mb-6 h-10">Lance músicas ilimitadas e receba pagamento, para 1 artista</p>
              <div className="flex items-end justify-center gap-1 mb-2">
                <span className="text-4xl font-bold">{currency === 'USD' ? '$5' : '375 MTs'}</span>
                <span className="text-gray-400 mb-1">por ano</span>
              </div>
              <p className="text-gray-500 text-sm">faturado anualmente</p>
            </div>
            <div className="flex-1 space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <Check className="text-[#1db954] shrink-0 mt-0.5" size={20} />
                <span className="text-gray-300">Lançamentos ilimitados para 1 artista</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-[#1db954] shrink-0 mt-0.5" size={20} />
                <span className="text-gray-300">Lançamento o mais rápido possível em 24 horas</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-[#1db954] shrink-0 mt-0.5" size={20} />
                <span className="text-gray-300">Insights em streaming</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-[#1db954] shrink-0 mt-0.5" size={20} />
                <span className="text-gray-300">Avanços automatizados</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-[#1db954] shrink-0 mt-0.5" size={20} />
                <span className="text-gray-300">Suporte rápido</span>
              </div>
            </div>
            <button onClick={() => openPaymentModal('Artista', 375, 5)} className="w-full py-4 bg-[#fcd34d] text-black font-bold rounded-lg hover:bg-[#fbbf24] transition-colors mt-auto">
              ESCOLHA ARTISTA
            </button>
          </div>

          {/* Artist Plus */}
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-8 flex flex-col relative">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold mb-4">Artist Plus</h3>
              <p className="text-gray-400 text-sm mb-6 h-10">Extras para aumentar sua base de fãs e alcance, para 2 artistas</p>
              <div className="flex items-end justify-center gap-1 mb-2">
                <span className="text-4xl font-bold">{currency === 'USD' ? '$15' : '1.125 MTs'}</span>
                <span className="text-gray-400 mb-1">por ano</span>
              </div>
              <p className="text-gray-500 text-sm">faturado anualmente</p>
            </div>
            <div className="flex-1 space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <Check className="text-[#1db954] shrink-0 mt-0.5" size={20} />
                <span className="text-gray-300">Tudo em Artista</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-[#1db954] shrink-0 mt-0.5" size={20} />
                <span className="text-gray-300">Até 2 artistas</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-[#1db954] shrink-0 mt-0.5" size={20} />
                <span className="text-gray-300">Gestão da base de fãs</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-[#1db954] shrink-0 mt-0.5" size={20} />
                <span className="text-gray-300">Distribuir áudio em alta resolução</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-[#1db954] shrink-0 mt-0.5" size={20} />
                <span className="text-gray-300">Suporte mais rápido</span>
              </div>
            </div>
            <button onClick={() => openPaymentModal('Artist Plus', 1125, 15)} className="w-full py-4 bg-[#fcd34d] text-black font-bold rounded-lg hover:bg-[#fbbf24] transition-colors mt-auto">
              ESCOLHA O ARTIST PLUS
            </button>
          </div>

          {/* Carreira profissional */}
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-8 flex flex-col">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold mb-4">Carreira profissional</h3>
              <p className="text-gray-400 text-sm mb-6 h-10">Suporte prioritário e recursos maximizados, para 3+ artistas</p>
              <div className="flex items-end justify-center gap-1 mb-2">
                <span className="text-4xl font-bold">{currency === 'USD' ? '$25' : '1.875 MTs'}</span>
                <span className="text-gray-400 mb-1">por ano</span>
              </div>
              <p className="text-gray-500 text-sm">faturado anualmente</p>
            </div>
            <div className="flex-1 space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <Check className="text-[#1db954] shrink-0 mt-0.5" size={20} />
                <span className="text-gray-300">Tudo no Artist Plus</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-[#1db954] shrink-0 mt-0.5" size={20} />
                <span className="text-gray-300">Mais artistas: 3 até Unlimited</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-[#1db954] shrink-0 mt-0.5" size={20} />
                <span className="text-gray-300">Pré-salvamentos automáticos de novos lançamentos</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-[#1db954] shrink-0 mt-0.5" size={20} />
                <span className="text-gray-300">Convide membros da equipe para a Equipe de Artistas</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-[#1db954] shrink-0 mt-0.5" size={20} />
                <span className="text-gray-300">Suporte prioritário (24 horas)</span>
              </div>
            </div>
            <button onClick={() => openPaymentModal('Carreira profissional', 1875, 25)} className="w-full py-4 bg-[#fcd34d] text-black font-bold rounded-lg hover:bg-[#fbbf24] transition-colors mt-auto">
              CONTINUE
            </button>
          </div>
        </div>
      </section>

      {/* Payment Modal */}
      {showPaymentModal && selectedPlan && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#121212] border border-white/10 rounded-2xl p-8 max-w-md w-full relative">
            <button 
              onClick={() => setShowPaymentModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              ✕
            </button>
            
            <h2 className="text-2xl font-bold mb-6">Finalizar Pagamento</h2>
            
            <div className="mb-6 p-4 bg-white/5 rounded-xl">
              <div className="text-sm text-gray-400 mb-1">Plano Selecionado</div>
              <div className="text-xl font-bold">{selectedPlan.name}</div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-400 mb-3">Moeda de Pagamento</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setPaymentCurrency('MZN');
                    setPaymentMethod('mpesa');
                  }}
                  className={`py-3 rounded-lg font-bold border transition-colors ${paymentCurrency === 'MZN' ? 'bg-[#1db954] border-[#1db954] text-black' : 'bg-transparent border-white/20 text-white hover:border-white/50'}`}
                >
                  Meticais (MTs)
                </button>
                <button
                  onClick={() => {
                    setPaymentCurrency('USD');
                    setPaymentMethod('paypal');
                  }}
                  className={`py-3 rounded-lg font-bold border transition-colors ${paymentCurrency === 'USD' ? 'bg-[#0073C7] border-[#0073C7] text-white' : 'bg-transparent border-white/20 text-white hover:border-white/50'}`}
                >
                  Dólares (USD)
                </button>
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-400 mb-3">Método de Pagamento</label>
              {paymentCurrency === 'MZN' ? (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPaymentMethod('mpesa')}
                    className={`py-3 rounded-lg font-bold border transition-colors ${paymentMethod === 'mpesa' ? 'bg-red-600 border-red-600 text-white' : 'bg-transparent border-white/20 text-white hover:border-white/50'}`}
                  >
                    M-Pesa
                  </button>
                  <button
                    onClick={() => setPaymentMethod('emola')}
                    className={`py-3 rounded-lg font-bold border transition-colors ${paymentMethod === 'emola' ? 'bg-orange-500 border-orange-500 text-white' : 'bg-transparent border-white/20 text-white hover:border-white/50'}`}
                  >
                    e-Mola
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={() => setPaymentMethod('paypal')}
                    className={`py-3 rounded-lg font-bold border transition-colors ${paymentMethod === 'paypal' ? 'bg-[#0073C7] border-[#0073C7] text-white' : 'bg-transparent border-white/20 text-white hover:border-white/50'}`}
                  >
                    PayPal
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mb-8">
              <span className="text-gray-400">Total a pagar:</span>
              <span className="text-3xl font-bold">
                {paymentCurrency === 'MZN' ? `${selectedPlan.mzn} MTs` : `${selectedPlan.usd} $`}
              </span>
            </div>

            <button 
              onClick={processPayment}
              className="w-full py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform text-lg"
            >
              Confirmar Pagamento
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
