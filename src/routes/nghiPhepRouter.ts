import userController from "../Controllers/userController";
import nghiPhepController from "../Controllers/nghiPhepController";

function Router(app) {

    app.get("/nghiPhep/getThongTinNghiPhepNV", userController.protect, nghiPhepController.getThongTinNghiPhepNV);
    app.post("/nghiPhep/dangKiNghiPhep", userController.protect, nghiPhepController.dangKiNghiPhep);

}

module.exports = Router;