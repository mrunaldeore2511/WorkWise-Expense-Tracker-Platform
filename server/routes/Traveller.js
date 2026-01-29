const express = require("express");
const router = express.Router();

const {auth, isTraveller} = require("../middlewares/auth");
const {addExpense, getAllExpenses,getSpecifiedExpenses, getTravellerBarChart, getTravellerPieChart} = require("../controllers/TravellerController");

//routes

router.post("/add-expense-traveller", auth, isTraveller,addExpense);
router.post("/get-all-expenses-traveller", auth, isTraveller, getAllExpenses);
router.post("/get-specified-expenses-traveller", auth, isTraveller, getSpecifiedExpenses);
router.post("/get-traveller-bar-chart", auth, isTraveller, getTravellerBarChart);
router.post("/get-traveller-pie-chart", auth, isTraveller, getTravellerPieChart);

module.exports = router;
