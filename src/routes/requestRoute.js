const {Router} = require("express");
const userMiddleware = require("../middlewares/userMiddleware");
const requestRouter = Router();

requestRouter.post("/sendConnectionRequest" , userMiddleware , async(req , res) =>{
     const user = req.user;

     console.log("sending a connection request");

     res.send(user.name +  "sent the connection request");
});

module.exports =  requestRouter;
