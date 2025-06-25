import random
import numpy as np
import secrets


TEST = True

# {str: int}
# Ключ - название поля 
# Значение - число ячеек на поле, которое игроку нужно собрать
FIELDS = {"rect": 24, "plus": 20, "heart": 16}

class LCG:
    def __init__(self, seed):
        self.modulus = 2 ** 31
        self.multiplier = 1103515245
        self.increment = 12345
        self.state = self.hash(seed) % self.modulus

    @staticmethod
    def hash(s):
        h = 5381
        for c in s:
            h = ((h << 5) + h) + ord(c)
            h = h & 0xffffffff
        return h

    def random(self):
        self.state = (self.multiplier * self.state + self.increment) % self.modulus
        return self.state / self.modulus

def init(perpetual: dict, tmp: dict) -> tuple[dict, dict, dict]:
    print("====== ps memory: init func START ======")
    seed = secrets.token_hex(16)

    if TEST:
        maxStepsCount = 20
    else:
        maxStepsCount = random.randint(10, 20)

    randomGen = LCG(seed)
    fieldIndex = int(randomGen.random() * len(FIELDS))
    fieldSize = list(FIELDS.values())[fieldIndex]

    tmp["maxStepsCount"] = str(maxStepsCount)
    tmp["targetItemsCount"] = str(fieldSize)

    init_data = {
        "seed": seed,
        "maxStepsCount": str(maxStepsCount),
        "targetItemsCount":  str(fieldSize),
        "field": str(fieldIndex), 
        "version": "4"
    }

    perpetual["last_seed"] = seed

    print("====== ps memory: init func END ======")
    return (perpetual, tmp, init_data)

def finish(perpetual: dict, tmp: dict, game_data: dict) -> tuple[dict, int]:
    print("====== ps memory: finish func START ======")
    print("Game data:", game_data)

    targetItemsCount = int(tmp.get("targetItemsCount", 0))

    try:
        currentItemsCount = int(game_data.get("score", 0))
    except ValueError:
        print("Score must be an integer!")
        print("Game data:", game_data)
        return (perpetual, 0)

    score = 0
    if currentItemsCount == targetItemsCount:
        score = 10
        print("Winner!")

    print("====== ps memory: finish func END ======")
    return (perpetual, score)
