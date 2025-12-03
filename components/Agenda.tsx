import React, { useState, useEffect } from 'react';
import { AGENDA_STRUCTURE } from '../constants';
import { Info, Clock, CalendarCheck, Loader2 } from 'lucide-react';
import { getQuickInfo } from '../services/geminiService';
import { fetchGoogleEvents } from '../services/googleCalendarService';
import { Season } from '../types';

export const Agenda: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [quickStats, setQuickStats] = useState<string>("Conectando à IA...");
  const [seasonsData, setSeasonsData] = useState<Season[]>(AGENDA_STRUCTURE);
  const [isLoading, setIsLoading] = useState(true);

  // Load Data exclusively from Google
  useEffect(() => {
    const loadData = async () => {
        setIsLoading(true);
        try {
            const googleData = await fetchGoogleEvents();
            // Mesmo se vier vazio (erro), usamos a estrutura para renderizar
            setSeasonsData(googleData); 
        } catch (error) {
            console.error("Erro fatal ao carregar agenda", error);
        } finally {
            setIsLoading(false);
        }
    };
    loadData();
  }, []);

  // AI Insight
  useEffect(() => {
    const fetchQuickInfo = async () => {
        const info = await getQuickInfo("Qual é a importância espiritual do planejamento anual de uma igreja? Responda em uma frase inspiradora e curta.");
        if (info) {
          setQuickStats(info);
        } else {
          setQuickStats("Bem-vindo à Agenda CRESCER 2026!");
        }
    };
    fetchQuickInfo();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header & Quick Info */}
      <div className="mb-8 text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-800">AGENDA CRESCER</h2>
        
        <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <div className="inline-flex items-center gap-2 bg-crescer-orange/10 text-crescer-dark px-4 py-2 rounded-full text-sm font-medium animate-pulse">
                <Clock size={16} />
                <span>Insight: {quickStats}</span>
            </div>

            <div className="flex gap-2 items-center">
                 <span className="flex items-center gap-1 text-xs text-green-600 font-bold bg-green-50 px-2 py-1 rounded border border-green-200">
                    <CalendarCheck size={12} /> Google Calendar Integrado
                </span>
            </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <Loader2 className="w-12 h-12 animate-spin mb-4 text-crescer-orange" />
              <p>Sincronizando eventos com Google Agenda...</p>
          </div>
      ) : (
        <>
            {/* Season Tabs */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
                {seasonsData.map((season, index) => (
                <button
                    key={season.name}
                    onClick={() => setActiveTab(index)}
                    className={`px-6 py-3 rounded-2xl flex flex-col items-center transition-all duration-300 transform hover:scale-105 border ${
                    activeTab === index
                        ? 'bg-crescer-orange text-white shadow-lg scale-105 border-crescer-orange'
                        : 'bg-white text-gray-500 hover:bg-gray-50 border-gray-200'
                    }`}
                >
                    <span className={`font-bold text-sm md:text-base uppercase tracking-wide ${activeTab === index ? 'text-white' : 'text-gray-700'}`}>
                        {season.name}
                    </span>
                    <span className={`text-[10px] md:text-xs font-medium uppercase mt-1 ${activeTab === index ? 'text-white/80' : 'text-gray-400'}`}>
                        {season.months.map(m => m.name.substring(0, 3)).join(' - ')}
                    </span>
                </button>
                ))}
            </div>

            {/* Content */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden min-h-[500px] border border-gray-100 animate-in fade-in zoom-in duration-300">
                
                {/* Cabeçalho da Estação com Imagem */}
                <div className={`p-6 md:p-10 ${seasonsData[activeTab].color} transition-colors duration-500`}>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12">
                        <div className="text-center md:text-left flex-1">
                            <h3 className="text-3xl font-extrabold mb-3 flex items-center justify-center md:justify-start gap-3">
                                <Info className="w-8 h-8 opacity-80" />
                                {seasonsData[activeTab].name}
                            </h3>
                            <p className="text-lg opacity-90 font-medium leading-relaxed">
                                {seasonsData[activeTab].description}
                            </p>
                        </div>
                        
                        {/* Container da Logo da Estação */}
                        <div className="w-40 h-40 md:w-56 md:h-56 bg-white/30 backdrop-blur-sm rounded-full p-4 shadow-xl border border-white/40 flex-shrink-0 transform transition-transform hover:scale-105 duration-500">
                            <img 
                                src={seasonsData[activeTab].imageUrl} 
                                alt={`Logo da Estação ${seasonsData[activeTab].name}`}
                                className="w-full h-full object-contain drop-shadow-lg"
                            />
                        </div>
                    </div>
                </div>

                <div className="p-8 grid md:grid-cols-3 gap-8">
                    {seasonsData[activeTab].months.map((month) => (
                        <div key={month.name} className="space-y-4">
                            <h4 className="text-xl font-bold text-gray-800 border-b-2 border-crescer-yellow inline-block pb-1">
                                {month.name}
                            </h4>
                            {month.events.length > 0 ? (
                                <ul className="space-y-3">
                                    {month.events.map((evt, idx) => (
                                        <li key={idx} className="flex gap-3 items-start group">
                                            <span className={`
                                                flex-shrink-0 w-12 text-sm font-bold py-1 text-center rounded
                                                ${evt.type === 'holiday' ? 'bg-red-100 text-red-700' : ''}
                                                ${evt.type === 'church' ? 'bg-blue-100 text-blue-700' : ''}
                                                ${evt.type === 'special' ? 'bg-crescer-yellow/30 text-crescer-dark' : ''}
                                            `}>
                                                {evt.day}
                                            </span>
                                            <span className="text-gray-700 font-medium group-hover:text-crescer-orange transition-colors">
                                                {evt.title}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-gray-400 italic">Nenhum evento encontrado nesta data.</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </>
      )}
    </div>
  );
};