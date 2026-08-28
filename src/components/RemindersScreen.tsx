import React, { useState } from 'react';
import { CheckCircle2, Clock, Volume2, AlertTriangle, PhoneCall, Plus, X, Check, Droplet, Pill, Utensils, Footprints, ShieldAlert } from 'lucide-react';
import { ReminderItem, LanguageCode } from '../types';
import { TranslationSchema } from '../data/translations';
import { soundManager, speakInstruction } from '../utils/audio';

interface RemindersScreenProps {
  reminders: ReminderItem[];
  onToggleComplete: (id: string) => void;
  onAddReminder: (newReminder: ReminderItem) => void;
  currentLanguage: LanguageCode;
  t: TranslationSchema;
}

export const RemindersScreen: React.FC<RemindersScreenProps> = ({
  reminders,
  onToggleComplete,
  onAddReminder,
  currentLanguage,
  t
}) => {
  const [selectedAlertReminder, setSelectedAlertReminder] = useState<ReminderItem | null>(null);
  const [isAddReminderModalOpen, setIsAddReminderModalOpen] = useState(false);
  const [speakingReminderId, setSpeakingReminderId] = useState<string | null>(null);

  // New reminder form
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('3:00 PM');
  const [newCategory, setNewCategory] = useState<'Medication' | 'Water' | 'Meal' | 'Activity'>('Water');
  const [newDesc, setNewDesc] = useState('');

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Medication':
        return <Pill className="w-7 h-7" strokeWidth={2.3} />;
      case 'Water':
        return <Droplet className="w-7 h-7" strokeWidth={2.3} />;
      case 'Meal':
        return <Utensils className="w-7 h-7" strokeWidth={2.3} />;
      default:
        return <Footprints className="w-7 h-7" strokeWidth={2.3} />;
    }
  };

  const handleHearReminder = (reminder: ReminderItem) => {
    soundManager.playReminderChime();
    setSpeakingReminderId(reminder.id);
    const speechText = `${reminder.time}: ${reminder.title}. ${reminder.description}`;
    speakInstruction(speechText, () => {
      setSpeakingReminderId(null);
    }, currentLanguage);
  };

  const handleMarkDone = (reminder: ReminderItem) => {
    if (!reminder.completed) {
      soundManager.playSuccess();
      speakInstruction(`${reminder.title}: ${t.completedLabel}. ${t.greatJobTitle}`, undefined, currentLanguage);
    } else {
      soundManager.playClick();
    }
    onToggleComplete(reminder.id);
  };

  const handleCreateReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const item: ReminderItem = {
      id: `rem_${Date.now()}`,
      title: newTitle.trim(),
      time: newTime,
      category: newCategory,
      icon: newCategory.toLowerCase(),
      description: newDesc.trim() || `Daily ${newCategory} schedule for Amina.`,
      completed: false
    };

    onAddReminder(item);
    soundManager.playSuccess();
    setNewTitle('');
    setNewDesc('');
    setIsAddReminderModalOpen(false);
  };

  const completedCount = reminders.filter(r => r.completed).length;

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col pb-28 md:pb-8">
      {/* Title & Progress Header (Responsive Header) */}
      <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 bg-white rounded-[24px] p-5 sm:p-6 soft-shadow border border-[#84A59D]/20">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F4C5C] mb-1 tracking-tight">
            {t.todaysReminders}
          </h1>
          <p className="text-sm sm:text-base text-[#5C7A80] font-medium">
            {t.remindersDesc}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Daily Completion Summary Pill */}
          <div className="inline-flex items-center gap-2 bg-[#84A59D]/15 border border-[#84A59D]/30 px-4 py-2 rounded-xl text-xs font-bold text-[#0F4C5C]">
            <CheckCircle2 className="w-4 h-4 text-[#84A59D]" />
            <span>{completedCount} / {reminders.length} {t.completedLabel}</span>
          </div>

          {/* Add Reminder Top Button */}
          <button
            id="add-custom-reminder-btn"
            onClick={() => {
              soundManager.playClick();
              setIsAddReminderModalOpen(true);
            }}
            className="min-h-[44px] px-4 bg-[#0F4C5C] hover:bg-[#0F4C5C]/90 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>{t.addReminder}</span>
          </button>
        </div>
      </section>

      {/* Multi-Column Reminders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5 w-full">
        {reminders.map((reminder) => {
          const isDone = reminder.completed;
          const isMissed = reminder.isMissed && !isDone;
          const isSpeaking = speakingReminderId === reminder.id;

          return (
            <article
              key={reminder.id}
              id={`reminder-card-${reminder.id}`}
              className={`rounded-[24px] p-5 border-b-4 transition-all duration-300 soft-shadow flex flex-col justify-between ${
                isDone
                  ? 'bg-emerald-50/50 border-emerald-500 border-x border-t border-emerald-200'
                  : isMissed
                  ? 'bg-white border-[#E07A5F] ring-2 ring-[#E07A5F]/20 border-x border-t border-[#E07A5F]/30'
                  : 'bg-white border-[#84A59D] border-x border-t border-gray-100 hover:border-[#0F4C5C]'
              }`}
            >
              <div>
                {/* Missed Warning Ribbon */}
                {isMissed && (
                  <button
                    onClick={() => setSelectedAlertReminder(reminder)}
                    className="w-full bg-[#E07A5F]/15 text-[#E07A5F] px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center justify-between mb-3 hover:bg-[#E07A5F]/25 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-[#E07A5F]" />
                      <span>{t.caregiverAlertSent}</span>
                    </div>
                    <span className="underline text-[11px]">View Alert</span>
                  </button>
                )}

                <div className="flex items-start justify-between gap-3">
                  {/* Category Icon */}
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                      isDone
                        ? 'bg-emerald-600 text-white'
                        : isMissed
                        ? 'bg-[#E07A5F]/20 text-[#E07A5F]'
                        : 'bg-[#84A59D]/20 text-[#0F4C5C]'
                    }`}
                  >
                    {getCategoryIcon(reminder.category)}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold uppercase tracking-wide text-[#0F4C5C] bg-[#FAF7F2] border border-[#84A59D]/30 px-2 py-0.5 rounded-md">
                        {reminder.time}
                      </span>
                      <span className="text-xs font-semibold text-[#84A59D]">
                        {reminder.category}
                      </span>
                    </div>

                    <h3
                      className={`text-lg font-extrabold mt-1 leading-tight ${
                        isDone ? 'line-through text-gray-400' : 'text-[#0F4C5C]'
                      }`}
                    >
                      {reminder.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#5C7A80] mt-1 leading-relaxed">
                      {reminder.description}
                    </p>
                  </div>

                  {/* Audio speech button */}
                  <button
                    id={`hear-reminder-${reminder.id}`}
                    onClick={() => handleHearReminder(reminder)}
                    aria-label={`Listen to ${reminder.title} reminder`}
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                      isSpeaking
                        ? 'bg-[#0F4C5C] text-white animate-pulse'
                        : 'bg-white border border-[#84A59D]/30 text-[#0F4C5C] hover:bg-gray-50'
                    }`}
                  >
                    <Volume2 className="w-4 h-4 text-[#84A59D]" />
                  </button>
                </div>
              </div>

              {/* Mark as Done / Completed State Trigger */}
              <div className="mt-4 pt-3 border-t border-[#84A59D]/15 flex items-center justify-between">
                {isDone ? (
                  <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs sm:text-sm">
                    <CheckCircle2 className="w-4 h-4 fill-emerald-600 text-white" />
                    <span>{t.completedLabel}</span>
                  </div>
                ) : (
                  <span className="text-xs text-[#5C7A80] font-medium">
                    {t.tapToSpeak}
                  </span>
                )}

                <button
                  id={`btn-mark-done-${reminder.id}`}
                  onClick={() => handleMarkDone(reminder)}
                  className={`min-h-[40px] px-4 rounded-xl font-bold text-xs transition-all active:scale-95 flex items-center gap-1.5 shadow-sm cursor-pointer ${
                    isDone
                      ? 'bg-white border border-emerald-600 text-emerald-700 hover:bg-emerald-50'
                      : 'bg-[#0F4C5C] hover:bg-[#0F4C5C]/90 text-white'
                  }`}
                >
                  <Check className="w-4 h-4" strokeWidth={2.5} />
                  <span>{isDone ? t.markAsPending : t.markAsDone}</span>
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* "Caregiver Alert Sent" Modal Overlay for Missed Reminder */}
      {selectedAlertReminder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#FAF7F2] border-2 border-[#E07A5F] w-full max-w-md rounded-3xl p-5 shadow-2xl flex flex-col text-center relative">
            <button
              onClick={() => setSelectedAlertReminder(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white border border-[#84A59D]/20 flex items-center justify-center text-[#0F4C5C] cursor-pointer shadow-sm"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-16 h-16 rounded-full bg-[#E07A5F]/20 text-[#E07A5F] flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h2 className="text-xl font-extrabold text-[#0F4C5C] mb-1">
              {t.caregiverAlertSent}
            </h2>
            <p className="text-xs text-[#5C7A80] mb-3">
              {selectedAlertReminder.title} ({selectedAlertReminder.time})
            </p>

            <div className="bg-white rounded-2xl p-3.5 border border-[#84A59D]/20 text-left text-xs text-[#5C7A80] space-y-1.5 mb-4">
              <p>
                <strong className="text-[#0F4C5C]">Status:</strong> An automatic offline notification was logged for Caregiver <strong>Priya</strong> at 10:35 AM.
              </p>
              <p>
                <strong className="text-[#0F4C5C]">Note:</strong> Priya will check in during her afternoon visit or give a warm phone call.
              </p>
            </div>

            <div className="flex flex-col gap-2.5 w-full">
              <button
                onClick={() => {
                  handleMarkDone(selectedAlertReminder);
                  setSelectedAlertReminder(null);
                }}
                className="w-full h-[48px] bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Check className="w-4 h-4" />
                <span>{t.markAsDone}</span>
              </button>

              <button
                onClick={() => {
                  soundManager.playReminderChime();
                  alert("Simulating phone call to Caregiver Priya (98765-43210)...");
                }}
                className="w-full h-[48px] bg-white border border-[#0F4C5C] text-[#0F4C5C] font-bold text-sm rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 cursor-pointer shadow-sm"
              >
                <PhoneCall className="w-4 h-4 text-[#0F4C5C]" />
                <span>Call Caregiver Priya</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* "+ Add Custom Reminder" Modal */}
      {isAddReminderModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#FAF7F2] border-2 border-[#0F4C5C] w-full max-w-md rounded-3xl p-5 shadow-2xl flex flex-col relative">
            <div className="flex items-center justify-between pb-3 border-b border-[#84A59D]/20 mb-3">
              <h2 className="text-xl font-extrabold text-[#0F4C5C]">
                {t.addReminder}
              </h2>
              <button
                onClick={() => setIsAddReminderModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white border border-[#84A59D]/20 flex items-center justify-center text-[#0F4C5C] cursor-pointer shadow-sm"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateReminder} className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-bold text-[#0F4C5C] mb-1">
                  Reminder Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Afternoon Green Tea or Eye Drops"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full min-h-[44px] px-3 rounded-xl border border-[#84A59D]/30 focus:border-[#0F4C5C] bg-white font-medium text-xs sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-[#0F4C5C] mb-1">
                    Time
                  </label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    placeholder="e.g. 4:00 PM"
                    className="w-full min-h-[44px] px-3 rounded-xl border border-[#84A59D]/30 focus:border-[#0F4C5C] bg-white font-medium text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F4C5C] mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full min-h-[44px] px-3 rounded-xl border border-[#84A59D]/30 focus:border-[#0F4C5C] bg-white font-medium text-xs sm:text-sm"
                  >
                    <option value="Water">Water / Drink</option>
                    <option value="Medication">Medication</option>
                    <option value="Meal">Meal</option>
                    <option value="Activity">Activity / Walk</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F4C5C] mb-1">
                  Gentle Spoken Instruction
                </label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="e.g. Drink 1 warm cup with honey."
                  className="w-full p-2.5 rounded-xl border border-[#84A59D]/30 focus:border-[#0F4C5C] bg-white font-medium text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full min-h-[48px] bg-[#0F4C5C] hover:bg-[#0F4C5C]/90 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors mt-1 cursor-pointer shadow-sm"
              >
                <Check className="w-4 h-4" />
                <span>Save Reminder</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
