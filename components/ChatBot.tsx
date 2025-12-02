import React, { useState, useRef, useEffect } from 'react';
import { getChatResponse } from '../services/geminiService';
import { MessageCircle, X, Send, Bot, User, AlertCircle } from 'lucide-react';
import { ChatMessage } from '../types';

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: 'Olá! Sou seu assistente virtual da Crescer. Como posso ajudar com a agenda ou dúvidas espirituais hoje?', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleChat = () => setIsOpen(!isOpen);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, error, isLoading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setError(null);
    const userText = input;
    
    // Create User Message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: userText,
      timestamp: new Date()
    };

    // Update UI immediately
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Prepare history from CURRENT state (excluding the message we just added to UI, 
      // but including previous ones).
      // Note: Because setState is async, 'messages' here still holds the old list, 
      // which is exactly what we want for 'history' (previous context).
      const history = messages.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
      }));

      const responseText = await getChatResponse(history, userText);

      if (responseText) {
        const botMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'model',
          text: responseText,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMsg]);
      } else {
        throw new Error("Resposta vazia da IA");
      }
    } catch (err) {
      console.error(err);
      setError("Não foi possível conectar. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 p-4 bg-crescer-orange text-white rounded-full shadow-2xl hover:bg-crescer-dark transition-all duration-300 z-50 group"
        aria-label="Open Chat"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} className="group-hover:scale-110 transition-transform"/>}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 md:w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-100 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-crescer-orange to-crescer-yellow p-4 rounded-t-2xl flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full">
                <Bot className="text-white w-5 h-5" />
            </div>
            <div>
                <h3 className="font-bold text-white">Assistente Crescer</h3>
                <p className="text-white/80 text-xs">Sempre aqui para ajudar</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-gray-200' : 'bg-crescer-light'}`}>
                    {msg.role === 'user' ? <User size={14} className="text-gray-600"/> : <Bot size={14} className="text-crescer-orange"/>}
                </div>
                <div
                  className={`max-w-[75%] p-3 rounded-2xl text-sm ${
                    msg.role === 'user'
                      ? 'bg-crescer-orange text-white rounded-tr-none'
                      : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            
            {isLoading && (
               <div className="flex gap-2 items-center text-gray-400 text-xs ml-10">
                   <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                   <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                   <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
               </div>
            )}

            {error && (
              <div className="flex items-center gap-2 justify-center text-red-500 text-xs bg-red-50 p-2 rounded-lg">
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 rounded-b-2xl">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:border-crescer-orange focus:ring-1 focus:ring-crescer-orange text-sm"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="p-2 bg-crescer-orange text-white rounded-full hover:bg-crescer-dark disabled:opacity-50 transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};