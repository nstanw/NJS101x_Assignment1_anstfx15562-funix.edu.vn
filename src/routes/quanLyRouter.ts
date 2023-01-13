import quanLyController from "../Controllers/quanLyConrtroller";
import userController from "../Controllers/userController";
function Router(app) {
  app.get("/quanLy/getNhanVienMinhQuanLy", userController.protect, quanLyController.getNhanVienMinhQuanLy);
  app.get("/quanLy/gioLamTrongThangCuaNhanVien", userController.protect, quanLyController.gioLamTrongThangCuaNhanVien);
  app.patch("/quanLy/thayDoiThongTin", userController.protect, quanLyController.thayDoiThongTin);

  app.delete("/quanLy/deleteGioLamKetThuc", userController.protect, quanLyController.deleteGioLamKetThuc);
}

module.exports = Router;
