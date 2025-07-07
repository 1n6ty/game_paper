import random
import numpy as np
import secrets


TEST = False


class LCG:
    def __init__(self, seed):
        self.modulus = 2**31
        self.multiplier = 1103515245
        self.increment = 12345
        self.state = self.hash(seed) % self.modulus

    @staticmethod
    def hash(s):
        h = 5381
        for c in s:
            h = ((h << 5) + h) + ord(c)
            h = h & 0xFFFFFFFF
        return h

    def random(self):
        self.state = (self.multiplier * self.state + self.increment) % self.modulus
        return self.state / self.modulus


def init(perpetual: dict, tmp: dict) -> tuple[dict, dict, dict]:
    print("====== ps match3: init func START ======")
    seed = secrets.token_hex(16)

    if TEST:
        maxStepsCount = 1
        targetItemsCount = 10
    else:
        maxStepsCount = random.randint(10, 20)

        alpha = 2
        beta = maxStepsCount - 9

        beta_sample = np.random.beta(alpha, beta)

        targetItemsCount = 10 + int(round(beta_sample * (20 - 10)))

    tmp["maxStepsCount"] = str(maxStepsCount)
    tmp["targetItemsCount"] = str(targetItemsCount)

    init_data = {
        "seed": seed,
        "maxStepsCount": str(maxStepsCount),
        "targetItemsCount": str(targetItemsCount),
        "version": "13",
    }

    perpetual["last_seed"] = seed

    print("====== ps match3: init func END ======")
    return (perpetual, tmp, init_data)


def finish(perpetual: dict, tmp: dict, game_data: dict) -> tuple[dict, int]:
    print("====== ps match3: finish func START ======")
    print("Game data:", game_data)

    targetItemsCount = int(tmp.get("targetItemsCount", 0))

    try:
        currentItemsCount = int(game_data.get("score", 0))
    except ValueError:
        print("Score must be an integer!")
        print("Game data:", game_data)
        return (perpetual, 0)

    score = 0
    if currentItemsCount >= targetItemsCount:
        score = 10
        print("Winner!")

    print("====== ps match3: finish func END ======")
    return (perpetual, score)
