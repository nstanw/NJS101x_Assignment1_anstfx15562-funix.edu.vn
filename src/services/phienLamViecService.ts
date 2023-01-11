import http from "./httpService";

class PhienLamViecService {
  public async getActive(username: string) {
    let result = await http.get("/phienLamViec/getActive", { params: { username: username } });
    return result.data;
  }

  public async getPhienDangLam() {
    let result = await http.get("/phienLamViec/getPhienDangLam");
    return result.data;
  }

  public async traCuuThongTinGioLamCongTy() {
    let result = await http.get("/phienLamViec/traCuuThongTinGioLamCongTy");
    return result.data;
  }

  public async addPhienLamViec(username: string, noiLam: string) {
    let result = await http.post("/phienLamViec/addPhienLamViec", { noiLam: noiLam, username: username });
    return result.data;
  }

  public async ketThucPhienLamViec() {
    let result = await http.patch("/phienLamViec/ketThucPhienLamViec");
    return result.data;
  }

  public async getLuongTheoThang(thang: number) {
    let result = await http.get("/phienLamViec/getLuongTheoThang", { params: { thang: thang } });
    return result.data;
  }
}
export default new PhienLamViecService();
