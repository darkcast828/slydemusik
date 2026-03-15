import { Bell, CreditCard, Lock, Shield, User } from "lucide-react";

export default function Settings() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Configurações</h1>
        <p className="text-gray-400">Gerencie sua conta, pagamentos e preferências.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Menu Lateral */}
        <div className="w-full md:w-64 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-[#0073C7]/10 text-[#0073C7] font-medium rounded-xl transition-colors text-left">
            <User size={20} /> Conta
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-left">
            <CreditCard size={20} /> Assinatura
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-left">
            <Bell size={20} /> Notificações
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-left">
            <Shield size={20} /> Segurança
          </button>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 space-y-8">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
            <h2 className="text-xl font-bold text-white mb-6">Informações Pessoais</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Nome Completo</label>
                  <input 
                    type="text" 
                    defaultValue="João Silva"
                    className="w-full p-4 rounded-xl bg-black/50 border border-white/10 text-white focus:outline-none focus:border-[#0073C7] transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Email</label>
                  <input 
                    type="email" 
                    defaultValue="joao@exemplo.com"
                    className="w-full p-4 rounded-xl bg-black/50 border border-white/10 text-white focus:outline-none focus:border-[#0073C7] transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">País</label>
                  <select className="w-full p-4 rounded-xl bg-black/50 border border-white/10 text-white focus:outline-none focus:border-[#0073C7] transition-colors appearance-none">
                    <option value="ao">Angola</option>
                    <option value="mz">Moçambique</option>
                    <option value="br">Brasil</option>
                    <option value="pt">Portugal</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Telefone</label>
                  <input 
                    type="tel" 
                    defaultValue="+244 923 456 789"
                    className="w-full p-4 rounded-xl bg-black/50 border border-white/10 text-white focus:outline-none focus:border-[#0073C7] transition-colors"
                  />
                </div>
              </div>
              <div className="pt-4">
                <button type="button" className="px-6 py-3 bg-[#0073C7] text-black font-bold rounded-xl hover:bg-[#005bb5] transition-transform hover:scale-105 active:scale-95">
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Lock size={20} className="text-[#6c3cff]" />
              Alterar Senha
            </h2>
            <form className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Senha Atual</label>
                <input 
                  type="password" 
                  className="w-full p-4 rounded-xl bg-black/50 border border-white/10 text-white focus:outline-none focus:border-[#6c3cff] transition-colors"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Nova Senha</label>
                  <input 
                    type="password" 
                    className="w-full p-4 rounded-xl bg-black/50 border border-white/10 text-white focus:outline-none focus:border-[#6c3cff] transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Confirmar Nova Senha</label>
                  <input 
                    type="password" 
                    className="w-full p-4 rounded-xl bg-black/50 border border-white/10 text-white focus:outline-none focus:border-[#6c3cff] transition-colors"
                  />
                </div>
              </div>
              <div className="pt-4">
                <button type="button" className="px-6 py-3 bg-[#6c3cff] text-white font-bold rounded-xl hover:bg-[#7b52ff] transition-transform hover:scale-105 active:scale-95">
                  Atualizar Senha
                </button>
              </div>
            </form>
          </div>

          <div className="bg-red-500/5 border border-red-500/20 rounded-3xl p-8">
            <h2 className="text-xl font-bold text-red-500 mb-2">Zona de Perigo</h2>
            <p className="text-gray-400 mb-6">Ações irreversíveis para a sua conta.</p>
            <button type="button" className="px-6 py-3 bg-red-500/10 text-red-500 font-bold rounded-xl hover:bg-red-500/20 transition-colors border border-red-500/20">
              Excluir Conta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
