# StaticMockServer

### Example
Create a json file. I would store it in the /mocks folder

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

Install
```bash
$ yarn
```
Start Server
```bash
$ node index.js mocks/example.json
```