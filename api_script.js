class Game {
    #tmp = {};
    #canBeStarted = false;
    #timeInterval = -1;
    #module = Object();

    constructor(canvas, nick, game_name, draw_script_file_url, frame_rate){
        this.canvas = canvas;
        this.nick = nick;
        this.frame_rate = frame_rate;

        import(/* webpackIgnore: true */ draw_script_file_url).then(
            (obj) => {
                this.#module = obj;
                // Game init
                fetch("/gameinit/", {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        game_name: game_name,
                        nick: nick
                    })
                }).then(
                    (response) => {
                        response.json().then(
                            (init_game_data) => {
                                this.#tmp = this.#module.init(canvas, init_game_data, this.#tmp);
                                if(this.#canBeStarted) this.#timeInterval = setInterval(this.#game, Math.floor(60 / frame_rate) * 1000);
                                this.#canBeStarted = true;
                            }
                        )
                    } 
                ).catch(
                    () => {
                        console.error("Game init error");
                    }
                );
            }
        ).catch(
            () => {
                console.error("Draw script load error");
            }
        );
    }

    finish(game_data){
        clearInterval(this.#timeInterval);
        fetch('/move/', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(game_data)
        }).then((response) => {
            response.json().then(
                (response_json) => {
                    this.#module.finish(this.canvas, this.#tmp, response_json.score);
                }
            )
        });
    }

    start(){
        if(this.#canBeStarted) this.#timeInterval = setInterval(this.#game, Math.floor(60 / frame_rate) * 1000);
        this.#canBeStarted = true;
    }
    
    #game(){
        this.#tmp = this.#module.proceed(this.canvas, this.#tmp, this.finish);
    }
}