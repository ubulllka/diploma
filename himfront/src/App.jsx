import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {useAuth} from './hooks/useAuth';
import {ProtectedRoute} from './components/routes/ProtectedRoute';
import {RoleProtectedRoute} from './components/routes/RoleProtectedRoute';
import {LoginPage} from './pages/login/LoginPage.jsx';
import {USER_ROLES} from './constants/auth';
import {Layout} from "./pages/layout/Layout.jsx";
import {BannedPage} from "./pages/banned/BannedPage.jsx";
import {ProfilePage} from "./pages/profile/ProfilePage.jsx";
import ReagentDetailPage from "./pages/resourcedetail/ResourceDetailPage.jsx";
import UsagePage from "./pages/usage/UsagePage.jsx";
import MeasurementList from "./pages/mesurements/MeasurementList.jsx";
import CategoryList from "./pages/categories/CategoriesList.jsx";
import SubstanceList from "./pages/substance/SubstanceList.jsx";
import ResourcePage from "./pages/resource/ResourcePage.jsx";
import useAuthStorageWatcher from "./hooks/useAuthStorageWatcher.js";
import UserList from "./pages/user/UserList.jsx";
import PrintPage from "./pages/print/PrintPage.jsx";

// Создаем компонент Layout, который будет содержать header и children

function App() {
    useAuthStorageWatcher();
    const {isActive, isLoading} = useAuth();

    if (isLoading) {
        return <div>Loading application...</div>;
    }


    return (

        <Routes>
            <Route path="/login" element={<LoginPage/>}/>

            <Route path="/" element={
                <RoleProtectedRoute>
                    <Layout>
                        {isActive && <ResourcePage/>}
                        {!isActive && <BannedPage/>}
                    </Layout>
                </RoleProtectedRoute>
            }/>

            <Route path="/profile" element={
                <ProtectedRoute>
                    <Layout>
                        <ProfilePage/>
                    </Layout>
                </ProtectedRoute>
            }/>


            <Route path="/resources/:id" element={
                <RoleProtectedRoute allowedRoles={[USER_ROLES.EMPLOYEE, USER_ROLES.MANAGER, USER_ROLES.ADMIN]}>
                    <Layout>
                        <ReagentDetailPage/>
                    </Layout>
                </RoleProtectedRoute>
            }/>


            <Route path="/usage" element={
                <RoleProtectedRoute allowedRoles={[USER_ROLES.EMPLOYEE, USER_ROLES.MANAGER, USER_ROLES.ADMIN]}>
                    <Layout>
                        <UsagePage/>
                    </Layout>
                </RoleProtectedRoute>
            }/>

            <Route path="/mesurements" element={
                <RoleProtectedRoute allowedRoles={[USER_ROLES.MANAGER, USER_ROLES.ADMIN]}>
                    <Layout>
                        <MeasurementList/>
                    </Layout>
                </RoleProtectedRoute>
            }/>

            <Route path="/categories" element={
                <RoleProtectedRoute allowedRoles={[USER_ROLES.MANAGER, USER_ROLES.ADMIN]}>
                    <Layout>
                        <CategoryList/>
                    </Layout>
                </RoleProtectedRoute>
            }/>

            <Route path="/substances" element={
                <RoleProtectedRoute allowedRoles={[USER_ROLES.MANAGER, USER_ROLES.ADMIN]}>
                    <Layout>
                        <SubstanceList/>
                    </Layout>
                </RoleProtectedRoute>
            }/>


            <Route path="/print" element={
                <RoleProtectedRoute allowedRoles={[USER_ROLES.MANAGER, USER_ROLES.ADMIN]}>
                    <Layout>
                        <PrintPage/>
                    </Layout>
                </RoleProtectedRoute>
            }/>


            <Route path="/admin" element={
                <RoleProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
                    <Layout>
                        <UserList />
                    </Layout>
                </RoleProtectedRoute>
            }/>
        </Routes>

    );
}

export default App;