const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const nhanVien = new Schema({
    mail: { type: String },
    name: { type: String, maxLength: 255, },
    bio: { type: String, maxLength: 255, },
    date: { type: Date, default: Date.now },
    image: { type: String },
    workStatus: { type: Boolean, default: false },
    sumTime: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
}, { timestamps: true });

const nhanVienModel = mongoose.model('nhanVien', nhanVien);
export = nhanVienModel;