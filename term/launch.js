
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
              if(code)return console.log('error');
        }

        var name    = await getname();
        if(!name)return;
        
        var {code,stdout,stderr}    = await exec(`docker run -di -p :22 --name ${name} nodejs-min`);
        if(code)return console.log('error');
        
        var port    = await getport(name);
        
        console.log(`*** launch : ${name}:${port}`);
        
        await exists('term.js');
        var {code,stdout,stderr}    = await exec(`npx -p ssh2 electron -y term.js title=${name} port=${port}`);
        if(code)return console.log('error');

})();


async function getname(){
  
      do{
            var name      = get();
            var result    = await chk(name);
            if(result===false){
                  return false;
            }
            
      }while(result!==true);
      
      return name;
            
            
      function get(){
        
            var col       = ['red','blue','pink','aqua','gold','gray','lime','navy'];
            var flower    = ['rose','lily','iris','fern','dahlia','tulip','pansy','basil','sage','mint'];
            var rnd       = arr=>arr[Math.floor(Math.random()*arr.length)];
            var name      = `term---${rnd(col)}-${rnd(flower)}`;
            return name;
            
      }//get

      async function chk(name){
        
            var {code,stdout,stderr}    = await exec('docker ps -f name=term');
            if(code){
                  console.log('error');
                  return false;
            }
            if(stdout.indexOf(name)!=-1){
                  return 'found';
            }
            return true;
            
      }//chk
            
            
      
}//getname

async function getport(name){
  
      var {code,stdout,stderr}    = await exec(`docker port ${name}`);
      if(code)return console.log('error');
      var i       = stdout.indexOf(':');
      var port    = stdout.slice(i+1);
      return port;
      
}//getport

function exec(cmd){
  
      var resolve,promise=new Promise(res=>resolve=res);
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
