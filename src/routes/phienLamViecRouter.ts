import userController from "../Controllers/userController";
import nghiPhepController from "../Controllers/nghiPhepController";
import phienLamViecController from "../Controllers/phienLamViecController";

function Router(app) {
  app.get("/phienLamViec/getActive", userController.protect, phienLamViecController.getActive);
  app.get("/phienLamViec/getPhienDangLam", userController.protect, phienLamViecController.getPhienDangLam);
  app.post("/phienLamViec/addPhienLamViec", userController.protect, phienLamViecController.addPhienLamViec);
  app.patch("/phienLamViec/ketThucPhienLamViec", userController.protect, phienLamViecController.ketThucPhienLamViec);
  app.get("/phienLamViec/traCuuThongTinGioLamCongTy", userController.protect, phienLamViecController.traCuuThongTinGioLamCongTy);
  app.get("/phienLamViec/getLuongTheoThang", userController.protect, phienLamViecController.getLuongTheoThang);

  // dang ki phep
  app.get("/nghiPhep/getThongTinNghiPhepNV", nghiPhepController.getThongTinNghiPhepNV);
  app.get("/nghiPhep/getNgayPhepConLai", nghiPhepController.getNgayPhepConLai);
  app.patch("/nghiPhep/dangKiNghiPhep", nghiPhepController.dangKiNghiPhep);
}

module.exports = Router;
