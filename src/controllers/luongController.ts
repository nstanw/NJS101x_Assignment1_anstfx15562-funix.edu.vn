import nghiPhepModel from "../Models/nghiPhepModel";
import nhanVienModel from "../Models/nhanVienModel";



export default new class luongController {
  //GET lương tháng
  async getLuongTheoThang(req, res, next) {
    try {
      let nhanVien = await nhanVienModel.findOne({ username: req.decoded.username });

      let nghiPhep = await nghiPhepModel.aggregate([
        {
          $group: {
            _id: null,
            soPhepTrongThang: { $sum: "$soNgay" },
          },
        },
      ]);
      console.log(nghiPhep);
      
      let thongTinLuong = {
        name: nhanVien.name,
        salaryScale: nhanVien.salaryScale,
        soPhepTrongThang:null,
        tongThoiGian:null,
        overTime: null,
        lamThieu: null,
        luong: nhanVien.salaryScale * 3000000,
      };
      if (nghiPhep.length === 0) {
        thongTinLuong.soPhepTrongThang = null;
      }else{
        thongTinLuong.soPhepTrongThang = nghiPhep
      }
    } catch (error) {
      return res.json(error);
    }
  }
}();