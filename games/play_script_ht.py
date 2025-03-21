"""
play_script.py
Трекер здоровья - серверная логика:
1. Функция init проверяет, пропущен ли день, и обновляет счетчик consecutiveDays.
2. Функция finish может использоваться для итоговой проверки или выдачи билета.
Храним last_visit и consecutiveDays в perpetual, чтобы не терять при перезаходе.
"""

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
    consecutive_str = perpetual.get("consecutiveDays", "0")

    try:
        consecutiveDays = int(consecutive_str)
    except ValueError:
        consecutiveDays = 0

    if not last_visit_str:
        # Первый вход
        consecutiveDays = 1
    else:
        # Сравниваем с текущим временем
        last_visit = datetime.fromisoformat(last_visit_str)
        diff = now - last_visit
        # Если прошло >= 24 часов, сбрасываем счётчик
        if diff >= timedelta(hours=24):
            consecutiveDays = 1
        else:
            consecutiveDays += 1

    # Сохраняем новое время входа
    perpetual["last_visit"] = now.isoformat()
    # Сохраняем новое значение consecutiveDays
    # (Если нужно, можно сбрасывать, если уже есть билет, 
    #  но это зависит от вашей логики)
    if consecutiveDays > 7:
        consecutiveDays = 7  # при желании можно зафиксировать

    # Пример: если consecutiveDays == 7 -> пользователь получает билет
    # можно хранить это в perpetual["ticket_issued"] = "yes" 
    # (логика зависит от ваших требований)

    perpetual["consecutiveDays"] = str(consecutiveDays)

    init_data = {
        "consecutiveDays": str(consecutiveDays),
        # Можем передать server_time, если клиент хочет синхронизовать 
        # отображение с серверным временем:
        "server_time": now.isoformat()
    }

    return (perpetual, tmp, init_data)

def finish(perpetual: dict, tmp: dict, game_data: dict) -> tuple[dict, int]:
    """
    Завершение игры (необязательно что-то считать, 
    но можно проверить, что consecutiveDays >= 7, и выдать награду).

    game_data может содержать { "score": ..., ... } - но здесь не нужно.

    Возвращаем (perpetual, int) - int = 1, если пользователь получил билет, иначе 0.
    """
    consecutive_str = perpetual.get("consecutiveDays", "0")
    try:
        consecutiveDays = int(consecutive_str)
    except ValueError:
        consecutiveDays = 0

    ticket_issued = 0
    if consecutiveDays >= 7:
        # допустим, выдаём билет (1)
        ticket_issued = 1
        # при желании сбрасываем счётчик
        # consecutiveDays = 0
        # perpetual["consecutiveDays"] = "0"

    return (perpetual, ticket_issued)
