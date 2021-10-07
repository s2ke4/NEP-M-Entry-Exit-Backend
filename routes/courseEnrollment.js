        const express = require("express");
const router = express.Router();
const conn = require("../connection");
const util = require('util');
const db = util.promisify(conn.query).bind(conn);

router.get("/pending-list/:id",async(req,res)=>{
    try {
        if (!req.session.user || req.session.user.role !== "admin") {
            return res.status(403).send({ message: "Permission Denied" })
        }
        const courseId = req.params.id;
        let query = `SELECT courseName FROM course WHERE id=${courseId}`;
        let result = await db(query);
        if(result.length==0){
            res.send(null);
        }else{
            const courseName = result[0].courseName;
            query = `SELECT studentId FROM studentapplications WHERE courseId=${courseId}`;
            result = await db(query);
            let students = [];
            for(let i=0;i<result.length;i++){
                query = `SELECT id,firstname,lastname,institute FROM studentdata WHERE id=${result[i].studentId}`;
                let response = await db(query);
                students.push({id:response[0].id,name:response[0].firstname+" "+response[0].lastname,institute:response[0].institute});
            }
            res.send({courseName,students})
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send(error);
    }
})

router.post("/accept",async(req,res)=>{
    try {
        if (!req.session.user || req.session.user.role !== "admin") {
            return res.status(403).send({ message: "Permission Denied" })
        }
        const {courseId,studentId} = req.body;
        let query = `INSERT INTO studentcourse(courseId,studentId) VALUES(${courseId},${studentId})`;
        await db(query);
        query = `INSERT INTO notification(courseId,studentId,status,message) VALUES(${courseId},${studentId},"accepted","")`
        await db(query);
        query = `DELETE FROM studentapplications WHERE courseId=${courseId} AND studentId=${studentId}`;
        await db(query);
        query = `update course set registeredStudent = registeredStudent + 1 where id = ${courseId}`;
        await db(query);
        res.send({success:true});
    } catch (error) {
        console.log(error.message);
        res.status(500).send(error);
    }
})

router.post("/reject",async(req,res)=>{
    try {
        if (!req.session.user || req.session.user.role !== "admin") {
            return res.status(403).send({ message: "Permission Denied" })
        }
        const {courseId,studentId,message} = req.body;
        let query = `INSERT INTO notification(courseId,studentId,status,message) VALUES(${courseId},${studentId},"rejected","${message}")`
        await db(query);
        query = `DELETE FROM studentapplications WHERE courseId=${courseId} AND studentId=${studentId}`
        await db(query);
        res.send({success:true});
    } catch (error) {
        console.log(error.message);
        res.status(500).send(error);
    }
})

module.exports = router;