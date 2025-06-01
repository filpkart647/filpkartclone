const jwt = require("jsonwebtoken")
require("dotenv").config();

const User =  require("../models/User")

exports.auth = async (req, res, next) =>{
    try {
    
        const token = req.header("Authorization").split(" ")[1];
        
        if(!token){
            return res.status(401).json({
                success : false,
                message : "Authentication required"
            })
        }
    
        const decode = jwt.verify(token, process.env.JWT_SECRET);
       
        req.user  = {...decode};

        next();

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            success : false,
            message : "Somthing went wrong ",
            error : error
        })
    }
}

exports.isUser = async (req, res, next)=>{
    try {
        if (req.user.accountType === 'User') {
            next();
        }
        else{
            return res.status(400).json({
                success : false,
                message : "Route is not accessble"
            })
        }
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            success : false,
            message : "Something went wrong in student role"
        })
    }
}


exports.isAdmin = async (req, res, next)=>{
    try {
        if (req.user.accountType === 'Admin') {
            next();
        }
        else{
            return res.status(400).json({
                success : false,
                message : "Route is not accessble"
            })
        }
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            success : false,
            message : "Something went wrong in Admin role"
        })
    }
}