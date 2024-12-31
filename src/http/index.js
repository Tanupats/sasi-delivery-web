import axios from "axios";
const baseURL = import.meta.env.VITE_BAKUP_URL;

export const httpGet = async (path, params) => {
  try {
    const response = await axios.get(`${baseURL + path}`, params);
    return response
  } catch (error) {
    console.log('error fetch')
  }
};

