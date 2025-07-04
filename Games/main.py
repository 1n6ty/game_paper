from fastapi import FastAPI, HTTPException, Request

from importlib import import_module
import redis, json, os

REDIS = redis.StrictRedis(host='redis', port=6379, decode_responses=True, db=0)

app = FastAPI()

@app.post("/gameinit/")
async def init_game(req: Request):
    params: dict = await req.json()
    tg_id: str | None = params.get("tg_id", None)
    game_module_name: str | None = params.get("game_module", None)
    game_id: str | None = params.get("game_id", None)

    if tg_id == None or game_module_name == None or game_id == None:
        raise HTTPException(status_code=400, detail='Incorrect params')

    try:
        game_module = import_module(
            str(game_module_name).replace('/', '.') + ".main"
        )
    except Exception:
        raise HTTPException(status_code=400, detail='Incorrect game_module')
    
    perpetual: str | None = REDIS.get(f'{tg_id}:{str(game_id)}:perpetual')
    perpetual: dict = json.loads(perpetual if perpetual else "{}")
    
    tmp: str | None = REDIS.get(f'{tg_id}:{str(game_id)}:tmp')
    tmp: dict = json.loads(tmp if tmp else "{}")

    try:
        [new_perpetual, new_tmp, init_data] = game_module.init(perpetual, tmp)
    except Exception:
        raise HTTPException(status_code=500, detail='Error occured while executing game module')

    REDIS.set(f'{tg_id}:{str(game_id)}:perpetual', json.dumps(new_perpetual))
    REDIS.set(f'{tg_id}:{str(game_id)}:tmp', json.dumps(new_tmp), ex=int(os.getenv("TMP_MAX_LIFE_TIME")))

    return {
        "init": init_data
    }

@app.post("/gamefinish/")
async def finish_game(req: Request):
    params: dict = await req.json()
    tg_id: str | None = params.get("tg_id", None)
    game_module_name: str | None = params.get("game_module", None)
    game_id: str | None = params.get("game_id", None)
    game_data: str | None = params.get("game_data", None)

    if tg_id == None or game_module_name == None or game_id == None or game_data == None:
        raise HTTPException(status_code=400, detail='Incorrect params')

    try:
        game_data: dict = json.loads(game_data)
    except Exception:
        raise HTTPException(status_code=400, detail='game_data should be in json format')
    
    try:
        game_module = import_module(
            str(game_module_name).replace('/', '.') + ".main"
        )
    except Exception:
        raise HTTPException(status_code=400, detail='Incorrect game_module')
    
    perpetual: str | None = REDIS.get(f'{tg_id}:{str(game_id)}:perpetual')
    perpetual: dict = json.loads(perpetual if perpetual else "{}")
    
    tmp: str | None = REDIS.get(f'{tg_id}:{str(game_id)}:tmp')
    tmp: dict = json.loads(tmp if tmp else "{}")

    try:
        [new_perpetual, score] = game_module.finish(perpetual, tmp, game_data)
    except Exception:
        raise HTTPException(status_code=500, detail='Error occured while executing game module')

    REDIS.set(f'{tg_id}:{str(game_id)}:perpetual', json.dumps(new_perpetual))
    
    REDIS.delete(f'{tg_id}:{str(game_id)}:tmp')

    return {
        "score": score
    }
