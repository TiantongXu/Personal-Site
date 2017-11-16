var model = (function(){
    "use strict";
    
    var model = {};
    
    window.onload = function(){
    	var event = new CustomEvent('startApp', {detail: "about"});
  		document.dispatchEvent(event);
    };

    return model;
    
}());