import isAuth from "../config/isAuth";
import nghiPhepController from "../Controllers/nghiPhepController";

function Router(app) {
  app.get("/nghiPhep/getThongTinNghiPhepNV", isAuth.isAuth, nghiPhepController.getThongTinNghiPhepNV)
  app.get("/nghiPhep/getNgayPhepConLai",isAuth.isAuth,  nghiPhepController.getNgayPhepConLai)
  app.patch("/nghiPhep/dangKiNghiPhep",isAuth.isAuth,  nghiPhepController.dangKiNghiPhep)
}

module.exports = Router;
