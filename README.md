Install
=======

Overview
--------

The software system is consists of different deployables. Currently,
there are 3 deployables, but the system can easily be extended:

1.  Server, which has an api that \'speaks dwc\'
2.  Admin web client, which can be used to manage users and datasets
3.  Occurrences web client, which is a web client for researchers to add
    observations (\'occurrences\')

In general to have the software system up and running properly, one
should add a reverse proxy (nginx, apache, ...) in front of the three
deployables:

``` {.artist}
                                         +------------------+
                                         |                  |
                                         |  client browser  |
                                         |                  |
                                         +--------+---------+
                                                  |
                                                  | https://[domain]/[path]
                                                  |
+-------------------------------------------------|--------------------------------------------------+
|                                                 |                                                  |
|                                      +----------v-----------+                                      |
|                                      |                      |                                      |
|                                      |    reverse proxy     |                                      |
|                                      |                      |                                      |
|                             +--------+  (nginx/apache/...)  +--------+                             |
|                             |        |                      |        |                             |
|                             |        +----------+-----------+        |                             |
|          [path:/occurrences]|                   |                    |[path:/api/]                 |
|                             |                   |[path:/admin]       |                             |
|                             |                   |                    |                             |
|                             |                   |                    |                             |
|                             |                   |                    |http://localhost:8080/api/   |
|  +--------------------------v-+   +-------------v--------------+   +-v--------------------------+  |
|  |                            |   |                            |   |                            |  |
|  |   occurrences web client   |   |      admin web client      |   |      smalldata server      |  |
|  |                            |   |                            |   |                            |  |
|  +----------------------------+   +----------------------------+   +----------------------------+  |
|                                                                                                    |
+----------------------------------------------------------------------------------------------------+
```

Reverse proxy
-------------

The reverse proxy needs at least these paths:

-   `/occurrences` → location of the occurrences web client (e.g.
    `/var/www/html/occurrences` on debian based systems)
-   `/admin` → location of the admin web client (e.g.
    `/var/www/html/admin` on debian based systems)
-   `/api/` → proxy pass to where the server runs (e.g.
    `http://localhost:8080/` with the default config)

### nginx

An example config for nginx:

``` {.conf}
server {
  listen 80 default_server;
  listen [::]:80 default_server;

  root /var/www/html;

  index index.html index.htm index.nginx-debian.html;

  server_name _;

  location / {
    proxy_set_header Host $host;
    proxy_redirect off;

    proxy_pass http://localhost:8080/;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Host $server_name;
  }

  location /api/ {
    rewrite  ^  $request_uri;
    rewrite ^/api/(.*) $1 break;
    return 400;
    proxy_pass http://localhost:8080/api/$uri;
  }

  location /occurrences {
    try_files $uri $uri/ =404;
  }

  location /admin {
    try_files $uri $uri/ =404;
  }
}
```

Server
------

### Method 1: from the server application image

The images of the server are available on
<http://smalldata.obis.org/images/>

1.  get the last one
2.  unzip it in the directory you want to install it
3.  make sure the config is ok.
    -   A sample config can be found in [the source
        code](https://github.com/iobis/smalldata/blob/master/server/config/config.json)
    -   check the *config info*
4.  run `./bin/smalldata.server -conf config/config.json` from the root
    of the application.
    -   on windows: use
        `./bin/smalldata.server.bat -conf config/config.json`
    -   check the config location! You may change the location of the
        config file

### Method 2: using gradlew (only starts server without front end)

1.  prerequisites

    Java 11 or higher must be installed

2.  how to start

    1.  clone the sources
    2.  go into the `server`-directory
    3.  make sure, in that directory, `config/config.json` is right
    4.  run `./gradlew run`

### Method 3: using yarn (starts server and web clients)

1.  prerequisites

    1.  `node` must be installed latest lts version (10.16.3 or higher)
    2.  `yarn` must be installed lastest version
    3.  Java 11 or higher must be installed on your system

2.  how to start

    1.  clone the sources
    2.  run `yarn install`
    3.  run `yarn start`

Web clients
-----------

### prerequisites {#prerequisites-2}

1.  `node` must be installed latest lts version (10.16.3 or higher)
2.  `yarn` must be installed lastest version

### Building a web client

The **occurences** and **admin** web client can be build by running a
yarn job on the source repository:

-   `yarn occurrences-app:build`
-   `yarn admin-app:build`

The `homepage` key in `package.json` is necessary so the app knows on
which path on the server it resides. This configuration must be set
before making a build. For more information about the `homepage` key:

-   <https://create-react-app.dev/docs/deployment/#building-for-relative-paths>
-   <https://medium.com/@svinkle/how-to-deploy-a-react-app-to-a-subdirectory-f694d46427c1>

The `proxy` key is not used for final builds. It is used for development
(running `yarn run`).

### Installing a web client

After a web client has been built, installing is just making a copy in
the right directory, e.g.:

-   `cp -r ./occurrences-app/build/* /var/www/html/occurrences`
-   `cp -r ./admin-app/build/* /var/www/html/admin`

The location should match the one that\'s configured in your reverse
proxy (e.g. nginx, Apache, ...).

If backend server is located on a different server, or you want to
configure a different path than `/api` for api calls then you need to
update `apiRoot` in the `index.html` of the corresponding web
application. This can and should(!) be set on the build output:

``` {.html}
<script type="text/javascript">
  window.smalldata = {
    apiRoot: '/api/'
  }
</script>
```