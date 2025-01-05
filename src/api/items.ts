import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SERVER_URL } from 'utils/constants';
import axios from 'axios';
import { IItem } from 'types/items';
import { getAllResources } from './resources';

const GET_ITEM_KEY = 'items/byResourceId';

export const getItemByResourceId = (resourceId: string) => {
  return useQuery({
    queryKey: [GET_ITEM_KEY, resourceId],
    queryFn: async (): Promise<IItem | null> => {
      return axios
        .get<IItem[]>(`${SERVER_URL}items/?resourceId=${resourceId}`)
        .then((response) => {
          if (response.data.length === 0) return null;
          return response.data[0];
        })
        .catch((error) => {
          console.error('Error when getting item by resourceid', error);
          throw error;
        });
    },
    enabled: !!(getAllResources().data),
  });
};

export const createItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (req: { description: string, name: string, resourceId: string }): Promise<IItem> => {
      return axios
        .post<IItem>(`${SERVER_URL}items/`, req)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          alert('Error when creating item: ' + error);
          throw error;
        });
    },
    onSuccess: (payload: IItem) => {
      queryClient.invalidateQueries({ queryKey: [GET_ITEM_KEY] });
    },
  });
};

export const updateItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (req: IItem): Promise<IItem> => {
      return axios
        .patch(`${SERVER_URL}items/${req.id}`, req)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          alert('Error when getting item' + error);
          throw error;
        });
    },
    onSuccess: (newItem: IItem) => {
      queryClient.invalidateQueries({ queryKey: [GET_ITEM_KEY] });
    },
  });
};

export const deleteItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (req: { id: string }): Promise<string> => {
      return axios
        .delete(`${SERVER_URL}items/${req.id}`)
        .then(() => {
          return req.id;
        })
        .catch((error) => {
          alert('Error when getting item' + error);
          throw error;
        });
    },
    onSuccess: (deletedItemId: string) => {
      queryClient.invalidateQueries({ queryKey: [GET_ITEM_KEY] });
    },
  });
};