const AuthorsService = require('./services/authors.service');
const BooksService = require('./services/books.service');
const AuthorsBooksService = require('./services/authors_books.service');
const PORT = process.env.PORT || 3000;

const dbConnectionSettings = {
    host     : 'localhost',
    user     : 'root',
    password : 'qwerty',
    database : 'books'
}

const app = require('./app'); 
const dependencies = { 
    authors: new AuthorsService(dbConnectionSettings),
    books: new BooksService(dbConnectionSettings),
    authors_books: new AuthorsBooksService(dbConnectionSettings),
}; 
app(dependencies).listen(PORT);