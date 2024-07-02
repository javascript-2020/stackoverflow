        function popupmod(){
        
          var obj   = {};
          
  //:
  
  
              var list      = [];
              list.find     = (v,rtype)=>find(list,v,rtype);
              
              
              var stack     = [];
              stack.find    = (v,rtype)=>find(stack,v,rtype);
              
              
              function find(list,v,rtype){
              
                    var n   = list.length;
                    for(var i=0;i<n;i++){
                    
                          var o   = list[i];
                          
                          var f   = false;
                          
                          if(v===i)f    = true;
                          if(v===o.node)f   = true;
                          
                          if(f){
                                switch(rtype){
                                  case 'index'      : return i;
                                  case 'node'       : return o.node;
                                  case 'callback'   : return o.callback;
                                }
                                return o;
                          }
                          
                    }//for
                    return null;
                    
              }//find
              
              
              var state         = {};
              
              state.cur         = null;
              state.prev        = null;
              
              state.opt         = null;
              state.select      = {};
              state.prev_opt    = {};
              
              
              var defz          = 12;
              
              
              var get           = {};
              
  //:
  
              obj.import=function(str){
              
                    state   = JSON.parse(str);
                    
              }//import
              
              
              obj.export=function(){
              
                    var str   = JSON.stringify(state);
                    return str;
                    
              }//export
              
  //:
  
              obj.click=function(node,drag=true,center=true,callback_fns){
              
                    add(node,drag,center,callback_fns);
                    
                    return click;
                    
                    
                    function click(e){
                    
                          open(node);
                          
                    }//click
                    
              }//click
              
  //:
  
              obj.add=function(node,drag='both',center=true,callback){return add(node,drag,center,callback)}
              
              function add(node,drag='both',center=true,callback){
                                                                                //console.log('add');
                    list.push({node,callback});
                    add.node(node,drag,center);
                    
              }//add
              
              
              obj.add.stack=function(node,drag='both',center=true,callback){return add.stack(node,drag,center,callback)}
              
              add.stack=function(node,drag,center,callback){
              
                    var cur                   = get.cur('node');
                    state.prev_opt[cur.id]    = state.opt;
                    
                    stack.push({node,callback});
                    add.node(node,drag,center);
                    
                    show(node);
                    
              }//add.stack
              
              
              add.node=function(node,drag,center){
              
                    node.style.zIndex   = defz;
                    node.tabIndex       = -1;
/*
                    if(drag){
                          $.drag(node,null,drag);
                    }
                    if(center){
                          $.center.width(node);
                    }
*/
                    var timer;
                    node.addEventListener('focusout',focusout);
                    node.onmouseenter   = e=>clearTimeout(timer);
                    node.onmouseleave   = e=>{
                    
                          timer    = setTimeout(fn,500);
                          
                          function fn(){
                                                                                //console.log('mouseleave',node);
                                var cur       = get.cur('node');
                                                                                //console.log('cur',cur);
                                if(cur!==node){
                                                                                //console.log('cur');
                                      return;
                                }
                                
                                if(stack.length){
                                      stack.pop();
                                      hide(node);
                                      cur   = get.cur('node');
                                      show(cur);
                                      return;
                                }
                                close();
                                
                          }//fn
                          
                    }//ml
                    
                    
                    var opts    = get.opts(node);
                    
                    opts.forEach((opt,i)=>{
                    
                          opt.onclick         = e=>{
                          
                                                      if(state.opt===i){
                                                            state.select[node.id]   = !state.select[node.id];
                                                      }else{
                                                            if(state.opt!==null){
                                                                  var prev                = opts[state.opt];
                                                                  prev.style.background   = '';
                                                            }
                                                            state.select[node.id]   = true;
                                                      }
                                                      opt.style.background    = 'lightyellow';
                                                      state.opt               = i;
                                                      
                                                      callback('opt',opt);
                                                      
                                                }//onclick
                                                
                          opt.onmouseenter    = e=>{
                          
                                                      if(state.select[node.id]){
                                                            return;
                                                      }
                                                      if(state.opt!==null){
                                                            var prev                = opts[state.opt];
                                                            prev.style.background   = '';
                                                      }
                                                      
                                                      opt.style.background    = 'lightyellow';
                                                      state.opt               = i;
                                                      
                                              }//mouseenter
                                              
                          opt.onmouseleave    = e=>{
                          
                                                      if(state.select[node.id]){
                                                            return;
                                                      }
                                                      opt.style.background   = '';
                                                      
                                                }//onmouseleave
                                                
                    });
                    
              }//add.node
              
  //:
  
              obj.open=function(node){return open()}
              
              function open(node){
                                                                                //console.log('open');
                    if(state.cur!==null){
                          close();
                    }
                    
                    var index;
                    if(!node){
                          if(state.prev===null){
                                if(list.length==0){
                                      return;
                                }
                                index   = 0;
                          }else{
                                index   = state.prev;
                          }
                          node    = list.find(index,'node');
                    }else{
                          index   = list.find(node,'index');
                    }
                    
                    state.cur   = index;
                    show(node);
                    
                    keydown.add(kd);
                    
              }//open
              
              
              function close(){
                                                                                //console.log('close');
                    keydown.rem(kd);
                    
                    if(state.cur===null){
                          return;
                    }
                    
                    var node      = list.find(state.cur,'node');
                    
                    var n   = stack.length;
                    for(var i=n-1;i>=0;i--){
                    
                          var o   = stack.pop();
                          hide(o.node);
                          node    = get.cur('node');
                          show(node);
                          
                    }//for
                    
                    state.prev    = state.cur;
                    state.cur     = null;
                    hide(node);
                    
              }//close
              
  //:
  
              function show(node){
                                                                                //console.log('show',node.id);
                    state.opt   = null;
                    
                    var opts    = get.opts(node);
                    if(opts.length){
                          state.opt               = state.prev_opt[node.id]||0;
                          var opt                 = opts[state.opt];
                          opt.style.background    = 'lightyellow';
                    }
                    
                    callback('show');
                    
                    $.show(node);
                    node.focus();
                    
              }//show
              
  //:
  
              function hide(node){
                                                                              //console.log('hide',node.id);
                    state.prev_opt[node.id]       = state.opt;
                    if(typeof state.opt=='number'){
                          var opts                = get.opts(node);
                          var opt                 = opts[state.opt];
                          opt.style.background    = '';
                          state.opt               = null;
                    }
                    
                    callback('hide');
                    $.hide(node);
                    
              }//hide
              
  //:
  
              function kd(e){
              
                    var node    = get.cur('node');
                    var opts    = get.opts(node);
                    
                    if(e.key=='ArrowDown'){
                    
                          if(opts.length==0)return;
                          
                          if(typeof state.opt=='number'){
                                if(state.opt===opts.length-1){
                                      return;
                                }
                                var opt                 = opts[state.opt];
                                opt.style.background    = '';
                                state.opt++;
                          }else{
                                state.opt   = 0;
                          }
                          var opt                 = opts[state.opt];
                          opt.style.background    = 'lightyellow';
                          state.select[node.id]   = false;
                          
                    }//arrowdown
                    
                    if(e.key=='ArrowUp'){
                    
                          if(opts.length==0)return;
                          
                          if(typeof state.opt=='number'){
                                if(state.opt==0){
                                      return;
                                }
                                var opt   = opts[state.opt];
                                opt.style.background    = '';
                                state.opt--;
                          }else{
                                state.opt   = opts.length-1;
                          }
                          var opt                 = opts[state.opt];
                          opt.style.background    = 'lightyellow';
                          state.select[node.id]   = false;
                          
                    }//arrowup
                    
                    if(e.key=='Enter'){
                    
                          if(typeof state.opt!='number'){
                                return;
                          }
                          state.select[node.id]   = true;   //!state.select[node.id];
                          var opt                 = opts[state.opt];
                          callback('opt',opt);
                          
                    }//enter
                    
                    if(e.key=='Escape'){
                    
                          if(stack.length){
                                stack.pop();
                                hide(node);
                                node    = get.cur('node');
                                show(node);
                                return;
                          }
                          close();
                          
                    }//escape
                    
                    if(e.key=='ArrowLeft'){
                    
                          if(stack.length){
                                return;
                          }
                          var cur       = state.cur;
                          hide(node);
                          cur--;
                          if(cur<0){
                                cur   = list.length-1;
                          }
                          state.cur   = cur;
                          node        = list.find(cur,'node');
                          show(node);
                          
                    }//arrowleft
                    
                    
                    if(e.key=='ArrowRight'){
                    
                          if(stack.length){
                                return;
                          }
                          var cur     = state.cur;
                          hide(node);
                          cur++;
                          if(cur==list.length){
                                cur   = 0;
                          }
                          state.cur   = cur;
                          node        = list.find(cur,'node');
                          show(node);
                          
                    }//arrowright
                    
              }//kd
              
              
              function focusout(e){
                                                                                //console.log('onfocusout');
                    var focus   = e.relatedTarget;
                                                                                //console.log(focus);
                    if(chk(focus)){
                                                                                //console.log('list');
                          return;
                    }
                    close();
                    
                    
                    function chk(){
                    
                          var n   = list.length;
                          for(var i=0;i<n;i++){
                          
                                var o    = list[i];
                                if($.is.parent(o.node,focus)){
                                                                                //console.log('list',o.node);
                                      return true;
                                }
                                
                          }//for
                          
                          var n   = stack.length;
                          for(var i=0;i<n;i++){
                          
                                var o   = stack[i];
                                if($.is.parent(o.node,focus)){
                                                                                //console.log('stack',o.node);
                                      return true;
                                }
                                
                          }//for
                          
                          return false;
                          
                    }//chk
                    
              }//onfocusout
              
  //:
  
              function callback(type,arg0){
              
                    var callback    = get.cur('callback');
                    if(typeof callback!='function'){
                          return;
                    }
                    callback.apply(null,arguments);
                    
              }//callback
              
  //:
  
              get.cur=function(rtype){
              
                    var cur   = list.find(state.cur,rtype);
                    if(stack.length){
                          cur   = stack.at(-1)[rtype];
                    }
                    return cur;
                    
              }//cur
              
              
              get.opts=function(node){
              
                    var list    = [...node.childNodes].filter(node=>{
                    
                          if(node.nodeType==Node.ELEMENT_NODE){
                                if(node.classList.contains('popup-opt')){
                                      return true;
                                }
                          }
                          
                    });
                    return list;
                    
              }//opts
              
              
          return obj;
          
        }//popupmod
