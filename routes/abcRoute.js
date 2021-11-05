const express = require('express');
const router = express.Router();
const conn = require("../connection");
const util = require('util');
const db = util.promisify(conn.query).bind(conn);

// @post /abc/create-course
//create course in abc
router.post("/create-course",async(req,res)=>{
    try {
        const {instituteName,courseName,coursePageLink,maxCredit} = req.body;
        let query = `SELECT id from abc_institute WHERE name="${instituteName}"`
        let response = await db(query);
        const instituteId = response[0].id;
        query = `INSERT INTO abc_course(instituteId,courseName,coursePageLink,maxCredit) VALUES(${instituteId},"${courseName}","${coursePageLink}",${maxCredit})`;
        response  = await db(query);
        return res.send({courseId: response.insertId,success:true})
    } catch (error) {
        console.log("error while adding course in abc course table");
        console.log(error);
        res.status(500).send(error)
    }
})

// @put /abc/edit-course/:courseId
//edit course in abc
router.put("/edit-course/:courseId",async(req,res)=>{
    try {
        const courseId = req.params.courseId;
        const {courseName,coursePageLink,maxCredit} = req.body;
        let query = `UPDATE abc_course SET courseName="${courseName}",coursePageLink="${coursePageLink}", maxCredit="${maxCredit}" WHERE courseId=${courseId}`
        await db(query);
        return res.send({success:true})
    } catch (error) {
        console.log("error while adding course in abc course table");
        console.log(error);
        res.status(500).send(error)
    }
})




module.exports = router;