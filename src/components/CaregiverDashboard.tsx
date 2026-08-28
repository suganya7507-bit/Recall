import React, { useState } from 'react';
import { TrendingUp, BellRing, AlertCircle, Send, BookOpen, RefreshCw, CheckCircle2, ShieldCheck, Heart, Sparkles, MessageCircle, Phone, Calendar, X, Check } from 'lucide-react';
import { CaregiverAlert, Screen } from '../types';
import { soundManager, speakInstruction } from '../utils/audio';

interface CaregiverDashboardProps {
  alerts: CaregiverAlert[];
  gamesPlayedCount: number;
  localUpdatesCount: number;
  onNavigate: (screen: Screen) => void;
  onResolveAlert: (alertId: string) => void;
  onSendCustomReminder: (title: string, message: string) => void;
}

export const CaregiverDashboard: React.FC<CaregiverDashboardProps> = ({
  alerts,
  gamesPlayedCount,
  localUpdatesCount,
  onNavigate,
  onResolveAlert,
  onSendCustomReminder
}) => {
  const [isSendReminderOpen, setIsSendReminderOpen] = useState(false);
  const [reminderTitle, setReminderTitle] = useState('Afternoon Hydration');
  const [reminderMessage, setReminderMessage] = useState('Namaskar Amina! Priya here. Please have a warm cup of water.');
  const [sendSuccessToast, setSendSuccessToast] = useState(false);

  const handleSendReminderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reminderTitle.trim()) return;

    soundManager.playSuccess();
    onSendCustomReminder(reminderTitle.trim(), reminderMessage.trim());
    setSendSuccessToast(true);
    setIsSendReminderOpen(false);

    speakInstruction(`Caregiver reminder sent to Amina: ${reminderTitle}`);

    setTimeout(() => {
      setSendSuccessToast(false);
    }, 4000);
  };

  const handleCallAmina = () => {
    soundManager.playReminderChime();
    alert("Simulating direct phone call to Amina's residence tablet (98765-43210)...");
  };

  const activeAlerts = alerts.filter(a => !a.resolved);

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col pb-28 md:pb-8">
      {/* Header Profile Section */}
      <section className="flex flex-col sm:flex-row items-center sm:justify-between gap-4 mb-6 bg-white rounded-[24px] p-5 sm:p-6 soft-shadow border border-[#84A59D]/20">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full overflow-hidden border-2 border-[#84A59D]/40 shadow-sm bg-[#FAF7F2] relative shrink-0">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBF8hcByBO0GyVHzWtOMjGwjWHJzOEgkRtFbhTi8lEKW5RWOMOv7l7o7Au0L4gXgDI-qBaBbLJ05r0-Kdr5s9BS-L5xI9recC3klIkdxOXKBI5yxglUuIMX79l890QsMs_P8sAtd203ZQXyheZ9rU8ycZtmkSb8adGKFBlodMWWVob4lkmFw0flJ7iNDtSSlIZfUmPoVUCGXGPVBkA9UI13DVFmcfRMY6FNf8RfNsqhoVwjn-P8pku"
              alt="Amina portrait"
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-600 border-2 border-white rounded-full flex items-center justify-center text-white text-[9px] font-bold">
              ✓
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F4C5C] tracking-tight">
                Amina's Wellbeing Portal
              </h1>
              <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full font-bold hidden sm:inline">
                Stable & Active
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#5C7A80] font-semibold mt-0.5">
              Caregiver Insights • Tezpur Care Circle • Assisted by Caregiver Priya
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => setIsSendReminderOpen(true)}
            className="flex-1 sm:flex-initial min-h-[44px] px-4 bg-[#0F4C5C] hover:bg-[#0F4C5C]/90 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm cursor-pointer active:scale-95"
          >
            <Send className="w-4 h-4" />
            <span>Send Reminder</span>
          </button>
          <button
            onClick={handleCallAmina}
            className="min-h-[44px] px-4 bg-[#FAF7F2] hover:bg-gray-100 border border-[#84A59D]/30 text-[#0F4C5C] font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <Phone className="w-4 h-4 text-[#84A59D]" />
            <span>Call Tablet</span>
          </button>
        </div>
      </section>

      {sendSuccessToast && (
        <div className="w-full bg-[#84A59D]/15 border border-[#84A59D] text-[#0F4C5C] p-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-between mb-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-700" />
            <span>Reminder broadcasted to Amina’s home screen with voice notification!</span>
          </div>
          <button onClick={() => setSendSuccessToast(false)} className="cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Grid: Responsive 12-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 w-full mb-6">
        {/* Left / Main: Activity Summary & Trend Chart */}
        <div className="lg:col-span-7 bg-white rounded-[24px] p-5 sm:p-6 soft-shadow border-b-4 border-[#84A59D] border-x border-t border-gray-100 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-[#84A59D]/20 pb-3">
            <h2 className="text-lg font-bold text-[#0F4C5C] flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#84A59D]" />
              <span>Cognitive Activity & Engagement</span>
            </h2>
            <span className="bg-[#84A59D]/20 text-[#0F4C5C] px-3 py-1 rounded-full text-xs font-extrabold">
              Today Active
            </span>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5C7A80]">
                Weekly Cognitive Game Engagement
              </span>
              <span className="text-xs font-bold text-[#84A59D]">
                {gamesPlayedCount} Sessions Logged
              </span>
            </div>

            {/* Weekly Activity Histogram Bars */}
            <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#84A59D]/20 mb-3">
              <div className="flex items-end gap-2.5 h-36 pt-4">
                {[
                  { day: 'Mon', height: '45%', active: false },
                  { day: 'Tue', height: '65%', active: false },
                  { day: 'Wed', height: '85%', active: false },
                  { day: 'Thu', height: '50%', active: false },
                  { day: 'Fri', height: '95%', active: false },
                  { day: 'Sat', height: '40%', active: false },
                  { day: 'Sun', height: '80%', active: true },
                ].map((col, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <div
                      className={`w-full rounded-t-lg transition-all ${
                        col.active ? 'bg-[#0F4C5C]' : 'bg-[#84A59D]/50 hover:bg-[#84A59D]'
                      }`}
                      style={{ height: col.height }}
                    />
                    <span className="text-[11px] font-bold text-[#5C7A80]">{col.day}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#0F4C5C] font-medium leading-relaxed bg-[#84A59D]/10 p-3 rounded-xl border border-[#84A59D]/20">
              💡 Amina demonstrates highest recall recognition when presented with <strong>Assamese Heritage & Family Photo</strong> items.
            </p>
          </div>

          {/* Quick Actions Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 border-t border-[#84A59D]/20">
            <button
              onClick={() => onNavigate('reminders')}
              className="p-3 bg-[#FAF7F2] hover:bg-gray-100 rounded-xl text-left border border-[#84A59D]/20 cursor-pointer transition-colors"
            >
              <span className="text-xs text-[#84A59D] font-bold block">Routine</span>
              <span className="text-sm font-bold text-[#0F4C5C]">Reminders →</span>
            </button>
            <button
              onClick={() => onNavigate('memories')}
              className="p-3 bg-[#FAF7F2] hover:bg-gray-100 rounded-xl text-left border border-[#84A59D]/20 cursor-pointer transition-colors"
            >
              <span className="text-xs text-[#84A59D] font-bold block">Photos</span>
              <span className="text-sm font-bold text-[#0F4C5C]">Album →</span>
            </button>
            <button
              onClick={() => onNavigate('offline_sync')}
              className="p-3 bg-[#FAF7F2] hover:bg-gray-100 rounded-xl text-left border border-[#84A59D]/20 cursor-pointer transition-colors col-span-2 sm:col-span-1"
            >
              <span className="text-xs text-[#84A59D] font-bold block">Sync State</span>
              <span className="text-sm font-bold text-[#0F4C5C]">{localUpdatesCount} Records</span>
            </button>
          </div>
        </div>

        {/* Right / Secondary: Real-Time Alerts Feed */}
        <div className="lg:col-span-5 bg-white rounded-[24px] p-5 sm:p-6 soft-shadow border-b-4 border-[#E07A5F] border-x border-t border-gray-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#84A59D]/20 pb-3 mb-4">
              <h2 className="text-lg font-bold text-[#0F4C5C] flex items-center gap-2">
                <BellRing className="w-5 h-5 text-[#E07A5F]" />
                <span>Care Alerts Feed</span>
              </h2>
              {activeAlerts.length > 0 ? (
                <span className="bg-[#E07A5F] text-white px-2.5 py-0.5 rounded-full text-xs font-extrabold animate-pulse">
                  {activeAlerts.length} Action Needed
                </span>
              ) : (
                <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-xs font-extrabold">
                  All Resolved
                </span>
              )}
            </div>

            {/* Alert List */}
            <div className="space-y-3 max-h-[380px] overflow-y-auto no-scrollbar pr-1">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    alert.resolved
                      ? 'bg-gray-50/70 border-gray-200 opacity-70'
                      : 'bg-[#E07A5F]/10 border-[#E07A5F]/40 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${alert.resolved ? 'bg-gray-400' : 'bg-[#E07A5F]'}`} />
                      <h4 className="text-sm font-extrabold text-[#0F4C5C]">
                        {alert.title}
                      </h4>
                    </div>
                    <span className="text-[10px] text-[#5C7A80] font-bold">
                      {alert.time}
                    </span>
                  </div>

                  <p className="text-xs text-[#5C7A80] mb-2.5 leading-relaxed">
                    {alert.subtitle}
                  </p>

                  {!alert.resolved ? (
                    <button
                      onClick={() => {
                        soundManager.playSuccess();
                        onResolveAlert(alert.id);
                      }}
                      className="px-3 py-1.5 bg-[#0F4C5C] hover:bg-[#0F4C5C]/90 text-white rounded-lg text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-xs"
                    >
                      ✓ Acknowledge & Resolve
                    </button>
                  ) : (
                    <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Resolved
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#84A59D]/20 text-xs text-[#5C7A80] text-center">
            Caregiver logs are encrypted and synchronized offline.
          </div>
        </div>
      </div>

      {/* Broadcast Reminder Modal */}
      {isSendReminderOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#FAF7F2] border-2 border-[#0F4C5C] w-full max-w-md rounded-3xl p-6 shadow-2xl flex flex-col relative">
            <div className="flex items-center justify-between pb-3 border-b border-[#84A59D]/20 mb-4">
              <div>
                <h3 className="text-xl font-extrabold text-[#0F4C5C]">
                  Send Caregiver Prompt
                </h3>
                <p className="text-xs text-[#5C7A80]">
                  Will appear on Amina's home screen with gentle chime
                </p>
              </div>
              <button
                onClick={() => setIsSendReminderOpen(false)}
                className="w-8 h-8 rounded-full bg-white border border-[#84A59D]/20 flex items-center justify-center text-[#0F4C5C] cursor-pointer shadow-sm"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendReminderSubmit} className="flex flex-col gap-3.5">
              <div>
                <label className="block text-xs font-bold text-[#0F4C5C] mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={reminderTitle}
                  onChange={(e) => setReminderTitle(e.target.value)}
                  className="w-full min-h-[44px] px-3 rounded-xl border border-[#84A59D]/30 focus:border-[#0F4C5C] bg-white font-medium text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F4C5C] mb-1">
                  Spoken Message
                </label>
                <textarea
                  rows={3}
                  required
                  value={reminderMessage}
                  onChange={(e) => setReminderMessage(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[#84A59D]/30 focus:border-[#0F4C5C] bg-white font-medium text-xs sm:text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full min-h-[48px] bg-[#0F4C5C] hover:bg-[#0F4C5C]/90 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all mt-2 cursor-pointer shadow-md"
              >
                <Send className="w-4 h-4" />
                <span>Broadcast to Amina’s Screen</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
