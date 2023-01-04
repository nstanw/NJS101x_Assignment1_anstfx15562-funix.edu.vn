import http from "../httpService";

class PhienLamViecService {

    public async getActive() {
        let result = await  http.get("/phienLamViec/getActive");
        return result.data;
    }

    public async addPhienLamViec(noiLam: string) {
        let result = await  http.post("/phienLamViec/addPhienLamViec",{noiLam: noiLam});
        return result.data;
    }
   
    public async ketThucPhienLamViec() {
        console.log(process.env.REACT_APP_REMOTE_SERVICE_BASE_URL);
        let result = await  http.patch("/phienLamViec/ketThucPhienLamViec");
        return result.data;
    }

}
export default new PhienLamViecService();