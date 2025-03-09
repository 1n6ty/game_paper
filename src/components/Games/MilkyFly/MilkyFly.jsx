import React, { useState, useEffect, useRef } from 'react';
import GameOver from '../../GameOver/GameOver';
import './MilkyFly.css';

// Пути до ассетов в папке public
const pipeDefaultUrl = '/games/milkyFly/pipeDefault.svg';
const pipeSpecialUrl = '/games/milkyFly/pipeSpecial.svg';

const cloudsUrl = '/games/milkyFly/clouds.svg';
const bushesDarkUrl = '/games/milkyFly/bushesDark.svg';
const bushesLightUrl = '/games/milkyFly/bushesLight.svg';

const grassUrl = '/games/milkyFly/grass.svg';

const cowIdle = '/games/milkyFly/cowIdle.svg';
const cowPressed = '/games/milkyFly/cowPressed.svg';

const MilkyFly = () => {
  // ====== Константы для "виртуальной" логики ======
  const BASE_WIDTH = 428; // Исходная ширина для расчётов
  const BASE_HEIGHT = 809; // Исходная высота для расчётов

  // ====== Параметры игры ======
  const INITIAL_SPEED = 2;                // Начальная скорость
  const SPEED_MULTIPLIER = 1.2;           // Увеличение скорости каждые 10 труб
  const PARALLAX_CLOUDS = 0;
  const PARALLAX_BUSHES_DARK = 0;
  const PARALLAX_BUSHES_LIGHT = 0;
  const PARALLAX_GRASS = 0.8;
  const FALL_ANGLE = 30;                  // Угол наклона при падении
  const GRAVITY = 0.5;
  const JUMP_FORCE = -8;

  const PIPE_GAP = 150;
  const PIPE_WIDTH = 66;
  const PIPE_INTERVAL = 120;
  const FLOOR_HEIGHT = 140;

  // Ограничения для случайного появления труб
  const MIN_TOP = FLOOR_HEIGHT + 20;  // трубы не будут появляться слишком низко
  const MAX_TOP = 500;                // и не слишком высоко

  // Массив градиентов: каждый — массив из 3-х цветов (верх, середина, низ)
  const GRADIENTS = [
    ["#67AAEB", "#D3E8FF", "#FFFFFF"],
    ["#67AAEB", "#F7CDCE", "#FFFFFF"],
    ["#97A0FF", "#D1E8FF", "#FFFFFF"],
    ["#A1D1FF", "#D1E8FF", "#FFFFFF"],
    ["#AED7FF", "#FEFEFF", "#FFFFFF"],
  ];

  // ====== React-состояния ======
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  // Ссылка на canvas и id анимации
  const canvasRef = useRef(null);
  const animationIdRef = useRef();

  // Объект для кэширования загруженных изображений
  const imagesRef = useRef({});

  // Основное состояние игры (в "виртуальных" координатах)
  const gameStateRef = useRef({
    speed: INITIAL_SPEED,
    frame: 0,
    pipes: [],
    // Позиции параллакса
    cloudsX: 0,
    bushesDarkX: 0,
    bushesLightX: 0,
    grassX: 0,
    // Состояние "птицы" (коровы)
    bird: {
      x: 50,
      y: 150,
      velocity: 0,
      frameCounter: 0,
      currentFrame: 0,
      rotation: 0,
    },
    // Рандомный фон
    selectedGradient: GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)],
    // Счётчик труб (для определения особой трубы)
    pipeCount: 0,
    // Флаг остановки игры
    isGameOver: false,
  });

  // Функция предзагрузки одного изображения
  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve(img);
      img.onerror = reject;
    });
  };

  // Предзагрузка ассетов
  const preloadAssets = async () => {
    const assets = {
      clouds: loadImage(cloudsUrl),
      bushesDark: loadImage(bushesDarkUrl),
      bushesLight: loadImage(bushesLightUrl),
      grass: loadImage(grassUrl),
      pipeDefault: loadImage(pipeDefaultUrl),
      pipeSpecial: loadImage(pipeSpecialUrl),
      cowIdle: loadImage(cowIdle),
      cowPressed: loadImage(cowPressed),
    };
    const loaded = await Promise.all(Object.values(assets));
    const keys = Object.keys(assets);
    keys.forEach((key, idx) => {
      imagesRef.current[key] = loaded[idx];
    });
  };

  // Инициализация при монтировании
  useEffect(() => {
    const storedBest = parseInt(localStorage.getItem('bestScore'), 10) || 0;
    setBestScore(storedBest);

    preloadAssets().then(() => {
      resetGame();
      requestAnimationFrame(gameLoop);
    });

    // Слушатели для прыжка (Space/touch)
    const handleJump = (e) => {
      if (e.type === 'keydown' && e.code !== 'Space') return;
      const st = gameStateRef.current;
      if (!st.isGameOver) {
        st.bird.velocity = JUMP_FORCE;
        st.bird.frameCounter = 0;
      }
    };
    window.addEventListener('keydown', handleJump);
    window.addEventListener('touchstart', handleJump);

    return () => {
      window.removeEventListener('keydown', handleJump);
      window.removeEventListener('touchstart', handleJump);
      cancelAnimationFrame(animationIdRef.current);
    };
  }, []);

  // Сброс игры
  const resetGame = () => {
    setGameOver(false);
    setScore(0);
    const st = gameStateRef.current;
    st.speed = INITIAL_SPEED;
    st.frame = 0;
    st.pipes = [];
    st.cloudsX = 0;
    st.bushesDarkX = 0;
    st.bushesLightX = 0;
    st.grassX = 0;
    st.bird = {
      x: 50,
      y: 150,
      velocity: 0,
      frameCounter: 0,
      currentFrame: 0,
      rotation: 0,
    };
    st.selectedGradient = GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)];
    st.pipeCount = 0;
    st.isGameOver = false;
  };

  // Адаптивный размер canvas
  useEffect(() => {
    function resizeCanvas() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const parent = canvas.parentElement;
      if (!parent) return;
      const parentWidth = parent.clientWidth;
      const aspect = BASE_HEIGHT / BASE_WIDTH;
      const newHeight = Math.floor(parentWidth * aspect);
      canvas.width = parentWidth;
      canvas.height = newHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  // Основной игровой цикл
  const gameLoop = () => {
    const st = gameStateRef.current;
    if (st.isGameOver) return; // Прерываем цикл, если игра остановлена

    updateLogic();
    drawScene();
    animationIdRef.current = requestAnimationFrame(gameLoop);
  };

  // Обновление логики игры
  const updateLogic = () => {
    const st = gameStateRef.current;
    st.frame++;

    // Позиции параллакса
    st.cloudsX -= st.speed * PARALLAX_CLOUDS;
    st.bushesDarkX -= st.speed * PARALLAX_BUSHES_DARK;
    st.bushesLightX -= st.speed * PARALLAX_BUSHES_LIGHT;
    st.grassX -= st.speed * PARALLAX_GRASS;

    if (st.cloudsX <= -BASE_WIDTH) st.cloudsX += BASE_WIDTH;
    if (st.bushesDarkX <= -BASE_WIDTH) st.bushesDarkX += BASE_WIDTH;
    if (st.bushesLightX <= -BASE_WIDTH) st.bushesLightX += BASE_WIDTH;
    if (st.grassX <= -BASE_WIDTH) st.grassX += BASE_WIDTH;

    // Физика птицы (коровы)
    st.bird.velocity += GRAVITY;
    st.bird.y += st.bird.velocity;
    if (st.bird.velocity > 0) {
      st.bird.rotation = Math.min(FALL_ANGLE, st.bird.rotation + 2);
    } else {
      st.bird.rotation = -15;
    }

    // Анимация спрайтов
    st.bird.frameCounter++;
    const frameDelay = st.bird.velocity > 2 ? 3 : 5;
    if (st.bird.frameCounter >= frameDelay) {
      st.bird.currentFrame = (st.bird.currentFrame + 1) % 2;
      st.bird.frameCounter = 0;
    }

    // Генерация труб
    if (st.frame % PIPE_INTERVAL === 0) {
      st.pipeCount++;
      const topHeight = Math.floor(Math.random() * (MAX_TOP - MIN_TOP)) + MIN_TOP;
      st.pipes.push({
        x: BASE_WIDTH,
        top: topHeight,
        bottom: topHeight + PIPE_GAP,
        width: PIPE_WIDTH,
        special: (st.pipeCount % 10 === 0),
        passed: false,
      });
    }

    // Движение труб и увеличение счета
    for (let pipe of st.pipes) {
      pipe.x -= st.speed;
      if (!pipe.passed && pipe.x + PIPE_WIDTH < st.bird.x) {
        pipe.passed = true;
        setScore(prev => prev + 1);
        if ((score + 1) % 10 === 0) {
          st.speed *= SPEED_MULTIPLIER;
        }
      }
    }
    st.pipes = st.pipes.filter(pipe => pipe.x + pipe.width > 0);

    // Проверка столкновений с трубами
    for (let pipe of st.pipes) {
      if (
        st.bird.x + 20 > pipe.x &&
        st.bird.x - 20 < pipe.x + pipe.width &&
        (st.bird.y - 20 < pipe.top || st.bird.y + 20 > pipe.bottom)
      ) {
        handleGameOver();
        return;
      }
    }
    // Проверка столкновений с верхней/нижней границей
    if (st.bird.y - 40 < 0 || st.bird.y + 40 > BASE_HEIGHT - FLOOR_HEIGHT) {
      handleGameOver();
      return;
    }
  };

  // Остановка игры
  const handleGameOver = () => {
    const st = gameStateRef.current;
    st.isGameOver = true;
    setGameOver(true);
    cancelAnimationFrame(animationIdRef.current);
  };

  // Рендер сцены
  const drawScene = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Масштабируем по реальным размерам (сохраняя пропорции)
    const scaleX = canvas.width / BASE_WIDTH;
    const scaleY = canvas.height / BASE_HEIGHT;
    ctx.save();
    ctx.scale(scaleX, scaleY);

    const st = gameStateRef.current;
    ctx.clearRect(0, 0, BASE_WIDTH, BASE_HEIGHT);

    // Рисуем фон как градиент
    const gradient = ctx.createLinearGradient(0, 0, 0, BASE_HEIGHT);
    gradient.addColorStop(0, st.selectedGradient[0]);
    gradient.addColorStop(0.5, st.selectedGradient[1]);
    gradient.addColorStop(1, st.selectedGradient[2]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, BASE_WIDTH, BASE_HEIGHT);

    // Рисуем параллакс-слои (облака, кусты)
    if (imagesRef.current.clouds) {
      ctx.drawImage(imagesRef.current.clouds, st.cloudsX, BASE_HEIGHT - FLOOR_HEIGHT - 237, BASE_WIDTH, 387);
      ctx.drawImage(imagesRef.current.clouds, st.cloudsX + BASE_WIDTH - 1, BASE_HEIGHT - FLOOR_HEIGHT - 237, BASE_WIDTH, 387);
    }
    if (imagesRef.current.bushesDark) {
      ctx.drawImage(imagesRef.current.bushesDark, st.bushesDarkX, BASE_HEIGHT - FLOOR_HEIGHT - 78, BASE_WIDTH, 228);
      ctx.drawImage(imagesRef.current.bushesDark, st.bushesDarkX + BASE_WIDTH - 1, BASE_HEIGHT - FLOOR_HEIGHT - 78, BASE_WIDTH, 228);
    }
    if (imagesRef.current.bushesLight) {
      ctx.drawImage(imagesRef.current.bushesLight, st.bushesLightX, BASE_HEIGHT - FLOOR_HEIGHT - 52, BASE_WIDTH, 202);
      ctx.drawImage(imagesRef.current.bushesLight, st.bushesLightX + BASE_WIDTH - 1, BASE_HEIGHT - FLOOR_HEIGHT - 52, BASE_WIDTH, 202);
    }

    // Рисуем трубы без изменения их высоты – просто смещаем по вертикали:
    for (let pipe of st.pipes) {
      const pipeImg = pipe.special ? imagesRef.current.pipeSpecial : imagesRef.current.pipeDefault;
      if (!pipeImg) continue;
      // Вычисляем естественную высоту трубы при масштабировании до PIPE_WIDTH,
      // сохраняя соотношение сторон изображения.
      const pipeH = PIPE_WIDTH * (pipeImg.naturalHeight / pipeImg.naturalWidth);
      // Верхняя труба: переводим координаты так, чтобы нижний край трубы совпадал с pipe.top
      ctx.save();
      ctx.translate(pipe.x, pipe.top);
      ctx.scale(1, -1);
      // Рисуем верхнюю трубу с высотой pipeH (без масштабирования до pipe.top)
      ctx.drawImage(pipeImg, 0, -pipeH, pipe.width, pipeH);
      ctx.restore();

      // Нижняя труба: рисуем так, чтобы верхний край совпадал с pipe.bottom
      ctx.drawImage(pipeImg, pipe.x, pipe.bottom, pipe.width, pipeH);
    }

    // Рисуем пол (движущаяся трава)
    if (imagesRef.current.grass) {
      ctx.drawImage(imagesRef.current.grass, st.grassX, BASE_HEIGHT - FLOOR_HEIGHT, BASE_WIDTH, 30);
      ctx.drawImage(imagesRef.current.grass, st.grassX + BASE_WIDTH - 1, BASE_HEIGHT - FLOOR_HEIGHT, BASE_WIDTH, 30);
    }

    // Рисуем птицу (корова) с поворотом
    ctx.save();
    ctx.translate(st.bird.x, st.bird.y);
    ctx.rotate((st.bird.rotation * Math.PI) / 180);
    const birdImg = st.bird.currentFrame === 0 ? imagesRef.current.cowIdle : imagesRef.current.cowPressed;
    if (birdImg) {
      // Чтобы изменить размеры персонажа, измените аргументы: здесь (-50, -40, 100, 80)
      ctx.drawImage(birdImg, -50, -40, 100, 80);
    }
    ctx.restore();

    ctx.restore();
  };

  // Обработчики кнопок GameOver
  const handleRestart = () => {
    resetGame();
    requestAnimationFrame(gameLoop);
  };
  const handleExit = () => {
    window.location.reload();
  };

  return (
    <div className="game-container">
      <div className="best-score">лучший результат: {bestScore}</div>
      <div className="current-score">{score}</div>
      <canvas ref={canvasRef} className="game-canvas" />
      {gameOver && (
        <GameOver
          score={score}
          onRestart={handleRestart}
          onExit={handleExit}
        />
      )}
    </div>
  );
};

export default MilkyFly;
