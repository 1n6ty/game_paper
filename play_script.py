import numpy as np

def init(perpetual: dict, tmp: dict) -> tuple[dict, dict, dict]:
    """
        Function to init game

        Parameters
        ----------
            perpetual
                Perpetual storage of neccesary info
            \n
            tmp
                Storage of temporary data for a concrete session of a game
            \n
        Returns `tuple[dict_1, dict_2, dict_3]`
        --------
            dict_1
                Always Perpetual dict
            \n
            dict_2
                Always Tmp dict
            \n
            dict_3
                Painting data, neccesary for draw-script on client
    """
    draw_dict: dict = {}

    return (perpetual, tmp, draw_dict)

def finish(perpetual: dict, tmp: dict, moves: dict) -> tuple[dict, int]:
    """
        Function to compute score based on moves and tmp

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
        
        Returns `tuple[dict_1, int]`
        --------
            dict_1
                Always Perpetual dict
            \n
            int
                Score
    """
    score: int = 0

    return (perpetual, score)