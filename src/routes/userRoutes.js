const { Router } = require("express");
const { userModel } = require("../db");
const bcrypt = require("bcryptjs");
const userMiddleware = require("../middlewares/userMiddleware");
const jwt = require("jsonwebtoken");
const {userSignUpSchema , userSignInSchema} = require("../schema")
const userRouter = Router();

userRouter.post("/signup", async (req, res) => {
    const { username, name, password } = req.body;

    const validateSchema = userSignUpSchema.safeParse({username , password , name});

    if(!validateSchema.success){
          return res.status(400).json({
             message : "Schema validation failed",
             error : validateSchema.error.errors
          })
    }
    try {
        const existingUser = await userModel.findOne({ username });

        if (existingUser) {
            return res.status(409).json({
                message: "user already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await userModel.create({
            username,
            name,
            password: hashedPassword,

        })

        return res.status(201).json({
            message: "user created succesfully"
        })

    }
    catch (err) {
        return res.status(500).json({
            message: "Internal server error" + err.message
        })
    }
})

userRouter.post("/signin", async (req, res) => {
    const { username, password } = req.body;

    const validateSchema = userSignInSchema.safeParse({username , password})

    if(!validateSchema.success){
          return res.status(401).json({
            message : "Schema validation failed",
             error : validateSchema.error.errors
          })
    }

    try {
        const existingUser = await userModel.findOne({ username });

        if (!existingUser) {
            return res.status(404).json({
                message: "user doesn't exists signup first"
            })
        }

        const matchedPassword = await bcrypt.compare(password, existingUser.password)

        if (!matchedPassword) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        
        const token = jwt.sign({
                 id : existingUser._id
        } , process.env.JWT_SECRET , {
            expiresIn : "1h"
        });

        return res.status(200).json({
            message: "signin sucessfully",
            token
        })

    }
    catch (err) {
        return res.status(500).json({
            message: "Internal server error" + err.message
        })
    }
})

userRouter.patch("/update", userMiddleware , async (req, res) => {
    const { name, password} = req.body;
    const userId = req.userId;
    try {
        const existingUser = await userModel.findById({_id :userId});

        if (!existingUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const updateData = {};

        if (name) updateData.name = name;
        if (password) {
            const isSamepassword = await bcrypt.compare(password , existingUser.password)
            if(!isSamepassword){
                const hashedPassword = await bcrypt.hash(password, 10);
                updateData.password = hashedPassword;
            }
            else {
                return res.status(400).json({
                    message : "New password cannot be same as the old one"
                })
            }
            
        }

        await userModel.updateOne({_id : userId }, { $set: updateData } , {runValidators: true});

        return res.status(200).json({
            message: "User updated successfully"
        })
    }
    catch (err) {
        console.error("Delete user error:", err);
        return res.status(500).json({
            message: "Internal server error" 
        })
    }
})

userRouter.delete("/delete", userMiddleware ,  async (req, res) => {
    const userId = req.userId;

    try {
        const deletedUser = await userModel.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "User deleted successfully"
        });
    }
    catch (err) {
        console.error("Delete user error:", err);
        return res.status(500).json({
            message: "Internal server error" 
        })
    }
})

module.exports = userRouter;