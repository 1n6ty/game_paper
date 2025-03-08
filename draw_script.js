function init(canvas, init_game_data, tmp){
    /*
        Inits game session

        Parameters
        ----------
            canvas:
                Object of canvas to draw on
            \n
            init_game_data:
                Initialization data from server
            \n
            tmp:
                Temporary storage for game session

        Returns Object
        -------
            tmp:
                Temporary storage for game session
    */

    return tmp;
}

function proceed(canvas, tmp, finish_func){
    /*
        Proceeds game and draws on canvas

        Parameters
        ----------
            canvas:
                Object of canvas to draw on
            \n
            tmp:
                Temporary storage for game session
            \n
            finish_func:
                Function to finish game session and send tmp data to server
        
        Returns Object
        -------
            tmp:
                Temporary storage for game session
    */

    return tmp;
}

function finish(canvas, tmp, score){
    /*
        Function to draw finish window and output some statistics

        Parameters
        ----------
            canvas:
                Object of canvas to draw on
            \n
            tmp:
                Temporary storage for game session
            \n
            score:
                score gained from game
        
        Returns None
        -------
    */

}

export {
    init, proceed, finish
};