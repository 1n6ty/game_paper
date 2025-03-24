import os
import telebot
import mysql.connector
import hashlib

for_prize = set() # TODO REMOVE
prize_user2chat = dict()
info_user2chat = dict()

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
    winner = random.choice(list(for_prize))
    chat_win_id = prize_user2chat[winner]
    bot.send_message(chat_win_id, "🎉 Поздравляем победителя розыгрыша колонки, который состоялся на вебинаре «Геймификация упаковки»!\n\nВаша удача стала частью нашего цифрового квеста — как и обещали, игровые механики работают! 🎮 Теперь вы не только обладатель стильной колонки, но и живой пример того, как геймификация вовлекает аудиторию: сканирование QR-кода, розыгрыш во время эфира и мгновенная радость победы — всё это элементы, о которых эксперт Сергей Леонидович Кальсин рассказывал на вебинаре\n\nУчастники уже изучают чек-листы по созданию «умной» упаковки, а вы наслаждайтесь музыкой и помните: ваша победа — это первый шаг к тому, чтобы ваш бренд однажды тоже заставил клиентов улыбаться от неожиданного выигрыша! 🎶 Оставайтесь на связи — впереди новые вершины! 💡\n\nПАО «Ламбумиз»")
    for k, v in prize_user2chat:
        if v != chat_win_id:
            bot.send_message(v, "🚀 Спасибо, что стали частью цифрового квеста на вебинаре «Геймификация упаковки»!\n\nПусть сегодня колонка отправилась к другому победителю, но ваше участие — уже шаг к новым возможностям Вашей упаковки!\n\nПока победитель наслаждается музыкой, вы можете глубже погрузиться в тему: изучайте чек-листы по «умной» упаковке, пробуйте игровые механики в данном web-приложении, и скоро именно Ваш бренд заставит клиентов улыбнуться от неожиданного выигрыша! 💡  \n\nОставайтесь с нами — вместе мы превратим упаковку в игру, где в выигрыше все! 🎮✨\n\nПАО «Ламбумиз»")
        bot.send_document(v, 'https://milkclub.lambumiz.ru/media/assets/bot/file.txt')
    bot.send_message(msg.chat.id, f'Победитель - {winner}\nИнфо - {info_user2chat[winner]}') # TODO REMOVE

@bot.message_handler(commands=['start'])
def send_start(msg: telebot.types.Message) -> None:
    global for_prize;
    for_prize |= set([msg.from_user.first_name if msg.from_user.username == None else "@" + msg.from_user.username]) # TODO REMOVE
    prize_user2chat[msg.from_user.first_name if msg.from_user.username == None else "@" + msg.from_user.username] = msg.chat.id
    info_user2chat[msg.from_user.first_name if msg.from_user.username == None else "@" + msg.from_user.username] = msg.from_user.to_json()
    try:
        cursor.execute("SELECT start_score FROM Paper_settings WHERE id = 1;");
        start_score = int(cursor.fetchall()[0][0])
    except:
        pass
    finally:
        db.commit()
    try:
        cursor.execute("INSERT INTO Paper_user (tg_id, score) VALUES (%s, %s);", (hashlib.sha256(str(msg.from_user.id).encode('utf-8')).hexdigest(), start_score))
    except Exception:
        pass
    finally:
        db.commit()

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