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

const roundRect = (ctx, x, y, width, height, radius) => {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
};

const drawRoundedPolygon = (ctx, points, radius) => {
  ctx.beginPath();
  const len = points.length;
  for (let i = 0; i < len; i++) {
    const prev = points[(i + len - 1) % len];
    const curr = points[i];
    const next = points[(i + 1) % len];
    const v1x = curr.x - prev.x,
      v1y = curr.y - prev.y,
      len1 = Math.hypot(v1x, v1y);
    const v2x = next.x - curr.x,
      v2y = next.y - curr.y,
      len2 = Math.hypot(v2x, v2y);
    const startX = curr.x - (v1x / len1) * radius,
      startY = curr.y - (v1y / len1) * radius;
    const endX = curr.x + (v2x / len2) * radius,
      endY = curr.y + (v2y / len2) * radius;
    if (i === 0) ctx.moveTo(startX, startY);
    else ctx.lineTo(startX, startY);
    ctx.arcTo(curr.x, curr.y, endX, endY, radius);
  }

  ctx.closePath();
};

const drawRoundedPlus = (ctx, x, y, width, height, armThickness, radius) => {
  const cx = x + width / 2,
    cy = y + height / 2,
    halfArm = armThickness / 2;
  const pts = [
    { x: cx - halfArm, y: y },
    { x: cx + halfArm, y: y },
    { x: cx + halfArm, y: cy - halfArm },
    { x: x + width, y: cy - halfArm },
    { x: x + width, y: cy + halfArm },
    { x: cx + halfArm, y: cy + halfArm },
    { x: cx + halfArm, y: y + height },
    { x: cx - halfArm, y: y + height },
    { x: cx - halfArm, y: cy + halfArm },
    { x: x, y: cy + halfArm },
    { x: x, y: cy - halfArm },
    { x: cx - halfArm, y: cy - halfArm },
  ];
  drawRoundedPolygon(ctx, pts, radius);
};

const measureAndWrapText = (ctx, text, maxWidth, lineHeight) => {
  const lines = [];
  text.split("\n").forEach((paragraph) => {
    let currentLine = "";
    const words = paragraph.split(" ");
    for (const word of words) {
      const testLine = currentLine.length > 0 ? `${currentLine} ${word}` : word;
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && currentLine.length > 0) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }

    lines.push(currentLine);
  });
  return { lines, height: lines.length * lineHeight };
};

const drawCard = (
  ctx,
  x,
  y,
  width,
  height,
  radius,
  strokeColor,
  fillColor,
  strokeWidth = 2
) => {
  ctx.fillStyle = fillColor;
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = strokeWidth;
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
  cellPadding,
  maxScale = 1
) => {
  if (!image) return;
  const availableWidth = cellW - 2 * cellPadding;
  const availableHeight = cellH - 2 * cellPadding;
  const scale = Math.min(
    availableWidth / image.naturalWidth,
    availableHeight / image.naturalHeight,
    maxScale
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

export {
  loadImage,
  roundRect,
  drawRoundedPolygon,
  drawRoundedPlus,
  measureAndWrapText,
  drawCard,
  drawImageInCell,
};
