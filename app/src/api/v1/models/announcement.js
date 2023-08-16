const mongoose = require('mongoose')
const Schema = mongoose.Schema
const slug = require('mongoose-slug-updater');
const mongooseDelete = require('mongoose-delete');
const mongoosePaginate = require('mongoose-paginate-v2');

const announcementSchema = new Schema({
    name: { type: String },
    slug: { type: String, slug: 'name', unique: true },
    image: { type: String },
    status: { type: String },
    description: { type: String },
    content: { type: String }
}, { timestamps: true });

//add plugins
announcementSchema.plugin(slug);
announcementSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: true });
announcementSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Announcement', announcementSchema)