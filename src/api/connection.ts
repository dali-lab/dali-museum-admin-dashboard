import { useQuery } from '@tanstack/react-query';
import { SERVER_URL } from '@/utils/constants';
import axios from 'axios';

const CONNECTION_KEY = 'connection';

export const getConnection = () => {
  return useQuery({
    queryKey: [CONNECTION_KEY],
    queryFn: async () => {
      return axios
        .get<string>(`${SERVER_URL}`)
        .then((response) => {
          return {
            isConnected: true,
          };
        })
        .catch((err) => {
          return {
            isConnected: false,
          };
        });
    },
    initialData: {
      isConnected: false,
    },
    retry: 5,
  });
};