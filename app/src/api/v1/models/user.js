const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseDelete = require('mongoose-delete');

const userSchema = new Schema({
    name: { type: String, required: true, minLength: 6, maxLength: 24 },
    email: { type: String, required: true, unique: true },
    password: { type: String, minLength: 6 },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    role: { type: String, default: 'Regular' },
    phoneNumber: { type: String },
    dob: { type: Date},
    gender: { type: String },
    address: { type: String },
    company: { type: String },
    avatar: { type: String }
}, { timestamps: true });

//add plugins
userSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: true });

module.exports = mongoose.model('User', userSchema);