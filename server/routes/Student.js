const express = require("express");
const router = express.Router();

const {auth, isStudent} = require("../middlewares/auth");
const {addExpense, getAllExpenses,getSpecifiedExpenses, getTotalAmount, getStudentBarChart, getStudentPieChart} = require("../controllers/StudentController");

//routes

router.post("/add-expense-student", auth, isStudent,addExpense);
router.post("/get-all-expenses-student", auth, isStudent, getAllExpenses);
router.post("/get-specified-expenses-student", auth, isStudent, getSpecifiedExpenses);
router.post("/get-total-amount-student", auth, isStudent, getTotalAmount);
router.post("/get-student-bar-chart", auth, isStudent, getStudentBarChart);
router.post("/get-student-pie-chart", auth, isStudent, getStudentPieChart);

module.exports = router;    
