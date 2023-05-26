import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://www.bluetags.app",
});

export const homeBluecards = () => axiosInstance.get("/api/bluecards");

export const allProjects = () => axiosInstance.get("/api/projects");
