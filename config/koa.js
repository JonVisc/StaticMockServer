'use strict';

const colors = require('colors'),
    Router = require('koa-router');

const common = require('../common/common');

let router = new Router();


function defaultResponse(route, routeData) {
    console.log(`${routeData.type.toUpperCase()} - ${route}`.info);
    return async function(ctx, next) {
        let code = 200;
        console.dir('routeData');
        console.dir(routeData);
        if (routeData.code && routeData.code !== 200) {
            console.log(`${routeData.type.toUpperCase()} - ${route} - Called`.red);
            code = routeData.code;
        } else {
            console.log(`${routeData.type.toUpperCase()} - ${route} - Called`.cyan);
        }

        if (routeData.headers && routeData.headers.length > 0) {
            routeData.headers.forEach(header => {
                ctx.set(header);
            });
        }
        if (routeData.latency) {
            await common.wait(routeData.latency);
        }
        ctx.body = routeData.body;
        ctx.status = code;
    };
}

function createRoute(route, routeBlock) {
    if (routeBlock.type === 'post') {
        router.post(`/${route}`, defaultResponse(route, routeBlock));
    }

    if (routeBlock.type === 'get') {
        router.get(`/${route}`, defaultResponse(route, routeBlock));
    }
}

module.exports = function(app, json) {

    for (const route in json) {
        if (Array.isArray(json[route])) {
            json[route].forEach((iterativeRoute) => {
                createRoute(route, iterativeRoute);
            });
        } else {
            createRoute(route, json[route]);
        }
    }

    app
    .use(router.routes())
    .use(router.allowedMethods());
};
