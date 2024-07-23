// user register login signout routes
const express=require('express');
const router=express.Router();
router.get('/',(req,res,next)=>{
    console.log('This always runs');
    next();
});

module.exports = router;