import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/api';
import { USER_ROLES, USER_STATUSES, AUTH_STORAGE_KEY } from '../constants/auth';
import { useEffect } from 'react';
import useAuthStorageWatcher from "./useAuthStorageWatcher.js";

const getStoredAuthData = () => {
  const data = localStorage.getItem(AUTH_STORAGE_KEY);
  return data ? JSON.parse(data) : null;
};



export const useAuth = () => {
  const queryClient = useQueryClient();

  const {updateAuthData} = useAuthStorageWatcher()

  // Инициализация при монтировании
  useEffect(() => {
    const storedData = getStoredAuthData();
    if (storedData?.token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${storedData.token}`;
    }
  }, []);

  // Логин
  const login = useMutation({
    mutationFn: (credentials) => api.post('/login', credentials),
    onSuccess: (response) => {
      const { token, uid, role, status, lab } = response.data;

      const authData = { token, uid, role, status, lab };
      updateAuthData(authData);
      queryClient.setQueryData(['auth'], authData);
    },
  });

  const register = useMutation({
    mutationFn: (credentials) => api.post('/register', credentials),
    onSuccess: (response) => {
      const { token, uid, role, status, lab } = response.data;

      const authData = { token, uid, role, status, lab };
      updateAuthData(authData);
      queryClient.setQueryData(['auth'], authData);
    },
  });

  // Логаут
  // const logout = useMutation({
  //   mutationFn: () => {
  //     return api.post('/auth/logout').finally(() => {
  //       localStorage.removeItem(AUTH_STORAGE_KEY);
  //       delete api.defaults.headers.common['Authorization'];
  //       queryClient.removeQueries(['auth']);
  //       queryClient.clear();
  //     });
  //   },
  // });

  // Проверка авторизации
  const { data: authData } = useQuery({
    queryKey: ['auth'],
    queryFn: async () => {
      const storedData = getStoredAuthData();
      if (!storedData?.token) return null;
      
      try {

        const response = await api.get('/my');
        const updatedData = { ...storedData, ...response.data };

        updateAuthData(updatedData);
        return updatedData;
      } catch (error) {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        return null;
      }

    },
    initialData: getStoredAuthData,
    staleTime: 5 * 60 * 1000,
  });



  return {
    authData,
    isAuthenticated: authData?.token,
    isAdmin: authData?.role === USER_ROLES.ADMIN,
    isManager: authData?.role === USER_ROLES.MANAGER,
    isActive: authData?.status === USER_STATUSES.ACTIVE,
    uid: authData?.uid,
    lab: authData?.lab,
    login: login.mutateAsync,
    register: register.mutateAsync,
    // logout: logout.mutateAsync,
    isLoading: login.isLoading,
  };
};