const userModel = require('./../models/user-model')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const mailServise = require('./mail-service')
const tokenServise = require('./token-service')
const UserDto = require('./../dtos/user-dtos')
const ApiError = require('../exceptions/api-error')


class UserServise {
  async registration(email,password){
const candidate = await userModel.findOne({email})
if(candidate){
    console.log(candidate)
    throw ApiError.BadRequest('User with this email already exsist.')
}
const hashPassword = await bcrypt.hash(password,3)
const activationLink = uuid.v4()
const user = await userModel.create({email,password:hashPassword,activationLink})
await mailServise.sendActivationMail(email,`${process.env.API_URL}/api/activate/${activationLink}`);
const userDto= new UserDto(user);
const tokens = tokenServise.generateTokens({...userDto});

await tokenServise.saveToken(userDto.id, tokens.refreshToken);
return {...tokens,user:userDto}
  }

  async activate(activationLink){
    const user = await userModel.findOne({activationLink})
    if(!user){
      throw ApiError.BadRequest('Incorrect activation link.')
    }
    user.isActivated = true;
    await user.save()
  }

  async login(email,password){
    const user = await userModel.findOne({email});
    if(!user){
      throw ApiError.BadRequest('User with this email not found')

    }
    const isPassEqual  = await bcrypt.compare(password,user.password);
    if(!isPassEqual){
      throw ApiError.BadRequest('Incorrect password')
    }
    const userDto = new UserDto(user);
    const tokens =  tokenServise.generateTokens({...userDto})
    await tokenServise.saveToken(userDto.id, tokens.refreshToken);
return {...tokens,user:userDto}
  }

  async logaut(refreshToken){
     const token = await tokenServise.removeToken(refreshToken)
     return token
  }
  async refresh (refreshToken){
    if(!refreshToken){
      throw ApiError.UnautorizedError()
    }
    const userData = tokenServise.validateRefreshToken(refreshToken)
    const tokenFromDb = await tokenServise.findToken(refreshToken)
    if(!userData || !tokenFromDb){
      throw ApiError.UnautorizedError()
    }
    const user = await userModel.findById(userData.id)
    const userDto = new UserDto(user);
    const tokens =  tokenServise.generateTokens({...userDto})
    await tokenServise.saveToken(userDto.id, tokens.refreshToken);
return {...tokens,user:userDto}
  }
  async getAllUsers(){
   
    const users = await userModel.find()
   return users;
  }
}

module.exports = new UserServise()