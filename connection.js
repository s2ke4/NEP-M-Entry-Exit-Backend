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
     query1 = "CREATE TABLE IF NOT EXISTS studentData(id INT PRIMARY KEY, email TEXT)";
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

    //creating ABC student data
    // query1 = "CREATE TABLE IF NOT EXISTS abcstudentdata(accnumber INT PRIMARY KEY, name TEXT, gender text,email text, dob text, institute text)";
    // conn.query(query1,(error,res)=> {
    //     if(error){
    //         console.log("Error While Creating studentdata table");
    //         throw error;
    //     }
    //     console.log("ABC StudentData Table created successfully");
    // })

    // //creating ABC credits data
    // query1 = "CREATE TABLE IF NOT EXISTS abcstudentcredits(accnumber INT PRIMARY KEY, courseid TEXT, creditsearned int, expirydate text, enrolmenttime text, completiontime text)";
    // conn.query(query1,(error,res)=> {
    //     if(error){
    //         console.log("Error While Creating studentdata table");
    //         throw error;
    //     }
    //     console.log("ABC creditsdata Table created successfully");
    // })

    // //creating ABC course data
    // query1 = "CREATE TABLE IF NOT EXISTS abccoursedata(accnumber INT PRIMARY KEY, courseid text, maxcredit int, linkofcourse text)";
    // conn.query(query1,(error,res)=> {
    //     if(error){
    //         console.log("Error While Creating studentdata table");
    //         throw error;
    //     }
    //     console.log("ABC Coursedata Table created successfully");
    // })

    // //creating ABC student data
    // query1 = "CREATE TABLE IF NOT EXISTS abcinstitutedata(instituteid INT PRIMARY KEY, name TEXT, location text)";
    // conn.query(query1,(error,res)=> {
    //     if(error){
    //         console.log("Error While Creating studentdata table");
    //         throw error;
    //     }
    //     console.log("ABC institute data Table created successfully");
    // })

})

module.exports = conn;