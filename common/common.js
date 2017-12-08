const colors = require('colors'),
    fs = require('fs');

module.exports = {
    asyncRead: async function asyncRead(file) {
        return new Promise((resolve, reject) => {
            fs.readFile(file, 'utf8', (err, data) => {
                if (!err) {
                    let json;
                    try {
                        data = JSON.parse(data);
                    } catch (e) {
                        console.error('Please ensure your JSON can be parsed.'.error);
                        reject(e);
                    }
                    resolve(data);
                } else {
                    console.error('Cannot read the file at the location you specified.'.error);
                    reject(err);
                }
            });
        });
    }
};