import multer from 'multer'




const storage = multer.diskStorage({
    
    destination: function (req, file, cb) {
        console.log('here')
      cb(null, 'upload/')
      console.log('here')
    },
    filename: function (req, file, cb) {
      console.log('Incoming file:', file.originalname)
      cb(null, Date.now() + '.jpg') 
    }
  })
export const upload = multer({ storage: storage });