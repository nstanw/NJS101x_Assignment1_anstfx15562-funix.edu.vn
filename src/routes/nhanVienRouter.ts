import isAuth from "../config/isAuth";
import covidController from "../Controllers/covidController";
import nhanVienController from "../Controllers/nhanVienController";

function Router(app) {

  app.get("/getNhanVien", isAuth.isAuth, nhanVienController.getNhanVien)
  app.post("/addNhanVien",isAuth.isAuth,  nhanVienController.addNhanVien)
  app.patch("/editLinkImage",isAuth.isAuth,  nhanVienController.editLinkImage)

  // covid
  app.patch("/covid/dangKiThongTinThanNhiet", isAuth.isAuth, covidController.dangKiThongTinThanNhiet)
  app.patch("/covid/dangKiThongTinVaccin", isAuth.isAuth, covidController.dangKiThongTinVaccin)
  app.patch("/covid/dangKiDuongTinhCovid", isAuth.isAuth, covidController.dangKiDuongTinhCovid)

}

module.exports = Router;
