import axios from 'axios';
import { enqueueSnackbar } from 'notistack';

import { store } from '@/redux/store';
import { setLoadingSpinner } from '@/redux/reducers/loader';
import { SERVER_URL } from '@/config/global';

export const http = axios.create({
  baseURL: SERVER_URL,
});

http.interceptors.request.use(request => {
  store.dispatch(setLoadingSpinner(true));
  return request;
});

http.interceptors.response.use(
  response => {
    store.dispatch(setLoadingSpinner(false));
    return response;
  },
  error => {
    const { response } = error;
    store.dispatch(setLoadingSpinner(false)); // Hide loading spinner on response error
    if (response) {
      if (response.status === 401) {
        // Handle unauthorized error
        enqueueSnackbar('You are not authorized.', { variant: 'warning' });
      } else if (response.status === 500) {
        // Handle server error
        enqueueSnackbar('Something went wrong with the server.', {
          variant: 'error',
        });
      }
    } else if (error.message === 'Network Error') {
      enqueueSnackbar('Network Error: Please check your connection.', {
        variant: 'error',
      });
    } else {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
    return Promise.reject(error);
  },
);

export class HttpService {
  static async get(url: string, params: any = {}) {
    return await http.get(url, { params }).then(res => res.data);
  }

  static async post(url: string, data: any, params: any = {}) {
    return await http.post(url, data, { params }).then(res => res.data);
  }

  static async put(url: string, data: any, params: any = {}) {
    return await http.put(url, data, { params }).then(res => res.data);
  }

  static async delete(url: string, params: any = {}) {
    return await http.delete(url, { params }).then(res => res.data);
  }
}
