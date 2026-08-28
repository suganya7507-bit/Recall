import React, { useState } from 'react';
import { Volume2, Heart, CheckCircle2, AlertCircle, Sparkles, Trophy, ArrowRight, RotateCcw, Home, Sprout } from 'lucide-react';
import { LanguageCode } from '../types';
import { GAME_ROUNDS } from '../data/initialData';
import { TranslationSchema } from '../data/translations';
import { soundManager, speakInstruction } from '../utils/audio';

interface MemoryGameScreenProps {
  onCompleteGame: (score: number) => void;
  onNavigateHome: () => void;
  currentLanguage: LanguageCode;
  t: TranslationSchema;
}

export const MemoryGameScreen: React.FC<MemoryGameScreenProps> = ({
  onCompleteGame,
  onNavigateHome,
  currentLanguage,
  t
}) => {
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isCorrectFeedback, setIsCorrectFeedback] = useState<boolean | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string>(t.youAreDoingGreat);
  const [score, setScore] = useState<number>(0);
  const [gameFinished, setGameFinished] = useState<boolean>(false);
  const [isSpeakingInstruction, setIsSpeakingInstruction] = useState<boolean>(false);

  const currentRound = GAME_ROUNDS[currentRoundIndex];
  const totalRounds = GAME_ROUNDS.length;

  const handleHearInstruction = () => {
    soundManager.playClick();
    setIsSpeakingInstruction(true);
    speakInstruction(currentRound.instructionAudioText, () => {
      setIsSpeakingInstruction(false);
    }, currentLanguage);
  };

  const handleSelectOption = (optionId: string, isCorrect: boolean) => {
    setSelectedOptionId(optionId);

    if (isCorrect) {
      soundManager.playSuccess();
      setIsCorrectFeedback(true);
      setScore(prev => prev + 100);
      setFeedbackMessage(t.greatJobTitle);
      speakInstruction(t.greatJobTitle, undefined, currentLanguage);

      // Automatically load the next round after celebration
      setTimeout(() => {
        if (currentRoundIndex + 1 < totalRounds) {
          setCurrentRoundIndex(prev => prev + 1);
          setSelectedOptionId(null);
          setIsCorrectFeedback(null);
          setFeedbackMessage(t.youAreDoingGreat);
        } else {
          setGameFinished(true);
          onCompleteGame(score + 100);
          soundManager.playSyncSuccess();
        }
      }, 1400);
    } else {
      soundManager.playGentleHint();
      setIsCorrectFeedback(false);
      const hintMsg = `${t.tryAgainTitle} ${currentRound.hint}`;
      setFeedbackMessage(hintMsg);
      speakInstruction(hintMsg, undefined, currentLanguage);
    }
  };

  const handleSkipRound = () => {
    soundManager.playClick();
    if (currentRoundIndex + 1 < totalRounds) {
      setCurrentRoundIndex(prev => prev + 1);
      setSelectedOptionId(null);
      setIsCorrectFeedback(null);
      setFeedbackMessage(t.youAreDoingGreat);
    } else {
      setGameFinished(true);
      onCompleteGame(score);
    }
  };

  const handleRestart = () => {
    soundManager.playClick();
    setCurrentRoundIndex(0);
    setSelectedOptionId(null);
    setIsCorrectFeedback(null);
    setFeedbackMessage(t.youAreDoingGreat);
    setScore(0);
    setGameFinished(false);
  };

  if (gameFinished) {
    return (
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center text-center animate-in fade-in duration-300 py-6 sm:py-10 pb-28 md:pb-8">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#84A59D]/20 text-[#0F4C5C] flex items-center justify-center mb-4 shadow-sm">
          <Trophy className="w-10 h-10 sm:w-12 sm:h-12" />
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0F4C5C] mb-2 tracking-tight">
          {t.congratulations}
        </h2>
        <p className="text-base sm:text-lg text-[#5C7A80] font-medium mb-6 max-w-md">
          {t.gameCompletedDesc}
        </p>

        {/* Score Card */}
        <div className="w-full max-w-md bg-white rounded-[24px] p-6 border border-[#84A59D]/20 soft-shadow mb-6">
          <div className="flex justify-around items-center divide-x divide-[#84A59D]/20">
            <div className="px-4">
              <span className="block text-3xl sm:text-4xl font-extrabold text-[#0F4C5C]">
                {score}
              </span>
              <span className="text-xs font-bold text-[#84A59D] uppercase tracking-wider">
                {t.score} Points
              </span>
            </div>
            <div className="px-4">
              <span className="block text-3xl sm:text-4xl font-extrabold text-[#84A59D]">
                3 / 3
              </span>
              <span className="text-xs font-bold text-[#84A59D] uppercase tracking-wider">
                {t.roundsCount}
              </span>
            </div>
          </div>
          <p className="mt-4 text-xs text-[#0F4C5C] bg-[#84A59D]/15 py-2.5 px-3 rounded-xl font-bold border border-[#84A59D]/20">
            🌱 Daily Cognitive Health Record Saved Locally
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3.5 w-full max-w-md">
          <button
            id="game-play-again-btn"
            onClick={handleRestart}
            className="flex-1 h-[56px] bg-[#0F4C5C] hover:bg-[#0F4C5C]/90 active:scale-95 text-white font-bold text-base rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
            <span>{t.playAgain}</span>
          </button>

          <button
            id="game-back-home-btn"
            onClick={onNavigateHome}
            className="flex-1 h-[56px] bg-white border border-[#0F4C5C] hover:bg-gray-50 active:scale-95 text-[#0F4C5C] font-bold text-base rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
          >
            <Home className="w-5 h-5" />
            <span>{t.backToHome}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center pb-28 md:pb-8">
      {/* Organic Bloom Progress Track (Responsive Container) */}
      <section className="w-full bg-white rounded-[24px] p-5 sm:p-6 soft-shadow border border-[#84A59D]/20 mb-6 flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-lg sm:text-xl text-[#0F4C5C]">
              {t.roundOf} {currentRound.id} / {totalRounds}
            </span>
            <span className="text-xs bg-[#FAF7F2] text-[#84A59D] font-bold px-2.5 py-1 rounded-md border border-[#84A59D]/30 hidden sm:inline">
              {t.heritageGameTitle}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-[#0F4C5C] bg-[#84A59D]/20 border border-[#84A59D]/40 px-3 py-1 rounded-full text-xs font-bold">
              <Sprout className="w-3.5 h-3.5 text-[#84A59D]" />
              <span>{t.youAreDoingGreat}</span>
            </div>

            <button
              onClick={handleSkipRound}
              className="text-xs text-[#5C7A80] hover:text-[#0F4C5C] font-semibold px-2 py-1 rounded-lg transition-colors cursor-pointer"
            >
              Skip →
            </button>
          </div>
        </div>

        {/* Multi-step progress bar */}
        <div className="w-full h-3 bg-[#FAF7F2] border border-[#84A59D]/20 rounded-full overflow-hidden flex relative">
          <div
            className="h-full bg-[#84A59D] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(currentRound.id / totalRounds) * 100}%` }}
          />
        </div>
      </section>

      {/* Round Prompt & Instructions */}
      <section className="text-center mb-4 max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0F4C5C] mb-2 tracking-tight">
          {currentRound.promptTitle}
        </h1>
        <p className="text-sm sm:text-base text-[#5C7A80] max-w-lg mx-auto mb-4">
          {currentRound.promptDescription}
        </p>

        {/* Audio Instruction Button */}
        <button
          id="game-hear-instruction-btn"
          onClick={handleHearInstruction}
          aria-label={t.hearSpokenInstruction}
          className={`inline-flex items-center gap-2.5 bg-white hover:bg-gray-50 text-[#0F4C5C] rounded-full px-6 py-3 min-h-[50px] border border-[#84A59D]/30 transition-all active:scale-95 shadow-sm cursor-pointer ${
            isSpeakingInstruction ? 'ring-4 ring-[#84A59D]/40 bg-[#84A59D]/20' : ''
          }`}
        >
          <Volume2 className="w-5 h-5 text-[#84A59D]" />
          <span className="font-bold text-sm text-[#0F4C5C]">
            {t.hearSpokenInstruction}
          </span>
        </button>
      </section>

      {/* Interactive Options Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-5 sm:gap-6 w-full max-w-3xl mb-6">
        {currentRound.options.map((option) => {
          const isSelected = selectedOptionId === option.id;
          const isCorrect = option.isCorrect;

          let cardBorderColor = "border-b-4 border-[#84A59D] border-x border-t border-gray-100";
          let cardBg = "bg-white";
          let badge = null;

          if (isSelected) {
            if (isCorrectFeedback === true && isCorrect) {
              cardBorderColor = "border-b-4 border-emerald-500 ring-4 ring-emerald-200 border-x border-t border-emerald-200";
              cardBg = "bg-emerald-50/70";
              badge = (
                <div className="absolute top-3 right-3 bg-emerald-600 text-white rounded-full p-2 shadow-md animate-bounce z-10">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              );
            } else if (isCorrectFeedback === false) {
              cardBorderColor = "border-b-4 border-[#E07A5F] ring-4 ring-[#E07A5F]/30 border-x border-t border-[#E07A5F]/30";
              cardBg = "bg-[#E07A5F]/10";
              badge = (
                <div className="absolute top-3 right-3 bg-[#E07A5F] text-white rounded-full p-2 shadow-md z-10">
                  <AlertCircle className="w-6 h-6" />
                </div>
              );
            }
          }

          return (
            <button
              key={option.id}
              id={`game-option-${option.id}`}
              onClick={() => handleSelectOption(option.id, option.isCorrect)}
              aria-label={`Select ${option.name}`}
              className={`w-full ${cardBg} rounded-[24px] p-4 ${cardBorderColor} hover:border-[#0F4C5C] active:scale-[0.98] transition-all duration-200 soft-shadow flex flex-col items-center gap-3 relative overflow-hidden group text-center focus:outline-none focus:ring-4 focus:ring-[#84A59D]/30 cursor-pointer`}
            >
              {badge}
              {/* Photo Area */}
              <div className="w-full h-44 sm:h-52 rounded-2xl overflow-hidden shadow-sm border border-[#84A59D]/20 relative bg-neutral-100">
                <img
                  src={option.imageUrl}
                  alt={option.altText}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Title */}
              <span className="font-extrabold text-xl md:text-2xl text-[#0F4C5C] group-hover:text-[#84A59D] transition-colors py-1">
                {option.name}
              </span>
            </button>
          );
        })}
      </section>

      {/* Gentle Reassurance Feedback Banner */}
      <div
        className={`w-full max-w-xl p-4 rounded-2xl border text-center transition-all duration-300 font-bold text-sm ${
          isCorrectFeedback === true
            ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
            : isCorrectFeedback === false
            ? 'bg-[#E07A5F]/20 text-[#0F4C5C] border-[#E07A5F]/40'
            : 'bg-white text-[#5C7A80] border-[#84A59D]/20 shadow-xs'
        }`}
      >
        <div className="flex items-center justify-center gap-2">
          {isCorrectFeedback === true ? (
            <Sparkles className="w-5 h-5 text-emerald-600 animate-spin" />
          ) : (
            <Heart className="w-4 h-4 text-[#E07A5F]" />
          )}
          <span>{feedbackMessage}</span>
        </div>
      </div>
    </div>
  );
};
