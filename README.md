# Adot API Test

API REST permettant de relier des impressions publicitaires et clics à une liste de
points d'intérêts.

Endpoint: https://adot-api-test.now.sh


POST /binds
```shell
[
  {
    "lat": 48.86,
    "lon": 2.35,
    "name": "Chatelet"
  },
  {
    "lat": 48.8759992,
    "lon": 2.3481253,
    "name": "Arc de triomphe"
  }
]
```


Response
```json
{
  "Chatelet": {
    "lat": 48.86,
    "lon": 2.35,
    "name": "Chatelet",
    "impressions": 139105,
    "clicks": 16679
  },
  "Arc de triomphe": {
    "lat": 48.8759992,
    "lon": 2.3481253,
    "name": "Arc de triomphe",
    "impressions": 60895,
    "clicks": 7315
  }
}
```

Ce service a été déployé comme une application serverless depuis [ZEIT Now](https://zeit.co/docs/api/).

Les sources du projet Github sont disponibles [ici](https://github.com/Rirax/adot-api-test).
