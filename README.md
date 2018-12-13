# StaticMockServer

## Description
This is a node server that runs on port 3001.  You pass in a JSON file and it will allow you to hit those paths / parameters by configuring your service to point to http://localhost:3001/<whatever your JSON describes, the quick example is below>

I intentionally tried to make this as lightweight as I could and without a lot of dependencies so that it is easy to configure and get running as quickly as possible.

### Example
Create a json file. I would store it in the /mocks folder
FYI: The example.json file is continually updated with new features whenever I update the MockServer to support them.  It resides [here](//github.com/JonVisc/StaticMockServer/blob/master/mocks/example.json)!

```json
{
    "exampleString": {
        "type": "get",
        "body": "Blah"
    },
    "exampleJSON": {
        "type": "get",
        "body": {
            "key": "value"
        }
    },
    "exampleJSON": {
        "type": "post",
        "body": {
            "key": "post return value"
        }
    },
    "multilevel/example": {
        "type": "get",
        "body": {
            "Allthe": "things"
        }
    },
    "headersExample": {
        "type": "get",
        "headers": [
            {"Content-Type": "application/json"}
        ],
        "body": {}
    }
}
```



#### Install
```bash
$ npm install
```
#### Start Server with File Monitoring
```bash
$ nodemon index.js mocks/example.json
```
**or**
```bash
$ npm run mon
Then head to a browser and enter the URL: http://localhost:3001/load/example.json
```
#### Start Server without File Monitoring (manually restart everytime there is a filechange)
```bash
$ node index.js mocks/example.json
```
**or**
```bash
$ npm run dev
Then head to a browser and enter the URL: http://localhost:3001/load/example.json
```

An important note, if you create a second json and load it `http://localhost:3001/load/example2.json` the routes from example.json will be cleared.