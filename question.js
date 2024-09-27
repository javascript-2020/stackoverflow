


/*

question.js

26-09-24

no cors headers on stackoverflow so need node.js

https://bytes.dev/archives/2

*/


(function james(){
                                                                                console.clear();
                                                                                console.log('\n','  question.js','\n');
        var debug         = false;
        
        var email         = 'matthew.richards@email.com';   //  process.argv[2];
        var password      = 'www-ret-54-65';    //  process.argv[3];
        
        var roomid        = 17;   //  javascript
        
        
        var fkey;
        
        var url;
        var req;
        var cookies;
        var util;
        
        setTimeout(ready,50);
        
        
        async function ready(){
        
                                                                                console.log('login fkey');
              var res                           = await req.page.login();
              fkey                              = await util.fkey(res);
              
              cookies(res);
                                                                                console.log('login');
              var res                           = await req.login(email,password,fkey);
              cookies(res);
              if(util.fail())return
              
                                                                                console.log('chat fkey');
              var res                           = await req.page.chat();
              fkey                              = await util.fkey(res);
              
              cookies(res);
              
              question(roomid);
              
              
        }//ready
        
        
        async function question(roomid){
        
                var questions   = [];
                
                var qurl        = 'https://raw.githubusercontent.com/lydiahallie/javascript-questions/refs/heads/master/README.md';
                var txt         = await fetch(qurl).then(res=>res.text());
                
                var ec          = true;
                var ct          = 0;
                var index       = 0;
                var id          = '```javascript';
                while(ec){
                
                      index   = txt.indexOf(id,index);
                      if(index!=-1){
                            index  += id.length;
                            var i   = txt.indexOf('```',index);
                            var q   = txt.slice(index,i);
                            questions.push(q);
                            index   = i;
                      }else{
                            ec    = false;
                      }
                      
                }//while
                
                var n       = Math.floor(Math.random()*questions.length);
                var q       = questions[n];
                                                                                console.log(n,q);
                var link    = '[lydiahallie](https://github.com/lydiahallie/javascript-questions/tree/master)';
                var txt     = `q${n}, whats the output? *question courtesy of ${link}*`
                req.send(roomid,fkey,txt);
                util.send.code(send,q);
                
                function send(text){
                
                      req.send(roomid,fkey,text);
                      
                }//send
                
        }//question
        
        
        
        url                       = {};
        url.login                 = 'https://stackoverflow.com/users/login';
        url.chat                  = 'https://chat.stackoverflow.com/';
        url.send                  = roomid=>`${url.chat}chats/${roomid}/messages/new`;
        
        
        req                       = {};
        req.page                  = {};
        req.page.login            = async ()=>await fetch(url.login);
        req.login                 = async (email,password,fkey)=>await fetch(url.login,util.opts({email,password,fkey},{redirect:'manual'}));
        req.page.chat             = async ()=>await fetch(url.chat,util.opts())
        //req.ws                    = async (roomid,fkey)=>await fetch(url.ws,util.opts({roomid,fkey})).then(res=>res.json().then(json=>Promise.resolve(json.url+'?l=99999999999')));
        req.send                  = async(roomid,fkey,text)=>{
        
                                          if(req.send.status){
                                                req.send.queue.push({roomid,fkey,text});
                                                return;
                                          }
                                          req.send.status   = true;
                                          
                                                                                debug && console.log('send : '+text);
                                          var txt   = await fetch(url.send(roomid),util.opts({text,fkey})).then(res=>res.text());
                                                                                debug && console.log(txt);
                                                                                
                                          var delay   = await req.send.delay(txt);
                                          if(delay){
                                                req.send.queue.unshift({roomid,fkey,text});
                                                await new Promise(res=>setTimeout(res,delay));
                                          }
                                          
                                          req.send.status   = false;
                                          if(!req.send.queue.length)return;
                                          var {roomid,text,fkey}    = req.send.queue.shift();
                                          req.send(roomid,fkey,text);
                                          
                                    }//send
        req.send.queue            = [];
        req.send.status           = false;
        req.send.delay            = async txt=>{
        
                                          var search    = 'You can perform this action again in ';
                                          var i         = txt.indexOf(search);
                                          if(i==-1)return;
                                          var i1      = i+search.length;
                                          var i2      = txt.indexOf(' ',i1);
                                          var str     = txt.slice(i1,i2);
                                          var delay   = parseInt(str);
                                          delay      += 0.5;
                                          delay      *= 1000;
                                          
                                          return delay;
                                          
                                    }//delay
                                    
                                    
        cookies                   = res=>{for(var [key,value] of res.headers)(key=='set-cookie' && cookies.parse(value))};
        cookies.jar               = {};
        cookies.build             = ()=>{
        
                                          var str   = '';
                                          for(var name in cookies.jar){
                                          
                                                str  += name+'='+cookies.jar[name]+'; ';
                                                                                debug && console.log(name,'=',cookies.jar[name]);
                                                                                
                                          }//for
                                          return str;
                                          
                                    }//build
        cookies.parse             = str=>{
        
                                          str             = str.split(';')[0];
                                          var i           = str.indexOf('=');
                                          var name        = str.slice(0,i);
                                          var value       = str.slice(i+1);
                                          cookies.jar[name]   = value;
                                                                                debug && console.log(name,'=',value);
                                    }//parse
                                    
                                    
        util                      = {};
        util.fkey                 = async res=>{
        
                                          var txt     = await res.text();
                                          var i       = txt.indexOf('name="fkey"');
                                          var i1      = txt.indexOf('value="',i)+7;
                                          var i2      = txt.indexOf('"',i1);
                                          var fkey    = txt.slice(i1,i2);
                                                                                debug && console.log(fkey);
                                          return fkey;
                                          
                                    }//fkey
        util.opts                   = (params,hdrs)=>{
        
                                          var opts    = {headers:{cookie:cookies.build()}};
                                          util.body(opts,params);
                                          Object.assign(opts,hdrs);
                                          return opts;
                                          
                                    }//opts
                                    
        util.body                 = (opts,params)=>{
        
                                          if(!params)return;
                                          opts.headers['content-type']    = 'application/x-www-form-urlencoded';
                                          opts.method                     = 'post';
                                          opts.body                       = '';
                                          for(var key in params)
                                                opts.body  += key+'='+encodeURIComponent(params[key])+'&';
                                                
                                    }//body
        util.fail                 = ()=>!(('acct' in cookies.jar) || console.log('error'));
        
        
        util.send                 = {};
        util.send.code            = (send,code)=>{
        
                                          var lines     = code.split('\n');
                                          var lines2    = lines.filter(line=>line.trim());
                                          var indents   = lines2.map(line=>line.match(/^\s*/)[0].length);
                                          var min       = Math.min(...indents);
                                          lines         = lines.map(line=>line.slice(min));
                                          lines         = lines.map(line=>'    '+line);
                                          code          = lines.join('\n');
                                          send(code);
                                          
                                    }//send.code
                                    
})();



