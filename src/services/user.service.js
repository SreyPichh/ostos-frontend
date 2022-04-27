import api from "./api";
const API_URL = "users";
class UserService {
  getUserBoard() {
    return api.get("/user/profile");
  }
  getUsers() {
    return api.get("clients");
  }
  getUserById(userId) {
    return api.get(API_URL + `/${userId}`);
  }
  createUser(body) {
    return api.post("register", body).then((response) => {
      return response.data;
    });
  }
  updateUser(userId, body) {
    return api.patch(API_URL + `/${userId}`, body);
  }
  deleteUser(userId) {
    return api.delete(API_URL + `/${userId}`);
  }
  getAdminBoard() {
    return api.get("admin");
  }
}
export default new UserService();
