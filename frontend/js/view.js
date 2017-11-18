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

    view.renderPage = function (e) {
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
                view.renderAbout();
                break;
        };
    };

    var signinMessage = function (err) {
        if (err) {
            var e = document.getElementById("error");
            e.innerHTML = `<span class="alert alert-danger">${(err)}</span>`;
        }
        else {
            var e = document.getElementById("error");
            e.innerHTML = `<span class="alert alert-success">Signin success</span>`;
        }
    }

    view.renderAbout = function () {
        var container = document.getElementById('container');
        container.innerHTML = "";
        var doc = document.createElement('div');
        doc.className = "row align-items-center mainrow adminpage";
        doc.innerHTML = `<div class="error" id="error">
</div>
<div class="col-lg-12 maintext">
    Admin Login
</div>`;
        var innertext = document.createElement('div');
        innertext.className = "col-lg-12 subtext";
        var innerform = document.createElement('form');
        innerform.id = "signin";
        innerform.innerHTML = `
        <input type="text" name="username" id="username" class="form-control form_element" placeholder="Username"/>
        <br>
        <input type="password" name="password" id="password" class="form-control form_element" placeholder="Password"/>
        <br>
        <button type="submit" class="btn">Login</button>`;
        innerform.onsubmit = function (e) {
            e.preventDefault();
            var info = {};
            info.username = document.getElementById("username").value;
            info.password = document.getElementById("password").value;
            model.signIn(info, function (err, user) {
                if (err) return signinMessage(err);
            });
            signinMessage();
        }
        innertext.append(innerform);
        doc.append(innertext);
        container.prepend(doc);
    }
    
    return view;
    
}());