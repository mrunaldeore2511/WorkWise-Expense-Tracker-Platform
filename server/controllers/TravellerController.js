const TravellerExpense = require("../models/TravellerExpense");
const axios = require("axios");
const mongoose = require("mongoose");
require("dotenv").config();


//getINRAmount
const getINRAmount = async(amount, currency) => {

    if(currency === "INR"){
        return amount;
    }

    const response = await axios.get(
    `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATE_API_KEY}/latest/INR`
    );

    const rate = response.data.conversion_rates[currency];
    if(!rate){
        throw new Error(`Unsupported Currency ${currency}`);
    }

    return amount / rate;
}
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

        let totalAmountINR = 0;
        let totalAmountOther = 0;

        const processedItems = [];

        for (const item of items) {
            const amount = Number(item.amount);
            const currency = item.currency || "INR";

            if (!item.itemName || isNaN(amount) || amount < 0) {
                throw new Error("Invalid item details");
            }

            const inrAmount = await getINRAmount(amount, currency);

            totalAmountINR += inrAmount;

            if (currency !== "INR") {
                totalAmountOther += amount;
            }

            processedItems.push({
                itemName: item.itemName,
                amount: inrAmount,
                currency
            });
        }

        let expenseDoc = await TravellerExpense.findOne({ userId, date });

        if (!expenseDoc) {
            expenseDoc = await TravellerExpense.create({
                userId,
                date,
                items: processedItems,
                totalAmountINR,
                totalAmountOther,
                note: note || ""
            });
        } else {
            expenseDoc = await TravellerExpense.findOneAndUpdate(
                { userId, date },
                {
                    $push: { items: { $each: processedItems } },
                    $inc: { totalAmountINR, totalAmountOther },
                    ...(note && { $set: { note } })
                },
                { new: true }
            );
        }

        return res.status(200).json({
            success: true,
            message: "Traveller expenses added successfully",
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
                message: "Traveller not present in DB",
            });   
        }
        const allTravellerExpense = await TravellerExpense.find({userId}).sort({date: -1});
        
        if(!allTravellerExpense){
            return res.status(402).json({
                success: false,
                message: "Cannot fetch all expenses for travellers",
            }); 
        }

        return res.status(200).json({
            success: true,
            message: "All Expenses of Traveller fetched successfully",
            data: allTravellerExpense
        }); 
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: "Error while fetching all expenses for traveller",
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

        const expenses = await TravellerExpense.find({
            userId: userId,
            date: {$gte: start , $lte: end},
        }).sort({date: 1});

        if(!expenses){
            return res.status(402).json({
                success: false,
                message: "No specified expenses found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Specified Expenses fetched successfully",
            data: expenses
        });
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: "Error while fetching specified expenses for traveller",
            error: err
        }); 
    }
}


const convertFromINR = async (amountINR, currency) => {
    if (currency === "INR") return amountINR;

    const response = await axios.get(
    `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATE_API_KEY}/latest/INR`
    );
    const rate = response.data.conversion_rates[currency];
    if (!rate) throw new Error(`Unsupported currency: ${currency}`);
    return amountINR * rate;
};

// getTravellerBarChart (INR + selected currency)
exports.getTravellerBarChart = async(req, res) => {
    try{
        const {currency, startDate, endDate} = req.body;
        const userId = req.user.id;
        if(!currency || !startDate || !endDate){
            return res.status(401).json({
                success: false,
                message: "All fields are required"
            })
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if(isNaN(start) || isNaN(end)){
            return res.status(401).json({
                success: false,
                message: "Invalid Date Format"
            })
        }

        end.setHours(23,59,59,999);
              
        const diffMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
        let barChartINR = [];
        let barChartOther = [];

        if(diffMonths < 1){

            const expense = await TravellerExpense.find({
                userId,
                date:{$gte:start, $lte: end}
            }).lean();

            const itemMapINR = {};
            const itemMapOther = {};

            for (const exp of expense) {
                for (const item of exp.items) {
                    const name = item.itemName;

                    if (!itemMapINR[name]) itemMapINR[name] = 0;
                    if (!itemMapOther[name]) itemMapOther[name] = 0;

                    const inrAmount = item.amount;
                    itemMapINR[name] += inrAmount;

                    if (currency === "INR") {
                        itemMapOther[name] += inrAmount;
                    } else {
                        const converted = await convertFromINR(inrAmount, currency);
                        console.log(`Converted ${inrAmount} INR to ${converted} ${currency} for item ${name}`);
                        itemMapOther[name] += converted;
                    }
                }
            }

            barChartINR = Object.keys(itemMapINR).map(name => ({
                label: name,
                value: Number(itemMapINR[name].toFixed(2))
            }));

            barChartOther = Object.keys(itemMapOther).map(name => ({
                label: name,
                value: Number(itemMapOther[name].toFixed(2))
            }));
        }
        else{

            // >= 30 days → month-wise
            const expenses = await TravellerExpense.find({
                userId,
                date: { $gte: start, $lte: end }
            }).lean();

            const monthMapINR = {};
            const monthMapOther = {};

            for (const exp of expenses) {
                const mLabel = `${exp.date.getFullYear()}-${(exp.date.getMonth() + 1).toString().padStart(2, "0")}`;

                if (!monthMapINR[mLabel]) monthMapINR[mLabel] = 0;
                if (!monthMapOther[mLabel]) monthMapOther[mLabel] = 0;

                for (const item of exp.items) {
                    // total INR
                    const itemINR =  item.amount;
                    monthMapINR[mLabel] += itemINR;

                    // total in requested currency
                    let itemOther = 0;
                    if (currency === "INR") {
                        itemOther = itemINR;
                    } else {
                        itemOther = await convertFromINR(item.amount, currency);
                    }
                    monthMapOther[mLabel] += itemOther;
                }
            }

            // Convert maps to arrays
            barChartINR = Object.keys(monthMapINR).sort().map(key => ({ label: key, value: monthMapINR[key] }));
            barChartOther = Object.keys(monthMapOther).sort().map(key => ({ label: key, value: monthMapOther[key] }));
        }

        return res.status(200).json({
            success: true,
            message: "Successfully fetched data for traverller bar chart",
            data: {barChartINR, barChartOther}
        })
    }
    catch(err){
        console.log(err);
        return res.status(400).json({
            success: false,
            message: "fail to fetched data for traverller bar chart",
            error: err
        })
    }
}

// getTravellerPieChart (INR + selected currency)
exports.getTravellerPieChart = async(req, res) =>{

    try{

        const userId = req.user.id;
        const{startDate, endDate,currency = "INR"} = req.body;

        if(!startDate || !endDate || !currency || ! userId){
            return res.status(401).json({
                success: false,
                message: "All fields are required",
            })   
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if(isNaN(start) || isNaN(end)){
            return res.status(401).json({
                success: false,
                message: "Invalid date format",
            })   
        }

        end.setHours(23,59,59,999);

        const expenses = await TravellerExpense.find({
            userId,
            date:{$gte: start, $lte:end}
        }).lean();


        if (!expenses || expenses.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No expenses found in this range",
            });
        }

        const itemsTotal = {};
        
        for(const doc of expenses){
            for(const item of doc.items){

                if(!itemsTotal[item.itemName]){
                    itemsTotal[item.itemName] = {inrAmount: 0, otherAmount:0}
                }

                itemsTotal[item.itemName].inrAmount += item.amount;

                itemsTotal[item.itemName].otherAmount += await convertFromINR(item.amount, currency); 
            
            }
        }
    
        const pieINR = [];
        const pieOther = [];

        for (const [itemName, amounts] of Object.entries(itemsTotal)) {
            pieINR.push({ label: itemName, value: amounts.inrAmount });
            pieOther.push({ label: itemName, value: amounts.otherAmount });
        }

        return res.status(200).json({
            success: true,
            message: "Pie chart data generated successfully",
            data: { pieINR, pieOther },
        });

    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: "Error while creating a pie chart",
            error: err
        });
    }
}