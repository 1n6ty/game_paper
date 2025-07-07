const __VERSION__ = "5.1C";

// --- Вспомогательные функции для определения формы поля ---
const heartShapedField = (r, c, rows, cols) => {
  const xn = (c / (cols - 1)) * 3 - 1.5;
  const yn = (r / (rows - 1)) * 3 - 1.5;
  const boundaryY = -Math.abs(xn) + 2;
  let forbiddenFirstRow;
  if (cols % 2 === 0) {
    forbiddenFirstRow = [
      0,
      Math.floor(cols / 2) - 1,
      Math.floor(cols / 2),
      cols - 1,
    ];
  } else {
    forbiddenFirstRow = [0, Math.floor(cols / 2), cols - 1];
  }

  if (r === 0 && forbiddenFirstRow.includes(c)) return false;
  return yn <= boundaryY;
};

const plusField = (r, c, rows, cols) => {
  const border = (r === 0 || r === rows - 1) && (c === 0 || c === cols - 1);
  return !border;
};

const withoutCenterField = (r, c, rows, cols) =>
  r != (rows - 1) / 2 || c != (cols - 1) / 2;

// --- Конфигурации ---

const PATHS = {
  // ASSETS: "/media/assets/memory/",
  ASSETS: "./assets/memory/",
  CARDS: {
    bottle: "cards/bottle.svg",
    can: "cards/can.svg",
    cat: "cards/cat.svg",
    cow: "cards/cow.svg",
    flowerPink: "cards/flowerPink.svg",
    flowerPurple: "cards/flowerPurple.svg",
    flowerWhite: "cards/flowerWhite.svg",
    cookie: "cards/cookie.svg",
    leaf: "cards/leaf.svg",
    milkGlass: "cards/milkGlass.svg",
    yogurtChocolate: "cards/yogurtChocolate.svg",
    yogurtPink: "cards/yogurtPink.svg",
  },
  BUSHES: "bushes.svg",
  GROUND: "ground.svg",
  HAND: "hand.svg",
  get: (type, file) =>
    PATHS.ASSETS + (type === "card" ? PATHS.CARDS[file] : file),
};

const GAME_CONFIG = {
  MAX_CANVAS_WIDTH: 428,
  MAX_CANVAS_HEIGHT: 809,
  GRID_ROWS: 5,
  GRID_COLS: 5,
  START_DELAY: 5000, // ms
  BACK_COOLDOWN: 700, // ms
  FIELDS: [
    {
      grid: (r, c, rows, cols) => withoutCenterField(r, c, rows, cols),
      ground: (r, c, rows, cols) => true,
    },
    {
      grid: (r, c, rows, cols) => heartShapedField(r, c, rows, cols),
      ground: (r, c, rows, cols) => heartShapedField(r, c, rows, cols),
    },
    {
      grid: (r, c, rows, cols) =>
        plusField(r, c, rows, cols) && withoutCenterField(r, c, rows, cols),
      ground: (r, c, rows, cols) => plusField(r, c, rows, cols),
    },
  ],
};

const COLORS = {
  BODY_BG_TOP: "#80D18F",
  BODY_BG_MIDDLE: "#9AD9A6",
  BODY_BG_BOTTOM: "#4EB96B",
  STEPS_BG: "#CDF7D6",
  STEPS_STROKE: "#389150",
  STEPS_TEXT: "#389150",
  GRID_ZONE_BG: "#996A4D",
  BOTTOM_GROUND_BG: "#996A4D",
};

const LAYOUT = {
  STEPS_PADDING_LEFT: 90,
  STEPS_PADDING_TOP: 99,
  STEPS_CARD_WIDTH: 250,
  STEPS_CARD_HEIGHT: 61,
  GRID_ZONE_PADDING_LEFT: 19,
  GRID_ZONE_PADDING_TOP: 210,
  GRID_ZONE_WIDTH: 390,
  GRID_ZONE_HEIGHT: 390,
  GRID_ZONE_RADIUS: 16,
  GRID_PADDING_LEFT: 26,
  GRID_PADDING_TOP: 217,
  BUSHES_WIDTH: 428,
  BUSHES_HEIGHT: 91,
  BOTTOM_GROUND_HEIGHT: 67,
};

const CELL_CONFIG = {
  WIDTH: 72,
  HEIGHT: 72,
  GAP: 4,
  PADDING: 0,
  CARD_RADIUS: 10,
};

const ANIMATION_CONFIG = {
  DURATIONS: {
    open: 300,
    close: 300,
    mismatch: 400,
    match: 400,
  },
  MATCH_FEEDBACK: {
    shrink: 0.9,
  },
  MISMATCH_FEEDBACK: {
    shrink: 0.95,
    shakeDur: 300,
    shakeCount: 2,
    amplitude: 3,
  },
};

const TUTORIAL_STATE = {
  NONE: "none",
  INTRO: "intro", // 1. "Сейчас кратко объясним..."
  MEMORIZE: "memorize", // 2. "Смотри внимательно!..."
  FIND_PAIRS_1: "find_pairs_1", // 3. Рука движется к 1-й карте
  FIRST_CARD_OPENED: "first_card_opened", // 4. 1-я карта открыта
  FIND_PAIRS_2: "find_pairs_2", // 5. Рука движется ко 2-й карте
  SECOND_CARD_OPENED: "second_card_opened", // 6. 2-я карта открыта, мэтч
  FINAL: "final", // 7. "Открывай по две карточки..."
  COMPLETE: "complete",
};

const TUTORIAL_CONFIG = {
  MODAL_BG: "rgba(97, 67, 49, 0.48)",
  POPUP_BG: "#FFFFFF",
  BUTTON_BG: "#A7E8B3",
  BUTTON_TEXT_COLOR: "#2F7A2E",
  TEXT_COLOR: "#996A4D",
  POPUP_PADDING_X: 12,
  POPUP_PADDING_Y: 26.5,
  BUTTON_WIDTH: 165,
  BUTTON_HEIGHT: 35,
  TEXTS: {
    [TUTORIAL_STATE.INTRO]: {
      text: "Сейчас кратко объясним, как играть. Готов?",
      buttonText: "Поехали",
      width: 284,
      y: "center",
      isModal: true,
      paddingX: 20,
      paddingY: 40,
    },
    [TUTORIAL_STATE.MEMORIZE]: {
      text: "Смотри внимательно! У тебя будет 5 секунд, чтобы запомнить расположение картинок",
      buttonText: null,
      width: 327,
      y: 46,
      isModal: false,
      paddingX: 16,
      paddingY: 26.5,
      centerTextBlock: true,
    },
    [TUTORIAL_STATE.FIND_PAIRS_1]: {
      text: "Карточки перевёрнуты и теперь нужно найти пары. Вспомни, где они были.",
      buttonText: null,
      width: 263,
      y: 59,
      isModal: false,
      centerTextBlock: true,
    },
    [TUTORIAL_STATE.FIRST_CARD_OPENED]: {
      text: "Карточки перевёрнуты и теперь нужно найти пары. Вспомни, где они были.",
      buttonText: null,
      width: 263,
      y: 59,
      isModal: false,
      centerTextBlock: true,
    },
    [TUTORIAL_STATE.FIND_PAIRS_2]: {
      text: "Карточки перевёрнуты и теперь нужно найти пары. Вспомни, где они были.",
      buttonText: null,
      width: 263,
      y: 59,
      isModal: false,
      centerTextBlock: true,
    },
    [TUTORIAL_STATE.SECOND_CARD_OPENED]: {
      text: "Карточки перевёрнуты и теперь нужно найти пары. Вспомни, где они были.",
      buttonText: null,
      width: 263,
      y: 59,
      isModal: false,
      centerTextBlock: true,
    },
    [TUTORIAL_STATE.FINAL]: {
      text: "Открывай по две карточки. Ищи совпадения. Помни, количество шагов ограничено!",
      buttonText: "Давай играть",
      width: 309,
      y: "center",
      isModal: true,
      paddingX: 20,
      paddingY: 28,
    },
  },
};

export {
  __VERSION__,
  heartShapedField,
  plusField,
  withoutCenterField,
  PATHS,
  GAME_CONFIG,
  COLORS,
  LAYOUT,
  CELL_CONFIG,
  ANIMATION_CONFIG,
  TUTORIAL_STATE,
  TUTORIAL_CONFIG,
};
