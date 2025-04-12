import {AuthForm} from "../../components/auth/AuthForm.jsx";
import {RegisterForm} from "../../components/auth/RegisterForm.jsx";
import {useState} from 'react';
import styles from './loginpage.module.css'


export const LoginPage = () => {
    const [isRegister, setIsRegister] = useState(false);

    return (
        // <AuthForm />
        <main className={styles.main}>
            <div className={styles.form}>
                <img className={styles.logo} src='images/logo.svg' alt='logo'/>

                {isRegister ? <RegisterForm/> : <AuthForm/>}

                <div className={styles.switch}>
                    {isRegister ? (
                        <>
                            <span>Уже есть аккаунт?</span>
                            <button className={styles.link} onClick={() => setIsRegister(false)}>
                                Войти
                            </button>
                        </>
                    ) : (
                        <>
                            <span>Нет аккаунта?</span>
                            <button className={styles.link} onClick={() => setIsRegister(true)}>
                                Зарегистрироваться
                            </button>
                        </>
                    )}
                </div>
            </div>
        </main>
    );
};