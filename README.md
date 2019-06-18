# MySql model in file
/db/books_model.mwb

# Routers

/books
/authors
/authors_books

# Filtering

Example:
POST http://localhost:3000/books/filter?offset=0&limit=15&sort=date asc, title asc
application/json
{
    "description": "%программ%"
}
