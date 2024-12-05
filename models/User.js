const mongoose = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');

// Define the schema

const userSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true
        },

        password: {
            type: String,
        },
        email: {
            type: String,
        },
        active: {
            type: Boolean,
        }

    }

);


// this connects passport to our user model

userSchema.plugin(passportLocalMongoose);

// Define the schema class

const User = mongoose.model("User", userSchema);

// we export the constructor

module.exports = User;