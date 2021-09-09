const mysql = require("mysql");
const dotenv = require("dotenv")
dotenv.config({path:"./.env"})

const conn = mysql.createConnection({
    host:process.env.DATABASE_HOST,
    user:process.env.DATABASE_USER,
    password:process.env.DATABASE_PASSWORD,
    database:process.env.DATABASE
})

conn.connect((err)=>{
    if(err) throw err;
    // let query1 = `CREATE DATABASE ${process.env.DATABASE}`;
    // conn.query(query1,(error,res)=>{
    //     if(error){
    //         console.log("Error while creating database");
    //         throw error;
    //     }
    //     console.log("Database created successfully")
    // })  
    console.log("Successfully Connected To Database.")
     // creating user table
     let query1 = "CREATE TABLE IF NOT EXISTS access(id INT PRIMARY KEY AUTO_INCREMENT,name TEXT,email TEXT,role TEXT);";
     conn.query(query1,(error,res)=> {
         if(error){
             console.log("Error While Creating access table");
             throw error;
         }
         console.log("ACCESS table created successfully");
     })
     //creating course table
     query1 = "CREATE TABLE IF NOT EXISTS course(id INT PRIMARY KEY AUTO_INCREMENT,courseName TEXT,instructor TEXT,credit INT,eligibility TEXT,fee INT,prerequisite TEXT,description TEXT,instructorEmail TEXT,totalSeat INT, registeredStudent INT DEFAULT 0);";
     conn.query(query1,(error,res)=> {
         if(error){
             console.log("Error While Creating course table");
             throw error;
         }
         console.log("COURSE table created successfully");
     })
     //creating course-instructor table
     query1 = "CREATE TABLE IF NOT EXISTS courseInstructor(courseId INT,instructorId INT,FOREIGN KEY(courseId) REFERENCES course(id) ON DELETE CASCADE,FOREIGN KEY(instructorId) REFERENCES access(id) ON DELETE CASCADE, PRIMARY KEY(courseId,instructorId))";
     conn.query(query1,(error,res)=> {
         if(error){
             console.log("Error While Creating courseInstructor table");
             throw error;
         }
         console.log("COURSE-INSTRUCTOR table created successfully");
     })
})

module.exports = conn;