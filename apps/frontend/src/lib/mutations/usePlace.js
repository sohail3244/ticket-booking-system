import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api";

// 🔹 CREATE PLACE
export const useCreatePlace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const res = await api.post("/place", payload);
      return res?.data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["places"] });
    },
  });
};

// 🔹 UPDATE PLACE
export const useUpdatePlace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }) => {
      const res = await api.put(`/place/${id}`, payload);
      return res?.data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["places"] });
    },
  });
};

// 🔹 DELETE PLACE
export const useDeletePlace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      await api.delete(`/place/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["places"] });
    },
  });
};