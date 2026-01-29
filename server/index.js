const express  = require("express");
const app = express();
const bodyParser = require("body-parser");
require("dotenv").config();

const userRoutes = require("./routes/User");
const studentRoutes = require("./routes/Student");
const freelancerRoutes = require("./routes/Freelancer");
const travellerRoutes = require("./routes/Traveller");
const chatbotRoutes = require("./routes/Chatbot");


const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: process.env.FRONTEND_URL, credentials: true}));
database.connect();
app.use(bodyParser.json());

app.use("/api/user", userRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/freelancer", freelancerRoutes);
app.use("/api/traveller", travellerRoutes);
app.use("/api/test", require("./routes/test"));
app.use("/api", chatbotRoutes);

app.get("/", (req,res) => {
    return res.json({
        success: true,
        message: "WorkWise server is up and running"
    })
})


app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`)
})

app.use(cors({
    origin : process.env.FRONTEND_URL,
    creadentials : true
}))