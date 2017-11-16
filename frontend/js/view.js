var view = (function(){
    "use strict";
    
    var view = {};

    var selectItem = function(page) {
    	$(".active").removeClass('active');
    	$('.' + page).addClass('active');
    }

    view.initiatePage = function() {
        document.getElementById("about").onclick = function (e){
            e.preventDefault(e);
            selectItem("about");
            view.renderPage({detail: "about"});
        };
        document.getElementById("resume").onclick = function (e){
            e.preventDefault(e);
            selectItem("resume");
            view.renderPage({detail: "resume"});
        };
        document.getElementById("contact").onclick = function (e){
            e.preventDefault(e);
            view.renderPage({detail: "contact"});
        };
        document.getElementById("admin").onclick = function (e){
            e.preventDefault(e);
            selectItem("admin");
            view.renderPage({detail: "admin"});
        };
    }

    view.renderPage = function(e) {
    	switch (e.detail) {
	    	case "about":
	    		$(".container").load("./tmp/about.html");
                selectItem("about");
                break;
            case "resume":
                $(".container").load("./tmp/resume.html");
                selectItem("resume");
                break;
            case "contact":
                $(".container").load("./tmp/contact.html");
                selectItem("contact");
                break;
            case "admin":
                $(".container").load("./tmp/admin.html");
                selectItem("admin");
                break;
	    }
    }
    
    return view;
    
}());