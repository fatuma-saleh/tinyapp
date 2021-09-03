
////////////////////////////////////////////
///CONSTANTS, LIBRARIES, MODULES AND MIDDLEWARE ///
///////////////////////////////////////////////

const { getUserByEmail, generateRandomString, urlsForUser } = require('./helpers');
const express = require("express");
const bcrypt = require('bcrypt');
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
const PORT = 8080;
//const cookieParser = require('cookie-parser');
//app.use(cookieParser());
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],
}));

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};
const users = {};


////////////////////////////////////////////
/////          Get Routes              //////
//////////////////////////////////////////////


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
  const userID = req.session["user_id"];
  if (userID) {
    const templateVars = { urls: urlsForUser(userID, urlDatabase), user: users[req.session["user_id"]] };
    return res.render("urls_index", templateVars);
  }
  return res.redirect("/login");
});

app.get("/urls/new", (req, res) => {
  const user = users[req.session["user_id"]];
  const templateVars = { user };
  if (user) {
    return res.render("urls_new", templateVars);
  }
  return res.redirect("/login");

});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const urlObj = urlDatabase[shortURL];
  if (!urlObj) {
    return res.status(400).send("This is not a valid short URL");
  }
  const longURL = urlObj.longURL;
  //const userID = urlObj.userID;
  res.redirect(longURL);

});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const urlObj = urlDatabase[shortURL];
  const userID = req.session["user_id"];
  if (!userID) {
    return res.redirect("/login");
  }
  if (!urlObj) {
    return res.status(400).send("The urls does not exist");
  }

  if (urlObj.userID !== userID) {
    return res.status(400).send("You can not change this url");
  }
  const longURL = urlObj.longURL;
  const templateVars = { shortURL, longURL, user: users[req.session["user_id"]] };
  res.render("urls_show", templateVars);

});

app.get("/register", (req, res) => {
  res.render("user_registration", { user: undefined });
});

app.get("/login", (req, res) => {
  res.render("user_login", { user: undefined });
});


////////////////////////////////////////////
/////          POST Routes              //////
//////////////////////////////////////////////


app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  //const longURL = req.body.longURL;
  const userID = req.session["user_id"];
  const urlObj = urlDatabase[shortURL];
  if (urlObj.userID !== userID) {
    return res.status(400).send("You can not delete this url");
  } else {
    delete urlDatabase[shortURL];
    res.redirect("/urls");
  }
});

app.post("/urls/:id", (req, res) => {
  const shortURL = req.params.id;
  const longURL = req.body.longURL;
  const userID = req.session["user_id"];
  const urlObj = urlDatabase[shortURL];
  if (!userID) {
    return res.redirect("/login");
  }
  if (!urlObj) {
    return res.status(400).send("The urls does not exist");
  }

  if (urlObj.userID !== userID) {
    return res.status(400).send("You can not change this url");
  }
  urlDatabase[shortURL].longURL = longURL;
  res.redirect("/urls");
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  const userID = req.session["user_id"];
  urlDatabase[shortURL] = { longURL, userID };
  res.redirect(`urls/${shortURL}`);
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = getUserByEmail(email, users);
  if (!user) {
    return res.status(403).send("User not found:Please register");
  }

  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(403).send("Invalid password");
  }
  req.session['user_id'] = user.id;
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");

});

app.post("/register", (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  if (email === "" || password === "") {
    return res.status(400).send("Enter all fields");
  }

  if (getUserByEmail(email, users)) {
    return res.status(400).send("Email already exists");
  }

  const userRandomId = generateRandomString();
  const newUser = { id: userRandomId, email, password: hashedPassword };
  users[userRandomId] = newUser;
  req.session['user_id'] = userRandomId;
  res.redirect("/urls");
});


app.listen(PORT, () => {
  console.log(`TinyApp Listening on port ${PORT}!`);
});



