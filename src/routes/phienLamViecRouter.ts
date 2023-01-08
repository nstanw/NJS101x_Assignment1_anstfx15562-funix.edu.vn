import isAuth from "../config/isAuth";
import nghiPhepController from "../Controllers/nghiPhepController";
import phienLamViecController from "../Controllers/phienLamViecController";

function Router(app) {
  app.get("/phienLamViec/getActive",isAuth.isAuth, phienLamViecController.getActive)
  app.post("/phienLamViec/addPhienLamViec",isAuth.isAuth,  phienLamViecController.addPhienLamViec)
  app.patch("/phienLamViec/ketThucPhienLamViec",isAuth.isAuth,  phienLamViecController.ketThucPhienLamViec)
  app.get("/phienLamViec/traCuuThongTinGioLamCongTy",isAuth.isAuth,  phienLamViecController.traCuuThongTinGioLamCongTy)
  app.get("/phienLamViec/getLuongTheoThang",isAuth.isAuth,  phienLamViecController.getLuongTheoThang)
}

module.exports = Router;
