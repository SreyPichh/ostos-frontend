import axios from "axios";
import authHeader from "./auth-header";
const API_URL = "http://167.172.88.106/api/v1/products";
class ProductService {
  getProducts(params) {
    return axios.get(API_URL, {
      headers: authHeader(),
      params: params,
    });
  }
  getProductById(Pid) {
    return axios.get(API_URL + `/${Pid}`, { headers: authHeader() });
  }
  postProduct(body) {
    return axios
      .post(API_URL, body, { headers: authHeader() })
      .then((response) => {
        return response.data;
      });
  }
  updateProduct(Pid, body) {
    return axios.patch(API_URL + `/${Pid}`, body, { headers: authHeader() });
  }
  deleteProduct(productId) {
    return axios.delete(API_URL + `/${productId}`, { headers: authHeader() });
  }
}
export default new ProductService();
