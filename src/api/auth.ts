/* eslint-disable @typescript-eslint/indent */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ROUTES, SERVER_URL } from "@/utils/constants";
import axios from "axios";
import { IUser, UserScopes } from "@/types/users";
import { getBearerToken, setBearerToken } from "@/utils/localStorage";
import { useNavigate } from "react-router-dom";

interface LoginResponse {
  token: string;
  user: IUser;
}

const GET_AUTH_USER_DATA_KEY = "auth/user";

const USER_INITIAL_DATA = {
  id: "",
  email: "",
  name: "",
  role: UserScopes.Unverified,
  isVerified: false,
  authenticated: false,
};

export const setCredentials = (token: string) => {
  setBearerToken(token);
  axios.defaults.headers.common.Authorization = `Bearer ${token}`;
};

export const getAuthUser = () => {
  return useQuery({
    queryKey: [GET_AUTH_USER_DATA_KEY],
    initialData: USER_INITIAL_DATA,
  });
};

export const logout = () => {
  const queryClient = useQueryClient();
  const nav = useNavigate();

  return useMutation({
    mutationFn: async () => {
      setCredentials("");
      return "";
    },
    onSuccess: () => {
      queryClient.setQueryData([GET_AUTH_USER_DATA_KEY], USER_INITIAL_DATA);
      nav(ROUTES.WELCOME);
    },
  });
};

export const signUp = () => {
  const queryClient = useQueryClient();
  const nav = useNavigate();

  return useMutation({
    mutationFn: async (credentials: {
      email: string;
      password: string;
      name: string;
      role: UserScopes;
    }) => {
      return axios.post<LoginResponse>(`${SERVER_URL}auth/signup`, credentials);
    },
    onSuccess: ({ data: payload }) => {
      queryClient.setQueryData([GET_AUTH_USER_DATA_KEY], {
        ...payload.user,
        authenticated: true,
      });
      setCredentials(payload.token);
      nav(ROUTES.DASHBOARD);
    },
    onError: (error) => {
      alert("Error when signing up: " + error);
    },
  });
};

export const signIn = () => {
  const queryClient = useQueryClient();
  const nav = useNavigate();

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      return axios
        .post<LoginResponse & { errors: string[] }>(
          `${SERVER_URL}auth/login`,
          credentials
        )
        .then((response) => {
          return response;
        })
        .catch((error) => {
          if (error.response?.status == 401)
            throw Error(error.response?.data.errors[0]);

          throw error;
        });
    },
    onSuccess: ({ data: payload }) => {
      setCredentials(payload.token); // TODO: Check async
      queryClient.setQueryData([GET_AUTH_USER_DATA_KEY], {
        ...payload.user,
        authenticated: true,
      });
      nav(ROUTES.DASHBOARD);
    },
    onError: (error) => {
      alert(error.message);
      console.error("Error when logging in", error);
    },
  });
};

export const jwtSignIn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const token = getBearerToken();
      if (!token) {
        throw Error("null token");
      }

      return axios
        .get<LoginResponse>(`${SERVER_URL}auth/jwt-signin/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (token) {
            setCredentials(token);
          }
          return response.data;
        })
        .catch((err) => {
          console.error(err);
          alert("Your login session has expired. Please log in again");
          throw err;
        });
    },
    onSuccess: (payload) => {
      queryClient.setQueryData([GET_AUTH_USER_DATA_KEY], {
        ...payload.user,
        authenticated: true,
      });
    },
    onError: (error) => {
      queryClient.setQueryData([GET_AUTH_USER_DATA_KEY], {
        ...USER_INITIAL_DATA,
        authenticated: false,
      });
      // logout
      setCredentials("");
    },
  });
};

export const resendCode = async (req: { id: string; email: string }) => {
  return axios
    .post<LoginResponse>(`${SERVER_URL}auth/resend-code/${req.id}`, req)
    .then((response) => {
      if (response.status === 201) {
        return true;
      }
      return false;
    })
    .catch((error) => {
      console.error("Error when sending code", error);
    });
};
