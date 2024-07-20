```

        var tiny        = {};        
        tiny.encrypt    = (message,key)=>btoa([...message].reduce((a,c,i)=>a+tiny.xor(c,key,i),''));
        tiny.decrypt    = (encrypted,key)=>[...atob(encrypted)].reduce((a,e,i)=>a+tiny.xor(e,key,i),'');
        tiny.xor        = (c,key,i)=>tiny.char(tiny.code(c)^tiny.code(key[i%key.length]));
        tiny.code       = v=>v.charCodeAt(0);
        tiny.char       = v=>String.fromCharCode(v);        
        
        var encrypted   = tiny.encrypt('helloworld','sky')
        console.log(encrypted);      
        var decrypted   = tiny.decrypt(encrypted,'sky');
        console.log(decrypted);

```

