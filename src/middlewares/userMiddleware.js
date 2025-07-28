const jwt = require("jsonwebtoken");
const {userModel} = require("../config/db")


async function userMiddleware (req, res, next) {
    const authorization = req.headers.authorization;

    if(!authorization || !authorization.startsWith("Bearer ")){
        return res.status(401).json({
            message : "Token is missing"
        })
    }
 
    const token = authorization.split(" ")[1]; 

    try {
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(409).json({
                message: "Invalid token"
            })
        }

    const user = await userModel.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;        
    req.userId = user._id;
        
        next();
}

    catch (err) {
           return res.status(500).json({
            message : "internal server error" + err.message
           })
    }
}

module.exports = userMiddleware;
