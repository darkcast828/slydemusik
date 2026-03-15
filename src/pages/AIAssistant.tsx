import React, { useState, useRef, useEffect } from "react";
import { GoogleGenAI } from "@google/genai";
import { Send, Bot, User, Sparkles, Loader2, Music, Mic2, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  type: "user" | "bot";
  text: string;
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      text: "Olá! Sou o assistente de IA da SLYDE MUSIK. Como posso ajudar com sua carreira musical, distribuição ou marketing hoje?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      text: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: input,
        config: {
          systemInstruction: "Você é um assistente especializado em indústria musical, distribuição digital, marketing para artistas e produção musical. Você trabalha para a SLYDE MUSIK, uma plataforma de distribuição de música. Responda em português de forma amigável, profissional e concisa. Use formatação markdown para destacar pontos importantes.",
        }
      });

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        text: response.text || "Desculpe, não consegui gerar uma resposta.",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        text: "Desculpe, ocorreu um erro ao processar sua solicitação. Verifique se a chave da API do Gemini está configurada corretamente.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedPrompts = [
    { icon: <TrendingUp size={16} />, text: "Como promover meu novo single no TikTok?" },
    { icon: <Music size={16} />, text: "Dicas para melhorar a qualidade da minha mixagem" },
    { icon: <Mic2 size={16} />, text: "Como conseguir entrar em playlists do Spotify?" }
  ];

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Sparkles className="text-[#7a5cff]" />
          SLYDE IA
        </h1>
        <p className="text-gray-400 mt-2">Seu assistente pessoal para alavancar sua carreira musical.</p>
      </div>

      <div className="flex-1 bg-[#1c1c22] border border-white/5 rounded-2xl flex flex-col overflow-hidden shadow-2xl">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 ${msg.type === "user" ? "flex-row-reverse" : ""}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  msg.type === "user" ? "bg-[#7a5cff]" : "bg-white/10"
                }`}>
                  {msg.type === "user" ? <User size={20} className="text-white" /> : <Bot size={20} className="text-[#7a5cff]" />}
                </div>
                <div className={`max-w-[80%] rounded-2xl p-4 ${
                  msg.type === "user" 
                    ? "bg-[#7a5cff] text-white rounded-tr-none" 
                    : "bg-white/5 text-gray-200 border border-white/5 rounded-tl-none"
                }`}>
                  {msg.type === "user" ? (
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  ) : (
                    <div className="markdown-body prose prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10">
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4"
            >
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <Bot size={20} className="text-[#7a5cff]" />
              </div>
              <div className="bg-white/5 border border-white/5 rounded-2xl rounded-tl-none p-4 flex items-center gap-2">
                <Loader2 size={20} className="animate-spin text-[#7a5cff]" />
                <span className="text-gray-400 text-sm">SLYDE IA está digitando...</span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts */}
        {messages.length === 1 && (
          <div className="px-6 pb-4 flex flex-wrap gap-2">
            {suggestedPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => setInput(prompt.text)}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm text-gray-300 transition-colors"
              >
                <span className="text-[#7a5cff]">{prompt.icon}</span>
                {prompt.text}
              </button>
            ))}
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 bg-black/20 border-t border-white/5">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Pergunte sobre marketing, distribuição, produção..."
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#7a5cff] resize-none min-h-[52px] max-h-32"
                rows={1}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="w-[52px] h-[52px] bg-[#7a5cff] hover:bg-[#6246ea] disabled:bg-white/10 disabled:text-gray-500 text-white rounded-xl flex items-center justify-center transition-colors shrink-0"
            >
              <Send size={20} className={input.trim() && !isLoading ? "translate-x-0.5 -translate-y-0.5" : ""} />
            </button>
          </div>
          <p className="text-center text-xs text-gray-600 mt-3">
            SLYDE IA pode cometer erros. Considere verificar informações importantes.
          </p>
        </div>
      </div>
    </div>
  );
}
