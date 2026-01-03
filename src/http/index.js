import axios from "axios";
const baseURL = import.meta.env.VITE_API_URL;
export const httpGet = async (path, params) => {
  try {
    const response = await axios.get(`${baseURL + path}`, params);
    return response
  } catch (error) {
    return error;
  }
}

export const httpPost = async (path, body, header) => {
  try {
    const response = await axios.post(`${baseURL + path}`, body, header);
    return response
  } catch (error) {
    return error;
  }
};

export const httpDelete = async (path, header) => {
  try {
    const response = await axios.delete(`${baseURL + path}`, header);
    return response
  } catch (error) {
    return error;
  }
};


export const httpPut = async (path, params, header) => {
  try {
    const response = await axios.put(`${baseURL + path}`, params, header);
    return response
  } catch (error) {
   return error;
  }
};


