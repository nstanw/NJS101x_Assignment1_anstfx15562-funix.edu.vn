import nhanVienModel from "../Models/nhanVienModel";
import nghiPhepModel from "../Models/nghiPhepModel";
import { log } from "handlebars";

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
      const { ngayStart, soNgay, lyDo } = req.body;
      const dangKiNghiPhep = { username: username, ngayDangKy: ngayStart, soNgay, lyDo };

      if (req.body.ngayEnd !== null) {
        //tach ra từng ngày cho dễ tái sử dụng
        const startDate = new Date(req.body.ngayStart);
        const endDate = new Date(req.body.ngayEnd);

        let dateList = [];

        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
          dateList.push(new Date(d));
        }

        // In danh sách các ngày trong khoảng thời gian
        for (let i = 0; i < dateList.length; i++) {
          var nghiPhep = {
            username: username,
            ngayDangKy: dateList[i],
            soNgay: 1,
            lyDo: dangKiNghiPhep.lyDo,
          };
          await new nghiPhepModel(nghiPhep).save();
        }
      } else {
        await new nghiPhepModel(dangKiNghiPhep).save();
      }

      //tru vao phep nam
      let nhanVien = await nhanVienModel.findOne({ username: username });
      let annualLeave = nhanVien.annualLeave - req.body.soNgay;
      const updateNhanVien = await nhanVienModel.findOneAndUpdate({ username: username }, { annualLeave: annualLeave }, { returnDocument: "after" });

      return res.json(updateNhanVien);
    } catch (error) {
      return res.status(400).json(error);
    }
  }
})();
