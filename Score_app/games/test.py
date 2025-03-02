import numpy as np

def proceed(perpetual: dict, tmp: dict, moves: dict) -> tuple[dict, dict, dict, int, bool]:
    """
        Function to proceed game data

        Parameters
        -----------
            perpetual
                Perpetual storage of neccesary info
            \n
            tmp
                Storage of temporary data for a concrete session of a game
            \n
            moves
                Data from user about moves he made
        
        Returns `tuple[dict_1, dict_2, dict_3, int, bool]`
        --------
            dict_1
                Always Perpetual dict
            \n
            dict_2
                Always Tmp dict
            \n
            dict_3
                Painting data, neccesary for draw-script on client
            \n
            int
                Score
            \n
            bool
                Win bit `True - stil gamming, False - loose`
    """
    draw_dict: dict = {}
    score: int = 0
    win_bit = True

    return (perpetual, tmp, draw_dict, score, win_bit)