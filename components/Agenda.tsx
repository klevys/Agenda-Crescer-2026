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
            <div className="flex flex-wrap justify-center gap-2 mb-8">
                {seasonsData.map((season, index) => (
                <button
                    key={season.name}
                    onClick={() => setActiveTab(index)}
                    className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                    activeTab === index
                        ? 'bg-crescer-orange text-white shadow-lg scale-105'
                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                >
                    {season.name}
                </button>
                ))}
            </div>

            {/* Content */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden min-h-[500px] border border-gray-100 animate-in fade-in zoom-in duration-300">
                <div className={`p-8 ${seasonsData[activeTab].color} transition-colors duration-500`}>
                    <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                        <Info className="w-6 h-6" />
                        {seasonsData[activeTab].name}
                    </h3>
                    <p className="opacity-90">{seasonsData[activeTab].description}</p>
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