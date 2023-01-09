import http from "./httpService";

class QuanLyService {
  public async getNhanVienMinhQuanLy() {
    let result = await http.get("/quanLy/getNhanVienMinhQuanLy");
    return result.data;
  }

  
}
export default new QuanLyService();
