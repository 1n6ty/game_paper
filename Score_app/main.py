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

# TODO Mount game_scripts to games

@app.get("/")
def index(req: Request):
    return {"message": "index"}

@app.get("/score/")
def get_score(req: Request):
    params: dict = dict(req.query_params)

    game_file: str | None = params.get("game_file", None)
    nick: str | None = params.get("nick", None)
    if game_file == None or nick == None:
        raise HTTPException(status_code=400, detail='gamefile and nick must be provided')

    try:
        game_module = import_module(
            str(game_file).replace('.py', '').replace('/', '.')
        )
    except Exception:
        raise HTTPException(status_code=400, detail='incorrect gamefile')
    
    perpetual: dict = REDIS.hgetall(f'{nick}:{str(game_file)}')
    tmp: dict = REDIS.hgetall(f'{nick}:tmp')
    move_dict: dict = {k: v for k, v in params.items() if not (k in ["game_file", "nick"])}

    try:
        [new_perpetual, new_tmp, draw_dict, score, win_bit] = game_module.proceed(perpetual, tmp, move_dict)
    except Exception:
        raise HTTPException(status_code=500, detail='Error occured while executing game module')

    REDIS.hmset(f'{nick}:{str(game_file)}', new_perpetual)
    if win_bit:
        REDIS.hmset(f'{nick}:tmp', new_tmp)
    else:
        REDIS.hdel(f'{nick}:tmp')
        REDIS.hdel(nick)

    return {
        "draw": draw_dict,
        "score": score
    }
