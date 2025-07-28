const z = require("zod");

const userSignUpSchema = z.object({
    username : z.string().email({message : "Invalid email format"}),
    name : z.string().min(3 , {message : "Name must be at least 3 characters Long"}),
    password : z.string().min(4)
})


const userSignInSchema = z.object({
    username : z.string().email({message : "Inavlid email format "}),
    password : z.string().min(4)
})

module.exports = {
    userSignUpSchema,
    userSignInSchema
}