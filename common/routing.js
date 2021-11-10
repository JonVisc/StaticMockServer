const colors = require('colors')
    fs = require('fs')

const common = require('./common')

function defaultResponse(route, routeBlock) {
    let routeMethod = 'get'
    routeMethod = routeBlock.method || routeBlock.type
    routeMethod = routeMethod.toUpperCase() 
    const routeArray = route.split('/')

    routeArray.forEach((part, i) => {
        if (part.startsWith(':')) {
            routeArray[i] = part.magenta
        } else {
            routeArray[i] = part.info
        }
    })
    console.log(`${routeMethod} - ${routeArray.join('/')}`)

    return async function(ctx, next) {
        let code = 200
        if (routeBlock.code) {
            code = routeBlock.code
        }
        if (code < 200 || code > 299) {
            console.log(`${routeBlock.type.toUpperCase()} - ${route} - Called`.red)
        } else {
            console.log(`${routeBlock.type.toUpperCase()} - ${route} - Called`.cyan)
        }

        if (routeBlock.headers && routeBlock.headers.length > 0) {
            routeBlock.headers.forEach(header => {
                ctx.set(header)
            })
        }
        if (routeBlock.latency) {
            console.log(`Latency detected, waiting: ${routeBlock.latency / 1000} seconds`.red)
            await common.wait(routeBlock.latency)
        }
        ctx.body = routeBlock.body
        ctx.status = code
    }
}

function createRoute(router, route, routeBlock) {
    let routeMethod = 'get'
    routeMethod = routeBlock.method || routeBlock.type
    routeMethod = routeMethod.toLowerCase()

    router[routeMethod](`/${route}`, defaultResponse(route, routeBlock))
    return router
}

module.exports = {
    loadDefaults: async function(app, router) {
        const path = './controllers/'
        const files = await common.asyncReaddir(path)
        files.forEach((file) => {
            try {
                //This needs the . before the path variable for a ../ to go up 1 level
                require(`.${path}${file}`).init(app, router)
            } catch(e) {
                console.error(e)
            }
        })
        return router
    },
    jsonRoutes: function(router, json) {
        for (const route in json) {
            if (Array.isArray(json[route])) {
                json[route].forEach((iterativeRoute) => {
                    router = createRoute(router, route, iterativeRoute)
                })
            } else {
                router = createRoute(router, route, json[route])
            }
        }
        return router
    }
}