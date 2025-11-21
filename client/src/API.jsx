import axios from "axios";
import { get } from 'js-cookie';

const baseUrl = "http://localhost:5000/api/v1";
// const baseUrl = "http://localhost:5000/api/v1";

const apiRequest = async (method, endpoint, data = null, configOverride = {}) => {
  // Get user data every time to ensure the latest token is used
  let userState = null;
  try {
    const userStateString = localStorage.getItem("userState");
    userState = userStateString ? JSON.parse(userStateString) : null;
  } catch (e) {
    localStorage.removeItem("userState");
    userState = null;
  }

  const userToken = userState?.patient?.token || null;

  let headers = {
    Authorization: userToken ? `Basic ${userToken}` : "",
    ...configOverride.headers,
  };

  
  if (
    data &&
    typeof window !== "undefined" &&
    window.FormData &&
    data instanceof window.FormData
  ) {
   
    delete headers["Content-Type"];
  } else if(data !== null) {
    headers["Content-Type"] = "application/json";
  }

  const config = {
    method: method,
    url: `${baseUrl}/${endpoint}`,
    headers,
    data,
    ...configOverride,
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    // Only remove token on specific auth errors
    if (error.response?.status === 403 || error.response?.status === 401) {
      localStorage.removeItem("userState");
    }
    throw error;
  }
};

export default apiRequest;