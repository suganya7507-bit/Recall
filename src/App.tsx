import React, { useState, useEffect } from 'react';
import { Screen, UserRole, MemoryItem, ReminderItem, CaregiverAlert, LanguageCode } from './types';
import { INITIAL_MEMORIES, INITIAL_REMINDERS, INITIAL_ALERTS } from './data/initialData';
import { TRANSLATIONS } from './data/translations';
import { TopHeader } from './components/TopHeader';
import { BottomNavBar } from './components/BottomNavBar';
import { JudgeRoleSwitcher } from './components/JudgeRoleSwitcher';
import { HomeScreen } from './components/HomeScreen';
import { MemoryGameScreen } from './components/MemoryGameScreen';
import { MemoryBookScreen } from './components/MemoryBookScreen';
import { RemindersScreen } from './components/RemindersScreen';
import { OfflineSyncScreen } from './components/OfflineSyncScreen';
import { CaregiverDashboard } from './components/CaregiverDashboard';
import { soundManager, speakInstruction } from './utils/audio';

const STORAGE_KEYS = {
  MEMORIES: 'recall_app_memories_v1',
  REMINDERS: 'recall_app_reminders_v1',
  ALERTS: 'recall_app_alerts_v1',
  STATS: 'recall_app_stats_v1',
  ROLE: 'recall_app_role_v1',
  UPDATES_COUNT: 'recall_app_updates_count_v1',
  LANGUAGE: 'recall_app_language_v1'
};

export default function App() {
  // Navigation & Role State
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [currentRole, setCurrentRole] = useState<UserRole>('elderly');
  const [isOnline, setIsOnline] = useState<boolean>(false); // Starts offline as specified for Northeast India offline-first prototype

  // Regional Language Localization State
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LANGUAGE) as LanguageCode;
      if (saved && TRANSLATIONS[saved]) return saved;
      return 'en';
    } catch {
      return 'en';
    }
  });

  // Current translation object
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  // Core Data State (Loaded from localStorage or defaults)
  const [memories, setMemories] = useState<MemoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MEMORIES);
      return saved ? JSON.parse(saved) : INITIAL_MEMORIES;
    } catch {
      return INITIAL_MEMORIES;
    }
  });

  const [reminders, setReminders] = useState<ReminderItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REMINDERS);
      return saved ? JSON.parse(saved) : INITIAL_REMINDERS;
    } catch {
      return INITIAL_REMINDERS;
    }
  });

  const [alerts, setAlerts] = useState<CaregiverAlert[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ALERTS);
      return saved ? JSON.parse(saved) : INITIAL_ALERTS;
    } catch {
      return INITIAL_ALERTS;
    }
  });

  const [gamesPlayedCount, setGamesPlayedCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STATS);
      return saved ? JSON.parse(saved).count : 4;
    } catch {
      return 4;
    }
  });

  const [localUpdatesCount, setLocalUpdatesCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.UPDATES_COUNT);
      return saved ? JSON.parse(saved) : 12;
    } catch {
      return 12;
    }
  });

  // Persist language
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, currentLanguage);
    } catch (err) {
      console.warn('Storage save error:', err);
    }
  }, [currentLanguage]);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MEMORIES, JSON.stringify(memories));
    } catch (err) {
      console.warn('Storage save error:', err);
    }
  }, [memories]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
    } catch (err) {
      console.warn('Storage save error:', err);
    }
  }, [reminders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
    } catch (err) {
      console.warn('Storage save error:', err);
    }
  }, [alerts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify({ count: gamesPlayedCount }));
    } catch (err) {
      console.warn('Storage save error:', err);
    }
  }, [gamesPlayedCount]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.UPDATES_COUNT, JSON.stringify(localUpdatesCount));
    } catch (err) {
      console.warn('Storage save error:', err);
    }
  }, [localUpdatesCount]);

  // Handlers for Data Mutations
  const handleToggleReminderComplete = (reminderId: string) => {
    setReminders(prev =>
      prev.map(r => (r.id === reminderId ? { ...r, completed: !r.completed } : r))
    );
    setLocalUpdatesCount(prev => prev + 1);
  };

  const handleAddMemory = (newMemory: MemoryItem) => {
    setMemories(prev => [newMemory, ...prev]);
    setLocalUpdatesCount(prev => prev + 1);
  };

  const handleCompleteGame = (score: number) => {
    setGamesPlayedCount(prev => prev + 1);
    setLocalUpdatesCount(prev => prev + 1);
  };

  const handleSimulateSync = () => {
    setLocalUpdatesCount(0);
    setIsOnline(true);
  };

  const handleResolveAlert = (alertId: string) => {
    setAlerts(prev =>
      prev.map(a => (a.id === alertId ? { ...a, resolved: true } : a))
    );
  };

  const handleSendCustomReminder = (title: string, message: string) => {
    const newRem: ReminderItem = {
      id: `rem_${Date.now()}`,
      title,
      time: 'Custom Today',
      category: 'Caregiver Note' as any,
      icon: 'heart',
      description: message,
      completed: false
    };
    setReminders(prev => [newRem, ...prev]);
    setLocalUpdatesCount(prev => prev + 1);
  };

  const handleResetData = () => {
    setMemories(INITIAL_MEMORIES);
    setReminders(INITIAL_REMINDERS);
    setAlerts(INITIAL_ALERTS);
    setGamesPlayedCount(4);
    setLocalUpdatesCount(12);
    setIsOnline(false);
    setCurrentScreen('home');
    setCurrentRole('elderly');
    setCurrentLanguage('en');
    soundManager.playSuccess();
    speakInstruction("All demo states have been reset to default values.");
  };

  const handleSpeakTitle = () => {
    soundManager.playSuccess();
    speakInstruction(`${t.goodMorning}. ${t.peacefulDayDesc}`, undefined, currentLanguage);
  };

  const pendingRemindersCount = reminders.filter(r => !r.completed).length;

  return (
    <div className="min-h-screen w-full bg-[#FAF7F2] text-[#0F4C5C] flex flex-col font-sans selection:bg-[#0F4C5C] selection:text-white">
      {/* Overarching Judge & Evaluator Navigation Bar */}
      <JudgeRoleSwitcher
        currentRole={currentRole}
        currentScreen={currentScreen}
        isOnline={isOnline}
        onRoleChange={(role) => {
          setCurrentRole(role);
          if (role === 'caregiver') {
            setCurrentScreen('caregiver');
          } else {
            if (currentScreen === 'caregiver') setCurrentScreen('home');
          }
        }}
        onScreenChange={(screen) => {
          setCurrentScreen(screen);
          if (screen === 'caregiver') {
            setCurrentRole('caregiver');
          } else {
            setCurrentRole('elderly');
          }
        }}
        onToggleOnline={() => setIsOnline(prev => !prev)}
        onResetData={handleResetData}
      />

      {/* Top App Header & Desktop Navigation Bar with Prominent Regional Language Selector */}
      <TopHeader
        currentScreen={currentScreen}
        currentRole={currentRole}
        currentLanguage={currentLanguage}
        t={t}
        onLanguageChange={setCurrentLanguage}
        onNavigate={(screen) => {
          if (screen === 'caregiver') {
            setCurrentRole('caregiver');
          } else {
            setCurrentRole('elderly');
          }
          setCurrentScreen(screen);
        }}
        onSwitchRole={(role) => {
          setCurrentRole(role);
        }}
        isOnline={isOnline}
        onToggleSyncScreen={() => {
          setCurrentRole('elderly');
          setCurrentScreen('offline_sync');
        }}
        onToggleOnline={() => setIsOnline(prev => !prev)}
        onSpeakTitle={handleSpeakTitle}
        onResetData={handleResetData}
        pendingRemindersCount={pendingRemindersCount}
      />

      {/* Main Fluid Responsive Canvas */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col">
        {currentRole === 'caregiver' || currentScreen === 'caregiver' ? (
          <CaregiverDashboard
            alerts={alerts}
            gamesPlayedCount={gamesPlayedCount}
            localUpdatesCount={localUpdatesCount}
            onNavigate={(screen) => {
              if (screen !== 'caregiver') {
                setCurrentRole('elderly');
              }
              setCurrentScreen(screen);
            }}
            onResolveAlert={handleResolveAlert}
            onSendCustomReminder={handleSendCustomReminder}
          />
        ) : currentScreen === 'home' ? (
          <HomeScreen
            onNavigate={(screen) => setCurrentScreen(screen)}
            pendingRemindersCount={pendingRemindersCount}
            isOnline={isOnline}
            onOpenSync={() => setCurrentScreen('offline_sync')}
            currentLanguage={currentLanguage}
            t={t}
          />
        ) : currentScreen === 'game' ? (
          <MemoryGameScreen
            onCompleteGame={handleCompleteGame}
            onNavigateHome={() => setCurrentScreen('home')}
            currentLanguage={currentLanguage}
            t={t}
          />
        ) : currentScreen === 'reminders' ? (
          <RemindersScreen
            reminders={reminders}
            onToggleComplete={handleToggleReminderComplete}
            onAddReminder={(newRem) => {
              setReminders(prev => [newRem, ...prev]);
              setLocalUpdatesCount(prev => prev + 1);
            }}
            currentLanguage={currentLanguage}
            t={t}
          />
        ) : currentScreen === 'memories' ? (
          <MemoryBookScreen
            memories={memories}
            onAddMemory={handleAddMemory}
            currentLanguage={currentLanguage}
            t={t}
          />
        ) : currentScreen === 'offline_sync' ? (
          <OfflineSyncScreen
            localUpdatesCount={localUpdatesCount}
            isOnline={isOnline}
            onSimulateSync={handleSimulateSync}
            onNavigateHome={() => setCurrentScreen('home')}
          />
        ) : null}
      </main>

      {/* Mobile Bottom Navigation Bar (Hidden on desktop lg:hidden) */}
      <BottomNavBar
        currentScreen={currentScreen}
        currentRole={currentRole}
        t={t}
        onNavigate={(screen) => {
          if (screen === 'caregiver') {
            setCurrentRole('caregiver');
          } else {
            setCurrentRole('elderly');
          }
          setCurrentScreen(screen);
        }}
        onSwitchRole={(role) => {
          setCurrentRole(role);
          if (role === 'caregiver') {
            setCurrentScreen('caregiver');
          } else {
            if (currentScreen === 'caregiver') setCurrentScreen('home');
          }
        }}
        pendingRemindersCount={pendingRemindersCount}
      />
    </div>
  );
}
