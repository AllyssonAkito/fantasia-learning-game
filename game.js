(() => {
  "use strict";

  const canvas = document.querySelector("#game");
  const ctx = canvas.getContext("2d");
  const trailScreen = document.querySelector("#trailScreen");
  const startScreen = document.querySelector("#startScreen");
  const puzzleScreen = document.querySelector("#puzzleScreen");
  const winScreen = document.querySelector("#winScreen");
  const startButton = document.querySelector("#startButton");
  const againButton = document.querySelector("#againButton");
  const changeCharacterButton = document.querySelector("#changeCharacterButton");
  const soundButton = document.querySelector("#soundButton");
  const scoreLabel = document.querySelector("#score");
  const missionText = document.querySelector("#missionText");
  const tapHint = document.querySelector("#tapHint");
  const choiceButtons = [...document.querySelectorAll(".character-choice")];
  const winCharacter = document.querySelector("#winCharacter");
  const trailNodes = [...document.querySelectorAll(".trail-node")];
  const backToTrailFromStart = document.querySelector("#backToTrailFromStart");
  const backToTrailFromPuzzle = document.querySelector("#backToTrailFromPuzzle");
  const backToTrailFromWin = document.querySelector("#backToTrailFromWin");
  const puzzleTitle = document.querySelector("#puzzleTitle");
  const puzzleSubtitle = document.querySelector("#puzzleSubtitle");
  const puzzleStage = document.querySelector("#puzzleStage");
  const puzzleBoard = document.querySelector("#puzzleBoard");
  const puzzleTray = document.querySelector("#puzzleTray");
  const puzzleHelp = document.querySelector("#puzzleHelp");
  const puzzleContinueButton = document.querySelector("#puzzleContinueButton");
  const literacyScreen = document.querySelector("#literacyScreen");
  const backToTrailFromLiteracy = document.querySelector("#backToTrailFromLiteracy");
  const literacyEyebrow = document.querySelector("#literacyEyebrow");
  const literacyBuddy = document.querySelector("#literacyBuddy img");
  const literacyTitle = document.querySelector("#literacyTitle");
  const literacyInstruction = document.querySelector("#literacyInstruction");
  const repeatLiteracyButton = document.querySelector("#repeatLiteracyButton");
  const literacyProgressFill = document.querySelector("#literacyProgressFill");
  const literacyPlayArea = document.querySelector("#literacyPlayArea");
  const literacyFeedback = document.querySelector("#literacyFeedback");
  const literacyContinueButton = document.querySelector("#literacyContinueButton");

  const WORLD = { width: 1000, height: 700 };
  const TOTAL = 7;
  const dogImage = new Image();
  const bunnyImage = new Image();
  const yellowImage = new Image();
  const pinkOctopusImage = new Image();
  const blueOctopusImage = new Image();
  dogImage.src = "assets/characters/cachorrinho-chibi.png";
  bunnyImage.src = "assets/characters/coelhinho-chibi.png";
  yellowImage.src = "assets/characters/amarelinho-chibi.svg";
  pinkOctopusImage.src = "assets/characters/polvinho-rosa-chibi.png";
  blueOctopusImage.src = "assets/characters/polvinho-azul-chibi.png";

  const characterData = {
    dog: { image: dogImage, name: "Cachorrinho", activity: "puzzle-dog", width: 98, height: 114 },
    bunny: { image: bunnyImage, name: "Coelhinho", activity: "puzzle-bunny", width: 92, height: 106 },
    yellow: { image: yellowImage, name: "Amarelinho", activity: "puzzle-yellow", width: 94, height: 108 },
    pinkOctopus: { image: pinkOctopusImage, name: "Polvinho Rosa", activity: "puzzle-pink-octopus", width: 112, height: 96 },
    blueOctopus: { image: blueOctopusImage, name: "Polvinho Azul", activity: "puzzle-blue-octopus", width: 112, height: 96 }
  };

  const searchLocations = [
    { x: 276, y: 224 }, { x: 408, y: 184 }, { x: 592, y: 183 },
    { x: 730, y: 226 }, { x: 817, y: 335 }, { x: 786, y: 454 },
    { x: 652, y: 535 }, { x: 502, y: 565 }, { x: 354, y: 532 },
    { x: 220, y: 432 }, { x: 184, y: 332 }, { x: 344, y: 365 }
  ];
  const objectTypes = ["bush", "basket", "rock", "mushroom", "gift", "log", "pot", "hay"];

  const trees = [
    [155, 263, 0.9], [238, 152, 0.75], [355, 119, 0.62], [657, 120, 0.62],
    [805, 196, 0.88], [864, 315, 0.7], [818, 510, 0.84], [690, 586, 0.68],
    [294, 580, 0.78], [145, 447, 0.7], [428, 586, 0.56]
  ];

  const flowers = [
    [221, 314, "#ff7197"], [333, 187, "#ffd059"], [662, 225, "#f285b6"],
    [745, 315, "#ffd059"], [850, 392, "#ff7197"], [718, 489, "#f9ec77"],
    [493, 560, "#ff7197"], [300, 477, "#f9ec77"], [185, 376, "#f285b6"]
  ];

  let state = "trail";
  let score = 0;
  let muted = false;
  let lastTime = performance.now();
  let lastAction = performance.now();
  let hintIndex = -1;
  let hintPulse = 0;
  let firstMove = true;
  let particles = [];
  let ripples = [];
  let searchSpots = [];
  let pendingSearch = -1;
  let selectedCharacter = "dog";
  let puzzleCharacter = "dog";
  let puzzleTrayOrder = [0, 1, 2];
  let puzzleSlots = [null, null, null];
  let selectedPiece = null;
  let puzzleSolved = false;
  let puzzleChecking = false;
  let dragState = null;
  let suppressPieceClick = false;
  let literacyMode = "letter-hunt";
  let literacyRound = 0;
  let literacyPrompt = "";
  let literacySequence = [];
  let literacyLocked = false;
  let nameSlots = [null, null, null, null, null, null];
  let nameBank = [];
  let selectedNameLetter = null;
  let dog = { x: 500, y: 390, targetX: 500, targetY: 390, bob: 0, moving: false, facing: 1 };

  const MELINA = ["M", "E", "L", "I", "N", "A"];
  const LETTERS = ["A", "B", "C", "E", "I", "L", "M", "N", "O", "P", "R", "S", "U"];
  const INITIAL_WORDS = [
    { word: "MELINA", letter: "M", emoji: "🎀" },
    { word: "CENOURA", letter: "C", emoji: "🥕" },
    { word: "URSO", letter: "U", emoji: "🧸" },
    { word: "POLVINHO", letter: "P", emoji: "🐙" },
    { word: "COELHO", letter: "C", emoji: "🐰" },
    { word: "SOL", letter: "S", emoji: "☀️" },
    { word: "BOLA", letter: "B", emoji: "⚽" }
  ];

  class SoundGarden {
    constructor() {
      this.context = null;
      this.master = null;
      this.musicTimer = null;
      this.musicStep = 0;
      this.enabled = true;
    }

    init() {
      if (this.context) {
        this.context.resume();
        return;
      }
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      this.context = new AudioContext();
      this.master = this.context.createGain();
      this.master.gain.value = 0.5;
      this.master.connect(this.context.destination);
    }

    tone(frequency, duration, options = {}) {
      if (!this.context || !this.enabled) return;
      const now = this.context.currentTime + (options.delay || 0);
      const osc = this.context.createOscillator();
      const gain = this.context.createGain();
      osc.type = options.type || "sine";
      osc.frequency.setValueAtTime(frequency, now);
      if (options.slide) osc.frequency.exponentialRampToValueAtTime(options.slide, now + duration);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(options.volume || 0.12, now + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      osc.connect(gain);
      gain.connect(this.master);
      osc.start(now);
      osc.stop(now + duration + 0.03);
    }

    pop() {
      this.tone(330, 0.09, { slide: 470, type: "triangle", volume: 0.08 });
    }

    step() {
      this.tone(145 + Math.random() * 18, 0.055, { slide: 105, type: "sine", volume: 0.035 });
    }

    pickup() {
      [659, 784, 988].forEach((note, index) => this.tone(note, 0.22, {
        delay: index * 0.08,
        type: index === 2 ? "sine" : "triangle",
        volume: 0.12
      }));
    }

    search() {
      this.tone(270, 0.12, { slide: 420, type: "triangle", volume: 0.07 });
      this.tone(540, 0.16, { delay: 0.12, type: "sine", volume: 0.06 });
    }

    empty() {
      this.tone(330, 0.13, { slide: 280, type: "sine", volume: 0.055 });
      this.tone(440, 0.12, { delay: 0.1, type: "triangle", volume: 0.045 });
    }

    hint() {
      this.tone(740, 0.18, { volume: 0.055 });
      this.tone(988, 0.2, { delay: 0.13, volume: 0.05 });
    }

    celebrate() {
      [523, 659, 784, 1047, 1319].forEach((note, index) => this.tone(note, 0.32, {
        delay: index * 0.11,
        type: "triangle",
        volume: 0.14
      }));
      this.tone(523, 0.75, { delay: 0.55, type: "sine", volume: 0.1 });
    }

    startMusic() {
      if (this.musicTimer || !this.context) return;
      const melody = [523, 659, 784, 659, 587, 698, 784, 698, 523, 659, 880, 784];
      this.musicTimer = window.setInterval(() => {
        if (state === "playing" && this.enabled) {
          this.tone(melody[this.musicStep % melody.length], 0.46, { type: "sine", volume: 0.025 });
          if (this.musicStep % 2 === 0) {
            this.tone(this.musicStep % 4 === 0 ? 131 : 147, 0.65, { type: "triangle", volume: 0.018 });
          }
          this.musicStep += 1;
        }
      }, 520);
    }

    toggle() {
      this.enabled = !this.enabled;
      if (this.context) this.context.resume();
      return this.enabled;
    }
  }

  const audio = new SoundGarden();

  function speak(message) {
    if (muted || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = "pt-BR";
    utterance.rate = 0.92;
    utterance.pitch = 1.22;
    utterance.volume = 0.72;
    window.speechSynthesis.speak(utterance);
  }

  function shuffled(items) {
    const result = [...items];
    for (let index = result.length - 1; index > 0; index -= 1) {
      const swapWith = Math.floor(Math.random() * (index + 1));
      [result[index], result[swapWith]] = [result[swapWith], result[index]];
    }
    return result;
  }

  function createSearchSpots() {
    const carrotLocations = new Set(shuffled(searchLocations.map((_, index) => index)).slice(0, TOTAL));
    const types = shuffled(searchLocations.map((_, index) => objectTypes[index % objectTypes.length]));
    return searchLocations.map((location, index) => ({
      ...location,
      type: types[index],
      hasCarrot: carrotLocations.has(index),
      opened: false,
      found: false,
      empty: false,
      wiggle: 0,
      resultLife: 0
    }));
  }

  function hideAllScreens() {
    [trailScreen, startScreen, puzzleScreen, literacyScreen, winScreen].forEach((screen) => screen.classList.remove("visible"));
  }

  function showTrail() {
    state = "trail";
    hideAllScreens();
    trailScreen.classList.add("visible");
    tapHint.classList.remove("show");
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  }

  function showCharacterSelect() {
    state = "intro";
    hideAllScreens();
    startScreen.classList.add("visible");
    tapHint.classList.remove("show");
  }

  function createPuzzleOrder() {
    let order = shuffled([0, 1, 2]);
    if (order.every((value, index) => value === index)) order = [1, 2, 0];
    return order;
  }

  function renderPuzzle() {
    puzzleBoard.replaceChildren();
    puzzleTray.replaceChildren();
    const imagePath = characterData[puzzleCharacter].image.src;
    const labels = ["parte de cima", "parte do meio", "parte de baixo"];

    puzzleSlots.forEach((correctIndex, slotIndex) => {
      const slot = document.createElement("button");
      slot.type = "button";
      slot.className = "puzzle-slot";
      slot.dataset.slotIndex = String(slotIndex);
      if (correctIndex !== null) {
        slot.classList.add("filled");
        slot.style.backgroundImage = `url("${imagePath}")`;
        slot.style.backgroundPositionY = ["0%", "50%", "100%"][correctIndex];
        slot.setAttribute("aria-label", `${labels[correctIndex]} no espaço ${slotIndex + 1}`);
      } else {
        slot.innerHTML = `<span>${slotIndex + 1}</span>`;
        slot.setAttribute("aria-label", `espaço ${slotIndex + 1} vazio`);
      }
      slot.addEventListener("click", () => placePieceInSlot(slotIndex));
      puzzleBoard.appendChild(slot);
    });

    puzzleTrayOrder.filter((correctIndex) => !puzzleSlots.includes(correctIndex)).forEach((correctIndex) => {
      const piece = document.createElement("button");
      piece.type = "button";
      piece.className = "puzzle-piece";
      if (correctIndex === selectedPiece) piece.classList.add("selected");
      piece.style.backgroundImage = `url("${imagePath}")`;
      piece.style.backgroundPositionY = ["0%", "50%", "100%"][correctIndex];
      piece.setAttribute("aria-label", `${labels[correctIndex]} fora do quadro`);
      piece.addEventListener("pointerdown", (event) => startPieceDrag(correctIndex, piece, event));
      piece.addEventListener("click", () => {
        if (suppressPieceClick) return;
        selectPuzzlePiece(correctIndex);
      });
      puzzleTray.appendChild(piece);
    });
  }

  function startPieceDrag(correctIndex, source, event) {
    if (puzzleSolved || puzzleChecking || (event.button !== undefined && event.button !== 0)) return;
    audio.init();
    dragState = {
      pointerId: event.pointerId,
      correctIndex,
      source,
      startX: event.clientX,
      startY: event.clientY,
      dragging: false,
      ghost: null
    };
  }

  function movePieceDrag(event) {
    if (!dragState || event.pointerId !== dragState.pointerId) return;
    const distance = Math.hypot(event.clientX - dragState.startX, event.clientY - dragState.startY);
    if (!dragState.dragging && distance > 7) {
      dragState.dragging = true;
      selectedPiece = dragState.correctIndex;
      dragState.source.classList.add("dragging");
      const ghost = document.createElement("div");
      ghost.className = "drag-ghost";
      ghost.style.backgroundImage = dragState.source.style.backgroundImage;
      ghost.style.backgroundPositionY = dragState.source.style.backgroundPositionY;
      document.body.appendChild(ghost);
      dragState.ghost = ghost;
      audio.pop();
    }
    if (!dragState.dragging) return;
    event.preventDefault();
    dragState.ghost.style.left = `${event.clientX}px`;
    dragState.ghost.style.top = `${event.clientY}px`;
    document.querySelectorAll(".puzzle-slot.drop-target").forEach((slot) => slot.classList.remove("drop-target"));
    const target = document.elementFromPoint(event.clientX, event.clientY)?.closest(".puzzle-slot");
    if (target && puzzleSlots[Number(target.dataset.slotIndex)] === null) target.classList.add("drop-target");
  }

  function endPieceDrag(event) {
    if (!dragState || event.pointerId !== dragState.pointerId) return;
    if (!dragState.dragging) {
      dragState = null;
      return;
    }
    event.preventDefault();
    const target = document.elementFromPoint(event.clientX, event.clientY)?.closest(".puzzle-slot");
    const slotIndex = target ? Number(target.dataset.slotIndex) : -1;
    dragState.ghost?.remove();
    dragState.source.classList.remove("dragging");
    document.querySelectorAll(".puzzle-slot.drop-target").forEach((slot) => slot.classList.remove("drop-target"));
    suppressPieceClick = true;
    window.setTimeout(() => { suppressPieceClick = false; }, 50);
    const droppedInEmptySlot = slotIndex >= 0 && puzzleSlots[slotIndex] === null;
    dragState = null;
    if (droppedInEmptySlot) {
      placePieceInSlot(slotIndex);
    } else {
      selectedPiece = null;
      renderPuzzle();
      audio.empty();
    }
  }

  window.addEventListener("pointermove", movePieceDrag, { passive: false });
  window.addEventListener("pointerup", endPieceDrag);
  window.addEventListener("pointercancel", endPieceDrag);

  function selectPuzzlePiece(correctIndex) {
    if (puzzleSolved || puzzleChecking) return;
    audio.init();
    selectedPiece = selectedPiece === correctIndex ? null : correctIndex;
    audio.pop();
    renderPuzzle();
  }

  function placePieceInSlot(slotIndex) {
    if (puzzleSolved || puzzleChecking) return;
    if (selectedPiece === null) {
      if (puzzleSlots[slotIndex] !== null) {
        selectedPiece = puzzleSlots[slotIndex];
        puzzleSlots[slotIndex] = null;
        audio.pop();
        puzzleSubtitle.textContent = "A peça voltou para fora";
        renderPuzzle();
      }
      return;
    }
    if (puzzleSlots[slotIndex] !== null) {
      audio.empty();
      puzzleSubtitle.textContent = "Escolha um espaço vazio";
      return;
    }
    puzzleSlots[slotIndex] = selectedPiece;
    selectedPiece = null;
    audio.search();
    puzzleSubtitle.textContent = puzzleSlots.every((piece) => piece !== null)
      ? "Vamos conferir..."
      : "Muito bem! Escolha a próxima peça";
    renderPuzzle();
    if (puzzleSlots.every((piece) => piece !== null)) checkPuzzle();
  }

  function checkPuzzle() {
    puzzleChecking = true;
    window.setTimeout(() => {
      if (state !== "puzzle" || puzzleSolved) return;
      if (puzzleSlots.every((value, index) => value === index)) {
        solvePuzzle();
        return;
      }
      puzzleStage.classList.add("wrong");
      puzzleSubtitle.textContent = "Ops! As peças vão voltar para fora";
      puzzleHelp.innerHTML = "<span>💫</span> Vamos tentar de novo!";
      audio.empty();
      speak("Ops! Vamos tentar de novo!");
      window.setTimeout(() => {
        if (state !== "puzzle" || puzzleSolved) return;
        puzzleSlots = [null, null, null];
        selectedPiece = null;
        puzzleChecking = false;
        puzzleStage.classList.remove("wrong");
        puzzleSubtitle.textContent = "Coloque as três partes na ordem certa";
        puzzleHelp.innerHTML = "<span>👆</span> Arraste ou toque na peça e depois no espaço";
        renderPuzzle();
      }, 950);
    }, 450);
  }

  function solvePuzzle() {
    puzzleSolved = true;
    puzzleChecking = false;
    puzzleStage.classList.add("solved");
    puzzleSubtitle.textContent = "Personagem completo!";
    puzzleHelp.innerHTML = "<span>⭐</span> Muito bem! Você montou certinho!";
    puzzleContinueButton.classList.add("visible");
    const activity = characterData[puzzleCharacter].activity;
    document.querySelector(`[data-activity="${activity}"]`).classList.add("completed");
    audio.celebrate();
    speak("Muito bem! Você montou o personagem!");
  }

  function startPuzzle(character) {
    audio.init();
    audio.pop();
    state = "puzzle";
    puzzleCharacter = character;
    puzzleTrayOrder = createPuzzleOrder();
    puzzleSlots = [null, null, null];
    selectedPiece = null;
    puzzleSolved = false;
    puzzleChecking = false;
    puzzleStage.classList.remove("solved", "wrong");
    puzzleContinueButton.classList.remove("visible");
    puzzleHelp.innerHTML = "<span>👆</span> Arraste ou toque na peça e depois no espaço";
    puzzleTitle.textContent = `Monte o ${characterData[character].name}`;
    puzzleSubtitle.textContent = "Coloque as três partes na ordem certa";
    renderPuzzle();
    hideAllScreens();
    puzzleScreen.classList.add("visible");
    window.setTimeout(() => speak("Arraste a peça ou toque nela e depois no espaço certo!"), 250);
  }

  function updateLiteracyProgress(done, total) {
    literacyProgressFill.style.width = `${Math.max(0, Math.min(100, (done / total) * 100))}%`;
  }

  function setLiteracyPrompt(message) {
    literacyPrompt = message;
    window.setTimeout(() => {
      if (state === "literacy") speak(message);
    }, 180);
  }

  function completeLiteracy(activity, message) {
    literacyLocked = true;
    updateLiteracyProgress(1, 1);
    literacyFeedback.textContent = message;
    literacyContinueButton.classList.add("visible");
    document.querySelector(`[data-activity="${activity}"]`)?.classList.add("completed");
    audio.celebrate();
    burst(500, 330, 45, true);
    speak(`${message} Parabéns, Melina!`);
  }

  function renderLetterHunt() {
    if (literacyRound >= literacySequence.length) {
      completeLiteracy("letter-hunt", "Você encontrou todas as letras!");
      return;
    }
    const target = literacySequence[literacyRound];
    const distractors = shuffled(LETTERS.filter((letter) => letter !== target)).slice(0, 3);
    const options = shuffled([target, ...distractors]);
    updateLiteracyProgress(literacyRound, literacySequence.length);
    literacyInstruction.textContent = `Ache a letra ${target}`;
    literacyFeedback.textContent = literacyRound === 0 ? "Toque na letra certa" : "Muito bem! Agora a próxima";
    literacyPlayArea.innerHTML = `
      <div class="letter-game">
        <div class="letter-prompt" aria-hidden="true">${target}</div>
        <div class="letter-options" role="group" aria-label="Escolha uma letra">
          ${options.map((letter) => `<button class="letter-option" type="button" data-letter="${letter}" aria-label="Letra ${letter}">${letter}</button>`).join("")}
        </div>
      </div>`;
    setLiteracyPrompt(`Melina, encontre a letra ${target}.`);
    literacyPlayArea.querySelectorAll(".letter-option").forEach((button) => {
      button.addEventListener("click", () => {
        if (literacyLocked) return;
        const chosen = button.dataset.letter;
        if (chosen !== target) {
          button.classList.add("wrong");
          literacyFeedback.textContent = `Essa é a letra ${chosen}. Procure a letra ${target}`;
          audio.empty();
          speak(`Essa é a letra ${chosen}. Vamos achar a letra ${target}.`);
          window.setTimeout(() => button.classList.remove("wrong"), 500);
          return;
        }
        literacyLocked = true;
        button.classList.add("right");
        literacyFeedback.textContent = `${target}! Você encontrou!`;
        audio.pickup();
        speak(`Muito bem! Letra ${target}.`);
        window.setTimeout(() => {
          if (state !== "literacy" || literacyMode !== "letter-hunt") return;
          literacyRound += 1;
          literacyLocked = false;
          renderLetterHunt();
        }, 650);
      });
    });
  }

  function renderNameBuilder() {
    updateLiteracyProgress(nameSlots.filter(Boolean).length, MELINA.length);
    literacyInstruction.textContent = "Monte o nome MELINA";
    literacyPlayArea.innerHTML = `
      <div class="name-game">
        <div class="name-guide" aria-hidden="true">M · E · L · I · N · A</div>
        <div class="name-slots" role="group" aria-label="Espaços do nome Melina">
          ${nameSlots.map((letter, index) => `<button class="name-slot${letter ? " filled" : ""}" type="button" data-slot="${index}" aria-label="${letter ? `Letra ${letter} na posição ${index + 1}` : `Espaço ${index + 1} vazio`}">${letter || index + 1}</button>`).join("")}
        </div>
        <div class="name-bank" role="group" aria-label="Letras para montar Melina">
          ${nameBank.filter((letter) => !nameSlots.includes(letter)).map((letter) => `<button class="name-piece${selectedNameLetter === letter ? " selected" : ""}" type="button" data-letter="${letter}" aria-label="Letra ${letter}">${letter}</button>`).join("")}
        </div>
      </div>`;
    literacyPlayArea.querySelectorAll(".name-piece").forEach((button) => {
      button.addEventListener("click", () => {
        if (literacyLocked) return;
        selectedNameLetter = selectedNameLetter === button.dataset.letter ? null : button.dataset.letter;
        audio.pop();
        literacyFeedback.textContent = selectedNameLetter ? `Letra ${selectedNameLetter} escolhida. Agora toque no espaço` : "Escolha uma letra";
        renderNameBuilder();
      });
    });
    literacyPlayArea.querySelectorAll(".name-slot").forEach((button) => {
      button.addEventListener("click", () => placeNameLetter(Number(button.dataset.slot)));
    });
  }

  function placeNameLetter(slotIndex) {
    if (literacyLocked) return;
    if (selectedNameLetter === null) {
      if (nameSlots[slotIndex]) {
        const returned = nameSlots[slotIndex];
        nameSlots[slotIndex] = null;
        literacyFeedback.textContent = `A letra ${returned} voltou para fora`;
        audio.pop();
        renderNameBuilder();
      }
      return;
    }
    const expected = MELINA[slotIndex];
    if (selectedNameLetter !== expected) {
      literacyFeedback.textContent = `Quase! Aqui entra a letra ${expected}`;
      audio.empty();
      speak(`Quase! Nesse espaço entra a letra ${expected}.`);
      const slot = literacyPlayArea.querySelector(`[data-slot="${slotIndex}"]`);
      slot?.classList.add("wrong");
      window.setTimeout(() => slot?.classList.remove("wrong"), 480);
      selectedNameLetter = null;
      renderNameBuilder();
      return;
    }
    nameSlots[slotIndex] = selectedNameLetter;
    literacyFeedback.textContent = `${selectedNameLetter}! Muito bem!`;
    audio.pickup();
    speak(`Letra ${selectedNameLetter}.`);
    selectedNameLetter = null;
    renderNameBuilder();
    if (nameSlots.every(Boolean)) {
      literacyPlayArea.querySelector(".name-game")?.classList.add("solved");
      completeLiteracy("name-builder", "M E L I N A. Melina!");
    }
  }

  function renderInitialSound() {
    if (literacyRound >= literacySequence.length) {
      completeLiteracy("initial-sound", "Você descobriu todos os sons!");
      return;
    }
    const item = literacySequence[literacyRound];
    const distractors = shuffled(LETTERS.filter((letter) => letter !== item.letter)).slice(0, 2);
    const options = shuffled([item.letter, ...distractors]);
    updateLiteracyProgress(literacyRound, literacySequence.length);
    literacyInstruction.textContent = `Qual letra começa ${item.word.toLowerCase()}?`;
    literacyFeedback.textContent = "Escute o começo da palavra";
    literacyPlayArea.innerHTML = `
      <div class="initial-game">
        <div class="word-picture" aria-hidden="true">${item.emoji}</div>
        <p class="word-label">_${item.word.slice(1)}</p>
        <div class="initial-options" role="group" aria-label="Escolha a primeira letra">
          ${options.map((letter) => `<button class="initial-option" type="button" data-letter="${letter}" aria-label="Letra ${letter}">${letter}</button>`).join("")}
        </div>
      </div>`;
    setLiteracyPrompt(`Qual letra começa a palavra ${item.word}? ${item.word}.`);
    literacyPlayArea.querySelectorAll(".initial-option").forEach((button) => {
      button.addEventListener("click", () => {
        if (literacyLocked) return;
        const chosen = button.dataset.letter;
        if (chosen !== item.letter) {
          button.classList.add("wrong");
          literacyFeedback.textContent = `Vamos ouvir: ${item.word}`;
          audio.empty();
          speak(`${item.word}. Escute o primeiro som.`);
          window.setTimeout(() => button.classList.remove("wrong"), 500);
          return;
        }
        literacyLocked = true;
        button.classList.add("right");
        literacyFeedback.textContent = `${item.letter} de ${item.word}!`;
        audio.pickup();
        speak(`${item.letter} de ${item.word}. Muito bem!`);
        window.setTimeout(() => {
          if (state !== "literacy" || literacyMode !== "initial-sound") return;
          literacyRound += 1;
          literacyLocked = false;
          renderInitialSound();
        }, 750);
      });
    });
  }

  function startLiteracy(mode) {
    audio.init();
    audio.pop();
    state = "literacy";
    literacyMode = mode;
    literacyRound = 0;
    literacyLocked = false;
    literacyFeedback.textContent = "";
    literacyContinueButton.classList.remove("visible");
    hideAllScreens();
    literacyScreen.classList.add("visible");
    if (mode === "letter-hunt") {
      literacyEyebrow.textContent = "LETRAS E SONS";
      literacyTitle.textContent = "Caça-Letras";
      literacyBuddy.src = pinkOctopusImage.src;
      literacySequence = ["M", ...shuffled(MELINA.filter((letter) => letter !== "M")).slice(0, 4)];
      renderLetterHunt();
    } else if (mode === "name-builder") {
      literacyEyebrow.textContent = "MEU NOME";
      literacyTitle.textContent = "Meu nome é Melina";
      literacyBuddy.src = yellowImage.src;
      nameSlots = [null, null, null, null, null, null];
      nameBank = shuffled(MELINA);
      selectedNameLetter = null;
      updateLiteracyProgress(0, MELINA.length);
      literacyFeedback.textContent = "Escolha uma letra e depois o lugar dela";
      setLiteracyPrompt("Vamos montar o seu nome. Melina. M, E, L, I, N, A.");
      renderNameBuilder();
    } else {
      literacyEyebrow.textContent = "PRIMEIRO SOM";
      literacyTitle.textContent = "Qual é a primeira?";
      literacyBuddy.src = blueOctopusImage.src;
      literacySequence = [INITIAL_WORDS[0], ...shuffled(INITIAL_WORDS.slice(1)).slice(0, 4)];
      renderInitialSound();
    }
  }

  function resetGame() {
    score = 0;
    scoreLabel.textContent = "0";
    missionText.textContent = "Toque nos objetos!";
    searchSpots = createSearchSpots();
    pendingSearch = -1;
    particles = [];
    ripples = [];
    dog = { x: 500, y: 390, targetX: 500, targetY: 390, bob: 0, moving: false, facing: 1 };
    firstMove = true;
    hintIndex = -1;
    lastAction = performance.now();
    tapHint.classList.remove("show");
  }

  function startGame() {
    audio.init();
    audio.startMusic();
    audio.pop();
    resetGame();
    state = "playing";
    hideAllScreens();
    winCharacter.src = characterData[selectedCharacter].image.src;
    winCharacter.alt = `${characterData[selectedCharacter].name} feliz`;
    window.setTimeout(() => {
      if (state === "playing" && firstMove) tapHint.classList.add("show");
    }, 1100);
    window.setTimeout(() => speak("Toque nos objetos para achar as cenourinhas!"), 400);
  }

  function finishGame() {
    state = "won";
    document.querySelector('[data-activity="hunt"]').classList.add("completed");
    missionText.textContent = "Todas encontradas!";
    audio.celebrate();
    burst(500, 330, 70, true);
    window.setTimeout(() => {
      winScreen.classList.add("visible");
      speak("Muito bem! Você encontrou todas as cenourinhas!");
    }, 850);
  }

  function clampToIsland(x, y) {
    const dx = x - 500;
    const dy = y - 355;
    const amount = Math.abs(dx) / 400 + Math.abs(dy) / 245;
    if (amount <= 1) return { x, y };
    return { x: 500 + dx / amount, y: 355 + dy / amount };
  }

  function moveTo(x, y, searchIndex = -1) {
    if (state !== "playing") return;
    const target = clampToIsland(x, y);
    dog.targetX = target.x;
    dog.targetY = target.y;
    dog.facing = target.x < dog.x ? -1 : 1;
    dog.moving = true;
    pendingSearch = searchIndex;
    lastAction = performance.now();
    hintIndex = -1;
    if (firstMove) {
      firstMove = false;
      tapHint.classList.remove("show");
    }
    audio.pop();
    ripples.push({ x: target.x, y: target.y, life: 1 });
  }

  function pointerPosition(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * WORLD.width,
      y: ((event.clientY - rect.top) / rect.height) * WORLD.height
    };
  }

  canvas.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    const point = pointerPosition(event);
    let nearestIndex = -1;
    let nearestDistance = 68;
    searchSpots.forEach((spot, index) => {
      if (spot.opened) return;
      const distance = Math.hypot(point.x - spot.x, point.y - spot.y);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });
    if (nearestIndex >= 0) {
      const spot = searchSpots[nearestIndex];
      moveTo(spot.x, spot.y, nearestIndex);
    } else {
      moveTo(point.x, point.y);
    }
  });

  window.addEventListener("keydown", (event) => {
    if (state !== "playing") return;
    const step = 82;
    let x = dog.targetX;
    let y = dog.targetY;
    if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") x -= step;
    else if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") x += step;
    else if (event.key === "ArrowUp" || event.key.toLowerCase() === "w") y -= step;
    else if (event.key === "ArrowDown" || event.key.toLowerCase() === "s") y += step;
    else return;
    event.preventDefault();
    moveTo(x, y);
  });

  startButton.addEventListener("click", startGame);
  againButton.addEventListener("click", startGame);
  changeCharacterButton.addEventListener("click", showCharacterSelect);
  backToTrailFromStart.addEventListener("click", showTrail);
  backToTrailFromPuzzle.addEventListener("click", showTrail);
  backToTrailFromLiteracy.addEventListener("click", showTrail);
  backToTrailFromWin.addEventListener("click", showTrail);
  puzzleContinueButton.addEventListener("click", showTrail);
  literacyContinueButton.addEventListener("click", showTrail);
  repeatLiteracyButton.addEventListener("click", () => {
    audio.init();
    audio.pop();
    speak(literacyPrompt);
  });
  trailNodes.forEach((node) => {
    node.addEventListener("click", () => {
      const activity = node.dataset.activity;
      if (activity === "hunt") showCharacterSelect();
      else if (["letter-hunt", "name-builder", "initial-sound"].includes(activity)) startLiteracy(activity);
      else startPuzzle(Object.keys(characterData).find((key) => characterData[key].activity === activity) || "dog");
    });
  });
  choiceButtons.forEach((button) => {
    button.addEventListener("click", () => {
      selectedCharacter = button.dataset.character;
      choiceButtons.forEach((choice) => {
        const selected = choice === button;
        choice.classList.toggle("selected", selected);
        choice.setAttribute("aria-checked", String(selected));
      });
      audio.init();
      audio.pop();
    });
  });
  soundButton.addEventListener("click", () => {
    audio.init();
    const enabled = audio.toggle();
    muted = !enabled;
    soundButton.textContent = enabled ? "🔊" : "🔇";
    soundButton.setAttribute("aria-label", enabled ? "Desligar sons" : "Ligar sons");
    if (!enabled && "speechSynthesis" in window) window.speechSynthesis.cancel();
    if (enabled) audio.pop();
  });

  function roundedRect(x, y, width, height, radius) {
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, radius);
  }

  function drawCloud(x, y, scale, alpha = 0.72) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.ellipse(x, y, 58 * scale, 25 * scale, 0, 0, Math.PI * 2);
    ctx.ellipse(x - 38 * scale, y + 2 * scale, 35 * scale, 19 * scale, 0, 0, Math.PI * 2);
    ctx.ellipse(x + 37 * scale, y + 4 * scale, 38 * scale, 20 * scale, 0, 0, Math.PI * 2);
    ctx.ellipse(x - 8 * scale, y - 18 * scale, 32 * scale, 29 * scale, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawIsland() {
    ctx.save();
    ctx.translate(0, 14);
    ctx.fillStyle = "rgba(44, 115, 83, 0.34)";
    ctx.beginPath();
    ctx.moveTo(45, 345);
    ctx.lineTo(500, 75);
    ctx.lineTo(955, 345);
    ctx.lineTo(500, 658);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    const grass = ctx.createLinearGradient(200, 100, 800, 650);
    grass.addColorStop(0, "#8ed784");
    grass.addColorStop(1, "#62bd68");
    ctx.fillStyle = grass;
    ctx.beginPath();
    ctx.moveTo(45, 330);
    ctx.lineTo(500, 60);
    ctx.lineTo(955, 330);
    ctx.lineTo(500, 643);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "#aedf8c";
    ctx.lineWidth = 3;
    ctx.globalAlpha = 0.55;
    for (let i = 0; i < 35; i += 1) {
      const x = 110 + ((i * 83) % 770);
      const y = 150 + ((i * 127) % 390);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + 2, y - 5);
      ctx.lineTo(x + 4, y);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    ctx.lineCap = "round";
    ctx.strokeStyle = "#eadc9c";
    ctx.lineWidth = 58;
    ctx.beginPath();
    ctx.moveTo(236, 228);
    ctx.lineTo(765, 497);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(734, 221);
    ctx.lineTo(306, 506);
    ctx.stroke();

    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.lineWidth = 4;
    ctx.setLineDash([3, 18]);
    ctx.beginPath();
    ctx.moveTo(236, 228);
    ctx.lineTo(765, 497);
    ctx.moveTo(734, 221);
    ctx.lineTo(306, 506);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  function drawPond() {
    ctx.save();
    ctx.fillStyle = "rgba(38, 116, 103, 0.18)";
    ctx.beginPath();
    ctx.ellipse(734, 374, 100, 62, -0.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#65c8d0";
    ctx.beginPath();
    ctx.ellipse(730, 365, 96, 59, -0.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.45)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(704, 357, 24, 0.15, 2.3);
    ctx.stroke();
    const rocks = [[646, 342], [670, 406], [733, 426], [806, 391], [814, 344], [762, 311], [690, 313]];
    rocks.forEach(([x, y], index) => {
      ctx.fillStyle = index % 2 ? "#849c91" : "#91aaa1";
      ctx.beginPath();
      ctx.ellipse(x, y, 13, 9, index * 0.3, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  function drawHouse() {
    ctx.save();
    ctx.translate(498, 117);
    ctx.fillStyle = "rgba(39, 94, 72, 0.2)";
    ctx.beginPath();
    ctx.ellipse(0, 65, 92, 32, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#f6e7b4";
    roundedRect(-64, 6, 128, 72, 8);
    ctx.fill();
    ctx.fillStyle = "#f2c36d";
    roundedRect(15, 34, 26, 44, 6);
    ctx.fill();
    ctx.fillStyle = "#83cbd1";
    roundedRect(-42, 31, 29, 25, 5);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.72)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-28, 32);
    ctx.lineTo(-28, 55);
    ctx.moveTo(-41, 43);
    ctx.lineTo(-14, 43);
    ctx.stroke();
    ctx.fillStyle = "#8b72b8";
    ctx.beginPath();
    ctx.moveTo(-83, 18);
    ctx.lineTo(0, -42);
    ctx.lineTo(83, 18);
    ctx.lineTo(0, 4);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#7260a2";
    ctx.beginPath();
    ctx.moveTo(0, -42);
    ctx.lineTo(83, 18);
    ctx.lineTo(0, 4);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#9da7a0";
    roundedRect(34, -34, 16, 37, 3);
    ctx.fill();
    ctx.restore();
  }

  function drawTree(x, y, scale) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.fillStyle = "rgba(35, 91, 61, 0.2)";
    ctx.beginPath();
    ctx.ellipse(15, 24, 38, 16, 0.22, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#7c5130";
    roundedRect(-7, -4, 14, 40, 5);
    ctx.fill();
    ctx.fillStyle = "#368a4d";
    [[0, -56, 42, 63], [0, -30, 51, 68], [0, -3, 57, 65]].forEach(([tx, ty, w, h], i) => {
      ctx.fillStyle = i === 0 ? "#4b9e5b" : i === 1 ? "#3f9452" : "#35884a";
      ctx.beginPath();
      ctx.moveTo(tx, ty - h / 2);
      ctx.quadraticCurveTo(-w * 0.17, ty, -w / 2, ty + h / 2);
      ctx.quadraticCurveTo(0, ty + h * 0.35, w / 2, ty + h / 2);
      ctx.quadraticCurveTo(w * 0.17, ty, tx, ty - h / 2);
      ctx.fill();
    });
    ctx.restore();
  }

  function drawFlower(x, y, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.strokeStyle = "#3d914c";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 9);
    ctx.lineTo(0, -1);
    ctx.stroke();
    ctx.fillStyle = color;
    for (let i = 0; i < 5; i += 1) {
      const angle = (i / 5) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(Math.cos(angle) * 4, Math.sin(angle) * 4 - 4, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = "#ffe46f";
    ctx.beginPath();
    ctx.arc(0, -4, 2.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawCarrot(x, y, scale, glow) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    if (glow) {
      const gradient = ctx.createRadialGradient(0, 5, 4, 0, 5, 43);
      gradient.addColorStop(0, "rgba(255, 245, 128, 0.72)");
      gradient.addColorStop(1, "rgba(255, 245, 128, 0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, 3, 44, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.rotate(-0.2);
    ctx.fillStyle = "#ff973d";
    ctx.beginPath();
    ctx.moveTo(-13, -6);
    ctx.quadraticCurveTo(-10, 24, 0, 37);
    ctx.quadraticCurveTo(12, 17, 13, -6);
    ctx.quadraticCurveTo(0, -16, -13, -6);
    ctx.fill();
    ctx.strokeStyle = "#df6f28";
    ctx.lineWidth = 2;
    [[-7, 2, 2, 4], [2, 9, 8, 12], [-5, 18, 1, 20]].forEach((line) => {
      ctx.beginPath();
      ctx.moveTo(line[0], line[1]);
      ctx.lineTo(line[2], line[3]);
      ctx.stroke();
    });
    ctx.fillStyle = "#3f9d4f";
    [-0.6, 0, 0.6].forEach((rotation) => {
      ctx.save();
      ctx.rotate(rotation);
      ctx.beginPath();
      ctx.ellipse(0, -21, 7, 16, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    ctx.restore();
  }

  function drawPlayer(time) {
    const player = characterData[selectedCharacter];
    const playerImage = player.image;
    if (!playerImage.complete) return;
    const bob = dog.moving ? Math.sin(time * 0.018) * 5 : Math.sin(time * 0.003) * 2;
    const width = player.width;
    const height = player.height;
    ctx.save();
    ctx.fillStyle = "rgba(29, 77, 58, 0.24)";
    ctx.beginPath();
    ctx.ellipse(dog.x, dog.y + 26, 40, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.translate(dog.x, dog.y - 62 + bob);
    ctx.scale(dog.facing, 1);
    ctx.drawImage(playerImage, -width / 2, 102 - height, width, height);
    ctx.restore();
  }

  function drawSearchObject(spot, index, time) {
    const hinted = index === hintIndex;
    const pulse = hinted ? 1.08 + Math.sin(hintPulse) * 0.07 : 1;
    const wobble = spot.wiggle > 0 ? Math.sin(time * 0.045) * spot.wiggle * 0.16 : 0;
    ctx.save();
    ctx.translate(spot.x, spot.y);
    ctx.rotate(wobble);
    ctx.scale(pulse, pulse);

    if (hinted) {
      const glow = ctx.createRadialGradient(0, 0, 8, 0, 0, 52);
      glow.addColorStop(0, "rgba(255, 244, 112, 0.8)");
      glow.addColorStop(1, "rgba(255, 244, 112, 0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(0, 0, 52, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = "rgba(35, 88, 58, 0.2)";
    ctx.beginPath();
    ctx.ellipse(7, 18, 34, 12, 0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = spot.opened ? 0.5 : 1;

    if (spot.type === "bush") {
      ctx.fillStyle = "#3f9853";
      [[-18, 1, 20], [3, -8, 24], [23, 3, 19], [0, 10, 25]].forEach(([x, y, radius]) => {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.fillStyle = "#ff85ad";
      [[-13, -8], [14, -14], [7, 8]].forEach(([x, y]) => {
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      });
    } else if (spot.type === "basket") {
      ctx.strokeStyle = "#9b622f";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(0, -3, 23, Math.PI, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "#d89443";
      roundedRect(-29, -5, 58, 34, 8);
      ctx.fill();
      ctx.strokeStyle = "#b87535";
      ctx.lineWidth = 3;
      [-16, 0, 16].forEach((x) => {
        ctx.beginPath(); ctx.moveTo(x, -3); ctx.lineTo(x, 27); ctx.stroke();
      });
    } else if (spot.type === "rock") {
      ctx.fillStyle = "#8da49d";
      ctx.beginPath();
      ctx.moveTo(-30, 16); ctx.lineTo(-22, -10); ctx.lineTo(-4, -24);
      ctx.lineTo(22, -14); ctx.lineTo(32, 13); ctx.lineTo(17, 27); ctx.lineTo(-17, 27);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.25)";
      ctx.beginPath(); ctx.ellipse(-10, -10, 10, 5, -0.3, 0, Math.PI * 2); ctx.fill();
    } else if (spot.type === "mushroom") {
      ctx.fillStyle = "#f4dfba";
      roundedRect(-10, -2, 20, 34, 8); ctx.fill();
      ctx.fillStyle = "#ef6e64";
      ctx.beginPath(); ctx.arc(0, -5, 29, Math.PI, Math.PI * 2); ctx.lineTo(29, -5); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#fff1d7";
      [[-13, -14], [7, -20], [16, -9]].forEach(([x, y]) => { ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fill(); });
    } else if (spot.type === "gift") {
      ctx.fillStyle = "#9d83d4";
      roundedRect(-27, -17, 54, 46, 6); ctx.fill();
      ctx.fillStyle = "#ffd25d";
      ctx.fillRect(-6, -17, 12, 46); ctx.fillRect(-27, -7, 54, 10);
      ctx.beginPath(); ctx.ellipse(-11, -21, 12, 8, -0.45, 0, Math.PI * 2); ctx.ellipse(11, -21, 12, 8, 0.45, 0, Math.PI * 2); ctx.fill();
    } else if (spot.type === "log") {
      ctx.save(); ctx.rotate(-0.25);
      ctx.fillStyle = "#9b6038"; roundedRect(-34, -14, 68, 31, 14); ctx.fill();
      ctx.fillStyle = "#d49a62"; ctx.beginPath(); ctx.ellipse(30, 1, 11, 15, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "#9b6038"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(30, 1, 6, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
    } else if (spot.type === "pot") {
      ctx.strokeStyle = "#4c9d51"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, -8); ctx.lineTo(0, -30); ctx.stroke();
      ctx.fillStyle = "#ff7ca5"; for (let petal = 0; petal < 5; petal += 1) { const angle = petal * Math.PI * 0.4; ctx.beginPath(); ctx.arc(Math.cos(angle) * 7, Math.sin(angle) * 7 - 30, 6, 0, Math.PI * 2); ctx.fill(); }
      ctx.fillStyle = "#ffd85f"; ctx.beginPath(); ctx.arc(0, -30, 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#db7548"; ctx.beginPath(); ctx.moveTo(-22, -9); ctx.lineTo(22, -9); ctx.lineTo(15, 28); ctx.lineTo(-15, 28); ctx.closePath(); ctx.fill();
    } else {
      ctx.fillStyle = "#eccd63";
      roundedRect(-31, -19, 62, 47, 14); ctx.fill();
      ctx.strokeStyle = "#d9ae48"; ctx.lineWidth = 3;
      [-18, -6, 6, 18].forEach((x) => { ctx.beginPath(); ctx.moveTo(x, -17); ctx.lineTo(x - 5, 25); ctx.stroke(); });
      ctx.fillStyle = "#e89543"; ctx.fillRect(-34, -3, 68, 8);
    }

    ctx.globalAlpha = 1;
    if (spot.opened && spot.hasCarrot) {
      const rise = spot.resultLife > 0 ? Math.min(1, (1.5 - spot.resultLife) * 2.5) : 1;
      drawCarrot(0, -37 - rise * 9, 0.7, true);
      ctx.fillStyle = "#fff";
      ctx.font = "900 18px Trebuchet MS";
      ctx.textAlign = "center";
      ctx.fillText("✨", 23, -49);
    } else if (spot.opened) {
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.font = "900 22px Trebuchet MS";
      ctx.textAlign = "center";
      ctx.fillText("⭐", 0, -38);
    }

    if (hinted && !spot.opened) {
      ctx.font = "900 28px Trebuchet MS";
      ctx.textAlign = "center";
      ctx.fillText("👇", 0, -53 - Math.sin(hintPulse) * 6);
    }
    ctx.restore();
  }

  function burst(x, y, count = 18, celebration = false) {
    const palette = celebration
      ? ["#ffd550", "#ff8e65", "#ff74a8", "#62cbe0", "#ffffff", "#7fdd77"]
      : ["#ffd550", "#ff9d43", "#ffffff", "#86e88a"];
    for (let i = 0; i < count; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 45 + Math.random() * (celebration ? 180 : 80);
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (celebration ? 90 : 20),
        life: 0.65 + Math.random() * 0.7,
        maxLife: 1.35,
        size: 4 + Math.random() * 7,
        color: palette[Math.floor(Math.random() * palette.length)],
        star: celebration && Math.random() > 0.45
      });
    }
  }

  function searchObject(index) {
    const spot = searchSpots[index];
    if (!spot || spot.opened || state !== "playing") return;
    spot.opened = true;
    spot.wiggle = 1;
    spot.resultLife = 1.5;
    pendingSearch = -1;
    missionText.textContent = "Vamos ver o que tem aqui...";
    audio.search();
    window.setTimeout(() => {
      if (state !== "playing") return;
      if (spot.hasCarrot) {
        spot.found = true;
        score += 1;
        scoreLabel.textContent = String(score);
        missionText.textContent = score === TOTAL ? "Todas encontradas!" : "Achou! Procure em outro objeto!";
        burst(spot.x, spot.y - 20, 24);
        audio.pickup();
        if (score === 1) speak("Você encontrou uma cenourinha!");
        if (score === TOTAL) window.setTimeout(finishGame, 650);
      } else {
        spot.empty = true;
        missionText.textContent = "Quase! Tente outro objeto!";
        burst(spot.x, spot.y - 10, 9);
        audio.empty();
      }
      lastAction = performance.now();
    }, 420);
  }

  let stepTimer = 0;
  function update(delta, time) {
    hintPulse = (hintPulse + delta * 3) % (Math.PI * 2);

    if (state === "playing") {
      const dx = dog.targetX - dog.x;
      const dy = dog.targetY - dog.y;
      const distance = Math.hypot(dx, dy);
      if (distance > 3) {
        const speed = 150;
        const move = Math.min(distance, speed * delta);
        dog.x += (dx / distance) * move;
        dog.y += (dy / distance) * move;
        dog.moving = true;
        stepTimer -= delta;
        if (stepTimer <= 0) {
          audio.step();
          stepTimer = 0.23;
        }
      } else {
        dog.moving = false;
        if (pendingSearch >= 0) searchObject(pendingSearch);
      }

      if (time - lastAction > 6500 && hintIndex < 0) {
        let nearest = -1;
        let nearestDistance = Infinity;
        searchSpots.forEach((spot, index) => {
          if (spot.opened || !spot.hasCarrot) return;
          const dist = Math.hypot(dog.x - spot.x, dog.y - spot.y);
          if (dist < nearestDistance) {
            nearest = index;
            nearestDistance = dist;
          }
        });
        hintIndex = nearest;
        lastAction = time;
        if (nearest >= 0) audio.hint();
      }
    }

    searchSpots.forEach((spot) => {
      spot.wiggle = Math.max(0, spot.wiggle - delta * 1.8);
      spot.resultLife = Math.max(0, spot.resultLife - delta);
    });

    particles.forEach((particle) => {
      particle.life -= delta;
      particle.x += particle.vx * delta;
      particle.y += particle.vy * delta;
      particle.vy += 155 * delta;
      particle.vx *= 0.99;
    });
    particles = particles.filter((particle) => particle.life > 0);

    ripples.forEach((ripple) => { ripple.life -= delta * 1.7; });
    ripples = ripples.filter((ripple) => ripple.life > 0);
  }

  function drawParticles() {
    particles.forEach((particle) => {
      ctx.save();
      ctx.globalAlpha = Math.min(1, particle.life * 2);
      ctx.translate(particle.x, particle.y);
      ctx.rotate(particle.x * 0.02);
      ctx.fillStyle = particle.color;
      if (particle.star) {
        ctx.beginPath();
        for (let i = 0; i < 10; i += 1) {
          const radius = i % 2 ? particle.size * 0.45 : particle.size;
          const angle = -Math.PI / 2 + (i * Math.PI) / 5;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
      }
      ctx.restore();
    });
  }

  function render(time) {
    ctx.clearRect(0, 0, WORLD.width, WORLD.height);
    const sky = ctx.createLinearGradient(0, 0, 0, WORLD.height);
    sky.addColorStop(0, "#a9e6f5");
    sky.addColorStop(1, "#8bd3ea");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, WORLD.width, WORLD.height);
    drawCloud(106 + Math.sin(time * 0.0001) * 25, 89, 0.85, 0.45);
    drawCloud(873 - Math.sin(time * 0.00012) * 20, 112, 0.62, 0.34);
    drawIsland();
    drawPond();
    drawHouse();

    ripples.forEach((ripple) => {
      ctx.save();
      ctx.globalAlpha = ripple.life * 0.65;
      ctx.strokeStyle = "#fff7a7";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.ellipse(ripple.x, ripple.y, 25 + (1 - ripple.life) * 24, 12 + (1 - ripple.life) * 12, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    });

    flowers.forEach((flower) => drawFlower(...flower));
    trees.slice().sort((a, b) => a[1] - b[1]).forEach((tree) => drawTree(...tree));
    searchSpots
      .map((spot, index) => ({ spot, index }))
      .sort((a, b) => a.spot.y - b.spot.y)
      .forEach(({ spot, index }) => drawSearchObject(spot, index, time));

    drawPlayer(time);
    drawParticles();
  }

  function frame(time) {
    const delta = Math.min(0.04, (time - lastTime) / 1000);
    lastTime = time;
    update(delta, time);
    render(time);
    requestAnimationFrame(frame);
  }

  Promise.all([
    dogImage.decode().catch(() => {}),
    bunnyImage.decode().catch(() => {}),
    yellowImage.decode().catch(() => {}),
    pinkOctopusImage.decode().catch(() => {}),
    blueOctopusImage.decode().catch(() => {})
  ]).finally(() => requestAnimationFrame(frame));
})();
