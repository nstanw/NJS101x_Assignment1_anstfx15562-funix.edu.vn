import userController from "../Controllers/userController";
import nghiPhepController from "../Controllers/nghiPhepController";
import phienLamViecController from "../Controllers/phienLamViecController";

function Router(app) {
  app.get("/phienLamViec/getAll", userController.protect, phienLamViecController.getAll);
  app.get("/phienLamViec/phienHienTai", userController.protect, phienLamViecController.phienHienTai);
  app.post("/phienLamViec/diemDanh", userController.protect, phienLamViecController.diemDanh);
  app.patch("/phienLamViec/ketThucPhienLamViec", userController.protect, phienLamViecController.ketThucPhienLamViec);
  // dang ki phep
  app.get("/nghiPhep/getThongTinNghiPhepNV", userController.protect, nghiPhepController.getThongTinNghiPhepNV);
  // app.get("/nghiPhep/getNgayPhepConLai", userController.protect, nghiPhepController.getNgayPhepConLai);
  // app.post("/nghiPhep/dangKiNghiPhep", userController.protect, nghiPhepController.dangKiNghiPhep);
}

module.exports = Router;
