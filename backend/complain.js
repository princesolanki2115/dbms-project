import express from 'express';
import cors from 'cors';
import db from './userdb.js';
const router=express.Router()
const app=express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

router.post('/complain',(req,res)=>{
    const {uploadData}=req.body
    console.log(uploadData)
})

export default router;