import nhanVienModel from "../Models/nhanVienModel";
import nghiPhepModel from "../Models/nghiPhepModel";

export default new (class {

  async getThongTinNghiPhepNV(req, res, next) {
    try {
      let phepConLai = await nhanVienModel.findOne({ username: req.decoded.username });
      console.log(phepConLai);
      return res.json(phepConLai);
    } catch (err) {
      return res.json(err);
    }
  }

  //POST đăng kí phép
  async dangKiNghiPhep(req, res, next) {
    try {
      const username = req.decoded.username;
      const { ngayStart, ngayEnd, soNgay, lyDo } = req.body;
      const dangKiNghiPhep = { username: username, ngayStart, ngayEnd, soNgay, lyDo }
      await new nghiPhepModel(dangKiNghiPhep).save();

      //tru vao phep nam
      let nhanVien = await nhanVienModel.findOne({ username: username });
      let annualLeave = nhanVien.annualLeave - req.body.soNgay;
      const updateNhanVien = await nhanVienModel.findOneAndUpdate({ username: username }, { annualLeave: annualLeave }, { returnDocument: "after" });

      console.log("updateNhanVien", updateNhanVien);
      console.log("newPhep", updateNhanVien);

      return res.json(updateNhanVien);

    } catch (error) {
      return res.status(400).json(error);
    }
  }

})();
