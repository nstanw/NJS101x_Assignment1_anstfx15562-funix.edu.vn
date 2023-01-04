import http from "./httpService";

class NhanVienService {
  public async getNhanVien() {
    let result = await http.get("/getNhanVien");
    return result.data;
  }

  public async editLinkImage(linkImage: string) {
    let result = await http.patch("/editLinkImage", { image: linkImage });
    return result.data;
  }
}
export default new NhanVienService();
