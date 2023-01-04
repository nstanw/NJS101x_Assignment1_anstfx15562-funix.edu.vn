import covidModel from "../Models/covidModel";


export default new class CovidController {

    // patch
    async dangKiThongTinThanNhiet(req, res, next) {
        try {
            let dangKiThongTinThanNhiet = await covidModel.findOneAndUpdate(
                { name: "admin" },
                {
                    ngayGioDangKiThanNhiet: req.body.ngayGioDangKiThanNhiet,
                    nhietDo: req.body.nhietDo,
                },
                { returnDocument: "after", upsert: true })
            console.log(dangKiThongTinThanNhiet);
            return res.status(200).json(dangKiThongTinThanNhiet);
        } catch (error) {
            return res.status(400).json(error);
        }
    }
    // patch
    async dangKiThongTinVaccin(req, res, next) {
        try {
            let dangKiThongTinVaccin = await covidModel.findOneAndUpdate(
                { name: "admin" },
                {
                    ngayTiemVaccine1: req.body.ngayTiemVaccine1,
                    tenVaccine1: req.body.tenVaccine1,
                    ngayTiemVaccine2: req.body.ngayTiemVaccine2,
                    tenVaccine2: req.body.tenVaccine2,
                },
                { returnDocument: "after", upsert: true })
            console.log(dangKiThongTinVaccin);
            return res.status(200).json(dangKiThongTinVaccin);
        } catch (error) {
            return res.status(400).json(error);
        }

    }

    // patch
    async dangKiDuongTinhCovid(req, res, next) {
        try {
            let dangKiDuongTinhCovid = await covidModel.findOneAndUpdate(
                { name: "admin" },
                {
                    duongTinh: req.body.duongTinh,
                    ngayKhaiBaoCovid: req.body.ngayKhaiBaoCovid
                },
                { returnDocument: "after", upsert: true })
            console.log(dangKiDuongTinhCovid);
            return res.status(200).json(dangKiDuongTinhCovid);
        } catch (error) {
            return res.status(400).json(error);
        }
    }
}