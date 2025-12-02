export interface Event {
  day: string;
  title: string;
  type: 'holiday' | 'church' | 'special';
}

export interface MonthData {
  name: string;
  events: Event[];
}

export interface Season {
  name: string;
  color: string;
  months: MonthData[];
  description: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface InventoryItem {
  name: string;
  description: string;
}

export interface Quest {
  title: string;
  status: 'active' | 'completed' | 'failed';
  description: string;
}

export interface GameState {
  inventory: InventoryItem[];
  currentQuest: Quest | null;
  history: string[]; // Previous context for the AI
  currentSceneImage: string | null;
  sceneText: string;
  choices: string[];
  isLoading: boolean;
  imageSize: '1K' | '2K' | '4K';
}

export interface QuickStats {
  nextEvent: string;
  daysUntil: number;
}
