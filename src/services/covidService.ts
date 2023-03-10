import http from "./httpService";

export interface IDangKiThongTinVaccineInput {
    ngayTiemVaccine1: Date;
    tenVaccine1: string;
    ngayTiemVaccine2: Date;
    tenVaccine2: string;
}

class CovidService {
    public async dangKiThongTinThanNhiet(dateTime: string, nhietDo: number) {
        let result = await http.patch("/covid/dangKiThongTinThanNhiet", { dateTime: dateTime, nhietDo: nhietDo, });
        return result.data;
    }

    public async dangKiThongTinVaccin(input: IDangKiThongTinVaccineInput) {
        let result = await http.patch("/covid/dangKiThongTinVaccin", input);
        return result.data;
    }

    public async dangKiDuongTinhCovid(duongTinh: boolean, ngayKhaiBaoCovid: Date) {
        let result = await http.patch("/covid/dangKiDuongTinhCovid", { duongTinh: duongTinh, ngayKhaiBaoCovid: ngayKhaiBaoCovid });
        return result.data;
    }

}
export default new CovidService();
