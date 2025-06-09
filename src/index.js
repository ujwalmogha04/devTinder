require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const {userModel} = require("./db");
const userRouter = require("./routes/userRoutes");
const app = express();

app.use(express.json());

app.use("/api/v1/user" , userRouter)

async function main() {
    try {

        await mongoose.connect(process.env.MONGO_URL);
        
        app.listen(3000, () => {
            console.log("Server listening on port 3000")
        })
    }
    catch (err) {
        console.error("something went wrong", err); 
    }
}

main();

