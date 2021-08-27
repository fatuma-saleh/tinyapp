function generateRandomString() {
  const alphaNumeric = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890"
  randomShortUrl = ""
  for (let i = 0; i < 5; i++) {
    randomShortUrl += alphaNumeric.charAt(Math.floor(Math.random() * alphaNumeric.length))
  }
  return randomShortUrl;
}
//console.log(generateRandomString())

const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};



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
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL
  const longURL = urlDatabase[shortURL]
  res.redirect(longURL);
});

app.get("/urls/:shortURL", (req, res) => {

  const shortURL = req.params.shortURL
  const longURL = urlDatabase[shortURL]
  const templateVars = { shortURL, longURL }
  res.render("urls_show", templateVars);

});

app.post("/urls/:shortURL/delete", (req,res) => {
  console.log("+++")
  shortURL = req.params.shortURL
  delete urlDatabase[shortURL]
  res.redirect("/urls")
})

app.post("/urls", (req, res) => {
  //console.log("++++",req.body);  // Log the POST request body to the console
  //res.send("Ok");         // Respond with 'Ok' (we will replace this)
  const shortURL = generateRandomString();
  const longURL = req.body.longURL
  urlDatabase[shortURL] = longURL;
  //console.log(urlDatabase);
  res.redirect(`urls/${shortURL}`)
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});



