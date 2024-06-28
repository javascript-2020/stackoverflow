runs a terminal in a webpage

download ``` term.js ``` edit the config variables

```
        var username='root',password='node',host='127.0.0.1',port=2222;
```

<br>

to launch, without installing ( caches modules )

```
npx -p ssh2 electron term.js -y
```

<br>

it can require installing ssh2 and electron from npm

```
npm install ssh2 electron
```

<br>

the dockerfile provides a convenient container to test on

the docker commands are at the top of the file

```
docker build . -f nodejs-min.dockerfile -t nodejs-min
```


```
docker run -di -p 2222:22 --name term nodejs-min
```

and the container will be accessible on the host at ``` localhost:2222 ```




download the files from here : https://download-github-folder-upk2ftc8bmxe.runkit.sh/?javascript-2020,stackoverflow,main,term





