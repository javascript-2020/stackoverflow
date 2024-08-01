//  very-simple-proxy.js

        var https   = require('https');
        
        https.createServer({key,cert},request).listen(8005);
        console.log('listening 8005');
        
        function request(req,res){
        
              if(req.url=='/'){
                    res.writeHead(200,{'content-type':'text/html'});
                    res.end(html);
                    return;
              }
              
              var req2   = https.request('https://localhost:8006'+req.url,{ca:cert,method:req.method},res2=>{
                    res2.on('data',data=>res.write(data));
                    res2.on('end',()=>res.end());
              });
              
              req.on('data',data=>req2.write(data));
              req.on('end',()=>req2.end());
              
        }//request
        
        
        https.createServer({key,cert},request2).listen(8006);
        console.log('listening 8006');
        
        function request2(req,res){
        
              var body    = '';
              req.on('data',data=>body+=data);
              req.on('end',()=>{
              
                    if(req.method=='POST'){
                          var json    = JSON.parse(body);
                          console.log('post',json);
                    }
                    res.end('it works!');
                    
              });
              
        }//request2

        
        var html    = `
        
              <script type=module>
              
                    var body    = JSON.stringify([1,2,3]);
                    var res   = await fetch('test',{method:'post',body});
                    var txt   = await res.text();
                    document.body.append(txt);
                    
              </script>
              
        `;
