import api from "./api";
const API_URL = "recentactions";
class ActivityService {
  getActivities(params) {
    return api.get(API_URL, {
      params: params,
    });
  }
}
export default new ActivityService();
