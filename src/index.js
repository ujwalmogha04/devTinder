require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./routes/userRoutes");
const profileRouter = require("./routes/profileRoutes")
const requestRouter = require("./routes/requestRoute")
const app = express();

app.use(express.json());

app.use("/api/v1/user" , userRouter)
app.use("/api/v1/profile" , profileRouter)
app.use("/api/v1/request" , requestRouter)

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

