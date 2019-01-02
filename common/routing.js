const colors = require('colors')
    fs = require('fs');

const common = require('./common');

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
        if (routeData.code && routeData.code < 200 || routeData.code > 299) {
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
function createRoute(router, route, routeBlock) {
    let formattedRoute = handleParam(route, routeBlock);
    if (formattedRoute) {
        route = formattedRoute.route;
        routeBlock.param = formattedRoute.param;

        router[routeBlock.type.toLowerCase()](`/${route}/:${routeBlock.param}`, defaultResponse(route, routeBlock));
    } else {
        router[routeBlock.type.toLowerCase()](`/${route}`, defaultResponse(route, routeBlock));
    }
    return router;
}

module.exports = {
    loadDefaults: async function(app, router) {
        const path = './controllers/';
        const files = await common.asyncReaddir(path);
        files.forEach((file) => {
            try {
                //This needs the . before the path variable for a ../ to go up 1 level
                require(`.${path}${file}`).init(app, router);
            } catch(e) {
                console.error(e);
            }
        });
        return router;
    },
    jsonRoutes: function(router, json) {
        for (const route in json) {
            if (Array.isArray(json[route])) {
                json[route].forEach((iterativeRoute) => {
                    router = createRoute(router, route, iterativeRoute);
                });
            } else {
                router = createRoute(router, route, json[route]);
            }
        }
        return router;
    }
};