import axios from "axios";
const API_URL = "http://167.172.88.106/api/v1/";
class AuthService {
  login(user) {
    return axios
      .post(API_URL + "oauth/token", {
        username: user.email,
        password: user.password,
        client_id: "1",
        client_secret: "v1Sn9rTzv6YY8grJiL7f7T6coHsl93Mscvvq6FQM",
        grant_type: "password",
      })
      .then((response) => {
        if (response.data.access_token) {
          axios
            .get(API_URL + "user/profile", {
              headers: {
                Authorization: "Bearer " + response.data.access_token,
              },
            })
            .then((user) => {
              response.data.user = user.data.data;
              localStorage.setItem("user", JSON.stringify(response.data));
            });
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
