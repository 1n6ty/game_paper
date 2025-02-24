import os
import telebot

from dotenv import load_dotenv
load_dotenv()

bot = telebot.TeleBot(os.getenv("BOT_TOKEN"))

@bot.message_handler(commands=['help'])
def send_help(msg: telebot.types.Message) -> None:
    bot.send_message(msg.chat.id, "Help")

@bot.message_handler(commands=['start'])
def send_start(msg: telebot.types.Message) -> None:
    markup = telebot.types.InlineKeyboardMarkup()
    web_btn = telebot.types.InlineKeyboardButton(
        text='Start btn', 
        web_app=telebot.types.WebAppInfo(os.getenv("HOST"))
    )
    markup.add(web_btn)
    
    bot.send_message(msg.chat.id, "Start", reply_markup=markup)

bot.infinity_polling()