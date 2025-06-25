import secrets
import datetime
from datetime import datetime, timedelta

START_DAY = 0
END_DAY = 7

def calc_time_difference(last_time, now_time):
    return now_time - last_time

def init(perpetual: dict, tmp: dict) -> tuple[dict, dict, dict]:
    print("====== ps healthTracker: init func START ======")

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
        "version": "9d"
    }

    print("====== ps healthTracker: init func END ======")
    return (perpetual, tmp, init_data)

def finish(perpetual: dict, tmp: dict, game_data: dict) -> tuple[dict, int]:
    print("====== ps healthTracker: finish func START ======")
    print("Game data:", game_data)

    stored_days_str = perpetual.get("days", str(START_DAY))
    consecutive_str = game_data.get("days", stored_days_str)  # число дней, которое пришло с клиента
    glass_clicked = bool(game_data.get("glass_clicked", False))

    print(f"====================END DAYS====================")
    print(f"====================Days perp: {stored_days_str}====================")
    print(f"====================Days spent: {consecutive_str}====================")
    print(f"====================END DAYS====================")

    try:
        consecutive_days_count = int(consecutive_str)
    except:
        print("Consecutive days count must be an integer!")
        print("Game data:", game_data)
        return (perpetual, 0)

    # если число "нажатых" дней вне диапазона разумных значений    
    if not (START_DAY <= consecutive_days_count <= END_DAY):
        print(f"Consecutive days count must be between {START_DAY} and {END_DAY}!")
        print("Game data:", game_data)
        return (perpetual, 0)

    now = datetime.now()

    last_clicked_datetime_str = perpetual.get("last_clicked_datetime", "")

    if glass_clicked and last_clicked_datetime_str:
        last_clicked_datetime = datetime.fromisoformat(last_clicked_datetime_str)
        diff = calc_time_difference(last_clicked_datetime, now)

        # print(f"Осталось времени до НАПОЛНЕНИЯ: {diff}, {timedelta(hours=24)}")

        if diff >= timedelta(hours=24):
            consecutive_days_count += 1
            perpetual["last_clicked_datetime"] = now.isoformat()

    score = 0
    if consecutive_days_count >= 7:
        score = 100
        consecutive_days_count = START_DAY
        # perpetual["last_clicked_datetime"] = now.isoformat()  # сбрасываем последнее время входа

    perpetual["days"] = str(consecutive_days_count)
    
    print("====== ps healthTracker: finish func END ======")
    return (perpetual, score)
