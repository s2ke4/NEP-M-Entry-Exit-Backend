const express = require("express")
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser")
const authRoute = require("./routes/auth");
const courseRoute = require("./routes/courseRoute");
const roleRoute = require("./routes/role");
const session = require("express-session");
var MySQLStore = require('express-mysql-session')(session);
const dotenv = require("dotenv")
dotenv.config();


app.use(
    cors({
        origin:["http://localhost:3000"],
        methods:["GET","POST","PUT","DELETE"],
        credentials: true
    })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        key:"userId",
        secret:process.env.sessionSecret,
        resave:false,
        saveUninitialized:false,
        cookie:{
            maxAge:10*24*60*60*1000,
            secure:false
        },     
        store: new MySQLStore({
            host:process.env.DATABASE_HOST,
            user:process.env.DATABASE_USER,
            password:process.env.DATABASE_PASSWORD,
            database:process.env.DATABASE
        })
    })
)

app.get("/", (req, res) => {
    res.send("HELLo")
})

app.use("/auth", authRoute);
app.use("/course",courseRoute);
app.use("/access", roleRoute);


app.listen(port, () => {
    console.log("server is listening on port ", port);
})