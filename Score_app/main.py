import os
import json
from fastapi import FastAPI, HTTPException, Request

from importlib import import_module
import redis
import hashlib
import random

from threading import Timer

BASE_GAMES = 'games/'
REDIS = redis.StrictRedis(host='redis', port=6379, decode_responses=True, db=0)

app = FastAPI()

def clear_old_data() -> None:
    for key in REDIS.scan_iter("*"):
        idle: int = REDIS.object("idletime", key)
        if idle > int(os.getenv("DATA_LIFE_TIME")):
            REDIS.delete(key)
    Timer(float(os.getenv("CLEAR_TIME")), clear_old_data).start()
clear_old_data()

@app.post("/gameinit/")
async def init_game(req: Request):
    params: dict = await req.json()
    nick: str | None = params.get("nick", None)
    game_name: str | None = params.get("game_name", None)
    if nick == None or game_name == None:
        raise HTTPException(status_code=400, detail='incorrect params')

    game_file = REDIS.get(f"{nick}:game")
    try:
        game_module = import_module(
            str(BASE_GAMES + game_file).replace('.py', '').replace('/', '.')
        )
    except Exception:
        raise HTTPException(status_code=400, detail='incorrect gamefile')
    
    perpetual: str | None = REDIS.get(f'{nick}:{str(game_name)}:perpetual')
    perpetual: str = perpetual if perpetual else "{}"
    perpetual: dict = json.loads(perpetual)
    
    tmp: str | None = REDIS.get(f'{nick}:tmp')
    tmp: str = tmp if tmp else "{}"
    tmp: dict = json.loads(tmp)

    try:
        [new_perpetual, new_tmp, init_data] = game_module.init(perpetual, tmp)
    except Exception:
        raise HTTPException(status_code=500, detail='Error occured while executing game module')
    
    new_tmp["secret_key"] = hashlib.sha256(str(random.randint(0, int(10e6))).encode('utf-8')).hexdigest()
    init_data["secret_key"] = new_tmp["secret_key"]

    REDIS.set(f'{nick}:{str(game_name)}:perpetual', json.dumps(new_perpetual))
    REDIS.set(f'{nick}:tmp', json.dumps(new_tmp))

    return {
        "init": init_data
    }

@app.post("/gamefinish/")
async def finish_game(req: Request):
    params: dict = await req.json()
    nick: str | None = params.get("nick", None)
    game_name: str | None = params.get("game_name", None)
    if nick == None or game_name == None:
        raise HTTPException(status_code=400, detail='incorrect params')

    game_file = REDIS.get(f"{nick}:game")
    try:
        game_module = import_module(
            str(BASE_GAMES + game_file).replace('.py', '').replace('/', '.')
        )
    except Exception:
        raise HTTPException(status_code=400, detail='incorrect gamefile')
    
    perpetual: str | None = REDIS.get(f'{nick}:{str(game_name)}:perpetual')
    perpetual: str = perpetual if perpetual else "{}"
    perpetual: dict = json.loads(perpetual)
    
    tmp: str | None = REDIS.get(f'{nick}:tmp')
    tmp: str = tmp if tmp else "{}"
    tmp: dict = json.loads(tmp)

    game_data: dict = {k: v for k, v in params.items() if not (k in ["game_name", "nick"])}

    if game_data["secret_key"] != tmp["secret_key"]:
        raise HTTPException(status_code=401, detail='secret_key didn\'t match')

    try:
        [new_perpetual, score] = game_module.finish(perpetual, tmp, game_data)
    except Exception:
        raise HTTPException(status_code=500, detail='Error occured while executing game module')

    REDIS.set(f'{nick}:{str(game_name)}:perpetual', json.dumps(new_perpetual))
    REDIS.delete(f'{nick}:game')

    return {
        "score": score
    }
