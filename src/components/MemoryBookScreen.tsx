import React, { useState, useRef } from 'react';
import { Plus, Play, Pause, Volume2, Image as ImageIcon, Sparkles, X, Check, Heart, Upload, Radio } from 'lucide-react';
import { MemoryItem, MemoryCategory, LanguageCode } from '../types';
import { TranslationSchema } from '../data/translations';
import { soundManager, speakInstruction, stopSpeaking } from '../utils/audio';

interface MemoryBookScreenProps {
  memories: MemoryItem[];
  onAddMemory: (newMemory: MemoryItem) => void;
  currentLanguage: LanguageCode;
  t: TranslationSchema;
}

export const MemoryBookScreen: React.FC<MemoryBookScreenProps> = ({
  memories,
  onAddMemory,
  currentLanguage,
  t
}) => {
  const [selectedCategory, setSelectedCategory] = useState<MemoryCategory>('All');
  const [playingMemoryId, setPlayingMemoryId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states
  const [newName, setNewName] = useState('');
  const [newRelation, setNewRelation] = useState('');
  const [newNote, setNewNote] = useState('');
  const [newCategory, setNewCategory] = useState<'Family' | 'Places' | 'Routines'>('Family');
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtered list
  const filteredMemories = selectedCategory === 'All'
    ? memories
    : memories.filter(m => m.category === selectedCategory);

  const handlePlayVoiceNote = (memory: MemoryItem) => {
    if (playingMemoryId === memory.id) {
      stopSpeaking();
      setPlayingMemoryId(null);
    } else {
      soundManager.playReminderChime();
      setPlayingMemoryId(memory.id);
      speakInstruction(memory.audioText, () => {
        setPlayingMemoryId(null);
      }, currentLanguage);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedImagePreview(event.target.result as string);
          setFormError(null);
          soundManager.playClick();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Sample photo picker fallback
  const handleSelectSamplePhoto = (url: string) => {
    soundManager.playClick();
    setUploadedImagePreview(url);
    setFormError(null);
  };

  const handleSaveMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      setFormError('Please enter a name or title for this memory.');
      soundManager.playGentleHint();
      return;
    }

    const defaultImages = [
      'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?auto=format&fit=crop&w=800&q=80'
    ];

    const finalImage = uploadedImagePreview || defaultImages[Math.floor(Math.random() * defaultImages.length)];
    const finalSubtitle = newRelation.trim() || (newCategory === 'Family' ? 'Loved One' : 'Cherished Memory');
    const finalNote = newNote.trim() || 'A beautiful memory stored with love in your Saanidhya album.';

    const newMemory: MemoryItem = {
      id: `mem_${Date.now()}`,
      title: newName.trim(),
      relationOrSubtitle: finalSubtitle,
      description: finalNote,
      category: newCategory,
      imageUrl: finalImage,
      audioText: `This is ${newName.trim()}, your ${finalSubtitle}. ${finalNote}`,
      voiceNoteDuration: '0:20',
      dateAdded: 'Just now'
    };

    onAddMemory(newMemory);
    soundManager.playSuccess();

    // Reset and close
    setNewName('');
    setNewRelation('');
    setNewNote('');
    setUploadedImagePreview(null);
    setFormError(null);
    setIsAddModalOpen(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col pb-28 md:pb-8">
      {/* Top Header Card (Responsive Header) */}
      <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 bg-white rounded-[24px] p-5 sm:p-6 soft-shadow border border-[#84A59D]/20">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F4C5C] mb-1 tracking-tight">
            {t.memoryBook}
          </h1>
          <p className="text-sm sm:text-base text-[#5C7A80] font-medium">
            {t.memoryBookDesc}
          </p>
        </div>

        {/* "+ Add Memory" Action Button */}
        <button
          id="memory-add-btn"
          onClick={() => {
            soundManager.playClick();
            setIsAddModalOpen(true);
          }}
          aria-label="Add a new photo memory to album"
          className="min-h-[48px] px-5 bg-[#0F4C5C] hover:bg-[#0F4C5C]/90 active:scale-[0.98] text-white font-bold text-sm sm:text-base rounded-xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer focus:ring-4 focus:ring-[#84A59D]/30 shrink-0"
        >
          <Plus className="w-5 h-5 text-white" strokeWidth={2.5} />
          <span>+ {t.addMemory}</span>
        </button>
      </section>

      {/* Category Filter Pills Row */}
      <div className="w-full flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar mb-2">
        {(['All', 'Family', 'Places', 'Routines'] as MemoryCategory[]).map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              id={`cat-filter-${cat.toLowerCase()}`}
              onClick={() => {
                soundManager.playClick();
                setSelectedCategory(cat);
              }}
              className={`flex-shrink-0 px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm min-h-[44px] transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#0F4C5C] text-white shadow-sm ring-2 ring-[#84A59D]'
                  : 'bg-white text-[#5C7A80] border border-[#84A59D]/30 hover:border-[#0F4C5C]'
              }`}
            >
              {cat} {cat === 'All' ? `(${memories.length})` : ''}
            </button>
          );
        })}
      </div>

      {/* Memory Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 w-full">
        {filteredMemories.map((mem) => {
          const isPlaying = playingMemoryId === mem.id;

          return (
            <article
              key={mem.id}
              id={`memory-card-${mem.id}`}
              className={`bg-white rounded-[24px] p-4 sm:p-5 soft-shadow border-b-4 border-[#84A59D] border-x border-t border-gray-100 flex flex-col justify-between transition-all duration-200 ${
                isPlaying ? 'ring-4 ring-[#84A59D]/40 bg-[#FAF7F2]' : ''
              }`}
            >
              <div>
                {/* Photo Area */}
                <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden mb-3.5 relative border border-[#84A59D]/20 shadow-sm bg-neutral-100">
                  <img
                    src={mem.imageUrl}
                    alt={mem.title}
                    className="w-full h-full object-cover hover:scale-103 transition-transform duration-500"
                    loading="lazy"
                  />
                  <span className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#0F4C5C] shadow-sm border border-[#84A59D]/20">
                    {mem.category}
                  </span>
                </div>

                {/* Title & Info */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-extrabold text-[#0F4C5C] leading-tight mb-0.5">
                      {mem.title}
                    </h3>
                    <p className="text-sm text-[#84A59D] font-semibold">
                      {mem.relationOrSubtitle}
                    </p>
                  </div>

                  {/* Voice Note Audio Button */}
                  <button
                    id={`play-voice-note-${mem.id}`}
                    onClick={() => handlePlayVoiceNote(mem)}
                    aria-label={`Play voice note from ${mem.title}`}
                    title={t.listenVoiceStory}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-95 shadow-sm shrink-0 cursor-pointer ${
                      isPlaying
                        ? 'bg-[#E07A5F] text-white animate-pulse'
                        : 'bg-[#0F4C5C] text-white hover:bg-[#0F4C5C]/90'
                    }`}
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 fill-current" />
                    ) : (
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    )}
                  </button>
                </div>

                {/* Detailed story note */}
                <p className="mt-3 text-xs sm:text-sm text-[#5C7A80] leading-relaxed border-t border-[#84A59D]/15 pt-2.5">
                  {mem.description}
                </p>
              </div>

              {/* Animated Voice Playing Bar */}
              {isPlaying && (
                <div className="mt-3 bg-[#84A59D]/15 rounded-xl p-2.5 flex items-center justify-between border border-[#84A59D]/30">
                  <div className="flex items-center gap-2 text-[#0F4C5C] font-bold text-xs">
                    <Volume2 className="w-4 h-4 text-[#0F4C5C] animate-pulse" />
                    <span>{t.listenVoiceStory}...</span>
                  </div>
                  <div className="flex items-center gap-1 h-4">
                    <div className="voice-bar w-1 bg-[#0F4C5C] rounded-full" />
                    <div className="voice-bar w-1 bg-[#84A59D] rounded-full" />
                    <div className="voice-bar w-1 bg-[#E07A5F] rounded-full" />
                    <div className="voice-bar w-1 bg-[#0F4C5C] rounded-full" />
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {/* "+ Add Memory" Interactive Modal Overlay */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-[#FAF7F2] border-t-4 sm:border-2 border-[#0F4C5C] w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl flex flex-col relative max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#84A59D]/20 mb-4">
              <div>
                <h2 className="text-2xl font-extrabold text-[#0F4C5C]">
                  {t.addMemory}
                </h2>
                <p className="text-xs text-[#5C7A80]">
                  Save a familiar face or cherished moment
                </p>
              </div>
              <button
                onClick={() => {
                  soundManager.playClick();
                  setIsAddModalOpen(false);
                }}
                className="w-10 h-10 rounded-full bg-white border border-[#84A59D]/20 flex items-center justify-center text-[#0F4C5C] hover:bg-gray-100 cursor-pointer shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="bg-[#E07A5F]/15 border-l-4 border-[#E07A5F] p-3 rounded-lg text-xs text-[#E07A5F] font-bold mb-4">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveMemory} className="flex flex-col gap-3.5">
              {/* Real File Input for Gallery Upload */}
              <div>
                <label className="block text-xs font-bold text-[#0F4C5C] mb-1">
                  1. Photo from Gallery or Camera
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {uploadedImagePreview ? (
                  <div className="relative w-full h-44 rounded-2xl overflow-hidden border-2 border-[#0F4C5C] shadow-sm mb-2 group">
                    <img
                      src={uploadedImagePreview}
                      alt="Uploaded memory preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity font-bold gap-2 text-sm"
                    >
                      <Upload className="w-4 h-4" /> Change Photo
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-32 rounded-2xl border-2 border-dashed border-[#84A59D] bg-white hover:bg-[#84A59D]/10 flex flex-col items-center justify-center text-[#0F4C5C] gap-1.5 transition-colors cursor-pointer"
                  >
                    <Upload className="w-6 h-6 text-[#84A59D]" />
                    <span className="font-bold text-sm">Tap to Upload Photo from Gallery</span>
                    <span className="text-[11px] text-[#5C7A80]">Supports JPG, PNG, WebP</span>
                  </button>
                )}

                {/* Sample photo quick presets */}
                <div className="mt-2 flex items-center gap-1.5 overflow-x-auto py-1">
                  <span className="text-[11px] text-[#5C7A80] shrink-0 font-semibold">Or pick sample:</span>
                  {[
                    { label: 'Grandchildren', url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80' },
                    { label: 'Tea Garden', url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=400&q=80' },
                    { label: 'Bihu Festival', url: 'https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?auto=format&fit=crop&w=400&q=80' },
                  ].map((sample, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelectSamplePhoto(sample.url)}
                      className="text-xs font-medium px-2.5 py-1 bg-white border border-[#84A59D]/30 rounded-lg hover:border-[#0F4C5C] shrink-0 text-[#0F4C5C] cursor-pointer shadow-sm"
                    >
                      {sample.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name / Title */}
              <div>
                <label className="block text-xs font-bold text-[#0F4C5C] mb-1">
                  2. Name or Memory Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul, Grandson or Guwahati Trip"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full min-h-[48px] px-3.5 rounded-xl border border-[#84A59D]/30 focus:border-[#0F4C5C] focus:ring-2 focus:ring-[#84A59D]/30 font-medium text-sm bg-white"
                />
              </div>

              {/* Relation / Subtitle */}
              <div>
                <label className="block text-xs font-bold text-[#0F4C5C] mb-1">
                  3. Relation or Place Subtitle
                </label>
                <input
                  type="text"
                  placeholder="e.g. Grandson, Daughter, Tezpur House"
                  value={newRelation}
                  onChange={(e) => setNewRelation(e.target.value)}
                  className="w-full min-h-[48px] px-3.5 rounded-xl border border-[#84A59D]/30 focus:border-[#0F4C5C] focus:ring-2 focus:ring-[#84A59D]/30 font-medium text-sm bg-white"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-[#0F4C5C] mb-1">
                  4. Category
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Family', 'Places', 'Routines'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setNewCategory(cat)}
                      className={`py-2.5 rounded-xl font-bold text-xs border transition-all cursor-pointer ${
                        newCategory === cat
                          ? 'bg-[#0F4C5C] text-white border-[#0F4C5C]'
                          : 'bg-white text-[#5C7A80] border-[#84A59D]/30'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Special Memory Note */}
              <div>
                <label className="block text-xs font-bold text-[#0F4C5C] mb-1">
                  5. Special Memory Note / Voice Spoken Story
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Rahul visited during Bihu with fresh sweets. He loves playing carrom with you."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[#84A59D]/30 focus:border-[#0F4C5C] focus:ring-2 focus:ring-[#84A59D]/30 font-medium text-xs sm:text-sm bg-white"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                id="save-memory-btn"
                className="w-full min-h-[52px] bg-[#0F4C5C] hover:bg-[#0F4C5C]/90 active:scale-95 text-white font-extrabold text-base rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all mt-1 cursor-pointer"
              >
                <Check className="w-5 h-5" strokeWidth={2.5} />
                <span>Save to Memory Book</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
