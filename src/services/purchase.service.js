import api from "./api";
const API_URL = "purchases";
class PurchaseService {
  getPurchases(params) {
    return api.get(API_URL, {
      params: params,
    });
  }
  getPurchaseById(Pid, params) {
    return api.get(API_URL + `/${Pid}`, {
      params: params,
    });
  }
  postPurchase(body) {
    return api.post(API_URL, body).then((response) => {
      return response.data;
    });
  }
  updatePurchase(Bid, body) {
    return api.patch(API_URL + `/${Bid}`, body);
  }
  deletePurchase(Bid) {
    return api.delete(API_URL + `/${Bid}`);
  }
  getLastPurchaseId() {
    return api.get("getLastIdPurchase");
  }
}
export default new PurchaseService();
