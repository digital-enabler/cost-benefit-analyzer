import axios from "axios";

export const apiUrl = import.meta.env.VITE_MIDDLEWARE_URL;

export function useAuth() {
  async function checkStatus() {
    try {
     const response = await axios.get(apiUrl + '/invest4nature/me', {withCredentials: true});
      return response.data; // User is authenticated
    } catch (error) {
      return !(error.response && error.response.status === 401);
    }
  }



  async function logout() {
    try {
      window.location.href = apiUrl + "/invest4nature/auth/logout";
    } catch (error) {
     console.log(error);
    }
  }

  async function login() {
    try {
      window.location.href = apiUrl + "/invest4nature/auth/login";
    } catch (error) {
      console.log(error);
    }
  }


  return { apiUrl, checkStatus, logout, login };
}
