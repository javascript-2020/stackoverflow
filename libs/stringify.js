import ify from 'https://cdn.jsdelivr.net/npm/string.ify/+esm';

export default function(v){

      var str   = ify(v);
      str       = str.replace('{','{\n\n ');
      str       = str.replace(/^([^:\n]*?):/gm, '$1  :');
      str       = str.replace('}','\n\n}');
      return str;
      
}//export
