const express = require("express");
const router = express.Router();

const {auth, isFreelancer} = require("../middlewares/auth");
const {addExpense, getAllExpenses,getSpecifiedExpenses, getTotalAmount, getFreelancerBarChart, getFreelancerPieChart} = require("../controllers/FreelancerController");

//routes

router.post("/add-expense-freelancer", auth, isFreelancer,addExpense);
router.post("/get-all-expenses-freelancer", auth, isFreelancer, getAllExpenses);
router.post("/get-specified-expenses-freelancer", auth, isFreelancer, getSpecifiedExpenses);
router.post("/get-total-amount-freelancer", auth, isFreelancer, getTotalAmount);
router.post("/get-freelancer-bar-chart", auth, isFreelancer, getFreelancerBarChart);
router.post("/get-freelancer-pie-chart", auth, isFreelancer, getFreelancerPieChart);

module.exports = router;
