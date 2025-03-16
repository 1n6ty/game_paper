import React, { useEffect, useRef, useState } from 'react';

// ======================
// Константы размеров и стилей
// ======================
const CANVAS_WIDTH = 375;
const CANVAS_HEIGHT = 812;

const TITLE_CARD_HEIGHT = 80;
const TRACKER_CARD_HEIGHT = 60;
const MARGIN_BETWEEN_CARDS = 20;
const GLASS_BOTTOM_MARGIN = 50;

const GLASS_WIDTH = 200;
const GLASS_HEIGHT = 300;

const TITLE_FONT = "700 20px Roboto";
const INSTRUCTION_FONT_BOLD = "700 16px Roboto";
const INSTRUCTION_FONT_REGULAR = "600 16px Roboto";

const DAY_NOT_FILLED_BORDER_COLOR = "#9FBACF";
const DAY_NOT_FILLED_TEXT_COLOR = "#9FBACF";
const DAY_FILLED_COLOR = "#9AD99D";
const DAY_FILLED_TEXT_COLOR = "#FFFFFF";

const INDICATOR_SIZE = 30;
const INDICATOR_MARGIN = 10;

const TEST_MODE = false;

// Ключи для сохранения в localStorage
const STORAGE_KEY_LEVEL = 'healthTrackerCurrentLevel';
const STORAGE_KEY_LAST_CLICK = 'healthTrackerLastClick';

// ======================
// Основной компонент
// ======================
const HealthTracker = () => {
  const canvasRef = useRef(null);
  const imagesRef = useRef({});

  // Состояния: текущий уровень (0..7), время последнего клика, сообщения
  const [currentLevel, setCurrentLevel] = useState(0);
  const [lastClick, setLastClick] = useState(null);
  const [timerMessage, setTimerMessage] = useState('');
  const [showTicketMessage, setShowTicketMessage] = useState(false);

  // Загрузка локальных изображений
  useEffect(() => {
    const assets = {
      background: require('./assets/background.png'),
      glass: require('./assets/glass.png'),
      fill: require('./assets/fill.svg'),
      decoration: require('./assets/decoration.png'),
    };

    const loadImages = async () => {
      const keys = Object.keys(assets);
      const loaded = await Promise.all(
        keys.map(key => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = assets[key];
            img.onload = () => resolve(img);
            img.onerror = reject;
          });
        })
      );
      keys.forEach((key, idx) => {
        imagesRef.current[key] = loaded[idx];
      });
      drawCanvas(); // Первоначальная отрисовка после загрузки картинок
    };
    loadImages();

    // Загрузка сохранённого прогресса из localStorage
    const savedLevel = parseInt(localStorage.getItem(STORAGE_KEY_LEVEL)) || 0;
    const savedLastClick = parseInt(localStorage.getItem(STORAGE_KEY_LAST_CLICK)) || null;
    setCurrentLevel(savedLevel);
    setLastClick(savedLastClick);
  }, []);

  // Перерисовка canvas при изменении прогресса или времени последнего клика
  useEffect(() => {
    drawCanvas();
    localStorage.setItem(STORAGE_KEY_LEVEL, currentLevel);
  }, [currentLevel, lastClick]);

  // ======================
  // Функции отрисовки
  // ======================

  // Основная функция отрисовки всего Canvas
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Очистка canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Фон: рисуем фоновое изображение или заливаем цветом
    if (imagesRef.current.background) {
      ctx.drawImage(imagesRef.current.background, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    } else {
      ctx.fillStyle = '#F7FAFD';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }

    // Отрисовка карточки заголовка с инструкцией
    drawTitleCard(ctx);

    // Отрисовка карточки с трекером дней
    drawTrackerCard(ctx);

    // Отрисовка стакана: сначала заливка с градиентом, затем декоративное изображение, затем сам стакан
    drawGlass(ctx);

    // Если есть сообщение с таймером, отрисовать его
    if (timerMessage) {
      drawTimerMessage(ctx, timerMessage);
    }

    // Если нужно, отрисовать сообщение о получении билета
    if (showTicketMessage) {
      drawTicketMessage(ctx, "Поздравляем, вы получили билет!");
    }
  };

  // Отрисовка карточки заголовка с инструкцией
  const drawTitleCard = (ctx) => {
    const cardX = 10;
    const cardY = 10;
    const cardWidth = CANVAS_WIDTH - 20;
    const cardHeight = TITLE_CARD_HEIGHT;

    // Фон карточки (белый)
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(cardX, cardY, cardWidth, cardHeight);

    // Текст заголовка
    ctx.font = TITLE_FONT;
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    ctx.fillText("Трекер здоровья", cardX + cardWidth / 2, cardY + 30);

    // Текст инструкции. Первая фраза - жирным шрифтом.
    const instruction = "Наполняй бутылку молоком каждый день! Не забывай нажимать на неё — только так она будет заполняться. Пропустишь день, и бутылка опустеет. Заполни её за 7 дней подряд и получи билет!";
    const boldPart = "Наполняй бутылку молоком каждый день!";

    // Рисуем жирную часть
    ctx.font = INSTRUCTION_FONT_BOLD;
    ctx.fillText(boldPart, cardX + cardWidth / 2, cardY + 55);

    // Остальной текст
    ctx.font = INSTRUCTION_FONT_REGULAR;
    const restText = instruction.replace(boldPart, "").trim();
    ctx.fillText(restText, cardX + cardWidth / 2, cardY + 75);
  };

  // Отрисовка карточки с трекером дней (7 индикаторов)
  const drawTrackerCard = (ctx) => {
    const cardX = 10;
    // Располагаем карточку чуть ниже заголовка с отступом
    const cardY = TITLE_CARD_HEIGHT + MARGIN_BETWEEN_CARDS + 10;
    const cardWidth = CANVAS_WIDTH - 20;
    const cardHeight = TRACKER_CARD_HEIGHT;

    // Фон карточки
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(cardX, cardY, cardWidth, cardHeight);

    // Вычисляем позицию для 7 индикаторов, выравненных по центру
    const totalWidth = 7 * INDICATOR_SIZE + 6 * INDICATOR_MARGIN;
    let startX = cardX + (cardWidth - totalWidth) / 2;
    const centerY = cardY + cardHeight / 2;

    for (let i = 0; i < 7; i++) {
      const x = startX + i * (INDICATOR_SIZE + INDICATOR_MARGIN);
      ctx.beginPath();
      ctx.arc(x + INDICATOR_SIZE / 2, centerY, INDICATOR_SIZE / 2, 0, Math.PI * 2);
      // Если день заполнен (i < currentLevel)
      if (i < currentLevel) {
        ctx.fillStyle = DAY_FILLED_COLOR;
        ctx.strokeStyle = DAY_FILLED_COLOR;
        ctx.fill();
        ctx.fillStyle = DAY_FILLED_TEXT_COLOR;
      } else {
        ctx.fillStyle = "#FFFFFF";
        ctx.strokeStyle = DAY_NOT_FILLED_BORDER_COLOR;
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = DAY_NOT_FILLED_TEXT_COLOR;
      }
      ctx.font = "500 20px Roboto Mono";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(String(i + 1), x + INDICATOR_SIZE / 2, centerY);
    }
  };

  // Отрисовка стакана: заливка (с градиентом), декоративное изображение и сам стакан
  const drawGlass = (ctx) => {
    const glassX = (CANVAS_WIDTH - GLASS_WIDTH) / 2;
    const glassY = CANVAS_HEIGHT - GLASS_BOTTOM_MARGIN - GLASS_HEIGHT;

    // Определяем высоту заполнения на основе currentLevel
    const fillPercentage = currentLevel / 7;
    const fillHeight = GLASS_HEIGHT * fillPercentage;

    // Рисуем заливку с градиентом в пределах стакана
    if (imagesRef.current.fill) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(glassX, glassY, GLASS_WIDTH, GLASS_HEIGHT);
      ctx.clip();

      // Градиент от нижней части стакана к уровню заполнения
      let gradient = ctx.createLinearGradient(0, glassY + GLASS_HEIGHT, 0, glassY + GLASS_HEIGHT - fillHeight);
      gradient.addColorStop(0, '#FFFFFF');
      gradient.addColorStop(1, '#F0F0F0');
      ctx.fillStyle = gradient;
      ctx.fillRect(glassX, glassY + GLASS_HEIGHT - fillHeight, GLASS_WIDTH, fillHeight);

      // Вместо градиента использовать svg-заполнение:
      // ctx.drawImage(imagesRef.current.fill, glassX, glassY + GLASS_HEIGHT - fillHeight, GLASS_WIDTH, fillHeight);

      ctx.restore();
    }

    // Рисуем декоративное изображение поверх заливки (но под стаканом)
    if (imagesRef.current.decoration) {
      ctx.drawImage(imagesRef.current.decoration, glassX, glassY, GLASS_WIDTH, GLASS_HEIGHT);
    }

    // Рисуем сам стакан
    if (imagesRef.current.glass) {
      ctx.drawImage(imagesRef.current.glass, glassX, glassY, GLASS_WIDTH, GLASS_HEIGHT);
    }
  };

  // Отрисовка сообщения о том, сколько осталось ждать до следующего клика
  const drawTimerMessage = (ctx, message) => {
    ctx.save();
    ctx.font = "600 18px Roboto";
    ctx.fillStyle = "#FF0000";
    ctx.textAlign = "center";
    ctx.fillText(message, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    ctx.restore();
  };

  // Отрисовка сообщения о получении билета
  const drawTicketMessage = (ctx, message) => {
    ctx.save();
    ctx.font = "700 22px Roboto";
    ctx.fillStyle = "#00AA00";
    ctx.textAlign = "center";
    ctx.fillText(message, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 50);
    ctx.restore();
  };

  // ======================
  // Обработка кликов по Canvas
  // ======================
  const handleCanvasClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Проверяем, что клик пришёл по области стакана
    const glassX = (CANVAS_WIDTH - GLASS_WIDTH) / 2;
    const glassY = CANVAS_HEIGHT - GLASS_BOTTOM_MARGIN - GLASS_HEIGHT;
    if (clickX >= glassX && clickX <= glassX + GLASS_WIDTH &&
      clickY >= glassY && clickY <= glassY + GLASS_HEIGHT) {
      processGlassClick();
    }
  };

  // Логика обработки клика по стакану
  const processGlassClick = () => {
    const now = Date.now();
    const last = lastClick || 0;
    const hours24 = 24 * 60 * 60 * 1000;

    // Если TEST_MODE выключен и 24 часа ещё не прошли
    if (!TEST_MODE && now - last < hours24) {
      const remainingMs = hours24 - (now - last);
      const hours = Math.floor(remainingMs / (60 * 60 * 1000));
      const minutes = Math.floor((remainingMs % (60 * 60 * 1000)) / (60 * 1000));
      const seconds = Math.floor((remainingMs % (60 * 1000)) / 1000);
      setTimerMessage(`Подождите ${hours}ч ${minutes}м ${seconds}с`);

      // Если не нужен таймер, можно удалить данный блок
      setTimeout(() => {
        setTimerMessage('');
        drawCanvas();
      }, 3000);
      return;
    }

    // Если клик разрешён - обновляем время и уровень
    setLastClick(now);
    localStorage.setItem(STORAGE_KEY_LAST_CLICK, now);

    let newLevel = currentLevel + 1;
    if (newLevel >= 7) {
      // При достижении 7 дней подряд показываем сообщение о получении билета и сразу сбрасываем стакан
      setShowTicketMessage(true);
      drawCanvas();
      setTimeout(() => {
        setShowTicketMessage(false);
        setCurrentLevel(0);
        setLastClick(null);
        localStorage.removeItem(STORAGE_KEY_LEVEL);
        localStorage.removeItem(STORAGE_KEY_LAST_CLICK);
        drawCanvas();
      }, 3000);
    } else {
      setCurrentLevel(newLevel);
    }
  };

  // ======================
  // Рендер компонента: Canvas с обработчиком кликов
  // ======================
  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      onClick={handleCanvasClick}
      style={{ border: '1px solid #000' }}
    />
  );
};

export default HealthTracker;
