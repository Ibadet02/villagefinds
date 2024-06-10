import { SERVER_URL } from '@/config/global';

export const API = {
  API_URL: SERVER_URL,
  tag: {
    get get() {
      return `${API.API_URL}/tag`;
    },
    getItem: (id: string) => {
      return `${API.API_URL}/tag/${id}`;
    },
  },
};
