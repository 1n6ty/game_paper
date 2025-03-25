import secrets

# Класс линейного конгруэнтного генератора (LCG), аналогичный клиентскому
class LCG:
    def __init__(self, seed):
        self.modulus = 2 ** 31
        self.multiplier = 1103515245
        self.increment = 12345
        # Используем хэш-функцию для seed, чтобы разные seed давали разные начальные состояния
        self.state = self.hash(seed) % self.modulus

    @staticmethod
    def hash(s):
        h = 5381
        for c in s:
            h = ((h << 5) + h) + ord(c)  # h * 33 + ord(c)
            h = h & 0xffffffff  # ограничение до 32 бит
        return h

    def random(self):
        self.state = (self.multiplier * self.state + self.increment) % self.modulus
        return self.state / self.modulus


def simulate_expected_score(seed, simulation_time_seconds=60):
    """
    Симулирует генерацию препятствий за заданное время с использованием
    детерминированного генератора случайных чисел LCG.
    
    Для упрощения:
      - PIPE_INTERVAL = 100 (как на клиенте)
      - FPS предполагается равным 60.
    Таким образом, ожидаемое число препятствий = (FPS * simulation_time_seconds) / PIPE_INTERVAL.
    
    Используется LCG для генерации случайных чисел. Для каждого кадра, если
    lcg.random() < (1/PIPE_INTERVAL), считается, что сгенерировалось препятствие.
    """
    FPS = 60
    PIPE_INTERVAL = 100  # должно совпадать с клиентским значением
    total_frames = simulation_time_seconds * FPS

    lcg = LCG(seed)
    pipe_count = 0
    threshold = 1 / PIPE_INTERVAL

    for _ in range(total_frames):
        if lcg.random() < threshold:
            pipe_count += 1

    return pipe_count


def init(perpetual: dict, tmp: dict) -> tuple[dict, dict, dict]:
    """
    Инициализация игры на сервере.
    Генерирует seed для детерминированной генерации уровня.
    """
    seed = secrets.token_hex(16)
    number_entrances = perpetual.get("number_entrances", "0")
    init_data = {
        "seed": seed,
        "best_score": perpetual.get("best_score", "0"),
        "entrances": number_entrances,
        "version": "2"
    }
    print(init_data, flush=True)

    perpetual["last_seed"] = seed
    tmp["init_score"] = "0"
    return (perpetual, tmp, init_data)

def finish(perpetual: dict, tmp: dict, game_data: dict) -> tuple[dict, int]:
    """
    Функция finish выполняет проверку честности игры.
    Она получает game_data от клиента (например, {"score": <int>, ...})
    и пересчитывает максимально возможное количество препятствий, которое могло быть сгенерировано,
    используя seed из perpetual.
    
    Если полученный счет превышает ожидаемый, то игра считается нечестной (возвращается 0),
    иначе возвращается фактический счет.
    """
    try:
        reported_score = int(game_data.get("score", 0))
    except ValueError:
        reported_score = 0

    seed = perpetual.get("last_seed", "")
    if not seed:
        return (perpetual, 0)

    # Симулируем ожидаемый счет за, например, 60 секунд игры (это параметр, который можно настроить)
    # TODO ПОМЕНЯТЬ
    expected_score = simulate_expected_score(seed, simulation_time_seconds=60)

    print(f"====================SCORE====================")
    print(f"====================Reported: {reported_score}====================")
    print(f"====================Expected: {expected_score}====================")
    print(f"====================SCORE====================")

        

    # Если отчетный счет больше, чем максимально возможный по нашей симуляции, то
    # считаем, что данные подделаны
    if reported_score > expected_score:
        return (perpetual, 0)
    else:
        number_entrances = int(perpetual.get("number_entrances", "0"))
        perpetual["number_entrances"] = str(number_entrances + 1)

        # Обновляем perpetual, если получен новый рекорд
        best_score = int(perpetual.get("best_score", 0))
        if reported_score > best_score:
            perpetual["best_score"] = str(reported_score)
        return (perpetual, reported_score)
    

