import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Box } from '../../components/box/Box.jsx';
import { useMyProfile, useUpdateMyProfile } from "../../hooks/useProfiles.js";
import { CircularProgress } from "@mui/material";
import {useNavigate} from "react-router-dom";
import useAuthStorageWatcher from "../../hooks/useAuthStorageWatcher.js";

export const ProfilePage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        labId: '',
        lastName: '',
        firstName: '',
        middleName: '',
        email: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [errors, setErrors] = useState({});

    // Заполняем форму данными пользователя при загрузке
    const { data: profileData, isLoading } = useMyProfile();
    const { mutate, isLoading: isUpdating, isSuccess, error } = useUpdateMyProfile();

    useEffect(() => {
        if (profileData) {
            setFormData({
                labId: profileData.lab_id || '',
                lastName: profileData.last_name || '',
                firstName: profileData.first_name || '',
                middleName: profileData.middle_name || '',
                email: profileData.email || ''
            });
        }
    }, [profileData]);

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

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleEditToggle = () => {
        if (isEditing) {
            // Если был режим редактирования, пытаемся сохранить
            if (validate()) {
                // Отправляем данные на сервер для сохранения
                mutate( {
                    lab_id: +formData.labId,
                    last_name: formData.lastName,
                    first_name: formData.firstName,
                    middle_name: formData.middleName,
                    email: formData.email,
                });
                setIsEditing(false);
            }
        } else {
            setIsEditing(true);
        }
    };

    if (isLoading) {
        return (
            <Box>
                <CircularProgress />
            </Box>
        )
    }

    return (
        <Box>
            <h2>Профиль</h2>
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
                disabled={!isEditing}
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
                disabled={!isEditing}
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
                disabled={!isEditing}
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
                disabled={!isEditing}
            />

            <TextField
                name="email"
                label="Почта"
                type="email"
                variant="standard"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.email}
                helperText={errors.email}
                margin="dense"
                color="success"
                disabled={!isEditing}
            />

            <div>
                <Button
                    variant="contained"
                    color={isEditing ? "primary" : "success"}
                    onClick={handleEditToggle}
                    sx={{ mt: 3 }}
                >
                    {isEditing ? 'Сохранить' : 'Редактировать'}
                </Button>

                {isEditing && (
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={() => setIsEditing(false)}
                        sx={{ mt: 3, ml: 2 }}
                    >
                        Отмена
                    </Button>
                )}
            </div>

            <Button variant="contained" color="error" onClick={ () => {
                localStorage.removeItem('auth_data')
                navigate("/login")
            }}>Выход</Button>
        </Box>
    );
};
