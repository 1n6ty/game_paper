const __VERSION__ = "9.21D";

const ASSETS = {
  ceilEvening: 'ceilEvening',
  ceilSunset: 'ceilSunset',
  ceilSunrise: 'ceilSunrise',
  ceilDay: 'ceilDay',
  ceilMorning: 'ceilMorning',
};

const PATH = "/media/assets/milkyFly/";

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

const cowIdleUrl = `${PATH}cowIdle.svg`;
const cowPressedUrl = `${PATH}cowPressed.svg`;

const MAX_CANVAS_WIDTH = 428;
const BASE_ASPECT = 720 / MAX_CANVAS_WIDTH;
const baseDimensions = {
  width: MAX_CANVAS_WIDTH,
  height: Math.floor(MAX_CANVAS_WIDTH * BASE_ASPECT),
};

const DEFAULT_FLOOR_HEIGHT = 36;

// ====== Параметры игры ======
const INITIAL_SPEED = 2.5;                // Начальная скорость
const SPEED_MULTIPLIER = 1.2;             // Увеличение скорости каждые 10 труб
const PARALLAX_CLOUDS = 0.01;
const PARALLAX_BUSHES_DARK = 0.03;
const PARALLAX_BUSHES_LIGHT = 0.08;
const PARALLAX_GRASS = 1;
const FALL_ANGLE = 90;                    // Угол наклона при падении
const GRAVITY = 0.6;
const JUMP_FORCE = -10;

const PIPE_GAP = 150;
const PIPE_WIDTH = 66;
const PIPE_INTERVAL = 100;
const FLOOR_HEIGHT = DEFAULT_FLOOR_HEIGHT;

// Ограничения для труб
const MIN_TOP = 80;                                 // трубы не появляются слишком высоко
const MAX_TOP = baseDimensions.height / 2 + MIN_TOP; // и не слишком низко

const BIRD_COLLISION_OFFSET = 20;
const BIRD_BOUNDARY_OFFSET = 40;
const CEIL_DRAW_HEIGHT = 33;
const FLOOR_DRAW_HEIGHT = 36;
const COW_WIDTH = 94.65;
const COW_HEIGHT = 64.96;

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

    this.seed = initGameData.seed;
    console.log("Seed:", this.seed);
    this.randomGenerator = new LCG(this.seed);
    this.bestScore = initGameData.best_score;
    console.log("Лучший счет:", this.bestScore);

    this.state = {
      speed: INITIAL_SPEED,
      frame: 0,
      pipes: [],
      cloudsX: 0,
      bushesDarkX: 0,
      bushesLightX: 0,
      groundX: 0,
      bird: {
        x: baseDimensions.width / 2,
        y: baseDimensions.height / 2,
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

    this.floorHeight = FLOOR_HEIGHT;

    this.lastFrameTime = performance.now();
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

    const parentWidth = parent.clientWidth;
    const newWidth = Math.min(parentWidth, MAX_CANVAS_WIDTH);
    const newHeight = Math.floor(newWidth * BASE_ASPECT);
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = newWidth * dpr;
    this.canvas.height = newHeight * dpr;
    this.canvas.style.width = `${newWidth}px`;
    this.canvas.style.height = `${newHeight}px`;

    const canvasStyleHeight = parseInt(this.canvas.style.height);
    if (canvasStyleHeight <= 716) {
      console.log(canvasStyleHeight);
      if ((canvasStyleHeight - this.lastCanvasHeight) < 0) {
        this.floorHeight += 716 % canvasStyleHeight;
      } else {
        this.floorHeight -= 716 % canvasStyleHeight;
      }
    } else
      this.floorHeight = DEFAULT_FLOOR_HEIGHT;
    console.log(this.floorHeight);
    this.lastCanvasHeight = canvasStyleHeight;

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
      st.bird.velocity = JUMP_FORCE;
      return;
    }
    if (!st.isGameOver) {
      st.bird.velocity = JUMP_FORCE;
      st.bird.frameCounter = 0;
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
      cowIdle: loadImage(cowIdleUrl),
      cowPressed: loadImage(cowPressedUrl),
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
    this.lastFrameTime = performance.now();
    this.gameLoopId = requestAnimationFrame(() => this.gameLoop());
  }

  gameLoop() {
    if (this.state.isGameOver) return;
    console.log("GameLoop");
    const now = performance.now();
    const dt = Math.min((now - this.lastFrameTime) / 1000, 0.1);
    this.lastFrameTime = now;
    this.updateLogic(dt);
    this.drawScene();
    // this.gameLoopId = requestAnimationFrame(() => this.gameLoop());
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
    if (st.cloudsX <= -baseDimensions.width) st.cloudsX += baseDimensions.width;
    if (st.bushesDarkX <= -baseDimensions.width) st.bushesDarkX += baseDimensions.width;
    if (st.bushesLightX <= -baseDimensions.width) st.bushesLightX += baseDimensions.width;
    if (st.groundX <= -baseDimensions.width) st.groundX += baseDimensions.width;
  }

  animateBird(fps, dt) {
    const st = this.state;
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
  }

  generateTubes(fps) {
    const st = this.state;
    if (!st.isStarted) return;
    if (st.frame % PIPE_INTERVAL < fps) {
      st.pipeCount++;
      const topHeight = Math.floor(this.randomGenerator.random() * (MAX_TOP - MIN_TOP)) + MIN_TOP;
      st.pipes.push({
        x: baseDimensions.width,
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
      if (!pipe.passed && pipe.x + PIPE_WIDTH < st.bird.x) {
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
    const st = this.state;
    if (!st.isStarted) return;
    for (let pipe of st.pipes) {
      if (
        st.bird.x + BIRD_COLLISION_OFFSET > pipe.x &&
        st.bird.x - BIRD_COLLISION_OFFSET < pipe.x + pipe.width &&
        (st.bird.y - BIRD_COLLISION_OFFSET < pipe.top || st.bird.y + BIRD_COLLISION_OFFSET > pipe.bottom)
      ) {
        this.handleGameOver();
        return;
      }
    }
  }

  detectGroundCollision() {
    if (this.isResizing) return;
    const st = this.state;
    if (st.bird.y - BIRD_BOUNDARY_OFFSET < 0 || st.bird.y + BIRD_BOUNDARY_OFFSET > baseDimensions.height - this.floorHeight) {
      this.handleGameOver();
      return;
    }
  }

  updateLogic(dt) {
    const fps = dt * 60;
    this.state.frame += fps;

    this.updateParallax(fps);

    this.animateBird(fps, dt);

    this.generateTubes(fps);

    this.moveTubes();

    this.detectTubeCollision()
    this.detectGroundCollision()
  }

  drawScene() {
    const dpr = window.devicePixelRatio || 1;
    this.ctx.save();
    this.ctx.scale(dpr, dpr);
    const { width, height } = baseDimensions;
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
      this.ctx.drawImage(this.images.clouds, this.state.cloudsX, height - this.floorHeight - 237, width, 387);
      this.ctx.drawImage(this.images.clouds, this.state.cloudsX + width - 1, height - this.floorHeight - 237, width, 387);
    }
    if (this.images.bushesDark) {
      this.ctx.drawImage(this.images.bushesDark, this.state.bushesDarkX, height - this.floorHeight - 78, width, 228);
      this.ctx.drawImage(this.images.bushesDark, this.state.bushesDarkX + width - 1, height - this.floorHeight - 78, width, 228);
    }
    if (this.images.bushesLight) {
      this.ctx.drawImage(this.images.bushesLight, this.state.bushesLightX, height - this.floorHeight - 52, width, 202);
      this.ctx.drawImage(this.images.bushesLight, this.state.bushesLightX + width - 1, height - this.floorHeight - 52, width, 202);
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
      this.ctx.drawImage(ceilingImg, this.state.groundX, 0, width, CEIL_DRAW_HEIGHT);
      this.ctx.drawImage(ceilingImg, this.state.groundX + width - 1, 0, width, CEIL_DRAW_HEIGHT);
    } else {
      //
      this.ctx.fillStyle = this.state.selectedGradient[0];
      this.ctx.fillRect(0, 0, width, CEIL_DRAW_HEIGHT);
    }

    // Пол
    if (this.images.grass) {
      this.ctx.drawImage(this.images.grass, this.state.groundX, height - this.floorHeight, width, FLOOR_DRAW_HEIGHT);
      this.ctx.drawImage(this.images.grass, this.state.groundX + width - 1, height - this.floorHeight, width, FLOOR_DRAW_HEIGHT);
    }

    // Корова
    this.ctx.save();
    this.ctx.translate(this.state.bird.x, this.state.bird.y);
    this.ctx.rotate((this.state.bird.rotation * Math.PI) / 180);
    const birdImg = this.state.bird.currentFrame === 0 ? this.images.cowIdle : this.images.cowPressed;
    if (birdImg) {
      this.ctx.drawImage(birdImg, -COW_WIDTH / 2, -COW_HEIGHT / 2, COW_WIDTH, COW_HEIGHT);
    }
    this.ctx.restore();

    // Текст счета
    this.ctx.textBaseline = "middle";
    this.ctx.fillStyle = 'white';
    this.ctx.font = '500 15px/24px Roboto Mono';
    this.ctx.fillText(`лучший результат: ${this.bestScore}`, 21, 60);

    this.ctx.textAlign = "center";
    this.ctx.font = '500 48px/24px Roboto Mono';
    this.ctx.fillText(`${this.state.passedPipes}`, this.canvas.width / 2, 120);

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

  getTmp() {
    return this.tmp;
  }
}

export function init(canvas, initGameData, tmp) {
  console.log("Version:", __VERSION__);
  const engine = new GameEngine(canvas, initGameData, tmp);
  engine.startGameLoop();
  return engine.getTmp();
}

export function proceed(canvas, tmp, finish_func = (gameData) => { }) {
  if (!canvas) console.log("Canvas does not exist!");
  const engine = GameEngine.getInstance(tmp);
  engine.setFinishCallback(finish_func);
  engine.gameLoop();
  return tmp;
}

export function finish(canvas, tmp) {
  const engine = GameEngine.getInstance(tmp);
  engine.stopGameLoop();
}
