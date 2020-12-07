const multer = require('multer')

// Define the maximum size for uploading 
// file i.e. 10 MB. it is optional 
const maxSize = 300 * 1000 * 1000;

const upload = multer({

    gc: multer.memoryStorage(),
    limits: {
        fileSize: maxSize
    },
    // fileFilter: function (req, file, cb){ 

    //     // Set the filetypes, it is optional 
    //     var filetypes = /wav/; 
    //     var mimetype = filetypes.test(file.mimetype); 

    //     var extname = filetypes.test(path.extname( 
    //                 file.originalname).toLowerCase()); 

    //     if (mimetype && extname) { 
    //         return cb(null, true); 
    //     } 

    //     cb("Error: File upload only supports the "
    //             + "following filetypes - " + filetypes); 
    //   }  
})


module.exports = upload