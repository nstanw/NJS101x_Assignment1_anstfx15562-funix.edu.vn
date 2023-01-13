import phienLamViecModel from "../Models/phienLamViecModel";
import nhanVienModel from "../Models/nhanVienModel";
import quanLyModel from "../Models/quanLyModel";
import nghiPhepModel from "../Models/nghiPhepModel";

class QuanLyController {
  //GET
  async getNhanVienMinhQuanLy(req, res) {
    try {
      const id = req.decoded.username;
      let quanLy = await quanLyModel.findOne({ id: id });

      let nhanViens = [];
      let phuTrachs = quanLy.phuTrach.split(",");
      for (const nhanVien of phuTrachs) {
        if (nhanVien === "") {
          break;
        }
        const infoNhanVien = await nhanVienModel.findOne({ username: nhanVien });
        let info = { name: infoNhanVien.name, username: infoNhanVien.username, id: infoNhanVien._id };
        console.log(info);
        nhanViens.push(info);
      }
      res.json(nhanViens);
    } catch (error) {
      res.status(400).json(error);
    }
  }
  async thayDoiThongTin(req, res) {
    let allNhanVien = await phienLamViecModel.updateMany({ name: "admin" }, { $set: { idNhanVien: "nv1" } });
    console.log(allNhanVien);
    return res.json(allNhanVien);
  }

  //GET danh sach gio đã làm nhân viên theo ngày
  //-input: username nhân viên quản lý
  async traCuuThongTinGioLamNhanVien(req, res) {
    try {
      // get toàn bộ phiên về
      // const username = req.decoded.username;
      const username = req.query.username;
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
        
        let ngayDangKiPhep = dangKiPheps.filter((d) => new Date(d.ngay).getDate() === ngay).map((d) => d.ngay); // lo: tra về null
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
            soGioDangKiPhep: soGioDangKiPhep.gio
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
}
export default new QuanLyController();
