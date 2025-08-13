import { SERVER_URL } from "@/utils/constants";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const getExport = () => {
  return useMutation({
    mutationFn: async (): Promise<Blob> => {
      return axios
        .post(`${SERVER_URL}export/`, null, { responseType: "blob" })
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          throw Error(error.response?.data?.errors?.join("; ") ?? error);
        });
    },
    onError: (error: Error) => {
      console.error("Export failed:", error.message);
      throw error;
    },
  });
};
