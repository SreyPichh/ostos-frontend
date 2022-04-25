import axios from "axios";
import authHeader from "./auth-header";
const API_URL = "http://167.172.88.106/api/v1/invoices";
class InvoiceService {
  getInvoices() {
    return axios.get(API_URL, { headers: authHeader() });
  }
  getInvoiceById(InvoiceId) {
    return axios.get(API_URL + `/${InvoiceId}`, { headers: authHeader() });
  }
  postInvoice(body) {
    return axios
      .post(API_URL, body, { headers: authHeader() })
      .then((response) => {
        return response.data;
      });
  }
  updateInvoice(InvoiceId, body) {
    return axios.patch(API_URL + `/${InvoiceId}`, body, {
      headers: authHeader(),
    });
  }
  deleteInvoice(InvoiceId) {
    return axios.delete(API_URL + `/${InvoiceId}`, { headers: authHeader() });
  }
}
export default new InvoiceService();
