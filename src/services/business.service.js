import axios from "axios";
import authHeader from "./auth-header";
const API_URL = "http://167.172.88.106/api/v1/businesses";
class BusinessService {
  getBusinesses(params) {
    return axios.get(API_URL, {
      headers: authHeader(),
      params: params,
    });
  }
  getBusinessById(Pid) {
    return axios.get(API_URL + `/${Pid}`, { headers: authHeader() });
  }
  postBusiness(body) {
    return axios
      .post(API_URL, body, { headers: authHeader() })
      .then((response) => {
        return response.data;
      });
  }
  updateBusiness(Bid, body) {
    return axios.patch(API_URL + `/${Bid}`, body, { headers: authHeader() });
  }
  deleteBusiness(Bid) {
    return axios.delete(API_URL + `/${Bid}`, { headers: authHeader() });
  }
}
export default new BusinessService();

// {
//   name: body.name,
//   logo: body.logo,
//   address: body.address,
//   phone_number1: body.phone_number1,
//   phone_number2: body.phone_number2,
//   email: body.email,
//   telegram: body.telegram,
//   aba_name: body.aba_name,
//   acc_number: body.acc_number,
//   qr_code: body.qr_code,
//   invoice_toptext: body.invoice_toptext,
//   invoice_note: body.invoice_note,
//   digital_sign: body.digital_sign,
//   facebook_link: body.facebook_link,
//   instagram_link: body.instagram_link,
// },
