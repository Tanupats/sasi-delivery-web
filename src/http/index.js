import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

class HttpService {
  async get(path, params) {
    try {
      const response = await axios.get(`${baseURL + path}`, params);
      return response;
    } catch (error) {
      return error;
    }
  }

  async post(path, body, header) {
    try {
      const response = await axios.post(`${baseURL + path}`, body, header);
      return response;
    } catch (error) {
      return error;
    }
  }

  async delete(path, header) {
    try {
      const response = await axios.delete(`${baseURL + path}`, header);
      return response;
    } catch (error) {
      return error;
    }
  }

  async put(path, params, header) {
    try {
      const response = await axios.put(`${baseURL + path}`, params, header);
      return response;
    } catch (error) {
      return error;
    }
  }
}

export const http = new HttpService();

// Legacy exports for backward compatibility (optional, can be removed later)
export const httpGet = (path, params) => http.get(path, params);
export const httpPost = (path, body, header) => http.post(path, body, header);
export const httpDelete = (path, header) => http.delete(path, header);
export const httpPut = (path, params, header) => http.put(path, params, header);


