import styles from "./box.module.css";

export const Box = ({children}) => {
    return (
        <div className={styles.container}>
            <div className={styles.box}>
                {children}
            </div>
        </div>

    )
}