const loadImage = (src) =>
  new Promise((resolve) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = (e) => {
      console.error("Failed to load image:", src, e);
      resolve(null);
    };
  });

const openCellEaseInOut = (t) => t;

const roundRect = (ctx, x, y, width, height, radius) => {
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
};

const drawGroundCell = (
  ctx,
  x,
  y,
  size,
  gap,
  radius,
  hasUp,
  hasRight,
  hasDown,
  hasLeft,
  hasUpLeft,
  hasUpRight,
  hasDownRight,
  hasDownLeft
) => {
  size += gap * 3.5;
  const inner = size - gap * 2.5;
  const rtl = !((hasUp && hasLeft) || hasLeft || hasUp);
  const rtr = !((hasUp && hasRight) || hasRight || hasUp);
  const rbr = !((hasDown && hasRight) || hasRight || hasDown);
  const rbl = !((hasDown && hasLeft) || hasLeft || hasDown);
  if (rtl) {
    ctx.moveTo(x + radius, y);
  } else {
    ctx.moveTo(x, y);
  }

  if (rtr) {
    ctx.lineTo(x + size - radius, y);
    ctx.arcTo(x + size, y, x + size, y + radius, radius);
  }

  if (hasUpRight && !hasUp) {
    ctx.lineTo(x + inner - radius, y);
    ctx.arcTo(x + inner, y, x + inner, y - radius, radius);
  } else {
    ctx.lineTo(x + size, y);
  }

  if (rbr) {
    ctx.lineTo(x + size, y + size - radius);
    ctx.arcTo(x + size, y + size, x + size - radius, y + size, radius);
  } else {
    ctx.lineTo(x + size, y + size);
  }

  if (hasDownRight && !hasRight) {
    ctx.lineTo(x + size, y + size - radius);
    ctx.arcTo(x + size, y + inner, x + size + radius, y + inner, radius);
  } else {
    ctx.lineTo(x + size, y + size);
  }

  if (rbl) {
    ctx.lineTo(x + radius, y + size);
    ctx.arcTo(x, y + size, x, y + size - radius, radius);
  }

  if (hasDownLeft && !hasDown) {
    ctx.lineTo(x + size - inner + radius, y + size);
    ctx.arcTo(
      x + size - inner,
      y + size,
      x + size - inner,
      y + size + radius,
      radius
    );
  } else {
    ctx.lineTo(x, y + size);
  }

  if (rtl) {
    ctx.lineTo(x, y + radius);
    ctx.arcTo(x, y, x + radius, y, radius);
  }

  if (hasUpLeft && !hasLeft) {
    ctx.lineTo(x, y + size - inner + radius);
    ctx.arcTo(x, y + size - inner, x - radius, y + size - inner, radius);
  } else {
    ctx.lineTo(x, y);
  }
};

const drawGroundGrid = (
  ctx,
  x0,
  y0,
  groundGrid,
  cellSize,
  gap,
  radius,
  fillColor
) => {
  if (!groundGrid || !groundGrid.length || !groundGrid[0].length) {
    console.error("drawGroundGrid: сетка не задана!");
    return;
  }

  const rows = groundGrid.length;
  const cols = groundGrid[0].length;
  const step = cellSize + gap;
  ctx.save();
  ctx.lineJoin = "round";
  ctx.fillStyle = fillColor;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!groundGrid[r][c]) continue;
      ctx.beginPath();
      const x = x0 + c * step;
      const y = y0 + r * step;
      const up = groundGrid[r - 1]?.[c] ?? false;
      const right = groundGrid[r]?.[c + 1] ?? false;
      const down = groundGrid[r + 1]?.[c] ?? false;
      const left = groundGrid[r]?.[c - 1] ?? false;
      const upLeft = groundGrid[r - 1]?.[c - 1] ?? false;
      const upRight = groundGrid[r - 1]?.[c + 1] ?? false;
      const downRight = groundGrid[r + 1]?.[c + 1] ?? false;
      const downLeft = groundGrid[r + 1]?.[c - 1] ?? false;
      drawGroundCell(
        ctx,
        x,
        y,
        cellSize,
        gap,
        radius,
        up,
        right,
        down,
        left,
        upLeft,
        upRight,
        downRight,
        downLeft
      );
      ctx.closePath();
      ctx.fill();
    }
  }

  ctx.restore();
};

const drawCard = (ctx, x, y, width, height, radius, strokeColor, fillColor) => {
  ctx.fillStyle = fillColor;
  ctx.strokeStyle = strokeColor;
  roundRect(ctx, x, y, width, height, radius);
  ctx.stroke();
  ctx.fill();
};

const drawImageInCell = (
  ctx,
  image,
  drawX,
  drawY,
  cellW,
  cellH,
  cellPadding
) => {
  const availableWidth = cellW - 2 * cellPadding;
  const availableHeight = cellH - 2 * cellPadding;
  const scale = Math.min(
    availableWidth / image.naturalWidth,
    availableHeight / image.naturalHeight,
    1
  );
  const drawWidth = image.naturalWidth * scale;
  const drawHeight = image.naturalHeight * scale;
  const offsetX = (availableWidth - drawWidth) / 2;
  const offsetY = (availableHeight - drawHeight) / 2;
  ctx.drawImage(
    image,
    drawX + cellPadding + offsetX,
    drawY + cellPadding + offsetY,
    drawWidth,
    drawHeight
  );
};

const wrapText = (ctx, text, maxWidth) => {
  const words = text.split(" ");
  const lines = [];
  let currentLine = words[0] || "";
  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const testLine = currentLine + " " + word;
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && i > 0) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }

  lines.push(currentLine);
  return lines;
};

export {
  loadImage,
  openCellEaseInOut,
  roundRect,
  drawGroundCell,
  drawGroundGrid,
  drawCard,
  drawImageInCell,
  wrapText,
};
