import api from "./api";
const API_URL = "quotes";
class QuoteService {
  getQuotes() {
    return api.get(API_URL);
  }
  getQuotesBySearch(searchParams) {
    console.log(searchParams);
    return api.get(API_URL + searchParams);
  }
  getQuoteById(QuoteId) {
    return api.get(API_URL + `/${QuoteId}`);
  }
  postQuote(body) {
    return api.post(API_URL, body).then((response) => {
      return response.data;
    });
  }
  updateQuote(QuoteId, body) {
    return api.patch(API_URL + `/${QuoteId}`, body);
  }
  deleteQuote(QuoteId) {
    return api.delete(API_URL + `/${QuoteId}`);
  }
}
export default new QuoteService();
