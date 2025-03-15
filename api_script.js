class Game {
    #tmp = {};
    #secret_key = "";
    #timeInterval = -1;
    #module = Object();
    #frame_rate = 60;
    #onFinish = () => {}

    constructor(canvas, nick, game_name, draw_script_file_url, onModuleLoad = () => {}){
        this.canvas = canvas;
        this.nick = nick;
        this.game_name = game_name;
        this.draw_script_file_url = draw_script_file_url;
        
        if(document.cookie && document.cookie !== ''){
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                
                if (cookie.substring(0, 10) === 'csrftoken=') {
                    this.csrf_cookie = cookie.substring(10, cookie.length);
                    break;
                }
            }
        }
        import(/* webpackIgnore: true */ draw_script_file_url).then(
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

    set frame_rate(rate){
        this.#frame_rate = rate;
    }
    set onFinish(method = (canvas, tmp, score) => {}){
        this.#onFinish = method;
    }

    start(){
        let finish = (game_data) => {
            clearInterval(this.#timeInterval);
            game_data.nick = this.nick;
            game_data.secret_key = this.#secret_key;
            fetch('/gamefinish/', {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRFToken': this.csrf_cookie
                },
                body: JSON.stringify(game_data)
            }).then((response) => {
                response.json().then(
                    (response_json) => {
                        this.#module.finish(this.canvas, this.#tmp);
                        this.#onFinish(this.canvas, this.#tmp, response_json.score);
                    }
                )
            });
        },
        game = () => {
            this.#tmp = this.#module.proceed(this.canvas, this.#tmp, finish);
        };

        fetch("/gameinit/", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': this.csrf_cookie
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
                        this.#timeInterval = setInterval(game, Math.floor(1 / this.#frame_rate) * 1000);
                    }
                )
            } 
        ).catch(
            (reason) => {
                console.error("Game init error with" + reason);
            }
        );
    }
}

fetch('/score/?nick=' + nick).then(
    (response) => {
        response.json().then(
            (json_response) => {
                // Do smth with json data {score: int}
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