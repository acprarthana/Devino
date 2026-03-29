import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        const r = await api.post('/auth/refresh', { refreshToken });
        localStorage.setItem('accessToken', r.data.accessToken);
        localStorage.setItem('refreshToken', r.data.refreshToken);
        originalRequest.headers.Authorization = `Bearer ${r.data.accessToken}`;
        return api(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);

export async function register(data) {
  return api.post('/auth/register', data);
}

export async function login(data) {
  const res = await api.post('/auth/login', data);
  if (res.data?.accessToken && res.data?.refreshToken) {
    localStorage.setItem('accessToken', res.data.accessToken);
    localStorage.setItem('refreshToken', res.data.refreshToken);
    localStorage.setItem('user', JSON.stringify(res.data.user));
  }
  return res;
}

export async function logout() {
  const refreshToken = localStorage.getItem('refreshToken');
  await api.post('/auth/logout', { refreshToken });
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
}

export async function getMe() {
  return api.get('/auth/me');
}

export async function listProjects() {
  return api.get('/projects');
}

export async function createProject(payload) {
  return api.post('/projects', payload);
}

export async function getProject(id) {
  return api.get(`/projects/${id}`);
}

export async function getStages() {
  return api.get('/stages');
}

export async function submitStageCode(projectId, stage, data) {
  return api.post(`/projects/${projectId}/stages/${stage}/submit`, data);
}

export async function getStageSubmissions(projectId, stage) {
  return api.get(`/projects/${projectId}/stages/${stage}/submissions`);
}

export async function retryStage(projectId, stage) {
  return api.post(`/projects/${projectId}/stages/${stage}/retry`);
}

export default api;
