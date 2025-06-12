const jwt = require("jsonwebtoken");

function userMiddleware(req, res, next) {
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

        req.userId = decoded.id;
        next();
}

    catch (err) {
           return res.status(500).json({
            message : "internal server error" + err.message
           })
    }
}

module.exports = userMiddleware;
