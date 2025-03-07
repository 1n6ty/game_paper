class Game {
    #tmp = {};
    #timeInterval = -1;
    #module = Object();

    constructor(canvas, nick, game_name, draw_script_file_url, frame_rate){
        this.canvas = canvas;
        this.nick = nick;

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
                                this.#timeInterval = setInterval(this.#game, Math.floor(60 / frame_rate) * 1000);
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

    finish(){
        clearInterval(this.#timeInterval);
        fetch('/move/', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    }

    #game(){
        this.#tmp = this.#module.proceed(this.canvas, this.#tmp, this.finish);
    }
}