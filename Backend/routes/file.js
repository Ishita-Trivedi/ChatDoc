const express=require('express');
const router=express.Router();
const upload=require('../utils/multer');

router.post('/upload', upload.single('file'), function (req, res) {
    if (!req.file) {
        return res.status(400).send({ message: 'No file uploaded' });
    }
    // Process file here (e.g., save to database, extract text, etc.)
    console.log('File received:', req.file.originalname);
    console.log(req.file);
    
    // Example response for demonstration
    res.status(200).send({ message: 'File uploaded successfully' });
});
router.post('/delete',(req,res,next)=>{
   //delete file from database: all data related to file
   const fileName=req.body.fileName;
});
router.get('/ask',(req,res,next)=>{
    const question=req.body.question;
});
module.exports = router;