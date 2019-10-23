# OceanExpert

In the config file, add the Ocean Expert public key:

```
{
  "http": {...},
  "auth": {
    "provider": "oceanexpert", // or any value that's not "local"
    "type": "JWT",
    "alg": "RS256",
    "verifyKey": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAy6o9fPZvmg5fSNz2Pomo\npNGfHBpdYecfPBnomQhrgA/1UIx4BvokBBp56Zd37vXlOykmiWSaubF4mLfxbsEF\n5OL9D5OUe0Ubepk1CDVrze5J9feGWQEhZD+dHkDgZyB13LAcDEJUr+8xZdtScZhB\nsZ24yMQRhPNsLTMueBNk7la8NjOcG9X9mGnhwyrmxDQvovkSD0q/qBvFYGBikGqX\nx/aAiv0ecMe+hj7+s2uKbdNMFsbEyattcvLNJe/yKjD3AZAL4sf/q1x/DTovpB6P\nG7jEWYExLG0psUQ4EUwWAvauFPenI4fQkM7EHVpNyeAComKpakw2Ub6I//9lq8Vg\nrQIDAQAB"
  },
  "storage": {...},
  ...
}
```

The `Authorization` header should be:
```
Authorization: Bearer <JWT>
```

The payload of a Ocean Expert JWT does not comply with JWT standards:
```
{
  "idInd": 37188,
  "fname": "Kurt",
  "sname": "Sys",
  "image": "www.oceanexpert.net/uploads/profile/profile_37188.png",
  "name": "Kurt Sys",
  "email": "kurt.sys@moment-4.be",
  "jobtitle": "",
  "idInst": 10171,
  "instName": "UNESCO / IOC Project Office for IODE",
  "instNameEng": "UNESCO / IOC Project Office for IODE ",
  "insCountry": "Belgium",
  "country": "Belgium",
  "groups": [],
  "oeRole": "ROLE_USER"
}
```

# DEMO mode

In DEMO mode, one can also provide a "demokey":

```
{
  "http": {...},
  "auth": {
    ...,
    "demokey": "verysecret"
  },
  "storage": {...},
  "mode": "DEMO"
  ...
}
```

The `Authorization` header should be:
```
Authorization: Basic verysecret
```
