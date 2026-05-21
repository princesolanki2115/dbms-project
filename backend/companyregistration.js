import express from 'express';
import cors from 'cors';
import db from './userdb.js';
import bcrypt from 'bcrypt'
const router=express.Router()
const app=express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

router.post('/register',async(req,res)=>{
    const {formdata}=req.body
    console.log(formdata)


    const {
        companyName,
    companyType,
    industry,
    logo,
    establishedDate,
    email,
    phone,
    website,
    address,
    billingAddress,
    taxNumber,
    registrationNumber,
    authorizedPerson,
    documents,
    username,
    password,
    communicationMethod,
    }=formdata;


    
      const hashedPassword = await bcrypt.hash(password, 10);

  const insertSql = `
    INSERT INTO companies (
        companyName,
        companyType,
        industry,
        logo,
        establishedDate,
        email,
        phone,
        website,
        address,
        billingAddress,
        taxNumber,
        registrationNumber,
        authorizedPerson,
        documents,
        username,
        password,
        communicationMethod
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
  companyName,
  companyType,
  industry,
  logo || null,
  establishedDate,
  email,
  phone,
  website || null,
  address,
  billingAddress || null,
  taxNumber,
  registrationNumber,
  authorizedPerson,
  documents ? JSON.stringify(documents) : null,
  username,
  hashedPassword,
  communicationMethod || null,
];
console.log('a printed')

db.query(insertSql, values, (err, result) => {
  console.log('hh')
  if (err) {
    // 🔥 Duplicate email error
    if (err.code === "ER_DUP_ENTRY" || err.errno === 1062) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // 🔥 Any other SQL error
    console.error("Insert query error:", err);
    return res.status(500).json({ message: "Insert failed" });
  }

  // 🔥 Success
  console.log("User registered successfully");
  return res.status(200).json({ message: "User registered successfully" });
});
});


export default router;