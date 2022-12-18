const UserModel = require("../Model/UserModel")
const jwt = require("jsonwebtoken");
const maxAge = 3 * 24 * 60 * 60

const createToken = (id) =>{
    return jwt.sign({id},"chathura",{
        expiresIn: maxAge,
    });
 }

 

 const handleErrors = (err) =>{
    let errors = {email:"" , password:""}
    console.log("error message is " + err.message)
    if(err.message === "incorrect Email"){
        errors.email = "That email is not registerd"
        return errors
    }
    if(err.message === 'incorrect password'){
        console.log("erro passoword set")
        errors.email = "That password  is incorrect"
        return errors
    }
    
    if(err.code === 11000) {
        errors.email = "Email is already registerd";
        return errors
    }
    if(err.message.includes("Users validation failed")){
        console.log("********** included *********************")
        Object.values(err.errors).forEach(({properties})=>{
            errors[properties.path] =properties.message;
        })
         return errors
    }
       
 }

module.exports.register = async (req ,res, next) => {
    try{
        const {email, password} = req.body;
        const user = await UserModel.create({email,password});
        const token = createToken(user._id)

        res.cookie("jwt",token,{
            withCrdentials:true,
            httpOnly:false,
            maxAge: maxAge * 1000,
        })

        res.status(201).json({user:user._id,created:true});
}
    catch(err){

        console.log(err);
        const errors = handleErrors(err);
        res.json({errors,created: false});

    }
}




module.exports.login = async (req ,res, next) => {
    try{
        const {email, password} = req.body;
        const user = await UserModel.login(email,password);
        const token = createToken(user._id)

        res.cookie("jwt",token,{
            withCrdentials:true,
            httpOnly:false,
            maxAge: maxAge * 1000,
        })

        res.status(200).json({user:user._id,created:true});
}
    catch(err){

        console.log(err);
        const errors = handleErrors(err);
        res.json({errors,created: false});

    }
    
}