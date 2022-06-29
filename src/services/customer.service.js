import api from "./api";
const API_URL = "customers";
class CustomerService {
  createCustomer(body) {
    return api.post(API_URL, body).then((response) => {
      return response.data;
    });
  }
  getCustomers(params) {
    return api.get(API_URL, {
      params: params,
    });
  }
  getCustomerById(customerId) {
    return api.get(API_URL + `/${customerId}`);
  }
  updateCustomer(customerId, body) {
    return api.patch(API_URL + `/${customerId}`, body);
  }
  deleteCustomer(customerId) {
    return api.delete(API_URL + `/${customerId}`);
  }
}
export default new CustomerService();
