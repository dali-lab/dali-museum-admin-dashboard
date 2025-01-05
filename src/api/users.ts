import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SERVER_URL } from 'utils/constants';
import axios from 'axios';
import { UserScopes, IUser } from 'types/users';

const GET_USER_KEY = 'users/individual';

const USER_INITIAL_DATA = {
  id: '',
  email: '',
  name: '',
  role: UserScopes.Unverified,
  authenticated: false,
};

export const getUser = (id: string) => {
  return useQuery({
    queryKey: [GET_USER_KEY, id],
    queryFn: async (): Promise<IUser> => {
      return axios
        .get<IUser>(`${SERVER_URL}users/${id}`)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error('Error when getting all users', error);
          throw error;
        });
    },
    initialData: USER_INITIAL_DATA,
  });
};

export const createUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (req: { email: string, password: string, name: string }): Promise<IUser> => {
      return axios
        .post<IUser>(`${SERVER_URL}users/`, req)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          alert('Error when creating user: ' + error);
          throw error;
        });
    },
    onSuccess: (newUser: IUser) => {
      queryClient.setQueryData([GET_USER_KEY], newUser);
    },
  });
};

export const updateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (req: { id: string, email: string, password: string, role: UserScopes }): Promise<IUser> => {
      return axios
        .patch(`${SERVER_URL}users/${req.id}`, req)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          alert('Error when getting user' + error);
          throw error;
        });
    },
    onSuccess: (newUser: IUser) => {
      queryClient.setQueryData([GET_USER_KEY], newUser);
    },
  });
};

export const deleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (req: { id: string }): Promise<string> => {
      return axios
        .delete(`${SERVER_URL}users/${req.id}`)
        .then(() => {
          return req.id;
        })
        .catch((error) => {
          alert('Error when getting user' + error);
          throw error;
        });
    },
    onSuccess: () => {
      queryClient.setQueryData([GET_USER_KEY], USER_INITIAL_DATA);
    },
  });
};