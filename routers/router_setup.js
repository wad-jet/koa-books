const Router = require('koa-router');
const koaBody = require('koa-body')
const crypto = require('crypto');
const util = require('util');

function setup (router, getService) {
    if (!router instanceof Router)
        throw new Error('The router argument is not an instance of the Router class.');

    const setBody = function(ctx, data, modified) {
        let content = null;

        if (!util.isNullOrUndefined(data)) {
            if (typeof data === "object")  {
                ctx.set('Content-Type', 'application/json')
                content = JSON.stringify(data);
            }
            else if (typeof data === 'string') {
                ctx.set('Content-Type', 'text/plain');
                content = data;
            }
        }

        if (!!modified) {
            const ifModifiedSince = ctx.header["if-modified-since"];
            if (!!ifModifiedSince) {
                const ifModifiedSinceDate = new Date(ifModifiedSince);
                if (modified.getTime() == ifModifiedSinceDate.getTime()) {
                    return ctx.status = 304;
                }
            }
            ctx.response.lastModified = modified;
        }

        if (content !== null) {
            const ifNoneMatch = ctx.header["if-none-match"];
            const etag = crypto.createHash('md5').update(content).digest('hex');
            if (ifNoneMatch === `"${etag}"`) {
                return ctx.status = 304;
            }
            ctx.response.etag = etag;
            ctx.body = content;
        }
    }

    router
        .post('/filter', koaBody(), async (ctx) => {
            ctx.status = 200;
            const result = await getService(ctx).filter(ctx.query, ctx.request.body);
            setBody(ctx, result);
        })
        .get('single', '/:id', async (ctx) => {
            ctx.status = 200;
            const result = await getService(ctx).get(ctx.params.id);
            const modified = (result.length === 1 ? result[0].updated_at : undefined);
            setBody(ctx, result, modified);
        })
        .post('/', koaBody(), async (ctx) => {
            ctx.status = 201;
            const result = await getService(ctx).create(ctx.request.body);
            ctx.response.set('location', router.url('single', result[0].id));
            setBody(ctx, result);
        })
        .put('/:id', koaBody(), async (ctx) => {
            const result = await getService(ctx).update(ctx.params.id, ctx.request.body);
            ctx.status = (!!result ? 200 : 404);
            setBody(ctx, result);
        })
        .delete('/:id', async (ctx) => {
            const result = await getService(ctx).delete(ctx.params.id);
            ctx.status = (result === true ? 204 : 404);
            setBody(ctx, result);
        });
        
    return router;
}
module.exports = setup;