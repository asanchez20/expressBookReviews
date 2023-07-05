const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username
  const password = req.body.password
  if(username && password) {
      if(!isValid(username)){
          users.push({"username":username,"password":password});
          return res.status(200).json({message: "User Successfully registered"})
      } else {
          return res.status(404).json({message: "User with the same username already exists"})
      }
  }
  return res.status(404).json({message: 'unable to register user'})
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  const get_books = new Promise((resolve, reject) => {
      resolve(res.send(JSON.stringify({books}, null ,4)))
  })
  get_books.then(() => console.log("Promise for Task 10 resolved"))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    get_books_isbn = new Promise((resolve, reject) => {
        let isbn = parseInt(req.params.isbn)
        resolve(res.send(books[isbn]))
    })
    get_books_isbn.then(() => console.log("Promise for task 11 resolved"))
})
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const get_books_author = new Promise((resolve, reject) => {

        let booksbyauthor = [];
        let isbns = Object.keys(books);
        isbns.forEach((isbn) => {
          if(books[isbn]["author"] === req.params.author) {
            booksbyauthor.push({"isbn":isbn,
                                "title":books[isbn]["title"],
                                "reviews":books[isbn]["reviews"]});
          resolve(res.send(JSON.stringify({booksbyauthor}, null, 4)));
          }
    
    
        });
        reject(res.send("The mentioned author does not exist "))
            
        });
    
        get_books_author.then(function(){
                console.log("Promise is resolved");
       }).catch(function () { 
                    console.log('The mentioned author does not exist');
      });
    
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const books_by_title = new Promise((resovle, reject) => {
  let getbooksbytitle = [];
  let isbns = Object.keys(books)
  isbns.forEach((isbn) => {
      if(books[isbn]["title"] === req.params.title){
          getbooksbytitle.push({
              'isbn':isbn,
              'author':books[isbn]["author"],
              'reviews':books[isbn]["reviews"]})
              return res.send(JSON.stringify(({getbooksbytitle},null,4)));
      }
  })
  reject(res.send("The mentioned title does not exist"))
})

books_by_title.then(function(){
    console.log("Promise resolved")
}).catch(function(){
    console.log("The mentioned title doesnt exist")
})
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn
  return res.send(books[isbn]["reviews"],null,4);
});

module.exports.general = public_users;
