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
     // creating useraccess table
     let query1 = "CREATE TABLE IF NOT EXISTS access(id INT PRIMARY KEY AUTO_INCREMENT,name TEXT,email TEXT,role TEXT);";
     conn.query(query1,(error,res)=> {
         if(error){
             console.log("Error While Creating access table");
             throw error;
         }
         console.log("ACCESS table created successfully");
     })
     //creating course table
     query1 = "CREATE TABLE IF NOT EXISTS course(id INT PRIMARY KEY AUTO_INCREMENT,isActive BOOL DEFAULT true,courseName TEXT,instructor TEXT,credit INT,eligibility TEXT,fee INT,prerequisite TEXT,description TEXT,instructorEmail TEXT,totalSeat INT, registeredStudent INT DEFAULT 0);";
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
     //creating studentdata table
     query1 = "CREATE TABLE IF NOT EXISTS studentData(id INT PRIMARY KEY AUTO_INCREMENT, firstname TEXT, lastname TEXT, gender TEXT, birthday TEXT, institute TEXT, currentyear TEXT, email TEXT, phone TEXT)";
     conn.query(query1,(error,res)=> {
         if(error){
             console.log("Error While Creating studentdata table");
             throw error;
         }
         console.log("StudentData Table created successfully");
     })
     //creating studentapplications table
     let studentApplicationsQuery = "CREATE TABLE IF NOT EXISTS studentapplications(studentId INT, courseId INT, FOREIGN KEY(studentId) REFERENCES studentData(id) ON DELETE CASCADE, FOREIGN KEY(courseId) REFERENCES course(id) ON DELETE CASCADE, PRIMARY KEY(studentId, courseId))";
     conn.query(studentApplicationsQuery,(error, res) => {
         if(error) {
             console.log("Error while Creating studentApplications Table");
             throw error;
         }
         console.log("StudentApplications Table created sucessfully");
     })
    //creating student-course table
    query1 = "CREATE TABLE IF NOT EXISTS studentCourse(courseId INT,studentId INT,FOREIGN KEY(courseId) REFERENCES course(id) ON DELETE CASCADE,FOREIGN KEY(studentId) REFERENCES studentData(id) ON DELETE CASCADE, PRIMARY KEY(courseId,studentId))";
    conn.query(query1,(error,res)=> {
        if(error){
            console.log("Error While Creating studentCourse table");
            throw error;
        }
        console.log("STUDENT-COURSE table created successfully");
    })
    //creating notification table
    query1 = "CREATE TABLE IF NOT EXISTS notification(id INT PRIMARY KEY AUTO_INCREMENT, timestamp DATETIME DEFAULT now(), courseId INT,studentId INT,message TEXT,status TEXT,FOREIGN KEY(courseId) REFERENCES course(id) ON DELETE CASCADE,FOREIGN KEY(studentId) REFERENCES studentData(id) ON DELETE CASCADE)";
    conn.query(query1,(error,res)=> {
        if(error){
            console.log("Error While Creating notification table");
            throw error;
        }
        console.log("notification table created successfully");
    })
})

module.exports = conn;