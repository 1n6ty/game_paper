import React, { useState, useEffect, useRef } from 'react';
import GameOver from '../../GameOver/GameOver';
import './MilkyFly.css';

import pipeDefaultUrl from '/games/milkyFly/pipeDefault.svg';
import pipeSpecialUrl from '/games/milkyFly/pipeSpecial.svg';

import cloudsUrl from '/games/milkyFly/clouds.svg';
import bushesDarkUrl from '/games/milkyFly/bushesDark.svg';
import bushesLightUrl from '/games/milkyFly/bushesLight.svg';

import grassUrl from '/games/milkyFly/grass.svg';
// import groundUrl from 'games/milkyFly/ground.svg';

import cowIdle from '/games/milkyFly/cowIdle.svg';
import cowPressed from '/games/milkyFly/cowPressed.svg';

const MilkyFly = () => {
  // ====== Константы (настраиваемые параметры) ======
  const INITIAL_SPEED = 2;               // Начальная скорость
  const SPEED_MULTIPLIER = 1.2;            // Множитель увеличения скорости каждые 10 препятствий
  const PARALLAX_CLOUDS = 0.2;             // Множитель для облаков
  const PARALLAX_BUSHES_DARK = 0.4;        // Множитель для тёмных кустов
  const PARALLAX_BUSHES_LIGHT = 0.6;       // Множитель для светлых кустов
  const PARALLAX_GRASS = 0.8;              // Множитель для движущейся травы
  const FALL_ANGLE = 30;                 // Максимальный угол наклона при падении (градусы)

  const GRAVITY = 0.5;
  const JUMP_FORCE = -8;
  const PIPE_GAP = 100;
  const PIPE_WIDTH = 50;
  const PIPE_INTERVAL = 90;  // интервал кадров между появлением труб
  const CANVAS_WIDTH = 400;
  const CANVAS_HEIGHT = 600;
  const FLOOR_HEIGHT = 50;   // высота области, где рисуется пол

  // Массив градиентов: каждый элемент — массив из 3-х цветов (верх, середина, низ)
  const GRADIENTS = [
    ["#67AAEB", "#D3E8FF", "#FFFFFF"], // Вечер
    ["#67AAEB", "#F7CDCE", "#FFFFFF"], // Закат
    ["#97A0FF", "#D1E8FF", "#FFFFFF"], // Рассвет
    ["#A1D1FF", "#D1E8FF", "#FFFFFF"], // День
    ["#AED7FF", "#FEFEFF", "#FFFFFF"], // Утро
  ];


  // ====== Состояния игры ======
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  // Ссылка на canvas и id анимации
  const canvasRef = useRef(null);
  const animationIdRef = useRef();

  // Храним динамику игры в объекте, чтобы не перерендеривать компонент каждый кадр
  const gameStateRef = useRef({
    speed: INITIAL_SPEED,
    frame: 0,
    pipes: [],
    // Позиции для параллакса
    cloudsX: 0,
    bushesDarkX: 0,
    bushesLightX: 0,
    grassX: 0,
    // Состояние птицы (коровы)
    bird: {
      x: 50,
      y: 150,
      velocity: 0,
      frameCounter: 0,
      currentFrame: 0, // 0 или 1 (для двух спрайтов)
      rotation: 0,     // угол в градусах
    },
    // Выбор фона (рандомно при запуске)
    selectedGradient: GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)]
  });

  // При монтировании загружаем лучший результат и запускаем игру
  useEffect(() => {
    const storedBest = parseInt(localStorage.getItem('bestScore')) || 0;
    setBestScore(storedBest);
    resetGame();
    animationIdRef.current = requestAnimationFrame(gameLoop);

    // Обработчики для прыжка (Space и касание)
    const handleJump = (e) => {
      if (e.type === 'keydown' && e.code !== 'Space') return;
      gameStateRef.current.bird.velocity = JUMP_FORCE;
      gameStateRef.current.bird.frameCounter = 0; // сброс анимации
    };
    window.addEventListener('keydown', handleJump);
    window.addEventListener('touchstart', handleJump);

    return () => {
      window.removeEventListener('keydown', handleJump);
      window.removeEventListener('touchstart', handleJump);
      cancelAnimationFrame(animationIdRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Сброс состояния игры
  const resetGame = () => {
    setGameOver(false);
    setScore(0);
    gameStateRef.current.speed = INITIAL_SPEED;
    gameStateRef.current.frame = 0;
    gameStateRef.current.pipes = [];
    gameStateRef.current.cloudsX = 0;
    gameStateRef.current.bushesDarkX = 0;
    gameStateRef.current.bushesLightX = 0;
    gameStateRef.current.grassX = 0;
    gameStateRef.current.bird = {
      x: 50,
      y: 150,
      velocity: 0,
      frameCounter: 0,
      currentFrame: 0,
      rotation: 0,
    };
    gameStateRef.current.selectedGradient = GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)];
  };

  // Основной игровой цикл
  const gameLoop = () => {
    update();
    draw();
    if (!gameOver) {
      animationIdRef.current = requestAnimationFrame(gameLoop);
    } else {
      // При Game Over обновляем лучший результат
      if (score > bestScore) {
        setBestScore(score);
        localStorage.setItem('bestScore', score);
      }
    }
  };

  // Обновление логики игры
  const update = () => {
    const state = gameStateRef.current;
    state.frame++;

    // Обновляем позиции параллакс-слоев
    state.cloudsX -= state.speed * PARALLAX_CLOUDS;
    state.bushesDarkX -= state.speed * PARALLAX_BUSHES_DARK;
    state.bushesLightX -= state.speed * PARALLAX_BUSHES_LIGHT;
    state.grassX -= state.speed * PARALLAX_GRASS;

    // Если слой ушел за границу, сбрасываем (предполагается, что ширина слоя равна CANVAS_WIDTH)
    if (state.cloudsX <= -CANVAS_WIDTH) state.cloudsX += CANVAS_WIDTH;
    if (state.bushesDarkX <= -CANVAS_WIDTH) state.bushesDarkX += CANVAS_WIDTH;
    if (state.bushesLightX <= -CANVAS_WIDTH) state.bushesLightX += CANVAS_WIDTH;
    if (state.grassX <= -CANVAS_WIDTH) state.grassX += CANVAS_WIDTH;

    // Физика птицы (коровы)
    state.bird.velocity += GRAVITY;
    state.bird.y += state.bird.velocity;
    // Если падает, увеличиваем угол до FALL_ANGLE; иначе слегка наклоняем вверх
    if (state.bird.velocity > 0) {
      state.bird.rotation = Math.min(FALL_ANGLE, state.bird.rotation + 2);
    } else {
      state.bird.rotation = -15;
    }
    // Анимация спрайтов: переключаем кадры каждые 5 кадров, а если скорость падения выше – каждые 3
    state.bird.frameCounter++;
    let frameDelay = state.bird.velocity > 2 ? 3 : 5;
    if (state.bird.frameCounter >= frameDelay) {
      state.bird.currentFrame = (state.bird.currentFrame + 1) % 2;
      state.bird.frameCounter = 0;
    }

    // Создаем трубы каждые PIPE_INTERVAL кадров
    if (state.frame % PIPE_INTERVAL === 0) {
      let topHeight = Math.random() * (CANVAS_HEIGHT - PIPE_GAP - 100) + 50;
      const pipe = {
        x: CANVAS_WIDTH,
        top: topHeight,
        bottom: topHeight + PIPE_GAP,
        width: PIPE_WIDTH,
        special: ((state.pipes.length + 1) % 10 === 0), // каждая 10-я труба особая
        passed: false,
      };
      state.pipes.push(pipe);
    }

    // Обновляем трубы и проверяем, прошла ли птица трубу
    for (let i = 0; i < state.pipes.length; i++) {
      state.pipes[i].x -= state.speed;
      if (!state.pipes[i].passed && state.pipes[i].x + PIPE_WIDTH < state.bird.x) {
        state.pipes[i].passed = true;
        setScore(prev => prev + 1);
        // Если пройдено кратное 10 препятствий, увеличиваем скорость
        if ((score + 1) % 10 === 0) {
          state.speed *= SPEED_MULTIPLIER;
        }
      }
    }
    // Удаляем трубы, ушедшие за экран
    state.pipes = state.pipes.filter(pipe => pipe.x + pipe.width > 0);

    // Проверка столкновений (с трубами)
    for (let pipe of state.pipes) {
      if (
        state.bird.x + 20 > pipe.x &&
        state.bird.x - 20 < pipe.x + pipe.width &&
        (state.bird.y - 20 < pipe.top || state.bird.y + 20 > pipe.bottom)
      ) {
        setGameOver(true);
      }
    }
    // Проверка столкновений с верхней границей и полом (здесь пол = FLOOR_HEIGHT)
    if (state.bird.y + 20 > CANVAS_HEIGHT - FLOOR_HEIGHT || state.bird.y - 20 < 0) {
      setGameOver(true);
    }
  };

  // Рендеринг на canvas
  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const state = gameStateRef.current;

    // Очистка canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Вместо отрисовки фонового изображения используем градиент:
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    gradient.addColorStop(0, state.selectedGradient[0]); // Верхний цвет
    gradient.addColorStop(0.5, state.selectedGradient[1]);   // Средний цвет
    gradient.addColorStop(1, state.selectedGradient[2]);   // Нижний цвет

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);


    const cloudsImg = new Image();
    cloudsImg.src = cloudsUrl;
    cloudsImg.onload = () => {
      // Рисуем слои параллакса
      // Облака (повторяются по горизонтали)
      ctx.drawImage(cloudsImg, state.cloudsX, 0, CANVAS_WIDTH, 100);
      ctx.drawImage(cloudsImg, state.cloudsX + CANVAS_WIDTH, 0, CANVAS_WIDTH, 100);
    }

    // Тёмные кусты
    const bushesDarkImg = new Image();
    bushesDarkImg.src = bushesDarkUrl;
    bushesDarkImg.onload = () => {
      ctx.drawImage(bushesDarkImg, state.bushesDarkX, CANVAS_HEIGHT - 200, CANVAS_WIDTH, 100);
      ctx.drawImage(bushesDarkImg, state.bushesDarkX + CANVAS_WIDTH, CANVAS_HEIGHT - 200, CANVAS_WIDTH, 100);
    }

    // Светлые кусты
    const bushesLightImg = new Image();
    bushesLightImg.src = bushesLightUrl;
    bushesLightImg.onload = () => {
      ctx.drawImage(bushesLightImg, state.bushesLightX, CANVAS_HEIGHT - 150, CANVAS_WIDTH, 100);
      ctx.drawImage(bushesLightImg, state.bushesLightX + CANVAS_WIDTH, CANVAS_HEIGHT - 150, CANVAS_WIDTH, 100);
    }

    // Рисуем трубы
    for (let pipe of state.pipes) {
      const pipeUrl = pipe.special ? pipeSpecialUrl : pipeDefaultUrl;
      const pipeImg = new Image();
      pipeImg.src = pipeUrl;
      pipeImg.onload = () => {
        // Труба сверху
        ctx.drawImage(pipeImg, pipe.x, 0, pipe.width, pipe.top);
        // Труба снизу (учитываем, что пол занимает FLOOR_HEIGHT пикселей)
        ctx.drawImage(pipeImg, pipe.x, pipe.bottom, pipe.width, CANVAS_HEIGHT - pipe.bottom - FLOOR_HEIGHT);
      }

    }

    // Рисуем пол: сначала движущуюся траву, затем статичную землю
    const grassImg = new Image();
    grassImg.src = grassUrl;
    grassImg.onload = () => {
      ctx.drawImage(grassImg, state.grassX, CANVAS_HEIGHT - FLOOR_HEIGHT, CANVAS_WIDTH, 30);
      ctx.drawImage(grassImg, state.grassX + CANVAS_WIDTH, CANVAS_HEIGHT - FLOOR_HEIGHT, CANVAS_WIDTH, 30);
    }
    // ctx.drawImage(groundUrl, 0, CANVAS_HEIGHT - 20, CANVAS_WIDTH, 20);

    // Рисуем птицу (корову) с учетом поворота
    ctx.save();
    ctx.translate(state.bird.x, state.bird.y);
    ctx.rotate((state.bird.rotation * Math.PI) / 180);
    const birdUrl = state.bird.currentFrame === 0 ? cowIdle : cowPressed;
    const birdImg = new Image();
    birdImg.src = birdUrl;
    birdImg.onload = () => {
      ctx.drawImage(birdImg, -20, -20, 40, 40);
    }
    ctx.restore();

    // Рисуем лучший результат (левый верхний угол: отступ 15px слева, 11px сверху)
    ctx.fillStyle = '#000';
    ctx.font = '16px Arial';
    ctx.fillText(`лучший результат: ${bestScore}`, 15, 11 + 16);

    // Рисуем текущий счёт (по центру, отступ сверху 44px)
    const scoreText = score.toString();
    const textWidth = ctx.measureText(scoreText).width;
    ctx.fillText(scoreText, (CANVAS_WIDTH - textWidth) / 2, 44);
  };

  // Обработчики для компонента GameOver
  const handleRestart = () => {
    resetGame();
    setGameOver(false);
    animationIdRef.current = requestAnimationFrame(gameLoop);
  };

  const handleExit = () => {
    // Здесь можно добавить навигацию в главное меню. Пока просто перезагружаем страницу.
    window.location.reload();
  };

  return (
    <div className="game-container">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="game-canvas"
      />
      {gameOver && <GameOver score={score} onRestart={handleRestart} onExit={handleExit} />}
    </div>
  );
};

export default MilkyFly;
