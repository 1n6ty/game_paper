import {
  GAME_CONFIG,
  COLORS,
  LAYOUT,
  CELL_CONFIG,
  UI_ELEMENTS,
  TUTORIAL_CONFIG,
} from "./config";

import { roundRect, drawRoundedPlus, drawCard, drawImageInCell } from "./utils";

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
    const y0 = LAYOUT.HEADER_HEIGHT + LAYOUT.GRID_PADDING_TOP;
    return {
      x: x0 + pos.col * (CELL_CONFIG.WIDTH + CELL_CONFIG.GAP),
      y: y0 + pos.row * (CELL_CONFIG.HEIGHT + CELL_CONFIG.GAP),
    };
  }

  drawHeader(orderProduct, targetItemsCount) {
    const { width } = this.dims;
    const scaledHeaderHeight = LAYOUT.HEADER_HEIGHT * this.scale;
    const gradient = this.ctx.createLinearGradient(0, 0, 0, scaledHeaderHeight);
    gradient.addColorStop(0, COLORS.HEADER_BG_TOP);
    gradient.addColorStop(0.71, COLORS.HEADER_BG_BOTTOM);
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, width, scaledHeaderHeight);

    this.ctx.save();
    const offsetX = (width - GAME_CONFIG.MAX_CANVAS_WIDTH * this.scale) / 2;
    this.ctx.translate(offsetX, this.offset.y);
    this.ctx.scale(this.scale, this.scale);

    if (this.images.lamBoy) {
      this.ctx.drawImage(
        this.images.lamBoy,
        LAYOUT.LAMBOY_PADDING_LEFT,
        LAYOUT.LAMBOY_PADDING_TOP,
        LAYOUT.LAMBOY_WIDTH,
        LAYOUT.LAMBOY_HEIGHT
      );
    }

    this.drawHighlightedTarget(orderProduct, targetItemsCount);
    this.ctx.restore();

    this.ctx.fillStyle = COLORS.HEADER_DIVIDER_UP;
    this.ctx.fillRect(
      0,
      scaledHeaderHeight -
        LAYOUT.HEADER_DIVIDER_DOWN_HEIGHT -
        LAYOUT.HEADER_DIVIDER_UP_HEIGHT,
      width,
      LAYOUT.HEADER_DIVIDER_UP_HEIGHT
    );
    this.ctx.fillStyle = COLORS.HEADER_DIVIDER_DOWN;
    this.ctx.fillRect(
      0,
      scaledHeaderHeight - LAYOUT.HEADER_DIVIDER_DOWN_HEIGHT,
      width,
      LAYOUT.HEADER_DIVIDER_DOWN_HEIGHT
    );
  }

  drawHighlightedTarget(orderProduct, targetItemsCount) {
    const { X, Y, CARD_WIDTH, CARD_HEIGHT, BORDER_RADIUS, IMAGE_SCALE } =
      UI_ELEMENTS.HEADER_TARGET;
    const { RADIUS, FONT, X_OFFSET, Y_OFFSET } = UI_ELEMENTS.TARGET_COUNTER;

    drawCard(
      this.ctx,
      X,
      Y,
      CARD_WIDTH,
      CARD_HEIGHT,
      BORDER_RADIUS,
      COLORS.TARGET_STROKE,
      COLORS.TARGET_BG
    );
    drawImageInCell(
      this.ctx,
      this.images[orderProduct],
      X,
      Y,
      CARD_WIDTH,
      CARD_HEIGHT,
      CELL_CONFIG.PADDING,
      IMAGE_SCALE
    );

    const counterX = X + X_OFFSET,
      counterY = Y + Y_OFFSET;
    this.ctx.fillStyle = COLORS.TARGET_COUNTER_BG;
    this.ctx.beginPath();
    this.ctx.arc(counterX, counterY, RADIUS, 0, 2 * Math.PI);
    this.ctx.fill();

    this.ctx.fillStyle = COLORS.TARGET_COUNTER_TEXT;
    this.ctx.font = FONT;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(`x${targetItemsCount}`, counterX, counterY);
  }

  drawCounters(orderProduct, score, targetItemsCount, currentStep, stepsCount) {
    this.ctx.save();
    this.ctx.translate(this.offset.x, this.offset.y);
    this.ctx.scale(this.scale, this.scale);

    const targetX = LAYOUT.COUNTERS_PADDING_LEFT;
    const targetY = LAYOUT.HEADER_HEIGHT + LAYOUT.COUNTERS_PADDING_TOP;
    const stepsX =
      targetX + UI_ELEMENTS.TARGET_CARD.WIDTH + LAYOUT.COUNTERS_GAP;

    drawCard(
      this.ctx,
      stepsX,
      targetY,
      UI_ELEMENTS.STEPS_CARD.WIDTH,
      UI_ELEMENTS.STEPS_CARD.HEIGHT,
      UI_ELEMENTS.STEPS_CARD.RADIUS,
      COLORS.STEPS_STROKE,
      COLORS.STEPS_BG
    );
    drawCard(
      this.ctx,
      targetX,
      targetY,
      UI_ELEMENTS.TARGET_CARD.WIDTH,
      UI_ELEMENTS.TARGET_CARD.HEIGHT,
      UI_ELEMENTS.TARGET_CARD.RADIUS,
      COLORS.TARGET_STROKE,
      COLORS.TARGET_BG
    );

    drawImageInCell(
      this.ctx,
      this.images[orderProduct],
      targetX,
      targetY,
      CELL_CONFIG.WIDTH,
      UI_ELEMENTS.TARGET_CARD.HEIGHT,
      10
    );

    this.ctx.fillStyle = COLORS.STEPS_TEXT;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.font = UI_ELEMENTS.TARGET_CARD.FONT;
    this.ctx.fillText(
      `${score}/${targetItemsCount}`,
      targetX + UI_ELEMENTS.TARGET_CARD.WIDTH / 2 + 22,
      targetY + UI_ELEMENTS.TARGET_CARD.HEIGHT / 2
    );
    this.ctx.font = UI_ELEMENTS.STEPS_CARD.FONT;
    this.ctx.fillText(
      `Шаги ${currentStep}/${stepsCount}`,
      stepsX + UI_ELEMENTS.STEPS_CARD.WIDTH / 2,
      targetY + UI_ELEMENTS.STEPS_CARD.HEIGHT / 2
    );
    this.ctx.restore();
  }

  drawBody(orderProduct, score, targetItemsCount, currentStep, stepsCount) {
    const { width, height } = this.dims;
    const scaledHeaderHeight = LAYOUT.HEADER_HEIGHT * this.scale;
    this.ctx.fillStyle = COLORS.BODY_BG;
    this.ctx.fillRect(
      0,
      scaledHeaderHeight,
      width,
      height - scaledHeaderHeight
    );
    this.drawCounters(
      orderProduct,
      score,
      targetItemsCount,
      currentStep,
      stepsCount
    );
  }

  drawGridZone(grid, selected) {
    this.ctx.save();
    this.ctx.translate(this.offset.x, this.offset.y);
    this.ctx.scale(this.scale, this.scale);
    this.ctx.fillStyle = COLORS.GRID_ZONE_BG;
    this.ctx.strokeStyle = COLORS.GRID_ZONE_STROKE;
    this.ctx.lineWidth = 1;
    drawRoundedPlus(
      this.ctx,
      LAYOUT.GRID_ZONE_PADDING_LEFT,
      LAYOUT.HEADER_HEIGHT + LAYOUT.GRID_ZONE_PADDING_TOP,
      LAYOUT.GRID_ZONE_WIDTH,
      LAYOUT.GRID_ZONE_HEIGHT,
      LAYOUT.GRID_ZONE_ARM_THICKNESS,
      LAYOUT.GRID_ZONE_RADIUS
    );
    this.ctx.fill();
    this.ctx.stroke();
    this.drawGrid(grid, selected);
    this.ctx.restore();
  }

  drawCell(cell, selected) {
    const base = this.getCoords(cell);
    const x0 = cell._animX ?? base.x,
      y0 = cell._animY ?? base.y;
    let cellW = CELL_CONFIG.WIDTH,
      cellH = CELL_CONFIG.HEIGHT;
    let posX = x0,
      posY = y0,
      alpha = 1,
      scaleFactor = 1;

    if (selected) {
      scaleFactor = 1.06;
      cellW *= scaleFactor;
      cellH *= scaleFactor;
      posX -= (cellW - CELL_CONFIG.WIDTH) / 2;
      posY -= (cellH - CELL_CONFIG.HEIGHT) / 2;
    }

    if (cell._removalProgress != null) {
      const p = cell._removalProgress,
        scale = 1 - p;
      cellW *= scale;
      cellH *= scale;
      posX = x0 + (CELL_CONFIG.WIDTH - cellW) / 2;
      posY = y0 + (CELL_CONFIG.HEIGHT - cellH) / 2;
      alpha = 1 - p;
    }

    this.ctx.save();
    this.ctx.globalAlpha = alpha;
    drawCard(
      this.ctx,
      posX,
      posY,
      cellW,
      cellH,
      CELL_CONFIG.RADIUS,
      COLORS.CELL_STROKE,
      COLORS.CELL_BG,
      2 * scaleFactor + 1.3 * (scaleFactor !== 1)
    );
    drawImageInCell(
      this.ctx,
      this.images[cell.type],
      posX,
      posY,
      cellW,
      cellH,
      CELL_CONFIG.PADDING,
      scaleFactor
    );
    this.ctx.restore();
  }

  drawGrid(grid, selectedPos) {
    for (const row of grid.cells) {
      for (const cell of row) {
        if (!cell || cell.isDeleted) continue;
        const isSelected =
          selectedPos &&
          cell.row === selectedPos.row &&
          cell.col === selectedPos.col;
        this.drawCell(cell, isSelected);
      }
    }
  }

  drawScene(grid, state) {
    const dpr = window.devicePixelRatio || 1;
    this.ctx.save();
    this.ctx.scale(dpr, dpr);
    this.ctx.clearRect(0, 0, this.dims.width, this.dims.height);
    this.drawHeader(state.orderProduct, state.targetItemsCount);
    this.drawBody(
      state.orderProduct,
      state.score,
      state.targetItemsCount,
      state.currentStep,
      state.stepsCount
    );
    this.drawGridZone(grid, state.selected);
    this.ctx.restore();
  }

  drawTutorial(state) {
    const { ctx, scale, offset, dims, images } = this;
    const { tutorialState, tutorialMove, tutorialHand, selectedCell, grid } =
      state;
    const popupData = TUTORIAL_CONFIG.TEXTS[tutorialState];
    if (!popupData) return;

    const dpr = window.devicePixelRatio || 1;
    this.ctx.save();
    this.ctx.scale(dpr, dpr);

    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.scale(scale, scale);

    if (popupData.isModal || popupData.spotlight) {
      ctx.fillStyle = TUTORIAL_CONFIG.MODAL_BG;
      ctx.fillRect(
        -offset.x / scale,
        -offset.y / scale,
        dims.width / scale,
        dims.height / scale
      );
    }

    if (popupData.spotlight && tutorialMove) {
      tutorialMove.spotlightCells.forEach((pos) => {
        const cell = grid.cells[pos.row][pos.col];
        if (cell)
          this.drawCell(
            cell,
            selectedCell?.row === pos.row && selectedCell?.col === pos.col
          );
      });
    }

    const layout = popupData.layout;
    if (layout) {
      ctx.fillStyle = TUTORIAL_CONFIG.POPUP.BG;
      roundRect(
        ctx,
        layout.popupX,
        layout.popupY,
        layout.popupWidth,
        layout.popupHeight,
        TUTORIAL_CONFIG.POPUP.RADIUS
      );
      ctx.fill();

      ctx.fillStyle = TUTORIAL_CONFIG.POPUP.TEXT_COLOR;
      ctx.font = TUTORIAL_CONFIG.POPUP.FONT;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      layout.lines.forEach((line, i) =>
        ctx.fillText(
          line,
          layout.textCenterX,
          layout.textStartY + i * TUTORIAL_CONFIG.POPUP.LINE_HEIGHT
        )
      );

      if (popupData.hasArrow && images.arrow)
        ctx.drawImage(images.arrow, layout.arrowX, layout.arrowY);

      if (popupData.buttonText) {
        ctx.fillStyle = TUTORIAL_CONFIG.BUTTON.BG;
        roundRect(
          ctx,
          layout.buttonX,
          layout.buttonY,
          TUTORIAL_CONFIG.BUTTON.WIDTH,
          TUTORIAL_CONFIG.BUTTON.HEIGHT,
          TUTORIAL_CONFIG.BUTTON.RADIUS
        );
        ctx.fill();
        ctx.fillStyle = TUTORIAL_CONFIG.BUTTON.TEXT_COLOR;
        ctx.font = TUTORIAL_CONFIG.BUTTON.FONT;
        ctx.textBaseline = "middle";
        ctx.fillText(
          popupData.buttonText,
          layout.buttonX + TUTORIAL_CONFIG.BUTTON.WIDTH / 2,
          layout.buttonY + TUTORIAL_CONFIG.BUTTON.HEIGHT / 2
        );
      }
    }

    if (popupData.highlightType) {
      const highlightImage =
        popupData.highlightType === "header"
          ? images.highlight
          : images.highlightCounter;
      if (highlightImage) {
        let targetX = 0,
          targetY = 0;
        if (popupData.highlightType === "header") {
          targetX =
            UI_ELEMENTS.HEADER_TARGET.X +
            UI_ELEMENTS.HEADER_TARGET.CARD_WIDTH / 2;
          targetY =
            UI_ELEMENTS.HEADER_TARGET.Y +
            UI_ELEMENTS.HEADER_TARGET.CARD_HEIGHT / 2;
        } else if (popupData.highlightType === "targetCounter") {
          targetX =
            LAYOUT.COUNTERS_PADDING_LEFT + UI_ELEMENTS.TARGET_CARD.WIDTH / 2;
          targetY =
            LAYOUT.HEADER_HEIGHT +
            LAYOUT.COUNTERS_PADDING_TOP +
            UI_ELEMENTS.TARGET_CARD.HEIGHT / 2;
        } else if (popupData.highlightType === "stepsCounter") {
          targetX =
            LAYOUT.COUNTERS_PADDING_LEFT +
            UI_ELEMENTS.TARGET_CARD.WIDTH +
            LAYOUT.COUNTERS_GAP +
            UI_ELEMENTS.STEPS_CARD.WIDTH / 2;
          targetY =
            LAYOUT.HEADER_HEIGHT +
            LAYOUT.COUNTERS_PADDING_TOP +
            UI_ELEMENTS.STEPS_CARD.HEIGHT / 2;
        }

        ctx.drawImage(
          highlightImage,
          targetX - highlightImage.width / 2,
          targetY - highlightImage.height / 2
        );
      }
    }

    if (tutorialHand.visible && images.hand) {
      ctx.save();
      ctx.translate(tutorialHand.x, tutorialHand.y);
      ctx.scale(tutorialHand.scale, tutorialHand.scale);
      ctx.drawImage(
        images.hand,
        -15,
        -10,
        images.hand.width * 0.9,
        images.hand.height * 0.9
      );
      ctx.restore();
    }

    ctx.restore();
    ctx.restore();
  }
}
