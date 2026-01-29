const StudentExpense = require("../models/StudentExpense");
const mongoose = require("mongoose");

// addExpense
exports.addExpense = async(req, res) => {

    try{

        const {items} = req.body;
        const userId = req.user.id;
        console.log("ITEMS:", req.body)
        // console.log("User ID in addExpense:", userId);

        if(!Array.isArray(items) || items.length === 0){
            return res.status(402).json({
                success: false,
                message: "Enter the item details"
            })
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let totalAmount = 0;

        const processedItems = items.map(item => {
            const finalAmount = Number(item.amount || 0);

            if(isNaN(finalAmount) ||  finalAmount < 0 || !item.itemName){
                throw new Error("Invalid item details");
            }

            totalAmount += finalAmount;

            return {
                itemName: item.itemName,
                amount: finalAmount,
            }
        });


        let expenseDoc = await StudentExpense.findOne({userId: userId, date : today});

        if(!expenseDoc){
            expenseDoc = await StudentExpense.create({
                userId: userId,
                date: today,
                items: processedItems,
                totalAmount: totalAmount
            });

        }
        else{
            expenseDoc = await StudentExpense.findOneAndUpdate(
            { userId: userId, date: today },
            {
                $push : {items: {$each:processedItems}},
                $inc : {totalAmount},
            },
            {new: true}    
            );

        }

        return res.status(200).json({
            success: true,
            message: "Items added successfully for the day",
            data: expenseDoc
        });   
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Cannot add item",
            error: err
        });
    }
}

// getAllExpenses
exports.getAllExpenses = async(req, res) => {

    try{
        const userId = req.user.id;
        if(!userId){
            return res.status(402).json({
                success: false,
                message: "Student not present in DB",
            });   
        }
        const allStudentExpenses = await StudentExpense.find({userId}).sort({date: -1});
        
        if(!allStudentExpenses){
            return res.status(402).json({
                success: false,
                message: "Cannot fetch all expenses for student",
            }); 
        }

        return res.status(200).json({
            success: true,
            message: "All Expenses of Student fetched successfully",
            data: allStudentExpenses
        }); 
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: "Error while fetching all expenses for student",
            error: err
        }); 
    }
}

// getSpecifiedExpenses
exports.getSpecifiedExpenses = async(req, res) => {

    try{
        const userId = req.user.id;
        const {startDate, endDate} = req.body;

        if(!startDate || !endDate || !userId){
            return res.status(402).json({
                success: false,
                message: "All fields are required",
            }); 
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        if (isNaN(start) || isNaN(end)){
            return res.status(402).json({
                success: false,
                message: "Invalid dates",
            });    
        }

        end.setHours(23,59,59,999);

        const expenses = await StudentExpense.find({
            userId: userId,
            date: {$gte: start , $lte: end},
        }).sort({date: 1});

        if(!expenses){
            return res.status(402).json({
                success: false,
                message: "No specified expenses found",
            });
        }
        console.log("Expenses: ",expenses);

        return res.status(200).json({
            success: true,
            message: "Sepcified Expenses fetched successfully",
            data: expenses
        });
    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "Error while fetching specified expenses for student",
            error: err
        }); 
    }
}

// getTotalAmount
exports.getTotalAmount = async(req, res) => {

    try{
        const userId = req.user.id;
        if(!userId){
            return res.status(402).json({
                success: false,
                message: "User not found",
            }); 
        }

        const expenses = await StudentExpense.find({userId: userId});
        if(!expenses){
            return res.status(402).json({
                success: false,
                message: "No expenses found for the student",
            }); 
        }

        const totalAmount = expenses.reduce((sum, doc) => sum + doc.totalAmount, 0);

        return res.status(200).json({
            success: true,
            message: "Total Amount Fetched SuccessFully",
            data: totalAmount
        }); 
        
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: "Error while fetching total amount for student",
            error: err
        });  
    }
}

// getStudentBarChart
exports.getStudentBarChart = async(req, res) =>{

    try{

        const userId = req.user.id;
        const{startDate, endDate} = req.body;

        if(!startDate || !endDate){
            return res.status(500).json({
                success: false,
                message: "Error while fetching start and end dates",
            });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if(isNaN(start) || isNaN(end)){
            return res.status(500).json({
                success: false,
                message: "Invalid date format",
            });
        }

        end.setHours(23,59,59,999);

        
        const diffMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());

        let barChartAmount = [];

        if(diffMonths < 1) {
            const expenses = await StudentExpense.aggregate(
                [
                    {
                        $match:{
                            userId: new mongoose.Types.ObjectId(userId),
                            date: {$gte: start , $lte: end}
                        },  
                    },
                    {$unwind : "$items"},
                    {$group : {
                        _id: "$items.itemName",
                        totalAmount : {$sum : "$items.amount"},
                    }},
                    {
                        $project : {
                            _id: 0,
                            label: "$_id",
                            value: "$totalAmount",
                        }
                    }
                ]
            );
            barChartAmount = expenses.map((doc) => ({
                label: doc.label,
                value: doc.value
            }));
            
        }
        else{
            const expenses = await StudentExpense.aggregate(
                [
                    {
                        $match:{
                            userId: new mongoose.Types.ObjectId(userId),
                            date: {$gte: start , $lte: end}
                        },  
                    },
                    {$group : {
                        _id: {year:{$year : "$date"}, month:{$month: "$date"}},
                        totalAmount : {$sum : "$totalAmount"},
                    }},
                    {
                        $project : {
                            _id: 0,
                            label: { $concat: [{ $toString: "$_id.year" }, "-", { $toString: "$_id.month" }] },
                            value: "$totalAmount",
                        },
                    },
                    {
                        $sort: {label : 1}
                    }
                ]
            );

            barChartAmount = expenses.map((doc) => ({
                label: doc.label,
                value: doc.value
            }));
            
        }
        return res.status(200).json({
            success: true,
            message: "Successfully created bar chart data",
            data: {barChartAmount}
        })        

    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: "Error while creating a bar chart",
            error: err
        });
    }
}

// getStudentPieChart
exports.getStudentPieChart = async(req, res) =>{

    try{

        const userId = req.user.id;
        const{startDate, endDate} = req.body;

        if(!startDate || !endDate){
            return res.status(500).json({
                success: false,
                message: "Error while fetching start and end dates",
            });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if(isNaN(start) || isNaN(end)){
            return res.status(500).json({
                success: false,
                message: "Invalid date format",
            });
        }

        end.setHours(23,59,59,999);

        const expenses = await StudentExpense.aggregate(
            [
                
                    {
                        $match: {
                            userId: new mongoose.Types.ObjectId(userId),
                            date:{$gte: start, $lte: end}
                        }
                    },
                    {
                        $unwind: "$items"
                    },
                    {
                        $group: {
                            _id: "$items.itemName",
                            itemAmount: {$sum: "$items.amount"}
                        } 
                    },
                    {
                        $project:{
                            _id: 0,
                            label: "$_id",
                            value: "$itemAmount"
                        }
                    }
            ]
        );

        if(!expenses){
            return res.status(500).json({
                success: false,
                message: "Expenses are undefined to create pie chart",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Successfully created pie chart data",
            data: expenses
        })        

    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: "Error while creating a pie chart",
            error: err
        });
    }
}