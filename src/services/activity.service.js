import api from "./api";
const API_URL = "recentactions";
class ActivityService {
  getActivities() {
    return api.get(API_URL);
  }
}
export default new ActivityService();
