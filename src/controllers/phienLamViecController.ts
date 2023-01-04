import phienLamViecModel from "../Models/phienLamViecModel";
import { getHouseBetweenTwoDate } from "../util/getHouseBetweenTwoDate";

interface IPhienLamViec {
  name: String | null;
  noiLam: String | null;
  active: Boolean;
  batDau: Date | null;
  ketThuc?: Date | null;
  thoiGianLam?: Number | null;
}
type PhienLamViecDto = IPhienLamViec[];

export default new (class PhienLamViec {
  //GET active
  async getActive(req, res) {

    let checkActive = await phienLamViecModel.findOne({ active: true });
    if (checkActive === null) {
      let result: PhienLamViecDto = [
        {
          name: null,
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

    //kiểm tra data rỗng hay không. rỗng thì tạo mới
    let dataBase = (await phienLamViecModel.find({})) as [];

    //kiem tra actice. nếu đang hoạt động thì báo lỗi. line 40.
    let checkActive = await phienLamViecModel.findOne({ active: true });

    // nếu active = false và chưa có phiên sẽ thêm phiên làm mới
    let isCheckAddPhienLamViec: Boolean =
      checkActive === null || dataBase.length === 0;
    if (isCheckAddPhienLamViec) {
      let newPhien = new phienLamViecModel({
        name: "admin",
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
    return res
      .status(400)
      .json({ err: "Đang trong phiên làm việc không thể điểm danh" });
  }
  // PATCH Kết thúc phiên làm việc
  async ketThucPhienLamViec(req, res, next) {
    // kiểm tra trong list phiên có phiên nào không. nếu trống thông báo lỗi
    let dataBase = (await phienLamViecModel.find({})) as [];
    if (dataBase.length === 0) {
      return res
        .status(400)
        .json({ error: "Hiện tại không có phiên làm việc nào" });
    }
    //kiem tra người dùng đang trong phiên không
    let phienActive = await phienLamViecModel.findOne({ active: true });
    if (phienActive === null) {
      return res.json({
        error:
          "Hiện tại chưa có phiên làm việc nào đang diễn ra. Không thể kết thúc",
      });
    }
    //thay dổi trạng thái
    try {
      let thoiGianLam = getHouseBetweenTwoDate(
        Date.now(),
        phienActive.batDau.getTime()
      );
      let setThoiGianKetThuc = {
        ketThuc: new Date(Date.now()),
        thoiGianLam: thoiGianLam,
        active: false,
      };

      //update thời gian kết thúc và tính thời gian đã làm
      await phienLamViecModel.findOneAndUpdate(
        { active: true },
        setThoiGianKetThuc,
        { returnDocument: "after" }
      );

      let listPhienLamViecHomNay = await phienLamViecModel.find({});
      console.log(listPhienLamViecHomNay);

      res.status(200).json(listPhienLamViecHomNay);
    } catch (error) {
      console.log(error);
    }
  }
  //POST đăng kí nghỉ phép
  /**
   * input:
   * chọn ngày nghỉ : Date[],
   * lý do: string
   * chọn số giờ sẽ nghỉ: <8/ ngày, < số ngày phép còn lại
   *
   * output:
   * số ngày phép còn lại
   *
   */
  //GET danh sach gio đã làm ở công ty
  async traCuuThongTinGioLamCongTy(req, res) {
    try {
      let listGioLamCongTy = await phienLamViecModel.find({
        noiLam: "Công Ty",
      });

      let result = listGioLamCongTy.map((phien) => ({
        ngay: new Date().toLocaleString().split(",")[0],
        noiLam: phien.noiLam,
        ngayDangKiPhep: [],
        gioBatDau: phien.batDau,
        gioKetThuc: phien.ketThuc,
        tongGioLam: phien.thoiGianLam,
      }));
      console.log(result);
      return res.json(result);
    } catch (error) {
      return res.json(new Error(error));
    }
  }
})();
