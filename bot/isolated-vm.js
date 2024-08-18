

function isolated_vm(){

  var obj   = {};
  
  
        obj.execute=function(code,callback){
        
              var ivm                           = require('isolated-vm');
              var crypto                        = require('crypto');
              
              var timeout                       = 500;
              
              var REPLACERS   = {
                    NaN                         : crypto.randomBytes(16).toString('hex'),
                    Infinity                    : crypto.randomBytes(16).toString('hex'),
                    NegInfinity                 : crypto.randomBytes(16).toString('hex'),
                    undefined                   : crypto.randomBytes(16).toString('hex'),
              };
              
              
              var isolate                       = new ivm.Isolate({memoryLimit:8});
              var context                       = isolate.createContextSync();
              
              
              var jail                          = context.global;
              jail.setSync('global',jail.derefInto());
              jail.setSync('_done',new ivm.Reference((...args)=>{complete(...args)}));
              jail.setSync('_atob',str=>Buffer.from(str,'base64').toString());
              
              
              var compiled_sandbox_script       = isolate.compileScriptSync(`new ${sandboxed_script}`);
              compiled_sandbox_script.runSync(context,{timeout});
              
              
              var b64_code                      = Buffer.from(code).toString('base64');
              var b64_replacers                 = Buffer.from(JSON.stringify(REPLACERS)).toString('base64');
              var code_to_run                   = `runCode('${b64_code}','${b64_replacers}')`;
              
              var start                         = Date.now();
              
              try {
              
                    isolate.compileScriptSync(code_to_run).runSync(context,{timeout});
                    
              }//try
              
              catch(err){
              
                    var str       = Object.prototype.toString.call(err);
                    var result    = JSON.stringify(str);
                    var logged    = JSON.stringify([]);
                    var time      = Date.now();
                    complete(false,result,logged,start,time);
                    
              }//catch
              
              
              function complete(error,result,logged,startTime,endTime){
              
                    var result    = stringifyOutput(JSON.parse(result,reviver));
                    var logged    = stringifyOutput(JSON.parse(logged,reviver));
                    var time      = endTime - startTime;
                    
                    callback(error,result,logged,time);
                    
              }//complete
              
              
              function reviver(key,value){
              
                  switch (value){
                  
                      case REPLACERS.NaN            : return NaN;
                      case REPLACERS.Infinity       : return Infinity;
                      case REPLACERS.NegInfinity    : return -Infinity;
                      default                       : return value;
                      
                  }//switch
                  
              }//reviver
              
              function stringifyOutput(input){
              
                    var result    = getVal(input);
                    return result;
                    
                    function getVal(a){
                    
                          if(a===null){
                                return 'null';
                          }
                          
                          if(a===undefined || a===REPLACERS.undefined){
                                return 'undefined';
                          }
                          
                          if(typeof a.toJSON==='function'){
                                return a.toJSON();
                          }
                          
                          if(Array.isArray(a)){
                                return `[${a.map(b=>getVal(b)).join(', ')}]`;
                          }
                          
                          if(typeof a=='object'){
                                var fn    = ([key,value])=>`${key} : ${getVal(value)}`;
                                var arr   = Object.entries(a).map(fn);
                                var str   = arr.join(', ');
                                return `{ ${str} }`;
                          }
                          
                          if(typeof a=='number'){
                              if(Number.isNaN(a))return 'NaN';
                              if(!Number.isFinite(a)){
                                    var v   = a>0 ? 'Infinity' : '-Infinity';
                                    return v;
                              }
                              return a.toString();
                          }
                          
                          if(typeof a==='string'){
                                var str   = a.replace(/'/g,"\\'");
                                return `'${str}'`;
                          }
                          
                          return a.toString();
                          
                    }//getval
                    
              }//strigifyOutput
              
              
              function sandboxed_script() {
              
                                                                                //  security reasons, we don't want it in the global context
                    const done    = _done;
                    const atob    = _atob;
                    _done         = undefined;
                    _atob         = undefined;
                    
                    global.done = function (...args) {
                    
                          done.applyIgnored(undefined, args);
                          
                    }//done
                    
                    global.atob = function (...args) {
                    
                          return atob.apply(undefined,args,{result:{copy:true}});
                          
                    }//atob
                    
  //:
                                                                                //  most extra functions could be possibly unsafe
                    const whitelist   = {
                    
                          Array                     : 1,
                          Boolean                   : 1,
                          Date                      : 1,
                          Error                     : 1,
                          EvalError                 : 1,
                          Function                  : 1,
                          Infinity                  : 1,
                          JSON                      : 1,
                          Map                       : 1,
                          Math                      : 1,
                          NaN                       : 1,
                          Number                    : 1,
                          Object                    : 1,
                          Promise                   : 1,
                          Proxy                     : 1,
                          RangeError                : 1,
                          ReferenceError            : 1,
                          RegExp                    : 1,
                          Set                       : 1,
                          String                    : 1,
                          SyntaxError               : 1,
                          TypeError                 : 1,
                          URIError                  : 1,
                          WeakMap                   : 1,
                          WeakSet                   : 1,
                          atob                      : 1,
                          btoa                      : 1,
                          console                   : 1,
                          decodeURI                 : 1,
                          decodeURIComponent        : 1,
                          encodeURI                 : 1,
                          encodeURIComponent        : 1,
                          eval                      : 1,
                          isFinite                  : 1,
                          isNaN                     : 1,
                          parseFloat                : 1,
                          parseInt                  : 1,
                          
                                                                                //  typedarrays
                          ArrayBuffer               : 1,
                          Blob                      : 1,
                          Float32Array              : 1,
                          Float64Array              : 1,
                          Int8Array                 : 1,
                          Int16Array                : 1,
                          Int32Array                : 1,
                          Uint8Array                : 1,
                          Uint16Array               : 1,
                          Uint32Array               : 1,
                          Uint8ClampedArray         : 1,
                          
                    };
                    
                    
                    function clearObj(obj, prop) {
                    
                          try {
                          
                                var get   = ()=>{throw new ReferenceError(`${prop} is not defined`)};
                                Object.defineProperty(obj,prop,{get,configurable:false,enumerable:false});
                                
                          }//try
                          
                          catch(e){
                          
                                delete obj[prop];
                                if(obj[prop]!==undefined){
                                      obj[prop]   = null;
                                }
                                
                          }//catch
                          
                    }//clearObj
                    
                    
                    [Object.getPrototypeOf(global)].forEach(obj=>{
                    
                          Object.getOwnPropertyNames(obj).forEach(prop=>{
                          
                              if(whitelist.hasOwnProperty(prop))return;
                              if(prop==='hasOwnProperty')return;
                              clearObj(obj, prop);
                              
                          });
                          
                    });
                                                                                //  https://github.com/laverdet/isolated-vm/issues/107
                                                                                //  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/fill
                    Object.defineProperty(Array.prototype,'fill',{value});
                    function value(value){
                    
                              if(value>10000){
                                    throw new Error('Array size to big. Ran out of memory.');
                              }
                                                                                // Steps 1-2.
                              if(this==null){                                   //  == ?
                                    throw new TypeError('this is null or not defined');
                              }
                              
                              var O                 = Object(this);
                                                                                // Steps 3-5.
                              var len               = O.length>>>0;
                                                                                // Steps 6-7.
                              var start             = arguments[1];
                              var relativeStart     = start>>0;
                              
                                                                                // Step 8.
                              var m1                = Math.max(len+relativeStart,0)
                              var m2                = Math.min(relativeStart,len)
                              var k                 = relativeStart<0 ? m1 : m2;
                                                                                // Steps 9-10.
                              var end               = arguments[2];
                              var relativeEnd       = end===undefined ? len : end>>0;
                                                                                // Step 11.
                              var m1                = Math.max(len+relativeEnd,0);
                              var m2                = Math.min(relativeEnd,len);
                              var final             = relativeEnd<0 ? m1 : m2;
                                                                                // Step 12.
                              while(k<final){
                              
                                    O[k]    = value;
                                    k++;
                                    
                              }//while
                                                                                // Step 13.
                              return O;
                              
                    }//value
                    
  //:
  
                    const console     = {};
                    console._items    = [],
                    console.log       = function(...args){
                    
                          args    = args.map(v=>JSON.stringify(v));
                          console._items.push(...args);
                          
                    }//log
                    console.error = console.info = console.debug = console.log;
                    
  //:
  
                    async function exec(code){
                    
                          var result    = await eval(`undefined;${code}`);
                          return result;
                          
                    }//exec
                    
                    async function execIIFE(code) {
                    
                          var result    = await eval(`(()=>{${code}})()`);
                          return result;
                          
                    }//execIIFE
                    
                    async function execAsyncIIFE(code) {
                    
                          var result    = await eval(`(async()=>{return ${code}})()`);
                          return result;
                          
                    }//execAsyncIIFE
                    
                    async function execAsyncIIFENoReturn(code) {
                    
                          var result    = await eval(`(async()=>{${code}})()`);
                          return result;
                          
                    }//execAsyncIIFENoReturn
                    
  //:
  
                    global.runCode    = async function(base64EncodedCode,base64EncodedEscapes){
                    
                        const code        = global.atob(base64EncodedCode);
                        const REPLACERS   = JSON.parse(global.atob(base64EncodedEscapes));
                        
                        function replacer(key,value){
                        
                              if(typeof value=='number'){
                                    if(Number.isNaN(value)){
                                          return REPLACERS.NaN;
                                    }
                                    if(!Number.isFinite(value)){
                                          var result    = value>0 ? REPLACERS.Infinity : REPLACERS.NegInfinity;
                                          return result;
                                    }
                              }
                              
                              if(value===undefined){
                                    return REPLACERS.undefined;
                              }
                              
                              return value;
                              
                        }//replacer
                        
                        
                        var start;
                        var result;
                        var logged;
                        var end;
                        
                        try{
                        
                              start     = Date.now();
                              result    = await exec(code);
                              result    = JSON.stringify(result,replacer);
                              logged    = JSON.stringify(console._items,replacer);
                              end       = Date.now();
                              
                              global.done(false,result,logged,start,end);
                              
                        }//try
                        
                        catch(err){
                        
                            try{
                            
                                if( err.message!=='Illegal return statement' &&
                                    err.message!=='await is only valid in async function' ){
                                          throw err;
                                }
                                
                                if(err.message==='Illegal return statement'){
                                
                                      start     = Date.now();
                                      result    = await execIIFE(code);
                                      result    = JSON.stringify(result,replacer);
                                      logged    = JSON.stringify(console._items,replacer);
                                      end       = Date.now();
                                      
                                      global.done(false,result,logged,start,end);
                                      
                                }else{
                                
                                      try{
                                      
                                          start     = Date.now();
                                          result    = await execAsyncIIFE(code);
                                          result    = JSON.stringify(result,replacer);
                                          logged    = JSON.stringify(console._items,replacer);
                                          end       = Date.now();
                                          
                                          global.done(false,result,logged,start,end);
                                          
                                      }//try
                                      
                                      catch(err){
                                      
                                          if(!err.message || !err.message.startsWith('Unexpected token')){
                                                throw err;
                                          }
                                          
                                          start     = Date.now();
                                          result    = await execAsyncIIFENoReturn(code);
                                          result    = JSON.stringify(result,replacer);
                                          logged    = JSON.stringify(console._items,replacer);
                                          end       = Date.now();
                                          
                                          global.done(false,result,logged,start,end);
                                          
                                      }//catch
                                      
                                }
                                
                            }//try
                            
                            catch(err){
                            
                                  result    = JSON.stringify(err.toString(),replacer);
                                  logged    = JSON.stringify(console._items,replacer);
                                  end       = Date.now();
                                  
                                  global.done(false,result,logged,start,end);   //  true
                                  
                            }//catch
                            
                        }//catch
                        
                    }//runcode
                    
              }//sandbox_script
              
        }//execute
        
  //:
  
        obj.install=async function(){
        
              var fs    = require('fs');
              
              if(fs.existsSync('node_modules/isolated-vm')){
                                                                              console.log('isolated-vm found');
              }else{
                    var cmd   = process.platform.startsWith('win') ? 'npm.cmd' : 'npm';
                    await exec(`${cmd} init -y`);
                    await exec(`${cmd} i isolated-vm`);
              }
              
              obj.install.complete    = true;
              
              
              function exec(cmd) {
                                                                                console.log('\n',cmd,process.cwd(),'\n');
                    var cp      = require('child_process');
                    
                    var args    = cmd.split(' ');
                    cmd         = args.shift();
                    
                    var resolve,promise=new Promise(res=>resolve=res);
                    
                    var child   = cp.spawn(cmd,args,{shell:true});
                    child.stdout.pipe(process.stdout);
                    child.stderr.pipe(process.stderr);
                    child.on('exit',code=>{
                    
                          code!=0 && process.exit();
                          resolve();
                          
                    });
                    
                    return promise;
                    
              }//exec
              
              
              
        }//install
        
        
  return obj;
  
//isolated_vm
}




