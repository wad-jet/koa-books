const Router = require('koa-router');
const router = new Router({ prefix: '/authors_books' });
const setup = require('./router_setup');

module.exports = setup(router, ctx => ctx.deps.authors_books);