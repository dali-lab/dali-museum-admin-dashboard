import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { SERVER_URL } from "@/utils/constants";
import { IPostviewImage } from "@/types/postviewImage";

export const GET_POSTVIEW_IMAGE_KEY = "postviewImage";

export const getActivePostviewImage = (paintingId: string) => {
  return useQuery({
    queryKey: [GET_POSTVIEW_IMAGE_KEY, paintingId],
    queryFn: async (): Promise<IPostviewImage | null> => {
      return axios
        .get<IPostviewImage>(`${SERVER_URL}postviewImages/active/${paintingId}`)
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
        .post<IPostviewImage>(`${SERVER_URL}postviewImages/`, formData, {
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
    onSuccess: (payload: IPostviewImage) => {
      queryClient.invalidateQueries({
        queryKey: [GET_POSTVIEW_IMAGE_KEY, payload.paintingId],
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
        .delete<IPostviewImage>(`${SERVER_URL}postviewImages/${req.id}`)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error("Error when removing postview image: " + error);
          throw Error(error.response?.data?.errors.join("; ") ?? error);
        });
    },
    onSuccess: (payload: IPostviewImage, { paintingId }) => {
      queryClient.invalidateQueries({
        queryKey: [GET_POSTVIEW_IMAGE_KEY, paintingId],
      });
    },
  });
};
