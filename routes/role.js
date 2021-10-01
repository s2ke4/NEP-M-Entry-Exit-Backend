const express = require("express");
const router = express.Router();
const conn = require("../connection");
const util = require('util');
const db = util.promisify(conn.query).bind(conn);


//post request to add course in database
router.post("/addrole", async (req, res) => {
  try {
      if (!req.session.user || req.session.user.role !== "admin") {
          return res.status(403).send({ message: "Permission Denied" })
      }
      const { name, email, role } = req.body;
      let query;
      query = `INSERT INTO access(name , email, role) VALUES("${name}","${email}","${role}");`
      await db(query);
      return res.send({ success: true })
  } catch (error) {
      console.log(error)
      res.status(500).send(error)
  }
})

//get request to fetch course data
router.get("/getroles", async (req, res) => {
  try {
      let query = `SELECT * FROM access`;
      let response = await db(query);
      res.send(response);
  } catch (error) {
      console.log(error.message);
      res.status(500).send(error)
  }
})

//get request to fetch course data
router.get("/getroles/:id", async (req, res) => {
    try {
        const id = req.params.id;
        let query = `SELECT * FROM access WHERE (access.id=${id});`
        let response = await db(query);
        res.send(response);
    } catch (error) {
        console.log(error.message);
        res.status(500).send(error)
    }
})

router.delete("/delete/:id", async (req, res) => {
  try {
      if (!req.session.user || req.session.user.role !== "admin") {
          return res.status(403).send({ message: "Permission Denied" })
      }
      const id = req.params.id;
      let query = `DELETE FROM access WHERE (id=${id});`
      await db(query);
      console.log("Course Deleted Successfully")
      res.send({ message: "Course Deleted Successfully." })
  } catch (error) {
      console.log(error.message);
      res.status(500).send(error)
  }
})


router.put("/edit/:id", async(req, res) => {
    try {
        if (!req.session.user || req.session.user.role !== "admin") {
            return res.status(403).send({ message: "Permission Denied" })
        }
        const id = req.params.id;
        const { name, email, role } = req.body;
        query =  `UPDATE access SET name="${name}",email="${email}",role="${role}" where id = ${id}`;
        await db(query);
        console.log("acess updated Successfully")
        res.send({message:"Updated Successfully"})
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})



module.exports = router;
