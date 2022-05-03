import api from "./api";
const API_URL = "receipts";
class ReceiptService {
  getReceipts() {
    return api.get(API_URL);
  }
  getReceiptById(ReceiptId) {
    return api.get(API_URL + `/${ReceiptId}`);
  }
  postReceipt(body) {
    return api.post(API_URL, body).then((response) => {
      return response.data;
    });
  }
  updateReceipt(ReceiptId, body) {
    return api.patch(API_URL + `/${ReceiptId}`, body);
  }
  deleteReceipt(ReceiptId) {
    return api.delete(API_URL + `/${ReceiptId}`);
  }
}
export default new ReceiptService();
