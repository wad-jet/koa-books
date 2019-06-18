const Router = require('koa-router');
const router = new Router({ prefix: '/books' });
const setup = require('./router_setup');

module.exports = setup(router, ctx => ctx.deps.books);