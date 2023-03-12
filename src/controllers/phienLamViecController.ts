import nhanVienModel from "../Models/nhanVienModel";
import phienLamViecModel from "../Models/phienLamViecModel";
import { getHouseBetweenTwoDate } from "../util/getHouseBetweenTwoDate";
import nghiPhepModel from "../Models/nghiPhepModel";
import moment = require("moment");
import quanLyModel from "../Models/quanLyModel";

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
            const checkToday: number = result.filter((t) => t._id === ngay).length;
            if (input.ngay !== null && checkToday > 0) {
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
  public async phienHienTai(req, res) {
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
  async traCuuThongTinGioLamCongTy(req, res) {
    try {
      let listEndPhien = await phienLamViecModel.aggregate([
        {
          $match: {
            noiLam: "congTy",
            active: false,
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%d/%m/%Y", date: "$ngay" } },
            startTime: { $min: "$startTime" },
            endTime: { $max: "$endTime" },
            tongThoiGian: { $sum: "$tongThoiGian" },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      let nghiPheps = await nghiPhepModel.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: "%d/%m/%Y", date: "$ngayDangKy" } },
            soNgay: { $sum: "$soNgay" },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      let phienActive = await phienLamViecModel.findOne({ username: req.decoded.username, active: true });
      let nhanVien = await nhanVienModel.findOne({ username: req.decoded.username });

      let quanLy = await quanLyModel.findOne({ username: nhanVien.idQuanLy });
      console.log(quanLy);

      listEndPhien.map((p) => {
        //lọc số ngày phép
        let filter = nghiPheps.filter((np) => np._id === p._id);
        if (filter.length > 0) {
          p.ngayPhep = filter[0].soNgay;
          p.tongThoiGian = p.tongThoiGian + filter[0].soNgay * 8;
        } else {
          p.ngayPhep = "--";
        }
        // tính thời gian thừa và thiếu
        if (p.tongThoiGian > 8) {
          p.overTime = (p.tongThoiGian - 8).toPrecision(2);
          p.lamThieu = 0;
        } else {
          p.lamThieu = (8 - p.tongThoiGian).toPrecision(2);
          p.overTime = 0;
        }
        //quan ly
        if (quanLy) {
          p.idQuanLy = quanLy.username;
          p.nameQuanLy = quanLy.name;
        }
      });

      if (phienActive === null) {
        return res.json(listEndPhien);
      }
      // lọc ra đang làm
      listEndPhien.map((p) => {
        if (p._id === moment(phienActive.ngay).format("DD/MM/YYYY")) {
          p._id = moment(phienActive.ngay).format("DD/MM/YYYY");
          p.startTime = phienActive.startTime;
          p.endTime = null;
          p.tongThoiGian = null;
          p.active = true;
          p.lamThieu = null;
          p.overTime = null;
        }
      });
      return res.json([...listEndPhien]);
    } catch (error) {
      return res.json(error);
    }
  }

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
})();
