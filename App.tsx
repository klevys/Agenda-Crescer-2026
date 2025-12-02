import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Agenda } from './components/Agenda';
import { ChatBot } from './components/ChatBot';
import { Sparkles, ArrowRight } from 'lucide-react';

const App: React.FC = () => {
  const [hasKey, setHasKey] = useState(false);
  const [isLoadingKey, setIsLoadingKey] = useState(true);

  useEffect(() => {
    const checkKey = async () => {
      // Logic to check if we are in the AI Studio environment and have a key
      if (window.aistudio && window.aistudio.hasSelectedApiKey) {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasKey(selected);
      } else {
        // Fallback for dev environments without the wrapper
        setHasKey(true);
      }
      setIsLoadingKey(false);
    };
    checkKey();
  }, []);

  const handleConnect = async () => {
    if (window.aistudio && window.aistudio.openSelectKey) {
      await window.aistudio.openSelectKey();
      setHasKey(true);
    } else {
      // Fallback
      setHasKey(true);
    }
  };

  // Loading State
  if (isLoadingKey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-orange-50">
        <div className="animate-pulse text-crescer-orange">Carregando...</div>
      </div>
    );
  }

  // Landing Page / Key Gate
  if (!hasKey) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-orange-50 p-4 text-center">
        <div className="w-48 h-48 mb-8 p-4 bg-white rounded-full shadow-2xl flex items-center justify-center animate-in zoom-in duration-500">
           <img 
              src="https://klevys.online/wp-content/uploads/2025/11/crescer-logo-fundo-transparente-1200px_.png" 
              alt="Logo Igreja Batista Crescer" 
              className="w-full h-full object-contain"
           />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Bem-vindo à Agenda Interativa</h1>
        <p className="text-gray-600 max-w-md mb-8">
          Para acessar os recursos de Inteligência Artificial e visualizar a agenda 2026, por favor, conecte-se abaixo.
        </p>
        <button 
          onClick={handleConnect}
          className="group bg-crescer-orange text-white px-8 py-4 rounded-full font-bold shadow-lg hover:bg-crescer-dark hover:scale-105 transition-all duration-300 flex items-center gap-3"
        >
          <Sparkles className="w-5 h-5" />
          Conectar Agenda IA
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    );
  }

  // Main App
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 font-sans text-gray-800 pb-20">
        
        {/* Header Section */}
        <header className="pt-10 pb-6 text-center px-4 relative overflow-hidden">
             {/* Decorative Circles Background */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] opacity-5 pointer-events-none z-0">
                <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-crescer-orange blur-3xl"></div>
                <div className="absolute top-20 right-1/4 w-80 h-80 rounded-full bg-crescer-yellow blur-3xl"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center">
                
                {/* 
                    === ÁREA DA LOGO ===
                    Substitua o link abaixo (src) pelo link da sua logo oficial.
                */}
                <div className="mb-6 w-full max-w-[300px] flex justify-center h-32 items-center p-2 rounded-lg hover:bg-white/50 transition-colors border border-transparent hover:border-gray-200 border-dashed">
                     <img 
                        src="https://klevys.online/wp-content/uploads/2025/11/crescer-logo-fundo-transparente-1200px_.png" 
                        alt="Logo Igreja Batista Crescer" 
                        className="w-full h-full object-contain"
                     />
                </div>
                {/* ==================== */}

                <p className="text-gray-500 font-medium max-w-lg mx-auto">
                    Uma comunidade de amor multiplicadora de discípulos de Jesus.
                </p>
            </div>
        </header>

        {/* Main Content Area */}
        <main className="relative z-10 px-2">
            <Routes>
                <Route path="/" element={<Agenda />} />
            </Routes>
        </main>

        {/* Footer */}
        <footer className="mt-20 py-8 text-center text-gray-400 text-sm">
            <p>© 2026 Igreja Batista Crescer. Todos os direitos reservados.</p>
        </footer>

        {/* Global Chatbot */}
        <ChatBot />
      </div>
    </Router>
  );
};

// Global type augmentation
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  interface Window {
    aistudio?: AIStudio;
  }
}

export default App;