'use strict';

const common = require('../common/common'),
    fs = require('fs');


async function ping(ctx, next) {
    try {
        const version = await common.asyncRead('.version');

        ctx.body = version;
        ctx.status = 200;
    } catch(err) {
        ctx.body = 'local development';
        ctx.status = 404;
    }
};

// register koa routes
module.exports = {
    init: (app, router) => {
        router.get('/api/ping', ping);
    }
};
