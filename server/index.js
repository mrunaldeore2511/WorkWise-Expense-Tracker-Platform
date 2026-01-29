const express  = require("express");
const app = express();
require("dotenv").config();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const database = require("./config/database");

// Routes
const userRoutes = require("./routes/User");
const studentRoutes = require("./routes/Student");
const freelancerRoutes = require("./routes/Freelancer");
const travellerRoutes = require("./routes/Traveller");
const chatbotRoutes = require("./routes/Chatbot");

const allowedOrigins = process.env.FRONTEND_URLS.split(",");

app.use(cors({
    origin: function(origin, callback) {
        // allow requests with no origin (e.g., curl, Postman)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            return callback(new Error("CORS not allowed"), false);
        }
        return callback(null, true);
    },
    credentials: true
}));

// Built-in middlewares
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

// Connect DB
database.connect();

// Routes
app.use("/api/user", userRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/freelancer", freelancerRoutes);
app.use("/api/traveller", travellerRoutes);
app.use("/api/test", require("./routes/test"));
app.use("/api", chatbotRoutes);

// Root endpoint
app.get("/", (req,res) => {
    return res.json({
        success: true,
        message: "WorkWise server is up and running"
    })
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`)
});
