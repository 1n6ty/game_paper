class Game {
    #module = undefined;
    #frame_rate = 60;
    #timeInterval = -1;

    #secret_key = "";
    #tmp = {};

    #onFinish = () => {};

    /**
     * @param {HTMLElement} canvas
     * @param {string} nick
     * @param {string} game_name
     * @param {string} draw_script_url  
    */
    constructor(canvas, nick, game_name, draw_script_url){
        this.canvas = canvas;
        this.nick = nick;
        this.game_name = game_name;
        this.draw_script_url = draw_script_url;
    }

    finish(game_data){
        clearInterval(this.#timeInterval);

        game_data.nick = this.nick;
        game_data.secret_key = this.#secret_key;

        fetch('/gamefinish/', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(game_data)
        }).then((response) => {
            response.json().then(
                (response_json) => {
                    this.#module.finish(this.canvas, this.#tmp);
                    this.#onFinish(this.canvas, this.#tmp, response_json.score);
                }
            )
        }).catch((reason) => {
            console.error("Game finish error with " + reason)
        });
    }

    #game(){
        this.#tmp = this.#module.proceed(this.canvas, this.#tmp, this.finish);
    }

    async start(){
        if(this.#module === undefined){
            this.#module = await import(/* webpackIgnore: true */ this.draw_script_url).catch(
                (reason) => {
                    console.error("Draw script load error with " + reason);
                }
            );
        }

        fetch("/gameinit/", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                game_name: this.game_name,
                nick: this.nick
            })
        }).then(
            (response) => {
                response.json().then(
                    (init_game_data) => {
                        this.#secret_key = init_game_data.init.secret_key;
                        delete init_game_data.init.secret_key;

                        this.#tmp = this.#module.init(canvas, init_game_data.init, this.#tmp);

                        this.#timeInterval = setInterval(this.#game, Math.floor(1 / this.#frame_rate) * 1000);
                    }
                ).catch((reason) => {
                    console.error("Game init parsing error with" + reason);
                });
            } 
        ).catch(
            (reason) => {
                console.error("Game init fetching error with" + reason);
            }
        );
    }

    /**
     * @param {number} rate
    */
    set frame_rate(rate){
        this.#frame_rate = rate;
    }

    /**
     * @param {(HTMLElement, Object, number) => void} method
    */
    set onFinish(method = (canvas, tmp, score) => {}){
        this.#onFinish = method;
    }
}

fetch('/score/?nick=' + nick).then(
    (response) => {
        response.json().then(
            (json_response) => {
                // Do smth with json data {score: int, score_for_coupon: int}
            }
        )
    }
);
fetch('/gamelinks/').then(
    (response) => {
        response.json().then(
            (json_response) => {
                // Do smth with json data {name_1: url_1, name_2: url_2...}
            }
        )
    }
);