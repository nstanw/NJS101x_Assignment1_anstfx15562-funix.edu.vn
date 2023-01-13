import nhanVienModel from "../Models/nhanVienModel";
import phienLamViecModel from "../Models/phienLamViecModel";
import { getHouseBetweenTwoDate } from "../util/getHouseBetweenTwoDate";
import nghiPhepModel from "../Models/nghiPhepModel";
import quanLyModel from "../Models/quanLyModel";

//- get phiên làm việc trong ngày
// get danh sách các phiên

//- nếu là phiên cuối hiện tổng số giờ theo ngày
//- nếu toàn bộ đều active = false thì sẽ tính tổng thời gian

//hiển thị lương
/**
 * salaryScale
 * ovserTime
 * số giờ thiếu
 * lương
 */

// thông tin quản lý
// id
// tên

// phân trang
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
  //GET active
  async getActive(req, res) {
    const username = req.decoded.username;
    let checkActive = await nhanVienModel.findOne({ username: username });
    return res.send(checkActive);
  }

  //-GET phien làm viec dang hoat dong
  //-input: username
  //-output: active = true
  async getPhienDangLam(req, res) {
    let phienDangLam = await phienLamViecModel.findOne({ username: req.decoded.username, active: true });
    console.log("phienDangLam", phienDangLam);
    return res.send(phienDangLam);
  }

  //POST thêm phiên làm việc
  //- username
  // - noiLam
  async addPhienLamViec(req, res, next) {
    // input noiLam: string
    let nhanVien = await nhanVienModel.findOne({ username: req.decoded.username });

    if (nhanVien.active) {
      return res.json({ error: "Nhân viên đang trong phiên làm việc" });
    }

    //kiem tra actice. nếu đang hoạt động thì báo lỗi. line 40.
    let checkActive = await phienLamViecModel.findOne({ active: true });
    if (checkActive) {
      return res.json({ error: "Nhân viên đang trong phiên làm việc" });
    }
    //update active nhân viên
    await nhanVienModel.findOneAndUpdate({ username: req.decoded.username }, { active: true });

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
      modified: true,
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
      const username = req.decoded.username;
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

  //GET danh sach gio đã làm nhân viên theo ngày
  async traCuuThongTinGioLamNhanVienTheoNgay(req, res) {
    try {
      // get toàn bộ phiên về
      const username = req.decoded.username;
      let listTraCuuGioLam = await phienLamViecModel.find({ username: username, noiLam: "Công Ty" });

      // get các ngày có trong phiên
      const cacNgayCoTrongPhien: Set<number> = new Set(listTraCuuGioLam.map((date: any) => new Date(date.batDau).getDate()));

      // duyệt vào các ngày. tính thông tin lương
      let traCuuThongTin: any[] = [];
      let sum; // tổng giờ làm

      //#region  Tra cứu giờ làm
      cacNgayCoTrongPhien.forEach(async (ngay) => {
        //kiem tra ngay đó có đăng kí phép hay không
        let dangKiPheps = await nghiPhepModel.find({ username: username });
        let ngayDangKiPhep = dangKiPheps.filter((d) => new Date(d.ngay).getDate() === ngay).map((d) => d.ngay);
        let soGioDangKiPhep = await nghiPhepModel.findOne({ username: username, ngay: ngayDangKiPhep });
        // nhóm các phiên làm trong ngày vào 1 mảng
        const listPhienCuaNgayCuThe = listTraCuuGioLam.filter((date: any) => new Date(date.batDau).getDate() === ngay);

        // Kiểm tra  trong ngày còn đang làm hay không
        let checkActiveCuaPhienNgayCuThe = listPhienCuaNgayCuThe.filter((phien: any) => phien.active === false);

        //Nếu không có phiên nào hoạt động
        if (listPhienCuaNgayCuThe.length === checkActiveCuaPhienNgayCuThe.length) {
          // nếu phiên cuối thì tính thời gian làm trong ngày
          const thoiGianLamTrongNgay = listPhienCuaNgayCuThe.map((thoiGianLam) => thoiGianLam.thoiGianLam);
          sum = thoiGianLamTrongNgay.reduce((accumulator: number, currentValue: any) => accumulator + currentValue, 0);

          let lamThemGio = sum < 8 ? 0 : sum - 8;
          // dữ liệu render ra UI
          let rowTraCuuGioLamViec = {
            name: listTraCuuGioLam[0].name,
            ngay: listTraCuuGioLam[0].ngay,
            noiLam: listTraCuuGioLam[0].noiLam,
            batDau: listTraCuuGioLam[0].batDau,
            username: listTraCuuGioLam[0].username,
            ketThuc: listTraCuuGioLam[listTraCuuGioLam.length - 1].ketThuc,
            active: false,
            thoiGianLam: Math.round(sum * 100) / 100,
            lamThem: lamThemGio,
            soGioDangKiPhep: soGioDangKiPhep.gio,
          };
          traCuuThongTin.push(rowTraCuuGioLamViec);
          return res.json(traCuuThongTin);
        }
        // dữ liệu render ra UI
        let rowTraCuuGioLamViec = {
          name: listTraCuuGioLam[0].name,
          ngay: listTraCuuGioLam[0].ngay,
          noiLam: listTraCuuGioLam[0].noiLam,
          batDau: listTraCuuGioLam[0].batDau,
          username: listTraCuuGioLam[0].username,
          ketThuc: null,
          thoiGianLam: null,
          active: true,
          lamThem: null,
        };
        traCuuThongTin.push(rowTraCuuGioLamViec);
        return res.json(traCuuThongTin);
      });

      //#endregion
    } catch (error) {
      console.log("Failed:", error);
    }
  }

  //GET info quan ly
  async getInfoQuanLy(req, res) {
    try {
      let nhanVien = await nhanVienModel.findOne({ username: req.decoded.username });
      let info = await quanLyModel.findOne({ id: nhanVien.idNguoiQuanLy });
      res.json(info);
    } catch (error) {
      res.status(400).json({ error: error });
    }
  }

  //GET danh sach gio đã làm ở công ty
  //loi
  async traCuuThongTinGioLamCongTy(req, res) {
    try {
      // const username = req.decoded.username;
      const username = req.query.username;
      let listGioLamCongTy = await phienLamViecModel.find({
        username: username,
        noiLam: "Công Ty",
      });

      // hệ số lương
      let nhanVien = await nhanVienModel.findOne({});
      let annualLeave = nhanVien.annualLeave;

      //kiểm tra ngày đó có đăng kí phép không. phép mấy tiếng
      let listDangKiPhep = await nghiPhepModel.find({
        username: username,
      });

      let result = listGioLamCongTy.map((phien) => {
        let gioLamThem;
        if (phien.thoiGianLam > 8) {
          gioLamThem = phien.thoiGianLam - 8;
        } else {
          gioLamThem = 0;
        }
        return {
          // tính toán các trường cần trả về:
          ngay: phien.batDau,
          name: phien.name,
          batDau: phien.batDau,
          noiLam: phien.noiLam,
          ketThuc: phien.ketThuc,
          gioLamThem: gioLamThem,
          thoiGianLam: phien.thoiGianLam,
          active: phien.active,
          annualLeave: annualLeave,
        };
      });

      // xác định nhân viên làm bao nhiêu ngày
      const listNgayLamViec = new Set(result.map((d) => d.ngay));
      console.log(listNgayLamViec);

      let traCuuThongTin: any[] = [];

      // Kiểm tra  trong ngày còn đang làm hay không
      let checkActiveCuaPhienNgayCuThe = result.filter((phien: any) => phien.active === false);
      //Nếu không có phiên nào hoạt động
      if (result.length === checkActiveCuaPhienNgayCuThe.length) {
        listNgayLamViec.forEach((ngay) => {
          // duyệt vào từng ngày
          const listPhienCuaNgayCuThe = result.filter((date: any) => date.ngay === ngay);

          //chi tiêt ngày: bắt đầu, kết thúc, thời gian làm, làm thêm
          const tongThoiGianLam = listPhienCuaNgayCuThe.map((d) => d.thoiGianLam).reduce((preValue, currentValue) => preValue + currentValue, 0);

          let lamThemGio = tongThoiGianLam < 8 ? 0 : tongThoiGianLam - 8;

          let rowTraCuuGioLamViec = {
            ...checkActiveCuaPhienNgayCuThe[0],
            ketThuc: checkActiveCuaPhienNgayCuThe[checkActiveCuaPhienNgayCuThe.length - 1].ketThuc,
            thoiGianLam: Math.round(tongThoiGianLam * 100) / 100,
            gioLamThem: lamThemGio,
          };
          traCuuThongTin.push(rowTraCuuGioLamViec);
          console.log(traCuuThongTin);
        });
      }

      //còn phiên đang làm
      // dữ liệu render ra UI
      let actice = listGioLamCongTy.filter((d) => d.active);
      if (actice) {
        let PhienActive = {
          ...result[0],
          ketThuc: null,
          thoiGianLam: null,
          active: true,
          gioLamThem: null,
        };
        console.log(PhienActive);
        traCuuThongTin.push(...result);
      }
      return res.json(traCuuThongTin);
    } catch (error) {
      return res.json(error);
    }
  }

  //GET lương tháng
  //-input : thang
  //-output : luong
  async getLuongTheoThang(req, res, next) {
    try {
      const username = req.decoded.username;
      let listGioLamCongTy = await phienLamViecModel.find({
        username: username,
        active: false,
      });

      let salaryScale = await nhanVienModel.findOne({ username: req.decoded.username });
      let resultSalaryScale = salaryScale.salaryScale;

      let listTheoThang = listGioLamCongTy.filter((d) => new Date(d.batDau).getMonth() + 1 === parseInt(req.query.thang)); // cgeckk boddy -> query

      // tính sô giờ làm mỗi ngày
      //->số giờ làm -> giờ thiếu
      // tổng thời gian phép

      let overTimeArr = [];
      let gioLamThieuArr = [];

      // xác định nhân viên làm bao nhiêu ngày
      const listNgayLamViec = new Set(listGioLamCongTy.map((d) => d.ngay));
      listNgayLamViec.forEach((ngay) => {
        // Kiểm tra  trong ngày còn đang làm hay không
        let checkActiveCuaPhienNgayCuThe = listGioLamCongTy.filter((phien: any) => phien.active === false);
        //Nếu không có phiên nào hoạt động
        if (listGioLamCongTy.length === checkActiveCuaPhienNgayCuThe.length) {
          // duyệt vào từng ngày
          const listPhienCuaNgayCuThe = listGioLamCongTy.filter((date: any) => date.ngay === ngay);

          //chi tiêt ngày: bắt đầu, kết thúc, thời gian làm, làm thêm
          const tongThoiGianLam = listPhienCuaNgayCuThe.map((d) => d.thoiGianLam).reduce((preValue, currentValue) => preValue + currentValue, 0);

          let lamThemGio;
          let gioLamThieu;
          if (tongThoiGianLam > 8) {
            lamThemGio = tongThoiGianLam - 8;
            gioLamThieu = 0;
          } else {
            lamThemGio = 0;
            gioLamThieu = 8 - tongThoiGianLam;
          }

          overTimeArr = overTimeArr.concat([lamThemGio]);
          gioLamThieuArr = gioLamThieuArr.concat([gioLamThieu]);
        }
      });

      let thoiGianLamThieu = gioLamThieuArr.reduce((accumulator: number, currentValue: any) => accumulator + currentValue, 0);
      let overTime = overTimeArr.reduce((accumulator: number, currentValue: any) => accumulator + currentValue, 0);

      // thời gian đăng kí phép
      let thoiGianDangKiNghi = await nhanVienModel.findOne({ username: username });
      let thoiGianDangKiNghiPhep = (thoiGianDangKiNghi.phepNam - thoiGianDangKiNghi.annualLeave) * 8;

      let luong = Math.round(resultSalaryScale * 3000000 + (overTime - thoiGianLamThieu + thoiGianDangKiNghiPhep) * 200000);
      let chiTietLuong = {
        name: listTheoThang[0].name,
        salaryScale: resultSalaryScale,
        overTime: overTime,
        gioLamThieu: thoiGianLamThieu + thoiGianDangKiNghiPhep,
        luong: luong,
        thoiGianDangKiNghiPhep: thoiGianDangKiNghiPhep,
      };

      console.log(chiTietLuong);
      return res.json(chiTietLuong);
    } catch (error) {
      return res.json(error);
    }
  }
})();
