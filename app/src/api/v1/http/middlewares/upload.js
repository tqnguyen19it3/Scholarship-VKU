const path = require('path');
const multer = require('multer');

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

const storageCandidate = multer.diskStorage({
  destination: function (req, file, cb) {
    if (
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/gif"
    ) {
      cb(null, "app/src/public/uploads/candidates/avatar");
    } else if (
      file.mimetype === "application/msword" ||
      file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.mimetype === "application/pdf"
    ) {
      cb(null, "app/src/public/uploads/candidates/form");
    } else {
      cb(new Error("Unsupported file type"), null);
    }
  },
  filename: function (req, file, cb) {
    const ext = file.originalname;
    const fileName = Date.now() + "_" + ext;
    cb(null, fileName);
  },
});

const uploadCandidate = multer({
  storage: storageCandidate,
  limits: {
    fileSize: 1024 * 1024 * 10,
  },
});

// // Middleware cho trường avatar
// const uploadAvatarCandidate = multer({
//   storage: multer.diskStorage({
//     destination: function (req, file, cb) {
//       console.log("111", file);
//       if (
//         file.mimetype === "image/jpg" ||
//         file.mimetype === "image/jpeg" ||
//         file.mimetype === "image/png" ||
//         file.mimetype === "image/gif"
//       ) {
//         cb(null, "app/src/public/uploads/candidates/avatar");
//       } else {
//         cb(new Error("Unsupported file type"), null);
//       }
//     },
//     filename: function (req, file, cb) {
//       console.log("222",file);
//       const ext = file.originalname;
//       const fileName = Date.now() + "_" + ext;
//       cb(null, fileName);
//     },
//   }),
//   limits: {
//     fileSize: 1024 * 1024 * 2, // Giới hạn 2MB cho tệp tin ảnh
//   },
// });

// // Middleware cho trường document
// const uploadDocumentCandidate = multer({
//   storage: multer.diskStorage({
//     destination: function (req, file, cb) {
//       console.log("333",file);
//       if (
//         file.mimetype === "application/msword" ||
//         file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
//         file.mimetype === "application/pdf"
//       ) {
//         cb(null, "app/src/public/uploads/candidates/form");
//       } else {
//         cb(new Error("Unsupported file type"), null);
//       }
//     },
//     filename: function (req, file, cb) {
//       console.log("444",file);
//       const ext = file.originalname;
//       const fileName = Date.now() + "_" + ext;
//       cb(null, fileName);
//     },
//   }),
//   limits: {
//     fileSize: 1024 * 1024 * 10, // Giới hạn 10MB cho tệp tin tài liệu
//   },
// });


module.exports = {
  scholarshipUpload,
  memberAvatarUpload,
  uploadCandidate
};
