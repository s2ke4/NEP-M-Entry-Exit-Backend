const express = require("express");
const router = express.Router();
const conn = require("../connection");
const util = require('util');
const db = util.promisify(conn.query).bind(conn);


//post request to add student data in database
router.post("/sign-up", async (req, res) => {
  try {
      const { firstname, lastname, gender, birthday, institute, currentyear, email, phone } = req.body;
      let query;
      query = `INSERT INTO studentdata(firstname , lastname , gender , birthday , institute , currentyear , email , phone) VALUES("${firstname}","${lastname}","${gender}","${birthday}","${institute}","${currentyear}","${email}","${phone}");`
      let response  = await db(query);
      const user = {id:response.insertId,firstname, lastname, gender, birthday, institute, currentyear, email, phone,registered:true,role:"student"}
      req.session.user = user;
      req.session.save();
      return res.send({ success: true })
  } catch (error) {
      console.log(error)
      res.status(500).send(error)
  }
})

//post request to apply for a course
router.post("/courses/:id", async (req,res) => {
    try {
      const { userId, courseId } = req.body;
      console.log(userId);
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
    let query = `SELECT * FROM studentdata WHERE id=${id}`;
    let result = await db(query);
    console.log(result);
    res.send(result[0]);
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


module.exports = router;