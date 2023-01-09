import quanLyController from "../Controllers/quanLyController";

function Router(app) {
  app.get("/quanLy/getNhanVienMinhQuanLy", quanLyController.getNhanVienMinhQuanLy);
  app.patch("/quanLy/thayDoiThongTin", quanLyController.thayDoiThongTin);
}

module.exports = Router;
