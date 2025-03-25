const __VERSION__ = "18.2";

const ASSETS = {
  ceilEvening: 'ceilEvening',
  ceilSunset: 'ceilSunset',
  ceilSunrise: 'ceilSunrise',
  ceilDay: 'ceilDay',
  ceilMorning: 'ceilMorning',
};

const PATH = "/media/assets/milkyFly/";  // /media/assets/milkyFly/

const ceilEveningUrl = `${PATH}ceil_evening.svg`;
const ceilSunsetUrl = `${PATH}ceil_sunset.svg`;
const ceilSunriseUrl = `${PATH}ceil_sunrise.svg`;
const ceilDayUrl = `${PATH}ceil_day.svg`;
const ceilMorningUrl = `${PATH}ceil_morning.svg`;

const pipeDefaultUrl = `${PATH}pipeDefault.svg`;
const pipeSpecialUrl = `${PATH}pipeSpecial.svg`;

const cloudsUrl = `${PATH}clouds.svg`;
const bushesDarkUrl = `${PATH}bushesDark.svg`;
const bushesLightUrl = `${PATH}bushesLight.svg`;

const grassUrl = `${PATH}grass.svg`;

const playerIdleUrl = `${PATH}cowIdle.svg`;
const playerPressedUrl = `${PATH}cowPressed.svg`;

const MAX_CANVAS_WIDTH = 428;
const MAX_CANVAS_HEIGHT = 774;

const DEFAULT_FLOOR_HEIGHT = 36;

// ====== Параметры игры ======
const INITIAL_SPEED = 2.5;
const SPEED_MULTIPLIER = 1.2;             // Увеличение скорости каждые 10 труб
const PARALLAX_CLOUDS = 0.01;
const PARALLAX_BUSHES_DARK = 0.03;
const PARALLAX_BUSHES_LIGHT = 0.08;
const PARALLAX_GRASS = 1;
const FALL_ANGLE = 90;
const GRAVITY = 0.6;
const JUMP_FORCE = -10;

const PIPE_GAP = 160;
const PIPE_WIDTH = 66;
const PIPE_INTERVAL = 100;
const FLOOR_HEIGHT = DEFAULT_FLOOR_HEIGHT;

// const MIN_TOP = 80;                                 // трубы не появляются слишком высоко
// const MAX_TOP = MAX_CANVAS_HEIGHT / 2 + MIN_TOP;

const PLAYER_COLLISION_OFFSET = 30;
const PLAYER_BOUNDARY_OFFSET = 50;

const CEIL_DRAW_HEIGHT = 33;
const FLOOR_DRAW_HEIGHT = 36;
const PLAYER_WIDTH = 94.65;
const PLAYER_HEIGHT = 64.96;

const CLOUDS_WIDTH = MAX_CANVAS_WIDTH;
const BUSHES_WIDTH = MAX_CANVAS_WIDTH;
const GROUND_WIDTH = MAX_CANVAS_WIDTH;

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = (e) => {
      console.error("Failed to load image:", src, e);
      resolve(null); // возвращаем null, чтобы использовать fallback
    };
  });
}

// Массив вариантов заднего фона + потолок [ключ потолка, [цвет_верх, цвет_середина, цвет_низ]]
const BACKGROUNDS = [
  [ASSETS.ceilEvening, ["#67AAEB", "#D3E8FF", "#FFFFFF"]],
  [ASSETS.ceilSunset, ["#67AAEB", "#F7CDCE", "#FFFFFF"]],
  [ASSETS.ceilSunrise, ["#97A0FF", "#D1E8FF", "#FFFFFF"]],
  [ASSETS.ceilDay, ["#A1D1FF", "#D1E8FF", "#FFFFFF"]],
  [ASSETS.ceilMorning, ["#AED7FF", "#D9ECFF", "#FEEEEF"]],
];

// Класс линейного конгруэнтного генератора для детерминированного random
class LCG {
  constructor(seed) {
    this.modulus = 2 ** 31;
    this.multiplier = 1103515245;
    this.increment = 12345;
    this.state = LCG.hash(seed) % this.modulus;
  }

  static hash(str) {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) + hash) + str.charCodeAt(i);
      hash = hash & 0xffffffff;
    }
    return hash >>> 0;
  }

  random() {
    this.state = (this.multiplier * this.state + this.increment) % this.modulus;
    return this.state / this.modulus;
  }
}


class GameEngine {
  constructor(canvas, initGameData, tmp) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.tmp = tmp || {};
    this.tmp.engine = this;

    this.seed = initGameData.seed || Date.now().toString(16);
    console.log("Seed:", this.seed);
    this.randomGenerator = new LCG(this.seed);
    this.bestScore = initGameData.best_score;
    console.log("Лучший счет:", this.bestScore);

    const entrances = parseInt(initGameData.entrances);
    this.tutorialActive = entrances && entrances <= 3;  // initGameData.entrances && initGameData.entrances <= 3
    this.tutorialTimer = 0;
    console.log("Число посещений:", entrances);
    console.log("Туториал активен:", this.tutorialActive);

    this.dimensions = {
      width: MAX_CANVAS_WIDTH,
      height: MAX_CANVAS_HEIGHT,
    };

    this.state = {
      speed: INITIAL_SPEED,
      frame: 0,
      pipes: [],
      cloudsX: 0,
      bushesDarkX: 0,
      bushesLightX: 0,
      groundX: 0,
      player: {
        x: this.dimensions.width / 2,
        y: this.dimensions.height / 2,
        velocity: 0,
        frameCounter: 0,
        currentFrame: 0,
        rotation: 0,
        floatOffset: 0,
      },
      ...(() => {
        const rand = this.randomGenerator.random();
        const index = Math.floor(rand * BACKGROUNDS.length);
        console.log("Rand:", rand);
        return {
          selectedCeiling: BACKGROUNDS[index][0],
          selectedGradient: BACKGROUNDS[index][1],
        };
      })(),
      pipeCount: 0,
      passedPipes: 0,
      lastAccelerated: 0,
      isStarted: false,
      isGameOver: false,
    };

    // this.lastFrameTime = performance.now();
    this.gameLoopId = null;
    this.finishCallback = () => { };
    this.images = {};
    this.loadAssets();

    this.lastCanvasHeight = 0;
    this.isResizing = false;
    this.resizeTimer = null;

    this.boundHandleJump = (e) => this.handleJump(e);
    window.addEventListener('keydown', this.boundHandleJump);
    this.canvas.addEventListener('touchstart', this.boundHandleJump);

    this.boundResizeCanvas = () => this.resizeCanvas();
    window.addEventListener('resize', this.boundResizeCanvas);
    this.resizeCanvas();
  }

  resizeCanvas() {
    const parent = this.canvas.parentElement;
    if (!parent) return;

    console.log("Resize START");

    if (this.resizeTimer)
      clearTimeout(this.resizeTimer)

    this.isResizing = true;

    const GAP_FOR_GROUND = 60;

    const parentWidth = parent.clientWidth;
    const parentHeight = parent.clientHeight;
    const newWidth = Math.min(parentWidth, MAX_CANVAS_WIDTH);
    const newHeight = Math.min(parentHeight - GAP_FOR_GROUND, MAX_CANVAS_HEIGHT);

    this.dimensions.width = newWidth;
    this.dimensions.height = newHeight;

    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = newWidth * dpr;
    this.canvas.height = newHeight * dpr;
    this.canvas.style.width = `${newWidth}px`;
    this.canvas.style.height = `${newHeight}px`;

    this.resizeTimer = setInterval(() => this.resizeCanvasEnd(), 200);
  }

  resizeCanvasEnd() {
    console.log("Resize END");
    this.isResizing = false;
    if (this.resizeTimer)
      clearTimeout(this.resizeTimer)
  }

  handleJump(e) {
    if (e.type === 'keydown' && e.code !== 'Space') return;
    const st = this.state;
    if (!st.isStarted) {
      st.isStarted = true;
      st.player.velocity = JUMP_FORCE;
      return;
    }
    if (!st.isGameOver) {
      st.player.velocity = JUMP_FORCE;
      st.player.frameCounter = 0;
    }
  }

  async loadAssets() {
    const assets = {
      clouds: loadImage(cloudsUrl),
      bushesDark: loadImage(bushesDarkUrl),
      bushesLight: loadImage(bushesLightUrl),
      grass: loadImage(grassUrl),
      pipeDefault: loadImage(pipeDefaultUrl),
      pipeSpecial: loadImage(pipeSpecialUrl),
      playerIdle: loadImage(playerIdleUrl),
      playerPressed: loadImage(playerPressedUrl),
      ceilEvening: loadImage(ceilEveningUrl),
      ceilSunset: loadImage(ceilSunsetUrl),
      ceilSunrise: loadImage(ceilSunriseUrl),
      ceilDay: loadImage(ceilDayUrl),
      ceilMorning: loadImage(ceilMorningUrl),
    };
    const keys = Object.keys(assets);
    const loaded = await Promise.all(Object.values(assets));
    keys.forEach((key, idx) => {
      this.images[key] = loaded[idx] || null;
    });
  }

  startGameLoop() {
    console.log("Start GameLoop");
    // this.lastFrameTime = performance.now();
    this.gameLoopId = requestAnimationFrame(() => this.gameLoop());
  }

  gameLoop() {
    if (this.state.isGameOver) return;
    console.log("GameLoop");
    // const now = performance.now();
    const dt = Math.min(1 / 60, 0.1);  // please fix me
    // this.lastFrameTime = now;
    this.updateLogic(dt);
    this.drawScene();
    this.gameLoopId = requestAnimationFrame(() => this.gameLoop());
  }

  stopGameLoop() {
    console.log("Stop GameLoop");
    window.removeEventListener('keydown', this.boundHandleJump);
    this.canvas.removeEventListener('touchstart', this.boundHandleJump);
    window.removeEventListener('resize', this.boundResizeCanvas);
    if (this.resizeTimer)
      clearTimeout(this.resizeTimer)
    if (this.gameLoopId) {
      console.log("gameLoopId cleared");
      cancelAnimationFrame(this.gameLoopId);
    }
  }

  updateParallax(fps) {
    const st = this.state;
    st.cloudsX -= st.speed * PARALLAX_CLOUDS * fps;
    st.bushesDarkX -= st.speed * PARALLAX_BUSHES_DARK * fps;
    st.bushesLightX -= st.speed * PARALLAX_BUSHES_LIGHT * fps;
    st.groundX -= st.speed * PARALLAX_GRASS * fps;
    if (st.cloudsX <= -CLOUDS_WIDTH) st.cloudsX += CLOUDS_WIDTH;
    if (st.bushesDarkX <= -BUSHES_WIDTH) st.bushesDarkX += BUSHES_WIDTH;
    if (st.bushesLightX <= -BUSHES_WIDTH) st.bushesLightX += BUSHES_WIDTH;
    if (st.groundX <= -GROUND_WIDTH) st.groundX += GROUND_WIDTH;
  }

  animatePlayerIdle(dt) {
    const st = this.state;
    if (this.tutorialActive) {
      const period = 2.5; // секунда
      const amplitude = 50; // максимальное смещение вверх
      this.tutorialTimer += dt;
      const phase = this.tutorialTimer % period;
      // Используем синус для плавного подъёма и спуска: от 0 до amplitude
      const offset = amplitude * Math.sin(Math.PI * phase / period);
      st.player.y = this.dimensions.height / 2 - offset;
      st.player.velocity = JUMP_FORCE;

    } else {
      // Стандартная "плавающая" анимация
      st.player.floatOffset += dt * 3;
      st.player.y = this.dimensions.height / 2 + Math.sin(st.player.floatOffset) * 15;
    }
  }

  calculatePlayerGravity(fps) {
    const st = this.state;
    st.player.velocity += GRAVITY * fps;
    st.player.y += st.player.velocity * fps;
    if (st.player.velocity > 0) {
      st.player.rotation = Math.min(FALL_ANGLE, st.player.rotation + 2 * fps);
    } else {
      st.player.rotation = -15;
    }
  }

  animatePlayer(fps, dt) {
    const st = this.state;
    st.player.frameCounter += fps;
    const frameDelay = st.player.velocity > 2 ? 3 : 5;
    if (st.player.frameCounter >= frameDelay) {
      st.player.currentFrame = (st.player.currentFrame + 1) % 2;
      st.player.frameCounter = 0;
    }

    if (!st.isStarted) {
      this.animatePlayerIdle(dt);
      return;
    }

    this.calculatePlayerGravity(fps);
  }

  generateTubes(fps) {
    // Ограничения для труб
    const minTubeTop = this.dimensions.height / 4;                     // трубы не появляются слишком высоко
    const maxTubeTop = this.dimensions.height / 2;  // и не слишком низко

    const st = this.state;
    if (!st.isStarted) return;
    if (st.frame % PIPE_INTERVAL < fps) {
      st.pipeCount++;
      const topHeight = Math.floor(this.randomGenerator.random() * (maxTubeTop - minTubeTop)) + minTubeTop;
      st.pipes.push({
        x: this.dimensions.width,
        top: topHeight,
        bottom: topHeight + PIPE_GAP,
        width: PIPE_WIDTH,
        special: (st.pipeCount % 10 === 0),
        passed: false,
      });
    }
  }

  moveTubes() {
    const st = this.state;
    if (!st.isStarted) return;
    for (let pipe of st.pipes) {
      pipe.x -= st.speed;
      if (!pipe.passed && pipe.x + PIPE_WIDTH < st.player.x) {
        pipe.passed = true;
        st.passedPipes++;
        if (st.passedPipes > 0 && st.passedPipes % 10 === 0 && st.lastAccelerated !== st.passedPipes) {
          st.speed *= SPEED_MULTIPLIER;
          st.lastAccelerated = st.passedPipes;
        }
      }
    }
    st.pipes = st.pipes.filter(pipe => pipe.x + pipe.width > 0);
  }

  detectTubeCollision() {
    if (this.isResizing) return;
    const st = this.state;
    if (!st.isStarted) return;

    const scaleX = this.dimensions.width / MAX_CANVAS_WIDTH;
    const scaleY = 1;

    const playerX = st.player.x * scaleX;
    const playerY = st.player.y;
    const collisionOffset = PLAYER_COLLISION_OFFSET * Math.min(scaleX, scaleY);

    for (let pipe of st.pipes) {
      if (
        playerX + collisionOffset > pipe.x &&
        playerX - collisionOffset < pipe.x + pipe.width &&
        (playerY - collisionOffset < pipe.top || playerY + collisionOffset > pipe.bottom)
      ) {
        this.handleGameOver();
        return;
      }
    }
  }


  detectGroundCollision() {
    if (this.isResizing) return;
    const st = this.state;

    const scaleY = 1;
    const playerY = st.player.y * scaleY;
    const boundaryOffset = PLAYER_BOUNDARY_OFFSET * scaleY;

    if (playerY - boundaryOffset < 0 || playerY + boundaryOffset > this.dimensions.height - FLOOR_HEIGHT) {
      this.handleGameOver();
      return;
    }
  }


  updateLogic(dt) {
    const fps = dt * 60;
    this.state.frame += fps;

    this.updateParallax(fps);

    this.animatePlayer(fps, dt);

    this.generateTubes(fps);

    this.moveTubes();

    this.detectTubeCollision()
    this.detectGroundCollision()
  }

  drawScene() {
    const dpr = window.devicePixelRatio || 1;
    this.ctx.save();
    this.ctx.scale(dpr, dpr);
    const { width, height } = this.dimensions;
    this.ctx.clearRect(0, 0, width, height);

    // Фон - градиент
    const gradient = this.ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, this.state.selectedGradient[0]);
    gradient.addColorStop(0.5, this.state.selectedGradient[1]);
    gradient.addColorStop(1, this.state.selectedGradient[2]);
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, width, height);

    // Параллакс-слои (облака, кусты)
    if (this.images.clouds) {
      this.ctx.drawImage(this.images.clouds, this.state.cloudsX, height - FLOOR_HEIGHT - 237, CLOUDS_WIDTH, 387);
      this.ctx.drawImage(this.images.clouds, this.state.cloudsX + CLOUDS_WIDTH - 1, height - FLOOR_HEIGHT - 237, CLOUDS_WIDTH, 387);
    }
    if (this.images.bushesDark) {
      this.ctx.drawImage(this.images.bushesDark, this.state.bushesDarkX, height - FLOOR_HEIGHT - 78, BUSHES_WIDTH, 228);
      this.ctx.drawImage(this.images.bushesDark, this.state.bushesDarkX + BUSHES_WIDTH - 1, height - FLOOR_HEIGHT - 78, BUSHES_WIDTH, 228);
    }
    if (this.images.bushesLight) {
      this.ctx.drawImage(this.images.bushesLight, this.state.bushesLightX, height - FLOOR_HEIGHT - 52, BUSHES_WIDTH, 202);
      this.ctx.drawImage(this.images.bushesLight, this.state.bushesLightX + BUSHES_WIDTH - 1, height - FLOOR_HEIGHT - 52, BUSHES_WIDTH, 202);
    }

    // Трубы
    for (let pipe of this.state.pipes) {
      const pipeImg = pipe.special ? this.images.pipeSpecial : this.images.pipeDefault;
      if (!pipeImg) continue;
      const scaledPipeHeight = PIPE_WIDTH * (pipeImg.naturalHeight / pipeImg.naturalWidth);
      this.ctx.save();
      this.ctx.translate(pipe.x, pipe.top);
      this.ctx.scale(1, -1);
      this.ctx.drawImage(pipeImg, 0, 0, pipe.width, scaledPipeHeight);
      this.ctx.restore();
      this.ctx.drawImage(pipeImg, pipe.x, pipe.bottom, pipe.width, scaledPipeHeight);
    }

    // Потолок
    const ceilingImg = this.images[this.state.selectedCeiling];
    if (ceilingImg) {
      this.ctx.drawImage(ceilingImg, this.state.groundX, 0, GROUND_WIDTH, CEIL_DRAW_HEIGHT);
      this.ctx.drawImage(ceilingImg, this.state.groundX + GROUND_WIDTH - 1, 0, GROUND_WIDTH, CEIL_DRAW_HEIGHT);
    } else {
      // Fallback
      this.ctx.fillStyle = this.state.selectedGradient[0];
      this.ctx.fillRect(0, 0, GROUND_WIDTH, CEIL_DRAW_HEIGHT);
    }

    // Пол
    if (this.images.grass) {
      this.ctx.drawImage(this.images.grass, this.state.groundX, height - FLOOR_HEIGHT, GROUND_WIDTH, FLOOR_DRAW_HEIGHT);
      this.ctx.drawImage(this.images.grass, this.state.groundX + GROUND_WIDTH - 1, height - FLOOR_HEIGHT, GROUND_WIDTH, FLOOR_DRAW_HEIGHT);
    }

    // Корова
    this.ctx.save();

    const scaleX = this.dimensions.width / MAX_CANVAS_WIDTH;
    // const scaleY = this.dimensions.height / MAX_CANVAS_HEIGHT;

    const adjustedX = this.state.player.x * scaleX;
    const adjustedY = this.state.player.y;

    this.ctx.translate(adjustedX, adjustedY);
    this.ctx.rotate((this.state.player.rotation * Math.PI) / 180);

    const playerImg = this.state.player.currentFrame === 0 ? this.images.playerIdle : this.images.playerPressed;
    if (playerImg) {
      this.ctx.drawImage(
        playerImg,
        -PLAYER_WIDTH / 2,
        -PLAYER_HEIGHT / 2,
        PLAYER_WIDTH,
        PLAYER_HEIGHT
      );
    }
    this.ctx.restore();

    // Туториал
    if (!this.state.isStarted && this.tutorialActive) {
      const textX = width / 2;
      const textY = height / 2 + PLAYER_HEIGHT / 2 + 24;
      const swingAmplitude = 0.1; // приблизительно 6 градусов
      const period = 2; // секунды
      const swingAngle = swingAmplitude * Math.sin((this.tutorialTimer * 2 * Math.PI) / period);

      this.ctx.save();
      this.ctx.translate(textX, textY);
      this.ctx.rotate(swingAngle);
      this.ctx.textAlign = "center";
      this.ctx.font = '500 30px Roboto Mono';
      this.ctx.fillStyle = '#4b4949';
      this.ctx.fillText("Тап👆", 0, 0);
      this.ctx.restore();
    }

    // Текст счета
    this.ctx.textBaseline = "middle";
    this.ctx.fillStyle = 'white';
    this.ctx.font = '500 15px/24px Roboto Mono';
    this.ctx.fillText(`лучший результат: ${this.bestScore}`, 21, 60);

    this.ctx.textAlign = "center";
    this.ctx.font = '500 48px/24px Roboto Mono';
    this.ctx.fillText(`${this.state.passedPipes}`, width / 2, 120);

    this.ctx.restore();
  }

  handleGameOver() {
    console.log("GameOver");

    this.state.isGameOver = true;
    if (this.finishCallback) {
      const gameData = {
        score: this.state.passedPipes,
      };
      this.finishCallback(gameData);
    }
    if (this.gameLoopId) {
      console.log("gameLoopId cleared");
      cancelAnimationFrame(this.gameLoopId);
    }
  }

  setFinishCallback(callback) {
    this.finishCallback = callback;
  }

  static getInstance(tmp) {
    return tmp.engine;
  }
}

function init(canvas, initGameData, tmp, finish_func = (gameData) => { }) {
  console.log("Version:", __VERSION__);
  console.log("Py Version:", initGameData.version);

  if (!canvas) console.log("Canvas does not exist!");

  const engine = new GameEngine(canvas, initGameData, tmp);
  engine.startGameLoop();
  engine.setFinishCallback(finish_func);
  return tmp;
}

function deinit(canvas, tmp) {
  const engine = GameEngine.getInstance(tmp);
  engine.stopGameLoop();
}

export { init, deinit };