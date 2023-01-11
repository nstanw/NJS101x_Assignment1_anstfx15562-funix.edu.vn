import mongoose from 'mongoose';
const { Schema } = mongoose;

const covidSchema = new Schema({
    name: String,
    ngayGioDangKiThanNhiet: String,
    nhietDo: Number,
    ngayTiemVaccine1: Date,
    tenVaccine1: String,
    ngayTiemVaccine2: Date,
    tenVaccine2: String,
    ngayKhaiBaoCovid: Date,
    duongTinh: Boolean,
});

export default mongoose.model("covid", covidSchema);
