import os
from fastapi import FastAPI, HTTPException, Request

from importlib import import_module
import redis

from threading import Timer

REDIS = redis.StrictRedis(host='redis', port=6379, decode_responses=True, db=0)

app = FastAPI()

def clear_old_data() -> None:
    for key in REDIS.scan_iter("*"):
        idle: int = REDIS.object("idletime", key)
        if idle > int(os.getenv("DATA_LIFE_TIME")):
            REDIS.delete(key)
    Timer(float(os.getenv("CLEAR_TIME")), clear_old_data).start()
clear_old_data()

@app.post("gameinit")
def init_game(req: Request):
    params: dict = dict(req.query_params)

    nick: str | None = params.get("nick", None)
    game_name: str | None = params.get("game_name", None)
    if nick == None or game_name == None:
        raise HTTPException(status_code=400, detail='incorrect params')

    game_file = REDIS.get(f"{nick}:game")
    try:
        game_module = import_module(
            str(game_file).replace('.py', '').replace('/', '.')
        )
    except Exception:
        raise HTTPException(status_code=400, detail='incorrect gamefile')
    
    perpetual: dict = REDIS.hgetall(f'{nick}:{str(game_name)}:perpetual')
    tmp: dict = REDIS.hgetall(f'{nick}:tmp')

    try:
        [new_perpetual, new_tmp, draw_dict] = game_module.init(perpetual, tmp)
    except Exception:
        raise HTTPException(status_code=500, detail='Error occured while executing game module')
    
    REDIS.hmset(f'{nick}:{str(game_name)}:perpetual', new_perpetual)
    REDIS.hmset(f'{nick}:tmp', new_tmp)

    return {
        "draw": draw_dict
    }

@app.post("/score/")
def get_score(req: Request):
    params: dict = dict(req.query_params)

    nick: str | None = params.get("nick", None)
    game_name: str | None = params.get("game_name", None)
    if nick == None or game_name == None:
        raise HTTPException(status_code=400, detail='incorrect params')

    game_file = REDIS.get(f"{nick}:game")
    try:
        game_module = import_module(
            str(game_file).replace('.py', '').replace('/', '.')
        )
    except Exception:
        raise HTTPException(status_code=400, detail='incorrect gamefile')
    
    perpetual: dict = REDIS.hgetall(f'{nick}:{str(game_name)}:perpetual')
    tmp: dict = REDIS.hgetall(f'{nick}:tmp')
    move_dict: dict = {k: v for k, v in params.items() if not (k in ["game_name", "nick"])}

    try:
        [new_perpetual, score] = game_module.proceed(perpetual, tmp, move_dict)
    except Exception:
        raise HTTPException(status_code=500, detail='Error occured while executing game module')

    REDIS.hmset(f'{nick}:{str(game_name)}:perpetual', new_perpetual)
    REDIS.delete(f'{nick}:game')

    return {
        "score": score
    }
