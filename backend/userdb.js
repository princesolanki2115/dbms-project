import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function initDB() {
  try {
    const db = await mysql.createConnection({
      host: process.env.dbms_host,
      user: process.env.dbms_user,
      password: process.env.dbms_password,
      database: process.env.dbms_database
    });
     return db;
    console.log('Database connected successfully');
   
  } catch (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
}

const db = await initDB();
export default db;

        //await db.execute(`create database dbms_project`)
         //await db.execute(`USE dbms_project`)

          // await db.execute(`
          //   CREATE TABLE signup_users(
          //   id INT AUTO_INCREMENT PRIMARY KEY,
          //   email VARCHAR(50) NOT NULL,
          //   code VARCHAR(6) NOT NULL,
          //   confirmpassword VARCHAR(20) NOT NULL,
          //   pasword VARCHAR(20) NOT NULL
          //   );  
          //     `);

        //  await db.execute(`
        //      insert into signup_users(email,code,confirmpassword,pasword) values('naman','4333','123','123');
        //      `)

        // const rows=await db.execute(`select * from signup_users`)
        //     console.log(rows[0])
//console.log(await db.execute('show databases'))


  // await db.execute(`USE dbms_project`)

  //          await db.execute(`
  //           CREATE TABLE job_users(
  //            id INT AUTO_INCREMENT PRIMARY KEY,
  //  full_name VARCHAR(100) NOT NULL,
  //  dob DATE,
  //  gender VARCHAR(20),
  //  contact_number VARCHAR(20),
  //  email VARCHAR(100) UNIQUE,
  //  address TEXT,
  //  emergency_contact VARCHAR(100),
  //  job_title VARCHAR(100),
  //  department VARCHAR(100),
  //  reporting_manager VARCHAR(100),
  //  start_date DATE,
  //  employment_type ENUM('Permanent', 'Contract', 'Probationary'),
  //  salary DECIMAL(12,2),
  //  payment_mode VARCHAR(50),
  //  bank_account VARCHAR(50),
  //  bank_name VARCHAR(100),
  //  work_mode ENUM('On-site', 'Remote', 'Hybrid'),
  //  working_hours VARCHAR(50),
  //  schedule_constraints VARCHAR(100),
  // pan VARCHAR(20),
  //  id_number VARCHAR(50),
  //  non_compete BOOLEAN DEFAULT FALSE,
  //  confidentiality BOOLEAN DEFAULT FALSE,
  //  skills TEXT,
  //  certifications TEXT,
  //  languages TEXT,
  //  previous_experience TEXT,
  //  hobbies TEXT,
  //  additional_info TEXT,
  //  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  //            );  
  //              `);



// await db.execute(`
//   CREATE TABLE companies (
//   id INT AUTO_INCREMENT PRIMARY KEY,

//   companyName VARCHAR(150) NOT NULL,
//   companyType VARCHAR(100) NOT NULL,
//   industry VARCHAR(100) NOT NULL,
//   logo VARCHAR(255),
//   establishedDate DATE NOT NULL,

//   email VARCHAR(150) NOT NULL UNIQUE,
//   phone VARCHAR(20) NOT NULL,
//   website VARCHAR(150),
//   address VARCHAR(255) NOT NULL,
//   billingAddress VARCHAR(255),

//   taxNumber VARCHAR(50) NOT NULL,
//   registrationNumber VARCHAR(50) NOT NULL,
//   authorizedPerson VARCHAR(150) NOT NULL,
//   documents VARCHAR(255),

//   username VARCHAR(100) NOT NULL UNIQUE,
//   passwordHash VARCHAR(255) NOT NULL,
//   communicationMethod ENUM('email', 'phone', 'portal') DEFAULT 'email',

//   createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );
// `)



// await db.execute(`
   
//    CREATE TABLE posts (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   type VARCHAR(100),
//   title VARCHAR(255) NOT NULL,
//   organizer VARCHAR(255),
//   location VARCHAR(255),
//   category VARCHAR(100),
//   mode VARCHAR(50), 
//   eligibility VARCHAR(255),
//   startDate DATE,
//   endDate DATE,
//   applyLink VARCHAR(500),
//   contactEmail VARCHAR(255),
//   contactPhone VARCHAR(20),
//   reward VARCHAR(255),
//   fees VARCHAR(100),
//   skillsRequired TEXT,
//   description TEXT,
//   aboutOrganizer TEXT,
//   postedBy VARCHAR(255),
//   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );

   
//     `)
