// Aplicação Principal: Kalim (Tiles, Biblioteca Persistente, Cifra/KTab, Kalimba Livre e Criador)
(function () {
  const STORAGE_KEY_PREFS = "kalimba_hero_prefs_v4";

  const THEME_PALETTES = {
    peach: {
      laneMarked: "rgba(245, 183, 153, 0.18)",
      laneCenter: "rgba(232, 122, 93, 0.16)",
      laneLine: "rgba(158, 123, 110, 0.10)",
      barLine: "rgba(158, 123, 110, 0.22)",
      textMuted: "rgba(158, 123, 110, 0.75)",
      hitLine: "#e87a5d",
      targetFill: "#ffffff",
      octLow: "#68c4a4",
      octMid: "#e87a5d",
      octHigh: "#63add0",
      octUltra: "#9d85d6"
    },
    sakura: {
      laneMarked: "rgba(244, 166, 190, 0.18)",
      laneCenter: "rgba(229, 107, 146, 0.16)",
      laneLine: "rgba(156, 113, 128, 0.10)",
      barLine: "rgba(156, 113, 128, 0.22)",
      textMuted: "rgba(156, 113, 128, 0.75)",
      hitLine: "#e56b92",
      targetFill: "#ffffff",
      octLow: "#68c4a4",
      octMid: "#e56b92",
      octHigh: "#68aee0",
      octUltra: "#a882dd"
    },
    sky: {
      laneMarked: "rgba(154, 198, 245, 0.20)",
      laneCenter: "rgba(78, 145, 232, 0.16)",
      laneLine: "rgba(108, 136, 166, 0.10)",
      barLine: "rgba(108, 136, 166, 0.22)",
      textMuted: "rgba(108, 136, 166, 0.75)",
      hitLine: "#4e91e8",
      targetFill: "#ffffff",
      octLow: "#4db6ac",
      octMid: "#4e91e8",
      octHigh: "#eb7aa3",
      octUltra: "#9575cd"
    },
    matcha: {
      laneMarked: "rgba(149, 207, 169, 0.20)",
      laneCenter: "rgba(74, 168, 110, 0.16)",
      laneLine: "rgba(107, 140, 119, 0.10)",
      barLine: "rgba(107, 140, 119, 0.22)",
      textMuted: "rgba(107, 140, 119, 0.75)",
      hitLine: "#4aa86e",
      targetFill: "#ffffff",
      octLow: "#eab308",
      octMid: "#4aa86e",
      octHigh: "#529be0",
      octUltra: "#d977a8"
    },
    lofi: {
      laneMarked: "rgba(229, 152, 142, 0.11)",
      laneCenter: "rgba(229, 152, 142, 0.16)",
      laneLine: "rgba(255, 255, 255, 0.06)",
      barLine: "rgba(255, 255, 255, 0.16)",
      textMuted: "rgba(158, 148, 184, 0.7)",
      hitLine: "#e5988e",
      targetFill: "#2c2642",
      octLow: "#5ec2a0",
      octMid: "#e5988e",
      octHigh: "#68aee0",
      octUltra: "#b794f4"
    },
    midnight: {
      laneMarked: "rgba(110, 168, 254, 0.11)",
      laneCenter: "rgba(110, 168, 254, 0.16)",
      laneLine: "rgba(255, 255, 255, 0.06)",
      barLine: "rgba(255, 255, 255, 0.16)",
      textMuted: "rgba(139, 160, 196, 0.7)",
      hitLine: "#6ea8fe",
      targetFill: "#1c2740",
      octLow: "#4fd1b5",
      octMid: "#6ea8fe",
      octHigh: "#f0a1c4",
      octUltra: "#b69cf5"
    },
    forest: {
      laneMarked: "rgba(124, 207, 154, 0.11)",
      laneCenter: "rgba(124, 207, 154, 0.16)",
      laneLine: "rgba(255, 255, 255, 0.06)",
      barLine: "rgba(255, 255, 255, 0.16)",
      textMuted: "rgba(143, 174, 153, 0.7)",
      hitLine: "#7ccf9a",
      targetFill: "#1f3328",
      octLow: "#e6c35c",
      octMid: "#7ccf9a",
      octHigh: "#6cb7e6",
      octUltra: "#d79ae0"
    },
    amoled: {
      laneMarked: "rgba(255, 255, 255, 0.06)",
      laneCenter: "rgba(180, 140, 255, 0.16)",
      laneLine: "rgba(255, 255, 255, 0.07)",
      barLine: "rgba(255, 255, 255, 0.18)",
      textMuted: "rgba(160, 160, 170, 0.7)",
      hitLine: "#b48cff",
      targetFill: "#16161a",
      octLow: "#4dd8b0",
      octMid: "#b48cff",
      octHigh: "#5fb8ff",
      octUltra: "#ff8fb8"
    },
    wine: {
      laneMarked: "rgba(240, 130, 160, 0.11)",
      laneCenter: "rgba(240, 130, 160, 0.16)",
      laneLine: "rgba(255, 255, 255, 0.06)",
      barLine: "rgba(255, 255, 255, 0.16)",
      textMuted: "rgba(190, 150, 165, 0.7)",
      hitLine: "#f082a0",
      targetFill: "#3a1f2c",
      octLow: "#6cd4b0",
      octMid: "#f082a0",
      octHigh: "#78b8f0",
      octUltra: "#c9a0f5"
    }
  };

  const state = {
    activeTab: "hero", // "hero" | "library" | "cifra" | "free" | "editor"
    theme: "peach",
    kalimbaSize: "17",
    tuningId: "C_MAJOR",
    labelMode: "both",
    kalimbaWidthPct: 100,
    kalimbaHeightPct: 34,
    layout: [],
    degreeToKeyMap: {},

    songs: [],
    currentSongId: "twinkle-star",
    currentSong: null,

    // Filtros da Biblioteca
    libraryCategory: "ALL",
    libraryDifficulty: "ALL",
    cloudOnline: false,
    librarySearch: "",
    previewingSongId: null,
    previewTimers: [],

    // Playback Tiles
    isPlaying: false,
    currentBeat: -5,
    speed: 1.0,
    playStyle: "wait", // "wait" | "flow"
    guideAudioInFlow: true,
    loopEnabled: false,
    loopStartBeat: 0,
    loopEndBeat: 16,

    // Pontuação & Combo Preciso
    score: 0,
    combo: 0,
    maxCombo: 0,
    triggeredEventIndices: new Set(),
    missedEventIndices: new Set(),
    visualPulsedEventIndices: new Set(),
    satisfiedDegreesForWait: new Set(),
    activeTineHighlights: new Map(),
    particles: [],

    // Cifra View
    cifraFormat: "cifra",
    autoScrollOn: false,
    autoScrollSpeed: 1,

    // Modo Livre + Gravador
    isRecordingFree: false,
    recordStartTime: 0,
    recordedEvents: [],

    // Editor
    editorChordMode: false,
    editorPendingChord: new Set(),
    editorSelectedDuration: 1
  };

  let lastFrameTime = performance.now();
  let activeTouchKeys = new Map();
  let isMouseDownOnTines = false;
  let lastMouseDegree = null;

  async function init() {
    loadPreferences();
    applyTheme(state.theme);
    applyKalimbaWidth(state.kalimbaWidthPct);
    applyKalimbaHeight(state.kalimbaHeightPct);
    await loadSongsFromDatabase();
    rebuildKalimbaLayout();
    selectSong(state.currentSongId);
    bindUIEvents();
    renderEditorPicker();
    renderAllViews();
    requestAnimationFrame(gameLoop);
  }

  function applyTheme(themeName) {
    const valid = THEME_PALETTES[themeName] ? themeName : "peach";
    state.theme = valid;
    document.documentElement.setAttribute("data-theme", valid);
    document.querySelectorAll(".theme-dot").forEach(dot => {
      dot.classList.toggle("active", dot.dataset.themeChoice === valid);
    });
  }

  function applyKalimbaWidth(pct) {
    const clamped = Math.max(65, Math.min(100, Number(pct) || 100));
    state.kalimbaWidthPct = clamped;
    const appEl = document.getElementById("app");
    if (appEl) {
      appEl.style.setProperty("--kalimba-width", `${clamped}%`);
    }
    const lbl = document.getElementById("widthPctLabel");
    if (lbl) lbl.textContent = `${clamped}%`;
    const slider = document.getElementById("sliderKalimbaWidth");
    if (slider) slider.value = clamped;
  }

  function applyKalimbaHeight(pct) {
    const clamped = Math.max(25, Math.min(55, Number(pct) || 34));
    state.kalimbaHeightPct = clamped;
    const appEl = document.getElementById("app");
    if (appEl) {
      appEl.style.setProperty("--kalimba-height", `${clamped}%`);
    }
    const lbl = document.getElementById("heightPctLabel");
    if (lbl) lbl.textContent = `${clamped}%`;
    const slider = document.getElementById("sliderKalimbaHeight");
    if (slider) slider.value = clamped;
  }

  function loadPreferences() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY_PREFS) || "{}");
      if (saved.theme && THEME_PALETTES[saved.theme]) state.theme = saved.theme;
      if (saved.kalimbaSize && window.KalimbaData.SIZES[saved.kalimbaSize]) state.kalimbaSize = saved.kalimbaSize;
      if (saved.tuningId && window.KalimbaData.TUNINGS[saved.tuningId]) state.tuningId = saved.tuningId;
      if (saved.labelMode) state.labelMode = saved.labelMode;
      if (saved.kalimbaWidthPct) state.kalimbaWidthPct = saved.kalimbaWidthPct;
      if (saved.kalimbaHeightPct && saved.kalimbaHeightPct !== 42) state.kalimbaHeightPct = saved.kalimbaHeightPct;
      if (saved.currentSongId) state.currentSongId = saved.currentSongId;
    } catch (e) {}

    document.getElementById("selectSize").value = state.kalimbaSize;
    document.getElementById("selectTuning").value = state.tuningId;
    document.getElementById("selectLabelMode").value = state.labelMode;
  }

  function savePreferences() {
    try {
      localStorage.setItem(STORAGE_KEY_PREFS, JSON.stringify({
        theme: state.theme,
        kalimbaSize: state.kalimbaSize,
        tuningId: state.tuningId,
        labelMode: state.labelMode,
        kalimbaWidthPct: state.kalimbaWidthPct,
        kalimbaHeightPct: state.kalimbaHeightPct,
        currentSongId: state.currentSongId
      }));
    } catch (e) {}
  }

  async function loadSongsFromDatabase() {
    const clientId = window.KalimCloud.getClientId();
    const rawCustom = await window.KalimDB.getAllCustomSongs();
    const cloud = await window.KalimCloud.fetchAll();
    state.cloudOnline = cloud.online;

    const decorate = (s, mine) => ({
      ...s,
      isCustom: true,
      isMine: mine,
      isShared: !mine,
      category: "Minhas Músicas",
      difficulty: s.difficulty || "Médio",
      events: window.KalimbaData.parseTabStringToNotes(s.tabText || "")
    });

    const map = new Map();
    window.KalimbaData.DEFAULT_SONGS.forEach(s => map.set(s.id, s));
    cloud.songs.forEach(s => {
      if (s.id) map.set(s.id, decorate(s, s.createdBy === clientId));
    });
    rawCustom.forEach(s => map.set(s.id, decorate({ ...s, createdBy: s.createdBy || clientId }, true)));

    state.songs = Array.from(map.values());
    if (!state.songs.some(s => s.id === state.currentSongId)) {
      state.currentSongId = state.songs[0] ? state.songs[0].id : "twinkle-star";
    }
    populateSongSelectors();
    renderLibraryView();

    // Envia para a biblioteca compartilhada as músicas locais que ainda não estão lá
    if (cloud.online) {
      const cloudIds = new Set(cloud.songs.map(s => s.id));
      rawCustom.filter(s => !cloudIds.has(s.id)).forEach(s => {
        window.KalimCloud.save({ ...s, createdBy: s.createdBy || clientId });
      });
    }
  }


  function populateSongSelectors() {
    const selects = [
      document.getElementById("heroSongSelect"),
      document.getElementById("cifraSongSelect")
    ];
    selects.forEach(sel => {
      if (!sel) return;
      sel.innerHTML = "";
      state.songs.forEach(song => {
        const opt = document.createElement("option");
        opt.value = song.id;
        opt.textContent = `${song.title} (${song.minKeys}t)`;
        sel.appendChild(opt);
      });
      sel.value = state.currentSongId;
    });
  }

  // RENDERIZAÇÃO DA ABA BIBLIOTECA DE MÚSICAS
  function renderLibraryView() {
    const grid = document.getElementById("librarySongsGrid");
    const statusEl = document.getElementById("libraryDbStatus");
    if (!grid) return;

    const favs = window.KalimDB.getFavorites();
    const stats = window.KalimDB.getStats();
    const customCount = state.songs.filter(s => s.isMine).length;
    const sharedCount = state.songs.filter(s => s.isShared).length;

    if (statusEl) {
      if (window.KalimCloud.enabled()) {
        statusEl.textContent = state.cloudOnline
          ? `${state.songs.length} músicas (${customCount} suas · ${sharedCount} da comunidade · ${favs.size} favoritas) — Biblioteca compartilhada conectada.`
          : `${state.songs.length} músicas — sem conexão com a biblioteca compartilhada no momento.`;
      } else {
        statusEl.textContent = `${state.songs.length} músicas (${customCount} criadas por você · ${favs.size} favoritas) — Salvas no seu dispositivo. Biblioteca compartilhada não configurada.`;
      }
    }

    const q = state.librarySearch.trim().toLowerCase();
    const filtered = state.songs.filter(song => {
      if (state.libraryCategory === "FAV" && !favs.has(song.id)) return false;
      if (state.libraryCategory === "CUSTOM" && !song.isMine) return false;
      if (state.libraryCategory === "SHARED" && !song.isShared) return false;
      if (state.libraryDifficulty !== "ALL" && song.difficulty !== state.libraryDifficulty) return false;
      if (q) {
        const hay = `${song.title} ${song.artist} ${song.difficulty}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });


    grid.innerHTML = "";

    if (filtered.length === 0) {
      const empty = document.createElement("div");
      empty.style.gridColumn = "1 / -1";
      empty.style.textAlign = "center";
      empty.style.padding = "32px";
      empty.style.color = "var(--text-muted)";
      empty.style.fontWeight = "800";
      empty.textContent = "Nenhuma música encontrada nesta categoria.";
      grid.appendChild(empty);
      return;
    }

    filtered.forEach(song => {
      const isFav = favs.has(song.id);
      const st = stats[song.id];
      const card = document.createElement("div");
      card.className = "song-card" + (song.id === state.currentSongId ? " current-song" : "");

      const top = document.createElement("div");
      top.className = "song-card-top";

      const info = document.createElement("div");
      const titleEl = document.createElement("div");
      titleEl.className = "song-card-title";
      titleEl.textContent = song.title;
      const artistEl = document.createElement("div");
      artistEl.className = "song-card-artist";
      artistEl.textContent = song.artist;
      info.appendChild(titleEl);
      info.appendChild(artistEl);

      const favBtn = document.createElement("button");
      favBtn.className = "fav-btn" + (isFav ? " favorited" : "");
      favBtn.title = isFav ? "Remover das favoritas" : "Salvar nas favoritas";
      favBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';
      favBtn.onclick = (e) => {
        e.stopPropagation();
        window.KalimDB.toggleFavorite(song.id);
        renderLibraryView();
      };

      top.appendChild(info);
      top.appendChild(favBtn);
      card.appendChild(top);

      // Badges de metadados
      const badges = document.createElement("div");
      badges.className = "song-card-badges";

      const catBadge = document.createElement("span");
      catBadge.className = "meta-badge accent";
      catBadge.textContent = song.isMine ? "Minha" : (song.isShared ? "Comunidade" : "Oficial");
      badges.appendChild(catBadge);

      const diffBadge = document.createElement("span");
      diffBadge.className = "meta-badge diff-" + (song.difficulty || "Médio").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      diffBadge.textContent = song.difficulty || "Médio";

      badges.appendChild(diffBadge);

      const notesBadge = document.createElement("span");
      notesBadge.className = "meta-badge";
      notesBadge.textContent = `${song.events ? song.events.length : 0} notas · ${song.bpm} BPM`;
      badges.appendChild(notesBadge);

      if (st && st.highScore > 0) {
        const scoreBadge = document.createElement("span");
        scoreBadge.className = "meta-badge accent";
        scoreBadge.textContent = `Recorde: ${st.highScore} pts`;
        badges.appendChild(scoreBadge);
      }

      card.appendChild(badges);

      if (song.description) {
        const desc = document.createElement("div");
        desc.className = "song-card-desc";
        desc.textContent = song.description;
        card.appendChild(desc);
      }

      const actions = document.createElement("div");
      actions.className = "song-card-actions";

      const btnPlayTiles = document.createElement("button");
      btnPlayTiles.className = "clean-btn primary";
      btnPlayTiles.style.flex = "1";
      btnPlayTiles.textContent = "Tocar em Tiles";
      btnPlayTiles.onclick = () => {
        stopLibraryPreview();
        selectSong(song.id);
        switchTab("hero");
        resetPlayback();
        togglePlayPause();
      };

      const isPrev = state.previewingSongId === song.id;
      const btnPreview = document.createElement("button");
      btnPreview.className = "clean-btn" + (isPrev ? " active" : "");
      btnPreview.textContent = isPrev ? "Parar" : "Ouvir";
      btnPreview.onclick = () => {
        togglePreviewSong(song);
      };

      const btnViewCifra = document.createElement("button");
      btnViewCifra.className = "clean-btn";
      btnViewCifra.textContent = "Cifra";
      btnViewCifra.onclick = () => {
        stopLibraryPreview();
        selectSong(song.id);
        switchTab("cifra");
      };

      const btnEdit = document.createElement("button");
      btnEdit.className = "clean-btn";
      btnEdit.textContent = "Editar";
      btnEdit.onclick = () => {
        stopLibraryPreview();
        selectSong(song.id);
        loadSongIntoEditorForm(song);
        switchTab("editor");
      };

      actions.appendChild(btnPlayTiles);
      actions.appendChild(btnPreview);
      actions.appendChild(btnViewCifra);
      actions.appendChild(btnEdit);

      if (song.isMine) {
        const btnDel = document.createElement("button");
        btnDel.className = "clean-btn danger";
        btnDel.textContent = "Excluir";
        btnDel.onclick = async () => {
          stopLibraryPreview();
          await window.KalimDB.deleteCustomSong(song.id);
          await window.KalimCloud.remove(song.id);
          await loadSongsFromDatabase();

          if (state.currentSongId === song.id) {
            selectSong(state.songs[0]?.id);
          }
        };
        actions.appendChild(btnDel);
      }

      card.appendChild(actions);
      grid.appendChild(card);
    });
  }

  function stopLibraryPreview() {
    state.previewTimers.forEach(t => clearTimeout(t));
    state.previewTimers = [];
    state.previewingSongId = null;
  }

  function togglePreviewSong(song) {
    if (state.previewingSongId === song.id) {
      stopLibraryPreview();
      renderLibraryView();
      return;
    }
    stopLibraryPreview();
    window.KalimbaAudio.initContext();
    state.previewingSongId = song.id;
    renderLibraryView();

    const bpm = (song.bpm || 140) * (state.speed || 1.0);
    const msPerBeat = (60 / bpm) * 1000;
    const previewEvents = (song.events || []).slice(0, 24);

    previewEvents.forEach((ev) => {
      const timer = setTimeout(() => {
        const freqs = ev.degrees.map(d => state.degreeToKeyMap[d]?.freq).filter(Boolean);
        window.KalimbaAudio.playChord(freqs, 0.9, 14);
      }, ev.beat * msPerBeat);
      state.previewTimers.push(timer);
    });

    const lastBeat = previewEvents.length ? previewEvents[previewEvents.length - 1].beat + 2 : 1;
    const endTimer = setTimeout(() => {
      state.previewingSongId = null;
      renderLibraryView();
    }, lastBeat * msPerBeat);
    state.previewTimers.push(endTimer);
  }

  function rebuildKalimbaLayout() {
    state.layout = window.KalimbaData.buildKalimbaLayout(state.kalimbaSize, state.tuningId);
    state.degreeToKeyMap = {};
    state.layout.forEach(k => {
      state.degreeToKeyMap[k.id] = k;
    });

    renderTinesIntoContainer("heroTinesRow", "hero");
    renderTinesIntoContainer("freeTinesRow", "free");
    renderTinesIntoContainer("cifraMiniTinesRow", "cifra");
    renderEditorPicker();
  }

  function formatKeyLabel(keyObj) {
    if (state.labelMode === "number") {
      return { main: keyObj.degreeLabel, sub: "" };
    }
    if (state.labelMode === "letter") {
      return { main: keyObj.letterLabel, sub: "" };
    }
    return { main: keyObj.degreeLabel, sub: keyObj.letterLabel };
  }

  function renderTinesIntoContainer(containerId, contextMode) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const count = state.layout.length;
    container.style.gridTemplateColumns = `repeat(${count}, 1fr)`;
    container.innerHTML = "";

    state.layout.forEach(keyObj => {
      const slot = document.createElement("div");
      slot.className = "tine-slot" +
        (keyObj.isMarked ? " marked-slot" : "") +
        (keyObj.isCenter ? " center-slot" : "");
      slot.dataset.degreeId = keyObj.id;
      slot.dataset.context = contextMode;

      const metal = document.createElement("div");
      metal.className = "tine-metal";
      metal.style.height = `${keyObj.lengthPercent}%`;

      const dot = document.createElement("div");
      dot.className = `tine-octave-dot oct-dot-${keyObj.octaveOffset}`;
      metal.appendChild(dot);

      const labels = formatKeyLabel(keyObj);

      const degSpan = document.createElement("span");
      degSpan.className = "tine-degree";
      degSpan.textContent = labels.main;
      metal.appendChild(degSpan);

      if (labels.sub) {
        const noteSpan = document.createElement("span");
        noteSpan.className = "tine-note";
        noteSpan.textContent = labels.sub;
        metal.appendChild(noteSpan);
      }

      slot.appendChild(metal);
      container.appendChild(slot);
    });

    attachTineTouchHandlers(container);
  }

  function attachTineTouchHandlers(container) {
    container.onmousedown = (e) => {
      const slot = e.target.closest(".tine-slot");
      if (!slot) return;
      isMouseDownOnTines = true;
      const degId = slot.dataset.degreeId;
      lastMouseDegree = degId;
      handleUserPluckTine(degId);
    };

    container.onmousemove = (e) => {
      if (!isMouseDownOnTines) return;
      const slot = e.target.closest(".tine-slot");
      if (!slot) return;
      const degId = slot.dataset.degreeId;
      if (degId && degId !== lastMouseDegree) {
        lastMouseDegree = degId;
        handleUserPluckTine(degId);
      }
    };

    window.addEventListener("mouseup", () => {
      isMouseDownOnTines = false;
      lastMouseDegree = null;
    });

    container.ontouchstart = (e) => {
      e.preventDefault();
      window.KalimbaAudio.initContext();
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        const el = document.elementFromPoint(t.clientX, t.clientY);
        const slot = el ? el.closest(".tine-slot") : null;
        if (slot && slot.dataset.degreeId) {
          activeTouchKeys.set(t.identifier, slot.dataset.degreeId);
          handleUserPluckTine(slot.dataset.degreeId);
        }
      }
    };

    container.ontouchmove = (e) => {
      e.preventDefault();
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        const el = document.elementFromPoint(t.clientX, t.clientY);
        const slot = el ? el.closest(".tine-slot") : null;
        if (slot && slot.dataset.degreeId) {
          const prevDeg = activeTouchKeys.get(t.identifier);
          if (prevDeg !== slot.dataset.degreeId) {
            activeTouchKeys.set(t.identifier, slot.dataset.degreeId);
            handleUserPluckTine(slot.dataset.degreeId);
          }
        }
      }
    };

    container.ontouchend = (e) => {
      window.KalimbaAudio.initContext();
      for (let i = 0; i < e.changedTouches.length; i++) {
        activeTouchKeys.delete(e.changedTouches[i].identifier);
      }
    };
  }

  function animateKawaiiMascot() {
    document.querySelectorAll(".soundhole").forEach(h => {
      h.classList.add("bounce");
      clearTimeout(h._bounceTimer);
      h._bounceTimer = setTimeout(() => h.classList.remove("bounce"), 150);
    });
  }

  function handleUserPluckTine(degreeId) {
    const keyObj = state.degreeToKeyMap[degreeId];
    if (!keyObj) return;

    window.KalimbaAudio.playNote(keyObj.freq, 0.95);
    triggerTineVisualPulse(degreeId, 220);
    animateKawaiiMascot();

    if (state.activeTab === "free" && state.isRecordingFree) {
      const now = performance.now();
      if (state.recordedEvents.length === 0) {
        state.recordStartTime = now;
      }
      const elapsedSec = (now - state.recordStartTime) / 1000;
      const beat = Math.max(0, Number((elapsedSec * (100 / 60)).toFixed(2)));

      const lastEv = state.recordedEvents[state.recordedEvents.length - 1];
      if (lastEv && Math.abs(beat - lastEv.beat) < 0.16 && !lastEv.degrees.includes(degreeId)) {
        lastEv.degrees.push(degreeId);
      } else {
        state.recordedEvents.push({
          beat,
          duration: 1,
          degrees: [degreeId],
          lyric: ""
        });
      }
      updateFreeRecordBanner();
    }

    if (state.activeTab === "hero" && state.isPlaying) {
      evaluateHeroUserHit(degreeId);
    }
  }

  function triggerTineVisualPulse(degreeId, durationMs = 220) {
    state.activeTineHighlights.set(degreeId, performance.now() + durationMs);
    const slots = document.querySelectorAll(`.tine-slot[data-degree-id="${CSS.escape(degreeId)}"]`);
    slots.forEach(s => s.classList.add("active"));
    setTimeout(() => {
      if ((state.activeTineHighlights.get(degreeId) || 0) <= performance.now()) {
        slots.forEach(s => s.classList.remove("active"));
      }
    }, durationMs);
  }

  function triggerWrongTineFlash(degreeId) {
    const slots = document.querySelectorAll(`#heroTinesRow .tine-slot[data-degree-id="${CSS.escape(degreeId)}"]`);
    slots.forEach(s => s.classList.add("wrong-hit"));
    setTimeout(() => {
      slots.forEach(s => s.classList.remove("wrong-hit"));
    }, 260);
  }

  function breakCombo(reasonText) {
    state.combo = 0;
    state.wrongHitsCount = (state.wrongHitsCount || 0) + 1;
    const comboEl = document.getElementById("hudCombo");
    if (comboEl) {
      comboEl.classList.add("broken");
      clearTimeout(comboEl._brokenTimer);
      comboEl._brokenTimer = setTimeout(() => comboEl.classList.remove("broken"), 450);
    }
    showHitFeedback(reasonText || "Combo zerado", "var(--error)");
    updateHeroHUD();
  }

  function spawnHitParticles(visualIndex, color) {
    const canvas = document.getElementById("heroCanvas");
    if (!canvas) return;
    const laneWidth = canvas.width / Math.max(1, state.layout.length);
    const x = (visualIndex + 0.5) * laneWidth;
    const y = canvas.height - 16;

    for (let i = 0; i < 7; i++) {
      const angle = -Math.PI * 0.15 - Math.random() * Math.PI * 0.7;
      const speed = 1.2 + Math.random() * 3.2;
      state.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        r: 2.5 + Math.random() * 2.5,
        life: 1.0,
        color: color || "#e87a5d"
      });
    }
  }

  function evaluateHeroUserHit(degreeId) {
    if (!state.currentSong) return;
    // Durante os 3 segundos iniciais de preparação, tocar uma lâmina não quebra o combo
    if (state.currentBeat < -0.45) return;

    const keyObj = state.degreeToKeyMap[degreeId];
    const pal = THEME_PALETTES[state.theme] || THEME_PALETTES.peach;
    const events = state.currentSong.events;

    if (state.playStyle === "wait") {
      const nextIdx = findNextPendingEventIndex();
      if (nextIdx === -1) return;
      const targetEv = events[nextIdx];

      if (targetEv.degrees.includes(degreeId) && (targetEv.beat - state.currentBeat) <= 1.0) {
        state.satisfiedDegreesForWait.add(`${nextIdx}:${degreeId}`);
        if (keyObj) spawnHitParticles(keyObj.visualIndex, getOctaveColor(keyObj.octaveOffset));

        const allHit = targetEv.degrees.every(d =>
          !state.degreeToKeyMap[d] || state.satisfiedDegreesForWait.has(`${nextIdx}:${d}`)
        );

        if (allHit && !state.triggeredEventIndices.has(nextIdx)) {
          state.triggeredEventIndices.add(nextIdx);
          state.score += 100;
          state.combo += 1;
          if (state.combo > (state.runMaxCombo || 0)) state.runMaxCombo = state.combo;
          if (state.combo > state.maxCombo) state.maxCombo = state.combo;
          showHitFeedback("Perfeito", pal.hitLine);
          updateHeroHUD();
        }
      } else {
        triggerWrongTineFlash(degreeId);
        breakCombo("Tecla incorreta");
      }
      return;
    }

    const toleranceBeats = 0.65;
    let matchedAny = false;

    for (let i = 0; i < events.length; i++) {
      if (state.triggeredEventIndices.has(i)) continue;
      const ev = events[i];
      const diff = Math.abs(ev.beat - state.currentBeat);
      if (diff <= toleranceBeats && ev.degrees.includes(degreeId)) {
        matchedAny = true;
        state.satisfiedDegreesForWait.add(`${i}:${degreeId}`);
        if (keyObj) spawnHitParticles(keyObj.visualIndex, getOctaveColor(keyObj.octaveOffset));

        const allHit = ev.degrees.every(d =>
          !state.degreeToKeyMap[d] || state.satisfiedDegreesForWait.has(`${i}:${d}`)
        );

        if (allHit) {
          state.triggeredEventIndices.add(i);
          const isPerfect = diff < 0.25;
          state.score += isPerfect ? 100 : 60;
          state.combo += 1;
          if (state.combo > (state.runMaxCombo || 0)) state.runMaxCombo = state.combo;
          if (state.combo > state.maxCombo) state.maxCombo = state.combo;
          showHitFeedback(isPerfect ? "Perfeito" : "Bom", pal.hitLine);
          updateHeroHUD();
        }
        break;
      }
    }

    if (!matchedAny) {
      triggerWrongTineFlash(degreeId);
      breakCombo("Errou a tecla");
    }
  }

  function showHitFeedback(text, color) {
    const el = document.getElementById("hitFeedback");
    if (!el) return;
    el.textContent = text;
    el.style.color = color || "var(--primary)";
    el.classList.add("show");
    clearTimeout(el._hideTimer);
    el._hideTimer = setTimeout(() => el.classList.remove("show"), 520);
  }

  function selectSong(songId) {
    const found = state.songs.find(s => s.id === songId) || state.songs[0];
    if (!found) return;
    state.currentSongId = found.id;
    state.currentSong = found;
    savePreferences();

    const totalBeats = getSongTotalBeats(found);
    state.loopStartBeat = 0;
    state.loopEndBeat = Math.max(4, Math.ceil(totalBeats));

    resetPlayback();
    populateSongSelectors();
    renderCifraView();
    renderLibraryView();
  }

  function getSongTotalBeats(song) {
    if (!song || !song.events || !song.events.length) return 8;
    const last = song.events[song.events.length - 1];
    return last.beat + (last.duration || 1);
  }

  // Calcula exatamente 3 segundos de preparação (lead-in) antes da primeira nota chegar na linha
  function getPrepLeadInBeats() {
    const bpm = ((state.currentSong && state.currentSong.bpm) || 100) * state.speed;
    const beatsPerSec = bpm / 60;
    return Math.max(2.5, beatsPerSec * 3.0);
  }

  function closeSongResultOverlay() {
    const overlay = document.getElementById("songResultOverlay");
    if (overlay) overlay.classList.remove("open");
  }

  function completeSongAndShowResults() {
    state.isPlaying = false;
    clearTargetCueTines();
    updatePlayPauseButton();

    const song = state.currentSong;
    if (!song) return;

    const allStats = window.KalimDB.getStats();
    const prevRecord = (allStats[song.id] && allStats[song.id].highScore) || 0;
    const isNewRecord = state.score > prevRecord && state.score > 0;

    if (state.score > 0) {
      window.KalimDB.recordSongScore(song.id, state.score, state.runMaxCombo || state.combo);
      renderLibraryView();
    }

    const updatedStats = window.KalimDB.getStats();
    const bestScore = Math.max(state.score, (updatedStats[song.id] && updatedStats[song.id].highScore) || 0);

    const totalEvents = (song.events && song.events.length) || 1;
    const hitEvents = state.triggeredEventIndices.size;
    const wrongCount = state.wrongHitsCount || 0;
    const accuracy = Math.min(100, Math.max(0, Math.round((hitEvents / Math.max(totalEvents, hitEvents + wrongCount)) * 100)));

    const titleEl = document.getElementById("resultSongTitle");
    const badgeEl = document.getElementById("resultNewRecordBadge");
    const accEl = document.getElementById("resultAccuracy");
    const scoreEl = document.getElementById("resultScore");
    const comboEl = document.getElementById("resultMaxCombo");
    const bestEl = document.getElementById("resultBestScore");
    const sumEl = document.getElementById("resultNotesSummary");

    if (titleEl) titleEl.textContent = song.title;
    if (badgeEl) badgeEl.style.display = isNewRecord ? "inline-flex" : "none";
    if (accEl) accEl.textContent = `${accuracy}%`;
    if (scoreEl) scoreEl.textContent = `${state.score} pts`;
    if (comboEl) comboEl.textContent = `${state.runMaxCombo || 0}x`;
    if (bestEl) bestEl.textContent = `${bestScore} pts`;
    if (sumEl) {
      sumEl.textContent = `${hitEvents} de ${totalEvents} notas acertadas · ${wrongCount} ${wrongCount === 1 ? "erro" : "erros"}`;
    }

    const overlay = document.getElementById("songResultOverlay");
    if (overlay) overlay.classList.add("open");
  }

  function resetPlayback() {
    state.isPlaying = false;
    state.currentBeat = -getPrepLeadInBeats();
    state.score = 0;
    state.combo = 0;
    state.runMaxCombo = 0;
    state.wrongHitsCount = 0;
    state.triggeredEventIndices.clear();
    state.missedEventIndices.clear();
    state.visualPulsedEventIndices.clear();
    state.satisfiedDegreesForWait.clear();
    clearTargetCueTines();
    closeSongResultOverlay();
    updatePlayPauseButton();
    updateHeroHUD();
  }

  function togglePlayPause() {
    window.KalimbaAudio.initContext();
    closeSongResultOverlay();
    const total = getSongTotalBeats(state.currentSong);
    if (state.currentBeat >= total) {
      resetPlayback();
    }
    if (!state.isPlaying && state.currentBeat <= 0.05) {
      state.currentBeat = -getPrepLeadInBeats();
    }
    state.isPlaying = !state.isPlaying;
    lastFrameTime = performance.now();
    updatePlayPauseButton();
  }

  function updatePlayPauseButton() {
    const txt = document.getElementById("txtPlayPause");
    const icon = document.getElementById("iconPlayPause");
    if (txt) txt.textContent = state.isPlaying ? "Pausar" : "Iniciar";
    if (icon) {
      icon.innerHTML = state.isPlaying
        ? '<rect x="6" y="4" width="4" height="16" fill="currentColor"/><rect x="14" y="4" width="4" height="16" fill="currentColor"/>'
        : '<polygon points="5 3 19 12 5 21 5 3" fill="currentColor"/>';
    }
    const appEl = document.getElementById("app");
    if (appEl) {
      appEl.classList.toggle("is-playing-tiles", state.isPlaying && state.activeTab === "hero");
    }
  }

  function updateHeroHUD() {
    const scoreEl = document.getElementById("hudScore");
    const comboEl = document.getElementById("hudCombo");
    const slider = document.getElementById("progressSlider");
    const topFill = document.getElementById("topProgressFill");

    if (scoreEl) scoreEl.textContent = `${state.score} pts`;
    if (comboEl) comboEl.textContent = `Combo ${state.combo}x`;

    const total = getSongTotalBeats(state.currentSong);
    const clampedBeat = Math.max(0, Math.min(total, state.currentBeat));
    if (slider) {
      slider.max = total;
      slider.value = clampedBeat;
    }
    if (topFill) {
      const pct = total > 0 ? Math.min(100, (clampedBeat / total) * 100) : 0;
      topFill.style.width = `${pct.toFixed(1)}%`;
    }
  }

  // LOOP PRINCIPAL (60 FPS)
  function gameLoop(now) {
    const dtSec = Math.min(0.1, (now - lastFrameTime) / 1000);
    lastFrameTime = now;

    if (state.isPlaying && state.currentSong) {
      const bpm = (state.currentSong.bpm || 100) * state.speed;
      const beatsPerSec = bpm / 60;
      let nextBeat = state.currentBeat + dtSec * beatsPerSec;

      if (state.playStyle === "wait") {
        const blockingIdx = findBlockingWaitEventIndex(nextBeat);
        if (blockingIdx !== -1) {
          const ev = state.currentSong.events[blockingIdx];
          nextBeat = ev.beat;
          const remainingDegrees = ev.degrees.filter(
            d => state.degreeToKeyMap[d] && !state.satisfiedDegreesForWait.has(`${blockingIdx}:${d}`)
          );
          highlightTargetCueTines(remainingDegrees);
        } else {
          clearTargetCueTines();
        }
      } else {
        clearTargetCueTines();
        const events = state.currentSong.events;

        for (let i = 0; i < events.length; i++) {
          const ev = events[i];
          if (!state.visualPulsedEventIndices.has(i) && nextBeat >= ev.beat) {
            state.visualPulsedEventIndices.add(i);
            const guideFreqs = [];
            ev.degrees.forEach(degId => {
              triggerTineVisualPulse(degId, Math.max(180, (ev.duration / beatsPerSec) * 550));
              if (state.guideAudioInFlow && state.degreeToKeyMap[degId]) {
                guideFreqs.push(state.degreeToKeyMap[degId].freq);
              }
            });
            if (guideFreqs.length > 0) {
              window.KalimbaAudio.playChord(guideFreqs, 0.55, 14);
            }
          }

          if (
            !state.triggeredEventIndices.has(i) &&
            !state.missedEventIndices.has(i) &&
            nextBeat > ev.beat + 0.65
          ) {
            state.missedEventIndices.add(i);
            if (state.combo > 0) {
              breakCombo("Nota perdida");
            } else {
              state.wrongHitsCount = (state.wrongHitsCount || 0) + 1;
            }
          }
        }
      }

      state.currentBeat = nextBeat;

      const totalBeats = getSongTotalBeats(state.currentSong);
      const allWaitNotesDone = state.playStyle === "wait" && findNextPendingEventIndex() === -1;
      if (state.loopEnabled && state.currentBeat >= state.loopEndBeat) {
        seekToBeat(state.loopStartBeat);
      } else if (
        state.currentBeat >= totalBeats + 1.2 ||
        (allWaitNotesDone && state.currentBeat >= totalBeats - 0.2)
      ) {
        completeSongAndShowResults();
      }

      updateHeroHUD();
      updateFloatingLyricBanner();
    }

    if (state.activeTab === "hero") {
      renderHeroCanvas();
    }

    if (state.activeTab === "cifra" && state.autoScrollOn) {
      const cifraBody = document.getElementById("cifraScrollContainer");
      if (cifraBody) {
        cifraBody.scrollTop += 0.45 * state.autoScrollSpeed;
      }
    }

    requestAnimationFrame(gameLoop);
  }

  function findNextPendingEventIndex() {
    if (!state.currentSong) return -1;
    const events = state.currentSong.events;
    for (let i = 0; i < events.length; i++) {
      if (state.triggeredEventIndices.has(i)) continue;
      const validDegrees = events[i].degrees.filter(d => !!state.degreeToKeyMap[d]);
      if (validDegrees.length === 0) {
        state.triggeredEventIndices.add(i);
        continue;
      }
      return i;
    }
    return -1;
  }

  function findBlockingWaitEventIndex(targetBeat) {
    const idx = findNextPendingEventIndex();
    if (idx === -1) return -1;
    const ev = state.currentSong.events[idx];
    if (targetBeat >= ev.beat) return idx;
    return -1;
  }

  function highlightTargetCueTines(degrees) {
    clearTargetCueTines();
    degrees.forEach(d => {
      const slots = document.querySelectorAll(`#heroTinesRow .tine-slot[data-degree-id="${CSS.escape(d)}"]`);
      slots.forEach(s => s.classList.add("cue-now"));
    });
  }

  function clearTargetCueTines() {
    document.querySelectorAll("#heroTinesRow .tine-slot.cue-now").forEach(s => s.classList.remove("cue-now"));
  }

  function seekToBeat(beat) {
    state.currentBeat = beat;
    state.triggeredEventIndices.clear();
    state.missedEventIndices.clear();
    state.visualPulsedEventIndices.clear();
    state.satisfiedDegreesForWait.clear();
    if (state.currentSong) {
      state.currentSong.events.forEach((ev, idx) => {
        if (ev.beat < beat - 0.1) {
          state.triggeredEventIndices.add(idx);
          state.missedEventIndices.add(idx);
          state.visualPulsedEventIndices.add(idx);
        }
      });
    }
    updateHeroHUD();
    updateFloatingLyricBanner();
  }

  function updateFloatingLyricBanner() {
    const banner = document.getElementById("floatingLyricBanner");
    if (!banner || !state.currentSong) return;

    const upcoming = state.currentSong.events.find(
      (ev, idx) => !state.triggeredEventIndices.has(idx) && ev.beat + ev.duration >= state.currentBeat
    );
    if (!upcoming) {
      banner.textContent = state.currentSong.title;
      return;
    }

    const noteNames = upcoming.degrees.map(d => {
      const k = state.degreeToKeyMap[d];
      if (!k) return d;
      const handTxt = k.hand === "C" ? "Centro" : (k.hand === "L" ? "Esq" : "Dir");
      return `${k.degreeLabel} (${k.letterLabel} · ${handTxt})`;
    }).join(" + ");

    const lyricTxt = upcoming.lyric ? ` — ${upcoming.lyric}` : "";
    banner.textContent = `Nota: ${noteNames}${lyricTxt}`;
  }

  // RENDERIZAÇÃO DA PISTA PIANO TILES MINIMALISTA (CANVAS)
  function renderHeroCanvas() {
    const canvas = document.getElementById("heroCanvas");
    if (!canvas) return;

    const rect = canvas.parentElement.getBoundingClientRect();
    if (canvas.width !== Math.floor(rect.width) || canvas.height !== Math.floor(rect.height)) {
      canvas.width = Math.floor(rect.width);
      canvas.height = Math.floor(rect.height);
    }

    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const numKeys = state.layout.length;
    if (numKeys === 0) return;

    const pal = THEME_PALETTES[state.theme] || THEME_PALETTES.peach;
    const laneW = W / numKeys;
    const hitLineY = H - 10;
    const visibleBeatsAhead = Math.max(6.8, getPrepLeadInBeats() + 1.2);
    const pixelsPerBeat = hitLineY / visibleBeatsAhead;

    state.layout.forEach((keyObj, idx) => {
      const x = idx * laneW;

      if (keyObj.isCenter) {
        ctx.fillStyle = pal.laneCenter;
        ctx.fillRect(x, 0, laneW, H);
      } else if (keyObj.isMarked) {
        ctx.fillStyle = pal.laneMarked;
        ctx.fillRect(x, 0, laneW, H);
      }

      ctx.strokeStyle = pal.laneLine;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    });

    const firstBeat = Math.floor(state.currentBeat);
    const lastBeat = Math.ceil(state.currentBeat + visibleBeatsAhead);

    for (let b = firstBeat; b <= lastBeat; b++) {
      if (b < 0) continue;
      const y = hitLineY - (b - state.currentBeat) * pixelsPerBeat;
      if (y < 0 || y > hitLineY) continue;

      if (b % 4 === 0) {
        ctx.strokeStyle = pal.barLine;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }
    }

    ctx.strokeStyle = pal.hitLine;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, hitLineY);
    ctx.lineTo(W, hitLineY);
    ctx.stroke();

    if (state.currentSong && state.currentSong.events) {
      state.currentSong.events.forEach((ev, idx) => {
        const beatDiff = ev.beat - state.currentBeat;
        if (beatDiff < -1.2 || beatDiff > visibleBeatsAhead + 0.5) return;

        const isDone = state.triggeredEventIndices.has(idx);
        ctx.globalAlpha = isDone ? 0.25 : 1.0;

        const noteBottomY = hitLineY - beatDiff * pixelsPerBeat;
        const tileHeight = Math.max(28, Math.min(ev.duration * pixelsPerBeat * 0.72, 110));
        const tileTopY = noteBottomY - tileHeight;

        const validKeys = ev.degrees.map(d => state.degreeToKeyMap[d]).filter(Boolean);

        if (validKeys.length > 1) {
          const minIdx = Math.min(...validKeys.map(k => k.visualIndex));
          const maxIdx = Math.max(...validKeys.map(k => k.visualIndex));
          const startX = (minIdx + 0.5) * laneW;
          const endX = (maxIdx + 0.5) * laneW;

          ctx.strokeStyle = pal.hitLine;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(startX, noteBottomY - 14);
          ctx.lineTo(endX, noteBottomY - 14);
          ctx.stroke();
        }

        validKeys.forEach(keyObj => {
          const xCenter = (keyObj.visualIndex + 0.5) * laneW;
          const boxW = Math.min(38, laneW * 0.86);
          const boxX = xCenter - boxW / 2;
          const color = getOctaveColor(keyObj.octaveOffset);

          ctx.fillStyle = color;
          roundRect(ctx, boxX, tileTopY, boxW, tileHeight, 9);
          ctx.fill();

          const lbl = state.labelMode === "letter" ? keyObj.letterLabel : keyObj.degreeLabel;
          ctx.fillStyle = "#ffffff";
          ctx.font = `900 ${boxW < 22 ? 10 : 12}px 'Nunito', sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(lbl, xCenter, noteBottomY - 14);
        });

        ctx.globalAlpha = 1.0;
      });
    }

    // Contagem regressiva visual durante os 3 segundos de preparação antes da música começar
    if (state.isPlaying && state.currentBeat < -0.05) {
      const bpm = ((state.currentSong && state.currentSong.bpm) || 100) * state.speed;
      const beatsPerSec = bpm / 60;
      const secsRemaining = Math.max(1, Math.ceil(Math.abs(state.currentBeat) / beatsPerSec));

      ctx.save();
      const pillW = 170;
      const pillH = 38;
      const pillX = (W - pillW) / 2;
      const pillY = Math.max(40, H * 0.5 - pillH / 2);

      ctx.fillStyle = pal.hitLine;
      ctx.globalAlpha = 0.92;
      roundRect(ctx, pillX, pillY, pillW, pillH, 19);
      ctx.fill();

      ctx.globalAlpha = 1.0;
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 15px 'Nunito', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`Prepare-se: ${secsRemaining}s`, W / 2, pillY + pillH / 2);
      ctx.restore();
    }

    for (let i = state.particles.length - 1; i >= 0; i--) {
      const p = state.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.12;
      p.life -= 0.045;
      if (p.life <= 0) {
        state.particles.splice(i, 1);
        continue;
      }
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r || 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;
  }

  function getOctaveColor(oct) {
    const pal = THEME_PALETTES[state.theme] || THEME_PALETTES.peach;
    if (oct <= -1) return pal.octLow;
    if (oct === 0) return pal.octMid;
    if (oct === 1) return pal.octHigh;
    return pal.octUltra;
  }

  function roundRect(ctx, x, y, w, h, r) {
    const radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
  }

  // RENDERIZAÇÃO DO MODO CIFRA & KTAB
  function renderCifraView() {
    const song = state.currentSong;
    if (!song) return;

    document.getElementById("cifraSongTitle").textContent = song.title;
    document.getElementById("cifraSongMeta").textContent =
      `${song.artist} · ${song.bpm} BPM · ${song.difficulty} · Referência: ${song.minKeys} teclas`;

    const contentEl = document.getElementById("cifraContentArea");
    if (!contentEl) return;
    contentEl.innerHTML = "";

    if (state.cifraFormat === "cifra") {
      const bars = [];
      song.events.forEach((ev, idx) => {
        const barIdx = Math.floor(ev.beat / 8);
        if (!bars[barIdx]) bars[barIdx] = [];
        bars[barIdx].push({ ...ev, index: idx });
      });

      bars.filter(Boolean).forEach((barEvents) => {
        const lineDiv = document.createElement("div");
        lineDiv.className = "cifra-line";

        barEvents.forEach(ev => {
          const box = document.createElement("div");
          box.className = "cifra-token-box";

          const mainLabels = [];
          const subLabels = [];
          const freqs = [];

          ev.degrees.forEach(degId => {
            const k = state.degreeToKeyMap[degId];
            const degInfo = window.KalimbaData.DEGREE_MAP[degId];
            if (k) {
              mainLabels.push(state.labelMode === "letter" ? k.letterLabel : k.degreeLabel);
              subLabels.push(state.labelMode === "letter" ? k.degreeLabel : k.letterLabel);
              freqs.push(k.freq);
            } else if (degInfo) {
              mainLabels.push(degInfo.label);
            }
          });

          const noteEl = document.createElement("div");
          noteEl.className = "cifra-token-note";
          noteEl.textContent = mainLabels.length > 1 ? `(${mainLabels.join(" ")})` : mainLabels[0] || "?";
          box.appendChild(noteEl);

          if (subLabels.length > 0 && state.labelMode === "both") {
            const subEl = document.createElement("div");
            subEl.className = "cifra-token-sub";
            subEl.textContent = subLabels.join("+");
            box.appendChild(subEl);
          }

          if (ev.lyric) {
            const lyrEl = document.createElement("div");
            lyrEl.className = "cifra-token-lyric";
            lyrEl.textContent = ev.lyric;
            box.appendChild(lyrEl);
          }

          box.onclick = () => {
            document.querySelectorAll(".cifra-token-box.active").forEach(b => b.classList.remove("active"));
            box.classList.add("active");
            window.KalimbaAudio.playChord(freqs, 0.95, 18);
            ev.degrees.forEach(d => triggerTineVisualPulse(d, 650));
          };

          lineDiv.appendChild(box);
        });

        contentEl.appendChild(lineDiv);
      });
    } else {
      const wrapper = document.createElement("div");
      wrapper.className = "ktab-grid-wrapper";
      const numKeys = state.layout.length;

      const headerRow = document.createElement("div");
      headerRow.className = "ktab-row";
      headerRow.style.gridTemplateColumns = `repeat(${numKeys}, minmax(26px, 1fr))`;
      headerRow.style.background = "var(--primary-soft)";
      state.layout.forEach(k => {
        const cell = document.createElement("div");
        cell.className = "ktab-cell";
        cell.textContent = state.labelMode === "letter" ? k.letterLabel : k.degreeLabel;
        headerRow.appendChild(cell);
      });
      wrapper.appendChild(headerRow);

      song.events.forEach((ev) => {
        const row = document.createElement("div");
        row.className = "ktab-row";
        row.style.gridTemplateColumns = `repeat(${numKeys}, minmax(26px, 1fr))`;

        const freqs = [];
        state.layout.forEach(k => {
          const cell = document.createElement("div");
          cell.className = "ktab-cell" + (k.isMarked ? " marked-col" : "");
          if (ev.degrees.includes(k.id)) {
            freqs.push(k.freq);
            const pill = document.createElement("span");
            pill.className = "ktab-pill";
            pill.style.background = getOctaveColor(k.octaveOffset);
            pill.textContent = state.labelMode === "letter" ? k.letterLabel : k.degreeLabel;
            cell.appendChild(pill);
          }
          row.appendChild(cell);
        });

        row.onclick = () => {
          window.KalimbaAudio.playChord(freqs, 0.95, 18);
          ev.degrees.forEach(d => triggerTineVisualPulse(d, 600));
        };

        wrapper.appendChild(row);
      });

      contentEl.appendChild(wrapper);
    }
  }

  // EDITOR / CRIADOR DE MÚSICAS
  function renderEditorPicker() {
    const picker = document.getElementById("editorQuickPicker");
    if (!picker) return;
    picker.style.gridTemplateColumns = `repeat(${state.layout.length}, minmax(28px, 1fr))`;
    picker.innerHTML = "";

    state.layout.forEach(k => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "picker-tine-btn" +
        (k.isMarked ? " marked" : "") +
        (state.editorPendingChord.has(k.id) ? " selected" : "");

      btn.innerHTML = `<span>${k.degreeLabel}</span><small style="font-size:8px;opacity:0.75">${k.letterLabel}</small>`;
      btn.onclick = () => {
        window.KalimbaAudio.playNote(k.freq, 0.9);
        if (state.editorChordMode) {
          if (state.editorPendingChord.has(k.id)) {
            state.editorPendingChord.delete(k.id);
          } else {
            state.editorPendingChord.add(k.id);
          }
          renderEditorPicker();
        } else {
          appendTokenToEditorTextarea(k.degreeLabel);
        }
      };
      picker.appendChild(btn);
    });
  }

  function appendTokenToEditorTextarea(baseToken) {
    const ta = document.getElementById("editorTabTextarea");
    if (!ta) return;

    let token = baseToken;
    const lyricInput = document.getElementById("editorNoteLyric");
    const lyricVal = lyricInput ? lyricInput.value.trim().replace(/\s+/g, "_") : "";
    if (lyricVal) {
      token += `:${lyricVal}`;
      lyricInput.value = "";
    }

    if (state.editorSelectedDuration === 0.5) token += "/2";
    else if (state.editorSelectedDuration === 2) token += "*2";
    else if (state.editorSelectedDuration === 4) token += "*4";

    const cur = ta.value.trim();
    ta.value = cur ? `${cur} ${token}` : token;
    updateEditorLivePreview();
  }

  function updateEditorLivePreview() {
    const ta = document.getElementById("editorTabTextarea");
    const countBadge = document.getElementById("editorNoteCountBadge");
    if (!ta || !countBadge) return;
    const parsed = window.KalimbaData.parseTabStringToNotes(ta.value);
    countBadge.textContent = `${parsed.length} notas`;
  }

  function updateFreeRecordBanner() {
    const statusEl = document.getElementById("freeRecordStatus");
    if (!statusEl) return;
    if (state.isRecordingFree) {
      statusEl.textContent = `Gravando (${state.recordedEvents.length} notas tocadas)`;
    } else if (state.recordedEvents.length > 0) {
      statusEl.textContent = `${state.recordedEvents.length} notas gravadas — clique em "Usar no Criador"`;
    } else {
      statusEl.textContent = "Deslize os polegares pelas lâminas para tocar livremente";
    }
  }

  function loadSongIntoEditorForm(song) {
    if (!song) return;
    document.getElementById("editorTitle").value = song.title;
    document.getElementById("editorArtist").value = song.artist || "";
    document.getElementById("editorBpm").value = song.bpm || 100;
    document.getElementById("editorMinKeys").value = song.minKeys || 17;
    document.getElementById("editorDifficulty").value = ["Fácil", "Médio", "Difícil"].includes(song.difficulty) ? song.difficulty : "Médio";
    document.getElementById("editorTabTextarea").value = song.tabText || "";
    updateEditorLivePreview();
  }

  function bindUIEvents() {
    const splashEl = document.getElementById("welcomeSplashScreen");
    const mascotEl = document.getElementById("splashBearMascot");
    if (splashEl) {
      let isEnteringApp = false;

      const updateMascotLookAt = (clientX, clientY) => {
        if (!mascotEl || isEnteringApp || splashEl.classList.contains("dismissed")) return;
        const rect = mascotEl.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = clientX - centerX;
        const dy = clientY - centerY;
        const maxDist = Math.max(window.innerWidth, window.innerHeight) * 0.42;
        const normX = Math.max(-1, Math.min(1, dx / maxDist));
        const normY = Math.max(-1, Math.min(1, dy / maxDist));

        const lookX = (normX * 12).toFixed(2) + "px";
        const lookY = (normY * 10).toFixed(2) + "px";
        const tiltDeg = (normX * 7).toFixed(2) + "deg";

        mascotEl.style.setProperty("--look-x", lookX);
        mascotEl.style.setProperty("--look-y", lookY);
        mascotEl.style.setProperty("--tilt-deg", tiltDeg);
      };

      const triggerMascotSmileAndEnter = () => {
        if (isEnteringApp || splashEl.classList.contains("dismissed")) return;
        isEnteringApp = true;

        window.KalimbaAudio.initContext();
        // Toca um acorde de boas-vindas suave na Kalimba real (Dó - Mi - Sol agudos)
        window.KalimbaAudio.playChord([523.25, 659.25, 783.99], 0.85, 85);

        if (mascotEl) {
          mascotEl.style.setProperty("--look-x", "0px");
          mascotEl.style.setProperty("--look-y", "-2px");
          mascotEl.style.setProperty("--tilt-deg", "0deg");
          mascotEl.classList.add("smiling-enter");
        }

        setTimeout(() => {
          splashEl.classList.add("dismissed");
        }, 480);
      };

      // Computador: acompanha o cursor do mouse em tempo real e sorri ao clicar
      splashEl.addEventListener("mousemove", (e) => {
        updateMascotLookAt(e.clientX, e.clientY);
      });

      splashEl.addEventListener("click", () => {
        triggerMascotSmileAndEnter();
      });

      // Celular: se tocar e arrastar o dedo, acompanha o toque; ao soltar (ou clicar rápido), dá o sorrisinho e entra
      splashEl.addEventListener("touchstart", (e) => {
        if (e.touches && e.touches.length > 0) {
          // Desbloqueia o WebAudio do iOS imediatamente no primeiro toque
          window.KalimbaAudio.initContext();
          updateMascotLookAt(e.touches[0].clientX, e.touches[0].clientY);
        }
      }, { passive: true });

      splashEl.addEventListener("touchmove", (e) => {
        if (e.touches && e.touches.length > 0) {
          e.preventDefault();
          updateMascotLookAt(e.touches[0].clientX, e.touches[0].clientY);
        }
      }, { passive: false });

      splashEl.addEventListener("touchend", (e) => {
        e.preventDefault();
        triggerMascotSmileAndEnter();
      });
    }

    const settingsBtn = document.getElementById("btnSettingsToggle");
    const settingsPop = document.getElementById("settingsPopover");
    settingsBtn.onclick = (e) => {
      e.stopPropagation();
      settingsPop.classList.toggle("open");
    };
    document.addEventListener("click", (e) => {
      if (!settingsPop.contains(e.target) && e.target !== settingsBtn) {
        settingsPop.classList.remove("open");
      }
    });

    document.querySelectorAll(".theme-dot").forEach(dot => {
      dot.onclick = () => {
        applyTheme(dot.dataset.themeChoice);
        savePreferences();
        renderCifraView();
      };
    });

    document.getElementById("sliderKalimbaWidth").oninput = (e) => {
      applyKalimbaWidth(e.target.value);
      savePreferences();
    };

    const heightSlider = document.getElementById("sliderKalimbaHeight");
    if (heightSlider) {
      heightSlider.oninput = (e) => {
        applyKalimbaHeight(e.target.value);
        savePreferences();
      };
    }

    document.getElementById("btnFullscreen").onclick = () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen?.();
      } else {
        document.exitFullscreen?.();
      }
    };

    document.getElementById("selectSize").onchange = (e) => {
      state.kalimbaSize = e.target.value;
      savePreferences();
      rebuildKalimbaLayout();
      renderCifraView();
      updateFloatingLyricBanner();
    };

    document.getElementById("selectTuning").onchange = (e) => {
      state.tuningId = e.target.value;
      savePreferences();
      rebuildKalimbaLayout();
      renderCifraView();
    };

    document.getElementById("selectLabelMode").onchange = (e) => {
      state.labelMode = e.target.value;
      savePreferences();
      rebuildKalimbaLayout();
      renderCifraView();
    };

    document.getElementById("btnMute").onclick = (e) => {
      const muted = window.KalimbaAudio.setMuted(!window.KalimbaAudio.getMuted());
      e.currentTarget.classList.toggle("active", !muted);
    };

    document.querySelectorAll(".mode-tab").forEach(btn => {
      btn.onclick = () => {
        switchTab(btn.dataset.tab);
      };
    });

    // Eventos da Biblioteca de Músicas
    document.getElementById("librarySearchInput").oninput = (e) => {
      state.librarySearch = e.target.value;
      renderLibraryView();
    };

    document.querySelectorAll("#libraryCategories .cat-pill").forEach(pill => {
      pill.onclick = () => {
        document.querySelectorAll("#libraryCategories .cat-pill").forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        state.libraryCategory = pill.dataset.cat;
        renderLibraryView();
      };
    });

    document.querySelectorAll("#libraryDifficulties .cat-pill").forEach(pill => {
      pill.onclick = () => {
        document.querySelectorAll("#libraryDifficulties .cat-pill").forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        state.libraryDifficulty = pill.dataset.diff;
        renderLibraryView();
      };
    });

    document.getElementById("btnNewSongFromLib").onclick = () => {
      document.getElementById("editorTitle").value = "";
      document.getElementById("editorArtist").value = "";
      document.getElementById("editorTabTextarea").value = "";
      updateEditorLivePreview();
      switchTab("editor");
    };

    document.getElementById("heroSongSelect").onchange = (e) => selectSong(e.target.value);
    document.getElementById("cifraSongSelect").onchange = (e) => selectSong(e.target.value);

    document.getElementById("btnPlayPause").onclick = togglePlayPause;
    document.getElementById("btnRestart").onclick = () => {
      resetPlayback();
      togglePlayPause();
    };

    const btnResultReplay = document.getElementById("btnResultReplay");
    if (btnResultReplay) {
      btnResultReplay.onclick = () => {
        resetPlayback();
        togglePlayPause();
      };
    }

    const btnResultLibrary = document.getElementById("btnResultLibrary");
    if (btnResultLibrary) {
      btnResultLibrary.onclick = () => {
        closeSongResultOverlay();
        switchTab("library");
      };
    }

    const btnResultClose = document.getElementById("btnResultClose");
    if (btnResultClose) {
      btnResultClose.onclick = () => {
        closeSongResultOverlay();
      };
    }

    const highwayTapArea = document.getElementById("highwayTapArea");
    if (highwayTapArea) {
      highwayTapArea.onclick = (e) => {
        if (e.target.closest("button, select, input")) return;
        togglePlayPause();
        showHitFeedback(state.isPlaying ? "Reproduzindo" : "Pausado");
      };
    }

    document.getElementById("selectSpeed").onchange = (e) => {
      state.speed = parseFloat(e.target.value) || 1.0;
    };

    document.getElementById("selectPlayStyle").onchange = (e) => {
      state.playStyle = e.target.value;
      clearTargetCueTines();
    };

    const btnGuideAudio = document.getElementById("btnGuideAudio");
    if (btnGuideAudio) {
      btnGuideAudio.onclick = (e) => {
        state.guideAudioInFlow = !state.guideAudioInFlow;
        e.currentTarget.classList.toggle("active", state.guideAudioInFlow);
        savePreferences();
        showHitFeedback(state.guideAudioInFlow ? "Som Guia: Ativo" : "Som Guia: Mudo");
      };
    }

    document.getElementById("btnLoopSection").onclick = (e) => {
      state.loopEnabled = !state.loopEnabled;
      if (state.loopEnabled) {
        const cur = Math.max(0, Math.floor(state.currentBeat));
        state.loopStartBeat = cur;
        state.loopEndBeat = Math.min(getSongTotalBeats(state.currentSong), cur + 8);
        showHitFeedback(`Loop: ${state.loopStartBeat} a ${state.loopEndBeat}`);
      }
      e.currentTarget.classList.toggle("active", state.loopEnabled);
    };

    document.getElementById("progressSlider").oninput = (e) => {
      seekToBeat(parseFloat(e.target.value) || 0);
    };

    document.getElementById("btnToggleCifraFormat").onclick = (e) => {
      state.cifraFormat = state.cifraFormat === "cifra" ? "ktab" : "cifra";
      e.currentTarget.textContent = state.cifraFormat === "cifra"
        ? "Ver KTab Vertical"
        : "Ver Cifra Simplificada";
      renderCifraView();
    };

    document.getElementById("btnAutoScroll").onclick = (e) => {
      state.autoScrollOn = !state.autoScrollOn;
      e.currentTarget.classList.toggle("active", state.autoScrollOn);
      e.currentTarget.textContent = state.autoScrollOn ? "Parar Rolagem" : "Auto-Rolagem";
    };

    document.getElementById("btnOpenInHero").onclick = () => {
      switchTab("hero");
      resetPlayback();
      togglePlayPause();
    };

    document.getElementById("btnFreeRecord").onclick = (e) => {
      if (!state.isRecordingFree) {
        state.isRecordingFree = true;
        state.recordedEvents = [];
        state.recordStartTime = performance.now();
        e.currentTarget.textContent = "Parar";
        e.currentTarget.classList.add("danger");
      } else {
        state.isRecordingFree = false;
        e.currentTarget.textContent = "Gravar";
        e.currentTarget.classList.remove("danger");
      }
      updateFreeRecordBanner();
    };

    document.getElementById("btnSendRecordToEditor").onclick = () => {
      if (state.recordedEvents.length === 0) return;
      state.isRecordingFree = false;
      const tabStr = window.KalimbaData.eventsToTabString(state.recordedEvents);
      document.getElementById("editorTitle").value = "Minha Gravação";
      document.getElementById("editorTabTextarea").value = tabStr;
      updateEditorLivePreview();
      switchTab("editor");
    };

    document.getElementById("inputMidiFile").onchange = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const baseName = file.name.replace(/\.[^.]+$/, "");

      try {
        if (file.name.toLowerCase().endsWith(".mid") || file.name.toLowerCase().endsWith(".midi")) {
          const buf = await file.arrayBuffer();
          const parsedMidi = window.KalimbaData.parseMidiArrayBufferToKalimbaEvents(buf);
          if (!parsedMidi.events.length) {
            alert("Nenhuma nota encontrada neste arquivo MIDI.");
            return;
          }
          document.getElementById("editorTitle").value = baseName;
          document.getElementById("editorBpm").value = parsedMidi.bpm || 100;
          document.getElementById("editorTabTextarea").value = window.KalimbaData.eventsToTabString(parsedMidi.events);
          updateEditorLivePreview();
        } else {
          const txt = await file.text();
          if (txt.trim().startsWith("{")) {
            const obj = JSON.parse(txt);
            document.getElementById("editorTitle").value = obj.title || baseName;
            document.getElementById("editorArtist").value = obj.artist || "";
            document.getElementById("editorBpm").value = obj.bpm || 100;
            document.getElementById("editorTabTextarea").value = obj.tabText || "";
          } else {
            document.getElementById("editorTitle").value = baseName;
            document.getElementById("editorTabTextarea").value = txt;
          }
          updateEditorLivePreview();
        }
      } catch (err) {
        alert("Não foi possível ler o arquivo: " + err.message);
      }
    };

    document.querySelectorAll(".dur-btn").forEach(btn => {
      btn.onclick = () => {
        document.querySelectorAll(".dur-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        state.editorSelectedDuration = parseFloat(btn.dataset.dur) || 1;
      };
    });

    document.getElementById("btnToggleChordMode").onclick = (e) => {
      state.editorChordMode = !state.editorChordMode;
      state.editorPendingChord.clear();
      e.currentTarget.classList.toggle("active", state.editorChordMode);
      document.getElementById("btnInsertChord").style.display = state.editorChordMode ? "inline-flex" : "none";
      renderEditorPicker();
    };

    document.getElementById("btnInsertChord").onclick = () => {
      if (state.editorPendingChord.size === 0) return;
      const labels = Array.from(state.editorPendingChord).map(id => {
        const d = window.KalimbaData.DEGREE_MAP[id];
        return d ? d.label : id;
      });
      const token = labels.length > 1 ? `(${labels.join(" ")})` : labels[0];
      appendTokenToEditorTextarea(token);
      state.editorPendingChord.clear();
      renderEditorPicker();
    };

    document.getElementById("btnInsertBar").onclick = () => {
      const ta = document.getElementById("editorTabTextarea");
      ta.value = (ta.value.trim() + " | ").trimStart();
    };

    document.getElementById("btnInsertRest").onclick = () => {
      const ta = document.getElementById("editorTabTextarea");
      const cur = ta.value.trim();
      const token = `.*${state.editorSelectedDuration}`;
      ta.value = cur ? `${cur} ${token}` : token;
      updateEditorLivePreview();
    };

    document.getElementById("btnEditorUndo").onclick = () => {
      const ta = document.getElementById("editorTabTextarea");
      const text = ta.value.replace(/\s+$/, "");
      const matches = [...text.matchAll(/\([^)]*\)\S*|\S+/g)];
      if (!matches.length) return;
      const last = matches[matches.length - 1];
      ta.value = text.slice(0, last.index).replace(/\s+$/, "");
      updateEditorLivePreview();
    };

    document.getElementById("editorTabTextarea").oninput = updateEditorLivePreview;

    document.getElementById("btnTestInHero").onclick = async () => {
      const songObj = buildSongFromEditorForm();
      if (!songObj) return;
      await upsertSongAndPlay(songObj, true);
    };

    document.getElementById("btnSaveSong").onclick = async () => {
      const songObj = buildSongFromEditorForm();
      if (!songObj) return;
      await upsertSongAndPlay(songObj, true);
    };

    document.getElementById("btnLoadCurrentIntoEditor").onclick = () => {
      loadSongIntoEditorForm(state.currentSong);
    };

    document.getElementById("btnExportSongJson").onclick = () => {
      const songObj = buildSongFromEditorForm();
      if (!songObj) return;
      const blob = new Blob([JSON.stringify(songObj, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${songObj.id}.kalim.json`;
      a.click();
      URL.revokeObjectURL(url);
    };

    const btnGithub = document.getElementById("btnCopyForGithub");
    if (btnGithub) {
      btnGithub.onclick = async () => {
        const songObj = buildSongFromEditorForm();
        if (!songObj) return;
        const catalogEntry = {
          id: songObj.id.replace(/^custom-/, ""),
          title: songObj.title,
          artist: songObj.artist,
          difficulty: songObj.difficulty,
          minKeys: songObj.minKeys,
          bpm: songObj.bpm,
          category: "Comunidade",
          description: `Arranjo de ${songObj.title} para Kalimba de ${songObj.minKeys} teclas.`,
          tabText: songObj.tabText
        };
        const formatted = JSON.stringify(catalogEntry, null, 2);
        try {
          await navigator.clipboard.writeText(formatted);
          const orig = btnGithub.textContent;
          btnGithub.textContent = "Copiado p/ Área de Transferência";
          setTimeout(() => { btnGithub.textContent = orig; }, 2200);
        } catch (e) {}
      };
    }

    window.addEventListener("keydown", (e) => {
      if (["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName)) return;
      if (e.code === "Space" && state.activeTab === "hero") {
        e.preventDefault();
        togglePlayPause();
        return;
      }
      const keyMap = "zxcvbnmasdfghjklqwertyu";
      const idx = keyMap.indexOf(e.key.toLowerCase());
      if (idx !== -1 && state.layout[idx]) {
        handleUserPluckTine(state.layout[idx].id);
      }
    });
  }

  function buildSongFromEditorForm() {
    const title = document.getElementById("editorTitle").value.trim() || "Nova Música";
    const artist = document.getElementById("editorArtist").value.trim() || "Autoral";
    const bpm = parseInt(document.getElementById("editorBpm").value, 10) || 100;
    const minKeys = parseInt(document.getElementById("editorMinKeys").value, 10) || 17;
    const tabText = document.getElementById("editorTabTextarea").value.trim();

    const events = window.KalimbaData.parseTabStringToNotes(tabText);
    if (events.length === 0) {
      return null;
    }

    const difficulty = document.getElementById("editorDifficulty").value || "Médio";
    const clientId = window.KalimCloud.getClientId();
    const slug = title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || ("musica-" + Date.now());
    return {
      id: "custom-" + slug + "-" + clientId.slice(-5),
      title,
      artist,
      bpm,
      minKeys,
      difficulty,
      category: "Minhas Músicas",
      description: "Criada no Estúdio do Kalim",
      tabText,
      events,
      createdBy: clientId,
      isCustom: true,
      isMine: true
    };
  }

  async function upsertSongAndPlay(songObj, persistToStorage) {
    if (persistToStorage) {
      await window.KalimDB.saveCustomSong(songObj);
      await loadSongsFromDatabase();
    } else {
      const existingIdx = state.songs.findIndex(s => s.id === songObj.id);
      if (existingIdx !== -1) state.songs[existingIdx] = songObj;
      else state.songs.push(songObj);
      populateSongSelectors();
      renderLibraryView();
    }
    selectSong(songObj.id);
    switchTab("hero");
    resetPlayback();
    togglePlayPause();
  }

  function switchTab(tabId) {
    state.activeTab = tabId;
    document.querySelectorAll(".view-section").forEach(sec => {
      sec.classList.toggle("active", sec.id === `view-${tabId}`);
    });
    document.querySelectorAll(".mode-tab").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.tab === tabId);
    });
    if (tabId !== "hero" && state.isPlaying) {
      state.isPlaying = false;
      updatePlayPauseButton();
    }
    if (tabId === "cifra") {
      renderCifraView();
    }
    if (tabId === "library") {
      renderLibraryView();
    }
  }

  function renderAllViews() {
    updateFloatingLyricBanner();
    renderCifraView();
    renderLibraryView();
    updateEditorLivePreview();
  }

  window.addEventListener("DOMContentLoaded", init);
})();
