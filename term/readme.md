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

then to launch, electron does not need to be installed

```
npx electron term.js
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





