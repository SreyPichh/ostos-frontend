import api from "./api";
const API_URL = "invoices";
class InvoiceService {
  getInvoices() {
    return api.get(API_URL);
  }
  getInvoiceById(InvoiceId) {
    return api.get(API_URL + `/${InvoiceId}`);
  }
  postInvoice(body) {
    return api.post(API_URL, body).then((response) => {
      return response.data;
    });
  }
  updateInvoice(InvoiceId, body) {
    return api.patch(API_URL + `/${InvoiceId}`, body);
  }
  deleteInvoice(InvoiceId) {
    return api.delete(API_URL + `/${InvoiceId}`);
  }
}
export default new InvoiceService();
