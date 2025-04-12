import styles from './header.module.css'
import {NavLink} from "react-router-dom";
import {useMediaQuery} from "@mui/material";
import {useAuth} from "../../hooks/useAuth.js";
import {useUpdateSubstance} from "../../hooks/useSubstances.js";

export const Header = () => {
    const {isActive, isManager, isAdmin} = useAuth()
    const isMobile = useMediaQuery('(max-width:768px)');
    return (
        <header className={styles.header}>
            { !isMobile && <img className={styles.logo} src="/images/logo.svg"/> }
            <nav className={styles.nav}>
                <NavLink className={({ isActive }) =>
                    isActive ? `${styles.link} ${styles.active}` : styles.link
                } to="/">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_58_123)">
                            <path
                                d="M28.5878 25.1572H26.781L26.1407 24.5397C28.3819 21.9325 29.7313 18.5477 29.7313 14.8656C29.7313 6.65523 23.076 0 14.8656 0C6.65523 0 0 6.65523 0 14.8656C0 23.076 6.65523 29.7313 14.8656 29.7313C18.5477 29.7313 21.9325 28.3819 24.5397 26.1407L25.1572 26.781V28.5878L36.5923 40L40 36.5923L28.5878 25.1572ZM14.8656 25.1572C9.17095 25.1572 4.57404 20.5603 4.57404 14.8656C4.57404 9.17095 9.17095 4.57404 14.8656 4.57404C20.5603 4.57404 25.1572 9.17095 25.1572 14.8656C25.1572 20.5603 20.5603 25.1572 14.8656 25.1572Z"
                                fill="#F3F3F3"/>
                        </g>
                        <defs>
                            <clipPath id="clip0_58_123">
                                <rect width="40" height="40" fill="white"/>
                            </clipPath>
                        </defs>
                    </svg>
                    <span>Поиск</span>
                </NavLink>

                {isActive && (
                    <NavLink className={({ isActive }) =>
                        isActive ? `${styles.link} ${styles.active}` : styles.link
                    } to="/usage">
                        <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_58_125)">
                                <path
                                    d="M15.2209 2.26101C14.8721 2.45061 14.8038 2.62504 14.8038 3.39861C14.8038 4.3011 14.9631 4.79406 15.456 5.40078C16.1765 6.28052 16.131 5.98475 16.131 9.94358C16.131 13.7659 16.1083 13.9934 15.6456 15.3282C15.5243 15.6619 13.598 20.4019 11.3531 25.87C9.10824 31.3304 7.21224 36.0249 7.12882 36.2979C6.57519 38.2546 7.86447 40.4084 9.87422 40.8787C10.3065 40.9848 11.7095 41 20.8027 41C27.5904 41 31.3824 40.9697 31.6478 40.9242C32.9978 40.6663 34.2036 39.5211 34.5601 38.156C34.7042 37.5948 34.7042 36.9122 34.5677 36.3662C34.507 36.1311 32.5807 31.3683 30.2827 25.7789C27.9924 20.1895 26.0281 15.3282 25.9143 14.9793C25.5655 13.8797 25.4972 13.0454 25.4972 9.78432C25.4972 6.37911 25.5048 6.33361 26.1039 5.55246C26.7334 4.73338 26.8168 4.51345 26.8472 3.63371C26.8851 2.67054 26.8472 2.51128 26.5362 2.32168C26.3011 2.17758 26.1267 2.17 20.8331 2.17C17.0108 2.17758 15.3271 2.20033 15.2209 2.26101ZM25.3456 3.86881C25.3456 3.95982 25.2394 4.17975 25.118 4.33902C24.6099 4.99124 24.2838 5.54487 24.1549 5.94682C24.0335 6.34119 24.0184 6.72039 24.0184 9.9815C24.0259 14.6684 23.9653 14.3575 25.6868 18.5666L26.6121 20.8266H20.8482C15.4029 20.8266 15.092 20.819 15.1299 20.6901C15.1451 20.6218 15.5622 19.598 16.0476 18.4149C17.6706 14.4864 17.6175 14.7215 17.663 10.209C17.7009 5.92407 17.6781 5.77998 16.7681 4.62721C16.5633 4.36935 16.3737 4.05083 16.3509 3.9219L16.3054 3.68679H20.8255H25.3456V3.86881ZM30.1841 29.5103L33.1116 36.6392L33.1191 37.2459C33.1191 37.7616 33.0812 37.9133 32.9144 38.2394C32.8006 38.4594 32.5428 38.7703 32.3456 38.9372C31.663 39.5287 32.3759 39.4908 20.6435 39.468L10.2155 39.4453L9.78321 39.2329C9.03998 38.8689 8.5091 38.0123 8.5091 37.216V36.9046C8.36929 37.2459 8.96591 35.7418 8.5091 36.9046C9.15121 35.3373 8.5445 36.8844 9.15121 35.3373C9.47198 34.5081 9.52536 34.3109 9.15121 35.3373C8.76014 36.2979 9.15121 35.3525 9.15121 35.3373C9.15121 35.3145 9.29784 34.8646 9.52536 34.3109L9.93489 33.3023C10.7371 31.3824 10.0014 33.1555 10.6326 31.6717C9.8488 33.5143 10.9725 30.7928 10.6326 31.6717C10.6326 31.702 10.7691 31.2925 10.6326 31.6717C10.6326 31.6414 10.8146 31.1787 11.0346 30.6403L11.5781 29.2701C11.0346 30.6403 11.9598 28.4006 11.5781 29.2701C12.1748 27.8792 11.1926 30.2626 12.0963 28.0693C11.0877 30.5135 13.105 25.6252 12.0963 28.0693L12.5134 27.0227L12.9382 25.9837C12.8847 26.1146 13.103 25.59 12.9382 25.9837C13.6207 24.3532 12.8824 26.12 13.6005 24.4164C13.6508 24.276 13.7247 24.0906 13.6005 24.4164C13.3859 24.9248 13.5828 24.4442 13.6207 24.3532C13.6435 24.2925 13.8331 23.8147 14.053 23.2914L14.4398 22.3434L20.8482 22.3586L27.2567 22.3813L30.1841 29.5103Z"
                                    fill="#F3F3F3"/>
                                <path
                                    d="M8.5091 36.9046V37.216C8.5091 38.0123 9.03998 38.8689 9.78321 39.2329L10.2155 39.4453L20.6435 39.468C32.3759 39.4908 31.663 39.5287 32.3456 38.9372C32.5428 38.7703 32.8006 38.4594 32.9144 38.2394C33.0812 37.9133 33.1191 37.7616 33.1191 37.2459L33.1116 36.6392L30.1841 29.5103L27.2567 22.3813L20.8482 22.3586L14.4398 22.3434L14.053 23.2914C13.8331 23.8147 13.6435 24.2925 13.6207 24.3532C13.5828 24.4442 13.3859 24.9248 13.6005 24.4164M8.5091 36.9046C8.96591 35.7418 8.36929 37.2459 8.5091 36.9046ZM8.5091 36.9046C9.15121 35.3373 8.5445 36.8844 9.15121 35.3373M9.15121 35.3373C9.47198 34.5081 9.52536 34.3109 9.15121 35.3373ZM9.15121 35.3373C8.76014 36.2979 9.15121 35.3525 9.15121 35.3373ZM9.15121 35.3373C9.15121 35.3145 9.29784 34.8646 9.52536 34.3109L9.93489 33.3023C10.7371 31.3824 10.0014 33.1555 10.6326 31.6717M10.6326 31.6717C10.9725 30.7928 9.8488 33.5143 10.6326 31.6717ZM10.6326 31.6717C10.7691 31.2925 10.6326 31.702 10.6326 31.6717ZM10.6326 31.6717C10.6326 31.6414 10.8146 31.1787 11.0346 30.6403L11.5781 29.2701M11.5781 29.2701C11.9598 28.4006 11.0346 30.6403 11.5781 29.2701ZM11.5781 29.2701C12.1748 27.8792 11.1927 30.2626 12.0963 28.0693M12.0963 28.0693C11.0877 30.5135 13.105 25.6252 12.0963 28.0693ZM12.0963 28.0693L12.5134 27.0227L12.9382 25.9837M12.9382 25.9837C13.103 25.59 12.8847 26.1146 12.9382 25.9837ZM12.9382 25.9837C13.6207 24.3532 12.8824 26.12 13.6005 24.4164M13.6005 24.4164C13.6508 24.276 13.7247 24.0906 13.6005 24.4164ZM15.2209 2.26101C14.8721 2.45061 14.8038 2.62504 14.8038 3.3986C14.8038 4.3011 14.9631 4.79406 15.456 5.40077C16.1765 6.28052 16.131 5.98474 16.131 9.94358C16.131 13.7659 16.1083 13.9934 15.6456 15.3282C15.5243 15.6619 13.598 20.4019 11.3531 25.87C9.10824 31.3304 7.21224 36.0249 7.12882 36.2979C6.57519 38.2546 7.86447 40.4084 9.87422 40.8787C10.3065 40.9848 11.7095 41 20.8027 41C27.5904 41 31.3824 40.9697 31.6478 40.9242C32.9978 40.6663 34.2036 39.5211 34.5601 38.156C34.7042 37.5948 34.7042 36.9122 34.5677 36.3662C34.507 36.1311 32.5807 31.3683 30.2827 25.7789C27.9924 20.1895 26.0281 15.3282 25.9143 14.9793C25.5655 13.8797 25.4972 13.0454 25.4972 9.78432C25.4972 6.37911 25.5048 6.3336 26.1039 5.55245C26.7334 4.73338 26.8168 4.51345 26.8472 3.63371C26.8851 2.67054 26.8472 2.51128 26.5362 2.32168C26.3011 2.17758 26.1267 2.17 20.8331 2.17C17.0108 2.17758 15.3271 2.20033 15.2209 2.26101ZM25.3455 3.86881C25.3455 3.95982 25.2394 4.17975 25.118 4.33902C24.6099 4.99124 24.2838 5.54487 24.1549 5.94682C24.0335 6.34119 24.0184 6.72039 24.0184 9.9815C24.0259 14.6684 23.9653 14.3575 25.6868 18.5666L26.6121 20.8266H20.8482C15.4029 20.8266 15.092 20.819 15.1299 20.6901C15.1451 20.6218 15.5622 19.598 16.0476 18.4149C17.6706 14.4864 17.6175 14.7215 17.663 10.209C17.7009 5.92407 17.6781 5.77997 16.7681 4.62721C16.5633 4.36935 16.3737 4.05083 16.3509 3.9219L16.3054 3.6868H20.8255H25.3455V3.86881Z"
                                    stroke="#F3F3F3" strokeWidth="2.5"/>
                            </g>
                            <defs>
                                <clipPath id="clip0_58_125">
                                    <rect width="42" height="42" fill="white"/>
                                </clipPath>
                            </defs>
                        </svg>
                        <span>Использование</span>
                    </NavLink>)}
                {isActive && (isManager || isAdmin ) && !isMobile && (
                    <NavLink className={({ isActive }) =>
                        isActive ? `${styles.link} ${styles.active}` : styles.link
                    } to="/mesurements">
                        <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_58_125)">
                                <path
                                    d="M15.2209 2.26101C14.8721 2.45061 14.8038 2.62504 14.8038 3.39861C14.8038 4.3011 14.9631 4.79406 15.456 5.40078C16.1765 6.28052 16.131 5.98475 16.131 9.94358C16.131 13.7659 16.1083 13.9934 15.6456 15.3282C15.5243 15.6619 13.598 20.4019 11.3531 25.87C9.10824 31.3304 7.21224 36.0249 7.12882 36.2979C6.57519 38.2546 7.86447 40.4084 9.87422 40.8787C10.3065 40.9848 11.7095 41 20.8027 41C27.5904 41 31.3824 40.9697 31.6478 40.9242C32.9978 40.6663 34.2036 39.5211 34.5601 38.156C34.7042 37.5948 34.7042 36.9122 34.5677 36.3662C34.507 36.1311 32.5807 31.3683 30.2827 25.7789C27.9924 20.1895 26.0281 15.3282 25.9143 14.9793C25.5655 13.8797 25.4972 13.0454 25.4972 9.78432C25.4972 6.37911 25.5048 6.33361 26.1039 5.55246C26.7334 4.73338 26.8168 4.51345 26.8472 3.63371C26.8851 2.67054 26.8472 2.51128 26.5362 2.32168C26.3011 2.17758 26.1267 2.17 20.8331 2.17C17.0108 2.17758 15.3271 2.20033 15.2209 2.26101ZM25.3456 3.86881C25.3456 3.95982 25.2394 4.17975 25.118 4.33902C24.6099 4.99124 24.2838 5.54487 24.1549 5.94682C24.0335 6.34119 24.0184 6.72039 24.0184 9.9815C24.0259 14.6684 23.9653 14.3575 25.6868 18.5666L26.6121 20.8266H20.8482C15.4029 20.8266 15.092 20.819 15.1299 20.6901C15.1451 20.6218 15.5622 19.598 16.0476 18.4149C17.6706 14.4864 17.6175 14.7215 17.663 10.209C17.7009 5.92407 17.6781 5.77998 16.7681 4.62721C16.5633 4.36935 16.3737 4.05083 16.3509 3.9219L16.3054 3.68679H20.8255H25.3456V3.86881ZM30.1841 29.5103L33.1116 36.6392L33.1191 37.2459C33.1191 37.7616 33.0812 37.9133 32.9144 38.2394C32.8006 38.4594 32.5428 38.7703 32.3456 38.9372C31.663 39.5287 32.3759 39.4908 20.6435 39.468L10.2155 39.4453L9.78321 39.2329C9.03998 38.8689 8.5091 38.0123 8.5091 37.216V36.9046C8.36929 37.2459 8.96591 35.7418 8.5091 36.9046C9.15121 35.3373 8.5445 36.8844 9.15121 35.3373C9.47198 34.5081 9.52536 34.3109 9.15121 35.3373C8.76014 36.2979 9.15121 35.3525 9.15121 35.3373C9.15121 35.3145 9.29784 34.8646 9.52536 34.3109L9.93489 33.3023C10.7371 31.3824 10.0014 33.1555 10.6326 31.6717C9.8488 33.5143 10.9725 30.7928 10.6326 31.6717C10.6326 31.702 10.7691 31.2925 10.6326 31.6717C10.6326 31.6414 10.8146 31.1787 11.0346 30.6403L11.5781 29.2701C11.0346 30.6403 11.9598 28.4006 11.5781 29.2701C12.1748 27.8792 11.1926 30.2626 12.0963 28.0693C11.0877 30.5135 13.105 25.6252 12.0963 28.0693L12.5134 27.0227L12.9382 25.9837C12.8847 26.1146 13.103 25.59 12.9382 25.9837C13.6207 24.3532 12.8824 26.12 13.6005 24.4164C13.6508 24.276 13.7247 24.0906 13.6005 24.4164C13.3859 24.9248 13.5828 24.4442 13.6207 24.3532C13.6435 24.2925 13.8331 23.8147 14.053 23.2914L14.4398 22.3434L20.8482 22.3586L27.2567 22.3813L30.1841 29.5103Z"
                                    fill="#F3F3F3"/>
                                <path
                                    d="M8.5091 36.9046V37.216C8.5091 38.0123 9.03998 38.8689 9.78321 39.2329L10.2155 39.4453L20.6435 39.468C32.3759 39.4908 31.663 39.5287 32.3456 38.9372C32.5428 38.7703 32.8006 38.4594 32.9144 38.2394C33.0812 37.9133 33.1191 37.7616 33.1191 37.2459L33.1116 36.6392L30.1841 29.5103L27.2567 22.3813L20.8482 22.3586L14.4398 22.3434L14.053 23.2914C13.8331 23.8147 13.6435 24.2925 13.6207 24.3532C13.5828 24.4442 13.3859 24.9248 13.6005 24.4164M8.5091 36.9046C8.96591 35.7418 8.36929 37.2459 8.5091 36.9046ZM8.5091 36.9046C9.15121 35.3373 8.5445 36.8844 9.15121 35.3373M9.15121 35.3373C9.47198 34.5081 9.52536 34.3109 9.15121 35.3373ZM9.15121 35.3373C8.76014 36.2979 9.15121 35.3525 9.15121 35.3373ZM9.15121 35.3373C9.15121 35.3145 9.29784 34.8646 9.52536 34.3109L9.93489 33.3023C10.7371 31.3824 10.0014 33.1555 10.6326 31.6717M10.6326 31.6717C10.9725 30.7928 9.8488 33.5143 10.6326 31.6717ZM10.6326 31.6717C10.7691 31.2925 10.6326 31.702 10.6326 31.6717ZM10.6326 31.6717C10.6326 31.6414 10.8146 31.1787 11.0346 30.6403L11.5781 29.2701M11.5781 29.2701C11.9598 28.4006 11.0346 30.6403 11.5781 29.2701ZM11.5781 29.2701C12.1748 27.8792 11.1927 30.2626 12.0963 28.0693M12.0963 28.0693C11.0877 30.5135 13.105 25.6252 12.0963 28.0693ZM12.0963 28.0693L12.5134 27.0227L12.9382 25.9837M12.9382 25.9837C13.103 25.59 12.8847 26.1146 12.9382 25.9837ZM12.9382 25.9837C13.6207 24.3532 12.8824 26.12 13.6005 24.4164M13.6005 24.4164C13.6508 24.276 13.7247 24.0906 13.6005 24.4164ZM15.2209 2.26101C14.8721 2.45061 14.8038 2.62504 14.8038 3.3986C14.8038 4.3011 14.9631 4.79406 15.456 5.40077C16.1765 6.28052 16.131 5.98474 16.131 9.94358C16.131 13.7659 16.1083 13.9934 15.6456 15.3282C15.5243 15.6619 13.598 20.4019 11.3531 25.87C9.10824 31.3304 7.21224 36.0249 7.12882 36.2979C6.57519 38.2546 7.86447 40.4084 9.87422 40.8787C10.3065 40.9848 11.7095 41 20.8027 41C27.5904 41 31.3824 40.9697 31.6478 40.9242C32.9978 40.6663 34.2036 39.5211 34.5601 38.156C34.7042 37.5948 34.7042 36.9122 34.5677 36.3662C34.507 36.1311 32.5807 31.3683 30.2827 25.7789C27.9924 20.1895 26.0281 15.3282 25.9143 14.9793C25.5655 13.8797 25.4972 13.0454 25.4972 9.78432C25.4972 6.37911 25.5048 6.3336 26.1039 5.55245C26.7334 4.73338 26.8168 4.51345 26.8472 3.63371C26.8851 2.67054 26.8472 2.51128 26.5362 2.32168C26.3011 2.17758 26.1267 2.17 20.8331 2.17C17.0108 2.17758 15.3271 2.20033 15.2209 2.26101ZM25.3455 3.86881C25.3455 3.95982 25.2394 4.17975 25.118 4.33902C24.6099 4.99124 24.2838 5.54487 24.1549 5.94682C24.0335 6.34119 24.0184 6.72039 24.0184 9.9815C24.0259 14.6684 23.9653 14.3575 25.6868 18.5666L26.6121 20.8266H20.8482C15.4029 20.8266 15.092 20.819 15.1299 20.6901C15.1451 20.6218 15.5622 19.598 16.0476 18.4149C17.6706 14.4864 17.6175 14.7215 17.663 10.209C17.7009 5.92407 17.6781 5.77997 16.7681 4.62721C16.5633 4.36935 16.3737 4.05083 16.3509 3.9219L16.3054 3.6868H20.8255H25.3455V3.86881Z"
                                    stroke="#F3F3F3" strokeWidth="2.5"/>
                            </g>
                            <defs>
                                <clipPath id="clip0_58_125">
                                    <rect width="42" height="42" fill="white"/>
                                </clipPath>
                            </defs>
                        </svg>
                        <span>Измерения</span>
                    </NavLink>)}

                {isActive && (isManager || isAdmin ) && !isMobile && (
                    <NavLink className={({ isActive }) =>
                        isActive ? `${styles.link} ${styles.active}` : styles.link
                    } to="/categories">
                        <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_58_125)">
                                <path
                                    d="M15.2209 2.26101C14.8721 2.45061 14.8038 2.62504 14.8038 3.39861C14.8038 4.3011 14.9631 4.79406 15.456 5.40078C16.1765 6.28052 16.131 5.98475 16.131 9.94358C16.131 13.7659 16.1083 13.9934 15.6456 15.3282C15.5243 15.6619 13.598 20.4019 11.3531 25.87C9.10824 31.3304 7.21224 36.0249 7.12882 36.2979C6.57519 38.2546 7.86447 40.4084 9.87422 40.8787C10.3065 40.9848 11.7095 41 20.8027 41C27.5904 41 31.3824 40.9697 31.6478 40.9242C32.9978 40.6663 34.2036 39.5211 34.5601 38.156C34.7042 37.5948 34.7042 36.9122 34.5677 36.3662C34.507 36.1311 32.5807 31.3683 30.2827 25.7789C27.9924 20.1895 26.0281 15.3282 25.9143 14.9793C25.5655 13.8797 25.4972 13.0454 25.4972 9.78432C25.4972 6.37911 25.5048 6.33361 26.1039 5.55246C26.7334 4.73338 26.8168 4.51345 26.8472 3.63371C26.8851 2.67054 26.8472 2.51128 26.5362 2.32168C26.3011 2.17758 26.1267 2.17 20.8331 2.17C17.0108 2.17758 15.3271 2.20033 15.2209 2.26101ZM25.3456 3.86881C25.3456 3.95982 25.2394 4.17975 25.118 4.33902C24.6099 4.99124 24.2838 5.54487 24.1549 5.94682C24.0335 6.34119 24.0184 6.72039 24.0184 9.9815C24.0259 14.6684 23.9653 14.3575 25.6868 18.5666L26.6121 20.8266H20.8482C15.4029 20.8266 15.092 20.819 15.1299 20.6901C15.1451 20.6218 15.5622 19.598 16.0476 18.4149C17.6706 14.4864 17.6175 14.7215 17.663 10.209C17.7009 5.92407 17.6781 5.77998 16.7681 4.62721C16.5633 4.36935 16.3737 4.05083 16.3509 3.9219L16.3054 3.68679H20.8255H25.3456V3.86881ZM30.1841 29.5103L33.1116 36.6392L33.1191 37.2459C33.1191 37.7616 33.0812 37.9133 32.9144 38.2394C32.8006 38.4594 32.5428 38.7703 32.3456 38.9372C31.663 39.5287 32.3759 39.4908 20.6435 39.468L10.2155 39.4453L9.78321 39.2329C9.03998 38.8689 8.5091 38.0123 8.5091 37.216V36.9046C8.36929 37.2459 8.96591 35.7418 8.5091 36.9046C9.15121 35.3373 8.5445 36.8844 9.15121 35.3373C9.47198 34.5081 9.52536 34.3109 9.15121 35.3373C8.76014 36.2979 9.15121 35.3525 9.15121 35.3373C9.15121 35.3145 9.29784 34.8646 9.52536 34.3109L9.93489 33.3023C10.7371 31.3824 10.0014 33.1555 10.6326 31.6717C9.8488 33.5143 10.9725 30.7928 10.6326 31.6717C10.6326 31.702 10.7691 31.2925 10.6326 31.6717C10.6326 31.6414 10.8146 31.1787 11.0346 30.6403L11.5781 29.2701C11.0346 30.6403 11.9598 28.4006 11.5781 29.2701C12.1748 27.8792 11.1926 30.2626 12.0963 28.0693C11.0877 30.5135 13.105 25.6252 12.0963 28.0693L12.5134 27.0227L12.9382 25.9837C12.8847 26.1146 13.103 25.59 12.9382 25.9837C13.6207 24.3532 12.8824 26.12 13.6005 24.4164C13.6508 24.276 13.7247 24.0906 13.6005 24.4164C13.3859 24.9248 13.5828 24.4442 13.6207 24.3532C13.6435 24.2925 13.8331 23.8147 14.053 23.2914L14.4398 22.3434L20.8482 22.3586L27.2567 22.3813L30.1841 29.5103Z"
                                    fill="#F3F3F3"/>
                                <path
                                    d="M8.5091 36.9046V37.216C8.5091 38.0123 9.03998 38.8689 9.78321 39.2329L10.2155 39.4453L20.6435 39.468C32.3759 39.4908 31.663 39.5287 32.3456 38.9372C32.5428 38.7703 32.8006 38.4594 32.9144 38.2394C33.0812 37.9133 33.1191 37.7616 33.1191 37.2459L33.1116 36.6392L30.1841 29.5103L27.2567 22.3813L20.8482 22.3586L14.4398 22.3434L14.053 23.2914C13.8331 23.8147 13.6435 24.2925 13.6207 24.3532C13.5828 24.4442 13.3859 24.9248 13.6005 24.4164M8.5091 36.9046C8.96591 35.7418 8.36929 37.2459 8.5091 36.9046ZM8.5091 36.9046C9.15121 35.3373 8.5445 36.8844 9.15121 35.3373M9.15121 35.3373C9.47198 34.5081 9.52536 34.3109 9.15121 35.3373ZM9.15121 35.3373C8.76014 36.2979 9.15121 35.3525 9.15121 35.3373ZM9.15121 35.3373C9.15121 35.3145 9.29784 34.8646 9.52536 34.3109L9.93489 33.3023C10.7371 31.3824 10.0014 33.1555 10.6326 31.6717M10.6326 31.6717C10.9725 30.7928 9.8488 33.5143 10.6326 31.6717ZM10.6326 31.6717C10.7691 31.2925 10.6326 31.702 10.6326 31.6717ZM10.6326 31.6717C10.6326 31.6414 10.8146 31.1787 11.0346 30.6403L11.5781 29.2701M11.5781 29.2701C11.9598 28.4006 11.0346 30.6403 11.5781 29.2701ZM11.5781 29.2701C12.1748 27.8792 11.1927 30.2626 12.0963 28.0693M12.0963 28.0693C11.0877 30.5135 13.105 25.6252 12.0963 28.0693ZM12.0963 28.0693L12.5134 27.0227L12.9382 25.9837M12.9382 25.9837C13.103 25.59 12.8847 26.1146 12.9382 25.9837ZM12.9382 25.9837C13.6207 24.3532 12.8824 26.12 13.6005 24.4164M13.6005 24.4164C13.6508 24.276 13.7247 24.0906 13.6005 24.4164ZM15.2209 2.26101C14.8721 2.45061 14.8038 2.62504 14.8038 3.3986C14.8038 4.3011 14.9631 4.79406 15.456 5.40077C16.1765 6.28052 16.131 5.98474 16.131 9.94358C16.131 13.7659 16.1083 13.9934 15.6456 15.3282C15.5243 15.6619 13.598 20.4019 11.3531 25.87C9.10824 31.3304 7.21224 36.0249 7.12882 36.2979C6.57519 38.2546 7.86447 40.4084 9.87422 40.8787C10.3065 40.9848 11.7095 41 20.8027 41C27.5904 41 31.3824 40.9697 31.6478 40.9242C32.9978 40.6663 34.2036 39.5211 34.5601 38.156C34.7042 37.5948 34.7042 36.9122 34.5677 36.3662C34.507 36.1311 32.5807 31.3683 30.2827 25.7789C27.9924 20.1895 26.0281 15.3282 25.9143 14.9793C25.5655 13.8797 25.4972 13.0454 25.4972 9.78432C25.4972 6.37911 25.5048 6.3336 26.1039 5.55245C26.7334 4.73338 26.8168 4.51345 26.8472 3.63371C26.8851 2.67054 26.8472 2.51128 26.5362 2.32168C26.3011 2.17758 26.1267 2.17 20.8331 2.17C17.0108 2.17758 15.3271 2.20033 15.2209 2.26101ZM25.3455 3.86881C25.3455 3.95982 25.2394 4.17975 25.118 4.33902C24.6099 4.99124 24.2838 5.54487 24.1549 5.94682C24.0335 6.34119 24.0184 6.72039 24.0184 9.9815C24.0259 14.6684 23.9653 14.3575 25.6868 18.5666L26.6121 20.8266H20.8482C15.4029 20.8266 15.092 20.819 15.1299 20.6901C15.1451 20.6218 15.5622 19.598 16.0476 18.4149C17.6706 14.4864 17.6175 14.7215 17.663 10.209C17.7009 5.92407 17.6781 5.77997 16.7681 4.62721C16.5633 4.36935 16.3737 4.05083 16.3509 3.9219L16.3054 3.6868H20.8255H25.3455V3.86881Z"
                                    stroke="#F3F3F3" strokeWidth="2.5"/>
                            </g>
                            <defs>
                                <clipPath id="clip0_58_125">
                                    <rect width="42" height="42" fill="white"/>
                                </clipPath>
                            </defs>
                        </svg>
                        <span>Категории</span>
                    </NavLink>)}

                {isActive && (isManager || isAdmin ) && !isMobile && (
                    <NavLink className={({ isActive }) =>
                        isActive ? `${styles.link} ${styles.active}` : styles.link
                    } to="/substances">
                        <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_58_125)">
                                <path
                                    d="M15.2209 2.26101C14.8721 2.45061 14.8038 2.62504 14.8038 3.39861C14.8038 4.3011 14.9631 4.79406 15.456 5.40078C16.1765 6.28052 16.131 5.98475 16.131 9.94358C16.131 13.7659 16.1083 13.9934 15.6456 15.3282C15.5243 15.6619 13.598 20.4019 11.3531 25.87C9.10824 31.3304 7.21224 36.0249 7.12882 36.2979C6.57519 38.2546 7.86447 40.4084 9.87422 40.8787C10.3065 40.9848 11.7095 41 20.8027 41C27.5904 41 31.3824 40.9697 31.6478 40.9242C32.9978 40.6663 34.2036 39.5211 34.5601 38.156C34.7042 37.5948 34.7042 36.9122 34.5677 36.3662C34.507 36.1311 32.5807 31.3683 30.2827 25.7789C27.9924 20.1895 26.0281 15.3282 25.9143 14.9793C25.5655 13.8797 25.4972 13.0454 25.4972 9.78432C25.4972 6.37911 25.5048 6.33361 26.1039 5.55246C26.7334 4.73338 26.8168 4.51345 26.8472 3.63371C26.8851 2.67054 26.8472 2.51128 26.5362 2.32168C26.3011 2.17758 26.1267 2.17 20.8331 2.17C17.0108 2.17758 15.3271 2.20033 15.2209 2.26101ZM25.3456 3.86881C25.3456 3.95982 25.2394 4.17975 25.118 4.33902C24.6099 4.99124 24.2838 5.54487 24.1549 5.94682C24.0335 6.34119 24.0184 6.72039 24.0184 9.9815C24.0259 14.6684 23.9653 14.3575 25.6868 18.5666L26.6121 20.8266H20.8482C15.4029 20.8266 15.092 20.819 15.1299 20.6901C15.1451 20.6218 15.5622 19.598 16.0476 18.4149C17.6706 14.4864 17.6175 14.7215 17.663 10.209C17.7009 5.92407 17.6781 5.77998 16.7681 4.62721C16.5633 4.36935 16.3737 4.05083 16.3509 3.9219L16.3054 3.68679H20.8255H25.3456V3.86881ZM30.1841 29.5103L33.1116 36.6392L33.1191 37.2459C33.1191 37.7616 33.0812 37.9133 32.9144 38.2394C32.8006 38.4594 32.5428 38.7703 32.3456 38.9372C31.663 39.5287 32.3759 39.4908 20.6435 39.468L10.2155 39.4453L9.78321 39.2329C9.03998 38.8689 8.5091 38.0123 8.5091 37.216V36.9046C8.36929 37.2459 8.96591 35.7418 8.5091 36.9046C9.15121 35.3373 8.5445 36.8844 9.15121 35.3373C9.47198 34.5081 9.52536 34.3109 9.15121 35.3373C8.76014 36.2979 9.15121 35.3525 9.15121 35.3373C9.15121 35.3145 9.29784 34.8646 9.52536 34.3109L9.93489 33.3023C10.7371 31.3824 10.0014 33.1555 10.6326 31.6717C9.8488 33.5143 10.9725 30.7928 10.6326 31.6717C10.6326 31.702 10.7691 31.2925 10.6326 31.6717C10.6326 31.6414 10.8146 31.1787 11.0346 30.6403L11.5781 29.2701C11.0346 30.6403 11.9598 28.4006 11.5781 29.2701C12.1748 27.8792 11.1926 30.2626 12.0963 28.0693C11.0877 30.5135 13.105 25.6252 12.0963 28.0693L12.5134 27.0227L12.9382 25.9837C12.8847 26.1146 13.103 25.59 12.9382 25.9837C13.6207 24.3532 12.8824 26.12 13.6005 24.4164C13.6508 24.276 13.7247 24.0906 13.6005 24.4164C13.3859 24.9248 13.5828 24.4442 13.6207 24.3532C13.6435 24.2925 13.8331 23.8147 14.053 23.2914L14.4398 22.3434L20.8482 22.3586L27.2567 22.3813L30.1841 29.5103Z"
                                    fill="#F3F3F3"/>
                                <path
                                    d="M8.5091 36.9046V37.216C8.5091 38.0123 9.03998 38.8689 9.78321 39.2329L10.2155 39.4453L20.6435 39.468C32.3759 39.4908 31.663 39.5287 32.3456 38.9372C32.5428 38.7703 32.8006 38.4594 32.9144 38.2394C33.0812 37.9133 33.1191 37.7616 33.1191 37.2459L33.1116 36.6392L30.1841 29.5103L27.2567 22.3813L20.8482 22.3586L14.4398 22.3434L14.053 23.2914C13.8331 23.8147 13.6435 24.2925 13.6207 24.3532C13.5828 24.4442 13.3859 24.9248 13.6005 24.4164M8.5091 36.9046C8.96591 35.7418 8.36929 37.2459 8.5091 36.9046ZM8.5091 36.9046C9.15121 35.3373 8.5445 36.8844 9.15121 35.3373M9.15121 35.3373C9.47198 34.5081 9.52536 34.3109 9.15121 35.3373ZM9.15121 35.3373C8.76014 36.2979 9.15121 35.3525 9.15121 35.3373ZM9.15121 35.3373C9.15121 35.3145 9.29784 34.8646 9.52536 34.3109L9.93489 33.3023C10.7371 31.3824 10.0014 33.1555 10.6326 31.6717M10.6326 31.6717C10.9725 30.7928 9.8488 33.5143 10.6326 31.6717ZM10.6326 31.6717C10.7691 31.2925 10.6326 31.702 10.6326 31.6717ZM10.6326 31.6717C10.6326 31.6414 10.8146 31.1787 11.0346 30.6403L11.5781 29.2701M11.5781 29.2701C11.9598 28.4006 11.0346 30.6403 11.5781 29.2701ZM11.5781 29.2701C12.1748 27.8792 11.1927 30.2626 12.0963 28.0693M12.0963 28.0693C11.0877 30.5135 13.105 25.6252 12.0963 28.0693ZM12.0963 28.0693L12.5134 27.0227L12.9382 25.9837M12.9382 25.9837C13.103 25.59 12.8847 26.1146 12.9382 25.9837ZM12.9382 25.9837C13.6207 24.3532 12.8824 26.12 13.6005 24.4164M13.6005 24.4164C13.6508 24.276 13.7247 24.0906 13.6005 24.4164ZM15.2209 2.26101C14.8721 2.45061 14.8038 2.62504 14.8038 3.3986C14.8038 4.3011 14.9631 4.79406 15.456 5.40077C16.1765 6.28052 16.131 5.98474 16.131 9.94358C16.131 13.7659 16.1083 13.9934 15.6456 15.3282C15.5243 15.6619 13.598 20.4019 11.3531 25.87C9.10824 31.3304 7.21224 36.0249 7.12882 36.2979C6.57519 38.2546 7.86447 40.4084 9.87422 40.8787C10.3065 40.9848 11.7095 41 20.8027 41C27.5904 41 31.3824 40.9697 31.6478 40.9242C32.9978 40.6663 34.2036 39.5211 34.5601 38.156C34.7042 37.5948 34.7042 36.9122 34.5677 36.3662C34.507 36.1311 32.5807 31.3683 30.2827 25.7789C27.9924 20.1895 26.0281 15.3282 25.9143 14.9793C25.5655 13.8797 25.4972 13.0454 25.4972 9.78432C25.4972 6.37911 25.5048 6.3336 26.1039 5.55245C26.7334 4.73338 26.8168 4.51345 26.8472 3.63371C26.8851 2.67054 26.8472 2.51128 26.5362 2.32168C26.3011 2.17758 26.1267 2.17 20.8331 2.17C17.0108 2.17758 15.3271 2.20033 15.2209 2.26101ZM25.3455 3.86881C25.3455 3.95982 25.2394 4.17975 25.118 4.33902C24.6099 4.99124 24.2838 5.54487 24.1549 5.94682C24.0335 6.34119 24.0184 6.72039 24.0184 9.9815C24.0259 14.6684 23.9653 14.3575 25.6868 18.5666L26.6121 20.8266H20.8482C15.4029 20.8266 15.092 20.819 15.1299 20.6901C15.1451 20.6218 15.5622 19.598 16.0476 18.4149C17.6706 14.4864 17.6175 14.7215 17.663 10.209C17.7009 5.92407 17.6781 5.77997 16.7681 4.62721C16.5633 4.36935 16.3737 4.05083 16.3509 3.9219L16.3054 3.6868H20.8255H25.3455V3.86881Z"
                                    stroke="#F3F3F3" strokeWidth="2.5"/>
                            </g>
                            <defs>
                                <clipPath id="clip0_58_125">
                                    <rect width="42" height="42" fill="white"/>
                                </clipPath>
                            </defs>
                        </svg>
                        <span>Вещества</span>
                    </NavLink>)}

                {isActive && (isManager || isAdmin ) && !isMobile && (
                    <NavLink className={({ isActive }) =>
                        isActive ? `${styles.link} ${styles.active}` : styles.link
                    } to="/print">
                        <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_58_125)">
                                <path
                                    d="M15.2209 2.26101C14.8721 2.45061 14.8038 2.62504 14.8038 3.39861C14.8038 4.3011 14.9631 4.79406 15.456 5.40078C16.1765 6.28052 16.131 5.98475 16.131 9.94358C16.131 13.7659 16.1083 13.9934 15.6456 15.3282C15.5243 15.6619 13.598 20.4019 11.3531 25.87C9.10824 31.3304 7.21224 36.0249 7.12882 36.2979C6.57519 38.2546 7.86447 40.4084 9.87422 40.8787C10.3065 40.9848 11.7095 41 20.8027 41C27.5904 41 31.3824 40.9697 31.6478 40.9242C32.9978 40.6663 34.2036 39.5211 34.5601 38.156C34.7042 37.5948 34.7042 36.9122 34.5677 36.3662C34.507 36.1311 32.5807 31.3683 30.2827 25.7789C27.9924 20.1895 26.0281 15.3282 25.9143 14.9793C25.5655 13.8797 25.4972 13.0454 25.4972 9.78432C25.4972 6.37911 25.5048 6.33361 26.1039 5.55246C26.7334 4.73338 26.8168 4.51345 26.8472 3.63371C26.8851 2.67054 26.8472 2.51128 26.5362 2.32168C26.3011 2.17758 26.1267 2.17 20.8331 2.17C17.0108 2.17758 15.3271 2.20033 15.2209 2.26101ZM25.3456 3.86881C25.3456 3.95982 25.2394 4.17975 25.118 4.33902C24.6099 4.99124 24.2838 5.54487 24.1549 5.94682C24.0335 6.34119 24.0184 6.72039 24.0184 9.9815C24.0259 14.6684 23.9653 14.3575 25.6868 18.5666L26.6121 20.8266H20.8482C15.4029 20.8266 15.092 20.819 15.1299 20.6901C15.1451 20.6218 15.5622 19.598 16.0476 18.4149C17.6706 14.4864 17.6175 14.7215 17.663 10.209C17.7009 5.92407 17.6781 5.77998 16.7681 4.62721C16.5633 4.36935 16.3737 4.05083 16.3509 3.9219L16.3054 3.68679H20.8255H25.3456V3.86881ZM30.1841 29.5103L33.1116 36.6392L33.1191 37.2459C33.1191 37.7616 33.0812 37.9133 32.9144 38.2394C32.8006 38.4594 32.5428 38.7703 32.3456 38.9372C31.663 39.5287 32.3759 39.4908 20.6435 39.468L10.2155 39.4453L9.78321 39.2329C9.03998 38.8689 8.5091 38.0123 8.5091 37.216V36.9046C8.36929 37.2459 8.96591 35.7418 8.5091 36.9046C9.15121 35.3373 8.5445 36.8844 9.15121 35.3373C9.47198 34.5081 9.52536 34.3109 9.15121 35.3373C8.76014 36.2979 9.15121 35.3525 9.15121 35.3373C9.15121 35.3145 9.29784 34.8646 9.52536 34.3109L9.93489 33.3023C10.7371 31.3824 10.0014 33.1555 10.6326 31.6717C9.8488 33.5143 10.9725 30.7928 10.6326 31.6717C10.6326 31.702 10.7691 31.2925 10.6326 31.6717C10.6326 31.6414 10.8146 31.1787 11.0346 30.6403L11.5781 29.2701C11.0346 30.6403 11.9598 28.4006 11.5781 29.2701C12.1748 27.8792 11.1926 30.2626 12.0963 28.0693C11.0877 30.5135 13.105 25.6252 12.0963 28.0693L12.5134 27.0227L12.9382 25.9837C12.8847 26.1146 13.103 25.59 12.9382 25.9837C13.6207 24.3532 12.8824 26.12 13.6005 24.4164C13.6508 24.276 13.7247 24.0906 13.6005 24.4164C13.3859 24.9248 13.5828 24.4442 13.6207 24.3532C13.6435 24.2925 13.8331 23.8147 14.053 23.2914L14.4398 22.3434L20.8482 22.3586L27.2567 22.3813L30.1841 29.5103Z"
                                    fill="#F3F3F3"/>
                                <path
                                    d="M8.5091 36.9046V37.216C8.5091 38.0123 9.03998 38.8689 9.78321 39.2329L10.2155 39.4453L20.6435 39.468C32.3759 39.4908 31.663 39.5287 32.3456 38.9372C32.5428 38.7703 32.8006 38.4594 32.9144 38.2394C33.0812 37.9133 33.1191 37.7616 33.1191 37.2459L33.1116 36.6392L30.1841 29.5103L27.2567 22.3813L20.8482 22.3586L14.4398 22.3434L14.053 23.2914C13.8331 23.8147 13.6435 24.2925 13.6207 24.3532C13.5828 24.4442 13.3859 24.9248 13.6005 24.4164M8.5091 36.9046C8.96591 35.7418 8.36929 37.2459 8.5091 36.9046ZM8.5091 36.9046C9.15121 35.3373 8.5445 36.8844 9.15121 35.3373M9.15121 35.3373C9.47198 34.5081 9.52536 34.3109 9.15121 35.3373ZM9.15121 35.3373C8.76014 36.2979 9.15121 35.3525 9.15121 35.3373ZM9.15121 35.3373C9.15121 35.3145 9.29784 34.8646 9.52536 34.3109L9.93489 33.3023C10.7371 31.3824 10.0014 33.1555 10.6326 31.6717M10.6326 31.6717C10.9725 30.7928 9.8488 33.5143 10.6326 31.6717ZM10.6326 31.6717C10.7691 31.2925 10.6326 31.702 10.6326 31.6717ZM10.6326 31.6717C10.6326 31.6414 10.8146 31.1787 11.0346 30.6403L11.5781 29.2701M11.5781 29.2701C11.9598 28.4006 11.0346 30.6403 11.5781 29.2701ZM11.5781 29.2701C12.1748 27.8792 11.1927 30.2626 12.0963 28.0693M12.0963 28.0693C11.0877 30.5135 13.105 25.6252 12.0963 28.0693ZM12.0963 28.0693L12.5134 27.0227L12.9382 25.9837M12.9382 25.9837C13.103 25.59 12.8847 26.1146 12.9382 25.9837ZM12.9382 25.9837C13.6207 24.3532 12.8824 26.12 13.6005 24.4164M13.6005 24.4164C13.6508 24.276 13.7247 24.0906 13.6005 24.4164ZM15.2209 2.26101C14.8721 2.45061 14.8038 2.62504 14.8038 3.3986C14.8038 4.3011 14.9631 4.79406 15.456 5.40077C16.1765 6.28052 16.131 5.98474 16.131 9.94358C16.131 13.7659 16.1083 13.9934 15.6456 15.3282C15.5243 15.6619 13.598 20.4019 11.3531 25.87C9.10824 31.3304 7.21224 36.0249 7.12882 36.2979C6.57519 38.2546 7.86447 40.4084 9.87422 40.8787C10.3065 40.9848 11.7095 41 20.8027 41C27.5904 41 31.3824 40.9697 31.6478 40.9242C32.9978 40.6663 34.2036 39.5211 34.5601 38.156C34.7042 37.5948 34.7042 36.9122 34.5677 36.3662C34.507 36.1311 32.5807 31.3683 30.2827 25.7789C27.9924 20.1895 26.0281 15.3282 25.9143 14.9793C25.5655 13.8797 25.4972 13.0454 25.4972 9.78432C25.4972 6.37911 25.5048 6.3336 26.1039 5.55245C26.7334 4.73338 26.8168 4.51345 26.8472 3.63371C26.8851 2.67054 26.8472 2.51128 26.5362 2.32168C26.3011 2.17758 26.1267 2.17 20.8331 2.17C17.0108 2.17758 15.3271 2.20033 15.2209 2.26101ZM25.3455 3.86881C25.3455 3.95982 25.2394 4.17975 25.118 4.33902C24.6099 4.99124 24.2838 5.54487 24.1549 5.94682C24.0335 6.34119 24.0184 6.72039 24.0184 9.9815C24.0259 14.6684 23.9653 14.3575 25.6868 18.5666L26.6121 20.8266H20.8482C15.4029 20.8266 15.092 20.819 15.1299 20.6901C15.1451 20.6218 15.5622 19.598 16.0476 18.4149C17.6706 14.4864 17.6175 14.7215 17.663 10.209C17.7009 5.92407 17.6781 5.77997 16.7681 4.62721C16.5633 4.36935 16.3737 4.05083 16.3509 3.9219L16.3054 3.6868H20.8255H25.3455V3.86881Z"
                                    stroke="#F3F3F3" strokeWidth="2.5"/>
                            </g>
                            <defs>
                                <clipPath id="clip0_58_125">
                                    <rect width="42" height="42" fill="white"/>
                                </clipPath>
                            </defs>
                        </svg>
                        <span>Печать</span>
                    </NavLink>)}


                {isActive && isAdmin && !isMobile &&(<NavLink className={({ isActive }) =>
                    isActive ? `${styles.link} ${styles.active}` : styles.link
                } to="/admin">
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_58_128)">
                            <path
                                d="M24 4C12.96 4 4 12.96 4 24C4 35.04 12.96 44 24 44C35.04 44 44 35.04 44 24C44 12.96 35.04 4 24 4ZM24 12C27.86 12 31 15.14 31 19C31 22.86 27.86 26 24 26C20.14 26 17 22.86 17 19C17 15.14 20.14 12 24 12ZM24 40C19.94 40 15.14 38.36 11.72 34.24C15.1 31.6 19.36 30 24 30C28.64 30 32.9 31.6 36.28 34.24C32.86 38.36 28.06 40 24 40Z"
                                fill="#F3F3F3"/>
                        </g>
                        <defs>
                            <clipPath id="clip0_58_128">
                                <rect width="48" height="48" fill="white"/>
                            </clipPath>
                        </defs>
                    </svg>
                    <span>Пользователи</span>
                </NavLink>)}


                <NavLink className={({ isActive }) =>
                    isActive ? `${styles.link} ${styles.active}` : styles.link
                } to="/profile">
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_58_128)">
                            <path
                                d="M24 4C12.96 4 4 12.96 4 24C4 35.04 12.96 44 24 44C35.04 44 44 35.04 44 24C44 12.96 35.04 4 24 4ZM24 12C27.86 12 31 15.14 31 19C31 22.86 27.86 26 24 26C20.14 26 17 22.86 17 19C17 15.14 20.14 12 24 12ZM24 40C19.94 40 15.14 38.36 11.72 34.24C15.1 31.6 19.36 30 24 30C28.64 30 32.9 31.6 36.28 34.24C32.86 38.36 28.06 40 24 40Z"
                                fill="#F3F3F3"/>
                        </g>
                        <defs>
                            <clipPath id="clip0_58_128">
                                <rect width="48" height="48" fill="white"/>
                            </clipPath>
                        </defs>
                    </svg>
                    <span>Профиль</span>
                </NavLink>
            </nav>
        </header>
    )
}