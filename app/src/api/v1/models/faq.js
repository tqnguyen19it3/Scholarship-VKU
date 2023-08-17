const mongoose = require('mongoose')
const Schema = mongoose.Schema
const mongooseDelete = require('mongoose-delete');

const faqSchema = new Schema({
    question: { type: String },
    answer: { type: String },
    status: { type: String },
}, { timestamps: true });

//add plugins
faqSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: true });

module.exports = mongoose.model('Faq', faqSchema)