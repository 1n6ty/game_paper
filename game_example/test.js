var mousedown; // Переменная ивента нажатия на кнопку мыши

function init(canvas, init_game_data, tmp){
    var ctx = canvas.getContext('2d'); // Контекст канваса
    
    tmp.position = [parseInt(init_game_data.pos[0]), parseInt(init_game_data.pos[0])]; // Получение данных инициализации с сервера
    tmp.finish_x = parseInt(init_game_data.finish_x); // Установка переменной хранилища сессии

    var img = new Image();
    img.onload = () => {
        ctx.drawImage(img, tmp.position[0], tmp.position[1]);
    };
    img.src = '/media/assets/1.png'; // Ссылка, полученная с админки Assets при загрузке
    tmp.img = img; // Сохранение картинки, для отрисовки в proceed

    mousedown = (event) => {
        tmp.position[0] += 10;
        event.preventDefault();
    };
    canvas.addEventListener("mousedown", mousedown); // Установка ивента нажатия на кнопку мыши

    return tmp;
}

function proceed(canvas, tmp, finish_func = (game_data) => {}){
    /*
        Proceeds game and draws on canvas with a frequency of a frame_rate

        Parameters
        ----------
            canvas:
                Object of canvas to draw on
            \n
            tmp:
                Temporary storage for game session
            \n
            finish_func:
                Function to finish game session and send game_data to server
        
        Returns Object
        -------
            tmp:
                Temporary storage for game session
    */
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(tmp.img, tmp.position[0], tmp.position[1]); // Отрисовка на канвасе

    if(tmp.position[0] >= tmp.finish_x) finish_func({finish_x: tmp.finish_x}); // Условие остановки игры, отправка данных для проверки и подсчёта очков

    return tmp;
}

function finish(canvas, tmp, score){
    /*
        Function to draw finish window, deinit canvas and output some statistics

        Parameters
        ----------
            canvas:
                Object of canvas to draw on
            \n
            tmp:
                Temporary storage for game session
            \n
            score:
                score gained from game after server check
        
        Returns None
        -------
    */

    var ctx = canvas.getContext('2d');
    ctx.fillText(`Finish game with score ${score}`, 10, 50); // Вывод итоговых очков после проверки сервером

    canvas.removeEventListener("mousedown", mousedown); // Deinit
}

export {
    init, proceed, finish
};