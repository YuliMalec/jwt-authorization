  const userServise =  require('./../servise/user-servise')
  const {validationResult} = require('express-validator')
  const ApiError = require('./../exceptions/api-error')
  
  class UserController{
     async registration(req,res,next){
        try{
            const errors = validationResult(req)
            if(!errors.isEmpty()){
              return  next(ApiError.BadRequest('Error during validation',errors.array()))
            }
            const {email,password} = req.body;
            const userData = await userServise.registration(email,password)
            console.log(userData)
            res.cookie('refreshToken',userData.refreshToken,{maxAge:30*24*60*60*1000,httpOnly:true})
            return res.json(userData)
        }catch(e){
            next(e)
        }
     }
     async login(req,res,next){
        try{
            const {email,password}=req.body
            const userData = await userServise.login(email,password)
            res.cookie('refreshToken',userData.refreshToken,{maxAge:30*24*60*60*1000,httpOnly:true})
            return res.json(userData)

        }catch(e){
            next(e)
        }
     }
     async logaut(req,res,next){
        try{
        const {refreshToken} = req.cookies
        const token = await userServise.logaut(refreshToken)
        res.clearCookie('refreshToken')
        res.json(token)

        }catch(e){
            next(e)
        }
     }
     async activate(req,res,next){
        try{
         const activationLink=req.params.link;
         await userServise.activate(activationLink)
         return res.redirect(process.env.CLIENT_URL )
        }catch(e){
            next(e)
        }
     }
     async refresh(req,res,next){
        try{
            const {refreshToken} = req.cookies;
            const userData = await userServise.refresh(refreshToken)
            res.cookie('refreshToken',userData.refreshToken,{maxAge:30*24*60*60*1000,httpOnly:true})
            return res.json(userData)


        }catch(e){
            next(e)
        }
     }
     async getUsers(req,res,next){
        try{
const users = await userServise.getAllUsers()
return res.json(users)
        }catch(e){
            next(e)
        }
     }
}

module.exports = new UserController()