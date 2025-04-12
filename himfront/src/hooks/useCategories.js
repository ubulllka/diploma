import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {getCategories, createCategory, updateCategory, deleteCategory, getCategory} from '../api/categoriesApi';

const CATEGORY_QUERY_KEY = ['categories'];

// Получение списка всех категорий с фильтрами
export const useCategories = () => {
    return useQuery({
        queryKey: CATEGORY_QUERY_KEY, // Добавляем фильтры в ключ для кэширования
        queryFn: getCategories,
    });
};

// Получение конкретной категории по ID
export const useCategory = (id) => {
    return useQuery({
        queryKey: ['category', id], // Используем уникальный ключ с ID для кэширования
        queryFn: () => getCategory(id),
        enabled: !!id, // Хук будет активен только если id передан
    });
};

// Создание новой категории
export const useCreateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEY });
        },
    });
};

// Обновление категории
export const useUpdateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => updateCategory(id, data),
        onSuccess: (_, { id }) => {
            // Обновляем список категорий
            queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEY });
            // Обновляем конкретную категорию
            queryClient.invalidateQueries({ queryKey: ['category', id] });
        },
    });
};

// Удаление категории
export const useDeleteCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteCategory,
        onSuccess: (_, id) => {
            // Обновляем список категорий
            queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEY });
            // Удаляем кэш для конкретной категории
            queryClient.removeQueries({ queryKey: ['category', id] });
        },
    });
};
