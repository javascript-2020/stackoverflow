


//args-find
//


        fn(true,'xyz',()=>'hello',99,101);
        
        function fn(a,b,c){
        
              var callback    = arg(arguments,'function');
              console.log(callback);
              
              var index       = arg(arguments,'number',1);
              console.log(index);
              
        }//fn
        
        
        function arg(args,type,index=0){
        
              var c   = 0;
              var n   = args.length;
              for(var i=0;i<n;i++){
              
                    if(typeof args[i]==type){
                          if(c==index){
                                return args[i];
                          }
                          c++;
                    }
                    
              }//for
              return null;
              
        }//arg






                                                                                console.clear();
        fn2(1,2,3);        //  {a: 1, b: 2, c: 3}
        fn2({a:99});       //  {a: 99}
        
        function fn2(a,b,c){
              
              var params    = parse(fn,[...arguments]);
              console.log('params',params);
              
        }//fn
        
        function parse(fn,args){
                                                                                console.log(arguments.callee.caller);
                                                                                console.log(arguments.callee.caller.arguments);
              fn            = fn.toString();
              var i1        = fn.indexOf('(');
              var i2        = fn.indexOf(')');
              var params    = fn.slice(i1+1,i2);
              var names     = params.split(',');
              
              var params;
              if(typeof args[0]!='object'){
                    params    = {};
                    names.forEach((name,i)=>params[name]=args[i]);
              }else{
                    params    = args[0];
              }
              return params;
              
        }//parse

