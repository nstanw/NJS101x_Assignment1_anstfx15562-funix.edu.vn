import Input from "antd/es/input/Input";
import http from "./httpService";

export interface IDangKiNghiPhepInput {
  ngayStart: Date,
  ngayEnd: Date | null,
  soNgay: Number,
  lyDo: String,
}

class NghiPhepService {
  public async dangKiNghiPhep(input: IDangKiNghiPhepInput) {
    let result = await http.post("/nghiPhep/dangKiNghiPhep", input);
    return result.data;
  }

  public async getThongTinNghiPhepNV() {
    let result = await http.get("/nghiPhep/getThongTinNghiPhepNV");
    return result.data;
  }
}
export default new NghiPhepService();