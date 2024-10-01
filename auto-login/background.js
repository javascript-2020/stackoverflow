
//  background.js

console.clear();
console.log('background.js');

(async()=>{


        if(typeof browser=='undefined'){
              browser   = chrome;
        }
        
        
        await browser.storage.local.clear();
        
        var data    = {
              localhost   : {
                    cssSelector   : {
                          form            : '#login-form',
                          email           : '[name=email]',
                          password        : '[name=password]',
                          submit          : '[type=submit]'
                    },
                    user    : {
                          email           : 'james@example.com',
                          password        : 'p455w0rd'
                    },
                    auto                  : false
              }
        };
        
        var init   = browser.storage.local.set({data});
        
        
        browser.runtime.onMessage.addListener((message,sender,sendResponse)=>{
        
              getdata();
              return true;
              
              async function getdata(){
                                                                                console.log('message',message);
                    await init;
                    var {data}    = await browser.storage.local.get(['data']);
                    var site      = data[message.hostname];
                    sendResponse(site);
                    
              }//getdata
              
        });//onmessage
        
        
        
        
        browser.tabs.onUpdated.addListener((tabId,info,tab)=>{
        
              if(tab.status!='complete')return;
              console.log(tab.url,tab);
              
        });//onupdated
        
        
        
})();


