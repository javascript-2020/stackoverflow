
//  simple-proxy.js

        var host    = '127.0.0.1';
        var port    = 8080;
        
        var net       = require('net');
        var server    = net.createServer();
        
        server.on('connection',connection);
        server.on('error',err=>console.error);
        server.on('close',()=>console.log('proxy closed'));
        server.listen({host,port});
        console.log(`proxy ${host}:${port}`);
        
        function connection(client){
                                                                                console.log('client connected');
              client.on('close',()=>console.log('client closed'));
              client.on('error',err=>console.error);
              client.once('data',data=>{
                                                                                //console.log(data.toString());
                    var tls   = (data.toString().indexOf('CONNECT')!==-1);
                    var port;
                    var host;
                    
                    if(tls){
                          var url   = data.toString().split('CONNECT ')[1].split(' ')[0];
                          url       = new URL(url);
                          host      = url.host.split(':')[0];
                          port      = url.host.split(':')[1]||443;
                    }else{
                          port    = 80;
                          host    = data.toString().split('Host: ')[1].split('\r')[0];
                    }
                                        
                    var proxy   = net.createConnection({host,port},()=>console.log('proxy established :',host));
                    proxy.on('error',err=>console.error);
                    
                    if(tls){
                          client.write('HTTP/1.1 200 OK\r\n\r\n');
                    }else{
                          proxy.write(data);
                    }
                    
                    client.pipe(proxy);
                    proxy.pipe(client);
                    
              });
              
        }//connection
