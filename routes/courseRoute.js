const express = require("express");
const router = express.Router();
const conn = require("../connection");
const util = require('util');
const db = util.promisify(conn.query).bind(conn);

//get request to fetch course data
router.get("/get/:courseId", async (req, res) => {
    try {
        const courseId = req.params.courseId;
        let query = `SELECT * FROM course WHERE (course.id=${courseId});`
        let response = await db(query);
        res.send(response);
    } catch (error) {
        console.log(error.message);
        res.status(500).send(error)
    }
})

//delete route to delete course from database
router.delete("/delete/:courseId", async (req, res) => {
    try {
        if (!req.session.user || req.session.user.role !== "admin") {
            return res.status(403).send({ message: "Permission Denied" })
        }
        const courseId = req.params.courseId;
        let query = `DELETE FROM course WHERE (course.id=${courseId});`
        await db(query);
        console.log("Course Deleted Successfully")
        res.send({ message: "Course Deleted Successfully." })
    } catch (error) {
        console.log(error.message);
        res.status(500).send(error)
    }
})

//fn which recevice instructorEmail as a string argument adn return array of instructor Id corresponding to their email
const getInstructorIds = async (instructorEmail) => {
    let emails = [], cur_email = "";
    for (let i = 0; i < instructorEmail.length; i++) {
        let ch = instructorEmail[i];
        if (ch === ' ') continue;
        if (ch === ',') {
            emails.push(cur_email);
            cur_email = "";
        } else {
            cur_email += ch;
        }
    }
    if (cur_email !== "") {
        emails.push(cur_email);
    }
    let instructorId = [], query;
    for (let i = 0; i < emails.length; i++) {
        cur_email = emails[i];
        query = `SELECT id FROM access WHERE ( email = "${cur_email}")`
        let response = await db(query);
        instructorId.push(response[0].id);
    }
    return instructorId;
}

//post request to add course in database
router.post("/add", async (req, res) => {
    try {
        if (!req.session.user || req.session.user.role !== "admin") {
            return res.status(403).send({ message: "Permission Denied" })
        }
        const { courseName, instructor, instructorEmail, credit, totalSeat, eligibility, fee, prerequisite, description } = req.body;
        const instructorId = await getInstructorIds(instructorEmail);
        let query;
        query = `INSERT INTO course(courseName,instructor,credit,eligibility,fee,prerequisite,description,instructorEmail,totalSeat) VALUES("${courseName}","${instructor}","${credit}","${eligibility}","${fee}","${prerequisite}","${description}","${instructorEmail}","${totalSeat}");`
        let result = await db(query);
        let courseId = result.insertId;
        for (let i = 0; i < instructorId.length; i++) {
            let currentId = instructorId[i];
            query = `INSERT INTO courseInstructor(courseId,instructorId) VALUES(${courseId},${currentId});`
            await db(query);
        }
        return res.send({ success: true })
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})

//put request to update course in database
router.put("/edit/:id", async(req, res) => {
    try {
        if (!req.session.user || req.session.user.role !== "admin") {
            return res.status(403).send({ message: "Permission Denied" })
        }
        const courseId = req.params.id;
        const { courseName, instructor, instructorEmail, credit, totalSeat, eligibility, fee, prerequisite, description } = req.body;
        const instructorId =await getInstructorIds(instructorEmail);
        instructorId.sort();
        let query = `SELECT instructorId FROM courseInstructor WHERE (courseId=${courseId}) ORDER BY instructorId`;
        let response = await db(query);
        let i=0,j=0;
        let deleteId = [],insertId = [];
        while(i<instructorId.length && j<response.length){
            if(response[j].instructorId===instructorId[i]){
                i++;j++;
            }else if(response[j].instructorId < instructorId[i]){
                deleteId.push(response[j].instructorId);j++;
            }else{
                insertId.push(instructorId[i]);i++;
            }
        }
        while(i<instructorId.length){
            insertId.push(instructorId[i]);i++;
        }
        while(j<response.length){
            deleteId.push(response[j].instructorId);j++;
        }
        for(i=0;i<deleteId.length;i++){
            query = `DELETE FROM courseInstructor WHERE (courseId=${courseId} AND instructorId=${deleteId[i]})`;
            await db(query);
        }
        for (i = 0; i < insertId.length; i++) {
            let currentId = insertId[i];
            query = `INSERT INTO courseInstructor(courseId,instructorId) VALUES(${courseId},${currentId});`
            await db(query);
        }
        query =  `UPDATE course SET courseName="${courseName}",instructor="${instructor}",credit=${credit},eligibility="${eligibility}",fee=${fee},prerequisite="${prerequisite}",description="${description}",instructorEmail="${instructorEmail}",totalSeat=${totalSeat};`;
        await db(query);
        console.log("course updated Successfully")
        res.send({message:"Updated Successfully"})
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})

module.exports = router;