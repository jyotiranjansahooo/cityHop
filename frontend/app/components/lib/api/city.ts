import { apiRequest } from "@/app/components/lib/api";

export interface City {
  _id: string;
  name: string;
  state?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CityResponse {
  success: boolean;
  cities: City[];
}

export const getCities = async (): Promise<City[]> => {
  const response = await apiRequest<CityResponse>("/cities");

  return response.cities;
};

