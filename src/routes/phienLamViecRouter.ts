import isAuth from "../config/isAuth";
import phienLamViecController from "../Controllers/phienLamViecController";

function Router(app) {
  app.get("/phienLamViec/getActive", phienLamViecController.getActive)
  app.post("/phienLamViec/addPhienLamViec", phienLamViecController.addPhienLamViec)
  app.patch("/phienLamViec/ketThucPhienLamViec", phienLamViecController.ketThucPhienLamViec)
  
  app.get("/phienLamViec/traCuuThongTinGioLamCongTy",  phienLamViecController.traCuuThongTinGioLamCongTy)
  app.get("/phienLamViec/traCuuThongTinGioLamNhanVien",  phienLamViecController.traCuuThongTinGioLamNhanVien)
  app.get("/phienLamViec/getLuongTheoThang",  phienLamViecController.getLuongTheoThang)
}

module.exports = Router;
