const mongoose = require('mongoose')
const Schema = mongoose.Schema
const mongooseDelete = require('mongoose-delete');

const funFactSchema = new Schema({
    name: { type: String },
    statistics: { type: Number },
    status: { type: String },
}, { timestamps: true });

//add plugins
funFactSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: true });

module.exports = mongoose.model('FunFact', funFactSchema)