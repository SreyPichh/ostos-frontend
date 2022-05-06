import api from "./api";
const API_URL = "users";
class UserService {
  getUserBoard() {
    return api.get("/user/profile");
  }
  createUser(body) {
    return api.post("register", body).then((response) => {
      return response.data;
    });
  }
  getUsers() {
    return api.get("employees");
  }
  getUserById(userId) {
    return api.get(API_URL + `/${userId}`);
  }
  updateUser(userId, body) {
    return api.patch(API_URL + `/${userId}`, body);
  }
  deleteUser(userId) {
    return api.delete(API_URL + `/${userId}`);
  }
  getAdminBoard() {
    return api.get(API_URL + "?include=roles");
  }
}
export default new UserService();
