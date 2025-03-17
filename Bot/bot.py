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
    bot.send_message(msg.chat.id, random.choice(for_prize)) # TODO REMOVE

@bot.message_handler(commands=['start'])
def send_start(msg: telebot.types.Message) -> None:
    global for_prize;
    for_prize |= set([msg.from_user.username]) # TODO REMOVE
    cursor.execute("SELECT start_score FROM Paper_settings WHERE id = 1;");
    start_score = int(cursor.fetchall()[0][0])
    try:
        cursor.execute("INSERT INTO Paper_user (nick, score) VALUES (%s, %s);", (hashlib.sha256(msg.from_user.username.encode('utf-8')).hexdigest(), start_score))
        db.commit()
    except Exception:
        pass
    markup = telebot.types.ReplyKeyboardMarkup(resize_keyboard=True)
    web_btn = telebot.types.InlineKeyboardButton(text='App', web_app=telebot.types.WebAppInfo(os.getenv('SITE_HOST')))
    markup.add(web_btn)
    bot.send_message(msg.chat.id, "Start", reply_markup=markup)

print("Starting bot!!!")
bot.infinity_polling()