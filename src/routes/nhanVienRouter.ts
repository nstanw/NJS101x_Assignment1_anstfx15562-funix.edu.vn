import authController from "../Controllers/userController";
import covidController from "../Controllers/covidController";
import nhanVienController from "../Controllers/nhanVienController";

function Router(app) {

  app.get("/getNhanVien",authController.protect, nhanVienController.getNhanVien)
  app.post("/addNhanVien", nhanVienController.addNhanVien)
  app.patch("/editLinkImage", nhanVienController.editLinkImage)

  // covid
  app.patch("/covid/dangKiThongTinThanNhiet", covidController.dangKiThongTinThanNhiet)
  app.patch("/covid/dangKiThongTinVaccin", covidController.dangKiThongTinVaccin)
  app.patch("/covid/dangKiDuongTinhCovid", covidController.dangKiDuongTinhCovid)


  app.get("/xacthuc", authController.xacThuc )

}

module.exports = Router;
