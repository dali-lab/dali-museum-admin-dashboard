import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ROUTES, SERVER_URL } from "@/utils/constants";
import axios from "axios";
import { UserScopes, IUser } from "@/types/users";
import { useNavigate } from "react-router-dom";

const GET_USER_KEY = "users/individual";

const USER_INITIAL_DATA = {
  id: "",
  email: "",
  name: "",
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
          console.error("Error when getting all users", error);
          throw error;
        });
    },
    initialData: USER_INITIAL_DATA,
  });
};

export const createUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (req: {
      email: string;
      password: string;
      name: string;
    }): Promise<IUser> => {
      return axios
        .post<IUser>(`${SERVER_URL}users/`, req)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          alert("Error when creating user: " + error);
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
    mutationFn: async (req: {
      id: string;
      email: string;
      password: string;
      role: UserScopes;
    }): Promise<IUser> => {
      return axios
        .patch(`${SERVER_URL}users/${req.id}`, req)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          alert("Error when getting user" + error);
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
          alert("Error when getting user" + error);
          throw error;
        });
    },
    onSuccess: () => {
      queryClient.setQueryData([GET_USER_KEY], USER_INITIAL_DATA);
    },
  });
};

const GET_PENDING_USERS = "users/pending";

export type PartialUser = {
  id: string;
  name: string;
  email: string;
  date: Date;
};

export const getPendingUsers = () => {
  const nav = useNavigate();

  return useQuery({
    queryKey: [GET_PENDING_USERS],
    queryFn: async (): Promise<PartialUser[]> => {
      return axios
        .get<PartialUser[]>(`${SERVER_URL}auth/pending`)
        .then((response) => {
          return response.data as PartialUser[];
        })
        .catch((error) => {
          console.error("Error when getting pending users", error);
          nav(ROUTES.DASHBOARD);
          throw error;
        });
    },
  });
};

const GET_ADMINS = "users/admins";

export const getApprovedUsers = () => {
  const nav = useNavigate();

  return useQuery({
    queryKey: [GET_ADMINS],
    queryFn: async (): Promise<PartialUser[]> => {
      return axios
        .get<PartialUser[]>(`${SERVER_URL}auth/admins`)
        .then((response) => {
          return response.data as PartialUser[];
        })
        .catch((error) => {
          console.error("Error when getting pending users", error);
          nav(ROUTES.DASHBOARD);
          throw error;
        });
    },
  });
};

export const approveUser = () => {
  const nav = useNavigate();

  return useMutation({
    mutationFn: async (req: { email: string }) => {
      return axios.post(`${SERVER_URL}auth/pending`, req).catch((error) => {
        alert("Error when getting pending admins" + error);
        throw error;
      });
    },
    onError: () => {
      nav(ROUTES.DASHBOARD);
    },
  });
};
