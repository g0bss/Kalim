// Motor de Síntese Acústica de Kalimba (Web Audio API) — Otimizado para iOS (iPhone/iPad) e Desktop
window.KalimbaAudio = (function () {
  let ctx = null;
  let masterGain = null;
  let compressor = null;
  let reverbNode = null;
  let isMuted = false;
  let isUnlocked = false;
  let htmlAudioUnlockEl = null;
  let volume = 0.95;

  // Pequeno arquivo WAV silencioso válido (PCM 8-bit 8kHz mono) para forçar o iOS Safari
  // a usar o canal de Mídia ("playback") mesmo com a chave Modo Silencioso ativada no iPhone.
  const SILENT_WAV_DATA_URI =
    "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";

  function configureIOSAudioSession() {
    try {
      if (typeof navigator !== "undefined" && navigator.audioSession) {
        navigator.audioSession.type = "playback";
      }
    } catch (e) {
      // Ignorar caso não suportado no navegador
    }
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
      const playPromise = htmlAudioUnlockEl.play();
      if (playPromise && typeof playPromise.then === "function") {
        playPromise.catch(() => {});
      }
    } catch (e) {
      // Ignorar erros de autoplay
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

      // Compressor suave para dar mais volume e presença no alto-falante do iPhone sem distorcer
      compressor = ctx.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(-18, ctx.currentTime);
      compressor.knee.setValueAtTime(24, ctx.currentTime);
      compressor.ratio.setValueAtTime(4, ctx.currentTime);
      compressor.attack.setValueAtTime(0.003, ctx.currentTime);
      compressor.release.setValueAtTime(0.2, ctx.currentTime);

      // Criar ambiência acústica de caixa de ressonância de madeira (Delay + Filtro passa-baixa)
      const delay = ctx.createDelay();
      delay.delayTime.value = 0.085;

      const feedback = ctx.createGain();
      feedback.gain.value = 0.24;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 1800;

      const wetGain = ctx.createGain();
      wetGain.gain.value = 0.24;

      masterGain.connect(compressor);
      masterGain.connect(delay);
      delay.connect(filter);
      filter.connect(feedback);
      feedback.connect(delay);
      filter.connect(wetGain);
      wetGain.connect(compressor);
      compressor.connect(ctx.destination);

      reverbNode = masterGain;
    }

    if (ctx.state !== "running") {
      ctx.resume().catch(() => {});
    }

    // Tocar buffer silencioso de 1 sample para destravar o WebKit AudioContext no iOS
    if (!isUnlocked && ctx) {
      try {
        const buffer = ctx.createBuffer(1, 1, 22050);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        if (source.start) {
          source.start(0);
        } else if (source.noteOn) {
          source.noteOn(0);
        }
        if (ctx.state === "running") {
          isUnlocked = true;
        }
      } catch (e) {
        // Ignorar
      }
    }

    return ctx;
  }

  // Destravar automaticamente no primeiro toque ou clique em qualquer lugar da tela (iOS/Android)
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

    // Quando o usuário volta para a aba ou desbloqueia a tela do iPhone, o iOS coloca o áudio em "interrupted"
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible" && ctx && ctx.state !== "running") {
        configureIOSAudioSession();
        ctx.resume().catch(() => {});
      }
    });
  }

  setupGlobalTouchUnlock();

  function triggerNoteVoices(freq, velocity, durationScale) {
    if (!ctx || !reverbNode) return;
    const now = ctx.currentTime;
    const noteGain = ctx.createGain();
    noteGain.connect(reverbNode);

    // Tempo de decaimento varia conforme a frequência
    const baseDecay = Math.max(1.15, Math.min(2.7, (440 / freq) * 1.48)) * durationScale;
    const peak = Math.min(0.62, 0.48 * velocity);

    noteGain.gain.setValueAtTime(0.0001, now);
    noteGain.gain.linearRampToValueAtTime(peak, now + 0.005);
    noteGain.gain.exponentialRampToValueAtTime(peak * 0.48, now + 0.14);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + baseDecay);

    // 1. Fundamental (Corpo de madeira + lâmina)
    const oscFund = ctx.createOscillator();
    oscFund.type = "sine";
    oscFund.frequency.setValueAtTime(freq * 1.006, now);
    oscFund.frequency.exponentialRampToValueAtTime(freq, now + 0.025);

    // 2. Segundo harmônico (Ressonância da caixa)
    const oscBody = ctx.createOscillator();
    oscBody.type = "triangle";
    oscBody.frequency.setValueAtTime(freq * 2, now);
    const bodyGain = ctx.createGain();
    bodyGain.gain.setValueAtTime(0.20, now);
    bodyGain.gain.exponentialRampToValueAtTime(0.001, now + baseDecay * 0.38);

    // 3. Harmônico metálico característico da Kalimba ("Pling" inarmônico ~2.98x)
    const oscTine = ctx.createOscillator();
    oscTine.type = "sine";
    oscTine.frequency.setValueAtTime(freq * 2.98, now);
    const tineGain = ctx.createGain();
    tineGain.gain.setValueAtTime(0.25 * velocity, now);
    tineGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);

    oscFund.connect(noteGain);
    oscBody.connect(bodyGain);
    bodyGain.connect(noteGain);
    oscTine.connect(tineGain);
    tineGain.connect(noteGain);

    oscFund.start(now);
    oscBody.start(now);
    oscTine.start(now);

    const stopTime = now + baseDecay + 0.05;
    oscFund.stop(stopTime);
    oscBody.stop(stopTime);
    oscTine.stop(stopTime);
  }

  function playNote(freq, velocity = 0.95, durationScale = 1.0) {
    if (isMuted || !freq) return;
    initContext();
    if (!ctx) return;

    if (ctx.state !== "running") {
      unlockIOSHtmlAudio();
      ctx.resume().then(() => {
        triggerNoteVoices(freq, velocity, durationScale);
      }).catch(() => {});
      return;
    }

    triggerNoteVoices(freq, velocity, durationScale);
  }

  function playChord(freqs, velocity = 0.9, arpeggiateMs = 18) {
    if (isMuted || !freqs || !freqs.length) return;
    initContext();
    freqs.forEach((f, idx) => {
      if (arpeggiateMs > 0 && freqs.length > 1) {
        setTimeout(() => playNote(f, velocity * 0.92), idx * arpeggiateMs);
      } else {
        playNote(f, velocity * 0.92);
      }
    });
  }

  function playMetronomeTick(isDownbeat = false) {
    if (isMuted) return;
    initContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(isDownbeat ? 1100 : 750, now);
    gain.gain.setValueAtTime(0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.04);
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
