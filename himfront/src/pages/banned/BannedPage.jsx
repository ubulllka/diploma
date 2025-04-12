import {Link} from "react-router-dom";
import styles from './banned.module.css'
import Button from "@mui/material/Button";

import {CircularProgress} from "@mui/material";
import {Box} from "../../components/box/Box.jsx";
import {useMyProfile} from "../../hooks/useProfiles.js";
import {AUTH_STORAGE_KEY} from "../../constants/auth.js";

export const BannedPage = () => {
    const {data: profileData, isLoading} = useMyProfile(); // Используем хук в компоненте
    function logout () {
        localStorage.removeItem(AUTH_STORAGE_KEY)
        window.location.href = '/login';
    }
    if (isLoading) {
        return (
            <Box>
                <CircularProgress />
            </Box>
        )
    }
    return (

        <Box>
            <img src={"/images/logo.svg"} alt="BannedPage"/>
            <h2 className={styles.h2}>Доступ запрещён</h2>
            <p>Попросите администратора системы дать вам доступ. </p>
            <p>ID лаборатории: {profileData.lab_id}</p>
            <Link to="/profile">Неправильный ID лаборатории?</Link>

            <Button variant="contained" color="success" onClick={logout}>
                Попробовать ешё раз
            </Button>

        </Box>
    )
}
