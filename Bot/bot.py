import os
import telebot
import mysql.connector
import hashlib

db_config = {
    'host': 'mysql',
    'user': os.getenv('MYSQL_DB_USER'),
    'password': os.getenv('MYSQL_DB_PASSWORD'),
    'database': 'Paperdb'
}

bot = telebot.TeleBot(os.getenv("MINIAPP_BOT_TOKEN"))

@bot.message_handler(commands=['help'])
def send_help(msg: telebot.types.Message) -> None:
    bot.send_message(msg.chat.id, "Help")

@bot.message_handler(commands=["supermilky"])
def send_vk_link(msg: telebot.types.Message) -> None:
    bot.send_message(msg.chat.id, "vk.com/supermilky")

@bot.message_handler(commands=['start'])
def send_start(msg: telebot.types.Message) -> None:
    try:
        with mysql.connector.connect(**db_config) as connection:
            with connection.cursor() as cursor:
                cursor.execute("SELECT start_score FROM Paper_settings WHERE id = 1;")
                start_score = int(cursor.fetchall()[0][0])

                cursor.execute("INSERT INTO Paper_user (tg_id, score) VALUES (%s, %s);", (hashlib.sha256(str(msg.from_user.id).encode('utf-8')).hexdigest(), start_score))
            connection.commit()
    except:
        pass

    bot.send_message(
        msg.chat.id, 
        f"Ну что, {msg.from_user.first_name if msg.from_user.username == None else "@" + msg.from_user.username}, готов погрузиться в игровой мир, прокачать свой скилл и начать собирать ламбиксы? 😉"
    )
    bot.send_message(
        msg.chat.id,
        "Твой путь к призам начинается прямо сейчас! Открывай мини-игры, сканируй «Честный знак», зарабатывай ламбиксы и получай награды.\nЧем больше играешь – тем больше выигрываешь!\nЖми «ЗАПУСК» и погнали! 🚀"
    )

print("Starting bot!!!")
bot.infinity_polling()