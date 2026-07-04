import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Music, Zap, Globe2, CreditCard, BarChart3, ShieldCheck, 
  Upload, Headphones, ArrowRight, CheckCircle2, PlayCircle, 
  Instagram, Twitter, Youtube, Star, X
} from 'lucide-react';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#1ED760] selection:text-black font-sans overflow-x-hidden">
      
      {/* Video Modal */}
      {showVideo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-5xl aspect-video bg-[#0D0D0D] rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
          >
            <button 
              onClick={() => setShowVideo(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-md"
            >
              <X size={20} />
            </button>
            <iframe 
              className="w-full h-full"
              src="https://www.youtube.com/embed/LXb3EKWsInQ?autoplay=1" 
              title="Demonstração Slyde" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </motion.div>
        </div>
      )}

      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#050505]/80 backdrop-blur-xl border-b border-white/[0.08] shadow-2xl py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <SlydeLogo />

          <div className="hidden md:flex items-center gap-8">
            <a href="#recursos" className="text-sm font-medium text-[#B8B8B8] hover:text-white transition-colors">Recursos</a>
            <a href="#precos" className="text-sm font-medium text-[#B8B8B8] hover:text-white transition-colors">Preços</a>
            <a href="#lojas" className="text-sm font-medium text-[#B8B8B8] hover:text-white transition-colors">Lojas</a>
            <a href="#faq" className="text-sm font-medium text-[#B8B8B8] hover:text-white transition-colors">FAQ</a>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/login" className="text-sm font-medium text-[#B8B8B8] hover:text-white transition-colors hidden sm:block">Login</Link>
            <a href="https://wa.me/258849696473?text=Ol%C3%A1%2C%20gostaria%20de%20assinar%20o%20plano%20Iniciante" target="_blank" rel="noopener noreferrer" className="bg-[#1ED760] text-black px-6 py-2.5 rounded-full text-sm font-bold hover:bg-[#18C964] transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(30,215,96,0.3)] hover:shadow-[0_0_30px_rgba(30,215,96,0.5)]">
              Começar Agora
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-40 pb-20 md:pt-52 md:pb-32 overflow-hidden">
        {/* Glow background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#1ED760]/10 rounded-full blur-[120px] opacity-70 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column */}
          <div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] text-white font-medium text-sm mb-8 backdrop-blur-md shadow-lg"
            >
              <Zap size={16} className="text-[#1ED760]" />
              Distribuição Musical Profissional
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-[80px] font-black tracking-tighter mb-6 leading-[1.1]"
            >
              Sua música em todas as <span className="text-[#1ED760]">plataformas</span> do mundo.
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-[#B8B8B8] mb-10 max-w-xl font-medium leading-relaxed"
            >
              Distribua para Spotify, Apple Music, Deezer, TikTok, YouTube Music e mais de 150 plataformas mantendo 100% dos seus direitos.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center gap-4"
            >
              <a href="https://wa.me/258849696473?text=Ol%C3%A1%2C%20gostaria%20de%20assinar%20um%20plano%20de%20distribui%C3%A7%C3%A3o" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#1ED760] text-black px-8 py-4 rounded-full text-lg font-bold hover:bg-[#18C964] transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(30,215,96,0.3)]">
                Distribuir Agora
                <ArrowRight size={20} />
              </a>
              <button 
                onClick={() => setShowVideo(true)}
                className="inline-flex items-center gap-2 bg-white/[0.05] text-white border border-white/[0.08] px-8 py-4 rounded-full text-lg font-bold hover:bg-white/[0.1] transition-all hover:scale-105 active:scale-95"
              >
                <PlayCircle size={20} />
                Ver Demonstração
              </button>
            </motion.div>
          </div>

          {/* Right Column (Dashboard Mockup) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotateX: 15 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 100, damping: 20 }}
            className="relative perspective-1000 hidden md:block"
          >
            <div className="absolute -inset-1 bg-gradient-to-tr from-[#1ED760]/30 to-purple-500/30 rounded-[32px] blur-2xl opacity-50"></div>
            <div className="relative bg-[#0D0D0D]/90 backdrop-blur-xl border border-white/[0.08] rounded-[28px] p-8 shadow-2xl overflow-hidden transform-gpu">
              
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-white font-bold text-lg">Visão Geral</h3>
                  <p className="text-[#B8B8B8] text-sm">Últimos 30 dias</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1ED760] to-[#18C964] p-[2px]">
                  <div className="w-full h-full bg-[#0D0D0D] rounded-full overflow-hidden border border-black">
                     <img src="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=100&h=100&fit=crop" className="w-full h-full object-cover" alt="Profile" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white/[0.03] border border-white/[0.05] rounded-2xl p-5 hover:bg-white/[0.05] transition-colors">
                  <p className="text-[#B8B8B8] text-xs font-medium mb-1 tracking-widest">STREAMS</p>
                  <p className="text-3xl font-black text-white mb-2 tracking-tight">1.2M</p>
                  <div className="flex items-center gap-1 text-[#1ED760] text-xs font-bold">
                    <ArrowRight size={12} className="-rotate-45" /> +24%
                  </div>
                </div>
                <div className="bg-white/[0.03] border border-white/[0.05] rounded-2xl p-5 hover:bg-white/[0.05] transition-colors">
                  <p className="text-[#B8B8B8] text-xs font-medium mb-1 tracking-widest">RECEITA</p>
                  <p className="text-3xl font-black text-white mb-2 tracking-tight">$4,250</p>
                  <div className="flex items-center gap-1 text-[#1ED760] text-xs font-bold">
                    <ArrowRight size={12} className="-rotate-45" /> +12%
                  </div>
                </div>
              </div>

              <div className="h-40 w-full flex items-end gap-3 mb-6">
                {[40, 70, 45, 90, 65, 85, 120, 95, 130].map((h, i) => (
                  <motion.div 
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${(h/130)*100}%` }}
                    transition={{ delay: 0.5 + (i * 0.1), type: 'spring' }}
                    className={`flex-1 rounded-t-md ${i === 8 ? 'bg-[#1ED760] shadow-[0_0_20px_rgba(30,215,96,0.5)]' : 'bg-white/10'}`}
                  />
                ))}
              </div>

              {/* Floating Element */}
              <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
                className="absolute -right-8 -bottom-8 bg-[#181818] border border-white/[0.08] p-5 rounded-3xl shadow-2xl flex items-center gap-5 backdrop-blur-xl"
              >
                <div className="w-12 h-12 bg-[#1ED760]/10 rounded-2xl flex items-center justify-center">
                  <CheckCircle2 className="text-[#1ED760]" size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Lançamento Aprovado</p>
                  <p className="text-xs text-[#B8B8B8] font-medium">Spotify, Apple Music +148</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Logos Section */}
      <section id="lojas" className="py-12 border-y border-white/[0.05] bg-[#050505]/50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-8 md:gap-16 flex-wrap opacity-50 hover:opacity-100 transition-opacity duration-500 grayscale hover:grayscale-0">
           <div className="text-2xl font-bold tracking-tighter text-zinc-500 hover:text-[#1DB954] transition-colors cursor-pointer flex items-center gap-2">
             <div className="w-8 h-8 rounded-full bg-zinc-500 flex items-center justify-center text-[#050505] text-sm hover:bg-[#1DB954]">S</div>
             Spotify
           </div>
           <div className="text-2xl font-bold tracking-tighter text-zinc-500 hover:text-[#fa243c] transition-colors cursor-pointer flex items-center gap-2">
             <Music size={28} /> Apple Music
           </div>
           <div className="text-2xl font-bold tracking-tighter text-zinc-500 hover:text-[#000] hover:bg-white hover:px-3 rounded-lg transition-all cursor-pointer flex items-center gap-2">
             TikTok
           </div>
           <div className="text-2xl font-bold tracking-tighter text-zinc-500 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-purple-500 hover:to-orange-500 transition-all cursor-pointer flex items-center gap-2">
             Deezer
           </div>
           <div className="text-2xl font-bold tracking-tighter text-zinc-500 hover:text-white transition-colors cursor-pointer flex items-center gap-2">
             <Youtube size={28} className="hover:text-red-500 transition-colors" /> YouTube Music
           </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="recursos" className="py-40 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter leading-tight">Tudo que você precisa. <br/><span className="text-[#B8B8B8]">E muito mais.</span></h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <BenefitCard 
              icon={<Globe2 size={24} />}
              title="Distribuição Global"
              desc="Sua música em mais de 150 plataformas de streaming e lojas digitais em todo o mundo, simultaneamente."
            />
            <BenefitCard 
              icon={<CreditCard size={24} />}
              title="Pagamentos Rápidos"
              desc="Receba seus royalties diretamente na sua conta, com relatórios transparentes e saques descomplicados."
            />
            <BenefitCard 
              icon={<BarChart3 size={24} />}
              title="Estatísticas em Tempo Real"
              desc="Acompanhe streams, playlists e crescimento do seu público com nosso painel analítico avançado."
            />
            <BenefitCard 
              icon={<ShieldCheck size={24} />}
              title="Direitos Preservados"
              desc="Você é o dono da sua arte. Mantenha 100% dos seus direitos autorais e masters para sempre."
            />
            <BenefitCard 
              icon={<Upload size={24} />}
              title="Upload Ilimitado"
              desc="Sem limites para a sua criatividade. Envie quantas faixas, EPs ou álbuns quiser nos planos premium."
            />
            <BenefitCard 
              icon={<Headphones size={24} />}
              title="Suporte 24h"
              desc="Nossa equipe de especialistas está sempre pronta para ajudar você em qualquer etapa do lançamento."
            />
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-40 bg-[#0a0a0a] border-y border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl md:text-6xl font-black mb-24 text-center tracking-tighter">Do estúdio para o mundo.</h2>
          
          <div className="relative max-w-5xl mx-auto">
             {/* Line */}
             <div className="absolute left-[34px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-[#1ED760] to-white/10 md:hidden"></div>
             
             <div className="grid md:grid-cols-4 gap-12 relative">
                {/* Horizontal line for desktop */}
                <div className="hidden md:block absolute top-[34px] left-12 right-12 h-[2px] bg-gradient-to-r from-[#1ED760] to-white/10 z-0"></div>
                
                <Step number="01" title="Envie sua música" desc="Faça upload do seu áudio em alta qualidade e arte da capa." />
                <Step number="02" title="Escolha plataformas" desc="Selecione as lojas e países onde deseja lançar." />
                <Step number="03" title="Receba aprovação" desc="Nossa equipe revisa rapidamente para o lançamento." />
                <Step number="04" title="Ganhe royalties" desc="Receba pagamentos diretos sempre que for ouvido." />
             </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="precos" className="py-40 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[800px] bg-gradient-to-b from-[#1ED760]/5 to-transparent blur-[120px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter">Preços transparentes.<br/><span className="text-[#B8B8B8]">Sem surpresas.</span></h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-center max-w-6xl mx-auto">
            <PricingCard 
              name="Starter"
              price="350"
              period="/mês"
              desc="Ideal para artistas lançando seu primeiro single."
              features={["Distribuição básica (3 lojas)", "Relatórios mensais", "Suporte por e-mail", "100% Direitos autorais"]}
            />
            <PricingCard 
              name="Pro"
              price="900"
              period="/mês"
              desc="Para artistas frequentes e independentes."
              features={["Distribuição ilimitada (150+ lojas)", "Analytics em tempo real", "Suporte prioritário 24h", "Monetização no YouTube/TikTok"]}
              isPopular
            />
            <PricingCard 
              name="Artist Plus"
              price="1400"
              period="/mês"
              desc="Para selos e artistas com grande volume."
              features={["Tudo do plano Pro", "Estratégia de Marketing", "Pitching de Playlists", "Gerente de Conta Dedicado"]}
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-40 bg-[#0a0a0a] border-y border-white/[0.05] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-24 text-center">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter">Artistas amam a Slyde.</h2>
        </div>
        
        <div className="flex gap-6 overflow-x-auto pb-12 px-6 max-w-7xl mx-auto no-scrollbar snap-x">
          <Testimonial 
            name="Layla Santos"
            country="Brasil"
            image="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop"
            text="Mudei para a Slyde e meus royalties começaram a entrar 2x mais rápido. O dashboard é perfeito, limpo e direto ao ponto."
          />
          <Testimonial 
            name="David N."
            country="Moçambique"
            image="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop"
            text="Finalmente uma distribuidora que entende o artista independente. Suporte excelente e distribuição muito rápida."
          />
          <Testimonial 
            name="Elena R."
            country="Portugal"
            image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
            text="Interface nível Apple. Muito simples de fazer os lançamentos. A melhor decisão que tomei para a minha carreira musical."
          />
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-40 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1ED760]/10 z-0"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-[80px] font-black mb-8 tracking-tighter leading-tight"
          >
            Pronto para lançar sua <br/>próxima música?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[#B8B8B8] text-2xl mb-12 font-medium"
          >
            Junte-se a milhares de artistas que confiam na Slyde.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <a href="https://wa.me/258849696473?text=Ol%C3%A1%2C%20gostaria%20de%20assinar%20um%20plano%20de%20distribui%C3%A7%C3%A3o" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 bg-[#1ED760] text-black px-12 py-6 rounded-full text-xl font-black hover:bg-[#18C964] transition-all hover:scale-105 active:scale-95 shadow-[0_0_50px_rgba(30,215,96,0.4)]">
              Começar Agora
              <ArrowRight size={24} />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#050505] border-t border-white/[0.08] pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-12 mb-24">
            <div className="col-span-2">
              <div className="mb-8">
                <SlydeLogo />
              </div>
              <p className="text-[#B8B8B8] text-sm max-w-sm mb-8 leading-relaxed font-medium">
                A plataforma de distribuição musical mais avançada e transparente para artistas independentes.
              </p>
              <div className="flex items-center gap-5 text-[#B8B8B8]">
                <a href="#" className="hover:text-white transition-colors"><Instagram size={20} /></a>
                <a href="#" className="hover:text-white transition-colors"><Twitter size={20} /></a>
                <a href="#" className="hover:text-white transition-colors"><Youtube size={20} /></a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6 tracking-wide">Produto</h4>
              <ul className="space-y-4 text-sm text-[#B8B8B8] font-medium">
                <li><a href="#" className="hover:text-[#1ED760] transition-colors">Distribuição</a></li>
                <li><a href="#" className="hover:text-[#1ED760] transition-colors">Analytics</a></li>
                <li><a href="#" className="hover:text-[#1ED760] transition-colors">Monetização</a></li>
                <li><a href="#" className="hover:text-[#1ED760] transition-colors">Split de Royalties</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6 tracking-wide">Recursos</h4>
              <ul className="space-y-4 text-sm text-[#B8B8B8] font-medium">
                <li><a href="#" className="hover:text-[#1ED760] transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-[#1ED760] transition-colors">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-[#1ED760] transition-colors">Lojas Parceiras</a></li>
                <li><a href="#" className="hover:text-[#1ED760] transition-colors">Termos de Uso</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6 tracking-wide">Empresa</h4>
              <ul className="space-y-4 text-sm text-[#B8B8B8] font-medium">
                <li><a href="#" className="hover:text-[#1ED760] transition-colors">Sobre Nós</a></li>
                <li><a href="#" className="hover:text-[#1ED760] transition-colors">Carreiras</a></li>
                <li><a href="#" className="hover:text-[#1ED760] transition-colors">Contato</a></li>
                <li><a href="#" className="hover:text-[#1ED760] transition-colors">Imprensa</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/[0.08] pt-10 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-[#B8B8B8] font-medium">
            <p>© 2026 Slyde Musik. Todos os direitos reservados.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white transition-colors">Privacidade</a>
              <a href="#" className="hover:text-white transition-colors">Termos</a>
              <a href="#" className="hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function BenefitCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-[#0D0D0D] border border-white/[0.08] p-10 rounded-[28px] group hover:-translate-y-2 transition-all duration-300 hover:border-[#1ED760]/30 hover:shadow-[0_10px_40px_rgba(30,215,96,0.1)] relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#1ED760]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="w-16 h-16 bg-white/[0.03] border border-white/[0.08] rounded-2xl flex items-center justify-center text-white mb-8 group-hover:text-[#1ED760] group-hover:scale-110 transition-all duration-300 relative z-10 shadow-inner">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-white mb-4 relative z-10 tracking-tight">{title}</h3>
      <p className="text-[#B8B8B8] text-base leading-relaxed relative z-10 font-medium">{desc}</p>
    </motion.div>
  )
}

function Step({ number, title, desc }: { number: string, title: string, desc: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative z-10 flex flex-row md:flex-col gap-6 md:gap-8 items-start md:items-center text-left md:text-center group"
    >
      <div className="w-16 h-16 md:w-20 md:h-20 shrink-0 bg-[#050505] border-2 border-white/[0.1] group-hover:border-[#1ED760] rounded-full flex items-center justify-center text-xl md:text-2xl font-black text-white shadow-lg group-hover:shadow-[0_0_30px_rgba(30,215,96,0.3)] transition-all duration-300">
        {number}
      </div>
      <div>
        <h3 className="text-xl font-bold text-white mb-3 tracking-tight group-hover:text-[#1ED760] transition-colors">{title}</h3>
        <p className="text-[#B8B8B8] text-base font-medium leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  )
}

function PricingCard({ name, price, period, desc, features, isPopular }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`relative p-10 rounded-[32px] transition-all duration-300 ${isPopular ? 'bg-gradient-to-b from-[#181818] to-[#0D0D0D] border border-[#1ED760]/50 shadow-[0_0_50px_rgba(30,215,96,0.15)] md:-mt-8 md:mb-8 z-10 hover:shadow-[0_0_60px_rgba(30,215,96,0.2)]' : 'bg-[#0D0D0D] border border-white/[0.08] hover:border-white/[0.15]'}`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#1ED760] text-black text-xs font-black uppercase tracking-widest px-5 py-2 rounded-full shadow-[0_0_20px_rgba(30,215,96,0.5)]">
          Mais Popular
        </div>
      )}
      <h3 className="text-3xl font-black mb-3 tracking-tight text-white">{name}</h3>
      <p className="text-[#B8B8B8] text-base mb-8 h-12 font-medium">{desc}</p>
      <div className="flex items-baseline gap-1 mb-10 pb-10 border-b border-white/[0.08]">
        <span className="text-6xl font-black text-white tracking-tighter">{price} <span className="text-3xl">MT</span></span>
        <span className="text-[#B8B8B8] font-bold">{period}</span>
      </div>
      <ul className="space-y-5 mb-12">
        {features.map((f: string, i: number) => (
          <li key={i} className="flex items-start gap-4 text-white text-base font-medium">
            <div className={`mt-0.5 shrink-0 ${isPopular ? 'text-[#1ED760]' : 'text-white/40'}`}>
              <CheckCircle2 size={20} />
            </div>
            {f}
          </li>
        ))}
      </ul>
      <a href={`https://wa.me/258849696473?text=Ol%C3%A1%2C%20gostaria%20de%20assinar%20o%20plano%20${name}`} target="_blank" rel="noopener noreferrer" className={`block w-full text-center py-5 rounded-full font-bold text-lg transition-all hover:scale-105 active:scale-95 ${isPopular ? 'bg-[#1ED760] text-black shadow-[0_0_30px_rgba(30,215,96,0.3)] hover:shadow-[0_0_40px_rgba(30,215,96,0.5)]' : 'bg-white/[0.05] text-white hover:bg-white/[0.1] border border-white/[0.08]'}`}>
        Começar com {name}
      </a>
    </motion.div>
  )
}

function Testimonial({ name, country, image, text }: any) {
  return (
    <div className="min-w-[340px] md:min-w-[450px] bg-[#0D0D0D] border border-white/[0.08] p-10 rounded-[32px] snap-center hover:bg-[#111] transition-colors">
      <div className="flex gap-1 text-[#1ED760] mb-8">
        {[1,2,3,4,5].map(i => <Star key={i} size={20} fill="currentColor" />)}
      </div>
      <p className="text-white text-xl font-medium mb-10 leading-relaxed">"{text}"</p>
      <div className="flex items-center gap-5">
        <img src={image} alt={name} className="w-14 h-14 rounded-full object-cover border border-white/[0.1]" />
        <div>
          <p className="text-white font-bold text-lg">{name}</p>
          <p className="text-[#B8B8B8] text-sm font-medium">{country}</p>
        </div>
      </div>
    </div>
  )
}

function SlydeLogo() {
  return (
    <div className="flex items-center gap-4 select-none">
      <div className="relative flex items-center justify-center">
        <div className="w-11 h-11 rounded-full border-[3px] border-[#1ED760] flex items-center justify-center shadow-[0_0_15px_rgba(30,215,96,0.3)]">
          <span className="text-white font-black text-2xl italic pr-1 mt-1">S</span>
        </div>
        <div className="absolute -bottom-2 -right-3 text-[#1ED760] drop-shadow-[0_0_8px_rgba(30,215,96,0.8)] bg-[#050505] rounded-full p-0.5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#1ED760" stroke="#1ED760" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18V5l12-2v13" strokeWidth="2" fill="none" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        </div>
      </div>
      <div className="flex flex-col justify-center mt-1">
        <span className="text-3xl font-black tracking-widest text-white leading-none">SLYDE</span>
        <span className="text-[0.55rem] font-bold tracking-[0.2em] text-white mt-1.5 uppercase">
          Sua música. <span className="text-[#1ED760]">Em todo lugar.</span>
        </span>
      </div>
    </div>
  );
}
