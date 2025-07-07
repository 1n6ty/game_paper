import { __VERSION__ } from "./config";

import GameEngine from "./GameEngine";

function init(
  canvas,
  initGameData,
  tmp,
  finishFunc = (gameData) => {},
  assetsLoadedCallback = () => {}
) {
  console.log("Version:", __VERSION__);
  console.log("Py Version:", initGameData.version);

  if (!canvas) console.error("Canvas does not exist!");

  const engine = new GameEngine(canvas, initGameData, tmp);
  engine.setFinishCallback(finishFunc);
  engine.setAssetsLoadedCallback(assetsLoadedCallback);
  return tmp;
}

function deinit(canvas, tmp) {
  const engine = GameEngine.getInstance(tmp);
  engine.stopGameLoop && engine.stopGameLoop();
}

export { init, deinit };
