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
    console.log(`Attempting to load file: ${filename}`.blue.underline);
    try {
        const file = await common.asyncRead(`./mocks/${filename}`);
        _router = routing.jsonRoutes(_router, file);

        _app
        .use(_router.routes())
        .use(_router.allowedMethods());

        console.log(`Completed loading of file: ${filename}`.blue.underline);
        ctx.status = 200;
    } catch(err) {
        console.log('caught!');
        if (err) {
            ctx.body = JSON.stringify(err);
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