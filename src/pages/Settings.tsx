import { useState, useEffect } from "react";
import { Bell, CreditCard, Lock, Shield, User, CheckCircle2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { motion } from "motion/react";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("conta");
  const { currentUser, userProfile } = useAuth();
  
  const [emailDistributed, setEmailDistributed] = useState(true);
  const [emailRejected, setEmailRejected] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (userProfile?.notifications) {
      setEmailDistributed(userProfile.notifications.emailDistributed ?? true);
      setEmailRejected(userProfile.notifications.emailRejected ?? true);
    }
  }, [userProfile]);

  const handleNotificationChange = async (type: 'distributed' | 'rejected', value: boolean) => {
    if (!currentUser) return;
    
    if (type === 'distributed') setEmailDistributed(value);
    if (type === 'rejected') setEmailRejected(value);
    
    setIsSaving(true);
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        [`notifications.email${type === 'distributed' ? 'Distributed' : 'Rejected'}`]: value
      });
    } catch (error) {
      console.error("Erro ao atualizar notificações:", error);
      // Revert on error
      if (type === 'distributed') setEmailDistributed(!value);
      if (type === 'rejected') setEmailRejected(!value);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-black text-white mb-3 tracking-tight">Configurações</h1>
        <p className="text-zinc-400 text-lg">Gerencie sua conta, pagamentos e preferências.</p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Menu Lateral */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full md:w-72 space-y-2"
        >
          <button 
            onClick={() => setActiveTab("conta")}
            className={`w-full flex items-center gap-4 px-5 py-4 font-bold rounded-2xl transition-all text-left ${activeTab === "conta" ? "bg-[#1db954] text-black shadow-[0_0_20px_rgba(29,185,84,0.2)]" : "text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10"}`}
          >
            <User size={20} className={activeTab === "conta" ? "text-black" : "text-zinc-500"} /> Conta
          </button>
          <button 
            onClick={() => setActiveTab("assinatura")}
            className={`w-full flex items-center gap-4 px-5 py-4 font-bold rounded-2xl transition-all text-left ${activeTab === "assinatura" ? "bg-[#1db954] text-black shadow-[0_0_20px_rgba(29,185,84,0.2)]" : "text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10"}`}
          >
            <CreditCard size={20} className={activeTab === "assinatura" ? "text-black" : "text-zinc-500"} /> Assinatura
          </button>
          <button 
            onClick={() => setActiveTab("notificacoes")}
            className={`w-full flex items-center gap-4 px-5 py-4 font-bold rounded-2xl transition-all text-left ${activeTab === "notificacoes" ? "bg-[#1db954] text-black shadow-[0_0_20px_rgba(29,185,84,0.2)]" : "text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10"}`}
          >
            <Bell size={20} className={activeTab === "notificacoes" ? "text-black" : "text-zinc-500"} /> Notificações
          </button>
          <button 
            onClick={() => setActiveTab("verificacao")}
            className={`w-full flex items-center gap-4 px-5 py-4 font-bold rounded-2xl transition-all text-left ${activeTab === "verificacao" ? "bg-[#1db954] text-black shadow-[0_0_20px_rgba(29,185,84,0.2)]" : "text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10"}`}
          >
            <Shield size={20} className={activeTab === "verificacao" ? "text-black" : "text-zinc-500"} /> Verificação
          </button>
          <button 
            onClick={() => setActiveTab("seguranca")}
            className={`w-full flex items-center gap-4 px-5 py-4 font-bold rounded-2xl transition-all text-left ${activeTab === "seguranca" ? "bg-[#1db954] text-black shadow-[0_0_20px_rgba(29,185,84,0.2)]" : "text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10"}`}
          >
            <Lock size={20} className={activeTab === "seguranca" ? "text-black" : "text-zinc-500"} /> Segurança
          </button>
        </motion.div>

        {/* Conteúdo */}
        <div className="flex-1 space-y-8">
          {activeTab === "conta" && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-zinc-900 border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl"
            >
              <h2 className="text-2xl font-black text-white mb-8">Informações Pessoais</h2>
              <form className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Nome Completo</label>
                    <input 
                      type="text" 
                      defaultValue="João Silva"
                      className="w-full p-4 rounded-2xl bg-black border border-white/10 text-white font-medium focus:outline-none focus:border-[#1db954] focus:ring-1 focus:ring-[#1db954] transition-all"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Email</label>
                    <input 
                      type="email" 
                      defaultValue={currentUser?.email || "joao@exemplo.com"}
                      disabled
                      className="w-full p-4 rounded-2xl bg-black/50 border border-white/5 text-zinc-500 font-medium cursor-not-allowed"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-zinc-400 uppercase tracking-wider">País</label>
                    <select className="w-full p-4 rounded-2xl bg-black border border-white/10 text-white font-medium focus:outline-none focus:border-[#1db954] focus:ring-1 focus:ring-[#1db954] transition-all appearance-none">
                      <option value="mz">Moçambique</option>
                      <option value="ao">Angola</option>
                      <option value="br">Brasil</option>
                      <option value="pt">Portugal</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Telefone</label>
                    <input 
                      type="tel" 
                      defaultValue="+258 84 123 4567"
                      className="w-full p-4 rounded-2xl bg-black border border-white/10 text-white font-medium focus:outline-none focus:border-[#1db954] focus:ring-1 focus:ring-[#1db954] transition-all"
                    />
                  </div>
                </div>
                <div className="pt-6 border-t border-white/10">
                  <button type="button" className="px-8 py-4 bg-white text-black font-black rounded-full hover:bg-zinc-200 transition-transform hover:scale-105 active:scale-95 uppercase tracking-wider text-sm">
                    Salvar Alterações
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {activeTab === "assinatura" && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-zinc-900 border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl"
            >
              <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
                <CreditCard size={24} className="text-[#1db954]" />
                Sua Assinatura
              </h2>
              <div className="bg-gradient-to-br from-[#1db954]/20 to-transparent border border-[#1db954]/30 rounded-3xl p-8 mb-10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1db954] to-[#1ed760]"></div>
                <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
                  <div>
                    <h3 className="text-3xl font-black text-white">Plano Músico Plus</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <CheckCircle2 size={16} className="text-[#1db954]" />
                      <p className="text-[#1db954] font-bold">Ativo</p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-4xl font-black text-white tracking-tighter">600<span className="text-lg text-zinc-400 font-bold ml-1">MTs</span></p>
                    <p className="text-sm text-zinc-500 uppercase tracking-wider font-bold mt-1">Por mês</p>
                  </div>
                </div>
                <p className="text-zinc-300 text-base mb-8 font-medium">Sua próxima cobrança será em 15 de Abril de 2026.</p>
                <div className="flex flex-wrap gap-4">
                  <button className="px-8 py-3 bg-[#1db954] text-black font-black rounded-full hover:bg-[#1ed760] transition-transform hover:scale-105 active:scale-95 uppercase tracking-wider text-sm">
                    Mudar Plano
                  </button>
                  <button className="px-8 py-3 bg-transparent border border-white/20 text-white font-bold rounded-full hover:bg-white/10 transition-colors uppercase tracking-wider text-sm">
                    Cancelar Assinatura
                  </button>
                </div>
              </div>
              
              <h3 className="text-xl font-black text-white mb-6">Histórico de Pagamentos</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-5 bg-black rounded-2xl border border-white/5">
                  <div>
                    <p className="text-white font-bold text-lg">Músico Plus</p>
                    <p className="text-sm text-zinc-500 font-medium">15 de Março de 2026</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-black text-xl">600 MTs</p>
                    <p className="text-xs text-[#1db954] font-black uppercase tracking-wider mt-1">Pago</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "notificacoes" && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-zinc-900 border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl"
            >
              <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
                <Bell size={24} className="text-[#1db954]" />
                Preferências de Notificação
              </h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-6 bg-black rounded-2xl border border-white/5 transition-colors hover:border-white/10">
                  <div className="pr-6">
                    <p className="text-white font-bold text-lg mb-1">Música Distribuída</p>
                    <p className="text-sm text-zinc-400 leading-relaxed font-medium">Receba um email quando sua música for aprovada e distribuída nas plataformas.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={emailDistributed}
                      onChange={(e) => handleNotificationChange('distributed', e.target.checked)}
                      disabled={isSaving}
                    />
                    <div className="w-14 h-7 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#1db954]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-6 bg-black rounded-2xl border border-white/5 transition-colors hover:border-white/10">
                  <div className="pr-6">
                    <p className="text-white font-bold text-lg mb-1">Música Rejeitada</p>
                    <p className="text-sm text-zinc-400 leading-relaxed font-medium">Receba um email caso haja algum problema e sua música seja rejeitada.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={emailRejected}
                      onChange={(e) => handleNotificationChange('rejected', e.target.checked)}
                      disabled={isSaving}
                    />
                    <div className="w-14 h-7 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#1db954]"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-6 bg-black rounded-2xl border border-white/5 transition-colors hover:border-white/10">
                  <div className="pr-6">
                    <p className="text-white font-bold text-lg mb-1">Relatórios de Royalties</p>
                    <p className="text-sm text-zinc-400 leading-relaxed font-medium">Receba um email mensal com o resumo dos seus ganhos.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-14 h-7 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#1db954]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-6 bg-black rounded-2xl border border-white/5 transition-colors hover:border-white/10">
                  <div className="pr-6">
                    <p className="text-white font-bold text-lg mb-1">Dicas e Novidades</p>
                    <p className="text-sm text-zinc-400 leading-relaxed font-medium">Receba dicas de marketing e novidades da plataforma.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-14 h-7 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#1db954]"></div>
                  </label>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "verificacao" && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-zinc-900 border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl"
            >
              <h2 className="text-2xl font-black text-white mb-4 flex items-center gap-3">
                <Shield size={24} className="text-[#1db954]" />
                Verificação de Artista
              </h2>
              <p className="text-zinc-400 mb-8 font-medium">
                Solicite o selo de verificação para o seu perfil e obtenha acesso a ferramentas promocionais exclusivas.
              </p>
              
              <form className="space-y-8" onSubmit={async (e) => { 
                e.preventDefault(); 
                if (!currentUser) return;
                setIsSaving(true);
                try {
                  const formData = new FormData(e.currentTarget);
                  const data = {
                    artistName: formData.get('artistName'),
                    socialLinks: formData.get('socialLinks'),
                    message: formData.get('message'),
                    userId: currentUser.uid,
                    status: 'pending',
                    createdAt: new Date().toISOString()
                  };
                  
                  const { collection, addDoc } = await import('firebase/firestore');
                  await addDoc(collection(db, 'verifications'), data);
                  alert('Solicitação enviada com sucesso! Em breve entraremos em contato.');
                  (e.target as HTMLFormElement).reset();
                } catch (error) {
                  console.error('Erro ao enviar solicitação:', error);
                  alert('Ocorreu um erro. Tente novamente mais tarde.');
                } finally {
                  setIsSaving(false);
                }
              }}>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Nome Artístico</label>
                    <input 
                      name="artistName"
                      type="text" 
                      placeholder="Nome do artista ou banda"
                      required
                      className="w-full p-4 rounded-2xl bg-black border border-white/10 text-white font-medium focus:outline-none focus:border-[#1db954] focus:ring-1 focus:ring-[#1db954] transition-all"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Links Sociais / Perfil (Opcional)</label>
                    <input 
                      name="socialLinks"
                      type="url" 
                      placeholder="Link para o Instagram, Spotify ou site oficial"
                      className="w-full p-4 rounded-2xl bg-black border border-white/10 text-white font-medium focus:outline-none focus:border-[#1db954] focus:ring-1 focus:ring-[#1db954] transition-all"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Mensagem (Por que você deve ser verificado?)</label>
                    <textarea 
                      name="message"
                      rows={4}
                      placeholder="Fale um pouco sobre o seu projeto..."
                      required
                      className="w-full p-4 rounded-2xl bg-black border border-white/10 text-white font-medium focus:outline-none focus:border-[#1db954] focus:ring-1 focus:ring-[#1db954] transition-all resize-none"
                    />
                  </div>
                </div>
                
                <div className="pt-6 border-t border-white/10">
                  <button type="submit" disabled={isSaving} className="px-8 py-4 bg-[#1db954] text-black font-black rounded-full hover:bg-[#1ed760] transition-transform hover:scale-105 active:scale-95 uppercase tracking-wider text-sm disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed">
                    {isSaving ? 'Enviando...' : 'Enviar Solicitação'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {activeTab === "seguranca" && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl">
                <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
                  <Lock size={24} className="text-white" />
                  Alterar Senha
                </h2>
                <form className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Senha Atual</label>
                    <input 
                      type="password" 
                      className="w-full p-4 rounded-2xl bg-black border border-white/10 text-white font-medium focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Nova Senha</label>
                      <input 
                        type="password" 
                        className="w-full p-4 rounded-2xl bg-black border border-white/10 text-white font-medium focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Confirmar Nova Senha</label>
                      <input 
                        type="password" 
                        className="w-full p-4 rounded-2xl bg-black border border-white/10 text-white font-medium focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
                      />
                    </div>
                  </div>
                  <div className="pt-6 border-t border-white/10">
                    <button type="button" className="px-8 py-4 bg-white text-black font-black rounded-full hover:bg-zinc-200 transition-transform hover:scale-105 active:scale-95 uppercase tracking-wider text-sm">
                      Atualizar Senha
                    </button>
                  </div>
                </form>
              </div>

              <div className="bg-red-500/5 border border-red-500/20 rounded-3xl p-8 md:p-10">
                <h2 className="text-2xl font-black text-red-500 mb-3">Zona de Perigo</h2>
                <p className="text-zinc-400 mb-8 font-medium">Ações irreversíveis para a sua conta. Tenha certeza antes de prosseguir.</p>
                <button type="button" className="px-8 py-4 bg-red-500/10 text-red-500 font-black rounded-full hover:bg-red-500/20 transition-colors border border-red-500/20 uppercase tracking-wider text-sm">
                  Excluir Conta Permanentemente
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
