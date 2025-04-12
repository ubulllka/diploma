import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getTakings,
    getTaking,
    createTaking,
    updateTaking,
    deleteTaking,
} from '../api/takingsApi.js'; // предполагаемое имя файла с API-функциями

// Ключ для кэширования
const TAKING_QUERY_KEY = ['takings'];

// Получение списка всех Takings
export const useTakings = () => {
    return useQuery({
        queryKey: TAKING_QUERY_KEY,
        queryFn: getTakings,
    });
};

// Получение конкретного Taking по ID
export const useTaking = (id) => {
    return useQuery({
        queryKey: ['taking', id],
        queryFn: () => getTaking(id),
        enabled: !!id,
    });
};

// Создание нового Taking
export const useCreateTaking = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createTaking,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TAKING_QUERY_KEY });
        },
    });
};

// Обновление Taking
export const useUpdateTaking = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => updateTaking(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: TAKING_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: ['taking', id] });
        },
    });
};

// Удаление Taking
export const useDeleteTaking = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteTaking,
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: TAKING_QUERY_KEY });
            queryClient.removeQueries({ queryKey: ['taking', id] });
        },
    });
};
