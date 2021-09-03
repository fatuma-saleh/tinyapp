const { assert } = require('chai');
const { getUserByEmail, urlsForUser,generateRandomString }  = require('../helpers.js');

const testUsers = {
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
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers);
    const expectedOutput = "userRandomID";
    assert.equal(user,testUsers[expectedOutput]);
  });
  it('should return undefined for non existing email', function() {
    const user = getUserByEmail("user3@example.com", testUsers);
    // const expectedOutput = null;
    // assert.equal(null,expectedOutput)
    assert.isNull(user);
  });
});

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};


describe('urlsForUser', function() {
  it('should return urls that belong to the userID', function() {
    const userUrls = urlsForUser("aJ48lW", urlDatabase);
    const expectedOutput = "https://www.tsn.ca";
    assert.equal(userUrls.b6UTxQ.longURL,expectedOutput);
  });
  it('should return undefined if userID does not exist in urlDatabase', function() {
    const userUrls = getUserByEmail("b7yiA3", urlDatabase);
    const expectedOutput = undefined;
    assert.equal(userUrls,expectedOutput);
    //assert.isNull(user)
  });
});


describe('generateRandomString', function() {
  it('should return a string', function() {
    const randomString = generateRandomString();
    assert.isString(randomString);
  });

  it('should return random string of length six', function() {
    const randomString = generateRandomString();
    const expectedOutput = 6;
    assert.equal(randomString.length,expectedOutput);
  });
});