const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique: true
    },
    password: {
		type: String,
		required: true,
	},
    role:{
        type: String,
        enum:["Student", "Freelancer", "Traveller"],
        required: true
    },
	resetPasswordExpires: {
		type: Date,
	},
    token:{
        type: String,
    },
    resetPasswordToken:{
        type: String
    }
},{timestamps: true}
)

module.exports = mongoose.model("User", UserSchema);