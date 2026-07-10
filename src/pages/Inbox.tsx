import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mail, RefreshCw, LogIn, Trash2, Edit } from 'lucide-react';
import { getGoogleAccessToken, signInWithGoogleForScopes } from '../utils/googleAuth';
import { auth } from '../firebase';

interface EmailMessage {
  id: string;
  snippet: string;
  subject: string;
  from: string;
  date: string;
}

export default function Inbox() {
  const [emails, setEmails] = useState<EmailMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [needsAuth, setNeedsAuth] = useState(false);

  const fetchEmails = async (token: string) => {
    try {
      setLoading(true);
      const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=10&labelIds=INBOX', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.status === 401) {
        setNeedsAuth(true);
        setLoading(false);
        return;
      }
      
      const data = await res.json();
      
      if (!data.messages) {
        setEmails([]);
        setLoading(false);
        return;
      }

      const messageDetailsPromises = data.messages.map(async (msg: any) => {
        const msgRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=Date`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const msgData = await msgRes.json();
        const headers = msgData.payload.headers;
        const subject = headers.find((h: any) => h.name === 'Subject')?.value || '(Sem Assunto)';
        const from = headers.find((h: any) => h.name === 'From')?.value || 'Desconhecido';
        const dateStr = headers.find((h: any) => h.name === 'Date')?.value || '';
        const date = new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
        
        return {
          id: msgData.id,
          snippet: msgData.snippet,
          subject,
          from,
          date
        };
      });

      const fullMessages = await Promise.all(messageDetailsPromises);
      setEmails(fullMessages);
    } catch (error) {
      console.error('Error fetching emails:', error);
      setNeedsAuth(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      let token = getGoogleAccessToken();
      
      if (!token) {
        try {
          const { getRedirectResult, GoogleAuthProvider } = await import('firebase/auth');
          const result = await getRedirectResult(auth);
          if (result) {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            if (credential?.accessToken) {
              const { setGoogleAccessToken } = await import('../utils/googleAuth');
              setGoogleAccessToken(credential.accessToken);
              token = credential.accessToken;
            }
          }
        } catch (error) {
          console.error("Redirect check error:", error);
        }
      }

      if (token) {
        fetchEmails(token);
      } else {
        setNeedsAuth(true);
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const result = await signInWithGoogleForScopes(auth);
      const token = getGoogleAccessToken();
      if (token) {
        setNeedsAuth(false);
        fetchEmails(token);
      } else {
        setNeedsAuth(true);
        setLoading(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this email?");
    if (!confirmed) return;
    
    const token = getGoogleAccessToken();
    if (!token) return;

    try {
      await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}/trash`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmails(emails.filter(e => e.id !== id));
    } catch (error) {
      console.error('Failed to delete email:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <RefreshCw size={24} className="text-[#1db954] animate-spin" />
      </div>
    );
  }

  if (needsAuth) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-2xl mx-auto text-center h-full">
        <div className="w-16 h-16 bg-[#1db954]/20 rounded-full flex items-center justify-center mb-6">
          <Mail size={32} className="text-[#1db954]" />
        </div>
        <h2 className="text-2xl font-black text-white mb-4">Caixa de Entrada Gmail</h2>
        <p className="text-zinc-400 mb-8 font-medium">
          Conecte sua conta do Google para ler, responder e gerenciar seus e-mails diretamente do SLYDE MUSIK.
        </p>
        <button onClick={handleLogin} className="flex items-center gap-3 px-8 py-4 bg-white text-black font-black rounded-full hover:bg-zinc-200 transition-transform hover:scale-105 active:scale-95">
          <LogIn size={20} /> Entrar com Google
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-2 flex items-center gap-3">
            <Mail className="text-[#1db954]" size={28} />
            Caixa de Entrada
          </h1>
          <p className="text-zinc-400 font-medium">Seus e-mails recentes do Gmail</p>
        </div>
        <button 
          onClick={() => {
            const token = getGoogleAccessToken();
            if (token) fetchEmails(token);
          }}
          className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-colors"
          title="Atualizar"
        >
          <RefreshCw size={20} />
        </button>
      </div>

      <div className="space-y-4">
        {emails.length === 0 ? (
          <div className="text-center p-12 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-zinc-400 font-medium">Nenhum e-mail encontrado na sua caixa de entrada.</p>
          </div>
        ) : (
          emails.map((email, index) => (
            <motion.div 
              key={email.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:border-[#1db954]/50 transition-colors group cursor-pointer"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-white truncate max-w-[80%]">{email.subject}</h3>
                <span className="text-xs font-bold text-zinc-500 whitespace-nowrap ml-4 bg-black/50 px-2 py-1 rounded-md">{email.date}</span>
              </div>
              <p className="text-sm text-zinc-300 font-medium truncate mb-2">{email.from}</p>
              <p className="text-sm text-zinc-500 line-clamp-2 leading-relaxed">{email.snippet}</p>
              
              <div className="mt-4 pt-4 border-t border-white/5 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={(e) => { e.stopPropagation(); handleDelete(email.id); }}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 rounded-lg text-sm font-bold hover:bg-red-500/20 transition-colors"
                >
                  <Trash2 size={16} /> Excluir
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
