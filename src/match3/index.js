import { __VERSION__ } from "./config";

import GameEngine from "./GameEngine";

function init(
  canvas,
  initGameData,
  tmp,
  finishCallback = (gameData) => {},
  assetsLoadedCallback = () => {}
) {
  console.log("Version:", __VERSION__);
  console.log("Py Version:", initGameData.version);

  if (!canvas) console.error("Canvas does not exist!");

  const engine = new GameEngine(canvas, initGameData, tmp);
  engine.setFinishCallback(finishCallback);
  engine.setAssetsLoadedCallback(assetsLoadedCallback);
  engine.init();
  return tmp;
}

function deinit(canvas, tmp) {
  if (tmp?.engine) {
    const engine = tmp.engine;
    window.removeEventListener("resize", engine.boundResize);
    engine.canvas.removeEventListener(
      "pointerdown",
      engine.boundHandlePointerDown
    );
    engine.stopGameLoop();
    console.log("Engine de-initialized.");
  }
}

export { init, deinit };
