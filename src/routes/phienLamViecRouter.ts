import nghiPhepController from "../Controllers/nghiPhepController";
import phienLamViecController from "../Controllers/phienLamViecController";

function Router(app) {
  app.get("/phienLamViec/getActive", phienLamViecController.getActive)
  app.post("/phienLamViec/addPhienLamViec", phienLamViecController.addPhienLamViec)
  app.patch("/phienLamViec/ketThucPhienLamViec", phienLamViecController.ketThucPhienLamViec)
  app.get("/phienLamViec/traCuuThongTinGioLamCongTy", phienLamViecController.traCuuThongTinGioLamCongTy)

  // dang ki phep
  app.get("/nghiPhep/getNgayPhepConLai", nghiPhepController.getNgayPhepConLai)
  app.patch("/nghiPhep/dangKiNghiPhep", nghiPhepController.dangKiNghiPhep)
}

module.exports = Router;
