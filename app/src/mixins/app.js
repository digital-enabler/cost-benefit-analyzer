import {ref} from 'vue';
import axios from "axios";


export const apiUrl = import.meta.env.VITE_API_URL;

export function useApp() {

  // get devices from api
  // get historical data from api for device
  async function optimization(formData) {
    try {
      const response = await axios.post(apiUrl + "/optimization", formData);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  return {optimization};
}
