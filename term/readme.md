runs a terminal in a webpage

download ``` term.js ``` using the download btn in the top right

edit the config variables

```
var username='root',password='node',host='127.0.0.1',port=2222;
```

<br>

to launch, without installing ( caches modules )

```
npx -p ssh2 electron -y term
```

<br>

---

<br>

install ssh2 and electron from npm globally

```
npm install ssh2 electron -g
```

launch 

```
npx electron term
```
or
```
npm start
```

uninstall

```
npm uninstall -g ssh2 electron
```

delete directory

<br>

---

<br>

install locally

```
npm install ssh2 electron
```

run
```
npx electron term
```
or
```
npm start
```

uninstall locally

delete directory

<br>

---

<br>

the dockerfile provides a convenient container to test on

the docker commands are at the top of the file

```
docker build . -f nodejs-min.dockerfile -t nodejs-min
```


```
docker run -di -p 2222:22 --name term nodejs-min
```

and the container will be accessible via ssh on the docker host at ``` localhost:2222 ```

<br>

---

<br>

download single term.js file

```

        var token   = '';
        var owner   = 'javascript-2020',repo='stackoverflow',path='term/term.js';
        var url     = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
        var opts    = {headers:{accept:'application/vnd.github.raw+json'}};
        token && (opts.headers.authorization=`Bearer ${token_str}`);
        var txt     = await fetch(url,opts).then(res=>res.text());
        require('fs').writeFileSync('term.js',txt);

```

<br>

download all the files from here : https://download-github-folder-upk2ftc8bmxe.runkit.sh/?javascript-2020,stackoverflow,main,term

this is subject to github rate restrictions 60 per hour, it originates from a public server

<br>

the following script will download the files, can be run from ``` node repl ```


```

//download-term.js
console.clear();

(async()=>{

    var token   = '';
    var owner   = 'javascript-2020',repo='stackoverflow',branch='main',path='term/';

    if(path[0]=='/')path=path.slice(1);
    if(path.at(-1)!='/')path+='/';    
    
    var fs        = require('fs');
    
    var url       = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=true`,headers;
    token && (headers={authorization:`Bearer ${token}`});
    var json      = await fetch(url,{headers}).then(res=>res.json());
    
    await Promise.all(json.tree.map(async item=>{

          if(!item.path.startsWith(path))return;
          
          var fn    = item.path.slice(path.length);
                                                                                console.log(fn,item.type);
          if(item.type=='tree'){
                fs.mkdirSync(fn);
                return;
          }
          var url     = `https://api.github.com/repos/javascript-2020/stackoverflow/contents/${item.path}`;
          var opts    = {headers:{accept:'application/vnd.github.raw+json'}};
          token && (opts.headers.authorization=`Bearer ${token}`);
          
          var buf     = await fetch(url,opts).then(res=>res.arrayBuffer());
          buf         = Buffer.from(buf);
          fs.writeFileSync(fn,buf);

    }));
    
})();

```




