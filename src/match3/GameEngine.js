import {
  PATHS,
  GAME_CONFIG,
  LAYOUT,
  CELL_CONFIG,
  UI_ELEMENTS,
  ANIMATION_CONFIG,
  TUTORIAL_STATE,
  TUTORIAL_CONFIG,
} from "./config";

import { loadImage, measureAndWrapText } from "./utils";

import AnimationManager from "./AnimationManager";
import Grid from "./Grid";
import LCG from "./LCG";
import MyAnimation from "./MyAnimation";
import Renderer from "./Renderer";

export default class GameEngine {
  constructor(canvas, initGameData, tmp = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.tmp = tmp;
    tmp.engine = this;
    this.assetKeys = Object.keys(PATHS.CARDS);

    const seed = initGameData.seed || Date.now().toString(16);
    this.randomGen = new LCG(seed);

    this.dimensions = {
      width: GAME_CONFIG.MAX_CANVAS_WIDTH,
      height: GAME_CONFIG.MAX_CANVAS_HEIGHT,
    };
    this.scale = 1;
    this.offset = { x: 0, y: 0 };

    this.trainingCount = +initGameData.trainingCount || 0;
    this.showTutorial = this.trainingCount < 3;
    this.stepsCount = +initGameData.maxStepsCount || 10;
    this.currentStep = 0;
    this.targetItemsCount = +initGameData.targetItemsCount || 10;
    this.score = 0;
    this.isGameOver = false;
    this.images = {};

    this.grid = new Grid(
      GAME_CONFIG.GRID_ROWS,
      GAME_CONFIG.GRID_COLS,
      this.assetKeys,
      () => this.randomGen.random(),
      (row, col, rows, cols) =>
        !((row === 0 || row === rows - 1) && (col === 0 || col === cols - 1))
    );
    this.animMgr = new AnimationManager();
    this.renderer = new Renderer(this.ctx, {
      scale: this.scale,
      offset: this.offset,
      dims: this.dimensions,
      images: this.images,
    });

    this.orderProduct =
      this.assetKeys[
        Math.floor(this.randomGen.random() * this.assetKeys.length)
      ];
    this.selectedCell = null;
    this.secondCell = null;
    this.needsRender = true;
    this.gameLoopId = null;

    this.isTutorialActive = this.showTutorial;
    this.tutorialState = this.showTutorial
      ? TUTORIAL_STATE.INTRO
      : TUTORIAL_STATE.NONE;
    this.tutorialMove = null;
    this.tutorialHand = { x: 0, y: 0, scale: 1, visible: false };
    this.tutorialTimeoutId = null;

    this.boundResize = () => {
      this.resizeCanvas();
      this.requestRender();
    };

    this.boundHandlePointerDown = (e) => this.handlePointerDown(e);

    // window.addEventListener("resize", this.boundResize);
    // canvas.addEventListener("pointerdown", this.boundHandlePointerDown);
    // this.loadAssets();
  }

  async init() {
    console.log("Engine initialization started...");
    await this.loadAssets();
    this.resizeCanvas();
    this.initTutorialLayouts();

    window.addEventListener("resize", this.boundResize);
    this.canvas.addEventListener("pointerdown", this.boundHandlePointerDown);

    if (this.assetsLoadedCb) this.assetsLoadedCb();

    if (this.isTutorialActive) {
      this.findTutorialMove();
      this.runTutorial();
    }

    this.requestRender();
    console.log("Engine initialization complete.");
  }

  initTutorialLayouts() {
    console.log("Pre-calculating tutorial layouts...");
    const ctx = this.canvas.getContext("2d");
    const { POPUP, BUTTON, ARROW } = TUTORIAL_CONFIG;

    for (const key in TUTORIAL_CONFIG.TEXTS) {
      const popupData = TUTORIAL_CONFIG.TEXTS[key];
      ctx.font = POPUP.FONT;
      const popupWidth = popupData.width;
      const maxWidth = popupWidth - POPUP.PADDING_X * 2;
      const measured = measureAndWrapText(
        ctx,
        popupData.text,
        maxWidth,
        POPUP.LINE_HEIGHT
      );

      let contentHeight = measured.height;
      if (popupData.buttonText)
        contentHeight += BUTTON.HEIGHT + BUTTON.MARGIN_BOTTOM;
      if (popupData.hasArrow && this.images.arrow)
        contentHeight += this.images.arrow.height + ARROW.GAP_Y;

      const popupHeight = contentHeight + POPUP.PADDING_Y * 2;
      let popupY =
        popupData.y === "center"
          ? (GAME_CONFIG.MAX_CANVAS_HEIGHT - popupHeight) / 2
          : popupData.y;
      const popupX = (GAME_CONFIG.MAX_CANVAS_WIDTH - popupWidth) / 2;

      let textStartY = popupY + POPUP.PADDING_Y;
      if (popupData.centerBlock)
        textStartY = popupY + (popupHeight - contentHeight) / 2;

      popupData.layout = {
        lines: measured.lines,
        popupWidth,
        popupHeight,
        popupX,
        popupY,
        textCenterX: popupX + popupWidth / 2,
        textStartY,
        arrowX: popupData.hasArrow
          ? popupX + (popupWidth - (this.images.arrow?.width || 0)) / 2
          : 0,
        arrowY: textStartY + measured.height + ARROW.GAP_Y,
        buttonX: popupData.buttonText
          ? popupX + (popupWidth - BUTTON.WIDTH) / 2
          : 0,
        buttonY: popupY + popupHeight - BUTTON.HEIGHT - BUTTON.MARGIN_BOTTOM,
      };
    }

    console.log("Tutorial layouts calculated.");
  }

  requestRender() {
    this.needsRender = true;
    if (!this.gameLoopId) this.startGameLoop();
  }

  startGameLoop() {
    if (this.gameLoopId) cancelAnimationFrame(this.gameLoopId);
    this.gameLoopId = requestAnimationFrame(this.gameLoop.bind(this));
  }

  stopGameLoop() {
    if (this.gameLoopId) cancelAnimationFrame(this.gameLoopId);
    this.gameLoopId = null;
  }

  gameLoop() {
    this.animMgr.update(performance.now());
    if (this.animMgr.isAnimating() || this.needsRender) {
      this.renderer.drawScene(this.grid, {
        orderProduct: this.orderProduct,
        score: this.score,
        targetItemsCount: this.targetItemsCount,
        currentStep: this.currentStep,
        stepsCount: this.stepsCount,
        selected: this.selectedCell,
      });
      if (this.isTutorialActive) {
        this.renderer.drawTutorial({
          tutorialState: this.tutorialState,
          tutorialMove: this.tutorialMove,
          tutorialHand: this.tutorialHand,
          selectedCell: this.selectedCell,
          grid: this.grid,
        });
      }

      this.needsRender = false;
    }

    this.gameLoopId = requestAnimationFrame(this.gameLoop.bind(this));
  }

  resizeCanvas() {
    const p = this.canvas.parentElement;
    if (!p) return;
    const { clientWidth: w, clientHeight: h } = p;
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

  async loadAssets() {
    console.log("Loading assets...");
    const cardEntries = Object.entries(PATHS.CARDS);
    const otherEntries = [
      ["lamBoy", PATHS.LAMBOY],
      ["hand", PATHS.HAND],
      ["arrow", PATHS.ARROW],
      ["highlight", PATHS.HIGHLIGHT],
      ["highlightCounter", PATHS.HIGHLIGHT_COUNTER],
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
      document.fonts.load(TUTORIAL_CONFIG.POPUP.FONT),
      document.fonts.load(UI_ELEMENTS.STEPS_CARD.FONT),
    ]);
    console.log("Required fonts loaded.");

    // this.onAssetsLoaded();
  }

  // onAssetsLoaded() {
  //   this.resizeCanvas();
  //   if (this.assetsLoadedCb) this.assetsLoadedCb();
  //   this.initTutorialLayouts();
  //   if (this.isTutorialActive) {
  //     this.findTutorialMove();
  //     this.runTutorial();
  //   }
  //   this.requestRender();
  // }

  animSwap(a, b) {
    const duration = ANIMATION_CONFIG.SWAP_DURATION;
    const fromCell = this.grid.cells[a.row][a.col];
    const toCell = this.grid.cells[b.row][b.col];

    this.animMgr.add(
      new MyAnimation(
        performance.now(),
        duration,
        (t) => {
          const e = ANIMATION_CONFIG.EASING.SWAPPING(t);
          [
            { cell: fromCell, from: a, to: b },
            { cell: toCell, from: b, to: a },
          ].forEach(({ cell, from, to }) => {
            if (!cell || cell.isDeleted) return;
            const p0 = this.renderer.getCoords(from);
            const p1 = this.renderer.getCoords(to);
            cell._animX = p0.x + (p1.x - p0.x) * e;
            cell._animY = p0.y + (p1.y - p0.y) * e;
          });
        },
        async () => {
          this.grid.cells[a.row][a.col] = toCell;
          this.grid.cells[b.row][b.col] = fromCell;
          if (fromCell) {
            fromCell.row = b.row;
            fromCell.col = b.col;
          }

          if (toCell) {
            toCell.row = a.row;
            toCell.col = a.col;
          }

          delete fromCell?._animX;
          delete fromCell?._animY;
          delete toCell?._animX;
          delete toCell?._animY;
          this.requestRender();

          const hasMatch = this.grid
            .getMatchedCells()
            .some((row) => row.some((x) => x));
          if (hasMatch) {
            if (!this.isTutorialActive) {
              this.currentStep++;
              if (this.currentStep >= this.stepsCount) this.handleGameOver();
            }

            await this.handleMatches();
          } else {
            this.animMgr.add(
              new MyAnimation(
                performance.now(),
                duration,
                (t2) => {
                  const e2 = ANIMATION_CONFIG.EASING.SWAPPING(t2);
                  [
                    { cell: fromCell, from: b, to: a },
                    { cell: toCell, from: a, to: b },
                  ].forEach(({ cell, from, to }) => {
                    if (!cell || cell.isDeleted) return;
                    const p0 = this.renderer.getCoords(from);
                    const p1 = this.renderer.getCoords(to);
                    cell._animX = p0.x + (p1.x - p0.x) * e2;
                    cell._animY = p0.y + (p1.y - p0.y) * e2;
                  });
                },
                () => {
                  this.grid.cells[a.row][a.col] = fromCell;
                  this.grid.cells[b.row][b.col] = toCell;
                  if (fromCell) {
                    fromCell.row = a.row;
                    fromCell.col = a.col;
                  }

                  if (toCell) {
                    toCell.row = b.row;
                    toCell.col = b.col;
                  }

                  delete fromCell?._animX;
                  delete fromCell?._animY;
                  delete toCell?._animX;
                  delete toCell?._animY;
                  this.requestRender();
                }
              )
            );
          }
        }
      )
    );
    this.requestRender();
  }

  onCellClicked(cellPosition) {
    if (!this.selectedCell) {
      this.selectedCell = cellPosition;
    } else if (
      this.selectedCell.row === cellPosition.row &&
      this.selectedCell.col === cellPosition.col
    ) {
      this.selectedCell = null;
    } else {
      this.secondCell = cellPosition;
    }

    if (
      this.selectedCell &&
      this.secondCell &&
      this.grid.areAdjacent(this.selectedCell, this.secondCell)
    ) {
      this.animSwap(this.selectedCell, this.secondCell);
      this.selectedCell = null;
      this.secondCell = null;
    }

    this.requestRender();
  }

  handlePointerDown(e) {
    if (this.isTutorialActive) {
      const popupData = TUTORIAL_CONFIG.TEXTS[this.tutorialState];
      if (!popupData) return;

      if (popupData.buttonText) {
        this.handleTutorialClick(e);
      } else if (popupData.awaitClick) {
        this.advanceTutorial();
      }

      return;
    }

    if (this.animMgr.isAnimating()) return;
    const pos = this.getCellGridPosition(e);
    if (pos) this.onCellClicked(pos);
  }

  async handleMatches() {
    const matched = this.grid.getMatchedCells();
    const positions = [];
    for (let row = 0; row < this.grid.rows; row++) {
      for (let col = 0; col < this.grid.cols; col++) {
        if (matched[row][col]) positions.push({ row, col });
      }
    }

    if (positions.length === 0) {
      if (!this.grid.checkAvailableMoves()) {
        this.grid.initGridWithTurns();
        await this.handleMatches();
      }

      return;
    }

    const correctCount = positions.filter(
      (pos) => this.grid.cells[pos.row][pos.col]?.type === this.orderProduct
    ).length;
    this.score += correctCount;
    if (this.score >= this.targetItemsCount) this.handleGameOver();

    await this.animRemoveMatches(positions);
    await this.animDrop();
  }

  animRemoveMatches(matchedPositions) {
    return new Promise((resolve) => {
      const items = matchedPositions
        .map(({ row, col }) => this.grid.cells[row][col])
        .filter((cell) => cell && !cell.isDeleted);

      this.animMgr.add(
        new MyAnimation(
          performance.now(),
          ANIMATION_CONFIG.REMOVE_DURATION,
          (t) => {
            const p = ANIMATION_CONFIG.EASING.REMOVING(t);
            items.forEach((cell) => {
              cell._removalProgress = p;
            });
            this.requestRender();
          },
          () => {
            items.forEach((cell) => {
              cell.isDeleted = true;
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

  animDrop() {
    return new Promise((resolve) => {
      const dropItems = [];
      for (let col = 0; col < this.grid.cols; col++) {
        let emptyCount = 0;
        for (let row = this.grid.rows - 1; row >= 0; row--) {
          if (!this.grid.isCellActive(row, col)) {
            emptyCount = 0;
            continue;
          }

          const cell = this.grid.cells[row][col];
          if (!cell || cell.isDeleted) {
            emptyCount++;
          } else if (emptyCount > 0) {
            dropItems.push({
              cell,
              from: { row, col },
              to: { row: row + emptyCount, col },
            });
          }
        }
      }

      const onOldDropped = () => {
        this.grid.dropCells();
        const emptyPos = [];
        for (let r = 0; r < this.grid.rows; r++)
          for (let c = 0; c < this.grid.cols; c++) {
            if (
              this.grid.isCellActive(r, c) &&
              (!this.grid.cells[r][c] || this.grid.cells[r][c].isDeleted)
            ) {
              emptyPos.push({ row: r, col: c });
            }
          }

        this.grid.fillEmptyCells();
        const newItems = emptyPos.map((pos) => {
          const cell = this.grid.cells[pos.row][pos.col];
          const to = this.renderer.getCoords(pos);
          const from = { x: to.x, y: to.y - CELL_CONFIG.NEW_CELL_START_Y };
          cell._animX = from.x;
          cell._animY = from.y;
          return { cell, from, to };
        });

        if (newItems.length === 0) {
          this.handleMatches().then(resolve);
          return;
        }

        this.animMgr.add(
          new MyAnimation(
            performance.now(),
            ANIMATION_CONFIG.DROP_NEW_DURATION,
            (t2) => {
              const e2 = ANIMATION_CONFIG.EASING.FALLING(t2);
              newItems.forEach(({ cell, from, to }) => {
                if (cell.isDeleted) return;
                cell._animX = from.x + (to.x - from.x) * e2;
                cell._animY = from.y + (to.y - from.y) * e2;
              });
              this.requestRender();
            },
            async () => {
              newItems.forEach(({ cell }) => {
                delete cell._animX;
                delete cell._animY;
              });
              this.requestRender();
              await this.handleMatches();
              resolve();
            }
          )
        );
      };

      if (dropItems.length === 0) {
        onOldDropped();
        return;
      }

      this.animMgr.add(
        new MyAnimation(
          performance.now(),
          ANIMATION_CONFIG.DROP_OLD_DURATION,
          (t) => {
            const e = ANIMATION_CONFIG.EASING.FALLING(t);
            dropItems.forEach(({ cell, from, to }) => {
              if (cell.isDeleted) return;
              const p0 = this.renderer.getCoords(from);
              const p1 = this.renderer.getCoords(to);
              cell._animX = p0.x + (p1.x - p0.x) * e;
              cell._animY = p0.y + (p1.y - p0.y) * e;
            });
            this.requestRender();
          },
          onOldDropped
        )
      );
      this.requestRender();
    });
  }

  getCellGridPosition(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left,
      y = e.clientY - rect.top;
    const gridStartX = this.offset.x + LAYOUT.GRID_PADDING_LEFT * this.scale;
    const gridStartY =
      this.offset.y +
      (LAYOUT.HEADER_HEIGHT + LAYOUT.GRID_PADDING_TOP) * this.scale;
    const cellWidth = (CELL_CONFIG.WIDTH + CELL_CONFIG.GAP) * this.scale;
    const cellHeight = (CELL_CONFIG.HEIGHT + CELL_CONFIG.GAP) * this.scale;
    const col = Math.floor((x - gridStartX) / cellWidth);
    const row = Math.floor((y - gridStartY) / cellHeight);
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
    if (this.isGameOver) return;
    this.isGameOver = true;
    console.log("GameOver!", this.score, this.currentStep);
    if (this.finishCb) {
      const gameData = { score: this.score, currentStep: this.currentStep };
      this.finishCb(gameData);
    }

    window.removeEventListener("resize", this.boundResize);
    this.canvas.removeEventListener("pointerdown", this.boundHandlePointerDown);
  }

  findTutorialMove() {
    const { grid } = this;
    const checkMatch = (row, col, dRow, dCol) => {
      const type = grid.cells[row]?.[col]?.type;
      if (!type) return [];
      const match = [{ row, col }];
      for (let i = 1; i < 3; i++) {
        const nRow = row + dRow * i,
          nCol = col + dCol * i;
        if (grid.cells[nRow]?.[nCol]?.type === type) {
          match.push({ row: nRow, col: nCol });
        } else break;
      }

      return match.length >= 3 ? match : [];
    };

    for (let row = 0; row < grid.rows; row++) {
      for (let col = 0; col < grid.cols; col++) {
        if (!grid.isCellActive(row, col)) continue;
        if (col < grid.cols - 1 && grid.isCellActive(row, col + 1)) {
          [grid.cells[row][col], grid.cells[row][col + 1]] = [
            grid.cells[row][col + 1],
            grid.cells[row][col],
          ];
          for (const { row: currentRow, col: currentCol } of [
            { row, col },
            { row, col: col + 1 },
          ]) {
            const hMatch = [
              ...checkMatch(currentRow, currentCol, 0, -1),
              ...checkMatch(currentRow, currentCol, 0, 1),
            ].slice(1);
            const vMatch = [
              ...checkMatch(currentRow, currentCol, -1, 0),
              ...checkMatch(currentRow, currentCol, 1, 0),
            ].slice(1);
            if (hMatch.length >= 2 || vMatch.length >= 2) {
              const allMatches = [
                ...hMatch,
                ...vMatch,
                { row: currentRow, col: currentCol },
              ];
              const uniqueMatches = [
                ...new Map(
                  allMatches.map((item) => [`${item.row},${item.col}`, item])
                ).values(),
              ];
              this.tutorialMove = {
                from: { row, col: col + 1 },
                to: { row, col },
                spotlightCells: [
                  { row, col },
                  { row, col: col + 1 },
                  ...uniqueMatches,
                ],
              };
              [grid.cells[row][col], grid.cells[row][col + 1]] = [
                grid.cells[row][col + 1],
                grid.cells[row][col],
              ];
              return;
            }
          }

          [grid.cells[row][col], grid.cells[row][col + 1]] = [
            grid.cells[row][col + 1],
            grid.cells[row][col],
          ];
        }
      }
    }
  }

  runTutorial() {
    this.canDrag = false;
    this.tutorialState = TUTORIAL_STATE.INTRO;
    this.requestRender();
  }

  handleTutorialClick(e) {
    const popupData = TUTORIAL_CONFIG.TEXTS[this.tutorialState];
    if (!popupData?.buttonText) return;

    const layout = popupData.layout;
    const rect = this.canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left,
      clickY = e.clientY - rect.top;

    const buttonX_scaled = layout.buttonX * this.scale + this.offset.x;
    const buttonY_scaled = layout.buttonY * this.scale + this.offset.y;
    const buttonW_scaled = TUTORIAL_CONFIG.BUTTON.WIDTH * this.scale;
    const buttonH_scaled = TUTORIAL_CONFIG.BUTTON.HEIGHT * this.scale;

    if (
      clickX > buttonX_scaled &&
      clickX < buttonX_scaled + buttonW_scaled &&
      clickY > buttonY_scaled &&
      clickY < buttonY_scaled + buttonH_scaled
    ) {
      this.advanceTutorial();
    }
  }

  async advanceTutorial() {
    if (this.tutorialTimeoutId) {
      clearTimeout(this.tutorialTimeoutId);
      this.tutorialTimeoutId = null;
    }

    const previousState = this.tutorialState;

    switch (previousState) {
      case TUTORIAL_STATE.INTRO:
        this.tutorialState = TUTORIAL_STATE.STEP_2_HEADER_TARGET;
        break;
      case TUTORIAL_STATE.STEP_2_HEADER_TARGET: {
        this.tutorialState = TUTORIAL_STATE.STEP_3_SHOW_SWAP;
        const toCoords = this.renderer.getCoords(this.tutorialMove.to);
        this.tutorialHand.x = toCoords.x + CELL_CONFIG.WIDTH / 2;
        this.tutorialHand.y = toCoords.y - CELL_CONFIG.HEIGHT;
        this.tutorialHand.visible = true;
        break;
      }

      case TUTORIAL_STATE.STEP_3_SHOW_SWAP:
        this.tutorialState = TUTORIAL_STATE.STEP_4_PERFORM_SWAP;
        this.advanceTutorial(); // Этот шаг автоматический, сразу запускаем следующий
        return; // Выходим, чтобы не устанавливать таймер для него
      case TUTORIAL_STATE.STEP_4_PERFORM_SWAP:
        await this.animateHandAndSwap();
        this.tutorialState = TUTORIAL_STATE.STEP_5_MATCH_EFFECT;
        break;
      case TUTORIAL_STATE.STEP_5_MATCH_EFFECT:
        this.tutorialState = TUTORIAL_STATE.STEP_6_NEW_ELEMENTS;
        break;
      case TUTORIAL_STATE.STEP_6_NEW_ELEMENTS:
        this.tutorialHand.visible = false;
        this.tutorialState = TUTORIAL_STATE.STEP_7_TARGET_COUNTER;
        break;
      case TUTORIAL_STATE.STEP_7_TARGET_COUNTER:
        this.tutorialState = TUTORIAL_STATE.STEP_8_STEPS_COUNTER;
        break;
      case TUTORIAL_STATE.STEP_8_STEPS_COUNTER:
        this.isTutorialActive = false;
        this.tutorialState = TUTORIAL_STATE.COMPLETE;
        this.canDrag = true;
        break;
    }

    this.requestRender();

    const nextPopupData = TUTORIAL_CONFIG.TEXTS[this.tutorialState];
    if (nextPopupData?.autoAdvanceAfter) {
      const stateWhenTimerWasSet = this.tutorialState;

      this.tutorialTimeoutId = setTimeout(() => {
        if (this.tutorialState === stateWhenTimerWasSet) {
          this.advanceTutorial();
        }
      }, nextPopupData.autoAdvanceAfter);
    }
  }

  async animateHandAndSwap() {
    const { from, to } = this.tutorialMove;
    const fromCoords = this.renderer.getCoords(from);
    const toCoords = this.renderer.getCoords(to);
    const handStartX = this.tutorialHand.x;
    const handStartY = this.tutorialHand.y;

    await this._animate(500, (t) => {
      const targetY = toCoords.y + CELL_CONFIG.HEIGHT / 2 + 10;
      this.tutorialHand.y = handStartY + (targetY - handStartY) * t;
    });

    this.selectedCell = to;
    this.requestRender();
    await this._animate(200, (t) => {
      this.tutorialHand.scale = 1 - 0.1 * t;
    });
    await this._animate(200, (t) => {
      this.tutorialHand.scale = 0.9 + 0.1 * t;
    });

    await this._animate(500, (t) => {
      const currentHandY = toCoords.y + CELL_CONFIG.HEIGHT / 2 + 10;
      const targetX = fromCoords.x + CELL_CONFIG.WIDTH / 2;
      const targetY = fromCoords.y + CELL_CONFIG.HEIGHT / 2 + 10;
      this.tutorialHand.x = handStartX + (targetX - handStartX) * t;
      this.tutorialHand.y = currentHandY + (targetY - currentHandY) * t;
    });

    this.selectedCell = from;
    this.requestRender();
    await this._animate(200, (t) => {
      this.tutorialHand.scale = 1 - 0.1 * t;
    });
    await this._animate(200, (t) => {
      this.tutorialHand.scale = 0.9 + 0.1 * t;
    });

    this.selectedCell = null;
    this.animSwap(from, to);
  }

  _animate(duration, updateCallback) {
    return new Promise((resolve) => {
      this.animMgr.add(
        new MyAnimation(performance.now(), duration, updateCallback, resolve)
      );
      this.requestRender();
    });
  }

  static getInstance(tmp) {
    return tmp.engine;
  }
}
