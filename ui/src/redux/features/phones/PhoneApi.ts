import axios from "axios";

const BASE_URL = "http://localhost:3000/api/phones";

export const fetchPhonesApi = async () => {
  const response = await axios.get(BASE_URL);

  return response.data.data;
};

export const getPhonesApi = async (page: number = 1, limit: number = 8) => {
  // Pass them as query strings
  const response = await axios.get(`/api/phones?page=${page}&limit=${limit}`);
  return response.data; // This will return { status, code, data, meta }
};

export const updatePhoneApi = async (
  id: string,
  data: any,
) => {

  const response = await axios.patch(
    `${BASE_URL}/${id}`,
    data,
  );

  return response.data;
};