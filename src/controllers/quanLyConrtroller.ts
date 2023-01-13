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

  //GET gioLamTrongThangCuaNhanVien theo ngày
  //-input: username nhân viên quản lý
  //-output: thông tin làm việc các ngày, tháng
  async gioLamTrongThangCuaNhanVien(req, res) {
    try {
      // lấy toàn bộ phiên về
      // tách từng ngày
      // tính giờ
      //công các ngày
      // thêm các trường liên quan
      //       - Hiển thị danh sách giờ đã làm:
      // Ngày.
      // Giờ bắt đầu.
      // Giờ kết thúc.
      // Nơi làm việc.
      // Số giờ được tính là làm thêm. Giờ làm thêm là giờ làm sau 8 tiếng.
      // Tổng số giờ đã làm của lần bắt đầu/kết thúc này.
      // Nếu là lần cuối cùng của ngày thì hiện giờ annualLeave đã đăng ký, tổng số giờ làm theo ngày  (số giờ đã làm của cả ngày + giờ đã đăng ký annualLeave).
      // - Có thể chọn tháng.

      const username = req.query.username;
      let AllPhien = await phienLamViecModel.find({ username: username });

      //tách từng ngày
      const arrayNgay = AllPhien.map((d) => d.batDau.toLocaleDateString());
      let listNgay = new Set(arrayNgay);

      let traCuuThongTin: any[] = [];
      let sum; // tổng giờ làm

      // duyệt các ngày trong tháng
      listNgay.forEach((ngayLamViec) => {
        const listPhienOfOneDay = AllPhien.filter((phien) => phien.batDau.toLocaleDateString() === ngayLamViec);

        // Kiểm tra còn đang làm hay không, nếu có thêm vào mảng để trả về
        let checkActiveCuaPhien = listPhienOfOneDay.filter((phien: any) => phien.active === true);
        checkActiveCuaPhien.forEach((element) => {
          if (checkActiveCuaPhien) {
            let rowPhienDangHoatDong = {
              name: element.name,
              ngay: element.ngay,
              noiLam: element.noiLam,
              batDau: element.batDau,
              ketThuc: null,
              thoiGianLam: null,
              active: true,
              lamThem: null,
            };
            traCuuThongTin.push(rowPhienDangHoatDong);
          }
        });

        let phienLamXong = listPhienOfOneDay.filter((phien: any) => phien.active === false);
        const arrThoiGianLamTrongNgay = phienLamXong.map((thoiGianLam) => thoiGianLam.thoiGianLam);
        sum = arrThoiGianLamTrongNgay.reduce((accumulator: number, currentValue: any) => accumulator + currentValue, 0);

        let lamThemGio = sum < 8 ? 0 : sum - 8;

        let rowTraCuuGioLamViec = {
          name: phienLamXong[0].name,
          ngay: phienLamXong[0].ngay,
          noiLam: phienLamXong[0].noiLam,
          batDau: phienLamXong[0].batDau,
          ketThuc: phienLamXong[phienLamXong.length - 1].ketThuc,
          thoiGianLam: Math.round(sum * 100) / 100,
          lamThem: lamThemGio,
        };
        traCuuThongTin.push(rowTraCuuGioLamViec);
      });
      return res.json(traCuuThongTin);
    } catch (error) {
      console.log("Failed:", error);
    }
  }

  //DELETE: xóa giờ làm đã kết thúc
  //- giờ làm đã kếu thúc (ngày)
  //- xóa giờ
  //- input: phiÊn cần xóa ( _id trả về là duy nhất với phiên)
  async deleteGioLamKetThuc(req, res) {
    const id = req.body.id;
    let deletePhien = await phienLamViecModel.findByIdAndDelete(id);
    res.json(deletePhien);
  }
}
export default new QuanLyController();
