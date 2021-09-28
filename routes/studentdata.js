const express = require("express");
const router = express.Router();
const conn = require("../connection");
const util = require('util');
const db = util.promisify(conn.query).bind(conn);


//post request to add course in database
router.post("/sign-up", async (req, res) => {
  try {
      //console.log(req.body)
      const { firstname, lastname, gender, birthday, institute, currentyear, email, phone } = req.body;
      let query;
      console.log(firstname);
      query = `INSERT INTO studentdata(firstname , lastname , gender , birthday , institute , currentyear , email , phone) VALUES("${firstname}","${lastname}","${gender}","${birthday}","${institute}","${currentyear}","${email}","${phone}");`
      await db(query);
      return res.send({ success: true })
  } catch (error) {
      console.log(error)
      res.status(500).send(error)
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