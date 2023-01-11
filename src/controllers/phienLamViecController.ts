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
  username?: String;
}
type ITraCuuGioLamViecDto = ITraCuuGioLamViec[];

export default new (class PhienLamViec {
  //GET active
  //-input: username
  //-output: nhanVien
  async getActive(req, res) {
    try {
      let nhanVien = await nhanVienModel.findOne({ username: req.query.username });
      console.log(req.query.username);
      console.log(nhanVien);
      res.json(nhanVien);
    } catch (error) {
      res.json({ error: error });
    }
  }
  //POST thêm phiên làm việc
  //-input: username
  //-input: noiLam
  //-output: Phiên đang làm
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
      ngay: new Date(Date.now()).toLocaleDateString(),
      name: nhanVien.name,
      username: req.body.username,
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
  //-input: username
  //output: list false
  async ketThucPhienLamViec(req, res, next) {
    try {
      let phienDangLam = await phienLamViecModel.findOne({ active: true });
      let endPhienn = await phienLamViecModel.findOneAndUpdate(
        {
          username: req.body.username,
          active: true,
        },
        {
          active: false,
          ketThuc: new Date(Date.now()),
          thoiGianLam: getHouseBetweenTwoDate(new Date(phienDangLam.batDau).getTime(), new Date(Date.now()).getTime()),
        }
      );
      let listPhien = (await phienLamViecModel.find({ username: req.query.username })) as [];
      return res.json({ count: listPhien.length, result: listPhien });
    } catch (error) {
      console.log(error);
      return error;
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
        username: phien.username,
      }));
      console.log(result);
      return res.json(result);
    } catch (error) {
      return res.json(error);
    }
  }

  //GET danh sach gio đã làm nv
  async traCuuThongTinGioLamNhanVien(req, res) {
    console.log(req.query.idNhanVien);

    try {
      let listGioLamCongTy = await phienLamViecModel.find({
        idNhanVien: req.query.idNhanVien,
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

  //GET danh sach gio đã làm nhân viên theo ngày
  async traCuuThongTinGioLamNhanVienTheoNgay(req, res) {
    try {
      let salaryScale = await nhanVienModel.findOne({});
      let resultSalaryScale = salaryScale.salaryScale;
      // lấy danh sách các phiên đã làm của nhân viên theo mã nhân viên
      let listGioLamCongTy = await phienLamViecModel.find({
        idNhanVien: req.body.idNhanVien,
      });

      let thongTinNghiPhepNV = await nghiPhepModel.findOne({ idNhanVien: req.body.idNhanVien });

      //gom theo ngày. ngày tính theo ngày bắt đầu phiên
      const cacNgayCoTrongPhien: Set<number> = new Set(listGioLamCongTy.map((d: any) => new Date(d.batDau).getDay() + 1));

      let traCuuThongTin: any[] = [];
      let sum; // tổng giờ làm
      let lamThem: number;
      let gioLamThieu: number;
      //vào từng ngày để tính tổng thời gian làm của ngày đó
      cacNgayCoTrongPhien.forEach((ngay) => {
        const listPhienCuaNgayCuThe = listGioLamCongTy.filter((date: any) => new Date(date.batDau).getDay() === ngay);

        // Kiểm tra  trong ngày còn đang làm hay không
        let checkActiveCuaPhienNgayCuThe = listPhienCuaNgayCuThe.filter((phien: any) => phien.active === false);

        //Nếu không có phiên nào hoạt động
        if (listPhienCuaNgayCuThe.length === checkActiveCuaPhienNgayCuThe.length) {
          // nếu phiên cuối thì tính thời gian làm trong ngày
          const thoiGianLamTrongNgay = listPhienCuaNgayCuThe.map((thoiGianLam) => thoiGianLam.thoiGianLam);
          sum = thoiGianLamTrongNgay.reduce((accumulator: number, currentValue: any) => accumulator + currentValue, 0);

          if (sum && sum > 8) {
            lamThem = Math.round(sum * 100) / 100 - 8;
            gioLamThieu = 0;
          } else {
            lamThem = 0;
            gioLamThieu = 8 - Math.round(sum * 100) / 100;
          }

          let lamThemGio = sum < 8 ? 0 : sum - 8;
          // dữ liệu render ra UI
          let rowTraCuuGioLamViec = {
            ...checkActiveCuaPhienNgayCuThe[0],
            ketThuc: checkActiveCuaPhienNgayCuThe[checkActiveCuaPhienNgayCuThe.length - 1].ketThuc,
            lamThem: lamThemGio,
            gioLamThieu: Math.abs(gioLamThieu - thongTinNghiPhepNV.soPhepDangKi),
            thoiGianLam: Math.round(sum * 100) / 100,
            salaryScale: resultSalaryScale,
            luong: resultSalaryScale * 3000000 + (lamThem - gioLamThieu * 200000),
          };
          traCuuThongTin.push(rowTraCuuGioLamViec);
        }
      });

      let result = traCuuThongTin.map((phien) => ({
        ngay: phien.batDau,
        name: phien.name,
        batDau: phien.batDau,
        ketThuc: phien.ketThuc,
        noiLam: phien.noiLam,
        gioPhepDangKi: thongTinNghiPhepNV.soPhepDangKi,
        thoiGianLam: phien.thoiGianLam,
        salaryScale: resultSalaryScale,
      }));
      console.log(result);
      return res.json(result);
    } catch (error) {
      return res.json(error);
    }
  }

  //GET danh sach gio đã làm cua nhan Vien
  async traCuuThongTinGioLamCuaNhanVien(req, res) {
    try {
      let listGioLamCongTy = await phienLamViecModel.find({
        idNhanVien: req.body.idNhanVien,
      });

      let salaryScale = await nhanVienModel.findOne({ idNhanVien: req.body.idNhanVien });
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
        username: salaryScale.username,
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
      let listGioLamCongTy = await phienLamViecModel.find({
        active: false,
      });

      let salaryScale = await nhanVienModel.findOne({ gmail: "admin@admin.com" });
      let resultSalaryScale = salaryScale.salaryScale;

      let listTheoThang = listGioLamCongTy.filter((d) => new Date(d.ketThuc).getMonth() + 1 === parseInt(req.query.thang));
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
        gioLamThieu: Math.abs(gioLamThieu - thongTinNghiPhepNV.soPhepDangKi),
        thoiGianLam: Math.round(sum * 100) / 100,
        salaryScale: resultSalaryScale,
        luong: resultSalaryScale * 3000000 + (lamThem - gioLamThieu * 200000),
      };

      console.log(chiTietLuong);
      return res.json(chiTietLuong);
    } catch (error) {
      return res.json(error);
    }
  }
})();
