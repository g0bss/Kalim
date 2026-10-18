// Biblioteca Compartilhada do Kalim: Firestore via API REST (sem SDK, sem login).
window.KalimCloud = (function () {
  const cfg = window.KALIM_CLOUD_CONFIG || {};
  const LS_CLIENT = "kalim_client_id_v1";
  const LS_CACHE = "kalim_cloud_cache_v1";

  function getClientId() {
    let id = localStorage.getItem(LS_CLIENT);
    if (!id) {
      id = "u" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
      try { localStorage.setItem(LS_CLIENT, id); } catch (e) {}
    }
    return id;
  }

  function enabled() {
    return !!(cfg.projectId && cfg.apiKey);
  }

  function base() {
    return `https://firestore.googleapis.com/v1/projects/${cfg.projectId}/databases/(default)/documents/songs`;
  }

  function toFields(s) {
    const str = v => ({ stringValue: String(v == null ? "" : v) });
    const int = v => ({ integerValue: String(Math.round(Number(v) || 0)) });
    return {
      id: str(s.id),
      title: str(s.title),
      artist: str(s.artist),
      difficulty: str(s.difficulty),
      minKeys: int(s.minKeys),
      bpm: int(s.bpm),
      description: str(s.description),
      tabText: str(s.tabText),
      createdBy: str(s.createdBy),
      updatedAt: int(s.updatedAt || Date.now())
    };
  }

  function fromDoc(doc) {
    const f = doc.fields || {};
    const s = k => (f[k] && f[k].stringValue) || "";
    const n = k => (f[k] && Number(f[k].integerValue)) || 0;
    return {
      id: s("id"),
      title: s("title"),
      artist: s("artist"),
      difficulty: s("difficulty") || "Médio",
      minKeys: n("minKeys") || 17,
      bpm: n("bpm") || 100,
      description: s("description"),
      tabText: s("tabText"),
      createdBy: s("createdBy"),
      updatedAt: n("updatedAt")
    };
  }

  async function fetchAll() {
    if (!enabled()) return { songs: [], online: false };
    try {
      let songs = [];
      let token = "";
      do {
        const url = `${base()}?pageSize=300&key=${cfg.apiKey}` + (token ? `&pageToken=${token}` : "");
        const res = await fetch(url);
        if (!res.ok) throw new Error("HTTP " + res.status);
        const data = await res.json();
        songs = songs.concat((data.documents || []).map(fromDoc));
        token = data.nextPageToken || "";
      } while (token);
      try { localStorage.setItem(LS_CACHE, JSON.stringify(songs)); } catch (e) {}
      return { songs, online: true };
    } catch (e) {
      let cached = [];
      try { cached = JSON.parse(localStorage.getItem(LS_CACHE) || "[]"); } catch (err) {}
      return { songs: cached, online: false };
    }
  }

  async function save(song) {
    if (!enabled()) return false;
    try {
      const res = await fetch(`${base()}/${encodeURIComponent(song.id)}?key=${cfg.apiKey}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fields: toFields(song) })
      });
      return res.ok;
    } catch (e) {
      return false;
    }
  }

  async function remove(songId) {
    if (!enabled()) return false;
    try {
      const res = await fetch(`${base()}/${encodeURIComponent(songId)}?key=${cfg.apiKey}`, { method: "DELETE" });
      return res.ok;
    } catch (e) {
      return false;
    }
  }

  return { enabled, getClientId, fetchAll, save, remove };
})();
