const express = require("express");
const router = express.Router();
const conn = require("../connection");
const util = require('util');
const db = util.promisify(conn.query).bind(conn);


//post request to add student data in database
router.post("/sign-up", async (req, res) => {
  try {
      //console.log(req.body)
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
      let query = `INSERT INTO studentApplications(studentId, courseId) VALUES (${userId},${courseId})`;
      let response = await db(query);
      return res.send({ success: true })
    } catch(error) {
      console.log(error);
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


module.exports = router;