import Input from "antd/es/input/Input";
import http from "./httpService";

export interface IDangKiNghiPhepInput {
  ngayDangKiPhep: Array<Date>;
  soGioNghi: number;
  lyDo: String;
}

class NghiPhepService {
  public async dangKiNghiPhep(input: IDangKiNghiPhepInput) {
    let result = await http.patch("/nghiPhep/dangKiNghiPhep", input);
    return result.data;
  }
}
export default new NghiPhepService();
