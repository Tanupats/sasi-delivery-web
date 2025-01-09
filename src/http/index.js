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

export const httpPost = async (path, body) => {
  try {
    const response = await axios.post(`${baseURL + path}`, body);
    return response
  } catch (error) {
    console.log('error fetch')
  }
};

export const httpDelete = async (path) => {
  try {
    const response = await axios.delete(`${baseURL + path}`);
    return response
  } catch (error) {
    console.log('error fetch')
  }
};


export const httpPut = async (path,params) => {
  try {
    const response = await axios.put(`${baseURL + path}`,params);
    return response
  } catch (error) {
    console.log('error fetch')
  }
};

