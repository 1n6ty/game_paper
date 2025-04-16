import { useEffect, useState } from 'react';
import { TEST } from '../../global';

export const useTelegramAuth = () => {
  const [user, setUser] = useState(null);
  const [authRawData, setAuthRawData] = useState('');

  useEffect(() => {
    const tg = window.Telegram && window.Telegram.WebApp;
    if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
      setAuthRawData(tg.initData);
      setUser({
        userName: tg.initDataUnsafe.user.username,
        firstName: tg.initDataUnsafe.user.first_name,
        lastName: tg.initDataUnsafe.user.last_name,
      });
    } else {
      console.warn('Данные пользователя из Telegram недоступны. Возможно, вы тестируете вне Telegram.');
      if (TEST) {
        console.log("Установка тестового пользователя.");
        setUser({
          userName: 'test_user',
          firstName: 'Test',
          lastName: 'User',
        });
      }
    }
  }, []);

  return { user, authRawData };
};
