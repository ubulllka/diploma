import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const useAuthStorageWatcher = () => {
    const navigate = useNavigate();
    const [authData, setAuthData] = useState(() => JSON.parse(localStorage.getItem('auth_data')));

    // Функция для отслеживания изменений в localStorage
    const handleStorageChange = (event) => {
        if (event.key === 'auth_data') {
            const currentAuthData = JSON.parse(localStorage.getItem('auth_data'));

            // Если данные authData отсутствуют или изменены, перенаправляем на /login
            if (!currentAuthData) {
               localStorage.removeItem('auth_data');
               navigate("/login");
            }
            setAuthData(currentAuthData);  // Обновляем состояние с новыми данными
        }
    };

    useEffect(() => {
        // Добавляем слушателя события storage
        window.addEventListener('storage', handleStorageChange);

        // Очистка слушателя при размонтировании
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [navigate]);

    // Функция для обновления authData в localStorage
    const updateAuthData = (data) => {
        localStorage.setItem('auth_data', JSON.stringify(data));
        setAuthData(data);  // Обновляем состояние на текущей вкладке
    };

    return { authData, updateAuthData };
};

export default useAuthStorageWatcher;
