import React from 'react';
import { RotateCcw, Volume2, Sparkles, Wifi, WifiOff } from 'lucide-react';
import { Screen, UserRole } from '../types';
import { soundManager, speakInstruction } from '../utils/audio';

interface JudgeRoleSwitcherProps {
  currentRole: UserRole;
  currentScreen: Screen;
  isOnline: boolean;
  onRoleChange: (role: UserRole) => void;
  onScreenChange: (screen: Screen) => void;
  onToggleOnline: () => void;
  onResetData: () => void;
}

export const JudgeRoleSwitcher: React.FC<JudgeRoleSwitcherProps> = ({
  currentRole,
  currentScreen,
  isOnline,
  onRoleChange,
  onScreenChange,
  onToggleOnline,
  onResetData
}) => {
  const handleTestVoice = () => {
    soundManager.playSuccess();
    speakInstruction("Namaskar Amina. Recall is working offline and ready to assist you.");
  };

  return (
    <header className="bg-[#0F4C5C] text-white border-b border-[#84A59D]/30 px-3 sm:px-6 py-2 text-xs select-none sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Role Switcher Tabs */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#84A59D] uppercase tracking-wider text-[11px] hidden sm:inline-flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-white" /> View Mode:
          </span>
          <div className="inline-flex bg-black/20 p-1 rounded-xl border border-white/10">
            <button
              id="switcher-btn-elderly"
              onClick={() => {
                soundManager.playClick();
                onRoleChange('elderly');
                if (currentScreen === 'caregiver') onScreenChange('home');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-xs transition-all cursor-pointer ${
                currentRole === 'elderly'
                  ? 'bg-white text-[#0F4C5C] shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <span>👵</span>
              <span>Elderly Patient (Amina)</span>
            </button>

            <button
              id="switcher-btn-caregiver"
              onClick={() => {
                soundManager.playClick();
                onRoleChange('caregiver');
                onScreenChange('caregiver');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-xs transition-all cursor-pointer ${
                currentRole === 'caregiver'
                  ? 'bg-[#E07A5F] text-white shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <span>👩‍⚕️</span>
              <span>Caregiver Dashboard</span>
            </button>
          </div>
        </div>

        {/* Center: Quick Screen Jump for Judges */}
        <div className="hidden lg:flex items-center gap-1.5">
          <span className="text-white/60 text-[11px]">Quick Jump:</span>
          {[
            { id: 'home', label: '🏠 Home' },
            { id: 'game', label: '🧩 Memory Game' },
            { id: 'reminders', label: '⏰ Reminders' },
            { id: 'memories', label: '📖 Memory Book' },
            { id: 'offline_sync', label: '☁️ Offline Sync' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                soundManager.playClick();
                onRoleChange('elderly');
                onScreenChange(item.id as Screen);
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                currentScreen === item.id && currentRole === 'elderly'
                  ? 'bg-white text-[#0F4C5C] font-bold shadow-sm'
                  : 'text-white/80 hover:bg-white/10'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Right: Simulator Controls */}
        <div className="flex items-center gap-2">
          {/* Offline Toggle */}
          <button
            onClick={() => {
              soundManager.playClick();
              onToggleOnline();
            }}
            title="Toggle simulated network state"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
              isOnline
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-100'
                : 'bg-[#E07A5F]/20 border-[#E07A5F] text-[#FFDBCE]'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
            <span>{isOnline ? 'Network Online' : 'Simulated Offline'}</span>
          </button>

          {/* Voice Prompt Audio Test */}
          <button
            onClick={handleTestVoice}
            title="Test Voice Speech Synthesis"
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all active:scale-95 cursor-pointer"
          >
            <Volume2 className="w-3.5 h-3.5 text-[#84A59D]" />
            <span className="hidden sm:inline">Voice Test</span>
          </button>

          {/* Reset Demo Data */}
          <button
            onClick={() => {
              soundManager.playClick();
              if (window.confirm("Reset all memories, games, and reminder states to default demo values?")) {
                onResetData();
              }
            }}
            title="Reset to fresh demo states"
            className="p-1.5 rounded-lg bg-white/10 hover:bg-[#E07A5F] text-white border border-white/20 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
