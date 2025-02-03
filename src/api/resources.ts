import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SERVER_URL } from "@/utils/constants";
import axios from "axios";
import { IResource } from "@/types/resources";

export const GET_ALL_RESOURCES_KEY = "resources/all";

export const getAllResources = () => {
  return useQuery({
    queryKey: [GET_ALL_RESOURCES_KEY],
    queryFn: async (): Promise<IResource[]> => {
      return axios
        .get<IResource[]>(`${SERVER_URL}resources/`)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error("Error when getting all resources", error);
          throw error;
        });
    },
    initialData: [],
  });
};

export const createResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (req: {
      title: string;
      description: string;
      value: number;
    }): Promise<IResource> => {
      return axios
        .post<IResource>(`${SERVER_URL}resources/`, req)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          alert("Error when creating resource: " + error);
          throw error;
        });
    },
    onSuccess: (payload: IResource) => {
      queryClient.setQueryData(
        [GET_ALL_RESOURCES_KEY],
        (prevData: IResource[]) => [...prevData, payload]
      );
    },
  });
};

export const getIndividualResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<IResource> => {
      return axios
        .get<IResource>(`${SERVER_URL}resources/${id}`)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          alert("Error when creating resource: " + error);
          throw error;
        });
    },
    onSuccess: (newResource: IResource) => {
      queryClient.setQueryData(
        [GET_ALL_RESOURCES_KEY],
        (prevData: IResource[]) => {
          let flag = false;

          const newData = prevData.map((oldResource: IResource) => {
            if (oldResource.id === newResource.id) {
              flag = true;
              return newResource;
            } else {
              return oldResource;
            }
          });

          // If flag = true, then loaded resource existed before, so override previously existing copy
          // If falg = false, then loaded resource did not exist before, so add to end of the list
          return flag ? newData : [...prevData, newResource];
        }
      );
    },
  });
};

export const updateResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (req: IResource): Promise<IResource> => {
      return axios
        .patch(`${SERVER_URL}resources/${req.id}`, req)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          alert("Error when getting resource" + error);
          throw error;
        });
    },
    onSuccess: (newResource: IResource) => {
      queryClient.setQueryData(
        [GET_ALL_RESOURCES_KEY],
        (prevData: IResource[]) =>
          prevData.map((oldResource) =>
            oldResource.id === newResource.id ? newResource : oldResource
          )
      );
    },
  });
};

export const deleteResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (req: { id: string }): Promise<string> => {
      return axios
        .delete(`${SERVER_URL}resources/${req.id}`)
        .then(() => {
          return req.id;
        })
        .catch((error) => {
          alert("Error when getting resource" + error);
          throw error;
        });
    },
    onSuccess: (deletedResourceId: string) => {
      queryClient.setQueryData(
        [GET_ALL_RESOURCES_KEY],
        (prevData: IResource[]) =>
          prevData.filter((x) => x.id !== deletedResourceId)
      );
    },
  });
};

// export const exampleMutation = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async () => {

//     },
//     onSuccess: () => {

//     },
//   });
// };
