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
  app.get("/nghiPhep/getThongTinNghiPhepNV", userController.protect, nghiPhepController.getThongTinNghiPhepNV);
  app.get("/nghiPhep/getNgayPhepConLai", userController.protect, nghiPhepController.getNgayPhepConLai);
  app.post("/nghiPhep/dangKiNghiPhep", userController.protect, nghiPhepController.dangKiNghiPhep);
}

module.exports = Router;
