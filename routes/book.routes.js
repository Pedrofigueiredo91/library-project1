// routes/book.routes.js

const router = require("express").Router();

const Book = require("../models/Book.model.js"); // <== add this line before your routes
const Author = require("../models/Author.model.js");
const AuthorModel = require("../models/Author.model.js");
// GET route to retrieve and display all the books
router.get("/books", (req, res, next) => {
  Book.find()
    .populate("author")
    .then((allTheBooksFromDB) => {
      // -> allTheBooksFromDB is a placeholder, it can be any word
      console.log("Retrieved books from DB:", allTheBooksFromDB);

      // we call the render method after we obtain the books data from the database -> allTheBooksFromDB
      res.render("books/books-list.hbs", { books: allTheBooksFromDB }); // pass `allTheBooksFromDB` to the view (as a variable books to be used in the HBS)
    })
    .catch((error) => {
      console.log("Error while getting the books from the DB: ", error);

      // Call the error-middleware to display the error page to the user
      next(error);
    });
});

// GET route to display the form
// CREATE: display form
router.get("/books/create", (req, res, next) => {
    Author.find()
        .then( authorsFromDB => {
            const data = {
                authors: authorsFromDB
            }
            res.render("books/book-create", data);
        })
        .catch((e) => {
            console.log("Error getting list of authors from DB", e);
            next(e);
        });
});

// POST route to save a new book to the database in the books collection
router.post("/books/create", (req, res, next) => {
  console.log(req.body);
  const { title, author, description, rating } = req.body;

  Book.create({ title, author, description, rating })
    //.then(bookFromDB => console.log(`New book created: ${bookFromDB.title}.`))
    .then(() => res.redirect('/books'))
    .catch(error => next(error));
});

router.get('/books/:bookId/edit', async (req, res, next) => {
    const { bookId } = req.params;

    try {
        const bookDetails = await Book.findById(bookId);
        const authors = await Author.find();

        const data = { 
            book: bookDetails, 
            authors: authors 
        }

        res.render('books/book-edit.hbs', data)
    } catch(error){
        next(error)
    }
});
router.post('/books/:bookId/edit', (req, res, next) => {
  const { bookId } = req.params;
  const { title, description, author, rating } = req.body;
 
  Book.findByIdAndUpdate(bookId, { title, description, author, rating }, { new: true })
    .then(updatedBook => res.redirect(`/books/${updatedBook.id}`)) // go to the details page to see the updates
    .catch(error => next(error));
});
// POST route to delete a book from the database
router.post('/books/:bookId/delete', (req, res, next) => {
  const { bookId } = req.params;
 
  Book.findByIdAndDelete(bookId)
    .then(() => res.redirect('/books'))
    .catch(error => next(error));
});
// GET route to retrieve and display details of a specific book
router.get("/books/:bookId", (req, res, next) => {
  const { bookId } = req.params;

  Book.findById(bookId)
    .populate("author")
    .then((theBook) => res.render("books/book-details.hbs", { book: theBook }))
    .catch((error) => {
      console.log("Error while retrieving book details: ", error);

      // Call the error-middleware to display the error page to the user
      next(error);
    });
});

module.exports = router;