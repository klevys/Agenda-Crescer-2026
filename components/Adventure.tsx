import React, { useState, useEffect, useRef } from 'react';
import { generateNextScene, generateSceneImage } from '../services/geminiService';
import { GameState, InventoryItem, Quest } from '../types';
import { Backpack, Map as MapIcon, Loader2, Sparkles, AlertCircle } from 'lucide-react';

export const Adventure: React.FC = () => {
  const [apiKeySelected, setApiKeySelected] = useState(false);
  const [state, setState] = useState<GameState>({
    inventory: [],
    currentQuest: null,
    history: ["The journey begins at the gates of the Crescer Kingdom. You are a traveler seeking spiritual wisdom."],
    currentSceneImage: null,
    sceneText: "Welcome, Traveler. Your journey through the Seasons of Growth begins now. The path ahead is split: one leads to the Fields of Cultivation, and the other to the River of Care. Where will you go?",
    choices: ["Walk towards the Fields of Cultivation", "Head to the River of Care"],
    isLoading: false,
    imageSize: '1K'
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  // Check for API key on mount
  useEffect(() => {
    const checkKey = async () => {
       if (window.aistudio && window.aistudio.hasSelectedApiKey) {
           const hasKey = await window.aistudio.hasSelectedApiKey();
           if (hasKey) {
             setApiKeySelected(true);
           }
       } else {
         // If generic env or no window object, assume env var is set or allow fallback flow
         // Ideally we want to force selection for high cost models if requested, but standard flow:
         setApiKeySelected(true);
       }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
      if (window.aistudio && window.aistudio.openSelectKey) {
          await window.aistudio.openSelectKey();
          setApiKeySelected(true);
      } else {
          alert("API Key selection not available in this environment.");
      }
  };

  const handleChoice = async (choice: string) => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      // Generate Next Text
      const nextSceneData = await generateNextScene(
        state.history,
        state.inventory,
        state.currentQuest,
        choice
      );

      // Update Inventory
      let newInventory = [...state.inventory];
      if (nextSceneData.inventoryUpdate) {
        nextSceneData.inventoryUpdate.forEach((update: any) => {
          if (update.action === 'add') {
             newInventory.push({ name: update.name, description: update.description });
          } else {
             newInventory = newInventory.filter(i => i.name !== update.name);
          }
        });
      }

      // Update Quest
      let newQuest = state.currentQuest;
      if (nextSceneData.questUpdate) {
        newQuest = {
          title: nextSceneData.questUpdate.title,
          description: nextSceneData.questUpdate.description,
          status: nextSceneData.questUpdate.status
        };
      }

      // Generate Image (Parallel or Sequential - Sequential for better error handling here)
      const newImage = await generateSceneImage(nextSceneData.sceneText, state.imageSize);

      setState(prev => ({
        ...prev,
        history: [...prev.history, choice, nextSceneData.sceneText],
        sceneText: nextSceneData.sceneText,
        choices: nextSceneData.choices,
        inventory: newInventory,
        currentQuest: newQuest,
        currentSceneImage: newImage,
        isLoading: false
      }));

    } catch (error) {
      console.error(error);
      setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          sceneText: "The mists of uncertainty cloud your vision. (AI Error - Try again)",
          choices: ["Try again"]
      }));
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [state.sceneText]);

  if (!apiKeySelected) {
      return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Adventure Mode Requires API Access</h2>
              <p className="text-gray-600 max-w-md">To generate high-quality images and story elements, please select your API key.</p>
              <button 
                onClick={handleSelectKey}
                className="bg-crescer-orange text-white px-6 py-3 rounded-full font-bold hover:bg-crescer-dark transition-colors"
              >
                  Select API Key
              </button>
              <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="text-sm text-blue-500 underline">
                  Billing Information
              </a>
          </div>
      )
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[80vh] max-w-7xl mx-auto p-4">
      {/* Main Game Area */}
      <div className="flex-1 flex flex-col bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
        
        {/* Image Display */}
        <div className="relative h-64 lg:h-96 bg-gray-900 flex items-center justify-center overflow-hidden">
            {state.isLoading ? (
                <div className="flex flex-col items-center text-white/80 gap-3">
                    <Loader2 className="animate-spin w-12 h-12" />
                    <span className="text-lg font-light tracking-widest uppercase">Weaving Reality...</span>
                </div>
            ) : state.currentSceneImage ? (
                <img 
                    src={state.currentSceneImage} 
                    alt="Scene" 
                    className="w-full h-full object-cover animate-in fade-in duration-1000"
                />
            ) : (
                <div className="text-white/50 flex flex-col items-center">
                    <Sparkles className="w-12 h-12 mb-2"/>
                    <span>Adventure Awaits</span>
                </div>
            )}
            
            {/* Settings Overlay */}
            <div className="absolute top-4 right-4">
                <select 
                    value={state.imageSize} 
                    onChange={(e) => setState(s => ({...s, imageSize: e.target.value as any}))}
                    className="bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-md border border-white/20 outline-none"
                >
                    <option value="1K">Quality: 1K</option>
                    <option value="2K">Quality: 2K</option>
                    <option value="4K">Quality: 4K</option>
                </select>
            </div>
        </div>

        {/* Text & Interaction */}
        <div className="flex-1 p-6 flex flex-col overflow-hidden bg-white relative">
            <div className="flex-1 overflow-y-auto pr-2 mb-6" ref={scrollRef}>
                <p className="text-lg leading-relaxed text-gray-800 whitespace-pre-line font-serif">
                    {state.sceneText}
                </p>
            </div>

            {/* Choices */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-auto">
                {state.choices.map((choice, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleChoice(choice)}
                        disabled={state.isLoading}
                        className="p-4 text-left rounded-xl bg-gray-50 border-2 border-gray-100 hover:border-crescer-orange hover:bg-crescer-orange/5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                        <span className="font-semibold text-gray-700 group-hover:text-crescer-orange block">
                             {choice}
                        </span>
                    </button>
                ))}
            </div>
        </div>
      </div>

      {/* Sidebar: Inventory & Quests */}
      <div className="w-full lg:w-80 flex flex-col gap-6">
        
        {/* Quest Card */}
        <div className="bg-white p-6 rounded-3xl shadow-lg border-t-4 border-crescer-orange">
            <div className="flex items-center gap-2 mb-4 text-crescer-dark">
                <MapIcon className="w-5 h-5" />
                <h3 className="font-bold uppercase tracking-wide text-sm">Current Quest</h3>
            </div>
            {state.currentQuest ? (
                <div className="bg-orange-50 p-4 rounded-xl">
                    <h4 className="font-bold text-gray-900">{state.currentQuest.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{state.currentQuest.description}</p>
                    <span className={`inline-block mt-2 text-xs px-2 py-1 rounded-full font-bold uppercase
                        ${state.currentQuest.status === 'active' ? 'bg-blue-100 text-blue-700' : ''}
                        ${state.currentQuest.status === 'completed' ? 'bg-green-100 text-green-700' : ''}
                        ${state.currentQuest.status === 'failed' ? 'bg-red-100 text-red-700' : ''}
                    `}>
                        {state.currentQuest.status}
                    </span>
                </div>
            ) : (
                <p className="text-gray-400 text-sm italic">No active quest.</p>
            )}
        </div>

        {/* Inventory Card */}
        <div className="bg-white p-6 rounded-3xl shadow-lg border-t-4 border-crescer-yellow flex-1">
            <div className="flex items-center gap-2 mb-4 text-crescer-dark">
                <Backpack className="w-5 h-5" />
                <h3 className="font-bold uppercase tracking-wide text-sm">Inventory</h3>
            </div>
            {state.inventory.length > 0 ? (
                <ul className="space-y-2">
                    {state.inventory.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                <span className="text-xs">Item</span>
                            </div>
                            <div>
                                <p className="font-medium text-gray-800 text-sm">{item.name}</p>
                                <p className="text-xs text-gray-500">{item.description}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-400 text-sm italic">Your bag is empty.</p>
            )}
        </div>
      </div>
    </div>
  );
};
