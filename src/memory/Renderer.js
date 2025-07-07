import {
  GAME_CONFIG,
  COLORS,
  LAYOUT,
  CELL_CONFIG,
  TUTORIAL_CONFIG,
} from "./config";

import {
  drawCard,
  roundRect,
  drawImageInCell,
  drawGroundGrid,
  wrapText,
} from "./utils";

export default class Renderer {
  constructor(ctx, opts) {
    this.ctx = ctx;
    this.scale = opts.scale;
    this.offset = opts.offset;
    this.dims = opts.dims;
    this.images = opts.images;
  }

  getCoords(pos) {
    const x0 = LAYOUT.GRID_PADDING_LEFT;
    const y0 = LAYOUT.GRID_PADDING_TOP;
    return {
      x: x0 + pos.col * (CELL_CONFIG.WIDTH + CELL_CONFIG.GAP),
      y: y0 + pos.row * (CELL_CONFIG.HEIGHT + CELL_CONFIG.GAP),
    };
  }

  drawStepsCard(currentStep, stepsCount) {
    this.ctx.save();

    this.ctx.translate(this.offset.x, this.offset.y);
    this.ctx.scale(this.scale, this.scale);

    const stepsCardX = LAYOUT.STEPS_PADDING_LEFT;
    const stepsCardY = LAYOUT.STEPS_PADDING_TOP;

    this.ctx.beginPath();
    drawCard(
      this.ctx,
      stepsCardX,
      stepsCardY,
      LAYOUT.STEPS_CARD_WIDTH,
      LAYOUT.STEPS_CARD_HEIGHT,
      12,
      COLORS.STEPS_STROKE,
      COLORS.STEPS_BG
    );
    this.ctx.closePath();

    this.ctx.fillStyle = COLORS.STEPS_TEXT;
    this.ctx.font = "500 24px/0.15px Roboto Mono";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";

    this.ctx.fillText(
      `Шаги ${currentStep}/${stepsCount}`,
      stepsCardX + LAYOUT.STEPS_CARD_WIDTH / 2,
      stepsCardY + LAYOUT.STEPS_CARD_HEIGHT / 2,
      LAYOUT.STEPS_CARD_WIDTH - 13
    );

    this.ctx.restore();
  }

  drawBushes() {
    if (!this.images.bushes) return;

    const { width, height } = this.dims;

    const bushDrawWidth = LAYOUT.BUSHES_WIDTH * this.scale;
    const bushDrawHeight = LAYOUT.BUSHES_HEIGHT * this.scale;

    // Расположение кустов по вертикали
    const bushY =
      height - LAYOUT.BOTTOM_GROUND_HEIGHT * this.scale - bushDrawHeight;

    const totalBushes = Math.ceil(width / bushDrawWidth);

    const midIndex = Math.floor(totalBushes / 2);
    const centerX = width / 2 - bushDrawWidth / 2;

    const startX = centerX - midIndex * bushDrawWidth;

    // Рисуем кусты по горизонтали
    for (let i = 0; i <= totalBushes; i++) {
      let x = startX + i * bushDrawWidth;

      // Положительное значение смещает куст вправо, отрицательное - влево
      const sideShift = (i - midIndex) * -0.01 * bushDrawWidth;

      this.ctx.drawImage(
        this.images.bushes,
        x + sideShift,
        bushY,
        bushDrawWidth,
        bushDrawHeight
      );
    }
  }

  drawBg() {
    const { width, height } = this.dims;

    this.ctx.save();
    const gradient = this.ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0.09, COLORS.BODY_BG_TOP);
    gradient.addColorStop(0.54, COLORS.BODY_BG_MIDDLE);
    gradient.addColorStop(1, COLORS.BODY_BG_BOTTOM);
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, width, height);

    this.ctx.fillStyle = COLORS.BOTTOM_GROUND_BG;
    this.ctx.fillRect(
      0,
      height - LAYOUT.BOTTOM_GROUND_HEIGHT,
      width,
      LAYOUT.BOTTOM_GROUND_HEIGHT
    );
    this.ctx.restore();
  }

  drawCell(cell) {
    const dpr = window.devicePixelRatio || 1;
    this.ctx.save();
    this.ctx.scale(dpr, dpr);

    // this.ctx.save();
    this.ctx.translate(this.offset.x, this.offset.y);
    this.ctx.scale(this.scale, this.scale);

    const { x, y } = this.getCoords(cell);

    // this.ctx.save();

    const shake = cell._shake || 0;
    const fbScale = cell._scale || 1;
    this.ctx.translate(x + shake, y);

    this.ctx.translate(CELL_CONFIG.WIDTH / 2, CELL_CONFIG.HEIGHT / 2);
    this.ctx.scale(fbScale, fbScale);
    this.ctx.translate(-CELL_CONFIG.WIDTH / 2, -CELL_CONFIG.HEIGHT / 2);

    const flip = cell._flipProgress;
    if (flip != null) {
      const scaleX = flip <= 0.5 ? 1 - flip * 2 : (flip - 0.5) * 2;
      this.ctx.translate(CELL_CONFIG.WIDTH / 2, CELL_CONFIG.HEIGHT / 2);
      this.ctx.scale(scaleX, 1);
      this.ctx.translate(-CELL_CONFIG.WIDTH / 2, -CELL_CONFIG.HEIGHT / 2);
    }

    if (cell._removalProgress != null) {
      this.ctx.globalAlpha = 1 - cell._removalProgress;
    }

    const showFace = flip != null ? flip > 0.5 : cell.isOpened;

    // очистка клетки
    this.ctx.save();
    this.ctx.beginPath();
    roundRect(
      this.ctx,
      0,
      0,
      CELL_CONFIG.WIDTH,
      CELL_CONFIG.HEIGHT,
      CELL_CONFIG.CARD_RADIUS
    );
    this.ctx.closePath();

    this.ctx.globalCompositeOperation = "destination-out";
    this.ctx.fill();
    this.ctx.stroke();

    this.ctx.globalCompositeOperation = "source-over";
    this.ctx.restore();

    // отображение новой клетки
    if (showFace) {
      this.ctx.beginPath();
      drawCard(
        this.ctx,
        0,
        0,
        CELL_CONFIG.WIDTH,
        CELL_CONFIG.HEIGHT,
        CELL_CONFIG.CARD_RADIUS,
        COLORS.STEPS_BG,
        COLORS.STEPS_BG
      );
      this.ctx.closePath();

      const img = this.images[cell.type];
      if (img) {
        drawImageInCell(
          this.ctx,
          img,
          0,
          0,
          CELL_CONFIG.WIDTH,
          CELL_CONFIG.HEIGHT,
          CELL_CONFIG.PADDING
        );
      }
    } else {
      if (this.images.ground) {
        this.ctx.drawImage(
          this.images.ground,
          0,
          0,
          CELL_CONFIG.WIDTH,
          CELL_CONFIG.HEIGHT
        );
      }
    }

    this.ctx.restore();
    // this.ctx.restore();
    // this.ctx.restore();
  }

  drawCells(cells) {
    for (const row of cells) {
      for (const cell of row) {
        if (!cell) continue;
        this.drawCell(cell);
      }
    }
  }

  drawGridZone(groundGrid) {
    this.ctx.save();
    this.ctx.translate(this.offset.x, this.offset.y);
    this.ctx.scale(this.scale, this.scale);

    // drawCard(this.ctx,
    //   LAYOUT.GRID_ZONE_PADDING_LEFT,
    //   LAYOUT.GRID_ZONE_PADDING_TOP,
    //   GRID_ZONE_WIDTH,
    //   GRID_ZONE_HEIGHT,
    //   LAYOUT.GRID_ZONE_RADIUS,
    //   COLORS.GRID_ZONE_BG,
    //   COLORS.GRID_ZONE_BG
    // );

    drawGroundGrid(
      this.ctx,
      LAYOUT.GRID_ZONE_PADDING_LEFT,
      LAYOUT.GRID_ZONE_PADDING_TOP,
      groundGrid,
      CELL_CONFIG.WIDTH,
      CELL_CONFIG.GAP,
      LAYOUT.GRID_ZONE_RADIUS,
      COLORS.GRID_ZONE_BG
    );

    this.ctx.restore();
  }

  drawTutorial(state) {
    const { ctx, scale, offset, dims, images } = this;
    const { tutorialState, tutorialHand } = state;
    const popupData = TUTORIAL_CONFIG.TEXTS[tutorialState];

    if (!popupData && !tutorialHand.visible) return;

    const dpr = window.devicePixelRatio || 1;
    this.ctx.save();
    this.ctx.scale(dpr, dpr);

    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.scale(scale, scale);

    if (popupData) {
      // 1. Получаем отступы для текущей карточки (с фолбэком на значения по умолчанию)
      const paddingX = popupData.paddingX ?? TUTORIAL_CONFIG.POPUP_PADDING_X;
      const paddingY = popupData.paddingY ?? TUTORIAL_CONFIG.POPUP_PADDING_Y;
      const centerTextBlock = popupData.centerTextBlock ?? false; // 1. Получаем новую опцию

      const popupWidth = popupData.width;
      const popupX = (GAME_CONFIG.MAX_CANVAS_WIDTH - popupWidth) / 2;
      const maxWidth = popupWidth - 2 * paddingX; // Используем новый отступ

      ctx.font = "600 16px/0.15px Roboto";

      const initialLines = popupData.text.split("\n");
      const wrappedLines = [];
      initialLines.forEach((line) => {
        wrappedLines.push(...wrapText(ctx, line, maxWidth));
      });

      const lineHeight = 24;
      ctx.lineHeight = lineHeight;
      const textBlockHeight =
        (wrappedLines.length > 0 ? wrappedLines.length - 1 : 0) * lineHeight +
        (wrappedLines.length > 0 ? 20 : 0);
      const buttonHeight = popupData.buttonText
        ? TUTORIAL_CONFIG.BUTTON_HEIGHT
        : 0;
      const spaceBelowText = popupData.buttonText ? 20 : 0;
      // Используем новый отступ для расчета высоты
      const dynamicHeight =
        paddingY * 2 + textBlockHeight + spaceBelowText + buttonHeight;

      let popupY;
      if (popupData.y === "center") {
        popupY = (GAME_CONFIG.MAX_CANVAS_HEIGHT - dynamicHeight) / 2;
      } else {
        popupY = popupData.y;
      }

      if (popupData.isModal) {
        ctx.fillStyle = TUTORIAL_CONFIG.MODAL_BG;
        ctx.fillRect(
          -offset.x / scale,
          -offset.y / scale,
          dims.width / scale,
          dims.height / scale
        );
      }

      ctx.fillStyle = TUTORIAL_CONFIG.POPUP_BG;
      ctx.beginPath();
      roundRect(ctx, popupX, popupY, popupWidth, dynamicHeight, 20);
      ctx.fill();
      ctx.closePath();

      ctx.fillStyle = TUTORIAL_CONFIG.TEXT_COLOR;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      let availableHeightForText;
      if (centerTextBlock) {
        // Центрируем по всей высоте карточки
        availableHeightForText = dynamicHeight - paddingY * 2 + 20;
      } else {
        // Центрируем в пространстве над кнопкой (старое поведение)
        availableHeightForText =
          dynamicHeight - paddingY * 2 - (buttonHeight + spaceBelowText) + 30;
      }

      const textBlockCenterY = popupY + paddingY + availableHeightForText / 2;
      const firstLineY = textBlockCenterY - textBlockHeight / 2;

      wrappedLines.forEach((line, i) => {
        ctx.fillText(
          line,
          popupX + popupWidth / 2,
          firstLineY + i * lineHeight
        );
      });

      if (popupData.buttonText) {
        const buttonX =
          popupX + (popupWidth - TUTORIAL_CONFIG.BUTTON_WIDTH) / 2;
        const buttonY =
          popupY + dynamicHeight - TUTORIAL_CONFIG.BUTTON_HEIGHT - 20;
        ctx.fillStyle = TUTORIAL_CONFIG.BUTTON_BG;
        ctx.beginPath();
        roundRect(
          ctx,
          buttonX,
          buttonY,
          TUTORIAL_CONFIG.BUTTON_WIDTH,
          TUTORIAL_CONFIG.BUTTON_HEIGHT,
          12
        );
        ctx.fill();
        ctx.closePath();
        ctx.fillStyle = TUTORIAL_CONFIG.BUTTON_TEXT_COLOR;
        ctx.font = "500 20px Roboto";
        ctx.textBaseline = "middle";
        ctx.fillText(
          popupData.buttonText,
          buttonX + TUTORIAL_CONFIG.BUTTON_WIDTH / 2,
          buttonY + TUTORIAL_CONFIG.BUTTON_HEIGHT / 2
        );
      }
    }

    if (tutorialHand.visible && images.hand) {
      ctx.save();
      const handImg = images.hand;
      ctx.translate(tutorialHand.x, tutorialHand.y);
      ctx.scale(tutorialHand.scale, tutorialHand.scale);
      ctx.drawImage(
        handImg,
        -15,
        -10,
        handImg.width * 0.9,
        handImg.height * 0.9
      );
      ctx.restore();
    }

    ctx.restore();
    ctx.restore();
  }

  drawScene(groundGrid, state) {
    const dpr = window.devicePixelRatio || 1;
    this.ctx.save();
    this.ctx.scale(dpr, dpr);
    const { width, height } = this.dims;
    this.ctx.clearRect(0, 0, width, height);

    this.drawBg();
    this.drawStepsCard(state.currentStep, state.stepsCount);
    this.drawBushes();

    this.drawGridZone(groundGrid);

    this.ctx.restore();
  }
}
