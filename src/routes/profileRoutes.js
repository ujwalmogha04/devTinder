const { Router } = require("express");
const { userModel } = require("../config/db");
const userMiddleware = require("../middlewares/userMiddleware");
const profileRouter = Router();


profileRouter.get("/", userMiddleware, async (req, res) => {
    try {
        const user = req.user;
        console.log(user);
        res.send(user);

    } catch (err) {
        res.status(400).json({
            message: "err" + err.message
        })
    }
})

profileRouter.patch("/edit", userMiddleware, async (req, res) => {
    const userId = req.userId
    const allowedEditFields = ["age", "photourl", "gender", "skills", "about", "name"]

    const isEditAllowed = Object.keys(req.body).every((field) =>
        allowedEditFields.includes(field))


    if (!isEditAllowed) {
        return res.status(400).json({ error: "Some fields are not allowed to be edited." });
    }

   

    try {
         const updatedUser = await userModel.findByIdAndUpdate(userId , { $set: req.body },
            { new: true, runValidators: true })
        
            if(!updatedUser){
                return res.status(404).json({
                    message : "user doesn't exists"
                })
            }

        res.status(200).json({
            message : `${updatedUser.name} your profile is updated successfully`, 
            user : updatedUser
        })
    }
    catch(err){
        res.status(400).json({
            message: "err" + err.message
        })
    }
 
})

module.exports = profileRouter;


// Objects.keys(req.body).forEach((key) => (updatedUser[key] = req.body[key]))