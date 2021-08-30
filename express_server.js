const generateRandomString = function () {
  const alphaNumeric = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
  let randomShortUrl = "";
  for (let i = 0; i < 5; i++) {
    randomShortUrl += alphaNumeric.charAt(Math.floor(Math.random() * alphaNumeric.length));
  }
  return randomShortUrl;
};
//console.log(generateRandomString())

const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
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
  const templateVars = { urls: urlDatabase, user: users[req.cookies["user_id"]] }
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  //const templateVars = { username: req.cookies["username"] };
  const templateVars = { user: users[req.cookies["user_id"]] };
  res.render("urls_new", templateVars);
});

// app.get("/u/:shortURL", (req, res) => {
//   const shortURL = req.params.shortURL;
//   const longURL = urlDatabase[shortURL];
//   res.redirect(longURL);
// });

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  if (!longURL) {
    res.send("Error: This is not a valid short URL")
  }
  res.redirect(longURL);
});



app.get("/urls/:shortURL", (req, res) => {

  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  //const templateVars = { shortURL, longURL, username: req.cookies["username"] };
  const templateVars = { shortURL, longURL, user: users[req.cookies["user_id"]] }
  console.log("++++",templateVars);

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
  urlDatabase[shortURL] = longURL;
  res.redirect("/urls");
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  //console.log(urlDatabase);
  res.redirect(`urls/${shortURL}`);
});

app.post("/login", (req, res) => {
 // console.log("+++r req.body", req.body)
  res.cookie('username', req.body.username)
  res.redirect("/urls")
})

app.post("/logout", (req, res) => {
  //console.log("+++r req.body", req.body)
  //res.cookie('username', req.body.username)
  res.clearCookie('username')
  res.redirect("/urls")
})

app.get("/register", (req, res) => {
  res.render("user-registration");
})

app.post("/register" ,(req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const userRandomId = generateRandomString();
  const newUser = { id: userRandomId,
  email:  email,
  password: password }
  users[userRandomId] = newUser;
  res.cookie('user_id', userRandomId)
  res.redirect("/urls");
  console.log("++++",users)
})
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}!`);
});



