import api from "./api";
const API_URL = "employees";
class EmployeeService {
  createEmployee(body) {
    return api.post(API_URL, body).then((response) => {
      return response.data;
    });
  }
  getEmployees() {
    return api.get(API_URL);
  }
  getEmployeeById(employeeId) {
    return api.get(API_URL + `/${employeeId}`);
  }
  updateEmployee(employeeId, body) {
    return api.patch(API_URL + `/${employeeId}`, body);
  }
  deleteEmployee(employeeId) {
    return api.delete(API_URL + `/${employeeId}`);
  }
}
export default new EmployeeService();
