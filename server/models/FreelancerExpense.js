const mongoose = require("mongoose");

const FreelancerExpenseSchema = new mongoose.Schema({
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
            gst:{
                type:Number,
                default: 0.18,

            }
        }
    ],
    totalAmount : {
        type: Number,
        required: true,
        min : 0
    },
    baseAmount:{
        type:Number,
        required: true,
        min : 0
    },
    totalGST: {
        type: Number,
        required: true,
        min: 0
    },
    note: {
        type: String,
        default: " "
    }

},{timestamps: true})
FreelancerExpenseSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("FreelancerExpense", FreelancerExpenseSchema)