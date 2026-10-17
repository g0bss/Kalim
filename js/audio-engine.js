// Motor de Síntese Acústica de Kalimba (Web Audio API)
window.KalimbaAudio = (function () {
  let ctx = null;
  let masterGain = null;
  let reverbNode = null;
  let isMuted = false;
  let volume = 0.85;

  function initContext() {
    if (!ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      ctx = new AudioCtx();

      masterGain = ctx.createGain();
      masterGain.gain.value = volume;

      // Criar ambiência acústica de caixa de ressonância de madeira (Delay + Filtro passa-baixa)
      const delay = ctx.createDelay();
      delay.delayTime.value = 0.085;

      const feedback = ctx.createGain();
      feedback.gain.value = 0.24;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 1800;

      const wetGain = ctx.createGain();
      wetGain.gain.value = 0.22;

      masterGain.connect(ctx.destination);
      masterGain.connect(delay);
      delay.connect(filter);
      filter.connect(feedback);
      feedback.connect(delay);
      filter.connect(wetGain);
      wetGain.connect(ctx.destination);

      reverbNode = masterGain;
    }
    if (ctx.state === "suspended") {
      ctx.resume();
    }
  }

  function playNote(freq, velocity = 0.9, durationScale = 1.0) {
    if (isMuted || !freq) return;
    initContext();

    const now = ctx.currentTime;
    const noteGain = ctx.createGain();
    noteGain.connect(reverbNode);

    // Tempo de decaimento varia levemente conforme a frequência (graves soam por mais tempo)
    const baseDecay = Math.max(1.1, Math.min(2.6, (440 / freq) * 1.45)) * durationScale;
    const peak = Math.min(0.45, 0.35 * velocity);

    noteGain.gain.setValueAtTime(0.0001, now);
    noteGain.gain.linearRampToValueAtTime(peak, now + 0.006);
    noteGain.gain.exponentialRampToValueAtTime(peak * 0.45, now + 0.14);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + baseDecay);

    // 1. Fundamental (Corpo de madeira + lâmina)
    const oscFund = ctx.createOscillator();
    oscFund.type = "sine";
    // Leve queda de pitch no ataque (efeito físico da lâmina sendo solta pela unha)
    oscFund.frequency.setValueAtTime(freq * 1.006, now);
    oscFund.frequency.exponentialRampToValueAtTime(freq, now + 0.025);

    // 2. Segundo harmônico (Ressonância da caixa)
    const oscBody = ctx.createOscillator();
    oscBody.type = "triangle";
    oscBody.frequency.setValueAtTime(freq * 2, now);
    const bodyGain = ctx.createGain();
    bodyGain.gain.setValueAtTime(0.16, now);
    bodyGain.gain.exponentialRampToValueAtTime(0.001, now + baseDecay * 0.35);

    // 3. Harmônico metálico característico da Kalimba ("Pling" inarmônico ~2.98x)
    const oscTine = ctx.createOscillator();
    oscTine.type = "sine";
    oscTine.frequency.setValueAtTime(freq * 2.98, now);
    const tineGain = ctx.createGain();
    tineGain.gain.setValueAtTime(0.22 * velocity, now);
    tineGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.13);

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

  function playChord(freqs, velocity = 0.85, arpeggiateMs = 18) {
    if (isMuted || !freqs || !freqs.length) return;
    initContext();
    // Na Kalimba, acordes costumam soar com um micro-glissando (arpejo rápido de ~18ms)
    freqs.forEach((f, idx) => {
      if (arpeggiateMs > 0 && freqs.length > 1) {
        setTimeout(() => playNote(f, velocity * 0.9), idx * arpeggiateMs);
      } else {
        playNote(f, velocity * 0.9);
      }
    });
  }

  function playMetronomeTick(isDownbeat = false) {
    if (isMuted) return;
    initContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(isDownbeat ? 1100 : 750, now);
    gain.gain.setValueAtTime(0.12, now);
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
