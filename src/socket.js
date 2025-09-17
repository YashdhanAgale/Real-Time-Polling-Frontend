import { io } from "socket.io-client";

const socket = io("https://real-time-polling-backend-pvy8.onrender.com", {
  withCredentials: true,
});

export default socket;
