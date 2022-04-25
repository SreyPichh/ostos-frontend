import axios from "axios";
import authHeader from "./auth-header";
const API_URL = "http://167.172.88.106/api/v1/user/profile";
class UserProfileService {
  getUserProfile() {
    return axios.get(API_URL, { headers: authHeader() });
  }
  getAdminBoard() {
    return axios.get(API_URL + "admin", { headers: authHeader() });
  }
}
export default new UserProfileService();
