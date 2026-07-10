import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Music, Lock, Clock, LogOut } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function SubscriptionScreens() {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<{name: string, mzn: number} | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'emola'>('mpesa');

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const processPayment = async () => {
    if (!selectedPlan || !currentUser) return;
    
    try {
      const userDocRef = doc(db, 'users', currentUser.uid);

      await updateDoc(userDocRef, {
        paymentSubmitted: true,
        status: 'em_revisao'
      });

      // Open WhatsApp
      const whatsappNumber = "258849696473";
      const methodText = paymentMethod === 'mpesa' ? 'M-Pesa' : 'e-Mola';
      const message = `Olá SLYDEMUSIK! Gostaria de subscrever ao plano ${selectedPlan.name} por ${selectedPlan.mzn} MTs.\n\nVou fazer o pagamento via ${methodText}.`;
      const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
      alert("Erro ao processar o pagamento.");
    }
  };

  if (userProfile?.paymentSubmitted) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4 relative">
        <button 
          onClick={handleLogout}
          className="absolute top-6 right-6 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Sair</span>
        </button>
        <div className="bg-zinc-900/80 p-8 rounded-3xl max-w-md w-full text-center border border-white/10 shadow-2xl">
          <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-10 h-10 text-orange-500" />
          </div>
          <h2 className="text-2xl font-black text-white mb-4">Conta em Revisão</h2>
          <p className="text-zinc-400 mb-8 leading-relaxed">
            Recebemos a sua solicitação de pagamento. A sua conta está atualmente em revisão e será ativada assim que confirmarmos o pagamento via WhatsApp.
          </p>
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <p className="text-sm text-zinc-300">
              Se ainda não efetuou o pagamento ou se o processo demorar, por favor contacte o nosso suporte no WhatsApp.
            </p>
            <a 
              href="https://wa.me/258849696473" 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-4 block w-full py-3 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-colors"
            >
              Contactar Suporte
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Se o utilizador não selecionou um plano, mostramos os planos
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8 relative">
      <button 
        onClick={handleLogout}
        className="absolute top-6 right-6 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors z-50"
      >
        <LogOut size={20} />
        <span className="font-medium">Sair</span>
      </button>
      {!selectedPlan ? (
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-black mb-4">Escolha o seu plano</h1>
            <p className="text-xl text-zinc-400">Para continuar e aceder ao painel, por favor selecione um plano.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Artista */}
            <div className="bg-zinc-900/50 rounded-3xl p-8 border border-white/10 flex flex-col hover:border-[#1db954]/50 transition-colors">
              <h3 className="text-2xl font-bold mb-2">Artista</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-black">375 MT</span>
                <span className="text-zinc-400 font-medium">/ano</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3"><Check className="text-[#1db954] shrink-0" size={20} /><span className="text-zinc-300">Carregar músicas ilimitadas</span></li>
                <li className="flex items-start gap-3"><Check className="text-[#1db954] shrink-0" size={20} /><span className="text-zinc-300">1 Artista</span></li>
                <li className="flex items-start gap-3"><Check className="text-[#1db954] shrink-0" size={20} /><span className="text-zinc-300">Selo de verificação</span></li>
              </ul>
              <button 
                onClick={() => setSelectedPlan({ name: 'Artista', mzn: 375 })}
                className="w-full py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors"
              >
                ESCOLHER ARTISTA
              </button>
            </div>

            {/* Artist Plus */}
            <div className="bg-zinc-900 rounded-3xl p-8 border-2 border-[#1db954] flex flex-col relative transform md:-translate-y-4 shadow-2xl">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1db954] text-black text-xs font-black px-4 py-1 rounded-full">
                MAIS POPULAR
              </div>
              <h3 className="text-2xl font-bold mb-2">Artist Plus</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-black">900 MT</span>
                <span className="text-zinc-400 font-medium">/ano</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3"><Check className="text-[#1db954] shrink-0" size={20} /><span className="text-zinc-300">Tudo do plano Artista</span></li>
                <li className="flex items-start gap-3"><Check className="text-[#1db954] shrink-0" size={20} /><span className="text-zinc-300">2 Artistas</span></li>
                <li className="flex items-start gap-3"><Check className="text-[#1db954] shrink-0" size={20} /><span className="text-zinc-300">Estatísticas diárias</span></li>
                <li className="flex items-start gap-3"><Check className="text-[#1db954] shrink-0" size={20} /><span className="text-zinc-300">Lançamentos sincronizados</span></li>
              </ul>
              <button 
                onClick={() => setSelectedPlan({ name: 'Artist Plus', mzn: 900 })}
                className="w-full py-4 bg-[#1db954] text-black font-black rounded-xl hover:bg-[#1ed760] transition-colors shadow-[0_0_20px_rgba(29,185,84,0.3)]"
              >
                ESCOLHER ARTIST PLUS
              </button>
            </div>

            {/* Carreira profissional */}
            <div className="bg-zinc-900/50 rounded-3xl p-8 border border-white/10 flex flex-col hover:border-[#1db954]/50 transition-colors">
              <h3 className="text-2xl font-bold mb-2">Profissional</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-black">1.200 MT</span>
                <span className="text-zinc-400 font-medium">/ano</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3"><Check className="text-[#1db954] shrink-0" size={20} /><span className="text-zinc-300">Tudo do Artist Plus</span></li>
                <li className="flex items-start gap-3"><Check className="text-[#1db954] shrink-0" size={20} /><span className="text-zinc-300">5 a 100 Artistas</span></li>
              </ul>
              <button 
                onClick={() => setSelectedPlan({ name: 'Carreira profissional', mzn: 1200 })}
                className="w-full py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors"
              >
                ESCOLHER PROFISSIONAL
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="bg-zinc-900/80 p-8 rounded-3xl max-w-md w-full border border-white/10 shadow-2xl relative">
            <button 
              onClick={() => setSelectedPlan(null)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              ✕
            </button>
            
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black mb-2 tracking-tight">Finalizar Pagamento</h2>
              <p className="text-zinc-400 text-sm font-medium">Plano selecionado: {selectedPlan.name} ({selectedPlan.mzn} MT)</p>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-bold text-zinc-300 mb-4 text-center">Selecionar método</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setPaymentMethod('mpesa')}
                  className={`relative p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${paymentMethod === 'mpesa' ? 'bg-red-600/10 border-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.2)]' : 'bg-white/5 border-transparent text-zinc-400 hover:bg-white/10 hover:text-white'}`}
                >
                  {paymentMethod === 'mpesa' && (
                    <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.8)]"></div>
                  )}
                  <span className="font-black text-xl tracking-tight">M-Pesa</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('emola')}
                  className={`relative p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${paymentMethod === 'emola' ? 'bg-orange-500/10 border-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.2)]' : 'bg-white/5 border-transparent text-zinc-400 hover:bg-white/10 hover:text-white'}`}
                >
                  {paymentMethod === 'emola' && (
                    <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]"></div>
                  )}
                  <span className="font-black text-xl tracking-tight">e-Mola</span>
                </button>
              </div>
            </div>

            <button 
              onClick={processPayment}
              className="w-full py-4 bg-[#1db954] text-black font-black rounded-xl hover:bg-[#1ed760] transition-colors text-lg flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(29,185,84,0.3)]"
            >
              Confirmar Pagamento
            </button>
            <p className="text-center text-xs text-zinc-500 mt-6 font-medium flex items-center justify-center gap-1">
              <Lock size={12} />
              Pagamento 100% seguro via M-Pesa e e-Mola
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
