import nghiPhepModel from "../Models/nghiPhepModel";

export default new class {

    async getNgayPhepConLai(req, res, next) {
        try {

            let phepConLai = await nghiPhepModel.findOneAndUpdate({ name: "admin" }, { name: "admin" }, { upsert: true });
            console.log(phepConLai);
            return res.json({ phepConLai, soNgayPhepConLai: phepConLai.soNgayPhepConLai || 12 })
        } catch (err) {
            return res.json(err)
        }

    }
    async dangKiNghiPhep(req, res, next) {
        try {
            let dangKiThongTinThanNhiet = await nghiPhepModel.findOneAndUpdate(
                { name: "admin" },
                {
                    ngayDangKiPhep: req.body.ngayDangKiPhep as [],
                    soGioNghi: req.body.soGioNghi,
                    lyDo: req.body.lyDo,
                },
                { returnDocument: "after", upsert: true })
            console.log(dangKiThongTinThanNhiet);
            return res.status(200).json(dangKiThongTinThanNhiet);
        } catch (error) {
            return res.status(400).json(error);
        }

    }
}