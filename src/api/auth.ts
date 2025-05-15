/* eslint-disable @typescript-eslint/indent */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ROUTES, SERVER_URL } from "@/utils/constants";
import axios from "axios";
import { UserScopes } from "@/types/users";
import { getBearerToken, setBearerToken } from "@/utils/localStorage";
import { useNavigate } from "react-router-dom";

interface LoginResponse {
  token: string;
  user: {
    // id: string;
    email: string;
    // no password
    name: string;
    role: UserScopes;
  };
}

const GET_AUTH_USER_DATA_KEY = "auth/user";

const USER_INITIAL_DATA = {
  id: "",
  email: "",
  name: "",
  role: UserScopes.Unverified,
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
      nav("/");
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
      is_admin: boolean;
      is_researcher: boolean;
    }) => {
      return axios.post(`${SERVER_URL}auth/signup`, credentials);
    },
    onSuccess: (payload) => {
      alert("Sign up successful!");
      queryClient.setQueryData([GET_AUTH_USER_DATA_KEY], {
        ...payload.user,
        authenticated: true,
      });
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
        .post<LoginResponse>(`${SERVER_URL}auth/login`, credentials)
        .then((response) => {
          if (response.status == 403) {
            // forbidden - not verified
            return {
              user: { email: credentials.email },
              verified: false,
            };
          }
          setCredentials(response.data.token); // TODO: Check async
          alert("Signed In!");
          return { ...response.data };
        })
        .catch((error) => {
          alert(
            "Unable to log in, please ensure your email and password are correct."
          );
          console.error("Error when logging in", error);
          throw error;
        });
    },
    onSuccess: (payload) => {
      queryClient.setQueryData([GET_AUTH_USER_DATA_KEY], {
        ...payload.user,
        authenticated: true,
      });
      nav(ROUTES.DASHBOARD);
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
          alert("Your login session has expired.");
          throw err;
        });
    },
    onSuccess: (payload) => {
      queryClient.setQueryData([GET_AUTH_USER_DATA_KEY], {
        ...payload.user,
        authenticated: true,
      });
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

export const verify = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (req: { id: string; email: string; code: string }) => {
      return axios
        .patch<LoginResponse>(`${SERVER_URL}auth/verify/${req.id}`, req)
        .then((response) => {
          return response.data;
        })
        .catch((err) => {
          console.error("Error when verifying", err);
          throw err;
        });
    },
    onSuccess: (payload) => {
      setCredentials(payload.token); // TODO: Check async
      queryClient.setQueryData([GET_AUTH_USER_DATA_KEY], {
        ...payload.user,
        authenticated: true,
      });
    },
  });
};
