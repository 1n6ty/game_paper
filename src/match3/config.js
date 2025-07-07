const __VERSION__ = "4C";

const PATHS = {
  // ASSETS: "/media/assets/match3/",
  ASSETS: "./assets/match3/",
  CARDS: {
    smetanaGlass: "smetana_glass.svg",
    curd: "curd.svg",
    butter: "butter.svg",
    iceCream: "ice_cream.svg",
    creamBox: "cream_box.svg",
  },
  LAMBOY: "lamboy.svg",
  HAND: "hand.svg",
  ARROW: "arrow.svg",
  HIGHLIGHT: "highlight.svg",
  HIGHLIGHT_COUNTER: "highlight_counter.svg",
  get: (type, file) =>
    PATHS.ASSETS + (type === "card" ? PATHS.CARDS[file] : file),
};

const GAME_CONFIG = {
  MAX_CANVAS_WIDTH: 428,
  MAX_CANVAS_HEIGHT: 809,
  GRID_ROWS: 6,
  GRID_COLS: 6,
};

const COLORS = {
  HEADER_BG_TOP: "#FFFFFF",
  HEADER_BG_BOTTOM: "#A6BDE5",
  HEADER_DIVIDER_UP: "#224C93",
  HEADER_DIVIDER_DOWN: "#2C62B8",
  BODY_BG: "#FFFFFF",
  GRID_ZONE_BG: "#527EC9",
  GRID_ZONE_STROKE: "#224C93",
  CELL_BG: "#FFFFFF",
  CELL_STROKE: "#224C93",
  STEPS_BG: "#FFFFFF",
  STEPS_STROKE: "#224C93",
  STEPS_TEXT: "#224C93",
  TARGET_BG: "#FFFFFF",
  TARGET_STROKE: "#224C93",
  TARGET_COUNTER_BG: "#B2222C",
  TARGET_COUNTER_TEXT: "#FFFFFF",
};

const LAYOUT = {
  HEADER_HEIGHT: 279,
  HEADER_DIVIDER_UP_HEIGHT: 4,
  HEADER_DIVIDER_DOWN_HEIGHT: 22,
  LAMBOY_PADDING_LEFT: 84,
  LAMBOY_PADDING_TOP: 0,
  LAMBOY_WIDTH: 344,
  LAMBOY_HEIGHT: 363,
  COUNTERS_PADDING_TOP: 18,
  COUNTERS_PADDING_LEFT: 84,
  COUNTERS_GAP: 10,
  GRID_ZONE_PADDING_LEFT: 21,
  GRID_ZONE_PADDING_TOP: 97,
  GRID_ZONE_WIDTH: 386,
  GRID_ZONE_HEIGHT: 386,
  GRID_ZONE_ARM_THICKNESS: 265,
  GRID_ZONE_RADIUS: 16,
  GRID_PADDING_LEFT: 35.62,
  GRID_PADDING_TOP: 113.49,
};

const CELL_CONFIG = {
  WIDTH: 54.73,
  HEIGHT: 54.73,
  GAP: 5,
  PADDING: 0,
  RADIUS: 9,
  // get NEW_CELL_START_Y() {
  //   return this.HEIGHT + this.GAP;
  // },
};

const UI_ELEMENTS = {
  HEADER_TARGET: {
    X: 64,
    Y: 75,
    CARD_WIDTH: 70.72,
    CARD_HEIGHT: 70.72,
    BORDER_RADIUS: 12,
    IMAGE_SCALE: 1.2,
  },
  TARGET_COUNTER: {
    RADIUS: 24,
    FONT: "500 16px Roboto Mono",
    get X_OFFSET() {
      return 55 + this.RADIUS;
    },
    get Y_OFFSET() {
      return 33 + this.RADIUS;
    },
  },
  STEPS_CARD: {
    WIDTH: 134,
    HEIGHT: 61,
    RADIUS: 12,
    FONT: "500 20px Roboto Mono",
  },
  TARGET_CARD: {
    WIDTH: 116,
    HEIGHT: 61,
    RADIUS: 12,
    FONT: "500 20px Roboto Mono",
  },
};

const ANIMATION_CONFIG = {
  SWAP_DURATION: 400,
  REMOVE_DURATION: 250,
  DROP_OLD_DURATION: 250,
  DROP_NEW_DURATION: 250,
  EASING: {
    REMOVING: (t) => 1 - Math.cos((t * Math.PI) / 2),
    FALLING: (t) => {
      const overshoot = 1.1;
      return t < 0.7
        ? overshoot * (t / 0.7)
        : overshoot - (overshoot - 1) * ((t - 0.7) / 0.3);
    },
    SWAPPING: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  },
};

const TUTORIAL_STATE = {
  NONE: "none",
  INTRO: "intro",
  STEP_2_HEADER_TARGET: "step_2_header_target",
  STEP_3_SHOW_SWAP: "step_3_show_swap",
  STEP_4_PERFORM_SWAP: "step_4_perform_swap",
  STEP_5_MATCH_EFFECT: "step_5_match_effect",
  STEP_6_NEW_ELEMENTS: "step_6_new_elements",
  STEP_7_TARGET_COUNTER: "step_7_target_counter",
  STEP_8_STEPS_COUNTER: "step_8_steps_counter",
  COMPLETE: "complete",
};

const TUTORIAL_CONFIG = {
  MODAL_BG: "rgba(50, 83, 116, 0.48)",
  POPUP: {
    BG: "#FFFFFF",
    RADIUS: 16,
    TEXT_COLOR: "#527EC9",
    FONT: "600 16px Roboto",
    LINE_HEIGHT: 24,
    PADDING_X: 20,
    PADDING_Y: 20,
  },
  BUTTON: {
    WIDTH: 165,
    HEIGHT: 35,
    RADIUS: 12,
    BG: "#A7E8B3",
    TEXT_COLOR: "#2F7A2E",
    FONT: "500 17px Roboto",
    MARGIN_BOTTOM: 20,
  },
  ARROW: {
    GAP_Y: 0,
  },
  TEXTS: {
    [TUTORIAL_STATE.INTRO]: {
      text: "Сейчас кратко объясним,\nкак играть. Готов?",
      buttonText: "Поехали",
      y: "center",
      width: 250,
      isModal: true,
      centerBlock: true,
    },
    [TUTORIAL_STATE.STEP_2_HEADER_TARGET]: {
      text: "Помоги Ламбою собрать\nзаказ из продуктов",
      y: 181,
      width: 241,
      isModal: true,
      hasArrow: true,
      centerBlock: true,
      highlightType: "header",
      awaitClick: true,
      autoAdvanceAfter: 3000,
    },
    [TUTORIAL_STATE.STEP_3_SHOW_SWAP]: {
      text: "Передвигай элементы, чтобы выстроить\nтри и более одинаковых подряд",
      y: 260,
      width: 366,
      spotlight: true,
      hasArrow: true,
      awaitClick: true,
      autoAdvanceAfter: 3000,
    },
    [TUTORIAL_STATE.STEP_4_PERFORM_SWAP]: {
      text: "Передвигай элементы, чтобы выстроить\nтри и более одинаковых подряд",
      y: 260,
      width: 366,
      spotlight: true,
      hasArrow: true,
    },
    [TUTORIAL_STATE.STEP_5_MATCH_EFFECT]: {
      text: "Передвигай элементы, чтобы выстроить\nтри и более одинаковых подряд",
      y: 260,
      width: 366,
      spotlight: true,
      hasArrow: true,
      awaitClick: true,
      autoAdvanceAfter: 3000,
    },
    [TUTORIAL_STATE.STEP_6_NEW_ELEMENTS]: {
      text: "Передвигай элементы, чтобы выстроить\nтри и более одинаковых подряд",
      y: 260,
      width: 366,
      spotlight: true,
      hasArrow: true,
      awaitClick: true,
      autoAdvanceAfter: 3000,
    },
    [TUTORIAL_STATE.STEP_7_TARGET_COUNTER]: {
      text: "За каждый собранный заказ ты\nполучаешь 10 ламбиксов",
      y: 375,
      width: 298,
      isModal: true,
      hasArrow: true,
      centerBlock: true,
      highlightType: "targetCounter",
      awaitClick: true,
      autoAdvanceAfter: 3000,
    },
    [TUTORIAL_STATE.STEP_8_STEPS_COUNTER]: {
      text: "Не забывай следить за\nограниченным количеством\nшагов. Попробуем?",
      buttonText: "Давай играть",
      y: 390,
      width: 284,
      isModal: true,
      centerBlock: true,
      highlightType: "stepsCounter",
    },
  },
};

export {
  __VERSION__,
  PATHS,
  GAME_CONFIG,
  COLORS,
  LAYOUT,
  CELL_CONFIG,
  UI_ELEMENTS,
  ANIMATION_CONFIG,
  TUTORIAL_STATE,
  TUTORIAL_CONFIG,
};
