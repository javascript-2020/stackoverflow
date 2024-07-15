could come in handy Star Trek Iconic Sounds trekcore.com/audio

this is the one i was looking for TNG Chime trekcore.com/audio/doors/tng_chime_clean.mp3, ( i think anyway )

Audio Cutter mp3cut.net
MP3 Compressor freeconvert.com/mp3-compressor

```

var input         = document.createElement('input');
input.type        = 'file';
input.onchange    = change;
input.click();

async function change(){

      var buf     = await input.files[0].arrayBuffer();
      var bin     = '';
      var bytes   = new Uint8Array(buf);
      var len     = bytes.byteLength;
      for(var i=0;i<len;i++){
      
            bin  += String.fromCharCode(bytes[i]);
            
      }//for
      var b64     = window.btoa(bin);
      var size    = 150;
      var n       = Math.ceil(b64.length/size);
      var parts   = new Array(n);
      for(let i=0,o=0;i<n;++i,o+=size){
      
            parts[i]    = b64.substr(o,size);
            
      }//for
      var js    = 'var audio=\n';
      parts.forEach(str=>js  += "'"+str+"'   +\n");
      js    = js.slice(0,-5)+';';
      console.log(js);
  
}//change

```

```

var audio=
'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';

var chars   = atob(audio);
var type    = 'audio/mp3';
var size    = 512;
var parts   = [];

for(let offset=0;offset<chars.length;offset+=size){

      var slice   = chars.slice(offset,offset+size);
      var byte    = new Array(size);
      for(let i=0;i<size;i++){
      
            byte[i]   = slice.charCodeAt(i);
            
      }//for
  
      var arr   = new Uint8Array(byte);
      parts.push(arr);
      
}//for
  
var blob    = new Blob(parts,{type});
var url     = window.URL.createObjectURL(blob);
var audio   = new Audio(url);
audio.play();

```

