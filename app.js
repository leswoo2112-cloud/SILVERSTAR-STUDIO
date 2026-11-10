"use strict";

(() => {
  /* =====================================================
     실버스타 스튜디오 app.js
     1부: 기본 데이터와 프로젝트 생성
     다음 부분을 이 코드 아래에 이어 붙이세요.
     ===================================================== */

  const $ = id => document.getElementById(id);

  const $$ = selector =>
    [...document.querySelectorAll(selector)];

  const copy = value =>
    JSON.parse(JSON.stringify(value));

  const clamp = (n, a, b) =>
    Math.max(a, Math.min(b, n));

  const own = (object, key) =>
    Object.prototype.hasOwnProperty.call(object, key);

  const uid = () =>
    window.crypto?.randomUUID?.() ||
    `${Date.now().toString(36)}${Math.random()
      .toString(36)
      .slice(2)}`;

  const esc = value =>
    String(value ?? "").replace(/[&<>"']/g, c => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[c]));

  const TICKS = 24;
  const MAX_BARS = 64;
  const MAX_TRACKS = 16;

  const NOTES = [
    "C", "C♯", "D", "D♯", "E", "F",
    "F♯", "G", "G♯", "A", "A♯", "B"
  ];

  const KOREAN = [
    "도", "도♯", "레", "레♯", "미", "파",
    "파♯", "솔", "솔♯", "라", "라♯", "시"
  ];

  const NATURAL = [0, 2, 4, 5, 7, 9, 11];

  const COLORS = [
    "#c6a1ff", "#9debcf", "#f0b4a7", "#f4d58c",
    "#98bfff", "#eda8d3", "#b7db8c", "#91d8e5",
    "#d4b6ef", "#e9bd8b", "#adb7ff", "#a5d9bc",
    "#ebb4c3", "#a5c8e5", "#c4d3a2", "#dbb6a0"
  ];

  const INSTRUMENTS = {
    piano: [
      "피아노", "♬", "triangle", "keys"
    ],
    epiano: [
      "일렉 피아노", "♫", "sine", "keys"
    ],
    guitar: [
      "기타", "♪", "triangle", "pluck"
    ],
    bass: [
      "베이스", "♩", "sine", "bass"
    ],
    strings: [
      "스트링", "≋", "sawtooth", "sustain"
    ],
    flute: [
      "플루트", "〰", "sine", "wind"
    ],
    brass: [
      "브라스", "♮", "sawtooth", "wind"
    ],
    organ: [
      "오르간", "▥", "sine", "sustain"
    ],
    synth: [
      "리드 신스", "∿", "sawtooth", "sustain"
    ],
    pad: [
      "패드", "☁", "sine", "pad"
    ],
    bell: [
      "벨", "✧", "sine", "bell"
    ],
    drums: [
      "드럼", "◉", "sine", "drum"
    ],
    gayageum: [
      "가야금 · 합성", "♬", "triangle", "pluck"
    ],
    geomungo: [
      "거문고 · 합성", "♪", "triangle", "pluck"
    ],
    haegeum: [
      "해금 · 합성", "≋", "sawtooth", "sustain"
    ],
    daegeum: [
      "대금 · 합성", "〰", "sine", "wind"
    ],
    piri: [
      "피리 · 합성", "♮", "square", "wind"
    ],
    janggu: [
      "장구 · 합성", "◉", "sine", "drum"
    ],
    buk: [
      "북 · 합성", "●", "sine", "drum"
    ],
    jing: [
      "징 · 합성", "◎", "sine", "metal"
    ],
    kkwaeng: [
      "꽹과리 · 합성", "◌", "sine", "metal"
    ]
  };

  const GENRE_GROUPS = [
    ["popular", "발라드 팝 록 인디 R&B 소울 펑크"],
    ["beat", "힙합 랩 트랩 로파이"],
    ["electronic", "EDM 하우스 테크노 디스코"],
    ["jazz", "재즈 스윙 블루스 보사노바"],
    ["orchestral", "클래식 오케스트라 영화OST 게임음악"],
    ["stage", "뮤지컬 합창 동요 트로트"],
    ["traditional", "국악 국악퓨전 레게 라틴"],
    ["free", "자유작곡"]
  ];

  const GENRES = GENRE_GROUPS.flatMap(
    ([category, names]) =>
      names.split(" ").map(name => ({
        name,
        category
      }))
  );

  const FAMILY = {
    popular: {
      bpm: 86,
      instruments: ["piano", "bass", "strings", "drums"],
      icon: "♡",
      text: "멜로디와 반주를 함께 만드는 출발 설정"
    },
    beat: {
      bpm: 94,
      instruments: ["epiano", "bass", "drums", "synth"],
      icon: "♫",
      text: "드럼과 베이스 중심의 출발 설정"
    },
    electronic: {
      bpm: 124,
      instruments: ["synth", "bass", "drums", "pad"],
      icon: "∿",
      text: "반복 리듬과 신스 중심의 출발 설정"
    },
    jazz: {
      bpm: 108,
      instruments: ["piano", "bass", "drums", "guitar"],
      icon: "♬",
      text: "화음과 리듬 변화를 살펴보는 출발 설정"
    },
    orchestral: {
      bpm: 84,
      instruments: ["piano", "strings", "flute", "brass"],
      icon: "𝄞",
      text: "여러 악기의 선율을 구성하는 출발 설정"
    },
    stage: {
      bpm: 92,
      instruments: ["piano", "strings", "bass", "drums"],
      icon: "✦",
      text: "가사와 장면을 함께 구성하는 출발 설정"
    },
    traditional: {
      bpm: 90,
      instruments: [
        "gayageum", "daegeum", "haegeum", "janggu"
      ],
      icon: "◈",
      text: "국악은 가락·장단, 세계음악은 자유 편집으로 시작"
    },
    free: {
      bpm: 100,
      instruments: ["piano"],
      icon: "＋",
      text: "빈 작곡판에서 자유롭게 시작"
    }
  };

  const CHORDS = {
    maj: [0, 4, 7],
    min: [0, 3, 7],
    "7": [0, 4, 7, 10],
    maj7: [0, 4, 7, 11],
    m7: [0, 3, 7, 10],
    "9": [0, 4, 7, 10, 14],
    sus4: [0, 5, 7],
    dim: [0, 3, 6]
  };

  const PROGRESSIONS = {
    bright: [
      [0, "maj"], [7, "maj"], [9, "min"], [5, "maj"]
    ],
    emotional: [
      [9, "min"], [5, "maj"], [0, "maj"], [7, "maj"]
    ],
    calm: [
      [5, "maj7"], [0, "maj7"], [2, "m7"], [7, "7"]
    ],
    jazz: [
      [2, "m7"], [7, "7"], [0, "maj7"], [9, "7"]
    ]
  };

  const DYNAMICS = {
    pp: 0.36,
    p: 0.48,
    mp: 0.62,
    mf: 0.76,
    f: 0.9,
    ff: 1
  };

  const METERS = [
    "2/4", "3/4", "4/4", "6/8", "9/8", "12/8"
  ];

  const TORI = {
    free: {
      pcs: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      text:
        "음 구성을 제한하지 않아요. 참고한 곡의 중심음·종지·진행을 메모하세요."
    },
    gyeong: {
      pcs: [7, 9, 0, 2, 4],
      text:
        "진경토리 참고: 솔·라·도·레·미의 구조와 솔 종지를 살펴보세요. 화면의 음은 설명을 위한 상대적 예시예요."
    },
    bangyeong: {
      pcs: [9, 0, 2, 4, 7],
      text:
        "반경토리 참고: 라·도·레·미·솔의 구조와 라 종지를 살펴보세요. 구성음 강조만으로 토리가 완성되는 것은 아니에요."
    },
    menari: {
      pcs: [4, 7, 9, 0, 2],
      text:
        "메나리토리 참고: 상행과 하행의 쓰임이 달라요. 미·라·도·레의 상행과 라·솔·미 등의 하행 진행을 참고하세요. 지역·곡에 따른 차이가 있어요."
    },
    yukjabaegi: {
      pcs: [4, 9, 0, 11],
      text:
        "육자배기토리 참고: 미·라·도와 하행에서의 도·시·라 등을 살펴보세요. 떠는 음과 꺾는 음의 역할을 함께 고려해야 해요."
    },
    susimga: {
      pcs: [2, 4, 7, 9, 0],
      text:
        "수심가토리 참고: 레·미·솔·라·도의 음 구조와 라를 떠는 표현 등을 참고하세요. 음의 비중과 실제 가락은 곡에 따라 확인하세요."
    }
  };

  const DEFAULT_FX = {
    master: 70,
    reverb: 15,
    delay: 8,
    swing: 0,
    low: 0,
    mid: 0,
    high: 0,
    compressor: true
  };

  /* ---------- 프로그램 상태 ---------- */

  let project = null;
  let selectedGenre = "발라드";
  let category = "all";

  let selectedTrack = 0;
  let selectedBar = 0;
  let rangeEnd = 0;
  let selectedNoteId = null;

  let view = "score";
  let tool = "note";

  let undoStack = [];
  let redoStack = [];
  let clipboard = null;

  let comparison = null;
  let comparisonSide = "B";

  let autoTimer = null;
  let toastTimer = null;
  let databasePromise = null;

  let context = null;
  let runtime = null;
  let previewGraph = null;
  let playGeneration = 0;

  let recorder = null;
  let recordingStream = null;
  let recordingPending = false;
  let exporting = false;

  let decodedAudio = null;
  let decodedAudioData = null;
  let pointerState = null;

  /* ---------- 공통 함수 ---------- */

  function status(message, error = false) {
    $("statusMessage").textContent = message;
    $("statusMessage").classList.toggle("error", error);
  }

  function toast(message) {
    clearTimeout(toastTimer);

    $("toast").textContent = message;
    $("toast").hidden = false;

    toastTimer = setTimeout(() => {
      $("toast").hidden = true;
    }, 3500);
  }

  function dialog(title, html) {
    $("dialogTitle").textContent = title;
    $("dialogBody").innerHTML = html;

    if (!$("infoDialog").open) {
      $("infoDialog").showModal();
    }
  }

  function isRecording() {
    return (
      recordingPending ||
      recorder?.state === "recording"
    );
  }

  function canEdit() {
    if (isRecording()) {
      toast("녹음을 끝낸 뒤 편집해 주세요.");
      return false;
    }
    return true;
  }

  function currentTrack() {
    return project.tracks[selectedTrack];
  }

  function currentMeasure() {
    return project.measures[selectedBar];
  }

  function currentNote() {
    return currentTrack()?.notes.find(
      n => n.id === selectedNoteId
    ) || null;
  }

  function barTicks(measure) {
    const [count, unit] = measure.meter
      .split("/")
      .map(Number);

    return count * TICKS * 4 / unit;
  }

  function pitchName(pitch) {
    if (pitch === null) return "쉼표";

    return (
      `${KOREAN[pitch % 12]} ` +
      `${NOTES[pitch % 12]}${Math.floor(pitch / 12) - 1}`
    );
  }

  function isDrum(track) {
    return INSTRUMENTS[track.instrument][3] === "drum";
  }

  function cleanFilename(value) {
    return String(value || "실버스타_음악")
      .replace(/[\\/:*?"<>|]/g, "_")
      .trim() || "실버스타_음악";
  }

  function download(blob, name) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = name;

    document.body.appendChild(a);
    a.click();
    a.remove();

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 30000);
  }

  function newMeasure() {
    return {
      meter: "4/4",
      tempo: null,
      section: "",
      dynamic: "mf",
      ramp: "none",
      repeat: 1,
      lyrics: "",
      memo: ""
    };
  }

  function newTrack(instrument, name) {
    return {
      id: uid(),
      name: name || INSTRUMENTS[instrument][0],
      instrument,
      volume: 65,
      pan: 0,
      mute: false,
      solo: false,
      notes: []
    };
  }

  function newNote(
    bar,
    tick,
    pitch,
    duration,
    extra = {}
  ) {
    return {
      id: uid(),
      bar,
      tick,
      pitch,
      duration,
      base: duration,
      rhythm: "normal",
      accidental: 0,
      velocity: 85,
      articulation: "normal",
      ornament: "none",
      tie: false,
      lyric: "",
      ...extra
    };
  }

  function genreInfo(name) {
    return GENRES.find(g => g.name === name) || {
      name: "자유작곡",
      category: "free"
    };
  }

  /* ---------- 새 프로젝트 ---------- */

  function makeProject(genre, length, example) {
    const info = genreInfo(genre);
    let family = FAMILY[info.category];

    if (["레게", "라틴"].includes(genre)) {
      family = {
        ...FAMILY.popular,
        bpm: genre === "레게" ? 84 : 108,
        instruments: [
          "guitar", "bass", "drums", "piano"
        ]
      };
    }

    const p = {
      version: 3,
      id: uid(),

      title:
        $("setupTitle").value.trim() ||
        "제목 없는 음악",

      composer:
        $("setupComposer").value.trim(),

      lyricist: "",
      arranger: "",
      description: "",

      genre,
      bpm: family.bpm,

      effects: {
        ...DEFAULT_FX
      },

      gugak: {
        category: "creative",
        tori: "free",
        memo: "",
        jangdan: "custom"
      },

      measures: Array.from(
        { length },
        newMeasure
      ),

      tracks: family.instruments.map(
        instrument => newTrack(instrument)
      ),

      audio: null
    };

    if (["재즈", "스윙"].includes(genre)) {
      p.effects.swing = 22;
    }

    if (genre === "국악" || genre === "국악퓨전") {
      p.measures.forEach(measure => {
        measure.meter = "12/8";
      });
    }

    p.measures[0].section = "도입";

    if (length >= 8) {
      p.measures[4].section = "전개";
    }

    if (length >= 16) {
      p.measures[8].section = "후렴";
    }

    if (example) {
      fillExample(p);
    }

    return p;
  }

  /* ---------- 연습용 예제 생성 ---------- */

  function fillExample(p) {
    const traditional = [
      "국악", "국악퓨전"
    ].includes(p.genre);

    const jazz =
      genreInfo(p.genre).category === "jazz";

    const progression =
      PROGRESSIONS[jazz ? "jazz" : "emotional"];

    p.measures.forEach((measure, bar) => {
      const length = barTicks(measure);

      const [root, type] =
        progression[bar % 4];

      p.tracks.forEach((track, index) => {
        if (isDrum(track)) {
          for (
            let tick = 0;
            tick < length;
            tick += 12
          ) {
            const pitch = traditional
              ? (tick % 36 === 0 ? 36 : 38)
              : (
                tick % 48 === 0
                  ? 36
                  : tick % 24 === 0
                    ? 38
                    : 42
              );

            track.notes.push(
              newNote(bar, tick, pitch, 6, {
                base: 6,
                velocity:
                  tick % 24 === 0 ? 95 : 60
              })
            );
          }
        } else if (traditional) {
          const pitches = [
            64, 69, 72, 74, 72, 69
          ];

          for (
            let tick = 0, j = 0;
            tick < length;
            tick += 24, j++
          ) {
            const pitch =
              pitches[
                (j + bar + index) % pitches.length
              ] - (index === 2 ? 12 : 0);

            track.notes.push(
              newNote(
                bar,
                tick,
                pitch,
                Math.min(24, length - tick),
                {
                  velocity: 65 + index * 5
                }
              )
            );
          }
        } else if (track.instrument === "bass") {
          for (
            let tick = 0;
            tick < length;
            tick += 48
          ) {
            track.notes.push(
              newNote(
                bar,
                tick,
                36 + root,
                Math.min(36, length - tick),
                {
                  base: 24,
                  rhythm: "dotted",
                  velocity: 85
                }
              )
            );
          }
        } else if (index === 0) {
          CHORDS[type].forEach(interval => {
            track.notes.push(
              newNote(
                bar,
                0,
                48 + root + interval,
                length,
                {
                  base: length === 96 ? 96 : 48,
                  velocity: 68
                }
              )
            );
          });
        } else {
          [0, 4, 7, 4].forEach((interval, i) => {
            const tick = i * 24;

            if (tick >= length) return;

            track.notes.push(
              newNote(
                bar,
                tick,
                60 + root + interval,
                Math.min(12, length - tick),
                {
                  base: 12,
                  velocity: 75
                }
              )
            );
          });
        }
      });
    });
  }

  // ===== 1부 끝 · 다음 코드를 바로 아래에 이어 붙이세요. =====
// ===== app.js 2부: 저장 · 되돌리기 · 기본 화면 =====

function openDatabase() {
  if (!databasePromise) {
    databasePromise = new Promise((resolve, reject) => {
      if (!window.indexedDB) {
        reject(new Error("이 브라우저에서 자동저장을 사용할 수 없습니다."));
        return;
      }

      const request = indexedDB.open("silverstar-studio-v3", 1);

      request.onupgradeneeded = () => {
        const db = request.result;

        if (!db.objectStoreNames.contains("items")) {
          db.createObjectStore("items");
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  return databasePromise;
}

async function storageGet(key) {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction("items", "readonly");
    const request = transaction.objectStore("items").get(key);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function storageSet(key, value) {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction("items", "readwrite");

    transaction.objectStore("items").put(value, key);

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => {
      reject(transaction.error || new Error("저장이 중단되었습니다."));
    };
  });
}

function autosave() {
  clearTimeout(autoTimer);

  if (!project) return;

  autoTimer = setTimeout(async () => {
    try {
      await storageSet("autosave", copy(project));
      $("resumeBtn").hidden = false;
    } catch (error) {
      status(
        "자동저장에 실패했어요. ‘저장하기’로 프로젝트 파일을 받아 주세요.",
        true
      );
    }
  }, 500);
}

function updateHistory() {
  $("undoBtn").disabled = undoStack.length === 0;
  $("redoBtn").disabled = redoStack.length === 0;
}

function edit(action, message = "변경 내용을 반영했어요.") {
  if (!project || !canEdit()) return false;

  stopPlayback(false);

  const previous = copy(project);

  try {
    action();
  } catch (error) {
    project = previous;
    render();
    toast(error.message || "변경 내용을 적용하지 못했어요.");
    return false;
  }

  undoStack.push(previous);

  if (undoStack.length > 30) {
    undoStack.shift();
  }

  redoStack = [];

  selectedTrack = clamp(
    selectedTrack,
    0,
    project.tracks.length - 1
  );

  selectedBar = clamp(
    selectedBar,
    0,
    project.measures.length - 1
  );

  rangeEnd = clamp(
    rangeEnd,
    selectedBar,
    project.measures.length - 1
  );

  if (!currentNote()) {
    selectedNoteId = null;
  }

  autosave();
  render();
  status(message);

  return true;
}

function restoreProject(savedProject) {
  project = copy(savedProject);

  selectedTrack = 0;
  selectedBar = 0;
  rangeEnd = 0;
  selectedNoteId = null;

  decodedAudio = null;
  decodedAudioData = null;

  selectedGenre = project.genre;

  autosave();
  render();
}

function undo() {
  if (!project || !undoStack.length || !canEdit()) return;

  stopPlayback(false);

  redoStack.push(copy(project));
  restoreProject(undoStack.pop());

  status("이전 상태로 되돌렸어요.");
}

function redo() {
  if (!project || !redoStack.length || !canEdit()) return;

  stopPlayback(false);

  undoStack.push(copy(project));
  restoreProject(redoStack.pop());

  status("취소한 작업을 다시 적용했어요.");
}

// 프로젝트 파일의 형식과 데이터 범위를 확인합니다.
function validateProject(raw) {
  const fail = message => {
    throw new Error(`프로젝트 파일 확인: ${message}`);
  };

  const object = (value, label) => {
    if (
      !value ||
      typeof value !== "object" ||
      Array.isArray(value)
    ) {
      fail(`${label} 형식이 올바르지 않아요.`);
    }

    return value;
  };

  const number = (value, min, max, label) => {
    if (
      typeof value !== "number" ||
      !Number.isFinite(value) ||
      value < min ||
      value > max
    ) {
      fail(`${label} 값이 허용 범위를 벗어났어요.`);
    }

    return value;
  };

  const integer = (value, min, max, label) => {
    number(value, min, max, label);

    if (!Number.isInteger(value)) {
      fail(`${label} 값은 정수여야 해요.`);
    }

    return value;
  };

  const text = (value, max, label) => {
    if (typeof value !== "string" || value.length > max) {
      fail(`${label} 내용이 올바르지 않아요.`);
    }

    return value;
  };

  const boolean = (value, label) => {
    if (typeof value !== "boolean") {
      fail(`${label} 설정이 올바르지 않아요.`);
    }

    return value;
  };

  const choice = (value, options, label) => {
    if (!options.includes(value)) {
      fail(`${label} 설정을 확인해 주세요.`);
    }

    return value;
  };

  object(raw, "프로젝트");

  if (raw.version !== 3) {
    fail("이 코드는 버전 3 프로젝트 파일을 불러올 수 있어요.");
  }

  const p = copy(raw);

  text(p.id, 100, "프로젝트 번호");
  text(p.title, 80, "곡 제목");
  text(p.composer, 60, "작곡자");
  text(p.lyricist, 60, "작사가");
  text(p.arranger, 60, "편곡자");
  text(p.description, 2000, "곡 설명");
  text(p.genre, 40, "장르");

  number(p.bpm, 30, 240, "빠르기");

  if (
    !Array.isArray(p.measures) ||
    p.measures.length < 1 ||
    p.measures.length > MAX_BARS
  ) {
    fail(`마디는 1~${MAX_BARS}개까지 사용할 수 있어요.`);
  }

  if (
    !Array.isArray(p.tracks) ||
    p.tracks.length < 1 ||
    p.tracks.length > MAX_TRACKS
  ) {
    fail(`악기 트랙은 1~${MAX_TRACKS}개까지 사용할 수 있어요.`);
  }

  object(p.effects, "음향 효과");

  number(p.effects.master, 0, 100, "전체 음량");
  number(p.effects.reverb, 0, 60, "잔향");
  number(p.effects.delay, 0, 50, "딜레이");
  number(p.effects.swing, 0, 45, "스윙");
  number(p.effects.low, -12, 12, "저음");
  number(p.effects.mid, -12, 12, "중음");
  number(p.effects.high, -12, 12, "고음");

  boolean(p.effects.compressor, "컴프레서");

  object(p.gugak, "국악 설정");

  text(p.gugak.category, 30, "국악 분류");
  text(p.gugak.jangdan, 30, "장단");
  text(p.gugak.memo, 1000, "토리 메모");

  if (!own(TORI, p.gugak.tori)) {
    fail("토리 설정을 확인해 주세요.");
  }

  p.measures.forEach((measure, index) => {
    const label = `${index + 1}마디`;

    object(measure, label);
    choice(measure.meter, METERS, `${label} 박자`);

    if (measure.tempo !== null) {
      number(measure.tempo, 30, 240, `${label} 빠르기`);
    }

    text(measure.section, 30, `${label} 구간 이름`);

    if (!own(DYNAMICS, measure.dynamic)) {
      fail(`${label} 셈여림 설정이 올바르지 않아요.`);
    }

    choice(
      measure.ramp,
      ["none", "crescendo", "decrescendo"],
      `${label} 음량 변화`
    );

    choice(measure.repeat, [1, 2], `${label} 반복`);
    text(measure.lyrics, 1000, `${label} 가사`);
    text(measure.memo, 600, `${label} 메모`);
  });

  const trackIds = new Set();
  const noteIds = new Set();

  let totalNotes = 0;

  p.tracks.forEach((track, trackIndex) => {
    const label = `${trackIndex + 1}번 악기`;

    object(track, label);

    text(track.id, 100, `${label} 번호`);
    text(track.name, 40, `${label} 이름`);

    if (!track.id || trackIds.has(track.id)) {
      fail("악기 번호가 없거나 중복되어 있어요.");
    }

    trackIds.add(track.id);

    if (!own(INSTRUMENTS, track.instrument)) {
      fail(`${label}의 악기를 찾을 수 없어요.`);
    }

    number(track.volume, 0, 100, `${label} 음량`);
    number(track.pan, -100, 100, `${label} 좌우 위치`);

    boolean(track.mute, `${label} 음소거`);
    boolean(track.solo, `${label} 단독 재생`);

    if (!Array.isArray(track.notes)) {
      fail(`${label}의 음표 목록이 올바르지 않아요.`);
    }

    totalNotes += track.notes.length;

    if (totalNotes > 20000) {
      fail("한 프로젝트에는 음표와 쉼표를 20,000개까지 넣을 수 있어요.");
    }

    track.notes.forEach(note => {
      object(note, "음표");
      text(note.id, 100, "음표 번호");

      if (!note.id || noteIds.has(note.id)) {
        fail("음표 번호가 없거나 중복되어 있어요.");
      }

      noteIds.add(note.id);

      integer(
        note.bar,
        0,
        p.measures.length - 1,
        "음표의 마디 위치"
      );

      const length = barTicks(p.measures[note.bar]);

      integer(note.tick, 0, length - 1, "음표 시작 위치");
      integer(note.duration, 1, length, "음표 길이");

      if (note.tick + note.duration > length) {
        fail(`${note.bar + 1}마디 밖으로 나가는 음표가 있어요.`);
      }

      if (note.pitch !== null) {
        integer(note.pitch, 24, 108, "음 높이");
      }

      number(note.base, 1, 192, "기본 음표 길이");

      choice(
        note.rhythm,
        ["normal", "dotted", "triplet"],
        "음표 리듬"
      );

      choice(note.accidental, [-1, 0, 1], "임시표");
      number(note.velocity, 1, 127, "음 강도");

      choice(
        note.articulation,
        [
          "normal",
          "staccato",
          "tenuto",
          "accent",
          "legato",
          "fermata"
        ],
        "연주 기호"
      );

      choice(
        note.ornament,
        ["none", "vibrato", "rise", "fall", "bend"],
        "꾸밈음 설정"
      );

      boolean(note.tie, "붙임줄");
      text(note.lyric, 40, "음표 가사");
    });
  });

  if (p.audio !== null) {
    object(p.audio, "녹음");

    text(p.audio.name, 180, "녹음 이름");
    number(p.audio.offset, -30, 300, "녹음 시작 위치");
    number(p.audio.volume, 0, 100, "녹음 음량");
    text(p.audio.data, 30000000, "녹음 데이터");

    if (
      !/^data:audio\/[^,]+;base64,[A-Za-z0-9+/=]+$/.test(
        p.audio.data
      )
    ) {
      fail("녹음 데이터 형식이 올바르지 않아요.");
    }
  }

  return p;
}

// 뒤쪽 코드에서도 사용할 수 있는 확인 함수입니다.
function validate(raw) {
  return validateProject(raw);
}

function renderGenres() {
  const query = $("genreSearch").value.trim().toLowerCase();

  const filtered = GENRES.filter(genre => {
    const matchesCategory =
      category === "all" || genre.category === category;

    const matchesQuery =
      genre.name.toLowerCase().includes(query);

    return matchesCategory && matchesQuery;
  });

  $("genreGrid").innerHTML = filtered.map(genre => {
    const family = FAMILY[genre.category] || FAMILY.free;
    const active = genre.name === selectedGenre;

    return `
      <button
        type="button"
        class="genre-card ${active ? "active" : ""}"
        data-genre="${esc(genre.name)}"
        aria-pressed="${active}"
      >
        <span aria-hidden="true">${esc(family.icon)}</span>
        <strong>${esc(genre.name)}</strong>
      </button>
    `;
  }).join("");

  $("genreEmptyMessage").hidden = filtered.length !== 0;

  $$("[data-category]").forEach(button => {
    const active = button.dataset.category === category;

    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  const selected = genreInfo(selectedGenre);
  const family = FAMILY[selected.category] || FAMILY.free;

  $("genreDescription").textContent =
    `${selectedGenre} · ${family.text || "악기와 빠르기를 자유롭게 바꿔 보세요."}`;
}

function showStudio() {
  $("startScreen").hidden = true;
  $("studioScreen").hidden = false;

  render();

  window.scrollTo({
    top: 0,
    behavior: "auto"
  });
}

function selectBar(bar, track = selectedTrack) {
  if (!project) return;

  selectedBar = clamp(bar, 0, project.measures.length - 1);
  selectedTrack = clamp(track, 0, project.tracks.length - 1);

  rangeEnd = selectedBar;
  selectedNoteId = null;

  render();
}

function setValue(id, value) {
  const element = $(id);

  if (!element || document.activeElement === element) return;

  element.value = value ?? "";
}

function render() {
  if (!project) return;

  setValue("projectTitle", project.title);
  setValue("projectComposer", project.composer);
  setValue("tempo", project.bpm);
  setValue("lyricist", project.lyricist);
  setValue("arranger", project.arranger);
  setValue("projectDescription", project.description);

  $("currentGenre").textContent = project.genre;
  $("trackCount").textContent = `${project.tracks.length}개`;

  renderTracks();
  renderArrangement();
  renderMeasure();
  renderEditor();
  renderHarmony();
  renderAudio();
  renderEffects();

  setValue("gugakCategory", project.gugak.category);
  setValue("toriSelect", project.gugak.tori);
  setValue("toriMemo", project.gugak.memo);
  setValue("jangdanSelect", project.gugak.jangdan);

  const tori = TORI[project.gugak.tori] || TORI.free;

  $("toriDescription").textContent =
    tori.text || tori.description || "";

  $$("[data-view]").forEach(button => {
    const active = button.dataset.view === view;

    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  $$("[data-tool]").forEach(button => {
    const active = button.dataset.tool === tool;

    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  updateHistory();
}

function renderTracks() {
  $("trackList").innerHTML = project.tracks.map((track, index) => {
    const instrument = INSTRUMENTS[track.instrument];
    const color = COLORS[index % COLORS.length];
    const active = index === selectedTrack;

    const noteCount = track.notes.filter(
      note => note.pitch !== null
    ).length;

    return `
      <button
        type="button"
        class="track-item
          ${active ? "active" : ""}
          ${track.mute ? "muted" : ""}"
        data-track-select="${index}"
        style="--track-color:${color}"
        aria-pressed="${active}"
      >
        <span aria-hidden="true">${esc(instrument[1])}</span>

        <span>
          <strong>${esc(track.name)}</strong>
          <small>${esc(instrument[0])} · ${noteCount}음</small>
        </span>

        <span class="track-badges">
          ${track.mute ? '<span class="chip">음소거</span>' : ""}
          ${track.solo ? '<span class="chip">단독</span>' : ""}
        </span>
      </button>
    `;
  }).join("");

  const track = currentTrack();

  setValue("trackName", track.name);
  setValue("trackInstrument", track.instrument);
  setValue("trackVolume", track.volume);
  setValue("trackPan", track.pan);

  $("trackVolumeValue").textContent = `${track.volume}%`;

  $("trackPanValue").textContent =
    track.pan === 0
      ? "중앙"
      : `${track.pan < 0 ? "왼쪽" : "오른쪽"} ${Math.abs(track.pan)}`;

  $("muteTrackBtn").classList.toggle("active", track.mute);
  $("muteTrackBtn").setAttribute(
    "aria-pressed",
    String(track.mute)
  );
  $("muteTrackBtn").textContent =
    track.mute ? "음소거 해제" : "음소거";

  $("soloTrackBtn").classList.toggle("active", track.solo);
  $("soloTrackBtn").setAttribute(
    "aria-pressed",
    String(track.solo)
  );
  $("soloTrackBtn").textContent =
    track.solo ? "단독 재생 해제" : "단독 재생";
}

function renderArrangement() {
  const arrangement = $("arrangement");

  arrangement.style.setProperty(
    "--measure-count",
    project.measures.length
  );

  const header = `
    <div class="arrangement-header">
      <div>악기 / 마디</div>

      ${project.measures.map((measure, index) => `
        <div>
          <strong>${index + 1}마디</strong>
          <small>
            ${esc(measure.section || "")}
            ${esc(measure.meter)}
          </small>
        </div>
      `).join("")}
    </div>
  `;

  const rows = project.tracks.map((track, trackIndex) => {
    const color = COLORS[trackIndex % COLORS.length];
    const instrument = INSTRUMENTS[track.instrument];

    const clips = project.measures.map((measure, bar) => {
      const notes = track.notes.filter(note => note.bar === bar);
      const sounding = notes.filter(note => note.pitch !== null);
      const length = barTicks(measure);

      const active =
        trackIndex === selectedTrack && bar === selectedBar;

      const inRange =
        trackIndex === selectedTrack &&
        bar >= selectedBar &&
        bar <= rangeEnd;

      const preview = [...sounding]
        .sort((a, b) => a.tick - b.tick || a.pitch - b.pitch)
        .slice(0, 48)
        .map(note => {
          const left = note.tick / length * 100;

          const width = Math.max(
            1,
            Math.min(
              note.duration / length * 100,
              100 - left
            )
          );

          const top = isDrum(track)
            ? 10 + (Math.abs(note.pitch) % 4) * 6
            : clamp(36 - (note.pitch - 48) * 0.8, 3, 36);

          return `
            <i
              style="
                position:absolute;
                left:${left}%;
                width:${width}%;
                top:${top}px;
                height:5px;
                border-radius:4px;
                background:${color};
              "
            ></i>
          `;
        }).join("");

      return `
        <button
          type="button"
          class="measure-clip
            ${active ? "active" : ""}
            ${inRange ? "in-range" : ""}
            ${notes.length === 0 ? "empty" : ""}"
          data-bar-select="${bar}"
          data-track-index="${trackIndex}"
          style="--track-color:${color}"
          aria-label="${esc(track.name)} ${bar + 1}마디"
          aria-pressed="${active}"
        >
          <span
            class="clip-bars"
            style="position:relative;display:block;height:44px"
            aria-hidden="true"
          >
            ${preview}
          </span>

          <small>
            ${
              notes.length === 0
                ? "터치해서 만들기"
                : `${sounding.length}음${
                    notes.length > sounding.length
                      ? ` · 쉼표 ${notes.length - sounding.length}`
                      : ""
                  }`
            }
          </small>
        </button>
      `;
    }).join("");

    return `
      <div
        class="arrangement-row"
        style="--track-color:${color}"
      >
        <button
          type="button"
          class="arrangement-track"
          data-track-select="${trackIndex}"
        >
          <strong>
            ${esc(instrument[1])} ${esc(track.name)}
          </strong>
          <small>
            ${track.mute ? "음소거" : `${track.volume}%`}
            ${track.solo ? " · 단독" : ""}
          </small>
        </button>

        ${clips}
      </div>
    `;
  }).join("");

  arrangement.innerHTML = header + rows;
}

function renderMeasure() {
  const measure = currentMeasure();

  $("measureHeading").textContent =
    rangeEnd > selectedBar
      ? `${selectedBar + 1}~${rangeEnd + 1}마디 설정`
      : `${selectedBar + 1}마디 설정`;

  setValue("sectionName", measure.section);
  setValue("measureMeter", measure.meter);
  setValue("measureTempo", measure.tempo ?? "");
  setValue("measureDynamic", measure.dynamic);
  setValue("measureRamp", measure.ramp);
  setValue("measureRepeat", measure.repeat);
  setValue("measureLyrics", measure.lyrics);
  setValue("measureMemo", measure.memo);

  $("rangeEnd").innerHTML = project.measures.map((_, index) => `
    <option
      value="${index}"
      ${index < selectedBar ? "disabled" : ""}
      ${index === rangeEnd ? "selected" : ""}
    >
      ${index + 1}마디까지
    </option>
  `).join("");

  $("previousMeasureBtn").disabled = selectedBar === 0;

  $("nextMeasureBtn").disabled =
    selectedBar === project.measures.length - 1;
}

// ===== 2부 끝 · 다음 코드를 바로 아래에 이어 붙이세요. =====
// ===== app.js 3부: 악보 · 음표 · 작곡판 표시 =====

function noteSettings() {
  const base = Number($("noteDuration").value);
  const rhythm = $("noteRhythm").value;

  const multiplier =
    rhythm === "dotted" ? 1.5 :
    rhythm === "triplet" ? 2 / 3 : 1;

  return {
    base,
    rhythm,
    duration: Math.max(1, Math.round(base * multiplier)),
    accidental: Number($("noteAccidental").value),
    velocity: clamp(Number($("noteVelocity").value), 1, 127),
    articulation: $("noteArticulation").value,
    ornament: $("noteOrnament").value
  };
}

function snapTick(tick) {
  const step = $("noteRhythm").value === "triplet" ? 2 : 6;
  return Math.round(tick / step) * step;
}

function naturalIndex(pitch, accidental = 0) {
  const target = pitch - accidental;

  let bestIndex = 0;
  let bestDistance = Infinity;

  for (let octave = 0; octave <= 8; octave++) {
    NATURAL.forEach((semitone, degree) => {
      const midi = (octave + 1) * 12 + semitone;
      const distance = Math.abs(midi - target);

      if (distance < bestDistance) {
        bestDistance = distance;
        bestIndex = octave * 7 + degree;
      }
    });
  }

  return bestIndex;
}

function midiFromIndex(index) {
  const octave = Math.floor(index / 7);
  const degree = ((index % 7) + 7) % 7;

  return clamp(
    (octave + 1) * 12 + NATURAL[degree],
    24,
    108
  );
}

function scoreReference() {
  return $("editorClef").value === "bass" ? 18 : 30;
}

function scoreY(pitch, accidental = 0) {
  return 270 -
    (naturalIndex(pitch, accidental) - scoreReference()) * 6;
}

function scorePitch(y) {
  const index = scoreReference() + Math.round((270 - y) / 6);

  return clamp(
    midiFromIndex(index) + Number($("noteAccidental").value),
    24,
    108
  );
}

function ornamentLabel(value) {
  return {
    none: "",
    vibrato: "∿",
    rise: "↗",
    fall: "↘",
    bend: "⌁"
  }[value] || "";
}

function restShape(x, y, base, color) {
  if (base >= 96) {
    return `
      <path d="M${x - 11} ${y - 6}h22"
        stroke="${color}" stroke-width="1.5"/>
      <rect x="${x - 8}" y="${y - 6}"
        width="16" height="7" fill="${color}"/>
    `;
  }

  if (base >= 48) {
    return `
      <path d="M${x - 11} ${y}h22"
        stroke="${color}" stroke-width="1.5"/>
      <rect x="${x - 8}" y="${y - 7}"
        width="16" height="7" fill="${color}"/>
    `;
  }

  if (base >= 24) {
    return `
      <path
        d="M${x - 4} ${y - 17}
           l9 11 -8 9 7 9
           q-13 -7 -8 -12
           l3 -4 -7 -10z"
        fill="${color}"
      />
    `;
  }

  return `
    <path
      d="M${x + 7} ${y - 13}l-9 30"
      stroke="${color}" stroke-width="3" fill="none"
    />
    <circle cx="${x - 3}" cy="${y - 8}"
      r="4" fill="${color}"/>
    <path d="M${x - 3} ${y - 8}q6 4 10 -5"
      stroke="${color}" stroke-width="2" fill="none"/>
    ${
      base <= 6
        ? `
          <circle cx="${x - 6}" cy="${y + 1}"
            r="4" fill="${color}"/>
          <path d="M${x - 6} ${y + 1}q6 4 10 -5"
            stroke="${color}" stroke-width="2" fill="none"/>
        `
        : ""
    }
  `;
}

function scoreSVG(track, bar, printable = false) {
  const measure = project.measures[bar];
  const length = barTicks(measure);
  const [count, unit] = measure.meter.split("/").map(Number);

  const trackIndex = project.tracks.indexOf(track);
  const color = printable
    ? "#202020"
    : COLORS[Math.max(0, trackIndex) % COLORS.length];

  const muted = printable ? "#777" : "#8d92a4";
  const staffColor = printable ? "#777" : "#74798c";
  const textColor = printable ? "#202020" : "#edeaf6";
  const xAt = tick => 115 + tick / length * 800;

  const staff = [222, 234, 246, 258, 270].map(y => `
    <line x1="24" y1="${y}" x2="930" y2="${y}"
      stroke="${staffColor}" stroke-width="1.2"/>
  `).join("");

  const beatTicks = TICKS * 4 / unit;

  const beats = Array.from({ length: count + 1 }, (_, index) => {
    const x = xAt(index * beatTicks);

    return `
      <line x1="${x}" y1="112" x2="${x}" y2="388"
        stroke="${muted}" opacity="0.15"
        stroke-dasharray="3 6"/>
      ${
        index < count
          ? `<text x="${x + 5}" y="106"
               font-size="12" fill="${muted}">${index + 1}</text>`
          : ""
      }
    `;
  }).join("");

  const notes = track.notes
    .filter(note => note.bar === bar)
    .sort((a, b) => a.tick - b.tick || (a.pitch || 0) - (b.pitch || 0))
    .map(note => {
      const x = xAt(note.tick);
      const y = note.pitch === null
        ? 246
        : scoreY(note.pitch, note.accidental);

      const selected = !printable && note.id === selectedNoteId;
      const ink = selected ? "#ffffff" : color;
      let drawing = "";

      if (note.pitch === null) {
        drawing = restShape(x, y, note.base, ink);
      } else {
        const index = naturalIndex(note.pitch, note.accidental);
        const naturalPitch = midiFromIndex(index);

        const accidental =
          note.accidental !== 0
            ? note.accidental
            : note.pitch - naturalPitch;

        const ledgerLines = [];

        if (y <= 210) {
          for (let ledger = 210; ledger >= y; ledger -= 12) {
            ledgerLines.push(ledger);
          }
        }

        if (y >= 282) {
          for (let ledger = 282; ledger <= y; ledger += 12) {
            ledgerLines.push(ledger);
          }
        }

        const ledgerSVG = ledgerLines.map(ledger => `
          <line x1="${x - 13}" y1="${ledger}"
            x2="${x + 13}" y2="${ledger}"
            stroke="${ink}" stroke-width="1.3"/>
        `).join("");

        const open = note.base >= 48;
        const stemUp = y >= 246;
        const stemX = x + (stemUp ? 8 : -8);
        const stemEnd = y + (stemUp ? -36 : 36);

        const stem = note.base < 96
          ? `
            <line
              x1="${stemX}" y1="${y}"
              x2="${stemX}" y2="${stemEnd}"
              stroke="${ink}" stroke-width="2"
            />
          `
          : "";

        let flags = "";

        if (note.base <= 12) {
          const direction = stemUp ? 1 : -1;
          const flagCount = note.base <= 6 ? 2 : 1;

          for (let flag = 0; flag < flagCount; flag++) {
            const fy = stemEnd + direction * flag * 8;

            flags += `
              <path
                d="M${stemX} ${fy}
                   q18 ${direction * 8} 8 ${direction * 23}"
                fill="none" stroke="${ink}" stroke-width="3"
              />
            `;
          }
        }

        const accidentalSVG = accidental === 0 ? "" : `
          <text x="${x - 26}" y="${y + 7}"
            fill="${ink}" font-size="25">
            ${accidental < 0 ? "♭" : "♯"}
          </text>
        `;

        drawing = `
          ${ledgerSVG}
          ${accidentalSVG}
          <ellipse
            cx="${x}" cy="${y}" rx="9" ry="6"
            transform="rotate(-18 ${x} ${y})"
            fill="${open ? "none" : ink}"
            stroke="${ink}" stroke-width="2"
          />
          ${stem}
          ${flags}
        `;

        const markY = Math.min(y - 20, stemUp ? stemEnd - 12 : y - 20);

        if (note.articulation === "staccato") {
          drawing += `
            <circle cx="${x}" cy="${markY}" r="2.8" fill="${ink}"/>
          `;
        }

        if (note.articulation === "tenuto") {
          drawing += `
            <line x1="${x - 7}" y1="${markY}"
              x2="${x + 7}" y2="${markY}"
              stroke="${ink}" stroke-width="2"/>
          `;
        }

        if (note.articulation === "accent") {
          drawing += `
            <text x="${x - 7}" y="${markY}"
              fill="${ink}" font-size="22">&gt;</text>
          `;
        }

        if (note.articulation === "fermata") {
          drawing += `
            <path
              d="M${x - 11} ${markY}q11 -17 22 0"
              fill="none" stroke="${ink}" stroke-width="2"/>
            <circle cx="${x}" cy="${markY - 3}"
              r="2.5" fill="${ink}"/>
          `;
        }

        if (note.articulation === "legato") {
          drawing += `
            <text x="${x - 15}" y="${markY - 2}"
              fill="${ink}" font-size="11">leg.</text>
          `;
        }

        if (note.tie) {
          const endX = xAt(Math.min(length, note.tick + note.duration));

          drawing += `
            <path
              d="M${x + 4} ${y + 14}
                 Q${(x + endX) / 2} ${y + 33}
                 ${endX - 3} ${y + 14}"
              fill="none" stroke="${ink}" stroke-width="1.8"
            />
          `;
        }
      }

      if (note.rhythm === "dotted") {
        drawing += `
          <circle cx="${x + 17}" cy="${y - 3}"
            r="2.5" fill="${ink}"/>
        `;
      }

      if (note.rhythm === "triplet") {
        drawing += `
          <text x="${x - 4}" y="${y - 54}"
            fill="${ink}" font-size="14">3</text>
        `;
      }

      const ornament = ornamentLabel(note.ornament);

      if (ornament) {
        drawing += `
          <text x="${x - 9}" y="${y - 73}"
            fill="${ink}" font-size="23">${ornament}</text>
        `;
      }

      const label = $("showNoteNames").checked
        ? `<text x="${x}" y="425" text-anchor="middle"
             fill="${muted}" font-size="11">
             ${esc(note.pitch === null ? "쉼" : pitchName(note.pitch))}
           </text>`
        : "";

      return `
        <g data-note-id="${esc(note.id)}">
          ${
            selected
              ? `<rect x="${x - 18}" y="${y - 48}"
                   width="36" height="94" rx="8"
                   fill="${color}" opacity="0.2"/>`
              : ""
          }
          <rect x="${x - 17}" y="${y - 43}"
            width="34" height="83" fill="transparent"/>
          ${drawing}
          ${label}
          ${
            note.lyric
              ? `<text x="${x}" y="454" text-anchor="middle"
                   fill="${textColor}" font-size="13">
                   ${esc(note.lyric)}
                 </text>`
              : ""
          }
        </g>
      `;
    }).join("");

  const ramp = measure.ramp === "none" ? "" : `
    <path
      d="${
        measure.ramp === "crescendo"
          ? "M350 366L700 356M350 366L700 376"
          : "M350 356L700 366M350 376L700 366"
      }"
      stroke="${color}" stroke-width="1.5" fill="none"
    />
  `;

  return `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 960 480"
      width="960" height="480"
      role="img"
      aria-label="${esc(track.name)} ${bar + 1}마디 악보"
    >
      <text x="24" y="35" fill="${textColor}" font-size="18">
        ${bar + 1}마디 · ${esc(track.name)}
      </text>
      <text x="24" y="63" fill="${muted}" font-size="13">
        ${esc(measure.section || "")}
        ${measure.tempo ? ` · ♩ = ${measure.tempo}` : ""}
      </text>

      ${beats}
      ${staff}

      <text x="25" y="267" fill="${textColor}" font-size="58">
        ${$("editorClef").value === "bass" ? "𝄢" : "𝄞"}
      </text>
      <text x="84" y="241" text-anchor="middle"
        fill="${textColor}" font-size="22">${count}</text>
      <text x="84" y="264" text-anchor="middle"
        fill="${textColor}" font-size="22">${unit}</text>

      <line x1="930" y1="222" x2="930" y2="270"
        stroke="${staffColor}" stroke-width="2"/>

      ${notes}

      <text x="115" y="373" fill="${color}"
        font-family="serif" font-style="italic" font-size="25">
        ${esc(measure.dynamic)}
      </text>

      ${ramp}

      ${
        measure.repeat === 2
          ? `<text x="870" y="63" fill="${muted}"
               font-size="14">반복 ×2</text>`
          : ""
      }

      ${
        printable ? "" : `
          <line id="editorPlayhead"
            x1="115" y1="90" x2="115" y2="465"
            stroke="#9debcf" stroke-width="2"
            visibility="hidden" pointer-events="none"/>
        `
      }
    </svg>
  `;
}

function gridRows(track = currentTrack()) {
  if (isDrum(track)) {
    if (track.instrument === "janggu" || track.instrument === "buk") {
      return [
        { pitch: 42, name: "가벼운 타격" },
        { pitch: 39, name: "채편 · 합성" },
        { pitch: 38, name: "궁편 · 합성" },
        { pitch: 36, name: "낮은 타격" }
      ];
    }

    return [
      { pitch: 49, name: "크래시" },
      { pitch: 42, name: "하이햇" },
      { pitch: 39, name: "클랩" },
      { pitch: 38, name: "스네어" },
      { pitch: 45, name: "탐" },
      { pitch: 36, name: "킥" }
    ];
  }

  const base = Number($("editorOctave").value);

  return Array.from({ length: 13 }, (_, index) => {
    const pitch = base + 12 - index;
    return { pitch, name: pitchName(pitch) };
  });
}

function gridSVG(track, bar) {
  const rows = gridRows(track);
  const length = barTicks(project.measures[bar]);
  const height = 38 + rows.length * 31;

  const color = COLORS[selectedTrack % COLORS.length];
  const tori = TORI[project.gugak.tori] || TORI.free;
  const allowed = tori.pcs || [];

  const rowSVG = rows.map((row, index) => {
    const y = 38 + index * 31;

    const recommended =
      !isDrum(track) &&
      $("highlightScale").checked &&
      allowed.includes(row.pitch % 12);

    return `
      <rect x="115" y="${y}" width="800" height="31"
        fill="${recommended ? color : "#ffffff"}"
        opacity="${recommended ? "0.09" : "0.025"}"/>
      <text x="105" y="${y + 20}" text-anchor="end"
        fill="#bfc1cf" font-size="12">${esc(row.name)}</text>
      <line x1="115" y1="${y + 31}" x2="915" y2="${y + 31}"
        stroke="#606575" opacity="0.35"/>
    `;
  }).join("");

  let columns = "";

  for (let tick = 0; tick <= length; tick += 6) {
    const x = 115 + tick / length * 800;
    const strong = tick % TICKS === 0;

    columns += `
      <line x1="${x}" y1="38" x2="${x}" y2="${height}"
        stroke="#9398aa" opacity="${strong ? 0.5 : 0.16}"/>
      ${
        strong && tick < length
          ? `<text x="${x + 4}" y="25"
               fill="#aeb1c1" font-size="12">
               ${tick / TICKS + 1}
             </text>`
          : ""
      }
    `;
  }

  const notes = track.notes
    .filter(note => note.bar === bar)
    .map(note => {
      const row = rows.findIndex(item => item.pitch === note.pitch);

      if (note.pitch !== null && row < 0) return "";

      const x = 115 + note.tick / length * 800;
      const y = note.pitch === null ? 3 : 41 + row * 31;
      const width = Math.max(3, note.duration / length * 800 - 2);
      const selected = note.id === selectedNoteId;

      return `
        <g data-note-id="${esc(note.id)}">
          <rect x="${x}" y="${y}" width="${width}" height="24"
            rx="5" fill="${note.pitch === null ? "#7e8395" : color}"
            opacity="${0.4 + note.velocity / 127 * 0.6}"
            stroke="${selected ? "#ffffff" : "none"}"
            stroke-width="2"/>
          ${
            width > 27
              ? `<text x="${x + 5}" y="${y + 16}"
                   fill="#181823" font-size="11"
                   pointer-events="none">
                   ${note.pitch === null ? "쉼" : esc(ornamentLabel(note.ornament))}
                 </text>`
              : ""
          }
        </g>
      `;
    }).join("");

  return `
    <svg xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 960 ${height}" width="960" height="${height}"
      role="img" aria-label="${bar + 1}마디 음 높이 작곡판">
      ${rowSVG}
      ${columns}
      ${notes}
      <line id="editorPlayhead"
        x1="115" y1="0" x2="115" y2="${height}"
        stroke="#9debcf" stroke-width="2"
        visibility="hidden" pointer-events="none"/>
    </svg>
  `;
}

function renderJangdan() {
  const measure = currentMeasure();
  const track = currentTrack();
  const [count, unit] = measure.meter.split("/").map(Number);
  const step = TICKS * 4 / unit;

  return `
    <div class="jangdan-board">
      <p class="info-box">
        박 단위 입력판이에요. 정식 정간보나 전통 장단의
        모든 연주법을 표시하는 악보는 아니에요.
      </p>

      <div class="jangdan-grid" style="--beats:${count}">
        ${Array.from({ length: count }, (_, index) => {
          const tick = index * step;

          const notes = track.notes.filter(note =>
            note.bar === selectedBar &&
            note.tick >= tick &&
            note.tick < tick + step
          );

          return `
            <button type="button" class="jangdan-cell"
              data-jangdan-tick="${tick}">
              <strong>${index + 1}박</strong>
              <span>
                ${
                  notes.length
                    ? notes.map(note =>
                        note.pitch === null
                          ? "쉼"
                          : isDrum(track)
                            ? "●"
                            : esc(pitchName(note.pitch))
                      ).join(" · ")
                    : "＋"
                }
              </span>
            </button>
          `;
        }).join("")}
      </div>
    </div>
  `;
}

function renderVelocity() {
  const notes = currentTrack().notes
    .filter(note =>
      note.bar === selectedBar && note.pitch !== null
    )
    .sort((a, b) => a.tick - b.tick || a.pitch - b.pitch);

  $("velocityEditor").innerHTML = notes.length
    ? notes.map(note => `
        <label class="velocity-column">
          <output>${note.velocity}</output>
          <input
            type="range"
            min="1" max="127" step="1"
            value="${note.velocity}"
            data-velocity-id="${esc(note.id)}"
            aria-label="${esc(pitchName(note.pitch))} 음 강도"
          />
          <small>${esc(pitchName(note.pitch))}</small>
        </label>
      `).join("")
    : '<p class="muted">음을 넣으면 음별 강도를 조절할 수 있어요.</p>';
}

function renderKeyboard() {
  const track = currentTrack();

  const keys = isDrum(track)
    ? gridRows(track)
    : Array.from({ length: 13 }, (_, index) => {
        const pitch = Number($("editorOctave").value) + index;
        return { pitch, name: pitchName(pitch) };
      });

  $("virtualKeyboard").innerHTML = keys.map(key => {
    const black =
      !isDrum(track) &&
      [1, 3, 6, 8, 10].includes(key.pitch % 12);

    return `
      <button
        type="button"
        class="piano-key ${black ? "black" : ""}"
        data-keyboard-pitch="${key.pitch}"
        aria-label="${esc(key.name)} 입력"
      >
        ${esc(key.name)}
      </button>
    `;
  }).join("");
}

function renderEditor() {
  const track = currentTrack();
  const measure = currentMeasure();
  const length = barTicks(measure);
  const selected = currentNote();

  $("editorHeading").textContent =
    `${track.name} · ${selectedBar + 1}마디`;

  $("editorDescription").textContent =
    view === "jangdan"
      ? "박을 선택한 뒤 아래 건반으로 음을 입력하세요."
      : isDrum(track)
        ? "타악기 줄과 박 위치를 터치해 리듬을 만드세요."
        : "음표 길이와 기호를 정한 뒤 원하는 위치를 터치하세요.";

  const surface = $("editorSurface");

  surface.dataset.tool = tool;
  surface.style.setProperty(
    "--track-color",
    COLORS[selectedTrack % COLORS.length]
  );

  surface.innerHTML =
    view === "jangdan"
      ? renderJangdan()
      : view === "grid" || isDrum(track)
        ? gridSVG(track, selectedBar)
        : scoreSVG(track, selectedBar);

  const occupied = new Set();

  track.notes
    .filter(note => note.bar === selectedBar)
    .forEach(note => {
      for (
        let tick = note.tick;
        tick < note.tick + note.duration;
        tick++
      ) {
        occupied.add(tick);
      }
    });

  const format = value =>
    Number((value / TICKS).toFixed(2));

  $("measureCapacity").textContent =
    `4분음표 기준 ${format(occupied.size)} / ${format(length)}박 사용`;

  $("selectionInformation").textContent = selected
    ? `${pitchName(selected.pitch)} · 길이 ${
        format(selected.duration)
      }박 · 강도 ${selected.velocity}`
    : "선택한 음표가 없어요.";

  $("applyNoteSettingsBtn").disabled = !selected;
  $("deleteSelectedNoteBtn").disabled = !selected;

  $("tieNoteBtn").disabled =
    !selected || selected.pitch === null;

  $("tieNoteBtn").classList.toggle(
    "active",
    Boolean(selected?.tie)
  );

  $("tieNoteBtn").setAttribute(
    "aria-pressed",
    String(Boolean(selected?.tie))
  );

  $("applyLyricBtn").disabled = !selected;

  setValue("noteLyric", selected?.lyric || "");

  const position = Number($("keyboardPosition").value) || 0;
  const quantum = $("noteRhythm").value === "triplet" ? 2 : 6;

  let options = "";

  for (let tick = 0; tick < length; tick += quantum) {
    options += `
      <option value="${tick}">
        ${Number((tick / TICKS + 1).toFixed(2))}박 위치
      </option>
    `;
  }

  $("keyboardPosition").innerHTML = options;

  const nearest = clamp(
    Math.round(position / quantum) * quantum,
    0,
    Math.floor((length - 1) / quantum) * quantum
  );

  $("keyboardPosition").value = String(nearest);

  renderVelocity();
  renderKeyboard();
}

function selectNote(id) {
  const note = currentTrack().notes.find(item => item.id === id);

  if (!note) return;

  selectedNoteId = note.id;

  const durationOptions = [
    ...$("noteDuration").options
  ].map(option => Number(option.value));

  if (durationOptions.includes(note.base)) {
    $("noteDuration").value = String(note.base);
  }

  $("noteRhythm").value = note.rhythm;
  $("noteAccidental").value = String(note.accidental);
  $("noteVelocity").value = String(note.velocity);
  $("noteVelocityValue").textContent = String(note.velocity);
  $("noteArticulation").value = note.articulation;
  $("noteOrnament").value = note.ornament;

  renderEditor();
}

// ===== 3부 끝 · 다음 코드를 바로 아래에 이어 붙이세요. =====
// ===== app.js 4부: 터치 입력 · 음표 편집 · 화음 =====

function insertNote(tick, pitch) {
  if (!project || !canEdit()) return false;

  const track = currentTrack();
  const length = barTicks(currentMeasure());
  const settings = noteSettings();

  tick = Math.max(0, snapTick(tick));

  if (tick + settings.duration > length) {
    toast("마디 길이를 넘어요. 음표 길이를 줄이거나 앞쪽에 넣어 주세요.");
    return false;
  }

  if (pitch !== null) {
    pitch = clamp(Math.round(pitch), 24, 108);
  }

  const overlap = track.notes.some(note =>
    note.bar === selectedBar &&
    note.pitch === pitch &&
    note.tick < tick + settings.duration &&
    note.tick + note.duration > tick
  );

  if (overlap) {
    toast("같은 높이의 음이 겹쳐 있어요. 기존 음을 선택해 수정해 주세요.");
    return false;
  }

  const added = newNote(
    selectedBar,
    tick,
    pitch,
    settings.duration,
    settings
  );

  const success = edit(() => {
    track.notes.push(added);
    selectedNoteId = added.id;
  }, pitch === null ? "쉼표를 넣었어요." : "음을 넣었어요.");

  if (success && pitch !== null) {
    Promise.resolve(previewPitch(pitch)).catch(() => {
      status("음은 입력했어요. 소리를 들으려면 재생을 눌러 주세요.");
    });
  }

  return success;
}

function deleteSelectedNote() {
  if (!project || !selectedNoteId) return;

  const track = currentTrack();
  const id = selectedNoteId;

  edit(() => {
    track.notes = track.notes.filter(note => note.id !== id);
    selectedNoteId = null;
  }, "선택한 음표를 지웠어요.");
}

// SVG의 실제 표시 위치를 악보 좌표로 바꿉니다.
function pointInSVG(event, svg) {
  const matrix = svg.getScreenCTM();

  if (!matrix) return null;

  const point = svg.createSVGPoint();

  point.x = event.clientX;
  point.y = event.clientY;

  return point.matrixTransform(matrix.inverse());
}

function locationFromPoint(point) {
  if (!point || !project) return null;

  const length = barTicks(currentMeasure());

  if (point.x < 115 || point.x >= 915) {
    return null;
  }

  const tick = clamp(
    snapTick((point.x - 115) / 800 * length),
    0,
    length - 1
  );

  if (view === "grid" || isDrum(currentTrack())) {
    const rows = gridRows();
    const row = Math.floor((point.y - 38) / 31);

    if (row < 0 || row >= rows.length) {
      return null;
    }

    return {
      tick,
      pitch: rows[row].pitch
    };
  }

  if (point.y < 112 || point.y > 388) {
    return null;
  }

  return {
    tick,
    pitch: scorePitch(point.y)
  };
}

function moveNoteTo(id, location) {
  const track = currentTrack();
  const note = track.notes.find(item => item.id === id);

  if (!note || !location) return false;

  const length = barTicks(currentMeasure());

  const tick = clamp(
    location.tick,
    0,
    length - note.duration
  );

  const pitch = note.pitch === null
    ? null
    : location.pitch;

  const overlap = track.notes.some(other =>
    other.id !== note.id &&
    other.bar === note.bar &&
    other.pitch === pitch &&
    other.tick < tick + note.duration &&
    other.tick + other.duration > tick
  );

  if (overlap) {
    toast("이 위치에는 같은 높이의 음이 이미 있어요.");
    return false;
  }

  return edit(() => {
    note.tick = tick;
    note.pitch = pitch;
    note.tie = false;

    if (pitch !== null) {
      note.accidental =
        NATURAL.includes(pitch % 12) ? 0 : 1;
    }

    selectedNoteId = note.id;
  }, "음표 위치를 옮겼어요.");
}

function handleEditorPointerDown(event) {
  if (
    !project ||
    view === "jangdan" ||
    (event.pointerType === "mouse" && event.button !== 0)
  ) {
    return;
  }

  const svg = event.target.closest("svg");

  if (!svg || !$("editorSurface").contains(svg)) return;

  const noteElement = event.target.closest("[data-note-id]");

  pointerState = {
    id: event.pointerId,
    svg,
    noteId: noteElement?.dataset.noteId || null,
    startX: event.clientX,
    startY: event.clientY,
    tool
  };

  if (tool === "move" && pointerState.noteId) {
    event.preventDefault();

    try {
      $("editorSurface").setPointerCapture(event.pointerId);
    } catch {
      // 指针已结束时不再捕获。
    }
  }
}

function handleEditorPointerUp(event) {
  const state = pointerState;

  if (!state || state.id !== event.pointerId) return;

  pointerState = null;

  const surface = $("editorSurface");

  if (surface.hasPointerCapture?.(event.pointerId)) {
    surface.releasePointerCapture(event.pointerId);
  }

  if (!project || !canEdit()) return;

  const distance = Math.hypot(
    event.clientX - state.startX,
    event.clientY - state.startY
  );

  const location = locationFromPoint(
    pointInSVG(event, state.svg)
  );

  if (state.tool === "move" && state.noteId) {
    if (distance < 5) {
      selectNote(state.noteId);
    } else {
      moveNoteTo(state.noteId, location);
    }

    return;
  }

  // 스크롤 동작은 음표 입력으로 처리하지 않습니다.
  if (distance > 10) return;

  if (state.noteId) {
    if (state.tool === "erase") {
      selectedNoteId = state.noteId;
      deleteSelectedNote();
    } else {
      selectNote(state.noteId);
    }

    return;
  }

  if (!location) return;

  if (state.tool === "erase" || state.tool === "move") {
    return;
  }

  if (state.tool === "chord") {
    insertChordAt(location.tick);
    return;
  }

  insertNote(
    location.tick,
    state.tool === "rest" ? null : location.pitch
  );
}

function installEditorPointerEvents() {
  const surface = $("editorSurface");

  if (!surface || surface.dataset.pointerReady === "true") {
    return;
  }

  surface.dataset.pointerReady = "true";

  surface.addEventListener(
    "pointerdown",
    handleEditorPointerDown
  );

  surface.addEventListener(
    "pointerup",
    handleEditorPointerUp
  );

  surface.addEventListener("pointercancel", () => {
    pointerState = null;
  });

  surface.addEventListener("lostpointercapture", () => {
    pointerState = null;
  });

  surface.addEventListener("pointerleave", event => {
    if (!surface.hasPointerCapture?.(event.pointerId)) {
      pointerState = null;
    }
  });
}

// DOM이 준비되면 터치 입력을 연결합니다.
if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    installEditorPointerEvents,
    { once: true }
  );
} else {
  installEditorPointerEvents();
}

// ---------- 화음 ----------

function chordName(root, type) {
  const suffix = {
    maj: "",
    min: "m",
    "7": "7",
    maj7: "maj7",
    m7: "m7",
    "9": "9",
    sus4: "sus4",
    dim: "dim"
  };

  const pitchClass = ((Number(root) % 12) + 12) % 12;

  return NOTES[pitchClass] + (suffix[type] ?? type);
}

function chordPitches(root, type, base = 48, inversion = 0) {
  const intervals = CHORDS[type] || CHORDS.maj;

  const pitches = intervals.map(interval =>
    base + Number(root) + interval
  );

  const turns = clamp(
    Math.floor(Number(inversion) || 0),
    0,
    pitches.length - 1
  );

  for (let index = 0; index < turns; index++) {
    pitches.push(pitches.shift() + 12);
  }

  return pitches.sort((a, b) => a - b);
}

function customChord() {
  return chordPitches(
    Number($("chordRoot").value),
    $("chordType").value,
    Number($("editorOctave").value),
    Number($("chordInversion").value)
  ).filter(pitch => pitch >= 24 && pitch <= 108);
}

function renderHarmony() {
  const root = Number($("chordRoot").value) || 0;
  const type = $("chordType").value || "maj";
  const pitches = customChord();

  $("chordNotes").textContent =
    `${chordName(root, type)} · ` +
    pitches.map(pitch => pitchName(pitch)).join(" + ");

  const progression =
    PROGRESSIONS[$("progressionSelect").value] ||
    PROGRESSIONS.bright;

  $("progressionPreview").innerHTML = progression
    .map(([offset, chordType], index) => `
      <div class="chord-card">
        <strong>
          ${esc(chordName((root + offset) % 12, chordType))}
        </strong>
        <small>${index + 1}번째 마디</small>
      </div>
    `).join("");
}

function insertChordAt(tick) {
  if (!project || !canEdit()) return false;

  const track = currentTrack();

  if (isDrum(track)) {
    toast("화음은 피아노처럼 음 높이가 있는 악기에 넣어 주세요.");
    return false;
  }

  const settings = noteSettings();
  const length = barTicks(currentMeasure());
  const pitches = customChord();

  tick = Math.max(0, snapTick(tick));

  if (!pitches.length) {
    toast("입력할 수 있는 음역의 화음을 선택해 주세요.");
    return false;
  }

  if (tick + settings.duration > length) {
    toast("화음이 마디를 넘어요. 길이를 줄이거나 앞쪽에 넣어 주세요.");
    return false;
  }

  const overlap = track.notes.some(note =>
    note.bar === selectedBar &&
    pitches.includes(note.pitch) &&
    note.tick < tick + settings.duration &&
    note.tick + note.duration > tick
  );

  if (overlap) {
    toast("화음의 일부 음이 기존 음과 겹쳐 있어요.");
    return false;
  }

  const additions = pitches.map(pitch =>
    newNote(
      selectedBar,
      tick,
      pitch,
      settings.duration,
      {
        ...settings,
        accidental: NATURAL.includes(pitch % 12) ? 0 : 1
      }
    )
  );

  return edit(() => {
    track.notes.push(...additions);
    selectedNoteId = additions[0].id;
  }, "선택한 화음을 넣었어요.");
}

// ---------- 반주 패턴 ----------

function makeAccompaniment(
  track,
  bar,
  root,
  type,
  bass = false
) {
  const length = barTicks(project.measures[bar]);
  const style = $("accompanimentStyle").value || "block";

  const pitches = bass
    ? [36 + root]
    : chordPitches(
        root,
        type,
        48,
        Number($("chordInversion").value)
      );

  const add = (tick, pitch, duration, velocity = 72) => {
    const actualDuration = Math.min(duration, length - tick);

    if (actualDuration <= 0) return;

    let base = actualDuration;
    let rhythm = "normal";

    if ([9, 18, 36, 72, 144].includes(actualDuration)) {
      base = actualDuration / 1.5;
      rhythm = "dotted";
    }

    track.notes.push(
      newNote(bar, tick, pitch, actualDuration, {
        base,
        rhythm,
        velocity,
        accidental: NATURAL.includes(pitch % 12) ? 0 : 1
      })
    );
  };

  if (bass) {
    for (let tick = 0; tick < length; tick += 48) {
      add(tick, pitches[0], 24, 84);
    }

    return;
  }

  if (style === "arpeggio") {
    for (let tick = 0, index = 0; tick < length; tick += 12, index++) {
      add(
        tick,
        pitches[index % pitches.length],
        12,
        index % pitches.length === 0 ? 80 : 68
      );
    }

    return;
  }

  if (style === "pulse") {
    for (let tick = 0; tick < length; tick += 24) {
      pitches.forEach(pitch => add(tick, pitch, 12, 72));
    }

    return;
  }

  if (style === "offbeat") {
    for (let tick = 12; tick < length; tick += 24) {
      pitches.forEach(pitch => add(tick, pitch, 12, 74));
    }

    return;
  }

  // 긴 화음은 표준 길이로 나누고 붙임줄을 연결합니다.
  pitches.forEach(pitch => {
    let tick = 0;

    while (tick < length) {
      const remaining = length - tick;

      const duration = [96, 48, 24, 12, 6, 4, 2, 1]
        .find(value => value <= remaining);

      add(tick, pitch, duration, 68);

      const note = track.notes[track.notes.length - 1];

      if (duration === 4) {
        note.base = 6;
        note.rhythm = "triplet";
      }

      note.tie = tick + duration < length;
      tick += duration;
    }
  });
}

function addHarmony(bass = false) {
  if (!project || !canEdit()) return;

  if (project.tracks.length >= MAX_TRACKS) {
    toast(`악기는 최대 ${MAX_TRACKS}개까지 넣을 수 있어요.`);
    return;
  }

  const progression =
    PROGRESSIONS[$("progressionSelect").value] ||
    PROGRESSIONS.bright;

  const keyRoot = Number($("chordRoot").value) || 0;

  const track = newTrack(
    bass ? "bass" : "piano",
    bass ? "코드 베이스" : "화음 반주"
  );

  const firstBar = selectedBar;
  const lastBar = rangeEnd;

  const success = edit(() => {
    for (let bar = firstBar; bar <= lastBar; bar++) {
      const [offset, type] =
        progression[(bar - firstBar) % progression.length];

      makeAccompaniment(
        track,
        bar,
        (keyRoot + offset) % 12,
        type,
        bass
      );
    }

    project.tracks.push(track);

    selectedTrack = project.tracks.length - 1;
    selectedNoteId = null;

    $("editorOctave").value = bass ? "36" : "48";
  }, bass ? "베이스 반주 트랙을 추가했어요." : "화음 반주 트랙을 추가했어요.");

  if (success) {
    toast(
      `${firstBar + 1}~${lastBar + 1}마디에 반주를 넣었어요.`
    );
  }
}

// ===== 4부 끝 · 다음 코드를 바로 아래에 이어 붙이세요. =====
// ===== app.js 5부: 재생 순서 · 박자 · 셈여림 =====

// 음소거와 단독 재생 설정을 반영합니다.
function activeTracks(p = project) {
  if (!p) return [];

  const hasSolo = p.tracks.some(track => track.solo);

  return p.tracks.filter(track =>
    !track.mute && (!hasSolo || track.solo)
  );
}

// 마디 안의 점점 세게 / 점점 여리게를 계산합니다.
function dynamicAt(measure, tick, length) {
  const base = DYNAMICS[measure.dynamic] ?? DYNAMICS.mf;
  const position = clamp(tick / Math.max(1, length), 0, 1);

  if (measure.ramp === "crescendo") {
    return clamp(base * (0.65 + position * 0.7), 0.05, 1);
  }

  if (measure.ramp === "decrescendo") {
    return clamp(base * (1.15 - position * 0.65), 0.05, 1);
  }

  return base;
}

// 스윙은 한 쌍의 8분음표 길이를 길게 / 짧게 나눕니다.
// 셋잇단음표와 겹박자에서는 별도 스윙을 적용하지 않습니다.
function swingTick(tick, amount, enabled = true) {
  if (!enabled || amount <= 0) return tick;

  const pairLength = TICKS;
  const half = pairLength / 2;

  const pairStart = Math.floor(tick / pairLength) * pairLength;
  const local = tick - pairStart;
  const swing = clamp(amount, 0, 45) / 100;

  if (local <= half) {
    return pairStart + local * (1 + swing);
  }

  return pairStart +
    half * (1 + swing) +
    (local - half) * (1 - swing);
}

function buildPlan(p = project) {
  if (!p) {
    return {
      events: [],
      markers: [],
      segments: [],
      duration: 0
    };
  }

  const tracks = activeTracks(p);
  const events = [];
  const markers = [];
  const segments = [];

  let cursor = 0;

  p.measures.forEach((measure, bar) => {
    const length = barTicks(measure);
    const tempo = measure.tempo ?? p.bpm;
    const tickSeconds = 60 / tempo / TICKS;

    const [beatCount, beatUnit] =
      measure.meter.split("/").map(Number);

    const beatTicks = TICKS * 4 / beatUnit;

    const compoundMeter =
      beatUnit === 8 &&
      beatCount >= 6 &&
      beatCount % 3 === 0;

    const barNotes = tracks.flatMap(track =>
      track.notes
        .filter(note => note.bar === bar)
        .map(note => ({ track, note }))
    );

    const hasTriplets = barNotes.some(
      item => item.note.rhythm === "triplet"
    );

    const useSwing = !compoundMeter && !hasTriplets;
    const swing = p.effects.swing || 0;

    const warped = tick =>
      swingTick(tick, swing, useSwing);

    // 같은 시점에 여러 늘임표가 있으면 가장 긴 것만 적용합니다.
    // 여기서는 교육용 재생 규칙으로 원래 길이의 절반을 더합니다.
    const holdMap = new Map();

    barNotes.forEach(({ note }) => {
      if (note.articulation !== "fermata") return;

      const endTick = Math.min(
        length,
        note.tick + note.duration
      );

      const originalDuration =
        (warped(endTick) - warped(note.tick)) * tickSeconds;

      const extra = originalDuration * 0.5;

      holdMap.set(
        endTick,
        Math.max(holdMap.get(endTick) || 0, extra)
      );
    });

    const holds = [...holdMap.entries()]
      .map(([tick, seconds]) => ({ tick, seconds }))
      .sort((a, b) => a.tick - b.tick);

    const timeAt = tick => {
      let seconds = warped(tick) * tickSeconds;

      for (const hold of holds) {
        if (hold.tick <= tick) {
          seconds += hold.seconds;
        }
      }

      return seconds;
    };

    const measureDuration = timeAt(length);
    const repeats = measure.repeat === 2 ? 2 : 1;

    for (let pass = 0; pass < repeats; pass++) {
      const start = cursor;
      const end = start + measureDuration;

      segments.push({
        bar,
        pass,
        start,
        end,
        tempo,
        meter: measure.meter,
        length
      });

      // 화면의 재생 위치 표시용 시간표입니다.
      const markerTicks = new Set([0, length]);

      for (let tick = 0; tick < length; tick += 2) {
        markerTicks.add(tick);
      }

      [...markerTicks]
        .sort((a, b) => a - b)
        .forEach(tick => {
          markers.push({
            time: start + timeAt(tick),
            bar,
            pass,
            tick,
            length,
            beat: Math.floor(tick / beatTicks) + 1,
            progress: tick / length
          });
        });

      // 메트로놈 소리는 재생할 때 켜짐 여부를 확인합니다.
      for (let beat = 0; beat < beatCount; beat++) {
        const tick = beat * beatTicks;
        const strong =
          beat === 0 || (compoundMeter && beat % 3 === 0);

        events.push({
          kind: "click",
          type: "click",
          click: true,
          time: start + timeAt(tick),
          duration: 0.045,
          bar,
          pass,
          tick,
          pitch: strong ? 84 : 79,
          velocity: strong ? 0.24 : 0.14,
          instrument: "bell",
          trackId: null,
          articulation: "normal",
          ornament: "none",
          tie: false
        });
      }

      barNotes.forEach(({ track, note }) => {
        if (note.pitch === null) return;

        const endTick = Math.min(
          length,
          note.tick + note.duration
        );

        const noteStart = start + timeAt(note.tick);
        const noteEnd = start + timeAt(endTick);

        const velocity = clamp(
          note.velocity / 127 *
          dynamicAt(measure, note.tick, length),
          0.01,
          1
        );

        events.push({
          kind: "note",
          type: "note",
          click: false,

          id: note.id,
          noteId: note.id,
          trackId: track.id,
          instrument: track.instrument,

          bar,
          pass,
          tick: note.tick,

          time: noteStart,
          duration: Math.max(0.01, noteEnd - noteStart),

          pitch: note.pitch,
          velocity,
          articulation: note.articulation,
          ornament: note.ornament,
          tie: Boolean(note.tie)
        });
      });

      cursor = end;
    }
  });

  // 붙임줄로 연결된 같은 높이의 음은 한 번만 발음합니다.
  const grouped = new Map();
  const clickEvents = [];

  events.forEach(event => {
    if (event.click) {
      clickEvents.push(event);
      return;
    }

    const key = `${event.trackId}:${event.pitch}`;

    if (!grouped.has(key)) {
      grouped.set(key, []);
    }

    grouped.get(key).push(event);
  });

  const merged = [];

  grouped.forEach(group => {
    group.sort((a, b) => a.time - b.time);

    let previous = null;

    group.forEach(event => {
      const adjacent =
        previous &&
        Math.abs(
          previous.time + previous.duration - event.time
        ) < 0.002;

      if (previous?.tie && adjacent) {
        previous.duration =
          event.time + event.duration - previous.time;

        previous.tie = event.tie;
        previous.linkedNoteIds.push(event.noteId);
      } else {
        previous = {
          ...event,
          linkedNoteIds: [event.noteId]
        };

        merged.push(previous);
      }
    });
  });

  const finalEvents = [...merged, ...clickEvents]
    .sort((a, b) =>
      a.time - b.time ||
      Number(a.click) - Number(b.click) ||
      a.pitch - b.pitch
    );

  markers.sort((a, b) =>
    a.time - b.time ||
    a.bar - b.bar ||
    a.pass - b.pass
  );

  return {
    events: finalEvents,
    markers,
    segments,
    duration: cursor
  };
}

// 선택한 마디 범위의 재생 시작·끝을 찾습니다.
function selectedPlaybackRange(plan) {
  const matching = plan.segments.filter(segment =>
    segment.bar >= selectedBar &&
    segment.bar <= rangeEnd
  );

  if (!matching.length) {
    return { start: 0, end: plan.duration };
  }

  return {
    start: matching[0].start,
    end: matching[matching.length - 1].end
  };
}

// 범위 경계에 걸쳐 있는 붙임줄 음도 잘라서 재생합니다.
function eventsInRange(plan, start, end, includeClicks = false) {
  return plan.events
    .filter(event => {
      if (event.click && !includeClicks) return false;

      return (
        event.time < end &&
        event.time + event.duration > start
      );
    })
    .map(event => {
      const clippedStart = Math.max(start, event.time);
      const clippedEnd = Math.min(
        end,
        event.time + event.duration
      );

      return {
        ...event,
        time: clippedStart,
        duration: Math.max(0.001, clippedEnd - clippedStart)
      };
    });
}

// ===== 5부 끝 · 다음 코드를 바로 아래에 이어 붙이세요. =====
// ===== app.js 6부: 악기 소리 · 음향 효과 =====

async function audioContext() {
  const AudioContextClass =
    window.AudioContext || window.webkitAudioContext;

  if (!AudioContextClass) {
    throw new Error("이 브라우저는 오디오 재생을 지원하지 않아요.");
  }

  if (!context || context.state === "closed") {
    context = new AudioContextClass();
  }

  if (context.state === "suspended") {
    await context.resume();
  }

  if (context.state !== "running") {
    throw new Error("소리를 시작할 수 없어요. 재생 버튼을 다시 눌러 주세요.");
  }

  return context;
}

function makeGraph(ctx, p) {
  const nodes = [];
  const sources = new Set();
  const destinations = new Map();

  const keep = node => {
    nodes.push(node);
    return node;
  };

  const input = keep(ctx.createGain());

  const low = keep(ctx.createBiquadFilter());
  low.type = "lowshelf";
  low.frequency.value = 220;
  low.gain.value = p.effects.low;

  const mid = keep(ctx.createBiquadFilter());
  mid.type = "peaking";
  mid.frequency.value = 1300;
  mid.Q.value = 0.8;
  mid.gain.value = p.effects.mid;

  const high = keep(ctx.createBiquadFilter());
  high.type = "highshelf";
  high.frequency.value = 4500;
  high.gain.value = p.effects.high;

  const compressor = keep(ctx.createDynamicsCompressor());
  compressor.threshold.value =
    p.effects.compressor ? -16 : 0;
  compressor.knee.value = p.effects.compressor ? 18 : 0;
  compressor.ratio.value = p.effects.compressor ? 4 : 1;
  compressor.attack.value = 0.006;
  compressor.release.value = 0.18;

  const master = keep(ctx.createGain());
  master.gain.value = p.effects.master / 100;

  const analyser = keep(ctx.createAnalyser());
  analyser.fftSize = 256;
  analyser.smoothingTimeConstant = 0.75;

  input.connect(low);
  low.connect(mid);
  mid.connect(high);
  high.connect(compressor);
  compressor.connect(master);
  master.connect(analyser);
  analyser.connect(ctx.destination);

  // 잔향
  const convolver = keep(ctx.createConvolver());
  const wet = keep(ctx.createGain());

  wet.gain.value = p.effects.reverb / 100;

  const impulseLength = Math.floor(ctx.sampleRate * 1.4);
  const impulse = ctx.createBuffer(
    2,
    impulseLength,
    ctx.sampleRate
  );

  let seed = 712367;

  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };

  for (let channel = 0; channel < 2; channel++) {
    const data = impulse.getChannelData(channel);

    for (let i = 0; i < impulseLength; i++) {
      const decay = Math.pow(1 - i / impulseLength, 2.5);
      data[i] = (random() * 2 - 1) * decay;
    }
  }

  convolver.buffer = impulse;

  input.connect(convolver);
  convolver.connect(wet);
  wet.connect(low);

  // 딜레이
  const delay = keep(ctx.createDelay(3));
  const feedback = keep(ctx.createGain());
  const delayGain = keep(ctx.createGain());

  delay.delayTime.value = 60 / p.bpm * 0.75;
  feedback.gain.value = 0.25;
  delayGain.gain.value = p.effects.delay / 100;

  input.connect(delay);
  delay.connect(feedback);
  feedback.connect(delay);
  delay.connect(delayGain);
  delayGain.connect(low);

  // 악기별 음량과 좌우 위치
  p.tracks.forEach(track => {
    const gain = keep(ctx.createGain());
    gain.gain.value = track.volume / 100;

    if (typeof ctx.createStereoPanner === "function") {
      const pan = keep(ctx.createStereoPanner());
      pan.pan.value = track.pan / 100;

      gain.connect(pan);
      pan.connect(input);
    } else {
      gain.connect(input);
    }

    destinations.set(track.id, gain);
  });

  return {
    input,
    master,
    analyser,
    wet,
    delayGain,
    nodes,
    sources,
    destinations,
    disposed: false
  };
}

function disposeGraph(graph) {
  if (!graph || graph.disposed) return;

  graph.disposed = true;

  for (const source of graph.sources) {
    try {
      source.stop();
    } catch {
      // 이미 종료된 소리는 건너뜁니다.
    }
  }

  graph.sources.clear();

  for (const node of graph.nodes) {
    try {
      node.disconnect();
    } catch {
      // 이미 해제된 연결은 건너뜁니다.
    }
  }
}

// 뒤쪽 재생 코드에서도 사용할 수 있습니다.
function dispose(graph) {
  disposeGraph(graph);
}

function midiFrequency(pitch) {
  return 440 * Math.pow(2, (pitch - 69) / 12);
}

function voice(ctx, graph, event, time) {
  if (!graph || graph.disposed) return;

  const definition =
    INSTRUMENTS[event.instrument] || INSTRUMENTS.piano;

  const wave = definition[2];
  const group = definition[3];

  const start = Math.max(ctx.currentTime, time);
  const duration = Math.max(0.02, event.duration || 0.25);

  const velocity = clamp(
    Number.isFinite(event.velocity) ? event.velocity : 0.7,
    0.01,
    1
  );

  const accent = event.articulation === "accent" ? 1.2 : 1;

  const destination =
    graph.destinations.get(event.trackId) || graph.input;

  const localNodes = [];
  let remainingSources = 0;

  const keep = node => {
    localNodes.push(node);
    return node;
  };

  const clean = () => {
    if (remainingSources > 0) return;

    localNodes.forEach(node => {
      try {
        node.disconnect();
      } catch {
        // 연결이 이미 해제된 경우입니다.
      }
    });
  };

  const register = source => {
    remainingSources++;
    graph.sources.add(source);

    source.onended = () => {
      graph.sources.delete(source);
      remainingSources--;
      clean();
    };

    return source;
  };

  const envelope = keep(ctx.createGain());
  envelope.connect(destination);

  // 타악기 합성
  if (group === "drum") {
    const pitch = event.pitch;
    const traditional =
      event.instrument === "janggu" ||
      event.instrument === "buk";

    const kick = pitch === 36;
    const tom = pitch === 45 || pitch === 39 && traditional;
    const hat = pitch === 42;
    const crash = pitch === 49;

    const tail = crash ? 0.55 : hat ? 0.07 : 0.25;
    const peak = 0.48 * velocity * accent;

    envelope.gain.setValueAtTime(0.0001, start);
    envelope.gain.exponentialRampToValueAtTime(
      Math.max(0.001, peak),
      start + 0.003
    );
    envelope.gain.exponentialRampToValueAtTime(
      0.0001,
      start + tail
    );

    if (kick || tom || traditional) {
      const oscillator = register(keep(ctx.createOscillator()));

      oscillator.type = "sine";

      const initialFrequency = kick ? 145 : tom ? 180 : 230;
      const finalFrequency = kick ? 45 : tom ? 85 : 125;

      oscillator.frequency.setValueAtTime(initialFrequency, start);
      oscillator.frequency.exponentialRampToValueAtTime(
        finalFrequency,
        start + 0.09
      );

      const toneGain = keep(ctx.createGain());
      toneGain.gain.value = kick ? 1 : 0.65;

      oscillator.connect(toneGain);
      toneGain.connect(envelope);

      oscillator.start(start);
      oscillator.stop(start + tail + 0.02);
    }

    if (!kick) {
      const frameCount = Math.max(
        1,
        Math.ceil(ctx.sampleRate * tail)
      );

      const noiseBuffer = ctx.createBuffer(
        1,
        frameCount,
        ctx.sampleRate
      );

      const samples = noiseBuffer.getChannelData(0);

      let seed = 8675309 + pitch * 131;

      for (let i = 0; i < samples.length; i++) {
        seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
        samples[i] = seed / 2147483648 - 1;
      }

      const noise = register(keep(ctx.createBufferSource()));
      noise.buffer = noiseBuffer;

      const filter = keep(ctx.createBiquadFilter());
      filter.type = hat || crash ? "highpass" : "bandpass";
      filter.frequency.value =
        hat ? 6500 : crash ? 4200 : traditional ? 1800 : 2200;
      filter.Q.value = 0.7;

      const noiseGain = keep(ctx.createGain());
      noiseGain.gain.value =
        traditional ? 0.35 : hat ? 0.55 : 0.8;

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(envelope);

      noise.start(start);
      noise.stop(start + tail + 0.02);
    }

    return;
  }

  // 음 높이가 있는 악기 합성
  const gate =
    event.articulation === "staccato" ? duration * 0.45 :
    event.articulation === "tenuto" ||
    event.articulation === "legato" ||
    event.articulation === "fermata" ? duration :
    duration * 0.92;

  const attackTarget =
    group === "pad" ? 0.16 :
    group === "sustain" ? 0.06 :
    group === "wind" ? 0.035 : 0.005;

  const attack = Math.min(attackTarget, gate * 0.25);

  const release =
    group === "pad" || group === "sustain" ? 0.25 : 0.1;

  const level = (group === "bass" ? 0.3 : 0.16) *
    velocity * accent;

  const plucked =
    group === "pluck" ||
    group === "keys" ||
    group === "bell" ||
    group === "metal";

  const sustainLevel = level * (plucked ? 0.16 : 0.72);
  const decayEnd = Math.min(
    start + attack + 0.18,
    start + gate
  );

  envelope.gain.setValueAtTime(0, start);
  envelope.gain.linearRampToValueAtTime(level, start + attack);

  envelope.gain.exponentialRampToValueAtTime(
    Math.max(0.0001, sustainLevel),
    decayEnd
  );

  envelope.gain.setValueAtTime(
    Math.max(0.0001, sustainLevel),
    start + gate
  );

  envelope.gain.exponentialRampToValueAtTime(
    0.0001,
    start + gate + release
  );

  const filter = keep(ctx.createBiquadFilter());
  filter.type = "lowpass";

  filter.frequency.value =
    group === "bass" ? 750 :
    group === "pluck" ? 2400 :
    group === "sustain" ? 2300 : 6000;

  filter.Q.value = 0.6;
  filter.connect(envelope);

  let partials;

  if (group === "metal") {
    partials = [
      [1, 0.55],
      [1.47, 0.2],
      [2.09, 0.15],
      [3.31, 0.1]
    ];
  } else if (group === "bell") {
    partials = [[1, 0.65], [2.01, 0.23], [3.98, 0.12]];
  } else if (event.instrument === "organ") {
    partials = [[1, 0.65], [2, 0.25], [4, 0.1]];
  } else if (group === "keys" || group === "pluck") {
    partials = [[1, 0.75], [2, 0.17], [3, 0.08]];
  } else if (group === "pad" || group === "sustain") {
    partials = [[1, 0.5], [1.003, 0.5]];
  } else {
    partials = [[1, 1]];
  }

  const fundamental = midiFrequency(event.pitch);
  const oscillators = [];

  partials.forEach(([ratio, amplitude]) => {
    const frequency = fundamental * ratio;

    if (frequency >= ctx.sampleRate / 2) return;

    const oscillator = register(keep(ctx.createOscillator()));
    const gain = keep(ctx.createGain());

    oscillator.type =
      group === "bell" || group === "metal" ? "sine" : wave;

    oscillator.frequency.setValueAtTime(frequency, start);
    gain.gain.value = amplitude;

    const bendTime = Math.min(0.25, gate * 0.7);

    if (event.ornament === "rise") {
      oscillator.detune.setValueAtTime(-120, start);
      oscillator.detune.linearRampToValueAtTime(
        0,
        start + bendTime
      );
    } else if (event.ornament === "fall") {
      oscillator.detune.setValueAtTime(0, start);
      oscillator.detune.setValueAtTime(
        0,
        start + gate * 0.55
      );
      oscillator.detune.linearRampToValueAtTime(
        -180,
        start + gate
      );
    } else if (event.ornament === "bend") {
      oscillator.detune.setValueAtTime(100, start);
      oscillator.detune.linearRampToValueAtTime(
        0,
        start + Math.min(0.12, gate * 0.6)
      );
    }

    oscillator.connect(gain);
    gain.connect(filter);

    oscillator.start(start);
    oscillator.stop(start + gate + release + 0.02);

    oscillators.push(oscillator);
  });

  if (event.ornament === "vibrato" && oscillators.length) {
    const lfo = register(keep(ctx.createOscillator()));
    const depth = keep(ctx.createGain());

    lfo.type = "sine";
    lfo.frequency.value = 5.2;
    depth.gain.value = 32;

    lfo.connect(depth);

    oscillators.forEach(oscillator => {
      depth.connect(oscillator.detune);
    });

    lfo.start(start);
    lfo.stop(start + gate + release + 0.02);
  }

  clean();
}

// 입력한 음 하나를 미리 듣습니다.
async function previewPitch(pitch) {
  if (!project || runtime || isRecording()) return;

  const track = currentTrack();
  const trackId = track.id;
  const projectId = project.id;
  const generation = playGeneration;

  const ctx = await audioContext();

  if (
    runtime ||
    isRecording() ||
    generation !== playGeneration ||
    project?.id !== projectId ||
    currentTrack()?.id !== trackId
  ) {
    return;
  }

  disposeGraph(previewGraph);
  previewGraph = makeGraph(ctx, project);

  voice(ctx, previewGraph, {
    trackId,
    instrument: track.instrument,
    pitch,
    duration: 0.45,
    velocity: Number($("noteVelocity").value) / 127,
    articulation: $("noteArticulation").value,
    ornament: $("noteOrnament").value
  }, ctx.currentTime + 0.015);
}

// 녹음 또는 가져온 음원을 브라우저에서 해독합니다.
async function getAudioBuffer(ctx, p = project) {
  if (!p?.audio?.data) return null;

  const data = p.audio.data;

  if (decodedAudio && decodedAudioData === data) {
    return decodedAudio;
  }

  const response = await fetch(data);
  const bytes = await response.arrayBuffer();
  const buffer = await ctx.decodeAudioData(bytes);

  if (buffer.duration > 300) {
    throw new Error("녹음 파일은 5분 이하로 넣어 주세요.");
  }

  decodedAudio = buffer;
  decodedAudioData = data;

  return buffer;
}

function playAudioClip(
  ctx,
  graph,
  p,
  buffer,
  origin,
  rangeStart,
  rangeDuration
) {
  if (!buffer || !p.audio || graph.disposed) return;

  const relativeStart = p.audio.offset - rangeStart;
  const delay = Math.max(0, relativeStart);
  const skip = Math.max(0, -relativeStart);

  const duration = Math.min(
    buffer.duration - skip,
    rangeDuration - delay
  );

  if (duration <= 0) return;

  const source = ctx.createBufferSource();
  const gain = ctx.createGain();

  source.buffer = buffer;
  gain.gain.value = p.audio.volume / 100;

  source.connect(gain);
  gain.connect(graph.input);

  graph.sources.add(source);

  source.onended = () => {
    graph.sources.delete(source);
    source.disconnect();
    gain.disconnect();
  };

  const scheduledStart = origin + delay;
  const late = Math.max(0, ctx.currentTime - scheduledStart);
  const remaining = duration - late;

  if (remaining <= 0) {
    graph.sources.delete(source);
    source.disconnect();
    gain.disconnect();
    return;
  }

  source.start(
    Math.max(ctx.currentTime, scheduledStart),
    skip + late,
    remaining
  );
}

// ===== 6부 끝 · 다음 코드를 바로 아래에 이어 붙이세요. =====
// ===== app.js 7부: 재생 · 정지 · 구간 반복 =====

async function startPlayback(selectionOnly = false) {
  if (!project) return;

  stopPlayback(false);

  const generation = playGeneration;
  const snapshot = copy(project);

  const firstBar = selectedBar;
  const lastBar = rangeEnd;

  $("playBtn").disabled = true;
  $("playSelectionBtn").disabled = true;

  status("재생을 준비하고 있어요.");

  let graph = null;

  try {
    const ctx = await audioContext();

    if (generation !== playGeneration) return;

    // 마이크 녹음 중에는 기존 녹음 파일을 겹쳐 재생하지 않습니다.
    const buffer = snapshot.audio && !isRecording()
      ? await getAudioBuffer(ctx, snapshot)
      : null;

    if (generation !== playGeneration) return;

    const plan = buildPlan(snapshot);

    let start = 0;
    let end = plan.duration;

    if (selectionOnly) {
      const segments = plan.segments.filter(segment =>
        segment.bar >= firstBar &&
        segment.bar <= lastBar
      );

      if (segments.length) {
        start = segments[0].start;
        end = segments[segments.length - 1].end;
      }
    }

    let duration = end - start;

    // 전체 재생에서는 악보보다 긴 녹음 파일도 끝까지 재생합니다.
    if (!selectionOnly && buffer) {
      duration = Math.max(
        duration,
        snapshot.audio.offset + buffer.duration
      );
    }

    duration = Math.max(0.1, duration);

    const events = eventsInRange(
      plan,
      start,
      end,
      $("metronome").checked
    );

    graph = makeGraph(ctx, snapshot);

    runtime = {
      ctx,
      graph,
      plan,
      snapshot,
      buffer,

      start,
      end,
      duration,
      events,

      origin: ctx.currentTime + 0.08,
      cycle: 0,
      eventIndex: 0,
      audioCycle: -1,
      schedulingDone: false,

      loop: $("loopPlayback").checked,
      selectionOnly,

      timer: null,
      raf: null,

      meterData: new Float32Array(graph.analyser.fftSize),
      lastMarker: null,
      lastVisualCycle: -1
    };

    $("playBtn").disabled = false;
    $("playSelectionBtn").disabled = false;

    $("playBtn").textContent = "▶ 재생 중";
    $("playBtn").classList.add("active");
    $("playBtn").setAttribute("aria-pressed", "true");

    $("playSelectionBtn").classList.toggle(
      "active",
      selectionOnly
    );

    schedulePlayback();

    runtime.timer = setInterval(schedulePlayback, 25);
    runtime.raf = requestAnimationFrame(animatePlayback);

    status(
      selectionOnly
        ? `${firstBar + 1}~${lastBar + 1}마디를 재생하고 있어요.`
        : "전체 곡을 재생하고 있어요. 편집하면 재생이 멈춰요."
    );
  } catch (error) {
    if (generation !== playGeneration) {
      disposeGraph(graph);
      return;
    }

    stopPlayback(false);
    disposeGraph(graph);

    status(
      error.message || "소리를 재생하지 못했어요.",
      true
    );
  } finally {
    if (generation === playGeneration) {
      $("playBtn").disabled = false;
      $("playSelectionBtn").disabled = false;
    }
  }
}

// 재생 직전에 필요한 소리만 짧게 예약합니다.
function schedulePlayback() {
  const state = runtime;

  if (!state || state.schedulingDone) return;

  const { ctx, graph } = state;

  if (graph.disposed) return;

  const now = ctx.currentTime;
  const horizon = now + 0.14;

  // 브라우저가 잠시 느려졌다면 지난 반복 구간을 건너뜁니다.
  if (state.loop && now > state.origin) {
    const currentCycle = Math.floor(
      (now - state.origin) / state.duration
    );

    if (currentCycle > state.cycle) {
      state.cycle = currentCycle;
      state.eventIndex = 0;
      state.audioCycle = -1;
    }
  }

  let scheduledCount = 0;

  while (scheduledCount < 512) {
    const cycleOrigin =
      state.origin + state.cycle * state.duration;

    if (cycleOrigin > horizon) return;

    if (state.audioCycle !== state.cycle) {
      playAudioClip(
        ctx,
        graph,
        state.snapshot,
        state.buffer,
        cycleOrigin,
        state.start,
        state.duration
      );

      state.audioCycle = state.cycle;
    }

    while (state.eventIndex < state.events.length) {
      const event = state.events[state.eventIndex];

      const eventTime =
        cycleOrigin + event.time - state.start;

      if (eventTime > horizon) return;

      state.eventIndex++;
      scheduledCount++;

      const late = Math.max(0, now - eventTime);

      // 이미 끝난 음은 뒤늦게 다시 울리지 않습니다.
      if (late < event.duration) {
        if (!event.click || late < 0.04) {
          voice(
            ctx,
            graph,
            {
              ...event,
              duration: Math.max(
                0.001,
                event.duration - late
              )
            },
            Math.max(now, eventTime)
          );
        }
      }

      if (scheduledCount >= 512) return;
    }

    if (!state.loop) {
      state.schedulingDone = true;
      return;
    }

    const nextOrigin = cycleOrigin + state.duration;

    if (nextOrigin > horizon) return;

    state.cycle++;
    state.eventIndex = 0;
  }
}

// 주어진 시간에 해당하는 악보 위치를 찾습니다.
function markerAtTime(markers, time) {
  let low = 0;
  let high = markers.length - 1;
  let found = null;

  while (low <= high) {
    const middle = Math.floor((low + high) / 2);
    const marker = markers[middle];

    if (marker.time <= time + 0.000001) {
      found = marker;
      low = middle + 1;
    } else {
      high = middle - 1;
    }
  }

  return found;
}

function displayPlaybackMarker(marker, state) {
  if (!marker) return;

  const barText = String(marker.bar + 1).padStart(2, "0");
  const beatText = String(marker.beat).padStart(2, "0");

  $("playPosition").textContent = `${barText} : ${beatText}`;

  $$("[data-bar-select]").forEach(element => {
    element.classList.toggle(
      "playing",
      Number(element.dataset.barSelect) === marker.bar
    );
  });

  const playhead = $("editorPlayhead");

  if (!playhead) return;

  const show =
    marker.bar === selectedBar &&
    marker.time >= state.start &&
    marker.time <= state.end;

  playhead.setAttribute(
    "visibility",
    show ? "visible" : "hidden"
  );

  if (show) {
    const x = 115 +
      marker.tick / Math.max(1, marker.length) * 800;

    playhead.setAttribute("x1", String(x));
    playhead.setAttribute("x2", String(x));
  }
}

function updateOutputMeter(state) {
  state.graph.analyser.getFloatTimeDomainData(
    state.meterData
  );

  let sum = 0;

  for (const sample of state.meterData) {
    sum += sample * sample;
  }

  const rms = Math.sqrt(sum / state.meterData.length);
  const level = clamp(rms * 3, 0, 1);

  const meter = $("outputMeter");

  if (meter) {
    const percent = level * 100;

    if (
      meter.tagName === "METER" ||
      meter.tagName === "PROGRESS"
    ) {
      meter.max = 100;
      meter.value = percent;
    } else {
      meter.style.width = `${percent}%`;
      meter.style.setProperty("--level", `${percent}%`);
    }

    meter.setAttribute("aria-valuemin", "0");
    meter.setAttribute("aria-valuemax", "100");
    meter.setAttribute(
      "aria-valuenow",
      String(Math.round(percent))
    );
  }

  const db = rms > 0.00001
    ? `${Math.round(20 * Math.log10(rms))} dB`
    : "−∞ dB";

  $("outputLevel").textContent = db;
}

function animatePlayback() {
  const state = runtime;

  if (!state) return;

  const elapsed = Math.max(
    0,
    state.ctx.currentTime - state.origin
  );

  // 마지막 음 뒤의 잔향도 잠시 들려줍니다.
  if (!state.loop && elapsed >= state.duration + 2) {
    stopPlayback(false);
    status("재생이 끝났어요.");
    return;
  }

  const visualCycle = state.loop
    ? Math.floor(elapsed / state.duration)
    : 0;

  const localTime = state.loop
    ? elapsed % state.duration
    : Math.min(elapsed, state.duration);

  const scoreTime = Math.min(
    state.end,
    state.start + localTime
  );

  const marker = markerAtTime(
    state.plan.markers,
    scoreTime
  );

  if (
    marker &&
    (
      marker !== state.lastMarker ||
      visualCycle !== state.lastVisualCycle
    )
  ) {
    displayPlaybackMarker(marker, state);

    state.lastMarker = marker;
    state.lastVisualCycle = visualCycle;
  }

  // 악보가 끝나고 녹음만 이어질 때는 악보 재생선을 숨깁니다.
  if (state.start + localTime > state.end) {
    $("editorPlayhead")?.setAttribute(
      "visibility",
      "hidden"
    );

    $$("[data-bar-select].playing").forEach(element => {
      element.classList.remove("playing");
    });
  }

  updateOutputMeter(state);

  state.raf = requestAnimationFrame(animatePlayback);
}

function stopPlayback(showMessage = true) {
  // 준비 중이던 비동기 재생 요청도 무효화합니다.
  playGeneration++;

  if (runtime) {
    if (runtime.timer !== null) {
      clearInterval(runtime.timer);
    }

    if (runtime.raf !== null) {
      cancelAnimationFrame(runtime.raf);
    }

    disposeGraph(runtime.graph);
    runtime = null;
  }

  disposeGraph(previewGraph);
  previewGraph = null;

  const playButton = $("playBtn");
  const selectionButton = $("playSelectionBtn");

  if (playButton) {
    playButton.disabled = false;
    playButton.textContent = "▶ 전체 재생";
    playButton.classList.remove("active");
    playButton.setAttribute("aria-pressed", "false");
  }

  if (selectionButton) {
    selectionButton.disabled = false;
    selectionButton.classList.remove("active");
  }

  $$("[data-bar-select].playing").forEach(element => {
    element.classList.remove("playing");
  });

  $("editorPlayhead")?.setAttribute(
    "visibility",
    "hidden"
  );

  if ($("playPosition")) {
    $("playPosition").textContent =
      `${String(selectedBar + 1).padStart(2, "0")} : 01`;
  }

  const meter = $("outputMeter");

  if (meter) {
    if (
      meter.tagName === "METER" ||
      meter.tagName === "PROGRESS"
    ) {
      meter.value = 0;
    } else {
      meter.style.width = "0%";
      meter.style.setProperty("--level", "0%");
    }

    meter.setAttribute("aria-valuenow", "0");
  }

  if ($("outputLevel")) {
    $("outputLevel").textContent = "−∞ dB";
  }

  if (showMessage && project) {
    status("재생을 멈췄어요.");
  }
}

// ===== 7부 끝 · 다음 코드를 바로 아래에 이어 붙이세요. =====
// ===== app.js 8부: WAV 저장 · 녹음 · 음원 불러오기 =====

function wavBlob(buffer) {
  const channels = Math.min(2, buffer.numberOfChannels);
  const frames = buffer.length;
  const bytesPerSample = 2;
  const blockAlign = channels * bytesPerSample;
  const dataSize = frames * blockAlign;

  const bytes = new ArrayBuffer(44 + dataSize);
  const view = new DataView(bytes);

  const writeText = (offset, text) => {
    for (let i = 0; i < text.length; i++) {
      view.setUint8(offset + i, text.charCodeAt(i));
    }
  };

  writeText(0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeText(8, "WAVE");
  writeText(12, "fmt ");

  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, channels, true);
  view.setUint32(24, buffer.sampleRate, true);

  view.setUint32(
    28,
    buffer.sampleRate * blockAlign,
    true
  );

  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true);

  writeText(36, "data");
  view.setUint32(40, dataSize, true);

  const samples = Array.from(
    { length: channels },
    (_, channel) => buffer.getChannelData(channel)
  );

  let peak = 0;

  samples.forEach(channel => {
    for (let i = 0; i < frames; i++) {
      peak = Math.max(peak, Math.abs(channel[i]));
    }
  });

  // 최대 진폭을 넘는 경우에만 음량을 낮춥니다.
  const scale = peak > 1 ? 0.98 / peak : 1;

  let offset = 44;

  for (let frame = 0; frame < frames; frame++) {
    for (let channel = 0; channel < channels; channel++) {
      const sample = clamp(
        samples[channel][frame] * scale,
        -1,
        1
      );

      const pcm = sample < 0
        ? Math.round(sample * 32768)
        : Math.round(sample * 32767);

      view.setInt16(offset, pcm, true);
      offset += bytesPerSample;
    }
  }

  return new Blob([bytes], { type: "audio/wav" });
}

async function exportWav() {
  if (!project || exporting) return;

  if (isRecording()) {
    toast("녹음을 마친 뒤 음악을 내려받아 주세요.");
    return;
  }

  const OfflineContext =
    window.OfflineAudioContext ||
    window.webkitOfflineAudioContext;

  if (!OfflineContext) {
    toast("이 브라우저에서는 WAV 파일을 만들 수 없어요.");
    return;
  }

  const snapshot = copy(project);
  const button = $("exportWavBtn");
  const previousLabel = button.textContent;

  let graph = null;

  exporting = true;
  button.disabled = true;
  button.textContent = "음악 파일 만드는 중…";

  stopPlayback(false);
  status("음악 파일을 만들고 있어요. 잠시 기다려 주세요.");

  try {
    const liveContext = await audioContext();

    const audioBuffer = snapshot.audio
      ? await getAudioBuffer(liveContext, snapshot)
      : null;

    const plan = buildPlan(snapshot);

    const audioEnd = audioBuffer
      ? snapshot.audio.offset + audioBuffer.duration
      : 0;

    const musicDuration = Math.max(
      0.1,
      plan.duration,
      audioEnd
    );

    if (musicDuration > 600) {
      throw new Error(
        "WAV 저장은 10분 이하 곡을 지원해요. 마디 수나 반복을 줄여 주세요."
      );
    }

    const sampleRate = 44100;
    const renderDuration = musicDuration + 2;

    const offline = new OfflineContext(
      2,
      Math.ceil(renderDuration * sampleRate),
      sampleRate
    );

    graph = makeGraph(offline, snapshot);

    // 메트로놈 소리는 완성 음원에 넣지 않습니다.
    plan.events.forEach(event => {
      if (!event.click) {
        voice(offline, graph, event, event.time);
      }
    });

    playAudioClip(
      offline,
      graph,
      snapshot,
      audioBuffer,
      0,
      0,
      musicDuration
    );

    const rendered = await offline.startRendering();
    const blob = wavBlob(rendered);

    download(
      blob,
      `${cleanFilename(snapshot.title)}.wav`
    );

    status("WAV 음악 파일을 만들었어요.");
    toast("브라우저의 다운로드 또는 저장 메뉴를 확인해 주세요.");
  } catch (error) {
    status(
      error.message || "음악 파일을 만들지 못했어요.",
      true
    );
  } finally {
    disposeGraph(graph);

    exporting = false;
    button.disabled = false;
    button.textContent = previousLabel;
  }
}

function blobDataURL(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(String(reader.result));

    reader.onerror = () => {
      reject(reader.error || new Error("파일을 읽지 못했어요."));
    };

    reader.onabort = () => {
      reject(new Error("파일 읽기가 중단됐어요."));
    };

    reader.readAsDataURL(blob);
  });
}

async function attachAudio(
  blob,
  name = "녹음",
  expectedProjectId = project?.id
) {
  if (!project || !blob || !canEdit()) return false;

  if (project.id !== expectedProjectId) {
    toast("작업 중인 곡이 바뀌어 음원을 넣지 않았어요.");
    return false;
  }

  if (blob.size === 0) {
    toast("녹음된 소리가 없어요.");
    return false;
  }

  if (blob.size > 20 * 1024 * 1024) {
    toast("음원 파일은 20MB 이하로 넣어 주세요.");
    return false;
  }

  try {
    status("음원 파일을 확인하고 있어요.");

    const ctx = await audioContext();
    const bytes = await blob.arrayBuffer();
    const buffer = await ctx.decodeAudioData(bytes);

    if (buffer.duration > 300) {
      throw new Error("음원은 5분 이하로 넣어 주세요.");
    }

    const audioBlob = blob.type.startsWith("audio/")
      ? blob
      : new Blob([blob], { type: "audio/octet-stream" });

    const data = await blobDataURL(audioBlob);

    if (!project || project.id !== expectedProjectId) {
      toast("작업 중인 곡이 바뀌어 음원을 넣지 않았어요.");
      return false;
    }

    const success = edit(() => {
      project.audio = {
        name: String(name).slice(0, 180),
        data,
        offset: 0,
        volume: 80
      };

      decodedAudio = buffer;
      decodedAudioData = data;
    }, "음원을 넣었어요. 시작 위치와 음량을 조절할 수 있어요.");

    return success;
  } catch (error) {
    status(
      error.message ||
      "음원을 읽지 못했어요. 다른 형식의 파일을 선택해 주세요.",
      true
    );

    return false;
  }
}

async function startRecording() {
  if (!project || isRecording()) return;

  if (
    !window.isSecureContext ||
    !navigator.mediaDevices?.getUserMedia
  ) {
    toast("마이크 녹음은 HTTPS 주소 또는 localhost에서 사용할 수 있어요.");
    return;
  }

  if (typeof MediaRecorder === "undefined") {
    toast("이 브라우저는 녹음을 지원하지 않아요. 음원 불러오기를 이용해 주세요.");
    return;
  }

  const targetProjectId = project.id;
  const chunks = [];

  let stream = null;
  let localRecorder = null;
  let limitTimer = null;
  let recordedBytes = 0;
  let failed = false;

  recordingPending = true;
  renderAudio();

  status("마이크 사용을 허용해 주세요. 반주가 새어 들어가지 않도록 이어폰을 사용하면 좋아요.");

  try {
    await audioContext();

    stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: false
      },
      video: false
    });

    if (
      !recordingPending ||
      !project ||
      project.id !== targetProjectId
    ) {
      stream.getTracks().forEach(track => track.stop());
      recordingPending = false;
      renderAudio();
      return;
    }

    recordingStream = stream;

    const candidates = [
      "audio/webm;codecs=opus",
      "audio/mp4",
      "audio/webm"
    ];

    const mimeType = candidates.find(type =>
      MediaRecorder.isTypeSupported(type)
    );

    localRecorder = mimeType
      ? new MediaRecorder(stream, { mimeType })
      : new MediaRecorder(stream);

    recorder = localRecorder;

    localRecorder.ondataavailable = event => {
      if (!event.data?.size) return;

      chunks.push(event.data);
      recordedBytes += event.data.size;

      if (
        recordedBytes >= 19 * 1024 * 1024 &&
        localRecorder.state === "recording"
      ) {
        toast("녹음 용량 한도에 가까워져 녹음을 마쳤어요.");
        localRecorder.stop();
      }
    };

    localRecorder.onerror = () => {
      failed = true;
      status("녹음 중 오류가 발생했어요.", true);

      if (localRecorder.state !== "inactive") {
        try {
          localRecorder.stop();
        } catch {
          stream.getTracks().forEach(track => track.stop());
        }
      }
    };

    localRecorder.onstop = async () => {
      clearTimeout(limitTimer);

      stream.getTracks().forEach(track => track.stop());

      if (recordingStream === stream) {
        recordingStream = null;
      }

      if (recorder === localRecorder) {
        recorder = null;
      }

      recordingPending = false;
      stopPlayback(false);
      renderAudio();

      if (failed || chunks.length === 0) {
        status("저장할 녹음이 없어요.", true);
        return;
      }

      const type =
        localRecorder.mimeType ||
        chunks[0].type ||
        "audio/webm";

      const blob = new Blob(chunks, { type });

      await attachAudio(
        blob,
        `마이크 녹음 ${new Date().toLocaleTimeString("ko-KR")}`,
        targetProjectId
      );
    };

    localRecorder.start(250);

    recordingPending = false;
    renderAudio();

    // 파일 길이 제한에 여유를 두고 자동 종료합니다.
    limitTimer = setTimeout(() => {
      if (localRecorder.state === "recording") {
        toast("최대 녹음 시간에 도달해 녹음을 마쳤어요.");
        localRecorder.stop();
      }
    }, 299000);

    // 마이크 녹음을 시작한 뒤 반주를 재생합니다.
    await startPlayback(false);

    if (localRecorder.state === "recording") {
      status("녹음 중이에요. 마치면 ‘녹음 종료’를 눌러 주세요.");
    }
  } catch (error) {
    clearTimeout(limitTimer);

    stream?.getTracks().forEach(track => track.stop());

    if (recordingStream === stream) {
      recordingStream = null;
    }

    if (recorder === localRecorder) {
      recorder = null;
    }

    recordingPending = false;
    renderAudio();

    status(
      error.name === "NotAllowedError"
        ? "마이크 사용이 허용되지 않았어요. 브라우저의 마이크 권한을 확인해 주세요."
        : error.message || "녹음을 시작하지 못했어요.",
      true
    );
  }
}

function stopRecording() {
  if (recordingPending && !recorder) {
    recordingPending = false;
    renderAudio();
    status("녹음 준비를 취소했어요.");
    return;
  }

  if (recorder && recorder.state !== "inactive") {
    recorder.stop();
    status("녹음을 마무리하고 있어요.");
  }

  stopPlayback(false);
}

function renderAudio() {
  if (!project) return;

  const busy = isRecording();
  const clip = project.audio;

  $("recordState").textContent = recordingPending
    ? "마이크 준비 중"
    : recorder?.state === "recording"
      ? "● 녹음 중"
      : "녹음 대기";

  $("recordBtn").disabled = busy;
  $("stopRecordBtn").disabled = !busy;
  $("importAudioBtn").disabled = busy;
  $("removeAudioBtn").disabled = busy || !clip;

  $("audioClipPanel").hidden = !clip;

  const preview = $("audioPreview");

  if (!clip) {
    if (preview.hasAttribute("src")) {
      preview.pause();
      preview.removeAttribute("src");
      preview.load();
    }

    $("audioClipName").textContent = "등록한 음원 없음";
    return;
  }

  $("audioClipName").textContent = clip.name;

  if (preview.getAttribute("src") !== clip.data) {
    preview.pause();
    preview.src = clip.data;
    preview.load();
  }

  setValue("audioOffset", clip.offset);
  setValue("audioVolume", clip.volume);

  $("audioVolumeValue").textContent = `${clip.volume}%`;
}

// ===== 8부 끝 · 다음 코드를 바로 아래에 이어 붙이세요. =====
// ===== app.js 9부: 마디 편집 · 복사 · 쉼표 채우기 =====

function selectedNotes() {
  if (!project) return [];

  return currentTrack().notes.filter(note =>
    note.bar >= selectedBar &&
    note.bar <= rangeEnd
  );
}

function insertMeasureAt(index) {
  if (!project || !canEdit()) return false;

  if (project.measures.length >= MAX_BARS) {
    toast(`마디는 최대 ${MAX_BARS}개까지 만들 수 있어요.`);
    return false;
  }

  index = clamp(
    Math.floor(index),
    0,
    project.measures.length
  );

  const reference = project.measures[
    Math.max(0, Math.min(index - 1, project.measures.length - 1))
  ];

  const measure = newMeasure();
  measure.meter = reference.meter;

  return edit(() => {
    project.measures.splice(index, 0, measure);

    project.tracks.forEach(track => {
      track.notes.forEach(note => {
        if (note.bar >= index) {
          note.bar++;
        }

        // 삽입 위치를 가로지르는 붙임줄을 해제합니다.
        if (note.bar === index - 1) {
          note.tie = false;
        }
      });
    });

    selectedBar = index;
    rangeEnd = index;
    selectedNoteId = null;
  }, `${index + 1}번째 위치에 새 마디를 넣었어요.`);
}

function applyMeasureSettings() {
  if (!project || !canEdit()) return false;

  const meter = $("measureMeter").value;
  const tempoText = $("measureTempo").value.trim();
  const tempo = tempoText === "" ? null : Number(tempoText);

  const section = $("sectionName").value.trim().slice(0, 30);
  const dynamic = $("measureDynamic").value;
  const ramp = $("measureRamp").value;
  const repeat = Number($("measureRepeat").value);

  if (!METERS.includes(meter)) {
    toast("사용할 박자를 선택해 주세요.");
    return false;
  }

  if (
    tempo !== null &&
    (!Number.isFinite(tempo) || tempo < 30 || tempo > 240)
  ) {
    toast("마디 빠르기는 30~240 BPM으로 설정해 주세요.");
    return false;
  }

  if (
    !own(DYNAMICS, dynamic) ||
    !["none", "crescendo", "decrescendo"].includes(ramp) ||
    ![1, 2].includes(repeat)
  ) {
    toast("마디 설정을 다시 확인해 주세요.");
    return false;
  }

  const newLength = barTicks({ meter });

  // 박자를 줄일 때 기존 음표를 자동으로 잘라내지 않습니다.
  for (const track of project.tracks) {
    const overflowing = track.notes.find(note =>
      note.bar >= selectedBar &&
      note.bar <= rangeEnd &&
      note.tick + note.duration > newLength
    );

    if (overflowing) {
      toast(
        `${overflowing.bar + 1}마디의 ‘${track.name}’ 음표가 ` +
        "새 박자를 넘어요. 음표를 줄이거나 옮긴 뒤 적용해 주세요."
      );

      return false;
    }
  }

  const first = selectedBar;
  const last = rangeEnd;

  return edit(() => {
    for (let bar = first; bar <= last; bar++) {
      Object.assign(project.measures[bar], {
        meter,
        tempo,
        section,
        dynamic,
        ramp,
        repeat
      });
    }

    repairTies();
  }, `${first + 1}~${last + 1}마디에 설정을 적용했어요.`);
}

// 이어질 음이 사라진 붙임줄을 정리합니다.
function repairTies() {
  if (!project) return;

  project.tracks.forEach(track => {
    const starts = new Set(
      track.notes
        .filter(note => note.pitch !== null)
        .map(note =>
          `${note.bar}:${note.tick}:${note.pitch}`
        )
    );

    track.notes.forEach(note => {
      if (!note.tie) return;

      if (note.pitch === null) {
        note.tie = false;
        return;
      }

      const length = barTicks(project.measures[note.bar]);
      const endTick = note.tick + note.duration;

      const nextBar = endTick === length
        ? note.bar + 1
        : note.bar;

      const nextTick = endTick === length ? 0 : endTick;

      if (!starts.has(`${nextBar}:${nextTick}:${note.pitch}`)) {
        note.tie = false;
      }
    });
  });
}

// 선택 범위의 모든 악기와 마디 설정을 복사합니다.
function copyMeasures() {
  if (!project) return;

  const first = selectedBar;
  const last = rangeEnd;

  clipboard = {
    measures: copy(
      project.measures.slice(first, last + 1)
    ),

    tracks: project.tracks.map(track => ({
      id: track.id,
      name: track.name,
      instrument: track.instrument,
      volume: track.volume,
      pan: track.pan,
      mute: track.mute,
      solo: track.solo,

      notes: track.notes
        .filter(note =>
          note.bar >= first && note.bar <= last
        )
        .map(note => ({
          ...copy(note),
          bar: note.bar - first
        }))
    }))
  };

  toast(
    `${first + 1}~${last + 1}마디의 모든 악기를 복사했어요. ` +
    "붙여넣을 시작 마디를 선택해 주세요."
  );

  status("마디를 복사했어요. 복사 내용은 현재 열린 페이지에 보관돼요.");
}

// 원래 트랙이 있으면 그 트랙에 붙이고,
// 삭제된 트랙은 새 트랙으로 복원합니다.
function pasteMeasures() {
  if (!project || !canEdit()) return false;

  if (!clipboard?.measures?.length) {
    toast("먼저 복사할 마디 범위를 선택하고 ‘복사’를 눌러 주세요.");
    return false;
  }

  const first = selectedBar;
  const count = clipboard.measures.length;
  const endExclusive = first + count;

  if (endExclusive > MAX_BARS) {
    toast(`붙여넣으면 ${MAX_BARS}마디를 넘어요.`);
    return false;
  }

  const currentIds = new Set(project.tracks.map(track => track.id));

  const missingTracks = clipboard.tracks.filter(
    track => !currentIds.has(track.id)
  );

  if (project.tracks.length + missingTracks.length > MAX_TRACKS) {
    toast(
      "복사한 악기를 복원하면 트랙 한도를 넘어요. " +
      "사용하지 않는 악기를 정리해 주세요."
    );
    return false;
  }

  // 붙여넣지 않는 다른 트랙의 음도 새 박자에 들어가는지 확인합니다.
  const replacedIds = new Set(
    clipboard.tracks.map(track => track.id)
  );

  for (const track of project.tracks) {
    if (replacedIds.has(track.id)) continue;

    const overflow = track.notes.find(note => {
      if (note.bar < first || note.bar >= endExclusive) {
        return false;
      }

      const measure = clipboard.measures[note.bar - first];

      return note.tick + note.duration > barTicks(measure);
    });

    if (overflow) {
      toast(
        `붙여넣을 박자가 ‘${track.name}’의 기존 음표보다 짧아요. ` +
        "해당 음표를 먼저 정리해 주세요."
      );
      return false;
    }
  }

  return edit(() => {
    while (project.measures.length < endExclusive) {
      project.measures.push(newMeasure());
    }

    clipboard.measures.forEach((measure, index) => {
      project.measures[first + index] = copy(measure);
    });

    clipboard.tracks.forEach(source => {
      let target = project.tracks.find(
        track => track.id === source.id
      );

      if (!target) {
        target = newTrack(source.instrument, source.name);

        // 같은 복사 내용을 다시 붙여도 트랙이 중복 생성되지 않게 합니다.
        target.id = source.id;
        target.volume = source.volume;
        target.pan = source.pan;
        target.mute = source.mute;
        target.solo = source.solo;

        project.tracks.push(target);
      }

      target.notes = target.notes.filter(note =>
        note.bar < first || note.bar >= endExclusive
      );

      const additions = source.notes.map(note => ({
        ...copy(note),
        id: uid(),
        bar: first + note.bar
      }));

      target.notes.push(...additions);
    });

    rangeEnd = endExclusive - 1;
    selectedNoteId = null;

    repairTies();
  }, `${first + 1}~${endExclusive}마디에 붙여넣었어요.`);
}

function deleteMeasures() {
  if (!project || !canEdit()) return false;

  const first = selectedBar;
  const last = rangeEnd;
  const count = last - first + 1;

  if (count >= project.measures.length) {
    toast("곡에는 최소 한 마디가 필요해요. 음만 지우려면 ‘비우기’를 사용해 주세요.");
    return false;
  }

  return edit(() => {
    project.measures.splice(first, count);

    project.tracks.forEach(track => {
      track.notes = track.notes
        .filter(note => note.bar < first || note.bar > last)
        .map(note => {
          if (note.bar > last) {
            note.bar -= count;
          }

          if (note.bar === first - 1) {
            note.tie = false;
          }

          return note;
        });
    });

    selectedBar = Math.min(
      first,
      project.measures.length - 1
    );

    rangeEnd = selectedBar;
    selectedNoteId = null;

    repairTies();
  }, `${count}개 마디를 삭제했어요. 되돌리기로 복원할 수 있어요.`);
}

// 현재 악기의 현재 마디만 비웁니다.
function clearCurrentMeasure() {
  if (!project || !canEdit()) return false;

  const track = currentTrack();

  return edit(() => {
    track.notes = track.notes.filter(
      note => note.bar !== selectedBar
    );

    selectedNoteId = null;
    repairTies();
  }, `${track.name}의 ${selectedBar + 1}마디를 비웠어요.`);
}

// 현재 악기의 빈 시간대를 쉼표로 채웁니다.
// 화음은 음 개수가 아니라 차지하는 시간대로 계산합니다.
function fillRests() {
  if (!project || !canEdit()) return false;

  const track = currentTrack();
  const length = barTicks(currentMeasure());
  const occupied = new Uint8Array(length);

  track.notes
    .filter(note => note.bar === selectedBar)
    .forEach(note => {
      const start = Math.max(0, Math.floor(note.tick));
      const end = Math.min(
        length,
        Math.ceil(note.tick + note.duration)
      );

      occupied.fill(1, start, end);
    });

  const additions = [];
  const measure = currentMeasure();
  const [, denominator] = measure.meter.split("/").map(Number);
  const beatTicks = TICKS * 4 / denominator;

  let cursor = 0;

  while (cursor < length) {
    if (occupied[cursor]) {
      cursor++;
      continue;
    }

    const gapStart = cursor;

    while (cursor < length && !occupied[cursor]) {
      cursor++;
    }

    const gapEnd = cursor;
    let position = gapStart;

    while (position < gapEnd) {
      // 박 경계에서 나누어 빈 위치를 읽기 쉽게 표시합니다.
      const nextBeat =
        (Math.floor(position / beatTicks) + 1) * beatTicks;

      const available =
        Math.min(gapEnd, nextBeat) - position;

      const duration = [96, 48, 24, 12, 6, 4, 2, 1]
        .find(value => value <= available);

      const triplet = duration === 4 || duration === 2;

      additions.push(
        newNote(
          selectedBar,
          position,
          null,
          duration,
          {
            base: triplet ? duration * 1.5 : duration,
            rhythm: triplet ? "triplet" : "normal",
            accidental: 0
          }
        )
      );

      position += duration;
    }
  }

  if (!additions.length) {
    toast("이 마디에는 비어 있는 시간이 없어요.");
    return false;
  }

  return edit(() => {
    track.notes.push(...additions);
    selectedNoteId = null;
  }, `빈 위치에 쉼표 ${additions.length}개를 넣었어요.`);
}

// ===== 9부 끝 · 다음 코드를 바로 아래에 이어 붙이세요. =====
// ===== app.js 10부: 곡 점검 · 인쇄 · 프로젝트 저장 =====

function checkProject() {
  if (!project) return;

  const tracks = activeTracks(project);

  const notes = project.tracks.flatMap(track =>
    track.notes.filter(note => note.pitch !== null)
  );

  const rests = project.tracks.reduce(
    (sum, track) =>
      sum + track.notes.filter(note => note.pitch === null).length,
    0
  );

  const issues = [];

  if (!notes.length) {
    issues.push("아직 연주할 음이 없어요. 작곡판에 음을 넣어 보세요.");
  }

  if (!tracks.length) {
    issues.push("재생 가능한 악기가 없어요. 음소거·단독 재생 설정을 확인하세요.");
  }

  if (project.effects.master === 0) {
    issues.push("전체 음량이 0%여서 소리가 나지 않아요.");
  }

  const silentTracks = tracks.filter(track =>
    track.volume === 0 &&
    track.notes.some(note => note.pitch !== null)
  );

  silentTracks.forEach(track => {
    issues.push(`‘${track.name}’의 음량이 0%예요.`);
  });

  const occupiedBars = new Set();

  tracks
    .filter(track => track.volume > 0)
    .forEach(track => {
      track.notes.forEach(note => {
        if (note.pitch !== null) {
          occupiedBars.add(note.bar);
        }
      });
    });

  const emptyBars = project.measures
    .map((_, index) => index)
    .filter(index => !occupiedBars.has(index));

  if (emptyBars.length) {
    const list = emptyBars
      .slice(0, 12)
      .map(bar => bar + 1)
      .join(", ");

    issues.push(
      `${list}${emptyBars.length > 12 ? " 외" : ""}마디에는 ` +
      "재생 가능한 악기 음이 없어요. 의도한 쉼 구간인지 확인하세요."
    );
  }

  let overlapping = 0;
  let brokenTies = 0;

  project.tracks.forEach(track => {
    const groups = new Map();
    const starts = new Set();

    track.notes.forEach(note => {
      if (note.pitch === null) return;

      starts.add(`${note.bar}:${note.tick}:${note.pitch}`);

      const key = `${note.bar}:${note.pitch}`;

      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(note);
    });

    groups.forEach(group => {
      group.sort((a, b) => a.tick - b.tick);

      let previousEnd = -1;

      group.forEach(note => {
        if (note.tick < previousEnd) overlapping++;

        previousEnd = Math.max(
          previousEnd,
          note.tick + note.duration
        );
      });
    });

    track.notes.forEach(note => {
      if (!note.tie || note.pitch === null) return;

      const length = barTicks(project.measures[note.bar]);
      const end = note.tick + note.duration;

      const nextBar = end === length ? note.bar + 1 : note.bar;
      const nextTick = end === length ? 0 : end;

      if (!starts.has(`${nextBar}:${nextTick}:${note.pitch}`)) {
        brokenTies++;
      }
    });
  });

  if (overlapping) {
    issues.push(
      `같은 악기의 같은 높이 음이 겹치는 곳이 ${overlapping}개 있어요.`
    );
  }

  if (brokenTies) {
    issues.push(
      `이어지는 음을 찾을 수 없는 붙임줄이 ${brokenTies}개 있어요.`
    );
  }

  const plan = buildPlan(project);
  const seconds = Math.round(plan.duration);

  const durationText =
    `${Math.floor(seconds / 60)}분 ${seconds % 60}초`;

  dialog("곡 점검", `
    <div class="info-box">
      <strong>${esc(project.title || "제목 없는 곡")}</strong>
      <p>
        ${project.measures.length}마디 ·
        악기 ${project.tracks.length}개 ·
        음 ${notes.length}개 ·
        쉼표 ${rests}개
      </p>
      <p>악보 재생 시간: ${durationText}</p>
    </div>

    ${
      issues.length
        ? issues.map(issue => `
            <div class="check-item">${esc(issue)}</div>
          `).join("")
        : `
          <div class="check-item">
            기본 점검에서 확인할 항목이 발견되지 않았어요.
            직접 재생하면서 음량과 연결을 들어 보세요.
          </div>
        `
    }

    <p class="muted">
      이 점검은 입력 상태를 확인하는 기능이에요.
      화성학적 완성도나 전통음악의 토리·시김새 정확성을
      판정하지 않아요. 불러온 음원의 소리도 별도로 확인해 주세요.
    </p>
  `);
}

function projectCardHTML(p = project) {
  if (!p) return "";

  const description = esc(p.description || "")
    .replace(/\n/g, "<br>");

  return `
    <article class="project-card">
      <p>SILVERSTAR STUDIO</p>
      <h2>${esc(p.title || "제목 없는 곡")}</h2>

      <dl>
        <dt>작곡</dt>
        <dd>${esc(p.composer || "미입력")}</dd>

        <dt>작사</dt>
        <dd>${esc(p.lyricist || "미입력")}</dd>

        <dt>편곡</dt>
        <dd>${esc(p.arranger || "미입력")}</dd>

        <dt>장르</dt>
        <dd>${esc(p.genre)}</dd>

        <dt>기본 빠르기</dt>
        <dd>♩ = ${p.bpm} BPM</dd>

        <dt>구성</dt>
        <dd>
          ${p.measures.length}마디 · 악기 ${p.tracks.length}개
        </dd>
      </dl>

      ${
        description
          ? `<h3>작품 소개</h3><p>${description}</p>`
          : ""
      }
    </article>
  `;
}

function printScore() {
  if (!project) return;

  if (isRecording()) {
    toast("녹음을 마친 뒤 악보를 인쇄해 주세요.");
    return;
  }

  stopPlayback(false);

  const area = $("printArea");

  const parts = project.tracks.map(track => {
    const bars = project.measures.map((measure, bar) => {
      const lyrics = esc(measure.lyrics || "")
        .replace(/\n/g, "<br>");

      const memo = esc(measure.memo || "")
        .replace(/\n/g, "<br>");

      return `
        <section style="break-inside:avoid;margin-bottom:18px">
          ${scoreSVG(track, bar, true)}

          ${
            lyrics
              ? `<p><strong>가사</strong> ${lyrics}</p>`
              : ""
          }

          ${
            memo
              ? `<p><strong>메모</strong> ${memo}</p>`
              : ""
          }
        </section>
      `;
    }).join("");

    return `
      <section style="break-before:page">
        <h2>${esc(track.name)}</h2>
        <p>
          ${esc(INSTRUMENTS[track.instrument][0])}
          ${
            isDrum(track)
              ? " · 타격음을 음 높이 위치로 표시한 참고 악보"
              : ""
          }
        </p>
        ${bars}
      </section>
    `;
  }).join("");

  area.innerHTML = `
    ${projectCardHTML()}
    <p>
      입력 확인용 악보입니다.
      성부 분리·음표 묶기·정식 국악 기보를 모두 지원하는
      전문 출판 악보는 아닙니다.
    </p>
    ${parts}
  `;

  // 화면 표시 설정과 관계없이 인쇄 시 SVG가 폭에 맞게 줄어듭니다.
  area.querySelectorAll("svg").forEach(svg => {
    svg.style.width = "100%";
    svg.style.height = "auto";
    svg.style.display = "block";
  });

  const oldTitle = document.title;
  document.title = project.title || "실버스타 스튜디오 악보";

  const restoreTitle = () => {
    document.title = oldTitle;
    window.removeEventListener("afterprint", restoreTitle);
  };

  window.addEventListener("afterprint", restoreTitle);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      try {
        window.print();
      } catch {
        restoreTitle();
        toast("인쇄 창을 열지 못했어요.");
      }
    });
  });
}

function saveProject() {
  if (!project) return;

  try {
    const data = JSON.stringify(project, null, 2);

    download(
      new Blob([data], { type: "application/json" }),
      `${cleanFilename(project.title)}.json`
    );

    status(
      "프로젝트 파일을 만들었어요. 불러오기로 다시 편집할 수 있어요."
    );
  } catch (error) {
    status(
      error.message || "프로젝트 파일을 만들지 못했어요.",
      true
    );
  }
}

let versionSaveBusy = false;

async function saveVersion() {
  if (!project || versionSaveBusy) return;

  if (isRecording()) {
    toast("녹음을 마친 뒤 버전을 저장해 주세요.");
    return;
  }

  const snapshot = copy(project);
  versionSaveBusy = true;

  const button = $("saveVersionBtn");
  if (button) button.disabled = true;

  try {
    const stored = await storageGet("versions");
    const versions = Array.isArray(stored) ? stored : [];

    const entry = {
      id: uid(),
      date: new Date().toISOString(),
      project: snapshot
    };

    // 이 브라우저에서 저장한 최근 8개 버전을 보관합니다.
    await storageSet(
      "versions",
      [entry, ...versions].slice(0, 8)
    );

    toast("현재 상태를 새 버전으로 저장했어요.");
    status("버전을 저장했어요. 중요한 작품은 프로젝트 파일도 받아 두세요.");
  } catch (error) {
    status(
      "버전을 저장하지 못했어요. 저장 공간을 확인하거나 프로젝트 파일로 저장해 주세요.",
      true
    );
  } finally {
    versionSaveBusy = false;
    if (button) button.disabled = false;
  }
}

async function openVersions() {
  try {
    const stored = await storageGet("versions");

    const versions = Array.isArray(stored)
      ? stored.filter(entry => entry?.project && entry?.id)
      : [];

    if (!versions.length) {
      dialog("저장한 버전", `
        <p>아직 저장한 버전이 없어요.</p>
        <p>작곡 중 ‘버전 저장’을 누르면 현재 상태를 보관할 수 있어요.</p>
      `);
      return;
    }

    const list = versions.map(entry => {
      const date = new Date(entry.date);

      const dateText = Number.isNaN(date.getTime())
        ? "저장 날짜 없음"
        : date.toLocaleString("ko-KR");

      return `
        <div class="version-item">
          <div>
            <strong>
              ${esc(entry.project.title || "제목 없는 곡")}
            </strong>
            <p>${esc(dateText)}</p>
            <small>
              ${esc(entry.project.genre || "")}
              · ${entry.project.measures?.length || 0}마디
            </small>
          </div>

          <button
            type="button"
            data-restore-version="${esc(entry.id)}"
          >
            이 버전 불러오기
          </button>
        </div>
      `;
    }).join("");

    dialog("저장한 버전", `
      <p class="info-box">
        이 브라우저에서 저장한 최근 8개 버전이에요.
        불러온 뒤에는 되돌리기로 이전 작업을 복원할 수 있어요.
      </p>
      ${list}
    `);
  } catch {
    toast("저장한 버전 목록을 읽지 못했어요.");
  }
}

async function restoreVersion(id) {
  if (!project || !canEdit()) return;

  const expectedProjectId = project.id;

  try {
    const stored = await storageGet("versions");

    const entry = Array.isArray(stored)
      ? stored.find(item => item.id === id)
      : null;

    if (!entry) {
      toast("해당 버전을 찾을 수 없어요.");
      return;
    }

    if (!project || project.id !== expectedProjectId) {
      toast("작업 중인 곡이 바뀌었어요. 버전 목록을 다시 열어 주세요.");
      return;
    }

    const loaded = validateProject(entry.project);

    const success = edit(() => {
      project = loaded;

      selectedTrack = 0;
      selectedBar = 0;
      rangeEnd = 0;
      selectedNoteId = null;
      selectedGenre = loaded.genre;

      decodedAudio = null;
      decodedAudioData = null;
    }, "저장한 버전을 불러왔어요.");

    if (success) {
      $("infoDialog").close();
    }
  } catch (error) {
    toast(error.message || "이 버전을 불러오지 못했어요.");
  }
}

// ===== 10부 끝 · 다음 코드를 바로 아래에 이어 붙이세요. =====
// ===== app.js 11부: 시작 화면 · 프로젝트 · 악기 버튼 =====

function bind(id, eventName, handler) {
  const element = $(id);

  if (element) {
    element.addEventListener(eventName, handler);
  }
}

function resetProjectSelection() {
  selectedTrack = 0;
  selectedBar = 0;
  rangeEnd = 0;
  selectedNoteId = null;

  decodedAudio = null;
  decodedAudioData = null;

  comparison = null;
  comparisonSide = "B";

  if ($("switchABBtn")) {
    $("switchABBtn").disabled = true;
  }

  if ($("abState")) {
    $("abState").textContent = "A 버전을 먼저 보관해 주세요.";
  }
}

function textChange(id, setter, maxLength = 1000) {
  bind(id, "change", event => {
    if (!project) return;

    const value = event.target.value.slice(0, maxLength);

    edit(() => {
      setter(value);
    });
  });
}

function installCoreEvents() {
  const root = $("studioScreen");

  if (!root || root.dataset.coreReady === "true") return;

  root.dataset.coreReady = "true";

  // ---------- 장르 선택 ----------

  bind("genreSearch", "input", renderGenres);

  bind("genreFilters", "click", event => {
    const button = event.target.closest("[data-category]");
    if (!button) return;

    category = button.dataset.category;
    renderGenres();
  });

  bind("genreGrid", "click", event => {
    const button = event.target.closest("[data-genre]");
    if (!button) return;

    selectedGenre = button.dataset.genre;
    renderGenres();
  });

  bind("createProjectBtn", "click", () => {
    if (!canEdit()) return;

    const length = Number($("setupMeasures").value);

    if (
      !Number.isInteger(length) ||
      length < 1 ||
      length > MAX_BARS
    ) {
      toast("곡의 마디 수를 확인해 주세요.");
      return;
    }

    stopPlayback(false);
    clearTimeout(autoTimer);

    project = makeProject(
      selectedGenre,
      length,
      $("setupMode").value === "example"
    );

    project.title = project.title.slice(0, 80);
    project.composer = project.composer.slice(0, 60);

    undoStack = [];
    redoStack = [];

    resetProjectSelection();
    autosave();
    showStudio();

    status("새 곡을 만들었어요. 악기와 마디를 선택해 시작하세요.");
  });

  bind("resumeBtn", "click", async () => {
    if (!canEdit()) return;

    const button = $("resumeBtn");
    button.disabled = true;

    try {
      const saved = await storageGet("autosave");

      if (!saved) {
        toast("자동저장된 곡이 없어요.");
        return;
      }

      const loaded = validateProject(saved);

      stopPlayback(false);
      clearTimeout(autoTimer);

      project = loaded;
      selectedGenre = loaded.genre;

      undoStack = [];
      redoStack = [];

      resetProjectSelection();
      showStudio();

      status("자동저장한 곡을 이어서 열었어요.");
    } catch (error) {
      toast(error.message || "저장한 곡을 열지 못했어요.");
    } finally {
      button.disabled = false;
    }
  });

  bind("homeBtn", "click", () => {
    if (!canEdit()) return;

    stopPlayback(false);
    autosave();

    $("studioScreen").hidden = true;
    $("startScreen").hidden = false;

    renderGenres();
    window.scrollTo({ top: 0, behavior: "auto" });
  });

  // ---------- 프로젝트 파일 ----------

  const chooseProjectFile = () => {
    if (!canEdit()) return;
    $("projectFileInput").click();
  };

  bind("startOpenBtn", "click", chooseProjectFile);
  bind("openProjectBtn", "click", chooseProjectFile);

  bind("projectFileInput", "change", async event => {
    const input = event.target;
    const file = input.files?.[0];

    if (!file) return;

    try {
      if (!canEdit()) return;

      if (file.size > 35 * 1024 * 1024) {
        throw new Error("프로젝트 파일은 35MB 이하로 열어 주세요.");
      }

      const text = await file.text();
      const loaded = validateProject(JSON.parse(text));

      if (!canEdit()) return;

      stopPlayback(false);
      clearTimeout(autoTimer);

      const previous = project ? copy(project) : null;

      project = loaded;
      selectedGenre = loaded.genre;

      undoStack = previous ? [previous] : [];
      redoStack = [];

      resetProjectSelection();
      autosave();
      showStudio();

      status("프로젝트 파일을 불러왔어요.");
    } catch (error) {
      toast(
        error instanceof SyntaxError
          ? "JSON 프로젝트 파일 형식을 확인해 주세요."
          : error.message || "프로젝트를 불러오지 못했어요."
      );
    } finally {
      input.value = "";
    }
  });

  bind("saveProjectBtn", "click", saveProject);
  bind("exportWavBtn", "click", exportWav);

  // ---------- 재생과 기록 ----------

  bind("playBtn", "click", () => {
    if (runtime) {
      stopPlayback();
    } else {
      startPlayback(false);
    }
  });

  bind("playSelectionBtn", "click", () => {
    startPlayback(true);
  });

  bind("stopBtn", "click", () => {
    stopPlayback();
  });

  bind("undoBtn", "click", undo);
  bind("redoBtn", "click", redo);

  // 재생 중 설정을 바꾸면 현재 마디에서 새로 재생합니다.
  const restartPlaybackOptions = () => {
    if (!runtime) return;

    const selectionOnly = runtime.selectionOnly;
    startPlayback(selectionOnly);
  };

  bind("loopPlayback", "change", restartPlaybackOptions);
  bind("metronome", "change", restartPlaybackOptions);

  bind("tempo", "change", event => {
    if (!project) return;

    const value = Number(event.target.value);

    if (!Number.isFinite(value) || value < 30 || value > 240) {
      event.target.value = project.bpm;
      toast("빠르기는 30~240 BPM으로 입력해 주세요.");
      return;
    }

    edit(() => {
      project.bpm = value;
    }, "곡의 기본 빠르기를 바꿨어요.");
  });

  // ---------- 작품 정보 ----------

  textChange("projectTitle", value => {
    project.title = value;
  }, 80);

  textChange("projectComposer", value => {
    project.composer = value;
  }, 60);

  textChange("lyricist", value => {
    project.lyricist = value;
  }, 60);

  textChange("arranger", value => {
    project.arranger = value;
  }, 60);

  textChange("projectDescription", value => {
    project.description = value;
  }, 2000);

  // ---------- 악기 선택과 추가 ----------

  bind("addTrackBtn", "click", () => {
    if (!project) return;

    if (project.tracks.length >= MAX_TRACKS) {
      toast(`악기는 최대 ${MAX_TRACKS}개까지 넣을 수 있어요.`);
      return;
    }

    const instrument = $("instrumentSelect").value;

    if (!own(INSTRUMENTS, instrument)) return;

    edit(() => {
      project.tracks.push(newTrack(instrument));
      selectedTrack = project.tracks.length - 1;
      selectedNoteId = null;
    }, "새 악기를 추가했어요.");
  });

  bind("trackList", "click", event => {
    if (!project) return;

    const button = event.target.closest("[data-track-select]");
    if (!button) return;

    selectedTrack = clamp(
      Number(button.dataset.trackSelect),
      0,
      project.tracks.length - 1
    );

    selectedNoteId = null;
    render();
  });

  bind("arrangement", "click", event => {
    if (!project) return;

    const clip = event.target.closest("[data-bar-select]");

    if (clip) {
      selectBar(
        Number(clip.dataset.barSelect),
        Number(clip.dataset.trackIndex)
      );
      return;
    }

    const trackButton = event.target.closest("[data-track-select]");

    if (trackButton) {
      selectedTrack = clamp(
        Number(trackButton.dataset.trackSelect),
        0,
        project.tracks.length - 1
      );

      selectedNoteId = null;
      render();
    }
  });

  textChange("trackName", value => {
    currentTrack().name =
      value.trim() || INSTRUMENTS[currentTrack().instrument][0];
  }, 40);

  bind("trackInstrument", "change", event => {
    if (!project) return;

    const track = currentTrack();
    const instrument = event.target.value;

    if (!own(INSTRUMENTS, instrument)) return;

    const wasDrum = isDrum(track);
    const willBeDrum = INSTRUMENTS[instrument][3] === "drum";

    if (
      wasDrum !== willBeDrum &&
      track.notes.some(note => note.pitch !== null)
    ) {
      event.target.value = track.instrument;
      toast("음이 있는 트랙은 타악기와 선율 악기 사이에서 바로 바꿀 수 없어요. 새 악기를 추가해 주세요.");
      return;
    }

    const oldDefaultName = INSTRUMENTS[track.instrument][0];

    edit(() => {
      track.instrument = instrument;

      if (track.name === oldDefaultName) {
        track.name = INSTRUMENTS[instrument][0];
      }
    }, "악기 소리를 바꿨어요.");
  });

  bind("muteTrackBtn", "click", () => {
    if (!project) return;

    edit(() => {
      currentTrack().mute = !currentTrack().mute;
    });
  });

  bind("soloTrackBtn", "click", () => {
    if (!project) return;

    edit(() => {
      currentTrack().solo = !currentTrack().solo;
    });
  });

  bind("deleteTrackBtn", "click", () => {
    if (!project) return;

    if (project.tracks.length === 1) {
      toast("악기는 최소 한 개 남겨 주세요.");
      return;
    }

    edit(() => {
      project.tracks.splice(selectedTrack, 1);

      selectedTrack = Math.min(
        selectedTrack,
        project.tracks.length - 1
      );

      selectedNoteId = null;
    }, "악기를 삭제했어요. 되돌리기로 복원할 수 있어요.");
  });

  bind("trackVolume", "input", event => {
    $("trackVolumeValue").textContent = `${event.target.value}%`;
  });

  bind("trackVolume", "change", event => {
    if (!project) return;

    const value = clamp(Number(event.target.value), 0, 100);

    edit(() => {
      currentTrack().volume = value;
    });
  });

  bind("trackPan", "input", event => {
    const value = Number(event.target.value);

    $("trackPanValue").textContent = value === 0
      ? "중앙"
      : `${value < 0 ? "왼쪽" : "오른쪽"} ${Math.abs(value)}`;
  });

  bind("trackPan", "change", event => {
    if (!project) return;

    const value = clamp(Number(event.target.value), -100, 100);

    edit(() => {
      currentTrack().pan = value;
    });
  });

  // ---------- 마디 이동과 편집 ----------

  bind("previousMeasureBtn", "click", () => {
    if (project) selectBar(selectedBar - 1);
  });

  bind("nextMeasureBtn", "click", () => {
    if (project) selectBar(selectedBar + 1);
  });

  bind("rangeEnd", "change", event => {
    if (!project) return;

    rangeEnd = clamp(
      Number(event.target.value),
      selectedBar,
      project.measures.length - 1
    );

    renderArrangement();
    renderMeasure();
  });

  bind("addMeasureBtn", "click", () => {
    if (project) insertMeasureAt(project.measures.length);
  });

  bind("insertMeasureBtn", "click", () => {
    if (project) insertMeasureAt(selectedBar);
  });

  bind("applyMeasureSettingsBtn", "click", applyMeasureSettings);
  bind("copyMeasuresBtn", "click", copyMeasures);
  bind("pasteMeasuresBtn", "click", pasteMeasures);
  bind("deleteMeasuresBtn", "click", deleteMeasures);
  bind("clearMeasureBtn", "click", clearCurrentMeasure);

  textChange("measureLyrics", value => {
    currentMeasure().lyrics = value;
  }, 1000);

  textChange("measureMemo", value => {
    currentMeasure().memo = value;
  }, 600);
}

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    installCoreEvents,
    { once: true }
  );
} else {
  installCoreEvents();
}

// ===== 11부 끝 · 다음 코드를 바로 아래에 이어 붙이세요. =====// ===== app.js 12부: 음표 설정 · 건반 · 화음 · 변형 =====

function applySelectedNoteSettings() {
  const note = currentNote();

  if (!note) {
    toast("먼저 수정할 음표를 선택해 주세요.");
    return;
  }

  const settings = noteSettings();
  const track = currentTrack();

  const pitch = note.pitch === null
    ? null
    : clamp(
        note.pitch - note.accidental + settings.accidental,
        24,
        108
      );

  if (
    note.tick + settings.duration >
    barTicks(project.measures[note.bar])
  ) {
    toast("음표 길이가 마디를 넘어요.");
    return;
  }

  const overlap = track.notes.some(other =>
    other.id !== note.id &&
    other.bar === note.bar &&
    other.pitch === pitch &&
    other.tick < note.tick + settings.duration &&
    other.tick + other.duration > note.tick
  );

  if (overlap) {
    toast("설정을 적용하면 같은 높이의 음이 겹쳐요.");
    return;
  }

  edit(() => {
    Object.assign(note, settings, { pitch });
    repairTies();
  }, "선택한 음표에 설정을 적용했어요.");
}

function toggleSelectedTie() {
  const note = currentNote();

  if (!note || note.pitch === null) return;

  if (note.tie) {
    edit(() => {
      note.tie = false;
    }, "붙임줄을 해제했어요.");

    return;
  }

  const length = barTicks(project.measures[note.bar]);
  const end = note.tick + note.duration;

  const nextBar = end === length ? note.bar + 1 : note.bar;
  const nextTick = end === length ? 0 : end;

  const next = currentTrack().notes.find(other =>
    other.id !== note.id &&
    other.bar === nextBar &&
    other.tick === nextTick &&
    other.pitch === note.pitch
  );

  if (!next) {
    toast("바로 이어지는 위치에 같은 높이의 음을 먼저 넣어 주세요.");
    return;
  }

  edit(() => {
    note.tie = true;
  }, "두 음을 붙임줄로 연결했어요.");
}

function transposeSelection(amount) {
  if (!project) return;

  const notes = selectedNotes().filter(note => note.pitch !== null);

  if (!notes.length) {
    toast("선택한 마디에 옮길 음이 없어요.");
    return;
  }

  if (isDrum(currentTrack())) {
    toast("타악기는 음 높이 대신 타격 종류를 작곡판에서 바꿔 주세요.");
    return;
  }

  if (notes.some(note =>
    note.pitch + amount < 24 || note.pitch + amount > 108
  )) {
    toast("지원하는 음역을 벗어나 더 옮길 수 없어요.");
    return;
  }

  edit(() => {
    notes.forEach(note => {
      note.pitch += amount;
      note.accidental = NATURAL.includes(note.pitch % 12) ? 0 : 1;
    });

    repairTies();
  }, "선택한 마디의 음 높이를 옮겼어요.");
}

function reverseSelection() {
  if (!project) return;

  edit(() => {
    selectedNotes().forEach(note => {
      const length = barTicks(project.measures[note.bar]);

      note.tick = length - note.tick - note.duration;
      note.tie = false;
    });
  }, "선택한 마디 안에서 음표 순서를 뒤집었어요.");
}

function varySelection() {
  if (!project) return;

  const track = currentTrack();

  const notes = selectedNotes()
    .filter(note => note.pitch !== null)
    .sort((a, b) =>
      a.bar - b.bar || a.tick - b.tick || a.pitch - b.pitch
    );

  if (!notes.length) {
    toast("먼저 음을 넣어 주세요.");
    return;
  }

  const tori = TORI[project.gugak.tori] || TORI.free;
  const allowed = project.gugak.tori === "free"
    ? NATURAL
    : tori.pcs;

  edit(() => {
    notes.forEach((note, index) => {
      if (isDrum(track)) {
        note.velocity = clamp(
          note.velocity + (index % 2 ? -10 : 8),
          1,
          127
        );
        return;
      }

      if (index % 3 !== 2) return;

      const choices = [2, -2, 1, -1]
        .map(offset => note.pitch + offset)
        .filter(pitch =>
          pitch >= 24 &&
          pitch <= 108 &&
          allowed.includes(pitch % 12)
        );

      const replacement = choices.find(pitch =>
        !track.notes.some(other =>
          other.id !== note.id &&
          other.bar === note.bar &&
          other.pitch === pitch &&
          other.tick < note.tick + note.duration &&
          other.tick + other.duration > note.tick
        )
      );

      if (replacement !== undefined) {
        note.pitch = replacement;
        note.accidental =
          NATURAL.includes(replacement % 12) ? 0 : 1;
        note.tie = false;
      }
    });

    repairTies();
  }, "간단한 변형을 적용했어요. 직접 듣고 비교해 보세요.");
}

async function previewChord() {
  if (!project || isRecording()) return;

  stopPlayback(false);

  const generation = playGeneration;
  const projectId = project.id;
  const pitches = customChord();
  const track = currentTrack();

  try {
    const ctx = await audioContext();

    if (
      generation !== playGeneration ||
      project?.id !== projectId
    ) return;

    disposeGraph(previewGraph);
    previewGraph = makeGraph(ctx, project);

    pitches.forEach(pitch => {
      voice(ctx, previewGraph, {
        trackId: track.id,
        instrument: isDrum(track) ? "piano" : track.instrument,
        pitch,
        duration: 0.8,
        velocity: 0.6,
        articulation: "tenuto",
        ornament: "none"
      }, ctx.currentTime + 0.02);
    });
  } catch (error) {
    toast(error.message || "화음을 재생하지 못했어요.");
  }
}

function analyzeChord() {
  if (!project) return;

  if (isDrum(currentTrack())) {
    $("chordAnalysis").textContent =
      "화음 분석은 음 높이가 있는 악기에서 사용해 주세요.";
    return;
  }

  const tick = currentNote()?.tick ??
    Number($("keyboardPosition").value);

  const pitches = new Set(
    currentTrack().notes
      .filter(note =>
        note.bar === selectedBar &&
        note.pitch !== null &&
        note.tick <= tick &&
        note.tick + note.duration > tick
      )
      .map(note => note.pitch % 12)
  );

  if (pitches.size < 2) {
    $("chordAnalysis").textContent =
      "해당 위치에서 함께 울리는 음이 두 종류 이상 필요해요.";
    return;
  }

  const candidates = [];

  for (let root = 0; root < 12; root++) {
    Object.entries(CHORDS).forEach(([type, intervals]) => {
      const chord = new Set(
        intervals.map(interval => (root + interval) % 12)
      );

      if ([...pitches].every(pitch => chord.has(pitch))) {
        candidates.push({
          name: chordName(root, type),
          missing: chord.size - pitches.size
        });
      }
    });
  }

  candidates.sort((a, b) => a.missing - b.missing);

  $("chordAnalysis").textContent = candidates.length
    ? "가능한 화음: " + candidates.slice(0, 6)
        .map(item =>
          item.name + (item.missing ? " (일부 음 생략)" : "")
        )
        .join(", ")
    : "등록된 기본 화음과 일치하지 않아요. 직접 만든 화음일 수 있어요.";
}

function installNoteEvents() {
  const surface = $("editorSurface");

  if (!surface || surface.dataset.noteEventsReady === "true") return;
  surface.dataset.noteEventsReady = "true";

  $$("[data-view]").forEach(button => {
    button.addEventListener("click", () => {
      view = button.dataset.view;
      if (project) render();
    });
  });

  $$("[data-tool]").forEach(button => {
    button.addEventListener("click", () => {
      tool = button.dataset.tool;
      if (project) render();
    });
  });

  [
    "editorOctave",
    "editorClef",
    "showNoteNames",
    "highlightScale",
    "noteRhythm"
  ].forEach(id => {
    bind(id, "change", () => {
      if (!project) return;
      renderEditor();
      renderHarmony();
    });
  });

  bind("noteVelocity", "input", event => {
    $("noteVelocityValue").textContent = event.target.value;
  });

  bind("applyNoteSettingsBtn", "click", applySelectedNoteSettings);
  bind("deleteSelectedNoteBtn", "click", deleteSelectedNote);
  bind("tieNoteBtn", "click", toggleSelectedTie);
  bind("fillRestsBtn", "click", fillRests);

  bind("applyLyricBtn", "click", () => {
    const note = currentNote();
    if (!note) return;

    const lyric = $("noteLyric").value.slice(0, 40);

    edit(() => {
      note.lyric = lyric;
    }, "음표에 가사를 넣었어요.");
  });

  bind("velocityEditor", "input", event => {
    const input = event.target.closest("[data-velocity-id]");
    if (!input) return;

    const output = input.closest("label")?.querySelector("output");
    if (output) output.textContent = input.value;
  });

  bind("velocityEditor", "change", event => {
    const input = event.target.closest("[data-velocity-id]");
    if (!input || !project) return;

    const note = currentTrack().notes.find(
      item => item.id === input.dataset.velocityId
    );

    if (!note) return;

    const velocity = clamp(Number(input.value), 1, 127);

    edit(() => {
      note.velocity = velocity;
    }, "음의 강도를 바꿨어요.");
  });

  bind("virtualKeyboard", "click", event => {
    const button = event.target.closest("[data-keyboard-pitch]");
    if (!button || !project) return;

    const tick = Number($("keyboardPosition").value);
    const duration = noteSettings().duration;

    const success = tool === "chord"
      ? insertChordAt(tick)
      : insertNote(
          tick,
          tool === "rest" ? null : Number(button.dataset.keyboardPitch)
        );

    if (!success) return;

    const next = [...$("keyboardPosition").options]
      .find(option => Number(option.value) >= tick + duration);

    if (next) {
      $("keyboardPosition").value = next.value;
    }
  });

  bind("editorSurface", "click", event => {
    const button = event.target.closest("[data-jangdan-tick]");
    if (!button || !project) return;

    const tick = Number(button.dataset.jangdanTick);
    const select = $("keyboardPosition");

    if (![...select.options].some(option => Number(option.value) === tick)) {
      const option = document.createElement("option");
      option.value = String(tick);
      option.textContent = `${tick / TICKS + 1}박 위치`;
      select.append(option);
    }

    select.value = String(tick);

    const details = $("virtualKeyboard").closest("details");
    if (details) details.open = true;

    toast("입력 위치를 선택했어요. 아래 건반에서 음을 눌러 주세요.");
  });

  [
    "chordRoot",
    "chordType",
    "chordInversion",
    "progressionSelect"
  ].forEach(id => {
    bind(id, "change", () => {
      if (project) renderHarmony();
    });
  });

  bind("previewChordBtn", "click", previewChord);

  bind("insertChordBtn", "click", () => {
    if (!project) return;
    insertChordAt(Number($("keyboardPosition").value));
  });

  bind("addHarmonyTrackBtn", "click", () => addHarmony(false));
  bind("addBassTrackBtn", "click", () => addHarmony(true));
  bind("analyzeChordBtn", "click", analyzeChord);

  bind("transposeUpBtn", "click", () => transposeSelection(1));
  bind("transposeDownBtn", "click", () => transposeSelection(-1));
  bind("octaveUpBtn", "click", () => transposeSelection(12));
  bind("octaveDownBtn", "click", () => transposeSelection(-12));

  bind("reverseMelodyBtn", "click", reverseSelection);
  bind("variationBtn", "click", varySelection);

  bind("captureABtn", "click", () => {
    if (!project) return;

    comparison = copy(project);
    comparisonSide = "B";

    $("switchABBtn").disabled = false;
    $("abState").textContent =
      "A를 보관했어요. 현재 곡을 수정한 뒤 비교해 보세요.";

    toast("현재 곡을 A로 보관했어요.");
  });

  bind("switchABBtn", "click", () => {
    if (!project || !comparison || !canEdit()) return;

    const current = copy(project);
    const target = copy(comparison);

    const success = edit(() => {
      project = target;
      selectedNoteId = null;
      selectedGenre = target.genre;
      decodedAudio = null;
      decodedAudioData = null;
    }, "비교할 곡으로 바꿨어요.");

    if (success) {
      comparison = current;
      comparisonSide = comparisonSide === "A" ? "B" : "A";
      $("abState").textContent = `현재 ${comparisonSide} 버전`;
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    installNoteEvents,
    { once: true }
  );
} else {
  installNoteEvents();
}

// ===== 12부 끝 · 다음 코드를 바로 아래에 이어 붙이세요. =====
// ===== app.js 13부: 음향 효과 · 녹음 버튼 · 국악 설정 =====

const EFFECT_CONTROLS = [
  {
    id: "masterVolume",
    key: "master",
    outputs: ["masterVolumeValue", "masterValue"],
    min: 0,
    max: 100,
    unit: "%"
  },
  {
    id: "reverbAmount",
    key: "reverb",
    outputs: ["reverbAmountValue", "reverbValue"],
    min: 0,
    max: 60,
    unit: "%"
  },
  {
    id: "delayAmount",
    key: "delay",
    outputs: ["delayAmountValue", "delayValue"],
    min: 0,
    max: 50,
    unit: "%"
  },
  {
    id: "swingAmount",
    key: "swing",
    outputs: ["swingAmountValue", "swingValue"],
    min: 0,
    max: 45,
    unit: "%"
  },
  {
    id: "eqLow",
    key: "low",
    outputs: ["eqLowValue"],
    min: -12,
    max: 12,
    unit: " dB"
  },
  {
    id: "eqMid",
    key: "mid",
    outputs: ["eqMidValue"],
    min: -12,
    max: 12,
    unit: " dB"
  },
  {
    id: "eqHigh",
    key: "high",
    outputs: ["eqHighValue"],
    min: -12,
    max: 12,
    unit: " dB"
  }
];

function showEffectValue(control, value) {
  const prefix = control.unit === " dB" && value > 0
    ? "+"
    : "";

  control.outputs.forEach(id => {
    const output = $(id);

    if (output) {
      output.textContent = `${prefix}${value}${control.unit}`;
    }
  });
}

function renderEffects() {
  if (!project) return;

  EFFECT_CONTROLS.forEach(control => {
    const value = project.effects[control.key];

    setValue(control.id, value);
    showEffectValue(control, value);
  });

  if ($("compressorEnabled")) {
    $("compressorEnabled").checked =
      project.effects.compressor;
  }
}

function selectedJangdanMeter() {
  const name = $("jangdanSelect").value;

  if (name === "se-machi") return "9/8";

  if (name === "gutgeori" || name === "jajinmori") {
    return "12/8";
  }

  return null;
}

function applyJangdan() {
  if (!project || !canEdit()) return;

  const name = $("jangdanSelect").value;
  const meter = selectedJangdanMeter();

  if (!meter) {
    toast("자유 장단은 마디 설정에서 원하는 박자를 정해 주세요.");
    return;
  }

  const length = barTicks({ meter });

  for (const track of project.tracks) {
    const overflow = track.notes.find(note =>
      note.bar >= selectedBar &&
      note.bar <= rangeEnd &&
      note.tick + note.duration > length
    );

    if (overflow) {
      toast(
        `${overflow.bar + 1}마디의 ‘${track.name}’ 음표가 ` +
        "새 박자를 넘어요. 먼저 음표 길이를 정리해 주세요."
      );
      return;
    }
  }

  const success = edit(() => {
    project.gugak.jangdan = name;

    for (let bar = selectedBar; bar <= rangeEnd; bar++) {
      project.measures[bar].meter = meter;
    }

    repairTies();
    view = "jangdan";
  }, "선택한 구간의 박자와 장단 입력판을 설정했어요.");

  if (success) {
    toast("박자 틀을 적용했어요. 타격 위치와 강도는 직접 편집할 수 있어요.");
  }
}

function addJangdanTrack() {
  if (!project || !canEdit()) return;

  if (project.tracks.length >= MAX_TRACKS) {
    toast(`악기는 최대 ${MAX_TRACKS}개까지 넣을 수 있어요.`);
    return;
  }

  const track = newTrack("janggu", "장구 박 연습");

  const success = edit(() => {
    for (let bar = selectedBar; bar <= rangeEnd; bar++) {
      const measure = project.measures[bar];

      const [count, unit] = measure.meter
        .split("/")
        .map(Number);

      const step = TICKS * 4 / unit;
      const length = barTicks(measure);

      // 박을 익히기 위한 단순 타격 예제입니다.
      // 전통 장단의 정식 구음·연주 패턴을 재현한 것은 아닙니다.
      for (let beat = 0; beat < count; beat++) {
        const strong = beat % 3 === 0;

        if (!strong && beat % 3 !== 2) continue;

        const tick = beat * step;
        const duration = Math.min(6, length - tick);

        track.notes.push(
          newNote(
            bar,
            tick,
            strong ? 36 : 38,
            duration,
            {
              base: duration,
              velocity: strong ? 95 : 65,
              accidental: 0
            }
          )
        );
      }
    }

    project.tracks.push(track);
    selectedTrack = project.tracks.length - 1;
    selectedNoteId = null;
    view = "jangdan";
  }, "선택한 구간에 장구 박 연습 트랙을 넣었어요.");

  if (success) {
    toast("연습용 타격 예제예요. 원하는 장단에 맞게 직접 바꿔 주세요.");
  }
}

function installExtraEvents() {
  const root = $("studioScreen");

  if (!root || root.dataset.extraReady === "true") return;

  root.dataset.extraReady = "true";

  // ---------- 음향 효과 ----------

  EFFECT_CONTROLS.forEach(control => {
    bind(control.id, "input", event => {
      showEffectValue(control, Number(event.target.value));
    });

    bind(control.id, "change", event => {
      if (!project) return;

      const raw = Number(event.target.value);

      if (!Number.isFinite(raw)) {
        renderEffects();
        return;
      }

      const value = clamp(raw, control.min, control.max);

      edit(() => {
        project.effects[control.key] = value;
      }, "음향 효과를 바꿨어요. 재생해서 확인해 보세요.");
    });
  });

  bind("compressorEnabled", "change", event => {
    if (!project) return;

    const checked = event.target.checked;

    edit(() => {
      project.effects.compressor = checked;
    }, checked
      ? "컴프레서를 켰어요."
      : "컴프레서를 껐어요."
    );
  });

  // ---------- 녹음과 음원 ----------

  bind("recordBtn", "click", startRecording);
  bind("stopRecordBtn", "click", stopRecording);

  bind("importAudioBtn", "click", () => {
    if (!project || !canEdit()) return;
    $("audioFileInput").click();
  });

  bind("audioFileInput", "change", async event => {
    const input = event.target;
    const file = input.files?.[0];

    if (!file) return;

    try {
      if (!project || !canEdit()) return;

      const targetId = project.id;

      await attachAudio(
        file,
        file.name,
        targetId
      );
    } finally {
      input.value = "";
    }
  });

  bind("removeAudioBtn", "click", () => {
    if (!project?.audio) return;

    edit(() => {
      $("audioPreview").pause();

      project.audio = null;
      decodedAudio = null;
      decodedAudioData = null;
    }, "등록한 음원을 제거했어요. 되돌리기로 복원할 수 있어요.");
  });

  bind("audioOffset", "change", event => {
    if (!project?.audio) return;

    const value = Number(event.target.value);

    if (
      !Number.isFinite(value) ||
      value < -30 ||
      value > 300
    ) {
      event.target.value = project.audio.offset;

      toast("음원 시작 위치는 -30~300초로 설정해 주세요.");
      return;
    }

    edit(() => {
      project.audio.offset = value;
    }, value < 0
      ? "음원 앞부분을 건너뛰어 곡 시작에 맞췄어요."
      : "음원의 시작 위치를 바꿨어요."
    );
  });

  bind("audioVolume", "input", event => {
    $("audioVolumeValue").textContent =
      `${event.target.value}%`;
  });

  bind("audioVolume", "change", event => {
    if (!project?.audio) return;

    const value = clamp(
      Number(event.target.value),
      0,
      100
    );

    if (!Number.isFinite(value)) return;

    edit(() => {
      project.audio.volume = value;
    }, "등록한 음원의 음량을 바꿨어요.");
  });

  // 미리 듣기와 전체 재생이 겹치지 않게 합니다.
  bind("audioPreview", "play", () => {
    if (isRecording()) {
      $("audioPreview").pause();
      return;
    }

    stopPlayback(false);
  });

  // ---------- 국악 설정 ----------

  bind("gugakCategory", "change", event => {
    if (!project) return;

    const categoryValue = event.target.value;

    edit(() => {
      project.gugak.category = categoryValue;
    }, "국악 분류를 바꿨어요.");
  });

  bind("toriSelect", "change", event => {
    if (!project) return;

    const value = event.target.value;

    if (!own(TORI, value)) return;

    edit(() => {
      project.gugak.tori = value;
    }, "토리 안내와 음 강조 표시를 바꿨어요. 기존 음은 유지돼요.");
  });

  textChange("toriMemo", value => {
    project.gugak.memo = value;
  }, 1000);

  bind("jangdanSelect", "change", event => {
    if (!project) return;

    const value = event.target.value;

    edit(() => {
      project.gugak.jangdan = value;
    }, "장단을 선택했어요. 박자를 바꾸려면 적용 버튼을 눌러 주세요.");
  });

  bind("applyJangdanBtn", "click", applyJangdan);
  bind("addJangdanTrackBtn", "click", addJangdanTrack);

  // ---------- 점검 · 인쇄 · 버전 ----------

  bind("checkProjectBtn", "click", checkProject);
  bind("printBtn", "click", printScore);

  bind("projectCardBtn", "click", () => {
    if (!project) return;
    dialog("작품 정보", projectCardHTML());
  });

  bind("saveVersionBtn", "click", saveVersion);
  bind("openVersionsBtn", "click", openVersions);

  bind("dialogBody", "click", event => {
    const button = event.target.closest("[data-restore-version]");
    if (!button) return;

    restoreVersion(button.dataset.restoreVersion);
  });

  bind("closeDialogBtn", "click", () => {
    $("infoDialog").close();
  });
}

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    installExtraEvents,
    { once: true }
  );
} else {
  installExtraEvents();
}

// ===== 13부 끝 · 다음 코드를 바로 아래에 이어 붙이세요. =====
// ===== app.js 14부: 도움말 · 단축키 · 초기 실행 =====

function showHelp() {
  dialog("실버스타 스튜디오 사용법", `
    <div class="lesson-step">
      <h3>1. 곡 시작하기</h3>
      <p>
        제목과 작곡자를 입력하고 장르를 고르세요.
        빈 곡이나 예제로 시작할 수 있어요.
        장르별 설정은 출발점이며, 악기와 빠르기를 바꿀 수 있어요.
      </p>
    </div>

    <div class="lesson-step">
      <h3>2. 악기와 마디 선택하기</h3>
      <p>
        악기 목록 또는 마디 칸을 누르세요.
        범위 끝을 선택하면 여러 마디에 설정이나 반주를 적용할 수 있어요.
      </p>
    </div>

    <div class="lesson-step">
      <h3>3. 음 입력하기</h3>
      <p>
        음표 길이, 임시표, 강도와 연주 기호를 정한 뒤
        작곡판을 터치하세요.
        아래 건반에서는 입력 위치를 정하고 음을 누르면 돼요.
      </p>
      <p>
        기존 음을 누르면 선택돼요.
        설정을 바꾼 뒤 ‘선택한 음에 적용’을 누르세요.
        이동 도구에서는 음표를 끌어 위치를 바꿀 수 있어요.
      </p>
    </div>

    <div class="lesson-step">
      <h3>4. 화음과 반주</h3>
      <p>
        기준음, 화음 종류, 전위를 선택해 들어 보세요.
        화음을 현재 악기에 넣거나,
        선택한 구간에 화음·베이스 트랙을 추가할 수 있어요.
      </p>
    </div>

    <div class="lesson-step">
      <h3>5. 국악 설정</h3>
      <p>
        토리 안내와 음 강조 표시를 참고하면서 가락을 만드세요.
        장단 입력판은 박 단위 편집을 돕는 도구예요.
        합성 악기와 연습용 타격 예제는 실제 전통 연주를
        완전히 재현하지 않아요.
      </p>
    </div>

    <div class="lesson-step">
      <h3>6. 녹음과 저장</h3>
      <p>
        마이크 권한을 허용하면 반주와 함께 녹음할 수 있어요.
        이어폰을 사용하면 반주가 마이크로 다시 들어오는 것을 줄일 수 있어요.
      </p>
      <p>
        완성 음원은 WAV, 다시 편집할 작품은 JSON으로 저장하세요.
        자동저장과 버전은 현재 브라우저에 보관돼요.
        다른 기기에서는 저장한 JSON 파일을 불러오세요.
      </p>
    </div>

    <div class="info-box">
      <strong>노트북 단축키</strong>
      <p>
        Space: 재생·정지<br>
        Ctrl 또는 Command + Z: 되돌리기<br>
        Ctrl 또는 Command + Shift + Z: 다시 실행<br>
        Ctrl 또는 Command + S: 프로젝트 저장<br>
        Delete 또는 Backspace: 선택한 음표 삭제
      </p>
    </div>

    <p class="muted">
      이 버전은 합성음 기반 작곡 도구예요.
      전문 악보 출판, 실제 악기 샘플,
      모든 장르와 토리의 작법 자동 검증까지 지원하지는 않아요.
    </p>
  `);
}

function showLesson() {
  dialog("처음 만드는 4마디", `
    <div class="lesson-step">
      <h3>① 박자와 빠르기</h3>
      <p>
        먼저 4/4박자, 80~100 BPM 정도로 시작해 보세요.
        한 마디에 4분음표 네 개가 들어가는 길이예요.
      </p>
    </div>

    <div class="lesson-step">
      <h3>② 짧은 리듬</h3>
      <p>
        드럼의 킥과 스네어를 몇 군데 넣고 반복해서 들어 보세요.
        처음에는 빈 공간을 충분히 남겨도 좋아요.
      </p>
    </div>

    <div class="lesson-step">
      <h3>③ 화음 반주</h3>
      <p>
        1~4마디를 범위로 선택하고 화음 반주를 추가하세요.
        블록 반주로 시작한 뒤 아르페지오와 비교해 보세요.
      </p>
    </div>

    <div class="lesson-step">
      <h3>④ 멜로디와 쉼표</h3>
      <p>
        새 선율 악기에 짧은 멜로디를 넣으세요.
        음을 계속 채우기보다 쉼표를 넣어 숨 쉴 자리를 만들어 보세요.
      </p>
    </div>

    <div class="lesson-step">
      <h3>⑤ 비교하고 보관하기</h3>
      <p>
        A를 보관한 뒤 멜로디나 강도를 바꿔 비교하세요.
        마음에 드는 상태를 버전과 프로젝트 파일로 저장하세요.
      </p>
    </div>
  `);
}

function isTypingTarget(target) {
  if (!(target instanceof Element)) return false;

  return Boolean(
    target.closest("input, textarea, select") ||
    target.closest('[contenteditable="true"]') ||
    target.isContentEditable
  );
}

function installFinalEvents() {
  const root = $("studioScreen");

  if (!root || root.dataset.finalReady === "true") return;

  root.dataset.finalReady = "true";

  bind("helpBtn", "click", showHelp);
  bind("lessonBtn", "click", showLesson);

  // 별도 음원 미리 듣기가 반주와 겹치지 않게 합니다.
  ["playBtn", "playSelectionBtn", "recordBtn"].forEach(id => {
    bind(id, "click", () => {
      $("audioPreview")?.pause();
    });
  });

  document.addEventListener("keydown", event => {
    if (
      !project ||
      $("studioScreen").hidden ||
      isTypingTarget(event.target) ||
      document.querySelector("dialog[open]")
    ) {
      return;
    }

    const key = event.key.toLowerCase();
    const modifier = event.ctrlKey || event.metaKey;

    if (modifier && key === "s") {
      event.preventDefault();
      saveProject();
      return;
    }

    if (modifier && key === "z") {
      event.preventDefault();

      if (event.shiftKey) {
        redo();
      } else {
        undo();
      }

      return;
    }

    if (modifier && key === "y") {
      event.preventDefault();
      redo();
      return;
    }

    if (modifier || event.altKey || event.repeat) return;

    if (event.code === "Space") {
      // ボタン上ではブラウザー標準の操作を優先します。
      if (
        event.target instanceof Element &&
        event.target.closest("button, a, summary")
      ) {
        return;
      }

      event.preventDefault();
      $("audioPreview")?.pause();

      if (runtime) {
        stopPlayback();
      } else {
        startPlayback(false);
      }

      return;
    }

    if (key === "delete" || key === "backspace") {
      if (selectedNoteId) {
        event.preventDefault();
        deleteSelectedNote();
      }
    }
  });

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) return;

    $("audioPreview")?.pause();

    if (isRecording()) {
      stopRecording();
    } else {
      stopPlayback(false);
    }

    if (project) {
      clearTimeout(autoTimer);

      storageSet("autosave", copy(project)).catch(() => {
        // 自動保存できない場合も、手動のJSON保存を利用できます。
      });
    }
  });

  window.addEventListener("pagehide", () => {
    clearTimeout(autoTimer);
    stopPlayback(false);
    $("audioPreview")?.pause();

    if (recorder && recorder.state !== "inactive") {
      try {
        recorder.stop();
      } catch {
        // すでに停止した録音はそのまま終了します。
      }
    }

    recordingStream?.getTracks().forEach(track => track.stop());

    if (project) {
      storageSet("autosave", copy(project)).catch(() => {});
    }
  });
}

function bootStudio() {
  const root = $("studioScreen");

  if (!root || root.dataset.bootReady === "true") return;

  root.dataset.bootReady = "true";

  const instrumentOptions = Object.entries(INSTRUMENTS)
    .map(([key, instrument]) => `
      <option value="${esc(key)}">
        ${esc(instrument[1])} ${esc(instrument[0])}
      </option>
    `)
    .join("");

  $("instrumentSelect").innerHTML = instrumentOptions;
  $("trackInstrument").innerHTML = instrumentOptions;

  $("instrumentSelect").value = "piano";

  $("chordRoot").innerHTML = NOTES.map((name, index) => `
    <option value="${index}">
      ${esc(KOREAN[index])} · ${esc(name)}
    </option>
  `).join("");

  $("chordRoot").value = "0";

  $("startScreen").hidden = false;
  $("studioScreen").hidden = true;
  $("resumeBtn").hidden = true;

  $("recordBtn").disabled = false;
  $("stopRecordBtn").disabled = true;
  $("removeAudioBtn").disabled = true;
  $("audioClipPanel").hidden = true;

  $("switchABBtn").disabled = true;
  $("abState").textContent = "A バージョンを先に保存してください。";

  // 韓国語の表示にそろえます。
  $("abState").textContent = "A 버전을 먼저 보관해 주세요.";

  $("playPosition").textContent = "01 : 01";
  $("outputLevel").textContent = "−∞ dB";

  renderGenres();
  updateHistory();

  // 각 설치 함수는 중복 연결을 막도록 구성되어 있습니다.
  installEditorPointerEvents();
  installCoreEvents();
  installNoteEvents();
  installExtraEvents();
  installFinalEvents();

  storageGet("autosave")
    .then(saved => {
      if (!saved) return;

      validateProject(saved);
      $("resumeBtn").hidden = false;
    })
    .catch(() => {
      // 자동저장이 없어도 새 곡 만들기와 파일 저장은 사용할 수 있습니다.
    });
}

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    bootStudio,
    { once: true }
  );
} else {
  bootStudio();
}

// ===== 실버스타 스튜디오 app.js 끝 =====
})();