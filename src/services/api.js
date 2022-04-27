import axios from "axios";
const instance = axios.create({
  baseURL: "http://167.172.88.106/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});
export default instance;
