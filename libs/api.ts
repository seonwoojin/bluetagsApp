import axios from "axios";
import { useUser } from "./context";

const axiosInstance = axios.create({
  baseURL: "https://www.bluetags.app",
  //baseURL: "http://192.168.0.7:3000",
  headers: {
    Authorization: `Bearer`,
  },
});

export const homeBluecards = () =>
  axios.get("https://www.bluetags.app/api/bluecards/home");

export const homeInfo = () => axiosInstance.get("/api/info");

export const allProjects = () => axiosInstance.get("/api/projects");

export const getProject = (key: string) =>
  axiosInstance.get(`/api/projects/${key}`);

export const projectBluecards = (key: string, lastId: string) =>
  axiosInstance.get(`/api/bluecards/project/${key}?previous=${lastId}`);

export const allNewscards = (lastId: string) =>
  axiosInstance.get(`/api/newscards?previous=${lastId}`);

export const mostReadNews = () => axiosInstance.get("/api/newscards/trends");

export const watchListBluecards = (lastId: string) =>
  axiosInstance.get(`/api/bluecards?watchlist=true&previous=${lastId}`);

export const watchListBluecardsSubscribe = (lastId: string, userId: string) =>
  axiosInstance.get(
    `/api/bluecards?watchlist=true&user=${userId}&previous=${lastId}`
  );

export const userInfo = (userId: string, lastId: string) =>
  axiosInstance.get(
    `/api/bluecards?user=${userId}&read=true&previous=${lastId}`
  );

export const userBluecards = (userId: string) =>
  axiosInstance.get(`/api/users/bluecards?userId=${userId}`);

export const userUpcoming = (userId: string) =>
  axiosInstance.get(`/api/bluecards/upcoming/${userId}`);

export const userComments = (userId: string) =>
  axiosInstance.get(`/api/comments/${userId}`);

export const searchProjects = (query: string) =>
  axiosInstance.get(`/api/search/projects?q=${query}`);

export const searchInfo = (query: string) =>
  axiosInstance.get(`/api/search/info?q=${query}`);

export const searchBluecards = (query: string, lastID: string) =>
  axiosInstance.get(`/api/search/bluecards?q=${query}&previous=${lastID}`);

export const notifications = () => axiosInstance.get("/api/notifications");

export const bluecardDetail = (id: string) =>
  axiosInstance.get(`/api/bluecards/${id}`);

export const bluecardComments = (id: string) =>
  axiosInstance.get(`/api/bluecards/comments?id=${id}`);

export const greeting = () => axiosInstance.get("/api/info/bluecard");

export const upcomingBluecards = () =>
  axiosInstance.get("/api/bluecards/upcoming");

export const allUserHistory = (userId: string, lastId: string) =>
  axiosInstance.get(`/api/users/history?userId=${userId}&previous=${lastId}`);

export const allUserSaved = (userId: string, lastId: string) =>
  axiosInstance.get(`/api/users/saved?userId=${userId}&previous=${lastId}`);

export const allUserComment = (userId: string, lastId: string) =>
  axiosInstance.get(`/api/users/comment?userId=${userId}&previous=${lastId}`);
