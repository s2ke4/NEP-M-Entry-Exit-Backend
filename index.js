const express = require("express")
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser")
const authRoute = require("./routes/auth");
const courseRoute = require("./routes/courseRoute");
const session = require("express-session");
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
        }
    })
)

app.get("/", (req, res) => {
    res.send("HELLo")
})

app.use("/auth", authRoute)
app.use("/course",courseRoute);


app.listen(port, () => {
    console.log("server is listening on port ", port);
})