const generateRandomString = function () {
  const alphaNumeric = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
  let randomShortUrl = "";
  for (let i = 0; i < 5; i++) {
    randomShortUrl += alphaNumeric.charAt(Math.floor(Math.random() * alphaNumeric.length));
  }
  return randomShortUrl;
};


const getUserByEmail = function (email,users) {
  for (user in users) {
    if (users[user].email === email) {
      return users[user];
    }
  }
  return null;
};

const urlsForUser = function (userID,urlDatabase){
  const urlsForUserObj = {};
  for (const shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === userID) {
      urlsForUserObj[shortURL] = urlDatabase[shortURL]; 
    }
  }
  return urlsForUserObj;
};

module.exports =  { getUserByEmail, generateRandomString, urlsForUser };