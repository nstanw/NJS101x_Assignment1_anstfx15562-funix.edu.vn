import nhanVienModel from "../Models/nhanVienModel";
import { isNonNullChain } from "typescript";
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

export default new (class PhienLamViec {
  //GET active
  async getActive(req, res) {
    let name = "admin";
    let checkActive = await phienLamViecModel.findOne({ active: true });
    console.log(checkActive);
    if (checkActive === null) {
      let result: PhienLamViecDto = [
        {
          name: name,
          noiLam: null,
          active: false,
          batDau: null,
          ketThuc: null,
          thoiGianLam: null,
        },
      ];
      return res.json(result);
    }

    let result: PhienLamViecDto = [
      {
        name: checkActive.name,
        noiLam: checkActive.noiLam,
        active: true,
        batDau: new Date(checkActive.batDau),
        ketThuc: null,
        thoiGianLam: null,
      },
    ];
    return res.send(result);
  }

  //POST thêm phiên làm việc
  async addPhienLamViec(req, res, next) {
    // input noiLam: string
    let nhanVien = await nhanVienModel.findOne({ gmail: "admin@admin.com" });
    //kiểm tra data rỗng hay không. rỗng thì tạo mới
    let dataBase = (await phienLamViecModel.find({})) as [];

    //kiem tra actice. nếu đang hoạt động thì báo lỗi. line 40.
    let checkActive = await phienLamViecModel.findOne({ active: true });

    // nếu active = false và chưa có phiên sẽ thêm phiên làm mới
    let isCheckAddPhienLamViec: Boolean = checkActive === null || dataBase.length === 0;
    if (isCheckAddPhienLamViec) {
      let newPhien = new phienLamViecModel({
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
    return res.status(400).json({ err: "Đang trong phiên làm việc không thể điểm danh" });
  }
  // PATCH Kết thúc phiên làm việc
  async ketThucPhienLamViec(req, res, next) {
    // kiểm tra trong list phiên có phiên nào không. nếu trống thông báo lỗi
    let dataBase = (await phienLamViecModel.find({})) as [];
    if (dataBase.length === 0) {
      return res.status(400).json({ error: "Hiện tại không có phiên làm việc nào" });
    }
    //kiem tra người dùng đang trong phiên không
    let phienActive = await phienLamViecModel.findOne({ active: true });
    if (phienActive === null) {
      return res.json({
        error: "Hiện tại chưa có phiên làm việc nào đang diễn ra. Không thể kết thúc",
      });
    }
    //thay dổi trạng thái
    try {
      let thoiGianLam = getHouseBetweenTwoDate(Date.now(), phienActive.batDau.getTime());
      let setThoiGianKetThuc = {
        ketThuc: new Date(Date.now()),
        thoiGianLam: thoiGianLam,
        active: false,
      };

      //update thời gian kết thúc và tính thời gian đã làm
      await phienLamViecModel.findOneAndUpdate({ active: true }, setThoiGianKetThuc, { returnDocument: "after" });

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

  async getLuongTheoThang(req, res, next) {
    try {
      let listGioLamCongTy = await phienLamViecModel.find({
        active: false,
      });

      let salaryScale = await nhanVienModel.findOne({ gmail: "admin@admin.com" });
      let resultSalaryScale = salaryScale.salaryScale;

      let listTheoThang = listGioLamCongTy.filter((d) => new Date(d.ketThuc).getMonth() + 1 === req.body.thang);
      let thongTinNghiPhepNV = await nghiPhepModel.findOne({ gmail: "admin@admin.com" });

      let lamThem: number;
      let gioLamThieu: number;
      const thoiGianLamTrongThang = listTheoThang.map((thoiGianLam) => thoiGianLam.thoiGianLam);
      let sum = thoiGianLamTrongThang.reduce((accumulator: number, currentValue: any) => accumulator + currentValue, 0);
      if (sum && sum > 8) {
        lamThem = Math.round(sum * 100) / 100 - 8;
        gioLamThieu = 0;
      } else {
        lamThem = 0;
        gioLamThieu = 8 - Math.round(sum * 100) / 100;
      }

      let chiTietLuong = {
        name: listTheoThang[0].name,
        annualLeave: thongTinNghiPhepNV.soPhepDangKi,
        lamThem: lamThem,
        gioLamThieu: gioLamThieu - thongTinNghiPhepNV.soPhepDangKi,
        thoiGianLam: Math.round(sum * 100) / 100,
        salaryScale: resultSalaryScale,
        luong: resultSalaryScale * 3000000 + (lamThem - (gioLamThieu - thongTinNghiPhepNV.soPhepDangKi)) * 200000,
      };
      
      console.log(chiTietLuong);
      return res.json(chiTietLuong);
    } catch (error) {
      return res.json(error);
    }
  }
})();
