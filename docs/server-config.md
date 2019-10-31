The application is split into a number of components. The configuration reflects these components. For example, a config file looks like this:

```
{
  "http": {
    "port": 8080
  },
  "auth": {
    "provider": "local",
    "type": "JWT"
  },
  "dwca": {},
  "storage": {
    "bindIp": "localhost",
    "port": 27017,
    "path": "",
    "syncDelay": 60,
    "mainAdmin": "kurt.sys@moment-4.be"
  },
  "user": {
    "bulkiness": {
      "halfTimeInDays": 7
    }
  },
  "rss": {
    "channel": {
      "title": "",
      "description": ""
    }
  },
  "dataset": {},
  "mode": "DEMO",
  "baseUrl": "https://localhost:3000/"
}
```

## general config

### `"mode" = "DEV"`

* `DEMO`: demo data is added to the system, the database runs in-memory
* `DEV`: -
* `TEST`: -
* `PROD`: probably you need this one :)

### `"baseUrl" = "http://localhost:8080/"`

The base (public) url of the applications, which is derived as follows:
1. from the http headers `X-Forwarded-Host` and `X-Forwarded-Proto`
2. if these headers don't exist, use the `baseUrl` config, meaning: this field
3. if this doesn't exist, fall back to the request context scheme and host (having a reverse proxy, this will be the local address and port, which is not the right (public) url

## `auth` module

In order to authenticate, an external service is usually used. There is, however, a very limited login system embedded. The login system should provide a JWT that is send on each request (that needs authentication). In order to be able to verify the JWT, the system needs a `verifyKey` and `alg` (algorithm) to be set.

### `"type"`

Type of the token. Currently, it should be set to `JWT`.

### `"provider" = "local"`

Currently, there can be one authentication provider:
* `local`: the embedded authentication provider is used. One should provide `alg`, `verifyKey` and a `signKey`. If one of both of these values are not present, the keys are generated using the `ES256` algorithm. Be aware that this will probably result in invalid tokens after restart, since new keys will be used and existing tokens will be invalid.
* any other value: one must provide the `verifyKey` and preferably also `alg`.

### `"alg" = "ES256"`

The algorithm used to generate key pairs.

### `"signKey"`

No default value. This is the key used to sign a JWT. This is only used when the `provider` is `local`. In other cases, the external service signs the JWT, and shouldn't be known by this system. (This is the _private key_ of a key pair.)
It is automatically generated if `provider` is `local` and it is not provided. See `"provider" = "local"`.

### `"verifyKey"`

No default value. This is the key used to verify a JWT. (This is the _public key_ of a key pair.)
It is automatically generated if `provider` is `local` and it is not provided. See `"provider" = "local"`.

## `dataset` module

No configuration

## `dwca` module

### `"system" = "https://smalldata.obis.org"`

Used to generate `eml.xml`. Not necessary to override this value.

### `"packageId" = "#{baseUrl}#{datasetRef}"`

Template to set the `packageId` in `eml.xml`. Not really necessary to override. The known template variables:
* `baseUrl`: set in the config as well
* `datasetRef`: reference to/id of the dataset

## `http` module

### `"port" = 8008`

The `port` to which the application listens to

## `storage` module

### `"bindIp" = "localhost"`

IP address where the embedded database will start/run.

### `"port" = 27017`

Port on which the embedded database will run

### `"path" = ""`

Path where the data is persisted (the database is stored on disk). If empty, the database is run in-memory: the data will be lost on shutdown!

### `"syncDelay" = 60`

Mongodb parameter to flush dirty in-memory pages to the disk. This usually shouldn't be changed. On some systems, when set to 0, this makes the CPU running at 100%, blocking the application. More information on https://docs.mongodb.com/manual/reference/parameters/#param.syncdelay and https://github.com/flapdoodle-oss/de.flapdoodle.embed.mongo/issues/229 .

### `"mainAdmin" = "kurt.sys@moment-4.be"`

The first admin user to add to the db. On a fresh install, without any database, nobody is allowed to login. On startup, the user with this emailaddress will automatically have the role of node manager.

## `user` module

### `"bulkiness" = {...}`

#### `"halfTimeInDays" = 1.0`

The software system allows for hinting towards using the [gbif ipt tool](https://www.gbif.org/ipt) when 'many records are added in a short amount of time'. To define what 'many records in a short amount of time' is, the software system defines a 'bulkiness' factor. That is: each time a record is added, the bulkiness increases with 1. However, this 'bulkiness' has a decay, meaning, if one adds a record today, it doesn't count for 1 anymore tomorrow.
`halfTimeInDays` defines the time at which the 'bulkiness' is divided by two. 

**Example:** starting with a bulkiness of 25, and a `halfTimeInDays` of 2 days, and no new records are added this is the `bulkiness` over time:
```
days	bulkiness
 0.0	  25.0
 1.0	  17.7
 2.0	  12.5
 3.0	   8.8
 4.0	   6.3
 5.0	   4.4
 6.0	   3.1
 7.0	   2.2
 8.0	   1.6
 9.0	   1.1
10.0	   0.8
```

After 10 days, the `bulkiness` is below one, meaning, it is as if there was not even 1 record added.


**Example:** same as the previous example, but we add 2 records each day:

```
days	bulkiness
 0.0	  25.0
 1.0	  18.7
 2.0	  14.2
 3.0	  11.0
 4.0	   8.8
 5.0	   7.2
 6.0	   6.1
 7.0	   5.3
 8.0	   4.8
 9.0	   4.4
10.0	   4.1
11.0	   3.9
12.0	   3.8
13.0	   3.7
14.0	   3.6
15.0	   3.5
16.0	   3.5
17.0	   3.5
18.0	   3.5
19.0	   3.4
20.0	   3.4
```

## `rss` module

### `"channel" = {...}`

Defines some values for rss feed channel fields:

#### `"title" = ""`

#### `"description" = ""`
