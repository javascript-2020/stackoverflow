
//  content-script : fill-form.js

console.clear();
console.log('content-script : fill-form.js');

        if(typeof browser=='undefined'){
              browser   = chrome;
        }
        
        
        var $   = (sel,root)=>(!root && (root=document),root.querySelector(sel));
        
        var hostname    = window.location.hostname;
        
        
        browser.runtime.sendMessage({hostname},function(data){
        
              var form    = $(data.cssSelector.form);
              $(data.cssSelector.email,form).value      = data.user.email;
              $(data.cssSelector.password,form).value   = data.user.password;
              if(data.auto){
                    $(data.cssSelector.submit,form).click();
              }
              
        });//sendMessage
        
        
        
        browser.runtime.onMessage.addListener((message,sender,sendResponse)=>{
                                                                                console.log('message',message);
        });
        
        
        
        
