import os
from subprocess import Popen, PIPE
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, HTTPException, Request, Response, status

from importlib import import_module

app = FastAPI()

load_dotenv()
GAMES_DIR = Path(os.getenv('GAMES_DIR'))

# TODO Mount game_scripts to games
gamefiles: dict = {}

@app.post("/update/")
def update_gamefiles():
    global gamefiles
    gamefiles = {
        l: import_module(
            str(GAMES_DIR / l).replace('.py', '').replace('/', '.')
        )
        for l in os.listdir(GAMES_DIR) if l.split('.')[-1] == 'py'
    }
    return {"message": "success"}
update_gamefiles()

@app.get("/score/")
def get_score(req: Request):
    params: dict = dict(req.query_params)

    nick: str | None = params.get("nick", None)
    gamefile: str | None = params.get("gamefile", None)

    if (nick == None) or (gamefile == None):
        raise HTTPException(status_code=400, detail='nick and gamefile must be provided')
    
    game_module = gamefiles.get(gamefile, None)
    if game_module == None:
        raise HTTPException(status_code=400, detail='invalid gamefile')
    
    move_dict = {k: v for k, v in params.items() if not (k in ['nick', 'gamefile'])}
    # TODO Retrieve from redis; if no data - {nick}
    # gamefiles[params["gamefile"]].proceed(env_dict(with nick), move_dict=params(without nick and gamefile)) -> tuple[env_dict(with nick), draw_dict(with score)]
    # also try/except
    return {"message": 1}