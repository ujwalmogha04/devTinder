const { Router } = require("express");
const { userModel } = require("../db");
const bcrypt = require("bcryptjs");
const userMiddleware = require("../middlewares/userMiddleware");
const jwt = require("jsonwebtoken");
const userRouter = Router();

userRouter.post("/signup", async (req, res) => {
    const { username, name, password } = req.body;
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
            password: hashedPassword
        })

        return res.status(201).json({
            message: "user created succesfully"
        })

    }
    catch (err) {
        return res.status(500).json({
            message: "Internal server error"
        })
    }
})

userRouter.post("/signin", async (req, res) => {
    const { username, password } = req.body;
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
    const { name, password, username } = req.body;
    try {
        const existingUser = await userModel.findOne({ username });

        if (!existingUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const updateData = {};

        if (name) updateData.name = name;
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateData.password = hashedPassword;
        }

        await userModel.updateOne({ username }, { $set: updateData });

        return res.status(200).json({
            message: "User updated successfully"
        })
    }
    catch (err) {
        return res.status(500).json({
            message: "Internal server error"
        })
    }
})

userRouter.delete("/delete", userMiddleware ,  async (req, res) => {
    const { username } = req.body;

    try {
        const deletedUser = await userModel.findOneAndDelete({ username });

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
        return res.status(500).json({
            message: "Internal server error"
        })
    }
})

module.exports = userRouter;