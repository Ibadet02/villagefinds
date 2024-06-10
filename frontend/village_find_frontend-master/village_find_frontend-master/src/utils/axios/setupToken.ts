import { http } from '@/services';

export const setupToken = (token: string | null, role: string) => {
  const tokenKey = `${role}_token`;
  if (!token) {
    if (localStorage.getItem(tokenKey)) localStorage.removeItem(tokenKey);
    delete http.defaults.headers.Authorization;
  } else {
    localStorage.setItem(tokenKey, token);
    http.defaults.headers['Authorization'] = `Bearer ${token}`;
  }
};
