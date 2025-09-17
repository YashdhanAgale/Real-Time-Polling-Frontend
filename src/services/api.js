import axios from "axios";

const api = axios.create({
  baseURL: "https://real-time-polling-backend-pvy8.onrender.com",
  withCredentials: true,
});

export default api;
