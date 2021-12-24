const { userModel } = require("../../models/userModel")
const {
  jsSimple,
  encrypt,
  secureToken,
  statusCodes
} = require("../../utils");


exports.signUser = async (req, res)=>{
  // SIGN_IN USER
  try {
    // input validation
    const { username, password } = req.body;
    if(typeof username === "undefined" || typeof password === "undefined")
      throw {
        status:statusCodes.BAD_REQUEST,
        message:"Please make sure the you have entered both username and password!"
      }
    // get the user
    const foundUser = await userModel.findOne({username});
    // match the username
    if(foundUser===null)
      throw {
        status:statusCodes.NOT_AUTHORIZED,
        message:"Username has not matched!"
      }
    // match the password
    if(!await encrypt.match(password, foundUser.password))
      throw {
        status:statusCodes.NOT_AUTHORIZED,
        message:"Password has not matched!"
      }
    // Clone the user to mutate it and exclude
    const user = jsSimple.excludeFromObject(foundUser, "password __v");
    // Create a token
    const token = await secureToken.sign({
      username,
      role:user.role
    });
    // send
    res.json({user, token});
  } catch ({status, message}) {
    res.status(status || statusCodes.SERVER_ERROR).send(message);
  }
}


exports.authToken = async (req, res)=>{
  // AUTHENTICATE THE TOKEN
  try {
    if(typeof(req.body?.token) === "undefined")
      throw {
        status:statusCodes.BAD_REQUEST,
        message:"Access denied due to absence of authorization in the headers!"
      }
    const { username } = await secureToken.verfy(req.body?.token);
    const foundUser = await userModel.findOne({username});
    // Clone the user to mutate it
    const user = jsSimple.excludeFromObject(foundUser, "password __v");
    res.json(user);
  } catch ({status, message}) {
    res.status(status || statusCodes.FORBIDDEN).send(message);
  }
}


exports.verfyUserToken = async (req, res, next)=>{
  // VERFY HEADER AUTHORIZATION TOKEN AND SAVES ITS DATA INTO res.verfiedToken
  try {
    const token = req.headers?.authorization;
    if(typeof token === "undefined")
      throw {
        status:statusCodes.BAD_REQUEST,
        message:"Access denied due to absence of authorization in the headers!"
      }
    const verfiedToken = await secureToken.verfy(token);
    delete verfiedToken.iat;
    res.verfiedToken = verfiedToken;
    next();
  } catch ({status, message}) {
    res.status(status || statusCodes.FORBIDDEN).send(message);
  }
}


exports.verfyUser = async (req, res, next)=>{
  // VERFY HEADER AUTHORIZATION TOKEN AND USER AND SAVES ITS DATA INTO res.verfiedUser
  try {
    const token = req.headers?.authorization;
    if(typeof token === "undefined")
      throw {
        status:statusCodes.BAD_REQUEST,
        message:"Access denied due to absence of authorization in the headers!"
      }
    const { username } = await secureToken.verfy(token);
    // error if not wrong token provided
    res.verfiedUser = await userModel.findOne({username});
    if(res.verfiedUser === null)
      throw {
        status:statusCodes.NOT_AUTHORIZED,
        message:"Access denied due to absence of this username in the database!"
      }
    next();
  } catch ({status, message}) {
    res.status(status || statusCodes.FORBIDDEN).send(message);
  }
}


