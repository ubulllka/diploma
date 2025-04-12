import {useState} from 'react';
import {useAuth} from '../../hooks/useAuth';
import {useNavigate} from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import styles from './authform.module.css';


export const AuthForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {login, isLoading} = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login({email, password});

            navigate('/');
        } catch (error) {
            alert('Login failed: ', error);

        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <TextField
                label="Почта"
                type="email"
                variant="standard"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                required
                margin="dense"
                color="success"
            />
            <TextField
                label="Пароль"
                type="password"
                variant="standard"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                required
                margin="dense"
                color="success"
            />
            <Button variant="contained" color="success" type="submit" disabled={isLoading} className={styles.button} >
                {isLoading ? 'Logging in...' : 'Войти'}
            </Button>
        </form>
    );
}