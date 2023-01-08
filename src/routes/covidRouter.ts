import isAuth from "../config/isAuth";
import covidController from "../Controllers/covidController";

function Router(app) {
  app.patch("/covid/dangKiThongTinThanNhiet", isAuth.isAuth, covidController.dangKiThongTinThanNhiet);
  app.patch("/covid/dangKiThongTinVaccin", isAuth.isAuth, covidController.dangKiThongTinVaccin);
  app.patch("/covid/dangKiDuongTinhCovid", isAuth.isAuth, covidController.dangKiDuongTinhCovid);
}

module.exports = Router;
