// ROLES
// 0 = deactive
// 1 = root
// 2 = admin
// 3 = user
const {
  statusCodes
} = require('../../utils');

exports.canUpdateUser = (req, res, next) => {
  const {
    role,
    username
  } = res.verfiedUser;
  const {
    role: targetUserRole,
    username: targetUsername
  } = res.selectedUser;
  if (role === 1) { // root
    next();
  } else if ((role === 2) && (targetUserRole === 3 || targetUserRole === 0)) { // admin
    next();
  } else if (username === targetUsername) { // user
    next();
  } else {
    res.status(statusCodes.NOT_AUTHORIZED).send("You are not allowed to update or delete this user!");
  }
};


exports.canDeleteUser = (req, res, next) => {
  const {
    role,
    username
  } = res.verfiedUser;
  const {
    role: targetUserRole,
    username: targetUsername
  } = res.selectedUser;
  if (role === 1) { // root
    next();
  } else if ((role === 2) && (targetUserRole === 3 || targetUserRole === 0)) { // admin
    next();
  } else if (username === targetUsername) { // user
    next();
  } else {
    res.status(statusCodes.NOT_AUTHORIZED).send("You are not allowed to update or delete this user!");
  }
};