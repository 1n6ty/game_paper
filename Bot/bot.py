import os
import telebot
import mysql.connector
import hashlib

from dotenv import load_dotenv
load_dotenv()

db = mysql.connector.connect(
    host="localhost",
    user=os.getenv('DB_USER'),
    password=os.getenv('DB_PASSWORD'),
    database='Paperdb'
)
cursor = db.cursor()

bot = telebot.TeleBot(os.getenv("BOT_TOKEN"))

@bot.message_handler(commands=['help'])
def send_help(msg: telebot.types.Message) -> None:
    bot.send_message(msg.chat.id, "Help")

@bot.message_handler(commands=['start'])
def send_start(msg: telebot.types.Message) -> None:
    try:
        cursor.execute("INSERT INTO Paper_user (nick, score) VALUES (%s, %s)", (hashlib.sha256(msg.from_user.username.encode('utf-8')).hexdigest(), int(os.getenv("START_SCORE"))))
        db.commit()
    except Exception:
        pass
    markup = telebot.types.ReplyKeyboardMarkup(resize_keyboard=True)
    web_btn = telebot.types.InlineKeyboardButton(text='App', web_app=telebot.types.WebAppInfo(os.getenv('HOST')))
    markup.add(web_btn)
    bot.send_message(msg.chat.id, "Start", reply_markup=markup)

bot.infinity_polling()