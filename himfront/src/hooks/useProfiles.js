import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {getMyProfile, getUsers, postMyProfile, updateUserRole, updateUserStatus} from "../api/profilesApi.js";

// Хук для получения профиля пользователя
export const useMyProfile = () => {
  return useQuery({
    queryKey: ['myprofile'],
    queryFn: getMyProfile,
  });
};

// Хук для обновления профиля пользователя
export const useUpdateMyProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData) => postMyProfile(formData),
    onSuccess: () => queryClient.invalidateQueries(['myprofile']),
  });
};

// Хук для получения списка пользователей
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });
};

// Хук для обновления статуса пользователя
export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => updateUserStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries(['users']),
  });
};

// Хук для обновления роли пользователя
export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, role }) => updateUserRole(id, role),
    onSuccess: () => queryClient.invalidateQueries(['users']),
  });
};
