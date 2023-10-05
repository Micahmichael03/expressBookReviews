const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const axios = require('axios');


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
      users.push({"username":username,"password":password});
      res.status(300).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json("User already exists!");
    }
  }
  res.status(404).send ("body empty");
});

public_users.get("/server/asynbooks", async function(req, res) {
    try {
      let response = await axios.get("http://127.0.0.1:3000/");
      console.log(response.data);
      return res.status(200).json(response.data);
    }
    catch (error) {
      console.error(error);
      return res.status(404).json({message: "Error getting book list"});
    }
  });

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify({books}, null, 4));
  return res.status(200).json({message: "Successful"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  // Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn]);
  // return res.status(300).json({message: "Yet to be implemented"});
 });

// use promise to get the detail of the book based on ISBN
public_users.get("/server/asyncbooks/isbn/:isbn", function(req, res) {
  const isbn = req.params.isbn;
  axios.get(`http://127.0.0.1:3000/isbn/${isbn}`)
  .then(response => {
    console.log(response.data);
    return res.status(200).send(response.data);
  })
  .catch(error => {
    console.log(error);
    return res.status(500).send("Error occurred");
  })
})


// Geting book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const authorBooks = []
  for (const book in books) {
    if (books[book].author === author) {
      authorBooks.push(books[book]);
    }
  }
  if (authorBooks.length > 0) {
    res.send(authorBooks);
  }
  else {
    res.status(404).send("No books found for this author");
  }

  // return res.status(300).json({message: "Yet to be implemented"});
});

public_users.get("/server/asyncbooks/author/:author", async (req, res) => {
  const author = req.params.author;
  try {
    const response = await axios.get(`http://127.0.0.1:3000/author/${author}`);
    return res.status(200).send(response.data);
  }
  catch(err) {
    return res.status(500).send("Error occurred");
  }
})

// Geting all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const titleBooks = [];
  for (const key in books) {
    if (books[key].title === title) {
      titleBooks.push(books[key]);
    }
  }
  if (titleBooks.length > 0) {
    res.send(titleBooks);
  }
  else {
    res.status(404).send("No title exists for any book");
  }
  // return res.status(300).json({message: "Yet to be implemented"});
});

public_users.get("/server/asyncbooks/title/:title", async (req, res) => {
  const title = req.params.title;
  try {
    const response = await axios.get(`http://127.0.0.1:3000/title/${title}`);
    return res.status(200).send(response.data);
  }
  catch(err) {
    return res.status(500).json({message: "Error occurred"});
  }
})

//  Geting the book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  // Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
  // return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
