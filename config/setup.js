'use strict';

const Router = require('koa-router');

const routing = require('../common/routing');

module.exports = function(app, json) {
    let router = new Router();

    routing.loadDefaults(app, router);
    routing.jsonRoutes(router, json);

    app
    .use(router.routes())
    .use(router.allowedMethods());
};
