import React from 'react';
import { Home, BookOpen, Users, Clock, Puzzle } from 'lucide-react';
import { Screen, UserRole } from '../types';
import { TranslationSchema } from '../data/translations';
import { soundManager } from '../utils/audio';

interface BottomNavBarProps {
  currentScreen: Screen;
  currentRole: UserRole;
  t: TranslationSchema;
  onNavigate: (screen: Screen) => void;
  onSwitchRole: (role: UserRole) => void;
  pendingRemindersCount?: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentScreen,
  currentRole,
  t,
  onNavigate,
  onSwitchRole,
  pendingRemindersCount = 0
}) => {
  const isHomeActive = currentRole === 'elderly' && currentScreen === 'home';
  const isGameActive = currentRole === 'elderly' && currentScreen === 'game';
  const isRemindersActive = currentRole === 'elderly' && currentScreen === 'reminders';
  const isMemoriesActive = currentRole === 'elderly' && currentScreen === 'memories';
  const isCareActive = currentRole === 'caregiver' || currentScreen === 'caregiver';

  const handleNav = (screen: Screen, role: UserRole) => {
    soundManager.playClick();
    onSwitchRole(role);
    onNavigate(screen);
  };

  return (
    <nav
      aria-label="Bottom Main Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-t border-[#84A59D]/20 shadow-[0_-4px_16px_rgba(15,76,92,0.06)] py-1 px-2 w-full"
    >
      <div className="max-w-md mx-auto flex items-center justify-around h-[64px]">
        {/* Home Tab */}
        <button
          id="bottom-nav-home"
          onClick={() => handleNav('home', 'elderly')}
          aria-label="Home Screen"
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[52px] rounded-xl transition-all cursor-pointer ${
            isHomeActive
              ? 'bg-[#0F4C5C] text-white px-3 py-1 shadow-sm'
              : 'text-[#5C7A80] hover:text-[#0F4C5C] px-2 py-1'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" strokeWidth={isHomeActive ? 2.5 : 2.0} />
          <span className="text-[11px] font-bold">{t.navHome}</span>
        </button>

        {/* Game Tab */}
        <button
          id="bottom-nav-game"
          onClick={() => handleNav('game', 'elderly')}
          aria-label="Memory Game"
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[52px] rounded-xl transition-all cursor-pointer ${
            isGameActive
              ? 'bg-[#0F4C5C] text-white px-3 py-1 shadow-sm'
              : 'text-[#5C7A80] hover:text-[#0F4C5C] px-2 py-1'
          }`}
        >
          <Puzzle className="w-5 h-5 mb-0.5" strokeWidth={isGameActive ? 2.5 : 2.0} />
          <span className="text-[11px] font-bold">{t.navGame}</span>
        </button>

        {/* Reminders Tab */}
        <button
          id="bottom-nav-reminders"
          onClick={() => handleNav('reminders', 'elderly')}
          aria-label="Reminders"
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[52px] rounded-xl transition-all cursor-pointer relative ${
            isRemindersActive
              ? 'bg-[#0F4C5C] text-white px-3 py-1 shadow-sm'
              : 'text-[#5C7A80] hover:text-[#0F4C5C] px-2 py-1'
          }`}
        >
          <Clock className="w-5 h-5 mb-0.5" strokeWidth={isRemindersActive ? 2.5 : 2.0} />
          <span className="text-[11px] font-bold">{t.navReminders}</span>
          {pendingRemindersCount > 0 && !isRemindersActive && (
            <span className="absolute top-1 right-2 w-2 h-2 bg-[#E07A5F] rounded-full" />
          )}
        </button>

        {/* Memories Tab */}
        <button
          id="bottom-nav-memories"
          onClick={() => handleNav('memories', 'elderly')}
          aria-label="Memory Book"
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[52px] rounded-xl transition-all cursor-pointer ${
            isMemoriesActive
              ? 'bg-[#0F4C5C] text-white px-3 py-1 shadow-sm'
              : 'text-[#5C7A80] hover:text-[#0F4C5C] px-2 py-1'
          }`}
        >
          <BookOpen className="w-5 h-5 mb-0.5" strokeWidth={isMemoriesActive ? 2.5 : 2.0} />
          <span className="text-[11px] font-bold">{t.navMemories}</span>
        </button>

        {/* Caregiver Portal Tab */}
        <button
          id="bottom-nav-caregiver"
          onClick={() => handleNav('caregiver', 'caregiver')}
          aria-label="Caregiver Portal"
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[52px] rounded-xl transition-all cursor-pointer ${
            isCareActive
              ? 'bg-[#0F4C5C] text-white px-3 py-1 shadow-sm'
              : 'text-[#5C7A80] hover:text-[#0F4C5C] px-2 py-1'
          }`}
        >
          <Users className="w-5 h-5 mb-0.5" strokeWidth={isCareActive ? 2.5 : 2.0} />
          <span className="text-[11px] font-bold">{t.navCare}</span>
        </button>
      </div>
    </nav>
  );
};
