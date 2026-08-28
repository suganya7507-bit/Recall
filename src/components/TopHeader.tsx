import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, CloudOff, Wifi, Volume2, Home, Puzzle, Clock, BookOpen, RefreshCw, Users, RotateCcw, Globe, ChevronDown, Check } from 'lucide-react';
import { Screen, UserRole, LanguageCode } from '../types';
import { SUPPORTED_LANGUAGES, TranslationSchema } from '../data/translations';
import { soundManager } from '../utils/audio';

interface TopHeaderProps {
  currentScreen: Screen;
  currentRole: UserRole;
  currentLanguage: LanguageCode;
  t: TranslationSchema;
  onNavigate: (screen: Screen) => void;
  onSwitchRole: (role: UserRole) => void;
  onLanguageChange: (lang: LanguageCode) => void;
  isOnline: boolean;
  onToggleSyncScreen: () => void;
  onToggleOnline: () => void;
  onSpeakTitle?: () => void;
  onResetData?: () => void;
  pendingRemindersCount?: number;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentScreen,
  currentRole,
  currentLanguage,
  t,
  onNavigate,
  onSwitchRole,
  onLanguageChange,
  isOnline,
  onToggleSyncScreen,
  onToggleOnline,
  onSpeakTitle,
  onResetData,
  pendingRemindersCount = 0
}) => {
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const showBackButton = currentScreen !== 'home';

  const handleBack = () => {
    soundManager.playClick();
    onNavigate('home');
  };

  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  const navItems: { id: Screen; role: UserRole; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'home', role: 'elderly', label: t.navHome, icon: <Home className="w-4 h-4" /> },
    { id: 'game', role: 'elderly', label: t.navGame, icon: <Puzzle className="w-4 h-4" /> },
    { id: 'reminders', role: 'elderly', label: t.navReminders, icon: <Clock className="w-4 h-4" />, badge: pendingRemindersCount > 0 ? pendingRemindersCount : undefined },
    { id: 'memories', role: 'elderly', label: t.navMemories, icon: <BookOpen className="w-4 h-4" /> },
    { id: 'offline_sync', role: 'elderly', label: t.navSync, icon: <RefreshCw className="w-4 h-4" /> },
    { id: 'caregiver', role: 'caregiver', label: t.navCare, icon: <Users className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#84A59D]/20 px-3 sm:px-6 lg:px-8 py-2 select-none shadow-xs w-full">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-[58px] md:h-[66px] gap-2 sm:gap-4">
        {/* Left: Brand Logo & Title */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Mobile Back / Audio Button */}
          <div className="md:hidden flex items-center">
            {showBackButton ? (
              <button
                id="header-back-btn"
                onClick={handleBack}
                aria-label="Go back to home"
                className="w-9 h-9 rounded-full flex items-center justify-center text-[#0F4C5C] hover:bg-white active:scale-95 transition-all border border-[#84A59D]/20 cursor-pointer shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
              </button>
            ) : (
              <button
                id="header-sound-btn"
                onClick={onSpeakTitle}
                title="Hear app introduction"
                className="w-9 h-9 rounded-full flex items-center justify-center text-[#0F4C5C] hover:bg-white active:scale-95 transition-all cursor-pointer shadow-sm border border-[#84A59D]/20"
              >
                <Volume2 className="w-4 h-4 text-[#84A59D]" />
              </button>
            )}
          </div>

          {/* Brand Logo & Text */}
          <button
            id="header-title-btn"
            onClick={() => {
              soundManager.playClick();
              onSwitchRole('elderly');
              onNavigate('home');
            }}
            className="flex items-center gap-2 text-left group cursor-pointer"
          >
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-[#0F4C5C] text-white flex items-center justify-center font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
              S
            </div>
            <div className="hidden xs:block">
              <span className="font-extrabold text-base md:text-xl text-[#0F4C5C] tracking-tight block leading-tight">
                {t.appName}
              </span>
              <span className="text-[10px] md:text-[11px] font-bold tracking-widest text-[#84A59D] uppercase block">
                {t.appSubtitle}
              </span>
            </div>
          </button>
        </div>

        {/* Center: Desktop Navigation Bar (>= 768px) */}
        <nav aria-label="Desktop Navigation" className="hidden lg:flex items-center gap-1.5 xl:gap-2">
          {navItems.map((item) => {
            const isActive = (item.id === 'caregiver' && (currentRole === 'caregiver' || currentScreen === 'caregiver')) ||
                             (item.id !== 'caregiver' && currentRole === 'elderly' && currentScreen === item.id);
            return (
              <button
                key={item.id}
                id={`desktop-nav-${item.id}`}
                onClick={() => {
                  soundManager.playClick();
                  onSwitchRole(item.role);
                  onNavigate(item.id);
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs xl:text-sm font-bold transition-all cursor-pointer relative ${
                  isActive
                    ? 'bg-[#0F4C5C] text-white shadow-sm'
                    : 'text-[#5C7A80] hover:text-[#0F4C5C] hover:bg-[#84A59D]/15'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && (
                  <span className="bg-[#E07A5F] text-white text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ml-0.5">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Regional Language Selector & Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* REGIONAL LANGUAGE SELECTOR BAR */}
          <div className="relative" ref={langMenuRef}>
            <button
              id="header-language-selector-btn"
              onClick={() => {
                soundManager.playClick();
                setIsLangMenuOpen(prev => !prev);
              }}
              aria-expanded={isLangMenuOpen}
              aria-label="Select Regional Language"
              title="Change regional language"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-white border-2 border-[#0F4C5C]/30 hover:border-[#0F4C5C] text-[#0F4C5C] shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer font-bold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]"
            >
              <div className="w-5 h-5 rounded-full bg-[#0F4C5C]/10 flex items-center justify-center text-[#0F4C5C]">
                <Globe className="w-3.5 h-3.5 text-[#0F4C5C]" strokeWidth={2.3} />
              </div>
              <div className="flex flex-col text-left leading-tight">
                <span className="font-extrabold text-[#0F4C5C] text-xs sm:text-sm">
                  {currentLangObj.nativeName}
                </span>
                <span className="text-[9px] sm:text-[10px] text-[#5C7A80] font-semibold hidden sm:inline">
                  {currentLangObj.name}
                </span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-[#84A59D] transition-transform duration-200 ${isLangMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Language Dropdown Menu */}
            {isLangMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 sm:w-72 bg-white rounded-2xl shadow-2xl border border-[#84A59D]/30 py-2 z-50 animate-in fade-in zoom-in-95 duration-150 max-h-[75vh] overflow-y-auto">
                <div className="px-3 py-1.5 border-b border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] font-extrabold text-[#84A59D] uppercase tracking-wider flex items-center gap-1">
                    <Globe className="w-3 h-3 text-[#0F4C5C]" /> Indian Regional Languages
                  </span>
                  <span className="text-[10px] bg-[#84A59D]/15 text-[#0F4C5C] font-bold px-1.5 py-0.5 rounded">
                    12 Languages
                  </span>
                </div>

                <div className="p-1.5 grid grid-cols-1 gap-1">
                  {SUPPORTED_LANGUAGES.map((lang) => {
                    const isSelected = lang.code === currentLanguage;
                    return (
                      <button
                        key={lang.code}
                        id={`lang-option-${lang.code}`}
                        onClick={() => {
                          soundManager.playSuccess();
                          onLanguageChange(lang.code);
                          setIsLangMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#0F4C5C] text-white font-bold shadow-xs'
                            : 'hover:bg-[#FAF7F2] text-[#0F4C5C]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-sm font-extrabold">
                            {lang.nativeName}
                          </span>
                          <span className={`text-xs ${isSelected ? 'text-white/80' : 'text-[#5C7A80]'}`}>
                            ({lang.name})
                          </span>
                        </div>
                        {isSelected && (
                          <Check className="w-4 h-4 text-white shrink-0" strokeWidth={3} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Audio Spoken Guide Button */}
          <button
            onClick={onSpeakTitle}
            title={t.spokenGuide}
            className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#84A59D]/30 text-[#0F4C5C] hover:bg-gray-50 text-xs font-bold transition-all cursor-pointer shadow-sm"
          >
            <Volume2 className="w-4 h-4 text-[#84A59D]" />
            <span className="hidden xl:inline">{t.spokenGuide}</span>
          </button>

          {/* Offline / Online Network State Indicator */}
          <button
            id="header-offline-status-btn"
            onClick={() => {
              soundManager.playClick();
              onToggleSyncScreen();
            }}
            aria-label="Offline Mode Status"
            title={isOnline ? t.networkOnline : t.simulatedOffline}
            className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-sm border ${
              isOnline
                ? 'text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border-emerald-300'
                : 'text-[#E07A5F] bg-[#E07A5F]/15 hover:bg-[#E07A5F]/25 border-[#E07A5F]/30'
            }`}
          >
            {isOnline ? (
              <>
                <Wifi className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" strokeWidth={2.5} />
                <span className="hidden sm:inline">Online</span>
              </>
            ) : (
              <>
                <CloudOff className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#E07A5F] animate-pulse" strokeWidth={2.5} />
                <span className="hidden sm:inline">{t.offlineReady}</span>
              </>
            )}
          </button>

          {/* Quick Network Simulator Toggle */}
          <button
            onClick={() => {
              soundManager.playClick();
              onToggleOnline();
            }}
            title={isOnline ? "Simulate Offline State" : "Simulate Online State"}
            className="hidden xl:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#FAF7F2] border border-[#84A59D]/40 text-[#0F4C5C] hover:bg-white text-xs font-semibold cursor-pointer shadow-xs"
          >
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
            <span>{isOnline ? 'Go Offline' : 'Go Online'}</span>
          </button>

          {/* Reset Demo Data */}
          {onResetData && (
            <button
              onClick={() => {
                soundManager.playClick();
                if (window.confirm("Reset all memories, games, and reminder states to default demo values?")) {
                  onResetData();
                }
              }}
              title="Reset all demo data"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center bg-white border border-[#84A59D]/30 text-[#5C7A80] hover:text-[#E07A5F] hover:border-[#E07A5F] transition-colors cursor-pointer shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
