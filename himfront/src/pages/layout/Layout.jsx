import {Header} from "./Header.jsx";
import styles from './header.module.css'

export const Layout = ({ children }) => {
    return (
        <>
            <Header />
            <main className={styles.main} >
                {children}
            </main>
        </>
    );
};
