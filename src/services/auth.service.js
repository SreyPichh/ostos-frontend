import axios from "axios";
const API_URL = "https://ostos-backend.herokuapp.com/api/v1/";
class AuthService {
  login(user) {
    return axios
      .post(API_URL + "oauth/token", {
        username: user.username,
        password: user.password,
        client_id: "1",
        client_secret: "sCjOkRZujF0KC1LIJbD9JKWVHIh2IdtInaSWbHu8",
        grant_type: "password",
      })
      .then((response) => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }
        return response.data;
      });
  }
  logout() {
    localStorage.removeItem("user");
  }
  register(user) {
    return axios.post(API_URL + "signup", {
      username: user.username,
      email: user.email,
      password: user.password,
    });
  }
}
export default new AuthService();
