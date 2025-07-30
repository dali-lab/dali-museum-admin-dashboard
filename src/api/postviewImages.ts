import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { SERVER_URL } from "@/utils/constants";
import { IPostviewImage } from "@/types/postviewImage";
import { GET_PAINTING_KEY } from "./paintings";

export const GET_POSTVIEW_IMAGE_KEY = "postviewImage";

export const getActivePostviewImage = (postviewImageId: string) => {
  return useQuery({
    queryKey: [GET_POSTVIEW_IMAGE_KEY, postviewImageId],
    queryFn: async (): Promise<IPostviewImage | null> => {
      console.log("getting active postview image");
      if (postviewImageId === "") return null;

      return axios
        .get<IPostviewImage>(`${SERVER_URL}postview-images/${postviewImageId}`)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(
            "Error when getting active postview image",
            error.response.data
          );
          throw error;
        });
    },
    retry: 3,
  });
};

export const createPostviewImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (req: {
      image: File;
      paintingId: string;
    }): Promise<IPostviewImage> => {
      const formData = new FormData();
      formData.append("paintingId", req.paintingId);
      formData.append("image", req.image);

      return axios
        .post<IPostviewImage>(`${SERVER_URL}postview-images/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error("Error when creating postview image: " + error);
          throw Error(error.response?.data?.errors.join("; ") ?? error);
        });
    },
    onSuccess: (payload: IPostviewImage, { paintingId }) => {
      queryClient.invalidateQueries({
        queryKey: [GET_POSTVIEW_IMAGE_KEY, payload.id],
      });
      queryClient.invalidateQueries({
        queryKey: [GET_PAINTING_KEY, paintingId],
      });
    },
  });
};

export const removePostviewImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (req: {
      id: string;
      paintingId: string;
    }): Promise<IPostviewImage> => {
      return axios
        .delete<IPostviewImage>(`${SERVER_URL}postview-images/${req.id}`)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error("Error when removing postview image: " + error);
          throw Error(error.response?.data?.errors.join("; ") ?? error);
        });
    },
    onSuccess: (payload: IPostviewImage, { id, paintingId }) => {
      queryClient.invalidateQueries({
        queryKey: [GET_POSTVIEW_IMAGE_KEY, id],
      });
      queryClient.invalidateQueries({
        queryKey: [GET_PAINTING_KEY, paintingId],
      });
    },
  });
};
