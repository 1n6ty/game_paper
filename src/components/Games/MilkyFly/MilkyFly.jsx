import React, { useState, useEffect, useRef } from 'react';
import GameOver from '../../GameOver/GameOver';
import { GL_URL } from '../../../../global';
import './MilkyFly.css';

// Пути до ассетов в папке public
const ceilEvening = `${GL_URL}games/milkyFly/ceil_evening.svg`;   // Вечер
const ceilSunset = `${GL_URL}games/milkyFly/ceil_sunset.svg`;       // Закат
const ceilSunrise = `${GL_URL}games/milkyFly/ceil_sunrise.svg`;     // Рассвет
const ceilDay = `${GL_URL}games/milkyFly/ceil_day.svg`;             // День
const ceilMorning = `${GL_URL}games/milkyFly/ceil_morning.svg`;     // Утро

const pipeDefaultUrl = `${GL_URL}games/milkyFly/pipeDefault.svg`;
const pipeSpecialUrl = `${GL_URL}games/milkyFly/pipeSpecial.svg`;

const cloudsUrl = `${GL_URL}games/milkyFly/clouds.svg`;
const bushesDarkUrl = `${GL_URL}games/milkyFly/bushesDark.svg`;
const bushesLightUrl = `${GL_URL}games/milkyFly/bushesLight.svg`;

const grassUrl = `${GL_URL}games/milkyFly/grass.svg`;

const cowIdle = `${GL_URL}games/milkyFly/cowIdle.svg`;
const cowPressed = `${GL_URL}games/milkyFly/cowPressed.svg`;

const MAX_CANVAS_WIDTH = 428;            // максимальная ширина канваса
const BASE_ASPECT = 720 / 428;           // соотношение сторон (исходная высота / ширина)

const MilkyFly = () => {
  // ====== "Виртуальные" размеры (будут вычисляться динамически) ======
  // Изначально устанавливаем максимальный размер
  const [baseDimensions, setBaseDimensions] = useState({
    width: MAX_CANVAS_WIDTH,
    height: Math.floor(MAX_CANVAS_WIDTH * BASE_ASPECT),
  });

  // ====== Параметры игры ======
  const INITIAL_SPEED = 2.5;                // Начальная скорость
  const SPEED_MULTIPLIER = 1.2;           // Увеличение скорости каждые 10 труб
  const PARALLAX_CLOUDS = 0.01;
  const PARALLAX_BUSHES_DARK = 0.03;
  const PARALLAX_BUSHES_LIGHT = 0.08;
  const PARALLAX_GRASS = 1;
  const FALL_ANGLE = 90;                  // Угол наклона при падении
  const GRAVITY = 0.6;
  const JUMP_FORCE = -10;

  const PIPE_GAP = 150;
  const PIPE_WIDTH = 66;
  const PIPE_INTERVAL = 100;
  const FLOOR_HEIGHT = 36;

  // Ограничения для труб
  const MIN_TOP = 100;                      // трубы не появляются слишком высоко
  const MAX_TOP = baseDimensions.height / 2 + MIN_TOP; // и не слишком низко

  // Массив вариантов фона и потолка: [путь к потолку, [цвет, цвет, цвет]]
  const BACKGROUNDS = [
    ["ceilEvening", ["#67AAEB", "#D3E8FF", "#FFFFFF"]],  // Вечер
    ["ceilSunset", ["#67AAEB", "#F7CDCE", "#FFFFFF"]],    // Закат
    ["ceilSunrise", ["#97A0FF", "#D1E8FF", "#FFFFFF"]],    // Рассвет
    ["ceilDay", ["#A1D1FF", "#D1E8FF", "#FFFFFF"]],    // День
    ["ceilMorning", ["#AED7FF", "#D9ECFF", "#FEEEEF"]],     // Утро
  ];

  const START_X = baseDimensions.width / 2;
  const START_Y = baseDimensions.height / 2;

  // ====== React-состояния ======
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  const canvasRef = useRef(null);
  const animationIdRef = useRef();

  const imagesRef = useRef({});

  // Основное состояние игры (синхронно, в "виртуальных" координатах)

  const gameStateRef = useRef({
    speed: INITIAL_SPEED,
    frame: 0,
    pipes: [],
    cloudsX: 0,
    bushesDarkX: 0,
    bushesLightX: 0,
    grassX: 0,
    ceilX: 0,
    bird: {
      x: START_X,
      y: START_Y,
      velocity: 0,
      frameCounter: 0,
      currentFrame: 0,
      rotation: 0,
      floatOffset: 0,
    },
    // Выбор варианта фона и потолка (считаем, что для данного варианта используются оба ассета)
    selectedCeiling: BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)][0],
    selectedGradient: BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)][1],
    pipeCount: 0,
    passedPipes: 0,
    lastAccelerated: 0,
    isStarted: false,
    isGameOver: false,
  });

  const lastFrameRef = useRef(performance.now());

  // Функция предзагрузки изображения
  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve(img);
      img.onerror = reject;
    });
  };

  // Предзагрузка ассетов (включая потолочные)
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
      ceilEvening: loadImage(ceilEvening),
      ceilSunset: loadImage(ceilSunset),
      ceilSunrise: loadImage(ceilSunrise),
      ceilDay: loadImage(ceilDay),
      ceilMorning: loadImage(ceilMorning),
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
      // TODO решить проблему сброса игры при старте
      resetGame();
      requestAnimationFrame(gameLoop);
    });

    const handleJump = (e) => {
      if (e.type === 'keydown' && e.code !== 'Space') return;
      const st = gameStateRef.current;
      if (!st.isStarted) {
        st.isStarted = true;
        st.bird.velocity = JUMP_FORCE;
        return;
      }
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
    st.ceilX = 0;
    st.bird = {
      x: START_X,
      y: START_Y,
      velocity: 0,
      frameCounter: 0,
      currentFrame: 0,
      rotation: 0,
      floatOffset: 0,
    };
    // Выбираем новый вариант потолка и градиента
    const randIndex = Math.floor(Math.random() * BACKGROUNDS.length);
    st.selectedCeiling = BACKGROUNDS[randIndex][0];
    st.selectedGradient = BACKGROUNDS[randIndex][1];
    st.pipeCount = 0;
    st.passedPipes = 0;
    st.lastAccelerated = 0;
    st.isStarted = false;
    st.isGameOver = false;
  };

  // Адаптивный размер canvas с фиксированным максимумом (канвас не будет шире MAX_CANVAS_WIDTH)
  useEffect(() => {
    function resizeCanvas() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const parent = canvas.parentElement;
      if (!parent) return;
      const parentWidth = parent.clientWidth;
      const newWidth = Math.min(parentWidth, MAX_CANVAS_WIDTH);
      const aspect = baseDimensions.height / baseDimensions.width;
      const newHeight = Math.floor(newWidth * aspect);
      const dpr = window.devicePixelRatio || 1;
      canvas.width = newWidth * dpr;
      canvas.height = newHeight * dpr;
      canvas.style.width = `${newWidth}px`;
      canvas.style.height = `${newHeight}px`;
      console.log(`${canvas.width}, ${canvas.height}`);
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [baseDimensions]);

  // Основной игровой цикл с ограничением dt
  const gameLoop = () => {
    const now = performance.now();
    let dt = (now - lastFrameRef.current) / 1000;
    lastFrameRef.current = now;
    dt = Math.min(dt, 0.1); // ограничение dt

    const st = gameStateRef.current;
    if (st.isGameOver) return;

    updateLogic(dt);
    drawScene();
    animationIdRef.current = requestAnimationFrame(gameLoop);
  };

  // Обновление логики игры с учетом deltaTime
  const updateLogic = (dt) => {
    const st = gameStateRef.current;
    const fps = dt * 60;
    st.frame += fps;

    // Параллакс
    st.cloudsX -= st.speed * PARALLAX_CLOUDS * fps;
    st.bushesDarkX -= st.speed * PARALLAX_BUSHES_DARK * fps;
    st.bushesLightX -= st.speed * PARALLAX_BUSHES_LIGHT * fps;
    st.grassX -= st.speed * PARALLAX_GRASS * fps;
    if (st.cloudsX <= -baseDimensions.width) st.cloudsX += baseDimensions.width;
    if (st.bushesDarkX <= -baseDimensions.width) st.bushesDarkX += baseDimensions.width;
    if (st.bushesLightX <= -baseDimensions.width) st.bushesLightX += baseDimensions.width;
    if (st.grassX <= -baseDimensions.width) st.grassX += baseDimensions.width;
    if (st.ceilX <= -baseDimensions.width) st.ceilX += baseDimensions.width;

    // Анимация спрайтов
    st.bird.frameCounter += fps;
    const frameDelay = st.bird.velocity > 2 ? 3 : 5;
    if (st.bird.frameCounter >= frameDelay) {
      st.bird.currentFrame = (st.bird.currentFrame + 1) % 2;
      st.bird.frameCounter = 0;
    }

    if (!st.isStarted) {
      st.bird.floatOffset += dt * 3;
      st.bird.y = baseDimensions.height / 2 + Math.sin(st.bird.floatOffset) * 15;
      return;
    }

    // Физика птицы
    st.bird.velocity += GRAVITY * fps;
    st.bird.y += st.bird.velocity * fps;
    if (st.bird.velocity > 0) {
      st.bird.rotation = Math.min(FALL_ANGLE, st.bird.rotation + 2 * fps);
    } else {
      st.bird.rotation = -15;
    }

    // Генерация труб
    if (st.frame % PIPE_INTERVAL < fps) {
      st.pipeCount++;
      const topHeight = Math.floor(Math.random() * (MAX_TOP - MIN_TOP)) + MIN_TOP;
      st.pipes.push({
        x: baseDimensions.width,
        top: topHeight,
        bottom: topHeight + PIPE_GAP,
        width: PIPE_WIDTH,
        special: (st.pipeCount % 10 === 0),
        passed: false,
      });
    }

    // Движение труб и обновление счетчика
    for (let pipe of st.pipes) {
      pipe.x -= st.speed;
      if (!pipe.passed && pipe.x + PIPE_WIDTH < st.bird.x) {
        pipe.passed = true;
        st.passedPipes++;
        setScore(st.passedPipes);
        if (st.passedPipes > 0 && st.passedPipes % 10 === 0 && st.lastAccelerated !== st.passedPipes) {
          st.speed *= SPEED_MULTIPLIER;
          st.lastAccelerated = st.passedPipes;
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
    // Проверка столкновений с границами
    if (st.bird.y - 40 < 0 || st.bird.y + 40 > baseDimensions.height - FLOOR_HEIGHT) {
      handleGameOver();
      return;
    }
  };

  // Остановка игры и сохранение лучшего счета
  const handleGameOver = () => {
    const st = gameStateRef.current;
    st.isGameOver = true;
    setGameOver(true);
    if (st.passedPipes > bestScore) {
      setBestScore(st.passedPipes);
      localStorage.setItem('bestScore', st.passedPipes);
    }
    cancelAnimationFrame(animationIdRef.current);
  };

  // Рендеринг сцены
  const drawScene = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    ctx.save();
    ctx.scale(dpr, dpr);

    const { width, height } = baseDimensions;
    const st = gameStateRef.current;
    ctx.clearRect(0, 0, width, height);

    // Рисуем фон как градиент
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, st.selectedGradient[0]);
    gradient.addColorStop(0.5, st.selectedGradient[1]);
    gradient.addColorStop(1, st.selectedGradient[2]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Рисуем параллакс-слои (облака, кусты)
    if (imagesRef.current.clouds) {
      ctx.drawImage(imagesRef.current.clouds, st.cloudsX, height - FLOOR_HEIGHT - 237, width, 387);
      ctx.drawImage(imagesRef.current.clouds, st.cloudsX + width - 1, height - FLOOR_HEIGHT - 237, width, 387);
    }
    if (imagesRef.current.bushesDark) {
      ctx.drawImage(imagesRef.current.bushesDark, st.bushesDarkX, height - FLOOR_HEIGHT - 78, width, 228);
      ctx.drawImage(imagesRef.current.bushesDark, st.bushesDarkX + width - 1, height - FLOOR_HEIGHT - 78, width, 228);
    }
    if (imagesRef.current.bushesLight) {
      ctx.drawImage(imagesRef.current.bushesLight, st.bushesLightX, height - FLOOR_HEIGHT - 52, width, 202);
      ctx.drawImage(imagesRef.current.bushesLight, st.bushesLightX + width - 1, height - FLOOR_HEIGHT - 52, width, 202);
    }

    // Рисуем трубы (без изменения естественной высоты)
    for (let pipe of st.pipes) {
      const pipeImg = pipe.special ? imagesRef.current.pipeSpecial : imagesRef.current.pipeDefault;
      if (!pipeImg) continue;
      const scaledPipeHeight = PIPE_WIDTH * (pipeImg.naturalHeight / pipeImg.naturalWidth);
      // Верхняя труба: переворачиваем по вертикали
      ctx.save();
      ctx.translate(pipe.x, pipe.top);
      ctx.scale(1, -1);
      ctx.drawImage(pipeImg, 0, 0, pipe.width, scaledPipeHeight);
      ctx.restore();
      // Нижняя труба: смещаем вниз
      ctx.drawImage(pipeImg, pipe.x, pipe.bottom, pipe.width, scaledPipeHeight);
    }

    // Рисуем потолок
    if (imagesRef.current[st.selectedCeiling]) {
      const CEIL_HEIGHT = 33; // фиксированная высота потолка
      ctx.drawImage(imagesRef.current[st.selectedCeiling], st.grassX, 0, width, CEIL_HEIGHT);
      ctx.drawImage(imagesRef.current[st.selectedCeiling], st.grassX + width - 1, 0, width, CEIL_HEIGHT);
    }

    // Рисуем пол (движущаяся трава)
    if (imagesRef.current.grass) {
      const GROUND_HEIGHT = 36; // фиксированная высота потолка
      ctx.drawImage(imagesRef.current.grass, st.grassX, height - FLOOR_HEIGHT, width, GROUND_HEIGHT);
      ctx.drawImage(imagesRef.current.grass, st.grassX + width - 1, height - FLOOR_HEIGHT, width, GROUND_HEIGHT);
    }

    // Рисуем птицу (корова)
    ctx.save();
    ctx.translate(st.bird.x, st.bird.y);
    ctx.rotate((st.bird.rotation * Math.PI) / 180);
    const birdImg = st.bird.currentFrame === 0 ? imagesRef.current.cowIdle : imagesRef.current.cowPressed;
    if (birdImg) {
      const COW_WIDTH = 94.65;
      const COW_HEIGHT = 64.96;
      ctx.drawImage(birdImg, -COW_WIDTH / 2, -COW_HEIGHT / 2, COW_WIDTH, COW_HEIGHT);
    }
    ctx.restore();

    ctx.restore();
  };

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
