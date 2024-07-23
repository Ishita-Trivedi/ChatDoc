const express=require('express');
const router=express.Router();
router.post('/save',(req,res,next)=>{
    console.log('This always runs');
    next();
});
router.delete('/view',(req,res,next)=>{
    console.log('In another middleware');
    res.send('<h1>Hello from express</h1>');
});