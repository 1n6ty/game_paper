import secrets
import datetime
from datetime import datetime, timedelta

START_DAY = 0
END_DAY = 7

def calc_time_difference(last_time, now_time):
    return now_time - last_time

def init(perpetual: dict, tmp: dict) -> tuple[dict, dict, dict]:
    last_clicked_datetime_str = perpetual.get("last_clicked_datetime", "")
    stored_days_str = perpetual.get("days", str(START_DAY))

    now = datetime.now()

    if not last_clicked_datetime_str:  # если пользователь НЕ нажимал на стакан или отсчет начался заново
        stored_days = START_DAY
        last_clicked_datetime = "NOT CLICKED"
        time_difference = timedelta(seconds=0)
    else:
        stored_days = int(stored_days_str)
        last_clicked_datetime = datetime.fromisoformat(last_clicked_datetime_str)
        time_difference = calc_time_difference(last_clicked_datetime, now)

    remaining_time = timedelta(hours=24) - time_difference
    remaining_seconds = max(remaining_time.total_seconds(), 0.0)

    print(f"[DEBUG] Last click: {last_clicked_datetime}")
    print(f"[DEBUG] Current time: {now}")
    print(f"[DEBUG] Time difference: {time_difference}")
    print(f"[DEBUG] Remaining seconds (raw): {remaining_seconds}")

    init_data = {
        "days": str(stored_days),
        "time": str(remaining_seconds),
        "version": "9t"
    }

    return (perpetual, tmp, init_data)

def finish(perpetual: dict, tmp: dict, game_data: dict) -> tuple[dict, int]:
    stored_days_str = perpetual.get("days", str(START_DAY))
    consecutive_str = game_data.get("days", stored_days_str)  # число дней, которое пришло с клиента
    glass_clicked = bool(game_data.get("glass_clicked", False))

    print(f"====================END DAYS====================")
    print(f"====================Days perp: {stored_days_str}====================")
    print(f"====================Days spent: {consecutive_str}====================")
    print(f"====================END DAYS====================")

    try:
        consecutive_days = int(consecutive_str)
    except:
        consecutive_days = int(stored_days_str)

    # если число "нажатых" дней вне диапазона разумных значений    
    if not (START_DAY <= consecutive_days <= END_DAY):
        return (perpetual, 0)

    now = datetime.now()

    last_clicked_datetime_str = perpetual.get("last_clicked_datetime", "")

    if glass_clicked and last_clicked_datetime_str:
        last_clicked_datetime = datetime.fromisoformat(last_clicked_datetime_str)
        diff = calc_time_difference(last_clicked_datetime, now)

        # print(f"Осталось времени до НАПОЛНЕНИЯ: {diff}, {timedelta(hours=24)}")

        if diff >= timedelta(hours=24):
            consecutive_days += 1
            perpetual["last_clicked_datetime"] = now.isoformat()

    score = 0
    if consecutive_days >= 7:
        score = 100
        consecutive_days = START_DAY
        # perpetual["last_clicked_datetime"] = now.isoformat()  # сбрасываем последнее время входа

    perpetual["consecutive_days"] = str(consecutive_days)
    
    return (perpetual, score)
