


(async()=>{

  var path      = require('path');
  var fs        = require('fs');
  
  fetch.import    = async url=>{
                          var txt   = await fetch(url).then(res=>res.text());
                          txt       = txt.replaceAll('export','module.export=');
                          eval(`var fn=${txt};fn;`);
                          return fn;
                };
  var getmime    = await fetch.import('https://raw.githubusercontent.com/javascript-2020/libs/main/js/string/getmime');
  
  var docroot   = '.';
  
  require('http').createServer(request).listen(8080);
  console.log('listening 8080');
  
  function request(req,res){
  
        var url     = req.url.slice(1);
        var file    = resolve(url);
        console.log(file,fs.existsSync(file));
        if(!file || !fs.existsSync(file)){
              res.writeHead(404);
              res.end('not found '+req.url);
              return;
        }
        
        var type      = getmime(file);
        var stream    = fs.createReadStream(file);
        
        res.writeHead(200,{'content-type':type});
        stream.pipe(res);
        
  }//request

  
  function resolve(url){
  
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


