// Banco de Dados Persistente do Kalim (IndexedDB + LocalStorage Sync)
window.KalimDB = (function () {
  const DB_NAME = "KalimDatabaseV1";
  const DB_VERSION = 1;
  const LS_SONGS_KEY = "kalimba_hero_custom_songs_v1";
  const LS_FAVS_KEY = "kalim_favorites_v1";
  const LS_STATS_KEY = "kalim_song_stats_v1";

  let idbInstance = null;

  function openIDB() {
    return new Promise((resolve) => {
      if (idbInstance) return resolve(idbInstance);
      if (!window.indexedDB) return resolve(null);

      try {
        const req = window.indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = (e) => {
          const db = e.target.result;
          if (!db.objectStoreNames.contains("songs")) {
            db.createObjectStore("songs", { keyPath: "id" });
          }
          if (!db.objectStoreNames.contains("meta")) {
            db.createObjectStore("meta", { keyPath: "key" });
          }
        };
        req.onsuccess = (e) => {
          idbInstance = e.target.result;
          resolve(idbInstance);
        };
        req.onerror = () => resolve(null);
      } catch (err) {
        resolve(null);
      }
    });
  }

  async function getAllCustomSongs() {
    let songs = [];
    // 1. Ler do localStorage (imediato)
    try {
      const raw = localStorage.getItem(LS_SONGS_KEY);
      if (raw) songs = JSON.parse(raw);
    } catch (e) {}

    // 2. Ler do IndexedDB (se tiver mais itens ou itens atualizados, mesclar)
    const db = await openIDB();
    if (db) {
      try {
        const idbSongs = await new Promise((resolve) => {
          const tx = db.transaction("songs", "readonly");
          const store = tx.objectStore("songs");
          const req = store.getAll();
          req.onsuccess = () => resolve(req.result || []);
          req.onerror = () => resolve([]);
        });
        if (idbSongs.length > 0) {
          const map = new Map();
          songs.forEach(s => map.set(s.id, s));
          idbSongs.forEach(s => map.set(s.id, s));
          songs = Array.from(map.values());
          localStorage.setItem(LS_SONGS_KEY, JSON.stringify(songs));
        }
      } catch (e) {}
    }

    return songs;
  }

  async function saveCustomSong(songObj) {
    const clean = {
      id: songObj.id,
      title: songObj.title,
      artist: songObj.artist,
      difficulty: songObj.difficulty || "Personalizada",
      minKeys: songObj.minKeys || 17,
      bpm: songObj.bpm || 100,
      category: songObj.category || "Minhas Músicas",
      description: songObj.description || "Criada no Kalim",
      tabText: songObj.tabText,
      updatedAt: Date.now(),
      isCustom: true
    };

    const current = await getAllCustomSongs();
    const idx = current.findIndex(s => s.id === clean.id);
    if (idx !== -1) current[idx] = clean;
    else current.push(clean);

    try {
      localStorage.setItem(LS_SONGS_KEY, JSON.stringify(current));
    } catch (e) {}

    const db = await openIDB();
    if (db) {
      try {
        const tx = db.transaction("songs", "readwrite");
        tx.objectStore("songs").put(clean);
      } catch (e) {}
    }
    return clean;
  }

  async function deleteCustomSong(songId) {
    const current = await getAllCustomSongs();
    const filtered = current.filter(s => s.id !== songId);
    try {
      localStorage.setItem(LS_SONGS_KEY, JSON.stringify(filtered));
    } catch (e) {}

    const db = await openIDB();
    if (db) {
      try {
        const tx = db.transaction("songs", "readwrite");
        tx.objectStore("songs").delete(songId);
      } catch (e) {}
    }
  }

  function getFavorites() {
    try {
      return new Set(JSON.parse(localStorage.getItem(LS_FAVS_KEY) || "[]"));
    } catch (e) {
      return new Set();
    }
  }

  function toggleFavorite(songId) {
    const favs = getFavorites();
    if (favs.has(songId)) favs.delete(songId);
    else favs.add(songId);
    const arr = Array.from(favs);
    try {
      localStorage.setItem(LS_FAVS_KEY, JSON.stringify(arr));
    } catch (e) {}
    return favs.has(songId);
  }

  function getStats() {
    try {
      return JSON.parse(localStorage.getItem(LS_STATS_KEY) || "{}");
    } catch (e) {
      return {};
    }
  }

  function recordSongScore(songId, score, maxCombo) {
    const stats = getStats();
    const prev = stats[songId] || { highScore: 0, bestCombo: 0, plays: 0 };
    stats[songId] = {
      highScore: Math.max(prev.highScore || 0, score || 0),
      bestCombo: Math.max(prev.bestCombo || 0, maxCombo || 0),
      plays: (prev.plays || 0) + 1
    };
    try {
      localStorage.setItem(LS_STATS_KEY, JSON.stringify(stats));
    } catch (e) {}
    return stats[songId];
  }

  return {
    getAllCustomSongs,
    saveCustomSong,
    deleteCustomSong,
    getFavorites,
    toggleFavorite,
    getStats,
    recordSongScore
  };
})();
