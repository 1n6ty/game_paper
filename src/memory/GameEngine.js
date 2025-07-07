import {
  PATHS,
  GAME_CONFIG,
  LAYOUT,
  CELL_CONFIG,
  ANIMATION_CONFIG,
  TUTORIAL_STATE,
  TUTORIAL_CONFIG,
} from "./config";

import { loadImage, wrapText, openCellEaseInOut } from "./utils";

import AnimationManager from "./AnimationManager";
import Grid from "./Grid";
import LCG from "./LCG";
import MyAnimation from "./MyAnimation";
import Renderer from "./Renderer";

export default class GameEngine {
  constructor(canvas, initGameData, tmp = {}) {
    tmp.engine = this;
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.tmp = tmp;
    this.assetKeys = Object.keys(PATHS.CARDS);

    this.dimensions = {
      width: GAME_CONFIG.MAX_CANVAS_WIDTH,
      height: GAME_CONFIG.MAX_CANVAS_HEIGHT,
    };
    this.scale = Math.min(
      this.dimensions.width / GAME_CONFIG.MAX_CANVAS_WIDTH,
      this.dimensions.height / GAME_CONFIG.MAX_CANVAS_HEIGHT
    );
    this.offset = {
      x:
        (this.dimensions.width - GAME_CONFIG.MAX_CANVAS_WIDTH * this.scale) / 2,
      y:
        (this.dimensions.height - GAME_CONFIG.MAX_CANVAS_HEIGHT * this.scale) /
        2,
    };

    const seed = initGameData.seed;
    this.randomGen = new LCG(seed);

    this.trainingCount = +initGameData.trainingCount;
    console.log("trainingCount:", this.trainingCount);
    this.showTutorial = this.trainingCount < 3;
    this.stepsCount = +initGameData.maxStepsCount;
    this.currentStep = 0;
    this.targetItemsCount = +initGameData.targetItemsCount;
    this.score = 0;

    const fieldNumber =
      +initGameData.field ||
      Math.floor(this.randomGen.random() * GAME_CONFIG.FIELDS.length);

    console.log("fieldNumber:", fieldNumber);
    console.log("targetItemsCount:", this.targetItemsCount);

    this.canDrag = false;
    this.finishCb = null;

    this.isGameOver = false;
    this.images = {};

    this.grid = new Grid(
      GAME_CONFIG.GRID_ROWS,
      GAME_CONFIG.GRID_COLS,
      this.assetKeys,
      () => this.randomGen.random(),
      GAME_CONFIG.FIELDS[fieldNumber]
    );
    this.animMgr = new AnimationManager();
    this.renderer = new Renderer(this.ctx, {
      scale: this.scale,
      offset: this.offset,
      dims: this.dimensions,
      images: this.images,
    });

    this.selectedCell = null;
    this.secondCell = null;
    this.needsRender = true;
    this.lastTime = performance.now();

    this.isTutorialActive = this.showTutorial;
    this.tutorialState = this.showTutorial
      ? TUTORIAL_STATE.INTRO
      : TUTORIAL_STATE.NONE;
    this.tutorialPairPositions = null;
    this.tutorialHand = { x: 0, y: 0, scale: 1, visible: false };
    this.findTutorialPair();

    this.gameLoopId = null;

    this.boundResize = () => {
      this.resizeCanvas();
      this.requestRender();
    };

    this.boundHandlePointerDown = (e) => {
      this.handlePointerDown(e);
    };

    window.addEventListener("resize", this.boundResize);
    canvas.addEventListener("pointerdown", this.boundHandlePointerDown);
    this.loadAssets();
    this.resizeCanvas();
  }

  requestRender() {
    this.needsRender = true;
    if (!this.gameLoopId) this.startGameLoop();
  }

  startGameLoop() {
    this.gameLoopId = requestAnimationFrame(this.gameLoop.bind(this));
  }

  gameLoop() {
    this.animMgr.update(performance.now());
    if (this.animMgr.isAnimating() || this.needsRender) {
      this.renderer.drawScene(this.grid.groundGrid, {
        currentStep: this.currentStep,
        stepsCount: this.stepsCount,
      });
      this.renderer.drawCells(this.grid.cells);

      // UI обучения рисуется последним, поверх всего
      if (this.isTutorialActive) {
        this.renderer.drawTutorial({
          tutorialState: this.tutorialState,
          tutorialHand: this.tutorialHand,
        });
      }

      this.needsRender = false;
    }

    this.gameLoopId = requestAnimationFrame(this.gameLoop.bind(this));
  }

  resizeCanvas() {
    const p = this.canvas.parentElement;
    if (!p) return;
    const w = p.clientWidth;
    const h = p.clientHeight;
    this.dimensions = { width: w, height: h };
    this.scale = Math.min(
      w / GAME_CONFIG.MAX_CANVAS_WIDTH,
      h / GAME_CONFIG.MAX_CANVAS_HEIGHT
    );
    this.offset = {
      x: (w - GAME_CONFIG.MAX_CANVAS_WIDTH * this.scale) / 2,
      y: (h - GAME_CONFIG.MAX_CANVAS_HEIGHT * this.scale) / 2,
    };
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = w * dpr;
    this.canvas.height = h * dpr;
    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;
    this.renderer.scale = this.scale;
    this.renderer.offset = this.offset;
    this.renderer.dims = this.dimensions;
  }

  start() {
    if (this.showTutorial) {
      this.canDrag = false;
      this.requestRender();
    } else {
      // Старая логика startFlipOver
      this.grid.cells.flat().forEach((cell) => {
        if (cell) cell.isOpened = true;
      });
      this.requestRender();
      setTimeout(() => {
        const closePromises = this.grid.cells
          .flat()
          .filter((c) => c)
          .map((c) => this.animClose(c, ANIMATION_CONFIG.DURATIONS.close));
        Promise.all(closePromises).then(() => {
          this.canDrag = true;
        });
      }, GAME_CONFIG.START_DELAY);
    }
  }

  onAssetsLoaded() {
    if (this.assetsLoadedCb) this.assetsLoadedCb();

    this.start();
  }

  async loadAssets() {
    console.log("Loading assets...");
    const cardEntries = Object.entries(PATHS.CARDS);
    const otherEntries = [
      ["bushes", PATHS.BUSHES],
      ["ground", PATHS.GROUND],
      ["hand", PATHS.HAND],
    ];
    const allEntries = [...cardEntries, ...otherEntries];

    const imagePromises = allEntries.map(([key, file]) =>
      loadImage(PATHS.ASSETS + file).then((img) => ({ key, img }))
    );
    const imageResults = await Promise.all(imagePromises);
    imageResults.forEach(({ key, img }) => {
      this.images[key] = img;
    });
    console.log("All images loaded.");

    await Promise.all([
      document.fonts.load("500 20px Roboto"), // Шрифт для попапов обучения
      document.fonts.load("500 24px 'Roboto Mono'"), // Шрифт для счетчика шагов
    ]);
    console.log("Required fonts loaded.");

    console.log("All assets ready!");
    this.onAssetsLoaded();
  }

  animOpen(pos, duration) {
    this.canDrag = false;
    return new Promise((resolve) => {
      const cell = this.grid.cells[pos.row][pos.col];
      this.animMgr.add(
        new MyAnimation(
          performance.now(),
          duration,
          (t) => {
            const p = openCellEaseInOut(t);
            cell._flipProgress = p;
            this.requestRender();
          },
          () => {
            delete cell._flipProgress;
            cell.isOpened = true;
            this.requestRender();
            resolve();
          }
        )
      );

      this.requestRender();
    });
  }

  animClose(pos, duration) {
    this.canDrag = false;
    return new Promise((resolve) => {
      const cell = this.grid.cells[pos.row][pos.col];
      this.animMgr.add(
        new MyAnimation(
          performance.now(),
          duration,
          (t) => {
            const p = openCellEaseInOut(1 - t);
            cell._flipProgress = p;
            this.requestRender();
          },
          () => {
            delete cell._flipProgress;
            cell.isOpened = false;
            this.canDrag = true;
            this.requestRender();
            resolve();
          }
        )
      );

      this.requestRender();
    });
  }

  animMatchRemove(positions, duration) {
    this.canDrag = false;
    return new Promise((resolve) => {
      const items = positions
        .map((p) => this.grid.cells[p.row][p.col])
        .filter((c) => c && !c.isDeleted);

      this.animMgr.add(
        new MyAnimation(
          performance.now(),
          duration,
          (t) => {
            items.forEach((cell) => (cell._removalProgress = t));
            this.requestRender();
          },
          () => {
            items.forEach((cell) => {
              cell.isDeleted = true;
              this.canDrag = true;
              delete cell._removalProgress;
            });

            this.requestRender();
            resolve();
          }
        )
      );

      this.requestRender();
    });
  }

  animMatchFeedback(positions, duration, shrink) {
    this.canDrag = false;
    return new Promise((resolve) => {
      const cells = positions.map((p) => this.grid.cells[p.row][p.col]);

      // shrink
      this.animMgr.add(
        new MyAnimation(
          performance.now(),
          duration,
          (t) => {
            const s = 1 - (1 - shrink) * t;
            cells.forEach((c) => (c._scale = s));
            this.requestRender();
          },
          () => {
            // restore
            this.animMgr.add(
              new MyAnimation(
                performance.now(),
                duration,
                (t) => {
                  const s = shrink + (1 - shrink) * t;
                  cells.forEach((c) => (c._scale = s));
                  this.requestRender();
                },
                () => {
                  cells.forEach((c) => {
                    delete c._scale;
                    c.isOpened = true;
                  });
                  this.canDrag = true;
                  this.requestRender();
                  resolve();
                }
              )
            );
          }
        )
      );
    });
  }

  animMismatch(positions, duration, delay) {
    this.canDrag = false;
    return new Promise((resolve) => {
      setTimeout(() => {
        const [p1, p2] = positions;
        Promise.all([
          this.animClose(p1, duration),
          this.animClose(p2, duration),
        ]).then(() => {
          this.selectedCell = null;
          this.secondCell = null;
          this.canDrag = true;
          this.requestRender();
          resolve();
        });
      }, delay);
    });
  }

  animMismatchFeedback(
    positions,
    duration,
    delay,
    shrink,
    shakeDur,
    shakeCount,
    amplitute
  ) {
    this.canDrag = false;
    return new Promise((resolve) => {
      const cells = positions.map((p) => this.grid.cells[p.row][p.col]);

      // shrink
      this.animMgr.add(
        new MyAnimation(
          performance.now(),
          duration,
          (t) => {
            const s = 1 - (1 - shrink) * t;
            cells.forEach((c) => (c._scale = s));
            this.requestRender();
          },
          () => {
            // shake
            this.animMgr.add(
              new MyAnimation(
                performance.now(),
                shakeDur,
                (t) => {
                  const off = Math.sin(t * shakeCount * Math.PI) * amplitute;
                  cells.forEach((c) => (c._shake = off));
                  this.requestRender();
                },
                () => {
                  // restore
                  this.animMgr.add(
                    new MyAnimation(
                      performance.now(),
                      duration,
                      (t) => {
                        const s = shrink + (1 - shrink) * t;
                        cells.forEach((c) => {
                          c._scale = s;
                          c._shake = 0;
                        });
                        this.requestRender();
                      },
                      () => {
                        // close
                        this.animMismatch(positions, duration, delay);
                        resolve();
                      }
                    )
                  );
                }
              )
            );
          }
        )
      );
    });
  }

  async onCellClicked(cellPosition) {
    if (!this.canDrag) return;

    const cell = this.grid.cells[cellPosition.row][cellPosition.col];

    if (!cellPosition || !cell || cell.isOpened) return;

    this.canDrag = false;

    if (!this.selectedCell) {
      this.selectedCell = cellPosition;
      await this.animOpen(cellPosition, ANIMATION_CONFIG.DURATIONS.open);
      this.canDrag = true;
    } else if (
      this.selectedCell.row === cellPosition.row &&
      this.selectedCell.col === cellPosition.col
    ) {
      // pass
    } else if (!this.secondCell) {
      this.secondCell = cellPosition;
      await this.animOpen(cellPosition, ANIMATION_CONFIG.DURATIONS.open);
      await this.handleMatches();
    }
  }

  async handleMatches() {
    if (!this.selectedCell || !this.secondCell) return;

    const p1 = this.selectedCell;
    const p2 = this.secondCell;
    const c1 = this.grid.cells[p1.row][p1.col];
    const c2 = this.grid.cells[p2.row][p2.col];

    let animPromise;

    if (c1.type === c2.type) {
      this.score++;
      animPromise = this.animMatchFeedback(
        [p1, p2],
        ANIMATION_CONFIG.DURATIONS.match,
        ANIMATION_CONFIG.MATCH_FEEDBACK.shrink
      );
      // await this.animMatchRemove([p1, p2], ANIMATION_CONFIG.DURATIONS.remove)
    } else {
      this.currentStep++;
      animPromise = this.animMismatchFeedback(
        [p1, p2],
        ANIMATION_CONFIG.DURATIONS.mismatch,
        GAME_CONFIG.BACK_COOLDOWN,
        ANIMATION_CONFIG.MISMATCH_FEEDBACK.shrink,
        ANIMATION_CONFIG.MISMATCH_FEEDBACK.shakeDur,
        ANIMATION_CONFIG.MISMATCH_FEEDBACK.shakeCount,
        ANIMATION_CONFIG.MISMATCH_FEEDBACK.amplitute
      );
    }

    this.selectedCell = null;
    this.secondCell = null;

    await animPromise;

    // if (!this.isTutorialActive) {
    //     this.canDrag = true;
    // }

    if (
      this.currentStep === this.stepsCount ||
      (c1.type === c2.type && this.score === this.targetItemsCount)
    ) {
      this.handleGameOver();
    }
  }

  // Туториал
  findTutorialPair() {
    const flatCells = this.grid.cells.flat().filter((c) => c);
    const types = {};
    for (const cell of flatCells) {
      if (!types[cell.type]) types[cell.type] = [];
      types[cell.type].push({ row: cell.row, col: cell.col });
    }

    for (const type in types) {
      if (types[type].length >= 2) {
        this.tutorialPairPositions = types[type].slice(0, 2);
        return;
      }
    }
  }

  handleTutorialClick(e) {
    const popupData = TUTORIAL_CONFIG.TEXTS[this.tutorialState];
    if (!popupData || !popupData.buttonText) return;

    // Получаем отступы для текущей карточки (с фолбэком)
    const paddingX = popupData.paddingX ?? TUTORIAL_CONFIG.POPUP_PADDING_X;
    const paddingY = popupData.paddingY ?? TUTORIAL_CONFIG.POPUP_PADDING_Y;

    const popupWidth = popupData.width;
    const maxWidth = popupWidth - 2 * paddingX; // Используем новый отступ

    this.ctx.font = "500 20px Roboto";
    const initialLines = popupData.text.split("\n");
    const wrappedLines = [];
    initialLines.forEach((line) => {
      wrappedLines.push(...wrapText(this.ctx, line, maxWidth));
    });

    const lineHeight = 24;
    const textBlockHeight =
      (wrappedLines.length > 0 ? wrappedLines.length - 1 : 0) * lineHeight +
      (wrappedLines.length > 0 ? 20 : 0);
    const buttonHeight = TUTORIAL_CONFIG.BUTTON_HEIGHT;
    const spaceBelowText = 20;
    // Используем новый отступ для расчета высоты
    const dynamicHeight =
      paddingY * 2 + textBlockHeight + spaceBelowText + buttonHeight;

    let popupY;
    if (popupData.y === "center") {
      popupY = (GAME_CONFIG.MAX_CANVAS_HEIGHT - dynamicHeight) / 2;
    } else {
      popupY = popupData.y;
    }

    const rect = this.canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const popupX_scaled =
      ((GAME_CONFIG.MAX_CANVAS_WIDTH - popupWidth) / 2) * this.scale +
      this.offset.x;
    const popupY_scaled = popupY * this.scale + this.offset.y;

    const buttonX_scaled =
      popupX_scaled +
      ((popupWidth - TUTORIAL_CONFIG.BUTTON_WIDTH) / 2) * this.scale;
    const buttonY_scaled =
      popupY_scaled +
      (dynamicHeight - TUTORIAL_CONFIG.BUTTON_HEIGHT - 20) * this.scale;
    const buttonW_scaled = TUTORIAL_CONFIG.BUTTON_WIDTH * this.scale;
    const buttonH_scaled = TUTORIAL_CONFIG.BUTTON_HEIGHT * this.scale;

    if (
      clickX > buttonX_scaled &&
      clickX < buttonX_scaled + buttonW_scaled &&
      clickY > buttonY_scaled &&
      clickY < buttonY_scaled + buttonH_scaled
    ) {
      if (
        this.tutorialState === TUTORIAL_STATE.INTRO ||
        this.tutorialState === TUTORIAL_STATE.FINAL
      ) {
        this.advanceTutorial();
      }
    }
  }

  async advanceTutorial() {
    switch (this.tutorialState) {
      case TUTORIAL_STATE.INTRO:
        this.tutorialState = TUTORIAL_STATE.MEMORIZE;
        this.requestRender();
        this.advanceTutorial(); // Сразу запускаем логику для второго шага
        break;
      case TUTORIAL_STATE.MEMORIZE: {
        this.grid.cells.flat().forEach((cell) => {
          if (cell) cell.isOpened = true;
        });
        this.requestRender();
        await new Promise((r) => setTimeout(r, GAME_CONFIG.START_DELAY));
        const closePromises = this.grid.cells
          .flat()
          .filter((c) => c)
          .map((c) => this.animClose(c, ANIMATION_CONFIG.DURATIONS.close));
        await Promise.all(closePromises);
        this.tutorialState = TUTORIAL_STATE.FIND_PAIRS_1;
        this.requestRender();
        await new Promise((r) => setTimeout(r, 500));
        this.advanceTutorial();
        break;
      }

      case TUTORIAL_STATE.FIND_PAIRS_1:
        this.tutorialHand.visible = true;
        await this.animateHandAndClick(this.tutorialPairPositions[0]);
        this.tutorialState = TUTORIAL_STATE.FIRST_CARD_OPENED;
        this.requestRender();
        await new Promise((r) => setTimeout(r, 500));
        this.advanceTutorial();
        break;
      case TUTORIAL_STATE.FIRST_CARD_OPENED:
        this.tutorialState = TUTORIAL_STATE.FIND_PAIRS_2;
        this.requestRender();
        await new Promise((r) => setTimeout(r, 200));
        this.advanceTutorial();
        break;
      case TUTORIAL_STATE.FIND_PAIRS_2:
        await this.animateHandAndClick(this.tutorialPairPositions[1]);
        this.tutorialState = TUTORIAL_STATE.SECOND_CARD_OPENED;
        this.requestRender();
        await new Promise((r) => setTimeout(r, 1500));
        this.advanceTutorial();
        break;
      case TUTORIAL_STATE.SECOND_CARD_OPENED:
        this.tutorialHand.visible = false;
        this.tutorialState = TUTORIAL_STATE.FINAL;
        this.requestRender();
        break;
      case TUTORIAL_STATE.FINAL:
        this.tutorialState = TUTORIAL_STATE.COMPLETE;
        this.isTutorialActive = false;
        this.canDrag = true;
        this.requestRender();
        break;
    }
  }

  async animateHandToPos(pos) {
    if (!pos) return;
    const coords = this.renderer.getCoords(pos);
    const targetX = coords.x + CELL_CONFIG.WIDTH / 2,
      targetY = coords.y + CELL_CONFIG.HEIGHT / 2 + 10;
    const isFirstMove = this.tutorialHand.x === 0 && this.tutorialHand.y === 0;
    const startX = isFirstMove ? targetX : this.tutorialHand.x;
    const startY = isFirstMove ? targetY - 50 : this.tutorialHand.y;
    this.tutorialHand.x = startX;
    this.tutorialHand.y = startY;
    await this._animate(500, (t) => {
      this.tutorialHand.x = startX + (targetX - startX) * t;
      this.tutorialHand.y = startY + (targetY - startY) * t;
    });
  }

  async animateHandAndClick(pos) {
    await this.animateHandToPos(pos);
    await this._animate(200, (t) => {
      this.tutorialHand.scale = 1 - 0.2 * t;
    });
    await this.onCellClicked(pos);
    await this._animate(200, (t) => {
      this.tutorialHand.scale = 0.8 + 0.2 * t;
    });
  }

  // Вспомогательный метод для упрощения анимаций
  _animate(duration, updateCallback) {
    return new Promise((resolve) => {
      this.animMgr.add(
        new MyAnimation(performance.now(), duration, updateCallback, resolve)
      );
      this.requestRender();
    });
  }

  handlePointerDown(e) {
    if (this.isTutorialActive) {
      this.handleTutorialClick(e);
      return;
    }

    console.log("isAnimating: ", this.animMgr.isAnimating());

    if (!this.canDrag || this.animMgr.isAnimating()) return;
    const pos = this.getCellGridPosition(e);
    if (pos) this.onCellClicked(pos);
  }

  getCellGridPosition(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const startX = LAYOUT.GRID_PADDING_LEFT * this.scale + this.offset.x;
    const startY = LAYOUT.GRID_PADDING_TOP * this.scale + this.offset.y;
    const cellW = (CELL_CONFIG.WIDTH + CELL_CONFIG.GAP) * this.scale;
    const cellH = (CELL_CONFIG.HEIGHT + CELL_CONFIG.GAP) * this.scale;
    const col = Math.floor((x - startX) / cellW);
    const row = Math.floor((y - startY) / cellH);
    if (row < 0 || col < 0 || row >= this.grid.rows || col >= this.grid.cols)
      return null;
    const cell = this.grid.cells[row][col];

    return cell && !cell.isDeleted ? { row, col } : null;
  }

  setFinishCallback(cb) {
    this.finishCb = cb;
  }

  setAssetsLoadedCallback(cb) {
    this.assetsLoadedCb = cb;
  }

  handleGameOver() {
    console.log("GameOver!");
    this.isGameOver = true;
    if (this.finishCb) {
      const gameData = {
        score: this.score,
        currentStep: this.currentStep,
      };
      this.finishCb(gameData);
    }

    window.removeEventListener("resize", this.boundResize);
    this.canvas.removeEventListener("pointerdown", this.boundHandlePointerDown);

    if (this.gameLoopId) {
      cancelAnimationFrame(this.gameLoopId);
    }
  }

  static getInstance(tmp) {
    return tmp.engine;
  }
}
