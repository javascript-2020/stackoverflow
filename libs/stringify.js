import ify from 'https://cdn.jsdelivr.net/npm/string.ify/+esm';

export funtion(v){

      var str   = ify(desc);
      str       = str.replace('{','{\n\n ');
      str       = str.replace(/^([^:\n]*?):/gm, '$1  :');
      str       = str.replace('}','\n\n}');
      return str;
      
}//export
