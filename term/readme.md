runs a terminal in a webpage

it does require installing ssh2 from npm

```
npm install ssh2
```

download ``` term.js ``` edit the config variables

```
        var username='root',password='node',host='127.0.0.1',port=2222;
```

<br>

then to launch 

```
npx electron term.js
```

<br>

the dockerfile provides a convenient container to test on

the docker commands are at the top of the file






