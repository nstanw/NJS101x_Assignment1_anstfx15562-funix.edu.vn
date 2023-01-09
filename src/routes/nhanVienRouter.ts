import isAuth from "../config/isAuth";
import covidController from "../Controllers/covidController";
import nhanVienController from "../Controllers/nhanVienController";

function Router(app) {

  app.get("/getNhanVien",  nhanVienController.getNhanVien)
  app.post("/addNhanVien",  nhanVienController.addNhanVien)
  app.patch("/editLinkImage",  nhanVienController.editLinkImage)

  // covid
  app.patch("/covid/dangKiThongTinThanNhiet",  covidController.dangKiThongTinThanNhiet)
  app.patch("/covid/dangKiThongTinVaccin",  covidController.dangKiThongTinVaccin)
  app.patch("/covid/dangKiDuongTinhCovid",  covidController.dangKiDuongTinhCovid)

}

module.exports = Router;
