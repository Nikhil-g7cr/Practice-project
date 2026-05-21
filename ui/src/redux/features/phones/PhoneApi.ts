import API from "../../../config/axios.config";
import type { Phone, PhoneResponse, PhonesResponse } from "./PhoneTypes";

export const fetchPhonesApi = async () => {
  const response = await API.get<PhonesResponse>("/phones");

  return response.data;
};

export const getPhonesApi = async (page: number = 1, limit: number = 8) => {
  const response = await API.get<PhonesResponse>("/phones", {
    params: { page, limit },
  });

  return response.data;
};

export const getPhoneImages= async(fileName:string)=>{
  const res = await API.get(`/upload/${fileName}`)

  return res.data;
}

export const uploadImageToAzureApi = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await API.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};


// ui/src/shared/api-endpoints.ts (or wherever you keep your API calls)

export const getAllUploadedFilesApi = async () => {
  // Call the new GET endpoint we made in the backend
  const response = await API.get("/upload");
  
  // Return the array of files sitting inside the 'data' property
  return response.data.data; 
};


export const updatePhoneApi = async (id: string, data: Partial<Phone>) => {
  const response = await API.patch<PhoneResponse>(`/phones/${id}`, data);

  return response.data;
};


// Add this to your existing PhoneApi.ts file

export const deleteImageFromAzureApi = async (fileName: string) => {
  // Calls the DELETE http://localhost:3000/upload/:blobName endpoint
  const response = await API.delete(`/upload/${fileName}`);
  return response.data;
};