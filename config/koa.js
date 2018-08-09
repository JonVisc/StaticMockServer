'use strict';

const colors = require('colors'),
    Router = require('koa-router');

const common = require('../common/common');

let router = new Router();

function handleParam(route, routeBlock) {
    let formattedRoute;

    if (route.includes(':')) {
        let index = route.indexOf(':');
        formattedRoute = {
            route: route.substring(0, index),
            param: route.substring(index + 1)
        };
    }

    //This handles having a param in the array object, having that override the top level param
    if (formattedRoute && routeBlock.param) {
        formattedRoute.param = routeBlock.param
    } else if (routeBlock.param) {
        formattedRoute = {
            route,
            param: routeBlock.param
        };
    }

    return formattedRoute;
}


function defaultResponse(route, routeData) {
    if (routeData.param) {
        console.log(`${routeData.type.toUpperCase()} - ${route}`.info + '/:' + routeData.param.magenta);
    } else {
        console.log(`${routeData.type.toUpperCase()} - ${route}`.info);
    }
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

//This is a little hard to understand the lines like:
//router[routeBlock.type.toLowerCase()](`/${route}`, defaultResponse(route, routeBlock));
//is esentially doing:
//router.get('/routeName', func()); where routeBlock.type can be get, post, put, etc...
function createRoute(route, routeBlock) {
    let formattedRoute = handleParam(route, routeBlock);
    if (formattedRoute) {
        route = formattedRoute.route;
        routeBlock.param = formattedRoute.param;

        router[routeBlock.type.toLowerCase()](`/${route}/:${routeBlock.param}`, defaultResponse(route, routeBlock));
    } else {
        router[routeBlock.type.toLowerCase()](`/${route}`, defaultResponse(route, routeBlock));
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
