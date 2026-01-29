const mongoose = require("mongoose");

const TravellerExpenseSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref: "User"
    },
    date:{
        default:Date.now,
        type:Date
    },
    items: [
        {
            itemName: {
                type: String,
                required: true
            },
            amount: {
                type: Number,
                required: true,
                min: 0
            },
            currency:{
                type:String,
                default: "INR",
                required: true
            }
        }
    ],
    totalAmountOther : {
        type: Number,
        min : 0,
        default: true
    },
    totalAmountINR:{
        type: Number,
        min : 0,
        required: true
    },
    note: {
        type: String,
        default: " "
    }

},{timestamps: true})
TravellerExpenseSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("TravellerExpense", TravellerExpenseSchema)