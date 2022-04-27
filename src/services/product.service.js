import api from "./api";
const API_URL = "products";

class ProductService {
  getProducts(params) {
    return api.get(API_URL, {
      params: params,
    });
  }
  getProductById(Pid) {
    return api.get(API_URL + `/${Pid}`);
  }
  postProduct(body) {
    return api.post(API_URL, body).then((response) => {
      return response.data;
    });
  }
  updateProduct(Pid, body) {
    return api.patch(API_URL + `/${Pid}`, body);
  }
  deleteProduct(productId) {
    return api.delete(API_URL + `/${productId}`);
  }
}
export default new ProductService();
