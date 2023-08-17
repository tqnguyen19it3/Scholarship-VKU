const mongoose = require('mongoose');

const CSIInfoSchema = new mongoose.Schema({
  address: String,
  email: String,
  phoneNumber: String,
  workingHours: String,
  workingDates: String,
  maps: String,
  footerContent: String
});

const CSIInfo = mongoose.model('CSInterfaceInfo', CSIInfoSchema);

module.exports = CSIInfo;