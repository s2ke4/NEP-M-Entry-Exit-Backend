const express = require("express");
const router = express.Router();
const conn = require("../connection");
const util = require('util');
const db = util.promisify(conn.query).bind(conn);


//post request to add student data in database
router.post("/sign-up", async (req, res) => {
  try {
      const { ABCAccNo, email } = req.body;
      let query;
      query = `SELECT * FROM abc_student_data WHERE accnumber=${ABCAccNo} AND email="${email}"`;
      let response = await db(query);
      if(response.length==0){
        return res.send({success: false, msg: "Invalid Acc. Number or Email Address"})
      }
      query = `INSERT INTO studentData(id , email) VALUES("${ABCAccNo}","${email}");`
      response  = await db(query);
      const user = {id:ABCAccNo, email,registered:true,role:"student"}
      req.session.user = user;
      req.session.save();
      return res.send({ success: true })
  } catch (error) {
      console.log(error)
      res.status(500).send(error)
  }
})

router.get("/verify/:id",async(req,res)=>{
  try {
      if (!req.session.user || req.session.user.role !== "admin") {
          return res.status(403).send({ message: "Permission Denied" })
      }
      const studentId = req.params.id;
      let query = `SELECT * FROM ABC_CREDIT WHERE studentId=${studentId}`;
      const creditinfo = [];
      result = await db(query);
      for(let i=0;i<result.length;i++){

          query = `select * from ABC_COURSE where courseId = ${result[i].courseId}`;
          let course = await db(query);
          query = `select * from ABC_INSTITUTE where id = ${course[0].instituteId}`;
          let institute = await db(query);
          creditinfo.push({courseName: course[0].courseName,courseLink: course[0].coursePageLink,instituteName:institute[0].name,creditEarned:result[i].creditEarned,expiry:result[i].expiryDate,enrollmentDate:result[i].enrollment,completionDate:result[i].completion})
      }

      res.send(creditinfo);
      
  } catch (error) {
      console.log(error.message);
      res.status(500).send(error);
  }
})

//post request to apply for a course
router.post("/courses/:id", async (req,res) => {
    try {
      const { userId, courseId } = req.body;
      console.log(req.body);
      let query = `INSERT INTO studentApplications(studentId, courseId) VALUES (${userId},${courseId})`;
      let response = await db(query);
      return res.send({ success: true })
    } catch(error) {
      console.log(error);
      res.status(500).send(error);
    }
})

//route to get a particular student profile
router.get("/profile/:id",async(req,res)=>{
  try {
    const {id} = req.params;
    let data = [];
    let query = `SELECT * FROM abc_student_data WHERE accnumber=${id}`;
    let result = await db(query);
    query = `select name from abc_institute where id = ${result[0].instituteId}`;
    let instituteName = await db(query); 
    data.push({name : result[0].name, email : result[0].email, id : result[0].accnumber, dob : result[0].dob, institute : instituteName[0].name, gender : result[0].gender});
    console.log(data);
    res.send(data);
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error);
  }
})

//get request to fetch course data
// router.get("/getroles", async (req, res) => {
//   try {
//       let query = `SELECT * FROM access`;
//       let response = await db(query);
//       res.send(response);
//   } catch (error) {
//       console.log(error.message);
//       res.status(500).send(error)
//   }
// })

router.get("/notifications",async(req,res)=>{
  try {
    let final = [];
    const studentId = req.session.user.id;
    // console.log(StudentId);
    let query = `SELECT * FROM notification WHERE studentId=${studentId} ORDER BY timestamp desc;`;
    let result = await db(query);
    for(i=0;i<result.length;i++){
      let courseId = result[i].courseId;
      let query1 = `SELECT courseName, instructor FROM course WHERE id=${courseId};`;
      let result1 = await db(query1);
      console.log(result1[0].couseName);
      final.push({
        courseName : result1[0].courseName,
        instructor : result1[0].instructor,
        message : result[i].message,
        status : result[i].status,
      })
    } 
    console.log(final)
    res.send(final);
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error);
  }
})


//route to submit grade
router.put("/grade/:courseId/:studentId",async(req,res)=>{
  const {grade,completion,expiry} = req.body;
  const {courseId,studentId} = req.params;
  try {
    let query = `UPDATE studentcourse SET credit=${grade}, completion="${completion}", expiry="${expiry}" WHERE courseId=${courseId} AND studentId=${studentId}`;
    await db(query);
    res.send({success:true})
  } catch (error) {
      console.log(error.message);
      return res.send({success:false})
  }
})

module.exports = router;