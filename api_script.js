class Game {
    #module = undefined;
    #tmp = {};

    #onFinish = () => {};

    /**
     * @param {HTMLElement} canvas
     * @param {string} auth_raw_data Telegram raw_data of user transaction
     * @param {string} game_name
     * @param {string} draw_script_url  
    */
    constructor(canvas, auth_raw_data, game_name, draw_script_url){
        this.canvas = canvas;
        this.auth_raw_data = auth_raw_data
        this.game_name = game_name;
        this.draw_script_url = draw_script_url;
    }

    finish(game_data){
        this.#module.deinit(this.canvas, this.#tmp);
        fetch('/gamefinish/', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': this.auth_raw_data
            },
            body: JSON.stringify(game_data)
        }).then((response) => {
            response.json().then(
                (response_json) => {
                    this.#onFinish(this.canvas, this.#tmp, response_json.score);
                }
            )
        }).catch((reason) => {
            console.error("Game finish error with " + reason)
        });
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
                'Content-Type': 'application/json',
                'Authorization': this.auth_raw_data
            },
            body: JSON.stringify({
                game_name: this.game_name
            })
        }).then(
            (response) => {
                response.json().then(
                    (init_game_data) => {
                        this.#tmp = this.#module.init(this.canvas, init_game_data.init, this.#tmp, this.finish);
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
     * @param {(HTMLElement, Object, number) => void} method
    */
    set onFinish(method = (canvas, tmp, score) => {}){
        this.#onFinish = method;
    }
}

fetch('/score/', {method: "GET", headers: {'Authorization': auth_raw_data}}).then(
    (response) => {
        response.json().then(
            (json_response) => {
                // Do smth with json data {score: int, coupons: int, scores_for_coupon: int}
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

class Game {
    #tmp = {};
    #module = Object();
    #onFinish = () => {}

    /**
     * @param {HTMLElement} canvas
     * @param {string} auth_raw_data Telegram raw_data of user transaction
     * @param {string} game_name
     * @param {string} draw_script_url  
    */
    constructor(canvas, auth_raw_data, game_name, draw_script_url, onModuleLoad = () => {}){
        this.canvas = canvas;
        this.auth_raw_data = auth_raw_data
        this.game_name = game_name;
        this.draw_script_url = draw_script_url;
    
        import(/* webpackIgnore: true */ draw_script_url).then(
            (obj) => {
                this.#module = obj;
                onModuleLoad();
            }
        ).catch(
            (reason) => {
                console.error("Draw script load error with " + reason);
            }
        );
    }

    set onFinish(method = (canvas, tmp, score) => {}){
        this.#onFinish = method;
    }

    finish(game_data){
        fetch('/gamefinish/', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': this.auth_raw_data,
                'X-CSRFToken': window.CSRF_TOKEN
            },
            body: JSON.stringify(game_data)
        }).then((response) => {
            response.json().then(
                (response_json) => {
                    this.#module.deinit(this.canvas, this.#tmp);
                    this.#onFinish(this.canvas, this.#tmp, response_json.score);
                }
            )
        });
    };

    start(){
        fetch("/gameinit/", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': this.auth_raw_data,
                'X-CSRFToken': window.CSRF_TOKEN
            },
            body: JSON.stringify({
                game_name: this.game_name
            })
        }).then(
            (response) => {
                response.json().then(
                    (init_game_data) => {
                        this.#tmp = this.#module.init(this.canvas, init_game_data.init, this.#tmp, this.finish);
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
}