import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getUsages,
    getUsage,
    createUsage,
    updateUsage,
    deleteUsage,
} from '../api/usagesApi'; // путь к файлу с API-функциями

// Ключ для кэширования (общий список)
const USAGE_QUERY_KEY = (tId) => ['usages', tId];

// Получение всех usages для конкретного taking
export const useUsages = (tId) => {
    return useQuery({
        queryKey: USAGE_QUERY_KEY(tId),
        queryFn: () => getUsages(tId),
        enabled: !!tId,
    });
};

// Получение конкретного usage по ID и tId
export const useUsage = (tId, id) => {
    return useQuery({
        queryKey: ['usage', tId, id],
        queryFn: () => getUsage(tId, id),
        enabled: !!tId && !!id,
    });
};

// Создание нового usage
export const useCreateUsage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({tId, data} ) => createUsage(tId, data),
        onSuccess: (_,{tId}) => {
            queryClient.invalidateQueries({ queryKey: USAGE_QUERY_KEY(tId) });
        },
    });
};

// Обновление usage
export const useUpdateUsage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (tId, { id, data }) => updateUsage(tId, id, data),
        onSuccess: (_, {tId, id }) => {
            queryClient.invalidateQueries({ queryKey: USAGE_QUERY_KEY(tId) });
            queryClient.invalidateQueries({ queryKey: ['usage', tId, id] });
        },
    });
};

// Удаление usage
export const useDeleteUsage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({tId, id}) => deleteUsage(tId, id),
        onSuccess: (_, {tId, id}) => {
            queryClient.invalidateQueries({ queryKey: USAGE_QUERY_KEY(tId) });
            queryClient.removeQueries({ queryKey: ['usage', tId, id] });
        },
    });
};
