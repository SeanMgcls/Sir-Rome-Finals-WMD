const Course = require("../models/Course-Model.js");


module.exports.addCourse = (req, res) => {
    let {name, description, price} = req.body;
    let newCourse = new Course({
        name: name,
        description: description,
        price: price
    })

    return newCourse.save().then(result => {
        return res.send({
            code: "COURSE-ADDED",
            message: "The Course is now posted in the application",
            result: result
        })
        .catch(error => {
            res.send({
                code: "SERVER-ERROR",
                message: "We've encountered an error while adding the course. Please Try Again.",
                result: error
            })
        })
    })
}

//get all courses
module.exports.getAllCourses = (req, res) => {
    return Course.find({}).then(result => {
        if(result == null || result.length === 0){
            return res.send({
                code: "COURSE-EMPTY",
                message: "There is no added course yet"
            })
        }else{
            return res.send({
                code: "All-COURSES-RESULT",
                message: "Here are the list of course.",
                result: result
            })
        }
    })
}