import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosError,
} from 'axios';
import { toast } from 'react-toastify';
import { getToken } from './token';

const BACKEND_URL = 'https://11.react.pages.academy/six-cities-simple';
const REQ_TIMEOUT = 5000;

export const createAPI = (): AxiosInstance => {
  const api = axios.create({
    baseURL: BACKEND_URL,
    timeout: REQ_TIMEOUT,
  });

  api.interceptors.request.use(
    (config: AxiosRequestConfig) => {
      const token = getToken();

      if (token && config.headers) {
        config.headers['x-token'] = token;
      }

      return config;
    }
  );

  // api.interceptors.response.use(
  //   (response) => response,
  //   (error: AxiosError<{error: string}>) => {
  //     if (error.response && shouldDisplayError(error.response)) {
  //       toast.warn(error.response.data.error);
  //     }

  //     throw error;
  //   }
  // );

  return api;
};
