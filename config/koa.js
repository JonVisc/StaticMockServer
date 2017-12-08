'use strict';

const Router = require('koa-router');

let router = new Router();


function defaultResponse(route, routeData) {
    console.log(`${routeData.type.toUpperCase()} - ${route}`.info);
    return async function(ctx, next) {
        if (routeData.headers && routeData.headers.length > 0) {
            routeData.headers.forEach(header => {
                ctx.set(header);
            });
        }
        ctx.body = routeData.body;
        ctx.status = 200;
    };
}

module.exports = function(app, json) {

    for (const route in json) {

        if (json[route].type === 'post') {
            router.post(`/${route}`, defaultResponse(route, json[route]));
        }

        if (json[route].type === 'get') {
            router.get(`/${route}`, defaultResponse(route, json[route]));
        }
    }

    app
    .use(router.routes())
    .use(router.allowedMethods());
};
