import nhanVienModel from "../Models/nhanVienModel";
import phienLamViecModel from "../Models/phienLamViecModel";
import { getHouseBetweenTwoDate } from "../util/getHouseBetweenTwoDate";
import nghiPhepModel from "../Models/nghiPhepModel";

interface IPhienLamViec {
  name: String | null;
  noiLam: String | null;
  active: Boolean;
  batDau: Date | null;
  ketThuc?: Date | null;
  thoiGianLam?: Number | null;
}
type PhienLamViecDto = IPhienLamViec[];

interface ITraCuuGioLamViec {
  name: String | null;
  noiLam: String | null;
  annualLeave?: Number | null;
  batDau: Date | null;
  ketThuc: Date | null;
  thoiGianLam: Number | null;
  active: Boolean;
}
type ITraCuuGioLamViecDto = ITraCuuGioLamViec[];

export default new (class {
  //GET active
  async getActive(req, res) {
    let checkActive = await nhanVienModel.findOne({ username: req.query.username });
    return res.send(checkActive);
  }

  //-GET phien làm viec dang hoat dong
  //-input: username
  //-output: active = true
  async getPhienDangLam(req, res) {
    console.log(req.decoded.username);
    let phienDangLam = await phienLamViecModel.find({ username: req.decoded.username });
    console.log("phienDangLam", phienDangLam);
    return res.send(phienDangLam);
  }

  //POST thêm phiên làm việc
  //- username
  // - noiLam
  async addPhienLamViec(req, res, next) {
    // input noiLam: string
    let nhanVien = await nhanVienModel.findOne({ username: req.body.username });

    if (nhanVien.active) {
      return res.json({ error: "Nhân viên đang trong phiên làm việc" });
    }

    //kiem tra actice. nếu đang hoạt động thì báo lỗi. line 40.
    let checkActive = await phienLamViecModel.findOne({ active: true });
    if (checkActive) {
      return res.json({ error: "Nhân viên đang trong phiên làm việc" });
    }
    //update active nhân viên
    let updateActive = await nhanVienModel.findOneAndUpdate({ username: req.body.username }, { active: true });

    //thêm phiên
    let newPhien = new phienLamViecModel({
      username: nhanVien.username,
      ngay: new Date(Date.now()).toLocaleDateString(),
      name: nhanVien.name,
      noiLam: req.body.noiLam,
      active: true,
      batDau: new Date(Date.now()),
      ketThuc: null,
      thoiGianLam: null,
    });
    try {
      let savePhien = await newPhien.save();
      return res.status(200).send([savePhien]);
    } catch (error) {
      return console.log(error);
    }
  }
  // PATCH Kết thúc phiên làm việc
  /**
   * duyệt qua cơ sở dữ liệu và kiểm tra xem có phiên nào đang hoạt không.
   * nếu không báo lỗi
   * nếu có kết thúc, tính giờ, chuyển trạng thai
   * trả về list các phiên
   * @param req
   * @param res
   * @param next
   */
  async ketThucPhienLamViec(req, res, next) {    
    //kiem tra người dùng đang trong phiên không
    let phienActive = await phienLamViecModel.find({ active: true });
    if (phienActive.length === 0) {
      return res.json({ error: "không có phiên đang hoạt động" });
    }

    // thay đổi trạng thái hoạt động
    let updateActive = await nhanVienModel.findOneAndUpdate({ username: req.decoded.username }, { active: false });

    //xác định phiên đang hoạt động
    let phienDangHoatDong = await phienLamViecModel.findOne({ username: req.decoded.username, active: true });

    //thay đổi phiên đó    
    try {
      let thoiGianLam = getHouseBetweenTwoDate(Date.now(), new Date(phienDangHoatDong.batDau).getTime());
      let setThoiGianKetThuc = {
        ketThuc: new Date(Date.now()),
        thoiGianLam: thoiGianLam,
        active: false,
      };
      const username = req.decoded.username
      //update thời gian kết thúc và tính thời gian đã làm
      await phienLamViecModel.findOneAndUpdate({ username: username, active: true }, setThoiGianKetThuc, { returnDocument: "after" });
      
      //trả list active = false
      let listPhienLamViecHomNay = await phienLamViecModel.find({});
      console.log(listPhienLamViecHomNay);

      res.status(200).json(listPhienLamViecHomNay);
    } catch (error) {
      console.log(error);
    }
  }
  //GET danh sach gio đã làm ở công ty
  async traCuuThongTinGioLamCongTy(req, res) {
    try {
      let listGioLamCongTy = await phienLamViecModel.find({
        noiLam: "Công Ty",
      });

      let salaryScale = await nhanVienModel.findOne({});
      let resultSalaryScale = salaryScale.salaryScale;

      let result: ITraCuuGioLamViecDto = listGioLamCongTy.map((phien) => ({
        ngay: phien.batDau,
        name: phien.name,
        noiLam: phien.noiLam,
        annualLeave: null,
        batDau: phien.batDau,
        ketThuc: phien.ketThuc,
        thoiGianLam: phien.thoiGianLam,
        active: phien.active,
        salaryScale: resultSalaryScale,
      }));
      console.log(result);
      return res.json(result);
    } catch (error) {
      return res.json(error);
    }
  }
  //GET lương tháng
  async getLuongTheoThang(req, res, next) {
    try {
      // let listGioLamCongTy = await phienLamViecModel.find({
      //   active: false,
      // });

      // let salaryScale = await nhanVienModel.findOne({username: req.decoded.username });
      // let resultSalaryScale = salaryScale.salaryScale;

      // let listTheoThang = listGioLamCongTy.filter((d) => new Date(d.ketThuc).getMonth() + 1 === parseInt(req.query.thang));
      // let thongTinNghiPhepNV = await nghiPhepModel.findOne({username: req.decoded.username });

      // let lamThem: number;
      // let gioLamThieu: number;
      // const thoiGianLamTrongThang = listTheoThang.map((thoiGianLam) => thoiGianLam.thoiGianLam);
      // let sum = thoiGianLamTrongThang.reduce((accumulator: number, currentValue: any) => accumulator + currentValue, 0);
      // if (sum && sum > 8) {
      //   lamThem = Math.round(sum * 100) / 100 - 8;
      //   gioLamThieu = 0;
      // } else {
      //   lamThem = 0;
      //   gioLamThieu = 8 - Math.round(sum * 100) / 100;
      // }

      // let chiTietLuong = {
      //   name: listTheoThang[0].name,
      //   annualLeave: thongTinNghiPhepNV.soPhepDangKi,
      //   lamThem: lamThem,
      //   gioLamThieu: Math.abs(gioLamThieu - thongTinNghiPhepNV.soPhepDangKi),
      //   thoiGianLam: Math.round(sum * 100) / 100,
      //   salaryScale: resultSalaryScale,
      //   luong: resultSalaryScale * 3000000 + (lamThem - gioLamThieu * 200000),
      // };

      // console.log(chiTietLuong);
      // return res.json(chiTietLuong);
    } catch (error) {
      return res.json(error);
    }
  }
})();
