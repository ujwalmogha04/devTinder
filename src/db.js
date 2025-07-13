const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 20
    },
    age: {
        type: Number
    },
    gender: {
        type: String,
        validate(value) {
            if ( value && !["male", "female", "others"].includes(value.toLowerCase())) {
                throw new Error("Not a valid gender")
            }
        }
    },

    photoUrl: {
        type: String,
        default: "https://example.com/default-profile.png"
    },
    skills: {
        type: [String]

    },
    about: {
        type: String,
        default: "Hey this section is about my skills"
    }
}, {
    timestamps: true
})

const userModel = mongoose.model("User", userSchema)

module.exports = {
    userModel,
}