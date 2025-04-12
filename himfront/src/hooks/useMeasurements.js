import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getMeasurements,
    createMeasurement,
    updateMeasurement,
    deleteMeasurement,
    getMeasurement,
} from '../api/measurementApi';

// Ключ для кэширования
const MEASUREMENT_QUERY_KEY = ['measurements'];

// Получение списка всех Measurement с фильтрами
export const useMeasurements = () => {
    return useQuery({
        queryKey: MEASUREMENT_QUERY_KEY,
        queryFn: getMeasurements,
    });
};

// Получение конкретного Measurement по ID
export const useMeasurement = (id) => {
    return useQuery({
        queryKey: ['measurement', id], // Используем уникальный ключ с ID для кэширования
        queryFn: () => getMeasurement(id),
        enabled: !!id, // Хук будет активен только если id передан
    });
};

// Создание новой Measurement
export const useCreateMeasurement = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createMeasurement,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: MEASUREMENT_QUERY_KEY });
        },
    });
};

// Обновление Measurement
export const useUpdateMeasurement = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => updateMeasurement(id, data),
        onSuccess: (_, { id }) => {
            // Обновляем список измерений
            queryClient.invalidateQueries({ queryKey: MEASUREMENT_QUERY_KEY });
            // Обновляем конкретное измерение
            queryClient.invalidateQueries({ queryKey: ['measurement', id] });
        },
    });
};

// Удаление Measurement
export const useDeleteMeasurement = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteMeasurement,
        onSuccess: (_, id) => {
            // Обновляем список измерений
            queryClient.invalidateQueries({ queryKey: MEASUREMENT_QUERY_KEY });
            // Удаляем кэш для конкретного измерения
            queryClient.removeQueries({ queryKey: ['measurement', id] });
        },
    });
};
