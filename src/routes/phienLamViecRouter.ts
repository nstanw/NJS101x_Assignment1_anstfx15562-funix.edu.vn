import userController from "../Controllers/userController";
import nghiPhepController from "../Controllers/nghiPhepController";
import phienLamViecController from "../Controllers/phienLamViecController";

function Router(app) {
  app.get("/phienLamViec/getAll", userController.protect, phienLamViecController.getAll);
  app.get("/phienLamViec/traCuuThongTinGioLamCongTy", userController.protect, phienLamViecController.traCuuThongTinGioLamCongTy);
  app.get("/phienLamViec/phienHienTai", userController.protect, phienLamViecController.phienHienTai);
  app.post("/phienLamViec/diemDanh", userController.protect, phienLamViecController.diemDanh);
  app.patch("/phienLamViec/ketThucPhienLamViec", userController.protect, phienLamViecController.ketThucPhienLamViec);
 
}

module.exports = Router;
