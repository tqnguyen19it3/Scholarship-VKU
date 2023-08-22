const mongoose = require('mongoose')
const Schema = mongoose.Schema

const aboutUsSchema = new Schema({
    introduction: { type: String },
    missionStatementAndPurpose: { type: String },
    developmentJourney: { type: String }
}, { timestamps: true });


module.exports = mongoose.model('AboutUs', aboutUsSchema)