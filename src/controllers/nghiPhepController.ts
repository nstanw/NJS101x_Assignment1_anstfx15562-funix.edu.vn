import nghiPhepModel from "../Models/nghiPhepModel";

export default new (class {
  async getNgayPhepConLai(req, res, next) {
    try {
      let phepConLai = await nghiPhepModel.findOne({ gmail: "admin@admin.com" });
      console.log(phepConLai);
      return res.json({ soNgayPhepConLai: phepConLai.soNgayPhepConLai });
    } catch (err) {
      return res.json(err);
    }
  }
  async getThongTinNghiPhepNV(req, res, next) {
    try {
      let phepConLai = await nghiPhepModel.findOne({ gmail: "admin@admin.com" });
      console.log(phepConLai);
      return res.json(phepConLai);
    } catch (err) {
      return res.json(err);
    }
  }
  async dangKiNghiPhep(req, res, next) {
    try {
      let phepConLai = await nghiPhepModel.findOne({ gmail: "admin@admin.com" });
      let dangKiNghiPhep = await nghiPhepModel.findOneAndUpdate(
        { gmail: "admin@admin.com" },
        {
          ngayDangKiPhep: req.body.ngayDangKiPhep as [],
          soNgayPhepConLai: phepConLai.soNgayPhepConLai - req.body.soNgayDangKiNghi,
          soPhepDangKi: req.body.soNgayDangKiNghi,
          lyDo: req.body.lyDo,
        },
        { returnDocument: "after", upsert: true }
      );
      console.log(dangKiNghiPhep);
      return res.status(200).json(dangKiNghiPhep);
    } catch (error) {
      return res.status(400).json(error);
    }
  }
})();
