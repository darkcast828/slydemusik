import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { CheckCircle2, Music, Lock, LogOut } from "lucide-react";

export default function Payment() {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentCurrency, setPaymentCurrency] = useState<'MZN' | 'USD'>('MZN');
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'emola' | 'paypal'>('mpesa');

  const plan = {
    name: "Plano Artista",
    mzn: 375,
    usd: 5
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handlePayment = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      // 1. Update the user's profile in Firestore to grant access
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        hasPaid: true
      });
      
      // 2. Open the actual payment link in a new tab
      if (paymentMethod === 'paypal') {
        const businessEmail = "charlestembe928@gmail.com";
        const url = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${encodeURIComponent(businessEmail)}&item_name=${encodeURIComponent(`Plano ${plan.name} - SLYDEMUSIK`)}&amount=${plan.usd}&currency_code=USD`;
        window.open(url, '_blank');
      } else {
        const whatsappNumber = "258849696473";
        const methodText = paymentMethod === 'mpesa' ? 'M-Pesa (849696473)' : 'e-Mola (860188712)';
        const message = `Olá SLYDEMUSIK! Gostaria de subscrever ao plano ${plan.name} por ${plan.mzn} MTs.\n\nVou fazer o pagamento via ${methodText}. Meu email de cadastro é: ${currentUser.email}`;
        const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
      }
      
      // 3. Redirect the current window to the dashboard
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);
      
    } catch (error) {
      console.error("Payment error:", error);
      alert("Ocorreu um erro ao processar o pagamento.");
      setLoading(false);
    }
  };

  if (userProfile?.hasPaid) {
    navigate("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        
        {/* Left Side - Info */}
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2 text-[#1db954]">
              <Music size={32} strokeWidth={3} />
              <span className="text-2xl font-black tracking-tighter uppercase">Slyde</span>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium"
            >
              <LogOut size={16} />
              Sair
            </button>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Distribua sua música para o mundo todo.
          </h1>
          
          <p className="text-gray-400 text-lg">
            Para acessar o painel de distribuição e enviar suas músicas para o Spotify, Apple Music, TikTok e mais de 45 lojas, você precisa de uma assinatura ativa.
          </p>
          
          <ul className="space-y-4 pt-4">
            {[
              "Uploads ilimitados de músicas e álbuns",
              "Distribuição para mais de 45 plataformas",
              "Fique com 100% dos seus royalties",
              "Estatísticas detalhadas de streams",
              "Suporte prioritário"
            ].map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-gray-300">
                <CheckCircle2 className="text-[#1db954] shrink-0" size={20} />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          {/* Artist Counter */}
          <div className="mt-8 pt-8 border-t border-white/10 flex items-center gap-4">
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

        {/* Right Side - Pricing Card */}
        <div className="bg-[#111] border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1db954] to-[#1ed760]"></div>
          
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-2xl font-bold">Plano Artista</h3>
              <p className="text-gray-400 text-sm mt-1">Tudo que você precisa para lançar.</p>
            </div>
            <div className="bg-[#1db954]/20 text-[#1db954] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              Anual
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-400 mb-3">Moeda de Pagamento</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setPaymentCurrency('MZN');
                  setPaymentMethod('mpesa');
                }}
                className={`py-2 rounded-lg font-bold border transition-colors ${paymentCurrency === 'MZN' ? 'bg-[#1db954] border-[#1db954] text-black' : 'bg-transparent border-white/20 text-white hover:border-white/50'}`}
              >
                Meticais (MTs)
              </button>
              <button
                onClick={() => {
                  setPaymentCurrency('USD');
                  setPaymentMethod('paypal');
                }}
                className={`py-2 rounded-lg font-bold border transition-colors ${paymentCurrency === 'USD' ? 'bg-[#0073C7] border-[#0073C7] text-white' : 'bg-transparent border-white/20 text-white hover:border-white/50'}`}
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
                  className={`py-2 rounded-lg font-bold border transition-colors ${paymentMethod === 'mpesa' ? 'bg-red-600 border-red-600 text-white' : 'bg-transparent border-white/20 text-white hover:border-white/50'}`}
                >
                  M-Pesa
                </button>
                <button
                  onClick={() => setPaymentMethod('emola')}
                  className={`py-2 rounded-lg font-bold border transition-colors ${paymentMethod === 'emola' ? 'bg-orange-500 border-orange-500 text-white' : 'bg-transparent border-white/20 text-white hover:border-white/50'}`}
                >
                  e-Mola
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => setPaymentMethod('paypal')}
                  className={`py-2 rounded-lg font-bold border transition-colors ${paymentMethod === 'paypal' ? 'bg-[#0073C7] border-[#0073C7] text-white' : 'bg-transparent border-white/20 text-white hover:border-white/50'}`}
                >
                  PayPal
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mb-8">
            <span className="text-gray-400">Total a pagar:</span>
            <span className="text-3xl font-bold">
              {paymentCurrency === 'MZN' ? `${plan.mzn} MTs` : `${plan.usd} $`}
            </span>
          </div>
          
          <button 
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-[#1db954] hover:bg-[#1ed760] text-black font-bold py-4 px-8 rounded-full text-lg uppercase tracking-widest transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(29,185,84,0.3)] disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black"></div>
            ) : (
              <>
                <Lock size={20} />
                Confirmar Pagamento
              </>
            )}
          </button>
          
          <p className="text-center text-gray-500 text-xs mt-4">
            Ao confirmar, você será redirecionado para concluir o pagamento.
          </p>
        </div>

      </div>
    </div>
  );
}
