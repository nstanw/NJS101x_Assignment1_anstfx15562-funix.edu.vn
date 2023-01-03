import phienLamViecModel from "../Models/phienLamViecModel";
import { getHouseBetweenTwoDate } from "../util/getHouseBetweenTwoDate";

interface IPhienLamViec {
  name: string;
  batDau: Date;
  ketThuc: Date;
  active: boolean;
  noiLam: string;
  thoiGianLam: Number
}

interface INghiPhep {
  annualLeave: number;
}

export default new (class PhienLamViec {
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
        return res.status(200).json(savePhien)

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
      return res.status(400).json({
        error:
          "Hiện tại chưa có phiên làm việc nào đang diễn ra. Không thể kết thúc",
      });
    }
    //thay dổi trạng thái
    try {
      let thoiGianLam = getHouseBetweenTwoDate(Date.now(), phienActive.batDau.getTime())
      let setThoiGianKetThuc = {
        ketThuc: new Date(Date.now()),
        thoiGianLam: thoiGianLam,
        active: false,
      }
      let phienKetThuc = await phienLamViecModel.findOneAndUpdate(
        { active: true },
        setThoiGianKetThuc,
        { returnDocument: "after" }
      );

      console.log("thoiGianLam", thoiGianLam);
      console.log("phienKetThuc", phienKetThuc);

      // let listPhienLamViecHomNay = await phienLamViecModel.find({});
      // console.log(listPhienLamViecHomNay);
      // tinh thời gian làm mỗi phiên

      // tra ve
      res.status(200).json(phienKetThuc);
    } catch (error) {
      console.log(error);
    }
  }
})();
