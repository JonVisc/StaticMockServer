'use strict';

const fs = require('fs'),
    Router = require('koa-router');


const common = require('../common/common'),
    routing = require('../common/routing');

let _app;
let _router;

async function loadFile(ctx, next) {
    // Clear the routes and start by reloading the controller routes
    _router.stack = [];
    routing.loadDefaults(_app, _router);

    const filename = ctx.params.file;
    console.log(`Attempting to load file: ${filename}`.blue);
    try {
        const file = await common.asyncRead(`./mocks/${filename}`);
        _router = routing.jsonRoutes(_router, file);

        _app
        .use(_router.routes())
        .use(_router.allowedMethods());

        ctx.status = 200;
    } catch(err) {
        console.log('caught!');
        if (err) {
            ctx.body = err;
            ctx.status = 500;
        } else {
            ctx.body = 'File does not exist.';
            ctx.status = 404;
        }
    }
};

// register koa routes
module.exports = {
    init: (app, router) => {
        _app = app;
        _router = router;
        _router.get('/load/:file', loadFile);
    }
};