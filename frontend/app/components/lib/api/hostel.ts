import { apiRequest } from "@/app/components/lib/api";

export interface HostelImage {
  url: string;
  publicId: string;
}

export interface HostelCity {
  _id: string;
  name: string;
}

export interface HostelArea {
  _id: string;
  name: string;
}

export interface HostelOwner {
  _id: string;
  name: string;
}

export interface Hostel {
  _id: string;
  name: string;
  city: HostelCity;
  area: HostelArea;
  type: "boys" | "girls" | "co-living";
  address: string;
  latitude: number;
  longitude: number;
  monthlyRent: number;
  securityDeposit?: number;
  amenities: string[];
  images: HostelImage[];
  description?: string;
  isActive: boolean;
  owner: HostelOwner;
  createdAt: string;
  updatedAt: string;
}

export interface HostelResponse {
  success: boolean;
  hostels: Hostel[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface GetHostelsParams {
  search?: string;
  city?: string;
  area?: string;
  type?: "boys" | "girls" | "co-living";
  minRent?: number;
  maxRent?: number;
  page?: number;
  limit?: number;
}

export const getHostels = async (
  params: GetHostelsParams = {},
): Promise<HostelResponse> => {
  const searchParams = new URLSearchParams();

  if (params.search) {
    searchParams.set("search", params.search);
  }

  if (params.city) {
    searchParams.set("city", params.city);
  }

  if (params.area) {
    searchParams.set("area", params.area);
  }

  if (params.type) {
    searchParams.set("type", params.type);
  }

  if (params.minRent !== undefined) {
    searchParams.set("minRent", String(params.minRent));
  }

  if (params.maxRent !== undefined) {
    searchParams.set("maxRent", String(params.maxRent));
  }

  if (params.page !== undefined) {
    searchParams.set("page", String(params.page));
  }

  if (params.limit !== undefined) {
    searchParams.set("limit", String(params.limit));
  }

  const query = searchParams.toString();

  return apiRequest<HostelResponse>(
    query ? "/hostels?" + query : "/hostels",
  );
};

