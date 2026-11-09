"use strict";

/* 실버스타 스튜디오
   외부 라이브러리 없이 Web Audio API로 소리를 만듭니다. */

const $ = id => document.getElementById(id);
const clone = value => JSON.parse(JSON.stringify(value));
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const STORE = "silverstar-studio-project-v1";

const INSTRUMENTS = {
  piano:   { name: "피아노",       icon: "♬", wave: "triangle", attack: 0.006 },
  epiano:  { name: "일렉 피아노",  icon: "♫", wave: "sine",     attack: 0.008 },
  guitar:  { name: "기타",         icon: "♩", wave: "triangle", attack: 0.003 },
  bass:    { name: "베이스",       icon: "♪", wave: "sine",     attack: 0.009 },
  drums:   { name: "드럼",         icon: "◉" },
  strings: { name: "스트링",       icon: "≋", wave: "sawtooth", attack: 0.11 },
  pad:     { name: "패드",         icon: "☁", wave: "sine",     attack: 0.18 },
  synth:   { name: "신스",         icon: "∿", wave: "sawtooth", attack: 0.015 },
  organ:   { name: "오르간",       icon: "▥", wave: "sine",     attack: 0.015 },
  bell:    { name: "벨",           icon: "✧", wave: "sine",     attack: 0.003 },
  flute:   { name: "플루트",       icon: "〰", wave: "sine",     attack: 0.045 },
  brass:   { name: "브라스",       icon: "♮", wave: "sawtooth", attack: 0.04 }
};

const COLORS = [
  "#c39bf1", "#89dac2", "#e7aa9e", "#efd27e",
  "#9cbcf4", "#d89fc8", "#b8d98a", "#9edce7",
  "#e0b8f1", "#e9bb82", "#b2b5f1", "#b7dfcf"
];

const NOTE_NAMES = ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"];
const SOLFEGE = ["도", "도♯", "레", "레♯", "미", "파", "파♯", "솔", "솔♯", "라", "라♯", "시"];

const DRUMS = [
  [49, "크래시"], [42, "하이햇"], [39, "클랩"],
  [38, "스네어"], [45, "탐"], [36, "킥"]
];

const CHORDS = {
  maj:  [0, 4, 7],
  min:  [0, 3, 7],
  "7":  [0, 4, 7, 10],
  maj7: [0, 4, 7, 11],
  m7:   [0, 3, 7, 10],
  "9":  [0, 4, 7, 10, 14],
  sus4: [0, 5, 7],
  dim:  [0, 3, 6]
};

const PROGRESSIONS = {
  bright: [[0, "maj"], [7, "maj"], [9, "min"], [5, "maj"]],
  calm:   [[5, "maj7"], [0, "maj7"], [2, "m7"], [7, "7"]],
  warm:   [[9, "min"], [5, "maj"], [0, "maj"], [7, "maj"]],
  jazz:   [[2, "m7"], [7, "7"], [0, "maj7"], [9, "7"]]
};

let project;
let selectedTrack = 0;
let selectedBar = 0;
let selectedGenre = "ballad";
let mood = "warm";
let history = [];
let future = [];
let saveTimer;

let audioContext = null;
let liveGraph = null;
let playing = false;
let scheduler = null;
let animation = null;
let nextStep = 0;
let nextTime = 0;
let visualQueue = [];
let generation = 0;
let lastVisualStep = -1;
let exporting = false;

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;",
    '"': "&quot;", "'": "&#39;"
  }[c]));
}

function tell(message) {
  $("status").textContent = message;
}

function makeTrack(inst, name) {
  return {
    name: name || INSTRUMENTS[inst].name,
    inst,
    volume: inst === "drums" ? 0.65 : 0.6,
    pan: 0,
    mute: false,
    notes: []
  };
}

function addNote(track, step, midi, duration = 2, velocity = 0.8) {
  track.notes.push({
    s: step,
    n: midi,
    d: duration,
    v: velocity
  });
}

function makeProject(genre = "ballad", empty = false) {
  const tempos = { jazz: 108, ballad: 86, hiphop: 92, rap: 100 };
  const titles = {
    jazz: "나의 재즈 스케치",
    ballad: "나의 첫 번째 발라드",
    hiphop: "나의 힙합 비트",
    rap: "나의 랩 비트"
  };

  const p = {
    version: 1,
    title: empty ? "새로운 음악" : titles[genre],
    genre,
    bars: 4,
    bpm: tempos[genre],
    swing: genre === "jazz" ? 0.22 : 0,
    key: 0,
    master: 0.7,
    reverb: 0.18,
    delay: 0.08,
    tracks: [
      makeTrack(genre === "hiphop" ? "epiano" : "piano"),
      makeTrack("bass"),
      makeTrack("drums"),
      makeTrack(genre === "jazz" ? "guitar" : "bell", "멜로디")
    ]
  };

  if (empty) return p;

  const progression = PROGRESSIONS[genre === "jazz" ? "jazz" : "warm"];

  for (let bar = 0; bar < p.bars; bar++) {
    const offset = bar * 16;
    const [root, type] = progression[bar % 4];

    for (const interval of CHORDS[type]) {
      if (genre === "hiphop" || genre === "rap") {
        addNote(p.tracks[0], offset, 48 + root + interval, 5, 0.55);
        addNote(p.tracks[0], offset + 8, 48 + root + interval, 5, 0.5);
      } else {
        addNote(p.tracks[0], offset, 48 + root + interval, 14, 0.55);
      }
    }

    for (const s of [0, 8]) {
      addNote(p.tracks[1], offset + s, 36 + root, 6, 0.8);
    }

    const kicks = genre === "rap" ? [0, 3, 8, 10] :
      genre === "hiphop" ? [0, 6, 8, 11] : [0, 8];

    for (const s of kicks) addNote(p.tracks[2], offset + s, 36, 1, 0.9);
    for (const s of [4, 12]) addNote(p.tracks[2], offset + s, 38, 1, 0.75);

    const hatGap = genre === "rap" ? 1 : 2;
    for (let s = 0; s < 16; s += hatGap) {
      addNote(p.tracks[2], offset + s, 42, 1, s % 4 === 0 ? 0.55 : 0.3);
    }

    const melody = [0, 4, 7, 4];
    melody.forEach((interval, i) => {
      addNote(
        p.tracks[3],
        offset + i * 4,
        60 + root + interval,
        genre === "rap" ? 1 : 2,
        0.6
      );
    });
  }

  return p;
}

function validProject(p) {
  const finiteRange = (n, low, high) =>
    typeof n === "number" && Number.isFinite(n) && n >= low && n <= high;

  if (!p || p.version !== 1 ||
      typeof p.title !== "string" || p.title.length > 80 ||
      !["jazz", "ballad", "hiphop", "rap"].includes(p.genre) ||
      ![4, 8, 16].includes(p.bars) ||
      !finiteRange(p.bpm, 40, 200) ||
      !finiteRange(p.swing, 0, 0.45) ||
      !Number.isInteger(p.key) || p.key < 0 || p.key > 11 ||
      !finiteRange(p.master, 0, 1) ||
      !finiteRange(p.reverb, 0, 0.6) ||
      !finiteRange(p.delay, 0, 0.5) ||
      !Array.isArray(p.tracks) ||
      p.tracks.length < 1 || p.tracks.length > 12) return false;

  return p.tracks.every(t =>
    t && typeof t.name === "string" && t.name.length <= 40 &&
    Object.hasOwn(INSTRUMENTS, t.inst) &&
    finiteRange(t.volume, 0, 1) &&
    finiteRange(t.pan, -1, 1) &&
    typeof t.mute === "boolean" &&
    Array.isArray(t.notes) && t.notes.length <= 8192 &&
    t.notes.every(n =>
      n && Number.isInteger(n.s) && n.s >= 0 && n.s < p.bars * 16 &&
      Number.isInteger(n.n) && n.n >= 24 && n.n <= 108 &&
      Number.isInteger(n.d) && n.d >= 1 && n.d <= 16 &&
      n.s + n.d <= p.bars * 16 &&
      finiteRange(n.v, 0, 1)
    )
  );
}

function persist() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try {
      localStorage.setItem(STORE, JSON.stringify(project));
    } catch {
      tell("자동저장을 사용할 수 없어요. ‘저장하기’로 파일을 보관해 주세요.");
    }
  }, 250);
}

function recordHistory() {
  history.push(clone(project));
  if (history.length > 60) history.shift();
  future = [];
}

function commit(action, redraw = true) {
  recordHistory();
  action();
  selectedTrack = clamp(selectedTrack, 0, project.tracks.length - 1);
  selectedBar = clamp(selectedBar, 0, project.bars - 1);
  persist();
  if (redraw) render();
  else updateHistoryButtons();
}

function undo() {
  if (!history.length) return;
  stop(false);
  future.push(clone(project));
  project = history.pop();
  selectedGenre = project.genre;
  selectedTrack = clamp(selectedTrack, 0, project.tracks.length - 1);
  selectedBar = clamp(selectedBar, 0, project.bars - 1);
  persist();
  render();
  tell("이전 작업으로 되돌렸어요.");
}

function redo() {
  if (!future.length) return;
  stop(false);
  history.push(clone(project));
  project = future.pop();
  selectedGenre = project.genre;
  selectedTrack = clamp(selectedTrack, 0, project.tracks.length - 1);
  selectedBar = clamp(selectedBar, 0, project.bars - 1);
  persist();
  render();
  tell("작업을 다시 실행했어요.");
}

function updateHistoryButtons() {
  $("undoBtn").disabled = !history.length;
  $("redoBtn").disabled = !future.length;
}

function chooseTrack(index) {
  selectedTrack = index;
  const track = project.tracks[index];
  if (track.inst !== "drums" && track.notes.length) {
    const min = Math.min(...track.notes.map(n => n.n));
    const base = clamp(Math.floor(min / 12) * 12, 36, 72);
    $("octave").value = String(base);
  }
}

function renderArrangement() {
  const container = $("arrangement");
  container.style.setProperty("--bars", project.bars);

  let html = `<div class="arr-header"><span>악기 / 음량</span>`;
  for (let bar = 0; bar < project.bars; bar++) {
    html += `<span>${bar + 1}마디</span>`;
  }
  html += "</div>";

  project.tracks.forEach((track, index) => {
    const color = COLORS[index % COLORS.length];

    html += `
      <div class="arr-row" style="--track:${color}">
        <div class="track ${index === selectedTrack ? "selected-track" : ""}">
          <button class="track-title" data-select-track="${index}">
            ${INSTRUMENTS[track.inst].icon} ${escapeHTML(track.name)}
          </button>
          <div class="track-bottom">
            <button data-mute="${index}" aria-pressed="${track.mute}"
              aria-label="${escapeHTML(track.name)} 음소거">
              ${track.mute ? "꺼짐" : "켜짐"}
            </button>
            <input type="range" min="0" max="100"
              value="${Math.round(track.volume * 100)}"
              data-volume="${index}"
              aria-label="${escapeHTML(track.name)} 음량">
            <small>${Math.round(track.volume * 100)}</small>
          </div>
        </div>`;

    for (let bar = 0; bar < project.bars; bar++) {
      const notes = track.notes.filter(n => Math.floor(n.s / 16) === bar);
      const selected = selectedTrack === index && selectedBar === bar;

      html += `
        <button class="clip ${notes.length ? "" : "empty"} ${selected ? "chosen" : ""}"
          data-track="${index}" data-bar="${bar}"
          aria-label="${escapeHTML(track.name)} ${bar + 1}마디 편집"
          aria-pressed="${selected}">
          ${notes.length
            ? `<span class="clip-bars">${
                notes.slice(0, 8).map(n =>
                  `<i style="transform:translateY(${(n.n % 7 - 3) * 2}px)"></i>`
                ).join("")
              }</span><small>${notes.length}음</small>`
            : "+"}
        </button>`;
    }

    html += "</div>";
  });

  container.innerHTML = html;
}

function visibleRows() {
  const track = project.tracks[selectedTrack];

  if (track.inst === "drums") {
    return DRUMS.map(([midi, label]) => ({ midi, label, black: false }));
  }

  const base = Number($("octave").value);
  const intervals = $("chromatic").checked
    ? Array.from({ length: 13 }, (_, i) => 12 - i)
    : [12, 11, 9, 7, 5, 4, 2, 0];

  return intervals.map(interval => {
    const midi = base + interval;
    const black = [1, 3, 6, 8, 10].includes(midi % 12);
    const octave = Math.floor(midi / 12) - 1;
    return {
      midi,
      black,
      label: `${SOLFEGE[midi % 12]} ${NOTE_NAMES[midi % 12]}${octave}`
    };
  });
}

function renderRoll() {
  const track = project.tracks[selectedTrack];
  const drum = track.inst === "drums";

  $("editorTitle").textContent = drum
    ? `드럼 만들기 · ${track.name}`
    : `멜로디 만들기 · ${track.name}`;

  $("selectedBar").textContent = `${selectedBar + 1}마디`;
  $("noteLength").disabled = drum;
  $("octave").disabled = drum;
  $("insertChord").disabled = drum;

  const rows = visibleRows();
  const start = selectedBar * 16;
  const inBar = track.notes.filter(n => n.s < start + 16 && n.s + n.d > start);
  const hidden = inBar.filter(n => !rows.some(r => r.midi === n.n)).length;

  $("editorHint").textContent = hidden
    ? `화면 밖의 음 ${hidden}개도 있어요. 음 높이 또는 반음 표시를 바꿔 확인하세요.`
    : "칸을 누르면 음이 생겨요. 다시 누르면 지워져요.";

  let html = '<div class="roll-head"><span>음 / 박자</span>';
  for (let s = 0; s < 16; s++) {
    html += `<span data-step="${s}">${s + 1}</span>`;
  }
  html += "</div>";

  for (const row of rows) {
    html += `
      <div class="note-row ${$("chromatic").checked ? "chromatic" : ""}">
        <button class="key-label ${row.black ? "black" : ""}"
          data-preview="${row.midi}"
          aria-label="${row.label} 들어보기">${row.label}</button>`;

    for (let s = 0; s < 16; s++) {
      const absolute = start + s;
      const note = inBar.find(n =>
        n.n === row.midi && n.s <= absolute && n.s + n.d > absolute
      );

      html += `
        <button
          class="note-cell ${s % 4 === 0 ? "beat" : ""}
            ${note ? "on" : ""}
            ${note && note.s === absolute ? "start" : ""}
            ${note && note.s !== absolute ? "continue" : ""}"
          data-note="${row.midi}" data-step="${s}"
          aria-label="${row.label} ${s + 1}번 칸"
          aria-pressed="${Boolean(note)}">
        </button>`;
    }

    html += "</div>";
  }

  $("pianoRoll").style.setProperty("--track", COLORS[selectedTrack % COLORS.length]);
  $("pianoRoll").innerHTML = html;
  $("previousBar").disabled = selectedBar === 0;
  $("nextBar").disabled = selectedBar === project.bars - 1;
  $("copyBar").disabled = selectedBar === project.bars - 1;
}

function chordLabel(root, type) {
  const suffix = type === "maj" ? "" : type === "min" ? "m" : type;
  return NOTE_NAMES[((root % 12) + 12) % 12] + suffix;
}

function renderHarmony() {
  $("chordPreview").innerHTML = PROGRESSIONS[mood].map(([root, type], i) =>
    `<div><b>${chordLabel(root + project.key, type)}</b><small>${i + 1}마디</small></div>`
  ).join("");

  document.querySelectorAll("[data-mood]").forEach(button => {
    button.classList.toggle("active", button.dataset.mood === mood);
  });
}

function render() {
  $("projectName").value = project.title;
  $("bpm").value = project.bpm;
  $("bars").value = project.bars;
  $("key").value = project.key;
  $("swing").value = Math.round(project.swing * 100);
  $("swingValue").textContent = `${Math.round(project.swing * 100)}%`;

  for (const id of ["master", "reverb", "delay"]) {
    $(id).value = Math.round(project[id] * 100);
    $(id + "Value").textContent = `${Math.round(project[id] * 100)}%`;
  }

  const track = project.tracks[selectedTrack];
  $("trackInstrument").value = track.inst;
  $("pan").value = Math.round(track.pan * 100);
  $("panValue").textContent = track.pan === 0
    ? "가운데"
    : `${track.pan < 0 ? "왼쪽" : "오른쪽"} ${Math.round(Math.abs(track.pan) * 100)}`;

  document.querySelectorAll("[data-genre]").forEach(button => {
    button.classList.toggle("active", button.dataset.genre === selectedGenre);
  });

  renderArrangement();
  renderRoll();
  renderHarmony();
  updateHistoryButtons();
}

/* ---------- 오디오 엔진 ---------- */

async function ensureAudio() {
  const AudioClass = window.AudioContext || window.webkitAudioContext;

  if (!AudioClass) {
    throw new Error("이 브라우저에서는 오디오 기능을 사용할 수 없어요.");
  }

  if (!audioContext || audioContext.state === "closed") {
    audioContext = new AudioClass();
  }

  await audioContext.resume();
  return audioContext;
}

function makeGraph(ctx, p) {
  const input = ctx.createGain();
  const compressor = ctx.createDynamicsCompressor();
  const master = ctx.createGain();
  const reverbGain = ctx.createGain();
  const delayGain = ctx.createGain();
  const delayNode = ctx.createDelay(2);
  const feedback = ctx.createGain();
  const convolver = ctx.createConvolver();

  const impulse = ctx.createBuffer(2, Math.floor(ctx.sampleRate * 1.5), ctx.sampleRate);

  let seed = 12345;
  function noise() {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296 * 2 - 1;
  }

  for (let channel = 0; channel < 2; channel++) {
    const data = impulse.getChannelData(channel);
    for (let i = 0; i < data.length; i++) {
      data[i] = noise() * Math.pow(1 - i / data.length, 2.5);
    }
  }

  convolver.buffer = impulse;
  compressor.threshold.value = -12;
  compressor.knee.value = 20;
  compressor.ratio.value = 5;
  compressor.attack.value = 0.004;
  compressor.release.value = 0.15;

  master.gain.value = p.master;
  reverbGain.gain.value = p.reverb;
  delayGain.gain.value = p.delay;
  delayNode.delayTime.value = 60 / p.bpm * 0.75;
  feedback.gain.value = 0.26;

  input.connect(compressor);
  input.connect(convolver);
  convolver.connect(reverbGain);
  reverbGain.connect(compressor);

  input.connect(delayNode);
  delayNode.connect(delayGain);
  delayGain.connect(compressor);
  delayNode.connect(feedback);
  feedback.connect(delayNode);

  compressor.connect(master);
  master.connect(ctx.destination);

  return {
    input, master, reverbGain, delayGain,
    sources: new Set(),
    nodes: [
      input, compressor, master, reverbGain, delayGain,
      delayNode, feedback, convolver
    ]
  };
}

function disposeGraph(graph) {
  if (!graph) return;

  for (const source of graph.sources) {
    try { source.stop(); } catch {}
  }

  for (const node of graph.nodes) {
    try { node.disconnect(); } catch {}
  }

  graph.sources.clear();
}

function trackSource(source, graph) {
  graph.sources.add(source);
  source.onended = () => {
    graph.sources.delete(source);
    try { source.disconnect(); } catch {}
  };
}

function noteFrequency(midi) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

function playVoice(ctx, graph, track, midi, time, duration, velocity) {
  if (track.mute || track.volume <= 0 || velocity <= 0) return;

  const gain = ctx.createGain();
  let tail = gain;

  if (ctx.createStereoPanner) {
    const pan = ctx.createStereoPanner();
    pan.pan.value = track.pan;
    gain.connect(pan);
    tail = pan;
  }

  tail.connect(graph.input);

  const level = track.volume * velocity;

  if (track.inst === "drums") {
    const lengths = { 36: 0.32, 38: 0.18, 39: 0.13, 42: 0.055, 45: 0.24, 49: 0.7 };
    const length = lengths[midi] || 0.1;
    const amplitude = level * (midi === 42 ? 0.25 : 0.55);

    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(amplitude, time + 0.003);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + length);

    if (midi === 36 || midi === 45) {
      const oscillator = ctx.createOscillator();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(midi === 36 ? 150 : 220, time);
      oscillator.frequency.exponentialRampToValueAtTime(midi === 36 ? 42 : 85, time + 0.16);
      oscillator.connect(gain);
      trackSource(oscillator, graph);
      oscillator.start(time);
      oscillator.stop(time + length + 0.02);
    } else {
      const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * length), ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < data.length; i++) {
        const pulse = midi === 39 ? 0.55 + 0.45 * Math.sin(i / ctx.sampleRate * 190) : 1;
        data[i] = (Math.random() * 2 - 1) * pulse;
      }

      const source = ctx.createBufferSource();
      const filter = ctx.createBiquadFilter();
      source.buffer = buffer;
      filter.type = midi === 42 || midi === 49 ? "highpass" : "bandpass";
      filter.frequency.value = midi === 42 ? 6500 : midi === 49 ? 4500 : 1600;
      source.connect(filter);
      filter.connect(gain);
      trackSource(source, graph);
      source.start(time);
      source.stop(time + length);
    }

    return;
  }

  const instrument = INSTRUMENTS[track.inst];
  const attack = Math.min(instrument.attack, duration * 0.35);
  const plucked = ["piano", "epiano", "guitar", "bell"].includes(track.inst);
  const release = track.inst === "pad" || track.inst === "strings" ? 0.28 : 0.1;
  const end = time + Math.max(duration, 0.04);
  const amplitude = level * (track.inst === "bass" ? 0.28 : 0.16);

  gain.gain.setValueAtTime(0.0001, time);
  gain.gain.linearRampToValueAtTime(amplitude, time + attack);
  gain.gain.exponentialRampToValueAtTime(
    Math.max(0.0001, amplitude * (plucked ? 0.17 : 0.72)),
    end
  );
  gain.gain.exponentialRampToValueAtTime(0.0001, end + release);

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = ({
    guitar: 2200, bass: 850, strings: 2400,
    pad: 1400, brass: 1900, synth: 3500
  })[track.inst] || 6500;

  filter.Q.value = track.inst === "synth" ? 1.8 : 0.6;
  filter.connect(gain);

  const harmonics = ({
    piano: [[1, 1], [2, 0.22], [3, 0.07]],
    epiano: [[1, 1], [2, 0.35], [4, 0.08]],
    guitar: [[1, 1], [2, 0.25], [3, 0.12]],
    organ: [[1, 0.7], [2, 0.3], [4, 0.17]],
    bell: [[1, 1], [2.01, 0.35], [3.98, 0.12]],
    flute: [[1, 1], [2, 0.06]]
  })[track.inst] || [[1, 1], [1.003, 0.25]];

  for (const [multiple, amount] of harmonics) {
    const oscillator = ctx.createOscillator();
    const partialGain = ctx.createGain();

    oscillator.type = instrument.wave;
    oscillator.frequency.value = noteFrequency(midi) * multiple;
    partialGain.gain.value = amount;

    oscillator.connect(partialGain);
    partialGain.connect(filter);
    trackSource(oscillator, graph);

    oscillator.start(time);
    oscillator.stop(end + release + 0.02);
  }
}

function stepTime(step, p) {
  const stepDuration = 60 / p.bpm / 4;
  return step * stepDuration + (step % 2 ? stepDuration * p.swing : 0);
}

function noteDuration(note, p) {
  return Math.max(0.025, stepTime(note.s + note.d, p) - stepTime(note.s, p) - 0.012);
}

function scheduleStep(ctx, graph, p, step, time, metronome = false) {
  for (const track of p.tracks) {
    if (track.mute) continue;

    for (const note of track.notes) {
      if (note.s === step) {
        playVoice(ctx, graph, track, note.n, time, noteDuration(note, p), note.v);
      }
    }
  }

  if (metronome && step % 4 === 0) {
    playVoice(
      ctx, graph,
      { inst: "bell", volume: 0.3, pan: 0, mute: false },
      step % 16 === 0 ? 96 : 91,
      time, 0.035, 0.65
    );
  }
}

async function preview(midi, duration = 0.35) {
  try {
    const ticket = generation;
    const ctx = await ensureAudio();
    if (ticket !== generation) return;
    if (!liveGraph) liveGraph = makeGraph(ctx, project);

    const track = { ...project.tracks[selectedTrack], mute: false };
    playVoice(ctx, liveGraph, track, midi, ctx.currentTime + 0.01, duration, 0.75);
  } catch (error) {
    tell(error.message);
  }
}

function paintPlayhead(step) {
  document.querySelectorAll(".playhead").forEach(el => el.classList.remove("playhead"));
  document.querySelectorAll(".clip.playing").forEach(el => el.classList.remove("playing"));

  if (step < 0) {
    $("clock").textContent = "01 : 01";
    return;
  }

  const bar = Math.floor(step / 16);
  const local = step % 16;

  $("clock").textContent =
    `${String(bar + 1).padStart(2, "0")} : ${String(Math.floor(local / 4) + 1).padStart(2, "0")}`;

  document.querySelectorAll(`.clip[data-bar="${bar}"]`).forEach(el => {
    el.classList.add("playing");
  });

  if (bar === selectedBar) {
    document.querySelectorAll(`#pianoRoll [data-step="${local}"]`).forEach(el => {
      el.classList.add("playhead");
    });
  }
}

function animatePlayhead() {
  if (!playing) return;

  while (visualQueue.length && visualQueue[0].time <= audioContext.currentTime) {
    const event = visualQueue.shift();

    if (event.end) {
      stop(false);
      tell("곡 재생을 마쳤어요.");
      return;
    }

    lastVisualStep = event.step;
    paintPlayhead(event.step);
  }

  animation = requestAnimationFrame(animatePlayhead);
}

function tick() {
  if (!playing) return;
  const ctx = audioContext;

  if (nextTime < ctx.currentTime - 0.25) {
    nextTime = ctx.currentTime + 0.03;
  }

  while (nextTime < ctx.currentTime + 0.12) {
    const total = project.bars * 16;

    if (nextStep >= total) {
      if ($("loop").checked) {
        nextStep = 0;
      } else {
        visualQueue.push({ time: nextTime + 0.35, end: true });
        clearInterval(scheduler);
        scheduler = null;
        return;
      }
    }

    scheduleStep(ctx, liveGraph, project, nextStep, nextTime, $("metro").checked);
    visualQueue.push({ time: nextTime, step: nextStep });

    const duration = 60 / project.bpm / 4;
    nextTime += duration * (nextStep % 2 === 0 ? 1 + project.swing : 1 - project.swing);
    nextStep++;
  }
}

async function start() {
  stop(false);
  const ticket = generation;

  try {
    const ctx = await ensureAudio();
    if (ticket !== generation) return;

    liveGraph = makeGraph(ctx, project);
    nextStep = 0;
    nextTime = ctx.currentTime + 0.07;
    visualQueue = [];
    playing = true;

    $("playBtn").textContent = "❚❚ 재생 중";
    tick();
    scheduler = setInterval(tick, 25);
    animatePlayhead();

    tell("전체 곡을 재생하고 있어요. 재생 중에도 음을 추가하거나 지울 수 있어요.");
  } catch (error) {
    stop(false);
    tell(error.message || "오디오를 시작하지 못했어요.");
  }
}

function stop(showMessage = true) {
  generation++;
  playing = false;
  clearInterval(scheduler);
  cancelAnimationFrame(animation);
  scheduler = null;
  animation = null;
  visualQueue = [];
  lastVisualStep = -1;

  disposeGraph(liveGraph);
  liveGraph = null;

  $("playBtn").textContent = "▶ 들어보기";
  paintPlayhead(-1);
  if (showMessage) tell("재생을 멈췄어요.");
}

/* ---------- 파일 저장 / 음원 출력 ---------- */

function safeFilename(name) {
  return name.replace(/[\\/:*?"<>|]/g, "_").trim() || "실버스타_음악";
}

function download(blob, filename) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}

function saveProject() {
  download(
    new Blob([JSON.stringify(project, null, 2)], { type: "application/json" }),
    safeFilename(project.title) + ".json"
  );
  tell("프로젝트 파일을 저장했어요. 나중에 ‘불러오기’로 이어서 편집할 수 있어요.");
}

function encodeWav(buffer) {
  const frames = buffer.length;
  const sampleRate = buffer.sampleRate;
  const bytes = new ArrayBuffer(44 + frames * 4);
  const view = new DataView(bytes);

  function writeString(offset, text) {
    for (let i = 0; i < text.length; i++) view.setUint8(offset + i, text.charCodeAt(i));
  }

  writeString(0, "RIFF");
  view.setUint32(4, 36 + frames * 4, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 2, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 4, true);
  view.setUint16(32, 4, true);
  view.setUint16(34, 16, true);
  writeString(36, "data");
  view.setUint32(40, frames * 4, true);

  const left = buffer.getChannelData(0);
  const right = buffer.getChannelData(1);

  let peak = 1;
  for (let i = 0; i < frames; i++) {
    peak = Math.max(peak, Math.abs(left[i]), Math.abs(right[i]));
  }

  const scale = peak > 1 ? 0.98 / peak : 1;

  for (let i = 0; i < frames; i++) {
    for (let channel = 0; channel < 2; channel++) {
      const sample = clamp((channel ? right[i] : left[i]) * scale, -1, 1);
      view.setInt16(
        44 + i * 4 + channel * 2,
        sample * (sample < 0 ? 32768 : 32767),
        true
      );
    }
  }

  return new Blob([bytes], { type: "audio/wav" });
}

async function exportWav() {
  if (exporting) return;

  const OfflineClass = window.OfflineAudioContext || window.webkitOfflineAudioContext;
  if (!OfflineClass) {
    tell("이 브라우저는 WAV 출력을 지원하지 않아요.");
    return;
  }

  if (!project.tracks.some(t => !t.mute && t.volume > 0 && t.notes.length)) {
    tell("내보낼 소리가 없어요. 음을 넣거나 악기의 소리를 켜주세요.");
    return;
  }

  exporting = true;
  $("exportBtn").disabled = true;
  $("exportBtn").textContent = "음원 만드는 중…";
  tell("전체 곡을 WAV로 만들고 있어요.");

  try {
    const snapshot = clone(project);
    const duration = snapshot.bars * 4 * 60 / snapshot.bpm;
    const sampleRate = 44100;
    const ctx = new OfflineClass(2, Math.ceil((duration + 2) * sampleRate), sampleRate);
    const graph = makeGraph(ctx, snapshot);

    for (let step = 0; step < snapshot.bars * 16; step++) {
      scheduleStep(ctx, graph, snapshot, step, stepTime(step, snapshot), false);
    }

    const rendered = await ctx.startRendering();
    download(encodeWav(rendered), safeFilename(snapshot.title) + ".wav");
    disposeGraph(graph);
    tell("WAV 파일을 만들었어요. 박자 안내 소리는 음원에 포함하지 않았어요.");
  } catch (error) {
    console.error(error);
    tell("음원 출력에 실패했어요. 재생을 멈추고 다시 시도해 주세요.");
  } finally {
    exporting = false;
    $("exportBtn").disabled = false;
    $("exportBtn").textContent = "↓ 완성한 음악 내려받기";
  }
}

/* ---------- 화면 조작 ---------- */

$("instrumentList").innerHTML = Object.entries(INSTRUMENTS).map(([id, item]) =>
  `<button data-add="${id}"><span>${item.icon} ${item.name}</span><i>＋</i></button>`
).join("");

$("trackInstrument").innerHTML = Object.entries(INSTRUMENTS).map(([id, item]) =>
  `<option value="${id}">${item.name}</option>`
).join("");

$("chordRoot").innerHTML = NOTE_NAMES.map((name, index) =>
  `<option value="${index}">${SOLFEGE[index]} · ${name}</option>`
).join("");

$("helpBtn").onclick = () => $("helpDialog").showModal();
$("saveBtn").onclick = saveProject;
$("openBtn").onclick = () => $("projectFile").click();
$("exportBtn").onclick = exportWav;
$("undoBtn").onclick = undo;
$("redoBtn").onclick = redo;
$("playBtn").onclick = () => playing ? stop() : start();
$("stopBtn").onclick = () => stop();

$("projectName").onchange = event => {
  commit(() => {
    project.title = event.target.value.trim().slice(0, 80) || "제목 없는 음악";
  });
};

$("genres").onclick = event => {
  const button = event.target.closest("[data-genre]");
  if (!button) return;
  selectedGenre = button.dataset.genre;
  render();
  tell("장르를 골랐어요. ‘선택한 장르 예제 불러오기’를 누르면 적용돼요.");
};

$("exampleBtn").onclick = () => {
  stop(false);
  commit(() => {
    project = makeProject(selectedGenre);
    selectedTrack = 0;
    selectedBar = 0;
    mood = selectedGenre === "jazz" ? "jazz" : "warm";
    $("octave").value = "48";
  });
  tell("예제를 불러왔어요. 자유롭게 바꿔보세요.");
};

$("newBtn").onclick = () => {
  stop(false);
  commit(() => {
    project = makeProject(selectedGenre, true);
    selectedTrack = 0;
    selectedBar = 0;
  });
  tell("빈 작품을 만들었어요. 이전 작품은 되돌리기로 복원할 수 있어요.");
};

$("instrumentList").onclick = event => {
  const button = event.target.closest("[data-add]");
  if (!button) return;

  if (project.tracks.length >= 12) {
    tell("트랙은 최대 12개까지 추가할 수 있어요.");
    return;
  }

  commit(() => {
    project.tracks.push(makeTrack(button.dataset.add));
    selectedTrack = project.tracks.length - 1;
  });

  tell("악기를 추가했어요. 아래 격자에 음을 넣어보세요.");
};

$("arrangement").onclick = event => {
  const mute = event.target.closest("[data-mute]");
  if (mute) {
    const index = Number(mute.dataset.mute);
    commit(() => {
      project.tracks[index].mute = !project.tracks[index].mute;
    });
    return;
  }

  const trackButton = event.target.closest("[data-select-track]");
  if (trackButton) {
    chooseTrack(Number(trackButton.dataset.selectTrack));
    render();
    return;
  }

  const clip = event.target.closest("[data-track][data-bar]");
  if (clip) {
    chooseTrack(Number(clip.dataset.track));
    selectedBar = Number(clip.dataset.bar);
    render();
  }
};

let volumeSnapshot = null;

$("arrangement").addEventListener("input", event => {
  const input = event.target.closest("[data-volume]");
  if (!input) return;

  if (!volumeSnapshot) volumeSnapshot = clone(project);
  const track = project.tracks[Number(input.dataset.volume)];
  track.volume = Number(input.value) / 100;
  input.nextElementSibling.textContent = input.value;
});

$("arrangement").addEventListener("change", event => {
  if (!event.target.matches("[data-volume]")) return;

  if (volumeSnapshot) {
    history.push(volumeSnapshot);
    if (history.length > 60) history.shift();
    future = [];
    volumeSnapshot = null;
  }

  persist();
  updateHistoryButtons();
});

$("pianoRoll").onclick = event => {
  const key = event.target.closest("[data-preview]");
  if (key) {
    preview(Number(key.dataset.preview));
    return;
  }

  const cell = event.target.closest("[data-note]");
  if (!cell) return;

  const midi = Number(cell.dataset.note);
  const localStep = Number(cell.dataset.step);
  const absolute = selectedBar * 16 + localStep;
  const track = project.tracks[selectedTrack];
  const existing = track.notes.findIndex(n =>
    n.n === midi && n.s <= absolute && n.s + n.d > absolute
  );

  let inserted = false;

  commit(() => {
    if (existing >= 0) {
      track.notes.splice(existing, 1);
    } else {
      const length = track.inst === "drums" ? 1 : Number($("noteLength").value);
      const duration = Math.min(length, 16 - localStep);

      /* 同じ高さの重複する音を避ける */
      track.notes = track.notes.filter(n =>
        !(n.n === midi && n.s < absolute + duration && n.s + n.d > absolute)
      );

      addNote(track, absolute, midi, duration, Number($("velocity").value) / 100);
      inserted = true;
    }
  });

  if (inserted && !playing) preview(midi, 0.25);
};

$("octave").onchange = renderRoll;
$("chromatic").onchange = renderRoll;
$("velocity").oninput = () => {
  $("velocityValue").textContent = $("velocity").value;
};

$("previousBar").onclick = () => {
  selectedBar = Math.max(0, selectedBar - 1);
  render();
};

$("nextBar").onclick = () => {
  selectedBar = Math.min(project.bars - 1, selectedBar + 1);
  render();
};

$("clearBar").onclick = () => {
  const start = selectedBar * 16;
  commit(() => {
    project.tracks[selectedTrack].notes =
      project.tracks[selectedTrack].notes.filter(n => n.s < start || n.s >= start + 16);
  });
  tell("선택한 악기의 이 마디를 비웠어요. 되돌릴 수 있어요.");
};

$("copyBar").onclick = () => {
  if (selectedBar >= project.bars - 1) return;

  const start = selectedBar * 16;
  commit(() => {
    const track = project.tracks[selectedTrack];
    const copied = track.notes
      .filter(n => n.s >= start && n.s < start + 16)
      .map(n => ({ ...n, s: n.s + 16 }));

    track.notes = track.notes.filter(n => n.s < start + 16 || n.s >= start + 32);
    track.notes.push(...copied);
    selectedBar++;
  });

  tell("다음 마디에 복사했어요. 기존 다음 마디 내용은 되돌리기로 복원할 수 있어요.");
};

$("bpm").onchange = () => {
  stop(false);
  commit(() => {
    project.bpm = clamp(Math.round(Number($("bpm").value) || 86), 40, 200);
  });
};

$("bars").onchange = () => {
  stop(false);
  const bars = Number($("bars").value);

  commit(() => {
    project.bars = bars;
    for (const track of project.tracks) {
      track.notes = track.notes.filter(n => n.s < bars * 16);
      track.notes.forEach(n => n.d = Math.min(n.d, bars * 16 - n.s));
    }
  });

  tell("곡 길이를 바꿨어요. 줄여서 제외된 마디는 되돌리기로 복원할 수 있어요.");
};

$("swing").oninput = () => {
  $("swingValue").textContent = $("swing").value + "%";
};

$("swing").onchange = () => {
  stop(false);
  commit(() => project.swing = Number($("swing").value) / 100);
};

$("key").onchange = () => {
  commit(() => project.key = Number($("key").value));
  tell("화음 기준음을 바꿨어요. 새로 넣는 자동 화음에 적용돼요.");
};

$("trackInstrument").onchange = () => {
  const next = $("trackInstrument").value;
  const track = project.tracks[selectedTrack];
  const crossesDrums = (track.inst === "drums") !== (next === "drums");

  if (crossesDrums && track.notes.length) {
    $("trackInstrument").value = track.inst;
    tell("멜로디와 드럼은 음 체계가 달라요. 드럼은 새 트랙으로 추가해 주세요.");
    return;
  }

  commit(() => {
    const oldName = INSTRUMENTS[track.inst].name;
    track.inst = next;
    if (track.name === oldName) track.name = INSTRUMENTS[next].name;
  });
};

$("pan").oninput = () => {
  const value = Number($("pan").value);
  $("panValue").textContent = value === 0
    ? "가운데"
    : `${value < 0 ? "왼쪽" : "오른쪽"} ${Math.abs(value)}`;
};

$("pan").onchange = () => {
  commit(() => project.tracks[selectedTrack].pan = Number($("pan").value) / 100);
};

$("removeTrack").onclick = () => {
  if (project.tracks.length <= 1) {
    tell("최소 한 개의 트랙은 남겨주세요.");
    return;
  }

  stop(false);
  commit(() => project.tracks.splice(selectedTrack, 1));
  tell("선택 트랙을 삭제했어요. 되돌리기로 복원할 수 있어요.");
};

for (const id of ["master", "reverb", "delay"]) {
  $(id).oninput = () => {
    $(id + "Value").textContent = $(id).value + "%";

    if (liveGraph && audioContext) {
      const node = id === "master" ? liveGraph.master :
        id === "reverb" ? liveGraph.reverbGain : liveGraph.delayGain;
      node.gain.setTargetAtTime(Number($(id).value) / 100, audioContext.currentTime, 0.025);
    }
  };

  $(id).onchange = () => {
    commit(() => project[id] = Number($(id).value) / 100);
  };
}

$("moods").onclick = event => {
  const button = event.target.closest("[data-mood]");
  if (!button) return;
  mood = button.dataset.mood;
  renderHarmony();
};

$("applyChords").onclick = () => {
  if (project.tracks.length >= 12) {
    tell("트랙이 가득 찼어요. 필요 없는 트랙을 지운 뒤 다시 시도하세요.");
    return;
  }

  commit(() => {
    const track = makeTrack("piano", "화음 반주");
    const progression = PROGRESSIONS[mood];

    for (let bar = 0; bar < project.bars; bar++) {
      const [root, type] = progression[bar % 4];
      const base = 48 + ((root + project.key) % 12);

      for (const interval of CHORDS[type]) {
        addNote(track, bar * 16, base + interval, 16, 0.6);
      }
    }

    project.tracks.push(track);
    chooseTrack(project.tracks.length - 1);
  });

  tell("화음 반주를 새 트랙에 넣었어요. 기존 멜로디와 함께 들어보세요.");
};

function customChordNotes() {
  const base = Number($("octave").value) + Number($("chordRoot").value);
  const notes = CHORDS[$("chordType").value].map(interval => base + interval);
  const inversion = Number($("inversion").value);

  for (let i = 0; i < inversion; i++) {
    notes.push(notes.shift() + 12);
  }

  return notes.sort((a, b) => a - b);
}

$("previewChord").onclick = async () => {
  try {
    const ticket = generation;
    const ctx = await ensureAudio();
    if (ticket !== generation) return;
    if (!liveGraph) liveGraph = makeGraph(ctx, project);

    const track = { ...project.tracks[selectedTrack], mute: false };
    if (track.inst === "drums") track.inst = "piano";

    for (const midi of customChordNotes()) {
      playVoice(ctx, liveGraph, track, midi, ctx.currentTime + 0.02, 0.8, 0.65);
    }
  } catch (error) {
    tell(error.message);
  }
};

$("insertChord").onclick = () => {
  const track = project.tracks[selectedTrack];
  if (track.inst === "drums") return;

  const start = selectedBar * 16;
  const pitches = customChordNotes();

  commit(() => {
    track.notes = track.notes.filter(n =>
      !(pitches.includes(n.n) && n.s >= start && n.s < start + 16)
    );

    for (const midi of pitches) {
      addNote(track, start, midi, 16, Number($("velocity").value) / 100);
    }
  });

  tell("선택 마디에 화음을 넣었어요. 다른 높이의 기존 멜로디는 유지했어요.");
};

$("projectFile").onchange = async event => {
  const file = event.target.files[0];
  if (!file) return;

  try {
    if (file.size > 4 * 1024 * 1024) throw new Error("파일이 너무 커요.");
    const data = JSON.parse(await file.text());

    if (!validProject(data)) {
      throw new Error("실버스타 스튜디오 프로젝트 파일인지 확인해 주세요.");
    }

    stop(false);
    commit(() => {
      project = clone(data);
      selectedGenre = project.genre;
      selectedBar = 0;
      chooseTrack(0);
    });

    tell("프로젝트를 불러왔어요.");
  } catch (error) {
    tell(error.message || "파일을 불러오지 못했어요.");
  } finally {
    event.target.value = "";
  }
};

document.addEventListener("keydown", event => {
  const target = event.target;
  const editing = target instanceof HTMLElement &&
    (["INPUT", "SELECT", "TEXTAREA"].includes(target.tagName) || target.isContentEditable);

  if (editing || $("helpDialog").open) return;

  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") {
    event.preventDefault();
    if (event.shiftKey) redo();
    else undo();
  } else if (event.code === "Space" && target.tagName !== "BUTTON") {
    event.preventDefault();
    if (playing) stop();
    else start();
  }
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden && playing) {
    stop(false);
    tell("화면을 벗어나 재생을 멈췄어요. 들어보기를 눌러 다시 시작하세요.");
  }
});

window.addEventListener("pagehide", () => {
  clearTimeout(saveTimer);
  try { localStorage.setItem(STORE, JSON.stringify(project)); } catch {}
  stop(false);
});

/* ---------- 처음 실행 ---------- */

project = makeProject("ballad");

try {
  const saved = localStorage.getItem(STORE);
  if (saved) {
    const parsed = JSON.parse(saved);
    if (validProject(parsed)) {
      project = parsed;
      selectedGenre = project.genre;
      tell("이 브라우저에 자동저장된 작품을 불러왔어요.");
    }
  }
} catch {
  tell("자동저장을 읽지 못했어요. 프로젝트 파일로 저장해 주세요.");
}

chooseTrack(0);
render();