import nhanVienModel from "../Models/nhanVienModel";
import nghiPhepModel from "../Models/nghiPhepModel";

export default new (class {
  // async getNgayPhepConLai(req, res, next) {
  //   try {
  //     let phepConLai = await nhanVienModel.findOne({ username: req.decoded.username });
  //     console.log(phepConLai);
  //     return res.json({ soNgayPhepConLai: phepConLai.annualLeave });
  //   } catch (err) {
  //     return res.json(err);
  //   }
  // }
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
      /***
       *username: ,
        ngayStart: String,
        ngayEnd: String,
        soNgay: Number,
        lyDo: String,
      
        // annualLeave = phepNam - songayphepdagngki
      
       */

      //dang ki phep
      const dangKiNghiPhep = { username: username, ngayStart, ngayEnd, soNgay, lyDo }
      const newPhep = await new nghiPhepModel(dangKiNghiPhep).save;

      //tru vao phep nam
      let nhanVien = await nhanVienModel.findOne({ username: username });
      let annualLeave = nhanVien.phepNam - req.body.soNgay;
      const updateNhanVien = await nhanVienModel.findOneAndUpdate({ username: username }, { annualLeave: annualLeave }, { returnDocument: "after" });


      console.log("updateNhanVien", updateNhanVien);
      console.log("newPhep", newPhep);

      return res.json(newPhep);

    } catch (error) {
      return res.status(400).json(error);
    }
  }

})();
