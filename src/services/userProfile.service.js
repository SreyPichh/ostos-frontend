import api from "./api";
const API_URL = "user/profile";
class UserProfileService {
  getUserProfile() {
    return api.get(API_URL);
  }
  // getAdminBoard() {
  //   return api.get(API_URL + "admin");
  // }
}
export default new UserProfileService();
