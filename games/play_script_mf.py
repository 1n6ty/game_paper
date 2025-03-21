import secrets

# Класс линейного конгруэнтного генератора (LCG), аналогичный клиентскому
class LCG:
    def __init__(self, seed):
        self.modulus = 2 ** 31
        self.multiplier = 1103515245
        self.increment = 12345
        try:
            self.state = int(seed, 16) % self.modulus
        except Exception:
            self.state = 0

    def random(self):
        self.state = (self.multiplier * self.state + self.increment) % self.modulus
        return self.state / self.modulus

def simulate_expected_score(seed, simulation_time_seconds=60):
    """
    Симулирует генерацию препятствий за заданное время
    и возвращает максимально возможное количество труб, которое можно было бы сгенерировать.
    
    Для упрощения будем считать, что:
    - PIPE_INTERVAL = 100 (как на клиенте)
    - FPS предполагаем равным 60
    Таким образом, за 1 секунду теоретически можно сгенерировать (60 / PIPE_INTERVAL) * 60 = 36 препятствий,
    но фактическое число зависит от случайной генерации.
    ВАЖНО: если константы на клиенте изменены, то и здесь необходимо их поменять.
    
    Мы будем симулировать генерацию препятствий до окончания simulation_time_seconds.
    """
    FPS = 60
    PIPE_INTERVAL = 100  # как в клиентском коде
    total_frames = simulation_time_seconds * FPS

    lcg = LCG(seed)
    frame = 0
    pipe_count = 0

    # Простая симуляция: каждое препятствие генерируется, если (frame % PIPE_INTERVAL < 1)
    # (приблизительно, если frame кратен PIPE_INTERVAL)
    while frame < total_frames:
        # Приблизительно, каждые PIPE_INTERVAL кадров генерируется препятствие
        # Для большей детерминированности можно смоделировать генерацию с учетом случайного числа
        if frame % PIPE_INTERVAL < 1:
            pipe_count += 1
        frame += 1
    return pipe_count

def init(perpetual: dict, tmp: dict) -> tuple[dict, dict, dict]:
    """
    Инициализация игры на сервере.
    Генерирует seed для детерминированной генерации уровня.
    """
    seed = secrets.token_hex(16)
    init_data = {
        "seed": seed,
        "best_score": perpetual.get("best_score", "0")
    }
    print("Init data:")
    print(init_data)
    print("Init data====")
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

    # Получаем seed, который мы отправили клиенту
    seed = perpetual.get("last_seed", "")
    if not seed:
        # Если по каким-то причинам seed не получен, отклоняем игру
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
        # Обновляем perpetual, если получен новый рекорд
        best_score = int(perpetual.get("best_score", 0))
        if reported_score > best_score:
            perpetual["best_score"] = str(reported_score)
        return (perpetual, reported_score)
