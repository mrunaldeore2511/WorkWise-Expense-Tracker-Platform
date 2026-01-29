const mongoose = require("mongoose");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    const token =
      req.cookies?.token ||
      (authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.replace("Bearer ", "")
        : null);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Missing Token",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();

  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Authentication Error",
      error: err.message,
    });
  }
};

exports.isStudent = async(req, res, next) => {
    try{
        if(req.user.role !== "Student"){
            return res.status(401).json({
                success:false,
                message: "Authorization Error",
            })
        }
        next();
    }
    catch(err){
        return res.status(401).json({
            success:false,
            message: "Authorization Error",
            error: err.message
        })       
    }
}

exports.isFreelancer = async(req, res, next) => {
    try{
        if(req.user.role !== "Freelancer"){
            return res.status(401).json({
                success:false,
                message: "Authorization Error",
            })
        }
        next();
    }
    catch(err){
        return res.status(401).json({
            success:false,
            message: "Authorization Error",
            error: err.message
        })       
    }
}

exports.isTraveller= async(req, res,next) => {
    try{
        if(req.user.role !== "Traveller"){
            return res.status(401).json({
                success:false,
                message: "Authorization Error",
            })
        }
        next();
    }
    catch(err){
        return res.status(401).json({
            success:false,
            message: "Authorization Error",
            error: err.message
        })       
    } 
}