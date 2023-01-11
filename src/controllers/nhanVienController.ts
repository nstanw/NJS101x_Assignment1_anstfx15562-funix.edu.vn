import nhanVienModel from "../Models/nhanVienModel";

export default new (class NhanVienController {
  // thêm nhân viên
  //POST
  async addNhanVien(req, res) {
    let newNhanVien = new nhanVienModel({

      name: req.body.name,
      doB: Date.now(),
      salaryScale: req.body.salaryScale,
      startDate: req.body.startDate,
      department: req.body.department,
      annualLeave: req.body.annualLeave,
      image: req.body.image,
    });

    try {
      let themNhanVien = await newNhanVien.save();
      return res.status(201).json(themNhanVien);
    } catch (err) {
      return res.status(400).json(err);
    }
  }

  //GET thông tin nhân viên
  async getNhanVien(req, res) {
    try {
      let infoNhanVien = await nhanVienModel.findOne({username: req.decoded.username });
      console.log(infoNhanVien);
      return res.status(200).json(infoNhanVien);
    } catch (error) {
      return res.status(400).json(error);
    }
  }

  //PATCH image link
  async editLinkImage(req, res) {
    try {
      let infoNhanVien = await nhanVienModel.findOneAndUpdate({username: req.decoded.username }, { image: req.body.image }, { returnDocument: "after" });
      console.log(infoNhanVien);
      return res.json(infoNhanVien);
    } catch (error) {
      return res.json(error);
    }
  }
})();
