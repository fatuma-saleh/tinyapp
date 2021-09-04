//Generates and returns  a six digit random string

const generateRandomString = function() {
  const alphaNumeric = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
  let randomShortUrl = "";
  for (let i = 0; i < 6; i++) {
    randomShortUrl += alphaNumeric.charAt(Math.floor(Math.random() * alphaNumeric.length));
  }
  return randomShortUrl;
};

//checks for a user in users database with the  provided email and if found returns the user

const getUserByEmail = function(email,users) {
  for (const user in users) {
    if (users[user].email === email) {
      return users[user];
    }
  }
  return null;
};

//returns urls for the user with the provided userID

const urlsForUser = function(userID,urlDatabase) {
  const urlsForUserObj = {};
  for (const shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === userID) {
      urlsForUserObj[shortURL] = urlDatabase[shortURL];
    }
  }
  return urlsForUserObj;
};

module.exports =  { getUserByEmail, generateRandomString, urlsForUser };