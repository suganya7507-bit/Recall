import React, { useState } from 'react';
import { Smartphone, Cloud, CloudOff, WifiOff, Wifi, RefreshCw, CheckCircle2, HardDrive, ShieldCheck, ArrowRight, Database, Server } from 'lucide-react';
import { soundManager, speakInstruction } from '../utils/audio';

interface OfflineSyncScreenProps {
  localUpdatesCount: number;
  isOnline: boolean;
  onSimulateSync: () => void;
  onNavigateHome: () => void;
}

export const OfflineSyncScreen: React.FC<OfflineSyncScreenProps> = ({
  localUpdatesCount,
  isOnline,
  onSimulateSync,
  onNavigateHome
}) => {
  const [syncState, setSyncState] = useState<'idle' | 'checking' | 'syncing' | 'completed'>('idle');

  const handleCheckConnection = () => {
    soundManager.playReminderChime();
    setSyncState('checking');
    speakInstruction("Checking connection with Family Cloud.");

    setTimeout(() => {
      setSyncState('syncing');
      speakInstruction("Synchronizing offline records securely.");

      setTimeout(() => {
        setSyncState('completed');
        soundManager.playSyncSuccess();
        speakInstruction("All records successfully synced with Family Cloud.");
        onSimulateSync();
      }, 1600);
    }, 1200);
  };

  const handleResetSyncState = () => {
    setSyncState('idle');
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center pb-28 md:pb-8">
      {/* Title */}
      <section className="text-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F4C5C] mb-1.5 tracking-tight">
          Offline Data Synchronization
        </h1>
        <p className="text-sm sm:text-base text-[#5C7A80] font-medium max-w-lg mx-auto">
          Optimized for Northeast India remote connectivity. All patient records, photos, and game stats are stored locally on-device.
        </p>
      </section>

      {/* Main Grid: Responsive 2-column or full layout on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full mb-6">
        {/* Left / Main: Sync Diagram Card */}
        <div className="md:col-span-7 bg-white rounded-[24px] p-6 sm:p-7 border-b-4 border-[#84A59D] border-x border-t border-gray-100 soft-shadow relative overflow-hidden flex flex-col items-center justify-between">
          <div className="w-full">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#84A59D] mb-6 text-left">
              Data Pipeline & Transmission Architecture
            </h2>

            {/* Nodes and Path */}
            <div className="flex items-center justify-between w-full mb-6 relative z-10">
              {/* Phone Side */}
              <div className="flex flex-col items-center w-1/3">
                <div className="w-16 h-16 sm:w-18 sm:h-18 bg-[#0F4C5C] rounded-2xl flex items-center justify-center mb-2 shadow-sm text-white">
                  <Smartphone className="w-8 h-8 text-[#84A59D]" />
                </div>
                <span className="font-bold text-xs sm:text-sm text-[#0F4C5C] leading-tight text-center">
                  Phone<br />Storage
                </span>
              </div>

              {/* Connection Bridge */}
              <div className="flex-1 flex flex-col items-center justify-center px-2 z-0">
                {/* Pulsing Dots */}
                <div className="flex items-center space-x-1.5 mb-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${syncState === 'syncing' ? 'bg-[#0F4C5C] dot-pulse' : isOnline ? 'bg-emerald-600' : 'bg-gray-300'}`} />
                  <div className={`w-2.5 h-2.5 rounded-full ${syncState === 'syncing' ? 'bg-[#0F4C5C] dot-pulse' : isOnline ? 'bg-emerald-600' : 'bg-gray-300'}`} />
                  <div className={`w-2.5 h-2.5 rounded-full ${syncState === 'syncing' ? 'bg-[#0F4C5C] dot-pulse' : isOnline ? 'bg-emerald-600' : 'bg-gray-300'}`} />
                  <div className={`w-2.5 h-2.5 rounded-full ${syncState === 'syncing' ? 'bg-[#0F4C5C] dot-pulse' : isOnline ? 'bg-emerald-600' : 'bg-gray-300'}`} />
                </div>

                {/* Badge */}
                <div className="bg-[#FAF7F2] px-3.5 py-1.5 rounded-full border border-[#84A59D]/30 text-xs font-bold text-[#5C7A80] flex items-center gap-1 shadow-sm whitespace-nowrap">
                  {syncState === 'syncing' ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 text-[#0F4C5C] animate-spin" />
                      <span>Syncing...</span>
                    </>
                  ) : isOnline ? (
                    <>
                      <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-800">Cloud Ready</span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="w-3.5 h-3.5 text-[#E07A5F]" />
                      <span className="text-[#E07A5F]">Local Offline</span>
                    </>
                  )}
                </div>
              </div>

              {/* Cloud Side */}
              <div className="flex flex-col items-center w-1/3">
                <div className={`w-16 h-16 sm:w-18 sm:h-18 rounded-2xl flex items-center justify-center mb-2 shadow-sm transition-colors ${
                  isOnline || syncState === 'completed' ? 'bg-[#84A59D] text-white' : 'bg-gray-200 text-gray-400'
                }`}>
                  <Cloud className="w-8 h-8" />
                </div>
                <span className="font-bold text-xs sm:text-sm text-[#0F4C5C] leading-tight text-center">
                  Family<br />Cloud
                </span>
              </div>
            </div>
          </div>

          {/* Sync Stats Pill */}
          <div className="w-full bg-[#FAF7F2] rounded-2xl p-4 border border-[#84A59D]/20 flex items-center justify-between text-left">
            <div className="flex items-center gap-3">
              <HardDrive className="w-6 h-6 text-[#84A59D]" />
              <div>
                <span className="text-xs font-bold text-[#0F4C5C] block">
                  Pending Sync Updates
                </span>
                <span className="text-xs text-[#5C7A80]">
                  {localUpdatesCount === 0 ? 'All 12 items synced' : `${localUpdatesCount} records queued locally`}
                </span>
              </div>
            </div>
            <span className="text-2xl font-extrabold text-[#0F4C5C]">
              {localUpdatesCount}
            </span>
          </div>
        </div>

        {/* Right / Secondary: Storage Metrics & Security */}
        <div className="md:col-span-5 flex flex-col gap-4">
          <div className="bg-white rounded-[24px] p-6 soft-shadow border border-[#84A59D]/20 flex flex-col justify-between flex-1 text-left">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#0F4C5C]">
                    Zero Data Loss Guarantee
                  </h3>
                  <span className="text-xs text-[#84A59D] font-semibold">
                    Client-Side Persistence
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#5C7A80] leading-relaxed mb-4">
                Memory entries, reminder completions, and game scores are preserved in device storage even if your connection drops in remote regions.
              </p>

              <div className="space-y-2 text-xs text-[#0F4C5C] font-semibold bg-[#FAF7F2] p-3.5 rounded-xl border border-[#84A59D]/20">
                <div className="flex justify-between">
                  <span>Photo Album Cache:</span>
                  <span className="font-bold text-[#84A59D]">3 Items (Active)</span>
                </div>
                <div className="flex justify-between">
                  <span>Routine Schedule:</span>
                  <span className="font-bold text-[#84A59D]">4 Daily Reminders</span>
                </div>
                <div className="flex justify-between">
                  <span>Cognitive History:</span>
                  <span className="font-bold text-[#84A59D]">3 Rounds Logged</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#84A59D]/20 flex items-center gap-2 text-xs text-[#84A59D] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>ACTIVE LOCAL STORAGE ENGINE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3.5 w-full max-w-md">
        <button
          id="btn-simulate-sync"
          onClick={handleCheckConnection}
          disabled={syncState === 'syncing'}
          className={`flex-1 h-[54px] rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
            syncState === 'completed'
              ? 'bg-emerald-700 text-white'
              : 'bg-[#0F4C5C] hover:bg-[#0F4C5C]/90 text-white active:scale-95'
          }`}
        >
          {syncState === 'syncing' ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Syncing Data...</span>
            </>
          ) : syncState === 'completed' ? (
            <>
              <CheckCircle2 className="w-5 h-5" />
              <span>Synced with Cloud!</span>
            </>
          ) : (
            <>
              <RefreshCw className="w-5 h-5" />
              <span>Simulate Cloud Sync</span>
            </>
          )}
        </button>

        <button
          onClick={onNavigateHome}
          className="h-[54px] px-6 bg-white border border-[#0F4C5C] hover:bg-gray-50 text-[#0F4C5C] font-bold text-sm sm:text-base rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
        >
          <span>Back to Home</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
