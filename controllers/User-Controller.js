const User = require("../models/User-Model.js");
const bcryptjs = require("bcryptjs");
const auth = require("../auth.js");

module.exports.registerUser = (req,res) =>{
    let newUser = new User({
        firstName: req.body.firstName,
        middleName: req.body.middleName,
        lastName: req.body.lastName,
        email: req.body.email,
        contactNumber: req.body.contactNumber,
        password: bcryptjs.hashSync(req.body.password, 10)
    })
    return newUser.save().then(result => {
        res.send({
            code: "Registration Success",
            message: "You are now Registered",
            result: result
        })
    })
    .catch(error =>{
        res.send({
            code: "REGISTRATION ERROR",
            message: "We have encountered an error during the registration. PLease Try Again!",
            result: error
        })
    })
}

//User Login
module.exports.userLogin = (req, res) => {
    let {email, password} = req.body;
    return User.findOne({email: email}).then(result => {
        if(result == null){
            return res.send({
                code: "USER-NOT-REGISTERED",
                message: "Please register to Login."
            })
        }
        else{
            const isPasswordCorrect = bcryptjs.compareSync(password, result.password);
            if(isPasswordCorrect){
                return res.send({
                    code: "USER-REGISTERED",
                    token: auth.createAccessToken(result)
                })
            }
            else{
                return res.send({
                    code: "PASSWORD-INCORRECT",
                    message: "Incorrect password."
                })
            }
        }
    })
}

//Check email if existing
module.exports.checkEmail = (req, res) =>{
    let {email} = req.body;
    return User.find({email: email}).then(result => {
        if(result.length > 0){
            return res.send({
                code: "EMAIL-EXISTS",
                message: "The user is registered."
            })
        }else{
            return res.send({
                code: "EMAIL-NOT-EXISTING",
                message: "The user is not registered."
            })
        }
    })
}

module.exports.getProfile = (req, res) => {
    let { id } = req.body;  // Extracting the id from the request body

    // Using findById to search for the user by their MongoDB _id
    return User.findById(id)
        .then(result => {
            if (result) {
                const userWithMaskedPassword = result.toObject();
                
                // Replace the password field with asterisks
                if (userWithMaskedPassword.password) {
                    userWithMaskedPassword.password = '********';
                }

                return res.send({
                    code: "USER-EXISTS",
                    message: userWithMaskedPassword  // Return the user object with masked password
                });
            } else {
                // If the user is not found
                return res.send({
                    code: "ID-NOT-EXISTING",
                    message: "The user is not registered."  // User does not exist
                });
            }
        })
        .catch(error => {
            // Handle any errors that occur during the database query
            return res.status(500).send({
                code: "SERVER-ERROR",
                message: error.message
            });
        });
}
