// Motor de Áudio com Gravações Reais de Kalimba Acústica (MP3 Multi-Sampled C3–C7)
// Compatível com iOS (iPhone/iPad), Android e Desktop
window.KalimbaAudio = (function () {
  let ctx = null;
  let masterGain = null;
  let compressor = null;
  let isMuted = false;
  let isUnlocked = false;
  let htmlAudioUnlockEl = null;
  let volume = 1.0;

  // Mapa de buffers decodificados por número MIDI (48 = C3 até 96 = C7)
  const decodedBuffers = new Map();
  const decodingPromises = new Map();

  const NOTE_NAMES = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];

  // WAV silencioso curto para destravar o canal de mídia ("playback") no iOS Safari
  const SILENT_WAV_DATA_URI =
    "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";

  function midiToNoteName(midi) {
    const clamped = Math.max(48, Math.min(96, Math.round(midi)));
    const noteIdx = clamped % 12;
    const octave = Math.floor(clamped / 12) - 1;
    return `${NOTE_NAMES[noteIdx]}${octave}`;
  }

  function freqToMidi(freq) {
    return 69 + 12 * Math.log2(freq / 440);
  }

  function base64DataUriToArrayBuffer(dataUri) {
    const base64 = dataUri.split(",")[1] || "";
    const binary = window.atob(base64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }

  function configureIOSAudioSession() {
    try {
      if (typeof navigator !== "undefined" && navigator.audioSession) {
        navigator.audioSession.type = "playback";
      }
    } catch (e) {}
  }

  function unlockIOSHtmlAudio() {
    configureIOSAudioSession();
    try {
      if (!htmlAudioUnlockEl) {
        htmlAudioUnlockEl = new Audio(SILENT_WAV_DATA_URI);
        htmlAudioUnlockEl.setAttribute("playsinline", "true");
        htmlAudioUnlockEl.setAttribute("webkit-playsinline", "true");
        htmlAudioUnlockEl.volume = 0.01;
      }
      const p = htmlAudioUnlockEl.play();
      if (p && typeof p.then === "function") p.catch(() => {});
    } catch (e) {}
  }

  function decodeNoteSample(noteName) {
    if (!ctx || !window.KALIMBA_REAL_SAMPLES) return Promise.resolve(null);
    if (decodedBuffers.has(noteName)) {
      return Promise.resolve(decodedBuffers.get(noteName));
    }
    if (decodingPromises.has(noteName)) {
      return decodingPromises.get(noteName);
    }

    const dataUri = window.KALIMBA_REAL_SAMPLES[noteName];
    if (!dataUri) return Promise.resolve(null);

    const promise = new Promise((resolve) => {
      try {
        const arrayBuf = base64DataUriToArrayBuffer(dataUri);
        // Usa callback clássico + Promise para máxima compatibilidade com Safari iOS
        const res = ctx.decodeAudioData(
          arrayBuf,
          (audioBuffer) => {
            decodedBuffers.set(noteName, audioBuffer);
            resolve(audioBuffer);
          },
          () => resolve(null)
        );
        if (res && typeof res.then === "function") {
          res.catch(() => {});
        }
      } catch (e) {
        resolve(null);
      }
    });

    decodingPromises.set(noteName, promise);
    return promise;
  }

  // Pré-decodifica prioritariamente as 17 teclas de Dó Maior (C4 a E6) e depois as demais
  async function preloadAllKalimbaSamples() {
    if (!ctx || !window.KALIMBA_REAL_SAMPLES) return;
    const priorityNotes = [
      "C4", "D4", "E4", "F4", "G4", "A4", "B4",
      "C5", "D5", "E5", "F5", "G5", "A5", "B5",
      "C6", "D6", "E6"
    ];
    for (const n of priorityNotes) {
      await decodeNoteSample(n);
    }
    for (const n of Object.keys(window.KALIMBA_REAL_SAMPLES)) {
      if (!decodedBuffers.has(n)) {
        decodeNoteSample(n);
      }
    }
  }

  function initContext() {
    configureIOSAudioSession();

    if (!ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      ctx = new AudioCtx();

      masterGain = ctx.createGain();
      masterGain.gain.value = volume;

      compressor = ctx.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(-14, ctx.currentTime);
      compressor.knee.setValueAtTime(20, ctx.currentTime);
      compressor.ratio.setValueAtTime(3.2, ctx.currentTime);
      compressor.attack.setValueAtTime(0.002, ctx.currentTime);
      compressor.release.setValueAtTime(0.18, ctx.currentTime);

      masterGain.connect(compressor);
      compressor.connect(ctx.destination);

      // Inicia o pré-carregamento dos MP3 reais da Kalimba em background
      preloadAllKalimbaSamples();
    }

    if (ctx.state !== "running") {
      ctx.resume().catch(() => {});
    }

    if (!isUnlocked && ctx) {
      try {
        const buffer = ctx.createBuffer(1, 1, 22050);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        if (source.start) source.start(0);
        if (ctx.state === "running") isUnlocked = true;
      } catch (e) {}
    }

    return ctx;
  }

  function setupGlobalTouchUnlock() {
    const unlockHandler = () => {
      unlockIOSHtmlAudio();
      initContext();
      if (ctx && ctx.state === "running") {
        isUnlocked = true;
      }
    };

    ["touchstart", "touchend", "pointerdown", "mousedown", "click", "keydown"].forEach((evt) => {
      window.addEventListener(evt, unlockHandler, { passive: true, capture: true });
    });

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible" && ctx && ctx.state !== "running") {
        configureIOSAudioSession();
        ctx.resume().catch(() => {});
      }
    });
  }

  setupGlobalTouchUnlock();

  function playDecodedBuffer(audioBuffer, rate, velocity) {
    if (!ctx || !masterGain || !audioBuffer) return;
    const now = ctx.currentTime;
    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.playbackRate.setValueAtTime(rate, now);

    const noteGain = ctx.createGain();
    const gainVal = Math.min(1.35, Math.max(0.2, velocity * 1.15));
    noteGain.gain.setValueAtTime(gainVal, now);

    source.connect(noteGain);
    noteGain.connect(masterGain);
    source.start(now);
  }

  function playHtmlAudioFallback(noteName, velocity) {
    if (!window.KALIMBA_REAL_SAMPLES || !window.KALIMBA_REAL_SAMPLES[noteName]) return;
    try {
      const audio = new Audio(window.KALIMBA_REAL_SAMPLES[noteName]);
      audio.setAttribute("playsinline", "true");
      audio.volume = Math.min(1.0, Math.max(0.15, velocity));
      const p = audio.play();
      if (p && typeof p.then === "function") p.catch(() => {});
    } catch (e) {}
  }

  function playNote(freq, velocity = 0.95) {
    if (isMuted || !freq) return;
    initContext();

    const exactMidi = freqToMidi(freq);
    const nearestMidi = Math.max(48, Math.min(96, Math.round(exactMidi)));
    const noteName = midiToNoteName(nearestMidi);
    const playbackRate = Math.pow(2, (exactMidi - nearestMidi) / 12);

    const cachedBuffer = decodedBuffers.get(noteName);
    if (cachedBuffer && ctx && ctx.state === "running") {
      playDecodedBuffer(cachedBuffer, playbackRate, velocity);
      return;
    }

    // Caso o buffer ainda esteja decodificando ou o iOS esteja destravando no primeiro toque:
    if (ctx) {
      if (ctx.state !== "running") {
        ctx.resume().catch(() => {});
      }
      decodeNoteSample(noteName).then((buf) => {
        if (buf && ctx && ctx.state === "running") {
          playDecodedBuffer(buf, playbackRate, velocity);
        } else {
          playHtmlAudioFallback(noteName, velocity);
        }
      });
    } else {
      playHtmlAudioFallback(noteName, velocity);
    }
  }

  function playChord(freqs, velocity = 0.92, arpeggiateMs = 18) {
    if (isMuted || !freqs || !freqs.length) return;
    initContext();
    freqs.forEach((f, idx) => {
      if (arpeggiateMs > 0 && freqs.length > 1) {
        setTimeout(() => playNote(f, velocity * 0.95), idx * arpeggiateMs);
      } else {
        playNote(f, velocity * 0.95);
      }
    });
  }

  function playMetronomeTick(isDownbeat = false) {
    if (isMuted) return;
    initContext();
    const noteName = isDownbeat ? "C6" : "C5";
    const buf = decodedBuffers.get(noteName);
    if (buf) {
      playDecodedBuffer(buf, 1.0, 0.35);
    }
  }

  function setMuted(mute) {
    isMuted = !!mute;
    return isMuted;
  }

  function getMuted() {
    return isMuted;
  }

  return {
    initContext,
    playNote,
    playChord,
    playMetronomeTick,
    setMuted,
    getMuted
  };
})();
