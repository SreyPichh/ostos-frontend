import axios from "axios";
import authHeader from "./auth-header";
const API_URL = "http://167.172.88.106/api/v1/";
class UserService {
  getUsers() {
    return axios.get(API_URL + "clients", { headers: authHeader() });
  }
  getUserById(userId) {
    return axios.get(API_URL + "users" + `/${userId}`, {
      headers: authHeader(),
    });
  }
  createUser(body) {
    return axios
      .post(API_URL + "register", body, { headers: authHeader() })
      .then((response) => {
        return response.data;
      });
  }
  updateUser(userId, body) {
    return axios.patch(API_URL + `users/${userId}`, body, {
      headers: authHeader(),
    });
  }
  deleteUser(userId) {
    return axios.delete(API_URL + `users/${userId}`, {
      headers: authHeader(),
    });
  }
  getAdminBoard() {
    return axios.get(API_URL + "admin", { headers: authHeader() });
  }
}
export default new UserService();
