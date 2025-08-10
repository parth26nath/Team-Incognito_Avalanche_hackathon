import axios from "axios";
import { getToken } from "@/lib/provider";

const getAxiosInstance = () => {
  const defaultOptions = {
    baseURL: process.env.NEXT_PUBLIC_API_URL,
  };
  let instance = axios.create(defaultOptions);

  instance.interceptors.request.use(
    async (config) => {
      const token = getToken();
      console.log("axios token::", token);
      config.headers.Authorization = token ? `${token}` : "";
      return config;
    },
    (err) => {
      Promise.reject(err);
    }
  );
  return instance;
};

export default getAxiosInstance();
