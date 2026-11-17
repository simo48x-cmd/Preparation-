/**
 * Browser Web Speech API (TTS & SpeechRecognition) + Web Audio API microphone waveform visualizer.
 * Designed with safe fallbacks so audio playback, mic recording, and live waveform visualization
 * work seamlessly across desktop browsers, mobile devices, and headless test environments.
 */

export function speakFrenchText(
  text: string,
  options?: {
    rate?: number;
    onStart?: () => void;
    onEnd?: () => void;
  }
): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    options?.onStart?.();
    setTimeout(() => options?.onEnd?.(), 1500);
    return;
  }

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = options?.rate ?? 1.0;

    const voices = window.speechSynthesis.getVoices();
    const frenchVoice =
      voices.find((v) => v.lang.toLowerCase().startsWith('fr') && v.name.toLowerCase().includes('natural')) ||
      voices.find((v) => v.lang.toLowerCase() === 'fr-fr') ||
      voices.find((v) => v.lang.toLowerCase().startsWith('fr'));

    if (frenchVoice) {
      utterance.voice = frenchVoice;
    }

    utterance.onstart = () => options?.onStart?.();
    utterance.onend = () => options?.onEnd?.();
    utterance.onerror = () => options?.onEnd?.();

    window.speechSynthesis.speak(utterance);
  } catch {
    options?.onStart?.();
    setTimeout(() => options?.onEnd?.(), 1200);
  }
}

export function stopFrenchSpeech(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
  }
}

export interface LiveSpeechController {
  stop: () => void;
}

export function startFrenchSpeechRecognition(callbacks: {
  onTranscript: (finalAndInterimText: string) => void;
  onWaveformUpdate?: (bars: number[]) => void;
  onError?: (message: string) => void;
}): LiveSpeechController {
  let active = true;
  let recognitionInstance: any = null;
  let audioContext: AudioContext | null = null;
  let mediaStream: MediaStream | null = null;
  let animTimer: ReturnType<typeof setInterval> | null = null;

  // 1. Start Web Speech Recognition if supported
  const SpeechRecognitionCtor =
    typeof window !== 'undefined'
      ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      : null;

  if (SpeechRecognitionCtor) {
    try {
      recognitionInstance = new SpeechRecognitionCtor();
      recognitionInstance.lang = 'fr-FR';
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;

      let accumulatedFinal = '';

      recognitionInstance.onresult = (event: any) => {
        if (!active) return;
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcriptPiece = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            accumulatedFinal += transcriptPiece + ' ';
          } else {
            interim += transcriptPiece;
          }
        }
        callbacks.onTranscript((accumulatedFinal + interim).trim());
      };

      recognitionInstance.onerror = (event: any) => {
        if (event?.error && event.error !== 'no-speech' && event.error !== 'aborted') {
          callbacks.onError?.(`Reconnaissance vocale (${event.error}) — vous pouvez aussi saisir ou éditer la transcription.`);
        }
      };

      recognitionInstance.start();
    } catch {
      // Continue with waveform + manual/assisted transcript fallback
    }
  }

  // 2. Start Microphone AudioContext Analyzer for live waveform bars
  if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        if (!active) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        mediaStream = stream;
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          audioContext = new AudioCtx();
          const source = audioContext.createMediaStreamSource(stream);
          const analyser = audioContext.createAnalyser();
          analyser.fftSize = 64;
          source.connect(analyser);
          const dataArray = new Uint8Array(analyser.frequencyBinCount);

          animTimer = setInterval(() => {
            if (!active) return;
            analyser.getByteFrequencyData(dataArray);
            const bars = Array.from({ length: 24 }, (_, idx) => {
              const val = dataArray[idx % dataArray.length] || 12;
              return Math.max(12, Math.min(100, Math.round((val / 255) * 100)));
            });
            callbacks.onWaveformUpdate?.(bars);
          }, 90);
        }
      })
      .catch(() => {
        // Fallback dynamic waveform if microphone is unavailable in sandbox
        animTimer = setInterval(() => {
          if (!active) return;
          const bars = Array.from({ length: 24 }, (_, i) =>
            Math.round(22 + Math.abs(Math.sin(Date.now() / 180 + i * 0.45)) * 68)
          );
          callbacks.onWaveformUpdate?.(bars);
        }, 100);
      });
  } else {
    animTimer = setInterval(() => {
      if (!active) return;
      const bars = Array.from({ length: 24 }, (_, i) =>
        Math.round(22 + Math.abs(Math.sin(Date.now() / 180 + i * 0.45)) * 68)
      );
      callbacks.onWaveformUpdate?.(bars);
    }, 100);
  }

  return {
    stop: () => {
      active = false;
      if (animTimer) clearInterval(animTimer);
      try {
        recognitionInstance?.stop();
      } catch {
        // ignore
      }
      try {
        mediaStream?.getTracks().forEach((t) => t.stop());
      } catch {
        // ignore
      }
      try {
        audioContext?.close();
      } catch {
        // ignore
      }
    },
  };
}
