        

(async()=>{        
console.clear();


//data source

    var i=0;
    var arr=[1,2,3];
    
    setTimeout(fn,1000);
    
    function fn(){
    
          if(i==3){
                end();
          }else{
                read(arr[i++]);
                setTimeout(fn,1000);
          }
          
    }//fn
    

    
    var iterator    = asyncIterator();
    function asyncIterator(){
    
          var iterator        = ()=>{return {next:()=>new Promise(res=>iterator.resolve=res)}};
          iterator.resolve    = null;
          return iterator;
          
    }//asynciterator



    function read(value){
    
          iterator.resolve({value});

    }//read
    
    function end(){
    
          iterator.resolve({done:true});
          
    }//end

    



    var a = {};
    a[Symbol.asyncIterator]   = iterator;
          

    for await(let x of a){
    
        console.log(x)
        
    }//for

    

})();


