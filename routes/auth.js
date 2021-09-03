const express = require("express");
const router = express.Router();
const {OAuth2Client} = require("google-auth-library")
const conn = require("../connection");
const util = require('util');
const db = util.promisify(conn.query).bind(conn);

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

router.post("/login",async(req,res)=>{
    const {tokenId } = req.body;
    const response = await client.verifyIdToken({idToken:tokenId,audience:process.env.GOOGLE_CLIENT_ID})
    const {email,name} = response.payload;
    let query = `SELECT * FROM access WHERE access.email="${email}"`;
    let result = await db(query);
    if(result.length==0){
        // student found
        res.json({registered:false});
    }else{
        req.session.user = result[0];
        req.session.save();
        res.json({registered:true,user:result[0]});
    }
})

router.get("/status",(req,res)=>{
    if(req.session.user){
        res.send({user:req.session.user})
    }else{
        res.send({user:null})
    }
})

router.get("/logout",(req,res)=>{
    req.session.user = null;
    res.send({msg:"Successfull logout"})
})

module.exports = router;