// modules required for routing
import express from 'express';
import { CallbackError } from 'mongoose';
const router = express.Router();
export default router;

// define the book model
import book from '../Models/books';

/* GET books List page. READ */
router.get('/', (req, res, next) => 
{
  // find all books in the books collection
  book.find( (err, books) => {
    if (err) {
      return console.error(err);
    }
    else {
      res.render('books/index', {
        title: 'Books',
        page: 'books',
        books: books
      });
    }
  });

});

//  GET the Book Details page in order to add a new Book
router.get('/add', (req, res, next) => {
  res.render('books/details', { 
    title: 'Add', 
    page: 'details', 
    books: ''})
});

// POST process the Book Details page and create a new Book - CREATE
router.post('/add', (req, res, next) => {
 // instantiate a new book to Add
 let newBook = new book
 ({
  "Title": req.body.title,
  "Price": req.body.price,
  "Author": req.body.author,
  "Genre": req.body.genre 
 });

 // Insert the new book object into the database
 book.create(newBook, function(err: CallbackError)
 {
   if(err)
   {
     console.error(err);
     res.end(err);
   }

   // new movie has been added -> refresh the movie-list
   res.redirect('/books');
 })

});

// GET the Book Details page in order to edit an existing Book
router.get('/:id', (req, res, next) => {
  let id = req.params.id;

  // pass the id to the db and read the book into the edit page
  book.findById(id, {}, {}, function(err, bookToEdit)
  {
    if(err)
    {
      console.error(err);
      res.end(err);
    }

    // show the edit view with the data
    res.render('books/details', {
       title: 'Edit',
        page: 'details', 
        books: bookToEdit})
  });
});

// POST - process the information passed from the details form and update the document
router.post('/:id', (req, res, next) => {
  let id = req.params.id;

  // instantiate a new Movie to Edit
  let updatedMovie = new Movie
  ({
    "_id": id,
    "Name": req.body.movieName,
    "Director": req.body.movieDirector,
    "Year": req.body.movieYear,
    "Rating": req.body.movieRating
  });

  // update the movie in the database
  Movie.updateOne({_id: id}, updatedMovie, function(err: CallbackError)
  {
    if(err)
    {
      console.error(err);
      res.end(err);
    }

    // edit was successful -> go to the movie-list page
    res.redirect('/books');
  });
});

// GET - process the delete by user id
router.get('/delete/:id', (req, res, next) => {

     let id = req.params.id;
     // pass the id to the database and delete the movie
     book.remove({_id:id}, function(err: CallbackError)
     {
       if(err)
       {
         console.error(err);
         res.end(err);
       }
       // delete was successful
       res.redirect('/books');
     });
});


//module.exports = router;
