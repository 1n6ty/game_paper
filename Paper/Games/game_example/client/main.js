require('./utils'); // Можно подключать файлы

var mousedown; // Переменная ивента нажатия на кнопку мыши

function init(canvas, init_game_data, tmp){
    /*
        Function to init game session

        Parameters
        ----------
            canvas:
                Object of canvas to draw on
            \n
            init_game_data:
                Data from server
            \n
            tmp:
                Temporary storage for game session
        
        Returns Object
        -------
            tmp:
                Temporary storage for game session
    */
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

function finish(canvas, tmp){
    /*
        Function to deinit game session

        Parameters
        ----------
            canvas:
                Object of canvas to draw on
            \n
            tmp:
                Temporary storage for game session
        
        Returns None
        -------
    */

    canvas.removeEventListener("mousedown", mousedown); // Deinit
}

export {
    init, finish
};