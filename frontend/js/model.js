var model = (function(){
    "use strict";
    
    var model = {};
    
    window.onload = function () {
    	var event = new CustomEvent('startApp', {detail: "about"});
  		document.dispatchEvent(event);
    };

    // model.addExperience = function (data, callback) {

    // };

    // var doAjax = function (method, url, body, json, callback){
    //     var xhttp = new XMLHttpRequest();
    //     xhttp.onreadystatechange = function(e){
    //         switch(this.readyState){
    //              case (XMLHttpRequest.DONE):
    //                 if (this.status === 200) {
    //                     if(json) return callback(null, JSON.parse(this.responseText));
    //                     return callback(null, this.responseText);
    //                 }else{
    //                     return callback(this.responseText, null);
    //                 }
    //         }
    //     };
    //     xhttp.open(method, url, true);
    //     if (json && body){
    //         xhttp.setRequestHeader('Content-Type', 'application/json');
    //         xhttp.send(JSON.stringify(body));  
    //     }else{
    //         xhttp.send(body);  
    //     }        
    // };

    model.signIn = function(e) {
    	e.preventDefault(e);
    	console.log("finally works");
    };

    return model;
    
}());