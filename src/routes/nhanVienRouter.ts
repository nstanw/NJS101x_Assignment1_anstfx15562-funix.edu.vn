import authController from "../Controllers/userController";
import covidController from "../Controllers/covidController";
import nhanVienController from "../Controllers/nhanVienController";
import userController from "../Controllers/userController";

function Router(app) {
  app.get("/getNhanVien", userController.protect, nhanVienController.getNhanVien);
  app.patch("/editLinkImage", userController.protect, nhanVienController.editLinkImage);

  // covid
  app.patch("/covid/dangKiThongTinThanNhiet", covidController.dangKiThongTinThanNhiet);
  app.patch("/covid/dangKiThongTinVaccin", covidController.dangKiThongTinVaccin);
  app.patch("/covid/dangKiDuongTinhCovid", covidController.dangKiDuongTinhCovid);

  app.get("/xacthuc", authController.xacThuc);
}

module.exports = Router;
