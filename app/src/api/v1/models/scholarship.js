const mongoose = require('mongoose')
const Schema = mongoose.Schema
const slug = require('mongoose-slug-updater');
const mongooseDelete = require('mongoose-delete');
const mongoosePaginate = require('mongoose-paginate-v2');

const humanityFundSchema = new Schema({
    name: { type: String },
    slug: { type: String, slug: 'name', unique: true },
    image: { type: String },
    status: { type: String },
    description: {
        type: String,
        required: true
    },
    content: { 
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    requirements: [String],
    start_deadline: {
        type: Date,
        required: true
    },
    end_deadline: {
        type: Date,
        required: true
    },
    provider: [String]
}, { timestamps: true });

//add plugins
humanityFundSchema.plugin(slug);
humanityFundSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: true });
humanityFundSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Scholarship', humanityFundSchema)