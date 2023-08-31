const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseDelete = require('mongoose-delete');

const candidateSchema = new Schema({
    scholarshipId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Scholarship',
        required: true
    },
    name: { type: String, required: true, minLength: 6, maxLength: 24 },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    dob: { type: Date, required: true},
    gender: { type: String, required: true},
    avatar: { type: String, required: true },
    document: { type: String, required: true },
    moreInfo: { type: String },
    isApproved: { type: String, default: 'pending' }
}, { timestamps: true });

//add plugins
candidateSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: true });

module.exports = mongoose.model('Candidate', candidateSchema);