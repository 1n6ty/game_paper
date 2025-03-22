import os
import telebot
import mysql.connector
import hashlib

for_prize = set() # TODO REMOVE

db = mysql.connector.connect(
    host='mysql',
    user=os.getenv('MYSQL_DB_USER'),
    password=os.getenv('MYSQL_DB_PASSWORD'),
    database='Paperdb'
)
cursor = db.cursor()

bot = telebot.TeleBot(os.getenv("MINIAPP_BOT_TOKEN"))

@bot.message_handler(commands=['help'])
def send_help(msg: telebot.types.Message) -> None:
    bot.send_message(msg.chat.id, "Help")

@bot.message_handler(commands=['prize'])
def send_prize(msg: telebot.types.Message) -> None:
    import random
    bot.send_message(msg.chat.id, random.choice(list(for_prize))) # TODO REMOVE

@bot.message_handler(commands=['start'])
def send_start(msg: telebot.types.Message) -> None:
    global for_prize;
    for_prize |= set([msg.from_user.username]) # TODO REMOVE
    try:
        cursor.execute("SELECT start_score FROM Paper_settings WHERE id = 1;");
        start_score = int(cursor.fetchall()[0][0])
    except:
        pass
    finally:
        db.commit()
    try:
        cursor.execute("INSERT INTO Paper_user (nick, score) VALUES (%s, %s);", (hashlib.sha256(msg.from_user.username.encode('utf-8')).hexdigest(), start_score))
    except Exception:
        pass
    finally:
        db.commit()

    bot.send_message(
        msg.chat.id, 
        f"Ну что, @{msg.from_user.username}, готов погрузиться в игровой мир, прокачать свой скилл и начать собирать ламбиксы? 😉"
    )
    bot.send_message(
        msg.chat.id,
        "Твой путь к призам начинается прямо сейчас! Открывай мини-игры, сканируй «Честный знак», зарабатывай ламбиксы и получай награды.\nЧем больше играешь – тем больше выигрываешь!\nЖми «ЗАПУСК» и погнали! 🚀"
    )

print("Starting bot!!!")
bot.infinity_polling()