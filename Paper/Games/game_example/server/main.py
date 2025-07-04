# Этот файл (с именем main) будет использоваться для запуска игры

import numpy as np # Можно использовать numpy для подсчётов

from server.utils import * # Модульный импорт

def init(perpetual: dict, tmp: dict) -> tuple[dict, dict, dict]:
    """
        Function to init game on server and send init_data to client to init game there

        Parameters
        ----------
            perpetual
                Perpetual storage of neccesary info
            \n
            tmp
                Storage of temporary data for a concrete session of a game
            
        Returns `tuple[dict_1, dict_2, dict_3]`
        --------
            dict_1
                Always Perpetual dict
            \n
            dict_2
                Always Tmp dict
            \n
            dict_3
                Initial data to send to client
    """
    # Инициализация данных, которые потом будут отправлены на клиент
    init_data = {
        "pos": [10, 10],
        "finish_x": 300,
        "max_result": int(perpetual.get("max_result", 0)) # Использование переменной постоянного хранилища (лучше всегда получать через get с дефолтным параметром)
    }
    # Все переменные в хранилищах хранятся в виде строк
    # Пример использования переменной хранилища сессии
    tmp["init_score"] = 39;
    tmp["finish_x"] = 300;

    return (perpetual, tmp, init_data) # Все числа тут будут преобразованы в строки

def finish(perpetual: dict, tmp: dict, game_data: dict) -> tuple[dict, int]:
    """
        Function to compute score based on game_data and tmp and check whether the game was played correctly

        Parameters
        -----------
            perpetual
                Perpetual storage of neccesary info
            \n
            tmp
                Storage of temporary data for a concrete session of a game
            \n
            game_data
                Data about game played on client
        
        Returns `tuple[dict_1, int]`
        --------
            dict_1
                Always Perpetual dict
            \n
            int
                Score
    """
    score: int = 0

    if int(game_data["finish_x"]) == int(tmp["finish_x"]): # Проверка на читерство; переменные в виде строк
        score = tmp["init_score"] + int(game_data["finish_x"]) # Если ты уверен, что на этом этапе переменные точно будут в хранилищах, то можно и без get
        # Лучше каждый раз при получении переменной из хранилища преобразовывать её из строки в нужный тип
        perpetual["max_result"] = score # Установка переменной постоянного хранилища

    return (perpetual, score)