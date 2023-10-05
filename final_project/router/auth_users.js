const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  let newUsers = users.filter((user) => {
    user.username === username;
  })
  if (newUsers.length > 0) {
    return true;
  }
  else return false;
}

const authenticatedUser = (username,password)=>{ //returns boolean
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false; 
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {

  const username = req.query.username;
  const password = req.query.password;
  req.session.username = username;
  if (!username || !password) {
      return res.status(404).send("Error logging in");
  }
  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
    };
    return res.status(300).send("User successfully logged in");
  } 
  else return res.status(404).send("Invalid Login. Check username and password");
}); 

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const user = req.session.username;
  console.log(user);
  if (!review) {
    return res.status(400).json({message: "Please provide a valid review"});
  }

  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  if (books[isbn].reviews[user]) {
    books[isbn].reviews[user] = review;
    return res.status(300).send("review updated successfully");
  }

  books[isbn].reviews[user] = review;
  // console.log(books);
  return res.json({message: "review added successfully"});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const user = req.session.username;
  const isbn = req.params.isbn;
  if (!books[isbn].reviews[user]) {
    return res.status(404).send("No review under this user is found");
  }
  delete books[isbn].reviews[user];
  // console.log(books);
  return res.status(200).send("The review under this user is successfully deleted");
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
