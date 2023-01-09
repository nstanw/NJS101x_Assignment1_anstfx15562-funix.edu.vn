import phienLamViecModel from "../Models/phienLamViecModel";
import nhanVienModel from "../Models/nhanVienModel";

class QuanLyController {
  //GET
  async getNhanVienMinhQuanLy(req, res) {
    let allNhanVien = await nhanVienModel.find({ nguoiPhuTrach: "ql1" });
    console.log(allNhanVien);
    return res.json(allNhanVien);
  }
  async thayDoiThongTin(req, res) {
    let allNhanVien = await phienLamViecModel.updateMany({ name: "admin" }, { $set: { idNhanVien: "nv1" } });
    console.log(allNhanVien);
    return res.json(allNhanVien);
  }
}
export default new QuanLyController();
