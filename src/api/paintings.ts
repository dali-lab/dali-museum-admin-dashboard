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
export const getPainting = (id: string) => {
  return useQuery({
    queryKey: [GET_PAINTING_KEY, id],
    queryFn: async (): Promise<IPainting | null> => {
      return axios
        .get<IPainting>(`${SERVER_URL}paintings/${id}`)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error("Error when getting painting by id", error);
          throw error;
        });
    },
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
          alert("Error when creating painting: " + error);
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
      return axios
        .patch(`${SERVER_URL}paintings/${req.id}`, req)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          alert("Error when updating painting" + error);
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
          alert("Error when deleting painting" + error);
          throw error;
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
