import http from "./httpService";

class PhienLamViecService {

    public async getActive() {
        let result = await  http.get("/phienLamViec/getActive");
        return result.data;
    }
    public async traCuuThongTinGioLamCongTy() {
        let result = await  http.get("/phienLamViec/traCuuThongTinGioLamCongTy");
        return result.data;
    }
  
    public async traCuuThongTinGioLamNhanVien(idNhanVien: string) {
        let result = await  http.get("/phienLamViec/traCuuThongTinGioLamNhanVien", { params: { idNhanVien: idNhanVien } });
        return result.data;
    }

    public async addPhienLamViec(noiLam: string) {
        let result = await  http.post("/phienLamViec/addPhienLamViec",{noiLam: noiLam});
        return result.data;
    }
   
    public async ketThucPhienLamViec() {
        let result = await  http.patch("/phienLamViec/ketThucPhienLamViec");
        return result.data;
    }
  
    public async getLuongTheoThang(thang: number) {
        let result = await  http.get("/phienLamViec/getLuongTheoThang", { params: { thang: thang } });
        return result.data;
    }

}
export default new PhienLamViecService();