import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SERVER_URL } from "@/utils/constants";
import axios from "axios";
import { IPainting } from "@/types/painting";

const GET_PAINTINGS_KEY = "paintings";
export const getPaintings = () => {
  return useQuery({
    queryKey: [GET_PAINTINGS_KEY],
    queryFn: async (): Promise<IPainting[]> => {
      return axios
        .get<IPainting[]>(`${SERVER_URL}paintings/`)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error("Error when getting paintings", error);
          throw error;
        });
    },
  });
};

const GET_PAINTING_KEY = "painting/byId";
export const getPainting = (
  id: string,
  options?: { retry: boolean | number }
) => {
  return useQuery({
    queryKey: [GET_PAINTING_KEY, id],
    queryFn: async (): Promise<IPainting | null> => {
      return axios
        .get<IPainting>(`${SERVER_URL}paintings/${id}`)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(
            "Error when getting painting by id",
            error.response.data
          );
          throw error;
        });
    },
    retry: options?.retry ?? 3,
  });
};

export const createPainting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (req: { url: string }): Promise<IPainting> => {
      return axios
        .post<IPainting>(`${SERVER_URL}paintings/`, req)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error("Error when creating painting", error);
          throw error;
        });
    },
    onSuccess: (payload: IPainting) => {
      queryClient.invalidateQueries({ queryKey: [GET_PAINTINGS_KEY] });
      queryClient.invalidateQueries({
        queryKey: [GET_PAINTING_KEY, payload.id],
      });
    },
  });
};

export const updatePainting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (req: Partial<IPainting>): Promise<IPainting> => {
      const { id, ...body } = req;
      return axios
        .put(`${SERVER_URL}paintings/${id}`, body)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          const message = error.response?.data?.errors
            ? error.response.data.errors.join("; ")
            : (error.message ?? error);

          console.error("Error when updating painting: " + message);

          throw Error(message);
        });
    },
    onSuccess: (payload: IPainting) => {
      queryClient.invalidateQueries({ queryKey: [GET_PAINTINGS_KEY] });
      queryClient.invalidateQueries({
        queryKey: [GET_PAINTING_KEY, payload.id],
      });
    },
  });
};

export const deletePainting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (req: { id: string }): Promise<string> => {
      return axios
        .delete(`${SERVER_URL}paintings/${req.id}`)
        .then(() => {
          return req.id;
        })
        .catch((error) => {
          const message = error.response?.data?.errors
            ? error.response.data.errors.join("; ")
            : (error.message ?? error);

          console.error("Error when deleting painting: " + message);

          throw Error(message);
        });
    },
    onSuccess: (deletedId: string) => {
      queryClient.invalidateQueries({ queryKey: [GET_PAINTINGS_KEY] });
      queryClient.invalidateQueries({
        queryKey: [GET_PAINTING_KEY, deletedId],
      });
    },
  });
};
