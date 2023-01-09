import isAuth from "../config/isAuth";
import nghiPhepController from "../Controllers/nghiPhepController";

function Router(app) {
  app.get("/nghiPhep/getThongTinNghiPhepNV",  nghiPhepController.getThongTinNghiPhepNV)
  app.get("/nghiPhep/getNgayPhepConLai",  nghiPhepController.getNgayPhepConLai)
  app.patch("/nghiPhep/dangKiNghiPhep",  nghiPhepController.dangKiNghiPhep)
}

module.exports = Router;
