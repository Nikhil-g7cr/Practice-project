import API from "../../../config/axios.config";
import type { LaptopResponse, LaptopsResponse, Laptop } from "./LaptopTypes";

export const getLaptopsApi = async (page: number = 1, limit: number = 8) => {
  const response = await API.get<LaptopsResponse>("/laptops", {
    params: { page, limit },
  });

  return response.data;
};

export const updateLaptopApi = async (id: string, data: Partial<Laptop>) => {
  const response = await API.patch<LaptopResponse>(`/laptops/${id}`, data);

  return response.data;
};
