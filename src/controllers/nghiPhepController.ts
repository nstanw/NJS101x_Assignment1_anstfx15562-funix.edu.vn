import nhanVienModel from "../Models/nhanVienModel";
import nghiPhepModel from "../Models/nghiPhepModel";

export default new (class {
  async getNgayPhepConLai(req, res, next) {
    try {
      let phepConLai = await nhanVienModel.findOne({ username: req.decoded.username });
      console.log(phepConLai);
      return res.json({ soNgayPhepConLai: Math.round((phepConLai.annualLeave)*100)/100 });
    } catch (err) {
      return res.json(err);
    }
  }
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
  /**
   * thêm các lần đăng kí kèm giờ phép
   * mỗi lần tạo 1 cái mới để phục vụ tính sau này
   *
   * @param req: ngày đăng kí, giờ
   * @param res:  số ngày, giờ đăng kí phép
   * @param next
   * @returns
   */
  async dangKiNghiPhep(req, res, next) {
    try {
      // kiểm tra số phép còn lại. nếu = 0 thì không cho đăng kí nữa
      let phepConLai = await nhanVienModel.findOne({ username: req.decoded.username });
      if (phepConLai.annualLeave <= 0) {
        return res.json({ error: "Hết số phép của năm" });
      }

      // nếu đăng kí lớn hơn số phép còn lại báo lỗi
      if (req.body.gio / 8 > phepConLai.annualLeave) {
        return res.json({ error: "Số phép còn lại không đủ" });
      }

      // trường hợp nhân viên đăng kí nhiều ngày
      let capNhatNgayPhepConLai;
      let listNgay = req.body.ngay.split(',')
      if (listNgay.length > 1) {
        listNgay.forEach(element => {
          // hợp lệ thì tiến hành đăng kí
          const dangKiPhep = new nghiPhepModel({
            username: req.decoded.username,
            ngay: element,
            gio: 8,
            lyDo: req.body.lyDo,
          });

          // thêm đăng kí
         ( async () => await dangKiPhep.save())(); 

          // cập nhật ngày phép còn lại
          // trừ vào số phép còn lại và tạo document phép mới theo từng ngày để phục vụ tính giờ sau này
          const annualLeave = phepConLai.annualLeave - 1;
         (async () => await nhanVienModel.findOneAndUpdate({ username: req.decoded.username }, { annualLeave: annualLeave }, { upsert: true }))();

          console.log("capNhatNgayPhepConLai",capNhatNgayPhepConLai);
          
        });
      }
      // th đăng kí 1 ngày
      else {
        // hợp lệ thì tiến hành đăng kí
        const dangKiPhep = new nghiPhepModel({
          username: req.decoded.username,
          ngay: req.body.ngay,
          gio: req.body.gio,
          lyDo: req.body.lyDo,
        });

        // thêm đăng kí
        await dangKiPhep.save();

        // cập nhật ngày phép còn lại
        // trừ vào số phép còn lại và tạo document phép mới theo từng ngày để phục vụ tính giờ sau này
        const annualLeave = phepConLai.annualLeave - req.body.gio / 8;
        capNhatNgayPhepConLai = await nhanVienModel.findOneAndUpdate({ username: req.decoded.username }, { annualLeave: annualLeave }, { upsert: true });

        console.log(capNhatNgayPhepConLai);
        return res.status(200).json(capNhatNgayPhepConLai);
      }
      console.log(capNhatNgayPhepConLai);
      return res.status(200).json(capNhatNgayPhepConLai);
    } catch (error) {
      return res.status(400).json(error);
    }
  }
})();
