import mongoose from 'mongoose';
const { Schema } = mongoose;

const nghiPhepSchema = new Schema({
    name: String,
    ngayDangKiPhep: Array,
    soNgayPhepConLai: Number,
    lyDo: String,
});

export default mongoose.model("nghiPhep", nghiPhepSchema);
