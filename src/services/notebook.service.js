import api from "./api";
const API_URL = "notedbooks";
class NoteBookService {
  getNoteBooks(params) {
    return api.get(API_URL, {
      params: params,
    });
  }
  getNoteBookById(Pid, params) {
    return api.get(API_URL + `/${Pid}`, {
      params: params,
    });
  }
  createNoteBook(body) {
    return api.post(API_URL, body).then((response) => {
      return response.data;
    });
  }
  updateNoteBook(Bid, body) {
    return api.patch(API_URL + `/${Bid}`, body);
  }
  deleteNoteBook(Bid) {
    return api.delete(API_URL + `/${Bid}`);
  }
}
export default new NoteBookService();
