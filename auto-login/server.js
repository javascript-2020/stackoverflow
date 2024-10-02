
//  server.js


        var crypto        = require('crypto');
        var iterations    = 10;
        
        var port          = 3002;
        require('http').createServer(request).listen(port);
        console.log(`http://localhost:${port}/`);
        
        
        var sessions      = [];
        sessions.create   = cookie=>(session={cookie,status:false},sessions.push(session),session);
        
        var users       = [
              {
                    name        : 'james',
                    email       : 'james@example.com',
                    salt        : 'xajnyjWBADLqyFb1KALuPmY1vquQi2kpCcFzf+aD1W9QSLvFqY16HrG1B8g23ug5RwXjTL56kEIcgkChcUdNWA==',
                    hash        : 'dBDp8Ju1DvnpY8DfDNzRHnmMCrfFW1wcmuXL7SmcCIF9BAWtH6s20TqmIHiUVnH66Pg33oyDmGRRtL6wYsA66g=='
              }
        ];
        
        
        async function request(req,res){
                                                                              console.log(req.url);
              var headers     = {'content-type':'text/html'};
              var cookie      = req.headers.cookie?.split('=')[1];
              var session     = sessions.find(session=>session.cookie===cookie);
              var user;
              
              if(!session){
                    cookie    = (''+Math.random()).slice(2)
                    session   = sessions.create(cookie);
                    headers['set-cookie']        = `autofill=${cookie};httpOnly;SameSite=strict`};
              }else{
                    user      = users.find(user=>user.cookie==cookie);
              }
              
              
              if(req.url=='/'){
                    res.writeHead(200,headers);
                    res.end(html.index);
                    return;
              }
              
              if(req.url=='/login'){
                    if(session.status){
                          headers.location    = 'user';
                          res.writeHead(302,headers);
                          res.end();
                          return;
                    }
                    res.writeHead(200,headers);
                    res.end(html.login);
                    return;
              }
              
              if(req.url=='/login-fail'){
                    res.writeHead(200,headers);
                    res.end(html['login-fail']);
                    return;
              }
              
              if(req.url=='/login-user'){
                    var post    = {};
                    var body    = '';
                    for await(data of req)body   += data;
                    body        = decodeURIComponent(body);
                    var parts   = body.split('&');
                    parts.forEach(part=>([key,value]=part.split('='),post[key]=value));
                    console.log(post);
                    var user    = users.find(user=>user.email===post.email);
                    if(verify(user.hash,user.salt,post.password)==false){
                          headers.location    = 'login-fail';
                          res.writeHead(302,headers);
                          res.end();
                          return;
                    }
                    session.status      = true;
                    user.cookie         = cookie;
                    headers.location    = 'user';
                    res.writeHead(302,headers);
                    res.end();
                    return;
              }
              
              if(req.url=='/user'){
                    if(!session.status){
                          headers.location    = 'login';
                          res.writeHead(302,headers);
                          res.end();
                          return;
                    }
                    res.writeHead(200,headers);
                    res.end(html.user);
                    return;
              }
              
              if(req.url=='/logout'){
                    session.status    = false;
                    headers.location    = '/';
                    res.writeHead(302,headers);
                    res.end();
                    return;
              }
              
              
              res.writeHead(404);
              res.end(req.url+' not found');
              
        }//request
        
        
        function hash(password){
        
            var salt          = crypto.randomBytes(64).toString('base64');
            var buf           = crypto.pbkdf2Sync(password,salt,iterations,64,'sha256');
            var hash          = buf.toString('base64');
            return {salt,hash};
            
        }//hash
        
        function verify(hash,salt,password){
        
            var result    = (hash==crypto.pbkdf2Sync(password,salt,iterations,64,'sha256').toString('base64'));
            return result;
            
        }//verify
        
        
        var html      = {};
        html.index    = `
              <style>
                    html{height:100%;font-family:arial;font-size:18px}
                    body{height:calc(100% - 16px);background:whitesmoke;display:flex;flex-direction:column;align-items:center}
                    button{padding:5px 10px;font-size:18px}
              </style>
              <h3>auto-fill</h3>
              <button onclick=window.location='login'>login</button>
        `;
        html.login    = `
              <style>
                    html{height:100%;font-family:arial;font-size:18px}
                    body{height:calc(100% - 16px);background:whitesmoke;display:flex;flex-direction:column;align-items:center}
                    #login-form{background:white;padding:20px;display:flex;flex-direction:column;gap:10px;border-radius:20px;
                                box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px}
                    #login-form #title{text-align:center;margin-bottom:20px;border-bottom:1px solid lightgray;padding-bottom:5px}
                    #login-form input{padding:5px 10px;font-size:18px}
                    #login-form label{margin-right:30px;width:100px;text-align:right;display:inline-block}
                    #login-form [type=submit]{margin-top:20px}
              </style>
              <h3>auto-fill test</h3>
              <form id=login-form action=login-user method=post>
                    <div id=title>login</div>
                    <div>
                          <label for=email>email</label><input name=email>
                    </div>
                    <div>
                          <label for=password>password</label><input name=password type=password>
                    </div>
                    <input type=submit value=login>
              </form>
        `;
        html['login-fail']    = `
              <style>
                    html{height:100%;font-family:arial;font-size:18px}
                    body{height:calc(100% - 16px);background:whitesmoke;display:flex;flex-direction:column;align-items:center}
                    button{padding:5px 10px;font-size:18px}
              </style>
              <h3 style=color:red>login failed, invalid username/password</h3>
              <button onclick=window.location='login'>login</button>
        `;
        html.user   = `
              <style>
                    html{height:100%;font-family:arial;font-size:18px}
                    body{height:calc(100% - 16px);background:whitesmoke;display:flex;flex-direction:column;align-items:center}
                    button{padding:5px 10px;font-size:18px}
              </style>
              <h3 style=color:green>user page</h3>
              <button onclick=window.location='logout'>logout</button>
        `;
        
        
