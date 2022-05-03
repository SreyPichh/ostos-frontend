import api from "./api";
const API_URL = "businesses";
class BusinessService {
  getBusinesses(params) {
    return api.get(API_URL, {
      params: params,
    });
  }
  getBusinessById(Pid, params) {
    return api.get(API_URL + `/${Pid}`, {
      params: params,
    });
  }
  postBusiness(body) {
    return api.post(API_URL, body).then((response) => {
      return response.data;
    });
  }
  updateBusiness(Bid, body) {
    return api.patch(API_URL + `/${Bid}`, body);
  }
  deleteBusiness(Bid) {
    return api.delete(API_URL + `/${Bid}`);
  }
}
export default new BusinessService();
