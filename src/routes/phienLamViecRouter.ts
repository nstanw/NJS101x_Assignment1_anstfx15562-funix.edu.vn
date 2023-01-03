import nghiPhepController from "../Controllers/nghiPhepController";
import phienLamViecController from "../Controllers/phienLamViecController";

function Router(app) {
  app.post("/addPhienLamViec", phienLamViecController.addPhienLamViec)
  app.patch("/ketThucPhienLamViec", phienLamViecController.ketThucPhienLamViec)
  app.get("/traCuuThongTinGioLamCongTy", phienLamViecController.traCuuThongTinGioLamCongTy)

  // dang ki phep
  app.get("/getNgayPhepConLai", nghiPhepController.getNgayPhepConLai)
  app.patch("/dangKiNghiPhep", nghiPhepController.dangKiNghiPhep)
}

module.exports = Router;
