# stackoverflow-chat
this is what stackoverflow chat is missing

paste this into the console or dev tools snippet/scratchpad, bookmarklet or content script

```
{
        var youtube;
        document.documentElement.style.cssText    = 'width:100%;height:100%;';
        var par             = document.createElement('div');
        par.style.cssText   = 'position:fixed;left:0;top:0;width:100%;height:100%;z-index:-1';opacity:0.3;;
        document.body.append(par);
        var script      = document.createElement('script');
        script.src      = "https://www.youtube.com/iframe_api";
        document.head.appendChild(script);

        function onYouTubeIframeAPIReady(){
        
              youtube   = new YT.Player(par,{
                    width         : '100%',
                    height        : '100%',
                    videoId       : 'hrotHC9OPr4',
                    playerVars    : {
                          autoplay          : 1,
                          controls          : 1,
                          disablekb         : 1,
                          enablejsapi       : 1,
                          fs                : 0,
                          iv_load_policy    : 3,
                          loop              : 1,
                          modestbranding    : 1,
                          playsinline       : 1,
                          rel               : 0
                    },
                    events        : {
                          onReady         : ready,
                    }
              });
              console.log(youtube);
              
        }//onload
        
        function ready(event){
        
              var {w,h,scale}                 = resize();

              var iframe                      = youtube.g;    //  document.querySelector('iframe');
              iframe.style.width              = w+'px';
              iframe.style.height             = h+'px';
              iframe.style.transform          = scale;
              iframe.style.transformOrigin    = 'top left';

              youtube.unMute();
              youtube.setVolume(20);
              youtube.playVideo();
              
              play();
              
        }//ready
        
        function resize(){
        
              var aspect    = 16/9;
              var winw      = window.innerWidth;
              var winh      = window.innerHeight;
              
              var w         = winw;
              var h         = winw/aspect;
              var sf        = winh/h;
              var scale     = 'scaleY('+sf+')';
              var t         = sf*h;
              
              if(h>winh){
                    h       = winh;
                    w       = winh*aspect;
                    sf      = winw/w;
                    scale   = 'scaleX('+sf+')';
                    t       = sf*w;
              }
              
              return {w,h,scale};
              
        }//resize

        function play(){
        
              var btn=document.createElement('button');
              btn.style.cssText   = `
                    position:fixed;left:0px;right:0;top:20px;width:150px;
                    padding:10px;margin:auto;font-size:24px;z-index:999999;
                    border:3px solid rgb(252,15,192);border-radius:5px;
              `;
              btn.textContent     = 'play';
              btn.onclick         = e=>{
                                          youtube.playVideo();
                                          youtube.unMute();
                                          btn.remove();
                                    };
              document.body.append(btn);
              
        }//play
        
        var styletxt=`
              .mine .messages {
                  background-color    : rgba(251,242,217,0.6);
              }
              
              .messages {
                  background-color    : rgba(246,246,246,0.6);
              }
              
              .messages {
                  border-radius       : 6px;
                  border              : none;
                  padding             : 5px 5px 5px 0px;
                  float               : left;
                  word-wrap           : break-word;
                  width               : 87%;
                  color               : #222;
                  font-weight         : bold;
              }
        `;
        var style           = document.createElement('style');
        style.textContent   = styletxt;
        document.body.append(style);
       
}

/*
youtube.mute();
youtube.unMute();
youtube.setVolume(10);    //  0-100
youtube.playVideo();
youtube.stopVideo();
youtube.loadVideoById('VLfPUJCPDqY')    //  Cozy Cottage by the Sea
youtube.loadVideoById('QOf1Gf6FPGI')    //  Thunderstorm Rain on Tin Roof
youtube.loadVideoById('hrotHC9OPr4')    //  City Nights - Deep House Mix
youtube.loadVideoById('vfl5La6G9tQ')    //  Heavy Thunderstorm
youtube.loadVideoById('Mw9qiV7XlFs')    //  train ride switzerland
youtube.g.remove();
https://developers.google.com/youtube/iframe_api_reference
*/

```



