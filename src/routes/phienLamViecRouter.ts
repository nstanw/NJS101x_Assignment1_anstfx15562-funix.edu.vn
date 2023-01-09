import isAuth from "../config/isAuth";
import phienLamViecController from "../Controllers/phienLamViecController";

function Router(app) {
  app.get("/phienLamViec/getActive",isAuth.isAuthenticated, phienLamViecController.getActive)
  app.post("/phienLamViec/addPhienLamViec",isAuth.isAuth,  phienLamViecController.addPhienLamViec)
  app.patch("/phienLamViec/ketThucPhienLamViec",isAuth.isAuth,  phienLamViecController.ketThucPhienLamViec)
  app.get("/phienLamViec/traCuuThongTinGioLamCongTy",  phienLamViecController.traCuuThongTinGioLamCongTy)
  app.get("/phienLamViec/traCuuThongTinGioLamNhanVien",  phienLamViecController.traCuuThongTinGioLamNhanVien)
  app.get("/phienLamViec/getLuongTheoThang",  phienLamViecController.getLuongTheoThang)
}

module.exports = Router;
