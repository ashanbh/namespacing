
 var myFunction = function(){
     myVar = 1000;
     write("myFunction was Called");
 }

 var myHoistyFunction = function(){
     write("myHoistyFunction was Called", myVar2);
     var myVar2 = 1000;
 }

 var myErroneousFunction = function(){
     try {
         write("myHoistyFunction was Called", myVar3);
     }catch(e){
         write("Error in myErroneousFunction:", e.message);
     }
 }