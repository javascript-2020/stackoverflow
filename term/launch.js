
    var port    = 2222;
    var name    = 'term';
    var image   = 'nodejs-min';    

    var fs      = require('fs');
    var cp      = require('child_process');
    var net     = require('net');
    
    process.chdir('/work/tmp/test2/');

    
(async()=>{

        var {code,stdout,stderr}    = await exec('docker images nodejs-min --no-trunc');
        if(code)return console.log('error');
        if(stdout.indexOf(image)==-1){
              await exists('nodejs-min.dockerfile');
              var {code,stdout,stderr}    = await exec(`docker build . -f nodejs-min.dockerfile -t ${image}`);
        }
        
        var {code,stdout,stderr}    = await exec(`docker run -di -p :22 --name ${name} nodejs-min`);
        if(code)return console.log('error');
        
        var port    = await getport();
        
        await exists('term.js');
        await exec(`npx -p ssh2 electron -y term.js ${port}`);

})();


function getport(){
  
      var {code,stdout,stderr}    = await exec(`docker port ${name}`);
      if(code)return console.log('error');
      var i       = stdout.indexOf(':');
      var port    = stdout.slice(i+1);
  
}//getport

function exec(cmd){
  
      var resolve,promise=new Promise(res=>resolve=res);
      /*
      var parts   = cmd.split(' ');
      cmd         = parts[0];
      var args    = parts.slice(1);
      */
      var args    = cmd.split(' ');
      var cmd     = 'powershell.exe';
      var child   = cp.spawn(cmd,args);
      var stdout='',stderr='';
      child.stdout.on('data',data=>(stdout+=data,console.log(data.toString())));
      child.stderr.on('data',data=>(stderr+=data,console.log(data.toString())));
      child.on('exit',code=>(console.log('code:',code),resolve({code,stdout,stderr})));
      return promise;
      
}//exec

async function exists(file){
  
      if(fs.existsSync(file))return;
      var token   = '';
      var owner   = 'javascript-2020',repo='stackoverflow',path='term/'+file;
      var url     = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
      var opts    = {headers:{accept:'application/vnd.github.raw+json'}};
      token && (opts.headers.authorization=`Bearer ${token}`);
      var txt     = await fetch(url,opts).then(res=>res.text());
      fs.writeFileSync(file,txt);
      
}//exists

async function port(){

        
}//port

function isPortTaken(port){
  
      var resolve,promise=new Promise(res=>resolve=res);
      var server=net.createServer().listen(port);
      server.on('error',err=>resolve(error));
      server.on('listening',()=>{
            server.close();
            resolve(false);
      });
      return promise;
  
}//isPortTaken
