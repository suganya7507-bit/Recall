// Web Audio API sound generator for gentle, calming audio cues tailored for elderly dementia patients

class SoundManager {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Gentle soft click for buttons
  playClick() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // AudioContext unavailable
    }
  }

  // Cheerful chime when an answer or reminder is completed correctly
  playSuccess() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      
      // Warm pentatonic chord (C5 - E5 - G5 - C6)
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.09);

        gain.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.09 + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.09);
        osc.stop(ctx.currentTime + idx * 0.09 + 0.5);
      });
    } catch {
      // AudioContext unavailable
    }
  }

  // Gentle, reassuring tone for hints/non-punitive feedback
  playGentleHint() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(392.00, ctx.currentTime); // G4
      osc.frequency.linearRampToValueAtTime(440.00, ctx.currentTime + 0.15); // A4

      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // AudioContext unavailable
    }
  }

  // Calm notification chime for reminders & alerts
  playReminderChime() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      
      [440, 554.37, 659.25].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
        gain.gain.setValueAtTime(0.1, ctx.currentTime + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.12);
        osc.stop(ctx.currentTime + i * 0.12 + 0.65);
      });
    } catch {
      // AudioContext unavailable
    }
  }

  // Sync complete chime
  playSyncSuccess() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      [587.33, 739.99, 880.00].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);
        gain.gain.setValueAtTime(0.1, ctx.currentTime + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.1);
        osc.stop(ctx.currentTime + i * 0.1 + 0.55);
      });
    } catch {
      // AudioContext unavailable
    }
  }
}

export const soundManager = new SoundManager();

// Text-To-Speech with warm, slow, clear voice tailored for elderly dementia support
const LANG_VOICE_MAP: Record<string, string[]> = {
  en: ['en-IN', 'en-GB', 'en-US'],
  as: ['as-IN', 'bn-IN', 'hi-IN'],
  bn: ['bn-IN', 'bn-BD', 'hi-IN'],
  mni: ['mni-IN', 'bn-IN', 'hi-IN'],
  ne: ['ne-NP', 'hi-IN'],
  hi: ['hi-IN', 'hi'],
  ta: ['ta-IN', 'ta-LK'],
  te: ['te-IN'],
  kn: ['kn-IN'],
  ml: ['ml-IN'],
  mr: ['mr-IN', 'hi-IN'],
  gu: ['gu-IN', 'hi-IN'],
};

export function speakInstruction(text: string, onEnd?: () => void, langCode: string = 'en') {
  if (typeof window === 'undefined') return;

  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85; // Slightly slower, clear for dementia care
    utterance.pitch = 1.05; // Friendly, warm pitch
    utterance.volume = 1.0;

    const targetLangs = LANG_VOICE_MAP[langCode] || ['en-IN', 'en-US'];
    utterance.lang = targetLangs[0];

    const voices = window.speechSynthesis.getVoices();
    let preferredVoice = voices.find(v => targetLangs.some(l => v.lang.toLowerCase().startsWith(l.toLowerCase().split('-')[0])));
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = onEnd;
    }
    window.speechSynthesis.speak(utterance);
  } else {
    soundManager.playGentleHint();
    if (onEnd) {
      setTimeout(onEnd, 1500);
    }
  }
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
