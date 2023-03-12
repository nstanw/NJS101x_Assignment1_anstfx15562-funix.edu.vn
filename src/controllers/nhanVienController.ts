import nhanVienModel from "../Models/nhanVienModel";

export default new (class NhanVienController {
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
