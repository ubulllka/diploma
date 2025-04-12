import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getResources,
  getResource,
  createResource,
  updateResource,
  deleteResource,
  subResource
} from '../api/resourcesApi';

const RESOURCE_QUERY_KEY = ['resources'];

// Получение списка ресурсов с фильтрами
export const useResources = (filters) => {
  return useQuery({
    queryKey: [...RESOURCE_QUERY_KEY, filters],
    queryFn: () => getResources(filters),
  });
};

// Получение одного ресурса по ID
export const useResource = (id) => {
  return useQuery({
    queryKey: [...RESOURCE_QUERY_KEY, 'single', id],
    queryFn: () => getResource(id),
    enabled: !!id, // запрос выполняется только если id задан
  });
};

// Создание ресурса
export const useCreateResource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createResource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESOURCE_QUERY_KEY });
    },
  });
};

// Обновление ресурса
export const useUpdateResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateResource(id, data),
    onSuccess: (_, { id }) => {
      // Обновляем список
      queryClient.invalidateQueries({ queryKey: RESOURCE_QUERY_KEY });
      // Обновляем конкретный ресурс
      queryClient.invalidateQueries({ queryKey: [...RESOURCE_QUERY_KEY, 'single', id] });
    },
  });
};

// Удаление ресурса
export const useDeleteResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteResource,
    onSuccess: (_, id) => {
      // Обновляем список
      queryClient.invalidateQueries({ queryKey: RESOURCE_QUERY_KEY });
      // Удаляем кэш конкретного ресурса
      queryClient.removeQueries({ queryKey: [...RESOURCE_QUERY_KEY, 'single', id] });
    },
  });
};

export const useSubResources = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => subResource(id, data),
    onSuccess: (_, { id }) => {
      // Обновляем список
      queryClient.invalidateQueries({ queryKey: RESOURCE_QUERY_KEY });
      // Обновляем конкретный ресурс
      queryClient.invalidateQueries({ queryKey: [...RESOURCE_QUERY_KEY, 'single', id] });
    }
  })
}