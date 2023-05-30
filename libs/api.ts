import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://www.bluetags.app",
});

export const homeBluecards = () => axiosInstance.get("/api/bluecards");

export const allProjects = () => axiosInstance.get("/api/projects");

export const getProject = (key: string) =>
  axiosInstance.get(`/api/projects/${key}`);

export const projectBluecards = (key: string, lastId: string) =>
  axiosInstance.get(`/api/bluecards/project/${key}?previous=${lastId}`);

export const allNewscards = (lastId: string) =>
  axiosInstance.get(`/api/newscards?previous=${lastId}`);

export const watchListBluecards = (lastId: string) =>
  axiosInstance.get(`/api/bluecards?watchlist=true&previous=${lastId}`);

export const userInfo = (userId: string, lastId: string) =>
  axiosInstance.get(
    `/api/bluecards?user=${userId}&read=true&previous=${lastId}`
  );

export const searchProjects = (query: string) =>
  axiosInstance.get(`/api/search/projects?q=${query}`);

export const searchBluecards = (query: string, lastID: string) =>
  axiosInstance.get(`/api/search/bluecards?q=${query}&previous=${lastID}`);

export const notifications = () => axiosInstance.get("/api/notifications");
