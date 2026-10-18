// Configuração física e musical das Kalimbas (Referência padrão: 17 teclas) e Parser de Cifras / MIDI
window.KalimbaData = (function () {
  const ALL_DEGREES = [
    { id: "4_", num: 4, oct: -1, label: "4̣", majorSemi: -7, minorSemi: -7 },
    { id: "5_", num: 5, oct: -1, label: "5̣", majorSemi: -5, minorSemi: -5 },
    { id: "6_", num: 6, oct: -1, label: "6̣", majorSemi: -3, minorSemi: -4 },
    { id: "7_", num: 7, oct: -1, label: "7̣", majorSemi: -1, minorSemi: -2 },
    { id: "1",  num: 1, oct: 0,  label: "1",  majorSemi: 0,  minorSemi: 0  },
    { id: "2",  num: 2, oct: 0,  label: "2",  majorSemi: 2,  minorSemi: 2  },
    { id: "3",  num: 3, oct: 0,  label: "3",  majorSemi: 4,  minorSemi: 3  },
    { id: "4",  num: 4, oct: 0,  label: "4",  majorSemi: 5,  minorSemi: 5  },
    { id: "5",  num: 5, oct: 0,  label: "5",  majorSemi: 7,  minorSemi: 7  },
    { id: "6",  num: 6, oct: 0,  label: "6",  majorSemi: 9,  minorSemi: 8  },
    { id: "7",  num: 7, oct: 0,  label: "7",  majorSemi: 11, minorSemi: 10 },
    { id: "1'", num: 1, oct: 1,  label: "1°", majorSemi: 12, minorSemi: 12 },
    { id: "2'", num: 2, oct: 1,  label: "2°", majorSemi: 14, minorSemi: 14 },
    { id: "3'", num: 3, oct: 1,  label: "3°", majorSemi: 16, minorSemi: 15 },
    { id: "4'", num: 4, oct: 1,  label: "4°", majorSemi: 17, minorSemi: 17 },
    { id: "5'", num: 5, oct: 1,  label: "5°", majorSemi: 19, minorSemi: 19 },
    { id: "6'", num: 6, oct: 1,  label: "6°", majorSemi: 21, minorSemi: 20 },
    { id: "7'", num: 7, oct: 1,  label: "7°", majorSemi: 23, minorSemi: 22 },
    { id: "1''", num: 1, oct: 2, label: "1°°", majorSemi: 24, minorSemi: 24 },
    { id: "2''", num: 2, oct: 2, label: "2°°", majorSemi: 26, minorSemi: 26 },
    { id: "3''", num: 3, oct: 2, label: "3°°", majorSemi: 28, minorSemi: 27 }
  ];

  const DEGREE_MAP = {};
  ALL_DEGREES.forEach((d, idx) => {
    d.pitchOrder = idx;
    DEGREE_MAP[d.id] = d;
  });

  const TUNINGS = {
    C_MAJOR: {
      id: "C_MAJOR",
      name: "Dó Maior (C)",
      shortName: "C",
      rootMidi: 60,
      mode: "major",
      useFlats: false
    },
    G_MAJOR: {
      id: "G_MAJOR",
      name: "Sol Maior (G)",
      shortName: "G",
      rootMidi: 55,
      mode: "major",
      useFlats: false
    },
    BB_MAJOR: {
      id: "BB_MAJOR",
      name: "Si Bemol (Bb)",
      shortName: "Bb",
      rootMidi: 58,
      mode: "major",
      useFlats: true
    },
    F_MAJOR: {
      id: "F_MAJOR",
      name: "Fá Maior (F)",
      shortName: "F",
      rootMidi: 53,
      mode: "major",
      useFlats: true
    },
    A_MINOR: {
      id: "A_MINOR",
      name: "Lá Menor (Am)",
      shortName: "Am",
      rootMidi: 57,
      mode: "minor",
      useFlats: false
    }
  };

  const SIZES = {
    "8": {
      keys: 8,
      name: "8 Teclas",
      degrees: ["1", "2", "3", "4", "5", "6", "7", "1'"],
      markedDegrees: ["3", "6"]
    },
    "10": {
      keys: 10,
      name: "10 Teclas",
      degrees: ["1", "2", "3", "4", "5", "6", "7", "1'", "2'", "3'"],
      markedDegrees: ["3", "6", "2'"]
    },
    "17": {
      keys: 17,
      name: "17 Teclas (Padrão)",
      degrees: [
        "1", "2", "3", "4", "5", "6", "7",
        "1'", "2'", "3'", "4'", "5'", "6'", "7'",
        "1''", "2''", "3''"
      ],
      markedDegrees: ["3", "6", "2'", "5'", "1''"]
    },
    "21": {
      keys: 21,
      name: "21 Teclas",
      degrees: [
        "4_", "5_", "6_", "7_",
        "1", "2", "3", "4", "5", "6", "7",
        "1'", "2'", "3'", "4'", "5'", "6'", "7'",
        "1''", "2''", "3''"
      ],
      markedDegrees: ["6_", "3", "6", "2'", "5'", "1''"]
    }
  };

  const NOTE_NAMES_SHARP = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const NOTE_NAMES_FLAT  = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
  const PT_SOLFEGE = {
    "C": "Dó", "C#": "Dó#", "Db": "Réb",
    "D": "Ré", "D#": "Ré#", "Eb": "Mib",
    "E": "Mi",
    "F": "Fá", "F#": "Fá#", "Gb": "Solb",
    "G": "Sol", "G#": "Sol#", "Ab": "Láb",
    "A": "Lá", "A#": "Lá#", "Bb": "Sib",
    "B": "Si"
  };

  function midiToFreq(midi) {
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  function midiToNoteInfo(midi, useFlats) {
    const names = useFlats ? NOTE_NAMES_FLAT : NOTE_NAMES_SHARP;
    const pc = ((midi % 12) + 12) % 12;
    const octave = Math.floor(midi / 12) - 1;
    const letter = names[pc];
    return {
      letter,
      octave,
      fullName: `${letter}${octave}`,
      solfege: PT_SOLFEGE[letter] || letter
    };
  }

  function buildKalimbaLayout(sizeKey, tuningId) {
    const sizeCfg = SIZES[String(sizeKey)] || SIZES["17"];
    const tuning = TUNINGS[tuningId] || TUNINGS.C_MAJOR;
    const degrees = sizeCfg.degrees;

    const leftSide = [];
    const rightSide = [];
    let centerDegree = null;

    if (degrees.length % 2 === 1) {
      centerDegree = degrees[0];
      for (let i = 1; i < degrees.length; i++) {
        if (i % 2 === 1) {
          leftSide.unshift(degrees[i]);
        } else {
          rightSide.push(degrees[i]);
        }
      }
    } else {
      for (let i = 0; i < degrees.length; i++) {
        if (i % 2 === 0) {
          leftSide.unshift(degrees[i]);
        } else {
          rightSide.push(degrees[i]);
        }
      }
    }

    const orderedIds = centerDegree
      ? [...leftSide, centerDegree, ...rightSide]
      : [...leftSide, ...rightSide];

    const centerIndex = Math.floor((orderedIds.length - 1) / 2);

    return orderedIds.map((degId, visualIndex) => {
      const deg = DEGREE_MAP[degId];
      const rankInSize = degrees.indexOf(degId);
      const semiOffset = tuning.mode === "minor" ? deg.minorSemi : deg.majorSemi;
      const midi = tuning.rootMidi + semiOffset;
      const freq = midiToFreq(midi);
      const noteInfo = midiToNoteInfo(midi, tuning.useFlats);

      const lengthRatio = 0.94 - (rankInSize / Math.max(1, degrees.length - 1)) * 0.38;
      const isCenter = centerDegree ? degId === centerDegree : false;
      const hand = isCenter ? "C" : (visualIndex <= centerIndex ? "L" : "R");
      const isMarked = sizeCfg.markedDegrees.includes(degId);

      let letterOctaveLabel = noteInfo.letter;
      if (deg.oct === -1) letterOctaveLabel += "̣";
      else if (deg.oct === 1) letterOctaveLabel += "°";
      else if (deg.oct === 2) letterOctaveLabel += "°°";

      return {
        id: degId,
        visualIndex,
        totalKeys: orderedIds.length,
        degreeNum: deg.num,
        octaveOffset: deg.oct,
        degreeLabel: deg.label,
        letterLabel: letterOctaveLabel,
        noteFull: noteInfo.fullName,
        solfege: PT_SOLFEGE[noteInfo.letter] || noteInfo.letter,
        midi,
        freq,
        lengthPercent: Math.round(lengthRatio * 100),
        isCenter,
        isMarked,
        hand
      };
    });
  }

  const LETTER_TO_DEGREE = {
    "C": "1", "D": "2", "E": "3", "F": "4", "G": "5", "A": "6", "B": "7"
  };

  function normalizeSingleTokenToDegreeId(rawToken) {
    let t = rawToken.trim();
    if (!t) return null;
    const firstChar = t.charAt(0).toUpperCase();
    if (LETTER_TO_DEGREE[firstChar]) {
      t = LETTER_TO_DEGREE[firstChar] + t.slice(1);
    }
    t = t.replace(/[°•*]/g, "'").replace(/̣/g, "_");
    if (DEGREE_MAP[t]) return t;
    return null;
  }

  function parseTabStringToNotes(tabText) {
    const events = [];
    let currentBeat = 0;
    const lines = tabText.split(/\r?\n/);

    for (let rawLine of lines) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#") || line.startsWith("//")) continue;

      const regex = /\([^)]+\)|[^\s|]+|\|/g;
      const matches = line.match(regex) || [];

      for (const token of matches) {
        if (token === "|") continue;
        if (token === "-" || token === "~") {
          if (events.length > 0) {
            events[events.length - 1].duration += 1;
          }
          currentBeat += 1;
          continue;
        }
        if (token === ".") {
          currentBeat += 0.5;
          continue;
        }

        let duration = 1;
        let coreToken = token;
        let lyric = "";

        if (coreToken.includes(":")) {
          const parts = coreToken.split(":");
          coreToken = parts[0];
          lyric = parts.slice(1).join(":");
        }

        const durMultMatch = coreToken.match(/^(.*)\*(\d+(?:\.\d+)?)$/);
        const durDivMatch = coreToken.match(/^(.*)\/(\d+(?:\.\d+)?)$/);
        if (durMultMatch) {
          coreToken = durMultMatch[1];
          duration = parseFloat(durMultMatch[2]) || 1;
        } else if (durDivMatch) {
          coreToken = durDivMatch[1];
          const div = parseFloat(durDivMatch[2]) || 1;
          duration = 1 / div;
        }

        let degrees = [];
        if (coreToken.startsWith("(") && coreToken.endsWith(")")) {
          const inner = coreToken.slice(1, -1).trim();
          const subTokens = inner.split(/[\s,-]+/);
          degrees = subTokens.map(normalizeSingleTokenToDegreeId).filter(Boolean);
        } else {
          const d = normalizeSingleTokenToDegreeId(coreToken);
          if (d) degrees = [d];
        }

        if (degrees.length > 0) {
          events.push({
            beat: Number(currentBeat.toFixed(2)),
            duration: Number(duration.toFixed(2)),
            degrees,
            lyric
          });
          currentBeat += duration;
        }
      }
    }

    return events;
  }

  function eventsToTabString(events) {
    if (!events || !events.length) return "";
    let out = [];
    let lastBar = 0;

    events.forEach((ev) => {
      const barIndex = Math.floor(ev.beat / 4);
      if (barIndex > lastBar && out.length > 0) {
        out.push("|");
        if (barIndex % 2 === 0) out.push("\n");
        lastBar = barIndex;
      }
      const degFormatted = ev.degrees.map(id => DEGREE_MAP[id] ? DEGREE_MAP[id].label : id);
      let token = degFormatted.length > 1 ? `(${degFormatted.join(" ")})` : degFormatted[0];
      if (ev.lyric) {
        token += `:${ev.lyric}`;
      }
      if (ev.duration === 0.5) token += "/2";
      else if (ev.duration === 2) token += "*2";
      else if (ev.duration === 3) token += "*3";
      else if (ev.duration === 4) token += "*4";

      out.push(token);
    });

    return out.join(" ").replace(/ \n /g, "\n");
  }

  function parseMidiArrayBufferToKalimbaEvents(arrayBuffer) {
    const data = new DataView(arrayBuffer);
    let offset = 0;

    function readString(len) {
      let s = "";
      for (let i = 0; i < len; i++) {
        s += String.fromCharCode(data.getUint8(offset + i));
      }
      offset += len;
      return s;
    }

    function readVarInt() {
      let result = 0;
      while (offset < data.byteLength) {
        const b = data.getUint8(offset++);
        result = (result << 7) | (b & 0x7f);
        if ((b & 0x80) === 0) break;
      }
      return result;
    }

    if (readString(4) !== "MThd") {
      throw new Error("Arquivo MIDI inválido.");
    }
    const headerLen = data.getUint32(offset);
    offset += 4;
    const numTracks = data.getUint16(offset + 2);
    const ticksPerBeat = data.getUint16(offset + 4);
    offset += headerLen;

    const rawNotes = [];
    let detectedBpm = 100;

    for (let t = 0; t < numTracks && offset < data.byteLength; t++) {
      const chunkId = readString(4);
      const trackLen = data.getUint32(offset);
      offset += 4;
      const trackEnd = offset + trackLen;

      if (chunkId !== "MTrk") {
        offset = trackEnd;
        continue;
      }

      let currentTick = 0;
      let runningStatus = 0;
      const openNotes = {};

      while (offset < trackEnd) {
        const delta = readVarInt();
        currentTick += delta;

        let status = data.getUint8(offset);
        if (status < 0x80) {
          status = runningStatus;
        } else {
          offset++;
          if (status < 0xf0) runningStatus = status;
        }

        const type = status & 0xf0;
        if (type === 0x90 || type === 0x80) {
          const note = data.getUint8(offset++);
          const vel = data.getUint8(offset++);
          const isNoteOn = type === 0x90 && vel > 0;
          if (isNoteOn) {
            openNotes[note] = currentTick;
          } else {
            if (openNotes[note] !== undefined) {
              const startTick = openNotes[note];
              delete openNotes[note];
              rawNotes.push({
                midi: note,
                beat: startTick / ticksPerBeat,
                duration: Math.max(0.25, (currentTick - startTick) / ticksPerBeat)
              });
            }
          }
        } else if (type === 0xa0 || type === 0xb0 || type === 0xe0) {
          offset += 2;
        } else if (type === 0xc0 || type === 0xd0) {
          offset += 1;
        } else if (status === 0xff) {
          const metaType = data.getUint8(offset++);
          const metaLen = readVarInt();
          if (metaType === 0x51 && metaLen === 3) {
            const mpqn = (data.getUint8(offset) << 16) | (data.getUint8(offset + 1) << 8) | data.getUint8(offset + 2);
            if (mpqn > 0) detectedBpm = Math.round(60000000 / mpqn);
          }
          offset += metaLen;
        } else if (status === 0xf0 || status === 0xf7) {
          const sysLen = readVarInt();
          offset += sysLen;
        }
      }
      offset = trackEnd;
    }

    if (rawNotes.length === 0) return { bpm: detectedBpm, events: [] };

    const kalimba17Degrees = SIZES["17"].degrees.map(id => ({
      id,
      midi: 60 + DEGREE_MAP[id].majorSemi
    }));

    function snapMidiToKalimba17(midiNote) {
      let n = midiNote;
      while (n < 60) n += 12;
      while (n > 88) n -= 12;
      let best = kalimba17Degrees[0];
      let minDiff = 999;
      for (const kd of kalimba17Degrees) {
        const diff = Math.abs(kd.midi - n);
        if (diff < minDiff) {
          minDiff = diff;
          best = kd;
        }
      }
      return best.id;
    }

    rawNotes.sort((a, b) => a.beat - b.beat);
    const firstBeatOffset = rawNotes[0].beat;

    const groupedEvents = [];
    for (const rn of rawNotes) {
      const quantBeat = Math.round((rn.beat - firstBeatOffset) * 2) / 2;
      const quantDur = Math.max(0.5, Math.min(4, Math.round(rn.duration * 2) / 2));
      const degId = snapMidiToKalimba17(rn.midi);

      const last = groupedEvents[groupedEvents.length - 1];
      if (last && Math.abs(last.beat - quantBeat) < 0.12) {
        if (!last.degrees.includes(degId) && last.degrees.length < 4) {
          last.degrees.push(degId);
        }
      } else {
        groupedEvents.push({
          beat: quantBeat,
          duration: quantDur,
          degrees: [degId],
          lyric: ""
        });
      }
    }

    return {
      bpm: Math.max(50, Math.min(180, detectedBpm)),
      events: groupedEvents.slice(0, 240)
    };
  }

  const rawCatalog = window.KALIM_COMMUNITY_SONGS || [];
  const DEFAULT_SONGS = rawCatalog.map(song => ({
    ...song,
    events: parseTabStringToNotes(song.tabText)
  }));

  return {
    ALL_DEGREES,
    DEGREE_MAP,
    TUNINGS,
    SIZES,
    DEFAULT_SONGS,
    buildKalimbaLayout,
    parseTabStringToNotes,
    eventsToTabString,
    parseMidiArrayBufferToKalimbaEvents
  };
})();
