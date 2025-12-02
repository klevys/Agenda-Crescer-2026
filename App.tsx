import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Agenda } from './components/Agenda';
import { ChatBot } from './components/ChatBot';
import { Calendar } from 'lucide-react';

const App: React.FC = () => {
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
                    Pode ser um link externo ou um arquivo local na pasta public.
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
                    Uma comunidade de amor multiplicadora discílos de Jesus.
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

        {/* Define window interface extension for AI Studio in the same file or d.ts, but here works for runtime */}
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