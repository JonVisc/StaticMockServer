const colors = require('colors'),
    cors = require('@koa/cors'),
    Koa = require('koa'),
    path = require('path');

const common = require('./common/common'),
    koaConfig = require('./config/koa');

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
    if (process.argv.length > 2) {

        let json = await common.asyncRead(path.join(base, process.argv[2]));
        //console.log(json);
        // koa config
        koaConfig(app, json);

        // create http and start listening for requests
        let port = 3001;
        app.server = app.listen(port);
        console.log(`StaticMockServer listening on port ${port}`.green);
    } else {
        console.error('Need at least one argument, the location of the JSON file.'.red);
        process.exit(1);
    }
};

// auto init if this app is not being initialized by another module (i.e. using require('./app').init();)
if (!module.parent) {
    app.init().catch(function (err) {
        console.error(err);
        process.exit(1);
    });
}