const Koa = require('koa');

const authorsRouter = require('./routers/authors.router');
const booksRouter = require('./routers/books.router');
const authorsBooksRouter = require('./routers/authors_books.router');

function createApp(dependencies = {}) {
    const app = new Koa()
    app.context.deps = dependencies;
    app.use(authorsRouter.routes()).use(authorsRouter.allowedMethods());
    app.use(booksRouter.routes()).use(booksRouter.allowedMethods());
    app.use(authorsBooksRouter.routes()).use(authorsBooksRouter.allowedMethods());
    return app
}
module.exports = createApp