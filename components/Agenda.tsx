import React, { useState, useEffect } from 'react';
import { AGENDA_DATA } from '../constants';
import { Info, Clock } from 'lucide-react';
import { getQuickInfo } from '../services/geminiService';

export const Agenda: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [quickStats, setQuickStats] = useState<string>("Carregando insights...");

  useEffect(() => {
    const fetchQuickInfo = async () => {
        const info = await getQuickInfo("Qual é o próximo grande evento da igreja Crescer baseado na agenda de 2026? Responda em uma frase curta.");
        if (info) {
          setQuickStats(info);
        } else {
          setQuickStats("Bem-vindo à Agenda 2026!");
        }
    };
    fetchQuickInfo();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header & Quick Info */}
      <div className="mb-8 text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-800">Planejamento 2026</h2>
        <div className="inline-flex items-center gap-2 bg-crescer-orange/10 text-crescer-dark px-4 py-2 rounded-full text-sm font-medium animate-pulse">
            <Clock size={16} />
            <span>IA Insight: {quickStats}</span>
        </div>
      </div>

      {/* Season Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {AGENDA_DATA.map((season, index) => (
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
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden min-h-[500px] border border-gray-100">
        <div className={`p-8 ${AGENDA_DATA[activeTab].color} transition-colors duration-500`}>
            <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <Info className="w-6 h-6" />
                {AGENDA_DATA[activeTab].name}
            </h3>
            <p className="opacity-90">{AGENDA_DATA[activeTab].description}</p>
        </div>

        <div className="p-8 grid md:grid-cols-3 gap-8">
            {AGENDA_DATA[activeTab].months.map((month) => (
                <div key={month.name} className="space-y-4">
                    <h4 className="text-xl font-bold text-gray-800 border-b-2 border-crescer-yellow inline-block pb-1">
                        {month.name}
                    </h4>
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
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};