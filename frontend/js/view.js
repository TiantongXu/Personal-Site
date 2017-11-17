var view = (function(){
    "use strict";
    
    var view = {};

    var selectItem = function(page) {
    	$(".active").removeClass('active');
    	$('.' + page).addClass('active');
    }

    view.initiatePage = function(next) {
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
    };

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
                $(".container").empty();
                selectItem("admin");
                var container = document.getElementById('container');
                container.innerHTML = "";
                var doc = document.createElement('div');
                doc.className = "row align-items-center mainrow adminpage";
                doc.innerHTML = `<div class="col-lg-12 maintext">
    Admin Login
</div>`;
                var submitbutton = document.createElement('div');
                submitbutton.className = "col-lg-12 subtext";
                submitbutton.innerHTML = `<div class="col-lg-12 subtext">
    <button type="submit" class="btn">Login</button>
</div>`;
                submitbutton.onclick = function (e) {
                    console.log("finally works :D");
                };
                doc.append(submitbutton);
                container.prepend(doc);
                break;
        };
    };

    // document.getElementById("post_form").onsubmit = function (e) {
    //     e.preventDefault();
    //     console.log('click');
    //     }
    
    return view;
    
}());