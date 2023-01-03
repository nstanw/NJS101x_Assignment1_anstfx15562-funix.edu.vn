import mongoose from 'mongoose';
const { Schema } = mongoose;

const covidSchema = new Schema({
    name: String,
    ngayDangKiThanNhiet: Date,
    gioDangKiThanNhiet: Date,
    nhietDo: Number,
    ngayTiemVaccine1: Date,
    tenVaccine1: String,
    ngayTiemVaccine2: Date,
    tenVaccine2: String,
    duongTinh: Boolean,
});

export default mongoose.model("covid", covidSchema);
