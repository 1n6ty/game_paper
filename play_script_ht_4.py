import secrets
import datetime
from datetime import datetime, timedelta

def init(perpetual: dict, tmp: dict) -> tuple[dict, dict, dict]:
    """
    Инициализирует игровой сеанс "Трекер здоровья".
    Проверяем, сколько дней подряд пользователь заходил:
      - Если это первый вход (нет last_visit), ставим consecutiveDays=1
      - Иначе сверяем время последнего входа и текущее время:
          если прошло >= 24 часов -> сброс = 1
          иначе consecutiveDays += 1
      - Если consecutiveDays >= 7 -> выдать билет (здесь или в finish)

    Сохраняем last_visit в perpetual, чтобы не сбрасывалось между сеансами.
    Возвращаем init_game_data, где consecutiveDays -> отдаем клиенту для отрисовки.
    """
    now = datetime.now()
    last_visit_str = perpetual.get("last_visit", "")
    consecutive_str = perpetual.get("consecutiveDays", "1")

    print(f"====================Init DAYS====================")
    print(f"====================Number: {consecutive_str}====================")
    print(f"====================Init DAYS====================")

    try:
        consecutiveDays = int(consecutive_str)
    except ValueError:
        consecutiveDays = 1

    if not last_visit_str:
        # Первый вход
        consecutiveDays = 1
    else:
        # Сравниваем с текущим временем
        last_visit = datetime.fromisoformat(last_visit_str)
        diff = now - last_visit
        print(f"Осталось времени до НАПОЛНЕНИЯ: {diff}, {timedelta(hours=24)}")
        # Если прошло >= 24 часов, сбрасываем счётчик
        if diff >= timedelta(hours=24):
            consecutiveDays += 1

    # Сохраняем новое время входа
    perpetual["last_visit"] = now.isoformat()

    if consecutiveDays > 7:
        consecutiveDays = 7  # при желании можно зафиксировать

    perpetual["consecutiveDays"] = str(consecutiveDays)

    init_data = {
        "consecutiveDays": str(consecutiveDays),
        # Можем передать server_time, если клиент хочет синхронизовать 
        # отображение с серверным временем:
        "server_time": now.isoformat(),
        "version": "4"
    }

    return (perpetual, tmp, init_data)

def finish(perpetual: dict, tmp: dict, game_data: dict) -> tuple[dict, int]:
    """
    Завершение игры (необязательно что-то считать, 
    но можно проверить, что consecutiveDays >= 7, и выдать награду).
    """
    consecutive_str = perpetual.get("consecutiveDays", "0")
    print(f"====================END DAYS====================")
    print(f"====================Number: {consecutive_str}====================")
    print(f"====================END DAYS====================")
    try:
        consecutiveDays = int(consecutive_str)
    except ValueError:
        consecutiveDays = 0

    ticket_issued = 0
    if consecutiveDays >= 7:
        ticket_issued = 1
        consecutiveDays = 1
        perpetual["consecutiveDays"] = str(consecutiveDays)
        perpetual["last_visit"] = ""  # сбрасываем последнее время входа

    return (perpetual, ticket_issued)
