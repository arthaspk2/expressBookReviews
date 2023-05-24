const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
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
  //Write your code here

    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }

    if (authenticatedUser(username,password)) {
        let accessToken = jwt.sign({
        data: password
        }, 'access', { expiresIn: 60 * 60 });

        req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({message: "Invalid Login. Check username and password"});
    }

  //return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  const book = books[isbn];
  const review = req.body.review;

  //return res.status(300).json({message: "Yet to be implemented"});

  if (book) { //Check is isbn exists
        if (username) {      
            //res.send(book);
            if(review) {
                const review_data = { user: username, comment: review };
                ;
                if (!Array.isArray(books[isbn].reviews)){
                    books[isbn].reviews = [];                    
                }

                const existingReviewIndex = books[isbn].reviews.findIndex(
                    (r) => r.user === username
                  );

                if (existingReviewIndex !== -1) {
                    // Si el usuario ya tiene una reseña, actualizarla                    
                    books[isbn].reviews[existingReviewIndex] = review_data;                   
                    res.send(`The user: ${username}, has updated his review to book: ${book.title}`);

                }else{
                    // Si el usuario no existe se agrega una nueva reseña
                    books[isbn].reviews.push(review_data);
                    res.send(`The user: ${username}, has added a new review to book: ${book.title}`);
                }                
            
            }else{
                res.send("Reseña no encontrada!");
            }
            
        }else{
            res.send("You must be login!");
        }
    
    }else{
    res.send("Unable to find isbn!");
}
});

regd_users.delete("/auth/review/:isbn", (req, res) => {

    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
    const book = books[isbn];
    if (book) { //Check is isbn exists
        if (username) {

                if (!Array.isArray(books[isbn].reviews)){
                    books[isbn].reviews = [];                    
                }

                const existingReviewIndex = books[isbn].reviews.findIndex(
                    (r) => r.user === username
                  );

                if (existingReviewIndex !== -1) {
                    // Si el usuario ya tiene una reseña, borrarla                  
                    books[isbn].reviews.splice(existingReviewIndex,1);                  
                    res.send(`The user: ${username}, has deleted his review to the book: ${book.title}`);

                }else{
                    // Si el usuario no tiene una reseña a borrar se informa                    
                    res.send(`The user: ${username}, does not have a review to delete for the book: ${book.title}`);
                }                
            
            
            
        }else{
            res.send("You must be login!");
        }
    
    }else{
    res.send("Unable to find isbn!");
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
