fetch('/', {method: "GET"}).then(
    (response) => {
        // Main page 'text/html'
    }
);
fetch('/fact_about_milk/', {method: "GET"}).then(
    (response) => {
        response.json().then(
            (json_response) => {
                // Do smth with json data {fact: {header: str, text: str}}
            }
        )
    }
);
fetch('/score/', {method: "GET"}).then(
    (response) => {
        response.json().then(
            (json_response) => {
                // Do smth with json data {score: int, coupons: int, score_for_coupon: int}
            }
        )
    }
);
fetch('/games/links/', {method: "GET"}).then(
    (response) => {
        response.json().then(
            (json_response) => {
                // Do smth with json data {games: [{name: str, client_script_url: str like /media/public/games/..., icon_url: /media/public/game_icons/...}, ...]}
            }
        )
    }
);
fetch(
    '/games/game_init/',
    {
        method: "POST", 
        headers: {
            'Authorization': auth_raw_data, 
            'X-CSRFToken': csrftoken, 
            'Content-Type': 'application/json'
        }, 
        body: JSON.stringify(
            {
                game_name: str
            }
        )
    }
).then(
    (response) => {
        response.json().then(
            (json_response) => {
                // Do smth with json data {init: {...}}
            }
        )
    }
);
fetch(
    '/games/game_finish/',
    {
        method: "POST", 
        headers: {
            'Authorization': auth_raw_data, 
            'X-CSRFToken': csrftoken, 
            'Content-Type': 'application/json'
        }, 
        body: JSON.stringify(
            {
                game_name: str,
                game_data: Object
            }
        )
    }
).then(
    (response) => {
        response.json().then(
            (json_response) => {
                // Do smth with json data {score: int}
            }
        )
    }
);
fetch('/dm/products/', {method: "GET"}).then(
    (response) => {
        response.json().then(
            (json_response) => {
                // Do smth with json data {products: [{name: str, gtin: str, score_for_purchase: int}, ...]}
            }
        )
    }
);
fetch(
    '/dm/proceed_text/',
    {
        method: "POST", 
        headers: {
            'Authorization': auth_raw_data, 
            'X-CSRFToken': csrftoken, 
            'Content-Type': 'application/json'
        }, 
        body: JSON.stringify(
            {
                dm_text: str
            }
        )
    }
).then(
    (response) => {
        response.json().then(
            (json_response) => {
                // Do smth with json data {score_for_purchase: int, gtin: str}
            }
        )
    }
);

class Game {
    #tmp = Object();
    #module = Object();
    #onFinish = () => {}

    /**
     * @param {HTMLElement} canvas
     * @param {string} auth_raw_data Telegram raw_data of user transaction
     * @param {string} game_name
     * @param {string} client_script_url  
    */
    constructor(canvas, auth_raw_data, game_name, client_script_url, onModuleLoad = () => {}, onFinish = (canvas, tmp, score) => {}){
        this.canvas = canvas;
        this.auth_raw_data = auth_raw_data
        this.game_name = game_name;
        this.#onFinish = onFinish;
    
        import(/* webpackIgnore: true */ client_script_url).then(
            (obj) => {
                this.#module = obj;
                onModuleLoad();
            }
        ).catch(
            (reason) => {
                console.error("Client script load error with " + reason);
            }
        );
    }

    /**
     * Finishes game session
     * @param {Object} game_data Tmp dictionary with some necessary data for game validation and score computation
     */
    finish(game_data){
        fetch('/games/game_finish/', {
            method: "POST",
            headers: {
                'X-CSRFToken': csrftoken, 
                'Content-Type': 'application/json',
                'Authorization': this.auth_raw_data
            },
            body: JSON.stringify(
                {
                    game_name: this.game_name,
                    game_data: game_data
                }
            )
        }).then((response) => {
            response.json().then(
                (response_json) => {
                    this.#module.deinit(this.canvas, this.#tmp);
                    this.#onFinish(this.canvas, this.#tmp, response_json.score);
                }
            ).catch((reason) => {
                console.error("Game finish parsing error with" + reason);
            });
        }).catch(
            (reason) => {
                console.error("Game finish fetching error with" + reason);
            }
        );
    };

    start(){
        fetch("/games/game_init/", {
            method: "POST",
            headers: {
                'X-CSRFToken': csrftoken,
                'Content-Type': 'application/json',
                'Authorization': this.auth_raw_data
            },
            body: JSON.stringify(
                {
                    game_name: this.game_name
                }
            )
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