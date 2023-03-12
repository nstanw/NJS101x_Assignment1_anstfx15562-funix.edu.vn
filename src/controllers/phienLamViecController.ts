import nhanVienModel from "../Models/nhanVienModel";
import phienLamViecModel from "../Models/phienLamViecModel";
import { getHouseBetweenTwoDate } from "../util/getHouseBetweenTwoDate";
import nghiPhepModel from "../Models/nghiPhepModel";
import moment = require("moment");

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
  ngay: String;
  name: String | null;
  batDau: Date | null;
  ketThuc: Date | null;
  noiLam: String | null;
  annualLeave?: Number | null;
  thoiGianLam: Number | null;
  active: Boolean;
}
type ITraCuuGioLamViecDto = ITraCuuGioLamViec[];

export default new (class {
  //GET all
  async getAll(req, res) {
    try {
      let phien = await phienLamViecModel.find({});
      let input = {
        active: req.query.active,
        noiLam: req.query.noiLam,
        ngay: req.query.ngay,
        username: req.query.username,
        totalTime: null,
      };
      let filter = Object.keys(input);
      if (filter.length > 0) {
        filter.forEach((element) => {
          let ep = "eq";
          switch (element) {
            case "username":
              if (input.username) {
                if (ep === "neq") {
                  phien = phien.filter((p) => p.username !== input.username);
                } else phien = phien.filter((p) => p.username === input.username);
              }
              break;
            case "active":
              if (input.active) {
                if (ep === "neq") {
                  phien = phien.filter((p) => p.active !== input.active);
                } else phien = phien.filter((p) => p.active.toString() === input.active);
              }
              break;

            case "noiLam":
              if (input.noiLam) {
                if (ep === "neq") {
                  phien = phien.filter((p) => p.noiLam !== input.noiLam);
                } else phien = phien.filter((p) => p.noiLam === input.noiLam);
              }
              break;

            case "ngay":
              if (input.ngay) {
                if (ep === "neq") {
                  phien = phien.filter((p) => p.ngay.getDay() !== input.ngay.getDay());
                } else phien = phien.filter((p) => new Date(p.ngay).getDay() === new Date(input.ngay).getDay());
              }
              break;
          }
        });
      }
      var totalTime;
      await phienLamViecModel.aggregate(
        [
          {
            $group: {
              _id: { $dateToString: { format: "%d/%m/%Y", date: "$ngay" } },
              totalValue: { $sum: "$tongThoiGian" },
            },
          },
        ],
        function (err, result) {
          if (err) {
            console.log(err);
          } else {
            console.log(result);
            const ngay = moment(input.ngay).format("DD/MM/YYYY");
            const checkToday : number = result.filter((t) => t._id === ngay).length
            if (input.ngay !== null && checkToday > 0 ) {
              totalTime = result.filter((t) => t._id === ngay)[0].totalValue;
              const viewGetAll = [...phien, { totalTime: totalTime }];              
              return res.json(viewGetAll);
            }
            return res.json(null);
          }
        }
      );
    } catch (error) {
      return res.json(error);
    }
  }
  //GET active
  async phienHienTai(req, res) {
    try {
      let phien = await phienLamViecModel.findOne({ username: req.decoded.username, active: true });
      return res.json(phien);
    } catch (error) {
      return res.json(error);
    }
  }

  //POST thêm phiên làm việc
  async diemDanh(req, res, next) {
    const username = req.decoded.username;
    try {
      let nhanVien = await nhanVienModel.findOne({ username: username });
      let newPhien = {
        name: nhanVien.name,
        ngay: new Date(Date.now()),
        noiLam: req.body.noiLam,
        active: true,
        startTime: new Date(Date.now()),
        endTime: null,
        tongThoiGian: null,
        username: nhanVien.username,
      };
      let diemDanh = await new phienLamViecModel(newPhien).save();
      console.log(diemDanh);

      return res.json(diemDanh);
    } catch (error) {
      return res.json(error);
    }
  }
  // PATCH Kết thúc phiên làm việc

  async ketThucPhienLamViec(req, res, next) {
    const username = req.decoded.username;
    //xác định phiên đang hoạt động
    let phienDangHoatDong = await phienLamViecModel.findOne({ username: username, active: true });
    if (phienDangHoatDong === null) {
      return res.json({ error: "Không có phiên nào đang hoạt động" });
    }
    try {
      let tongThoiGian = getHouseBetweenTwoDate(new Date(phienDangHoatDong.startTime).getTime(), Date.now());
      let setThoiGianKetThuc = {
        endTime: new Date(Date.now()),
        tongThoiGian: tongThoiGian,
        active: false,
      };
      //update thời gian kết thúc và tính thời gian đã làm
      await phienLamViecModel.findOneAndUpdate({ username: username, active: true }, setThoiGianKetThuc, { returnDocument: "after" });

      //trả list active = false
      let listPhienLamViecHomNay = await phienLamViecModel.find({});
      console.log(listPhienLamViecHomNay);

      return res.status(200).json(listPhienLamViecHomNay);
    } catch (error) {
      return res.json(error);
    }
  }
  //GET danh sach gio đã làm ở công ty
  // async traCuuThongTinGioLamCongTy(req, res) {
  //   try {
  //     const username = req.decoded.username;
  //     let listGioLamCongTy = await phienLamViecModel.find({
  //       username: username,
  //       noiLam: "Công Ty",
  //     });

  //     // hệ số lương
  //     let nhanVien = await nhanVienModel.findOne({});
  //     let annualLeave = nhanVien.annualLeave;

  //     //kiểm tra ngày đó có đăng kí phép không. phép mấy tiếng
  //     let listDangKiPhep = await nghiPhepModel.find({
  //       username: username,
  //     });

  //     let result = listGioLamCongTy.map((phien) => {
  //       let gioLamThem;
  //       if (phien.thoiGianLam > 8) {
  //         gioLamThem = phien.thoiGianLam - 8;
  //       } else {
  //         gioLamThem = 0;
  //       }
  //       return {
  //         // tính toán các trường cần trả về:
  //         ngay: phien.batDau,
  //         name: phien.name,
  //         batDau: phien.batDau,
  //         noiLam: phien.noiLam,
  //         ketThuc: phien.ketThuc,
  //         gioLamThem: gioLamThem,
  //         thoiGianLam: phien.thoiGianLam,
  //         active: phien.active,
  //         annualLeave: annualLeave,
  //       };
  //     });

  //     // xác định nhân viên làm bao nhiêu ngày
  //     const listNgayLamViec = new Set(result.map((d) => d.ngay));
  //     listNgayLamViec.forEach((ngay) => {
  //       // Kiểm tra  trong ngày còn đang làm hay không
  //       let checkActiveCuaPhienNgayCuThe = result.filter((phien: any) => phien.active === false);
  //       //Nếu không có phiên nào hoạt động
  //       if (result.length === checkActiveCuaPhienNgayCuThe.length) {
  //         // duyệt vào từng ngày
  //         const listPhienCuaNgayCuThe = result.filter((date: any) => date.ngay === ngay);

  //         //chi tiêt ngày: bắt đầu, kết thúc, thời gian làm, làm thêm
  //         const tongThoiGianLam = listPhienCuaNgayCuThe.map((d) => d.thoiGianLam).reduce((preValue, currentValue) => preValue + currentValue, 0);

  //         let lamThemGio = tongThoiGianLam < 8 ? 0 : tongThoiGianLam - 8;

  //         let rowTraCuuGioLamViec = {
  //           ...checkActiveCuaPhienNgayCuThe[0],
  //           ketThuc: checkActiveCuaPhienNgayCuThe[checkActiveCuaPhienNgayCuThe.length - 1].ketThuc,
  //           thoiGianLam: Math.round(tongThoiGianLam * 100) / 100,
  //           gioLamThem: lamThemGio,
  //         };
  //         // traCuuThongTin.push(rowTraCuuGioLamViec);
  //         console.log(rowTraCuuGioLamViec);
  //         return res.json(rowTraCuuGioLamViec);
  //       }
  //       //còn phiên đang làm
  //       // dữ liệu render ra UI
  //       let rowTraCuuGioLamViec = {
  //         ...result[0],
  //         ketThuc: null,
  //         thoiGianLam: null,
  //         active: true,
  //         gioLamThem: null,
  //       };
  //       console.log(result);
  //       return res.json(rowTraCuuGioLamViec);
  //     });
  //   } catch (error) {
  //     return res.json(error);
  //   }
  // }

  //GET lương tháng

  // async getLuongTheoThang(req, res, next) {
  //   try {
  //     const username = req.decoded.username;
  //     let listGioLamCongTy = await phienLamViecModel.find({
  //       username: username,
  //       active: false,
  //     });

  //     let salaryScale = await nhanVienModel.findOne({ username: req.decoded.username });
  //     let resultSalaryScale = salaryScale.salaryScale;

  //     let listTheoThang = listGioLamCongTy.filter((d) => new Date(d.ketThuc).getMonth() + 1 === parseInt(req.body.thang)); // cgeckk boddy -> query

  //     // tính sô giờ làm mỗi ngày
  //     //->số giờ làm -> giờ thiếu
  //     // tổng thời gian phép

  //     let overTimeArr = [];
  //     let gioLamThieuArr = [];

  //     // xác định nhân viên làm bao nhiêu ngày
  //     const listNgayLamViec = new Set(listGioLamCongTy.map(d => d.ngay));
  //     listNgayLamViec.forEach(ngay => {
  //       // Kiểm tra  trong ngày còn đang làm hay không
  //       let checkActiveCuaPhienNgayCuThe = listGioLamCongTy.filter((phien: any) => phien.active === false);
  //       //Nếu không có phiên nào hoạt động
  //       if (listGioLamCongTy.length === checkActiveCuaPhienNgayCuThe.length) {
  //         // duyệt vào từng ngày
  //         const listPhienCuaNgayCuThe = listGioLamCongTy.filter((date: any) => date.ngay === ngay);

  //         //chi tiêt ngày: bắt đầu, kết thúc, thời gian làm, làm thêm
  //         const tongThoiGianLam = listPhienCuaNgayCuThe.map(d => d.thoiGianLam).reduce((preValue, currentValue) => preValue + currentValue, 0);

  //         let lamThemGio;
  //         let gioLamThieu;
  //         if (tongThoiGianLam > 8) {
  //           lamThemGio = tongThoiGianLam - 8;
  //           gioLamThieu = 0;
  //         } else {
  //           lamThemGio = 0;
  //           gioLamThieu = 8 - tongThoiGianLam;
  //         }

  //         overTimeArr = overTimeArr.concat([lamThemGio]);
  //         gioLamThieuArr = gioLamThieuArr.concat([gioLamThieu]);
  //       }
  //     });

  //     let thoiGianLamThieu = gioLamThieuArr.reduce((accumulator: number, currentValue: any) => accumulator + currentValue, 0);
  //     let overTime = overTimeArr.reduce((accumulator: number, currentValue: any) => accumulator + currentValue, 0);

  //     // thời gian đăng kí phép
  //     let thoiGianDangKiNghi = await nhanVienModel.findOne({ username: username });
  //     let thoiGianDangKiNghiPhep = (thoiGianDangKiNghi.phepNam - thoiGianDangKiNghi.annualLeave) * 8;

  //     let luong = Math.round((resultSalaryScale * 3000000 + (overTime - thoiGianLamThieu + thoiGianDangKiNghiPhep) * 200000))
  //     let chiTietLuong = {
  //       name: listTheoThang[0].name,
  //       salaryScale: resultSalaryScale,
  //       overTime: overTime,
  //       gioLamThieu: thoiGianLamThieu + thoiGianDangKiNghiPhep,
  //       luong: luong,
  //     };

  //     console.log(chiTietLuong);
  //     return res.json(chiTietLuong);
  //   } catch (error) {
  //     return res.json(error);
  //   }
  // }
})();
function forEach(arg0: (element: any) => void) {
  throw new Error("Function not implemented.");
}
