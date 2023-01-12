import phienLamViecModel from "../Models/phienLamViecModel";
import nhanVienModel from "../Models/nhanVienModel";
import quanLyModel from "../Models/quanLyModel";

class QuanLyController {
  //GET
  async getNhanVienMinhQuanLy(req, res) {
    try {
        let nhanVien = await nhanVienModel.findOne({username: req.decoded.username});
        let info = await quanLyModel.findOne({id : nhanVien.idNguoiQuanLy})
        res.json(info);
      } catch (error) {
        res.status(400).json({ error: error});
      }
  }
  async thayDoiThongTin(req, res) {
    let allNhanVien = await phienLamViecModel.updateMany({ name: "admin" }, { $set: { idNhanVien: "nv1" } });
    console.log(allNhanVien);
    return res.json(allNhanVien);
  }
}
export default new QuanLyController();