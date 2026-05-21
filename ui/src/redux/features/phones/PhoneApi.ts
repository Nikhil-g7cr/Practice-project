import axios from "axios";

const BASE_URL = "http://localhost:3000/api/phones";

export const fetchPhonesApi = async () => {
  const response = await axios.get(BASE_URL);

  return response.data.data;
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