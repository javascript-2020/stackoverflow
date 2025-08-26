
document.write('<script src="https://cdn.jsdelivr.net/npm/string.ify/build/string.ify.min.js"></script>');

function stringify(v){

      var str   = ify(v);
      str       = str.replace('{','{\n\n ');
      str       = str.replace(/^([^:\n]*?):/gm, '$1  :');
      str       = str.replace('}','\n\n}');
      return str;
      
}//stringify


