import api from "./api";
const API_URL = "payments";
class PaymentService {
  getPayments() {
    return api.get(API_URL);
  }
  getPaymentsBySearch(searchParams) {
    return api.get(API_URL + searchParams);
  }
  getPaymentById(PaymentId) {
    return api.get(API_URL + `/${PaymentId}`);
  }
  postPayment(body) {
    return api.post(API_URL, body).then((response) => {
      return response.data;
    });
  }
  updatePayment(PaymentId, body) {
    return api.patch(API_URL + `/${PaymentId}`, body);
  }
  deletePayment(PaymentId) {
    return api.delete(API_URL + `/${PaymentId}`);
  }
}
export default new PaymentService();
