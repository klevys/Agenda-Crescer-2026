import { GoogleGenAI, Type } from "@google/genai";

// Helper to instantiate the client with the current API key
// Creating instance inside function ensures it picks up the key after user selection
const getAiClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

// 1. Fast Response (Standard Flash)
export const getQuickInfo = async (prompt: string) => {
  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are a helpful assistant for Igreja Batista Crescer. Provide extremely concise, one-sentence summaries or answers.",
      }
    });
    return response.text;
  } catch (error) {
    console.error("Fast AI Error:", error);
    // Return null to allow UI to handle empty state or retry
    return null;
  }
};

// 2. Chatbot (Flash - More Stable)
export const getChatResponse = async (history: {role: string, parts: {text: string}[]}[], message: string) => {
  try {
    const ai = getAiClient();
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash', // Switched to flash for stability
      history: history,
      config: {
        systemInstruction: "You are a warm, welcoming, and knowledgeable assistant for Igreja Batista Crescer. You help members find events in the 2026 agenda and answer spiritual questions.",
      }
    });

    const result = await chat.sendMessage({ message });
    return result.text;
  } catch (error) {
    console.error("Chat Error:", error);
    throw error; // Throw to let component handle UI
  }
};

// 3. Adventure Game Logic (Pro) - Kept for reference if re-enabled later
export const generateNextScene = async (
  history: string[], 
  currentInventory: any[], 
  currentQuest: any, 
  userChoice: string
) => {
  try {
    const prompt = `
      You are the dungeon master of a text-based adventure game set in a fantasy world with themes of spiritual growth.
      Context: ${history.slice(-3).join('\n')}
      Current Inventory: ${JSON.stringify(currentInventory)}
      Current Quest: ${JSON.stringify(currentQuest)}
      User Action: ${userChoice}
      Generate the next scene, update inventory/quest, and provide choices. Return JSON.
    `;

    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sceneText: { type: Type.STRING },
            choices: { type: Type.ARRAY, items: { type: Type.STRING } },
            inventoryUpdate: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  action: { type: Type.STRING, enum: ['add', 'remove'] }
                }
              }
            },
            questUpdate: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                status: { type: Type.STRING, enum: ['active', 'completed', 'failed'] }
              }
            }
          }
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Game Logic Error:", error);
    throw error;
  }
};

// 4. Adventure Game Image (Pro Image)
export const generateSceneImage = async (sceneDescription: string, size: '1K' | '2K' | '4K') => {
  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          { text: `A digital art style illustration of: ${sceneDescription}. High fantasy, warm lighting.` }
        ]
      },
      config: {
        imageConfig: {
          imageSize: size,
          aspectRatio: "16:9" 
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image Gen Error:", error);
    return null;
  }
};