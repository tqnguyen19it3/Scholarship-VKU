const path = require('path');
const multer = require('multer');

//upload image
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'app/src/public/uploads/announcements');
    },
    filename: function (req, file, cb) {
        console.log("file ne: ", file);
        const ext = file.originalname;
        const fileName = Date.now() + "_" + ext;
        cb(null, fileName);
    },
});
  
const upload = multer({ 
    storage: storage,
    fileFilter: function(req, file, cb){
        if(file.mimetype === "image/jpg" || file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/gif"){
            cb(null, true);
        }else {
            cb(new Error('Only jpg, jpeg, png Image File Supported!'), false); 
        }
    },
    limits: {
        fileSize: 1024 * 1024 * 2
    }
});

module.exports = upload