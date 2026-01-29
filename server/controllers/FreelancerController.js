const FreelancerExpense = require("../models/FreelancerExpense");
const mongoose = require("mongoose");
// addExpense
exports.addExpense = async(req, res) => {

    try{

        const {items, note} = req.body;
        const userId = req.user.id;

        if(!Array.isArray(items) || items.length === 0){
            return res.status(402).json({
                success: false,
                message: "Please fill the items"
            })
        }

        const date = new Date();
        date.setHours(0 ,0,0,0);

        let totalAmount = 0;
        let baseAmount = 0;
        let totalGST = 0;

        const processedItems = items.map(item => {
            const finalAmount = Number(item.amount);
            const gstRate = Number(item.gst ? item.gst/100 : 18/100);

            if(!finalAmount || isNaN(gstRate) || gstRate < 0 || finalAmount < 0 || !item.itemName){
                throw new Error("Invalid item details");
            }

            const gstValue = finalAmount * gstRate;
            const base = finalAmount - gstValue;

            totalAmount += finalAmount;
            baseAmount += base;
            totalGST += gstValue;

            return {
                itemName: item.itemName,
                amount: finalAmount,
                gst: gstRate
            }
        });

        if(!processedItems){
            return res.status(401).json({
                success: false,
                message: "Cannot process the items"
            })
        }

        let expenseDoc = await FreelancerExpense.findOne({userId, date: date});

        if(!expenseDoc){
            expenseDoc = await FreelancerExpense.create({
                userId,
                date : date,
                items: processedItems,
                totalAmount: totalAmount,
                baseAmount: baseAmount,
                totalGST : totalGST,
                note : note || ""
            })
        }
        else{
            expenseDoc = await FreelancerExpense.findOneAndUpdate(
                {userId, date: date},
                {
                    $push : {items: {$each:processedItems}},
                    $inc : {totalAmount, baseAmount, totalGST},
                    ...(note && {$set:{note}})

                },
                {new: true}             
            )
        }

        return res.status(200).json({
            success: true,
            message: "Items added successfully for the day",
            data: expenseDoc
        });   
    }
    catch(err){
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
                message: "Freelancer not present in DB",
            });   
        }
        const allFreelancerExpenses = await FreelancerExpense.find({userId}).sort({date: -1});
        
        if(!allFreelancerExpenses){
            return res.status(402).json({
                success: false,
                message: "Cannot fetch all expenses for freelancer",
            }); 
        }

        return res.status(200).json({
            success: true,
            message: "All Expenses of Freelancer fetched successfully",
            data: allFreelancerExpenses
        }); 
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: "Error while fetching all expenses for freelancer",
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

        const expenses = await FreelancerExpense.find({
            userId: userId,
            date: {$gte: start , $lte: end},
        }).sort({date: 1});

        if(!expenses){
            return res.status(402).json({
                success: false,
                message: "No specified expenses found",
            });
        }

    // IMPORTANT FIX
        const flattenedItems = expenses.flatMap(expense =>
            expense.items.map(item => ({
                date: expense.date,
                itemName: item.itemName,
                amount: item.amount,
                gst: item.gst,
            }))
        );

        // const otherData = expenses
        return res.status(200).json({
            success: true,
            message: "Specified Expenses fetched successfully",
            data: {flattenedItems, expenses}
        });
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: "Error while fetching specified expenses for freelancer",
            error: err
        }); 
    }
}


// getTotalAmount (base amount, including GST)
exports.getTotalAmount = async(req, res) => {

    try{
        const userId = req.user.id;
        if(!userId){
            return res.status(402).json({
                success: false,
                message: "User not found",
            }); 
        }

        const expenses = await FreelancerExpense.find({userId: userId});
        if(!expenses){
            return res.status(402).json({
                success: false,
                message: "No expenses found for the student",
            }); 
        }

        const totalAmount = expenses.reduce((sum, doc) => sum + doc.totalAmount, 0);
        const baseAmount = expenses.reduce((sum, doc) => sum + doc.baseAmount, 0);
        const totalGST = expenses.reduce((sum, doc) => sum + doc.totalGST, 0);

        return res.status(200).json({
            success: true,
            message: "Amount are Fetched SuccessFully",
            data: {totalAmount, baseAmount, totalGST}
        }); 
        
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: "Error while fetching amount for freelancer",
            error: err
        });  
    }
}


// getFreelancerBarChart (amount + GST )
exports.getFreelancerBarChart = async(req, res) =>{

    try{
        const userId = req.user.id;
        console.log("FREE", req.body);
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
        let barChartGST = [];

        if(diffMonths < 1) {
            const expenses = await FreelancerExpense.aggregate(
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
                        totalGST : {$sum : {$multiply : ["$items.amount", "$items.gst"]}}
                    }},
                    {
                        $project : {
                            _id: 0,
                            label: "$_id",
                            value: "$totalAmount",
                            gst : "$totalGST"
                        }
                    }
                ]
            );
            barChartAmount = expenses.map((doc) => ({
                label: doc.label,
                value: doc.value
            }));
            
            barChartGST = expenses.map((doc) => ({
                label: doc.label,
                value: doc.gst
            }));
        }
        else{
            const expenses = await FreelancerExpense.aggregate(
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
                        totalGST : {$sum : "$totalGST"}
                    }},
                    {
                        $project : {
                            _id: 0,
                            label: { $concat: [{ $toString: "$_id.year" }, "-", { $toString: "$_id.month" }] },
                            value: "$totalAmount",
                            gst : "$totalGST"
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
            
            barChartGST = expenses.map((doc) => ({
                label: doc.label,
                value: doc.gst
            }));
        }
        return res.status(200).json({
            success: true,
            message: "Successfully created bar chart data",
            data: {barChartAmount, barChartGST}
        })        

    }
    catch(err){
        console.log("ERROR", err);
        return res.status(500).json({
            success: false,
            message: "Error while creating a bar chart",
            error: err
        });
    }
}

// getFreelancerPieChart (amount + GST )

exports.getFreelancerPieChart = async(req, res) =>{

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

        let pieChartAmount = [];
        let pieChartGST = [];

        const expenses = await FreelancerExpense.aggregate(
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
                        totalGST : {$sum : {$multiply : ["$items.amount", "$items.gst"]}}
                    }},
                    {
                        $project : {
                            _id: 0,
                            label: "$_id",
                            value: "$totalAmount",
                            gst : "$totalGST"
                        }
                    }
                ]
            );
            pieChartAmount = expenses.map((doc) => ({
                label: doc.label,
                value: doc.value
            }));
            
            pieChartGST = expenses.map((doc) => ({
                label: doc.label,
                value: doc.gst
            }));
       
        return res.status(200).json({
            success: true,
            message: "Successfully created bar chart data",
            data: {pieChartAmount, pieChartGST}
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