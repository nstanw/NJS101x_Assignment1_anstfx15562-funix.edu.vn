import nhanVienController from "../Controllers/nhanVienController";

function Router(app) {

  app.get("/getNhanVien", nhanVienController.getNhanVien)
  app.post("/addNhanVien", nhanVienController.addNhanVien)
  app.patch("/editLinkImage", nhanVienController.editLinkImage)

}

module.exports = Router;
