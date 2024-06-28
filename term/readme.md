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

and the container will be accessible via ssh on the docker host at ``` localhost:2222 ```


<br>

download the files from here : https://download-github-folder-upk2ftc8bmxe.runkit.sh/?javascript-2020,stackoverflow,main,term

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
    token && (headers={authorization:`Bearer ${token_str}`});
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
          token && (opts.headers.authorization=`Bearer ${token_str}`);
          
          var buf     = await fetch(url,opts).then(res=>res.arrayBuffer());
          buf         = Buffer.from(buf);
          fs.writeFileSync(fn,buf);

    }));
    
})();

```




