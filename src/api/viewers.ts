import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { SERVER_URL } from "@/utils/constants";

interface ViewerStats {
  viewersToday: number;
  totalTime: number; // in seconds
  averageTime: number; // in seconds
}

const GET_STATS_KEY = "stats";
export const getViewerStats = () => {
  return useQuery({
    queryKey: [GET_STATS_KEY],
    queryFn: async (): Promise<ViewerStats> => {
      return axios
        .get<ViewerStats>(`${SERVER_URL}viewers/stats/`)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error("Error when getting viewer stats", error);
          throw error;
        });
    },
  });
};
