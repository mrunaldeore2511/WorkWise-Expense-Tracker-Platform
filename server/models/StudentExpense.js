const mongoose = require("mongoose");

const StudentExpenseSchema = new mongoose.Schema({
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
            }
        }
    ],
    totalAmount : {
        type: Number,
        required: true,
        min:0
    }

},{timestamps: true})

StudentExpenseSchema.index({ userId: 1, date: 1 }, { unique: true });
module.exports = mongoose.model("StudentExpense", StudentExpenseSchema)