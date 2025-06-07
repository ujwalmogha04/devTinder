require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const {userModel} = require("./db");
const app = express();


async function main() {
    try {

        await mongoose.connect(process.env.MONGO_URL);

        const existing = await userModel.findOne({ username: "test1" });
        if (!existing) {
            const testUser = await userModel.create({
                username: "test1",
                password: "12345"
            });
            console.log(" Test user created");
        } else {
            console.log("Test user already exists.");
        }
        app.listen(3000, () => {
            console.log("Server listening on port 3000")
        })
    }
    catch (err) {
        console.error("something went wrong", err); 
    }
}

main();

