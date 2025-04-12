import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getSubstances,
    createSubstance,
    updateSubstance,
    deleteSubstance, getSubstance,
} from '../api/substanceApi';

// Ключ для кэширования
const SUBSTANCE_QUERY_KEY = ['substances'];

// Получение списка всех Substance с фильтрами
export const useSubstances = () => {
    return useQuery({
        queryKey: [SUBSTANCE_QUERY_KEY], // Добавляем фильтры в ключ для кэширования
        queryFn: getSubstances,
    });
};

// Получение конкретного Substance по ID
export const useSubstance = (id) => {
    return useQuery({
        queryKey: ['substance', id], // Используем уникальный ключ с ID для кэширования
        queryFn: () => getSubstance(id),
        enabled: !!id, // Хук будет активен только если id передан
    });
};

// Создание новой Substance
export const useCreateSubstance = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createSubstance,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: SUBSTANCE_QUERY_KEY });
        },
    });
};

// Обновление Substance
export const useUpdateSubstance = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => updateSubstance(id, data),
        onSuccess: (_, { id }) => {
            // Обновляем список веществ
            queryClient.invalidateQueries({ queryKey: SUBSTANCE_QUERY_KEY });
            // Обновляем конкретное вещество
            queryClient.invalidateQueries({ queryKey: ['substance', id] });
        },
    });
};

// Удаление Substance
export const useDeleteSubstance = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteSubstance,
        onSuccess: (_, id) => {
            // Обновляем список веществ
            queryClient.invalidateQueries({ queryKey: SUBSTANCE_QUERY_KEY });
            // Удаляем кэш для конкретного вещества
            queryClient.removeQueries({ queryKey: ['substance', id] });
        },
    });
};
