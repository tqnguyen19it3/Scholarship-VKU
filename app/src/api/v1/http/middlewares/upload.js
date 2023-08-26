const path = require('path');
const multer = require('multer');

//upload image for announcements
const announcementsStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "app/src/public/uploads/announcements");
  },
  filename: function (req, file, cb) {
    const ext = file.originalname;
    const fileName = Date.now() + "_" + ext;
    cb(null, fileName);
  },
});

const announcementsUpload = multer({
  storage: announcementsStorage,
  fileFilter: function (req, file, cb) {
    if (
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/gif"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only jpg, jpeg, png Image File Supported!"), false);
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 2,
  },
});

//upload image for scholarship
const scholarshipStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "app/src/public/uploads/scholarships");
  },
  filename: function (req, file, cb) {
    const ext = file.originalname;
    const fileName = Date.now() + "_" + ext;
    cb(null, fileName);
  },
});

const scholarshipUpload = multer({
  storage: scholarshipStorage,
  fileFilter: function (req, file, cb) {
    if (
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/gif"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only jpg, jpeg, png Image File Supported!"), false);
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 2,
  },
});

const memberAvatarStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "app/src/public/uploads/member/avatar");
  },
  filename: function (req, file, cb) {
    const ext = file.originalname;
    const fileName = Date.now() + "_" + ext;
    cb(null, fileName);
  },
});

const memberAvatarUpload = multer({
  storage: memberAvatarStorage,
  fileFilter: function (req, file, cb) {
    if (
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/gif"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only jpg, jpeg, png Image File Supported!"), false);
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 2,
  },
});

module.exports = {
  announcementsUpload,
  scholarshipUpload,
  memberAvatarUpload
};
