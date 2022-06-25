import api from "./api";
const API_URL = "users";
class UserService {
  getUserProfile() {
    return api.get("/user/profile");
  }
  updateProfile(userId, body) {
    return api.patch(API_URL + `/${userId}`, body);
  }
  getUsers() {
    return api.get(API_URL);
  }
}
export default new UserService();
