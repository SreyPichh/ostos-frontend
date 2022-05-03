import api from "./api";
import TokenService from "./token.service";
class AuthService {
  login(user) {
    return api
      .post("oauth/token", {
        username: user.email,
        password: user.password,
        client_id: "1",
        client_secret: "v1Sn9rTzv6YY8grJiL7f7T6coHsl93Mscvvq6FQM",
        grant_type: "password",
      })
      .then((response) => {
        if (response.data.access_token) {
          TokenService.setUser(response.data);
        }
        return response.data;
      });
  }
  logout() {
    TokenService.removeUser();
  }
  register(user) {
    return api.post("signup", {
      username: user.username,
      email: user.email,
      password: user.password,
    });
  }
}
export default new AuthService();
