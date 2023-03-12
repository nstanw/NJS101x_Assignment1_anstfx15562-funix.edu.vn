import { InputGetAllDto } from "../Dtos/InputGetAllDto";
import http from "./httpService";

class PhienLamViecService {
  public async getAll(input: InputGetAllDto) {
    let result = await http.get("/phienLamViec/getAll", { params: input });
    return result.data;
  }
  public async phienHienTai() {
    let result = await http.get("/phienLamViec/phienHienTai");
    return result.data;
  }

  public async getPhienDangLam() {
    let result = await http.get("/phienLamViec/getPhienDangLam");
    return result.data;
  }

  public async getInfoQuanLy() {
    let result = await http.get("/phienLamViec/getInfoQuanLy");
    return result.data;
  }

  public async diemDanh(noiLam: string) {
    let result = await http.post("/phienLamViec/diemDanh", { noiLam: noiLam });
    return result.data;
  }

  public async traCuuThongTinGioLamCongTy() {
    let result = await http.get("/phienLamViec/traCuuThongTinGioLamCongTy");
    return result.data;
  }

  public async traCuuThongTinGioLamNhanVienTheoNgay() {
    let result = await http.get("/phienLamViec/traCuuThongTinGioLamNhanVienTheoNgay");
    return result.data;
  }

  public async traCuuThongTinGioLamNhanVien(idNhanVien: string) {
    let result = await http.get("/phienLamViec/traCuuThongTinGioLamNhanVien", { params: { idNhanVien: idNhanVien } });
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
