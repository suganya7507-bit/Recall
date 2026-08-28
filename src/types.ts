export type Screen = 'home' | 'game' | 'reminders' | 'memories' | 'offline_sync' | 'caregiver';

export type UserRole = 'elderly' | 'caregiver';

export type LanguageCode =
  | 'en'   // English
  | 'as'   // Assamese (অসমীয়া)
  | 'bn'   // Bengali (বাংলা)
  | 'mni'  // Manipuri / Meitei (মৈতৈলোন)
  | 'ne'   // Nepali (নেপালী)
  | 'hi'   // Hindi (हिंदी)
  | 'ta'   // Tamil (தமிழ்)
  | 'te'   // Telugu (తెలుగు)
  | 'kn'   // Kannada (ಕನ್ನಡ)
  | 'ml'   // Malayalam (മലയാളം)
  | 'mr'   // Marathi (मराठी)
  | 'gu';  // Gujarati (ગુજરાતી)

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
  speechCode: string;
}

export type MemoryCategory = 'All' | 'Family' | 'Places' | 'Routines';

export interface MemoryItem {
  id: string;
  title: string;
  relationOrSubtitle: string;
  description: string;
  category: 'Family' | 'Places' | 'Routines';
  imageUrl: string;
  audioText: string;
  voiceNoteDuration?: string;
  dateAdded?: string;
}

export interface ReminderItem {
  id: string;
  title: string;
  time: string;
  category: 'Medication' | 'Water' | 'Meal' | 'Activity';
  icon: string;
  description: string;
  completed: boolean;
  completedAt?: string;
  isMissed?: boolean;
  alertSent?: boolean;
}

export interface GameOption {
  id: string;
  name: string;
  imageUrl: string;
  altText: string;
  isCorrect: boolean;
}

export interface GameRound {
  id: number;
  promptTitle: string;
  promptDescription: string;
  targetName: string;
  instructionAudioText: string;
  options: GameOption[];
  hint: string;
  culturalNote?: string;
}

export interface CaregiverAlert {
  id: string;
  title: string;
  subtitle: string;
  time: string;
  type: 'missed_reminder' | 'game_complete' | 'memory_added';
  resolved: boolean;
}

export interface SyncStatus {
  lastSynced: string;
  pendingCount: number;
  isSyncing: boolean;
  isOnline: boolean;
}
