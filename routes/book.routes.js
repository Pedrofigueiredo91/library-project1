// routes/book.routes.js

const router = require("express").Router();

const Book = require("../models/Book.model.js"); // <== add this line before your routes

// GET route to retrieve and display all the books
router.get("/books", (req, res, next) => {
  Book.find()
    .then((allTheBooksFromDB) => {
      // -> allTheBooksFromDB is a placeholder, it can be any word
      console.log("Retrieved books from DB:", allTheBooksFromDB);

      res.render("books/books-list.hbs");
    })
    .catch((error) => {
      console.log("Error while getting the books from the DB: ", error);

      // Call the error-middleware to display the error page to the user
      next(error);
    });
});

module.exports = router;
