const generateRandomString = function () {
  const alphaNumeric = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
  let randomShortUrl = "";
  for (let i = 0; i < 5; i++) {
    randomShortUrl += alphaNumeric.charAt(Math.floor(Math.random() * alphaNumeric.length));
  }
  return randomShortUrl;
};

const isEmailExists = function (emailAddress) {
  for (user in users) {
    if (users[user].email === emailAddress) {
      return users[user];
    }
  }
  return false;
}

const urlsForUser = function (userID,urlDatabase){
  const keys = Object.keys(urlDatabase);
  let newUrls = keys.filter((key) => {
    const value = urlDatabase[key];
    return value.userID === userID
  })
  const obj ={};
  for(let url of newUrls){
    obj[url] = urlDatabase[url];
  }
  return obj;
}
//console.log(generateRandomString())

const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// const urlDatabase = {
//   "b2xVn2": "http://www.lighthouselabs.ca",
//   "9sm5xK": "http://www.google.com"
// };

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};

const users = {
  "aJ48lW": {
    id: "aJ48lW",
    email: "a@a.com",
    password: "1111"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "b@b.com",
    password: "2222"
  }
}

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  //const templateVars = { urls: urlDatabase, username: req.cookies["username"] };
  const userID = req.cookies["user_id"];
  console.log(req.cookies);
  if (req.cookies["user_id"]){
    //const templateVars = { urls: urlDatabase, user: users[req.cookies["user_id"]] }
    const templateVars = { urls: urlsForUser(userID,urlDatabase) , user: users[req.cookies["user_id"]] }
    return res.render("urls_index", templateVars);
  }
  return res.redirect("/login")
});

app.get("/urls/new", (req, res) => {
  //const templateVars = { username: req.cookies["username"] };
  const user = users[req.cookies["user_id"]]
  const templateVars = { user };
  if (user){
   return res.render("urls_new", templateVars);
  }
  return res.redirect("/login");
  
});


app.get("/u/:shortURL", (req, res) => {
  // const shortURL = req.params.shortURL;
  // const longURL = urlDatabase[shortURL];
  //console.log(req.body)
  const shortURL = req.params.shortURL;
  const urlObj = urlDatabase[shortURL]
  
  if (!urlObj) {
    return res.status(400).send("This is not a valid short URL")
  }
  const longURL = urlObj.longURL
  const userID = urlObj.userID
  res.redirect(longURL);

});

app.get("/urls/:shortURL", (req, res) => {

  const shortURL = req.params.shortURL;
  const urlObj = urlDatabase[shortURL]
 //console.log("++++++++", urlObj)
 const userID = req.cookies["user_id"]
 if (!userID){
   return res.redirect("/login");
 }
 if (!urlObj){
    return res.status(400).send("The urls does not exist");
 }

 if (urlObj.userID !== userID){
   return res.status(400).send("You can not change this url");
 }
   
  
  const longURL = urlObj.longURL;
  //const templateVars = { shortURL, longURL, username: req.cookies["username"] };
  const templateVars = { shortURL, longURL, user: users[req.cookies["user_id"]] }
  //console.log("++++", templateVars);
  res.render("urls_show", templateVars);

});

app.post("/urls/:shortURL/delete", (req, res) => {
  //console.log("+++")
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

app.post("/urls/:id", (req, res) => {
  const shortURL = req.params.id;
  const longURL = req.body.longURL;
  const userID = req.cookies["user_id"]
  const urlObj = urlDatabase[shortURL];
  if (!userID){
    return res.redirect("/login");
  }
  if (!urlObj){
     return res.status(400).send("The urls does not exist");
  }

  if (urlObj.userID !== userID){
    return res.status(400).send("You can not change this url");
  }
  //urlDatabase[shortURL] = { longURL, userID }
  urlDatabase[shortURL].longURL = longURL;
  res.redirect("/urls");
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  const userID = req.cookies["user_id"]
  urlDatabase[shortURL] = { longURL, userID }
  //console.log(urlDatabase);
  res.redirect(`urls/${shortURL}`);
});

app.post("/login", (req, res) => {
  // console.log("+++r req.body", req.body)
  //res.cookie('username', req.body.username)
  // const email = req.body.email;
  // const password = req.body.password;
  const { email, password } = req.body;
  const user = isEmailExists(email);

  if (!user) {
    return res.status(403).send("User not found")
  }

  if (user.password !== password ){
    return res.status(403).send("Invalid password")
  }

    res.cookie('user_id', user.id)
    res.redirect("/urls")

})

app.post("/logout", (req, res) => {
  //console.log("+++r req.body", req.body)
  //res.cookie('username', req.body.username)
  // res.clearCookie('username')
  // res.redirect("/urls")
  res.clearCookie("user_id");
  res.redirect("/urls")

})

app.get("/register", (req, res) => {
  res.render("user_registration", { user: undefined });
})

app.post("/register", (req, res) => {
  // const email = req.body.email;
  // const password = req.body.password;
  const { email, password } = req.body;
  if (email === "" || password === "") {
    return res.status(400).send("Enter all fields")
  }

  if (isEmailExists(email)) {
    return res.status(400).send("Email already exists")
  }

  const userRandomId = generateRandomString();
  const newUser = { id: userRandomId, email, password }
  users[userRandomId] = newUser;
  res.cookie('user_id', userRandomId)
  res.redirect("/urls");
  //console.log("++++",users)

})

app.get("/login", (req, res) => {
  res.render("user_login", { user: undefined });
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}!`);
});



