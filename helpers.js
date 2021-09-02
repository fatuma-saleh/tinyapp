const getUserByEmail = function (email,users) {
  for (user in users) {
    if (users[user].email === email) {
      return users[user];
    }
  }
  return false;
}
module.exports = getUserByEmail;