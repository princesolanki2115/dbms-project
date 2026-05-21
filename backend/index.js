import express from 'express'
import cors from 'cors'
import axios from 'axios'
import db from './userdb.js'
import companyregistration from './companyregistration.js'
import nodemailer from 'nodemailer'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import sos from './sos.js'
import posts from './posts.js'
import complain from './complain.js'
import mysql from 'mysql2/promise';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(cors())

app.get('/',(req,res)=>{
    res.send('hhh')
})

app.post('/signup', async (req, res) => {
  const { email, pasword, codeToSend, confirmpassword, name } = req.body;
  console.log('signup body:', { email, pasword, codeToSend, confirmpassword, name });

  // 1️⃣ Basic validation
  if (!email || !pasword || !name) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  if (pasword !== confirmpassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    // 2️⃣ Hash password securely before saving
    const hashedPassword = await bcrypt.hash(pasword, 10);

    // 3️⃣ Send verification email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'namanmalviya234@gmail.com',
        pass: 'tbmf tcpq fifo skqs', // ⚠️ Move this to .env for security
      },
    });

    const mailOptions = {
      from: 'namanmalviya234@gmail.com',
      to: email,
      subject: `Hello ${name}`,
      text:
        `Thank you for signing up on Unnati.ai\n\n` +
        `Your signup code is: ${codeToSend}\n` +
        `Use this code to complete your signup process.\n\nRegards,\nTeam Unnati`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);

    // 4️⃣ Insert user into database
    const insertSql = `
      INSERT INTO signup_users (name, email, pasword, confirmpassword)
      VALUES (?, ?, ?, ?)
    `;

    // ⚠️ Make sure your MySQL column is named `password` not `pasword`
    const [result] = await db.query(insertSql, [name, email, hashedPassword, confirmpassword]);

    return res.status(201).json({ message: `User registered successfully: ${name}` });

  } catch (err) {
    console.error('Signup error:', err);
if (
  err.code === 'ER_DUP_ENTRY' ||
  (err.message && err.message.includes('Duplicate entry'))
) {
  return res.status(400).json({ message: 'Email already exists' });
}

    return res.status(500).json({ message: 'Error saving user' });
  }
});



app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login body:", { email, password });

    if (!email || !password) {
      return res.status(400).json({ message: "Missing email or password" });
    }

    // 1️⃣ Check in signup_users first
    const [userRows] = await db.query("SELECT * FROM signup_users WHERE email = ?", [email]);

    if (userRows.length > 0) {
      const user = userRows[0];
       // console.log(user.id)
      const isMatch = await bcrypt.compare(password, user.pasword);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid password" });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: "user",islogin: false },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
      );
console.log("token",token)
      return res.status(200).json({
        success: true,
        message: "User Login successful",
        role: "user",
        token,
        user: { id: user.id, name: user.name, email: user.email,islogin:true },
      });
    }

    // 2️⃣ If not found, check in register_company table
    const [companyRows] = await db.query("SELECT * FROM companies WHERE email = ?", [email]);

    if (companyRows.length > 0) {
      const company = companyRows[0];
     
      // const isMatch = await bcrypt.compare(password, company.password);
      //  console.log(isMatch)
      // if (!isMatch) {
      //   return res.status(401).json({ message: "Invalid password" });
      // }

      const token = jwt.sign(
        { id: company.id, email: company.email, role: "company" },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
      );

      return res.status(200).json({
        success: true,
        message: "Company login successful",
        role: "company",
        token,
       company: { id: company.id, email: company.email, company_name: company.company_name }

      });
      console.log(company)
    }

    // 3️⃣ No record found in either table
    return res.status(404).json({
      success: false,
      message: `No account found for ${email}`,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Database error" });
  }
});






app.post("/form", (req, res) => {
  const formdata = req.body;
  console.log("Received formdata:", formdata);

  if (!formdata || Object.keys(formdata).length === 0) {
    return res.status(400).json({ message: "No form data received" });
  }

  const {
    full_name='s',
    dob = "2000-05-05", // ✅ use MySQL-friendly format
    gender,
    contact_number,
    email='s@k',
    emergency_contact,
    start_date = "2023-11-11", // ✅ same here
    employment_type,
    work_mode,
    working_hours,
    schedule_constraints,
    pan,
    id_number,
    non_compete,
    confidentiality,
    skills,
    certifications,
    languages,
    previous_experience,
    hobbies,
    additional_info,
  } = formdata;
  

  try{

  const insertSql = `
    INSERT INTO job_users (
      full_name, dob, gender, contact_number, email, emergency_contact,
      start_date, employment_type, work_mode, working_hours, schedule_constraints,
      pan, id_number, non_compete, confidentiality, skills, certifications,
      languages, previous_experience, hobbies, additional_info
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    full_name,
    dob,
    gender,
    contact_number,
    email,
    emergency_contact,
    start_date,
    employment_type,
    work_mode,
    working_hours,
    schedule_constraints,
    pan,
    id_number,
    non_compete ? 1 : 0,
    confidentiality ? 1 : 0,
    skills,
    certifications,
    languages,
    previous_experience,
    hobbies,
    additional_info,
  ];

  console.log('sd')

  db.query(insertSql, values, (err, result) => {
	console.log('ddd')
   

    console.log("User registered successfully");
    return res.status(200).json({ message: "User registered successfully" });
  });
}catch(err){
	console.log('dddd')
            if (err) {
      // ✅ Check for duplicate email safely
      if (err.code === "ER_DUP_ENTRY") {
        console.log("Duplicate entry for email:", email);
        return res.status(400).json({ message: "Email already exists" });
      }

      console.error("Insert query error:", err);
      return res.status(500).json({ message: "Insert failed" });
    }
}
});

app.put("/applied-jobs/:userId", async (req, res) => {
 // const { userId, jobId } = req.params;
 const {form}=req.body
 console.log(form)
  const {
    id,
    full_name,
    dob,
    gender,
    contact_number,
    email,
    address,
    emergency_contact,
    start_date,
    employment_type,
    work_mode,
    working_hours,
    schedule_constraints,
    pan,
    id_number,
    non_compete,
    confidentiality,
    skills,
    certifications,
    languages,
    previous_experience,
    hobbies,
    additional_info,
  } = req.body;

  try {
    // Update only the application for that user and job
    const [result] = await db.query(
      `
      UPDATE job_users
      SET
        full_name = ?,
        dob = ?,
        gender = ?,
        contact_number = ?,
        email = ?,
        address = ?,
        emergency_contact = ?,
        start_date = ?,
        employment_type = ?,
        work_mode = ?,
        working_hours = ?,
        schedule_constraints = ?,
        pan = ?,
        id_number = ?,
        non_compete = ?,
        confidentiality = ?,
        skills = ?,
        certifications = ?,
        languages = ?,
        previous_experience = ?,
        hobbies = ?,
        additional_info = ?
      WHERE id=?
      `,
      [
        full_name,
        dob,
        gender,
        contact_number,
        email,
        address,
        emergency_contact,
        start_date,
        employment_type,
        work_mode,
        working_hours,
        schedule_constraints,
        pan,
        id_number,
        non_compete,
        confidentiality,
        skills,
        certifications,
        languages,
        previous_experience,
        hobbies,
        additional_info,
        id,
        
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json({ message: "Application updated successfully" });
  } catch (err) {
    console.error("Error updating application:", err);
    res.status(500).json({ message: "Error updating application", error: err });
  }
});

app.post("/apply", async (req, res) => {
  const { userId, jobId } = req.body;

  try {
    await db.query(
      "INSERT INTO applied_jobs (user_id, job_id) VALUES (?, ?)",
      [userId, jobId]
    );

    res.json({ message: "Application submitted successfully!" });
  } catch (err) {
    console.error("Error applying to job:", err);
    res.status(500).json({ message: "Failed to apply" });
  }
});


// GET all applied jobs for a specific user
app.get("/applied-jobs/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // Adjust 'job_id' or 'post_id' depending on your DB column name
    const [rows] = await db.query(
      `SELECT 
          p.id, 
          p.title, 
          p.organizer, 
          p.location, 
          p.startDate, 
          p.endDate,
          p.category,
          p.type,
          p.mode
       FROM applied_jobs a
       JOIN posts p ON a.job_id = p.id
       WHERE a.user_id = ?`,
      [userId],
     
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "No applied jobs found" });
    }
    
    
    res.json(rows);
  } catch (error) {
    console.error("Error fetching applied jobs:", error);
    res.status(500).json({ message: "Error fetching applied jobs" });
  }
});

app.get("/jobs/:jobId/applicants", async (req, res) => {
  const { jobId } = req.params;
console.log(jobId)
  try {
    const [rows] = await db.query(
      `
      SELECT 
  su.id AS user_id,
  su.name AS user_name,
  su.email AS user_email,
  ju.full_name,
  ju.dob,
  ju.gender,
  ju.contact_number,
  ju.address,
  ju.skills,
  ju.previous_experience,
  ju.languages,
  ju.certifications,
  au.applied_at AS applied_time
FROM applied_jobs au
JOIN signup_users su ON au.user_id = su.id
LEFT JOIN (
    SELECT email, MAX(id) AS latest_id
    FROM job_users
    GROUP BY email
) jmax ON jmax.email = su.email
LEFT JOIN job_users ju ON ju.id = jmax.latest_id
WHERE au.job_id = ?;

      `,
      [jobId]
    );
   // console.log(rows)

    if (rows.length === 0) {
      return res.status(404).json({ message: "No applicants found for this job" });
    }
        console.log(rows)
    res.json({
      totalApplicants: rows.length,
      applicants: rows,
    });
  } catch (error) {
    console.error("Error fetching applicants:", error);
    res.status(500).json({ message: "Error fetching applicants", error });
  }
});

app.get("/company-jobs/:companyName", async (req, res) => {
  const { companyName } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT * FROM posts WHERE postedBy = ? ORDER BY created_at DESC`,
      [companyName]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "No jobs found for this company" });
    }

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching company jobs:", error);
    res.status(500).json({ message: "Error fetching company jobs" });
  }
});




// ADMIN DASHBOARD DATA
app.get("/admin/overview", async (req, res) => {
  try {
    const [[usersCount]] = await db.query("SELECT COUNT(*) AS total_users FROM signup_users");
    const [[companiesCount]] = await db.query("SELECT COUNT(*) AS total_companies FROM companies");
    const [[jobsCount]] = await db.query("SELECT COUNT(*) AS total_jobs FROM posts");
    const [[applicationsCount]] = await db.query("SELECT COUNT(*) AS total_applications FROM applied_jobs");

    // Jobs with applicant count
    const [jobApplications] = await db.query(`
      SELECT p.title, COUNT(a.job_id) AS applicants
      FROM posts p
      LEFT JOIN applied_jobs a ON p.id = a.job_id
      GROUP BY p.id
    `);

    // Users applying to which jobs
    const [userApplications] = await db.query(`
      SELECT s.name AS user_name, p.title AS job_title
      FROM applied_jobs a
      JOIN signup_users s ON a.user_id = s.id
      JOIN posts p ON a.job_id = p.id
    `);

    res.json({
      counts: {
        users: usersCount.total_users,
        companies: companiesCount.total_companies,
        jobs: jobsCount.total_jobs,
        applications: applicationsCount.total_applications,
      },
      jobApplications,
      userApplications,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: "Error fetching dashboard data", error });
  }
});

app.get("/admin/details/:type", async (req, res) => {
  const { type } = req.params;
  let query = "";

  switch (type) {
    case "Total Users":
      query = "SELECT * FROM signup_users";
      break;
    case "Total Companies":
      query = "SELECT * FROM companies";
      break;
    case "Total Jobs":
      query = "SELECT * FROM posts";
      break;
    case "Total Applications":
      query = `
        

        SELECT s.name AS user_name, p.title AS job_title
      FROM applied_jobs a
      JOIN signup_users s ON a.user_id = s.id
      JOIN posts p ON a.job_id = p.id
      `;
      break;
    default:
      return res.status(400).json({ message: "Invalid type" });
  }

  try {
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Error fetching details" });
  }
});


app.post('/chatai',async(req,res)=>{
    const {prompt}=req.body
    console.log(prompt)
    try{
            const response=await axios({
                url:"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyB9FJtsLIIhVhITMUL6gA1kKPhXBlIp27U" ,
                method: 'post' ,
                data:{
  
    "contents": [
      {
        "parts": [
          {
            "text":"You are a highly knowledgeable, supportive, and evidence-based Female Health & Well-Being Advisor.\n\nYour job is to answer any questions related to:\n- female physical health (general information, not diagnosis)\n- menstrual cycles, PMS, hormonal changes\n- hygiene, skincare, reproductive health\n- emotional well-being, relationships, confidence, boundaries\n- behaviour, habits, safety, self-care\n- sensitive or private topics in a respectful, non-judgmental way\n\nCRITICAL RULES:\n1. Give medically accurate, evidence-based information.\n2. You may explain symptoms, possible causes, and what they *might* indicate, but never diagnose.\n3. Never give harmful, risky, or secret medical instructions.\n4. If a situation could be serious, advise the user to see a licensed doctor.\n5. If a mental health situation is severe, recommend contacting a licensed therapist or local emergency service.\n6. Be empathetic, supportive, respectful, and non-shaming.\n7. Use simple, clear, friendly language.\n8. Focus on empowering the user with knowledge and safe guidance.\n9. Offer practical self-care tips that are medically safe and common.\n10. Maintain privacy, respect, emotional safety, and neutrality.\n\nYour tone:\n- calm, warm, understanding\n- like a supportive mentor or wellness coach\n- never judgmental\n- always safe and responsible\n\nYour goal:\nGive the user the best possible accurate, safe, and helpful answer to any female-related question while remaining within ethical medical and psychological boundaries. dont act like a assistant but like a real genz supportive women who cares a lot and dont say things like understood and all just start answering"+ prompt
          }
        ]
      }
    ]
  }
        
    })
    const answer=response['data']['candidates'][0]['content']['parts'][0]['text']
     console.log(answer)
     res.status(200).json({answer})
        }
    
    catch(err){
        res.status(401).json({message:'err'})
        console.log(err)

    }
})



app.use('/',companyregistration)

app.use('/',sos)


app.use('/', posts)

app.use('/', complain)

app.listen(5000,(req,res)=>{
    console.log('started')
})