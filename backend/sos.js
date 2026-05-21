import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer'
const router=express.Router()
const app=express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

router.post('/sos',async(req,res)=>{
    const {latitude,longitude,time}=req.body
    console.log('latitude '+latitude, 'longitude '+longitude + 'time' + time);

    try {
           
          
           const transporter = nodemailer.createTransport({
             service: "gmail", 
             auth: {
               user: 'namanmalviya234@gmail.com',
               pass: 'tbmf tcpq fifo skqs',
             },
           });
       
           
           const mailOptions = {
             from:'namanmalviya234@gmail.com',
             to: 'namanmalviya230757@acropolis.in',
             subject:'Warning: SOS Alert Received',
             text:'sos alert recived from user123 from latitude: ' + latitude +'\n and Longitude: ' + longitude + 'on time: '+ time+ ' \n regards\n Team Unnati',
           };
       
          
           await transporter.sendMail(mailOptions);
       
           
         }catch(err){
            console.log(err)
         }
})

export default router;