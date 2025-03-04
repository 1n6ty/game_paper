import os
import telebot
import mysql.connector
import hashlib

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

@bot.message_handler(commands=['start'])
def send_start(msg: telebot.types.Message) -> None:
    try:
        cursor.execute("INSERT INTO Paper_user (nick, score) VALUES (%s, %s)", (hashlib.sha256(msg.from_user.username.encode('utf-8')).hexdigest(), 300))
        db.commit()
    except Exception:
        pass
    markup = telebot.types.ReplyKeyboardMarkup(resize_keyboard=True)
    web_btn = telebot.types.InlineKeyboardButton(text='App', web_app=telebot.types.WebAppInfo(os.getenv('SITE_HOST')))
    markup.add(web_btn)
    bot.send_message(msg.chat.id, "Start", reply_markup=markup)

print("Starting bot!!!")
bot.infinity_polling()