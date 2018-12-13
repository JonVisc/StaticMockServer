const colors = require('colors'),
    cors = require('@koa/cors'),
    Koa = require('koa'),
    path = require('path');

const common = require('./common/common'),
    setup = require('./config/setup');

let base = path.normalize(__dirname);

colors.setTheme({
    info: 'blue',
    error: 'red'
});

let app = new Koa();
app.use(cors({origin: '*'}));

module.exports = app;

/**
 * Initiates a new server
 */
app.init = async function() {
    console.log('Setting up your StaticMockServer!'.info.underline);
    //console.dir(process.argv);
    let port = process.env.PORT || 3001;
    if (process.argv.length > 2) {

        let json = await common.asyncRead(path.join(base, process.argv[2]));

        // koa config
        setup(app, json);

    } else {
        console.warn(`Starting up the StaticMockServer with nothing loaded, please make a GET request to  <URL>:${port}/load/ with the filename you want to load from the mocks directory.`.magenta);
        setup(app);
    }
    // create http and start listening for requests
    app.server = app.listen(port);
    console.log(`StaticMockServer listening on port ${port}`.green);
};

// auto init if this app is not being initialized by another module (i.e. using require('./app').init();)
if (!module.parent) {
    app.init().catch(function (err) {
        console.error(err);
        process.exit(1);
    });
}