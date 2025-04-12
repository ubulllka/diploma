import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import styles from "./authform.module.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";


export const RegisterForm = () => {
    const [formData, setFormData] = useState({
        labId: '',
        lastName: '',
        firstName: '',
        middleName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const { register, isLoading } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Сбрасываем ошибку при изменении поля
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }

        // Особенная проверка для подтверждения пароля
        if (name === 'password' && formData.confirmPassword) {
            setErrors(prev => ({
                ...prev,
                confirmPassword: value !== formData.confirmPassword ? 'Пароли не совпадают' : ''
            }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.labId) newErrors.labId = 'Укажите ID лаборатории';
        if (!formData.lastName) newErrors.lastName = 'Введите фамилию';
        if (!formData.firstName) newErrors.firstName = 'Введите имя';
        if (!formData.email) {
            newErrors.email = 'Введите email';
        } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            newErrors.email = 'Некорректный email';
        }
        if (!formData.password) {
            newErrors.password = 'Введите пароль';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Пароль должен быть не менее 8 символов';
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Пароли не совпадают';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            await register({
                lab_id: +formData.labId,
                last_name: formData.lastName,
                first_name: formData.firstName,
                middle_name: formData.middleName,
                email: formData.email,
                password: formData.password
            });
            navigate('/');
        } catch (error) {
            alert('Ошибка регистрации: ' + error.message);
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <TextField
                name="labId"
                label="ID лаборатории"
                variant="standard"
                value={formData.labId}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.labId}
                helperText={errors.labId}
                margin="dense"
                color="success"
            />

            <TextField
                name="lastName"
                label="Фамилия"
                variant="standard"
                value={formData.lastName}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.lastName}
                helperText={errors.lastName}
                margin="dense"
                color="success"
            />

            <TextField
                name="firstName"
                label="Имя"
                variant="standard"
                value={formData.firstName}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.firstName}
                helperText={errors.firstName}
                margin="dense"
                color="success"
            />

            <TextField
                name="middleName"
                label="Отчество"
                variant="standard"
                value={formData.middleName}
                onChange={handleChange}
                fullWidth
                margin="dense"
                color="success"
            />

            <TextField
                name="email"
                label="Почта"
                type="email"
                variant="standard"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.email}
                helperText={errors.email}
                margin="dense"
                color="success"
            />

            <TextField
                name="password"
                label="Пароль"
                type="password"
                variant="standard"
                value={formData.password}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.password}
                helperText={errors.password}
                margin="dense"
                color="success"
            />

            <TextField
                name="confirmPassword"
                label="Повторите пароль"
                type="password"
                variant="standard"
                value={formData.confirmPassword}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                margin="dense"
                color="success"
            />

            <Button
                variant="contained"
                color="success"
                type="submit"
                disabled={isLoading}
                sx={{ mt: 3 }}
            >
                {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
            </Button>
        </form>
    );
};