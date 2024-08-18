


/*

james.node.js

14 aug 2024

no cors headers on stackoverflow so need node.js
need origin header on websocket upgrade

*/


(function james(){
                                                                                console.clear();
                                                                                console.log('\n',' james.node.js','\n');
                                                                                
                                                                                
        var email         = 'matthew.richards@email.com';
        var password      = 'stack-43-re-www';
        
        var identifier    = 'bot';
        var admins        = ['matt'];
        
        var debug         = true;
        
        var cmds    = [];
        
        var wsmod;
        var isolated_vm;
        
        var url;
        var req;
        var cookies;
        var util;
        var plugins;
        
        var fs            = require('fs');
        
        async function ready(){
        
                                                                                console.log('login fkey');
              var res                           = await req.page.login();
              var fkey                          = await util.fkey(res);
              cookies(res);
                                                                                console.log('login');
              var res                           = await req.login(email,password,fkey);
              cookies(res);
              if(util.fail())return
                                                                                console.log('chat fkey');
              var res                           = await req.page.chat();
              var fkey                          = await util.fkey(res);
              cookies(res);
              
              
              plugins.add(  test,admin,echo,choose,funfact,joke,random,stat,timer,unformatted,welcome,
                            learn,unlearn,cmd,execute,bot,visit
              );
              
              
              util.join(1,fkey);
              util.join(17,fkey);
              
              
        }//ready
        
        
        
;
(function load(){

        var fs        = require('fs');
        
        var sandbox   = txt=>'(()=>{var fn=\n'+txt+'\n;return fn})()';
        
        //wsmod       = require('./wsmod.js');
        var url       = 'https://raw.githubusercontent.com/javascript-2020/stackoverflow/main/bot/wsmod.js';
        fetch(url).then(res=>res.text().then(js=>{
        
              var mod   = eval(sandbox(js));
              wsmod     = mod();
              
        }));
        
        var url       = 'https://raw.githubusercontent.com/javascript-2020/stackoverflow/main/bot/isolated-vm.js';
        fetch(url).then(res=>res.text().then(js=>{
        
              var mod       = eval(sandbox(js));
              isolated_vm   = mod();
              isolated_vm.install();
              
        });
        
        
        (async()=>{
        
              var time    = 10;
              var ct      = time*4;
              
              while(ct){
              
                    if(wsmod && isolated_vm.install.complete){
                          ready();
                          return;
                    }
                    
                    await new Promise(res=>setTimeout(res,250));
                    ct--;
                    
              }//while
                                                                                console.log('init failed');
        })();
        
})()
;


        url                       = {};
        url.login                 = 'https://stackoverflow.com/users/login';
        url.chat                  = 'https://chat.stackoverflow.com/';
        url.ws                    = url.chat+'ws-auth';
        url.send                  = roomid=>`${url.chat}chats/${roomid}/messages/new`;
        
        
        req                       = {};
        req.page                  = {};
        req.page.login            = async ()=>await fetch(url.login);
        req.login                 = async (email,password,fkey)=>await fetch(url.login,util.opts({email,password,fkey},{redirect:'manual'}));
        req.page.chat             = async ()=>await fetch(url.chat,util.opts())
        req.ws                    = async (roomid,fkey)=>await fetch(url.ws,util.opts({roomid,fkey})).then(res=>res.json().then(json=>Promise.resolve(json.url+'?l=99999999999')));
        req.send                  = async(roomid,text,fkey)=>{
        
                                          if(req.send.status){
                                                req.send.queue.push({roomid,text,fkey});
                                                return;
                                          }
                                          req.send.status   = true;
                                          
                                          var max   = 400;
                                          if(text.length>max){
                                                var t   = text.slice(max);
                                                text    = text.slice(0,max);
                                                req.send.queue.unshift({roomid,t,fkey});
                                          }
                                                                          debug && console.log('send : '+text);
                                          var txt   = await fetch(url.send(roomid),util.opts({text,fkey})).then(res=>res.text());
                                                                          debug && console.log(txt);
                                          var delay   = await req.send.delay(txt);
                                          if(delay){
                                                req.send.queue.unshift({roomid,text,fkey});
                                                await new Promise(res=>setTimeout(res,delay));
                                          }
                                          
                                          req.send.status   = false;
                                          if(!req.send.queue.length)return;
                                          var {roomid,text,fkey}    = req.send.queue.shift();
                                          req.send(roomid,text,fkey);
                                          
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
                                                                          debug && console.log('delay',delay);
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
        util.body                 = (opts,params)=>{
        
                                          if(!params)return;
                                          opts.headers['content-type']    = 'application/x-www-form-urlencoded';
                                          opts.method                     = 'post';
                                          opts.body                       = '';
                                          for(var key in params)
                                                opts.body  += key+'='+encodeURIComponent(params[key])+'&';
                                                
                                    }//body
        util.fail                 = ()=>!(('acct' in cookies.jar) || console.log('error'));
        util.rec                  = (roomid,payload,send)=>{
        
                                          var json    = JSON.parse(payload.toString());
                                                                          debug && console.log('chat message received : '+JSON.stringify(json));
                                          var key   = 'r'+roomid;
                                          if(!json[key].e)return;
                                          
                                          var evt   = json[key].e[0];
                                          plugins.event(evt,send);
                                          
                                    }//rec
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
        util.send.fn              = (send,fn)=>{
        
                                          if(typeof fn=='function'){
                                                fn    = fn.toString();
                                          }
                                          fn          = fn.trim();
                                          var arr     = fn.split('\n');
                                          var str     = arr.at(-1);
                                          var ws      = str.match(/^\s*/)[0].length;
                                          var str     = arr[0];
                                          arr[0]      = ''.padStart(ws)+str;
                                          var code    = arr.join('\n');
                                          util.send.code(send,code);
                                          
                                    }//send.fn
        util.join                 = async(roomid,fkey)=>{
                                                                          console.log('join',roomid);
                                          var wsurl     = await req.ws(roomid,fkey);
                                                                          debug && console.log(wsurl);
                                          var send      = text=>req.send(roomid,text,fkey);
                                          var rec       = (payload,type)=>util.rec(roomid,payload,send);
                                          
                                          var ws        = await wsmod.client(wsurl,{origin:url.chat},rec);
                                                                          debug && console.log('websocket',!!ws);
                                    }//join
        util.opts                   = (params,hdrs)=>{
        
                                          var opts    = {headers:{cookie:cookies.build()}};
                                          util.body(opts,params);
                                          Object.assign(opts,hdrs);
                                          return opts;
                                          
                                    }//opts
        util.args                 = (evt,plugin)=>{
        
                                          if(evt.event_type!=1)return {};
                                          if(!evt.content.startsWith(identifier))return {};
                                          var cmd     = plugin.full||plugin.name;
                                          var args    = evt.content.split(' ');
                                          if(args[0]==identifier){
                                                if(args[1]!=cmd)return {};
                                                args.splice(0,2);
                                                return {hit:true,args};
                                          }
                                          if(args[0]==identifier+cmd){
                                                args.splice(0,1);
                                                return {hit:true,args};
                                          }
                                          if(plugin.short){
                                                var n   = plugin.short.length;
                                                for(var i=0;i<n;i++){
                                                
                                                      if(args[0]==identifier+plugin.short[i]){
                                                            args.splice(0,1);
                                                            return {hit:true,args};
                                                      }
                                                      
                                                }//for
                                          }
                                          return {};
                                          
                                    }//args
        util.quoted               = (args)=>{
        
                                          var args2   = structuredClone(args);
                                          var i1      = args.findIndex(str=>str[0]=="'");
                                          if(i1==-1)return {};
                                          var i2      = args.findIndex(str=>str.at(-1)=="'");
                                          if(i2==-2)return {};
                                          if(i1>i2)return {};
                                          var quoted    = args2.splice(i1,i2-i1+1).join(' ');
                                          return {quoted,args:args2};
                                          
                                    }//quoted
                                    
                                    
  //plugins:
  
        plugins                   = [];
        plugins.add               = (...args)=>plugins.push(...args);
        plugins.event             = (evt,send)=>plugins.forEach(plugin=>plugin.event(evt,send));
        
        test                      = test();
        admin                     = admin();
        echo                      = echo();
        choose                    = choose();
        funfact                   = funfact();
        joke                      = joke();
        random                    = random();
        stat                      = stat();
        timer                     = timer();
        unformatted               = unformatted();
        welcome                   = welcome();
        learn                     = learn();
        unlearn                   = unlearn();
        cmd                       = cmd();
        execute                   = execute();
        bot                       = bot();
        help                      = help();
        visit                     = visit();
        
        
        function test(){
        
              var plugin    = {
                    name    : 'test',
                    desc    : `just a quickly accessible test function`,
                    event   : event,
              };
              return plugin;
              
              function event(evt,send){
              
                    var {hit,args}    = util.args(evt,plugin);
                    if(!hit)return;
                    
                    //send('hello '+evt.user_name);
                    //util.send.fn(send,event);
                    send('https://i.imgur.com/RjknwhU.png');
                    
              }//event
              
        }//test
        
        function admin(){
        
              var plugin    = {
                    name    : 'admin',
                    desc    : `admin functions`,
                    event   : event
              };
              return plugin;
              
              function event(evt,send){
              
                    var {hit,args}    = util.args(evt,plugin);
                    if(!hit)return;
                    if(!admins.includes(evt.user_name))return;
                    
                    switch(args[0]){
                    
                      case 'stop'   : process.exit();
                      
                    }//switch
                    
              }//event
              
        }//admin
        
        function echo() {
        
              var plugin    = {
                    name    : 'echo',
                    desc    : `echos user message`,
                    event   : event
              };
              return plugin;
              
              function event(evt,send){
              
                    var {hit,args}    = util.args(evt,plugin);
                    if(!hit)return;
                    
                    send(args.join(' '));
                    
              }//event
              
        }//echo
        
        function choose(){
        
              var plugin    = {
                    name    : 'choose',
                    desc    : `choose an option from a space delimited string of options. strips 'or's`,
                    event   : event
              };
              return plugin;
              
              function event(evt,send){
              
                    var {hit,args}    = util.args(evt,plugin);
                    if(!hit)return;
                    
                    if(args.length==0){
                          send('i can\'t read your mind. please provide an arg or two');
                          return;
                    }
                    args          = args.filter(arg=>arg!='or');
                    var index     = Math.floor(Math.random()*args.length);
                    var choice    = args[index];
                    send(choice);
                    
              }//event
              
        }//choose
        
        function funfact(){
        
              var plugin    = {
                    name    : 'funfact',
                    desc    : 'tell a fun fact',
                    event
              };
              return plugin;
              
              async function event(evt,send){
              
                    var {hit,args}    = util.args(evt,plugin);
                    if(!hit)return;
                    
                    var url   = 'https://uselessfacts.jsph.pl/random.json?language=en';
                    var res   = await fetch(url);
                    if(!res.ok){
                          send('http joke failed');
                          return;
                    }
                    var txt   = await res.json().then(json=>Promise.resolve(json.text));
                    send(txt);
                    
              }//event
              
        }//funfact
        
        function joke(){
        
              var plugin    = {
                    name    : 'joke',
                    desc    : 'tell a joke',
                    event
              };
              return plugin;
              
              async function event(evt,send){
              
                    var {hit,args}    = util.args(evt,plugin);
                    if(!hit)return;
                    
                    if(Math.random()<=0.1){
                          send(`${evt.user_name}'s code 😜`);
                          return;
                    }
                    var url   = 'https://official-joke-api.appspot.com/jokes/programming/random';
                    var res   = await fetch(url);
                    if(!res.ok){
                          send('http joke failed');
                          return;
                    }
                    var json    = await res.json();
                    if(!json){
                          send('error getting joke');
                          return;
                    }
                    var joke    = json[0];
                    send(joke.setup);
                    await new Promise(res=>setTimeout(res,2500));
                    send(joke.punchline);
                    
              }//event
              
        }//joke
        
        function random(){
        
              var plugin    = {
                    name    : 'random',
                    desc    : 'generates random number in range of [min,max]',
                    event
              };
              return plugin;
              
              function event(evt,send){
              
                    var {hit,args}    = util.args(evt,plugin);
                    if(!hit)return;
                    
                    if(args.length<2){
                          send('** missing args <min> <max> **');
                          return;
                    }
                                                                                // check if its all digits and replace the "-" incase it is negative
                    if(!/^\d+$/.test((args[0]+args[1]).replace(/-/g,''))){
                          send('** invalid args. must be two integers **');
                          return;
                    }
                    var num1    = parseInt(args[0],10);
                    var num2    = parseInt(args[1],10);
                    var int     = rand(Math.min(num1,num2),Math.max(num1,num2));
                    send(int);
                    
                    function rand(min,max){
                    
                          min       = Math.ceil(min);
                          max       = Math.floor(max);
                          var int   = Math.floor(Math.random()*(max-min+1))+min;
                          return int;
                          
                    }//rand
                    
              }//event
              
        }//random
        
        function stat(){
        
              var plugin    = {
                    name    : 'stat',
                    desc    : 'generates user stats',
                    event
              };
              return plugin;
              
              async function event(evt,send){
              
                    var {hit,args}    = util.args(evt,plugin);
                    if(!hit)return;
                    
                    if(!args.length){
                          send('** please supply some users **');
                          return;
                    }
                    
                    var list    = [];
                    var max     = -1;
                    var p       = 3;
                    
                    var key   = 'U4DMV*8nvpm3EOpvf69Rxw((';
                    var ids   = args.join(';');
                    var url   = `https://api.stackexchange.com/2.3/users/${ids}?key=${key}&site=stackoverflow&order=desc&sort=reputation&filter=default`;
                    var res   = await fetch(url);
                    if(!res.ok){
                          send('request failed, notify admin');
                          return;
                    }
                    var json    = await res.json();
                    json.items.forEach(data=>{
                    
                          var output    = {
                          
                                profile_image               : data.profile_image,
                                display_name                : data.display_name,
                                
                                gold                        : data.badge_counts.gold,
                                silver                      : data.badge_counts.silver,
                                bronze                      : data.badge_counts.bronze,
                                reputation                  : data.reputation,
                                
                                reputation_change_month     : data.reputation_change_month,
                                reputation_change_year      : data.reputation_change_year,
                                reputation_change_quarter   : data.reputation_change_quarter,
                                reputation_change_week      : data.reputation_change_week,
                                reputation_change_day       : data.reputation_change_day,
                                
                                creation_date               : data.creation_date,
                                last_modified_date          : data.last_modified_date,
                                last_access_date            : data.last_access_date,
                                
                          };
                          list.push(output);
                          
                          if(!i)Object.keys(output).forEach(key=>key.length>max && (max=key.length))
                          
                    });
                    
                    var txt   = '';
                    list.forEach(output=>{
                    
                          for(var key in output){
                          
                                var indent    = (''.padStart(max+p-key.length));
                                var str       = indent+key+'  ...  '+output[key];
                                txt          += str+'\n';
                                
                          }//for
                          txt  += '\n\n';
                          
                    });
                    send(txt);
                    
              }//event
              
        }//stat
        
        function timer(){
        
              var timers    = [];
              
              var plugin    = {
                    name    : 'timer',
                    desc    : 'sets a timer to remind a user a message at a specific time relative to the current time',
                    event
              };
              return plugin;
              
              async function event(evt,send){
              
                    var {hit,args}    = util.args(evt,plugin);
                    if(!hit)return;
                    
                    var milli   = time(args);
                    if(!milli)return;
                    
                    var msg   = args.join(' ');
                    timers.push({
                          user      : evt.user_id,
                          room      : evt.roomid,
                          msg       : msg,
                          expires   : Date.now()+milli,
                          timer     : setTimeout(()=>send(msg),milli),
                    });
                    send('reminder added');
                    
              }//event
              
              function time(args){
              
                  var units   = [
                        {name:'hours',alias:['h'],multi:3.6e6,},
                        {name:'minutes',alias:['min','m'],multi:60000},
                        {name:'seconds',alias:['sec','s'],multi:1000},
                  ];
                  
                  var unit  = args.pop();
                  var obj   = units.find(obj=>obj.name===unit||obj.alias.includes(unit));
                  if(!obj){
                        send('i didnt understand that unit, use `|| man timer` to see my syntax');
                        return false;
                  }
                  
                  var numeric   = Number(args.pop());console.log(unit,numeric);
                  if(!numeric||numeric<0){
                        send('i didnt understand that numeric, use `|| man timer` to see my syntax');
                        return false;
                  }
                  
                  var time    = numeric*obj.multi;
                  return time;
                  
              }//time
              
        }//timer
        
        function unformatted(){
        
              var format_message    = "Please don't post unformatted code - use the up arrow to edit your post, then hit Ctrl + K"    +
                                      " to format the code in that post. See the [faq](https://chat.stackoverflow.com/faq)."          +
                                      "You have 25 seconds to edit and format your message properly before it will be removed."       +
                                      "Please separate code blocks from your actual question. Put your question in 1 message"         +
                                      "and then your code in a 2nd and format it.";
                                      
              var plugin    = {
                    name    : 'unformatted-code',
                    desc    : 'message about formatting to an optional person',
                    event
              };
              return plugin;
              
              async function event(evt,send){
              
                    if(evt.event_type!=1)return;
                    
                    if(!( evt.content.startsWith("<div class='full'>")        ||
                          evt.content.startsWith("<div class='partial'>")
                    )){
                          return;
                    }
                    
                    var text    = htmldecode(evt.content.replace(/<br>/g,'\n').replace(/<.+>/g,''));
                    var lines   = htmldecode(text).split('\n').map(s=>s.trim());
                    
                    if(lines.length<4)return;
                    
                    if(!lines.some(line=>/^}|^<\/|^]/.test(line)))return;
                    
                    send(format_message);
                    
                    //  maybe follow up with a timeout
                    
              }//event
              
              function htmldecode(str){
              
                    var translate_re    = /&(nbsp|amp|quot|lt|gt);/g;
                    var translate       = {
                          nbsp    : ' ',
                          amp     : '&',
                          quot    : '"',
                          lt      : '<',
                          gt      : '>',
                    };
                    str   = str.replace(translate_re,(match,entity)=>translate[entity])
                            .replace(/&#(\d+);/gi,(match,numStr)=>{
                            
                                  var num   = parseInt(numStr,10);
                                  return String.fromCharCode(num);
                                  
                            });
                    return str;
                    
              }//htmldecode
              
        }//unformatted
        
        
        function welcome(){
        
              var seen      = [];
              var welcome   = "Welcome to the JavaScript chat! Please review the [room rules](https://javascriptroom.github.io/rules/)."            +
                              "  If you have a question, just post it, and if anyone's free and interested they'll help. If you want to"            +
                              " report an abusive user or a problem in this room, visit our [meta](https://github.com/JavaScriptRoom/culture/).";
                              
              var plugin    = {
                    name    : 'welcome',
                    desc    : 'welcomes a new user to the room with a message',
                    event
              };
              return plugin;
              
              async function event(evt,send){
              
                    return;
                    if(evt.event_type!=1)return;
                    
                    if(seen.includes(evt.user_id)){
                          return;
                    }
                    seen.push(evt.user_id);
                    
                    var num   = await getNumMessagesFromId(evt.user_id,evt.room_id);
                    if(num<2){
                          send(welcome);
                    }
                    
              }//event
              
              async function getNumMessagesFromId(id,roomid){
              
                    var body    = await this.fetch(`${this.chatURL}/users/${id}`).then(res=>res.text());
                    
                    
                    var s       = $(`#room-${roomid} .room-message-count`).attr('title').match(/^\d+/)[0];
                    var num     = parseInt(s);
                    return num;
                    
              }//getNumMessagesFromId
              
        }//welcome
        
        
        function learn(){
        
              var plugin    = {
                    name    : 'learn',
                    desc    : 'Teaches a bot a command. Will output the `output` when `|| shortcut` is called. You can '         +
                              'also add args by wrapping the arg number (starting with 1) in curly brackets. If you would '      +
                              'like to escape spaces (like for a link) wrap the index in regular brackets. You can also use '    +
                              '`{a}` to include all the arguments and `[a]` to encode them all.',
                    event
              };
              return plugin;
              
              async function event(evt,send){
              
                    var {hit,args}    = util.args(evt,plugin);
                    if(!hit)return;
                    
                    var cmd       = args.shift();
                    var obj       = cmds.find(obj=>obj.cmd==cmd);
                    if(obj){
                          if(obj.id!=evt.user_id){
                                send('command exists');
                                return;
                          }
                    }else{
                          obj   = {};
                    }
                    
                    var output    = args.join(' ');
                    
                    obj.id        = evt.user_id;
                    obj.cmd       = cmd;
                    obj.output    = output;
                    cmds.push(obj);
                    
                    send(cmd+' learned');
                    
              }//event
              
        }//learn
        
        function unlearn(){
        
              var plugin    = {
                    name    : 'unlearn',
                    desc    : 'Unlearns a learned command command. Must be admin, RO, or command creator.',
                    event
              };
              return plugin;
              
              async function event(evt,send){
              
                    var {hit,args}    = util.args(evt,plugin);
                    if(!hit)return;
                    
                    var cmd     = args.shift();
                    var obj     = cmds.find(obj=>obj.cmd==cmd);
                    if(!obj)return;
                    if(obj.id!=evt.user_id){
                          send('you do not have permission to unlearn this command');
                          return;
                    }
                    var index   = cmds.findIndex(obj=>obj.cmd==cmd);
                    cmds.splice(index,1);
                    send('command '+cmd+' unlearned');
                    
              }//event
              
        }//unlearn
        
        function cmd(){
        
              var plugin    = {
                    name    : 'cmd',
                    desc    : 'processes a learned command',
                    event
              };
              return plugin;
              
              async function event(evt,send){
              
                    if(evt.event_type!=1)return;
                    if(!evt.content.startsWith(identifier))return;
                    
                    var args    = evt.content.split(' ');
                    args.shift();
                    
                    var cmd     = args.shift();
                    var obj     = cmds.find(obj=>obj.cmd==cmd);
                    if(!obj)return;
                    
                    var output    = obj.output;
                    for(var i=0;i<args.length;i++){
                    
                          output    = output.replaceAll('{'+(i+1)+'}',args[i]);
                          
                    }//for
                    
                    send(output);
                    
              }//event
              
        }//cmd
        
        function execute(){
        
              var plugin    = {
                    name    : 'eval',
                    short   : ['>'],
                    desc    : 'execute sandboxed code',
                    event
              };
              return plugin;
              
              async function event(evt,send){
              
                    var {hit,args}    = util.args(evt,plugin);
                    if(!hit)return;
                    
                    var code    = args.join(' ');
                    isolated_vm.execute(code,complete);
                    
                    function complete(error,result,logged,time){
                    
                          send(logged);
                          
                    }//complete
                    
              }//event
              
        }//execute
        
        function bot(){
        
              var plugin    = {
                    name    : 'bot',
                    desc    : 'bot status / identifies itself',
                    event
              };
              return plugin;
              
              async function event(evt,send){
              
                    if(evt.event_type!=1)return;
                    if(evt.content!=identifier)return;
                    
                    send('.. my name is ..');
                    send('https://i.imgur.com/s3nbhRD.png');
                    load('james.js');
                    load('wsmod.js');
                    load('isolated_vm.js');
                    util.send.code(send,help.display());
                    
                    function post(code){
                    
                          var arr   = code.split('\n');
                          arr       = arr.map(str=>'    '+str);
                          code      = arr.join('\n');
                          send(code);
                          
                    }//post
                    
                    function load(file){
                    
                          var url       = 'https://raw.githubusercontent.com/javascript-2020/stackoverflow/main/bot/'+file;
                          fetch(url).then(res=>res.text().then(js=>{
                          
                                util.send.code(send,txt);
                                
                          }
                          
                    }//load
                    
              }//event
              
              
        }//bot
        
        function help(){
        
              var plugin    = {
                    name      : 'help',
                    desc      : 'list commands',
                    event     : event,
                    display   : display
              };
              return plugin;
              
              async function event(evt,send){
              
                    var {hit,args}    = util.args(evt,plugin);
                    if(!hit)return;
                    
                    if(args.lenth==0){
                          var txt   = display();
                          util.send.code(send,txt);
                    }
                    
                    
              }//event
              
              function display(){
              
                    var txt   = '';
                    var max   = Math.max(...plugins.map(plugin=>plugin.name.length));
                    plugins.forEach(plugin=>{
                    
                          var n     = plugin.name.length;
                          var str   = '    '+plugin.name+'  '+''.padStart(max-n,'.')+'  ';
                          var n     = plugin.desc.length;
                          var i     = 0;
                          var m     = 100;
                          var s;
                          while(i<n){
                          
                                s  = plugin.desc.slice(i,i+m)+'\n';
                                if(i>0){
                                      s   = ''.padStart(max+8)+s;
                                }
                                str  += s;
                                i    += m;
                                
                          }//while
                          txt  += str+'\n';
                          
                    });
                    return txt;
                    
              }//display
              
        }//help
        
        function visited(){
        
              var plugin    = {
                    name    : 'visit',
                    desc    : 'keeps a record of chat room visitors',
                    event
              };
              return plugin;
              
              
              var day   = nday();
              
              
              async function event(evt,send){
              
                    var user    = evt.user_name;
                    var time    = Date.now();
                    
                    if(time>day){
                          day         = nday();
                          visitors    = [];
                    }
                    
                    if(evt.event_type==1){
                          var {hit,args}    = util.args(evt,plugin);
                          if(!hit)return;
                          if(args.length==0){
                          }
                          if(args[0]=='list'){
                                var str   = '';
                                visitors.forEach(user=>str+=user+', ');
                                str       = str.slice(0,-2);
                                send(str);
                          }
                    }
                    
                    if(evt.event_type==3){
                          if(!visitors.includes(user)){
                                visitors.push(user);
                          }
                    }
                    if(evt.event_type==4){
                    }
                    
              }//event
              
              function nday(){
              
                    var day   = new Date();
                    day.setUTCHours(23,59,59,59);
                    
              }//nday
              
        }//visited
        
        
        
        
        
        
        
        
        
/*

  //:
  //:
  //:
  
  
    async usernameToId(
        username: string,
        context: Message
    ): Promise<string | undefined> {
        const body: any = await this.fetch(
            `${this.chatURL}/rooms/pingable/${context.info.contextId}`
        ).then((resp) => resp.json());
        const array = body.filter(
            (a: string[]) =>
                a[1].toUpperCase() === username.replace('@', '').toUpperCase()
        );
        if (array.length === 0) {
            return undefined;
        }
        return array[0][0];
    }
    
    getPingString(msg: Message): string {
        return `@${msg.info.fromName.replace(/\s/g, '')}`;
    }
    
    
    
    
    async stats(
        id: string,
        api_site_param = this.api_site_param!
    ): Promise<User | false> {
        const resp = await this.fetch(
            `https://api.stackexchange.com/2.2/users/${id}?site=${api_site_param.trim()}`
        );
        const body: any = await resp.json();
        if (resp.status !== 200 || !body.items) {
            return false;
        }
        return body.items[0];
    }
    
    async chatIDToSiteID(id: number | string): Promise<string> {
        const body: any = await this.fetch(
            `${this.chatURL}/users/thumbs/${id.toString()}`
        ).then((resp) => resp.json());
        return body.profileUrl.match(/\d+/)[0];
    }
    
    async function getNumMessagesFromId(id,roomNum){
    
          var body    = await this.fetch(`${this.chatURL}/users/${id}`).then(res=>res.text());
          
          
          var s       = $(`#room-${roomNum} .room-message-count`).attr('title').match(/^\d+/)![0],10);
          var num     = parseInt(s);
          return num;
          
    }//getNumMessagesFromId
    
    
    
    async getRoomOwners(roomNum: string) {
        const body = await this.fetch(
            `${this.chatURL}/rooms/info/${roomNum}`
        ).then((resp) => resp.text());
        try {
            const $ = cheerio.load(body);
            return $('#room-ownercards')
                .find('div.usercard')
                .map((i, e) => ({
                    username: $(e).find('.user-header').attr('title'),
                    id: parseInt(
                        $(e).attr('id')!.replace('owner-user-', ''),
                        10
                    ),
                }))
                .get();
        } catch (e) {
            console.error(e);
            throw new Error('Error finding owners');
        }
    }
    
*/

//  || learn files <a href=\"https://javascript-2020.github.io/download/github-folder.html?%7B1%7D\" rel=\"nofollow noopener noreferrer\">{1}</a>





})();



