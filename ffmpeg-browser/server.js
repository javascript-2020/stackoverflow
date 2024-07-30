


(async()=>{

  fetch.import    = async url=>{

                          var txt       = await fetch(url).then(res=>res.text());
                          var sandbox   = `
                                (()=>{
                                
                                      var fn    =
                                      ${txt};
                                      
                                      return fn;
                                      
                                })()
                          `;
                          var fn    = eval(sandbox);
                          return fn;
                          
                    }//fetch.import
                    
  var getmime     = (await fetch.import('https://raw.githubusercontent.com/javascript-2020/libs/main/js/string/getmime'));
  
  var fs          = require('fs');
  var path        = require('path');
  
  require('http').createServer(request).listen(8080);
  console.log('listening 8080');
  
  function request(req,res){
  
        var file    = resolve(req.url);
        
        if(!file || !fs.existsSync(file)){
              res.writeHead(404);
              res.end('not found : '+req.url);
              return;
        }
        
        var ext       = path.extname(file);
        var type      = getmime(file);
        console.log(file,type);

        res.writeHead(200,{'content-type':type});
        var stream    = fs.createReadStream(file);
        stream.pipe(res);
        
  }//request

  
  function resolve(url,docroot='.'){

        if(url[0]=='/'){
              url    = url.slice(1);
        }
        url         = decodeURI(url);
        var p2      = path.resolve(docroot);
        var file    = path.resolve(docroot,url);
        var s       = file.substring(0,p2.length);
        var p1      = path.resolve(s);
        if(p1!==p2){
              return false;
        }
        return file;
        
  }//resolve
  
  
})();


