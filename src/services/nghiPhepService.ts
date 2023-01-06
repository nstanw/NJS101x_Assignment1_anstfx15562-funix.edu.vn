import Input from "antd/es/input/Input";
import http from "./httpService";

export interface IDangKiNghiPhepInput {
  ngayDangKiPhep: Array<Date>;
  soNgayDangKiNghi: number;
  lyDo: String;
}

class NghiPhepService {
  public async dangKiNghiPhep(input: IDangKiNghiPhepInput) {
    let result = await http.patch("/nghiPhep/dangKiNghiPhep", input);
    return result.data;
  }
 
  public async getNgayPhepConLai() {
    let result = await http.get("/nghiPhep/getNgayPhepConLai");
    return result.data;
  }
  public async getThongTinNghiPhepNV() {
    let result = await http.get("/nghiPhep/getThongTinNghiPhepNV");
    return result.data;
  }
}
export default new NghiPhepService();
