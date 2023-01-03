import phienLamViecModel from "../Models/phienLamViecModel";
import { getHouseBetweenTwoDate } from "../util/getHouseBetweenTwoDate";

export default new (class PhienLamViec {
  async addPhienLamViec(req, res, next) {
    console.log(req.body);

    //kiểm tra data rỗng hay không. rỗng thì tạo mới
    let dataBase = (await phienLamViecModel.find({})) as [];
    //kiem tra actice. nếu đang hoạt động thì báo lỗi. line 40.
    let checkActive = await phienLamViecModel.findOne({ active: true });

    // nếu active = false và chưa có phiên sẽ thêm phiên làm mới
    let isCheckAddPhienLamViec: Boolean =
      checkActive === null || dataBase.length === 0;

    if (isCheckAddPhienLamViec) {
      let newPhien = new phienLamViecModel({
        idNhanVien: "admin",
        noiLam: req.body.noiLam,
        active: true,
        batDau: Date.now(),
        ketThuc: null,
      });
      try {
        let savePhien = await newPhien.save();
        console.log("Bắt đầu phiên làm: ", savePhien);
        return res.status(200).json({
          name: savePhien.idNhanVien,
          batDau: savePhien.batDau,
          noiLam: savePhien.noiLam,
          active: savePhien.active,
        });
      } catch (error) {
        return console.log(error);
      }
    }
    return res
      .status(400)
      .json({ err: "Đang trong phiên làm việc không thể điểm danh" });
  }

  async ketThucPhienLamViec(req, res, next) {
    console.log(req.body);

    let dataBase = (await phienLamViecModel.find({})) as [];
    if (dataBase.length === 0) {
      return res
        .status(400)
        .json({ error: "Hiện tại không có phiên làm việc nào" });
    }
    //kiem tra actice
    let checkActive = await phienLamViecModel.findOne({ active: true });
    if (checkActive === null) {
      return res.status(400).json({
        error:
          "Hiện tại chưa có phiên làm việc nào đang diễn ra. Không thể kết thúc",
      });
    }

    try {
      let phienKetThuc = await phienLamViecModel.findOneAndUpdate(
        { active: true },
        {
          active: false,
          ketThuc: Date.now(),
          //   thoiGianLam: getHouseBetweenTwoDate(),
        },
        { returnDocument: "after" }
      );

      phienKetThuc.thoiGianLam = getHouseBetweenTwoDate(phienKetThuc.ketThuc.getTime(), phienKetThuc.batDau.getTime());
      console.log(phienKetThuc.thoiGianLam);

      let listPhienLamViecHomNay = await phienLamViecModel.find({});
      console.log(listPhienLamViecHomNay);
      // tinh thời gian làm mỗi phiên

      // tra ve
      res.status(200).json(phienKetThuc);
    } catch (error) {
      console.log(error);
    }
  }
})();
