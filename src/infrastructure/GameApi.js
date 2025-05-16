export default class GameApi {
  #tmp = {};
  #module = Object();
  #onFinish = () => { };
  #onAssetsLoaded = () => { };

  /**
   * @param {HTMLElement} canvas
   * @param {string} authRawData Telegram raw_data of user transaction
   * @param {string} gameName
   * @param {string} drawScriptUrl  
  */
  constructor(canvas, authRawData, gameName, drawScriptUrl, onModuleLoad = () => { }, onAssetsLoaded = () => { }) {
    this.canvas = canvas;
    this.authRawData = authRawData;
    this.gameName = gameName;
    this.drawScriptUrl = drawScriptUrl;
    this.#onAssetsLoaded = onAssetsLoaded;

    import(/* webpackIgnore: true */ drawScriptUrl).then(
      obj => {
        this.#module = obj;
        onModuleLoad();
      }
    ).catch(
      reason => {
        console.error("Draw script load error with " + reason);
      }
    );
  }

  set onFinish(method = (canvas, tmp, score) => { }) {
    this.#onFinish = method;
  }

  finish = game_data => {
    fetch("/gamefinish/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: this.authRawData,
        "X-CSRFToken": window.CSRF_TOKEN
      },
      body: JSON.stringify(game_data)
    }).then(response => {
      response.json().then(
        response_json => {
          this.#module.deinit(this.canvas, this.#tmp);
          this.#onFinish(this.canvas, this.#tmp, response_json.score);
        }
      );
    });
  };

  start() {
    fetch("/gameinit/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: this.authRawData,
        "X-CSRFToken": window.CSRF_TOKEN
      },
      body: JSON.stringify({
        game_name: this.gameName
      })
    }).then(
      response => {
        response.json()
          .then(init_game_data => {
            this.#tmp = this.#module.init(this.canvas, init_game_data.init, this.#tmp, this.finish, this.#onAssetsLoaded);
          }
          ).catch(reason => {
            console.error("Game init parsing error with", reason);
          });
      }
    ).catch(reason => {
      console.error("Game init fetching error with", reason);
    }
    );
  }
}