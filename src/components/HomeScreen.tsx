import React, { useState } from 'react';
import { Mic, CheckCircle2, ChevronRight, Puzzle, Clock, BookOpen, Volume2, Sparkles, X, Heart, ShieldCheck, ArrowRight, Play, Globe } from 'lucide-react';
import { Screen, LanguageCode } from '../types';
import { TranslationSchema, SUPPORTED_LANGUAGES } from '../data/translations';
import { soundManager, speakInstruction, stopSpeaking } from '../utils/audio';

interface HomeScreenProps {
  onNavigate: (screen: Screen) => void;
  pendingRemindersCount: number;
  isOnline: boolean;
  onOpenSync: () => void;
  currentLanguage: LanguageCode;
  t: TranslationSchema;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigate,
  pendingRemindersCount,
  isOnline,
  onOpenSync,
  currentLanguage,
  t
}) => {
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [voiceQueryText, setVoiceQueryText] = useState('');
  const [voiceResponseText, setVoiceResponseText] = useState('');
  const [isSpeakingResponse, setIsSpeakingResponse] = useState(false);

  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  const handleSpeakClick = () => {
    soundManager.playReminderChime();
    setIsVoiceActive(true);
    setVoiceQueryText(t.listeningToYou);
    setVoiceResponseText('');

    // Play initial localized voice prompt
    speakInstruction(t.voicePromptInit, () => {
      // Simulate speech recognition results after a gentle delay
      setTimeout(() => {
        setVoiceQueryText(t.sampleVoiceQ3);
        const reply = t.voiceScheduleReply;
        setVoiceResponseText(reply);
        setIsSpeakingResponse(true);
        speakInstruction(reply, () => {
          setIsSpeakingResponse(false);
        }, currentLanguage);
      }, 1500);
    }, currentLanguage);
  };

  const handleVoiceQuickAction = (actionText: string, targetScreen?: Screen) => {
    soundManager.playClick();
    setVoiceQueryText(`“${actionText}”`);
    
    let reply = "";
    if (targetScreen === 'game') {
      reply = `${t.playMemoryGame}! ${t.memoryGameDesc}`;
    } else if (targetScreen === 'reminders') {
      reply = `${t.todaysReminders}. ${t.remindersDesc}`;
    } else if (targetScreen === 'memories') {
      reply = `${t.memoryBook}. ${t.memoryBookDesc}`;
    } else {
      reply = t.peacefulDayDesc;
    }

    setVoiceResponseText(reply);
    setIsSpeakingResponse(true);
    speakInstruction(reply, () => {
      setIsSpeakingResponse(false);
      if (targetScreen) {
        setTimeout(() => {
          setIsVoiceActive(false);
          onNavigate(targetScreen);
        }, 500);
      }
    }, currentLanguage);
  };

  const closeVoiceModal = () => {
    stopSpeaking();
    setIsVoiceActive(false);
    setIsSpeakingResponse(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col pb-24 md:pb-8">
      {/* Hero Welcome & Companion Banner */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-center mb-6 md:mb-8 bg-white rounded-[28px] p-5 sm:p-7 md:p-8 soft-shadow border border-[#84A59D]/20 relative overflow-hidden">
        {/* Left Col: Greeting, Voice Assistant Trigger & Reassurance */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <div className="inline-flex items-center gap-2 bg-[#84A59D]/15 border border-[#84A59D]/30 px-3.5 py-1 rounded-full text-xs font-bold text-[#0F4C5C]">
              <span className="text-[#E07A5F]">☀️</span>
              <span>{t.tagline}</span>
            </div>

            {/* Active Voice Language Indicator Badge */}
            <div className="inline-flex items-center gap-1.5 bg-[#0F4C5C] text-white px-3 py-1 rounded-full text-xs font-extrabold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{t.voiceActiveBadge}</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0F4C5C] tracking-tight mb-2 leading-tight">
            {t.goodMorning}
          </h1>

          <p className="text-base sm:text-lg text-[#5C7A80] font-medium mb-6 max-w-xl">
            {t.peacefulDayDesc}
          </p>

          {/* Prominent Voice Assistant "Tap to Speak" Card with Active Language Badge */}
          <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              id="home-tap-to-speak-btn"
              onClick={handleSpeakClick}
              aria-label={t.tapToSpeak}
              className="flex-1 min-h-[72px] sm:min-h-[80px] bg-[#0F4C5C] hover:bg-[#0F4C5C]/95 active:scale-[0.99] text-white rounded-[20px] px-5 py-3.5 flex items-center justify-between gap-4 transition-all shadow-md cursor-pointer group focus:ring-4 focus:ring-[#84A59D]/30"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 bg-[#84A59D] rounded-full flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform shadow-sm relative">
                  <Mic className="w-6 h-6 text-white" />
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-[#0F4C5C]" />
                </div>
                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-lg sm:text-xl font-bold tracking-wide">{t.tapToSpeak}</span>
                    <span className="text-[10px] bg-white/20 text-white font-bold px-2 py-0.5 rounded-md uppercase">
                      {currentLangObj.nativeName}
                    </span>
                  </div>
                  <span className="text-xs text-[#84A59D] font-medium">{t.talkToVoiceCompanion}</span>
                </div>
              </div>

              {/* Animated Wave Indicator */}
              <div className="flex items-center gap-1 shrink-0">
                <div className="w-1.5 h-6 bg-[#E07A5F] rounded-full animate-bounce" />
                <div className="w-1.5 h-9 bg-[#E07A5F] rounded-full animate-bounce [animation-delay:0.15s]" />
                <div className="w-1.5 h-5 bg-[#E07A5F] rounded-full animate-bounce [animation-delay:0.3s]" />
              </div>
            </button>

            {/* Offline Status Quick Pill */}
            <button
              id="home-offline-pill"
              onClick={() => {
                soundManager.playClick();
                onOpenSync();
              }}
              title="Tap to see offline synchronization status"
              className="flex sm:flex-col items-center justify-center gap-1.5 px-4 py-3 sm:py-2.5 bg-[#FAF7F2] hover:bg-gray-100 active:scale-95 transition-all rounded-[20px] text-[#0F4C5C] font-semibold text-xs border border-[#84A59D]/30 cursor-pointer shadow-xs whitespace-nowrap"
            >
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#84A59D]" />
                <span className="font-bold">{t.offlineReady}</span>
              </div>
              <span className="text-[11px] text-[#5C7A80]">
                {isOnline ? t.cloudSynced : t.onDevice}
              </span>
            </button>
          </div>
        </div>

        {/* Right Col: Warm Reassuring Illustration */}
        <div className="lg:col-span-5 relative">
          <div className="w-full h-[220px] sm:h-[260px] lg:h-[280px] rounded-[24px] overflow-hidden bg-[#FAF7F2] border border-[#84A59D]/20 shadow-sm relative group">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqfqz2cFgc3HdPzQDuFPLgNw1-BxgH3Ya5ovnRx85jJvP3PTikDHJeRRdujxvK5-4PWqnC-WPTVqF0KS1CCmk8Opy72sdT_iT3Yj-Q68OHS_nTuKYfMAocrpCrneURB_fDIx03M3wpLq6bXNe_gNuqtxhEa3bOzMi66z9Vn5UTMipzx7N98rYU_7Sw5iELqkwPP0TYhtxLFboc7xYZSV3hITpqp5LXTQm3MmiZI865ba3mxqjdsl0d"
              alt="Warm reassuring illustration of elderly woman with a supportive companion in a peaceful room"
              className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500"
            />
            {/* Silk badge */}
            <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm px-3.5 py-1.5 rounded-full text-xs font-bold text-[#0F4C5C] flex items-center gap-1.5 shadow-sm border border-[#84A59D]/20">
              <Heart className="w-3.5 h-3.5 text-[#E07A5F] fill-[#E07A5F]" />
              <span>Saanidhya Care Circle</span>
            </div>
          </div>
        </div>
      </section>

      {/* Multi-Column Action Cards (Responsive Dashboard Grid) */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="text-xl md:text-2xl font-extrabold text-[#0F4C5C] tracking-tight">
            {t.coreActivities}
          </h2>
          <span className="text-xs font-bold text-[#84A59D] uppercase tracking-wider hidden sm:inline">
            {t.designedForClarity}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 w-full">
          {/* Card 1: Play Memory Game */}
          <button
            id="home-card-memory-game"
            onClick={() => {
              soundManager.playClick();
              onNavigate('game');
            }}
            className="bg-white rounded-[24px] p-5 md:p-6 border-b-4 border-[#84A59D] border-x border-t border-gray-100 flex flex-col justify-between shadow-sm hover:shadow-md active:bg-gray-50 active:scale-[0.99] transition-all focus:ring-4 focus:ring-[#84A59D]/30 focus:outline-none text-left group cursor-pointer min-h-[220px]"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-[#84A59D]/20 text-[#0F4C5C] rounded-2xl flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">
                  <Puzzle className="w-8 h-8" strokeWidth={2.3} />
                </div>
                <span className="text-xs bg-[#84A59D]/15 text-[#0F4C5C] font-bold px-2.5 py-1 rounded-full border border-[#84A59D]/30">
                  {t.roundsCount}
                </span>
              </div>

              <h3 className="font-extrabold text-2xl text-[#0F4C5C] block leading-tight mb-1">
                {t.playMemoryGame}
              </h3>
              <p className="text-xs sm:text-sm text-[#5C7A80] font-medium leading-relaxed">
                {t.memoryGameDesc}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#84A59D]/15 flex items-center justify-between text-sm font-bold text-[#0F4C5C]">
              <span>{t.startGame}</span>
              <div className="w-8 h-8 rounded-full bg-[#FAF7F2] flex items-center justify-center text-[#84A59D] group-hover:text-[#0F4C5C] group-hover:translate-x-1 transition-all">
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>
          </button>

          {/* Card 2: Today's Reminders */}
          <button
            id="home-card-reminders"
            onClick={() => {
              soundManager.playClick();
              onNavigate('reminders');
            }}
            className="bg-white rounded-[24px] p-5 md:p-6 border-b-4 border-[#E07A5F] border-x border-t border-gray-100 flex flex-col justify-between shadow-sm hover:shadow-md active:bg-gray-50 active:scale-[0.99] transition-all focus:ring-4 focus:ring-[#E07A5F]/30 focus:outline-none text-left group cursor-pointer min-h-[220px]"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-[#E07A5F]/20 text-[#E07A5F] rounded-2xl flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">
                  <Clock className="w-8 h-8" strokeWidth={2.3} />
                </div>
                {pendingRemindersCount > 0 ? (
                  <span className="bg-[#E07A5F] text-white text-xs px-2.5 py-1 rounded-full font-bold shadow-xs">
                    {pendingRemindersCount} {t.pendingCount}
                  </span>
                ) : (
                  <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-bold">
                    {t.allDone}
                  </span>
                )}
              </div>

              <h3 className="font-extrabold text-2xl text-[#0F4C5C] block leading-tight mb-1">
                {t.todaysReminders}
              </h3>
              <p className="text-xs sm:text-sm text-[#5C7A80] font-medium leading-relaxed">
                {t.remindersDesc}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#84A59D]/15 flex items-center justify-between text-sm font-bold text-[#E07A5F]">
              <span>{t.viewReminders}</span>
              <div className="w-8 h-8 rounded-full bg-[#FAF7F2] flex items-center justify-center text-[#E07A5F] group-hover:translate-x-1 transition-all">
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>
          </button>

          {/* Card 3: Memory Book */}
          <button
            id="home-card-memory-book"
            onClick={() => {
              soundManager.playClick();
              onNavigate('memories');
            }}
            className="bg-white rounded-[24px] p-5 md:p-6 border-b-4 border-[#0F4C5C] border-x border-t border-gray-100 flex flex-col justify-between shadow-sm hover:shadow-md active:bg-gray-50 active:scale-[0.99] transition-all focus:ring-4 focus:ring-[#0F4C5C]/30 focus:outline-none text-left group cursor-pointer min-h-[220px]"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-[#0F4C5C]/20 text-[#0F4C5C] rounded-2xl flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">
                  <BookOpen className="w-8 h-8" strokeWidth={2.3} />
                </div>
                <span className="text-xs bg-[#0F4C5C]/10 text-[#0F4C5C] font-bold px-2.5 py-1 rounded-full border border-[#0F4C5C]/20">
                  {t.familyAlbum}
                </span>
              </div>

              <h3 className="font-extrabold text-2xl text-[#0F4C5C] block leading-tight mb-1">
                {t.memoryBook}
              </h3>
              <p className="text-xs sm:text-sm text-[#5C7A80] font-medium leading-relaxed">
                {t.memoryBookDesc}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#84A59D]/15 flex items-center justify-between text-sm font-bold text-[#0F4C5C]">
              <span>{t.openAlbum}</span>
              <div className="w-8 h-8 rounded-full bg-[#FAF7F2] flex items-center justify-center text-[#84A59D] group-hover:text-[#0F4C5C] group-hover:translate-x-1 transition-all">
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>
          </button>
        </div>
      </section>

      {/* Desktop Secondary Snapshot Row */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
        {/* Caregiver Pulse Card */}
        <div className="bg-white rounded-[24px] p-5 soft-shadow border border-[#84A59D]/20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#84A59D]/30 shrink-0">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBF8hcByBO0GyVHzWtOMjGwjWHJzOEgkRtFbhTi8lEKW5RWOMOv7l7o7Au0L4gXgDI-qBaBbLJ05r0-Kdr5s9BS-L5xI9recC3klIkdxOXKBI5yxglUuIMX79l890QsMs_P8sAtd203ZQXyheZ9rU8ycZtmkSb8adGKFBlodMWWVob4lkmFw0flJ7iNDtSSlIZfUmPoVUCGXGPVBkA9UI13DVFmcfRMY6FNf8RfNsqhoVwjn-P8pku"
                alt="Caregiver Priya"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#84A59D] block">
                {t.careCircleNote}
              </span>
              <p className="text-sm font-bold text-[#0F4C5C]">
                {t.priyaVisitNotice}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onNavigate('caregiver');
            }}
            className="px-3.5 py-2 bg-[#FAF7F2] hover:bg-gray-100 text-[#0F4C5C] text-xs font-bold rounded-xl border border-[#84A59D]/30 whitespace-nowrap cursor-pointer transition-colors"
          >
            {t.carePortal}
          </button>
        </div>

        {/* Offline Security Card */}
        <div className="bg-white rounded-[24px] p-5 soft-shadow border border-[#84A59D]/20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#84A59D]/20 text-[#0F4C5C] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#84A59D] block">
                {t.offlineSecurity}
              </span>
              <p className="text-sm font-bold text-[#0F4C5C]">
                {t.offlineSecurityDesc}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onOpenSync();
            }}
            className="px-3.5 py-2 bg-[#FAF7F2] hover:bg-gray-100 text-[#0F4C5C] text-xs font-bold rounded-xl border border-[#84A59D]/30 whitespace-nowrap cursor-pointer transition-colors"
          >
            {t.syncTool}
          </button>
        </div>
      </section>

      {/* Interactive Voice Assistant Modal / Sheet */}
      {isVoiceActive && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-[#FAF7F2] border-t-4 sm:border-4 border-[#0F4C5C] w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={closeVoiceModal}
              aria-label="Close voice assistant"
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white text-[#0F4C5C] border border-[#84A59D]/20 flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer shadow-sm"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Glowing Microphone Orb with Language Indicator */}
            <div className="w-20 h-20 rounded-full bg-[#0F4C5C] text-white flex items-center justify-center shadow-lg relative my-3">
              <div className="absolute inset-0 rounded-full bg-[#84A59D] animate-ping opacity-30" />
              <Mic className="w-10 h-10 text-white" />
            </div>

            <div className="inline-flex items-center gap-1.5 bg-[#0F4C5C] text-white px-3 py-1 rounded-full text-xs font-extrabold shadow-xs mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{t.voiceActiveBadge} ({currentLangObj.nativeName})</span>
            </div>

            {/* Animated Voice Waves */}
            <div className="flex items-center justify-center gap-1.5 h-10 my-2">
              <div className="voice-bar w-1.5 bg-[#0F4C5C] rounded-full" />
              <div className="voice-bar w-1.5 bg-[#84A59D] rounded-full" />
              <div className="voice-bar w-1.5 bg-[#E07A5F] rounded-full" />
              <div className="voice-bar w-1.5 bg-[#0F4C5C] rounded-full" />
              <div className="voice-bar w-1.5 bg-[#84A59D] rounded-full" />
              <div className="voice-bar w-1.5 bg-[#E07A5F] rounded-full" />
              <div className="voice-bar w-1.5 bg-[#0F4C5C] rounded-full" />
            </div>

            {/* Live Spoken Query */}
            <div className="bg-white border border-[#84A59D]/20 rounded-[20px] p-4 w-full shadow-sm mb-4">
              <p className="text-lg font-bold text-[#0F4C5C] mb-1">
                {voiceQueryText}
              </p>
              {voiceResponseText && (
                <div className="mt-3 pt-3 border-t border-[#84A59D]/10 text-left flex items-start gap-2.5">
                  <Sparkles className="w-5 h-5 text-[#E07A5F] shrink-0 mt-0.5" />
                  <p className="text-sm text-[#0F4C5C] leading-relaxed font-medium">
                    {voiceResponseText}
                  </p>
                </div>
              )}
            </div>

            {/* Quick voice prompts */}
            <p className="text-[11px] text-[#84A59D] uppercase font-bold tracking-wider mb-2">
              {t.orTapToSpeak}
            </p>
            <div className="flex flex-col gap-2 w-full">
              <button
                onClick={() => handleVoiceQuickAction(t.sampleVoiceQ1, 'game')}
                className="bg-white hover:bg-gray-50 text-[#0F4C5C] font-bold text-sm py-3 px-4 rounded-xl border border-[#84A59D]/30 transition-all flex items-center justify-between cursor-pointer"
              >
                <span>{t.sampleVoiceQ1}</span>
                <ChevronRight className="w-4 h-4 text-[#84A59D]" />
              </button>
              <button
                onClick={() => handleVoiceQuickAction(t.sampleVoiceQ2, 'memories')}
                className="bg-white hover:bg-gray-50 text-[#0F4C5C] font-bold text-sm py-3 px-4 rounded-xl border border-[#84A59D]/30 transition-all flex items-center justify-between cursor-pointer"
              >
                <span>{t.sampleVoiceQ2}</span>
                <ChevronRight className="w-4 h-4 text-[#84A59D]" />
              </button>
              <button
                onClick={() => handleVoiceQuickAction(t.sampleVoiceQ3, 'reminders')}
                className="bg-white hover:bg-gray-50 text-[#0F4C5C] font-bold text-sm py-3 px-4 rounded-xl border border-[#84A59D]/30 transition-all flex items-center justify-between cursor-pointer"
              >
                <span>{t.sampleVoiceQ3}</span>
                <ChevronRight className="w-4 h-4 text-[#84A59D]" />
              </button>
            </div>

            {/* Done button */}
            <button
              onClick={closeVoiceModal}
              className="mt-4 w-full bg-[#0F4C5C] text-white py-3 rounded-xl font-bold text-base hover:bg-[#0F4C5C]/90 transition-colors cursor-pointer shadow-md"
            >
              {t.doneSpeaking}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
