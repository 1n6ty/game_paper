import os, hashlib, hmac
from operator import itemgetter

BOT_TOKEN = os.getenv("MINIAPP_BOT_TOKEN", None)
secret_key = hmac.new(
    key=b"WebAppData", msg=BOT_TOKEN.encode(), digestmod=hashlib.sha256
).digest()

def verify_authorization(parsed_data: dict) -> bool:
    if "hash" not in parsed_data:
        return False

    hash_ = parsed_data.pop('hash')
    data_check_string = "\n".join(
        f"{k}={v}" for k, v in sorted(parsed_data.items(), key=itemgetter(0))
    )
    calculated_hash = hmac.new(
        key=secret_key, msg=data_check_string.encode(), digestmod=hashlib.sha256
    ).hexdigest()
    return calculated_hash == hash_
