
        var file            = '';
        var dir             = '/work/';
        var exclude         = ['*log*','*work/vm/*','*settlers*'];
        
        var dates           = true;
        var from            = '2024-08-17T00:00:00Z';
        var to              = '2024-08-21T23:59:59Z';
        
        var fs              = require('fs');
        var path            = require('path');
        
        dir                 = path.resolve(dir);
        dir                += '/';
        if(dates){
              from          = new Date(from);
              to            = new Date(to);
              if(from>to){
                    var t   = to;
                    to      = from;
                    from    = t;
              }
        }
        if(!file){
              file          = '*';
        }
                                                                                console.log();
                                                                                console.log('find-file');
                                                                                console.log('   file  :',file);
                                                                                console.log('    dir  :',dir);
                                                                                console.log('exclude  :',exclude.join(', '));
                                                                                console.log('   from  :',parse(from));
                                                                                console.log('     to  :',parse(to));
        var results         = [];
        var list            = [dir];
        
        while(list.length){
        
              var dir     = list.shift();
              var items   = fs.readdirSync(dir);
              items.forEach(name=>{
              
                    var abs     = dir+name;
                    var stat    = fs.statSync(abs);
                    if(stat.isDirectory()){
                          abs  += '/';
                    }
                    
                    if(exclude.find(file=>wildcard(abs,file))){
                          return;
                    }
                    
                    if(stat.isDirectory()){
                    
                          list.push(abs);
                          return;
                    }
                    if(stat.isFile()){
                          if(wildcard(name,file)){
                                var time   = new Date(stat.mtime);
                                if(dates){
                                      if(!(time>=from && time<=to))return;
                                }
                                time      = time.toISOString();
                                var i     = time.indexOf('T');
                                var str   = time.slice(0,i);
                                if(!results[str]){
                                      results[str]   = [];
                                }
                                results[str].push(abs);
                          }
                    }
                    
              });
              
        }//while
        
        var days    = Object.keys(results);
        days.sort();
        if(days.length==0){
              console.log('no files found');
        }
        days.forEach(day=>{
                                                                                console.log();
                                                                                console.log(day);
              results[day].forEach(file=>{
                                                                                console.log(file);
              });
        });
                                                                                console.log('\n');
                                                                                
        function wildcard(search,pattern,mode){
        
              var re      = '';
              var esc     = '.+^${}()|[]\\';
              var n       = pattern.length;
              for(var i=0;i<n;i++){
              
                    var c   = pattern[i];
                    
                    if(esc.indexOf(c)!=-1){
                          re   += '\\'+c;
                    }
                    else if(c=='?'){
                          re   += '.';
                    }
                    else if(c=='*'){
                          while(pattern[i+1]=='*')i++;
                          re   += '.*';
                    }
                    else if(c=='~'){
                          var c1    = pattern[i+1];
                          if(c1=='*' || c1=='?' || c1=='~'){
                                if(c1=='*' || c1=='?'){
                                      re   += '\\';
                                }
                                re   += c1;
                                i++;
                          }else{
                                re   += c;
                          }
                    }
                    else{
                          re   += c;
                    }
                    
              }//for
              
              if(!mode || mode=='starts'){
                    re    = '^'+re
              }
              if(!mode || mode=='ends'){
                    re    = re+'$';
              }
              var regex   = new RegExp(re);
              
              var result    = regex.test(search);
              return result;
              
        }//wildcard
        
        function parse(date){
        
              var str     = date.toISOString();
              var i       = str.indexOf('T');
              var date    = str.slice(0,i);
              var time    = str.slice(i+1,-1);
              str         = date+'  '+time;
              return str;
              
        }//parse
        
