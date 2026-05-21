import express from 'express';
import cors from 'cors';
import db from './userdb.js';
const router=express.Router()
const app=express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());


router.get("/posts", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.*, 
        COUNT(a.job_id) AS totalApplicants
      FROM posts p
      LEFT JOIN applied_jobs a ON p.id = a.job_id
      GROUP BY p.id
      ORDER BY p.id DESC
    `);

    const currentDate = new Date();

    // Update job statuses dynamically
    const updatedRows = rows.map((job) => {
      const start = new Date(job.startDate);
      const end = new Date(job.endDate);
      let status = job.status;

      if (currentDate < start) status = "upcoming";
      else if (currentDate >= start && currentDate <= end) status = "active";
      else status = "closed";

      return { ...job, status };
    });

    res.json(updatedRows);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ message: "Error fetching jobs" });
  }
});







router.post('/posts',(req,res)=>{
    const {formData}=req.body
    console.log(formData)

    
    const {
        type,
    title,
    organizer,
    location,
    category,
    mode,
    eligibility,
    startDate,
    endDate,
    applyLink,
    contactEmail,
    contactPhone,
    reward,
    fees,
    skillsRequired,
    description,
    aboutOrganizer,
    postedBy
    }=formData;


    try{

  const insertSql = `
    INSERT INTO posts (
           type,
    title,
    organizer,
    location,
    category,
    mode,
    eligibility,
    startDate,
    endDate,
    applyLink,
    contactEmail,
    contactPhone,
    reward,
    fees,
    skillsRequired,
    description,
    aboutOrganizer,
    postedBy
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
  `;

  const values = [
       type,
    title,
    organizer,
    location,
    category,
    mode,
    eligibility,
    startDate,
    endDate,
    applyLink,
    contactEmail,
    contactPhone,
    reward,
    fees,
    skillsRequired,
    description,
    aboutOrganizer,
    postedBy
  ];

  console.log('sd')

   db.query(insertSql, values, (err, result) => {
 	console.log('ddd')
   

     console.log("job posted successfully");
     return res.status(200).json({ message: "job posted successfully" });
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

})

export default router;